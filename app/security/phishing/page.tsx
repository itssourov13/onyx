'use client';

import { useEffect, useMemo, useState, type FormEvent, type ChangeEvent } from 'react';
import { PageHero } from '@/components/site';

function inspectUrl(value:string){
  try{
    const url=new URL(value);
    const flags:string[]=[];
    if(url.protocol!=='https:') flags.push('non-HTTPS');
    if(url.hostname.includes('xn--')) flags.push('punycode host');
    if(url.hostname.split('.').length>4) flags.push('deep subdomain');
    if(url.username||url.password) flags.push('embedded credentials');
    if(url.port && !['443','80'].includes(url.port)) flags.push('non-standard port');
    if(url.hostname.length>55) flags.push('long hostname');
    const score=Math.min(100, flags.length*20 + (url.hostname.includes('.')?0:30));
    return {hostname:url.hostname,score,flags,valid:true};
  }catch{return {hostname:'invalid URL',score:100,flags:['invalid URL'],valid:false};}
}

export default function PhishingPage(){
  const [value,setValue]=useState('https://example.test/account/verify');
  const [items,setItems]=useState<string[]>(['https://example.test/account/verify','https://research.example.test/docs']);
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(()=>{ try { const saved=window.sessionStorage.getItem('onyx-phishing-queue'); if(saved){ const parsed=JSON.parse(saved); if(Array.isArray(parsed)) setItems(parsed.filter((x): x is string => typeof x==='string').slice(0,20)); } } catch {} },[]);
  /* eslint-enable react-hooks/set-state-in-effect */
  useEffect(()=>{ try { window.sessionStorage.setItem('onyx-phishing-queue',JSON.stringify(items.slice(0,20))); } catch {} },[items]);
  const result=useMemo(()=>inspectUrl(value),[value]);
  function add(e:FormEvent<HTMLFormElement>){e.preventDefault(); if(!value.trim()) return; setItems(curr=>curr.includes(value.trim())?curr:[value.trim(),...curr].slice(0,20));}
  function remove(item:string){ setItems(curr=>curr.filter(entry=>entry!==item)); }
  return <main>
    <PageHero eyebrow="Security / PHISHING ANALYSIS" title="Inspect the link before you trust it.">A defensive URL triage surface for collecting test links and suspicious indicators. The demo performs local string parsing only: it does not crawl, fetch, redirect to, submit to, or interact with any external URL.</PageHero>
    <section className="section"><div className="container">
      <div className="phishing-layout">
        <div className="card">
          <div className="eyebrow">LOCAL TRIAGE</div><h2 className="section-title">Add a URL</h2>
          <form onSubmit={add} className="phishing-form"><label className="field-label" htmlFor="phishing-url">URL</label><div className="phishing-input-row"><input id="phishing-url" className="text-input mono" value={value} onChange={(e:ChangeEvent<HTMLInputElement>)=>setValue(e.target.value)} placeholder="https://example.test/login"/><button className="btn btn-primary" type="submit">Add link</button></div></form>
          <div className={`triage-score ${result.score>=60?'high':result.score>=20?'watch':'low'}`}><div><span className="eyebrow">HEURISTIC SCORE</span><strong>{result.score}/100</strong></div><div><span className="eyebrow">HOST</span><code>{result.hostname}</code></div></div>
          <div className="flag-list">{(result.flags.length?result.flags:['No obvious heuristic flags']).map(flag=><span className="tag" key={flag}>{flag}</span>)}</div>
          <p className="microcopy">Heuristic scores are intentionally simple and non-authoritative. They are not a verdict that a URL is malicious or safe.</p>
        </div>
        <aside className="card"><div className="section-head compact"><div><div className="eyebrow">QUEUE</div><span className="mono tiny muted">SESSION STORAGE</span></div><button type="button" className="btn btn-ghost" onClick={()=>setItems([])}>Clear queue</button></div><div className="security-queue">{items.map((item,i)=><div className="queue-item" key={`${item}-${i}`}><span className="mono tiny">{String(i+1).padStart(2,'0')}</span><code>{item}</code><span className="tag">LOCAL</span><button type="button" className="queue-remove" aria-label={`Remove ${item}`} onClick={()=>remove(item)}>×</button></div>)}</div><div className="callout" style={{marginTop:18}}><strong>Privacy boundary:</strong> URLs remain in this browser session using sessionStorage. No remote analysis service is called.</div></aside>
      </div>
    </div></section>
  </main>;
}

