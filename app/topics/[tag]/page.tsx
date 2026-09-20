import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContentGrid } from '@/components/content-grid';
import { PageHero } from '@/components/site';
import { getContentForTag, getTopicTags } from '@/lib/content';
import { createPageMetadata } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() { return getTopicTags().map((tag) => ({ tag })); }
export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> { const { tag } = await params; const decoded = decodeURIComponent(tag); return createPageMetadata(`/topics/${encodeURIComponent(decoded)}`, `${decoded} topic`, `Fictional Onyx Archive records tagged ${decoded}.`); }
export default async function TopicPage({ params }: { params: Promise<{ tag: string }> }) { const { tag } = await params; const decoded = decodeURIComponent(tag); const entries = getContentForTag(decoded); if (!entries.length) notFound(); return <main><PageHero eyebrow="Topics / SIGNAL" title={decoded}>A cross-section of the fictional corpus carrying this tag.</PageHero><section className="section"><div className="container"><div className="section-head"><div><div className="eyebrow">{entries.length} records</div><h2 className="section-title">Related material</h2></div><Link href="/topics" className="btn btn-ghost">All topics →</Link></div><ContentGrid entries={entries}/></div></section></main>; }
