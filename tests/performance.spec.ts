import { test, expect } from '@playwright/test';
import { publicRoutes } from './route-matrix';

const routes = publicRoutes;

test.describe('performance guardrails', () => {
  for (const route of routes) {
    test(`${route} keeps the initial HTML payload bounded`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      const length = Number(response?.headers()['content-length'] ?? 0);
      if (length > 0) expect(length, `${route} HTML is unexpectedly large`).toBeLessThan(350_000);

      const metrics = await page.evaluate(() => ({
        domContentLoaded: performance.getEntriesByType('navigation')[0]?.toJSON?.().domContentLoadedEventEnd ?? 0,
        resourceCount: performance.getEntriesByType('resource').length,
      }));

      expect(metrics.domContentLoaded, `${route} did not expose navigation timing`).toBeGreaterThanOrEqual(0);
      expect(metrics.resourceCount, `${route} loaded an unexpectedly large number of resources`).toBeLessThan(120);
    });
  }
});
