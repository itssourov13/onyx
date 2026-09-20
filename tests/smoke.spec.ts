import { test, expect } from '@playwright/test';

import { publicRoutes } from './route-matrix';

const routes = publicRoutes;

test.describe('public route smoke', () => {
  for (const route of routes) {
    test(`${route} responds successfully`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(response, `No response for ${route}`).not.toBeNull();
      expect(response?.status(), `Unexpected status for ${route}`).toBe(200);
      await expect(page.locator('main')).toBeVisible();
    });
  }
});


test('robots and sitemap resources are generated', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain('/sitemap.xml');
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain('/documents/browser-security-boundaries');
});

test('unknown routes resolve to the designed 404 surface', async ({ page }) => {
  const response = await page.goto('/definitely-not-a-real-onyx-route', { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBe(404);
  await expect(page.getByText('404 / NO SIGNAL')).toBeVisible();
});

test('health endpoint returns demo operational metadata', async ({ request }) => {
  const response = await request.get('/api/health');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toMatchObject({ service: 'onyx-archive-demo-api', status: 'operational', demo: true });
  expect(typeof body.build).toBe('string');
});

test('production response contains the required browser security headers', async ({ page }) => {
  const response = await page.goto('/status', { waitUntil: 'domcontentloaded' });
  const headers = response?.headers() ?? {};

  expect(headers['content-security-policy']).toContain("default-src 'self'");
  expect(headers['content-security-policy']).not.toContain("'unsafe-eval'");
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['x-frame-options']).toBe('DENY');
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(headers['permissions-policy']).toContain('geolocation=()');
  expect(headers['strict-transport-security']).toContain('max-age=31536000');
});
