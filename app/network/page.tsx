import { createPageMetadata } from '@/lib/site';
import Link from 'next/link';
import { PageHero } from '@/components/site';
import NetworkObservatory from '@/components/network-observatory';
export default function Network(){ return <main><PageHero eyebrow="Network / OBSERVATORY" title="Inspect the fictional layer.">An interactive observatory for synthetic topology, node state and event context. It does not represent live Tor relays, actual routing paths, operator locations or hidden infrastructure.</PageHero><section className="section"><div className="container"><NetworkObservatory/><div className="section-actions"><Link className="btn btn-ghost" href="/network/events">Open event ledger →</Link></div></div></section></main>; }

export const metadata = createPageMetadata('/network', 'Network Observatory — Onyx Archive', 'A fictional synthetic network topology and observatory.');
