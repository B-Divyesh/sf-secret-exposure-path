# Independent verification — FAIL

Date: 2026-08-28  
Verifier work order: `secret-exposure-path-verify-1`  
Candidate commit: `e74ec13a1702a5d73218f4dd25269bcab2aaa1e6`  
Live URL: <https://secret-exposure-path.sociobot.in/>

## Release decision

**FAIL.** The required claims contract is absent, the product has no compliant
one-click isolated demo, and the CLI has no required bundled `demo` command.
The live deployment otherwise serves the exact candidate HTML, so these are
candidate defects rather than a stale deployment. The live deployment also
does not apply the supplied security and caching header policy.

## Required first checks

### Claims contract — BLOCKER

`.factory/claims.json` does not exist in the clean checkout. Consequently
there were no claim tests to run through a demo entry point. The work order
explicitly makes either condition release-blocking. This also leaves visible
claims such as “No telemetry”, “Values stay in memory”, “Network not
required”, “Runs locally—even offline”, and “Nothing entered here is saved”
without the required observable sandbox tests.

### Cold first-read and demo — BLOCKER

Cold live-page evidence (HTTP 200 at the URL above):

- H1: “Trace where secrets travel. Before they leave.”
- Supporting sentence: “Wrap a build, agent, or release command…”
- First CTA: `Trace a sample`, which only scrolls to the browser lab.

The screen does not plainly name its intended users (developers/CI teams),
does not offer the required CTA named `Try it with sample data`, and takes a
second click (`Trace paths`) to run the sample. The browser check found zero
elements named `Try it with sample data` and zero persistent `Demo — sample
data, nothing is saved` banners. `/demo` returns the ordinary landing HTML;
there is no separate demo namespace, reset action, or start-for-real action.

As a CLI product it also lacks the mandated shipped demo: there is no
`examples/` directory or `.factory/demo.md`, and `target/release/sep demo`
exits 2 with `unrecognized subcommand 'demo'`. No terminal recording of the
real binary is shipped.

## Local clean-checkout validation

`npm ci` completed with 0 vulnerabilities. The following passed:

| Command | Result |
| --- | --- |
| `npm test` | PASS — 4 Rust unit, 5 Rust CLI integration, 3 Vitest tests, TypeScript check |
| `npm run build` | PASS — release `sep` and `dist/site/` produced |
| `npm run test:e2e` | PASS — 10 Playwright checks across desktop Chromium and 390×844 mobile |
| `cargo clippy --all-targets -- -D warnings` | PASS |
| `cargo fmt --check` | PASS |
| `cargo package --allow-dirty --no-verify` | PASS — 18 files, 110.2 KiB / 30.4 KiB compressed |
| `npm audit --audit-level=moderate` | PASS — 0 vulnerabilities |

Clean-consumer CLI exercise used `cargo install --path /work/repo --root` in a
fresh temporary prefix. `sep --help` exposed `run` and `inspect`; a clear
inspect returned JSON `clear` with 0 findings; an injected declared value
returned exit 10 with one traced finding and neither JSON nor stderr contained
the value. Missing source and a too-short environment value both returned exit
2 with actionable errors. A 10 MiB-plus sink returned clear plus the documented
skip warning. This validates the public CLI paths exercised, but does not
replace the missing `sep demo` contract.

## Live deployment, privacy, accessibility, and performance evidence

- `sha256(dist/site/index.html)` and a fresh live `GET /` both equal
  `2cad83e10f2f07192e4874fdd988ff89538ee5b308952a0ec38dd52686bd2b49`.
  The served page therefore matches the candidate build.
- Chromium at 390×844: 0px horizontal overflow on `/`, `/privacy/`, and
  `/terms/`; one H1 and one `main` on each; skip link receives first Tab and
  has a designed `rgb(100, 244, 210) solid 3px` focus outline. Reduced-motion
  is active (`heroAnimation` resolves to `0.00001s`).
- Axe on live `/`, `/privacy/`, and `/terms/`: 0 serious/critical violations.
  No page errors or console errors occurred.
- During the complete live browser-lab trace flow, all requests were same
  origin (`https://secret-exposure-path.sociobot.in`); local/session storage
  were empty. After first load, the lab still produced a clear result while
  the browser context was offline. This is evidence for the currently loaded
  local lab only, not an offline-reload claim.
- Production assets are small: home JavaScript 4.17 kB (1.91 kB gzip), CSS
  14.85 kB (4.12 kB gzip), and hero art 27 kB. This is within the stated JS/CSS
  budgets.
- All static internal links plus both GitHub links returned HTTP 200 in a fresh
  crawl. `/demo` also returns HTTP 200, but only via the ordinary landing page
  and not as the required demo state.
- This is a static product with no server-side API endpoints, sign-in,
  persistence, service worker, or product-unlock endpoints. Rate limiting,
  auth-tenant, persistence, concurrency, and PWA-update checks are not
  applicable.

## Defects

### Blocker

1. **Missing `.factory/claims.json` and all required claim tests.** No required
   contract file, IDs, tests, or sandbox evidence exist. This directly fails
   the work order and makes all testable marketing/privacy claims unlisted.
2. **No compliant one-click demo.** The first screen has no `Try it with sample
   data` action; its scroll link requires another click. There is no isolated
   demo storage namespace, direct demo mode, persistent demo banner, reset,
   start-for-real action, or demo documentation.
3. **CLI demo contract absent.** `sep demo` is not implemented, no bundled
   sample lives under `examples/`, and no recording demonstrates the real
   binary on sample data.

### High

4. **Production response policy does not match the supplied policy.** Live
   `/` and `/assets/home-DsEEv_RG.js` return only `cache-control: public,
   must-revalidate, max-age=30`; the asset is not immutable. They omit both
   `Content-Security-Policy` and `Permissions-Policy`, though `site/public/_headers`
   declares them. The live site also returns no `staticwebapp.config.json`.
   `HSTS`, `X-Content-Type-Options`, and `Referrer-Policy` are present.
5. **First screen fails the plain-words audience requirement.** It describes
   commands but does not plainly say it is for developers and CI teams; the
   generic headline plus scroll CTA does not answer all of what, for whom, and
   what to click first in the mandated form.

### Medium

6. **Required metadata/route artefacts are incomplete.** The HTML has no
   canonical link, Open Graph/Twitter card metadata, or Apple touch icon; a
   fresh `/staticwebapp.config.json` request is 404. A designed 404 route was
   not found.
7. **The brief’s false-positive success measure is not independently proven.**
   The suite contains one normal-command unit check, not a seeded 100-normal-
   command regression demonstrating fewer than two false positives. The
   missing claims contract provides no alternate quantitative assertion.

## Remediation required before re-verification

Add a complete claims file and tagged observable tests run from the documented
demo entry point; implement the CLI demo package (including bundled sample,
`sep demo`, docs, and landing recording); make the first CTA and demo sandbox
meet the stated contract; and configure the actual deployment platform to
serve CSP, Permissions-Policy, and immutable hashed-asset caching. Then rerun
this verification from a clean checkout and live URL.
