// Packaging only, not a build: copy an explicit public allowlist. Never publish the checkout root.
import { cp, mkdir, readdir, lstat, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const output = resolve(process.argv[2] || 'dist');
const siteUrl = process.argv[3] ? new URL(process.argv[3]) : null;
if (siteUrl && (siteUrl.protocol !== 'https:' || siteUrl.username || siteUrl.password || siteUrl.search || siteUrl.hash || siteUrl.pathname !== '/')) {
  throw new Error('Site URL must be an HTTPS origin, such as https://pressflick.app.');
}
const htmlOrigin = siteUrl?.origin.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
await mkdir(output, { recursive: true });
if ((await readdir(output)).length) throw new Error('Output must be empty. Choose a new directory.');
const entries = ['index.html', 'editor.html', '404.html', 'landing.css', 'landing.js', 'word-focus.js', 'privacy.html', 'terms.html', 'type.css', 'style.css', 'favicon.svg', 'favicon.ico', 'site.webmanifest', '_headers', 'vercel.json', 'LICENSE', 'assets', 'src'];
async function rejectLinks(path) {
  const stat = await lstat(path);
  if (stat.isSymbolicLink()) throw new Error(`Refusing symlink: ${path}`);
  if (stat.isDirectory()) for (const entry of await readdir(path)) await rejectLinks(`${path}/${entry}`);
}
for (const entry of entries) {
  await rejectLinks(entry);
  await cp(entry, `${output}/${entry}`, {
    recursive: true,
    filter: (path) => !/\.(?:png|jpe?g|webp|avif|gif)\.json$/i.test(path),
  });
  if (siteUrl && entry.endsWith('.html')) {
    const path = `${output}/${entry}`;
    await writeFile(path, (await readFile(path, 'utf8')).replaceAll('https://pressflick.example', () => htmlOrigin));
  }
}
console.log(`Static site copied to ${output}; only the public allowlist is included.`);
if (!siteUrl) console.log('Open Graph URL placeholder retained. Pass the registered HTTPS site origin before public release.');
