import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { createPageMetadata } from '@/lib/site';

export const metadata: Metadata = createPageMetadata('/security/vulnerabilities', 'Vulnerability Lab — Onyx Archive', 'Sandboxed synthetic vulnerability practice fixtures.');

export default function Layout({ children }: { children: ReactNode }) { return children; }
