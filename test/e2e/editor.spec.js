import { test, expect, audit } from './fixtures.js';

test('F01-H1 editor loads, phrase and focus update, keyboard shortcut works', async ({ page }, testInfo) => {
  await page.goto('/editor.html');
  await expect(page.getByRole('textbox', { name: 'Phrase' })).toHaveValue('Everything is going according to plan');
  await expect(page.getByRole('img', { name: /preview/i })).toBeVisible();
  await page.getByRole('textbox', { name: 'Phrase' }).fill('Café 🚀 new ideas');
  await page.getByRole('group', { name: 'Word to lock' }).getByRole('button', { name: 'ideas', exact: true }).click();
  await expect(page.getByRole('group', { name: 'Word to lock' }).getByRole('button', { name: 'ideas', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Shuffle pages' }).focus();
  await page.keyboard.press('/');
  await expect(page.getByRole('textbox', { name: 'Phrase' })).toBeFocused();
  await audit(page, testInfo, 'editor');
});

test('F01-E1 empty and whitespace input disables download and shows guidance', async ({ page }, testInfo) => {
  await page.goto('/editor.html');
  for (const value of ['', '   ']) {
    await page.getByRole('textbox', { name: 'Phrase' }).fill(value);
    await expect(page.getByRole('button', { name: 'Download video' })).toBeDisabled();
    await expect(page.getByText('Type a phrase to see your match cut.')).toBeVisible();
    await expect(page.getByRole('img', { name: /preview/i })).toBeHidden();
  }
  await audit(page, testInfo, 'empty');
});

test('F02-H1 every aspect ratio resizes the rendered canvas', async ({ page }, testInfo) => {
  await page.goto('/editor.html');
  for (const [ratio, width, height] of [['9:16', 1080, 1920], ['1:1', 1080, 1080], ['16:9', 1920, 1080]]) {
    await page.getByRole('radio', { name: ratio, exact: true }).check();
    const stage = page.getByRole('img', { name: /preview/i });
    await expect(stage).toHaveAttribute('width', String(width));
    await expect(stage).toHaveAttribute('height', String(height));
    await audit(page, testInfo, `ratio-${ratio.replace(':', '-')}`);
  }
});

test('F03-H1 every example fills its phrase and selected word', async ({ page }, testInfo) => {
  await page.goto('/editor.html');
  for (const [phrase, focus] of [['Nobody saw it coming', 'Nobody'], ['The truth about sleep', 'truth'], ['Rent went up again', 'Rent']]) {
    await page.getByRole('group', { name: 'Examples' }).getByRole('button', { name: phrase, exact: true }).click();
    await expect(page.getByRole('textbox', { name: 'Phrase' })).toHaveValue(phrase);
    await expect(page.getByRole('group', { name: 'Word to lock' }).getByRole('button', { name: focus, exact: true })).toHaveAttribute('aria-pressed', 'true');
  }
  await audit(page, testInfo, 'example');
});

test('F01-E2 malformed query settings recover to a usable editor', async ({ page }, testInfo) => {
  for (const separator of ['?', '#']) {
    await page.goto(`/editor.html${separator}ratio=broken&focus=1.5&cps=NaN&zoom=Infinity&format=invalid&style=invalid&duration=-4&text=two+words`);
    await expect(page.getByRole('img', { name: /preview/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Download video' })).toBeEnabled();
    await expect(page.getByRole('group', { name: 'Word to lock' }).getByRole('button', { pressed: true })).toHaveCount(1);
    await expect(page.getByRole('radio', { checked: true })).toHaveCount(1);
    await audit(page, testInfo, separator === '?' ? 'ignored-query' : 'malformed-settings');
  }
});

test('F01-E3 long accented phrase remains bounded and text is rendered literally', async ({ page }, testInfo) => {
  await page.goto('/editor.html');
  const phrase = page.getByRole('textbox', { name: 'Phrase' });
  await phrase.fill('é'.repeat(100));
  expect(await phrase.inputValue()).toHaveLength(80);
  await phrase.fill('<img src=x onerror=alert(1)>');
  await expect(page.getByRole('group', { name: 'Word to lock' }).locator('img')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Download video' })).toBeEnabled();
  await audit(page, testInfo, 'long-input');
});

test('F02-E1 reduced motion starts paused and stays visually still', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/editor.html');
  await expect(page.getByRole('button', { name: 'Play', exact: true })).toBeVisible();
  const stage = page.getByRole('img', { name: /preview/i });
  const before = await stage.evaluate(canvas => canvas.toDataURL());
  await page.waitForTimeout(300);
  expect(await stage.evaluate(canvas => canvas.toDataURL())).toBe(before);
  await audit(page, testInfo, 'reduced-motion');
});

test('F01-E4 mobile editor has no horizontal overflow and all controls work', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/editor.html');
  await page.getByRole('textbox', { name: 'Phrase' }).fill('Mobile story');
  await page.getByRole('radio', { name: '16:9', exact: true }).check();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('textbox', { name: 'Phrase' }).scrollIntoViewIfNeeded();
  const preview = await page.getByRole('region', { name: 'Preview', exact: true }).boundingBox();
  const editor = await page.locator('form').boundingBox();
  expect(preview.y + preview.height, 'Mobile preview must sit above the form without overlapping controls').toBeLessThanOrEqual(editor.y + 1);
  await expect(page.getByRole('button', { name: 'Download video' })).toBeEnabled();
  await audit(page, testInfo, 'mobile');
});

test('F02-H2 tune all sounds, paper, colour and sliders without errors', async ({ page }, testInfo) => {
  await page.goto('/editor.html');
  for (const sound of ['paper', 'shutter', 'film', 'polaroid', 'flash', 'none']) {
    await page.getByRole('combobox', { name: /^Sound/ }).selectOption(sound);
    await page.getByRole('button', { name: 'Hear it' }).click();
  }
  await page.getByRole('combobox', { name: /^Paper/ }).selectOption('mixed');
  await page.getByLabel('Highlighter').fill('#123456');
  for (const [name, value] of [[/Cuts per second/, '16'], [/Zoom/, '2.5'], [/Blur/, '0'], [/Length in seconds/, '10']]) {
    await page.getByRole('slider', { name }).press(value === '0' ? 'Home' : 'End');
    await expect(page.getByRole('slider', { name })).toHaveValue(value);
  }
  await audit(page, testInfo, 'tuned-settings');
});

test('F02-H3 copied link restores phrase, focus and settings without putting phrase in request URLs', async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async text => { window.copiedLink = text; } } });
  });
  await page.goto('/editor.html');
  await page.getByRole('textbox', { name: 'Phrase' }).fill('Private café phrase');
  await page.getByRole('group', { name: 'Word to lock' }).getByRole('button', { name: 'café', exact: true }).click();
  await page.getByRole('radio', { name: '16:9', exact: true }).check();
  await page.getByRole('button', { name: 'Copy link' }).click();
  const copied = await page.evaluate(() => window.copiedLink);
  const url = new URL(copied);
  expect(url.search).toBe('');
  expect(url.hash).toContain('text=');
  const outgoing = [];
  page.on('request', request => outgoing.push(request.url()));
  await page.goto(copied);
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Phrase' })).toHaveValue('Private café phrase');
  await expect(page.getByRole('group', { name: 'Word to lock' }).getByRole('button', { name: 'café', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('radio', { name: '16:9', exact: true })).toBeChecked();
  expect(outgoing.some(url => /Private|caf|phrase/.test(url))).toBe(false);
  await audit(page, testInfo, 'shared-state');
});

test('F01-E5 editor remains usable offline after initial load', async ({ page, context }, testInfo) => {
  await page.goto('/editor.html');
  await expect(page.getByRole('img', { name: /preview/i })).toBeVisible();
  await context.setOffline(true);
  await page.getByRole('textbox', { name: 'Phrase' }).fill('Offline story');
  await page.getByRole('group', { name: 'Word to lock' }).getByRole('button', { name: 'story', exact: true }).click();
  await page.getByRole('button', { name: 'Shuffle pages' }).click();
  await expect(page.getByRole('button', { name: 'Download video' })).toBeEnabled();
  await expect(page.getByRole('group', { name: 'Word to lock' }).getByRole('button', { name: 'story', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await context.setOffline(false);
  await audit(page, testInfo, 'offline-editor');
});
