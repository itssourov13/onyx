# Onyx Archive — Part 3 Implementation Report

Date: 2026-09-20
Build marker: `0.7.0-demo` / `ONX-R5-20260920`

## Implemented

### Security control room
Expanded `/security` with:

- `/security/requests` — local HTTP request/response inspector and header-regression snapshot.
- `/security/cookies` — pasted `Set-Cookie` analyzer.
- `/security/encodings` — URL, UTF-8 Base64 and UTF-8 hex transform lab.
- `/security/casebook` — browser-local synthetic findings workspace with reset/export.

The existing vulnerability lab, phishing analysis, header bench and security notes remain intact.

### Security navigation
The shared `securityNav` now contains nine modules, so desktop More, mobile navigation, command search and sitemap stay aligned with the same route data.

### Request Inspector
Implemented a bounded 64 KB local parser that distinguishes request/response start lines, lists headers, reports invalid header lines and counts UTF-8 body bytes. Response snapshots can be checked for the expected browser-facing security header set.

The inspector deliberately has no URL field and no network API. It only parses pasted text.

### Cookie Analyzer
Implemented local parsing and checks for:

- `Secure`
- `HttpOnly`
- `SameSite`
- `Partitioned`
- `Domain`
- `Path`
- `__Secure-` prefix constraints
- `__Host-` prefix constraints

The implementation does not access `document.cookie` or change browser cookies.

### Encoding Lab
Implemented browser-native local transforms for URL components, UTF-8 Base64 and UTF-8 hexadecimal data. Unicode round-trip tests pass.

### Casebook
Implemented:

- synthetic finding creation
- severity + status fields
- notes + evidence references
- browser-local persistence
- reset
- JSON export
- malformed storage validation
- storage failure fallback without crashing the UI

### Header Bench
Kept the existing documentation-oriented Header Bench and added a workflow link to the Request Inspector for a pasted response snapshot. The UI still does not pretend to have verified a deployed server response.

### Regression guard
Added `npm run security:check` backed by `scripts/security-isolation-check.mjs`.

The check rejects security-tool source that introduces:

- `fetch()`
- `XMLHttpRequest`
- `navigator.sendBeacon`
- WebSocket clients
- direct Node filesystem/network imports
- `allow-same-origin` in the intentionally opaque-origin vulnerability fixture

It also asserts the CSP development `unsafe-eval` guard and production HSTS configuration remain present.

## Verification results

- Source syntax parse: **56 TS/TSX files, 0 failures** (declaration stub excluded from transpile-only syntax check).
- Security-lab parser checks: **PASS**.
- HTTP response parsing: **PASS**.
- Cookie good/bad rule checks: **PASS**.
- UTF-8 Base64 round-trip: **PASS**.
- UTF-8 hex round-trip: **PASS**.
- Security isolation regression: **PASS, 0 violations across 16 security source files**.
- Internal route/link scan: **0 missing internal hrefs**.

## Dependency/build limitation

A full dependency install was attempted with `npm install --ignore-scripts --no-audit --no-fund`, but the npm registry request timed out in the execution environment. No package lockfile was fabricated and no production build success is claimed from this environment.

Run locally after extraction:

```bash
npm install
npm run security:check
npm run lint
npm run typecheck
npm run build
```

## Boundary

These modules are intentionally local/demo tooling. They do not perform target discovery, remote fetching, HTTP replay, filesystem access, credential collection, command execution, or server-backed case storage.
