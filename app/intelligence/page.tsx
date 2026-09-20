import { createPageMetadata } from '@/lib/site';
import Link from 'next/link';
import { PageHero, StatusPill } from '@/components/site';
import { getEntries } from '@/lib/content';

export default function Intelligence() {
  const entries = getEntries('intelligence');
  return <main>
    <PageHero eyebrow="Intelligence / SIGNAL DESK" title="Quiet observations, sharp edges.">The intelligence desk translates fictional research into concise observations. Labels are editorial metadata for the demo environment, not real threat classifications.</PageHero>
    <section className="section"><div className="container intelligence-grid">
      <div className="signal-stream">{entries.map((item) => <Link href={`/intelligence/${item.slug}`} key={item.id} className="signal-card">
        <div className="signal-card-top"><span className="doc-id mono">{item.id}</span><span className="mono muted tiny">{item.date}</span></div>
        <div className="signal-card-title"><h2>{item.title}</h2><StatusPill text={item.classification ?? 'FIELD'}/></div>
        <p>{item.description}</p>
      </Link>)}</div>
      <aside className="card intelligence-aside"><div className="eyebrow">Desk state</div>
        <div className="status-row"><span>INGEST</span><span className="status-value mono">LOCAL / DEMO</span></div>
        <div className="status-row"><span>OPEN SIGNALS</span><span className="status-value mono">{String(entries.length).padStart(2,'0')}</span></div>
        <div className="status-row"><span>EDITORIAL MODE</span><span className="status-value mono">QUIET</span></div>
        <div className="divider"/><p className="card-copy">These records are deterministic demo content. They are linked to the same content corpus used by research and document views.</p>
      </aside>
    </div></section>
  </main>;
}

export const metadata = createPageMetadata('/intelligence', 'Intelligence — Onyx Archive', 'Synthetic editorial signals connected to the research corpus.');
