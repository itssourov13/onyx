'use client';
import { useMemo, useState, type ChangeEvent } from 'react';
import Link from 'next/link';
import type { ContentEntry } from '@/lib/content';

export default function ResearchTerminal({ entries }: { entries: ContentEntry[] }){
  const [q,setQ]=useState('');
  const results=useMemo(()=>entries.filter(x=>`${x.title} ${x.category} ${x.description} ${x.tags.join(' ')}`.toLowerCase().includes(q.trim().toLowerCase())).slice(0,5),[entries,q]);
  return <div className="console-card"><div className="console-top"><div className="dots"><i className="dot"/><i className="dot"/><i className="dot"/></div><span className="mono muted small">RESEARCH // LOCAL QUERY</span></div><div className="console-body"><div className="mono small terminal-line">&gt; query index --mode=local --scope=archive</div><input value={q} onChange={(e: ChangeEvent<HTMLInputElement>)=>setQ(e.target.value)} className="search mono" placeholder="type a topic…" aria-label="Search research index"/>{q&&<div className="terminal-results">{results.length?results.map(r=><Link key={r.id} href={`/documents/${r.slug}`} className="status-row"><span><span className="doc-id mono">{r.id}</span> {r.title}</span><span className="mono muted">OPEN ↗</span></Link>):<div className="muted small" style={{paddingTop:12}}>No local records matched the query.</div>}</div>}<div className="status-row"><span>INDEX</span><span className="status-value mono">LOCAL / MDX</span></div><div className="status-row"><span>RESULTS</span><span className="status-value mono">{q?results.length:'—'}</span></div></div></div>;
}
