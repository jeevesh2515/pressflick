# Deployment runbook

## Vercel production — 10 November 2026

Pressflick is live at **[https://pressflick.vercel.app](https://pressflick.vercel.app)**, with a separate [editor](https://pressflick.vercel.app/editor.html). The Vercel project is `pressflick` in the owner's personal scope. This supersedes the earlier Cloudflare Pages and pre-launch plans.

Production uses **direct CLI uploads of the packaged public files**. The project has no Git integration (`link: null`) and no configured build command, root directory or output directory. There is no application build. [`../vercel.json`](../vercel.json) supplies the static routing and response-header configuration.

The current release work is on `release/riso-production-readiness`; `main` is untouched. The repository stays private. The owner has authorized production updates for this release; repository visibility, a new hosting provider and a custom domain remain separate decisions. No custom domain has been purchased or DNS configured. `pressflick.app` is a possible future domain, not a live address.

## Package public files only

Run [`../scripts/prepare-site.mjs`](../scripts/prepare-site.mjs) from the checkout into a **new, empty output directory**:

```bash
node scripts/prepare-site.mjs release/pressflick-review https://pressflick.vercel.app
```

Choose another directory if that path already contains files. The script copies an explicit public allowlist without compiling anything. It rejects source symlinks, nonempty output directories and configured origins containing credentials, a non-HTTPS scheme, a path, query or fragment.

The package contains the landing and editor, legal and error pages, CSS, native modules, local assets, manifest, favicons, `_headers`, `vercel.json` and licences. The root MIT licence, vendored muxer MIT licence and Archivo OFL licence must remain present. Font provenance in `assets/fonts/SOURCES.json` is retained; development raster sidecars (`*.webp.json`) are excluded.

Private notes, docs, tests, package tooling, Git metadata, browser logs and the checkout's hosting-project links are excluded. A new public file must be added to the script's allowlist and asserted in [`../test/package.test.js`](../test/package.test.js). **Never upload or publicly serve the repository root.**

Always pass the actual production origin for publication. The source retains marked `https://pressflick.example` placeholders; packaging replaces them in output HTML only, with attribute escaping. No domain purchase is needed to use the assigned Vercel origin. A package created without the origin retains placeholders and needs regenerating before publication.

## Preserve the Vercel project link

The existing local link is:

```text
release/pressflick/.vercel/project.json
```

It identifies the existing project and scope. Keep it between deployments. Do not delete `release/pressflick` to make the packaging destination empty. Package into a fresh directory, then copy **only `project.json`** into that output's `.vercel/` directory. Authentication stays in the Vercel CLI's existing authenticated session; no token or account configuration belongs in the public package or repository.

If the link is missing or the CLI is signed out, restore authentication and link the intended existing `pressflick` project before continuing. Do not let an upload silently create a replacement project.

## Publish an authorized update

Prerequisites: review the release diff, run the Node and browser checks, inspect the public package, and use an authenticated Vercel CLI. Keep the known project link above available. The following creates a fresh output every time and stops if a prerequisite or packaging step fails:

```bash
(
  set -eu
  test -f release/pressflick/.vercel/project.json
  output_dir="$(mktemp -d "$PWD/release/pressflick-production.XXXXXX")"
  node scripts/prepare-site.mjs "$output_dir" https://pressflick.vercel.app
  mkdir "$output_dir/.vercel"
  cp release/pressflick/.vercel/project.json "$output_dir/.vercel/project.json"
  cd "$output_dir"
  vercel deploy --prod --yes
)
```

The upload runs **from the output directory**, so no framework preset, install command or application build is needed. Keep the deployment URL returned by the CLI with the release verification record. Retain the previous release package until the new production check passes.

This workflow deploys the reviewed working files; it does not automatically deploy `main`, merge the release branch or change repository visibility. A future Git integration would require a separate configuration and review of its packaging boundary.

## Verify production

Inspect the deployed response and browser behaviour after every production update:

- Landing, `/editor.html`, privacy and terms pages load; landing calls to action reach the editor.
- A synthetic share fragment survives navigation and reproduces the expected settings without putting phrase state in a query.
- The real sample, poster, captions, local font and modules load from the site. Output social metadata uses `https://pressflick.vercel.app`, with no `pressflick.example` placeholder.
- Response headers match `vercel.json`: CSP, HSTS, frame denial, MIME protection, no-referrer policy and disabled camera/microphone/geolocation permissions. The CSP still permits local blob video exports without allowing inline scripts or external scripts.
- Unknown paths return HTTP 404 with the custom error page. Private paths, docs, tests, source-control files and development sidecars are absent from the public package and unavailable over HTTP.
- The editor previews and downloads usable video; test both the supported WebCodecs path and real-time fallback where available. Capture console, page and resource errors rather than filtering them.

Live header and 404 inspection is recorded in [the Vercel audit](reviews/vercel-live-audit.md). [The Riso implementation review](reviews/riso-code-review.md) records code and browser findings; [verification](VERIFICATION.md) records the final tested revision, release checks and remaining limits. A live response check does not establish physical-device performance, social-crawler behaviour or human audio/motion quality.

## Remaining validation

The app is already public; the earlier launch hold is historical. Physical iOS/Android, screen-reader use, human watch/listen approval, editing/social-app import, low-memory and repeated-export testing remain open. MediaRecorder timing can vary, and in-memory MP4 muxing has device-dependent memory costs. See [export quality](EXPORT-QUALITY.md) and the [human checklist](HUMAN-CHECKS.md). Do not turn desktop automation into claims about every browser or phone.

## Optional future hosting or domain

A custom domain is optional. If the owner chooses one, obtain the actual project-assigned DNS values from the host, preserve existing DNS/email records, and verify HTTPS and canonical redirects before changing production metadata. Do not invent nameservers, CNAME targets or IP addresses. Repackage with the confirmed HTTPS origin when the domain is ready.

Cloudflare Pages remains an alternative static host, not the current deployment. It can use the same reviewed public output and the included `_headers`; no Functions or Workers are needed. A move requires owner authorization and fresh live checks of headers, unknown-path 404s, metadata, and editor links/fragments, including any `.html` redirects. Use the host's current [headers](https://developers.cloudflare.com/pages/configuration/headers/), [custom-domain](https://developers.cloudflare.com/pages/configuration/custom-domains/) and [routing](https://developers.cloudflare.com/pages/configuration/serving-pages/) documentation when planning that change. No Cloudflare project, domain registration or assigned DNS target is claimed here.
