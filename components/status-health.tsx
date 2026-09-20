'use client';

import { useEffect, useState } from 'react';
import { StatusPill } from './site';

type Health = { status: string; demo: boolean; version: string; build: string };

export default function StatusHealth() {
  const [health, setHealth] = useState<Health | null>(null);
  const [state, setState] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/health', { cache: 'no-store', signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('health request failed');
        return response.json() as Promise<Health>;
      })
      .then((payload) => { setHealth(payload); setState(payload.status === 'operational' ? 'online' : 'offline'); })
      .catch(() => setState('offline'));
    return () => controller.abort();
  }, []);

  const label = state === 'checking' ? 'CHECKING' : state === 'online' ? 'OPERATIONAL' : 'UNAVAILABLE';
  return <div className="status-row"><span className="mono">API</span><StatusPill text={label}/>{health && <span className="mono tiny muted">{health.version}</span>}</div>;
}
