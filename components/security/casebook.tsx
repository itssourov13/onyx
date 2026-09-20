'use client';

import { useEffect, useMemo, useState } from 'react';

type CaseStatus = 'OPEN' | 'REVIEW' | 'CLOSED';
type CaseSeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH';

type CaseEntry = { id: string; title: string; severity: CaseSeverity; status: CaseStatus; notes: string; evidence: string; createdAt: string };
const KEY = 'onyx.security.casebook.v1';

const seed: CaseEntry[] = [
  { id: 'CASE-DEMO-01', title: 'Missing browser boundary header', severity: 'MEDIUM', status: 'REVIEW', notes: 'Synthetic case showing how a response snapshot can be retained without touching a live target.', evidence: 'Paste a local header snapshot here.', createdAt: '2026-09-20T07:00:00.000Z' },
];

function isCaseEntry(value: unknown): value is CaseEntry {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<CaseEntry>;
  return typeof item.id === 'string' && typeof item.title === 'string' && ['INFO','LOW','MEDIUM','HIGH'].includes(String(item.severity)) && ['OPEN','REVIEW','CLOSED'].includes(String(item.status)) && typeof item.notes === 'string' && typeof item.evidence === 'string' && typeof item.createdAt === 'string';
}

export function Casebook() {
  const [entries, setEntries] = useState<CaseEntry[]>(seed);
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState<CaseSeverity>('LOW');
  const [status, setStatus] = useState<CaseStatus>('OPEN');
  const [notes, setNotes] = useState('');
  const [evidence, setEvidence] = useState('');
  const [ready, setReady] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        setEntries(Array.isArray(parsed) ? parsed.filter(isCaseEntry) : seed);
      }
    } catch {
      setEntries(seed);
    } finally {
      setReady(true);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(entries));
    } catch {
      // Private browsing, disabled storage, or quota exhaustion should not break the local notebook.
    }
  }, [entries, ready]);

  const openCount = useMemo(() => entries.filter((entry) => entry.status !== 'CLOSED').length, [entries]);

  function addCase() {
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    const next: CaseEntry = { id: `CASE-${Date.now().toString(36).toUpperCase()}`, title: cleanTitle, severity, status, notes: notes.trim(), evidence: evidence.trim(), createdAt: new Date().toISOString() };
    setEntries((current) => [next, ...current]);
    setTitle(''); setNotes(''); setEvidence(''); setSeverity('LOW'); setStatus('OPEN');
  }

  function reset() {
    setEntries([]);
    try { window.localStorage.setItem(KEY, JSON.stringify([])); } catch { /* keep in-memory reset */ }
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), demo: true, entries }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'onyx-casebook.json'; anchor.click(); URL.revokeObjectURL(url);
  }

  return <div className="security-tool-stack">
    <div className="security-tool-grid">
      <section className="card">
        <div className="tool-toolbar"><div><div className="eyebrow">LOCAL FINDING</div><h2 className="card-title">Open a synthetic case</h2></div><span className="tag mono" aria-live="polite">{openCount} OPEN</span></div>
        <label className="field-label" htmlFor="case-title">Title</label><input id="case-title" className="text-input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. CSP directive drift" />
        <div className="form-grid-3"><div><label className="field-label" htmlFor="case-severity">Severity</label><select id="case-severity" className="text-input" value={severity} onChange={(event) => setSeverity(event.target.value as CaseSeverity)}>{(['INFO','LOW','MEDIUM','HIGH'] as CaseSeverity[]).map((item)=><option key={item}>{item}</option>)}</select></div><div><label className="field-label" htmlFor="case-status">Status</label><select id="case-status" className="text-input" value={status} onChange={(event) => setStatus(event.target.value as CaseStatus)}>{(['OPEN','REVIEW','CLOSED'] as CaseStatus[]).map((item)=><option key={item}>{item}</option>)}</select></div></div>
        <label className="field-label" htmlFor="case-notes">Notes</label><textarea id="case-notes" className="tool-textarea" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Observation, hypothesis, remediation note…" />
        <label className="field-label" htmlFor="case-evidence">Evidence reference</label><textarea id="case-evidence" className="tool-textarea mono" value={evidence} onChange={(event) => setEvidence(event.target.value)} placeholder="Pasted header line, parser output, or local artifact reference…" />
        <div className="cta-row"><button className="btn btn-primary" type="button" onClick={addCase} disabled={!title.trim()}>Create local case</button><button className="btn btn-ghost" type="button" onClick={exportJson}>Export JSON</button><button className="btn btn-ghost" type="button" onClick={reset} disabled={!entries.length}>Reset</button></div>
        <div className="callout"><strong>Storage boundary:</strong> entries stay in this browser&apos;s localStorage until reset or browser storage is cleared. No server sync is implemented.</div>
      </section>
      <section className="card">
        <div className="eyebrow">CASE STREAM</div>
        <div className="case-stream">{entries.map((entry) => <article className="case-item" key={entry.id}><div className="case-item-top"><span className="mono tiny muted">{entry.id}</span><span className="tag mono">{entry.severity} · {entry.status}</span></div><h3>{entry.title}</h3><p>{entry.notes || 'No notes recorded.'}</p>{entry.evidence && <pre className="case-evidence mono">{entry.evidence}</pre>}<div className="mono tiny muted">{new Date(entry.createdAt).toLocaleString()}</div></article>)}{!entries.length && <div className="empty-state"><div className="eyebrow">EMPTY CASEBOOK</div><p className="muted">Create a local synthetic finding to begin.</p></div>}</div>
      </section>
    </div>
  </div>;
}
