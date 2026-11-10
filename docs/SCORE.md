# Evidence-based readiness score

Updated 10 November 2026 for the Riso release on `release/riso-production-readiness` and its full-audit production baseline `dpl_9VH3CW5NJAApZTPvi22ucCkURepo`. The later plate-caption removal and current deployment are recorded in [verification](VERIFICATION.md); this minor copy/style deletion does not rescore the product. **The owner's ≥8.5 in every area gate remains unmet.** Deployment and automated tests passing do not establish human/device quality.

The owner later reported completion of the human checklist. The new starter and typography release has separate verification and a qualitative design review. The numerical ratings below describe the earlier audit. [Human checks](HUMAN-CHECKS.md) · [Release verification](VERIFICATION.md)

All ratings below are **provisional engineering judgments [Likely]**, not calibrated user-satisfaction measurements. Rule: 8.5 requires observed function, a relevant independent check and no open major finding in the stated scope. Missing material human/device evidence caps the affected area at 8.0. The design review uses its own stated rubric. No average hides a failing area.

| Area | Score /10 | ≥8.5? | Evidence | Deduction / not checked |
| --- | ---: | --- | --- | --- |
| Core effect | 8.5 | Pass, tested scope | Historical 150-frame highlight centre within 0.5px; renderer unchanged; fresh ratio/download checks; [export evidence](EXPORT-QUALITY.md) | All seeds/fonts/OSs and optical glyph centre not covered; no human motion rating |
| Export | 8.0 | **Below bar** | Fresh six sound-enabled live downloads, full playback/decode; WebKit truncation fixed with failing-before/passing-after regression; [live audit](reviews/vercel-live-audit.md), `test/e2e/export.spec.js` | Physical Safari/phone, human sound review and app imports missing; real-time variation; Firefox MP4 audio is Opus |
| UX / editor design | 8.3 | **Below bar** | Fresh independent five-width/three-ratio review; all actions reachable, repaired narrow header; [visual review](reviews/riso-visual-performance-review.md) | Small tablet preview and long phone settings/preview scroll; no creator usability study. Separate landing visual judgment is 8.8 |
| Accessibility | 8.0 | **Below bar** | 81 clean local axe scans plus six clean live scans; keyboard motion/play, landmarks and reduced-motion regressions; [verification](VERIFICATION.md) | No VoiceOver/NVDA or human photosensitivity review; automated accessibility is not certification |
| Code / tests | 8.5 | Pass, reviewed scope | 9 Node, 75 E2E, zero final retries/skips/flaky results; independent repaired-findings review; [code review](reviews/riso-code-review.md) | Exhaustive state-space/lifecycle testing not performed; initial failures retained |
| Security / privacy | 8.5 | Pass, reviewed scope | Fragment/request/referrer checks; restrictive live headers; 48/48 servable hashes; private paths unavailable; [live audit](reviews/vercel-live-audit.md), [security review](reviews/security-review.md) | No exhaustive penetration audit; host operational request information remains disclosed in privacy page |
| Performance | 8.0 | **Below bar** | Fresh clean Lighthouse mobile 96/97, desktop 100/100; [performance review](reviews/riso-visual-performance-review.md) | Active full-resolution preview costs CPU under slowdown; no field INP, physical phone/battery/memory stress. Historical desktop RSS is not phone evidence |
| Documentation | 8.5 | Pass, recorded scope | Modern README, current Vercel runbook, reproducible tests, honest failure history and package limits; [verification](VERIFICATION.md) | Raw ignored evidence is local; no legal-clearance claim or universal-readiness certification |
| Launch readiness | 8.0 | **Below bar** | Existing public Vercel alias verified; allowlisted distributable, current metadata/contact, preserved private-source boundary; [deploy runbook](DEPLOY.md) | Human/device/import sign-off remains open. No custom domain is required; repository visibility is still owner controlled |

The earlier builder aggregate and retired-theme Lighthouse/design numbers are historical. This revision does not raise a score merely because production is reachable. The current technical audit finds no open reproduced S1/S2 in its tested scope; the strict all-area gate still fails on export, UX, accessibility, performance and launch evidence.

## Independent evidence

The original four engineering-role reports remain in `docs/reviews/`, including security, test and performance findings and their disposition. Fresh Riso work adds [code review](reviews/riso-code-review.md), [visual/performance review](reviews/riso-visual-performance-review.md) and [live audit](reviews/vercel-live-audit.md). The live auditor independently reproduced and verified the WebKit sound-timeline correction. These are scoped reviews, not universal quality certification.

## Parity is separate

The historical private feature-matrix command returned 92.7/100 and 13/13 declared must-haves on 9 November 2026 (recorded in the prior score verification and private evidence). It has not been rerun against the original during this verification. It is not proof of output quality, legal similarity clearance or independent validation of the original. No original-product JavaScript or network was read in this review.
