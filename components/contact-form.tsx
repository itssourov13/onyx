'use client';

import { useEffect, useState, type FormEvent } from 'react';

const STORAGE_KEY = 'onyx-contact-draft-v1';
type Draft = { name: string; email: string; message: string };
const emptyDraft: Draft = { name: '', email: '', message: '' };

export default function ContactForm() {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [saved, setSaved] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<Draft>;
      setDraft({ name: parsed.name ?? '', email: parsed.email ?? '', message: parsed.message ?? '' });
    } catch {
      setDraft(emptyDraft);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    setSaved(true);
  }

  function clear() {
    window.localStorage.removeItem(STORAGE_KEY);
    setDraft(emptyDraft);
    setSaved(false);
  }

  return <form className="card" onSubmit={save}>
    <div className="eyebrow">Local research draft</div>
    <p className="microcopy">Nothing is transmitted. This form only saves a draft in this browser until you clear it.</p>
    <label className="small muted" htmlFor="name">Name</label>
    <input id="name" autoComplete="name" className="search" value={draft.name} onChange={(event) => update('name', event.target.value)} placeholder="Your name" style={{margin:'7px 0 14px'}}/>
    <label className="small muted" htmlFor="email">Email</label>
    <input id="email" type="email" autoComplete="email" className="search" value={draft.email} onChange={(event) => update('email', event.target.value)} placeholder="you@example.com" style={{margin:'7px 0 14px'}}/>
    <label className="small muted" htmlFor="message">Message</label>
    <textarea id="message" className="search" rows={7} value={draft.message} onChange={(event) => update('message', event.target.value)} placeholder="Research note, feedback, or collaboration idea…" style={{margin:'7px 0 14px',resize:'vertical'}}/>
    <div className="cta-row">
      <button className="btn btn-primary" type="submit">Save draft locally</button>
      <button className="btn btn-ghost" type="button" onClick={clear}>Clear draft</button>
      {saved && <span className="tag" role="status" aria-live="polite">LOCAL DRAFT SAVED</span>}
    </div>
  </form>;
}
