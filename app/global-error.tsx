'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '32px', background: '#0b0b0b', color: '#f2eee7', fontFamily: 'system-ui, sans-serif' }}>
          <section style={{ width: 'min(720px, 100%)', border: '1px solid rgba(203,163,107,.28)', padding: '32px', background: '#111' }}>
            <p style={{ letterSpacing: '.12em', textTransform: 'uppercase', fontSize: '12px', opacity: .65 }}>System / Global Recovery</p>
            <h1 style={{ fontSize: 'clamp(32px, 6vw, 56px)', lineHeight: 1.05, margin: '12px 0' }}>The archive did not initialize.</h1>
            <p style={{ lineHeight: 1.7, opacity: .76 }}>The application shell hit an unrecoverable rendering error. Retry to initialize the interface again.</p>
            <button onClick={() => reset()} style={{ marginTop: '20px', padding: '12px 16px', border: '1px solid rgba(203,163,107,.45)', background: 'transparent', color: 'inherit', cursor: 'pointer' }}>Retry initialization</button>
          </section>
        </main>
      </body>
    </html>
  );
}
