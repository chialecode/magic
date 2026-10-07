import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const checks = [
  ['Markdown style', ['node_modules/markdownlint-cli2/markdownlint-cli2-bin.mjs']],
  ['Document links and registry', ['scripts/check-docs.mjs']],
  ['Configuration and publication', ['scripts/check-config.mjs']],
  ['Validator regression tests', ['--test', 'scripts/check-docs.test.mjs']],
];

for (const [name, arguments_] of checks) {
  process.stdout.write(`Running: ${name}\n`);
  const result = spawnSync(process.execPath, arguments_, { cwd: root, stdio: 'inherit' });
  if (result.error || result.status !== 0) {
    process.stderr.write(`Failed: ${name}\n`);
    process.exit(result.status || 1);
  }
}
process.stdout.write('All M0 repository checks passed; product and remote CI validation are separate.\n');
