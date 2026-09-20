import { createPageMetadata } from '@/lib/site';
import { PageHero } from '@/components/site';
import { Casebook } from '@/components/security/casebook';

export default function SecurityCasebookPage(){
  return <main><PageHero eyebrow="Security / CASEBOOK" title="Keep small findings without building a backend." >A browser-local evidence notebook for synthetic findings, notes and pasted analyzer output. It is designed as a preparation surface for future durable reporting, not as a remote case-management system.</PageHero><section className="section"><div className="container"><Casebook/></div></section></main>;
}

export const metadata = createPageMetadata('/security/casebook', 'Casebook — Onyx Archive', 'Browser-local synthetic findings and evidence workspace.');
