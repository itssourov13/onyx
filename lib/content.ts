import fs from 'node:fs';
import path from 'node:path';
import { getFrontmatter } from 'next-mdx-remote-client/utils';

export type ContentKind = 'documents' | 'research' | 'intelligence' | 'security-notes';

export type ContentSource = { label: string; url: string };

export type ContentFrontmatter = {
  id: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  author: string;
  category: string;
  tags: string[];
  readTime: string;
  classification?: string;
  state?: string;
  sources?: ContentSource[];
};

export type ContentEntry = ContentFrontmatter & { slug: string; kind: ContentKind };

const ROOT = path.join(process.cwd(), 'content');

const requiredStrings = ['id', 'title', 'description', 'date', 'author', 'category', 'readTime'] as const;

function dirFor(kind: ContentKind) {
  return path.join(ROOT, kind);
}

function filesFor(kind: ContentKind) {
  return fs.readdirSync(dirFor(kind)).filter((file) => file.endsWith('.mdx')).sort();
}

function readSource(kind: ContentKind, slug: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug)) return null;
  const file = path.join(dirFor(kind), `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, 'utf8');
}

function asString(value: unknown, field: string, context: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${context}: ${field} must be a non-empty string.`);
  return value.trim();
}

function asDate(value: unknown, field: string, context: string): string {
  const date = asString(value, field, context);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) throw new Error(`${context}: ${field} must use YYYY-MM-DD.`);
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) {
    throw new Error(`${context}: ${field} must be a valid calendar date.`);
  }
  return date;
}

function asTags(value: unknown, context: string): string[] {
  if (!Array.isArray(value) || !value.length || value.some((tag) => typeof tag !== 'string' || !tag.trim())) {
    throw new Error(`${context}: tags must be a non-empty string array.`);
  }
  const tags = value.map((tag) => tag.trim());
  if (new Set(tags.map((tag) => tag.toLowerCase())).size !== tags.length) {
    throw new Error(`${context}: tags must not contain duplicates.`);
  }
  return tags;
}

function asSources(value: unknown, context: string): ContentSource[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) throw new Error(`${context}: sources must be an array.`);
  return value.map((item, index) => {
    if (!item || typeof item !== 'object') throw new Error(`${context}: sources[${index}] must be an object.`);
    const source = item as Record<string, unknown>;
    const label = asString(source.label, `sources[${index}].label`, context);
    const url = asString(source.url, `sources[${index}].url`, context);
    let parsed: URL;
    try { parsed = new URL(url); } catch { throw new Error(`${context}: sources[${index}].url is not a valid URL.`); }
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      throw new Error(`${context}: sources[${index}].url must use http:// or https://.`);
    }
    return { label, url };
  });
}

function frontmatterFromSource(source: string, context: string): ContentFrontmatter {
  const { frontmatter } = getFrontmatter<Record<string, unknown>>(source);
  for (const field of requiredStrings) asString(frontmatter[field], field, context);
  const normalized: ContentFrontmatter = {
    id: asString(frontmatter.id, 'id', context),
    title: asString(frontmatter.title, 'title', context),
    description: asString(frontmatter.description, 'description', context),
    date: asDate(frontmatter.date, 'date', context),
    author: asString(frontmatter.author, 'author', context),
    category: asString(frontmatter.category, 'category', context),
    tags: asTags(frontmatter.tags, context),
    readTime: asString(frontmatter.readTime, 'readTime', context),
    sources: asSources(frontmatter.sources, context),
  };
  if (frontmatter.updated !== undefined) {
    normalized.updated = asDate(frontmatter.updated, 'updated', context);
    if (normalized.updated < normalized.date) throw new Error(`${context}: updated cannot be earlier than date.`);
  }
  if (frontmatter.classification !== undefined) normalized.classification = asString(frontmatter.classification, 'classification', context);
  if (frontmatter.state !== undefined) normalized.state = asString(frontmatter.state, 'state', context);
  return normalized;
}

export function getEntries(kind: ContentKind): ContentEntry[] {
  return filesFor(kind).map((file) => {
    const slug = file.replace(/\.mdx$/, '');
    const source = fs.readFileSync(path.join(dirFor(kind), file), 'utf8');
    const context = `${kind}/${file}`;
    return { ...frontmatterFromSource(source, context), slug, kind };
  }).sort((a, b) => b.date.localeCompare(a.date));
}

export function getEntry(kind: ContentKind, slug: string) {
  const source = readSource(kind, slug);
  if (!source) return null;
  return { ...frontmatterFromSource(source, `${kind}/${slug}.mdx`), slug, kind, source };
}

export function getAllContent() {
  return (['documents', 'research', 'intelligence', 'security-notes'] as ContentKind[]).flatMap(getEntries);
}

export function getRelatedContent(entry: ContentEntry, limit = 4) {
  return getAllContent()
    .filter((candidate) => candidate.slug !== entry.slug || candidate.kind !== entry.kind)
    .map((candidate) => ({
      candidate,
      score: candidate.tags.filter((tag) => entry.tags.includes(tag)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.candidate.date.localeCompare(a.candidate.date))
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

export function getTopicTags() {
  return [...new Set(getAllContent().flatMap((entry) => entry.tags))].sort((a, b) => a.localeCompare(b));
}

export function getContentForTag(tag: string) {
  const normalized = tag.toLowerCase();
  return getAllContent().filter((entry) => entry.tags.some((item) => item.toLowerCase() === normalized));
}
