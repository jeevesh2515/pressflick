# Design

Our own look. Nothing is taken from the original: different layout (editor and preview side by side, not a hero and a long page), different palette, different type, own wordmark.

## Tokens (`style.css`, `:root`)

| token | dark | light | use |
| --- | --- | --- | --- |
| `--bg` | #101114 | #f6f5f1 | page, inputs |
| `--panel` | #191b20 | #ffffff | form card |
| `--line` | #2c2f37 | #d9d6cd | borders |
| `--text` | #eceae4 | #17181c | text |
| `--muted` | #9a9ca6 | #5d5f68 | labels, help |
| `--accent` | #ff5a36 | #d63a17 | primary button, focus ring, sliders |

Theme follows the OS setting. Type: `system-ui` 16px for UI, Georgia for the wordmark. Radius 8px for controls, 12px for the card. Controls are at least 44px tall.

## Components

| component | states |
| --- | --- |
| text input | empty, filled, focus |
| word chip | idle, selected (highlighter yellow), focus |
| radio group | checked |
| select | - |
| range slider with value readout | - |
| colour input | - |
| button | default, primary, disabled, focus |
| preview canvas | playing, paused, empty ("Type a phrase…"), recording |
| status line (`role=status`) | idle, recording, saved, error |

## Accessibility

- Every control has a label. Focus ring on everything.
- The preview flashes up to 16 times a second. It starts paused under `prefers-reduced-motion`, there is always a Pause button, and a note says so.
- Status changes are announced through a live region.
- Not checked yet: contrast ratios with a tool, a screen reader pass.

## Output video design

Paper: 5 newsprint tones, plus 4 dark and tinted pages in "Mixed". Type: 10 system font stacks, random weight and italic. Two layouts: running body text, and headline over small body text. Vignette on every page.
