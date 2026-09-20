'use client';

import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { networkEdges, networkEvents, networkNodes, type NetworkNode } from '@/lib/data';
import { StatusPill } from './site';

const positions: Record<string, [number, number]> = {
  A1: [130, 130], B2: [360, 92], C4: [585, 145], D7: [760, 106], E3: [520, 350], F9: [780, 340], G5: [250, 365],
};

function pathBetween(from: string, to: string) {
  if (from === to) return [from];
  const queue = [[from]];
  const seen = new Set([from]);
  while (queue.length) {
    const path = queue.shift() ?? [];
    const current = path[path.length - 1];
    const nextNodes = networkEdges.flatMap(([a, b]) => a === current ? [b] : b === current ? [a] : []).filter((id) => !seen.has(id));
    for (const next of nextNodes) {
      const nextPath = [...path, next];
      if (next === to) return nextPath;
      seen.add(next);
      queue.push(nextPath);
    }
  }
  return [];
}

function isEventNode(nodeId: string, eventNodeIds: string[]) {
  return eventNodeIds.includes(nodeId);
}

export default function NetworkObservatory() {
  const [selected, setSelected] = useState('A1');
  const [eventIndex, setEventIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [fromNode, setFromNode] = useState('A1');
  const [toNode, setToNode] = useState('F9');
  const node = networkNodes.find((item) => item.id === selected) ?? networkNodes[0];
  const activeEvent = networkEvents[eventIndex] ?? networkEvents[0];
  const path = useMemo(() => pathBetween(fromNode, toNode), [fromNode, toNode]);
  const pathSet = useMemo(() => new Set(path), [path]);
  const connected = useMemo(() => networkEdges.filter(([a, b]) => a === node.id || b === node.id).length, [node.id]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setEventIndex((current) => current === networkEvents.length - 1 ? 0 : current + 1);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [playing]);

  function selectNode(id: string) {
    setSelected(id);
    if (activeEvent.nodeIds.includes(id)) setEventIndex(networkEvents.findIndex((event) => event.id === activeEvent.id));
  }

  function handleNodeKey(event: KeyboardEvent<SVGGElement>, id: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectNode(id);
    }
  }

  function exportSnapshot() {
    const payload = {
      exportedAt: new Date().toISOString(),
      mode: 'SYNTHETIC_OBSERVATORY_SNAPSHOT',
      boundary: 'fictional-demo / no live network telemetry',
      selectedNode: node,
      playback: { eventIndex, event: activeEvent },
      path: { from: fromNode, to: toNode, nodes: path },
      topology: { nodes: networkNodes.length, edges: networkEdges.length },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `onyx-observatory-${activeEvent.id.toLowerCase()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return <div className="observatory-stack">
    <div className="observatory-toolbar card">
      <div>
        <div className="eyebrow">Event playback</div>
        <strong>{activeEvent.time} / {activeEvent.title}</strong>
        <p className="microcopy">Synthetic event timeline. Scrubbing changes the highlighted context only; it does not query live infrastructure.</p>
      </div>
      <div className="observatory-toolbar-actions">
        <button type="button" className="btn btn-ghost" onClick={() => setPlaying((value) => !value)} aria-pressed={playing}>{playing ? 'Pause playback' : 'Play playback'}</button>
        <button type="button" className="btn btn-primary" onClick={exportSnapshot}>Export snapshot</button>
      </div>
      <div className="observatory-scrubber">
        <label className="field-label" htmlFor="event-scrubber">TIMELINE {String(eventIndex + 1).padStart(2, '0')} / {String(networkEvents.length).padStart(2, '0')}</label>
        <input id="event-scrubber" type="range" min={0} max={networkEvents.length - 1} step={1} value={eventIndex} onChange={(event) => setEventIndex(Number(event.target.value))} />
        <div className="observatory-scrub-labels"><span className="mono">{networkEvents.at(-1)?.time}</span><span className="mono">{networkEvents[0]?.time}</span></div>
      </div>
    </div>

    <div className="observatory-grid">
      <div className="network-panel observatory-map">
        <div className="observatory-topline"><StatusPill text="SIMULATED"/><span className="mono muted tiny">EVENT {activeEvent.id} / SYNTHETIC DATA</span></div>
        <svg className="network-lines" viewBox="0 0 900 460" role="img" aria-label="Interactive simulated network topology with event context">
          <title>Fictional Onyx Archive network topology</title>
          <g stroke="rgba(203,163,107,.17)" strokeWidth="1">
            {networkEdges.map(([from, to]) => {
              const a=positions[from]; const b=positions[to];
              const highlighted = pathSet.has(from) && pathSet.has(to) && Math.abs(path.indexOf(from) - path.indexOf(to)) === 1;
              return <line key={`${from}-${to}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className={highlighted ? 'network-edge-active' : undefined} />;
            })}
          </g>
          {networkNodes.map((item: NetworkNode) => {
            const [cx,cy]=positions[item.id];
            const active=item.id===selected;
            const eventNode=isEventNode(item.id, activeEvent.nodeIds);
            const inPath=pathSet.has(item.id);
            return <g key={item.id} className={`map-node ${inPath ? 'map-node-path' : ''}`} onClick={()=>selectNode(item.id)} role="button" tabIndex={0} aria-label={`${item.id} ${item.name}`} onKeyDown={(event)=>handleNodeKey(event,item.id)}>
              <title>{`${item.name} — ${item.status} — ${item.load}% load — ${item.latency}ms latency`}</title>
              <circle cx={cx} cy={cy} r={active?28:21} className={`node ${active?'core':''} ${eventNode?'event-node':''} ${inPath?'path-node':''}`} />
              <circle cx={cx} cy={cy} r={active?6:4} className="node-dot" />
              <text x={cx} y={cy+45} textAnchor="middle" className="network-node-label">{item.id} / {item.name}</text>
            </g>;
          })}
        </svg>
        <div className="network-legend"><span className="tag mono">{networkNodes.length} NODES</span><span className="tag mono">{networkEdges.length} EDGES</span><span className="tag mono">{activeEvent.nodeIds.length} EVENT NODES</span><span className="tag mono">{path.length || '—'} PATH HOPS</span></div>
      </div>
      <aside className="card node-inspector">
        <div className="eyebrow">Node inspector</div>
        <div className="node-id mono">{node.id}</div>
        <h2 className="section-title">{node.name}</h2>
        <p className="card-copy">{node.role}</p>
        <div className="status-row"><span>STATE</span><StatusPill text={node.status}/></div>
        <div className="status-row"><span>LOCATION</span><span className="status-value mono">{node.location}</span></div>
        <div className="status-row"><span>LOAD</span><span className="status-value mono">{node.load}%</span></div>
        <div className="meter"><span style={{width:`${node.load}%`}} /></div>
        <div className="status-row"><span>LATENCY</span><span className="status-value mono">{node.latency}ms</span></div>
        <div className="status-row"><span>LINKS</span><span className="status-value mono">{connected}</span></div>
        <div className="divider"/>
        <div className="eyebrow">Selected event</div>
        <div className="event-mini"><span className="mono">{activeEvent.id}</span><strong>{activeEvent.title}</strong><p>{activeEvent.description}</p></div>
        <p className="microcopy mono">All values are synthetic. No real routing or relay telemetry is exposed.</p>
      </aside>
    </div>

    <div className="path-inspector card">
      <div className="section-head"><div><div className="eyebrow">Path inspection</div><h2 className="section-title">Trace a fictional node-to-node route.</h2></div><span className="tag mono">BFS / SYNTHETIC TOPOLOGY</span></div>
      <div className="path-controls">
        <div><label className="field-label" htmlFor="path-from">SOURCE NODE</label><select id="path-from" className="text-input" value={fromNode} onChange={(event) => setFromNode(event.target.value)}>{networkNodes.map((item)=><option value={item.id} key={item.id}>{item.id} — {item.name}</option>)}</select></div>
        <div><label className="field-label" htmlFor="path-to">DESTINATION NODE</label><select id="path-to" className="text-input" value={toNode} onChange={(event) => setToNode(event.target.value)}>{networkNodes.map((item)=><option value={item.id} key={item.id}>{item.id} — {item.name}</option>)}</select></div>
        <div className="path-summary"><span className="eyebrow">Resolved path</span><strong className="mono">{path.length ? path.join(' → ') : 'NO PATH'}</strong><span className="microcopy">{path.length ? `${Math.max(path.length - 1, 0)} synthetic hops` : 'Nodes are disconnected in the demo graph.'}</span></div>
      </div>
    </div>

    <div className="event-grid">
      <div className="card">
        <div className="section-head"><div><div className="eyebrow">Event ledger</div><h2 className="section-title">Observatory events</h2></div><span className="tag mono">{networkEvents.length} RECORDS</span></div>
        <div className="event-list">
          {networkEvents.map((event, index) => <button key={event.id} type="button" className={`event-row ${index === eventIndex ? 'active' : ''}`} onClick={() => { setEventIndex(index); setPlaying(false); }}>
            <span className="mono event-time">{event.time}</span><span><strong>{event.title}</strong><small>{event.channel} · {event.id}</small></span><StatusPill text={event.severity === 'INFO' ? 'STABLE' : event.severity === 'WATCH' ? 'WATCH' : 'HIGH SIGNAL'}/>
          </button>)}
        </div>
      </div>
      <div className="card">
        <div className="eyebrow">Evidence chain</div>
        <h2 className="section-title">{activeEvent.id}</h2>
        <p className="card-copy">{activeEvent.description}</p>
        <div className="evidence-chain">
          <div className="evidence-step"><span className="mono">01</span><div><strong>Observed</strong><p>{activeEvent.nodeIds.join(', ')} node context</p></div></div>
          <div className="evidence-step"><span className="mono">02</span><div><strong>Recorded</strong><p>{activeEvent.evidence.join(' · ')}</p></div></div>
          <div className="evidence-step"><span className="mono">03</span><div><strong>Related intelligence</strong><p>{activeEvent.intelligenceIds.join(' · ')}</p></div></div>
        </div>
      </div>
    </div>
  </div>;
}
