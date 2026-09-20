'use client';

import { useMemo, useState, type ChangeEvent } from 'react';
import { directory } from '@/lib/data';
import Link from 'next/link';
import { StatusPill } from './site';

const categories=['All','Research','Privacy','Security','Documentation','Communications','Open Source','Archives'];

export default function DirectoryExplorer() {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const rows = useMemo(() => directory.filter((item) => {
    const categoryMatch = category === 'All' || item.category === category;
    const haystack = `${item.name} ${item.category} ${item.onion} ${item.description}`.toLowerCase();
    return categoryMatch && haystack.includes(query.trim().toLowerCase());
  }), [category, query]);

  return <>
    <div className="directory-toolbar">
      <input className="search mono" value={query} onChange={(event: ChangeEvent<HTMLInputElement>)=>setQuery(event.target.value)} placeholder="FILTER DIRECTORY // service, category, address" aria-label="Filter directory" />
      <div className="toolbar-count mono">{String(rows.length).padStart(2,'0')} MATCHES</div>
    </div>
    <div className="filters">{categories.map((item)=><button type="button" key={item} className={`filter ${category===item?'active':''}`} aria-pressed={category===item} onClick={()=>setCategory(item)}>{item}</button>)}</div>
    <div className="directory-list">{rows.map((row)=><article className="directory-card" key={row.name}>
      <div className="directory-card-head"><div><div className="doc-id mono">{row.category}</div><h2>{row.name}</h2></div><StatusPill text={row.status}/></div>
      <p className="card-copy">{row.description}</p>
      <div className="address mono">{row.onion}</div>
      <div className="directory-meta"><span className="tag mono">FP {row.fp}</span><span className="tag">Verified {row.verified}</span><span className="tag mono">DEMO SERVICE</span><Link className="btn btn-ghost" href={`/directory/${row.slug}`}>Inspect ↗</Link></div>
    </article>)}</div>
    {!rows.length && <div className="card empty-state"><div className="eyebrow">NO MATCH</div><h2 className="section-title">The directory is quiet.</h2><p className="card-copy">No synthetic service matched the current filter.</p></div>}
  </>;
}
