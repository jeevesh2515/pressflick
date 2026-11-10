# AGENTS.md — Pressflick

Static, build-free browser app that generates 1080p text match-cut videos. No backend, no framework, no bundler, no lint/typecheck/format config.

## Run

```bash
npm start                       # python3 http.server on http://127.0.0.1:5173 (serves repo root)
# Python 3.11+; port busy: python3 -m http.server 5176 --bind 127.0.0.1 --protocol HTTP/1.1
```

- Landing is `/` (`index.html`); editor is `/editor.html`. They are separate pages; share URLs point at the editor path.
- The editor uses native ES modules in `src/`. `landing.js` runs landing interactions. `src/vendor/mp4-muxer.mjs` is the sole runtime dependency (MIT). Shared site typography lives in `type.css`.
- CSP is a `<meta>` tag in `index.html`/`editor.html` (`default-src 'self'`). No inline scripts, no CDN, no eval.
- Asset generation is dev-only: `node scripts/brand-assets.mjs` (icons/OG images, needs Playwright Chromium).

## Test

```bash
npm test                                    # node --test test/*.test.js (core + packaging)
node --test test/core.test.js               # single file
node --test --test-name-pattern="word" test/core.test.js
npx playwright install chromium firefox webkit   # once
npm run test:e2e                            # same suite in 3 engines; counts in docs/VERIFICATION.md
```

- Playwright starts its **own** server on `127.0.0.1:5174` and never reuses an existing one (`reuseExistingServer: false`). Port 5174 must be free; don't point it at your dev server.
- `test/e2e/fixtures.js` fails any test that logs a console/page error or gets a 5xx, and requires **zero** axe violations. Fix the defect; never filter errors, skip cases, or weaken CSP.
- E2E downloads are real video files: fixtures verify `ftyp`/Matroska signatures and decode them in-page. WebM/MediaRecorder fallback runs in real time and needs a visible tab, so expect slow tests.
- New behaviour: pure logic goes in `src/core.js` with a `test/*.test.js` case (Node-compatible, no DOM).

## Hard product constraints (from docs/RULES.md, enforced by review)

- No ads, tracking, analytics, cookies, accounts, persistence APIs, or telemetry.
- The phrase never leaves the browser. Share state goes **only** in the URL fragment (`#`); query-string state is deliberately ignored — never reintroduce it.
- No backend; no dependency unless a feature is impossible without one, and then vendor it in `src/vendor/` with its licence and a `docs/MEMORY.md` entry.
- No build step. Deletion beats abstraction; keep the existing file split (`core` pure logic, `render` canvas, `audio` synthesized, `export` encoding, `app` UI/state).
- Clean room: `replica/` is git-ignored private recon. Never read or copy the original product's code, copy, design, sounds, name or logo; keep recon notes/screenshots out of the repo.
- Shortcuts carry `// shortcut: <limit>, <when to upgrade>`.
- Behaviour changes update the matching `docs/*.md`; decisions go in `docs/MEMORY.md`.

## Packaging and release

- Never publish or serve the repo root. `node scripts/prepare-site.mjs [outdir] [https origin]` copies an explicit allowlist (no compilation) to an **empty** dir, rejects symlinks, refuses non-HTTPS/auth/path/query/hash origins, and substitutes the marked OG placeholder (`https://pressflick.example`) in output HTML only.
- **A new public file must be added to the `entries` list in `scripts/prepare-site.mjs`**, and `test/package.test.js` asserts the bundle shape. Default output `dist/` is git-ignored.
- `release/` holds generated hosting bundles; `.impeccable/`, `test-results/`, `playwright-report/`, `dist/` are git-ignored.
- Production is the existing Vercel project, using direct uploads of this public package. The owner authorized updates for this release. A new host/domain or repository-publication decision requires explicit owner approval; see `docs/DEPLOY.md`.

## Non-obvious internals

- MP4 export uses WebCodecs + in-memory muxing (frame-exact, faster than real time) and locks controls before the first `await`; MediaRecorder is the fallback/WebM path (real time, not frame exact, container may differ). Preserve both paths and the capability probe.
- Preview is derived from elapsed time + seed, not pre-rendered. Focal-word position is solved by constant-width font sizing (height still varies by typeface).
- If output/timing claims are involved, read `docs/EXPORT-QUALITY.md` and `docs/VERIFICATION.md` first — known limits (AAC padding, real-time duration variance, memory) are documented there; don't claim more than the evidence.

## Where things are

`docs/ARCHITECTURE.md` (file responsibilities), `docs/VERIFICATION.md` (measured results + unverified human/device/production checks), `docs/DESIGN.md` (tokens/theme), `docs/DEPLOY.md` (hosting/DNS), `docs/reviews/` (independent reviews), `PRODUCT.md` (scope).
