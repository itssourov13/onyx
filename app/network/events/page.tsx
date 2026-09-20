import { createPageMetadata } from '@/lib/site';
import Link from 'next/link';
import { PageHero, StatusPill } from '@/components/site';
import { networkEvents } from '@/lib/data';

export default function NetworkEvents() {
  return <main><PageHero eyebrow="Network / EVENT LEDGER" title="Synthetic observations, kept traceable.">Event records connect the fictional topology to evidence labels and intelligence notes. They are deterministic demo data, not live network telemetry.</PageHero><section className="section"><div className="container"><div className="event-grid standalone-event-grid"><div className="card"><div className="event-list">{networkEvents.map((event)=><Link key={event.id} className="event-row link-row" href={`/network/events/${event.id.toLowerCase()}`}><span className="mono event-time">{event.time}</span><span><strong>{event.title}</strong><small>{event.channel} · {event.id}</small></span><StatusPill text={event.severity==='INFO'?'STABLE':event.severity==='WATCH'?'WATCH':'HIGH SIGNAL'}/></Link>)}</div></div><aside className="card"><div className="eyebrow">Observatory model</div><div className="status-row"><span>EVENTS</span><span className="status-value mono">{networkEvents.length}</span></div><div className="status-row"><span>SOURCE</span><span className="status-value mono">SYNTHETIC</span></div><div className="status-row"><span>LIVE INPUT</span><span className="status-value mono">NONE</span></div><div className="divider"/><p className="card-copy">Each event is designed to be inspectable, exportable and linkable to the Intelligence desk without implying a real incident or external infrastructure.</p><Link className="btn btn-ghost" href="/network">Back to Observatory</Link></aside></div></div></section></main>;
}

export const metadata = createPageMetadata('/network/events', 'Network Event Ledger — Onyx Archive', 'Traceable synthetic network events and evidence labels.');
