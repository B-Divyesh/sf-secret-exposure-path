# Handoff — polish 1

Date: 2026-08-28
Work order: `secret-exposure-path-polish-1`
Repair commits: `591878e1c2b9a7f7292eb73a48b0bf657cdf5a08` (implementation) and
`5f845dd02a5588a572684ba74a1c699d8b700bb0` (repair map/evidence)
Live URL: <https://secret-exposure-path.sociobot.in/>

## Result

All 26 findings in `.factory/review-1.md` are repaired. The complete mapping
from finding to change and proof is in `.factory/polish-1.md`.

The repair keeps the luminous-glass trace identity. It adds no third-party
runtime resource, tracking, persistent browser storage, or server component.

## What changed

- Registered 24 observable claims in `.factory/claims.json`; every ID has one
  dedicated `@claim:` test.
- Added concrete CLI fixtures for fingerprints, access boundaries, literal and
  shape detection, dotenv/environment sources, forwarding, sinks, JSON/CI,
  exit results, limits, allowlists, repeated inputs, inspect, preflight, and
  report redaction.
- Kept `/demo/` isolated in memory, with its sample banner, reset, and
  Start-for-real exit. The first screen still reaches a completed sample in one
  click.
- Rewrote headings, README copy, clear/error copy, and the install copy label
  in plain language; the catalog line is verb-first and 76 characters.
- Focus now moves to each document route’s h1 with a polite announcement.
  Every legal/404 footer now has the product one-liner/version, Privacy, Terms,
  and the Param Factory link.

## Verification

Fresh clone: `/tmp/sep-clean-tcu0WT` at `591878e`. It completed `npm ci`,
`npm test`, each of the 24 commands listed in `.factory/claims.json` one by
one, `npm run test:e2e`, `npm run build`, `cargo fmt --check`,
`cargo clippy --all-targets -- -D warnings`, and
`cargo package --allow-dirty --no-verify`.

Results:

- Unit/site checks: 17 Rust tests plus 6 Vitest checks passed.
- Claim checks: 24/24 passed separately from the clean clone.
- Browser suite: 50/50 passed across desktop and 390×844 Chromium.
- Browser accessibility: Axe reported zero serious/critical issues on home,
  demo, privacy, terms, and 404 locally and live.
- Build: `dist/site/` produced. Initial JS is 4.71 kB (2.08 kB gzip); CSS is
  16.28 kB (4.39 kB gzip), under the static-product budgets.
- Lighthouse desktop using the available headless Chromium: accessibility,
  best-practices, and SEO each scored 100; LCP was 329 ms and CLS 0.036.
  The constrained headless runner did not emit a performance score.
- `npm audit --audit-level=moderate`: 0 vulnerabilities.

Evidence lives in `.factory/evidence/polish-1/`. It includes local and live
390px screenshots, `verify.json`, response headers, returned HTML, the static
deployment log, and the Lighthouse JSON.

## Deployment and cold live re-check

Deployed with the work-order static helper from `dist/site/`.

- Azure deployment ID: `cb548b65-a0e7-478b-81ae-351684d92d38`.
- Static host: `wonderful-flower-056e11510.7.azurestaticapps.net`.
- The custom domain returned 200 after deployment.
- A cold live browser check verified all five routes have one h1/main, no
  console errors, and no serious/critical Axe issue.
- The live first-screen action opened `/demo/`, displayed the seeded exposed
  path, redacted a unique input, reset to the sample, retained empty local and
  session storage, and made only same-origin requests.
- Unknown routes return the designed 404 with HTTP 404. The live response has
  CSP, Permissions-Policy, Referrer-Policy, and nosniff headers.

## Run and publish

Run `npm ci && npm test && npm run test:claims && npm run test:e2e`. Build with
`npm run build`. The ready-to-publish CLI package is produced by
`cargo package --allow-dirty --no-verify`; registry publication remains a
Param Factory action.

## Known gaps

None in the reviewed product scope. The only tool limitation was a constrained
headless Lighthouse performance-score calculation; the emitted accessibility,
best-practices, SEO, LCP, CLS, bundle, browser, and live checks are recorded
above.
