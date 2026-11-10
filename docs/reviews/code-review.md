# Independent code review — 2026-11-09

[Certain] Passing helper tests do not establish that real browsers can complete the export lifecycle. This review separates the initial defects from fixes that arrived during the review.

## Review summary

**Verdict:** APPROVE for the static code review. The minor seed-zero defect was subsequently verified fixed (see its disposition below). No current critical/major defect was established by this review. Browser export readiness was unverified at this initial review; the later independent evidence check is in `docs/reviews/score-verification.md`.

**Scope:** `src/core.js`, `src/app.js`, `src/export.js`, `src/render.js`, `src/audio.js`, tests, form markup, and the product/architecture/rules documents. No prior score or `docs/SCORE.md` was read. No original application was visited, no remote script was fetched, and no application file was changed by this reviewer.

**Severity mapping:** critical = S1 / persona Critical; major = S2 / persona Required; minor = S3 / persona Optional; info = S4 / persona Nit. Resolved findings below retain their original severity and are not current blockers.

**Score:** No numerical score assigned. The requested 8.5 readiness bar cannot be established from six helper tests, source review, and mocked browser state alone.

## Initial minor finding — subsequently resolved

### [RESOLVED] Minor / S3 / Optional — seed zero does not survive a shared setup

- **Location:** `src/app.js:10` (sharing writes the seed at `src/app.js:138`).
- **Evidence:** [Certain] `+q.get('seed') || Math.floor(Math.random() * 1e6)` treats `0` as missing, although both initial generation and Shuffle can generate zero. The local VM harness opened `#seed=0` and observed a random nonzero restored seed. This is a controlled mock reproduction, not a real-browser observation.
- **Reproduction:** Open a setup ending in `#seed=0`; repeat or compare it with the originating zero-seed session. The page sequence changes, so this valid setup is not reproducible.
- **Lean fix:** Parse an explicitly present finite integer seed and preserve zero; generate a new seed only when the parameter is missing or invalid. Extract the parsing rule into a small pure helper and test zero, missing, malformed, and ordinary values.
- **Impact:** Low frequency during normal random generation, but a concrete violation of sharing the full setup.
- **Final disposition:** [Certain] Independently rechecked the current `src/app.js:10`: explicit finite seed parsing preserves zero. The same local VM harness now restores `#seed=0` as `0`. Closed by source and controlled reproduction on the final source whose hash matches the recorded 63-test browser run. No new pure-helper regression test for this specific value was added; that does not reopen the reproduced defect.

## Initial required findings resolved during the review

### Major / S2 — duplicate exports during the asynchronous capability check

- **Original location:** `src/app.js:68` in the initial snapshot.
- **Original evidence:** [Certain] Two export invocations before the capability promise resolved produced two pending capability checks while `busy` remained false, then two `renderMp4` calls in the local VM harness.
- **Current evidence:** [Certain] `src/app.js:76-78` now guards and sets `busy` before the first await. The repeated harness sequence produced one probe and one render with `busy=true`. Controls are disabled at `src/app.js:37-42`.
- **Status:** Resolved in source and the controlled concurrency reproduction. A real-browser rapid-click check remains useful.

### Major / S2 — editing live recording state can strand or corrupt an export

- **Original locations:** `src/app.js:43-45`, `src/app.js:119` in the initial snapshot.
- **Original evidence:** [Certain] Clearing the phrase during recording caused the frame loop to return before its completion check; the harness left the recorder active after the requested duration. Changing aspect ratio resized the recording canvas from 1080×1920 to 1920×1080 during capture.
- **Current evidence:** [Certain] The current synchronous export lock disables input/select/button controls and Play for the full export; newly created word buttons are also disabled. `startExport()` awaits `recordLive()` before releasing the lock. This removes the ordinary UI trigger for mutating live options during capture.
- **Status:** Resolved by source inspection. Actual encoded dimensions, duration, and sound need browser/media verification; the frame loop still reads global options, so preserving the lock is an invariant.

### Major / S2 — invalid shared settings can crash initialization/export

- **Original locations:** `src/app.js:15`, `src/app.js:21`, `src/app.js:26` in the initial snapshot.
- **Original evidence:** [Certain] The initial harness reproduced an invalid ratio reaching the `SIZES` destructuring and throwing, and fractional `focus=1.5` surviving range checks and later making `fileName` throw. Arbitrary query keys were also assigned through the form collection, and programmatic text assignment bypassed the input's maximum length.
- **Current evidence:** [Certain] The current fragment parser allowlists setting names, truncates text to 80 characters, restores defaults for unmatched select/radio values, and requires integer focus. The updated harness restored `#ratio=bogus` to `9:16`, reset fractional focus to the default word, and truncated a 100-character phrase to 80.
- **Status:** Resolved in source and the controlled parser reproduction, apart from the zero-seed issue above. Native input sanitization was modeled, not exercised in a real browser.

### Major / S2 — recorder failure can be overwritten by a successful download

- **Original locations:** `src/app.js:94-98` in the initial snapshot.
- **Original evidence:** [Certain] Code-traced: the error handler reported failure, but the independent stop handler unconditionally saved accumulated chunks and reported Saved. There was no failed flag or rejected recording operation to prevent that path.
- **Current evidence:** [Certain] The recorder now rejects its awaited promise on error; saving occurs only after successful completion and a nonempty chunk check (`src/app.js:111-121`). The updated harness emitted an encoder error followed by stop; status remained `Recording failed: encoder failed`, zero download attempts occurred, and `busy` was released. The `finally` block stops stream tracks and closes the audio context.
- **Status:** Resolved in source and the controlled error sequence. Browser-specific recorder errors were not induced.

## What's done well

- [Certain] The code keeps rendering, synthesized sound, pure helpers, and MP4 encoding in small ES modules without adding a build system or runtime network dependency.
- [Certain] The frame-exact path snapshots the options and uses integer frame-to-cut mapping. User text reaches `textContent`/canvas rather than HTML interpolation.
- [Certain] The current lifecycle has a single synchronous lock and a cleanup path for the real-time recorder; the fallback explicitly reports container changes and rejects empty recordings.
- [Likely] The small module boundaries are appropriate for this static tool. No extra abstraction or dependency is needed to address the remaining seed defect.

## Verification story and limits

- **Tests reviewed/run:** [Certain] `test/core.test.js` was read before application code; `npm test` passed 6/6. These tests cover seeded randomness, word splitting/focus choice, cut timing/counting, MIME ordering, and filler generation. They do not exercise DOM settings or exports.
- **Additional execution:** [Certain] A temporary local Node VM harness loaded the actual `app.js` source with controlled DOM/media/encoder substitutes. It reproduced the initial state bugs and checked the current guard/parser/error paths. It is outside the repository and is not a substitute for a browser integration test.
- **Build:** [Certain] No build step exists. None was invented.
- **Security:** [Certain] Input/output boundaries and local module structure were inspected for this review; this is not a dependency or deployment security audit.
- **Not verified:** [Certain] Real browser H.264/AAC/Opus output; MediaRecorder MIME acceptance versus actual encoding; successful download on Safari/Firefox/mobile; decoded dimensions, duration, A/V synchronization and social-app acceptance; hidden-tab behavior; failed WebCodecs fallback under audio autoplay restrictions; clipboard capability failures; sustained memory/performance. No paid API or external original-app calls were made.
- **Recommended next checks:** [Likely] A small maintained browser regression suite should cover the four resolved lifecycle/parser failures and inspect a short downloaded file. Physical Safari/Firefox/mobile checks should establish the browser support claim before a launch verdict. Avoid tests that merely assert source text or implementation details.
