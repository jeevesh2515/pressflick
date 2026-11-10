// Frame-exact MP4 export: every frame is drawn, encoded and muxed in order, so it
// does not depend on the clock or on the tab staying visible.
// shortcut: mp4-muxer 5.2.2 is vendored and its author now points to Mediabunny; swap when it stops working.
import { Muxer, ArrayBufferTarget } from './vendor/mp4-muxer.mjs';
import { SIZES, cutAt, cutCount } from './core.js';
import { drawCut } from './render.js';
import { click } from './audio.js';

const FPS = 30, RATE = 48000;
const videoConfig = (W, H) => ({ codec: 'avc1.640028', width: W, height: H, bitrate: 6_000_000, framerate: FPS });

export async function canEncodeMp4(ratio) {
  if (!('VideoEncoder' in window)) return false;
  const [W, H] = SIZES[ratio];
  return (await VideoEncoder.isConfigSupported(videoConfig(W, H)).catch(() => ({}))).supported === true;
}

async function audioConfig() {
  if (!('AudioEncoder' in window)) return null;
  for (const [codec, name] of [['mp4a.40.2', 'aac'], ['opus', 'opus']]) {
    const cfg = { codec, sampleRate: RATE, numberOfChannels: 1, bitrate: 128_000 };
    if ((await AudioEncoder.isConfigSupported(cfg).catch(() => ({}))).supported) return { cfg, name };
  }
  return null;
}

// o: the options object from app.js. Returns { blob, silent } where silent means sound was asked for but could not be encoded.
export async function renderMp4(o, onProgress = () => {}) {
  const [W, H] = SIZES[o.ratio], frames = Math.round(o.duration * FPS);
  const audio = o.sound === 'none' ? null : await audioConfig();
  const muxer = new Muxer({
    target: new ArrayBufferTarget(), fastStart: 'in-memory',
    video: { codec: 'avc', width: W, height: H, frameRate: FPS },
    ...(audio && { audio: { codec: audio.name, sampleRate: RATE, numberOfChannels: 1 } }),
  });
  let failed;
  const fail = (e) => { failed ??= e; };

  const venc = new VideoEncoder({ output: (chunk, meta) => muxer.addVideoChunk(chunk, meta), error: fail });
  try {
    venc.configure(videoConfig(W, H));
    const canvas = Object.assign(document.createElement('canvas'), { width: W, height: H });
    const ctx = canvas.getContext('2d');
    for (let i = 0, last = -1, yielded = performance.now(); i < frames && !failed; i++) {
      const cut = cutAt(i, FPS, o.cps), fresh = cut !== last;
      if (fresh) drawCut(ctx, W, H, { ...o, cut });
      last = cut;
      const frame = new VideoFrame(canvas, { timestamp: (i * 1e6) / FPS, duration: 1e6 / FPS });
      try {
        venc.encode(frame, { keyFrame: fresh }); // every cut is a new picture, so it starts a new key frame
      } finally {
        frame.close();
      }
      while (venc.encodeQueueSize > 4 && !failed) await new Promise((r) => setTimeout(r, 1));
      if (performance.now() - yielded >= 16) {
        await new Promise((r) => setTimeout(r, 0));
        yielded = performance.now();
      }
      onProgress(i / frames);
    }
    await venc.flush();
  } finally {
    if (venc.state !== 'closed') venc.close();
  }

  if (audio) {
    const oac = new OfflineAudioContext(1, Math.ceil(o.duration * RATE), RATE);
    for (let k = 0; k < cutCount(o.duration, o.cps); k++) click(oac, oac.destination, o.sound, k / o.cps);
    const pcm = (await oac.startRendering()).getChannelData(0);
    const aenc = new AudioEncoder({ output: (chunk, meta) => muxer.addAudioChunk(chunk, meta), error: fail });
    try {
      aenc.configure(audio.cfg);
      const data = new AudioData({ format: 'f32-planar', sampleRate: RATE, numberOfFrames: pcm.length, numberOfChannels: 1, timestamp: 0, data: pcm });
      try {
        aenc.encode(data);
      } finally {
        data.close();
      }
      await aenc.flush();
    } finally {
      if (aenc.state !== 'closed') aenc.close();
    }
  }

  if (failed) throw failed;
  muxer.finalize();
  return { blob: new Blob([muxer.target.buffer], { type: 'video/mp4' }), silent: o.sound !== 'none' && !audio };
}
