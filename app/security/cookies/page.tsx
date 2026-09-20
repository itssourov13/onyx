import { createPageMetadata } from '@/lib/site';
import { PageHero } from '@/components/site';
import { CookieAnalyzer } from '@/components/security/cookie-analyzer';

export default function SecurityCookiesPage(){
  return <main><PageHero eyebrow="Security / COOKIE ANALYZER" title="Make cookie policy visible.">Parse pasted <span className="mono">Set-Cookie</span> lines, inspect security attributes and surface contradictory combinations without reading the browser&apos;s cookie jar.</PageHero><section className="section"><div className="container"><CookieAnalyzer/><div className="callout"><strong>Scope:</strong> the analyzer works on pasted header text only. It does not access <span className="mono">document.cookie</span> or modify browser cookies.</div></div></section></main>;
}

export const metadata = createPageMetadata('/security/cookies', 'Cookie Analyzer — Onyx Archive', 'Local Set-Cookie attribute and prefix analysis.');
