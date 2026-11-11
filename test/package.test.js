import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { STARTERS } from '../src/presets.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const script = join(root, 'scripts/prepare-site.mjs');
function fixture(run) {
  const dir = mkdtempSync(join(tmpdir(), 'pressflick-package-'));
  try { run(dir); } finally { rmSync(dir, { recursive: true, force: true }); }
}
const pack = (dir, origin, cwd = root) => execFileSync(process.execPath, [script, join(dir, 'site'), ...(origin ? [origin] : [])], { cwd, stdio: 'pipe' });

test('static package contains public files and licences, with no development/private paths', () => fixture((dir) => {
  pack(dir);
  const files = readdirSync(join(dir, 'site'), { recursive: true });
  for (const file of ['index.html', 'editor.html', '404.html', '_headers', 'vercel.json', 'LICENSE', 'src/vendor/mp4-muxer.LICENSE', 'assets/fonts/archivo-OFL.txt', 'assets/fonts/archivo-latin.woff2', 'assets/fonts/SOURCES.json', 'assets/ratio-9x16.webp']) assert.ok(files.includes(file), file);
  for (const file of ['src/presets.js', 'type.css', 'word-focus.js', 'assets/fonts/montagu-slab-latin.woff2', 'assets/fonts/montagu-slab-OFL.txt', ...STARTERS.flatMap(({ video, poster }) => [video, poster])]) assert.ok(files.includes(file), file);
  for (const file of ['robots.txt', 'sitemap.xml', 'assets/github-mark.svg', 'assets/github-mark.LICENSE']) assert.ok(files.includes(file), file);
  assert.ok(!files.some((file) => /(^|\/)(replica|\.gstack|\.impeccable|\.git|node_modules|docs|test)(\/|$)/.test(file)));
  assert.ok(!files.some((file) => /\.(?:png|jpe?g|webp|avif|gif)\.json$/i.test(file)));
  assert.equal(readFileSync(join(dir, 'site/index.html'), 'utf8'), readFileSync(join(root, 'index.html'), 'utf8'));
}));

test('optional site origin replaces only output metadata and escapes attribute/replacement characters', () => fixture((dir) => {
  for (const [i, origin] of ['https://pressflick.app', 'https://a".example', 'https://a%22.example', 'https://$&.example'].entries()) {
    const caseDir = join(dir, String(i));
    pack(caseDir, origin);
    const html = readFileSync(join(caseDir, 'site/index.html'), 'utf8');
    const expected = new URL(origin).origin.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
    assert.ok(html.includes(`content="${expected}/"`), origin);
    assert.ok(!html.includes('https://pressflick.example'), origin);
    const read = (file) => readFileSync(join(caseDir, 'site', file), 'utf8');
    assert.ok(html.includes(`<link rel="canonical" href="${expected}/">`), origin);
    assert.ok(html.includes(`<link itemprop="url" href="${expected}/">`), origin);
    for (const page of ['editor.html', 'terms.html', 'privacy.html']) {
      assert.ok(read(page).includes(`<link rel="canonical" href="${expected}/${page}">`), origin);
    }
    assert.ok(read('editor.html').includes(`property="og:url" content="${expected}/editor.html"`), origin);
    assert.deepEqual([...read('sitemap.xml').matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]), [`${expected}/`, `${expected}/editor.html`]);
    assert.ok(read('robots.txt').includes(`Sitemap: ${new URL(origin).origin}/sitemap.xml\n`), origin);
  }
  assert.ok(readFileSync(join(root, 'index.html'), 'utf8').includes('https://pressflick.example'));
}));

test('packaging rejects unsafe URL shapes, nonempty outputs and source symlinks', () => fixture((dir) => {
  for (const origin of ['http://pressflick.app', 'https://user:password@pressflick.app', 'https://pressflick.app/path', 'https://pressflick.app/?x=1', 'https://pressflick.app/#x']) assert.throws(() => pack(dir, origin));
  pack(dir);
  const sentinel = join(dir, 'site/keep.txt');
  writeFileSync(sentinel, 'keep');
  assert.throws(() => pack(dir));
  assert.equal(readFileSync(sentinel, 'utf8'), 'keep');
  const source = mkdtempSync(join(dir, 'source-'));
  symlinkSync(join(root, 'index.html'), join(source, 'index.html'));
  assert.throws(() => pack(join(dir, 'symlink-case'), undefined, source));
}));
