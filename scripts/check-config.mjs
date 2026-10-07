import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, parseAllDocuments } from 'yaml';
import { filesUnder } from './check-docs.mjs';

export function checkYaml(source, allowMultiple = false) {
  const documents = parseAllDocuments(source, { uniqueKeys: true });
  const errors = documents.flatMap((document) => document.errors.map(() => 'invalid YAML document'));
  if (!allowMultiple && documents.length !== 1) errors.push('expected one YAML document');
  return errors;
}

export function checkWorkflow(workflow, ruleset) {
  const errors = [];
  const required = ruleset.rules.find((rule) => rule.type === 'required_status_checks');
  const jobNames = new Set(Object.entries(workflow.jobs ?? {}).map(([id, job]) => job.name ?? id));
  for (const check of required?.parameters?.required_status_checks ?? []) {
    if (!jobNames.has(check.context)) errors.push(`ruleset: missing workflow job ${check.context}`);
    if (check.integration_id !== 15368) errors.push('ruleset: required check must use GitHub Actions App');
  }
  const pullRequest = workflow.on?.pull_request;
  if (!pullRequest || !pullRequest.branches?.includes('main')) errors.push('workflow: main PR trigger is required');
  if (pullRequest?.paths || pullRequest?.['paths-ignore']) errors.push('workflow: required job must not use path filters');
  if (workflow.on?.pull_request_target !== undefined) errors.push('workflow: privileged PR trigger is not allowed');
  if (workflow.permissions?.contents !== 'read') errors.push('workflow: contents must be read-only');
  for (const job of Object.values(workflow.jobs ?? {})) {
    for (const step of job.steps ?? []) {
      if (step.uses && !/^[\w.-]+\/[\w./-]+@[a-f\d]{40}$/.test(step.uses)) {
        errors.push('workflow: remote actions must be pinned to a full SHA');
      }
    }
  }
  if (ruleset.bypass_actors?.length) errors.push('ruleset: permanent bypass actors are not allowed');
  return errors;
}

export function publicationIssues(source) {
  const errors = [];
  if (/[A-Za-z]:[\\/](?:Users|Code)[\\/]/i.test(source)) errors.push('personal absolute path');
  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(source)) errors.push('private key');
  if (/(?:gh[pousr]_|github_pat_)[A-Za-z\d_]{30,}/.test(source)) errors.push('GitHub credential');
  return errors;
}

export function checkConfiguration(root) {
  const errors = [];
  for (const file of filesUnder(root)) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    if (/\.(json|ya?ml)$/.test(file)) {
      try {
        if (file.endsWith('.json')) JSON.parse(source);
        else if (checkYaml(source, file === 'pnpm-lock.yaml').length) throw new Error('invalid YAML');
      }
      catch { errors.push(`${file}: invalid JSON or YAML`); }
    }
    for (const issue of publicationIssues(source)) errors.push(`${file}: ${issue}`);
  }
  try {
    const workflow = parse(fs.readFileSync(path.join(root, '.github/workflows/ci.yml'), 'utf8'));
    const ruleset = JSON.parse(fs.readFileSync(path.join(root, '.github/rulesets/main.json'), 'utf8'));
    errors.push(...checkWorkflow(workflow, ruleset));
    const book = parse(fs.readFileSync(path.join(root, '.gitbook.yaml'), 'utf8'));
    for (const target of Object.values(book.structure ?? {})) {
      if (!fs.existsSync(path.resolve(root, book.root, target))) errors.push('GitBook: missing navigation target');
    }
    const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
    const pnpmVersion = manifest.packageManager.split('@')[1];
    const steps = Object.values(workflow.jobs).flatMap((job) => job.steps ?? []);
    if (!steps.some((step) => step.run === `npm install --global pnpm@${pnpmVersion}`)) {
      errors.push('workflow: pnpm version must match packageManager');
    }
  } catch {
    errors.push('configuration: required workflow, ruleset, GitBook or package data is invalid');
  }
  return errors;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const errors = checkConfiguration(root);
  if (errors.length) {
    errors.forEach((error) => process.stderr.write(`${error}\n`));
    process.exitCode = 1;
  } else {
    process.stdout.write('Configuration and limited publication checks passed.\n');
  }
}
