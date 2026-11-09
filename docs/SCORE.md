# Score

Dated 2026-11-09. Self-scored by the agent that built it. No independent reviewer has scored this.

## Feature parity (replica-diff `parity.py`)

**92.7 / 100** (was 83.6 before the landing sections and legal pages). Must-haves: 13 of 13 done. Editor, effect, export, audio, settings: 100 each.

The missing points are SEO articles and three rows we skip on purpose (ads, their usage counter, their brand assets). The tool counts "skip" rows as misses, so the real ceiling is lower than 100.

## Quality, out of 10

| area | score | evidence | what holds it back |
| --- | --- | --- | --- |
| Core effect | 8.5 | Word centre drifts under 1 px over 40 cuts; width within 10 px | Two layouts only. No paper grain or mastheads |
| Export | 8.5 | Frame-exact MP4: ffprobe shows H.264 High 1080x1920, exactly 150 frames at 30 fps, AAC 48 kHz; ffmpeg decodes it with no errors; audio peaks at -9.5 dB; 5 s clip renders in 2.7 s. Real-time fallback and WebM still work | Chromium only. Safari, Firefox, mobile untested. Nobody has watched or listened to a file. Files are large |
| UX vs original | 9.0 | Live preview, no ad, 2 clicks, 80 chars, example phrases | - |
| Accessibility | 8.0 | Labels, focus ring, live region, reduced-motion handling, contrast 0 AA failures in both themes | No screen reader pass |
| Code | 8.5 | About 400 lines of our own, one vendored MIT file, 6 unit tests pass | No end-to-end test in the repo |
| Security and privacy | 9.0 | No server, no cookies, CSP, no `innerHTML` | Response headers wait for deploy. No independent review |
| Docs | 8.5 | PRD, architecture, design, phases, roadmap, risk, security, rules, memory | - |
| Launch readiness | 6.0 | Name picked and screened, legal pages, landing copy, deploy steps written | No trademark search, no repo, not deployed, no social image |

**Build quality (first seven rows): 8.6.** Over the 8.5 bar, by a little, and on my own scoring.

## What would raise it further

1. Hand-test export in Safari, Firefox and on a phone, and watch the files.
2. A Playwright test for the download flow.
3. An independent review. Every number here is the builder marking its own work.
