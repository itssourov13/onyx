'use client';

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent } from 'react';
import Link from 'next/link';
import type { ContentEntry } from '@/lib/content';
import { commandRoutes } from '@/lib/data';

export function CommandPalette({ onClose, entries }: { onClose: () => void; entries: ContentEntry[] }) {
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const normalized = q.trim().toLowerCase();
  const results = useMemo(() => {
    const routes = commandRoutes
      .filter((item) => `${item.label} ${item.href}`.toLowerCase().includes(normalized))
      .map((item) => ({ ...item, subtitle: item.href }));
    const content = entries
      .filter((item) => `${item.id} ${item.title} ${item.category} ${item.description} ${item.tags.join(' ')}`.toLowerCase().includes(normalized))
      .slice(0, 8)
      .map((item) => ({
        label: item.title,
        href: item.kind === 'documents' ? `/documents/${item.slug}` : item.kind === 'research' ? `/research/${item.slug}` : item.kind === 'intelligence' ? `/intelligence/${item.slug}` : `/security/notes/${item.slug}`,
        type: item.kind === 'documents' ? 'DOCUMENT' as const : item.kind === 'research' ? 'RESEARCH' as const : item.kind === 'intelligence' ? 'INTELLIGENCE' as const : 'SECURITY NOTE' as const,
        subtitle: `${item.id} · ${item.category}`,
      }));
    return [...routes, ...content].slice(0, 14);
  }, [entries, normalized]);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="command-overlay" role="dialog" aria-modal="true" aria-label="Site command search" onKeyDown={(event: ReactKeyboardEvent<HTMLDivElement>)=>{
      if(event.key!=='Tab') return;
      const focusables=Array.from(event.currentTarget.querySelectorAll<HTMLElement>('input, a, button:not([disabled])'));
      if(!focusables.length) return;
      const first=focusables[0]; const last=focusables[focusables.length-1];
      if(event.shiftKey && document.activeElement===first){ event.preventDefault(); last.focus(); }
      else if(!event.shiftKey && document.activeElement===last){ event.preventDefault(); first.focus(); }
    }} onMouseDown={(event: MouseEvent<HTMLDivElement>) => { if (event.currentTarget === event.target) onClose(); }}>
      <div className="command-box">
        <div className="command-input-row">
          <span className="mono command-prompt">&gt;_</span>
          <input ref={inputRef} value={q} onChange={(event: ChangeEvent<HTMLInputElement>) => setQ(event.target.value)} placeholder="Search routes, documents, research…" aria-label="Search site" />
          <kbd>ESC</kbd>
        </div>
        <div className="command-list">
          {results.map((item) => (
            <Link onClick={onClose} key={`${item.type}-${item.href}-${item.label}`} href={item.href}>
              <span><strong>{item.label}</strong><small>{item.subtitle}</small></span>
              <span className="mono command-kind">{item.type}</span>
            </Link>
          ))}
          {!results.length && <div className="command-empty"><div className="eyebrow">NO MATCH</div><p>Try a route, document ID, research topic or category.</p></div>}
        </div>
        <div className="command-footer mono">LOCAL INDEX // NO THIRD-PARTY SEARCH</div>
      </div>
    </div>
  );
}
