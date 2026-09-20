import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { Layout } from '@/components/site';
import { getAllContent } from '@/lib/content';
import { getSiteUrl } from '@/lib/site';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: { default: 'Onyx Archive — Privacy Research Terminal', template: '%s — Onyx Archive' },
  description: 'A fictional privacy research archive inspired by onion-service interfaces and underground technical publications.',
  metadataBase: siteUrl,
  alternates: { canonical: siteUrl.toString() },
  openGraph: { title: 'Onyx Archive', description: 'A fictional privacy research terminal.', type: 'website', url: siteUrl.toString() },
  twitter: { card: 'summary_large_image', title: 'Onyx Archive', description: 'A fictional privacy research terminal.' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const entries = getAllContent();
  return <html lang="en"><body><Layout entries={entries}>{children}</Layout></body></html>;
}
