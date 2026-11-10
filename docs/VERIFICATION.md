# Release verification — 10 November 2026

**The deployed technical checks pass; the all-areas 8.5 gate does not.** This is evidence for the tested desktop-engine scope, not a promise of perfect operation on every phone or editing app. Release source is on `release/riso-production-readiness`; GitHub main is unchanged and the repository remains private. The previous pre-launch/Cloudflare and retired-theme results are historical; this report supersedes them for the Riso release.

The plate-caption removal follow-up below supersedes only the baseline deployment identity and landing HTML/CSS hashes. All full-audit counts remain historical results for the reviewed baseline.

## Full-audit production baseline

- Public landing: https://pressflick.vercel.app; editor: https://pressflick.vercel.app/editor.html.
- Production deployment: `dpl_9VH3CW5NJAApZTPvi22ucCkURepo`, READY, created 10 November 2026 at 15:38:15 UTC.
- Immutable hostname: `pressflick-3h0kiqea2-jeeveshs-projects-68cc441e.vercel.app`. It is Vercel-login-protected; the production alias is public. CLI inspection establishes deployment identity; unauthenticated checks use the production alias.
- Direct-upload public package: 49 files, including Vercel configuration. All 48 servable file hashes match production; `vercel.json` is consumed as configuration and returns 404. All 49 packaged files match current source, allowing only the documented output-origin substitution.
- Package manifest SHA-256: `7f2f5131bb8a4e0d68a23c28c9c07ca29bb9c3688add18e76e097e0f2c42ef41`. Manifest/evidence are local under `replica/evidence/riso-release-manifest.json` and `live-audit-final/`.

Production identity, file checks, headers, routing and media evidence are independently recorded in [the live audit](reviews/vercel-live-audit.md). The existing project has no Git integration; pushing this branch does not change main or deploy the checkout root. The runbook is [DEPLOY.md](DEPLOY.md).

## Fresh checks

| Check | Result | Evidence and scope |
| --- | --- | --- |
| Node tests | **9/9 pass** | `npm test`; six core and three packaging tests; local `riso-final-unit.log` |
| Browser suite | **75/75 pass**, 25 per Chromium, Firefox and WebKit; zero skipped, unexpected, flaky or retried tests; 113.36s | `npm run test:e2e`; checked-in `test/e2e/`; local `riso-final-summary.json`, `results.json`, `riso-final-e2e-http11.log` |
| Accessibility/error guards | **81 axe scans, zero violations; 75 empty browser-error attachments** | Full suite attachments; no console/page/5xx filters were added |
| Live downloads | **6/6 sound-enabled MP4/WebM downloads fully played, non-silent audio present, ffmpeg full decode exit 0** | All three engines; six additional clean live axe scans; [live audit](reviews/vercel-live-audit.md) |
| Live serving | Headers match configuration; unknown/private/development paths and sidecars unavailable; expected assets, captions and font load | [Live audit](reviews/vercel-live-audit.md); all 11 page images decode in every tested engine |
| Privacy | Synthetic phrase/settings remain in fragment, absent from observed HTTP requests and referrers; same-origin runtime resources | [Code review](reviews/riso-code-review.md), [live audit](reviews/vercel-live-audit.md); not an exhaustive penetration audit |
| Layout/interaction | 320/390/768/1280/1440px landing; five widths × three editor ratios fit; page-motion keyboard control and user-initiated sample work | [Visual/performance review](reviews/riso-visual-performance-review.md); desktop viewport emulation, not physical phones |
| Performance | Fresh Lighthouse mobile landing **96**, editor **97**; desktop **100/100**; automated accessibility/best-practices/SEO 100 in all four final runs | [Visual/performance review](reviews/riso-visual-performance-review.md); single M5 lab runs, no field CWV claim |
| Distribution | Explicit allowlist, symlink and nonempty-output protection; origin validation/escaping; licences and font provenance retained; raster JSON sidecars omitted | `test/package.test.js`, `scripts/prepare-site.mjs`, 49-file release manifest; ZIP contains no project link or private notes |

Raw evidence lives under git-ignored `replica/evidence/` on this workstation; it is not published in GitHub or the hosting bundle. Review reports and test sources are checked in. Historical hero frame/audio analysis, ffplay execution and the ten-second memory measurement remain documented in [EXPORT-QUALITY.md](EXPORT-QUALITY.md); they were not repeated on a physical device in this review.

## Repaired findings and retained failures

- **S2 — WebKit sound-enabled WebM truncation:** a requested two-second recording played for 0.627s on the original live deployment and 0.645s in the local regression. Sparse sound sources allowed silent intervals to disappear. A native zero-valued ConstantSourceNode now keeps the destination continuous and stops in cleanup. The regression fails original code and passes repaired code. Final live WebKit playback is **1.9865s** for the requested two seconds; this remains real-time capture, not exact timing.
- **S3 — Landing semantics and motion:** all five primary sections now belong to the main landmark; header/footer remain outside. A persistent keyboard/touch-accessible motion control pauses the fountain and ticker. Reduced motion disables both; the editor's decorative strip is static.
- **S3 — Narrow header:** the 320px editor CTA was clipped. Compact narrow-screen sizing now leaves a 16px right margin, with a repository regression.
- **S4 — Pruning:** unused `has-play` writes, unused editor colour token and overwritten fieldset rule removed. Development launcher configuration stays local. The deploy instructions preserve the existing project link instead of deleting it.
- **Local test-server failures:** the first expanded run passed 72/75; three Chromium landing tests failed on RESET/SOCKET_NOT_CONNECTED resource requests. Controlled HTTP/1.0 stress checks reproduced the issue; native `--protocol HTTP/1.1` completed 30/30 stress visits and the final full 75/75 suite without browser errors. Guards were not weakened. The initial log/results/traces remain under `riso-final-e2e.log`, `riso-initial-results.json` and `riso-initial-playwright/`.
- An earlier Lighthouse landing score of 100 with a failed resource request was rejected. Final HTTP/1.1 measurements completed with no failed network requests, warnings or console errors. Details and retained files are in the performance review.

No open reproduced S1/S2 remains in the checked source and production flows. That conclusion does not close the limitations below.

## Unverified requirements and known limits

- No person has supplied watch/listen approval; non-silent audio and decoder success do not establish loudness, pleasant sound or exact sound-to-cut synchronization.
- No physical Safari/iOS/Android, screen-reader session, editing/social-app import, sustained thermal/battery or low-memory/repeated-export stress test was performed. Playwright WebKit is not physical Safari.
- Firefox's tested MP4 contains H.264 video and Opus audio; Chromium/WebKit use AAC. Do not promise universal import support. Real-time duration varies and recording needs a visible tab; WebCodecs video is frame exact in the tested samples.
- The editor's narrow-tablet preview and long phone settings-to-preview scroll remain design weaknesses. Independent visual judgment is landing **8.8**, editor **8.3**, not a measured user-satisfaction score. Active preview still costs CPU under simulated slowdown. See [SCORE.md](SCORE.md) and the visual/performance report.
- Mobile Lighthouse landing LCP was 2.777s and editor TBT 203.5ms in the final lab run. No field INP/CWV or phone-memory claim follows from these scores. Historical maximum desktop process-tree RSS reached 725MiB, not isolated page allocation or proof of phone safety.
- Limited public USPTO/TMview/WIPO screening on 9 November returned no results, as recorded in [BRAND.md](BRAND.md). It is not legal clearance. No social-crawler preview rendering or custom-domain DNS was verified.

## Owner follow-through

Use [HUMAN-CHECKS.md](HUMAN-CHECKS.md) on the public site before a broad promotional release. No new domain is required to use the existing address. `pressflick.app` remains optional; no domain was bought or DNS changed. Making the repository public remains a separate owner decision.

A one-time post-launch research follow-up is scheduled for **10 February 2027 at 09:00 Europe/London**, three calendar months after the owner-confirmed 10 November launch, via automation `pressflick-three-month-research-review`. It requires in-site Reddit/X research, records access limitations, retains the private ten-creators plan and authorizes no outreach. No announcements or creator messages were sent.

## Plate-caption removal follow-up — 10 November 2026

At the owner's request, removed the four bottom-of-section plate numbers/ink names and the sample's Plate 01 prefix. Crop marks and functional sample metadata remain. Unused slug CSS was deleted; design records updated. No editor or export code changed.

Production is now READY deployment `dpl_HNdPiQ3jB8simaVH1fjnE5nRRBDu` (`pressflick-iwqlfl0cv-jeeveshs-projects-68cc441e.vercel.app`), still served publicly at https://pressflick.vercel.app. This small follow-up ran `npm test` (9/9) and `npx playwright test test/e2e/landing.spec.js` (9/9, three per Chromium/Firefox/WebKit; 13.7s). The full 75-case suite and export/media/performance tests were not rerun for this markup/style deletion. Source/test logs: local `replica/evidence/plate-removal-{unit,e2e}.log`, `plate-removal-results.json`. Live hash and desktop/mobile label checks are recorded in `plate-removal-live.json`; the current 49-file public ZIP was regenerated. No new physical-device or human quality claims are made.
