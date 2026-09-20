import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { createPageMetadata } from '@/lib/site';

export const metadata: Metadata = createPageMetadata('/lab', 'Lab — Onyx Archive', 'Browser-local research tools and synthetic inspection modules.');

export default function Layout({ children }: { children: ReactNode }) { return children; }
