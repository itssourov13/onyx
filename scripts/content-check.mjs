import fs from 'node:fs';
import path from 'node:path';

const root = path.join(process.cwd(), 'content');
const kinds = ['documents','research','intelligence','security-notes'];
const failures = [];
const records = [];

function parseFrontmatter(file, source) {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error(`${file}: frontmatter block is missing.`);
  const lines = match[1].split('\n');
  const values = {};
  for (const line of lines) {
    const scalar = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (scalar) values[scalar[1]] = scalar[2].trim().replace(/^['"]|['"]$/g, '');
  }
  return { header: match[1], values };
}

for (const kind of kinds) {
  const dir = path.join(root, kind);
  if (!fs.existsSync(dir)) { failures.push(`Missing content directory: ${kind}`); continue; }
  const slugs = new Set();
  for (const name of fs.readdirSync(dir).filter((value) => value.endsWith('.mdx')).sort()) {
    const slug = name.slice(0, -4);
    const file = `${kind}/${name}`;
    const source = fs.readFileSync(path.join(dir, name), 'utf8');
    try {
      const { header, values } = parseFrontmatter(file, source);
      for (const field of ['id','title','description','date','author','category','readTime']) {
        if (!values[field]) failures.push(`${file}: ${field} missing.`);
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date ?? '')) failures.push(`${file}: date must be YYYY-MM-DD.`);
      if (header.includes('url:')) {
        const urls = [...header.matchAll(/url:\s*["']?([^"'\s]+)["']?/g)].map((m) => m[1]);
        for (const url of urls) {
          try {
            const parsed = new URL(url);
            if (!/^https?:$/.test(parsed.protocol)) failures.push(`${file}: unsafe reference protocol ${parsed.protocol}`);
          } catch { failures.push(`${file}: invalid reference URL ${url}`); }
        }
      }
      if (slugs.has(slug)) failures.push(`${kind}: duplicate slug ${slug}`);
      slugs.add(slug);
      records.push(file);
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error));
    }
  }
}
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`Content validation passed: ${records.length} MDX records.`);
