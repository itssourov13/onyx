# Onyx Archive — Security Control Room Plan

## Direction

Keep the homepage unchanged in spirit: cinematic, premium, editorial. Cybersecurity functionality lives under a dedicated route family so the publication surface stays calm.

## Current route family

- `/security` — control-room overview
- `/security/vulnerabilities` — isolated training fixtures
- `/security/phishing` — local-only defensive URL triage
- `/security/headers` — browser security-header bench
- `/security/notes` — short application-security field notes

## Isolation model

The vulnerability route deliberately avoids a real backend attack surface. The DOM reflection exercise uses an iframe with `sandbox="allow-scripts"` and without `allow-same-origin`; path traversal and authorization cases are deterministic in-memory simulators. No fixture has access to production data, credentials, the host filesystem, or server-side command execution.

## Phishing module boundary

The URL queue is a browser-local collection. Analysis uses string/URL parsing heuristics only. It does not crawl, fetch, redirect to, submit forms to, or host the submitted URL. Scores are indicators, not a malicious/safe verdict.

## Next expansion candidates

1. Add disposable reset/export for each lab challenge.
2. Add a browser-boundary visualizer and static request/response inspector.
3. Add a safe header-regression checklist with copyable expected policies.
4. Add an incident detail route and evidence-chain visualization.
5. Add Playwright checks proving menu isolation, sandbox isolation and no cross-route state mutation.
6. Only consider server-backed practice containers as a separate deployment profile with explicit isolation boundaries; never mix them into the publication runtime.
