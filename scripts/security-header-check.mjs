const target = process.env.DEPLOY_URL;

if (!target) {
  console.log('DEPLOY_URL is not set; deployed-header verification is skipped.');
  console.log('Usage: DEPLOY_URL=https://your-deployment.example npm run qa:deployed-headers');
  process.exit(0);
}

const url = new URL(target);
if (!/^https?:$/.test(url.protocol)) throw new Error(`DEPLOY_URL must use http:// or https://: ${target}`);

const response = await fetch(url, { redirect: 'follow' });
const csp = response.headers.get('content-security-policy') ?? '';
const permissions = response.headers.get('permissions-policy') ?? '';
const hsts = response.headers.get('strict-transport-security') ?? '';
const required = [
  ['content-security-policy', csp.includes("default-src 'self'") && csp.includes("frame-ancestors 'none'") && csp.includes("object-src 'none'") && !csp.includes("'unsafe-eval'")],
  ['x-content-type-options', response.headers.get('x-content-type-options') === 'nosniff'],
  ['x-frame-options', response.headers.get('x-frame-options') === 'DENY'],
  ['referrer-policy', response.headers.get('referrer-policy') === 'strict-origin-when-cross-origin'],
  ['permissions-policy', ['camera=()','microphone=()','geolocation=()','payment=()'].every((token) => permissions.includes(token))],
  ['strict-transport-security', /(?:^|;\s*)max-age=(?:31536000|[1-9]\d{7,})(?:;|$)/i.test(hsts) && /includeSubDomains/i.test(hsts)],
  ['cross-origin-opener-policy', response.headers.get('cross-origin-opener-policy') === 'same-origin'],
  ['origin-agent-cluster', response.headers.get('origin-agent-cluster') === '?1'],
  ['x-permitted-cross-domain-policies', response.headers.get('x-permitted-cross-domain-policies') === 'none'],
  ['content-security-policy-connect-src', csp.includes("connect-src 'self'")],
  ['content-security-policy-form-action', csp.includes("form-action 'self'")],
  ['content-security-policy-base-uri', csp.includes("base-uri 'self'")],
];

console.log(`Checked ${url.origin} — HTTP ${response.status}`);
for (const [name] of required) console.log(`${name}: ${response.headers.get(name) ?? '<missing>'}`);
const failures = required.filter(([, ok]) => !ok).map(([name]) => name);
if (failures.length) {
  console.error(`\nSecurity header verification failed: ${failures.join(', ')}`);
  process.exit(1);
}
console.log('All required production security headers passed.');
