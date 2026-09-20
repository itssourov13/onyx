import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MdxReader } from '@/components/mdx-reader';
import { PageHero } from '@/components/site';
import { getEntries, getEntry } from '@/lib/content';
import { createPageMetadata } from '@/lib/site';
import { IntelligenceRelations } from '@/components/intelligence-relations';

export const dynamicParams = false;

export function generateStaticParams() { return getEntries('intelligence').map((entry) => ({ id: entry.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const entry = getEntry('intelligence', id);
  return entry ? createPageMetadata(`/intelligence/${id}`, entry.title, entry.description) : createPageMetadata('/', 'Signal not found', 'The requested Onyx Archive entry could not be found.');
}

export default async function IntelligenceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = getEntry('intelligence', id);
  if (!entry) notFound();
  return <main><PageHero eyebrow={`Intelligence / ${entry.id}`} title={entry.title}>{entry.description}</PageHero><section className="section"><div className="container"><MdxReader entry={entry}/><IntelligenceRelations slug={entry.slug}/></div></section></main>;
}
