import { test, expect, audit } from './fixtures.js';
import { STARTERS } from '../../src/presets.js';
import { readFile } from 'node:fs/promises';

test('Starter choices stay paused, defer video requests and load their real editor settings', async ({ page }, testInfo) => {
  const media = [];
  page.on('request', request => { if (new URL(request.url()).pathname.endsWith('.mp4')) media.push(request.url()); });
  for (const starter of STARTERS) {
    await page.goto('/');
    const choice = page.getByRole('group', { name: 'Starter cuts', exact: true }).getByRole('button', { name: starter.title, exact: true });
    await choice.click();
    await expect(choice).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByLabel('Starter preview', { exact: true })).toHaveJSProperty('paused', true);
    const use = page.getByRole('link', { name: 'Use this cut', exact: true });
    const url = new URL(await use.getAttribute('href'), page.url());
    expect(url.search).toBe('');
    expect(new URLSearchParams(url.hash.slice(1)).get('text')).toBe(starter.settings.text);
    await audit(page, testInfo, `starter-${starter.id}`);
    await use.click();
    await expect(page.getByRole('textbox', { name: 'Phrase', exact: true })).toHaveValue(starter.settings.text);
    for (const [name, value] of Object.entries(starter.settings)) {
      if (['focus', 'seed'].includes(name)) continue;
      if (name === 'ratio') await expect(page.getByRole('radio', { name: String(value), exact: true })).toBeChecked();
      else await expect(page.locator(`[name="${name}"]`)).toHaveValue(String(value));
    }
    const word = starter.settings.text.split(/\s+/)[starter.settings.focus];
    await expect(page.locator('#words').getByRole('button', { name: word, exact: true })).toHaveAttribute('aria-pressed', 'true');
  }
  expect(media, 'Landing must not fetch any MP4 until the visitor plays or downloads').toEqual([]);
});

for (const starter of STARTERS) {
  test(`Real starter ${starter.title} plays to its end`, async ({ page }, testInfo) => {
    await page.goto('/');
    await page.getByRole('group', { name: 'Starter cuts', exact: true }).getByRole('button', { name: starter.title, exact: true }).click();
    const preview = page.locator('#starter-video');
    await preview.evaluate(video => { video.muted = true; });
    const play = page.getByRole('button', { name: 'Play preview', exact: true });
    await play.press('Enter');
    await expect(play).toBeHidden();
    await page.waitForFunction(() => document.querySelector('#starter-video').ended, {}, { timeout: 15_000 });
    const result = await preview.evaluate(video => ({ controls: video.controls, width: video.videoWidth, height: video.videoHeight, time: video.currentTime, duration: video.duration }));
    expect(result.controls).toBe(true);
    const dimensions = { '9:16': [1080, 1920], '1:1': [1080, 1080], '16:9': [1920, 1080] };
    expect([result.width, result.height]).toEqual(dimensions[starter.settings.ratio]);
    expect(result.time).toBeGreaterThanOrEqual(3);
    expect(result.time).toBeLessThan(3.2);
    await testInfo.attach(`playback-${starter.id}`, { body: JSON.stringify(result), contentType: 'application/json' });
  });
}

test('Cut inspection uses the keyboard without moving the page or starting video', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const slider = page.getByRole('slider', { name: 'Inspect a cut', exact: true });
  await slider.scrollIntoViewIfNeeded();
  await slider.focus();
  await slider.press('Home');
  const before = await slider.evaluate(control => control.getBoundingClientRect().top);
  await slider.press('End');
  await expect(page.locator('#cut-inspect-out')).toHaveText('Cut 47');
  await expect(page.locator('.contact-sheet [aria-current="true"] figcaption')).toHaveText('Cut 47');
  await expect.poll(() => page.locator('.contact-track').evaluate(track => track.scrollLeft)).toBeGreaterThan(0);
  expect(Math.abs(await slider.evaluate(control => control.getBoundingClientRect().top) - before)).toBeLessThanOrEqual(1);
  expect(await page.locator('video').evaluateAll(videos => videos.every(video => video.paused))).toBe(true);
  await slider.press('Home');
  await expect(page.locator('#cut-inspect-out')).toHaveText('Cut 05');
  await audit(page, testInfo, 'cut-inspector');
});

test('Format shortcuts open the chosen editor ratio', async ({ page }, testInfo) => {
  for (const [name, ratio] of [['vertical', '9:16'], ['square', '1:1'], ['landscape', '16:9']]) {
    await page.goto('/');
    await page.getByRole('link', { name: new RegExp(`^Open ${name} editor`) }).click();
    await expect(page.getByRole('radio', { name: ratio, exact: true })).toBeChecked();
  }
  await audit(page, testInfo, 'format-shortcut');
});

test('Hover highlights one word while preserving the copy and its layout', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const paragraph = page.locator('.steps p').first();
  const word = paragraph.getByText('thought,', { exact: true });
  const before = await paragraph.boundingBox();
  await word.hover();
  await expect(word).toHaveCSS('background-color', 'rgb(255, 210, 63)');
  await expect(word).toHaveCSS('color', 'rgb(20, 27, 92)');
  await expect(paragraph).toHaveText('A thought, a hook, a line worth holding onto. Start with the words you want on screen.');
  expect((await paragraph.boundingBox()).height).toBeCloseTo(before.height, 1);
  await audit(page, testInfo, 'word-hover');
});

test('Share kit copies only the public site URL and downloads the actual sample', async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async value => { window.copiedSite = value; } } });
  });
  await page.goto('/?campaign=private#text=private-phrase');
  await page.getByRole('button', { name: 'Copy site link', exact: true }).click();
  await expect(page.locator('#share-status')).toContainText('copied');
  expect(await page.evaluate(() => window.copiedSite)).toBe('http://127.0.0.1:5174/');
  const pending = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download sample', exact: true }).click();
  const download = await pending;
  expect(await download.failure()).toBeNull();
  expect(download.suggestedFilename()).toBe('pressflick-sample.mp4');
  const bytes = await readFile(await download.path());
  expect(bytes.subarray(4, 8).toString()).toBe('ftyp');
  expect(bytes.length).toBeGreaterThan(1_000_000);
  await audit(page, testInfo, 'share-kit');
});

test('Clipboard refusal leaves a selectable site URL; native sharing runs only on click', async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new DOMException('Denied', 'NotAllowedError'); } } });
    Object.defineProperty(navigator, 'share', { configurable: true, value: async payload => { window.sharedSite = payload; } });
  });
  await page.goto('/#text=private-phrase');
  expect(await page.evaluate(() => window.sharedSite)).toBeUndefined();
  await page.getByRole('button', { name: 'Copy site link', exact: true }).click();
  const fallback = page.getByRole('textbox', { name: 'Site link', exact: true });
  await expect(fallback).toBeVisible();
  await expect(fallback).toHaveValue('http://127.0.0.1:5174/');
  await expect(fallback).toHaveAttribute('readonly', '');
  await expect(fallback).toBeFocused();
  await page.getByRole('button', { name: 'Share Pressflick', exact: true }).click();
  expect((await page.evaluate(() => window.sharedSite)).url).toBe('http://127.0.0.1:5174/');
  await audit(page, testInfo, 'share-fallback');
});

test('Cancelling native sharing keeps the page usable and failure offers manual copy', async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { configurable: true, writable: true, value: async () => { throw new DOMException('Cancelled', 'AbortError'); } });
  });
  await page.goto('/');
  const share = page.getByRole('button', { name: 'Share Pressflick', exact: true });
  await share.click();
  await expect(page.locator('#share-status')).toContainText('cancelled');
  await page.evaluate(() => { navigator.share = async () => { throw new DOMException('Unavailable', 'NotAllowedError'); }; });
  await share.click();
  await expect(page.getByRole('textbox', { name: 'Site link', exact: true })).toBeVisible();
  await expect(page.locator('#share-status')).toContainText('unavailable');
  await audit(page, testInfo, 'native-share-fallback');
});

test('Creator components fit a narrow viewport and reduced motion starts all previews paused', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const starter of STARTERS) {
    await page.getByRole('group', { name: 'Starter cuts', exact: true }).getByRole('button', { name: starter.title, exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByLabel('Starter preview', { exact: true })).toHaveJSProperty('paused', true);
  }
  await page.getByRole('heading', { name: 'Made to pass around.' }).scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await audit(page, testInfo, 'creator-mobile');
});
