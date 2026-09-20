'use client';

import { useMemo, useState } from 'react';
import { decodeBase64Utf8, decodeHexUtf8, encodeBase64Utf8, encodeHexUtf8 } from '@/lib/security-lab';

type Mode = 'url' | 'base64' | 'hex';

const samples: Record<Mode, string> = { url: 'https://demo.local/search?q=privacy research', base64: 'Onyx / local fixture / αβγ', hex: 'Onyx Archive — demo' };

export function EncodingLab() {
  const [mode, setMode] = useState<Mode>('url');
  const [direction, setDirection] = useState<'encode' | 'decode'>('encode');
  const [value, setValue] = useState(samples.url);
  const result = useMemo(() => {
    try {
      if (mode === 'url') return direction === 'encode' ? encodeURIComponent(value) : decodeURIComponent(value);
      if (mode === 'base64') return direction === 'encode' ? encodeBase64Utf8(value) : decodeBase64Utf8(value);
      return direction === 'encode' ? encodeHexUtf8(value) : decodeHexUtf8(value);
    } catch (error) {
      return `ERROR: ${error instanceof Error ? error.message : 'Unable to decode input.'}`;
    }
  }, [direction, mode, value]);

  const loadSample = () => setValue(samples[mode]);

  return <div className="security-tool-stack">
    <div className="card security-tool-editor">
      <div className="tool-toolbar"><div className="tool-tabs">{(['url','base64','hex'] as Mode[]).map((item) => <button className={`filter ${mode===item?'active':''}`} type="button" key={item} aria-pressed={mode===item} onClick={() => { setMode(item); setValue(samples[item]); }}>{item.toUpperCase()}</button>)}</div><button className="btn btn-ghost" type="button" onClick={loadSample}>Load sample</button></div>
      <div className="filters compact-filters"><button className={`filter ${direction==='encode'?'active':''}`} type="button" aria-pressed={direction==='encode'} onClick={() => setDirection('encode')}>ENCODE</button><button className={`filter ${direction==='decode'?'active':''}`} type="button" aria-pressed={direction==='decode'} onClick={() => setDirection('decode')}>DECODE</button></div>
      <label className="field-label" htmlFor="encoding-input">Input</label>
      <textarea id="encoding-input" className="tool-textarea mono" value={value} onChange={(event) => setValue(event.target.value)} spellCheck={false} />
    </div>
    <div className="card encoding-output"><div className="eyebrow">RESULT</div><pre className="mono">{result}</pre><div className="tool-foot mono tiny muted">UTF-8 SAFE · NO EXTERNAL SERVICE · CLIENT-SIDE ONLY</div></div>
    <div className="grid-3"><div className="card"><div className="eyebrow">URL</div><p className="card-copy">Component encoding for query or path fragments; decoding expects valid percent-encoding.</p></div><div className="card"><div className="eyebrow">BASE64</div><p className="card-copy">UTF-8 aware Base64 conversion using browser Web APIs rather than ASCII-only helpers.</p></div><div className="card"><div className="eyebrow">HEX</div><p className="card-copy">UTF-8 byte-to-hex conversion with strict even-length hexadecimal decoding.</p></div></div>
  </div>;
}
