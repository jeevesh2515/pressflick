# Memory: decisions and why

| date | decision | why |
| --- | --- | --- |
| 2026-11-09 | Scope: one screen, one flow, the whole product | It is one screen and one flow |
| 2026-11-09 | Static site, no backend | The original itself renders in the browser. Nothing needs storing |
| 2026-11-09 | No framework, no build | One screen. About 400 lines of our own JS |
| 2026-11-09 | Export first shipped with `MediaRecorder` | Zero dependencies. Cost: real-time, tab must stay visible |
| 2026-11-09 | MP4 export moved to WebCodecs + vendored mp4-muxer 5.2.2 | Frame-exact, faster than real time, proper AAC audio. This is the one dependency: writing an MP4 muxer by hand is not sensible. Vendored as one file, so still no build step. `MediaRecorder` stays as the fallback and for WebM |
| 2026-11-09 | A key frame at every cut | Each cut is a brand new picture, so a delta frame saves nothing and smears |
| 2026-11-09 | Cuts are drawn on demand from a seed, not pre-rendered | 60 frames at 1080x1920 would hold about 500 MB |
| 2026-11-09 | Lock the word by solving font size for constant width | Keeps position exact across fonts. Height still varies by typeface |
| 2026-11-09 | System fonts, synthesized sounds, generated filler text | Nothing to license, nothing copied |
| 2026-11-09 | Phrase cap 80 chars (original: 23) | Longer phrases just run off the page edge, which is the look anyway |
| 2026-11-09 | Preview is silent; "Hear it" plays one sound | Browsers block audio before a click, and a looping click track is annoying |
| 2026-11-09 | Name is Pressflick (replaced an earlier placeholder) | Owner's pick. pressflick.com, pressflick.app and the GitHub handle were unregistered that day; nothing else uses the name in a web search. Trademark search not run |
| 2026-11-09 | No AI model or API key is used | The effect is typography and random layout. The original says the same about itself |

## Open questions for the owner

- Register pressflick.com / pressflick.app and the GitHub handle.
- Which host (GitHub Pages, Cloudflare Pages, Vercel, Netlify all work).
- Whether to add a cookieless visit counter.
