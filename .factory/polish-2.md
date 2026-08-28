# Polish 2 — cumulative adversarial repair map

Review sources: `.factory/review-1.md`, `.factory/review-2.md`, and
`.factory/polish-1.md`. This round retains every earlier repair and closes all
round-2 findings. Browser evidence: `local-home-390.png`, `local-demo-390.png`,
and `local-home-desktop.png` in `.factory/evidence/polish-2/`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained 12-character fingerprints and source/sink locations. | `@claim:fingerprint-format` |
| F-1-2 | Retained declared-source boundary and staged/unstaged diff coverage. | `@claim:declared-boundary` |
| F-1-3 | Retained exact and unattributed text-that-looks-like-a-credential detection. | `@claim:detection-methods` |
| F-1-4 | Retained dotenv and selected environment source coverage. | `@claim:source-types` |
| F-1-5 | Retained redacted command forwarding and child-status coverage. | `@claim:command-forwarding` |
| F-1-6 | Retained source → command → artifact/working/staged sink coverage. | `@claim:sink-paths` |
| F-1-7 | Retained JSON stdout, redacted stderr, and exit-10 CI contract. | `@claim:json-ci-contract` |
| F-1-8 | Retained local browser trace/redaction and unavailable-hash state. | `@claim:browser-model` |
| F-1-9 | Retained clear-result semantics and fixture. | `@claim:clear-result` |
| F-1-10 | Retained clear/exposed/cannot-scan/child exit behavior. | `@claim:exit-code-contract` |
| F-1-11 | Retained actionable cannot-scan copy and source/start failure coverage. | `@claim:exit-code-contract` |
| F-1-12 | Retained transformed/split limits and `unattributed` coverage. | `@claim:detection-limits` |
| F-1-13 | Retained CLI/TOML fingerprint and path allowlists with retained findings. | `@claim:allowlists` |
| F-1-14 | Retained the direct workflow heading. | `npm run test:e2e` |
| F-1-15 | Retained the direct install heading. | `npm run test:e2e` |
| F-1-16 | Retained the explicit limits heading. | `npm run test:e2e` |
| F-1-17 | Retained concise README scope and claimed sink coverage. | `@claim:declared-boundary`, `@claim:sink-paths` |
| F-1-18 | Retained concise audience copy. | `.factory/copy-audit.md` |
| F-1-19 | Retained repeated source/output coverage. | `@claim:multiple-inputs` |
| F-1-20 | Retained `inspect` without a child process. | `@claim:inspect-mode` |
| F-1-21 | Retained preflight refusal before a child starts. | `@claim:preflight-redaction` |
| F-1-22 | Retained declared values out of tested report flows. | `@claim:report-redaction` |
| F-1-23 | Retained deploy security/cache/404 configuration coverage. | `@claim:site-host-policy` |
| F-1-24 | Retained document-route heading focus and polite announcements. | `document routes focus and announce their page heading` |
| F-1-25 | Retained complete shared footer on every route. | `every route has the complete shared footer` |
| F-1-26 | Retained the visible `Copy install command` result label. | `npm run test:e2e` |
| F-2-1 | Made the hero grid child shrink and wrapped install/actions; added a 390px child-bounds test. | `mobile first screen keeps its heading, install control, and actions inside the viewport`; `local-home-390.png` |
| F-2-2 | Replaced route-specific headers with How it works / Demo / Privacy / Terms everywhere. | `every route shares the same primary navigation`; local route checks |
| F-2-3 | Named GitHub in the detection-limits and privacy-issue links. | `every route shares the same primary navigation and labels off-site links` |
| F-2-4 | Replaced competing `secrets` landing wording with `credentials`. | `.factory/copy-audit.md`; first-screen e2e test |
| F-2-5 | Rewrote local execution and shape-detection wording in ordinary language. | `@claim:cli-no-network`; `@claim:detection-methods`; copy audit |

## Demo entry

The first CTA opens `/?demo=1`, which enters the separate in-memory
`/demo/?demo=1` sandbox. The 24-claim suite starts its privacy check at that
entry. `local-demo-390.png` records the banner, reset, Start for real,
completed path, and stable header. Live re-check target:
<https://secret-exposure-path.sociobot.in/?demo=1>.
