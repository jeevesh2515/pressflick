# Independent score-gate verification — 9 November 2026

[Certain] The ≥8.5-in-every-area gate is **not established**. The scorecard's overall failure and publication hold are supported; passing local automation does not clear human, device, accessibility, or hosting requirements.

## Verdict

[Certain] `docs/SCORE.md` correctly leaves export at 8.0, accessibility at 8.0, and launch readiness at 7.0, explicitly below the owner's gate. It does not conceal those failures behind an aggregate. [Likely] These are reasonable conservative review labels, but neither those values nor the 8.5 values elsewhere are empirically calibrated scores. This reviewer assigns **no independent numerical product score**.

[Likely] The rows labeled “Pass, local scope” are acceptable only as provisional local engineering judgements with the adjacent limits retained. They are not evidence that the same product area has met an unqualified 8.5 readiness gate. Prefer “local checks pass; overall unverified” over an exact 8.5 when communicating outside this review. The scorecard's own rule that material missing human/device evidence caps the affected area at 8.0 needs this distinction: for example, desktop-lab performance cannot independently clear phone performance, and local UX automation cannot establish creator usability. No increase in a score is recommended.

## Evidence independently inspected

[Certain] Read `docs/SCORE.md`, `docs/VERIFICATION.md`, `docs/EXPORT-QUALITY.md`, all four role reports (`code-review`, `security-review`, `performance-review`, `test-review`), the browser test sources/configuration, current relevant application source, and the raw evidence listed below. Unlike the four initial reviewers, this final verifier was explicitly given the current scorecard and readiness conclusion; this is an evidence audit, not a blind score.

| Claim | Independent inspection | Disposition / limit |
| --- | --- | --- |
| 63/63 browser tests | Parsed `replica/evidence/results.json` directly: 63 passed results, 21 each Chromium/Firefox/WebKit; 0 skipped, unexpected, flaky, retries or attached errors. Start 22:21:48.630 UTC; 86.744 s. `final-run.log` also ends in 63 passed. | [Certain] Supported as a stored local run. This verifier did not rerun all browser tests. |
| No automated axe/browser errors | Parsed all result attachments: 72 axe violation arrays were empty; browser-error arrays and result errors were empty. Reviewed fixture: console errors, page exceptions and HTTP ≥500 are collected without an allowlist. | [Certain] Supported within exercised states. Not a screen-reader or complete accessibility verdict. |
| Current files equal final tested files | Independently computed current SHA-256 values for the nine app/HTML/CSS files and compared them with `tested-source-hashes.json`; all matched. Stored record reports no changes across the successful run. | [Certain] Current app bytes match recorded tested hashes. The capture is a local provenance record, not a signed attestation or proof that all possible states were tested. |
| 6/6 unit tests | Read tests and stored log; independently reran `npm test`, exit 0, six passes. | [Certain] Supported. Pure helper coverage remains small; browser tests carry lifecycle coverage. |
| Actual cross-engine media | Parsed raw download metadata and reviewed `verifyDownload`: binary signature, data size, same-engine decode, 1080×1080 dimensions, usable duration. MP4/WebM attachments exist for all three engines. | [Certain] Real media is supported for the silent square samples. This is not cross-device audio or every-ratio export coverage. |
| Hero and maximum MP4 | Independently reran ffprobe on `assets/pressflick-demo.mp4` and `replica/evidence/performance-10s.mp4`: H.264, 1920×1080, 30 fps, 150/300 frames, exactly 5/10 s video; AAC present; files 6,143,205 / 17,732,736 bytes. Independently fully decoded both with `ffmpeg -v error ... -f null -`, exit 0. | [Certain] Frame-complete decodable samples. Container durations are 5.077333/10.069333 s, including longer audio. No human watch/listen was done by this verifier. |
| Highlight stability / cut audio | Read analyzer and reran its calculations without rewriting evidence: 150 frames, maximum highlight-box centre distance 0.5 px each axis; 60/60 audio windows RMS >0.001. | [Certain] Supported for this sample and measurement. Highlight position is not optical glyph stability; energy per interval is not exact sound onset or perceived quality. Audio analysis uses the stored extracted WAV. |
| Performance | Raw Lighthouse JSON: v13.6.0, score 98, LCP 751.492 ms, CLS 0.016775, TBT 152.5 ms, no run warnings. Raw export measurement: 300 encoded frames, queue maximum 1, 6.746 s elapsed, no observed long tasks, 759,857,152-byte browser-tree peak RSS. | [Certain] Supported local measurements. RSS is not isolated page memory; phone/field/cross-browser performance was not measured. The performance report discloses a later failure-cleanup source change; final browser hashes cover current source, but performance was not rerun on byte-identical final export source. |
| Prepared artifact | Independently walked current `dist/`: 27 files, each matching its corresponding current source bytes. | [Certain] Closes the security report's historical stale-artifact observation at this inspection. It does not verify a published site, TLS, headers, DNS or future artifact freshness. |

## Findings and claim corrections

### [S3 / minor documentation precision] Timing depends on export path, not container name

[Certain] In the raw successful run, native WebCodecs MP4 samples have exactly 2 s video; Chromium real-time WebM is 1.770567 s for a requested 2 s. More importantly, the injected codec-probe/render fallback tests produce Chromium **MP4** metadata durations of **1.789167 s and 1.804467 s**, also for requested 2 s. Thus an `.mp4` extension does not guarantee exact duration. `docs/EXPORT-QUALITY.md` originally concluded “MP4 is the timing-preserving path where supported”; the precise claim is **the frame-exact WebCodecs path preserves sampled video timing; MediaRecorder fallback can vary for either container**. Apply that wording wherever timing is promised. This does not reopen a major finding: the limitation is documented, usable files result, and the frame-exact path is available in the measured engines. It remains relevant to the below-bar export verdict.

### [Resolved S3] Zero seed

[Certain] Current `src/app.js:10` preserves an explicit finite zero. Rerunning the original controlled harness restores `#seed=0` as 0; the old minor finding is now marked resolved in `code-review.md`. No application file was changed by this verifier.

### [Info] Exact 8.5 scores are not independent certifications

[Certain] The four specialist reports do not independently award a universal 8.5 product score. They report bounded passes, resolved findings, or verification limits. [Likely] The scorecard handles the overall failure honestly, but exact local 8.5 values should not be reused as a claim that each area independently met the owner's gate. The stricter evidence-first presentation is qualitative local passes plus explicit unmet gates.

## Major-finding reconciliation

[Certain] No unresolved reproduced S1/S2 from the four reports was omitted to reach the local pass labels:

- Code: synchronous export lock, disabled mutable controls, normalized fragment settings, and recorder rejection/cleanup address the four initial S2 findings. Current source and the controlled harness were rechecked; the final browser suite covers related user/failure flows. Runtime recorder-error ordering still has controlled-harness rather than induced browser-error coverage.
- Privacy: the initial query disclosure is closed by fragment-based sharing; the security review's request-boundary probe and final browser round-trip test support that closure. Production enforcement is explicitly open.
- Performance: the measured export long-task issue has a paired successful recheck. Preview CPU and native memory remain documented opportunities/unknown-device risks, with no observed broken feature promoted or demoted merely to clear a score.
- Tests: reproduced landmark/slider/mobile layout defects were fixed and final assertions/axe results support their closure. Passing tests do not establish all accessibility or mobile behavior.

[Certain] The remaining real-time duration variation is a visible S3 limitation, not hidden behind the 63-pass count. Production, human and physical-device gaps are **unmet release requirements**, even though no current S1/S2 was reproduced locally. Zero reproduced major defects is not equivalent to completed readiness.

## What remains unverified

[Certain] This verifier did not perform human watch/listen or creator usability assessment; physical Safari/iOS/Android testing; VoiceOver/NVDA; photosensitivity evaluation; social/editor import testing; repeated-export or low-memory phone stress; hidden-tab quality; field INP/CWV; production deployment/header/TLS/DNS inspection; legal/trademark clearance; original-product reinspection; or publication. The stored ffplay log is automation evidence, not a human perceptual review. Trademark/parity/brand conclusions were read as documentation and were not independently repeated here.

[Certain] The current honest outcome is a tested local release candidate with a publication hold. The owner's ≥8.5 **every area** requirement remains unmet, regardless of whether the provisional numerical labels are retained. No code, commit, push, external original-app visit, deployment or account action was performed during this verification.


## Final follow-up — 10 November 2026: landing, artifact and evidence consistency

[Certain] The additional landing/design/security evidence **does not establish ≥8.5 in every area**. `docs/SCORE.md` still correctly fails the all-areas gate: export 8.0, accessibility 8.0 and launch 7.0. All numerical scores remain provisional engineering judgements; this follow-up awards no independent product score or production certification. The implementation/local-package completion statement in `docs/VERIFICATION.md` is bounded by its explicit publication hold and unmet requirements.

### What was checked

[Certain] Read the final `docs/VERIFICATION.md`, `docs/SCORE.md`, independent `design-review.md`, the security review's dated final follow-up, and the landing-performance follow-up. Independently inspected the current raw run, hashes, local artifact and stored metric files rather than relying on their summary statements.

| Final evidence | Independent consistency result | Scope |
| --- | --- | --- |
| `results.json` against `summary.json` | [Certain] 69 passed results, 23 per Chromium/Firefox/WebKit; start 2026-11-10 02:38:35.340 UTC; duration 87.8582 s; zero skipped/unexpected/flaky/retried results and no attached result errors. | Stored final run, not a fresh browser rerun by this verifier. |
| Result attachments | [Certain] Parsed 78 empty axe violation arrays and 69 empty browser-error arrays. | Automated exercised states; not human assistive-technology or photosensitivity approval. |
| `unit-run.log` | [Certain] Nine passes, zero failures/cancellations/skips: six core helpers and three packaging cases with negative fixtures. | Stored unit run, not a new execution during this follow-up. No claim of exhaustive packaging/state coverage. |
| `tested-source-hashes.json` | [Certain] All 36 recorded public source/assets hashes match the current files; zero mismatches. | Byte identity with the recorded final local-test source set. Not provenance certification or test coverage of every asset/state. |
| Raw `landing-lighthouse.json` against summary | [Certain] Lighthouse 13.6.0: performance 99; accessibility, best practices and SEO 100; LCP 2101.6039 ms, CLS 0, TBT 0; no run warnings. | One root-run local simulated mobile navigation, correctly separate from the earlier independent editor/export audit. Neither field metrics nor physical-phone safety follows. |
| Visual disposition | [Certain] The independent design report says `ship`, reviews six supplied captures, and explicitly excludes playback, keyboard, screen-reader and physical-device exercise. All six nonempty PNGs exist in `.impeccable/review/`: desktop, mobile, tablet, narrow, editor desktop and editor mobile. | This verifier checked report scope and file presence, not a new independent visual rating or monetary valuation. |
| Final artifact/security disposition | [Certain] Independently enumerated current `dist/`: 40 files; every file hashes identically to corresponding source; no symlink or private/developer path found; root MIT, muxer MIT and both font OFL licences present. Security follow-up separately reports local PASS and one remaining production-header S4. | Current local artifact only. No new security penetration test or hosted-header test was performed by this verifier. |
| Domain metadata | [Certain] Default `dist/index.html` retains `pressflick.example`, consistent with the explicit placeholder/account limitation. Security follow-up reports independently checked optional-origin escaping and literal replacement fixtures. | A deliberately unfinished pre-publication configuration, not proof of domain registration, DNS assignment, crawler handling or readiness to upload the default placeholder package unchanged. |

### Claims, remaining gates and historical records

[Certain] No material inflated gate-pass, deployment, public-repository, actual-DNS, human-listening or physical-device claim was found in the final records checked. They explicitly retain the publication hold, distinguish Playwright WebKit from physical Safari, distinguish first-frame decode from full/human playback, disclose high native browser-tree memory, and describe the optional configured-origin package without pretending the selected domain/account exists.

[Certain] The final raw summary retains real-time duration variation: the requested two-second Chromium WebM is 1.760187 s; Firefox 2.012 s and WebKit 2.011 s. The final verification text now correctly says only the tested WebCodecs MP4 path has exact sampled timing and that MediaRecorder MP4 fallback can vary. This addresses the earlier documentation-precision finding; it does not make fallback timing exact or remove export's unmet gate.

[Likely] The local `ship` design disposition, 99 Lighthouse result and artifact PASS are useful scoped findings. They do not turn local 8.5 rows into calibrated independent scores. The missing creator/human/device/production checks still prevent an unqualified 8.5-in-every-area conclusion. No unresolved reproduced major finding from the earlier reconciliation is being silently discarded to reach this outcome; missing release requirements remain explicit despite zero currently reproduced local S1/S2 findings.

[Certain] Earlier sections of this report retain their 9 November snapshot counts (63 browser tests, six unit tests, 27 artifact files). Those are historical, not the final counts. The prior browser evidence is retained under `replica/evidence/history/pre-landing-2026-11-09T22-56-40-328Z/`; current top-level results/summary/hash files describe the later 69-case landing/editor run. Final artifact evidence supersedes the earlier stale-artifact observation. Current editor/export JavaScript hashes remain the same as the previously checked cleanup revision; no unnecessary media/performance rerun was performed for this evidence consistency task.

[Certain] The earlier wording concern about “committed-source regression tests” is absent from the final verification text inspected at append time; the record consistently states that current changes are uncommitted and no commit/push was made.

[Certain] The final disposition remains **tested local candidate and prepared owner-hosting bundle; public release on hold; ≥8.5 every area unmet**. Human watch/listen, physical devices/assistive technology, intended app imports, account-assigned DNS, actual hosting/TLS/headers/cache/redirects and explicit publication authorization remain outstanding. This follow-up changed only this report; it performed no account, network, deployment, original-app, application-source, commit or push action.
