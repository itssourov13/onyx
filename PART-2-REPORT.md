# Onyx Archive — Part 2 Implementation Report

Date: 2026-09-20

## Scope

Part 2 followed the audit roadmap's content-platform phase. The homepage visual direction was intentionally preserved. Work focused on moving editorial content into a reusable, typed MDX corpus and making every major content surface deep-linkable.

## Implemented

### 1. MDX corpus
- `content/documents/` — 6 records
- `content/research/` — 6 records
- `content/intelligence/` — 5 records
- `content/security-notes/` — 4 records
- 21 total MDX records.

Every record carries structured metadata for ID, title, description, date, author, category, reading time, classification/state and tags. Reference metadata is included where useful.

### 2. Content loader
`lib/content.ts` is the server-side content boundary. It:
- reads only known local content directories;
- extracts typed frontmatter;
- exposes deterministic entry lists and single-record lookup;
- calculates cross-corpus related records by shared tags;
- derives the topic index from the same metadata.

### 3. MDX reader
`components/mdx-reader.tsx` provides the shared document-reading surface.
- React Server Component MDX evaluation.
- GFM support.
- generated heading IDs and table of contents.
- metadata and tag presentation.
- reference/source section.
- local MDX imports and exports disabled.
- external links open with `noopener noreferrer`.

### 4. Deep routes
- `/documents/[id]`
- `/research/[slug]`
- `/intelligence/[id]`
- `/security/notes/[id]`

All four collections now render their actual MDX source instead of route-local body switches.

### 5. Topics
- `/topics`
- `/topics/[tag]`

Topics are derived from the MDX corpus instead of being a second hard-coded taxonomy.

### 6. Shared cards
`components/content-grid.tsx` is the reusable cross-corpus card surface used by documents, research and security notes.

### 7. Error handling
Added a global App Router `error.tsx` recovery boundary so unexpected rendering failures receive a deliberate Onyx recovery surface instead of the browser-level failure state. Next.js documents `error.tsx` as the route-segment error boundary mechanism. 

### 8. Sitemap
Sitemap entries now derive dynamic document/research/intelligence/security-note routes and topic routes from the content source.

### 9. Version/build marker
Demo build marker advanced to `0.6.0-demo` / `ONX-R4-20260920`.

## Dependency decision

The original roadmap considered `next-mdx-remote`. During implementation research, the current `next-mdx-remote` repository was found to be archived in April 2026, so Part 2 uses `next-mdx-remote-client` instead. Its App Router/RSC API exposes `evaluate`, typed frontmatter and scope, and is documented as compatible with Next.js 15/16 and React 19+. 

Dependencies added:
- `next-mdx-remote-client` 2.1.12
- `remark-gfm` 4.0.1
- `remark-flexible-toc` 1.2.7
- `rehype-slug` 6.0.0

## Verification

Passed in the available offline environment:
- `package.json` parses as valid JSON.
- 50 TypeScript/TSX/JS source files parsed with **0 syntax diagnostics** using TypeScript 5.8.3.
- 21/21 MDX files passed structural frontmatter validation.
- Old `DocumentBody` / `switch (slug)` implementation is gone.
- Dynamic content collections and corresponding detail routes are present.
- No `node_modules`, `.next`, or generated build cache was included in the ZIP.

Not completed in this environment:
- `npm install` / dependency resolution: npm registry request timed out after 120 seconds.
- Consequently, a production Next.js build and runtime browser test could not be honestly claimed here.
- No fabricated `package-lock.json` was created.

## Security/content boundary

The MDX corpus is local project content, not user-supplied remote content. MDX imports and exports are disabled in the reader. The project does not fetch arbitrary MDX at runtime and does not expose a CMS/content upload endpoint.

## Deferred to Part 3

- Security request/response inspector.
- Cookie/header attribute analyzer.
- Encoding lab.
- Header regression harness.
- Casebook/evidence workspace with reset/export.
- Stronger isolated-fixture tests.
- Network event timeline/path inspection/snapshot export.
- Playwright + accessibility automation + CI.

## Important note

The existing homepage was deliberately not redesigned. Part 2 changes the content architecture behind the editorial surfaces while preserving the established visual language.
