'use client';

import { useMemo, useState } from 'react';
import { parseCookieBatch } from '@/lib/security-lab';

const SAMPLE = `__Host-demo_session=synthetic-value; Path=/; Secure; HttpOnly; SameSite=Strict\nmarketing_id=demo; Path=/; SameSite=None`;

export function CookieAnalyzer() {
  const [raw, setRaw] = useState(SAMPLE);
  const cookies = useMemo(() => parseCookieBatch(raw), [raw]);
  const warnings = cookies.reduce((count, cookie) => count + cookie.findings.filter((item) => item.tone === 'warn').length, 0);

  return <div className="security-tool-stack">
    <div className="card security-tool-editor">
      <div className="tool-toolbar"><span className="eyebrow">SET-COOKIE PARSER</span><button className="btn btn-ghost" type="button" onClick={() => setRaw(SAMPLE)}>Load sample set</button></div>
      <label className="field-label" htmlFor="cookie-input">Set-Cookie lines</label>
      <textarea id="cookie-input" className="tool-textarea mono" value={raw} onChange={(event) => setRaw(event.target.value)} spellCheck={false} />
      <div className="tool-foot mono tiny muted">NO STORAGE · NO COOKIE ACCESS · PARSES PASTED TEXT ONLY</div>
    </div>
    <div className="stat-grid" aria-live="polite" aria-atomic="true"><div className="stat"><span className="stat-label">COOKIES</span><strong className="stat-number">{cookies.length}</strong></div><div className="stat"><span className="stat-label">WARNINGS</span><strong className="stat-number">{warnings}</strong></div><div className="stat"><span className="stat-label">INPUT</span><strong className="stat-number">LOCAL</strong></div><div className="stat"><span className="stat-label">MODE</span><strong className="stat-number">STATIC</strong></div></div>
    <div className="cookie-list">{cookies.map((cookie, index) => <article className="card cookie-card" key={`${cookie.name}-${index}`}><div className="cookie-card-head"><div><div className="eyebrow">COOKIE</div><h2>{cookie.name}</h2></div><span className="tag mono">{Object.keys(cookie.attributes).length} ATTR</span></div><div className="cookie-value mono">{cookie.value || '(empty value)'}</div><div className="finding-list">{cookie.findings.map((finding, index) => <div className={`finding ${finding.tone}`} key={`${finding.title}-${index}`}><div><strong>{finding.title}</strong><p>{finding.detail}</p></div></div>)}</div></article>)}{!cookies.length && <div className="card muted small">No parseable Set-Cookie lines yet.</div>}</div>
  </div>;
}
