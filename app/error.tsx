'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="section"><div className="container"><div className="card error-state"><div className="eyebrow">System / RECOVERY</div><h1 className="section-title">This layer did not render.</h1><p className="card-copy">The route encountered an unexpected rendering error. No application state was changed by this recovery surface.</p><button className="btn btn-primary" onClick={() => reset()}>Retry route</button></div></div></main>;
}
