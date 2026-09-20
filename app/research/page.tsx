import { createPageMetadata } from '@/lib/site';
import { ContentGrid } from '@/components/content-grid';
import { PageHero } from '@/components/site';
import { getEntries } from '@/lib/content';
import Link from 'next/link';

export default function Research() {
  const entries = getEntries('research');
  return <main>
    <PageHero eyebrow="Research / FIELD NOTES" title="Research without spectacle.">A focused stream of fictional technical work backed by local MDX. Metadata, tags, references and reader structure are now separated from the presentation layer.</PageHero>
    <section className="section"><div className="container"><div className="section-head"><div><div className="eyebrow">Corpus</div><h2 className="section-title">Research records</h2></div><Link href="/topics" className="btn btn-ghost">Browse topics →</Link></div><ContentGrid entries={entries}/></div></section>
  </main>;
}

export const metadata = createPageMetadata('/research', 'Research — Onyx Archive', 'Fictional technical research records backed by local MDX.');
