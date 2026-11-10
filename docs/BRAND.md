# Brand assets

Updated 10 November 2026. The approved landing and editor direction is **Riso gig poster**: paper `#f6f1e7`, navy ink `#141b5c`, riso blue `#1d2b8f`, fluorescent pink `#ff4f9a` and sunflower `#ffd23f`. Archivo and Montagu Slab are self-hosted under the SIL OFL. The geometric P icon and social artwork remain original yellow-on-black Pressflick vectors; they have not been regenerated as pink artwork. Actual page tokens and layout rules are recorded in `docs/DESIGN.md` and the stylesheets. Earlier pistachio and Film Stock page palettes are historical.

- `favicon.svg`, `favicon.ico` (16/32/48 px) and PNG favicon set.
- Opaque `assets/icon-1024.png`, 192/512 px manifest icons and 180 px Apple touch icon.
- `assets/social.png` and editable `assets/social.svg`, 1200 × 630.
- Real sample video, stills and captions: `assets/pressflick-demo.*`, `cut-left.jpg`, `cut-right.jpg`.
- Origins/licences: `assets/SOURCES.md`, font OFL files and `assets/fonts/SOURCES.json`. The original eleven-raster provenance scan is historical. New Riso contact-sheet and ratio frames have source-side origin records; see assets/SOURCES.md. Development raster JSON sidecars are omitted from hosting, while font provenance and licences remain included. No runtime remote fonts or stock artwork.

Geometry/raster generation: `node scripts/brand-assets.mjs` (development only). Regeneration resets raster origin metadata; restore it as recorded in assets/SOURCES.md. Dimensions/opacity and the original assets were checked in the earlier export review; the fresh Riso review covers rendered pages, not trademark similarity clearance. Open Graph source URLs remain marked `pressflick.example`; production packaging uses https://pressflick.vercel.app to update output metadata without changing source. The live metadata check is in docs/reviews/vercel-live-audit.md. Social-crawler rendering has not been independently checked.

Read-only public trademark searches ran on 9 November 2026: [USPTO](https://tmsearch.uspto.gov/), [TMview](https://www.tmdn.org/tmview/#/tmview/results?page=1&pageSize=30&criteria=C&basicSearch=Pressflick), [WIPO](https://branddb.wipo.int/). Wordmark/contains Pressflick returned no results in all three. Evidence: local `replica/evidence/trademark-screening-2026-11-09.md` and browser transcript. This limited screening is not legal clearance; phonetic/visual variants, common-law rights and professional jurisdiction/class analysis were not checked. No current domain or handle availability claim is made.
