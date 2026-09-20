# Onyx Archive

A premium fictional onion-service / underground research portal UI for privacy, security engineering, research publishing and safe browser-local security practice.

## Stack

- Next.js 16.3.5 (App Router)
- React 19.3.0
- TypeScript strict mode
- Custom CSS design system (no runtime UI library)
- MDX via `next-mdx-remote-client` with runtime metadata validation
- Playwright 1.63 + axe-core 4.13 for QA
- Vercel deployment configuration included

## Run locally

Use Node.js 24 (`.nvmrc` is included):

```bash
npm install
npm run dev
```

Open http://localhost:3000.

For production verification:

```bash
npm run content:check
npm run lint
npm run typecheck
npm run security:check
npm run observatory:check
npm run qa:static
npm run build
npm start
```

For browser QA:

```bash
npx playwright install chromium
npm run e2e
```

For a deployed header check:

```bash
DEPLOY_URL=https://your-real-vercel-domain.example npm run qa:deployed-headers
```

## Vercel

The repository includes `vercel.json`, `.nvmrc`, `.vercelignore` and an explicit Node `24.x` engine. Next.js has first-class Vercel support, and Vercel provides Node.js 24 as the LTS runtime for builds and functions. See https://vercel.com/changelog/node-js-24-lts-is-now-generally-available-for-builds-and-functions

Set this Vercel environment variable before production builds:

```text
NEXT_PUBLIC_SITE_URL=https://your-production-domain.example
```

Production metadata, canonical URLs, robots and sitemap use `NEXT_PUBLIC_SITE_URL` when supplied, or Vercel's `VERCEL_URL` for preview/provided deployment hosts; local development falls back to `http://localhost:3000`.

Vercel normally auto-detects Next.js projects and their build settings; `vercel.json` is included here to make the intended install/build commands explicit. See https://vercel.com/frameworks/nextjs

## Product map

### Explore

- `/` — premium landing page
- `/archive` — MDX-backed searchable corpus
- `/documents` — document library
- `/documents/[slug]` — long-form document reader
- `/research` — research field notes
- `/research/[slug]` — research detail
- `/intelligence` — editorial signal stream
- `/intelligence/[id]` — intelligence detail + evidence relations
- `/network` — synthetic network observatory
- `/network/events` — synthetic event ledger
- `/network/events/[id]` — event detail
- `/directory` — fictional onion directory
- `/directory/[slug]` — directory detail
- `/topics` — cross-corpus tags
- `/topics/[tag]` — topic index

### System

- `/lab` — browser-local research tools
- `/status` — simulated system status + real local health endpoint
- `/about` — principles
- `/contact` — demo contact surface

### Cybersecurity

- `/security` — security control room
- `/security/vulnerabilities` — isolated vulnerability practice fixtures
- `/security/phishing` — local-only defensive URL triage
- `/security/requests` — local HTTP request/response parser
- `/security/cookies` — `Set-Cookie` analysis
- `/security/encodings` — URL/Base64/hex transforms
- `/security/headers` — security-header bench
- `/security/notes` — MDX security notes
- `/security/notes/[id]` — security-note detail
- `/security/casebook` — browser-local synthetic findings/evidence

## Navigation behavior

The navigation is grouped rather than truncated: desktop keeps the six primary Explore routes visible and places Topics, System routes and all Cybersecurity modules under More; mobile exposes the complete 20-link grouped route map with focus trapping, scroll lock and active deep-route highlighting.

The public browser QA matrix currently covers 54 concrete URLs spanning all 29 App Router page-route patterns. `/api/health`, `robots.txt` and `sitemap.xml` are verified as separate request-level resources.

## Content architecture

All publication records live under `content/` as MDX. A runtime validator checks required metadata, dates, tags and reference URL schemes before entries are exposed to the application. The client search surfaces receive a server-generated content index, so the homepage, archive, terminal and command palette do not maintain duplicate document/research copies in `lib/data.ts`.

MDX expressions/ESM are stripped defensively and rendered through `rehype-sanitize`; external content links are restricted to HTTP(S). The repository still treats MDX as trusted build input because MDX compilation itself is executable-code evaluation.

## Security boundary

This is a fictional privacy/security research environment. It uses synthetic `.onion` addresses, synthetic network metrics, fictional fingerprints and demo verification states. It does not implement Tor, expose live relays, provide anonymity guarantees, crawl or fetch phishing URLs, replay HTTP traffic, read the browser cookie jar, access the real filesystem from security modules, or persist real credentials.

Security practice fixtures are isolated from publication state. The vulnerability lab uses sandboxed browser fixtures/in-memory simulators; the phishing and parsing tools are local-only; the casebook uses browser-local storage with reset/export.

## QA and deployment notes

CI targets Node 24. Runtime browser QA uses Playwright with Chromium; accessibility checks use axe-core across the shared public-route matrix. Static/security/observatory checks are also available independently for fast local verification. The menu information architecture is grouped into Explore, System and Cybersecurity on mobile, while desktop keeps the primary Explore routes visible and puts the remainder in More.

The current artifact deliberately does **not** contain a fabricated lockfile because the build environment used for this pass could not reach the npm registry. CI and Vercel automatically switch to `npm ci` once `package-lock.json` is present; until then they fall back to `npm install`. On a networked machine, run `npm install` once, commit the generated `package-lock.json`, then use CI/deployment as the reproducible path.

## Release gate

Before calling a deployment production-verified, run the full QA suite in a dependency-complete environment and verify the actual deployed response headers:

```bash
npm install
npm run security:deps
npm run qa:all
DEPLOY_URL=https://your-production-domain.example npm run qa:deployed-headers
```

The final visual pass should cover the complete public route matrix, mobile menu navigation, the Security Suite, the Observatory, reduced-motion mode and desktop/mobile breakpoints. The production dependency audit runs inside `qa:all`.
