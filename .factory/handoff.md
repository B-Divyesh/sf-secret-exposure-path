# Handoff — polish 2

Date: 2026-08-28
Work order: `secret-exposure-path-polish-2`

## Done

Closed every F-1 and F-2 finding. The first screen now uses one `credential`
term, plain local-execution/detection wording, and an isolated one-click
`/?demo=1` route. That entry redirects into `/demo/?demo=1`, which has the
persistent banner, Reset demo, Start for real, and only in-memory sample state.

The mobile hero no longer clips: its grid child can shrink, the install
control/action group wraps, and a 390px test checks the h1, install control,
and both actions against the viewport. Every route shares the How it works /
Demo / Privacy / Terms header. GitHub destinations are named visibly. The
luminous-glass trace visual system remains unchanged.

`.factory/polish-2.md` maps every finding to its repair and evidence. The
catalog description is: “Trace declared credentials before they reach logs,
Git diffs, or build artifacts.”

## Verification

- `npm ci && npm test` — passed: 11 Rust tests, 7 Vitest contract/scanner tests, and TypeScript.
- `npm run test:e2e` — passed: 54 Playwright desktop/mobile/claim checks; `.last-run.json` is `passed`.
- `npm run test:claims` — passed: 24/24 tagged claim tests, including the `?demo=1` privacy entry.
- `npm run build` — passed; `dist/site/` produced. Initial JS gzip is 2.13 kB and CSS gzip is 4.45 kB.
- `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, and `cargo package --allow-dirty --no-verify` — passed.
- Playwright Axe checks on `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404/` found no serious or critical violations. Console-error checks are in the home suite.
- Screenshots: `.factory/evidence/polish-2/local-home-390.png`, `local-demo-390.png`, and `local-home-desktop.png`.

## Run and deploy

```sh
npm ci
npm test
npm run test:claims
npm run test:e2e
npm run build
```

Deploy `dist/site/` through the repository static-site work order. Cold-open
`https://secret-exposure-path.sociobot.in/` and
`https://secret-exposure-path.sociobot.in/?demo=1` after deployment.

## Known gaps

None. Exact tracking intentionally cannot follow encrypted, split, or
unsupported transformations; that documented boundary is claim-tested.
