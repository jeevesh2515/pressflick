# Memory: decisions and why

| date | decision | why |
| --- | --- | --- |
| 2026-11-09 | Scope: one screen, one flow, the whole product | It is one screen and one flow |
| 2026-11-09 | Static site, no backend | The original itself renders in the browser. Nothing needs storing |
| 2026-11-09 | No framework, no build | One screen. About 400 lines of our own JS |
| 2026-11-09 | Export first shipped with `MediaRecorder` | Zero dependencies. Cost: real-time, tab must stay visible |
| 2026-11-09 | MP4 export moved to WebCodecs + vendored mp4-muxer 5.2.2 | Frame-exact, faster than real time, proper AAC audio. This is the one dependency: writing an MP4 muxer by hand is not sensible. Vendored as one file, so still no build step. `MediaRecorder` stays as the fallback and for WebM |
| 2026-11-09 | A key frame at every cut | Initial choice for abrupt new pictures; takeover experiment below found smaller delta output, but unchanged perceptual quality was not established |
| 2026-11-09 | Cuts are drawn on demand from a seed, not pre-rendered | 60 frames at 1080x1920 would hold about 500 MB |
| 2026-11-09 | Lock the word by solving font size for constant width | Keeps position exact across fonts. Height still varies by typeface |
| 2026-11-09 | System fonts, synthesized sounds, generated filler text | Nothing to license, nothing copied |
| 2026-11-09 | Phrase cap 80 chars (original: 23) | Longer phrases just run off the page edge, which is the look anyway |
| 2026-11-09 | Preview is silent; "Hear it" plays one sound | Browsers block audio before a click, and a looping click track is annoying |
| 2026-11-09 | Name is Pressflick (replaced an earlier placeholder) | Owner's pick. pressflick.com, pressflick.app and the GitHub handle were unregistered that day; nothing else uses the name in a web search. Trademark search not run |
| 2026-11-09 | No AI model or API key is used | The effect is typography and random layout. The original says the same about itself |

## Open questions for the owner

- Register the chosen pressflick.app; GitHub repository already exists privately.
- Owner chose Cloudflare Pages; account/DNS setup pending.
- No visit counter or tracking under the owner’s requirements.

## Takeover decisions —9 November 2026

Evidence: docs/VERIFICATION.md and docs/reviews/. These updates supersede earlier entries where behavior changed.

- Share URLs use fragments rather than query strings after the independent review reproduced phrase disclosure in request/referrer logs. Existing query-state links are ignored. No analytics/counter is planned under the owner's no-tracking requirement.
- Busy state is set before capability probing; all controls freeze until export settles. Recorder errors release resources and do not save empty partial files. Encoding failures can fall back to real time. Explicit unsupported status replaces unhandled exceptions.
- WebCodecs queue drain is bounded; time-budget yielding removed measured export long tasks in the audit lab. Native memory still needs physical-phone validation.
- Every-cut keyframes retained. The longer-GOP experiment was36.7% smaller but had decoded SSIM0.985881 versus the baseline, so a no-quality-loss claim was not established (replica/evidence/gop-comparison.log).
- Original brand assets and real tool-made hero clip added; public trademark contains/wordmark screening had no results in 3 databases, not legal clearance (docs/BRAND.md).
- Owner chose pressflick.app and Cloudflare Pages and explicitly authorized the privacy contact in privacy.html. Domain registration, assigned DNS target, live publication and repository public visibility still require the owner's account actions/approval.
- Copy-only public packaging excludes all private notes/logs and development material. .gstack/ deleted by explicit instruction before strict sweep. No application build added.
- Research scheduling is conditional on confirmed launch; launch+3 calendar months, Reddit/X searched inside the sites. No automation exists before that condition.

## Final local follow-up — 10 November 2026

Owner selected assigned Pistachio Picture House in the code-first board, with a separate editor. Landing implementation and source-derived design record completed; independent six-viewport visual disposition ship (docs/reviews/design-review.md). Final Node9/9 and E2E69/69,78 axe/error-free scans (docs/VERIFICATION.md). Landing lab Lighthouse99; earlier editor98 retained as historical. Static packaging now includes a404page, alllicences and optional escaped HTTPSorigin metadata substitution; independent final artifact40files match source. Source/default bundle OGplaceholder remains until domain exists. Real-time export duration remains an openS3 limitation; only WebCodecs exactMP4 has exact-timing evidence. No physical/human/production checks were invented, no upload/public-repo/commit/push performed, and all-area8.5 gate remains unmet.

## Riso redesign and Vercel hosting — 10 November 2026

- Owner asked for a less plain landing to share publicly (rounder buttons, per-section colours, more elements, moving gradient hero) and chose the "Riso gig poster" direction over lyric-video and teletext options. Film Stock is retired. Landing: split-fountain hero (pink, sunflower, riso blue multiplied on paper), one ink per section with halftone screen, crop marks and plate slugs, pill buttons, real renderer frames for the three ratios (assets/ratio-*.webp). Editor: same inks on riso blue #1d2b8f, segmented ratio control, sticky action row.
- Hosting switched from Cloudflare Pages to Vercel at the owner's request (production on a vercel.app address; repository stays private; no domain bought). `vercel.json` carries the same security headers as `_headers` and ships in the allowlist. Open Graph URLs still use the marked placeholder until a domain exists.

## Production verification and release branch — 10 November 2026

This entry supersedes the earlier pre-launch/Cloudflare statements above. The owner confirmed the Vercel app is public and authorized verification, fixes, production updates and a push on a professional release branch. Production is https://pressflick.vercel.app; the existing Vercel project has no Git integration. GitHub remains private and main is unchanged. The chosen branch is release/riso-production-readiness; new commit messages carry no assistant attribution, as explicitly requested. No domain was purchased and no custom-domain DNS was changed.

Fresh live recording checks found a WebKit sound-enabled WebM timeline defect that earlier silent E2E did not catch. A continuously connected zero-valued native audio source preserves silent intervals, with cleanup and a real whole-playback regression. Landing semantics, keyboard/touch motion pause, narrow header layout and dead CSS/state were corrected. Image origin sidecars stay in source but are excluded from public packages; font provenance/licences stay. Current evidence and limits: docs/VERIFICATION.md and the dated Riso/live review reports. Historical numerical design/performance scores are not current measurements.

Production update verified as deployment dpl_9VH3CW5NJAApZTPvi22ucCkURepo, with 48/48 servable hashes and six sound-enabled downloads checked by an independent live auditor. One-time research automation pressflick-three-month-research-review was created ACTIVE for 10 February 2027 at 09:00 Europe/London, with in-site Reddit/X research and no outreach; this supersedes earlier conditional scheduling notes. No repository visibility or domain/DNS change was made.

## Plate-label removal — 10 November 2026

Owner requested removal of the numbered plate/ink-name captions shown at section bottoms. Removed all four captions and the demo’s Plate 01 prefix, retained functional resolution/cut-rate metadata and decorative crop marks, and deleted unused slug CSS. Design records now reflect the change. Verification is recorded in docs/VERIFICATION.md; no editor/export behavior changed.

## Creator activation upgrade — 10 November 2026

The owner reports all human checks complete for the preceding deployed site (93ae3a0); docs/HUMAN-CHECKS.md records that as owner-reported, without invented device/version or per-file evidence. This supersedes earlier statements that no human sign-off exists; it is separate from independently observed automated checks.

The owner requested useful new landing elements after comparing the competitor's public page. Read-only clean-room observation is kept privately. The in-world plan adds original real starter cuts with fragment links, inspection of actual exported frames, actionable format shortcuts and an explicit-click share kit. No competitor code, layout, copy, names or media is reused. Recognition/reach is a goal, not a measured promise; no trackers, social-proof claims, accounts or automatic posting are added.

The owner selected an upright slab serif from the five-second sample. The frame extracted at 1.78 seconds matches the supplied screenshot. Seed 42 and cut 21 select Rockwell at weight 700 in the renderer. The site uses Rockwell when installed and ships Montagu Slab under the SIL OFL as a fallback. Body copy is 20px and individual words highlight on pointer hover. Archivo continues to set headings and wordmarks. The renderer keeps its existing font choices.
