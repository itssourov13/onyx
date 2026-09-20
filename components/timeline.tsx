import { networkEvents } from '@/lib/data';

export function SignalTimeline() {
  return <div className="timeline">{networkEvents.map((event)=><article className="timeline-item" key={event.id}>
    <div className="timeline-time mono">{event.time}</div>
    <div className="timeline-marker"><i/></div>
    <div><div className="eyebrow">{event.channel}</div><h3>{event.title}</h3><p>{event.description}</p></div>
  </article>)}</div>;
}
