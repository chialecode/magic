import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import GithubSlugger from 'github-slugger';

const ignored = new Set(['.git', 'node_modules', '.local', 'dist', 'coverage', 'build', 'target', '.venv']);
const markdown = new MarkdownIt({ html: true });
const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));

export function filesUnder(root) {
  const files = [];
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (ignored.has(entry.name)) continue;
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(absolute);
      else if (entry.isFile()) files.push(path.relative(root, absolute).split(path.sep).join('/'));
    }
  }
  visit(root);
  return files.sort();
}

function inspectMarkdown(source) {
  const tokens = markdown.parse(source, {});
  const slugger = new GithubSlugger();
  const anchors = new Set();
  const links = [];
  for (let index = 0; index < tokens.length; index += 1) {
    if (tokens[index].type === 'heading_open') {
      const inline = tokens[index + 1];
      const title = (inline.children ?? [])
        .filter((token) => token.type !== 'html_inline')
        .map((token) => token.content)
        .join('');
      anchors.add(slugger.slug(title));
    }
  }
  function visit(token) {
    if (token.type === 'link_open') links.push(token.attrGet('href'));
    if (token.type === 'image') links.push(token.attrGet('src'));
    if (token.type === 'html_inline' || token.type === 'html_block') {
      for (const match of token.content.matchAll(/\bid=["']([^"']+)["']/g)) anchors.add(match[1]);
    }
    for (const child of token.children ?? []) visit(child);
  }
  tokens.forEach(visit);
  return { anchors, links };
}

export function checkDocuments(inputRoot) {
  const root = path.resolve(inputRoot);
  const errors = [];
  const documents = new Map();
  const markdownFiles = filesUnder(root).filter((file) => file.endsWith('.md'));
  for (const file of markdownFiles) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    if (source.includes('\uFFFD')) errors.push(`${file}: invalid replacement character`);
    documents.set(file, inspectMarkdown(source));
  }

  const registryPath = path.join(root, 'docs/governance/document-registry.json');
  let registry;
  try {
    registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    if (!Array.isArray(registry.documents)) throw new Error('documents must be an array');
  } catch {
    return [...errors, 'docs/governance/document-registry.json: missing or invalid registry'];
  }
  const registered = new Set();
  for (const entry of registry.documents) {
    if (!entry || typeof entry !== 'object') {
      errors.push('registry: invalid document entry');
      continue;
    }
    if (registered.has(entry.path)) errors.push(`registry: duplicate ${entry.path}`);
    registered.add(entry.path);
    if (!documents.has(entry.path)) errors.push(`registry: document not found ${entry.path}`);
    if (!['active', 'draft', 'reference', 'superseded'].includes(entry.status)) {
      errors.push(`registry: invalid status for ${entry.path}`);
    }
    if (!entry.kind || !entry.scope || !/^\d{4}-\d{2}-\d{2}$/.test(entry.reviewed ?? '')) {
      errors.push(`registry: missing metadata for ${entry.path}`);
    }
    if (entry.status === 'superseded' && !documents.has(entry.supersededBy)) {
      errors.push(`registry: missing replacement for ${entry.path}`);
    }
  }
  for (const file of markdownFiles) {
    if (!registered.has(file)) errors.push(`registry: unregistered ${file}`);
  }

  for (const [file, document] of documents) {
    for (const href of document.links) {
      if (!href || /^(https?:|mailto:|tel:)/i.test(href)) continue;
      if (/^(?:[a-z][a-z\d+.-]*:|[\\/])/i.test(href)) {
        errors.push(`${file}: non-portable local link`);
        continue;
      }
      let decoded;
      try { decoded = decodeURIComponent(href); }
      catch { errors.push(`${file}: invalid link encoding`); continue; }
      const hashIndex = decoded.indexOf('#');
      const fragment = hashIndex < 0 ? '' : decoded.slice(hashIndex + 1);
      const target = (hashIndex < 0 ? decoded : decoded.slice(0, hashIndex)).split('?')[0];
      const absolute = target ? path.resolve(root, path.dirname(file), target) : path.join(root, file);
      const relative = path.relative(root, absolute);
      if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
        errors.push(`${file}: link escapes repository`);
        continue;
      }
      if (!fs.existsSync(absolute)) {
        errors.push(`${file}: missing target ${target}`);
        continue;
      }
      const realRelative = path.relative(root, fs.realpathSync(absolute));
      if (realRelative === '..' || realRelative.startsWith(`..${path.sep}`) || path.isAbsolute(realRelative)) {
        errors.push(`${file}: link resolves outside repository`);
        continue;
      }
      const targetDocument = documents.get(relative.split(path.sep).join('/'));
      if (fragment && targetDocument && !targetDocument.anchors.has(fragment)) {
        errors.push(`${file}: missing anchor ${target}#${fragment}`);
      }
    }
  }
  return errors;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const errors = checkDocuments(process.argv[2] ?? repositoryRoot);
  if (errors.length) {
    errors.forEach((error) => process.stderr.write(`${error}\n`));
    process.exitCode = 1;
  } else {
    process.stdout.write('Document registry and local links passed.\n');
  }
}
