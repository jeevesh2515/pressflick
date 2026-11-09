# Phases

Dated 2026-11-09. One session.

| # | phase | skill | result | status |
| --- | --- | --- | --- | --- |
| 1 | Recon | replica-recon | Recon notes and a feature matrix, kept private. Public pages only. | done |
| 2 | Architecture | replica-architect | Static site, no backend. `docs/ARCHITECTURE.md` | done |
| 3 | Design | replica-design | Own tokens and components. `docs/DESIGN.md`, design tokens (private notes) | done. Contrast: 0 AA failures, both themes |
| 4 | Build | replica-build | Editor, renderer, audio, export | done |
| 5 | Backend | replica-backend | Not needed: nothing to store, nobody to log in | skipped on purpose |
| 6 | Test | replica-test | 5 unit tests pass. Headless Chromium run by hand: load, example click, MP4 and WebM export, ratio switch, empty state, mobile layout, legal pages, no console errors | Chromium only. No Playwright suite |
| 7 | Parity | replica-diff | 92.7 / 100, must-haves 13 of 13. `docs/SCORE.md` | done |
| 8 | User research | replica-entrepreneur | Notes kept private. Sample size 0: no public reviews of the original exist yet | done, thin |
| 9 | Brand | replica-brand | Pressflick. Notes kept private. Sweep clean in shipped files | done. Trademark search not run |
| 10 | Launch | replica-launch | Landing sections, FAQ, privacy, terms, favicon. launch notes kept private | done. No social image |
| 11 | Deploy | replica-deploy | Preflight run, notes kept private | not deployed: 3 blockers, and it needs the owner's accounts |
