// Pure logic: no DOM, so it runs under `node --test`.

export const SIZES = { '9:16': [1080, 1920], '1:1': [1080, 1080], '16:9': [1920, 1080] };

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const pick = (r, arr) => arr[Math.floor(r() * arr.length)];

export const splitWords = (text) => text.trim().split(/\s+/).filter(Boolean);

// Longest word wins, first one on a tie.
export function defaultFocus(words) {
  const len = (w) => w.replace(/[^\p{L}\p{N}]/gu, '').length;
  return words.reduce((best, w, i) => (len(w) > len(words[best]) ? i : best), 0);
}

export const cutCount = (duration, cps) => Math.max(1, Math.round(duration * cps));

// Which cut a video frame shows. Integer maths, so frame timing never drifts.
export const cutAt = (frame, fps, cps) => Math.floor((frame * cps) / fps);

// First recording type the browser supports, preferred container first.
export function pickMime(isSupported, prefer = 'mp4', audio = true) {
  const mp4 = [audio ? 'video/mp4;codecs=avc1.640028,mp4a.40.2' : 'video/mp4;codecs=avc1.640028', 'video/mp4'];
  const a = audio ? ',opus' : '';
  const webm = [`video/webm;codecs=vp9${a}`, `video/webm;codecs=vp8${a}`, 'video/webm'];
  const order = prefer === 'webm' ? [...webm, ...mp4] : [...mp4, ...webm];
  return order.find(isSupported) ?? '';
}

const WORDS = `the of and to in a that for on with as by at from is was were has have had said will would could
report market council minister city officials sources yesterday morning committee district public record
figures growth decline policy statement evidence according announced later during after before between
company workers union season harbour county weather office paper letter meeting question answer number
people country government week month year percent million local national several early late further
new old first last long small great general special open final major central northern southern`.split(/\s+/);

export function filler(r, n) {
  let out = '', cap = true;
  for (let i = 0; i < n; i++) {
    let w = pick(r, WORDS);
    if (cap) w = w[0].toUpperCase() + w.slice(1);
    cap = r() < 0.12;
    out += w + (cap ? '. ' : ' ');
  }
  return out.trim();
}
