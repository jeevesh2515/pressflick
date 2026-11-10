---
name: Pressflick
description: 'Riso gig poster: inks overprinted on warm paper, one word printed hot in sunflower yellow.'
colors:
  paper: '#f6f1e7'
  navy-ink: '#141b5c'
  riso-blue: '#1d2b8f'
  fluo-pink: '#ff4f9a'
  sunflower: '#ffd23f'
  teal-ink: '#00a37a'
  editor-panel: '#24349e'
  editor-line: '#4256c4'
  editor-input-bg: '#172478'
  editor-input-line: '#7586dc'
  editor-muted: '#c3c6ea'
  pink-wash: '#ffe3ef'
  teal-wash: '#d7f3e9'
  teal-wash-open: '#bfe9da'
typography:
  display:
    fontFamily: '"Archivo", system-ui, sans-serif'
    fontSize: 'clamp(2.9rem, 6.2vw, 5.6rem)'
    fontWeight: 900
    lineHeight: 0.92
    letterSpacing: '-0.03em'
    fontVariation: '"wdth" 125'
  headline:
    fontFamily: '"Archivo", system-ui, sans-serif'
    fontSize: 'clamp(2.4rem, 5.6vw, 4.6rem)'
    fontWeight: 900
    lineHeight: 0.92
    letterSpacing: '-0.03em'
    fontVariation: '"wdth" 125'
  title:
    fontFamily: '"Archivo", system-ui, sans-serif'
    fontSize: 'clamp(1.4rem, 2.4vw, 2rem)'
    fontWeight: 900
    lineHeight: 1
    fontVariation: '"wdth" 125'
  body:
    fontFamily: '"Archivo", system-ui, sans-serif'
    fontSize: '17px'
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: '"Archivo", system-ui, sans-serif'
    fontSize: '12px'
    fontWeight: 800
    letterSpacing: '0.14em'
    fontVariation: '"wdth" 125'
rounded:
  sm: '10px'
  md: '14px'
  lg: '18px'
  xl: '22px'
  pill: '999px'
spacing:
  xs: '8px'
  sm: '12px'
  md: '24px'
  lg: '48px'
  section: 'clamp(88px, 11vw, 150px)'
components:
  button-primary:
    backgroundColor: '{colors.sunflower}'
    textColor: '{colors.navy-ink}'
    rounded: '{rounded.pill}'
    padding: '0 26px'
    height: '52px'
  button-ghost:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.navy-ink}'
    rounded: '{rounded.pill}'
    padding: '0 26px'
    height: '52px'
  button-editor:
    backgroundColor: 'transparent'
    textColor: '{colors.paper}'
    rounded: '{rounded.pill}'
    padding: '9px 18px'
    height: '44px'
  button-editor-primary:
    backgroundColor: '{colors.sunflower}'
    textColor: '{colors.navy-ink}'
    rounded: '{rounded.pill}'
  ratio-segment-selected:
    backgroundColor: '{colors.sunflower}'
    textColor: '{colors.navy-ink}'
    rounded: '{rounded.pill}'
    height: '44px'
  field:
    backgroundColor: '{colors.editor-input-bg}'
    textColor: '{colors.paper}'
    rounded: '{rounded.md}'
    padding: '9px 12px'
    height: '44px'
  card-editor-panel:
    backgroundColor: '{colors.editor-panel}'
    textColor: '{colors.paper}'
    rounded: '{rounded.xl}'
    padding: '20px'
  contact-frame:
    backgroundColor: '{colors.paper}'
    rounded: '{rounded.lg}'
    padding: '10px'
  demo-plate:
    backgroundColor: '{colors.navy-ink}'
    textColor: '{colors.paper}'
    rounded: '{rounded.xl}'
    padding: '12px'
  nav-pill:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.navy-ink}'
    rounded: '{rounded.pill}'
    padding: '5px'
---

# Design System: Pressflick

## Overview

**Creative North Star: "The Riso Gig Poster"**

Pressflick is a risograph gig poster: inks overprinted on paper, one word printed hot. Warm paper and deep riso blue are the two grounds; fluorescent pink, riso blue, sunflower and teal are the inks. Where two inks cross they multiply, and a second plate lands a hair off register. Sunflower yellow is also the held word of the product, so it is the single loudest colour wherever it appears.

The landing page (Persuade) lets each section be printed in one ink, with a slow split-fountain gradient behind the hero and a halftone screen of uneven coverage. The editor and the legal pages (Operate) take the same world as precise detail only: riso-blue ground, a faint dot screen, pill controls, yellow for the one active thing. Content stays plain and legible in the editor; the poster gestures live on the landing.

The contact-sheet frames and ratio thumbnails stay full colour, never duotoned: the yellow held word in real export frames is the product proof (owner decision at finish review).

**Key Characteristics:**
- Two grounds (paper, riso blue), four inks, ink navy for text on light.
- Pill buttons as stickers; 22px / 18px rounded containers.
- Overprint: a hard-edged, zero-blur offset second plate on display heads and plates, multiplied.
- Halftone dot screen (7px pitch) as the only texture.
- Trim furniture: crop marks and plate slugs at section corners.
- Archivo only, expanded (wdth 125) heavy uppercase for display.

## Colors

Warm paper and ink on ink: five hues plus navy, no neutrals beyond paper-tinted tints.

### Primary
- **Sunflower** (`{colors.sunflower}`): the held word. Primary button fill, `mark` highlights, selected segment, active chip, step numerals, focus ring in the editor. Used on one active thing per view.

### Secondary
- **Fluo Pink** (`{colors.fluo-pink}`): the second plate. Overprint shadow on heads, fountain left ink, pink section ground, the "Cutting" live dot.
- **Riso Blue** (`{colors.riso-blue}`): the editor ground, the blue section ground, the closing section, fountain right edge.
- **Teal Ink** (`{colors.teal-ink}`): the paper section's overprint and FAQ toggle on the landing; the editor uses a brighter teal (`{colors.editor-teal}`) only in its fountain strip.

### Neutral
- **Paper** (`{colors.paper}`): landing ground, text on blue, nav pill and sticker fills.
- **Navy Ink** (`{colors.navy-ink}`): text on paper, pink and yellow; button borders; demo plate and ticker ground; footer.
- **Editor Panel / Line / Input** (`{colors.editor-panel}`, `{colors.editor-line}`, `{colors.editor-input-bg}`, `{colors.editor-input-line}`): tonal steps of riso blue for editor surfaces and borders. `{colors.editor-muted}` is secondary text.
- **Washes** (`{colors.pink-wash}`, `{colors.teal-wash}`, `{colors.teal-wash-open}`): hover and open states only.

### Named Rules
**The One Ink Per Plate Rule.** A landing section is printed in one ground (pink, blue, yellow or paper) with its own overprint colour; do not mix two grounds inside a section.
**The Held Word Rule.** Sunflower marks the one thing being held or chosen. If everything is yellow, nothing is held.
**The Multiply Rule.** Overlaps between inks are drawn with `mix-blend-mode: multiply`, never with opacity.

## Typography

**Display / Body / Label Font:** Archivo (variable, wght 100-900, wdth 62-125, self-hosted woff2) with system-ui fallback.

**Character:** one family at two extremes: expanded black uppercase for heads, normal width for reading. Hierarchy comes from width and weight, not a second face.

### Hierarchy
- **Display** (900, clamp(2.9rem, 6.2vw, 5.6rem), 0.92, -0.03em, uppercase, wdth 125): hero h1 only.
- **Headline** (900, clamp(2.4rem, 5.6vw, 4.6rem), 0.92): section h2; the closing h2 scales to 6rem.
- **Title** (900, clamp(1.4rem, 2.4vw, 2rem), 1, uppercase): step titles. Editor titles are 18-20px at the same weight and width.
- **Body** (400-650, 17px, 1.55): copy at 30-62ch; hero intro 550 weight.
- **Label** (800, 11-14px, 0.1-0.14em, uppercase, wdth 125): plate bars, slugs, figure captions and film-strip status. Furniture inside the object, not an introduction to a heading.

### Named Rules
**The Off-Register Rule.** Display heads get the `.overprint` second plate (`text-shadow: .045em .035em 0`, zero blur) in the section's overprint colour. No blurred text shadows.
**The Expanded Heads Rule.** Uppercase only goes with wdth 125 and weight 800-900; body copy is never uppercase.

## Layout

Landing: content width `min(1240px, 100% - 48px)` (32px gutters under 640px); sections use `clamp(88px, 11vw, 150px)` vertical padding. Hero is a 1.05fr / 1fr grid collapsing to one column at 900px. Steps are a four-column gig-bill row (numeral, title, copy, art). The contact sheet is a horizontal scroll-snap strip with alternating tilt and 18px vertical offset. Formats sit as three ratio thumbnails bottom-aligned beside intro copy.

Editor: two-column grid (form 380-460px, preview up to 560px, sticky), 24px gutters and 12px control gaps; at 1280px the help column moves to a 300px right rail; under 760px it is one column with the preview first. Touch targets are 44px minimum. Rhythm is 8 / 12 / 24 / 48px.

## Elevation & Depth

Depth is printed, not lit. Cards and plates carry a soft lifted shadow with a large negative spread (`0 24px 40px -26px rgba(20,27,92,.8)`; editor `0 18px 40px -20px rgba(6,10,60,.7)`); buttons use `0 14px 28px -14px rgba(20,27,92,.55)` and rise 3px on hover. Overprint depth comes from a second multiplied plate offset 9-10px behind a plate or ratio thumb (`::before` in pink, `multiply`) and from the 0.045em text offset on heads.

### Named Rules
**The Second Plate Rule.** Depth on a key object is a multiplied pink copy of its shape, offset 9-10px (5px under 640px). Shadows stay soft and low; the offset plate is the only hard-edged depth.

## Shapes

Round and sticker-like. Pills (999px) for every button, nav, chip, segment and caption tag. Containers: 22px (plates, editor panels, preview), 18px (contact frames), 14px (fields, canvas, video), 16px (peek frames and ratio thumbs), 10px (images inside frames). Borders are 2px navy on landing buttons and FAQ rows, 3px navy on ratio images, 1px editor-line in the editor. Focus rings are 3px (landing, navy; yellow on blue/closing/ticker grounds) and 2px yellow in the editor. Trim: 22px crop-mark corners (1.5px) and plate slugs; editor registration corners 18px, 1px.

## Components

### Buttons
- **Shape:** pill (999px), 52px tall (44px small), 26px side padding, 2px navy border.
- **Primary:** sunflower fill, navy text, weight 800, wdth 112.
- **Ghost:** paper fill, no lift shadow.
- **Hover / Active:** rises 3px and shadow deepens over .4s `cubic-bezier(.16,1,.3,1)`; icon nudges 3px right; active presses 1px. Reduced motion collapses transitions.
- **Editor buttons:** transparent with 1px editor-input-line, 44px; primary is sunflower and rises 2px; hover on secondary brightens the border to paper.

### Segmented ratio control
Joined pill: radio labels overlap by 1px border, first label rounded left, last rounded right; the checked one fills sunflower with navy text at weight 800. Hidden native radio spans the label, keyboard focus draws a 2px yellow ring.

### Chips and word picks
Editor example chips and word toggles are 36px pills; a pressed word fills sunflower. Landing stickers and figure tags are paper pills with a coloured dot and a multiplied 3px offset plate.

### Cards / Containers
- **Demo plate:** navy, 22px, tilted -1.5deg, pink multiplied plate offset 10px 9px, yellow uppercase plate bar; straightens on hover.
- **Contact frame:** paper, 18px, 10px padding, tilt +/-1.5deg, rises on hover.
- **Editor panel:** `{colors.editor-panel}`, 22px, 20px padding, 1px editor-line, soft lifted shadow.

### Inputs / Fields
14px radius, editor-input-bg fill, 1px editor-input-line, 44px; select has a yellow chevron; range uses yellow accent; focus is the global 2px yellow ring with 3px offset.

### Navigation
Landing: a paper pill rail with 44px pill links (pink-wash hover) and a small sticker button; links hide under 640px, button stays. Footer is navy with a paper wordmark.

### Halftone screen
`radial-gradient` dots at 7px pitch, multiplied, masked by a diagonal gradient so coverage is uneven. Section screens use the section's own dot colour; the hero and close have their own.

### Plate and trim furniture
Crop marks at the top-left and bottom-right of each section (inset 18px) and a bottom-right slug "Plate 0N" naming the ink. Hidden under 640px.

### Fountain and ticker
Hero fountain: pink, yellow and blue ink bars multiplied over paper, the pink bar drifting 22s ease-in-out alternate. Closing section has a pink gradient rising from the bottom with a dotted screen. Ticker is a navy band with yellow borders and a 38s linear loop that pauses on hover; the held word is a yellow tag.

## Do's and Don'ts

### Do:
- **Do** print each landing section in one ground with its own overprint colour (pink, blue, yellow, paper).
- **Do** use pills for all interactive controls and keep 44px minimum targets.
- **Do** use sunflower for the single active or held thing and navy ink on it.
- **Do** build overlaps with `multiply` and offset hard plates by 9-10px.
- **Do** keep real export frames full colour.
- **Do** honour `prefers-reduced-motion`: fountain and ticker stop, transitions collapse.

### Don't:
- **Don't** blur text shadows or add glow; offsets are zero-blur.
- **Don't** return to the dark tool page with a glow or the cream editorial landing.
- **Don't** introduce a second typeface or ship uppercase body copy.
- **Don't** put yellow text on paper (contrast); yellow is a fill with navy text, or text on navy and blue.
- **Don't** duotone the contact-sheet frames.

## Release accessibility refinements — 10 November 2026

The landing main landmark contains the hero and all five primary sections; the header and footer remain outside it. The mobile header uses a compact wordmark and CTA to fit 320px. A visible Pause page motion / Resume page motion button controls the fountain and ticker without a mouse; reduced-motion disables both automatically. The editor's decorative top gradient is static. Sample playback remains user initiated with native controls available after activation. Evidence: test/e2e/landing.spec.js and docs/reviews/riso-code-review.md. Physical screen-reader and photosensitivity evaluation remain open.
