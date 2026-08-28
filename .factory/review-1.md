# Adversarial first-read review 1 — Secret Exposure Path

Date: 2026-08-28
URL: <https://secret-exposure-path.sociobot.in/>
Verdict: **FAIL**

This was a fresh review, not a diff-only review. I used a clean clone of the
current commit for commands and fresh Chromium contexts for the live site.

## Cold first read

At 390 × 844 and 1440 × 960, before scrolling, the page says:

> “Trace secrets before they reach logs.”
>
> “For developers and CI teams, it maps declared credentials into command
> output, Git diffs, and artifacts.”
>
> “Try it with sample data” — “Loads a ready exposed path.”

The job is clear: trace a credential from a named source to potential leak
locations; it is for developers and CI teams; click **Try it with sample data**
first. This passes at both widths. There were no page or console errors. The
visual system is distinct and implements the documented luminous-glass trace
design rather than a generic SaaS template.

## Demo and sandbox

The CTA opens `/demo/` in one click and the first screen already shows one
redacted exposed path from `demo:.env.local` to `demo:dist/release.log`. The
persistent “Demo — sample data, nothing is saved” banner, **Reset demo**, and
**Start for real** are present. I entered a unique value, traced, reset, and
confirmed the fake sample returned. The unique value was absent from the result
and request URLs; cookies, localStorage, and sessionStorage remained empty;
all requests were same-origin. The browser demo passes the required isolation
check. The CLI demo, bundled samples, and terminal recording are also present.

## Claims and build evidence

Every claims command was run separately in the clean clone and passed:

| ID | Result |
| --- | --- |
| `cli-path-redaction` | `npm run test:claims -- --grep @claim:cli-path-redaction` — pass |
| `cli-demo` | `npm run test:claims -- --grep @claim:cli-demo` — pass |
| `browser-private` | `npm run test:claims -- --grep @claim:browser-private` — pass |
| `cli-no-network` | `npm run test:claims -- --grep @claim:cli-no-network` — pass |
| `mit-license` | `npm run test:claims -- --grep @claim:mit-license` — pass |
| `offline-loaded-demo` | `npm run test:claims -- --grep @claim:offline-loaded-demo` — pass |
| `false-positive-rate` | `npm run test:claims -- --grep @claim:false-positive-rate` — pass |

`npm test` and `npm run build` also passed in that clone. Registered claims are
therefore tested; the unlisted claims below still fail the claims contract.

## Copy audit

Counts use the plain-words convention: hyphenated terms, commands, and numbers
are one word. Navigation labels and code examples are not sentences. User-facing
runtime messages are included.

### Landing page

| Sentence | Words | Result |
| --- | ---: | --- |
| Trace secrets before they reach logs. | 6 | pass |
| For developers and CI teams, it maps declared credentials into command output, Git diffs, and artifacts. | 15 | pass |
| Loads a ready exposed path. | 5 | pass |
| Credential values stay out of reports. | 6 | pass |
| Reports contain a 12-character fingerprint and location. | 7 | F-1-1 |
| One command. | 2 | F-1-14 |
| Every declared exit. | 3 | F-1-14 |
| `sep` reads only the sources and outputs you name, plus staged and unstaged Git diffs. | 15 | F-1-2 |
| It maps exact matches and high-confidence credential shapes. | 8 | F-1-3 |
| Dotenv files and selected environment variables become in-memory candidates. | 9 | F-1-4 |
| Output is captured, scanned, redacted, and then forwarded to your terminal. | 11 | F-1-5 |
| Findings link source → command → log, artifact, working tree, or staged diff. | 11 | F-1-6 |
| Watch the bundled sample trace. | 5 | pass |
| This transcript comes from `sep demo`. | 6 | pass |
| The command creates a temporary sample workspace and runs the production tracing engine. | 13 | pass |
| Run the same isolated sample with `sep demo`. | 8 | pass |
| Add `--json` for machine-readable output. | 5 | F-1-7 |
| Test a path in this tab. | 6 | pass |
| This small browser model uses the same declared-value idea as the CLI. | 12 | F-1-8 |
| Change either side to test exposed, clear, and error states. | 10 | pass |
| Input stays only in this tab. | 6 | pass |
| Edit the sample or run the ready trace. | 8 | pass |
| A narrow interface for local and CI work. | 8 | F-1-15 |
| No source value or high-confidence shape reached a scanned sink. | 10 | F-1-9 |
| Use the stable exit code to stop CI before publishing or committing. | 11 | F-1-10 |
| A source is missing, unreadable, or the command could not start. | 11 | F-1-11 |
| A path map, not a vault. | 6 | F-1-16 |
| Exact tracking stops when a value is encrypted, split, or transformed beyond recognition. | 13 | F-1-12 |
| Shape-only findings are labeled `unattributed`. | 5 | F-1-12 |
| Narrow fingerprint and path allowlists tame known fixtures without hiding every result. | 12 | F-1-13 |
| Trace declared credential paths locally. | 5 | F-1-8 |
| Add a credential-like variable name and a value of at least 8 characters. | 13 | pass |
| Comparing declared values with the sink… | 6 | pass |
| No declared value reached this sink. | 6 | F-1-9 |
| Value redacted. | 2 | pass |
| Fingerprint and locations only. | 4 | F-1-1 |
| This browser does not provide the local hashing API. | 9 | F-1-8 |
| Try a current browser. | 4 | pass |
| The loaded lab works if your connection drops. | 9 | pass |
| Connection dropped — this loaded lab still works. | 8 | pass |

### README

| Sentence | Words | Result |
| --- | ---: | --- |
| `sep` is a local shell and CI wrapper that shows where a credential traveled: from an explicitly declared source file or environment variable into command output, a Git diff, or a generated artifact. | 33 | F-1-17 |
| Reports contain only redacted fingerprints and locations. | 7 | F-1-1 |
| The CLI makes no network calls. | 6 | pass |
| It does not write detected values to its reports. | 9 | pass |
| It is for developers and teams using coding agents, build scripts, and CI who want an answer before a secret lands in a log, artifact, or commit. | 27 | F-1-18 |
| Install from source with Rust 1.85 or newer. | 8 | pass |
| Registry publication is intentionally left to the Param Factory. | 9 | pass |
| The package can be checked with `cargo package`. | 8 | pass |
| Try the complete workflow with bundled fake data. | 8 | pass |
| This creates an isolated temporary workspace and prints its path. | 10 | pass |
| The browser demo at secret-exposure-path.sociobot.in/demo/ loads an exposed path in one click. | 12 | pass |
| Its edits stay in memory and are discarded on reload or when you select Start for real. | 17 | pass |
| Trace a command, loading candidate values from a dotenv file and scanning a declared artifact plus the staged and unstaged Git diff. | 22 | F-1-17 |
| Declare more than one source/output by repeating the option. | 9 | F-1-19 |
| Read a secret from an environment variable without exposing its value in the report. | 14 | F-1-4 |
| CI can consume one JSON document and use exit code `10` to block an exposure. | 15 | F-1-7 |
| Inspect existing sinks without running a command. | 7 | F-1-20 |
| Known false positive or accepted fixture? | 6 | pass |
| Add its redacted fingerprint to an allowlist. | 8 | F-1-13 |
| The fingerprint is shown in a prior report. | 8 | F-1-1 |
| Options may also live in `.seppath.toml`. | 6 | F-1-13 |
| Exit codes are stable: `0` means no exposure, `10` means at least one exposure, `2` means the scan could not run, and otherwise `sep run` returns the wrapped command’s failing exit code. | 33 | F-1-10 |
| In JSON mode command output stays redacted on stderr so stdout remains machine-readable. | 13 | F-1-7 |
| `sep` tracks exact in-memory values from declared dotenv files and environment variables, and separately flags high-confidence credential shapes in sinks. | 20 | F-1-3 |
| If a declared value appears literally in the planned command arguments, the preflight reports the path and refuses to start the command. | 22 | F-1-21 |
| It never recovers or prints a value. | 7 | F-1-22 |
| Encoding, encryption, splitting, very short values, or transformations it does not recognize can break a path. | 16 | F-1-12 |
| A shape match without a declared source is labeled `unattributed`. | 10 | F-1-12 |
| Review results and use narrow fingerprint/path allowlists; this complements a secret manager and repository scanner rather than replacing either. | 19 | F-1-13 |
| `npm test` runs the Rust suite and site checks. | 8 | pass |
| `npm run build` produces the release CLI in `target/release/sep` and the deployable site in `dist/site/`. | 15 | pass |
| Run the docs site locally with `npm run dev`. | 9 | pass |
| Deploy `dist/site/` as the static site root. | 7 | pass |
| Its `staticwebapp.config.json` defines security headers, immutable asset caching, and the designed 404 response. | 13 | F-1-23 |
| The browser demo has no telemetry, persistent storage, hosted scripts, or hosted fonts. | 13 | pass |
| See `.factory/claims.json` for executable claim checks, `LICENSE` for the MIT license, and `CHANGELOG.md` for release notes. | 16 | pass |

## Findings

### High

| ID | Exact quote/location | Why it fails | Concrete fix |
| --- | --- | --- | --- |
| F-1-1 | Landing signal/result and README: “Reports contain a 12-character fingerprint and location.” | The redaction claim does not assert 12 characters or locations. | Add `fingerprint-format` claim testing fingerprint length and source/sink locations, or remove that format promise. |
| F-1-2 | Landing workflow: “`sep` reads only the sources and outputs you name, plus staged and unstaged Git diffs.” | No claim proves the exclusive access boundary or both Git diff modes. | Add a tagged decoy-file/staged/unstaged test, or remove “only.” |
| F-1-3 | Landing/README: “It maps exact matches and high-confidence credential shapes.” | The claim test covers one literal artifact, not both methods. | Add literal and unattributed-shape claim fixtures, or remove the shape promise. |
| F-1-4 | Landing/README: “Dotenv files and selected environment variables become in-memory candidates.” | Neither source type is a registered observable claim. | Add one test for dotenv and one for `--from-env`, asserting redaction. |
| F-1-5 | Landing command step: “Output is captured, scanned, redacted, and then forwarded to your terminal.” | Four public behaviors lack a claim test. | Test redacted forwarded output and preserved command exit, or rewrite “The CLI checks command output.” |
| F-1-6 | Landing sink step: “Findings link source → command → log, artifact, working tree, or staged diff.” | Artifact is the only tested sink. | Test every named sink and the three-node path, or name only tested sinks. |
| F-1-7 | Landing/README JSON and CI statements. | Machine-readable stdout, stderr redaction, and exit 10 are unlisted. | Add `json-ci-contract` asserting one JSON stdout document, redacted stderr, and exit 10. |
| F-1-8 | Browser lab/footer: “This small browser model uses the same declared-value idea as the CLI.” / “Trace declared credential paths locally.” | Privacy testing does not prove parity, local hashing, or the stated unsupported-API error. | Add a browser-model claim, including the error branch, or keep only tested privacy copy. |
| F-1-9 | Landing status: “No source value or high-confidence shape reached a scanned sink.” | This clear-result conclusion has no claim entry. | Add declared-value and shape clear-path fixtures, or say “No finding in this sample.” |
| F-1-10 | Landing/README: “Use the stable exit code …” / “Exit codes are stable …” | The public 0/2/10/wrapped-exit contract is not registered. | Add an `exit-code-contract` claim for all four outcomes. |
| F-1-11 | Landing error card: “A source is missing, unreadable, or the command could not start.” | The stated error semantics lack a claim test. | Add those fixtures to `exit-code-contract`, or use “The scan could not start. Check the source path and command.” |
| F-1-12 | Landing/README detection limits and `unattributed` label. | Specific boundary behavior is honest but still untested public behavior. | Add fixtures for transformed/split values and `unattributed`, or make it a non-exhaustive warning. |
| F-1-13 | Landing/README allowlist statements. | TOML, command allowlists, and retained findings are untested claims. | Add a test with one suppressed and one retained finding for both config forms. |
| F-1-14 | h2: “One command. Every declared exit.” | “Declared exit” is unexplained and context-free in a heading list. | Rewrite **“Scan every output you name.”** |
| F-1-15 | h2: “A narrow interface for local and CI work.” | “Narrow interface” is vague product language. | Rewrite **“Run the scan locally or in CI.”** |
| F-1-16 | h2: “A path map, not a vault.” | It is metaphorical and does not name the limits. | Rewrite **“What this tool cannot detect.”** |
| F-1-17 | README opening (33 words) and Usage scope sentence. | The opening exceeds 22 words and makes untested source/sink promises. | Rewrite: **“`sep` traces a credential you name. It checks command output, Git diffs, and named artifacts.”** Add scope/sink claim tests. |
| F-1-18 | README audience sentence (27 words). | It exceeds the hard 22-word limit. | Rewrite: **“For developers and CI teams using agents or build scripts. Check a credential path before it reaches a log, artifact, or commit.”** |
| F-1-19 | README: “Declare more than one source/output by repeating the option.” | Capability is unlisted. | Add a multiple source/output claim test or remove it. |
| F-1-20 | README: “Inspect existing sinks without running a command.” | `inspect` behavior is unlisted. | Add a test proving no child command runs and inputs are scanned. |
| F-1-21 | README command-argument preflight sentence. | Preflight/refusal behavior is unlisted. | Add a test proving no child process runs and output is redacted. |
| F-1-22 | README: “It never recovers or prints a value.” | One artifact test is narrower than this universal promise. | Test source/output/JSON/error/preflight streams, or qualify it to the tested flow. |
| F-1-23 | README staticwebapp-config sentence. | Deployment behavior is claimed without a `claims.json` entry. | Add a site-config claim test or frame it as implementation documentation only. |

### Medium

| ID | Exact quote/location | Why it fails | Concrete fix |
| --- | --- | --- | --- |
| F-1-24 | Live `/` → `/demo/` and browser Back. | After both document navigations `document.activeElement` was `<body>`, not the new h1; no route announcement or focus move occurs. | Give each h1 `tabindex="-1"` and focus it on page load (while preserving fragment behavior), or implement equivalent route focus and live announcement. |
| F-1-25 | `/privacy/`, `/terms/`, `/404/` footers. | Privacy omits its Privacy link and the product one-liner; Terms omits Terms and the one-liner; 404 omits “Built by Param Factory.” | Use shared footer markup with one-liner, version/build id, Privacy, Terms, and factory link on every route. |

### Low

| ID | Exact quote/location | Why it fails | Concrete fix |
| --- | --- | --- | --- |
| F-1-26 | Hero install button: “Copy”. | The visible label does not name its result, although its accessible name does. | Change visible text to **“Copy install command.”** |

## Passing structure checks

`/`, `/demo/`, `/privacy/`, `/terms/`, and `/404/` return 200; an unknown URL
returns the designed 404 with HTTP 404. Each route has one h1/main, route title,
description, canonical, OG image, and favicon. Sitemap routes and every
landing link (including GitHub/Sociobot) return 200. The live root and hashed
JS have self-only CSP, Permissions-Policy, nosniff/referrer headers, and
immutable JS caching. These passes do not remove F-1-24/F-1-25.

## Earlier history

No earlier `.factory/review-*.md` or `.factory/polish-*.md` exists. I read both
verification reports and the handoff. Their prior failures are actually fixed
live and in code: claims contract/tests, one-click isolated demo, `sep demo`
with samples/recording, CSP/cache headers, first-screen audience/CTA, metadata
and 404, and the 100-command false-positive test. None regressed.

## Missed leverage

No AI step is implied by this privacy-first local CLI, and import/export/sync
is not implied by the brief. JSON output supplies the relevant automation path.

## What would make this perfect

Turn every visitor-reliable behavior into a sandboxed claim test or bounded
copy, shorten the three README sentences, repair headings/button text, and
complete route focus and the shared footer. Then repeat this entire review from
a fresh browser and clean clone. Until then the verdict remains **FAIL**.
