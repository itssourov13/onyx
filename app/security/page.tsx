import { createPageMetadata } from '@/lib/site';
import Link from 'next/link';
import { PageHero } from '@/components/site';

const cards = [
  { title: 'Isolated Vulnerability Lab', href: '/security/vulnerabilities', label: 'SAFE / SANDBOXED', text: 'Practice against deliberately vulnerable fixtures that are isolated from the main application and use synthetic data only.' },
  { title: 'Phishing Analysis', href: '/security/phishing', label: 'DEFENSIVE / URL TRIAGE', text: 'Add suspicious or test URLs to a local analysis queue. The demo never fetches or submits the URLs.' },
  { title: 'Request Inspector', href: '/security/requests', label: 'LOCAL / HTTP PARSER', text: 'Paste a request or response and inspect headers and browser-boundary expectations without sending traffic.' },
  { title: 'Cookie Analyzer', href: '/security/cookies', label: 'LOCAL / SET-COOKIE', text: 'Review cookie attributes, prefixes and contradictory combinations from pasted response headers.' },
  { title: 'Encoding Lab', href: '/security/encodings', label: 'LOCAL / TRANSFORMS', text: 'Work with URL, UTF-8 Base64 and hexadecimal encoding without any remote decoder.' },
  { title: 'Header Bench', href: '/security/headers', label: 'WEB HARDENING', text: 'Inspect the intended browser-facing security header profile and compare a pasted response snapshot.' },
  { title: 'Security Notes', href: '/security/notes', label: 'FIELD NOTES', text: 'A curated stream of application-security notes, testing methodology and defensive observations.' },
  { title: 'Casebook', href: '/security/casebook', label: 'LOCAL / FINDINGS', text: 'Keep synthetic findings and evidence references in browser-local storage with reset and JSON export.' },
] as const;

export default function SecurityHub() {
  return <main>
    <PageHero eyebrow="Security / CONTROL ROOM" title="Test ideas without touching the archive.">A dedicated cybersecurity layer for Onyx: isolated labs, defensive URL triage, browser security controls and technical notes. The security section is intentionally separated from the publication surface.</PageHero>
    <section className="section"><div className="container">
      <div className="security-banner card">
        <div><div className="eyebrow">Boundary</div><h2 className="section-title" style={{marginTop:8}}>The lab is not the archive.</h2><p className="section-copy">All practice fixtures use synthetic state. Vulnerability demos run inside sandboxed documents or deterministic local simulators and cannot write to the main Onyx data layer.</p></div>
        <span className="tag status-tag online"><span className="signal"><i/>ISOLATED</span></span>
      </div>
      <div className="security-route-grid">
        {cards.map((card) => <Link href={card.href} className="security-route-card card" key={card.href}><div className="security-route-top"><span className="eyebrow">{card.label}</span><span className="mono muted">↗</span></div><h2>{card.title}</h2><p>{card.text}</p><span className="mono tiny muted">OPEN MODULE</span></Link>)}
      </div>
    </div></section>
  </main>;
}

export const metadata = createPageMetadata('/security', 'Security Control Room — Onyx Archive', 'Isolated defensive security tools and synthetic practice fixtures.');
