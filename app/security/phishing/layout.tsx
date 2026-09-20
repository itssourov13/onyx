import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { createPageMetadata } from '@/lib/site';

export const metadata: Metadata = createPageMetadata('/security/phishing', 'Phishing Analysis — Onyx Archive', 'Local-only defensive URL triage without fetching supplied URLs.');

export default function Layout({ children }: { children: ReactNode }) { return children; }
