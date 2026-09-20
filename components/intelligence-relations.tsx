import Link from 'next/link';
import { intelligenceRelations, networkEvents } from '@/lib/data';
import { getEntry } from '@/lib/content';

export function IntelligenceRelations({ slug }: { slug: string }) {
  const relation = intelligenceRelations[slug];
  if (!relation) return null;
  const research = relation.research.map((id) => getEntry('research', id)).filter(Boolean);
  const documents = relation.documents.map((id) => getEntry('documents', id)).filter(Boolean);
  const events = relation.events.map((id) => networkEvents.find((event) => event.id === id)).filter(Boolean);

  return <section className="relations-grid">
    <div className="card">
      <div className="eyebrow">Research links</div>
      <div className="relation-list">
        {research.length ? research.map((item) => item && <Link className="relation-row" href={`/research/${item.slug}`} key={item.slug}><span><strong>{item.title}</strong><small>{item.id} · {item.category}</small></span><span className="mono">OPEN →</span></Link>) : <p className="microcopy">No research relation mapped.</p>}
      </div>
    </div>
    <div className="card">
      <div className="eyebrow">Document evidence</div>
      <div className="relation-list">
        {documents.length ? documents.map((item) => item && <Link className="relation-row" href={`/documents/${item.slug}`} key={item.slug}><span><strong>{item.title}</strong><small>{item.id} · {item.category}</small></span><span className="mono">OPEN →</span></Link>) : <p className="microcopy">No document relation mapped.</p>}
      </div>
    </div>
    <div className="card relation-wide">
      <div className="section-head"><div><div className="eyebrow">Evidence chain</div><h2 className="section-title">Observatory events</h2></div><span className="tag mono">SYNTHETIC</span></div>
      <div className="relation-event-grid">
        {events.length ? events.map((event) => event && <Link className="relation-event" href={`/network/events/${event.id.toLowerCase()}`} key={event.id}><div className="mono tiny muted">{event.time} · {event.id}</div><strong>{event.title}</strong><p>{event.description}</p><span className="mono tiny">{event.nodeIds.join(' / ')} · {event.evidence.join(' · ')}</span></Link>) : <p className="microcopy">No observatory evidence is linked to this signal.</p>}
      </div>
    </div>
  </section>;
}
