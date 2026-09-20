'use client';
import { useMemo, useState, type ChangeEvent } from 'react';
import { DocumentCard } from './document-card';
import type { ContentEntry } from '@/lib/content';

const categories=['ALL','SECURITY','RESEARCH','PRIVACY','ENGINEERING','REVERSE','IDEAS'];

export default function ArchiveSearch({ entries }: { entries: ContentEntry[] }){
  const [q,setQ]=useState('');
  const [category,setCategory]=useState('ALL');
  const filtered=useMemo(()=>entries.filter((x)=>{
    const haystack=`${x.id} ${x.title} ${x.category} ${x.description} ${x.tags.join(' ')}`.toLowerCase();
    return (category==='ALL'||x.category===category) && haystack.includes(q.trim().toLowerCase());
  }),[q,category,entries]);
  return <>
    <div className="directory-toolbar"><input className="search mono" value={q} onChange={(e: ChangeEvent<HTMLInputElement>)=>setQ(e.target.value)} placeholder="SEARCH ARCHIVE // browser, supply chain, machine" aria-label="Search archive"/><div className="toolbar-count mono">{String(filtered.length).padStart(2,'0')} MATCHES</div></div>
    <div className="filters">{categories.map((item)=><button type="button" key={item} className={`filter ${category===item?'active':''}`} aria-pressed={category===item} onClick={()=>setCategory(item)}>{item}</button>)}</div>
    <div className="document-grid">{filtered.map(doc=><DocumentCard key={`${doc.kind}:${doc.slug}`} doc={doc}/>)}</div>
    {!filtered.length&&<div className="card empty-state"><div className="eyebrow">NO SIGNAL</div><h2 className="section-title">No records matched.</h2><p className="card-copy">Try a different archive term or category.</p></div>}
  </>;
}
