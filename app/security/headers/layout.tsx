import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { createPageMetadata } from '@/lib/site';

export const metadata: Metadata = createPageMetadata('/security/headers', 'Header Bench — Onyx Archive', 'Documentation fixture for the intended browser security header profile.');

export default function Layout({ children }: { children: ReactNode }) { return children; }
