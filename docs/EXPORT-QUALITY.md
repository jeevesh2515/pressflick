# Export quality evidence

9 November 2026. `assets/pressflick-demo.mp4` is the original export sampled for the README GIF: seed 42, phrase `One word holds still`, focus `word`, 16:9, 5 s, 12 cuts/s, default paper sound. It was generated through the Download video UI on loopback. The helper is local at `replica/evidence/export-quality.mjs`.

## Checks and their limits

| Check | Evidence / result | Limit |
| --- | --- | --- |
| Video format | `ffprobe -v error -show_streams -show_format -of json assets/pressflick-demo.mp4`; H.264 High,1920×1080,30fps,150frames,5.000s video, AAC48kHz mono | Audio encoder priming/padding extends the container slightly beyond5s; not exact audible-onset calibration |
| Full decode | `ffmpeg -v error -i assets/pressflick-demo.mp4 -f null -`, exit0 | Decoder success is not a subjective quality rating |
| Locked position | `replica/evidence/analyze-export.py` reads all 150 decoded frames; highlighted-word box centre stays within0.5px of canvas centre in both axes | Measures highlight bounding box, not each glyph's optical centre/baseline; one phrase/seed/ratio |
| Audio every cut | Same analyzer, WAV extracted with ffmpeg: all 60 successive1/12s windows have RMS>0.001 | Energy in each interval does not establish exact sound-onset sync or perceptual quality |
| Player | `ffplay -autoexit -loglevel info assets/pressflick-demo.mp4`; playback clock progressed through5.01s; exit0; log `replica/evidence/ffplay.log` | ffplay logged a deprecated-pixel-format/range warning. No human watch/listen sign-off claimed |
| Visual inspection | Root inspected a60-cut contact sheet and desktop/mobile screenshots, `replica/evidence/demo-cuts.jpg`, `editor-desktop.png`, `editor-mobile.png` | Still frames are not human motion review; removed mobile sticky preview after overlap was seen and covered by E2E |
| Maximum export / memory | Independent performance review:10 s 16:9,16cuts/s,300H.264 frames plus AAC,17,732,736bytes;6.746s render; Chromium tree RSS430→725MiB,183MiB after URL release | Single M5 desktop lab; process-tree RSS is not isolated page memory,100ms sampling may miss peaks. Phones and repeat-export stress untested |
| Cross-engine download | `docs/reviews/test-review.md`: real MP4/WebM files, headers and browser playback on all 3 engines | Automated samples are2s square and silent; other ratios checked in preview, root audio sample is Chromium |

## File-size experiment

A same-seed5s clip with one keyframe per second (local route override only) shrank from6,143,376 to3,886,986bytes, about36.7%. `ffmpeg -i <baseline> -i <candidate> -lavfi ssim -f null -` returned decoded SSIM0.985881. Evidence: `replica/evidence/long-gop.mp4`, `gop-comparison.log`, `compare-gop.mjs`. This compares two lossy outputs, not a lossless reference. It does not establish unchanged perceptual quality. The application retains a keyframe at each cut; no claim that delta frames cannot save bytes remains justified. No additional codec dependency was added.

## Still required

A person must watch and listen to the exported clip, judge timing/blur/typography/sound, and test physical Safari/iOS and Android. Verify import into intended editing/social apps before promising compatibility. WebM/fallback recording is real time: the automated requested2s Chromium sample decoded shorter (1.761s in the earlier run); do not present it as frame exact. Only frame-exact WebCodecs MP4 has timing-preserving evidence; a MediaRecorder fallback can produce MP4 with shorter timing too. Field performance, background-recording quality and screen-reader usability remain unverified.

## Riso release follow-up — 10 November 2026

Fresh production export probing uncovered an S2 that silent-only checks missed: WebKit sound-enabled, requested two-second WebM played for only 0.627s, reproduced twice and independently reproduced locally at 0.645s. Sparse sound nodes allowed silent audio intervals to disappear from the recording timeline. A native zero-valued ConstantSourceNode now keeps the recording destination continuous and stops during cleanup. This changes neither encoded metadata nor the requested speed. The regression uses a real sound-enabled download and plays it to ended; see test/e2e/export.spec.js and docs/reviews/riso-code-review.md for the before/after evidence.

Fresh live checks and final deployed measurements are recorded in docs/reviews/vercel-live-audit.md. Firefox supports H.264 video with Opus audio inside the tested MP4; Chromium and WebKit use AAC. Browser playback and ffmpeg decoding do not prove import support in every editing or social app. No human listening approval is implied. Existing five-second hero analysis and maximum ten-second memory observations above remain historical, rather than newly measured mobile performance.
