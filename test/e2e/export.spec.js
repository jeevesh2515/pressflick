import { test, expect, audit, capabilities, verifyDownload } from './fixtures.js';
import { readFile } from 'node:fs/promises';

async function prepare(page) {
  await page.goto('/editor.html');
  await page.getByRole('radio', { name: '1:1', exact: true }).check();
  await page.getByRole('combobox', { name: /^Sound/ }).selectOption('none');
  await page.getByRole('slider', { name: /Length in seconds/ }).press('Home');
  await page.getByRole('slider', { name: /Cuts per second/ }).press('Home');
}

for (const format of ['mp4', 'webm']) {
  test(`F01-H2 ${format.toUpperCase()} exports a real playable file or reports unavailable capability`, async ({ page }, testInfo) => {
    await prepare(page);
    const support = await capabilities(page, testInfo);
    await page.getByRole('combobox', { name: /^Format/ }).selectOption(format);
    if ((format === 'mp4' && support.videoEncoder) || (support.captureStream && support.mediaRecorder && support[format])) {
      const pending = page.waitForEvent('download');
      await page.getByRole('button', { name: 'Download video' }).click();
      const download = await pending;
      await verifyDownload(page, download, testInfo, format === 'mp4' && support.videoEncoder ? ['mp4'] : [support[format].includes('mp4') ? 'mp4' : 'webm']);
      await expect(page.locator('#status')).toContainText('Saved');
      await expect(page.getByRole('button', { name: 'Download video' })).toBeEnabled();
    } else {
      await page.getByRole('button', { name: 'Download video' }).click();
      await expect(page.locator('#status')).toContainText(/cannot|unavailable|not supported/i);
    }
    await audit(page, testInfo, `${format}-result`);
  });
}

test('Sound-enabled real-time export keeps the silent gaps between cuts', async ({ page }, testInfo) => {
  await prepare(page);
  await page.getByRole('combobox', { name: /^Format/ }).selectOption('webm');
  await page.getByRole('combobox', { name: /^Sound/ }).selectOption('paper');
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download video' }).click();
  const download = await pending;
  await verifyDownload(page, download, testInfo, ['webm', 'mp4']);
  const base64 = (await readFile(await download.path())).toString('base64');
  const duration = await page.evaluate(async (encoded) => {
    const video = document.createElement('video');
    video.muted = true;
    const url = URL.createObjectURL(new Blob([Uint8Array.from(atob(encoded), c => c.charCodeAt(0))]));
    document.body.append(video);
    let timer;
    try {
      const ended = new Promise((resolve, reject) => {
        video.onended = () => resolve(video.currentTime);
        video.onerror = () => reject(new Error(`Recording playback failed: ${video.error?.message}`));
        timer = setTimeout(() => reject(new Error('Recording playback did not finish')), 10_000);
      });
      video.src = url;
      await video.play();
      return await ended;
    } finally {
      clearTimeout(timer);
      video.removeAttribute('src');
      video.load();
      video.remove();
      URL.revokeObjectURL(url);
    }
  }, base64);
  // Real-time capture can miss a boundary frame; losing most of a two-second clip is a defect.
  expect(duration).toBeGreaterThan(1.6);
  expect(duration).toBeLessThan(2.5);
  await testInfo.attach('sound-recording-playback', { body: JSON.stringify({ requested: 2, duration }), contentType: 'application/json' });
});

test('F02-E2 recording freezes all editing controls, prevents repeat submit, and restores them', async ({ page }, testInfo) => {
  await prepare(page);
  await page.getByRole('combobox', { name: /^Format/ }).selectOption('webm');
  const downloads = [];
  page.on('download', download => downloads.push(download));
  const completed = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download video' }).click();
  await expect(page.getByRole('button', { name: 'Download video' })).toBeDisabled();
  for (const control of [page.getByRole('textbox', { name: 'Phrase' }), page.getByRole('radio', { name: '16:9', exact: true }), page.getByRole('combobox', { name: /^Format/ }), page.getByRole('combobox', { name: /^Sound/ }), page.getByRole('slider', { name: /Length in seconds/ }), page.getByRole('button', { name: 'Shuffle pages' }), page.getByRole('button', { name: 'Copy link' }), page.getByRole('button', { name: 'Hear it' }), page.getByRole('button', { name: 'Pause', exact: true }), page.getByRole('group', { name: 'Examples' }).getByRole('button').first(), page.getByRole('group', { name: 'Word to lock' }).getByRole('button').first()]) {
    await expect(control).toBeDisabled();
  }
  await page.keyboard.press('Enter');
  await completed;
  await expect(page.getByRole('textbox', { name: 'Phrase' })).toBeEnabled();
  expect(downloads).toHaveLength(1);
  await audit(page, testInfo, 'recording-complete');
});

test('F01-N1 missing encoders and MediaRecorder show actionable error and keep editor usable', async ({ page }, testInfo) => {
  await page.addInitScript(() => { delete window.VideoEncoder; delete window.MediaRecorder; });
  await prepare(page);
  await page.getByRole('button', { name: 'Download video' }).click();
  await expect(page.locator('#status')).toContainText(/cannot|unavailable|not supported/i);
  await expect(page.getByRole('button', { name: 'Download video' })).toBeEnabled();
  await audit(page, testInfo, 'recording-unavailable');
});

test('F01-N2 missing canvas capture shows clear error without crashing', async ({ page }, testInfo) => {
  await page.addInitScript(() => { HTMLCanvasElement.prototype.captureStream = undefined; });
  await prepare(page);
  await page.getByRole('combobox', { name: /^Format/ }).selectOption('webm');
  await page.getByRole('button', { name: 'Download video' }).click();
  await expect(page.locator('#status')).toContainText(/cannot|unavailable|not supported/i);
  await expect(page.getByRole('button', { name: 'Download video' })).toBeEnabled();
  await audit(page, testInfo, 'capture-unavailable');
});

test('F01-N3 failed WebCodecs support detection falls back to a real download', async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    window.VideoEncoder = class { static async isConfigSupported() { throw new Error('Injected codec probe failure'); } };
  });
  await prepare(page);
  const support = await capabilities(page, testInfo);
  const completed = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download video' }).click();
  await verifyDownload(page, await completed, testInfo, [support.mp4.includes('mp4') ? 'mp4' : 'webm']);
  await expect(page.getByRole('button', { name: 'Download video' })).toBeEnabled();
  await audit(page, testInfo, 'codec-fallback');
});

test('F01-N4 WebCodecs rendering error falls back without a console error or stuck controls', async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    window.VideoEncoder = class {
      static async isConfigSupported() { return { supported: true }; }
      configure() { throw new Error('Injected encoder failure'); }
      close() {}
    };
  });
  await prepare(page);
  const completed = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download video' }).click();
  await verifyDownload(page, await completed, testInfo, ['mp4', 'webm']);
  await expect(page.getByRole('button', { name: 'Download video' })).toBeEnabled();
  await audit(page, testInfo, 'rendering-fallback');
});

test('F01-N5 recorder constructor failure reports failure and unlocks the editor', async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    const NativeRecorder = window.MediaRecorder;
    window.MediaRecorder = class {
      static isTypeSupported(type) { return NativeRecorder.isTypeSupported(type); }
      constructor() { throw new Error('Injected recorder failure'); }
    };
  });
  await prepare(page);
  await page.getByRole('combobox', { name: /^Format/ }).selectOption('webm');
  await page.getByRole('button', { name: 'Download video' }).click();
  await expect(page.locator('#status')).toContainText(/failed.*Injected recorder failure/i);
  await expect(page.getByRole('button', { name: 'Download video' })).toBeEnabled();
  await expect(page.getByRole('textbox', { name: 'Phrase' })).toBeEnabled();
  await audit(page, testInfo, 'recorder-failure');
});
