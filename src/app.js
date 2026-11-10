import { SIZES, splitWords, defaultFocus, cutCount, pickMime } from './core.js';
import { drawCut } from './render.js';
import { click } from './audio.js';
import { canEncodeMp4, renderMp4 } from './export.js';

const $ = (id) => document.getElementById(id);
const form = $('controls'), f = form.elements, canvas = $('stage'), ctx = canvas.getContext('2d');
const q = new URLSearchParams(location.hash.slice(1));

let seed = q.has('seed') && Number.isFinite(+q.get('seed')) ? +q.get('seed') : Math.floor(Math.random() * 1e6);
let focus = q.has('focus') ? +q.get('focus') : -1;
let playing = !matchMedia('(prefers-reduced-motion: reduce)').matches;
let o, rec = null, busy = false, t0 = performance.now(), last = -1, dirty = true, previewAc;

for (const k of ['text', 'ratio', 'format', 'sound', 'style', 'highlight', 'cps', 'zoom', 'blur', 'duration']) {
  if (!q.has(k)) continue;
  const control = f[k], previous = control.value;
  control.value = k === 'text' ? q.get(k).slice(0, 80) : q.get(k);
  if (!control.value) control.value = previous;
}
if (q.has('text') && !q.get('text')) f.text.value = '';

const status = (msg) => { $('status').textContent = msg; };

function sync() {
  const words = splitWords(f.text.value);
  if (!(Number.isInteger(focus) && focus >= 0 && focus < words.length)) focus = defaultFocus(words);
  o = {
    words, focus, seed, ratio: f.ratio.value, format: f.format.value, sound: f.sound.value, style: f.style.value,
    highlight: f.highlight.value, cps: +f.cps.value, zoom: +f.zoom.value, blur: +f.blur.value, duration: +f.duration.value,
  };
  const [W, H] = SIZES[o.ratio];
  if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
  for (const k of ['cps', 'zoom', 'blur', 'duration']) $(`${k}-out`).textContent = f[k].value;
  $('empty').hidden = words.length > 0;
  canvas.hidden = !words.length;
  for (const control of form.querySelectorAll('input, select, button')) control.disabled = busy;
  $('play').disabled = busy;
  $('download').disabled = !words.length || busy;
  $('words').replaceChildren(...words.map((w, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = w; b.disabled = busy; b.setAttribute('aria-pressed', i === focus);
    b.onclick = () => { focus = i; sync(); };
    return b;
  }));
  dirty = true;
}

function frame(now) {
  requestAnimationFrame(frame);
  if (!o.words.length || (busy && !rec) || document.hidden) return;
  const t = (now - t0) / 1000;
  if (rec && t >= o.duration) return finish();
  const idx = rec ? Math.floor(t * o.cps)
    : playing ? Math.floor(t * o.cps) % cutCount(o.duration, o.cps)
    : Math.max(last, 0);
  if (idx === last && !dirty) return;
  last = idx; dirty = false;
  drawCut(ctx, canvas.width, canvas.height, { ...o, cut: idx });
  if (rec?.ac) click(rec.ac, rec.dest, o.sound);
}

const fileName = (ext) => `${o.words[o.focus].replace(/[^\p{L}\p{N}]+/gu, '') || 'matchcut'}.${ext}`;

function save(blob, name, note = '') {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 10_000);
  status(`Saved ${name}${note}`);
}

// MP4 goes through the frame-exact encoder when the browser has one; everything else records in real time.
async function startExport() {
  if (busy || !o.words.length) return;
  busy = true; sync();
  const snap = { ...o };
  try {
    if (snap.format === 'mp4' && await canEncodeMp4(snap.ratio)) {
      try {
        const { blob, silent } = await renderMp4(snap, (p) => status(`Rendering… ${Math.round(p * 100)}%`));
        if (!silent) return save(blob, fileName('mp4'));
        // Sound was requested: try MediaRecorder rather than silently dropping it.
      } catch {
        status('MP4 encoder unavailable. Trying real-time recording…');
      }
    }
    await recordLive();
  } catch (e) {
    status(`Recording failed: ${e.message || 'this browser cannot record video.'}`);
  } finally {
    busy = false; sync();
  }
}

// shortcut: real-time capture, so a hidden tab stalls it; only used for WebM and for browsers without WebCodecs.
async function recordLive() {
  const audio = o.sound !== 'none';
  const mime = window.MediaRecorder && pickMime((m) => MediaRecorder.isTypeSupported(m), o.format, audio);
  if (!mime || !canvas.captureStream) return status('This browser cannot record video. Try a current Chrome, Edge, Firefox or Safari.');
  let ac, stream, silence;
  try {
    ac = audio ? new AudioContext() : null;
    if (ac) await ac.resume();
    const dest = ac?.createMediaStreamDestination();
    if (audio) {
      // Keep silent gaps between clicks on the recording clock; WebKit otherwise drops them.
      silence = ac.createConstantSource();
      silence.offset.value = 0;
      silence.connect(dest);
      silence.start();
    }
    stream = canvas.captureStream(30);
    if (audio) stream.addTrack(dest.stream.getAudioTracks()[0]);
    const r = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 6_000_000 });
    const chunks = [], ext = mime.includes('mp4') ? 'mp4' : 'webm', name = fileName(ext);
    await new Promise((resolve, reject) => {
      r.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
      r.onerror = (e) => reject(e.error ?? new Error('The browser stopped recording.'));
      r.onstop = resolve;
      rec = { r, ac, dest };
      last = -1; t0 = performance.now();
      r.start();
      status(`Recording… keep this tab visible.${ext !== o.format ? ` ${o.format.toUpperCase()} unavailable; saving ${ext.toUpperCase()}.` : ''}`);
    });
    if (!chunks.length) throw new Error('The browser produced an empty video.');
    save(new Blob(chunks, { type: mime.split(';')[0] }), name, ext !== o.format ? ` (${o.format.toUpperCase()} unavailable; saved ${ext.toUpperCase()})` : '');
  } finally {
    if (rec?.r.state !== 'inactive') rec?.r.stop();
    rec = null;
    stream?.getTracks().forEach((track) => track.stop());
    silence?.stop();
    if (ac && ac.state !== 'closed') await ac.close();
  }
}

function finish() {
  const { r } = rec;
  rec = null; last = -1; t0 = performance.now();
  r.stop();
}

const link = () => {
  const p = new URLSearchParams(new FormData(form));
  p.set('focus', focus); p.set('seed', seed);
  return `${location.origin}${location.pathname}#${p}`;
};

form.addEventListener('input', (e) => { if (e.target === f.text) focus = -1; sync(); });
form.addEventListener('submit', (e) => { e.preventDefault(); if (!rec && !busy && o.words.length) startExport(); });
$('examples').onclick = (e) => { if (e.target.dataset.focus) { f.text.value = e.target.textContent; focus = +e.target.dataset.focus; sync(); } };
$('shuffle').onclick = () => { seed = Math.floor(Math.random() * 1e6); sync(); };
const showPlaying = () => { $('play').textContent = playing ? 'Pause' : 'Play'; document.querySelector('.preview').toggleAttribute('data-playing', playing); };
$('play').onclick = () => { playing = !playing; t0 = performance.now(); showPlaying(); };
$('hear').onclick = () => { previewAc ??= new AudioContext(); click(previewAc, previewAc.destination, f.sound.value); };
$('share').onclick = () => navigator.clipboard.writeText(link()).then(() => status('Link copied.'), () => status(link()));
document.addEventListener('visibilitychange', () => { if (rec && document.hidden) status('Tab was hidden while recording: the video may stutter. Record again.'); });
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); f.text.focus(); }
});

showPlaying();
sync();
requestAnimationFrame(frame);
