# Polish 1 — adversarial review repair map

Candidate repaired: `591878e1c2b9a7f7292eb73a48b0bf657cdf5a08`  
Review source: `.factory/review-1.md`  
Local visual evidence: `.factory/evidence/polish-1/local-home-390.png`,
`.factory/evidence/polish-1/local-demo-390.png`, and
`.factory/evidence/polish-1/local-privacy.png`.
Live re-check: <https://secret-exposure-path.sociobot.in/> served the repaired
heading and install label after deployment; live screenshots and response proof
are in `.factory/evidence/polish-1/`.

All claim commands were run separately from a clean clone of this commit.
`npm test`, `npm run test:e2e`, `npm run build`, `cargo fmt --check`,
`cargo clippy --all-targets -- -D warnings`, and `cargo package --allow-dirty
--no-verify` also passed there. The clean browser run was 50/50; the separate
claim loop was 24/24.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Registered `fingerprint-format`; reports retain the 12-hex fingerprint and source/sink line locations. | `@claim:fingerprint-format` |
| F-1-2 | Registered `declared-boundary`; fresh Git fixture checks only a named source while both working and staged diffs are scanned. | `@claim:declared-boundary` |
| F-1-3 | Registered literal tracing and unattributed shape detection. | `@claim:detection-methods` |
| F-1-4 | Registered dotenv and `--from-env` candidate loading. | `@claim:source-types` |
| F-1-5 | Registered redacted command forwarding and clear child exit preservation. | `@claim:command-forwarding` |
| F-1-6 | Registered source → command → stdout/artifact/working/staged sink paths. | `@claim:sink-paths` |
| F-1-7 | Registered the JSON stdout, redacted stderr, and exit-10 CI contract. | `@claim:json-ci-contract` |
| F-1-8 | Registered normal browser tracing/redaction and the unavailable-hash error branch. | `@claim:browser-model` |
| F-1-9 | Reworded the landing clear state and registered a clear, shape-free fixture. | `@claim:clear-result` |
| F-1-10 | Registered all public exit outcomes: 0, 10, 2, and clear child status. | `@claim:exit-code-contract` |
| F-1-11 | Reworded the error card with the actionable source-path/command remedy; missing-source and start failure are covered by the exit contract. | `@claim:exit-code-contract` |
| F-1-12 | Registered transformed/split limits and unattributed shape behavior. | `@claim:detection-limits` |
| F-1-13 | Registered CLI fingerprint and TOML path allowlists with one retained finding. | `@claim:allowlists` |
| F-1-14 | Replaced the context-free heading with “Scan every output you name.” | `npm run test:e2e`; local mobile screenshot |
| F-1-15 | Replaced vague install heading with “Run the scan locally or in CI.” | `npm run test:e2e`; local mobile screenshot |
| F-1-16 | Replaced metaphorical limits heading with “What this tool cannot detect.” | `npm run test:e2e`; local mobile screenshot |
| F-1-17 | Rewrote README opening and usage scope into short, plain sentences; claims now cover named sources/sinks. | README audit; `@claim:declared-boundary`, `@claim:sink-paths` |
| F-1-18 | Rewrote README audience statement into two short sentences. | `.factory/copy-audit.md` |
| F-1-19 | Registered repeatable source/output behavior. | `@claim:multiple-inputs` |
| F-1-20 | Registered `inspect` without a child command. | `@claim:inspect-mode` |
| F-1-21 | Registered preflight refusal before a sentinel child can start. | `@claim:preflight-redaction` |
| F-1-22 | Qualified the README promise to tested flows and registered source, command, JSON, report, and error redaction. | `@claim:report-redaction` |
| F-1-23 | Registered the shipped Static Web Apps security/cache/404 configuration. | `@claim:site-host-policy` |
| F-1-24 | Every document route focuses its h1 and updates a polite route announcement after navigation. | `document routes focus and announce their page heading` (desktop + mobile) |
| F-1-25 | Privacy, Terms, and 404 now use the complete product footer: one-liner/version, Privacy, Terms, and Param Factory. | `every route has the complete shared footer` (desktop + mobile) |
| F-1-26 | Changed the visible install control from “Copy” to “Copy install command.” | `npm run test:e2e`; local mobile screenshot |

The demo remains an isolated in-memory `demo:` experience at `/demo/`; its
banner, reset, and Start-for-real exit are unchanged and are covered by
`@claim:browser-private`, `@claim:offline-loaded-demo`, and the browser suite.
