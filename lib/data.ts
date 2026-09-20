
export const siteBuild = {
  version: '0.10.0-demo',
  build: 'ONX-R8-20260920',
  reviewedAt: '2026-09-20',
} as const;

export const demoOnion = 'jhrntxv73zrtse4mibtupukfhdkufw7hbbnflrb2jdfzjqfufndaqum5.onion';
export const demoOnionInner = 'jhrntxv73zrtse4mibtupukfhdkufw7hbbnflrb2jdfzjqfufndaqum5';

export const nav = [
  ['Archive', '/archive'],
  ['Research', '/research'],
  ['Intelligence', '/intelligence'],
  ['Network', '/network'],
  ['Documents', '/documents'],
  ['Directory', '/directory'],
  ['Topics', '/topics'],
] as const;

export const systemNav = [
  ['Lab', '/lab'],
  ['Status', '/status'],
  ['About', '/about'],
  ['Contact', '/contact'],
] as const;

export const securityNav = [
  ['Security Control Room', '/security'],
  ['Vulnerability Lab', '/security/vulnerabilities'],
  ['Phishing Analysis', '/security/phishing'],
  ['Request Inspector', '/security/requests'],
  ['Cookie Analyzer', '/security/cookies'],
  ['Encoding Lab', '/security/encodings'],
  ['Header Bench', '/security/headers'],
  ['Security Notes', '/security/notes'],
  ['Casebook', '/security/casebook'],
] as const;

export const commandRoutes = [
  ...nav.map(([label, href]) => ({ label, href, type: 'ROUTE' as const })),
  ...systemNav.map(([label, href]) => ({ label, href, type: 'ROUTE' as const })),
  { label: 'Network Event Ledger', href: '/network/events', type: 'ROUTE' as const },
  ...securityNav.map(([label, href]) => ({ label, href, type: 'ROUTE' as const })),
];

export type NetworkNode = {
  id: string;
  name: string;
  type: 'CORE' | 'EDGE' | 'INDEX' | 'CACHE' | 'DESK';
  location: string;
  status: 'ONLINE' | 'DEGRADED' | 'MAINTENANCE';
  load: number;
  latency: number;
  role: string;
};

export const directory = [
  { name: 'The Glass Archive', slug: 'glass-archive', category: 'Research', onion: 'jzirxaqhcxjzszd5de76axmsir77kuachnsbwwmotm4dnwi2vo2eirgr.onion', status: 'ONLINE', verified: '2h ago', fp: 'AE:41:73:09:BF:2A', description: 'Fictional research index for public technical notes.' },
  { name: 'Northstar Docs', slug: 'northstar-docs', category: 'Documentation', onion: 'ji5ou32qrdkh3c7r7fiml4ef6xmh6cuaqbxeoeklg6i2xyol2ms6mroy.onion', status: 'ONLINE', verified: '6h ago', fp: '72:18:4B:9E:20:17', description: 'Fictional documentation room for protocol and systems references.' },
  { name: 'Signal Room', slug: 'signal-room', category: 'Security', onion: 'wladruqalpxihfkgzahipg5j7nnl5zb5rtvil4dyuy6angp4xqrmuj7s.onion', status: 'DEGRADED', verified: '1d ago', fp: '5B:F4:28:CC:91:43', description: 'Fictional security bulletin desk with simulated availability states.' },
  { name: 'Quiet Library', slug: 'quiet-library', category: 'Archives', onion: 'f7jpnlxlor47dctmths36draz7ovof3srwtotdjkru33mpfwuoe3xprt.onion', status: 'ONLINE', verified: '3h ago', fp: '0D:AA:93:51:BE:08', description: 'Fictional document vault for long-lived technical records.' },
  { name: 'Open Source Vault', slug: 'open-source-vault', category: 'Open Source', onion: 'd76zjvm64dniwyoksxmleo4hobkjgfdca22auw4zdszjn7pcbdlvvoj3.onion', status: 'ONLINE', verified: '11h ago', fp: 'C8:70:19:1E:4A:62', description: 'Fictional repository mirror for open tooling notes.' },
  { name: 'Private Comms Lab', slug: 'private-comms-lab', category: 'Communications', onion: 'zrhd2im7cvxa66oaoqkpu657jkwvfz2ozrb5olq5xphywxccv7bixznk.onion', status: 'MAINTENANCE', verified: '2d ago', fp: '44:2E:18:77:D1:90', description: 'Fictional design sandbox for privacy-oriented communications UX.' },
] as const;

export const networkNodes: NetworkNode[] = [
  { id: 'A1', name: 'ARCHIVE CORE', type: 'CORE', location: 'Frankfurt / DEMO', status: 'ONLINE', load: 43, latency: 48, role: 'Primary fictional index' },
  { id: 'B2', name: 'RESEARCH EDGE', type: 'EDGE', location: 'Singapore / DEMO', status: 'ONLINE', load: 67, latency: 91, role: 'Research publication edge' },
  { id: 'C4', name: 'DIRECTORY', type: 'INDEX', location: 'Reykjavik / DEMO', status: 'DEGRADED', load: 78, latency: 116, role: 'Synthetic directory index' },
  { id: 'D7', name: 'DOCUMENT CACHE', type: 'CACHE', location: 'Montreal / DEMO', status: 'ONLINE', load: 31, latency: 62, role: 'Document delivery cache' },
  { id: 'E3', name: 'SIGNAL INDEX', type: 'INDEX', location: 'Helsinki / DEMO', status: 'ONLINE', load: 52, latency: 73, role: 'Research signal index' },
  { id: 'F9', name: 'STATUS DESK', type: 'DESK', location: 'New York / DEMO', status: 'MAINTENANCE', load: 12, latency: 140, role: 'Synthetic observability desk' },
  { id: 'G5', name: 'LAB EDGE', type: 'EDGE', location: 'Dhaka / DEMO', status: 'ONLINE', load: 36, latency: 83, role: 'Local research tooling edge' },
];

export type NetworkEvent = {
  id: string;
  time: string;
  channel: 'NETWORK' | 'ARCHIVE' | 'LAB' | 'STATUS';
  title: string;
  description: string;
  severity: 'INFO' | 'WATCH' | 'SIGNAL';
  nodeIds: string[];
  intelligenceIds: string[];
  evidence: string[];
};

export const networkEvents: NetworkEvent[] = [
  { id: 'EV-2401', time: '02:14', channel: 'ARCHIVE', title: 'Archive index rebuilt', description: 'Three synthetic records were reconciled against the demo catalog after a content update.', severity: 'INFO', nodeIds: ['A1', 'D7'], intelligenceIds: ['browser-security-boundaries'], evidence: ['archive-reconciliation', 'document-fingerprint'] },
  { id: 'EV-2398', time: '01:48', channel: 'NETWORK', title: 'Directory latency crossed threshold', description: 'Synthetic latency at C4 crossed the 100ms observability threshold.', severity: 'WATCH', nodeIds: ['C4', 'B2', 'D7'], intelligenceIds: ['privacy-ux-patterns'], evidence: ['latency-sample', 'node-state'] },
  { id: 'EV-2394', time: '00:32', channel: 'LAB', title: 'Integrity Desk warmed', description: 'The browser-local fingerprint module became available for the current demo session.', severity: 'INFO', nodeIds: ['G5'], intelligenceIds: ['browser-security-boundaries'], evidence: ['local-module-state'] },
  { id: 'EV-2389', time: '23:10', channel: 'STATUS', title: 'Header profile verified', description: 'The synthetic response-header baseline matches the current application configuration model.', severity: 'SIGNAL', nodeIds: ['F9', 'A1'], intelligenceIds: ['build-provenance-drift'], evidence: ['header-profile', 'config-baseline'] },
  { id: 'EV-2382', time: '21:42', channel: 'NETWORK', title: 'Research edge load normalized', description: 'B2 returned below the demo load warning threshold after a synthetic traffic burst.', severity: 'INFO', nodeIds: ['B2'], intelligenceIds: ['agent-identity-registry'], evidence: ['load-sample'] },
  { id: 'EV-2378', time: '20:18', channel: 'ARCHIVE', title: 'Provenance note attached', description: 'A synthetic supply-chain observation was linked to the engineering research corpus.', severity: 'SIGNAL', nodeIds: ['A1', 'E3'], intelligenceIds: ['build-provenance-drift'], evidence: ['research-link', 'artifact-digest'] },
];


export function getNetworkEvent(id: string) {
  return networkEvents.find((event) => event.id === id);
}

export function getNetworkNode(id: string) {
  return networkNodes.find((node) => node.id === id);
}

export const intelligenceRelations: Record<string, { research: string[]; documents: string[]; events: string[] }> = {
  'browser-security-boundaries': { research: ['security-anatomy'], documents: ['browser-security-boundaries'], events: ['EV-2401', 'EV-2394'] },
  'agent-identity-registry': { research: ['machine-identity'], documents: ['machine-identity-trust-boundary'], events: ['EV-2382'] },
  'build-provenance-drift': { research: ['supply-chain'], documents: ['supply-chain-signal-atlas'], events: ['EV-2389', 'EV-2378'] },
  'privacy-ux-patterns': { research: ['privacy-architecture'], documents: ['open-information-closed-systems'], events: ['EV-2398'] },
  'firmware-observatory': { research: ['firmware-room'], documents: ['firmware-room-unusual-boot-paths'], events: [] },
};

export const networkPathExamples = [
  { id: 'PATH-01', from: 'A1', to: 'F9', label: 'Archive core → status desk' },
  { id: 'PATH-02', from: 'B2', to: 'G5', label: 'Research edge → lab edge' },
  { id: 'PATH-03', from: 'C4', to: 'E3', label: 'Directory → signal index' },
] as const;

export const networkEdges = [
  ['A1', 'B2'], ['A1', 'D7'], ['A1', 'E3'], ['B2', 'C4'], ['B2', 'G5'], ['C4', 'D7'], ['C4', 'F9'], ['D7', 'E3'], ['E3', 'G5'], ['D7', 'G5'],
] as const;

export const labModules = [
  { id: 'LAB-01', name: 'Integrity Desk', status: 'READY', description: 'A local-only workspace for comparing document fingerprints without sending content to a third party.' },
  { id: 'LAB-02', name: 'Metadata Room', status: 'READY', description: 'Inspect the kind of metadata a privacy-oriented product should make visible to its users.' },
  { id: 'LAB-03', name: 'Signal Timeline', status: 'BETA', description: 'Explore fictional security events as a chronological stream instead of a static dashboard.' },
  { id: 'LAB-04', name: 'Header Bench', status: 'BETA', description: 'Read a static security-header profile and map each control to its intended browser boundary.' },
] as const;

export const timeline = networkEvents.map((event) => [event.time, event.channel, event.title, event.description] as const);
