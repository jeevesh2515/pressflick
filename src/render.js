import { mulberry32, pick, filler } from './core.js';

// System font stacks only: nothing licensed, nothing downloaded.
const FONTS = [
  'Georgia, serif',
  '"Times New Roman", Times, serif',
  'Palatino, "Book Antiqua", serif',
  'Baskerville, Georgia, serif',
  'Didot, "Bodoni MT", serif',
  'Rockwell, "Courier New", serif',
  '"Courier New", monospace',
  'Helvetica, Arial, sans-serif',
  '"Arial Narrow", "Helvetica Neue", sans-serif',
  'Futura, "Trebuchet MS", sans-serif',
];

const NEWSPRINT = [['#f4efe4', '#1a1a1a'], ['#ebe4d3', '#22201c'], ['#f8f6f0', '#111'], ['#e3dccb', '#2a2622'], ['#fbf7ea', '#1c1c1c']];
const PAPERS = {
  newsprint: NEWSPRINT,
  mixed: [...NEWSPRINT, ['#16161a', '#e8e6e1'], ['#dfe7ea', '#14212b'], ['#f7d9d9', '#2b1414'], ['#1d2a22', '#e6efe4']],
};

let scene, mask;
function layer(c, W, H) {
  c ??= document.createElement('canvas');
  if (c.width !== W || c.height !== H) { c.width = W; c.height = H; }
  return c;
}

// Draws cut number o.cut. Same seed + cut always gives the same frame.
// o: { words, focus, seed, cut, zoom, blur, highlight, style }
export function drawCut(ctx, W, H, o) {
  const r = mulberry32(o.seed * 7919 + o.cut);
  const [paper, ink] = pick(r, PAPERS[o.style] ?? NEWSPRINT);
  const family = pick(r, FONTS), weight = r() < 0.45 ? 700 : 400, italic = r() < 0.12 ? 'italic ' : '';
  const font = (px, w = weight) => `${italic}${w} ${px}px ${family}`;
  const word = o.words[o.focus], cx = W / 2, cy = H / 2;

  scene = layer(scene, W, H);
  const s = scene.getContext('2d');
  s.setTransform(1, 0, 0, 1, 0, 0);
  s.fillStyle = paper;
  s.fillRect(0, 0, W, H);

  // Size the font so the focal word has the same width in every typeface. That is the lock.
  s.font = font(100);
  const size = Math.min((W * 0.22 * o.zoom * 100) / s.measureText(word).width, H * 0.085 * o.zoom);

  // Rotate about the centre so the tilt never moves the word.
  s.translate(cx, cy); s.rotate((r() - 0.5) * 0.07); s.translate(-cx, -cy);
  s.textBaseline = 'middle';
  s.font = font(size);
  const fw = s.measureText(word).width, fx = cx - fw / 2, sp = s.measureText(' ').width;
  const headline = r() < 0.35;
  const before = [headline ? '' : filler(r, 12), ...o.words.slice(0, o.focus)].join(' ').trim();
  const after = [...o.words.slice(o.focus + 1), headline ? '' : filler(r, 12)].join(' ').trim();

  s.fillStyle = ink;
  s.textAlign = 'right'; s.fillText(before, fx - sp, cy);
  s.textAlign = 'left'; s.fillText(after, fx + fw + sp, cy);
  s.fillStyle = o.highlight;
  s.fillRect(fx - size * 0.08, cy - size * 0.56, fw + size * 0.16, size * 1.12);
  s.fillStyle = '#111';
  s.fillText(word, fx, cy);

  // Body text above and below. A headline cut gets smaller body copy.
  const bs = headline ? size * (0.3 + r() * 0.15) : size;
  const lh = bs * (1.2 + r() * 0.3), gap = headline ? size * 0.6 + lh : lh;
  const n = Math.ceil((W + bs * 4) / (bs * 2.5)) + 4;
  s.fillStyle = ink;
  s.font = font(bs, headline ? 400 : weight);
  for (let d = gap; d < H / 2 + lh * 2; d += lh) {
    s.fillText(filler(r, n), -r() * bs * 4, cy + d);
    s.fillText(filler(r, n), -r() * bs * 4, cy - d);
  }

  s.setTransform(1, 0, 0, 1, 0, 0);
  const v = s.createRadialGradient(cx, cy, Math.min(W, H) * 0.35, cx, cy, Math.hypot(cx, cy));
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.22)');
  s.fillStyle = v;
  s.fillRect(0, 0, W, H);

  // Blurred page, with a sharp window around the word.
  const b = o.blur * size * 0.05;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  // shortcut: browsers without canvas `filter` (older Safari) get no blur; upgrade to a downscale blur if that matters.
  if (b > 0.5 && 'filter' in ctx) {
    ctx.filter = `blur(${b}px)`; ctx.drawImage(scene, 0, 0); ctx.filter = 'none';
    mask = layer(mask, W, H);
    const m = mask.getContext('2d'), inner = fw * 0.6 + size * 0.5;
    m.globalCompositeOperation = 'source-over';
    m.clearRect(0, 0, W, H);
    m.drawImage(scene, 0, 0);
    const g = m.createRadialGradient(cx, cy, inner, cx, cy, inner * 2.4);
    g.addColorStop(0, '#000'); g.addColorStop(1, 'rgba(0,0,0,0)');
    m.globalCompositeOperation = 'destination-in';
    m.fillStyle = g;
    m.fillRect(0, 0, W, H);
    ctx.drawImage(mask, 0, 0);
  } else ctx.drawImage(scene, 0, 0);
}
