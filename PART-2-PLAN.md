# Onyx Archive — Part 2

## Goal
Move the editorial/content layer from hard-coded route components into a structured local MDX corpus without changing the premium homepage direction.

## Implemented
- Local MDX corpus for documents, research, intelligence, and security notes.
- Typed frontmatter contract: id, title, description, date, author, category, tags, reading time, state/classification, references.
- Server-side MDX evaluation through `next-mdx-remote-client` RSC.
- GFM support and generated heading IDs/TOC.
- MDX imports/exports disabled for this local corpus.
- Shared reader surface with metadata, tags, references and generated TOC.
- Research, intelligence and security-note detail routes now render the actual MDX source.
- New `/topics` index and `/topics/[tag]` cross-corpus views.
- Sitemap now derives dynamic content and topic URLs from the corpus.
- Generic route error boundary added for rendering failures.
- Content cards now use one reusable grid component.

## Deliberately deferred
- Network event observatory expansion.
- Request/response security inspector.
- Cookie and encoding labs.
- Casebook/evidence workspace.
- Playwright/axe/CI automation.
- Real backend persistence/authentication.
- Homepage visual redesign.

## Verification status
- 21 MDX records generated.
- All four content collections have detail routes.
- No remaining `DocumentBody` switch statement.
- npm lockfile generation attempted but registry timed out in the build environment; no fake lockfile was created.
- Full `npm install` / production build remains to be run in an environment with registry access.
