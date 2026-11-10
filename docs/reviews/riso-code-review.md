# Riso implementation review — 10 November 2026

[Certain] The S2 export defect and all concrete accessibility/layout findings from this review are fixed locally; full-suite, deployment and physical-device checks remain separate gates.

What this change does: [Certain] It replaces the landing presentation and editor styling with the Riso theme, adds local still images and a sample-play overlay, and packages the Vercel headers. Follow-up changes add page-motion controls, restore the complete main landmark, prune unused state/CSS, omit raster provenance sidecars from the public package, and preserve silence in real-time sound exports. Baseline: `ba848a7`; expected load is one visitor's browser, with no server application or shared state.

## Follow-up disposition

| Finding | Status | Fresh evidence |
| --- | --- | --- |
| S2 — Sound-enabled WebKit WebM exports lose most of their duration | Fixed locally; deployed recheck remains external to this report | Original regression failed at 0.645s for a requested 2s; fixed whole-playback results: Chromium 1.972061s, Firefox 2.025999s, WebKit 2.009s |
| S3 — Main landmark contains only the hero | Fixed | One main contains all five h2 sections; header and footer are outside main in Chromium, Firefox and WebKit |
| S3 — Infinite page motion has only a hover pause | Fixed | Visible Pause/Resume page motion button works with Enter; ticker animation becomes paused/running; reduced motion hides the button and removes ticker/fountain animations |
| S4 — Unused has-play state, editor teal token and overwritten fieldset gap | Fixed | Both class mutations and unused editor token removed; fieldset gap is set once |
| S3 — Header editor link clipped at 320/360px | Fixed | Narrow typography/padding/gap rule keeps the complete header inside both widths; independently rechecked in all three engines |

## Narrow-header follow-up

[Certain] The first follow-up found a header regression: the 187.1875px wordmark, 16px gap and 143.375px action extended to x=362.5625 on 320/360px screens. Root reduced the narrow wordmark to 18px, action to 14px with 12px side padding, and gap to 12px. Fresh Chromium, Firefox and WebKit checks now find no horizontal document overflow or header/hero overlap at 320, 360, 390, 768 or 1280px. The owner added regression coverage for the 320px action and document width.

## S2 mechanism and repair

[Certain] WebKit's AudioContext clock advanced normally while MediaRecorder omitted the silent spans between short synthesized click sources. A two-second paper-sound control produced only 0.625s of Opus packets; forcing 48kHz did not help (0.620s). Keeping a native ConstantSourceNode connected to the recording destination with offset zero preserved actual silence and yielded 1.967s of audio in the isolated control. No timestamp rewriting, fake duration or post-export padding is used.

[Certain] The narrow repair in `src/app.js` creates that source for sound-enabled real-time recording and stops it in finally cleanup. Silent exports and the frame-exact WebCodecs path retain their existing behavior. `test/e2e/export.spec.js` now exports with sound, validates the real downloaded file, plays it to its end and checks a reasonable real-time duration interval. This reviewer implemented the narrowly assigned repair after the independent live auditor found the defect; that part is not an independent review of someone else's implementation.

## Fresh verification

- [Certain] `npm test`: nine tests pass after the package filter changes, including symlink rejection, output-directory protection, URL validation, metadata escaping, raster-sidecar exclusion and retained font provenance. `git diff --check` passes.
- [Certain] The new export regression fails the original WebKit code and passes all three engines after the fix. Whole-playback durations are recorded above. Root owns the full-suite rerun.
- [Certain] A fresh package was prepared at `/tmp/pressflick-riso-code-review-final-20261110`, with the HTTPS production origin substituted, and served alone on `127.0.0.1:5181`.
- [Certain] Chromium, Firefox and WebKit return zero landing axe violations. Keyboard sample-play activation reveals native controls and focuses the video. Reduced-motion samples remain paused.
- [Certain] Follow-up browser checks confirm the complete main landmark, keyboard motion control, hidden motion control under reduced motion, and static editor gradient bar. Header bottom and hero top meet without overlap at 320, 360, 390, 768 and 1280px widths; horizontal document overflow is absent at every checked width.
- [Certain] The bundle omits every raster `.json` sidecar, retains `assets/fonts/SOURCES.json`, the local images, font and licences, `landing.js`, and `vercel.json`, and contains no docs, recon, test, Git or dependency directories.
- [Certain] Request listeners observed no external HTTP(S) requests during landing/editor checks with a synthetic private phrase in the fragment. The final three-engine follow-up returned zero console/page errors. Earlier local resource resets are preserved and diagnosed below; they were not filtered from the fixtures.
- [Certain] Source tracing confirms editor state still reads `location.hash`, constructs share state after `#`, and sends no phrase through a network API. No tracking, persistence, CDN or runtime dependency was added. CSP remains restrictive; Vercel security-header values match `_headers`. This compares configuration, not live header enforcement.
- [Certain] Initial editor checks at 320×568, 390×844, 768×1024, 1280×900 and 844×390 found no horizontal overflow. The 844×390 landscape preview is small (66×118 CSS pixels), consistent with its viewport-height cap; this is recorded, not classified as a functional failure.

## Local test-server diagnosis

[Certain] Python 3.14.5's default ThreadingHTTPServer has an accept queue of five connections. With the identical public package and a harness that opens fresh contexts, triggers lazy images, resizes through five widths and runs axe, default HTTP/1.0 produced failed local resource requests in 2/10 exploratory visits and 1/30 controlled visits (four requests in that controlled run). Native `--protocol HTTP/1.1` produced zero request/console errors in 30/30 matching visits, with zero axe findings.

[Likely] Reusing HTTP connections avoids the local connection burst that exposed the small accept queue. This supports the native protocol option for the development/Playwright server rather than changing app behavior, adding a server abstraction, retrying tests or weakening error guards. No larger-backlog experiment was needed after that result.

[Certain] All nine actual landing cases then passed in Chromium, Firefox and WebKit against the HTTP/1.1 public-package server. An ignored copy changed only the fixture import location and expected loopback origin from 5174 to the isolated 5181 server; all assertions and existing error guards remained intact. The initial direct run with the unadapted hardcoded origin failed three privacy assertions, as expected for that harness mismatch; both runs are retained separately. These are not full-suite results.

[Certain] Local ignored evidence: `replica/evidence/riso-code-final-recheck.{mjs,json}`, its `before-header` snapshot, `clock-probe-{baseline,silence,rate48}.{json,webm}`, `backlog-{default,http10,http11}.json`, `replica/evidence/replica/evidence/export-regression-results.json`, and `/tmp/pressflick-native-http11-landing{-correct-origin,}-results.json`.

Verdict: [Certain] Ship within the reviewed local code scope. No open reproduced S1/S2 remains; the specific S3 review findings are resolved. Root must finish its full-suite and deployment checks. This is not a universal readiness or perfection claim.

Lean: [Certain] The reported unused state/CSS has been removed. No further concrete pruning finding in the reviewed final paths.

Not checked: [Certain] Physical devices, an assistive-technology session, human flash/audio quality, current live Vercel responses, and post-deployment verification of the S2 repair remain outside this check. Root coordinates the full suite and release verification. No original-product pages/source, previous scorecards, secrets, accounts or deployments were accessed.
