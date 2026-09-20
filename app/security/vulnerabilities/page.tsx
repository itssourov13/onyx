'use client';

import { useMemo, useState } from 'react';
import { PageHero } from '@/components/site';
import { VulnerabilityFixture } from '@/components/security/vulnerability-fixture';

const scenarios = [
  { id: 'dom-reflection', title: 'DOM Reflection', severity: 'LOW', cwe: 'CWE-79', mode: 'BROWSER-ONLY', description: 'A toy page reflects a query value into a sandboxed DOM fixture. Nothing in the parent application is reachable.' },
  { id: 'path-traversal', title: 'Path Traversal Parser', severity: 'MEDIUM', cwe: 'CWE-22', mode: 'SIMULATOR', description: 'A deterministic file resolver demonstrates traversal parsing against a synthetic file tree with no filesystem access.' },
  { id: 'authz-mismatch', title: 'Authorization Mismatch', severity: 'MEDIUM', cwe: 'CWE-862', mode: 'SIMULATOR', description: 'A local authorization matrix lets you probe role/resource combinations without a real account or backend.' },
] as const;

export default function VulnerabilitiesPage(){
  const [selected, setSelected] = useState<string>(scenarios[0].id);
  const active = useMemo(() => scenarios.find(s => s.id === selected) ?? scenarios[0], [selected]);

  return <main>
    <PageHero eyebrow="Security / VULNERABILITY LAB" title="Deliberately break the fixture, not the site.">These scenarios are designed for pentesting practice and AppSec experimentation. They use synthetic state only. The browser-only DOM case runs inside a sandboxed iframe; the other cases are deterministic simulators with no filesystem, database or production-state access.</PageHero>
    <section className="section"><div className="container">
      <div className="security-lab-layout">
        <aside className="card security-scenario-list" aria-label="Vulnerability scenarios">
          <div className="eyebrow">SCENARIOS</div>
          <div className="security-scenario-items">{scenarios.map((scenario) => <button key={scenario.id} type="button" className={`security-scenario ${active.id===scenario.id?'active':''}`} onClick={()=>setSelected(scenario.id)}><span><strong>{scenario.title}</strong><small>{scenario.cwe} · {scenario.mode}</small></span><span className="tag">{scenario.severity}</span></button>)}</div>
          <div className="divider"/>
          <p className="microcopy">Boundary rule: labs may simulate attacker-controlled input, but they do not accept credentials, persist findings, execute server-side commands, or write to Onyx content.</p>
        </aside>
        <div className="security-lab-main"><VulnerabilityFixture scenario={active}/></div>
      </div>
    </div></section>
  </main>;
}

