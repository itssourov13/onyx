# Onyx Archive — Part 5 Plan

## Objective

Finish the production-QA layer without redesigning the homepage or changing the fictional/demo safety boundary.

## Scope

1. Installable Playwright + axe test harness with production `next start` web server.
2. Public-route smoke coverage for the complete current route map and a designed 404 route.
3. Production-response security-header assertions for CSP, HSTS, framing, MIME sniffing, referrer and permissions policy.
4. WCAG A/AA automated accessibility checks focused on serious/critical violations, plus representative coverage across all major UI families.
5. Keyboard/focus regression coverage for the mobile menu, command palette, filter pressed states and interactive network nodes.
6. Mobile horizontal-overflow regression coverage.
7. Lightweight performance guardrails: HTML payload ceiling and browser timing/resource-count capture.
8. Static QA for internal route references, synthetic onion identifier shape, isolation-sensitive client modules and required boundary/config files.
9. GitHub Actions CI for install → static/security checks → lint/typecheck → build → Playwright.
10. Optional deployed-header verification driven by `DEPLOY_URL`; never assume a deployment URL that is not supplied.

## Explicit limitations

- A package lockfile is still blocked by npm registry access in the current execution environment. The artifact does not contain a fabricated lockfile.
- Browser-runtime Playwright/axe execution is implemented but not claimed as passed until dependencies are installed and Chromium is available.
- Final visual QA and deployed-header verification remain environment-dependent; the artifact includes the repeatable harness for both stages.
