# Onyx Archive — Part 1 Implementation Report

Date: 2026-09-20
Source audit: `ONYX-AZ-AUDIT.md`

## Goal

Part 1 focuses on consistency, correctness, demo-data integrity and route semantics without redesigning the homepage.

## Completed

- Pinned the target runtime versions to Next.js 16.3.5 and React 19.3.0.
- Replaced malformed onion placeholders with deterministic 56-character lowercase Base32-looking synthetic strings.
- Centralized archive/network metrics in `lib/data.ts`.
- Added `/api/health` and made the Status page consume it.
- Added `/research/[slug]` detail routes and linked Research + Command Palette entries.
- Added `/directory/[slug]` detail routes.
- Added `/security/notes/[id]` detail routes.
- Fixed phishing queue semantics: `sessionStorage`, visible storage label and clear action.
- Added grouped desktop navigation and a deliberate footer information architecture.
- Added global `:focus-visible` treatment and `aria-pressed` state to filter controls.
- Added an additional CSP inside the isolated DOM vulnerability fixture.
- Updated document fingerprint labels so truncated values are not presented as full hashes.
- Added canonical/OG/Twitter metadata and expanded sitemap coverage.
- Made homepage archive records link to real document readers.

## Verification

- Internal route audit: 21 routes discovered; 0 missing hard-coded internal hrefs.
- Synthetic onion audit: 7 addresses; all are 56 characters and use the lowercase Base32-looking alphabet.
- `next.config.mjs`: development CSP contains `unsafe-eval`; production CSP does not, and production adds HSTS + `upgrade-insecure-requests`.
- Global TypeScript source check was run with minimal temporary framework stubs. The remaining two diagnostics are existing React `key`-prop limitations of the stub, not application type errors.
- Full dependency installation could not be completed in this environment because the npm registry request timed out.

## Deferred

- Generate and commit `package-lock.json` once npm registry access is available.
- Full `npm install`, `npm run lint`, `npm run typecheck`, `npm run build` and Playwright/axe validation should be run after dependency installation.
- Focus-trap/E2E hardening remains in the later accessibility/production phase.
