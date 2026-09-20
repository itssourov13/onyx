import { test, expect } from '@playwright/test';

test.describe('keyboard and stateful interaction', () => {
  test('mobile navigation traps focus and restores it on close', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const menuButton = page.getByRole('button', { name: 'Open menu' });
    await menuButton.focus();
    await menuButton.press('Enter');

    const menu = page.getByRole('navigation', { name: 'Mobile navigation' });
    await expect(menu).toBeVisible();
    await expect(page.locator(':focus')).toHaveAttribute('href', /.+/);

    await page.keyboard.press('Shift+Tab');
    await expect(page.locator(':focus')).toHaveJSProperty('tagName', 'BUTTON');

    await page.keyboard.press('Escape');
    await expect(menu).toHaveCount(0);
    await expect(menuButton).toBeFocused();
  });

  test('command palette traps focus and restores it after escape', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const searchButton = page.getByRole('button', { name: 'Open command search' });
    await searchButton.focus();
    await searchButton.press('Enter');

    const dialog = page.getByRole('dialog', { name: 'Site command search' });
    await expect(dialog).toBeVisible();
    const input = page.getByRole('textbox', { name: 'Search site' });
    await expect(input).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(page.locator(':focus')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(searchButton).toBeFocused();
  });


  test('mobile menu exposes the full route map', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Open menu' }).click();
    const menu = page.getByRole('navigation', { name: 'Mobile navigation' });
    await expect(menu.getByRole('link', { name: 'Archive' })).toBeVisible();
    await expect(menu.getByRole('link', { name: 'Research' })).toBeVisible();
    await expect(menu.getByRole('link', { name: 'Network' })).toBeVisible();
    await expect(menu.getByRole('link', { name: 'Contact' })).toBeVisible();
    await expect(menu.getByRole('link', { name: 'Security Control Room' })).toBeVisible();
    await expect(menu.getByRole('link', { name: 'Casebook' })).toBeVisible();
    await expect(menu.getByRole('link', { name: 'Topics' })).toBeVisible();
    await expect(menu.getByRole('link')).toHaveCount(20);
  });

  test('desktop More menu exposes system and cybersecurity modules', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.getByText('More', { exact: true }).click();
    const more = page.locator('.nav-more-panel');
    await expect(more.getByRole('link', { name: 'Status' })).toBeVisible();
    await expect(more.getByRole('link', { name: 'Security Control Room' })).toBeVisible();
    await expect(more.getByRole('link', { name: 'Request Inspector' })).toBeVisible();
    await expect(more.getByRole('link', { name: 'Topics' })).toBeVisible();
  });

  test('archive filters expose pressed state', async ({ page }) => {
    await page.goto('/archive', { waitUntil: 'domcontentloaded' });
    const security = page.getByRole('button', { name: 'SECURITY', exact: true });
    await expect(security).toHaveAttribute('aria-pressed', 'false');
    await security.click();
    await expect(security).toHaveAttribute('aria-pressed', 'true');
  });

  test('network nodes are keyboard operable', async ({ page }) => {
    await page.goto('/network', { waitUntil: 'domcontentloaded' });
    const node = page.getByRole('button', { name: /A1 ARCHIVE CORE/i });
    await expect(node).toBeVisible();
    await node.focus();
    await node.press('Enter');
    await expect(page.getByText('ARCHIVE CORE')).toBeVisible();
  });
});


test('homepage intelligence cards resolve to intelligence detail routes', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const links = page.locator('a[href^="/intelligence/"]');
  await expect(links).toHaveCount(3);
  await expect(links.first()).toHaveAttribute('href', /\/intelligence\//);
});

test('deep routes keep their parent navigation item active', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/security/requests', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.nav-more-summary')).toHaveClass(/active/);
});
