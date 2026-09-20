'use client';

import { useMemo, useState } from 'react';
import { inspectSecurityHeaders, parseHttp } from '@/lib/security-lab';

const SAMPLE_RESPONSE = `HTTP/1.1 200 OK\nContent-Type: text/html; charset=utf-8\nContent-Security-Policy: default-src 'self'; object-src 'none'\nX-Content-Type-Options: nosniff\nReferrer-Policy: strict-origin-when-cross-origin\n\n<html>demo</html>`;

export function HttpInspector() {
  const [raw, setRaw] = useState(SAMPLE_RESPONSE);
  const parsed = useMemo(() => parseHttp(raw), [raw]);
  const observations = useMemo(() => parsed.kind === 'RESPONSE' ? inspectSecurityHeaders(parsed.headers) : [], [parsed]);

  return <div className="security-tool-stack">
    <div className="card security-tool-editor">
      <div className="tool-toolbar"><span className="eyebrow">LOCAL PARSER</span><button className="btn btn-ghost" type="button" onClick={() => setRaw(SAMPLE_RESPONSE)}>Load response sample</button></div>
      <label className="field-label" htmlFor="http-raw">Raw HTTP message</label>
      <textarea id="http-raw" className="tool-textarea mono" value={raw} onChange={(event) => setRaw(event.target.value)} spellCheck={false} />
      <div className="tool-foot mono tiny muted">NO NETWORK · MAX INPUT 64 KB · RESPONSE HEADERS ARE ANALYZED LOCALLY</div>
    </div>
    <div className="security-tool-grid" aria-live="polite" aria-atomic="true">
      <div className="card">
        <div className="eyebrow">MESSAGE</div>
        <div className="result-line"><span>Kind</span><strong>{parsed.kind}</strong></div>
        <div className="result-line"><span>Start line</span><code>{parsed.startLine || '—'}</code></div>
        <div className="result-line"><span>Headers</span><strong>{parsed.headers.length}</strong></div>
        <div className="result-line"><span>Body bytes</span><strong>{new TextEncoder().encode(parsed.body).length}</strong></div>
        {parsed.invalidLines.length > 0 && <div className="callout"><strong>Unparsed lines:</strong> {parsed.invalidLines.join(' · ')}</div>}
      </div>
      <div className="card">
        <div className="eyebrow">HEADER REGRESSION SNAPSHOT</div>
        {parsed.kind !== 'RESPONSE' ? <p className="section-copy">Paste an HTTP response to run the expected browser-boundary checks.</p> : <div className="finding-list">{observations.map((item) => <div key={item.title} className={`finding ${item.tone}`}><div><strong>{item.title}</strong><p>{item.detail}</p></div></div>)}</div>}
      </div>
    </div>
    <div className="card">
      <div className="eyebrow">HEADERS</div>
      <div className="header-snapshot">{parsed.headers.length ? parsed.headers.map((header, index) => <div className="header-snapshot-row mono" key={`${header.name}-${index}`}><span>{header.name}</span><code>{header.value}</code></div>) : <span className="muted small">No headers parsed.</span>}</div>
    </div>
  </div>;
}
