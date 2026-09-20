import { createPageMetadata } from '@/lib/site';
import { getEntries } from '@/lib/content';
import { PageHero } from '@/components/site';
import ArchiveSearch from '@/components/archive-search';

export default function Archive(){
  const entries = getEntries('documents');
  return <main><PageHero eyebrow="Archive / OA-INDEX" title="The archive is the product.">A fictional collection of technical records, field notes and research briefs. Everything here is designed as demo content; no real illicit services or private infrastructure are indexed.</PageHero><section className="section"><div className="container"><ArchiveSearch entries={entries}/></div></section></main>;
}

export const metadata = createPageMetadata('/archive', 'Archive — Onyx Archive', 'Search the fictional Onyx Archive corpus.');
