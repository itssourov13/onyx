import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const sourceRoots = ['app', 'components', 'lib'];
const files = sourceRoots.flatMap((dir) => walk(path.join(root, dir))).filter((file) => /\.(tsx|ts|mjs)$/.test(file));
const sources = files.map((file) => ({ file, text: fs.readFileSync(file, 'utf8') }));
const source = sources.map(({ text }) => text).join('\n');

if (!fs.existsSync(path.join(root, 'app', 'error.tsx'))) failures.push('Global route error boundary app/error.tsx is missing.');
if (!fs.existsSync(path.join(root, 'app', 'global-error.tsx'))) failures.push('Root global error boundary app/global-error.tsx is missing.');
if (!fs.existsSync(path.join(root, 'app', 'not-found.tsx'))) failures.push('Not-found boundary app/not-found.tsx is missing.');
if (!fs.existsSync(path.join(root, 'playwright.config.ts'))) failures.push('Playwright configuration is missing.');
if (!fs.existsSync(path.join(root, 'tests', 'a11y.spec.ts'))) failures.push('Accessibility suite is missing.');
if (!fs.existsSync(path.join(root, 'tests', 'mobile.spec.ts'))) failures.push('Mobile regression suite is missing.');
if (!fs.existsSync(path.join(root, '.github', 'workflows', 'ci.yml'))) failures.push('CI workflow is missing.');
if (!fs.existsSync(path.join(root, 'vercel.json'))) failures.push('vercel.json is missing.');
if (!fs.existsSync(path.join(root, '.nvmrc'))) failures.push('.nvmrc is missing.');
if (!fs.existsSync(path.join(root, 'scripts', 'content-check.mjs'))) failures.push('Content validation script is missing.');
if (!fs.existsSync(path.join(root, '.env.example'))) failures.push('.env.example is missing.');
if (!fs.existsSync(path.join(root, 'vercel.json'))) failures.push('vercel.json is missing.');
if (!fs.existsSync(path.join(root, '.vercelignore'))) failures.push('.vercelignore is missing.');
if (!fs.existsSync(path.join(root, 'scripts', 'security-header-check.mjs'))) failures.push('Security header verification script is missing.');
const dataFile = path.join(root, 'lib', 'data.ts');
const dataText = fs.readFileSync(dataFile, 'utf8');
for (const name of ['documents', 'research', 'intelligence', 'securityNotes']) {
  if (new RegExp(`export\\s+const\\s+${name}\\s*=`).test(dataText)) failures.push(`Duplicate publication dataset ${name} found in lib/data.ts; MDX should remain the source of truth.`);
}

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.packageManager !== 'npm@10.9.2') failures.push(`Expected packageManager npm@10.9.2, found ${packageJson.packageManager ?? '<missing>'}.`);
if (packageJson.engines?.node !== '24.x') failures.push(`Expected Node 24.x engine, found ${packageJson.engines?.node ?? '<missing>'}.`);
if (!packageJson.scripts?.['content:check']) failures.push('package.json content:check script is missing.');
if (!packageJson.scripts?.['qa:imports']) failures.push('package.json qa:imports script is missing.');
if (!packageJson.scripts?.['security:deps']) failures.push('package.json security:deps script is missing.');
if (/16\.3\.3|19\.2/.test(fs.readFileSync(path.join(root, 'README.md'), 'utf8'))) failures.push('README still contains stale framework versions.');

const forbiddenClientNetwork = /(?:\bfetch\s*\(|\bnew\s+WebSocket\s*\(|\bnew\s+XMLHttpRequest\s*\()/;
for (const { file, text } of sources) {
  const relative = path.relative(root, file).replaceAll('\\', '/');
  const isSecurityModule = relative.startsWith('app/security/') || relative.startsWith('components/security/');
  if (isSecurityModule && /^['"]use client['"];?\s*$/m.test(text) && forbiddenClientNetwork.test(text)) {
    failures.push(`Security module contains a direct browser network API: ${relative}`);
  }
}


function discoverRoutes(dir, prefix = '') {
  const routes = new Set();
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next', '.git'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const segment = entry.name.startsWith('(') && entry.name.endsWith(')') ? '' : entry.name;
      const nextPrefix = segment ? `${prefix}/${segment}` : prefix;
      for (const route of discoverRoutes(full, nextPrefix)) routes.add(route);
    } else if (/^page\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      routes.add(prefix || '/');
    } else if (/^route\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      routes.add(prefix || '/');
    }
  }
  return routes;
}

const appRoutes = discoverRoutes(path.join(root, 'app'));
const routeMatrixFile = path.join(root, 'tests', 'route-matrix.ts');
if (!fs.existsSync(routeMatrixFile)) failures.push('tests/route-matrix.ts is missing.');
const routeMatrix = fs.existsSync(routeMatrixFile)
  ? [...fs.readFileSync(routeMatrixFile, 'utf8').matchAll(/['"](\/[^'"]*)['"]/g)].map((match) => match[1])
  : [];
function routeToRegex(route) {
  const parts = route.split('/').slice(1);
  if (!parts.length) return /^\/$/;
  const pattern = parts.map((part) => part.startsWith('[[...') ? '.+' : part.startsWith('[') ? '[^/]+' : part.replace(/[.*+?^${}()|\\]/g, '\\$&')).join('\/');
  return new RegExp(`^\/${pattern}$`);
}
const routeMatchers = [...appRoutes].map(routeToRegex);
for (const routePattern of appRoutes) {
  if (routePattern.startsWith('/api/')) continue;
  const matcher = routeToRegex(routePattern);
  if (!routeMatrix.some((sample) => matcher.test(sample))) failures.push(`Public route pattern lacks a browser QA sample: ${routePattern}`);
}
if (routeMatrix.length < 50) failures.push(`Public route QA matrix unexpectedly small: ${routeMatrix.length}`);
const hrefs = [...source.matchAll(/href\s*=\s*[{]?['\"](\/[^'\"]*)['\"]/g)].map((match) => match[1]);
for (const href of hrefs) {
  const clean = href.split(/[?#]/, 1)[0] || '/';
  if (clean.startsWith('/_next/')) continue;
  if (!routeMatchers.some((matcher) => matcher.test(clean))) failures.push(`Unrecognized internal href: ${href}`);
}

for (const { file, text } of sources) {
  const relative = path.relative(root, file).replaceAll('\\', '/');
  if (/\.tsx$/.test(relative) && /^\s*['\"]use client['\"];?/m.test(text) && !/^['\"]use client['\"];/.test(text.trimStart())) {
    failures.push(`"use client" must be the first statement: ${relative}`);
  }
}

if (appRoutes.has('/topics/[tag]') === false) failures.push('Topics dynamic route app/topics/[tag] is missing.');
if (!appRoutes.has('/api/health')) failures.push('/api/health route is missing.');
function pageHasMetadata(file) {
  const text = fs.readFileSync(file, 'utf8');
  return /export\s+(?:const|async\s+function\s+generateMetadata|function\s+generateMetadata)/.test(text) && /(metadata|generateMetadata)/.test(text);
}
function findPageMetadata(dir) {
  const page = ['page.tsx', 'page.ts', 'page.jsx', 'page.js'].map((name) => path.join(dir, name)).find((file) => fs.existsSync(file));
  if (page && pageHasMetadata(page)) return true;
  let current = dir;
  while (current.startsWith(path.join(root, 'app'))) {
    const layout = path.join(current, 'layout.tsx');
    if (fs.existsSync(layout) && /metadata|generateMetadata/.test(fs.readFileSync(layout, 'utf8'))) return true;
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return dir === path.join(root, 'app') && /metadata|generateMetadata/.test(fs.readFileSync(path.join(root, 'app', 'layout.tsx'), 'utf8'));
}
for (const route of appRoutes) {
  if (route === '/' || route.startsWith('/api/')) continue;
  const dir = path.join(root, 'app', route.slice(1));
  if (fs.existsSync(dir) && !findPageMetadata(dir)) failures.push(`Route lacks explicit metadata coverage: ${route}`);
}

const onionStrings = [...source.matchAll(/\b[a-z2-7]{56}\.onion\b/g)].map((match) => match[0]);
if (!onionStrings.length) failures.push('No synthetic 56-character onion-shaped demo identifiers were found.');

const invalidOnion = onionStrings.filter((value) => !/^[a-z2-7]{56}\.onion$/.test(value));
if (invalidOnion.length) failures.push(`Invalid onion-shaped demo identifiers: ${invalidOnion.join(', ')}`);

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Static QA passed: ${files.length} app/config source files inspected; ${onionStrings.length} onion-shaped demo identifiers valid.`);
