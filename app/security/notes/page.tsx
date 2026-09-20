import { createPageMetadata } from '@/lib/site';
import { ContentGrid } from '@/components/content-grid';
import { PageHero } from '@/components/site';
import { getEntries } from '@/lib/content';

export default function SecurityNotes() {
  const entries = getEntries('security-notes');
  return <main><PageHero eyebrow="Security / NOTES" title="Quiet notes for noisy systems.">Application-security field notes backed by local MDX. These records connect the isolated lab, browser boundary and production hardening surfaces.</PageHero><section className="section"><div className="container"><ContentGrid entries={entries}/></div></section></main>;
}

export const metadata = createPageMetadata('/security/notes', 'Security Notes — Onyx Archive', 'Application-security field notes backed by local MDX.');
