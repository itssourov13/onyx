export type HeaderPair = { name: string; value: string };

export type HttpParse = {
  startLine: string;
  kind: 'REQUEST' | 'RESPONSE' | 'UNKNOWN';
  method?: string;
  target?: string;
  version?: string;
  status?: number;
  reason?: string;
  headers: HeaderPair[];
  body: string;
  invalidLines: string[];
};

const MAX_INPUT = 64_000;

export function clampSecurityInput(value: string): string {
  return value.length > MAX_INPUT ? value.slice(0, MAX_INPUT) : value;
}

export function parseHttp(rawValue: string): HttpParse {
  const raw = clampSecurityInput(rawValue).replace(/\r\n/g, '\n');
  const lines = raw.split('\n');
  const separator = lines.findIndex((line) => line === '');
  const head = separator >= 0 ? lines.slice(0, separator) : lines;
  const body = separator >= 0 ? lines.slice(separator + 1).join('\n') : '';
  const startLine = head[0]?.trim() ?? '';
  const headers: HeaderPair[] = [];
  const invalidLines: string[] = [];

  for (const line of head.slice(1)) {
    if (!line.trim()) continue;
    const colon = line.indexOf(':');
    if (colon <= 0) {
      invalidLines.push(line);
      continue;
    }
    headers.push({ name: line.slice(0, colon).trim(), value: line.slice(colon + 1).trim() });
  }

  if (/^HTTP\/\d(?:\.\d)?\s+\d{3}(?:\s+.*)?$/i.test(startLine)) {
    const [, version, code, ...rest] = startLine.match(/^HTTP\/(\d(?:\.\d)?)\s+(\d{3})(?:\s+(.*))?$/i) ?? [];
    return { startLine, kind: 'RESPONSE', version, status: Number(code), reason: rest[0] ?? '', headers, body, invalidLines };
  }

  const requestMatch = startLine.match(/^([A-Z][A-Z0-9-]*)\s+(\S+)\s+HTTP\/(\d(?:\.\d)?)$/i);
  if (requestMatch) {
    return { startLine, kind: 'REQUEST', method: requestMatch[1], target: requestMatch[2], version: requestMatch[3], headers, body, invalidLines };
  }

  return { startLine, kind: 'UNKNOWN', headers, body, invalidLines };
}

export type HeaderObservation = { tone: 'good' | 'warn' | 'info'; title: string; detail: string };

const expectedHeaders = [
  ['content-security-policy', 'CSP controls executable content, embeds and permitted connections.'],
  ['x-content-type-options', 'Prevents MIME-sniffing of responses.'],
  ['x-frame-options', 'Adds legacy clickjacking protection alongside CSP frame-ancestors.'],
  ['referrer-policy', 'Controls how much referrer information leaves the origin.'],
  ['permissions-policy', 'Disables browser capabilities the application does not need.'],
  ['strict-transport-security', 'Pins HTTPS use after the browser receives the policy.'],
] as const;

export function inspectSecurityHeaders(headers: HeaderPair[]): HeaderObservation[] {
  const names = new Set(headers.map((item) => item.name.toLowerCase()));
  return expectedHeaders.map(([name, detail]) => {
    if (names.has(name)) return { tone: 'good', title: name.toUpperCase(), detail: `Present. ${detail}` };
    if (name === 'strict-transport-security') {
      return { tone: 'warn', title: name.toUpperCase(), detail: 'Missing from the pasted response. Verify this only on an HTTPS deployment where HSTS is intended.' };
    }
    return { tone: 'warn', title: name.toUpperCase(), detail: `Missing from the pasted response. ${detail}` };
  });
}

export type CookieFinding = {
  tone: 'good' | 'warn' | 'info';
  title: string;
  detail: string;
};

export type ParsedCookie = {
  raw: string;
  name: string;
  value: string;
  attributes: Record<string, string | true>;
  findings: CookieFinding[];
};

export function parseSetCookieLine(rawLine: string): ParsedCookie | null {
  const raw = rawLine.trim().replace(/^set-cookie:\s*/i, '');
  if (!raw) return null;
  const parts = raw.split(';').map((part) => part.trim()).filter(Boolean);
  const first = parts.shift();
  if (!first) return null;
  const eq = first.indexOf('=');
  if (eq <= 0) return null;
  const name = first.slice(0, eq).trim();
  const value = first.slice(eq + 1).trim();
  const attributes: Record<string, string | true> = {};

  for (const part of parts) {
    const attrEq = part.indexOf('=');
    if (attrEq < 0) attributes[part.toLowerCase()] = true;
    else attributes[part.slice(0, attrEq).trim().toLowerCase()] = part.slice(attrEq + 1).trim();
  }

  const findings: CookieFinding[] = [];
  const secure = 'secure' in attributes;
  const httpOnly = 'httponly' in attributes;
  const sameSite = String(attributes.samesite ?? '').toLowerCase();
  const partitioned = 'partitioned' in attributes;
  const domain = 'domain' in attributes;
  const path = String(attributes.path ?? '');

  if (sameSite === 'none' && !secure) findings.push({ tone: 'warn', title: 'SAMESITE=None WITHOUT Secure', detail: 'Browsers require Secure when SameSite=None is used.' });
  if (partitioned && !secure) findings.push({ tone: 'warn', title: 'Partitioned WITHOUT Secure', detail: 'Partitioned cookies require Secure.' });
  if (name.startsWith('__Secure-') && !secure) findings.push({ tone: 'warn', title: '__Secure- PREFIX VIOLATION', detail: 'A __Secure- cookie must be set with Secure from a secure origin.' });
  if (name.startsWith('__Host-')) {
    if (!secure) findings.push({ tone: 'warn', title: '__Host- MISSING Secure', detail: '__Host- cookies require Secure.' });
    if (domain) findings.push({ tone: 'warn', title: '__Host- HAS Domain', detail: '__Host- cookies must not specify Domain.' });
    if (path !== '/') findings.push({ tone: 'warn', title: '__Host- PATH MISMATCH', detail: '__Host- cookies require Path=/.' });
  }
  if (httpOnly) findings.push({ tone: 'good', title: 'HttpOnly', detail: 'Client-side JavaScript cannot read the cookie through document.cookie.' });
  else findings.push({ tone: 'info', title: 'HttpOnly not set', detail: 'Verify that the cookie actually needs JavaScript access; session identifiers normally should not.' });
  if (secure) findings.push({ tone: 'good', title: 'Secure', detail: 'The cookie is restricted to secure transport, subject to localhost/browser rules.' });
  else findings.push({ tone: 'info', title: 'Secure not set', detail: 'Review whether this cookie can be restricted to HTTPS.' });
  if (!sameSite) findings.push({ tone: 'info', title: 'SameSite omitted', detail: 'Modern browsers commonly treat an omitted SameSite value as Lax; verify intended cross-site behavior.' });
  if (domain) findings.push({ tone: 'info', title: 'Domain set', detail: 'The cookie is available to the specified domain scope; use the narrowest scope needed.' });
  if (partitioned) findings.push({ tone: 'good', title: 'Partitioned', detail: 'The cookie opts into partitioned storage; Secure is required.' });
  if (!findings.some((item) => item.tone === 'warn')) findings.push({ tone: 'good', title: 'No rule violations detected', detail: 'This local parser found no obvious attribute contradiction.' });

  return { raw, name, value, attributes, findings };
}

export function parseCookieBatch(raw: string): ParsedCookie[] {
  return clampSecurityInput(raw)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parseSetCookieLine)
    .filter((item): item is ParsedCookie => Boolean(item));
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value.replace(/\s+/g, ''));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export function encodeBase64Utf8(value: string): string {
  return bytesToBase64(new TextEncoder().encode(value));
}

export function decodeBase64Utf8(value: string): string {
  return new TextDecoder().decode(base64ToBytes(value));
}

export function encodeHexUtf8(value: string): string {
  return Array.from(new TextEncoder().encode(value), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function decodeHexUtf8(value: string): string {
  const normalized = value.replace(/\s+/g, '').toLowerCase();
  if (!/^[0-9a-f]*$/.test(normalized) || normalized.length % 2 !== 0) throw new Error('Hex input must contain an even number of hexadecimal characters.');
  const bytes = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < normalized.length; i += 2) bytes[i / 2] = Number.parseInt(normalized.slice(i, i + 2), 16);
  return new TextDecoder().decode(bytes);
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] ?? char);
}
