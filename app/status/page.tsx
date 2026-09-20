import { createPageMetadata } from '@/lib/site';
import { PageHero, StatusPill } from '@/components/site';
import StatusHealth from '@/components/status-health';
import { networkEvents, siteBuild } from '@/lib/data';
import { getDemoMetrics } from '@/lib/metrics';

export default function Status() {
  const demoMetrics = getDemoMetrics();
  const checks = [['SERVICE', 'Operational'], ['ARCHIVE', 'Operational'], ['SEARCH', 'Operational'], ['DIRECTORY', 'Operational']] as const;
  return <main><PageHero eyebrow="Status / LIVE-STYLE DEMO" title="System state, without the theatre.">All metrics on this page are simulated. The API row is backed by a real local read-only health endpoint; all other operational states remain synthetic.</PageHero><section className="section"><div className="container status-grid"><div className="card"><div className="eyebrow">Components</div>{checks.map(([name, state]) => <div key={name} className="status-row"><span className="mono">{name}</span><StatusPill text={state.toUpperCase()}/></div>)}<StatusHealth/></div><div className="card"><div className="eyebrow">Build state</div><div className="status-row"><span>VERSION</span><span className="status-value mono">{siteBuild.version}</span></div><div className="status-row"><span>BUILD</span><span className="status-value mono">{siteBuild.build}</span></div><div className="status-row"><span>LAST SECURITY REVIEW</span><span className="status-value mono">{siteBuild.reviewedAt}</span></div><div className="status-row"><span>UPTIME</span><span className="status-value mono">{demoMetrics.uptime}</span></div><div className="status-row"><span>SIMULATED NODES</span><span className="status-value mono">{demoMetrics.simulatedNodes}</span></div></div></div></section><section className="section"><div className="container card"><div className="section-head"><div><div className="eyebrow">Event stream</div><h2 className="section-title">Recent system signals.</h2></div><span className="tag mono">SYNTHETIC</span></div><div className="status-event-list">{networkEvents.slice(0,4).map((event) => <div className="status-event" key={event.id}><span className="mono muted">{event.time}</span><span className="tag mono">{event.channel}</span><strong>{event.title}</strong><span className="muted small">{event.description}</span></div>)}</div></div></section></main>;
}

export const metadata = createPageMetadata('/status', 'Status — Onyx Archive', 'Simulated system status with a real local demo health endpoint.');
