// Every sound is filtered noise made on the spot: no sample files, nothing to license.
const SOUNDS = {
  paper: { type: 'bandpass', f: 2500, q: 0.8, d: 0.07 },
  shutter: { type: 'highpass', f: 4000, q: 1.5, d: 0.03, echo: 0.05 },
  film: { type: 'bandpass', f: 900, q: 3, d: 0.05, echo: 0.03 },
  polaroid: { type: 'lowpass', f: 600, q: 0.7, d: 0.14 },
  flash: { type: 'bandpass', f: 6000, q: 4, d: 0.02 },
};

let noise;

export function click(ac, out, name, t = ac.currentTime) {
  const p = SOUNDS[name];
  if (!p) return;
  if (noise?.sampleRate !== ac.sampleRate) {
    noise = ac.createBuffer(1, ac.sampleRate * 0.2, ac.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  for (const at of p.echo ? [t, t + p.echo] : [t]) {
    const src = ac.createBufferSource(), flt = ac.createBiquadFilter(), g = ac.createGain();
    src.buffer = noise;
    flt.type = p.type; flt.frequency.value = p.f; flt.Q.value = p.q;
    g.gain.setValueAtTime(0.6, at);
    g.gain.exponentialRampToValueAtTime(0.001, at + p.d);
    src.connect(flt).connect(g).connect(out);
    src.start(at); src.stop(at + p.d);
  }
}
