import type { Metadata } from 'next';

const DEV_SITE_URL = 'http://localhost:3000';

export function getSiteUrl(): URL {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelUrl = process.env.VERCEL_URL?.trim();
  const source = configured || (vercelUrl ? `https://${vercelUrl}` : undefined);
  if (!source) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('NEXT_PUBLIC_SITE_URL must be configured for production builds outside Vercel.');
    }
    return new URL(DEV_SITE_URL);
  }

  const url = new URL(source);
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error('NEXT_PUBLIC_SITE_URL must use http:// or https://.');
  }
  if (url.search || url.hash) {
    throw new Error('NEXT_PUBLIC_SITE_URL must not contain a query string or hash.');
  }
  url.pathname = url.pathname.replace(/\/+$/, '') || '/';
  return url;
}

export function absoluteUrl(pathname = '/') {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return new URL(path, getSiteUrl()).toString();
}

export function createPageMetadata(pathname: string, title: string, description: string): Metadata {
  const canonical = absoluteUrl(pathname);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, type: 'website', url: canonical },
    twitter: { card: 'summary_large_image', title, description },
  };
}
