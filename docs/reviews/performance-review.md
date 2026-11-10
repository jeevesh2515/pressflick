# Web Performance Audit

| Metric | Value | Source | Target | Status |
|---|---:|---|---:|---|
| LCP | 0.751 s | Lab: Lighthouse 13.6.0 | ≤2.5 s | Pass in this run |
| INP | Not measured | — | ≤200 ms | Unverified |
| CLS | 0.0168 | Lab: Lighthouse 13.6.0 | ≤0.1 | Pass in this run |
| Lighthouse Performance | 98/100 | Lab: Lighthouse 13.6.0 | ≥90 | Pass in this run |
| Total Blocking Time | 152.5 ms | Lab: Lighthouse 13.6.0 | ≤200 ms | Pass in this run |
| Field Core Web Vitals | Not measured | — | Good at p75 | Unverified |

[Certain] **The local loading threshold passes, and the export responsiveness fix passed its measured recheck.** This is a vanilla JavaScript, client-only static site using native Canvas, WebCodecs, Web Audio, MediaRecorder, and a vendored MP4 muxer. Lighthouse does not measure the download workflow, and this review does not establish a field INP result or a mobile-memory pass. No defensible overall 8.5/10 product score follows from these measurements alone.

## Scope and evidence

[Certain] Audited on 2026-11-09 against the local app at `http://127.0.0.1:5175`; no original-site visit. The requested auditor instructions and `docs/RULES.md` were read. `docs/SCORE.md` and historical scores were not read. No application source, dependencies, commits, or deployments were changed by this auditor.

- `replica/evidence/performance-audit.mjs`: reproducible Playwright instrumentation.
- `replica/evidence/performance-measurements.json` and `performance-run.log`: preview, export, queue, JS heap, and Chromium subprocess RSS measurements.
- `replica/evidence/performance-10s.mp4` and `performance-ffprobe.json`: actual maximum-duration landscape export and independent media metadata.
- `replica/evidence/performance-lighthouse.json`: single Lighthouse 13.6.0 mobile lab navigation, simulated 4× CPU and mobile network; Performance 98, FCP 0.751 s, Speed Index 1.852 s; no runtime error or run warnings.
- `replica/evidence/performance-before-yield-*`: pre-fix maximum export measurements, retained for comparison.
- `replica/evidence/performance-default*`: earlier default 5-second portrait export, retained separately and not mislabeled as maximum-case evidence.
- `replica/evidence/performance-preview-sizing.json`: isolated seeded 48-cut size comparison; no application scaling change was made.

[Certain] Runtime environment: Apple M5, 16 GiB RAM, macOS arm64, Playwright Chromium 158.0.8127.18 headless, 1280×900 runtime viewport, native CPU speed. Browser launched with `--enable-precise-memory-info`. RSS was sampled every 100 ms by summing the launched browser process and its descendants; it is **process-tree resident memory**, not isolated page memory or an attribution to a particular allocation. Shared pages can be counted in multiple processes. Instrumentation and other local work can influence timings. No garbage collection was forced. Repeat/device variance was not quantified.

[Certain] Application source hashes for the measured run:

```text
src/app.js     f4e2b60fbf26e4062f7971db2d70cd3b269c61cfc9dec12a5a699ced58572c3b
src/export.js  7a724a63706004f27d2b7f9252ecfa7413bd54c6bafeefbd5a3f7ffd29b3d9d0
src/render.js  af7cc9b252507904c25703aaad2146cc92628f9d6a24c6fc538a629d9a0ba2a4
```

[Certain] After the measured run, root added `try/finally` around `VideoFrame.close()` and `AudioData.close()`; the export source hash therefore changed. Those additions protect failure cleanup and preserve the measured success path, but this is not a byte-identical claim about the final file. The independent time-budget yield was present in the measured run.

## Summary

| Performance priority | Count | Interpretation |
|---|---:|---|
| Critical | 0 | No measured CWV failure |
| High | 0 | No reproduced blocking performance defect |
| Medium | 1 | Nonblocking preview CPU/battery opportunity |
| Low | 0 | — |
| Info | 2 | Memory/device coverage and minor idle scheduling |

[Certain] **Performance priority and application bug severity are separate classifications.** Here, Medium means a measured, contained optimization opportunity. The application's S2 means a broken feature with no workaround; no such preview failure was reproduced. The preview opportunity has **no application bug severity assigned**, rather than being relabeled S3/S4 to pass a gate. The memory and idle-scheduling observations likewise do not establish functional bugs. This audit reports **zero open reproduced S1/S2 functional performance defects** in its tested scope; untested devices remain unverified.

## Findings

### [RESOLVED] Export work-budget yields removed observed long tasks

- **Area / location:** Rendering and JavaScript; `src/export.js:44-60`.
- **Before fix:** [Certain] The 10-second, 1920×1080, 16-cuts/s, paper-sound MP4 took **5.751 s**, with **56 main-thread long tasks, 64–133 ms each**. The queue cap alone did not bound JavaScript work per task.
- **Root remedy / measured recheck:** [Certain] An independent 16 ms elapsed-work budget now yields via a timer, retaining the encoder queue cap. The same seeded settings completed in **6.746 s with zero >50 ms long tasks** and encoder queue high-water mark **1**. Both files contained 300 frames. This trades about one second in this run for responsive main-thread scheduling. These are paired local lab observations, not a measured field INP improvement.
- **Verdict:** [Certain] Closed as a blocking performance concern for the measured Chromium success path. No worker, new dependency, or architecture change is needed on this evidence. Lower-powered hardware remains untested.

### [MEDIUM performance priority; no reproduced functional bug] The display preview renders full export resolution

- **Area / location:** Rendering; `src/app.js:33-34,49-60`, `src/render.js:30-109`, `style.css:44`.
- **Measured impact:** [Certain] In four seconds at the default 12 cuts/s, the page drew **49 cuts**, with **21.9 ms median / 24.8 ms p95** draw-callback duration and **1.049 s of main-thread script time** (CDP `Performance.getMetrics`). No >50 ms long task or blocked editor flow occurred in this preview sample; this is an optimization opportunity, not a release blocker. This includes instrumentation overhead and measures JavaScript callback work, not all GPU work.
- **Cause / potential impact:** [Certain] The preview uses a 1080×1920 backing canvas while CSS limits its display dimensions. [Likely] Full-resolution text, blur, gradients, and compositing consume avoidable battery and main-thread capacity; slower devices have less headroom. This run does not establish dropped-frame rates or field INP regressions.
- **Minimal remedy:** Size preview backing pixels to its rendered size × a capped device-pixel ratio, retaining the separate full-resolution canvas already created for exact MP4 export. **Keep real-time capture at the selected export resolution**; simply shrinking the shared stage would lower WebM/fallback download quality. Compare matching seeded preview frames before changing resolution and re-profile. No speculative memoization or additional rendering library is justified. An isolated seeded 48-cut benchmark measured 1080×1920 at 21.6 ms median / 25.3 ms p95 and 720×1280 at 12.4 ms median / 14.4 ms p95 (1,043.7 versus 599.1 ms total draw work). This estimates the local CPU opportunity; it does not validate preview visual quality or full application capture behavior. Root kept full-resolution preview to preserve scope; scaling is a follow-up.

### [INFO; no reproduced functional bug] Native export memory is substantial, but this run does not show a leak

- **Area / location:** Export memory; `src/export.js:31-34,42-43,59-77`; reusable scene/mask canvases in `src/render.js`.
- **Measured impact:** [Certain] Chromium process-tree RSS grew from **430 MiB before export to 725 MiB sampled peak**, then fell to **183 MiB** 12 seconds after the download (following the app's 10-second object-URL revocation). JS heap immediately after export was **100.4 MiB**. A heap-only check would miss substantial native canvas/encoder/browser storage. An RSS delta is not a precise per-export allocation size, and the 100 ms sampler can miss brief peaks.
- **Media validation:** [Certain] The resulting file is **17,732,736 bytes**, with **300 H.264 frames at 30 fps, 1920×1080, exactly 10.000 s video**, plus AAC audio (10.069 s container duration). It is not a one-frame mock or a shortened export.
- **Potential impact / remedy:** [Likely] A memory-constrained phone can fail even though this desktop succeeds; no crash was observed here. Preserve the duration cap, bounded queue, explicit frame closure, and encoder cleanup. Measure a real lower-memory Android/iPhone before declaring device support. If failures appear, a lower-resolution user choice is smaller than replacing the muxer with a new streaming architecture. The current bounded ten-second product does not justify that refactor from this run alone.

### [INFO; no reproduced functional bug] Paused and reduced-motion preview avoids redraws but still wakes RAF

- **Area / location:** Scheduling; `src/app.js:49-57`.
- **Measured impact:** [Certain] Paused preview made **240 RAF callbacks / 4 s**, **zero draws**, and **4.2 ms script time**. Reduced-motion load made **one initial draw**, then no animated cuts; **240 callbacks / 4 s** and 28.0 ms total script time including that draw. This verifies no automatic animated preview under the initial reduced-motion preference in this browser.
- **Recommendation:** [Certain] The observed idle cost is small; this is not a release blocker. If scheduling is revised, cancel RAF while idle and schedule one draw for edits, play, or real-time recording. Avoid adding complexity solely to recover a few milliseconds. The current `document.hidden` guard and `busy && !rec` guard skip drawing, source-verified; actual background-tab energy use was not measured.

## Rechecked fixes and positive observations

- [Certain] Root changed the encoder's one-shot queue yield to a draining `while` guard before this measured export. **Measured maximum encoder queue size was 1** across 300 frames after the work-budget fix (5 in the queue-cap-only baseline). The guard allows up to 5 queued entries because it checks after enqueue. This bounds pending encoder queue entries in this run, not all native encoder buffers. The old unbounded-growth concern was code-traced, not reproduced; it is not counted as an open finding.
- [Certain] Exact export now skips preview drawing while busy; real-time recorder drawing is retained. Source includes a hidden-document guard. These prevent an unnecessary competing preview path; hidden-tab behavior remains source-level evidence.
- [Certain] MP4 redraws only at cut changes, closes every VideoFrame, and closes encoders in `finally`. Scene and mask canvases are reused; their pixel stores do not grow once dimensions stabilize.
- [Certain] No framework hydration, third-party fonts, tracking, remote media, or network-backed rendering is present. System fonts and locally synthesized audio avoid font and sample downloads.
- [Certain] At the loading-audit revision, initial HTML, CSS, and JavaScript totaled about **98.6 kB raw**; independently gzipped JavaScript totaled about **22.8 kB**. These are local file sizes, not measured production transfer sizes or proof that the production host compresses responses. The vendor is loaded eagerly, but its 14.4 kB gzip size and the measured loading pass do not justify urgent splitting.
- [Certain] Static Python localhost serving does not establish production CDN/cache/compression/HTTP2 performance. Those remain unmeasured and should be checked on the eventual deployed host. No backend or database optimization applies.

## Verdict

[Certain] **Pass for the ≥90 Lighthouse lab threshold (98/100); maximum landscape MP4 export is frame-complete with bounded queue in the measured Chromium run.** [Certain] The export work-budget fix removed all observed >50 ms export tasks in its recheck; there are **zero blocking performance findings** on this evidence. [Likely] Display-sized preview rendering is a useful nonblocking follow-up if it preserves full-resolution real-time exports. Real-device export memory, mobile stress behavior, field CWV, background-tab operation, and cross-browser performance remain unverified. This review does not validate physical phone exports or physical accessibility and cannot independently clear an all-areas 8.5/10 readiness claim. The local lab pass should not be described as a universal performance guarantee.

## Root landing follow-up — 10 November 2026

[Certain] The earlier98 loading score above belongs to the previous editor-first page. The final separate landing received a fresh Lighthouse13.6 local mobile/simulated run: **Performance99, Accessibility100, Best Practices100, SEO100; LCP2.102s, CLS0, TBT0, FCP0.752s**, with no run warnings. Evidence: `replica/evidence/run-landing-lighthouse.mjs`, `landing-lighthouse.json`, `landing-lighthouse-summary.json`. URL `http://127.0.0.1:5176/`, cached official Lighthouse CLI, installed Playwright Chromium. This root follow-up is not a new independent field audit. The page uses local licensed fonts and a poster; video starts paused with preload=none. This does not certify field metrics, physical mobile performance, semantic accessibility or social crawlers.

[Certain] Editor/export JavaScript has not changed since the covered cleanup and scheduling fixes. The recorded maximum-export native-memory and timing limits still apply; the new landing score does not erase them.
