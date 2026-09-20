'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageHero } from '@/components/site';

const controls = [
  ['Content-Security-Policy','Restricts executable content, embeds and external connections.'],
  ['X-Frame-Options','Prevents the application from being embedded as a framing target.'],
  ['Referrer-Policy','Limits URL information sent to other origins.'],
  ['Permissions-Policy','Turns off unnecessary browser capabilities.'],
  ['X-Content-Type-Options','Prevents MIME sniffing of responses.'],
  ['Strict-Transport-Security','Requests HTTPS-only access after the policy is established.'],
] as const;

export default function HeaderBench() {
  const [active, setActive] = useState<string>(controls[0][0]);
  const current = controls.find(([name]) => name === active) ?? controls[0];

  return (
    <main>
      <PageHero eyebrow="Security / HEADER BENCH" title="Make the browser boundary visible.">
        A fixture inspector for Onyx&apos;s intended production security headers. Values shown here are documentation fixtures; the page is not reading the deployed response headers from the network.
      </PageHero>
      <section className="section">
        <div className="container">
          <div className="header-bench">
            <div className="card header-control-list">
              {controls.map(([name]) => (
                <button
                  type="button"
                  key={name}
                  className={`header-control ${active === name ? 'active' : ''}`}
                  onClick={() => setActive(name)}
                >
                  <span>{name}</span>
                  <small>EXPECTED</small>
                </button>
              ))}
            </div>
            <div className="card header-control-detail">
              <div className="eyebrow">CONTROL</div>
              <h2>{current[0]}</h2>
              <p className="section-copy">{current[1]}</p>
              <div className="header-code mono">{current[0]}: ENFORCED</div>
              <div className="callout">
                <strong>Verification note:</strong> use a real deployment response check during final hardening. This module is a design and documentation surface, not evidence of a deployed header.
              </div>
            </div>
          </div>
          <div className="callout">
            <strong>Live snapshot workflow:</strong> paste a response into{' '}
            <Link href="/security/requests" style={{ textDecoration: 'underline' }}>Request Inspector</Link>{' '}
            to run the same local header-presence checks against an actual captured message.
          </div>
        </div>
      </section>
    </main>
  );
}

