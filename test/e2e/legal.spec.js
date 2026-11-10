import { test, expect, audit } from './fixtures.js';

for (const title of ['Privacy', 'Terms']) {
  test(`${title} page is reachable and returns to the editor`, async ({ page }, testInfo) => {
    await page.goto('/editor.html');
    await page.getByRole('link', { name: title, exact: true }).click();
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
    await audit(page, testInfo, title.toLowerCase());
    await page.getByRole('link', { name: 'Open editor' }).click();
    await expect(page.getByRole('textbox', { name: 'Phrase' })).toBeVisible();
  });
}
