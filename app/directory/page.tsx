import { createPageMetadata } from '@/lib/site';
import { PageHero } from '@/components/site';
import DirectoryExplorer from '@/components/directory-explorer';
export default function Directory(){ return <main><PageHero eyebrow="Directory / DEMO INDEX" title="A fictional directory for a fictional network.">Every address below is synthetic. The directory demonstrates filtering, fingerprints, verification states and onion-service visual language without linking to real hidden services.</PageHero><section className="section"><div className="container"><DirectoryExplorer/></div></section></main>; }

export const metadata = createPageMetadata('/directory', 'Directory — Onyx Archive', 'A fictional directory of synthetic onion-service entries.');
