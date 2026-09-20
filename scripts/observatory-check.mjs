import fs from 'node:fs';

const data = fs.readFileSync('lib/data.ts', 'utf8');
const source = fs.readFileSync('components/network-observatory.tsx', 'utf8');
const errors = [];
const nodesMatch = data.match(/export const networkNodes(?:[^=]*)= \[(.*?)\n\];/s);
const eventsMatch = data.match(/export const networkEvents(?:[^=]*)= \[(.*?)\n\];/s);
const edgesMatch = data.match(/export const networkEdges(?:[^=]*)= \[(.*?)\n\](?:\s+as const)?;/s);
const relationsMatch = data.match(/export const intelligenceRelations(?:[^=]*)= \{(.*?)\n\};/s);
if (!nodesMatch || !eventsMatch || !edgesMatch || !relationsMatch) errors.push('Expected observatory data blocks missing');
const nodeIds = new Set((nodesMatch?.[1].match(/id: '([^']+)'/g) ?? []).map((x) => x.match(/'([^']+)'/)?.[1]));
const eventIds = [...(eventsMatch?.[1].matchAll(/id: '(EV-[^']+)'/g) ?? [])].map((m) => m[1]);
for (const match of edgesMatch?.[1].matchAll(/\['([A-Z0-9]+)', '([A-Z0-9]+)'\]/g) ?? []) {
  for (const nodeId of [match[1], match[2]]) if (!nodeIds.has(nodeId)) errors.push(`Unknown edge node: ${nodeId}`);
}
for (const match of eventsMatch?.[1].matchAll(/\{ id: '(EV-[^']+)',.*?nodeIds: \[([^\]]*)\], intelligenceIds: \[([^\]]*)\]/gs) ?? []) {
  for (const nodeId of match[2].matchAll(/'([^']+)'/g)) if (!nodeIds.has(nodeId[1])) errors.push(`${match[1]} references unknown node ${nodeId[1]}`);
  for (const intelligenceId of match[3].matchAll(/'([^']+)'/g)) if (!relationsMatch?.[1].includes(`'${intelligenceId[1]}'`)) errors.push(`${match[1]} references unknown intelligence ${intelligenceId[1]}`);
}
if (new Set(eventIds).size !== eventIds.length) errors.push('Duplicate event IDs');
for (const forbidden of ['fetch(', 'WebSocket', 'XMLHttpRequest', 'node:fs', 'node:http']) if (source.includes(forbidden)) errors.push(`Forbidden runtime capability: ${forbidden}`);
for (const expected of ['Blob([JSON.stringify(payload', 'URL.createObjectURL', 'anchor.download']) if (!source.includes(expected)) errors.push(`Snapshot export primitive missing: ${expected}`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Observatory check passed: ${nodeIds.size} nodes, ${[...(edgesMatch?.[1].matchAll(/\['([A-Z0-9]+)', '([A-Z0-9]+)'\]/g) ?? [])].length} edges, ${eventIds.length} events.`);
