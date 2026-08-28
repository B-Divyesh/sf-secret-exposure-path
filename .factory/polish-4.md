# Polish 4 — zero-finding release repair

Repaired product commit: `3c4ec2f57f05853cb7ca3e5d17e27a21b1baee42`
Deployed static artifact: `5c94f88a-3c25-4bb5-b61e-f8009efa58a3`
Live URL: <https://secret-exposure-path.sociobot.in/>

Read in full before repair: `.factory/review-1.md`, `.factory/review-2.md`,
`.factory/review-3.md`, `.factory/review-4.md`, `.factory/polish-1.md`,
`.factory/polish-2.md`, `.factory/polish-3.md`, `.factory/verification.md`,
and `.factory/verification-2.md`.

The only newly open finding was F-4-1. Its 404 route now says **“Page not
found”** and **“This page was not found.”** The regression is protected by
`the designed 404 plainly says that the page was not found` in
`e2e/site.spec.ts` and the source contract `uses a literal page-not-found
heading on the designed 404 route`.

All 24 exact commands in `.factory/claims.json` passed separately from a
fresh clone at `/tmp/sep-polish4-clean` after `npm ci`. The full fresh-clone
suite passed: `npm test` (4 Rust library, 7 Rust CLI, 8 site/unit/type tests),
`npm run build`, `npm run test:e2e` (59 passed, 3 intentional desktop skips),
`cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, and
`cargo package --allow-dirty --no-verify`.

Cold live checks used new Chromium contexts. `/`, `/demo/`, `/privacy/`,
`/terms/`, and `/404/` each returned 200, had their route title, one h1,
one main landmark, required metadata, no console errors, and zero serious or
critical Axe findings. An unknown URL returned HTTP 404 with the literal 404
heading. `verify-url.sh` evidence is under `.factory/evidence/polish-4/`.

| Finding | Change retained or made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept 12-character fingerprints and source/sink locations. | `@claim:fingerprint-format`; cold live `/demo/`. |
| F-1-2 | Kept the named-source boundary and both Git diff scans. | `@claim:declared-boundary`; cold live `/`. |
| F-1-3 | Kept exact matching and unattributed credential-like-text findings. | `@claim:detection-methods`; cold live `/`. |
| F-1-4 | Kept dotenv and selected environment-variable candidates. | `@claim:source-types`; cold live `/`. |
| F-1-5 | Kept redacted command forwarding and clear-child status behavior. | `@claim:command-forwarding`; cold live `/`. |
| F-1-6 | Kept source → command → log/artifact/working/staged paths. | `@claim:sink-paths`; cold live `/`. |
| F-1-7 | Kept one JSON stdout report, redacted stderr, and exit 10. | `@claim:json-ci-contract`; clean-clone browser suite. |
| F-1-8 | Kept local browser tracing, redaction, and unavailable-hashing feedback. | `@claim:browser-model`; cold live `/?demo=1`. |
| F-1-9 | Kept the clear-result conclusion and shape-free fixture. | `@claim:clear-result`; cold live offline demo. |
| F-1-10 | Kept clear, exposed, cannot-scan, and child-status exit behavior. | `@claim:exit-code-contract`; clean-clone CLI suite. |
| F-1-11 | Kept the actionable cannot-scan message and failure coverage. | `@claim:exit-code-contract`; cold live `/`. |
| F-1-12 | Kept transformed/split limits and the `unattributed` label. | `@claim:detection-limits`; cold live `/`. |
| F-1-13 | Kept fingerprint/path allowlists while retaining unrelated findings. | `@claim:allowlists`; cold live `/`. |
| F-1-14 | Kept the direct workflow heading “Scan every output you name.” | Clean-clone `npm run test:e2e`; live home screenshot. |
| F-1-15 | Kept the direct local/CI install heading. | Clean-clone `npm run test:e2e`; live home screenshot. |
| F-1-16 | Kept the literal detection-limits heading. | Clean-clone `npm run test:e2e`; cold live `/`. |
| F-1-17 | Kept concise README scope and named source/sink wording. | `@claim:declared-boundary`, `@claim:sink-paths`. |
| F-1-18 | Kept concise README audience copy. | `.factory/copy-audit.md`; clean clone. |
| F-1-19 | Kept repeated source/output options. | `@claim:multiple-inputs`. |
| F-1-20 | Kept `inspect` without a child command. | `@claim:inspect-mode`. |
| F-1-21 | Kept preflight refusal before a child starts. | `@claim:preflight-redaction`. |
| F-1-22 | Kept declared values out of source, command, JSON, report, and error flows. | `@claim:report-redaction`; `@claim:browser-private`. |
| F-1-23 | Kept Static Web Apps security, immutable-cache, and designed-404 policy. | `@claim:site-host-policy`; cold live unknown-route 404. |
| F-1-24 | Kept h1 focus and polite route announcements. | `document routes focus and announce their page heading`; cold live route checks. |
| F-1-25 | Kept the complete shared footer on every route. | `every route has the complete shared footer`; cold live route checks. |
| F-1-26 | Kept the result-naming “Copy install command” control. | `mobile first screen keeps its heading, install control, and actions inside the viewport`; live home screenshot. |
| F-2-1 | Kept all hero controls inside a 390px viewport. | Phone e2e bounds test; `live-home/screenshot-mobile.png`. |
| F-2-2 | Kept the shared How it works/Demo/Privacy/Terms header. | `every route shares the same primary navigation and labels off-site links`; cold live route checks. |
| F-2-3 | Kept GitHub/Sociobot names on off-site links. | `every route shares the same primary navigation and labels off-site links`; cold live `/privacy/`. |
| F-2-4 | Kept `credential` as the consistent explanatory term. | `.factory/copy-audit.md`; cold live `/`. |
| F-2-5 | Kept plain local-execution and credential-like-text wording. | `@claim:cli-no-network`, `@claim:detection-methods`; cold live `/`. |
| F-3-1 | Kept the complete redacted sample path in the opening 390px demo viewport. | `mobile direct demo shows its completed sample path before scrolling`; `live-demo/screenshot-mobile.png`; live result y=617.97–820.66. |
| F-3-2 | Kept all three product facts in the opening 390px home viewport. | `mobile first screen keeps all three plain product facts in view`; `live-home/screenshot-mobile.png`; live facts end y=825.67. |
| F-3-3 | Kept the direct allowlist instruction and retained-findings sentence. | `.factory/copy-audit.md`; `@claim:allowlists`; cold live `/`. |
| F-4-1 | Replaced “Path / missing sink” and “This path ends here.” with literal page-not-found wording. | `the designed 404 plainly says that the page was not found`; `live-404/screenshot-mobile.png`; cold live `/404/` and unknown-route HTTP 404. |

## Live evidence

- [Live home verifier](/work/repo/.factory/evidence/polish-4/live-home/verify.json): title, lang, h1, main, image alts, labels, and console all clean.
- [Live demo verifier](/work/repo/.factory/evidence/polish-4/live-demo/verify.json): direct `?demo=1` enters the demo document cleanly.
- [Live 404 phone screenshot](/work/repo/.factory/evidence/polish-4/live-404/screenshot-mobile.png): the fixed literal 404 route.
- [Live Lighthouse report](/work/repo/.factory/evidence/polish-4/live-lighthouse.json): mobile Performance 100, Accessibility 100, FCP 1,059ms, LCP 1,209ms, CLS 0.0016, 76,232 total bytes.

The live privacy recheck entered `/?demo=1` from a new context, found the
sample result inside the first 844px, edited a unique value, confirmed that it
was not in the result, reset to `demo-river-9347`, observed 16 same-origin
requests only, found empty local/session storage and cookies, then ran the
clear sample while offline. No acceptance finding remains open.
