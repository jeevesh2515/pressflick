// Development utility. Generated assets ship; Playwright does not.
import { chromium } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
const font = (await readFile('assets/fonts/archivo-latin.woff2')).toString('base64');
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
await mkdir('assets', { recursive: true });
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><rect width="1024" height="1024" fill="#0d0f12"/><path fill="#ffd23f" fill-rule="evenodd" d="M280 220H550C725 220 760 330 760 420S705 620 550 620H430V804H280ZM430 350V490H540C590 490 610 464 610 420S590 350 540 350Z"/></svg>`;
const social = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#0d0f12"/><g font-family="Archivo,sans-serif" font-stretch="125%" font-weight="900" letter-spacing="-2"><text x="80" y="110" font-size="36" letter-spacing="0" fill="#f2efe6">PRESSFLICK<tspan fill="#ffd23f">.</tspan></text><text x="80" y="262" font-size="96" fill="#f2efe6">MAKE A</text><rect x="68" y="286" width="404" height="104" fill="#ffd23f"/><text x="84" y="374" font-size="96" textLength="372" lengthAdjust="spacingAndGlyphs" fill="#0d0f12">WORD</text><text x="80" y="486" font-size="96" fill="#f2efe6">HOLD STILL.</text></g><text x="80" y="566" font-family="Archivo,sans-serif" font-stretch="125%" font-weight="700" font-size="18" letter-spacing="3" fill="#7c8693">TEXT MATCH CUTS · MADE IN YOUR BROWSER · NO ADS</text></svg>`;
await writeFile('assets/icon.svg', icon);
await writeFile('assets/social.svg', social);
async function png(svg, size, path) {
  const [width, height] = Array.isArray(size) ? size : [size, size];
  await page.setViewportSize({ width, height });
  await page.setContent(`<style>@font-face{font-family:Archivo;src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:100 900;font-stretch:62% 125%}body{margin:0}svg{display:block;width:100vw;height:100vh}</style>${svg}`);
  await page.evaluate(() => document.fonts.ready);
  const bytes = await page.screenshot({ path, omitBackground: false });
  return bytes;
}
for (const size of [16, 32, 48, 180, 192, 512, 1024]) {
  await png(icon, size, `assets/${size === 180 ? 'apple-touch-icon' : `icon-${size}`}.png`);
}
await png(social, [1200, 630], 'assets/social.png');
const frames = [];
for (const size of [16, 32, 48]) {
  frames.push({ size, data: await png(icon, size) });
}
const header = Buffer.alloc(6 + 16 * frames.length);
header.writeUInt16LE(1, 2); header.writeUInt16LE(frames.length, 4);
let offset = header.length;
frames.forEach(({ size, data }, i) => {
  const at = 6 + i * 16;
  header[at] = size; header[at + 1] = size;
  header.writeUInt16LE(1, at + 4); header.writeUInt16LE(32, at + 6);
  header.writeUInt32LE(data.length, at + 8); header.writeUInt32LE(offset, at + 12);
  offset += data.length;
});
await writeFile('favicon.ico', Buffer.concat([header, ...frames.map(f => f.data)]));
await writeFile('favicon.svg', icon);
await browser.close();
