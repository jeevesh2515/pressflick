# Architecture

Static site. No backend, no database, no build step. One vendored dependency: an MP4 muxer. That is the whole stack, and it is why hosting is free and there is nothing to breach.

```
index.html      the one screen
style.css       tokens and layout
src/core.js     pure logic: seeded random, word split, MIME choice, filler text   (unit tested)
src/render.js   drawCut(): draws one cut onto a canvas
src/audio.js    click(): one synthesized sound
src/export.js   renderMp4(): frame-exact MP4 with WebCodecs
src/vendor/     mp4-muxer 5.2.2 (MIT), one file, copied in
src/app.js      form state, preview loop, real-time fallback recording, share link
test/           node --test
```

## How a video is made

1. `app.js` reads the form into one options object on every input event.
2. A `requestAnimationFrame` loop works out the current cut number from the clock: `floor(t * cutsPerSecond)`.
3. When the cut number changes, `drawCut` paints that cut. The random generator is seeded with `seed * 7919 + cut`, so a cut always looks the same and nothing needs caching.
4. Download MP4 draws every frame in order on a second canvas, encodes each with `VideoEncoder` (H.264 High, 30 fps, a key frame at every cut), renders the sounds with `OfflineAudioContext`, encodes them with `AudioEncoder` (AAC, Opus if AAC is missing) and muxes the lot into an MP4 in memory. It does not use the clock, so it runs faster than real time and a hidden tab cannot break it. Measured in headless Chromium: a 5 s 1080x1920 clip in 2.7 s.
5. WebM, and MP4 in browsers without WebCodecs, fall back to recording the preview canvas in real time with `MediaRecorder`.

## The lock

The font size is solved per cut so the focal word measures the same width in every typeface. The word is drawn centred on the canvas centre and the page rotates about that centre. Measured drift over 40 cuts: under 1 px in position, about 10 px in width.

## The blur

The page is drawn once to an offscreen canvas. It is painted blurred, then painted again sharp through a radial mask around the word.

## Known limits

- The fallback path is real time and stalls if the tab is hidden.
- Files are large for their length, because every cut is a key frame: roughly 1 to 2 MB per second at 1080p.
- The whole MP4 is built in memory. Fine at the 10 s cap.
- mp4-muxer is marked superseded by its author (by Mediabunny). It works; swap it when it stops.
- Browsers without canvas `filter` get no blur.
- Fonts are system fonts, so pages look a little different on each OS.

## Data

None stored. State lives in the form and, if the user copies a link, in the URL query string.
