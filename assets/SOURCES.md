# Asset provenance

Pressflick raster illustrations, icons and social art were authored as original geometry in `scripts/brand-assets.mjs` and rasterized with local Chromium. Raster metadata records this origin; regenerating assets may require restoring that metadata.

`github-mark.svg` is the [GitHub mark from Octicons v19.21.2](https://github.com/primer/octicons/blob/v19.21.2/icons/mark-github-24.svg), distributed with `github-mark.LICENSE` under MIT.

`pressflick-demo.mp4` is a real Pressflick export with generated filler, system fonts and locally synthesized sound; no sample recordings. `pressflick-demo.jpg`, `cut-left.jpg`, `cut-right.jpg` and the six `cut-sheet-0*.webp` contact-sheet frames are extracted from it with ffmpeg and cwebp (times 0.45, 1.15, 1.85, 2.55, 3.25, 3.95 s). See `docs/EXPORT-QUALITY.md` in the source repository for measurement limits. The generated pages do not reproduce real publications.

Archivo and Montagu Slab are self-hosted variable fonts under the SIL Open Font License. `fonts/SOURCES.json` records the original download URLs and hashes. The running site loads the local files. Include both OFL licences in distributions.

`ratio-9x16.webp`, `ratio-1x1.webp` and `ratio-16x9.webp` are real frames from the Pressflick renderer: the editor's default phrase, preview paused under reduced motion, canvas read with `toDataURL` per aspect ratio on 10 November 2026, resized to 720px on the long side with sips and encoded with cwebp -q 80.

`starter-*.mp4` are original three-second Pressflick exports made through the Download UI. `src/presets.js` records their exact phrases, seeds and settings. The matching WebP posters come from each exported clip at 0.45 seconds. Their source sidecars record the extraction. Full decode, frame count and audio-energy results are recorded in `docs/VERIFICATION.md`.
