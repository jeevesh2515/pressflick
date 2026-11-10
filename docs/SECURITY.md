# Security and privacy

Independent local security review dated 9 November 2026: `docs/reviews/security-review.md`. This review and its concrete synthetic probes supersede the original builder-only claim. No production security clearance is implied.

## Surface and controls

Static files; no application backend, database, login, payments, cookies, telemetry or API key. One vendored MIT MP4 muxer, no runtime CDN. User text is drawn with canvas or textContent. The fragment-based share URL is not sent in an HTTP request; anyone receiving a link can read its phrase. Native form controls constrain allowlisted shared settings, with an80-code-unit text cap and integer focus validation.

The independent reviewer reproduced the former query-string disclosure and verified the new fragment-based HTTP boundary, bounded malformed state and an HTML-injection marker. Exact evidence/limitations are in that report. Host request logs may include IP/time. The privacy contact is the address explicitly authorized by the owner in this chat.

All three HTML pages have CSP meta tags and no-referrer meta policy. `_headers` adds response CSP with frame-ancestors none, nosniff, no-referrer and HSTS. Static output is an allowlist from `scripts/prepare-site.mjs`; do not deploy the checkout root. `npm start` binds loopback. Development test dependencies are excluded from distribution.

## Verification limits

`npm audit` covers the locked development toolchain, not vendored code. Reviewer checked the vendored package separately against OSV; no advisory returned in that query, which is not proof of absence. No exhaustive dependency audit, human penetration test, physical-device testing or production response-header check. The host/domain have not been provisioned; no account/DNS/publication changes were made. No claim that static files remove all security risk.

## Reporting

Use the contact in privacy.html. Public GitHub issue/advisory access remains unavailable while the source repository is private. Do not post sensitive phrases or generated private content in a public report.
