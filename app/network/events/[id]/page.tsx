import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero, StatusPill } from '@/components/site';
import { getNetworkEvent, getNetworkNode, networkEvents } from '@/lib/data';
import { createPageMetadata } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() { return networkEvents.map((event) => ({ id: event.id.toLowerCase() })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const event = getNetworkEvent(id.toUpperCase());
  return event ? createPageMetadata(`/network/events/${id.toLowerCase()}`, event.title, event.description) : createPageMetadata('/network/events', 'Event not found', 'The requested synthetic network event could not be found.');
}

export default async function NetworkEventDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getNetworkEvent(id.toUpperCase());
  if (!event) notFound();
  const nodes = event.nodeIds.map(getNetworkNode).filter(Boolean);
  return <main><PageHero eyebrow={`Network / EVENT ${event.id}`} title={event.title}>{event.description}</PageHero><section className="section"><div className="container reading-layout"><article className="card event-detail-card"><div className="section-head"><div><div className="eyebrow">Event metadata</div><h2 className="section-title">Observed context</h2></div><StatusPill text={event.severity==='INFO'?'STABLE':event.severity==='WATCH'?'WATCH':'HIGH SIGNAL'}/></div><div className="status-row"><span>TIME</span><span className="status-value mono">{event.time}</span></div><div className="status-row"><span>CHANNEL</span><span className="status-value mono">{event.channel}</span></div><div className="status-row"><span>NODES</span><span className="status-value mono">{event.nodeIds.join(' · ')}</span></div><div className="divider"/><h3>Evidence chain</h3><div className="evidence-chain">{event.evidence.map((item,index)=><div className="evidence-step" key={item}><span className="mono">{String(index+1).padStart(2,'0')}</span><div><strong>{item.replaceAll('-', ' ')}</strong><p>Recorded as synthetic evidence attached to {event.id}.</p></div></div>)}</div></article><aside className="card sticky-card"><div className="eyebrow">Linked nodes</div><div className="relation-list">{nodes.map((node)=><div className="relation-row static-row" key={node?.id}><span><strong>{node?.name}</strong><small>{node?.id} · {node?.location}</small></span><span className="mono">{node?.latency}ms</span></div>)}</div><div className="divider"/><div className="eyebrow">Linked intelligence</div><div className="relation-list">{event.intelligenceIds.map((slug)=><Link key={slug} className="relation-row" href={`/intelligence/${slug}`}><span><strong>{slug.replaceAll('-', ' ')}</strong><small>Signal desk</small></span><span className="mono">OPEN →</span></Link>)}</div><div className="divider"/><Link className="btn btn-ghost" href="/network">Return to Observatory</Link></aside></div></section></main>;
}
