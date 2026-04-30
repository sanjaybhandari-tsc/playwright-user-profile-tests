const { test, expect } = require('@playwright/test');

test('basic test', async ({ page }) => {
  await page.goto('https://dev.collectivwork.com/login');
  await expect(page).toHaveTitle(/Collectiv Work/);
});