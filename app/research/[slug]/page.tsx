import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MdxReader } from '@/components/mdx-reader';
import { PageHero } from '@/components/site';
import { getEntries, getEntry } from '@/lib/content';
import { createPageMetadata } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() { return getEntries('research').map((entry) => ({ slug: entry.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry('research', slug);
  return entry ? createPageMetadata(`/research/${slug}`, entry.title, entry.description) : createPageMetadata('/', 'Research entry not found', 'The requested Onyx Archive entry could not be found.');
}

export default async function ResearchDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getEntry('research', slug);
  if (!entry) notFound();
  return <main><PageHero eyebrow={`Research / ${entry.id}`} title={entry.title}>{entry.description}</PageHero><section className="section"><div className="container"><MdxReader entry={entry}/></div></section></main>;
}
