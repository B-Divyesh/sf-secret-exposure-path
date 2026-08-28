# Adversarial first-read review 5 — Secret Exposure Path

Date: 2026-08-28  
Live URL: <https://secret-exposure-path.sociobot.in/>  
Verdict: **PASS**

This was a full fresh review, not a diff review. I used new Chromium contexts at
390 × 844 and 1440 × 960, the deployed site, and a clean clone at
`/tmp/sep-review5.2Dw4Xn/repo`.

## Cold first read

Before scrolling, both target widths state:

> “Trace credentials before they reach logs.”
>
> “For developers and CI teams, it maps declared credentials into command
> output, Git diffs, and artifacts.”
>
> “Try it with sample data” — “Loads a ready exposed path.”

The job is clear: trace a declared credential before it appears in a log, Git
diff, or artifact. The audience is developers and CI teams. Click **Try it
with sample data** first. This passes at phone and desktop widths.

At 390px, the h1, install control, action group, and facts fit x=16–374; the
facts end at y=825.67 in the 844px viewport. No console or page errors
occurred. The dark glass source/command/sink landscape and original local art
match the documented visual thesis and are not a generic SaaS template.

## Demo and sandbox

**Pass.** Clicking the first CTA from a fresh 390px context reached
`/demo/?demo=1` in one action. The first viewport showed the complete sample at
y=617.97–820.66: one exposed path, a redacted value, source, command, sink,
and 12-character fingerprint. The persistent banner was exactly **“Demo —
sample data, nothing is saved”** with **Reset demo** and **Start for real**.

I entered `review-unique-2026` in both inputs, traced it, and confirmed that
the result did not contain that value. Reset restored the fake exposed sample.
Cookies, localStorage, and sessionStorage were empty. The request log contained
only same-origin document and static-asset requests; no input left the origin.
After `context.setOffline`, **Load clear sample** returned “No declared value
reached this sink.” Current code holds demo data only in memory and does not
use browser storage APIs.

From a separate empty temporary caller directory, clean-clone
`target/debug/sep demo --json` created
`/tmp/secret-exposure-path-demo-8200-0`, reported one redacted finding, and
left the caller empty. The CLI demo is isolated from real workspace data.

## Claims and clean-clone verification

I read all 24 `.factory/claims.json` entries and ran every exact selector
separately:

```sh
npm run test:claims -- --grep @claim:<id>
```

All passed: `cli-path-redaction`, `fingerprint-format`, `declared-boundary`,
`detection-methods`, `source-types`, `command-forwarding`, `sink-paths`,
`json-ci-contract`, `browser-model`, `clear-result`, `exit-code-contract`,
`detection-limits`, `allowlists`, `multiple-inputs`, `inspect-mode`,
`preflight-redaction`, `report-redaction`, `site-host-policy`, `cli-demo`,
`browser-private`, `cli-no-network`, `mit-license`, `offline-loaded-demo`,
and `false-positive-rate`.

`npm test`, `npm run build`, and `npm run test:e2e` also passed in that
clone. The build produced `target/release/sep` and `dist/site/`; the browser
suite had no failed tests. Every visitor-reliable landing/README statement maps
to a registered claim for scope, redaction, fingerprint format, exit behaviour,
limits, allowlists, demo, privacy, offline use, license, or host policy. There
is no failing, untested, or unlisted claim finding.

## Copy audit

Counts treat commands, URLs, numbers, and hyphenated terms as one word.
Navigation labels, code samples, field labels, and image alt text are excluded
when they are not sentences. Every item is at or below 22 words. No item uses a
banned marketing adjective, unexplained metaphor, inconsistent credential term,
or non-result-naming action.

### Landing page

| Words | Sentence or control | Result |
| ---: | --- | --- |
| 4 | Runs on your computer. | pass |
| 6 | Trace credentials before they reach logs. | pass |
| 15 | For developers and CI teams, it maps declared credentials into command output, Git diffs, and artifacts. | pass |
| 3 | Copy install command | pass |
| 5 | Try it with sample data | pass |
| 5 | Loads a ready exposed path. | pass |
| 4 | Read the CLI guide | pass |
| 3 | Free under MIT | pass |
| 5 | Browser demo has no telemetry | pass |
| 5 | Loaded demo survives a disconnect | pass |
| 6 | Credential values stay out of reports. | pass |
| 7 | Reports contain a 12-character fingerprint and location. | pass |
| 5 | Scan every output you name. | pass |
| 15 | `sep` reads only the sources and outputs you name, plus staged and unstaged Git diffs. | pass |
| 4 | It maps exact matches. | pass |
| 14 | It also flags text that looks like a credential but has no declared source. | pass |
| 2 | Declare sources | pass |
| 9 | Dotenv files and selected environment variables become in-memory candidates. | pass |
| 3 | Wrap the command | pass |
| 11 | Output is captured, scanned, redacted, and then forwarded to your terminal. | pass |
| 3 | Trace each sink | pass |
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
| 3 | Trace paths | pass |
| 4 | Load clear sample | pass |
| 8 | Run the scan locally or in CI. | pass |
| 1 | Clear | pass |
| 6 | No finding reached a scanned sink. | pass |
| 2 | Exposure found | pass |
| 11 | Use the stable exit code to stop CI before publishing or committing. | pass |
| 3 | Could not scan | pass |
| 6 | The scan could not start. | pass |
| 6 | Check the source path and command. | pass |
| 5 | What this tool cannot detect. | pass |
| 13 | Exact tracking stops when a value is encrypted, split, or transformed beyond recognition. | pass |
| 5 | Shape-only findings are labeled `unattributed`. | pass |
| 10 | Allowlist a fingerprint or path for an accepted test result. | pass |
| 4 | Other findings stay visible. | pass |
| 7 | Read the detection limits on GitHub | pass |
| 5 | Trace declared credential paths locally. | pass |

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

## History, structure, and leverage

I read `.factory/review-1.md` through `.factory/review-4.md`, every
`.factory/polish-*.md`, and the prior handoff. Every previous issue was checked
against the live site and current source/tests, not accepted from its status.

| Earlier finding | Confirmed current state |
| --- | --- |
| F-1-1 | `fingerprint-format` confirms the live 12-character fingerprint and locations. |
| F-1-2 | `declared-boundary` confirms named sources and working/staged diffs. |
| F-1-3 | `detection-methods` confirms literal and credential-like text detection. |
| F-1-4 | `source-types` confirms dotenv and environment sources. |
| F-1-5 | `command-forwarding` confirms redaction and child status. |
| F-1-6 | `sink-paths` confirms command, log, artifact, working, and staged paths. |
| F-1-7 | `json-ci-contract` confirms JSON stdout, redacted stderr, and exit 10. |
| F-1-8 | `browser-model` confirms local trace/redaction and unsupported crypto feedback. |
| F-1-9 | `clear-result` confirms the clear result. |
| F-1-10 | `exit-code-contract` confirms clear, exposed, cannot-scan, and child exits. |
| F-1-11 | The cannot-scan remedy is direct and covered by exit fixtures. |
| F-1-12 | `detection-limits` confirms transform/split limits and `unattributed`. |
| F-1-13 | `allowlists` confirms CLI/TOML suppression retains other findings. |
| F-1-14 | “Scan every output you name.” remains direct and contextual. |
| F-1-15 | “Run the scan locally or in CI.” remains direct and contextual. |
| F-1-16 | “What this tool cannot detect.” names the limitation. |
| F-1-17 | README scope is concise and source/sink behaviour is tested. |
| F-1-18 | README audience wording is concise. |
| F-1-19 | `multiple-inputs` passes. |
| F-1-20 | `inspect-mode` passes. |
| F-1-21 | `preflight-redaction` passes. |
| F-1-22 | `report-redaction` covers source, command, JSON, report, and error flows. |
| F-1-23 | `site-host-policy` covers static-host security/cache/404 policy. |
| F-1-24 | Forward navigation and Back focus and announce the destination h1. |
| F-1-25 | Every route has the complete shared footer. |
| F-1-26 | The visible install action says “Copy install command.” |
| F-2-1 | Phone hero children fit in the viewport. |
| F-2-2 | All routes share the four-link primary navigation. |
| F-2-3 | Off-site links visibly name GitHub or Sociobot. |
| F-2-4 | Explanatory copy consistently uses “credential.” |
| F-2-5 | Local execution and credential-like text are plain. |
| F-3-1 | The completed demo path is in the opening phone viewport. |
| F-3-2 | All three first-screen facts are in the opening phone viewport. |
| F-3-3 | The allowlist instruction is direct and non-metaphorical. |
| F-4-1 | The 404 says “Page not found” and “This page was not found.” |

Live `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404/` each return 200
with one h1/main, title pattern, description, canonical, OG/Twitter metadata,
favicon, stable header, and full footer. An unknown route returns the designed
404 with HTTP 404. Direct routes, forward navigation, and Back focus the h1.
`robots.txt`, `sitemap.xml`, all internal links, GitHub links, and Sociobot
returned 200. Live CSP, Permissions-Policy, Referrer-Policy, and nosniff
headers are present. Axe serious/critical checks pass in the browser suite.

No AI feature is implied by this privacy-first local CLI: it would weaken the
local boundary without improving source-to-sink tracing. The CLI demo, browser
lab, and JSON output provide the implied trial and CI automation paths. No
import/export, sync, decorative AI, or provider-key gap was found.

## What would make this perfect

Keep the current direct first-read copy, isolated sample path, and claim suite
intact as the product evolves. Any new visitor-reliable promise should receive
a tagged clean-sandbox claim test before release. There are no findings.

