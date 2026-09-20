import Link from 'next/link';
import type { AnchorHTMLAttributes, BlockquoteHTMLAttributes, HTMLAttributes } from 'react';
import { evaluate } from 'next-mdx-remote-client/rsc';
import type { TocItem } from 'remark-flexible-toc';
import remarkGfm from 'remark-gfm';
import remarkFlexibleToc from 'remark-flexible-toc';
import remarkMdxRemoveExpressions from 'remark-mdx-remove-expressions';
import remarkMdxRemoveEsm from 'remark-mdx-remove-esm';
import rehypeSlug from 'rehype-slug';
import rehypeSanitize from 'rehype-sanitize';
import type { ContentEntry, ContentSource } from '@/lib/content';

const mdxComponents = {
  a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const href = props.href ?? '';
    if (href.startsWith('/')) return <Link {...props} href={href} />;
    try {
      const parsed = new URL(href);
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return <span>{props.children}</span>;
    } catch {
      return <span>{props.children}</span>;
    }
    return <a {...props} target="_blank" rel="noreferrer noopener" />;
  },
  pre: (props: HTMLAttributes<HTMLPreElement>) => <pre {...props} className="mdx-code" />,
  blockquote: (props: BlockquoteHTMLAttributes<HTMLQuoteElement>) => <blockquote {...props} className="mdx-quote" />,
};

type Scope = { toc?: TocItem[] };
type Props = { entry: ContentEntry & { source: string }; sources?: ContentSource[] };

function TableOfContents({ toc = [] }: { toc?: TocItem[] }) {
  if (!toc.length) return null;
  return <nav className="toc" aria-label="Table of contents"><div className="eyebrow">Contents</div><ol>{toc.map((item) => <li key={item.href} className={`toc-depth-${item.depth}`}><a href={item.href}>{item.value}</a></li>)}</ol></nav>;
}

function Sources({ sources = [] }: { sources?: ContentSource[] }) {
  if (!sources.length) return null;
  return <section className="mdx-sources" aria-labelledby="sources-heading"><div id="sources-heading" className="eyebrow">References</div><ol>{sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer noopener">{source.label}</a></li>)}</ol></section>;
}

export async function MdxReader({ entry, sources }: Props) {
  const options = {
    parseFrontmatter: true,
    disableImports: true,
    disableExports: true,
    mdxOptions: {
      remarkPlugins: [
        remarkGfm,
        remarkMdxRemoveEsm,
        remarkMdxRemoveExpressions,
        remarkFlexibleToc,
      ],
      rehypePlugins: [rehypeSlug, rehypeSanitize],
    },
    vfileDataIntoScope: 'toc' as const,
  };
  const { content, scope, error } = await evaluate<ContentEntry, Scope>({ source: entry.source, options, components: mdxComponents });
  if (error) return <div className="card prose"><p>Unable to render this document.</p><p className="mono muted tiny">CONTENT COMPILATION ERROR</p></div>;

  return <><div className="reading-layout"><article className="card prose document-reader"><div className="document-reader-meta"><span className="tag">{entry.classification ?? entry.state ?? entry.category}</span><span className="mono muted">{entry.date} · {entry.readTime}</span></div>{content}<Sources sources={sources ?? entry.sources}/><div className="document-footnote mono">{entry.id} {'// DEMO CONTENT RECORD'}</div></article><aside className="reader-aside"><div className="card sticky-card"><TableOfContents toc={scope.toc}/></div><div className="card" style={{marginTop:12}}><div className="eyebrow">Metadata</div><div className="status-row"><span>ID</span><span className="status-value mono">{entry.id}</span></div><div className="status-row"><span>AUTHOR</span><span className="status-value">{entry.author}</span></div><div className="status-row"><span>CATEGORY</span><span className="status-value">{entry.category}</span></div><div className="meta">{entry.tags.map((tag) => <Link className="tag" href={`/topics/${encodeURIComponent(tag)}`} key={tag}>{tag}</Link>)}</div></div></aside></div></>;
}
