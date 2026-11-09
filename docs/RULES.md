# Rules

For anyone, human or agent, working on this repo.

## Clean room

1. Never copy the original's code, copy, design, example videos, sounds, name or logo.
2. Never read its JavaScript or log its network calls. Public pages only.
3. Recon notes and reference screenshots stay out of the repo (`replica/` is git-ignored).

## Product

4. No ads. No tracking. No account. No cookie.
5. The phrase never leaves the browser.
6. No real newspaper names or mastheads in generated pages.

## Code

7. No backend and no dependencies unless a feature cannot exist without one. Say why in `docs/MEMORY.md`. A dependency is vendored as a file in `src/vendor/` with its licence, never loaded from a CDN.
8. No build step. Plain ES modules.
9. Logic that can be pure goes in `src/core.js` with a test. `npm test` must pass before a commit.
10. Fonts: system stacks or open-licence files only. Sounds: synthesized or own recordings only.
11. Any shortcut gets a `// shortcut: <limit>, <when to upgrade>` comment.

## Accessibility

12. Every control has a label and a visible focus ring.
13. Never autoplay the flashing preview under `prefers-reduced-motion`.

## Docs

14. A change to behaviour updates the matching file in `docs/`.
