# Security and privacy

## Surface

There is no server code, no database, no login, no payment, no API key, no third-party script and no cookie. The site is static files.

## What is in place

- **Content Security Policy** in `index.html`: only same-origin scripts and styles, `blob:` media, no inline script, `base-uri 'none'`, `form-action 'none'`.
- **No HTML injection path.** User text is written with `textContent` and canvas `fillText`, never `innerHTML`. URL parameters only set form values.
- **No network calls.** The phrase never leaves the page. A copied share link does contain the phrase, by design.
- **One dependency**, mp4-muxer 5.2.2 (MIT), copied into `src/vendor/` from npm on 2026-11-09. It was checked for network calls and dynamic code (`fetch`, `XMLHttpRequest`, `eval`, `new Function`, `WebSocket`): none. It is not fetched at run time or install time, so it cannot change under us.
- **No secrets** in the repo. There are none to have.

## To do at deploy

- Send the CSP as a response header as well, and add `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `frame-ancestors 'none'`.
- HTTPS only, with HSTS.
- If analytics are ever added, use a cookieless one and say so in the privacy page.

## Not reviewed

No independent security review has been run. The claims above come from reading our own code.

## Reporting

Open a private security advisory on the GitHub repo once it exists.
