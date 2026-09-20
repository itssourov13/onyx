import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next', '.git'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

function resolve(specifier) {
  const relative = specifier.replace(/^@\//, '');
  for (const ext of ['.ts', '.tsx']) {
    const file = path.join(root, `${relative}${ext}`);
    if (fs.existsSync(file)) return file;
  }
  for (const file of [path.join(root, relative, 'index.ts'), path.join(root, relative, 'index.tsx')]) {
    if (fs.existsSync(file)) return file;
  }
  return null;
}

function exportsOf(file) {
  const source = fs.readFileSync(file, 'utf8');
  return new Set([...source.matchAll(/export\s+(?:async\s+)?(?:const|function|class|type|interface|enum)\s+([A-Za-z0-9_]+)/g)].map((match) => match[1]));
}

for (const file of walk(path.join(root, 'app')).concat(walk(path.join(root, 'components')))) {
  const source = fs.readFileSync(file, 'utf8');
  for (const match of source.matchAll(/import\s*(?:type\s*)?\{([^}]+)\}\s*from\s*['\"](@\/[^'\"]+)['\"]/g)) {
    const target = resolve(match[2]);
    if (!target) {
      failures.push(`${path.relative(root, file)}: unresolved alias ${match[2]}`);
      continue;
    }
    const available = exportsOf(target);
    for (const raw of match[1].split(',')) {
      const name = raw.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim();
      if (name && !available.has(name)) failures.push(`${path.relative(root, file)}: ${match[2]} has no named export ${name}`);
    }
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('Internal import/export check passed.');
