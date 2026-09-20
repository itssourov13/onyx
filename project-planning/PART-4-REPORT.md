# Onyx Archive — Part 4 Implementation Report

## Scope

Part 4 implements the roadmap's **Observatory + intelligence depth** phase while preserving the existing homepage visual language and keeping all network data explicitly synthetic.

## Implemented

### Network Observatory
- Event playback with a deterministic six-event ledger.
- Manual timeline scrubbing plus play/pause playback.
- Event-context highlighting on the topology map.
- Node inspector now exposes the currently selected event context.
- Fictional node-to-node path inspection using breadth-first traversal across the demo graph.
- Path highlighting on the topology SVG.
- JSON snapshot export containing selected node, event, path and topology metadata.
- Direct `/network/events` ledger route.
- Direct `/network/events/[id]` event detail routes.

### Evidence + Intelligence
- Evidence-chain blocks connect node observations → recorded evidence labels → intelligence signals.
- Intelligence detail pages now link back to related Research and Documents.
- Intelligence signals also expose their linked Observatory event records.
- Event detail pages link to affected nodes and intelligence entries.
- Network Event Ledger is available from the command palette.

### Consistency
- Status page now consumes the same `networkEvents` source as the Observatory.
- Lab timeline also consumes the same event source, avoiding another drifting event dataset.
- Build marker bumped to `0.8.0-demo` / `ONX-R6-20260920`.
- Sitemap includes `/network/events` and every event detail route.

## Verification

```text
TS/TSX files parsed:        60
Syntax/parse errors:         0
Internal href gaps:          0
Network nodes:               7
Network edges:              10
Network events:              6
Observable relations:        5
Security isolation errors:   0
Observatory check:          PASS
```

Additional static verification confirms the Observatory component does not contain `fetch`, `XMLHttpRequest`, `WebSocket`, Node filesystem/network imports, or other live-network capability. Snapshot export uses browser-local `Blob`/object-URL download primitives only.

## Dependency/build limitation

The Part 3 dependency set was retained; no new runtime dependency was added for Part 4. A fresh `npm install --package-lock-only --offline` could not run because the local npm cache lacks required registry metadata. Therefore this environment still does **not** contain a generated `package-lock.json`, and a full `npm run build` was not claimed as verified.

Run locally with registry access:

```bash
npm install
npm run observatory:check
npm run security:check
npm run lint
npm run typecheck
npm run build
```

## Safety/product boundary

All network nodes, events, paths, evidence labels and metrics remain fictional. The export explicitly labels the snapshot as synthetic. No Tor relay telemetry, live routing information, operator location, real hidden-service enumeration or external target interaction is implemented.
