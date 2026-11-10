import { test, expect, audit } from './fixtures.js';

test('Landing introduces Pressflick, uses local assets and opens the separate editor', async ({ page }, testInfo) => {
  const external = [];
  page.on('request', request => {
    const url = new URL(request.url());
    if (['http:', 'https:'].includes(url.protocol) && url.origin !== 'http://127.0.0.1:5174') external.push(url.href);
  });
  await page.goto('/');
  await expect(page).toHaveTitle(/Pressflick/i);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(await page.getByRole('main').getByRole('heading', { level: 2 }).count()).toBe(5);
  await expect(page.getByRole('banner')).toBeVisible();
  const links = page.getByRole('link', { name: 'Open editor', exact: true });
  expect(await links.count()).toBeGreaterThan(0);
  for (const link of await links.all()) {
    await expect(link).toBeVisible();
    expect(new URL(await link.getAttribute('href'), page.url()).pathname).toBe('/editor.html');
  }
  const videos = page.locator('video');
  expect(await videos.count(), 'Landing includes a real sample video').toBeGreaterThan(0);
  for (const video of await videos.all()) {
    await expect(video).toBeVisible();
    await expect(video).toHaveJSProperty('controls', true);
    const sources = await video.evaluate(element => [element.getAttribute('src'), ...Array.from(element.querySelectorAll('source'), source => source.getAttribute('src'))].filter(Boolean));
    expect(sources.length).toBeGreaterThan(0);
    for (const source of sources) expect(new URL(source, page.url()).origin).toBe(new URL(page.url()).origin);
  }
  const details = page.locator('details').first();
  await expect(details).toBeVisible();
  await details.locator('summary').click();
  await expect(details).toHaveAttribute('open', '');
  await audit(page, testInfo, 'landing-faq-open');
  await details.locator('summary').click();
  await expect(details).not.toHaveAttribute('open');
  expect(external, 'Landing must not request external fonts, media, scripts or tracking').toEqual([]);
  await links.first().click();
  await expect(page).toHaveURL(/\/editor\.html$/);
  await expect(page.getByRole('textbox', { name: 'Phrase' })).toBeVisible();
});

test('Landing motion can be paused by keyboard and the sample plays on request', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const motion = page.getByRole('button', { name: 'Pause page motion', exact: true });
  await motion.focus();
  await page.keyboard.press('Enter');
  const states = () => page.locator('.fountain i, .ticker-track').evaluateAll(elements => elements.map(element => getComputedStyle(element).animationPlayState));
  expect(await states()).toEqual(['paused', 'paused', 'paused', 'paused', 'paused']);
  await page.getByRole('button', { name: 'Resume page motion', exact: true }).press('Enter');
  expect((await states()).every(state => state === 'running')).toBe(true);
  const play = page.getByRole('button', { name: 'Play the sample', exact: true });
  await play.press('Enter');
  await expect(play).toBeHidden();
  const video = page.locator('.demo-video');
  await expect(video).toBeFocused();
  await expect.poll(() => video.evaluate(element => element.currentTime)).toBeGreaterThan(0);
  await video.evaluate(element => element.pause());
  await audit(page, testInfo, 'landing-motion-and-play');
});

test('Mobile landing fits the viewport and reduced motion never autoplays samples', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/');
  const headerLink = await page.getByRole('banner').getByRole('link', { name: 'Open editor', exact: true }).boundingBox();
  expect(headerLink.x + headerLink.width).toBeLessThanOrEqual(320);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const videos = page.locator('video');
  expect(await videos.count()).toBeGreaterThan(0);
  for (const video of await videos.all()) {
    await expect(video).not.toHaveAttribute('autoplay');
    expect(await video.evaluate(element => element.paused)).toBe(true);
  }
  await page.waitForTimeout(300);
  expect(await videos.evaluateAll(elements => elements.every(video => video.paused && video.currentTime === 0))).toBe(true);
  await audit(page, testInfo, 'landing-mobile-reduced-motion');
});
