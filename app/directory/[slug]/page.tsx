import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero, StatusPill } from '@/components/site';
import { createPageMetadata } from '@/lib/site';
import { directory } from '@/lib/data';

export const dynamicParams = false;

export function generateStaticParams() { return directory.map((item) => ({ slug: item.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const item = directory.find((entry) => entry.slug === slug); return item ? createPageMetadata(`/directory/${slug}`, item.name, item.description) : createPageMetadata('/directory', 'Directory entry not found', 'The requested synthetic directory entry could not be found.'); }

export default async function DirectoryDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = directory.find((entry) => entry.slug === slug);
  if (!item) notFound();
  return <main><PageHero eyebrow={`Directory / ${item.category}`} title={item.name}>{item.description}</PageHero><section className="section"><div className="container reading-layout"><article className="card"><div className="section-head"><div><div className="eyebrow">Synthetic service</div><span className="mono tiny muted">FICTIONAL / DEMO</span></div><StatusPill text={item.status}/></div><div className="address mono">{item.onion}</div><div className="status-row"><span>FINGERPRINT</span><span className="status-value mono">{item.fp}</span></div><div className="status-row"><span>LAST VERIFIED</span><span className="status-value mono">{item.verified}</span></div><div className="callout"><strong>Boundary:</strong> this address is synthetic and is not intended to resolve to a real hidden service.</div></article><aside><div className="card"><div className="eyebrow">Directory context</div><p className="card-copy">Category: {item.category}</p><Link href="/directory" className="btn btn-ghost">← Back to directory</Link></div></aside></div></section></main>
}
