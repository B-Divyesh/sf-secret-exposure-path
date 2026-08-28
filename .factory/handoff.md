# Handoff — adversarial review 2

Date: 2026-08-28
Work order: `secret-exposure-path-review-2`

## Done

Wrote `.factory/review-2.md` and made no product-code changes. The review is **FAIL** with one blocking and four non-blocking findings.

The blocking live issue at 390px clips the landing h1, install control, and secondary action: a 538px hero-copy sits in a 358px column while main overflow is hidden. The review also records inconsistent header navigation, two unmarked external links, and two plain-words issues.

## Verification

- Fresh live Chromium checks at 390 × 844 and 1440 × 960; no console errors.
- Fresh demo check: completed one-click sample, banner/reset, redaction, empty browser storage, and same-origin-only request log.
- Direct `sep demo --json` from the clean clone created an isolated temporary workspace and emitted a redacted report.
- In `/tmp/sep-review2-KY2Phb`: `npm ci`, `npm test`, `npm run build`, `npm run test:e2e`, and all 24 declared claim commands passed.
- Checked live metadata, direct/deep routes, 404, link crawl, focus/back behavior, robots/sitemap, footers, and every F-1 repair.

## Next steps

Repair every item in `.factory/review-2.md`, especially F-2-1, deploy, and repeat a complete cold review. No code was changed in this work order.
