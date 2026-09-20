# Onyx Archive — Product Roadmap

## Product direction

Onyx Archive is evolving from a cinematic onion-service visual experiment into a fictional privacy/security research publication and inspection environment. The goal is **more depth, not more noise**.

### North-star experience

`Landing → Search → Archive → Document → Research → Observatory → Lab → System status`

Every layer should feel like one product: editorial typography, terminal metadata, restrained copper accents, calm motion, explicit demo boundaries.

## Phase 0 — Stability foundation

- [x] Fix mobile menu backdrop blur and stacking order.
- [x] Lock page scrolling while menu is open.
- [x] Correct menu icon open/close state.
- [x] Development-only CSP compatibility; keep production CSP stricter.
- [x] Shared data model for documents, directory nodes and network nodes.
- [x] Shared command palette foundation.
- [x] Loading and 404 states.

## Part 1 — Consistency & correctness (implemented)

- [x] Align runtime dependencies to Next.js 16.3.5 and React 19.3.0 targets.
- [x] Replace malformed onion placeholders with deterministic 56-character Base32-looking demo strings.
- [x] Centralize synthetic archive/network metrics so the homepage and status views do not drift.
- [x] Add a real read-only `/api/health` endpoint and consume it from the Status page.
- [x] Add deep-linkable Security Note detail routes.
- [x] Add deep-linkable Research and Directory detail routes.
- [x] Correct phishing queue persistence semantics by using `sessionStorage` and add a clear action.
- [x] Make footer and desktop navigation expose the full product information architecture through grouped menus.
- [x] Add global `:focus-visible` styling and filter `aria-pressed` state.
- [x] Tighten the isolated DOM fixture with an in-document restrictive CSP.
- [x] Update metadata, canonical URL, sitemap coverage, and demo fingerprint labeling.
- [ ] Generate and commit a package lockfile once npm registry access is available.

## Phase 1 — Archive depth (implemented)

- [x] Structured document records with stable slugs.
- [x] Search + category filtering.
- [x] Dedicated `/documents/[slug]` reader routes.
- [x] Dynamic document metadata.
- [x] Related-document navigation.
- [x] Document hash / author / classification metadata.
- [x] Dynamic sitemap entries for documents.

## Phase 2 — Research Lab (implemented / expanding)

- [x] Browser-local SHA-256 integrity tool.
- [x] Synthetic signal timeline.
- [x] Lab module registry.
- [x] Transparent local-processing indicators.
- [x] Header Bench interactive fixture; live deployed-header verification is covered by Production QA.
- [ ] Browser security boundary visualizer.
- [ ] Exportable lab notes.

## Phase 3 — Network Observatory (implemented / expanding)

- [x] Interactive fictional topology.
- [x] Selectable nodes.
- [x] Synthetic load and latency metrics.
- [x] Node inspector.
- [x] Explicit simulated-data boundaries.
- [x] Event playback / time scrubber.
- [x] Node-to-node path inspection.
- [x] Observatory snapshot export.

## Phase 4 — Intelligence layer

- [x] Signal stream foundation.
- [x] Editorial state labels.
- [x] Desk status panel.
- [x] Incident/event detail pages.
- [x] Evidence chain visualizer.
- [x] Research-to-intelligence linking.

## Phase 5 — Interaction + accessibility

- [x] Command palette across routes/documents/research.
- [x] Keyboard-accessible mobile menu.
- [x] Reduced-motion support.
- [x] Focus-trap hardening for dialogs.
- [x] Automated axe/Playwright checks.
- [x] Full keyboard interaction audit for primary dialogs, menus and graph nodes.
- [x] Screen-reader announcement states for dynamic security-tool results.

## Phase 6 — Content architecture (implemented)

- [x] Move long-form records to MDX.
- [x] Frontmatter runtime validation.
- [x] Table-of-contents generation.
- [x] Citations and source metadata.
- [ ] Revision/changelog view.
- [x] Topic/tag landing pages.

## Phase 7 — Production hardening (implemented / deployment verification remaining)

- [x] Production security-header policy defined and statically checked.
- [x] Deployed response-header verification harness.
- [x] CSP regression tests.
- [x] E2E smoke tests for public routes.
- [x] Mobile overflow regression test.
- [x] Performance guardrails and browser timing capture.
- [x] Metadata/canonical fail-closed behavior.
- [ ] Generate and commit `package-lock.json` from a networked environment (artifact intentionally does not fabricate one).
- [ ] Run the complete runtime QA suite in a dependency-complete environment and record the actual result.
- [ ] Verify real Vercel response headers with `DEPLOY_URL`.
- [ ] Bundle/client-JS review.
- [ ] Final visual QA at common mobile/desktop breakpoints.
- [x] Runtime MDX sanitization, ESM/expression removal and external URL protocol validation.
- [x] Route metadata/canonical coverage expanded to static and dynamic public routes.

## Non-negotiable product rules

1. All onion addresses, fingerprints, node metrics and network states remain synthetic until a real data source is intentionally introduced.
2. Never imply anonymity, Tor routing, zero logging or end-to-end guarantees unless the underlying implementation actually provides and verifies them.
3. New features must reuse the visual language instead of introducing unrelated dashboard patterns.
4. Client JavaScript should be added only where interaction requires it.
5. Mobile is a first-class layout, not a final shrink pass.
## Phase 8 — Cybersecurity control room (implemented / expanding)

- [x] Dedicated `/security` control room route.
- [x] Mobile-menu cybersecurity section with dedicated routes.
- [x] Sandboxed DOM-reflection practice fixture with opaque origin.
- [x] Deterministic path-traversal parser against a synthetic file tree.
- [x] Deterministic authorization-mismatch simulator.
- [x] Local-only phishing/URL triage queue with heuristic indicators.
- [x] Security-header documentation bench.
- [x] Security field-notes route.
- [ ] Add disposable challenge reset/state export.
- [x] Add automated regression tests proving lab isolation.
- [ ] Add optional server-backed lab containers only as a separate deployment profile.

### Security-section safety boundary

1. The vulnerability lab must remain isolated from publication data and production credentials.
2. Training fixtures may model attacker-controlled input but must not provide persistence, OS command execution, credential collection or arbitrary filesystem access.
3. The phishing module is a defensive URL triage surface; it does not crawl, fetch, redirect to, submit forms to or host phishing content.
4. Demo heuristics are educational and must never claim that a URL is malicious or safe solely from the score.


## Delivery mapping — current build sequence

The implementation work is now being delivered in explicit parts so each layer is verified before the next one:

- **Part 1 — Consistency & production foundation:** dependency targets, synthetic identifiers, metrics truth, status API, route consistency, navigation, accessibility baseline and metadata.
- **Part 2 — Content platform:** structured MDX corpus, typed frontmatter, shared reader, TOC, references, research/intelligence/security-note deep links, topics and dynamic sitemap.
- **Part 3 — Security Suite:** local HTTP inspector, cookie analyzer, encoding lab, browser-local casebook, header regression workflow and automated isolation guard.
- **Part 4 — Observatory + intelligence depth:** event playback, event detail, path inspection, JSON snapshots, evidence-chain views and research/document/intelligence relationships. **Implemented.**
- **Part 5 — Production QA:** Playwright/axe, CI, production-header regression, mobile overflow regression, performance guardrails, keyboard/focus QA and deployment-header verification harness. **Implemented; deployed verification and final visual review remain environment-dependent.**

## Remediation pass — 2026-09-20

- [x] Rebuilt the mobile navigation as a complete grouped route map instead of an archive-only/partial menu.
- [x] Removed duplicate content truth from `lib/data.ts`; MDX is now the publication source of truth.
- [x] Corrected homepage `Latest intelligence` to consume intelligence records rather than research records.
- [x] Added runtime frontmatter validation and MDX sanitization/protocol checks.
- [x] Added explicit route canonical coverage and deployment-aware site URL resolution.
- [x] Hardened static routes with `dynamicParams = false` where the corpus is build-time enumerated.
- [x] Expanded mobile regression coverage across the public route matrix.
- [x] Expanded axe checks to fail on moderate, serious and critical findings.
- [x] Expanded deployed security-header assertions and added a production dependency-audit CI step.
- [x] Added Vercel deployment configuration and current Node 24 runtime declaration.
- [ ] Networked-environment lockfile generation and real browser/deployed verification remain release-environment tasks.
