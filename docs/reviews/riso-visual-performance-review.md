# Riso visual and performance review — 10 November 2026

[Certain] The first narrow-screen check found a clipped header action; the corrected source now fits at every requested width. [Likely] The landing is visually strong enough to share; the editor remains less polished on phones and narrow tablets. The design scores below are **8.8/10 for the landing and 8.3/10 for the editor**, not an assertion that every area clears 8.5.

## Scope and method

[Certain] This is one independent, scoped audit of the owner's approved Riso direction: Persuade for the landing and Operate for the editor. Impeccable audit and Design Taste supplied the review criteria. No new design direction, interview, app edit, dependency, Git mutation or deployment was performed. Previous numerical design scores were not used to set these scores.

[Certain] A fresh allowlisted copy was prepared with the real HTTPS origin and served only on loopback port 5182. The final snapshot is `/tmp/pressflick-riso-final-visual-20261110-v2`; relevant source hashes are retained in `replica/evidence/riso-final-visual-final-source-hashes.json`. All seven recorded source hashes match the current source, accounting for the output-only HTML origin substitution. The first snapshot and failed measurements remain available rather than being overwritten or presented as passes.

[Certain] Rendered checks used Ego Lite / Chrome 156 on macOS at 320×568, 390×844, 768×1024, 1280×900 and 1440×900 CSS pixels. The editor was inspected in all three ratios at all five widths. These are desktop-browser viewport emulations, not physical phones or synthesized touch-gesture tests. Screenshots, metrics, scripts and raw Lighthouse JSON are local, ignored evidence under `replica/evidence/riso-final-visual*`; they are excluded from the hosted package.

## Visual assessment

[Likely] The landing expresses the requested Riso identity through the split-fountain hero, expanded Archivo headings, offset inks, plate labels, crop marks, paper grounds and one ink per section. The real exported clip and renderer frames make the effect concrete. The repeated yellow editor actions remain easy to distinguish from explanatory links. The editor carries the same identity through the blue ground, held-word yellow, segmented ratio choices and compact printed labels without importing the landing's oversized display treatment into the form.

Scores are subjective reviewer judgments, equally weighted across the following dimensions. They are not user-research results, accessibility certifications or Lighthouse conversions.

| Dimension | Landing | Editor | Rationale |
| --- | ---: | ---: | --- |
| Product-specific visual identity | 9.0 | 8.5 | [Likely] The print language belongs to the text-cut effect; the editor is coherent but necessarily more conventional. |
| Hierarchy and composition | 9.0 | 8.5 | [Likely] Clear demonstration-to-process-to-formats sequence; the wide editor makes controls, preview and help legible at once. |
| Task clarity and actions | 9.0 | 8.5 | [Likely] Editor links lead the landing; the form exposes the word choice and a clear yellow Download action. |
| Responsive use of space | 8.5 | 7.5 | [Certain] No final horizontal overflow in the measured matrix. [Likely] The editor's small tablet preview and long phone scroll weaken the settings-to-preview feedback loop. |
| Motion, feedback and keyboard presentation | 8.5 | 8.5 | [Certain] Page motion can be paused by keyboard, the sample starts stopped, reduced motion is honoured, and tested controls expose visible focus. [Likely] Human assistive-technology and motion review could still reveal gaps. |
| **Mean / 10** | **8.8** | **8.3** | [Likely] A scoped design judgment, not a universal release score. |

### Resolved during this review

- [Certain] At 320px, the initial header's wordmark, gap and action exceeded its available width: `scrollWidth` was 362px and the header's Open editor button was clipped. Root compacted the narrow header. The fresh copy now has `scrollWidth = 320`, with the action ending at x304 and retaining a 16px right margin. The heading begins at y104 below the 88px header. The correction also fits at 390, 768, 1280 and 1440px.
- [Certain] All five landing `h2` sections are inside `main` in the inspected implementation. The header clears the hero at every checked width; no header/heading overlap was observed.

### Remaining recommendations

1. **P2 — Preview cost on slower devices.** [Certain] The final mobile Lighthouse run reports 203.5ms total blocking time on the editor, versus 0ms on the landing and desktop editor. The editor keeps a full-resolution animated canvas active by default. [Likely] A future, measured preview-resolution or rendering-budget change could improve responsiveness; preserve full-resolution recording/export and both encoding paths. This audit does not establish that a physical phone is unusable, and no speculative optimization was made.
2. **P2 — Settings and preview separate on phones; preview compresses on tablets.** [Certain] At 390×844 with a vertical clip, the form begins around y957 and Download around y1849. At 768px the landscape preview is about 202×115 CSS pixels alongside a 460px form. Download remains reachable and unobscured. [Likely] A later, deliberate mobile workflow pass could reduce repeated scrolling and enlarge the narrow-tablet preview. Preserve the current overlap-free layout until such a change is tested.

[Certain] No additional task-blocking visual defect was reproduced after the header correction. These remaining observations do not justify replacing the approved Riso design.

## Responsive and interaction evidence

| Check | Observed result |
| --- | --- |
| Landing at all five widths | [Certain] Final document width equals viewport width; header CTA stays inside the viewport; hero heading clears the header. |
| Editor: five widths × three ratios | [Certain] No horizontal document overflow. Canvas pixel sizes change to the selected output ratio; the preview remains visible in the document. |
| Download visibility | [Certain] Focus can reach Download at every checked width; its centre is unobscured and within the viewport after focus scroll. |
| Editor keyboard sequence at 390px | [Certain] Tab reaches focal-word buttons, examples, selected ratio, sound/style/format, colour, sliders, Download, Shuffle, Copy link, playback and help. Native radio arrow behaviour was not independently re-tested here. |
| Focus appearance | [Certain] Keyboard navigation produces the yellow 2px editor outline with 3px offset. Landing navigation/actions expose the dark 3px focus outline. |
| Page motion | [Certain] Enter changes Pause page motion to Resume page motion and pauses both the fountain and ticker; Enter again resumes them. |
| Sample playback | [Certain] Enter starts the sample, hides the overlay and transfers focus to the video; native controls remain available. This is not a human listening assessment. |
| Reduced motion | [Certain] The decorative animation names become `none`, the page-motion control is hidden, the sample remains stopped and the editor starts with Play / no playing state. |
| Lazy images | [Certain] Real cut frames and ratio images load when their sections are scrolled into view. Initial full-page captures can contain unloaded below-fold lazy images; scrolled captures were used for the final visual judgment. |

## Fresh local Lighthouse measurements

[Certain] Lighthouse 13.6 ran through Playwright's Chromium 158 against the final snapshot served by Python's standard-library server with `--protocol HTTP/1.1`. Hardware: Apple M5, 16GiB RAM. Mobile uses Lighthouse's simulated 412×823, DPR1.75, 4× CPU slowdown and throttled network configuration; desktop uses its desktop preset. Each row is one completed run, not a field percentile or repeated-run median.

| Page / preset | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Landing / mobile | 96 | 100 | 100 | 100 | 2.777s | 0ms | 0.01494 |
| Editor / mobile | 97 | 100 | 100 | 100 | 0.752s | 203.5ms | 0.00043 |
| Landing / desktop | 100 | 100 | 100 | 100 | 0.663s | 0ms | 0.02656 |
| Editor / desktop | 100 | 100 | 100 | 100 | 0.263s | 0ms | 0.00217 |

[Certain] All four final reports pass the console-error audit, record no failed network requests, and contain no run warnings or runtime errors. Raw evidence: `replica/evidence/riso-final-visual-final-lighthouse-{landing,editor}-{mobile,desktop}.json` and `riso-final-visual-final-lighthouse-summary.json`. The final landing transferred about 686kB and the editor about 202kB in this local check; video playback/download is not included in those initial-load amounts.

[Certain] An earlier HTTP/1.0 landing run scored 100 while logging a failed resource request. That score is invalid as evidence of a complete page load and is retained separately under the `riso-final-visual-latest-lighthouse-*` prefix. Root reported connection resets from a separate server diagnosis in the HTTP/1.0 development path; the corrected HTTP/1.1 final runs above are complete. Errors were not filtered or suppressed. Earlier editor mobile measurements varied, so the final 97 is not a promise of that score on other machines or runs.

[Likely] The mobile landing still has room to improve image delivery: LCP is above the 2.5s target in this simulated run. The lab suggests delivering appropriately sized hero media would be a useful future measurement-led improvement. Do not add a bundler or runtime image service merely to raise this score. Local cache/compression opportunities reported by Lighthouse also reflect the simple test server and are not measurements of Vercel's production delivery.

### Preview active/paused comparison

[Certain] A separate Chrome156 browser measurement used the same synthetic phrase/seed at 390×844 with an explicit 4× CPU slowdown. In a five-second active-preview window, PerformanceObserver recorded 51 long tasks totalling 4.879s, a 275ms maximum task and an 83.3ms median animation-frame interval. After pressing Pause, the next five-second window recorded zero long tasks and a 16.7ms median interval. Evidence: `replica/evidence/riso-final-visual-preview-comparison.json`.

[Likely] This comparison identifies continuous preview rendering as a material source of main-thread pressure under that synthetic slowdown. It supports the preview-budget recommendation above. It is not Lighthouse TBT, an interaction-latency measurement or proof of a particular physical phone's behaviour; CPU emulation and concurrent machine workload limit generalization. The Pause control provides a current way to stop that work.

## Detector findings in context

[Certain] The Impeccable source detector returned 16 findings, retained in `replica/evidence/riso-final-visual-detector.json`. They were reviewed against the rendered pages rather than treated as automatic defects:

- [Certain] Five cramped-padding warnings concern full-bleed sections/ticker wrappers. Their nested content has the intended inset; no clipped body text was reproduced.
- [Certain] Six colour/radius advisories identify intentional print geometry, a video fallback colour and local palette values. The cream ground and marquee flags are consistent with the approved brief; the marquee now has a tested persistent pause control.
- [Likely] Dark-shadow, rounded-accent and flat-heading-scale flags are contextual false positives for the compact editor. The form's hierarchy comes from labels, grouping, weight and yellow state/action emphasis; making an editor heading as large as the marketing headline would hinder the task.

## Limits and disposition

[Certain] No physical-device, touch-gesture, screen-reader, human flash/audio, sustained battery/thermal, repeat-export memory, target-app import or field INP/CWV evaluation was performed. Lighthouse accessibility 100 is automated coverage only. The full cross-engine export suite and live Vercel checks are separate evidence in [verification](../VERIFICATION.md), [the code review](riso-code-review.md) and [the live audit](vercel-live-audit.md).

[Likely] **Disposition: retain the Riso implementation, accept the repaired narrow header, and record the mobile workflow/CPU limitations.** The landing's visual result is stronger than the editor's narrow-screen workflow; forcing both scores above a preset threshold would conceal that difference.

Questions skipped: the owner requested refinement review of the approved direction without another design interview.
