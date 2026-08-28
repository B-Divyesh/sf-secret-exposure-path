# Polish 3 — cumulative adversarial repair map

Candidate repaired: `a17c3e626f717d097c0f4311e24db5bba3f578a3`  
Review sources read in full: `.factory/review-1.md`, `.factory/review-2.md`,
`.factory/review-3.md`, `.factory/polish-1.md`, `.factory/polish-2.md`,
`.factory/verification.md`, and `.factory/verification-2.md`.

Fresh-consumer evidence came from
`/tmp/secret-exposure-path-polish3.xZrUiw/repo` after `npm ci`. Every one of
the 24 exact commands in `.factory/claims.json` passed separately; the full
browser suite reported **57 passed, 3 intentionally skipped desktop copies of
phone-only checks**. Local phone evidence is committed at
`.factory/evidence/polish-3/local-home-390.png` and
`.factory/evidence/polish-3/local-demo-390.png`.

Every row below was also cold-checked at
<https://secret-exposure-path.sociobot.in/> after deployment
`16c97937-e2d4-4a8c-860e-4e5182b1b6a7`. Fresh 390 × 844 contexts confirmed
`/`, `/demo/`, `/privacy/`, `/terms/`, and `/404/` each return 200, have one
`h1` and `main`, focus their `h1`, have route-specific titles, and have zero
serious or critical Axe issues. An unknown route returned the designed 404
with HTTP 404. The live screenshots are
`.factory/evidence/polish-3/live-home-390.png` and
`.factory/evidence/polish-3/live-demo-390.png`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept 12-character fingerprints with source and sink locations. | `@claim:fingerprint-format`; clean-clone claim command. |
| F-1-2 | Kept named-source boundaries and working/staged Git-diff scanning. | `@claim:declared-boundary`; clean-clone claim command. |
| F-1-3 | Kept literal matching and unattributed credential-like text detection. | `@claim:detection-methods`; clean-clone claim command. |
| F-1-4 | Kept dotenv and selected environment-variable sources. | `@claim:source-types`; clean-clone claim command. |
| F-1-5 | Kept redacted command forwarding and clear-child status handling. | `@claim:command-forwarding`; clean-clone claim command. |
| F-1-6 | Kept source → command → log, artifact, working-tree, and staged-diff paths. | `@claim:sink-paths`; clean-clone claim command. |
| F-1-7 | Kept JSON stdout, redacted stderr, and exposure exit `10`. | `@claim:json-ci-contract`; clean-clone claim command. |
| F-1-8 | Kept local browser tracing, redaction, and the unavailable-hashing state. | `@claim:browser-model`; clean-clone claim command. |
| F-1-9 | Kept the clear-result wording and shape-free fixture. | `@claim:clear-result`; clean-clone claim command. |
| F-1-10 | Kept clear, exposed, cannot-scan, and wrapped-child exit outcomes. | `@claim:exit-code-contract`; clean-clone claim command. |
| F-1-11 | Kept the actionable cannot-scan remedy and missing-source/start coverage. | `@claim:exit-code-contract`; clean-clone claim command. |
| F-1-12 | Kept transformed/split limits and the `unattributed` label. | `@claim:detection-limits`; clean-clone claim command. |
| F-1-13 | Kept CLI/TOML fingerprint and path allowlists with retained findings. | `@claim:allowlists`; clean-clone claim command. |
| F-1-14 | Kept the direct “Scan every output you name.” heading. | `home is usable, quiet in the console, and accessible`; local home screenshot. |
| F-1-15 | Kept the direct local/CI install heading. | `home is usable, quiet in the console, and accessible`; local home screenshot. |
| F-1-16 | Kept the explicit detection-limits heading. | `home is usable, quiet in the console, and accessible`; local home screenshot. |
| F-1-17 | Kept concise README scope and tested source/sink wording. | `@claim:declared-boundary`, `@claim:sink-paths`; clean clone. |
| F-1-18 | Kept concise README audience wording. | `.factory/copy-audit.md`; clean clone. |
| F-1-19 | Kept repeated source/output support. | `@claim:multiple-inputs`; clean-clone claim command. |
| F-1-20 | Kept non-child `inspect` mode. | `@claim:inspect-mode`; clean-clone claim command. |
| F-1-21 | Kept preflight refusal before the child starts. | `@claim:preflight-redaction`; clean-clone claim command. |
| F-1-22 | Kept source, command, JSON, report, and error redaction coverage. | `@claim:report-redaction`; clean-clone claim command. |
| F-1-23 | Kept Static Web Apps security, immutable-cache, and designed-404 policy. | `@claim:site-host-policy`; clean-clone claim command. |
| F-1-24 | Kept document-route heading focus and polite route announcement. | `document routes focus and announce their page heading`; clean-clone browser suite. |
| F-1-25 | Kept the shared complete footer on every document route. | `every route has the complete shared footer`; clean-clone browser suite. |
| F-1-26 | Kept “Copy install command” as the visible control label. | `mobile first screen keeps its heading, install control, and actions inside the viewport`; local home screenshot. |
| F-2-1 | Kept bounded hero children and additionally fit all three facts into the phone’s first screen. | `mobile first screen keeps its heading, install control, and actions inside the viewport`; `mobile first screen keeps all three plain product facts in view`; `local-home-390.png`. |
| F-2-2 | Kept the stable four-link shared header. | `every route shares the same primary navigation and labels off-site links`; clean-clone browser suite. |
| F-2-3 | Kept explicit GitHub wording for off-site links. | `every route shares the same primary navigation and labels off-site links`; clean-clone browser suite. |
| F-2-4 | Kept “credential” as the explanatory term. | `.factory/copy-audit.md`; `uses the stable primary navigation and plain credential copy`. |
| F-2-5 | Kept direct local-execution and credential-like-text language. | `.factory/copy-audit.md`; `@claim:detection-methods`. |
| F-3-1 | On phones, the real `#trace-result` moves directly below the trace header; editable fields follow it. The compact result still contains redaction, source, command, sink, and fingerprint. | `mobile direct demo shows its completed sample path before scrolling`; `local-demo-390.png`; result bounds y=617.97–820.66 in an 844px viewport. |
| F-3-2 | Reduced phone hero spacing while retaining all actions; all three plain facts now stay in the first viewport. | `mobile first screen keeps all three plain product facts in view`; `local-home-390.png`; fact bounds y=778.30–825.67 in an 844px viewport. |
| F-3-3 | Rewrote the allowlist instruction as “Allowlist a fingerprint or path for an accepted test result. Other findings stay visible.” | `uses the stable primary navigation and plain credential copy`; `.factory/copy-audit.md`; `@claim:allowlists`. |

## Demo and live re-check

`/?demo=1` still redirects in one action to the isolated in-memory
`/demo/?demo=1` document. The banner remains sticky on a phone after scrolling
to the editors; **Reset demo** restores the fake path and **Start for real**
leaves the sandbox. This is exercised by `@claim:browser-private`,
`@claim:offline-loaded-demo`, `demo resets in memory and is keyboard operable`,
and `demo banner remains available after a phone visitor scrolls to the
editors`.

The cold live check entered `/?demo=1`, reached `/demo/?demo=1`, verified the
completed result at y=617.97–820.66, reset a unique input, observed empty
local/session storage and 14 same-origin requests, then set the browser
offline and successfully ran clear and reset paths. The three live facts end
at y=825.67. Root CSP/permissions/referrer/nosniff headers and immutable
hashed-asset caching are live; robots, sitemap, favicon, social card, and
touch icon each return 200.
