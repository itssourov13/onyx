import Link from 'next/link';
import type { ContentEntry } from '@/lib/content';

export function DocumentCard({ doc }: { doc: ContentEntry }) {
  return <article className="document-card">
    <div className="document-card-top"><span className="doc-id mono">{doc.id}</span><span className="tag">{doc.classification ?? doc.state ?? doc.category}</span></div>
    <h2>{doc.title}</h2>
    <p>{doc.description}</p>
    <div className="document-card-meta"><span>{doc.category}</span><span>{doc.readTime}</span><span>{doc.date}</span></div>
    <div className="meta"><Link className="btn btn-ghost" href={`/documents/${doc.slug}`}>Open document <span aria-hidden>↗</span></Link><span className="tag mono">DEMO CONTENT</span></div>
  </article>;
}
