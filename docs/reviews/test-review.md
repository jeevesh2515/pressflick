# Independent test review — 2026-11-09

**Result: 63/63 browser tests passed; 6/6 unit tests passed. No skips, retries, flaky results, console errors, uncaught exceptions, HTTP 5xx, or axe violations in the final run.** This is local browser evidence, not production or physical-device certification.

Baseline commit: `3042753009b204297df2606206f2bcce435a72db`, tested with current uncommitted working changes. This review read the rules, recon flow map, application source and unit tests. It did not read `docs/SCORE.md` or previous scores.

## Environment and commands

- macOS arm64; Node 22.22.3; Python static server on `127.0.0.1:5174`.
- Chromium 158.0.8127.18, Firefox 159.0, WebKit 27.2; all installed and launched.
- `npm test`: 6 unit tests passed; runner restricted to `test/*.test.js` so it cannot discover Playwright specs.
- `npm run test:e2e`: 21 cases × 3 engines = 63 passed in 86.7 s, zero skipped/unexpected/flaky results.
- `git diff --check`: passed.

Port 5173 already hosts another server in this workspace. Playwright intentionally starts a private server on 5174 and refuses server reuse, ensuring it tests this repository. `npm start` retains 5173 and now binds loopback. Test dependencies are dev-only; application runtime remains plain vendored ES modules with no CDN or build dependency.

## Coverage

Browser tests cover initial load, editing accented/emoji/literal HTML-like text, the 80-character bound, selected focus word and `/` shortcut, all three ratios and their canvas dimensions, every example, all sound options, paper/highlight and slider controls, empty/whitespace state, malformed raw query and active fragment settings, share-link state restored after refresh without the phrase in request URLs, offline editing after initial load, mobile width and preview/form non-overlap, reduced motion pixel stability, Privacy and Terms navigation, and real MP4/WebM downloads.

Export failure tests remove APIs and inject codec probe, WebCodecs rendering and MediaRecorder construction failures at browser boundaries. They verify explicit error/fallback handling and usable controls. Busy recording tests assert that editing controls, examples, focal-word selection, playback and share actions are disabled, a repeated Enter does not create a second download, and controls unlock after completion.

Every test collects console errors, uncaught exceptions and HTTP 5xx and fails if any occur. Axe runs on all distinct screens/states used by these cases. No rules are disabled. Production CSP remains enabled for tests. Screenshots/traces are retained for failures; successful test evidence includes axe results, capability reports, export files and metadata.

## Actual exported files

These are real 2-second requested, 1080×1080, no-sound exports, with binary container signatures checked and playback decoded in the same engine. Browser capability branches did not skip export in any tested engine.

| Engine | MP4 bytes / decoded duration | WebM bytes / decoded duration |
| --- | --- | --- |
| Chromium | 979,861 / 2.000 s | 264,444 / 1.771 s |
| Firefox | 1,571,754 / 2.000 s | 1,516,639 / 2.011 s |
| WebKit | 1,902,991 / 2.000 s | 430,149 / 2.016 s |

Firefox's MediaRecorder does not advertise MP4 in this environment; WebCodecs produced the actual MP4, and injected encoder failures successfully downloaded a WebM fallback. MP4 exports were frame-exact in these samples. Real-time WebM durations varied; Chromium's 1.771 s recording for the requested 2 s illustrates the documented real-time recording limitation. The test asserts usable nonzero-duration media, not exact WebM timing.

## Findings and fixes

Two independently reproduced S3 accessibility issues were fixed by the root agent and pass the final suite: `.info` content outside a named landmark, and all four slider names binding to `<output>` instead of their inputs. Detailed repros and initial failing output are in ignored `replica/bugs.md` and `replica/evidence/initial-run.log`. Open reproduced issues: S1 0, S2 0, S3 0, S4 0. Root also corrected mobile sticky-preview overlap; the new mobile geometry assertion passes in all three engines.

The first full suite run passed 58/60. Its two WebKit failures were harness defects, not product findings: Playwright screenshot injection violated strict CSP, and the verifier revoked a blob while its video decoder still referenced it. The harness now avoids injecting screenshot styles during successful flow tests and detaches the decoder before revoking the blob. No CSP weakening, error allowlist or skipped test was used. Both targeted rechecks and the final full run passed.

## Limits

The suite does not prove physical iOS/Android behavior, actual assistive-technology usability, audible sound quality/synchronization, hidden-tab recording quality, maximum-duration exports, or production hosting. It runs sound-preview handlers but real automated exports use no sound; audio-track verification is a separate media check. Downloaded-video dimension checks are square; all other ratios are checked at the live canvas. Two-tab isolation, back navigation of unsaved state and mid-recording page refresh have no dedicated tests. No tested browser engine was unavailable.

## Evidence

Ignored evidence paths: `replica/evidence/final-run.log`, `unit-run.log`, `results.json`, `summary.json`, `browser-versions.json`, `tested-source-hashes.json` (SHA256s verified unchanged across the final run), and `playwright/` export attachments. Historical harness/proving output: `initial-run.log`, `full-run.log`, `webkit-mobile-recheck.log`, `webkit-harness-recheck.log`. Public test sources: `test/e2e/`, `playwright.config.js`; detailed private plan: `replica/test-plan.md`.

## Root follow-up — 10 November 2026, final separate pages

[Certain] The test engineer's prior report above is retained as historical independent evidence. The later subagent hit a usage limit after starting the first 69-case run; its underlying browser process finished successfully. Root then reran the final suite after the last landing copy/process-layout changes: **69/69 passed in 87.9 seconds**, 23 per Chromium/Firefox/WebKit, zero skips, unexpected/flaky results or retries. **78 axe scans** and **69 error attachments** were empty. Root compared the recorded hashes for **36 public source/assets files** after the run and found no changes. Commands: `npm test`, `npm run test:e2e`; final local evidence `results.json`, `summary.json`, `final-run.log`, `unit-run.log`, `tested-source-hashes.json`. Node coverage is now **9/9**, including allowlist/licence, configured-origin escaping, literal replacement and rejection fixtures.

| Final engine | MP4 bytes / duration | WebM bytes / duration |
| --- | --- | --- |
| Chromium | 1,182,695 / 2.000 s | 316,558 / 1.760 s |
| Firefox | 1,595,883 / 2.000 s | 1,647,373 / 2.012 s |
| WebKit | 2,166,936 / 2.000 s | 425,408 / 2.011 s |

[Certain] All six final files are 1080×1080. The automated verifier checks container signature, metadata and decoded first-frame loading; it does not watch every frame or listen. The separate media work fully decodes the actual hero/max files. Root additionally operated native in-app browser playback of the hero to ended=true at5.077333s with no player error, then navigated Open editor successfully. No human/device approval follows from that observation.

[Certain] Added landing tests verify editor navigation, same-origin resources, native FAQ/video controls, mobile fit and no autoplay under reduced motion. Earlier 63-test results/exports are retained in `replica/evidence/history/`. The short real-time WebM result remains an open documented **S3 limitation**, with frame-exact WebCodecs MP4 as the timing-preserving alternative; the older zero-S3 line above did not count that separately documented limitation. No open reproduced S1/S2 was found in the final tested flows. Physical Safari/phones, assistive technology, human audiovisual quality and actual production hosting remain unverified.
