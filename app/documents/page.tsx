import { createPageMetadata } from '@/lib/site';
import { ContentGrid } from '@/components/content-grid';
import { PageHero } from '@/components/site';
import { getEntries } from '@/lib/content';

export default function Documents() {
  const entries = getEntries('documents');
  return <main>
    <PageHero eyebrow="Documents / CORPUS" title="Long-form records, now content-backed.">The document reader is backed by local MDX with validated metadata, tags, references and generated table-of-contents data. All records remain fictional demo material.</PageHero>
    <section className="section"><div className="container"><ContentGrid entries={entries}/></div></section>
  </main>;
}

export const metadata = createPageMetadata('/documents', 'Documents — Onyx Archive', 'Long-form fictional technical records backed by local MDX.');
