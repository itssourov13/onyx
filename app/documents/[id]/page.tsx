import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MdxReader } from '@/components/mdx-reader';
import { PageHero } from '@/components/site';
import { getEntries, getEntry } from '@/lib/content';
import { createPageMetadata } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() { return getEntries('documents').map((entry) => ({ id: entry.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const entry = getEntry('documents', id);
  return entry ? createPageMetadata(`/documents/${id}`, entry.title, entry.description) : createPageMetadata('/', 'Document not found', 'The requested Onyx Archive entry could not be found.');
}

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = getEntry('documents', id);
  if (!entry) notFound();
  return <main>
    <PageHero eyebrow={`Document / ${entry.id}`} title={entry.title}>{entry.description}</PageHero>
    <section className="section"><div className="container"><MdxReader entry={entry}/></div></section>
  </main>;
}
