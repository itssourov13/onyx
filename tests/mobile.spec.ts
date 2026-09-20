import { test, expect } from '@playwright/test';
import { publicRoutes } from './route-matrix';

const mobileRoutes = publicRoutes;

test.describe('mobile layout regression', () => {
  for (const route of mobileRoutes) {
    test(`${route} has no horizontal page overflow`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'networkidle' });
      const overflow = await page.evaluate(() => ({
        width: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(overflow.scrollWidth, `${route} overflows horizontally`).toBeLessThanOrEqual(overflow.width + 1);
    });
  }
});
