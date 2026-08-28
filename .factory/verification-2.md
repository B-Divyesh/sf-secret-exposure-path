# Independent verification — PASS

Date: 2026-08-28  
Verifier work order: `secret-exposure-path-verify-2`  
Candidate commit: `60680aa40360abff9d628db72677f4b5b804585b`  
Live URL: <https://secret-exposure-path.sociobot.in/>

## Release decision

**PASS.** The clean checkout, its production build, and the current live deployment meet the researched brief and factory acceptance contract. No release-blocking defects were found.

## Mandatory first checks

### Claims contract — PASS

`.factory/claims.json` exists and defines seven claims. Each has exactly one `@claim:<id>` test in `e2e/claims.spec.ts`; `site/src/contracts.test.ts` asserts the one-to-one contract. Before the remaining repository QA, I ran every `test` command in the claims file individually from this clean checkout. They completed successfully. A repeat aggregate proof also passed:

```sh
npm run test:claims
# Running 7 tests using 1 worker
# 7 passed (13.2s)
```

| Claim ID | Observable sandbox result |
| --- | --- |
| `cli-path-redaction` | Declared source to artifact is traced, exits 10, and value is absent. |
| `cli-demo` | Bundled fake sample runs in a temporary workspace with a redacted finding. |
| `browser-private` | A unique browser value produces a path but is absent from result and outgoing requests. |
| `cli-no-network` | Socket-interceptor test finds no attempted network socket. |
| `mit-license` | Shipped LICENSE and Cargo metadata both declare MIT. |
| `offline-loaded-demo` | Loaded `/demo/` produces clear and exposed paths after offline mode. |
| `false-positive-rate` | 100 normal command messages produce fewer than two findings. |

### Cold first read and one-click demo — PASS

In a fresh Chromium context, the first screen says **“Trace secrets before they reach logs.”** It immediately says this is **“For developers and CI teams”** and the first primary action is **“Try it with sample data”**, with the adjacent explanation **“Loads a ready exposed path.”** This plainly answers what it does, who it is for, and what to click first.

Keyboard activation of that link reached `/demo/` in one action. It displayed one exposed path and the persistent **“Demo — sample data, nothing is saved”** banner, plus **Reset demo** and **Start for real**. The CLI equivalent, `sep demo --json`, created a unique system temporary workspace and emitted one redacted traced finding; its fake value appeared in neither stdout nor stderr.

## Clean-checkout validation

All commands below passed from the candidate checkout after `npm ci`:

| Command | Result |
| --- | --- |
| `npm test` | PASS — 4 Rust unit tests, 7 CLI integration tests, 6 Vitest tests, and strict TypeScript checking. |
| `npm run test:e2e` | PASS — 29 Playwright desktop/mobile checks; final run status `passed`. |
| `npm run test:claims` | PASS — 7/7. |
| `npm run build` | PASS — release binary and `dist/site/` produced. |
| `cargo fmt --check` | PASS. |
| `cargo clippy --all-targets -- -D warnings` | PASS. |
| `cargo package --allow-dirty --no-verify` | PASS — 22 files, 124.7 KiB unpacked / 34.6 KiB compressed. |
| `npm audit --audit-level=moderate` | PASS — 0 vulnerabilities. |

Public CLI smoke checks covered the normal and recovery paths. `sep demo --json` produced one redacted path; a clear wrapped command preserved its exit 7; a missing source and a too-short declared environment value each returned actionable errors and exit 2. The packed CLI was installed into a fresh `/tmp/sep-consumer.*` prefix with `cargo install --path /work/repo --root <temp>`; the installed binary exposed `run`, `inspect`, and `demo`, and its `sep demo --json` again produced the redacted exposed report.

## Live deployment and product behavior

The built `dist/site/index.html` and a fresh, decompressed live `GET /` have the same SHA-256:

```text
373dca51d98c312111ecb1dbd2cb70969b95fbd069a20c54b1f113392ce7960e
```

This confirms the live landing page matches the candidate build.

- Visual review at desktop width confirms the documented luminous-glass route system is implemented as a product-specific trace diagram and scanner bench, with legible dark-mode contrast and no generic template treatment.
- `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404/` each returned 200, route-specific title, `lang="en"`, one `h1`, one `main`, no console/page errors, and zero serious/critical Axe findings.
- A distinct unknown route returned the designed response with HTTP 404. A crawl found all internal routes and external GitHub/Sociobot links returning 200.
- At 390 x 844, `/demo/` had 0px horizontal overflow and no visible link, button, or textarea under 44px in either dimension.
- The first Tab reaches the skip link with `rgb(100, 244, 210) solid 3px` focus. Enter on the sample CTA opens the completed demo; textarea-to-button tab order and Enter activation work.
- In reduced-motion emulation, the route animation duration is `1e-05s`; no looping animation was observed.
- A unique-value browser trace made six same-origin static requests only, made no cookie, localStorage, sessionStorage, IndexedDB, or Cache Storage writes, registered no service worker, and omitted that value from the result. After load, offline mode successfully produced clear and reset-to-exposed results.

This static CLI landing/demo has no sign-in, server-side product endpoint, factory-unlock call, persistence service, or service worker. The 429/`Retry-After`, Entra tenant, concurrency, persistence-boundary, and service-worker-update checks are not applicable.

## Headers, privacy, and budgets

Live HTML returns a self-only CSP including `connect-src 'self'`, Permissions-Policy, HSTS, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: strict-origin-when-cross-origin`. HTML revalidates with `public, max-age=0, must-revalidate`; the 4,512-byte hashed main JavaScript and 27,348-byte WebP hero each return `public, max-age=31536000, immutable`.

Initial JavaScript is 4,512 bytes raw / 2,015 bytes gzip and initial CSS is 16,160 bytes raw / 4,352 bytes gzip, within the 200 KB JS and 50 KB CSS limits. A live Lighthouse 12.8.2 mobile audit recorded Performance 100, Accessibility 100, Best Practices 100, SEO 100, LCP 1,317 ms, CLS 0.0072, TBT 54.5 ms, and 75,791 bytes transferred. Lighthouse wrote its JSON result before its Chromium screenshot gatherer emitted a post-audit target crash; separate Playwright runs had no page or console errors.

## Defects by severity

None found.

## Known product limits

The documented detection boundary remains intentional: exact tracking cannot follow encrypted, split, shortened, or unsupported transformations, and shape-only findings are unattributed. This is disclosed in the UI and README and does not conflict with the brief.
