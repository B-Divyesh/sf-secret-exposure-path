# Handoff — polish 3 repair

Date: 2026-08-28
Work order: `secret-exposure-path-polish-3`
Repair commit: `a17c3e626f717d097c0f4311e24db5bba3f578a3`

## Done

- Made the one-click `/?demo=1` sample show its actual completed redacted path
  before scrolling on a 390 × 844 phone. The result is the real scanner result;
  the editable source and sink remain below it.
- Kept the demo banner sticky on phones, with Reset demo and Start for real
  continuously available.
- Tightened the first-screen phone layout so all three required product facts
  appear before the 844px viewport ends.
- Rewrote the allowlist instruction in plain language and refreshed the copy
  audit and verb-first catalog description.
- Added regression tests for phone fact bounds, direct-demo result bounds, and
  persistent demo controls. `npm run test:e2e` now builds the required CLI
  before browser tests, so it does not depend on a previous test command.

## Verification

Fresh clean clone: `/tmp/secret-exposure-path-polish3.xZrUiw/repo` at
`a17c3e626f717d097c0f4311e24db5bba3f578a3`.

- `npm ci` — passed, 0 audit vulnerabilities.
- Every exact command registered by all 24 `.factory/claims.json` entries —
  passed separately; recorded in `/tmp/sep-polish3-claims.log`.
- `npm test` — passed: 4 Rust library tests, 7 Rust CLI tests, 7 site tests,
  and TypeScript checking.
- `npm run build` — passed; produced `target/release/sep` and `dist/site/`.
- `npm run test:e2e` — 57 passed, 3 intentional desktop skips for phone-only
  checks; Axe found no serious or critical violations on the tested routes.
- `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`,
  `cargo package --allow-dirty --no-verify`, and
  `npm audit --audit-level=moderate` — passed. The package is 22 files,
  141.5 KiB unpacked / 37.6 KiB compressed.
- Local 390px evidence:
  `.factory/evidence/polish-3/local-home-390.png` and
  `.factory/evidence/polish-3/local-demo-390.png`. The facts end at y=825.67;
  the completed demo result ends at y=820.66, both inside 844px.

No `verify-url.sh` exists in this repository. The browser suite’s
`@axe-core/playwright` checks cover home, demo, privacy, terms, and 404 routes.

## Known gaps and next step

There are no known product gaps. Push this repair, wait for the static
deployment, then cold-open the live URL and re-check every mapped finding.
