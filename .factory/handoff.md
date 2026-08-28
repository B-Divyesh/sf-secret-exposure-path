# Handoff — review 4

Date: 2026-08-28
Work order: `secret-exposure-path-review-4`

## Done

- Performed the full adversarial review of the deployed product without
  modifying product code.
- Wrote all evidence, copy audit, claim results, and the finding in
  `.factory/review-4.md`.
- Replaced the prior repair handoff with this review handoff.

## Verification

- Created a fresh clean checkout at `/tmp/sep-review4.FR3tjN/repo`; `npm ci`
  completed successfully.
- Ran every one of the 24 exact `.factory/claims.json` selectors separately;
  all passed.
- `npm test`, `npm run build`, and `npm run test:e2e` passed in the clean
  checkout. The browser suite reported 60 passing tests.
- Fresh live 390 × 844 and 1440 × 960 contexts clearly showed the product
  job, audience, and sample action. The phone first screen fit its heading,
  controls, and all three product facts.
- Live `/?demo=1` showed a completed redacted sample path on its first phone
  screen. Reset restored fake data; browser storage stayed empty; all observed
  requests were same-origin; the loaded demo completed a clear trace offline.
- `sep demo --json` was run from a distinct temporary caller directory. It
  created its own temporary workspace and left the caller directory unchanged.
- Crawled landing links and verified normal routes, metadata, stable
  header/footer, deep links, Back-button h1 focus, 404 response, and console
  behavior. Normal routes had no console or page errors.

## Known gap

- **F-4-1 (minor):** `/404/` uses “Path / missing sink” and “This path ends
  here.” instead of a literal page-not-found message. Replace both with plain
  wording and add an e2e assertion. The review verdict is **FAIL** until the
  required zero-finding standard is met.
