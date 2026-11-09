# Risks

| risk | chance | impact | what we do |
| --- | --- | --- | --- |
| Export fails or is silent in some browser. Only headless Chromium is tested. | medium | high | Falls back MP4 to WebM, shows a message if recording is unsupported. Hand-test Safari, Firefox, mobile before launch. |
| Exported MP4 is rejected by a social app | low | high | It is standard H.264 High + AAC at 30 fps (checked with ffprobe). Still upload a test clip before launch. |
| Tab hidden during recording gives a stuttering video | low | medium | Only on the fallback path (WebM, or no WebCodecs). User is told. |
| mp4-muxer is no longer maintained | medium | low | Vendored and working. Replace with its successor if a browser change breaks it. |
| Copycat claim from the original | low | medium | Clean-room: no code, copy, design, assets or name taken. Recon notes list every source. Launch copy must not use their name as ours. |
| "Pressflick" is already a trademark | unknown | medium | Domains, GitHub handle and a web search were clear on 2026-11-09. No trademark office search yet: run one before spending on the name. |
| Tool used to fake real headlines | medium | medium | Footer notice. Add an acceptable-use line to the terms. Pages carry no real mastheads. |
| Flashing preview harms a photosensitive user | low | high | Starts paused under reduced-motion, Pause button, warning text. |
| Looks different on Windows, macOS, Android (system fonts) | high | low | Accepted. Bundled open fonts are on the roadmap. |
| No income to pay for hosting | low | low | Static files: free tiers cover it. |
