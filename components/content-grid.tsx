import Link from 'next/link';
import type { ContentEntry } from '@/lib/content';

const routeFor: Record<ContentEntry['kind'], string> = {
  documents: '/documents',
  research: '/research',
  intelligence: '/intelligence',
  'security-notes': '/security/notes',
};

export function ContentGrid({ entries }: { entries: ContentEntry[] }) {
  return <div className="content-grid">
    {entries.map((entry) => <Link key={`${entry.kind}:${entry.slug}`} href={`${routeFor[entry.kind]}/${entry.slug}`} className="card content-card">
      <div className="document-card-top"><span className="doc-id mono">{entry.id}</span><span className="tag">{entry.category}</span></div>
      <h2 className="card-title">{entry.title}</h2>
      <p className="card-copy">{entry.description}</p>
      <div className="meta">{entry.tags.slice(0, 3).map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
      <div className="document-card-meta"><span>{entry.date}</span><span>{entry.readTime}</span></div>
    </Link>)}
  </div>;
}
