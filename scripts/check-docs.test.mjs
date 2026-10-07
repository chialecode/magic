import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { checkDocuments } from './check-docs.mjs';
import { checkWorkflow, checkYaml, publicationIssues } from './check-config.mjs';

function fixture(t, documents) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'magic-docs-test-'));
  t.after(() => {
    const absolute = path.resolve(root);
    assert.equal(path.dirname(absolute), path.resolve(os.tmpdir()));
    assert.ok(path.basename(absolute).startsWith('magic-docs-test-'));
    fs.rmSync(absolute, { recursive: true, force: true });
  });
  for (const [file, content] of Object.entries(documents)) {
    const absolute = path.join(root, file);
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    fs.writeFileSync(absolute, content);
  }
  fs.mkdirSync(path.join(root, 'docs/governance'), { recursive: true });
  fs.writeFileSync(path.join(root, 'docs/governance/document-registry.json'), JSON.stringify({
    documents: Object.keys(documents).map((file) => ({
      path: file, kind: 'reference', status: 'active', scope: 'Test fixture', reviewed: '2026-10-07',
    })),
  }));
  return root;
}

test('accepts reference links, Chinese anchors and duplicate heading suffixes; ignores code examples', (t) => {
  const root = fixture(t, {
    'README.md': '# Root\n\n[目标][doc]\n\n[doc]: docs/page.md#中文标题-1\n\n```md\n[not a link](missing.md)\n```\n',
    'docs/page.md': '# Page\n\n## 中文标题\n\n## 中文标题\n',
  });
  assert.deepEqual(checkDocuments(root), []);
});

test('rejects a missing file and produces a failing CLI exit code', (t) => {
  const root = fixture(t, { 'README.md': '# Root\n\n[missing](missing.md)\n' });
  assert.ok(checkDocuments(root).some((error) => error.includes('missing target')));
  const result = spawnSync(process.execPath, [fileURLToPath(new URL('./check-docs.mjs', import.meta.url)), root]);
  assert.equal(result.status, 1);
});

test('rejects missing anchors', (t) => {
  const root = fixture(t, { 'README.md': '# Root\n\n[bad](#absent)\n' });
  assert.ok(checkDocuments(root).some((error) => error.includes('missing anchor')));
});

test('rejects paths escaping the repository', (t) => {
  const root = fixture(t, { 'README.md': '# Root\n\n[bad](../outside.md)\n' });
  assert.ok(checkDocuments(root).some((error) => error.includes('escapes repository')));
});

test('rejects unregistered documents and duplicate registry entries', (t) => {
  const root = fixture(t, { 'README.md': '# Root\n' });
  fs.writeFileSync(path.join(root, 'new.md'), '# New\n');
  const registryPath = path.join(root, 'docs/governance/document-registry.json');
  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  registry.documents.push(registry.documents[0]);
  fs.writeFileSync(registryPath, JSON.stringify(registry));
  const errors = checkDocuments(root);
  assert.ok(errors.some((error) => error.includes('unregistered new.md')));
  assert.ok(errors.some((error) => error.includes('duplicate README.md')));
});

test('required-check wiring accepts a pinned read-only PR job and rejects missing jobs and path filters', () => {
  const workflow = {
    on: { pull_request: { branches: ['main'] } },
    permissions: { contents: 'read' },
    jobs: { quality: { name: 'repository-quality', steps: [{ uses: `actions/checkout@${'a'.repeat(40)}` }] } },
  };
  const ruleset = {
    bypass_actors: [],
    rules: [{ type: 'required_status_checks', parameters: {
      required_status_checks: [{ context: 'repository-quality', integration_id: 15368 }],
    } }],
  };
  assert.deepEqual(checkWorkflow(workflow, ruleset), []);
  workflow.on.pull_request.paths = ['docs/**'];
  workflow.jobs.quality.name = 'renamed';
  const errors = checkWorkflow(workflow, ruleset);
  assert.ok(errors.some((error) => error.includes('path filters')));
  assert.ok(errors.some((error) => error.includes('missing workflow job')));
});

test('limited publication checks reject representative secrets and personal paths without echoing them', () => {
  const samples = ['C:' + '/Users/' + 'example/private.txt', 'ghp' + '_' + 'a'.repeat(36), ['-----BEGIN', 'PRIVATE KEY-----'].join(' ')];
  for (const source of samples) {
    const errors = publicationIssues(source);
    assert.ok(errors.length > 0);
    assert.ok(errors.every((error) => !error.includes(source)));
  }
  assert.deepEqual(publicationIssues('docs/README.md and PLACEHOLDER_TOKEN'), []);
});

test('supports the multi-document pnpm lockfile while rejecting duplicate keys and multi-document workflows', () => {
  const source = '---\nlockfileVersion: 9\n---\nimporters: {}\n';
  assert.deepEqual(checkYaml(source, true), []);
  assert.ok(checkYaml(source).length > 0);
  assert.ok(checkYaml('key: one\nkey: two\n', true).length > 0);
});

test('the actual markdownlint CLI rejects malformed headings', (t) => {
  const root = fixture(t, { 'README.md': '#MissingSpace\n' });
  const cli = fileURLToPath(new URL('../node_modules/markdownlint-cli2/markdownlint-cli2-bin.mjs', import.meta.url));
  const result = spawnSync(process.execPath, [cli, 'README.md'], { cwd: root });
  assert.equal(result.status, 1);
  assert.match(Buffer.concat([result.stdout, result.stderr]).toString(), /MD018/);
});
