# Onyx Archive — Part 5 Report

Date: 2026-09-20
Build: `0.9.0-demo / ONX-R7-20260920`

## Delivered

### Production QA harness
- Added Playwright Test `1.63.0` and `@axe-core/playwright` `4.13.0` dev dependencies.
- Added `playwright.config.ts` with Chromium + mobile Chromium projects, production `next start` web server, CI retries, failure traces/screenshots/videos and HTML reporting.
- Added `tests/smoke.spec.ts` covering the public route set, designed 404 behavior, health API and production security headers.
- Added `tests/a11y.spec.ts` using axe WCAG A/AA tags and failing on serious/critical violations.
- Added `tests/interaction.spec.ts` for command palette focus trapping, mobile-menu focus trapping/restoration, filter `aria-pressed` behavior and keyboard-operable network nodes.
- Added `tests/mobile.spec.ts` for horizontal overflow at the mobile project viewport.
- Added `tests/performance.spec.ts` with an HTML payload guard and lightweight navigation/resource timing checks.

### Accessibility hardening
- Mobile menu now moves focus into the menu, traps Tab/Shift+Tab within the menu, and restores focus to the invoking control when closed.
- Command palette now moves focus to its search field, traps Tab/Shift+Tab inside the dialog, and restores focus to its invoking control when closed.
- HTTP inspector and cookie analyzer results use polite live-region semantics.
- Casebook open-count state is announced with `aria-live`.

### Production security verification
- Added `scripts/security-header-check.mjs` for deployed verification through `DEPLOY_URL`.
- Local production E2E asserts `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy`.
- Production CSP is explicitly asserted not to contain `unsafe-eval`.

### Static QA
- Added `scripts/qa-static.mjs` checking required boundaries/config, internal hrefs, security-module browser-network API violations, and synthetic onion identifiers.
- Existing `security:check` and `observatory:check` remain part of the QA chain.

### CI
- Added `.github/workflows/ci.yml` using GitHub Actions `setup-node@v7`, Node 22, explicit npm cache disablement while no lockfile exists, production build, Chromium installation, and E2E/axe execution.
- Playwright reports are uploaded as CI artifacts on completion.

### Project metadata
- Bumped demo build marker to `0.9.0-demo / ONX-R7-20260920`.
- Updated the roadmap to mark the completed Part 5 QA work and distinguish environment-dependent release checks.
- README now documents local QA and `DEPLOY_URL` header verification commands.

## Verification performed in this environment

```text
TS/TSX syntax parsed:                    65 files / 0 errors
Playwright config syntax:                PASS
Node .mjs syntax checks:                 PASS
Static QA route + boundary checks:       PASS
Synthetic onion identifiers:             7 / 7 valid
Security isolation regression check:     PASS (0 violations)
Observatory consistency check:           PASS (7 nodes / 10 edges / 6 events)
```

## Not claimed as runtime-passed

The execution environment could not resolve/install npm dependencies. `npm install --package-lock-only --ignore-scripts` timed out against the registry, so no package-lock was fabricated and no browser runtime result is represented as a pass.

Once dependencies are available, the release sequence is:

```bash
npm install
npm run qa:static
npm run security:check
npm run observatory:check
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm run e2e
DEPLOY_URL=https://<real-deployment> npm run qa:deployed-headers
```

## Release-readiness status

Implemented: automated QA infrastructure, security-header regression, accessibility harness, keyboard/focus hardening, mobile overflow regression, performance guardrails, CI and deployment-header verification harness.

Environment-dependent: actual Playwright/axe execution, real deployed-header verification, final visual review and lockfile generation.
