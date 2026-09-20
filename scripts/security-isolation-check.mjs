import fs from 'node:fs';
import path from 'node:path';

const roots = ['app/security', 'components/security', 'lib/security-lab.ts'];
const files = [];
function collect(entry) {
  const stat = fs.statSync(entry);
  if (stat.isDirectory()) {
    for (const child of fs.readdirSync(entry)) collect(path.join(entry, child));
  } else if (/\.(ts|tsx)$/.test(entry)) {
    files.push(entry);
  }
}
for (const root of roots) collect(root);

const forbidden = [
  [/\bfetch\s*\(/, 'network fetch'],
  [/XMLHttpRequest/, 'XMLHttpRequest'],
  [/navigator\.sendBeacon/, 'sendBeacon'],
  [/\bWebSocket\s*\(/, 'WebSocket'],
  [/from ['"]node:(fs|path|child_process|net|http|https)['"]/, 'node network/filesystem import'],
  [/require\(['"](?:fs|path|child_process|net|http|https)['"]\)/, 'node network/filesystem require'],
];
const violations = [];
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  for (const [pattern, label] of forbidden) {
    if (pattern.test(source)) violations.push(`${file}: ${label}`);
  }
}

const fixture = fs.readFileSync('components/security/vulnerability-fixture.tsx', 'utf8');
if (!fixture.includes('sandbox="allow-scripts"')) violations.push('vulnerability fixture: expected allow-scripts sandbox missing');
if (/sandbox="[^\"]*allow-same-origin/.test(fixture)) violations.push('vulnerability fixture: allow-same-origin would weaken opaque-origin isolation');

const config = fs.readFileSync('next.config.mjs', 'utf8');
if (!config.includes("isDev ? \" 'unsafe-eval'\" : ''")) violations.push('next.config.mjs: dev-only unsafe-eval guard missing');
if (!config.includes("Strict-Transport-Security")) violations.push('next.config.mjs: HSTS header missing');

console.log(`security_isolation_files=${files.length}`);
console.log(`security_isolation_violations=${violations.length}`);
if (violations.length) {
  for (const violation of violations) console.error(`FAIL ${violation}`);
  process.exit(1);
}
console.log('security_isolation_check=PASS');
