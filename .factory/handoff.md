# Handoff — Secret Exposure Path v0.1.0

Date: 2026-08-28
Work order: `secret-exposure-path-build-1`

## What shipped

- A Rust single-binary CLI named `sep` with two non-interactive commands:
  `sep run` wraps a command; `sep inspect` scans existing sinks.
- Explicit source tracking from dotenv/text files and selected environment
  variables. Candidate values remain in process memory only.
- Preflight detection blocks a command when a declared value appears literally
  in its arguments, before the child process starts.
- Sink coverage for redacted stdout/stderr, declared files/directories, and
  staged plus unstaged Git diffs.
- High-confidence shape detectors for GitHub, AWS, Stripe, Slack, Google API,
  and full private-key material; dotenv name/value tracking covers arbitrary
  team credentials.
- Human path graphs and stable JSON reports containing only 12-character
  SHA-256 fingerprints and locations. Exit codes: 0 clear, 10 exposure, 2
  scanner error, otherwise the wrapped command's failure code.
- `.seppath.toml` plus CLI fingerprint/path allowlists.
- A Vite documentation site with an interactive, browser-local trace bench,
  explicit clear/loading/error/offline states, mobile layout, CLI examples,
  privacy policy, terms, and no analytics or remote runtime assets.
- Original `site/public/trace-landscape.webp` hero art (27,348 bytes), generated
  with the required Param Factory `factory-image` deployment. Full prompt and
  provenance are recorded in `.factory/design.md`.

## Verification

All commands passed in the working tree:

```sh
npm ci
npm test
npm run build
npm run test:e2e
npm audit --audit-level=moderate
cargo clippy --all-targets -- -D warnings
cargo package --allow-dirty --no-verify
```

The same `npm ci && npm test && npm run build` sequence passed from a clean
`git archive` at commit `a916d48`. The build produced:

- `target/release/sep` (3.5 MiB single binary)
- `dist/site/index.html` plus `/privacy/` and `/terms/`
- Cargo package: 110.2 KiB unpacked / 30.5 KiB compressed

Test coverage/results:

- Rust: 4 unit + 5 end-to-end CLI tests passed, including seeded paths through
  command output, artifacts, and a real Git diff; tests assert values never
  appear in stdout/stderr/JSON.
- Site: 3 scanner-model tests and TypeScript strict checks passed.
- Playwright 1.58.2: 10/10 desktop Chromium and 390×844 mobile checks passed.
  These cover keyboard flow, responsive overflow, demo states, image loading,
  console errors, one-h1/main semantics, and Axe on home/privacy/terms.
- Axe: zero serious or critical violations.
- npm audit: zero known vulnerabilities.

Lighthouse mobile lab result (local production preview): performance 100,
accessibility 100, best practices 100, SEO 92; LCP 1.4 s, CLS 0.013, transfer
73 KiB. INP has no lab value for a static initial load; the tested demo action
updates in the same task after local SHA-256 completes. Production assets are
4.9 KiB initial JavaScript, 15.4 KiB CSS, ~35 KiB loaded WOFF2 fonts, and a
27 KiB hero image, all below the work-order budgets.

## Known limits

- Exact path tracking cannot follow encrypted, split, shortened, or otherwise
  transformed values. The report labels shape-only matches `unattributed`.
- Git coverage is staged and unstaged diffs. Untracked files must be named with
  `--output`/`--input` (or added to Git) to be scanned.
- Binary outputs and individual files over 10 MiB are skipped with a warning;
  this avoids accidental memory spikes in build pipelines.
- Command output is captured before being redacted and forwarded, so very long
  running or extremely verbose processes are not streamed incrementally in v1.
- SEO scored 92 in the local Lighthouse run because its `robots.txt` fetch
  failed during the lab pass; the built root contains a valid `robots.txt` and
  sitemap.

## Factory next steps

1. Publish the already validated crate/package using factory-owned registry
   credentials (`cargo package` is ready); do not publish from this worker.
2. Build with `npm run build` and deploy `dist/site/` as the static root.
3. Attach platform release binaries for Linux/macOS/Windows if desired; the
   source-install command works today.
4. Run production Lighthouse once the canonical domain and caching headers are
   live, particularly to confirm the robots/sitemap request.
