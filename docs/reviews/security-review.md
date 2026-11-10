# Independent security review

Date: 9 November 2026. Scope: Pressflick's current local working tree, including edits made during this review. Reviewer used the requested security-auditor instructions and `docs/RULES.md`; did not read `docs/SCORE.md` or previous review scores. No original application's JavaScript or network traffic was inspected. Only this report was changed by this reviewer.

[Certain] A static client still has a privacy boundary: a phrase in a URL query reaches the hosting server before application code runs. That defect existed at review start, was reported to the implementer, and is now independently verified fixed with fragment-based sharing.

## Verdict and severity

[Likely] **PASS for the reviewed local application's security scope**, with production hosting and final deployment contents still unverified. No numerical score or production clearance is inferred from local testing.

| Open severity | Mapping | Count |
| --- | --- | ---: |
| Critical | S1: remotely exploitable compromise or severe disclosure | 0 |
| Major | S2: meaningful disclosure or security boundary failure | 0 |
| Minor | S3: limited exploitable impact | 0 |
| Info | S4: operational verification or defense in depth | 2 |

## Trust boundaries and STRIDE

| Boundary | Threat considered | Evidence and result |
| --- | --- | --- |
| Typed text and shared URL fragment → form and drawing | Tampering, XSS, resource exhaustion | `src/app.js:8`, `src/app.js:15`, `src/app.js:27`: allowlisted settings, phrase truncated to 80 code units, integer focus; native range/select controls bound settings. Text is assigned through `textContent` at `src/app.js:42` and canvas drawing at `src/render.js:59`. Fresh-page malformed-state and markup probes passed. |
| Browser → hosting server | Information disclosure | `src/app.js:136`: generated links use `#`, not `?`. Chromium request capture with a synthetic phrase found no phrase in request URLs or referrers. |
| Browser → clipboard/download | Information disclosure and tampering | `src/app.js:63`, `src/app.js:65`, `src/app.js:148`: explicit user actions, local Blob download, filename stripped to Unicode letters/numbers, object URL later revoked. Clipboard recipients can read the phrase; `privacy.html:19` discloses this. Clipboard managers, browser sync and recipient messaging services remain outside app control. |
| Same-origin static modules → browser | Spoofing, tampering, elevation | CSP in `index.html:19` restricts resource loading to local sources; no dynamic evaluation, remote import, API call, tracking or storage implementation found in application/vendor source. Host integrity and TLS remain deployment responsibilities. |
| Vendored muxer and test toolchain → distributed code | Supply-chain tampering | Runtime imports one local MIT muxer at `src/export.js:4`; license retained in `src/vendor/mp4-muxer.LICENSE`. Playwright/axe are development dependencies, not runtime imports. Packaging script and a fresh temporary artifact were independently verified; the existing prepared artifact was stale (see S4 observation). |
| Accounts/tenants/backend | Authentication, authorization, repudiation | Not applicable to this implementation: no account, session, backend, database or privileged server-side operation found. No LLM feature exists; OWASP LLM categories are not applicable. |

## Open observations

### [INFO / S4] Production response-header enforcement remains unverified

- **Evidence:** `_headers:2`–`_headers:5` declare CSP including `frame-ancestors 'none'`, `nosniff`, `no-referrer` and HSTS. `index.html:8`, `privacy.html:7`, `terms.html:7` provide an independent no-referrer meta fallback. HTML meta CSP cannot establish the response-only `frame-ancestors` control or HSTS.
- **Status:** Code-traced configuration; no production host was accessed. A static file named `_headers` requires a hosting platform that interprets it.
- **Impact:** An unsupported host would silently omit framing, MIME-sniffing and transport policies. No consequential clickjacking action or injection exploit was demonstrated in this account-free app.
- **Minimal recommendation:** On the chosen HTTPS host, verify response headers on `/`, both legal pages and JavaScript assets. Treat missing response controls as a hosting configuration task; retain the meta fallback.

### [INFO / S4] Packaging controls verified; the prepared artifact needs regeneration

- **Resolved controls:** `package.json:7` now binds the development server to `127.0.0.1`. `scripts/prepare-site.mjs:6` refuses nonempty output; line 7 copies an explicit top-level public allowlist; lines 8–15 reject source symlinks recursively before copying. Runtime files are copied without compilation. This reviewer did not start the development server or access the unrelated service using port 5173.
- **Independent verification:** Running the packaging script into a fresh temporary directory produced 27 files. A recursive `lstat`/SHA-256 inventory found no symlinks or `replica`, `.gstack`, `docs`, `test`, `tests`, `.git`, or `node_modules` path segments. Synthetic negative fixtures independently confirmed rejection of nonempty output and an allowlisted source-directory symlink. Temporary fixtures were removed; no checkout files or deployed service were changed.
- **Remaining evidence:** The existing `dist/` had 25 files and no prohibited paths or symlinks, but five files did not match current source: `index.html`, `privacy.html`, `src/app.js`, `src/export.js`, and `style.css`. Its inventory differed from the freshly generated artifact. Thus the packaging mechanism is verified while the prepared artifact is stale; neither artifact was published.
- **Impact:** Uploading the stale artifact could omit final privacy, export, contact or asset updates even though the source tree is corrected.
- **Minimal recommendation:** Generate a fresh artifact from the frozen source into a new empty directory, confirm its hashes match the source and its inventory contains only intended public files, then retain the existing separate publication approval gate. This is a freshness check, not production clearance.

## Resolved during this review

### [RESOLVED MAJOR / S2] Query-based share links disclosed phrases to the host

- **Original evidence:** The review-start `src/app.js:8` read `location.search`, and its lines 113–116 generated `?text=...` share links. In an isolated local Chromium session, opening a synthetic link produced `GET /?text=SECURITY_SYNTHETIC_PHRASE&focus=0&seed=1`; stylesheet and app-module requests also carried that full query as Referer when no response policy was supplied. This contradicted the absolute privacy claims and `docs/RULES.md:14`.
- **Current fix:** `src/app.js:8` reads the fragment and `src/app.js:139` generates fragment links. HTML pages also carry meta no-referrer policy; `privacy.html:19` explains sharing.
- **Independent verification:** Loading and copying the synthetic fragment link produced only a request for `/` and local assets. Neither request URLs nor referrers contained the phrase, and copied state round-tripped correctly. No forwarding to an external service was tested or needed.

### [RESOLVED INPUT-HANDLING GAP] Shared state bypassed the form's text limit

- **Original evidence:** Initial `src/app.js:15` assigned arbitrary query values directly. Chromium confirmed that programmatically assigning a 2,000-character value bypassed the input's `maxlength=80` (`validity.tooLong` remained false). A browser freeze or security-impacting denial of service was not reproduced, so none is claimed.
- **Current fix and verification:** `src/app.js:15`–`src/app.js:21` allowlist settings and truncate shared text; `src/app.js:27` checks integer focus. A fresh page loaded with a 2,000-character phrase, invalid ratio, fractional focus, excessive cuts and duration produced 80 characters, default 9:16 ratio, 16 cuts/second, 10-second duration and one selected word, with no page errors. A literal `<img src=x onerror=alert(1)>` marker produced text buttons and zero injected image elements.

## Dependency evidence

[Certain] Source inspection found no network/evaluation sinks in the 69,011-byte vendored module. Its SHA-256 at review time was `d2c4c782f180c86ed30b1f5d9487a34a0d370bf9b4535285734ea187d38f9bb5`. A hash identifies the reviewed bytes; it does not independently establish upstream provenance.

[Certain] `npm audit --json` reported zero known vulnerabilities for the current lockfile. Because the muxer is vendored, npm audit does not cover it. A separate [OSV query endpoint](https://api.osv.dev/v1/query) request for npm `mp4-muxer` version `5.2.2` returned HTTP 200 with `{}` on the review date. That means no matching advisory was returned, not that unknown vulnerabilities are absent.

[Certain] The upstream [5.2.2 release](https://github.com/Vanilagy/mp4-muxer/releases/tag/v5.2.2) adds a deprecation notice. The repository already acknowledges this at `src/export.js:3`. Deprecation alone is not an exploitable finding; keep an upstream/version/provenance record when replacing the file. No new dependency is recommended merely to address deprecation.

## Verification limits

[Certain] Browser probes used a temporary loopback HTTP server with no application response-security headers and an isolated local Chromium profile. All text was synthetic. This independently exercised the meta-policy fallback. No account, deployment, paid API, existing local service or original application was accessed; no code, commit or push was performed by this reviewer.

[Certain] This was targeted security testing and source review, not full cross-browser QA, codec fuzzing, legal review, production log inspection, deployed-artifact inspection or a penetration-test certification. OWASP-relevant injection, component, configuration, integrity and data-disclosure surfaces were assessed; server-side authentication, SSRF, tenant isolation and database controls have no applicable implementation here. Public hosting transport/header behavior must still be verified after deployment.

## 2026-11-10 final release-candidate status

[Certain] **The previous stale-package observation is resolved.** This dated section supersedes the earlier open-count and package-status statements while retaining their historical evidence. The independently inspected local `dist/` now has 40 regular files, every file byte-for-byte identical to its corresponding source file. Recursive `lstat` inspection found no symlinks and no `replica`, `.gstack`, `docs`, `test`, `tests`, `.git`, or `node_modules` path segments. A separately generated temporary artifact had the same inventory. Nothing was uploaded or published.

[Likely] **PASS for the current local application and packaging security scope.** Current open findings: Critical/S1 **0**, Major/S2 **0**, Minor/S3 **0**, Info/S4 **1**. The sole remaining S4 observation is production response-header enforcement. No numerical score or production-passed claim is made.

### Packaging and licence evidence

[Certain] `scripts/prepare-site.mjs:12` now explicitly allows the separate landing page, editor, local 404 page, both stylesheets, static assets, module source, response-header file and root licence. `scripts/prepare-site.mjs:11` refuses nonempty output; lines 13–20 recursively reject source symlinks before copying. Synthetic fixtures independently reproduced nonempty-output and source-symlink rejection. The development server remains loopback-bound at `package.json:7`.

[Certain] The 40-file artifact contains `LICENSE`, `src/vendor/mp4-muxer.LICENSE`, `assets/fonts/bricolagegrotesque-OFL.txt`, and `assets/fonts/hankengrotesk-OFL.txt`. Both distributed font byte lengths and SHA-256 hashes match `assets/fonts/SOURCES.json`: Bricolage Grotesque 84,068 bytes, Hanken Grotesk 24,948 bytes. The new captions and sample media are local files. No external font request was observed.

### Optional HTTPS-origin substitution

[Certain] `scripts/prepare-site.mjs:5`–`scripts/prepare-site.mjs:9` parse the optional third CLI argument, require HTTPS without credentials, non-root path, query or fragment, and escape HTML-sensitive origin characters. Line 23 uses a callback replacement so `$&` and `$'` are treated literally. The trusted CLI configuration is not runtime user input.

[Certain] A fresh temporary package with `https://pressflick.app` changed only the expected placeholder text in top-level HTML output; all other output bytes matched source. Source placeholders remained unchanged. Rejection fixtures passed for HTTP, credentials, a non-root path, query, fragment, a JavaScript URL and an invalid URL string. WHATWG URL parsing accepts some unusual host characters; this script escapes them rather than claiming to validate public DNS ownership.

[Certain] This recheck caught and reported two packaging edge cases before finalization: unescaped quotes in an accepted origin could break an OG attribute, and replacement-string `$&` sequences could corrupt the configured URL. Both were corrected by the implementer. Independent Chromium HTML-parser fixtures then verified the landing and editor OG metadata for the normal origin, literal quote/attribute marker, percent-encoded quote, ampersand, `$&`, and `$'` hostnames: content values exactly matched the normalized origin and expected path, and each meta element retained only its intended `property` and `content` attributes. Temporary fixtures were removed. No unresolved security finding remains from those trusted-configuration cases.

[Certain] The current default `dist/` deliberately retains `pressflick.example` OG placeholders and matches source exactly. The verified optional-origin packaging mode produces correctly substituted output without editing source. Before public hosting, use that mode with the actual chosen HTTPS origin; this does not imply the domain exists or the account is configured.

### Current local privacy and browser evidence

[Certain] An isolated Chromium session served only the prepared artifact through a temporary loopback server without application response-security headers. Loading the new landing page and waiting for its local fonts produced zero external requests, zero page errors and zero script elements; the sample video had autoplay disabled. Opening `editor.html` with a synthetic phrase in its fragment and copying its share link retained the fragment-based format. No captured HTTP request URL or Referer contained that phrase; no external request or page error occurred. The privacy page now contains the owner-supplied contact address at `privacy.html:21`.

[Certain] `_headers:2`–`_headers:7` now declare same-origin/blob media, CSP framing denial, `X-Frame-Options: DENY`, denied camera/microphone/geolocation permissions, `nosniff`, `no-referrer` and HSTS. The file is included unchanged in the artifact. These are verified configuration bytes, not verified hosted response behavior.

### Remaining limits and release gates

[Certain] No production deployment, domain/DNS/TLS check, account change, public-repository change, original-site inspection or publication was performed by this reviewer. The selected host's actual responses must still be checked for security-header enforcement, redirects, TLS and static asset behavior. Human watch/listen and physical-device/browser checks remain unverified by this security recheck. The local artifact is prepared for the separately authorized hosting step; this report does not authorize or claim a live release.
