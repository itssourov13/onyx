'use client';

import { useMemo, useState, type ChangeEvent } from 'react';
import { labModules } from '@/lib/data';
import { PageHero } from '@/components/site';
import { SignalTimeline } from '@/components/timeline';

async function digest(value: string) { const bytes=new TextEncoder().encode(value); const hash=await crypto.subtle.digest('SHA-256',bytes); return Array.from(new Uint8Array(hash)).map((v)=>v.toString(16).padStart(2,'0')).join(''); }

export default function Lab(){
  const [value,setValue]=useState('Information does not disappear. It moves.');
  const [hash,setHash]=useState('');
  const [busy,setBusy]=useState(false);
  const wordCount=useMemo(()=>value.trim()?value.trim().split(/\s+/).length:0,[value]);
  async function calculate(){setBusy(true);try{setHash(await digest(value));}finally{setBusy(false);}}
  return <main><PageHero eyebrow="Lab / LOCAL DEMOS" title="Small tools for quiet inspection.">This is the beginning of the deeper research layer. Modules are local and fictional: they demonstrate product behavior without uploading text or connecting to hidden services.</PageHero>
    <section className="section"><div className="container grid-2"><div className="lab-module-grid">{labModules.map((module)=><article className="card" key={module.id}><div className="doc-id mono">{module.id}</div><div className="lab-card-head"><h2 className="card-title">{module.name}</h2><span className="tag mono">{module.status}</span></div><p className="card-copy">{module.description}</p></article>)}</div><div className="card lab-console"><div className="eyebrow">Current session</div><div className="status-row"><span>EXECUTION</span><span className="status-value mono">BROWSER ONLY</span></div><div className="status-row"><span>REQUESTS</span><span className="status-value mono">0 EXTERNAL</span></div><div className="status-row"><span>RETENTION</span><span className="status-value mono">SESSION</span></div><div className="status-row"><span>NETWORK</span><span className="status-value mono">NOT REQUIRED</span></div><p className="card-copy">Product demos can be transparent about their boundaries. Real security properties must still be verified outside the interface.</p></div></div></section>
    <section className="section"><div className="container grid-2"><div className="card"><div className="eyebrow">LAB-01 / INTEGRITY DESK</div><h2 className="section-title">Local fingerprinting</h2><p className="section-copy">Compute a SHA-256 digest in the browser. The text below never leaves this page.</p><textarea className="search" rows={9} value={value} onChange={(e: ChangeEvent<HTMLTextAreaElement>)=>{setValue(e.target.value);setHash('')}} aria-label="Text to fingerprint"/><div className="cta-row"><button className="btn btn-primary" onClick={calculate} disabled={busy}>{busy?'Calculating…':'Calculate SHA-256'}</button><span className="tag mono">{wordCount} WORDS</span></div>{hash&&<div className="address mono" style={{marginTop:14}}>{hash}</div>}</div><div className="card"><div className="eyebrow">LAB-03 / SIGNAL TIMELINE</div><h2 className="section-title">Recent synthetic events.</h2><SignalTimeline/></div></div></section>
  </main>;
}

