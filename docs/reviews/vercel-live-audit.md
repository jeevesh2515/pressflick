# Vercel live audit — 10 November 2026

[Certain] **Final disposition: PASS for the sampled production HTTP/privacy/resources and three-engine sound-enabled exports. The reproduced S2 WebKit WebM timing defect is resolved on the deployed package.** Final verification ran at 15:39–15:41 UTC, after the corrective deployment. All 48 servable public files match the final prepared package and current source (with only the documented HTML origin substitution). Human/device/import checks below remain unverified. No old numeric score was consulted, and no new design score is assigned.

## Deployment identity and settings

[Certain] The installed Vercel CLI (`57.0.0`) resolved [the production alias](https://pressflick.vercel.app) to deployment `dpl_9VH3CW5NJAApZTPvi22ucCkURepo`, created `2026-11-10T15:38:15Z`, target production, status READY. Its immutable hostname is [pressflick-3h0kiqea2-jeeveshs-projects-68cc441e.vercel.app](https://pressflick-3h0kiqea2-jeeveshs-projects-68cc441e.vercel.app). Unauthenticated access to that hostname redirects to Vercel login; byte comparisons below use the public alias. The deployment identity is confirmed through the authenticated, read-only CLI/API, not by bypassing deployment protection.

[Certain] Read-only `vercel project inspect pressflick` and `vercel api /v9/projects/pressflick` show no Git integration (`link: null`). Framework, root-directory, build-command, output-directory and install-command overrides are null; CLI presents the Other preset and default output `public` if present, otherwise `.`. Node version is `26.x`. The final `release/pressflick-production.smiR1w` package contains public HTML and excludes `package.json`, `.git` and `replica`; the previously linked upload directory matched this same project. No account, Git, deployment or DNS settings were changed in this audit.

[Likely] Connecting the repository to this project without explicitly setting the packaging command and output directory would introduce a checkout-root publication risk because the present defaults were appropriate to direct upload of the prepared bundle. There is no current Git connection causing that exposure.

## Live HTTP and privacy

| Check | Observed result |
| --- | --- |
| Landing/editor/legal | [Certain] `/`, `/editor.html`, `/privacy.html`, `/terms.html`: HTTP 200, correct HTML; no extensionless redirect on the editor URL. |
| Unknown/private paths | [Certain] Unknown path, `/.git/config`, `/package.json`: HTTP 404 with the custom Pressflick 404 page. `/replica/` and `/.gstack/`: HTTP 308 slash normalization, then custom HTTP 404. No private content returned. |
| HTTP-to-HTTPS | [Certain] HTTP origin redirects to HTTPS and ends at the landing page. |
| CSP | [Certain] HTML, public asset and final 404 responses enforce `default-src 'self'; media-src 'self' blob:; img-src 'self' data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`. |
| Frame/referrer/type | [Certain] `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff` observed. |
| HSTS | [Certain] `Strict-Transport-Security: max-age=31536000; includeSubDomains` on content/404 responses. Platform slash redirects instead have Vercel's `max-age=63072000; includeSubDomains; preload`. |
| Permissions | [Certain] `Permissions-Policy: camera=(), microphone=(), geolocation=()`. This does not claim every other browser sensor is explicitly disabled. |
| Redirect-header limitation | [Certain] Platform-generated slash redirects omit the app CSP/frame/referrer/permissions headers; final content responses include them. These redirects return plain text without application content. |
| Cookies | [Certain] No `Set-Cookie` header observed on the public alias responses sampled. |
| Fragment privacy | [Certain] Synthetic phrase `Live audit private phrase 739105` restored from the editor fragment in all three engines. No sampled HTTP request URL, request body or Referer contained it; no nonempty Referer and no third-party HTTP request appeared in the captured landing/editor/share/export/legal flow. Chromium clipboard readback confirmed the copied share URL has an empty query and phrase state only after `#`. This is a sampled runtime observation, not a proof about every possible browser extension or user-shared link. |

[Certain] At `2026-11-10T15:39:23Z`, the 49-file final package (`release/pressflick-production.smiR1w`) was hashed against live responses: all 48 servable public files matched SHA-256; only host configuration `/vercel.json` returned the expected 404. A separate comparison at 15:40:56 UTC matched all 49 package files to current source, applying only the documented `https://pressflick.example` → production-origin substitution in HTML. The nine raster provenance sidecars are excluded from the final package; runtime assets and required licences remain. The deployment ID was independently rechecked through CLI/API during this pass. The initial inventory and mismatch evidence remain retained separately.

## Real browser media/resources

[Certain] The project's installed Playwright was used with isolated headless Chromium `158.0.8127.18`, Firefox `159.0`, and WebKit `27.2`. All 11 landing images decoded after scrolling them into view; fonts completed loading; all observed requests remained same-origin. The hero played to `ended` in all engines, and its local VTT caption track loaded with one cue. Landing-to-editor navigation and editor-to-privacy navigation succeeded.

[Certain] Axe found zero violations on the sampled landing and editor screens in each engine. The final three-engine run had no console errors or warnings. A first, pre-fix WebKit run logged two CSP errors caused by the screenshot harness's injected styling; a rerun with screenshot capture removed had zero errors and warnings while retaining all accessibility and media checks. The original failure is retained, not filtered from its evidence. This was an audit-harness correction, with no CSP weakening or app change.

[Certain] Each format request produced a real download with the correct MP4/Matroska signature, 1080×1080 decoded dimensions, full in-browser playback to `ended`, an audio track with nonzero energy, and a complete ffmpeg decode exiting 0. All requested settings were two seconds, four cuts/second, square, paper sound. Successful decoding is distinct from correct timing or human approval:

| Engine/request | Actual codecs/container | Browser duration | Timing finding |
| --- | --- | --- | --- |
| Chromium MP4 | [Certain] H.264 + AAC, MP4 | [Certain] 2.069333 s | [Certain] 60 video frames at 30 fps, video exactly 2.000 s; AAC padding extends the container. |
| Chromium WebM | [Certain] VP9 + Opus, WebM | [Certain] 1.931437 s | [Certain] Real-time duration shorter than requested; documented existing limitation. |
| Firefox MP4 | [Certain] H.264 + Opus, MP4 | [Certain] 2.0135 s | [Certain] 60 video frames, video exactly 2.000 s. Opus-in-MP4 is not evidence of AAC or universal editor/social-app compatibility. |
| Firefox WebM | [Certain] VP8 + Opus, WebM | [Certain] 2.025999 s | [Certain] Real-time variation. |
| WebKit MP4 | [Certain] H.264 + AAC, MP4 | [Certain] 2.004 s (browser), 2.048 s (ffprobe container) | [Certain] 60 video frames, video exactly 2.000 s; player/container duration interpretation differs. |
| WebKit WebM | [Certain] VP9 + Opus, WebM | [Certain] 1.9865 s | [Certain] **PASS after correction:** prior 0.627 s sound-enabled truncation resolved in the final deployment. Real-time variation remains. |

### Resolved S2: WebKit WebM sound-enabled truncation

[Certain] A fresh WebKit browser, first export, loaded `/editor.html#ratio=1%3A1&duration=2&cps=4&sound=paper&format=webm&text=Live+audit+control` and clicked Download video. Wall time was 2.090 s, but last video packet PTS was 0.561 s and last audio packet PTS was 0.625 s (251 audio packets). The silent fresh-browser control took 2.074 s and last video PTS was 1.770 s. Separate runs after MP4 export reproduced the sound-enabled 0.627 s playable duration. The failure is not caused by the preceding MP4 export or the screenshot harness. This audit did not modify runtime code; the exporter reviewer supplied the correction and regression coverage.

[Certain] The deployed `recordLive()` now connects a native, zero-offset ConstantSourceNode to the recording destination while recording and stops it during cleanup, maintaining the audio clock through gaps between click sounds. The independent final first-export paper-sound control took 2.0835 s wall time, with last audio PTS 1.980 s and last video PTS 1.750 s; the main full-playback run ended at 1.9865 s. The original sub-second failure is resolved in tested Playwright WebKit. Physical Safari reproduction and validation remain unverified. Silent and sound-enabled real-time exports can still end between visual cuts and are not frame exact.

## Evidence and remaining checks

[Certain] Final raw evidence is local and git-ignored under `replica/evidence/live-audit-final/`: `http.json`, `project-settings.json`, `redirects.json`, `browser.json`, `resources.json`, `webkit-controls.json`, `summary.json`, and downloaded MP4/WebM files. The final run performed six clean axe scans and full playback/ffmpeg decoding of six sound-enabled downloads; these counts describe this audit, independently of the root agent's full repository suite. Original failure evidence remains local and git-ignored: `replica/evidence/live-audit/{http.json,redirects.json,project-settings.json,browser.json,first-browser.json,resources.json,audio-summary.json,webm-timeline.json,webkit-controls.json}` and downloaded media; clean WebKit rerun under `replica/evidence/live-audit-webkit-rerun/`. Repro helpers are `replica/evidence/live-audit-{http,browser,resources,webkit-control}.mjs`. These contain only synthetic phrases and sanitized project settings; no credentials were printed or copied into the report.

[Certain] Still unverified: physical Safari/iOS and Android; human watch/listen approval; intended editor/social-app imports (especially Firefox H.264/Opus MP4); screen-reader use; low-memory/repeated-export/background-recording behavior; and field performance. Playwright WebKit is not physical Safari. Nonzero audio energy and decoder success do not establish perceived loudness, quality or sound-to-cut synchronization. This PASS covers the measured production scope, with the remaining human/device/import and field-performance gaps stated explicitly.
