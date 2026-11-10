# Asset provenance

All raster illustrations/icons/social art were authored as original geometry in `scripts/brand-assets.mjs` and rasterized with local Chromium. No stock images, copied brand marks or AI image-generation service was used. Raster metadata records this origin; regenerating assets may require restoring that metadata.

`pressflick-demo.mp4` is a real Pressflick export with generated filler, system fonts and locally synthesized sound; no sample recordings. `pressflick-demo.jpg`, `cut-left.jpg`, `cut-right.jpg` and the six `cut-sheet-0*.webp` contact-sheet frames are extracted from it with ffmpeg and cwebp (times 0.45, 1.15, 1.85, 2.55, 3.25, 3.95 s). See `docs/EXPORT-QUALITY.md` in the source repository for measurement limits. The generated pages do not reproduce real publications.

Fonts in `fonts/` were downloaded once during development, then self-hosted: Archivo (variable width and weight), under the SIL Open Font License. Exact download URLs, licences and hashes are in fonts/SOURCES.json. No Google Fonts requests occur in the running site. Retain the OFL file in distribution.

`ratio-9x16.webp`, `ratio-1x1.webp` and `ratio-16x9.webp` are real frames from the Pressflick renderer: the editor's default phrase, preview paused under reduced motion, canvas read with `toDataURL` per aspect ratio on 10 November 2026, resized to 720px on the long side with sips and encoded with cwebp -q 80.
