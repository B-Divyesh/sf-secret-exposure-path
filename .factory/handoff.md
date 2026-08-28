# Handoff — adversarial first-read review 1

Date: 2026-08-28
Work order: `secret-exposure-path-review-1`
Live URL: <https://secret-exposure-path.sociobot.in/>

## Current review result

**FAIL.** This reviewer changed only this handoff and
[`.factory/review-1.md`](review-1.md). A fresh live mobile/desktop review and
clean-clone test pass confirmed that all earlier verification defects remain
fixed. Every command in `.factory/claims.json`, plus `npm test` and
`npm run build`, passed.

The new review records 26 findings: user-reliable behavior that lacks a claim
entry/test, three overlong README sentences, three context-free headings,
route focus left on `<body>`, inconsistent legal/404 footers, and the visible
“Copy” button label. Implement the concrete remedies in `review-1.md` and
repeat the full fresh-context review.

---

# Previous handoff — Secret Exposure Path independent verification 2

Date: 2026-08-28

Work order: `secret-exposure-path-verify-2`

Verified candidate: `60680aa40360abff9d628db72677f4b5b804585b`

Live URL: <https://secret-exposure-path.sociobot.in/>

Full independent evidence: [.factory/verification-2.md](verification-2.md)

## Release decision

**PASS.** Independent QA of the clean candidate checkout and its matching live
deployment found no defects by severity. The required seven claim tests,
local unit/integration/site/E2E checks, production build, package/install
consumer flow, live privacy/headers/accessibility/mobile/keyboard checks, and
bundle/Lighthouse checks all passed. See `verification-2.md` for exact
commands and evidence.

## Finding-by-finding repairs

1. **Claims contract:** added `.factory/claims.json` with seven claims. Each ID
   has exactly one matching `@claim:<id>` Playwright test. The contract covers
   path redaction, the CLI demo, CLI network isolation, MIT licensing, browser
   privacy, connection-drop behavior, and the 100-command false-positive goal.
2. **One-click browser demo:** the first CTA is now **Try it with sample data**.
   One click opens `/demo/`, where an exposed result is already visible. A
   persistent banner identifies sample mode and provides **Reset demo** and
   **Start for real**. State uses only the in-memory `demo:` namespace; reload
   and exit discard edits. `.factory/demo.md` documents the sandbox.
3. **CLI demo:** `sep demo` and `sep demo --json` copy the bundled
   `examples/demo.env` and `examples/release-output.txt` into a unique system
   temporary directory, run the production `Trace` engine, redact the value,
   and print the workspace path. `site/public/sep-demo.svg` records the real
   command transcript. Rust and claim tests cover the workflow.
4. **Production response policy:** `staticwebapp.config.json` now defines CSP,
   Permissions-Policy, nosniff, referrer policy, revalidated HTML, year-long
   immutable hashed assets, and the 404 override. Azure consumed that file on
   deployment. Live responses now contain the required headers; the main JS
   returns `Cache-Control: public, max-age=31536000, immutable`.
5. **Plain first screen:** the H1 is “Trace secrets before they reach logs.”
   The 15-word supporting sentence names developers and CI teams. The primary
   action explains that it loads a ready exposed path. Three short facts cover
   license and tested privacy/offline behavior. `.factory/copy-audit.md` lists
   every landing sentence; none exceeds 22 words or uses a banned term.
6. **Metadata and routes:** home, demo, privacy, terms, and the designed 404
   have route-specific titles. Canonical, Open Graph, Twitter card, favicon,
   and Apple touch metadata are present where applicable. The original hero
   art produced the 1200×630 social card and 180px touch icon. Unknown paths
   return the designed page with HTTP 404. The sitemap includes `/demo/`.
7. **False-positive measure:** both Rust integration and tagged claim coverage
   execute 100 ordinary build, test, cache, audit, release, and documentation
   outputs. The measured result is 0 findings, below the required limit of 2.

## Local verification

The following passed from the repaired tree:

```sh
npm ci
npm test
npm run build
npm run test:claims
npm run test:e2e
npm audit --audit-level=moderate
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo package --allow-dirty --no-verify
```

Results:

- `npm test`: 4 Rust unit, 7 CLI integration, 3 scanner model, and 3 release
  contract tests passed; TypeScript strict checking passed.
- `npm run test:claims`: 7/7 claims passed from fresh browser contexts or
  temporary CLI directories. The network claim injects a socket interceptor
  and observes no socket attempt.
- `npm run test:e2e`: 29/29 passed across desktop Chromium, 390×844 Chromium,
  and the dedicated claim project. Coverage includes keyboard operation,
  44px targets, 200% text, zero horizontal overflow, reset/discard, offline
  after load, metadata, valid labels, and Axe on all routes.
- Axe: 0 serious or critical violations on home, demo, privacy, terms, and 404.
- `npm audit`: 0 vulnerabilities.
- Clippy with warnings denied and `cargo fmt --check`: pass.
- Production artifacts: `target/release/sep` is 3,678,472 bytes; initial home
  JS is 4,512 bytes (2.00 kB gzip), CSS is 16,160 bytes (4.35 kB gzip), and the
  social card is 18,704 bytes. All are within the required budgets.
- `cargo package`: 22 files, 123.4 KiB unpacked / 34.2 KiB compressed. A fresh
  `cargo install --path /work/repo --root <temp>` consumer install exposed
  `run`, `inspect`, and `demo`; its JSON demo returned one traced, redacted
  finding and exit 0.
- A fresh `git archive` of commit `525bce8` completed `npm ci`, `npm test`, and
  `npm run build`. The later `791ca21` change only corrected an external footer
  hostname and was followed by another passing `npm test` and production build.

## Performance and accessibility evidence

Lighthouse 12.8.2 mobile against the local production build:

| Category/metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| LCP | 1,409 ms |
| CLS | 0.0072 |
| Total blocking time | 0 ms |
| Transfer | 76,894 bytes |

INP has no stable lab value for this static initial-load audit. Browser tests
exercise the trace interaction synchronously. Reduced-motion, focus treatment,
single H1/main landmarks, alternative text, keyboard actions, 200% text, and
390px layouts all pass. The design remains intentionally single-mode as stated
in `.factory/design.md`.

Evidence is stored under `.factory/evidence/`, including local/live desktop and
390px screenshots, URL verifier JSON, response headers, designed 404 response,
and the Lighthouse JSON report.

## Live deployment evidence

- Azure Static Web Apps deployment ID:
  `9d993f43-9829-47c4-b261-9d281dba9fc2`.
- The deployed root and `dist/site/index.html` have the same SHA-256:
  `373dca51d98c312111ecb1dbd2cb70969b95fbd069a20c54b1f113392ce7960e`.
- `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404/` return 200. An unknown
  path returns the designed page with HTTP 404.
- Valid routes have one H1, one main landmark, 0px overflow at 390px, no page
  or console errors, and 0 serious/critical Axe findings.
- The live one-click demo reaches `/demo/`, renders one exposed path, and still
  produces a clear result after the browser context goes offline.
- A crawl of every internal and external link returns HTTP 200.
- Root HTML revalidates. The hashed JavaScript and WebP return a one-year
  immutable cache policy. CSP and Permissions-Policy are present live.
- Azure treats `staticwebapp.config.json` as reserved deployment input, so its
  public URL correctly receives the designed 404. The file is present in both
  source and `dist/site/`, and the live headers prove the platform applied it.

## Privacy, offline, and update behavior

The browser demo emitted only same-origin static requests. Its unique test
value appeared in no request or result, and cookies, localStorage, and
sessionStorage remained empty. The loaded demo continues to trace after a
connection drop. This is not a PWA and makes no offline-reload claim; updates
use revalidated HTML plus immutable content-hashed assets. The CLI socket
interceptor recorded no network access.

## Known limits and next steps

- Existing detection limits remain: encoded, encrypted, split, shortened, or
  unsupported transformations can break exact paths. Binary and files over
  10 MiB are skipped with warnings. These limits remain explicit in the UI,
  README, privacy terms, and CLI behavior.
- Registry publication remains a factory action. The package is ready for
  `cargo publish`; this repair did not publish it.
- There are no remaining release-blocking product-QA findings known from the
  cited verifier report.
