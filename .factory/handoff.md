# Handoff — adversarial review 3

Date: 2026-08-28
Work order: `secret-exposure-path-review-3`

## Done

Performed a no-code-change adversarial review of the deployed product and
committed the report as `.factory/review-3.md`.

The report verdict is **FAIL** with three findings:

- F-3-1 (blocking): on 390 × 844, the one-click demo’s completed sample path
  begins at y=1442px, so it is not visible in the first viewport.
- F-3-2: the landing page’s three required plain facts start at y=838px and
  y=866px, below or clipped by the first 844px viewport.
- F-3-3: one allowlist sentence uses metaphorical/internal wording.

No product source, assets, or tests were changed.

## Verification performed

- Fresh live Chromium checks at 390 × 844 and 1440 × 960 for cold first read,
  screenshots, request/console logs, metadata, accessibility structure,
  routing, back-button focus, headers/footers, links, and designed 404.
- Fresh browser demo: direct `?demo=1`, sample result, banner, reset, unique
  input redaction, empty browser storage, and same-origin request log.
- Fresh clean clone at `/tmp/sep-review3.pw3WiH/repo`: `npm ci`, `npm test`,
  `npm run build`, all 24 individual `claims.json` test commands, and
  `npm run test:e2e` (54 passed).
- CLI demo executed from a separate temporary working directory and created a
  separate system temporary sample workspace with a redacted result.

## Next steps

Repair F-3-1 through F-3-3, deploy, then repeat the complete review from a
fresh browser context and clean clone. Known product limitations remain the
documented, claim-tested exact-tracking boundary; no new backend or AI work is
needed.
