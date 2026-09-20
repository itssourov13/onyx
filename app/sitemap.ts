import type { MetadataRoute } from 'next';
import { directory, networkEvents, securityNav, siteBuild } from '@/lib/data';
import { getEntries, getTopicTags } from '@/lib/content';
import { absoluteUrl } from '@/lib/site';

const paths = ['/','/archive','/research','/intelligence','/network','/network/events','/documents','/directory','/lab','/about','/status','/contact','/topics','/security'];

export default function sitemap(): MetadataRoute.Sitemap {
  const reviewedAt = new Date(siteBuild.reviewedAt);
  const content = (['documents','research','intelligence','security-notes'] as const).flatMap((kind) => getEntries(kind));
  const routeFor = { documents: '/documents', research: '/research', intelligence: '/intelligence', 'security-notes': '/security/notes' } as const;
  return [
    ...paths.map((path) => ({ url: absoluteUrl(path), lastModified: reviewedAt })),
    ...securityNav.map(([, path]) => ({ url: absoluteUrl(path), lastModified: reviewedAt })),
    ...content.map((entry) => ({ url: absoluteUrl(`${routeFor[entry.kind]}/${entry.slug}`), lastModified: new Date(entry.updated ?? entry.date) })),
    ...directory.map((item) => ({ url: absoluteUrl(`/directory/${item.slug}`), lastModified: reviewedAt })),
    ...networkEvents.map((event) => ({ url: absoluteUrl(`/network/events/${event.id.toLowerCase()}`), lastModified: reviewedAt })),
    ...getTopicTags().map((tag) => ({ url: absoluteUrl(`/topics/${encodeURIComponent(tag)}`), lastModified: reviewedAt })),
  ];
}
