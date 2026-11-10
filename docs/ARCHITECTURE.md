# Architecture

Static HTML/CSS and native ES modules. No backend, database, account or application build. One vendored runtime dependency: mp4-muxer5.2.2 (MIT, licence in src/vendor/). Development-only Playwright/axe packages are not shipped by the public allowlist.

| File | Responsibility |
| --- | --- |
| `src/core.js` | Pure seeded random, word splitting, cut timing, MIME choice, filler; Node unit tests |
| `src/render.js` | Draw one deterministic cut onto a canvas; reuse two raster layers |
| `src/audio.js` | Synthesized filtered-noise sounds; no sample files |
| `src/export.js` | Off-clock WebCodecs video/audio encoding and in-memory MP4 muxing |
| `src/app.js` | Form state, preview, sharing, download and real-time MediaRecorder fallback |
| `test/e2e/` | Browser flow, capability boundary, playback and accessibility checks |
| `scripts/prepare-site.mjs` | Copy explicit public allowlist to empty output; no compilation |

## Pages

The owner requested a separate marketing landing and editor. `index.html` is the landing; `editor.html` carries the existing editor. Share URLs identify the editor path explicitly. Legal pages link to both home and the editor. The final 69-test browser suite covers the separate pages and their navigation; final source hashes are recorded in local verification evidence.

## Rendering and export

Preview derives each cut from elapsed time and seed. The renderer centres the focal-word highlight and scales type to fit; baseline/height still vary with fonts. It draws blurred page layers with a sharp central window. Physical font selection depends on OS.

MP4 capability is probed before use. Export locks controls synchronously before the first await. WebCodecs draws every30fps frame on a separate full-resolution canvas, uses a keyframe on each cut, and schedules sounds into OfflineAudioContext before audio encoding/muxing. The encoder queue is bounded with a drain loop and rendering yields on a16ms work budget. Encoders/frames/audio data close in finally blocks, including failures. Preview drawing pauses while this path runs. Evidence/limits: docs/EXPORT-QUALITY.md and docs/reviews/performance-review.md.

WebM and unsupported/failed MP4 encoding use MediaRecorder on the visible canvas in real time. Controls remain disabled throughout; recording setup/stop/error paths release tracks/context and surface a clear message. A preferred-container fallback is named in the progress/saved message and extension. A zero-valued ConstantSourceNode keeps the audio destination continuously connected during recording; this preserves silent gaps between synthesized clicks in WebKit. The source stops with the tracks/context during cleanup. A sound-enabled whole-playback regression covers the previously truncated WebKit output (docs/reviews/riso-code-review.md). This path depends on a visible tab and can stutter under load. It is not frame exact. Missing MediaRecorder/canvas capture receives an explicit unsupported message.

## Privacy boundary

Form state stays in memory. Copy link puts settings after `#`; browser fragments are excluded from HTTP requests. A recipient can read the text. Query-string state from older links is intentionally ignored; text in a manually constructed query has already been sent to the host before JS can run. Do not put private text into query URLs. New links include seed0 correctly. Allowlisted fields are hydrated through native form constraints, text is capped at80 code units and focus must be an in-range integer. No persistence APIs or telemetry are used.

## Limits

- The whole MP4 is muxed in memory. Measured10 s 16:9 lab process memory is reported in the performance review; no assertion of safety on every phone.
- Full-resolution preview uses measurable CPU even though unchanged/paused/hidden frames are skipped. No physical battery test.
- MP4 uses every-cut keyframes. A longer-GOP experiment was smaller but changed decoded pixels; retained output pending human quality judgement.
- AAC padding can make container/audio duration slightly longer than video. No exact audio-onset calibration yet.
- mp4-muxer is superseded upstream; migration is deferred while current covered behavior works.
- Canvas filter support and system font stacks vary. Playwright WebKit is not a physical Safari/iOS test.
- Reduced-motion starts paused; no human photosensitivity or assistive-technology certification.
