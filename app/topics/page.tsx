import { createPageMetadata } from '@/lib/site';
import Link from 'next/link';
import { PageHero } from '@/components/site';
import { getTopicTags } from '@/lib/content';

export default function Topics() {
  const tags = getTopicTags();
  return <main><PageHero eyebrow="Topics / INDEX" title="Browse the corpus by signal." >Tags are generated from the same MDX metadata used by the archive, research, intelligence and security-note routes.</PageHero><section className="section"><div className="container"><div className="meta topic-list">{tags.map((tag)=><Link className="tag topic-tag" key={tag} href={`/topics/${encodeURIComponent(tag)}`}>{tag}</Link>)}</div></div></section></main>;
}

export const metadata = createPageMetadata('/topics', 'Topics — Onyx Archive', 'Browse the fictional corpus by shared MDX tags.');
