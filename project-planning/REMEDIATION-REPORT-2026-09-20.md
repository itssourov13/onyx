# Onyx Archive — Deep Remediation Report

Date: 2026-09-20
Baseline: Part 5 / final audit-only report
Scope: code/config/docs remediation; no visual redesign of the homepage

## Executive result

The project was remediated against the final audit and the user-reported navigation defect. The homepage remains visually intact while route architecture, content consistency, security boundaries, metadata, QA coverage and Vercel configuration were hardened.

## Major fixes

- Rebuilt navigation into Explore / System / Cybersecurity groups. Desktop keeps six primary routes visible and exposes the remaining routes through More. Mobile exposes the complete 20-link route map, including Topics, Status, Contact and every Security module.
- Added parent-aware active-route highlighting so nested routes keep their section selected.
- Corrected the homepage Latest intelligence section to consume intelligence records and link to `/intelligence/[id]` instead of incorrectly using research records.
- Removed duplicate publication datasets from `lib/data.ts`; MDX is now the publication source of truth.
- Added runtime frontmatter validation for required fields, dates, tags, references and revision dates.
- Hardened MDX rendering with ESM/expression removal, sanitization and HTTP(S)-only external links.
- Added `dynamicParams = false` to build-enumerated dynamic content routes.
- Hardened canonical metadata and deployment-aware site URL resolution.
- Added root `global-error.tsx` in addition to route-level recovery/error and 404 surfaces.
- Expanded deployed security-header assertions to CSP directives, HSTS, COOP, OAC and X-Permitted-Cross-Domain-Policies.
- Added a production dependency audit to CI/`qa:all`.
- Expanded axe testing to fail on moderate, serious and critical findings.
- Expanded mobile and performance regression coverage to the complete public route matrix.
- Added one shared `tests/route-matrix.ts` so smoke/mobile/performance/axe coverage cannot silently diverge.
- Added Vercel configuration, `.nvmrc` Node 24 declaration and `.vercelignore`.
- Updated README and roadmap to match the current implementation.

## Verification performed in the available environment

```text
App/Config source files inspected: 67
TS/TSX/JS/MJS syntax files parsed: 79
Syntax errors: 0
MDX records validated: 21
Public browser QA samples: 54 unique routes
App Router page-route patterns: 29
Internal import/export check: PASS
Security isolation violations: 0
Observatory consistency: PASS (7 nodes / 10 edges / 6 events)
Synthetic onion identifiers: 7/7 valid
Static QA: PASS
JSON/config parsing: PASS
```

## Vercel deployment state

`vercel.json` explicitly defines the Next.js framework, build command, development command, install command and clean URLs. `package.json` and `.nvmrc` target Node 24.x. Vercel currently supports Node 24.x and allows `24.x` through the `engines` field; Vercel also documents automatic framework detection and file-based `vercel.json` configuration.

`NEXT_PUBLIC_SITE_URL` is documented for the production canonical domain. Preview builds can fall back to the Vercel-provided deployment URL when available.

## Remaining environment-dependent release gates

1. `package-lock.json` is still intentionally absent because the remediation environment had an empty npm cache and repeated npm-registry access timed out. No fabricated lockfile was created.
2. Because dependencies were not installed in the remediation environment, the following were not honestly marked as runtime-passed here: `npm run lint`, `npm run typecheck`, `npm run build`, Chromium/axe execution and deployed-header verification.
3. On a networked machine, run `npm install` once, commit the generated `package-lock.json`, then run `npm run qa:all`.
4. After Vercel deployment, run `DEPLOY_URL=https://<real-domain> npm run qa:deployed-headers`.
5. Final visual QA and bundle/client-JS review remain deployment-environment checks rather than source-remediation gaps.

## Release commands

```bash
npm install
npm run qa:all
DEPLOY_URL=https://your-production-domain.example npm run qa:deployed-headers
```
