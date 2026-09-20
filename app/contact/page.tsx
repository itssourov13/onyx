import { createPageMetadata } from '@/lib/site';
import { PageHero } from '@/components/site';
import ContactForm from '@/components/contact-form';

export const metadata = createPageMetadata('/contact', 'Contact — Onyx Archive', 'A local-only demo contact draft surface.');

export default function Contact(){ return <main><PageHero eyebrow="Contact / RESEARCH DESK" title="Send a signal.">This frontend has no real messaging backend. Drafts stay in the browser until you clear them.</PageHero><section className="section"><div className="container grid-2"><ContactForm/><div className="card"><div className="eyebrow">Boundary</div><h2 className="section-title">No real transport is connected.</h2><p className="card-copy">This surface intentionally does not send email, call an API, upload files or contact an external service. Connect a vetted backend only when you are ready to add server-side validation, rate limiting, CSRF protection and secure data handling.</p><div className="divider"/><div className="mono muted small">CONTACT CHANNEL // LOCAL DRAFT ONLY</div></div></div></section></main>; }
