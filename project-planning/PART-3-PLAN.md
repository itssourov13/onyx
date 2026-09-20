# Onyx Archive — Part 3 Plan

## Goal
Expand the cybersecurity control room with useful, visually consistent, strictly local inspection tools while preserving the existing homepage and fictional/demo safety boundary.

## Scope

1. **Request Inspector**
   - Parse pasted HTTP request/response text.
   - Show start line, headers, body byte size and malformed header lines.
   - Run a local browser-security header presence snapshot for pasted responses.
   - No target URL input, fetch, replay, proxy or network client.

2. **Cookie Analyzer**
   - Parse pasted `Set-Cookie` lines.
   - Check Secure, HttpOnly, SameSite, Partitioned and `__Secure-` / `__Host-` prefix constraints.
   - Never read or modify the browser cookie jar.

3. **Encoding Lab**
   - URL component encode/decode.
   - UTF-8 Base64 encode/decode.
   - UTF-8 hex encode/decode.
   - No remote decoder or target interaction.

4. **Casebook**
   - Browser-local synthetic findings.
   - Severity/status/notes/evidence fields.
   - Reset and JSON export.
   - Defensive handling of malformed/disabled localStorage.

5. **Isolation regression checks**
   - Static scan for network clients and Node filesystem/network imports in security tooling.
   - Assert the vulnerability fixture retains sandboxed execution without `allow-same-origin`.
   - Assert production HSTS + dev-only CSP `unsafe-eval` guard remains present.

## Verification

- TypeScript/TSX source syntax parse for all source files excluding declaration stubs.
- Pure security-lab parser/unit checks.
- `npm run security:check` isolation regression.
- Internal route/link scan.
- Dependency install/build attempted; registry request timed out in the execution environment, so no build success is claimed and no fake lockfile is created.
