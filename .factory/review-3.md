# Adversarial first-read review 3 — Secret Exposure Path

Date: 2026-08-28
Live URL: <https://secret-exposure-path.sociobot.in/>
Verdict: **FAIL**

This was a full fresh review. It used new Chromium contexts at 390 × 844 and
1440 × 960, a new clean checkout at `/tmp/sep-review3.pw3WiH/repo`, and the
deployed site rather than local source for visitor-facing checks.

## Cold first read

Before scrolling, at both widths, the page says:

> “Trace credentials before they reach logs.”
>
> “For developers and CI teams, it maps declared credentials into command
> output, Git diffs, and artifacts.”
>
> “Try it with sample data” — “Loads a ready exposed path.”

I can answer all three required questions: it traces declared credentials to
possible log, Git-diff, and artifact exposures; it is for developers and CI
teams; click **Try it with sample data** first. The first-read wording itself
passes. The phone layout has no horizontal overflow.

## Findings

### Blocking

| ID | Exact quote/location | Why this fails | Concrete fix |
| --- | --- | --- | --- |
| F-3-1 | Live `/?demo=1` at 390 × 844. The opening screen says “Trace the ready sample path.” and begins a `DEMO TRACE / 0.1` card. The completed result “1 exposed path”, “Value redacted. Fingerprint and locations only.”, and the source → command → sink path begin at **y=1442px**, below the first viewport. | The one-click path is isolated and seeded, but its first phone screen does not already show the product being used with realistic sample data. A visitor sees the banner, heading, explanation, and only the top of a card; they must scroll about 598px before seeing the actual exposed path. This is a weak demo under the mandatory demo contract. | Put a compact completed sample result (redacted value, source, command, and sink) in the initial viewport. Keep the editable source/sink fields below it or collapse the header/banner on small screens. Add a 390 × 844 test that asserts the completed result’s bottom is within the viewport after opening `?demo=1`. |

### Medium

| ID | Exact quote/location | Why this fails | Concrete fix |
| --- | --- | --- | --- |
| F-3-2 | Live `/` at 390 × 844. The mandated three facts are “Free under MIT”, “Browser demo has no telemetry”, and “Loaded demo survives a disconnect”. Their top positions are **838px**, **838px**, and **866px** respectively; the viewport ends at 844px. | The primary action is visible, but the first screen does not contain the promised three plain facts about price/privacy/offline behaviour. A phone visitor has to scroll to learn the privacy boundary, despite this being a security tool. | Reduce vertical spacing or place the three facts directly below the CTA in one compact, wrapping group. Add a mobile first-screen test for all three fact bounds, not only the headline and controls. |

### Minor

| ID | Exact quote/location | Why this fails | Concrete fix |
| --- | --- | --- | --- |
| F-3-3 | Landing limits copy: “Narrow fingerprint and path allowlists tame known fixtures without hiding every result.” | “Tame” is metaphorical and “fixtures” is internal testing jargon. A first-time reader cannot tell when to use the feature. | Rewrite as: **“Allowlist a fingerprint or path for an accepted test result. Other findings stay visible.”** Retain the existing `allowlists` claim test. |

## Copy audit

Counts treat commands, URLs, numbers, and hyphenated terms as one word.
Navigation labels, field labels, code blocks, and decorative coordinate labels
are excluded because they are not sentences. No sentence exceeds 22 words.
F-3-3 is the only copy flag.

### Landing page

| Words | Sentence | Result |
| ---: | --- | --- |
| 4 | Runs on your computer. | pass |
| 6 | Trace credentials before they reach logs. | pass |
| 15 | For developers and CI teams, it maps declared credentials into command output, Git diffs, and artifacts. | pass |
| 5 | Loads a ready exposed path. | pass |
| 3 | Free under MIT. | pass |
| 5 | Browser demo has no telemetry. | pass |
| 5 | Loaded demo survives a disconnect. | pass |
| 6 | Credential values stay out of reports. | pass |
| 7 | Reports contain a 12-character fingerprint and location. | pass |
| 5 | Scan every output you name. | pass |
| 15 | `sep` reads only the sources and outputs you name, plus staged and unstaged Git diffs. | pass |
| 4 | It maps exact matches. | pass |
| 14 | It also flags text that looks like a credential but has no declared source. | pass |
| 9 | Dotenv files and selected environment variables become in-memory candidates. | pass |
| 11 | Output is captured, scanned, redacted, and then forwarded to your terminal. | pass |
| 11 | Findings link source → command → log, artifact, working tree, or staged diff. | pass |
| 5 | Watch the bundled sample trace. | pass |
| 6 | This transcript comes from `sep demo`. | pass |
| 13 | The command creates a temporary sample workspace and runs the production tracing engine. | pass |
| 8 | Run the same isolated sample with `sep demo`. | pass |
| 5 | Add `--json` for machine-readable output. | pass |
| 6 | Test a path in this tab. | pass |
| 12 | This small browser model uses the same declared-value idea as the CLI. | pass |
| 10 | Change either side to test exposed, clear, and error states. | pass |
| 9 | The loaded lab works if your connection drops. | pass |
| 6 | Input stays only in this tab. | pass |
| 8 | Edit the sample or run the ready trace. | pass |
| 8 | Run the scan locally or in CI. | pass |
| 6 | No finding reached a scanned sink. | pass |
| 11 | Use the stable exit code to stop CI before publishing or committing. | pass |
| 6 | The scan could not start. | pass |
| 6 | Check the source path and command. | pass |
| 5 | What this tool cannot detect. | pass |
| 13 | Exact tracking stops when a value is encrypted, split, or transformed beyond recognition. | pass |
| 5 | Shape-only findings are labeled `unattributed`. | pass |
| 12 | Narrow fingerprint and path allowlists tame known fixtures without hiding every result. | F-3-3 |
| 5 | Trace declared credential paths locally. | pass |
| 13 | Add a credential-like variable name and a value of at least 8 characters. | pass |
| 6 | Comparing declared values with the sink… | pass |
| 6 | No declared value reached this sink. | pass |
| 2 | Value redacted. | pass |
| 4 | Fingerprint and locations only. | pass |
| 9 | This browser does not provide the local hashing API. | pass |
| 4 | Try a current browser. | pass |
| 8 | Connection dropped — this loaded lab still works. | pass |

The visible headings name their sections and actions rather than using mood or
brand-lore copy. Buttons name their results: **Copy install command**, **Try it
with sample data**, **Read the CLI guide**, **Trace paths**, **Load clear
sample**, and **Reset demo**. The demo-contract-required **Start for real** is
appropriately an exit action.

### README

| Words | Sentence | Result |
| ---: | --- | --- |
| 6 | `sep` traces a credential you name. | pass |
| 9 | It checks command output, Git diffs, and named artifacts. | pass |
| 6 | Reports show redacted fingerprints and locations. | pass |
| 6 | The CLI makes no network calls. | pass |
| 8 | Tested report flows do not print declared values. | pass |
| 10 | For developers and CI teams using agents or build scripts. | pass |
| 12 | Check a credential path before it reaches a log, artifact, or commit. | pass |
| 8 | Install from source with Rust 1.85 or newer. | pass |
| 7 | Registry publication is a Param Factory action. | pass |
| 6 | Check the package with `cargo package`. | pass |
| 8 | Try the complete workflow with bundled fake data. | pass |
| 10 | It creates an isolated temporary workspace and prints its path. | pass |
| 12 | The browser demo at secret-exposure-path.sociobot.in/?demo=1 loads an exposed path in one click. | pass |
| 4 | Edits stay in memory. | pass |
| 8 | Reloading or choosing Start for real discards them. | pass |
| 14 | Trace a command with a dotenv source, a named artifact, and both Git diffs. | pass |
| 7 | Repeat `--source` or `--output` to add inputs. | pass |
| 8 | Read an environment variable without printing its value. | pass |
| 7 | JSON mode writes one report to stdout. | pass |
| 6 | Redacted command output goes to stderr. | pass |
| 5 | Exit `10` blocks an exposure. | pass |
| 8 | Inspect existing sinks without running a child command. | pass |
| 8 | Add a known fixture fingerprint to an allowlist. | pass |
| 6 | Options can also live in `.seppath.toml`. | pass |
| 4 | Exit `0` means clear. | pass |
| 4 | Exit `10` means exposed. | pass |
| 8 | Exit `2` means the scan could not start. | pass |
| 9 | A clear `sep run` returns the child command status. | pass |
| 5 | `sep` matches declared in-memory values. | pass |
| 14 | It also flags text that looks like a credential but has no declared source. | pass |
| 13 | A declared value in command arguments stops the child command before it starts. | pass |
| 5 | That report redacts the value. | pass |
| 12 | Encoding, encryption, splitting, short values, or unsupported transformations can break exact tracking. | pass |
| 9 | A shape match without a declared source is `unattributed`. | pass |
| 6 | Use narrow fingerprint and path allowlists. | pass |
| 9 | This tool complements a credential manager and repository scanner. | pass |
| 9 | `npm test` runs the Rust suite and site checks. | pass |
| 7 | `npm run build` produces `target/release/sep` and `dist/site/`. | pass |
| 7 | Run the site with `npm run dev`. | pass |
| 7 | Deploy `dist/site/` as the static site root. | pass |
| 13 | Its configuration sets security headers, immutable asset caching, and the designed 404 response. | pass |
| 13 | The browser demo has no telemetry, persistent storage, hosted scripts, or hosted fonts. | pass |
| 14 | See `.factory/claims.json` for executable checks, `LICENSE` for MIT terms, and `CHANGELOG.md` for release notes. | pass |

## Demo and sandbox

The CTA reaches `/?demo=1` in one click and redirects to the separate
`/demo/?demo=1` document. The persistent banner is exactly **“Demo — sample
data, nothing is saved”** and includes **Reset demo** and **Start for real**.
The seeded source is `demo:.env.local`; its seeded sink is
`demo:dist/release.log`.

I entered `review3-only-value` into both fields, traced it, and reset. It was
not present in the visible result. Reset restored `DEPLOY_TOKEN=demo-river-9347`.
Cookies, localStorage, and sessionStorage stayed empty; the request log
contained only `https://secret-exposure-path.sociobot.in` document and static
asset requests. The browser demo therefore passes isolation and privacy checks.
It fails only F-3-1’s initial-viewport presentation requirement.

From a separate temporary current directory, the clean-clone binary ran:

```sh
/tmp/sep-review3.pw3WiH/repo/target/debug/sep demo --json
```

It produced one redacted finding and created the distinct workspace
`/tmp/secret-exposure-path-demo-7886-0`; it did not use the caller’s directory.

## Claims and clean-clone verification

I read `.factory/claims.json` (24 entries) and ran every exact listed command
separately from the clean clone:

```sh
npm run test:claims -- --grep @claim:<id>
```

All passed: `cli-path-redaction`, `fingerprint-format`, `declared-boundary`,
`detection-methods`, `source-types`, `command-forwarding`, `sink-paths`,
`json-ci-contract`, `browser-model`, `clear-result`, `exit-code-contract`,
`detection-limits`, `allowlists`, `multiple-inputs`, `inspect-mode`,
`preflight-redaction`, `report-redaction`, `site-host-policy`, `cli-demo`,
`browser-private`, `cli-no-network`, `mit-license`, `offline-loaded-demo`, and
`false-positive-rate`.

`npm test`, `npm run build`, and `npm run test:e2e` also passed in that clone;
the e2e run reported 54 passed and no failed tests. The page’s claim-like
landing statements have a corresponding claim entry, including MIT, no
telemetry/no persistence, offline-after-load, report redaction, fingerprint
format, scan scope, detection modes, CLI demo, exit status, limits, and
allowlists. There are no failing, untested, or unlisted claim findings.

## History, structure, and leverage

I read `.factory/review-1.md`, `.factory/review-2.md`, `.factory/polish-1.md`,
`.factory/polish-2.md`, and the prior handoff and verification records.
F-1-1 through F-1-26 and F-2-1 through F-2-5 are actually fixed live and in
the current code/tests: in particular, terminology is now consistently
“credential”, the mobile child bounds are within the viewport, the four-link
header is shared, external links name GitHub/Sociobot, route changes focus and
announce the new h1, and each route has the complete footer. The new F-3-1
through F-3-3 findings are not prior IDs relabelled as fixed.

`/`, `/demo/`, `/privacy/`, `/terms/`, and `/404/` each have route-specific
titles, descriptions, canonicals, OG/Twitter metadata, favicon, `lang="en"`,
one h1, and one main landmark. An unknown URL returns the designed 404 with
HTTP 404. Direct URLs, Demo navigation, and Back restore the route and focus
the h1. The robots file, sitemap, favicon, social card, internal routes,
GitHub repository/issues, and Sociobot footer target returned 200. No console
or page errors occurred on the five normal routes.

The site’s dark grid, translucent source/command/sink prisms, restrained route
motion, and original local art implement the documented luminous-glass trace
identity; this is not a generic SaaS template. There is no AI feature, provider
key, decorative AI, import/export, or sync gap implied by this local-first CLI;
`sep demo`, JSON mode, and the browser lab supply the useful trial and
automation paths.

## What would make this perfect

Make the completed demo result visible immediately on a 390px phone, show all
three plain product facts before scrolling, and replace the one metaphorical
allowlist sentence. Re-run this complete fresh review after deployment. Until
then the correct verdict is **FAIL**.
