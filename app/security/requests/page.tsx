import { createPageMetadata } from '@/lib/site';
import { PageHero } from '@/components/site';
import { HttpInspector } from '@/components/security/http-inspector';

export default function SecurityRequestsPage(){
  return <main><PageHero eyebrow="Security / REQUEST INSPECTOR" title="Read the boundary without sending a request.">A local HTTP request/response parser for examining start lines, headers, body size and expected browser-boundary controls. Nothing is fetched, proxied or replayed.</PageHero><section className="section"><div className="container"><HttpInspector/><div className="callout"><strong>Isolation:</strong> this module accepts pasted text only. It has no target URL field, no fetch action and no network client.</div></div></section></main>;
}

export const metadata = createPageMetadata('/security/requests', 'Request Inspector — Onyx Archive', 'Local parsing of synthetic HTTP requests and responses.');
