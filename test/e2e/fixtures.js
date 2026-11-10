import { test as base, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    const errors = [];
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 500) errors.push(`${response.status()} ${response.url()}`); });
    await use(page);
    await testInfo.attach('browser-errors', { body: JSON.stringify(errors, null, 2), contentType: 'application/json' });
    expect(errors, 'No console errors, uncaught errors, or HTTP 5xx responses').toEqual([]);
  },
});
export { expect };

export async function audit(page, testInfo, screen) {
  const result = await new AxeBuilder({ page }).analyze();
  await testInfo.attach(`axe-${screen}`, { body: JSON.stringify(result.violations, null, 2), contentType: 'application/json' });
  expect(result.violations, `Accessibility violations on ${screen}`).toEqual([]);
}

export async function capabilities(page, testInfo) {
  const result = await page.evaluate(async () => {
    const { canEncodeMp4 } = await import('/src/export.js');
    const { pickMime } = await import('/src/core.js');
    return {
      videoEncoder: await canEncodeMp4('1:1'),
      captureStream: typeof HTMLCanvasElement.prototype.captureStream === 'function',
      mediaRecorder: typeof MediaRecorder === 'function',
      mp4: typeof MediaRecorder === 'function' ? pickMime(m => MediaRecorder.isTypeSupported(m), 'mp4', false) : '',
      webm: typeof MediaRecorder === 'function' ? pickMime(m => MediaRecorder.isTypeSupported(m), 'webm', false) : '',
    };
  });
  await testInfo.attach('recording-capabilities', { body: JSON.stringify(result, null, 2), contentType: 'application/json' });
  return result;
}

export async function verifyDownload(page, download, testInfo, expectedExtensions) {
  expect(await download.failure()).toBeNull();
  const extension = download.suggestedFilename().split('.').pop();
  expect(expectedExtensions).toContain(extension);
  const file = await download.path();
  const bytes = await readFile(file);
  expect(bytes.length, 'Export contains media data').toBeGreaterThan(1000);
  if (extension === 'mp4') expect(bytes.subarray(4, 8).toString()).toBe('ftyp');
  else expect(bytes.subarray(0, 4).toString('hex')).toBe('1a45dfa3');
  await testInfo.attach(download.suggestedFilename(), { path: file, contentType: `video/${extension}` });
  const metadata = await page.evaluate(async ({ base64, extension }) => {
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const video = document.createElement('video');
    const url = URL.createObjectURL(new Blob([bytes], { type: `video/${extension}` }));
    try {
      const ready = new Promise((resolve, reject) => {
        video.onloadeddata = resolve;
        video.onerror = () => reject(new Error(`Downloaded video cannot be decoded: ${video.error?.message}`));
        setTimeout(() => reject(new Error('Downloaded video decoding timed out')), 15_000);
      });
      video.muted = true;
      video.src = url;
      video.load();
      await ready;
      return { width: video.videoWidth, height: video.videoHeight, duration: video.duration };
    } finally {
      video.removeAttribute('src');
      video.load();
      URL.revokeObjectURL(url);
    }
  }, { base64: bytes.toString('base64'), extension });
  expect(metadata.width).toBe(1080);
  expect(metadata.height).toBe(1080);
  if (Number.isFinite(metadata.duration)) expect(metadata.duration).toBeGreaterThan(1.5);
  await testInfo.attach('download-metadata', { body: JSON.stringify({ filename: download.suggestedFilename(), bytes: bytes.length, ...metadata }), contentType: 'application/json' });
}
