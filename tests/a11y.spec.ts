import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { publicRoutes } from './route-matrix';

const pages = [...publicRoutes];

test.describe('automated accessibility', () => {
  for (const route of pages) {
    test(`${route} has no moderate-or-higher axe violations`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'networkidle' });
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      const blocking = results.violations.filter((item) => ['moderate', 'serious', 'critical'].includes(item.impact ?? ''));
      expect(blocking, blocking.map((item) => `${item.id}: ${item.help}`).join('\n')).toEqual([]);
    });
  }
});
