# Handoff — polish 4 complete

Date: 2026-08-28
Work order: `secret-exposure-path-polish-4`
Repair commit: `3c4ec2f57f05853cb7ca3e5d17e27a21b1baee42`
Static deployment: `5c94f88a-3c25-4bb5-b61e-f8009efa58a3`

## Done

- Closed F-4-1, the sole open cumulative review finding. The designed 404 now
  says “Page not found” and “This page was not found.” The original luminous
  glass route visual system is unchanged.
- Added source and browser regression checks for the literal 404 wording.
- Updated the catalog description to the verb-first, 82-character sentence:
  “Trace declared credentials before they reach logs, Git diffs, or build
  artifacts.” Its named-source and sink behavior is covered by the registered
  `declared-boundary` and `sink-paths` claims.
- Revalidated every earlier review/polish finding rather than treating prior
  status as evidence. The full map is in `.factory/polish-4.md`.
- Deployed `dist/site/` through `/opt/fleet/lib/deploy-static.sh` using the
  work-order static configuration.

## Exact verification

Fresh clone: `/tmp/sep-polish4-clean` at repair commit `3c4ec2f` after
`npm ci`.

- Every exact `.factory/claims.json` selector passed separately: all 24
  `npm run test:claims -- --grep @claim:<id>` commands.
- `npm test` passed: 4 Rust library tests, 7 Rust CLI integration tests, 8
  site/unit/type tests.
- `npm run build` passed and produced `target/release/sep` and `dist/site/`.
- `npm run test:e2e` passed: 59 passed, 3 intentional desktop skips for
  phone-only viewport checks. The browser suite includes Axe; no serious or
  critical violations were found.
- `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, and
  `cargo package --allow-dirty --no-verify` passed. The package is
  `target/package/secret-exposure-path-0.1.0.crate`.
- `/opt/fleet/lib/verify-url.sh` passed against the deployed `/`, `/?demo=1`,
  `/privacy/`, `/terms/`, and `/404/` routes. Each has a title, `lang=en`, one
  h1, main, image alt coverage, no unlabeled buttons, and no console errors.
- A separate cold live browser audit confirmed normal-route status 200,
  route titles, metadata, navigation, zero serious/critical Axe findings, the
  real unknown-route HTTP 404, and the literal 404 heading.
- Cold live 390 × 844 demo verification confirmed direct `?demo=1` routing,
  a completed redacted sample path at y=617.97–820.66, banner/reset/exit,
  empty storage and cookies, 16 same-origin requests, and offline clear
  tracing. Home facts ended at y=825.67.
- Live mobile Lighthouse: Performance 100, Accessibility 100, FCP 1,059ms,
  LCP 1,209ms, CLS 0.0016, 76,232 bytes. Report:
  `.factory/evidence/polish-4/live-lighthouse.json`.

## Run and release

```sh
npm ci
npm test
npm run build
npm run test:e2e
cargo package --allow-dirty --no-verify
```

The ready-to-publish Rust crate is built by the last command; registry
publication remains a Param Factory action. Deploy the static site with the
work-order command:

```sh
npm ci && npm run build:site
/opt/fleet/lib/deploy-static.sh secret-exposure-path dist/site
```

## Known gaps

None. Every finding from reviews 1–4 is closed and rechecked on the deployed
site.
