# Adversarial first-read review 4 — Secret Exposure Path

Date: 2026-08-28
Live URL: <https://secret-exposure-path.sociobot.in/>
Verdict: **FAIL**

This was a fresh full review, not a diff review. I used new Chromium contexts
at 390 × 844 and 1440 × 960, a clean checkout at
`/tmp/sep-review4.FR3tjN/repo`, and the deployed site for visitor checks.
Only this report and the handoff are changed by this work order.

## Cold first read

Before scrolling, both target widths say:

> “Trace credentials before they reach logs.”
>
> “For developers and CI teams, it maps declared credentials into command
> output, Git diffs, and artifacts.”
>
> “Try it with sample data” — “Loads a ready exposed path.”

The job is clear: trace a declared credential to a log, Git diff, or artifact
where it may be exposed. The audience is developers and CI teams. Click
**Try it with sample data** first. This passes at phone and desktop widths.

At 390px, the h1 bounds were x=16–374, the primary action was x=16–189, and
the document width was 390px. The three plain facts ended by y=825.67 inside
the 844px viewport. No child was clipped or horizontally hidden.

## Finding

### Minor

| ID | Exact quote/location | Why this fails | Concrete fix |
| --- | --- | --- | --- |
| F-4-1 | Live `/404/` h1 and `site/404/index.html`: “This path ends here.” The eyebrow says “Path / missing sink.” | A 404 heading must immediately say what happened. These metaphors do not say that the page was not found and violate the no-metaphor heading rule. | Change the eyebrow to **“Page not found”** and the h1 to **“This page was not found.”** Keep the next sentence and **Return home** action. Add an e2e assertion for the literal h1. |

## Demo and sandbox

**Pass.** The first CTA opens `/?demo=1` in one click and reaches the separate
`/demo/?demo=1` document. In a fresh 390px context, the first screen already
contained the complete realistic sample result at y=617.97–820.66: one exposed
path, a redacted value, source, command, sink, and a 12-character fingerprint.
The persistent banner read **“Demo — sample data, nothing is saved”** and had
**Reset demo** and **Start for real**.

I entered `review4_unique_9347` in both editors, traced it, and confirmed the
value was absent from the finding. Reset restored `demo-river-9347`. Cookies,
localStorage, and sessionStorage were empty before and after; real storage was
not touched. The request log contained only
`https://secret-exposure-path.sociobot.in` document and asset requests. After
loading, I set the context offline and obtained “No declared value reached
this sink” from the clear sample.

From a separate temporary caller directory, the clean-clone
`target/debug/sep demo --json` made the distinct workspace
`/tmp/secret-exposure-path-demo-7695-0`, reported one redacted finding, and
left the caller directory empty.

## Claims and clean-clone verification

I read all 24 entries in `.factory/claims.json` and ran every exact selector
separately in the clean checkout with:

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

`npm test` passed (4 library, 7 CLI, and 7 site tests plus type checking).
`npm run build` passed and produced `target/release/sep` and `dist/site/`.
`npm run test:e2e` passed all 60 browser tests. There is no failed or untested
registered claim.

## Copy audit

Counts treat commands, URLs, numbers, and hyphenated terms as one word.
Navigation labels, field labels, code blocks, and decorative coordinate labels
are excluded. Every landing and README item is at or below 22 words. No item
uses a banned marketing adjective, changes the credential terminology, or uses
a non-result-naming button. The 404 finding above is the sole copy flag.

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

Every visitor-reliable landing/README statement has a matching claim entry;
there is no unlisted-claim finding.

## Structure, routes, and visual identity

The live `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404/` routes each return
200 and have one `main`, one `h1`, a route title, description, canonical,
OG/Twitter metadata, favicon, stable four-link header, and complete footer.
An unknown URL returns the designed 404 with HTTP 404. Every landing link,
including GitHub and Sociobot targets, returned 200. Forward navigation and
Back both focus the destination h1 and update the polite route announcement.
No console or page errors occurred on normal routes.

The near-black route landscape, glass source/command/sink shapes, local art,
restrained path motion, and coordinate treatment implement the documented
luminous-glass identity. It is not a generic SaaS template. The 404 wording is
the only exception to the required plain-language heading standard.

## Earlier-history verification

I read `.factory/review-1.md`, `.factory/review-2.md`,
`.factory/review-3.md`, every `.factory/polish-*.md`, and the prior handoff.
Each earlier finding was rechecked live and in source/tests; none is merely
marked fixed.

| Earlier finding | Confirmed current state |
| --- | --- |
| F-1-1 | 12-character fingerprint and source/sink locations are live; `fingerprint-format` passes. |
| F-1-2 | Named-source boundary plus working and staged diffs are live; `declared-boundary` passes. |
| F-1-3 | Literal and credential-like text detection are live; `detection-methods` passes. |
| F-1-4 | Dotenv and environment candidates are live; `source-types` passes. |
| F-1-5 | Command forwarding is redacted and status-preserving; `command-forwarding` passes. |
| F-1-6 | Command, log, artifact, working, and staged paths pass `sink-paths`. |
| F-1-7 | JSON stdout, redacted stderr, and exit 10 pass `json-ci-contract`. |
| F-1-8 | Local browser tracing/redaction and unavailable crypto state pass `browser-model`. |
| F-1-9 | Clear-result wording and fixture pass `clear-result`. |
| F-1-10 | Clear, exposed, cannot-scan, and child-status exits pass `exit-code-contract`. |
| F-1-11 | Actionable cannot-scan copy and source/start failures remain covered. |
| F-1-12 | Transform/split limits and `unattributed` state pass `detection-limits`. |
| F-1-13 | CLI/TOML allowlists retain other findings; `allowlists` passes. |
| F-1-14 | The workflow heading is “Scan every output you name.” |
| F-1-15 | The local/CI heading is direct and contextual. |
| F-1-16 | The limits heading directly names the limitation. |
| F-1-17 | README scope and usage wording is concise and has tested coverage. |
| F-1-18 | README audience copy is concise. |
| F-1-19 | Repeated inputs pass `multiple-inputs`. |
| F-1-20 | `inspect` without a child passes `inspect-mode`. |
| F-1-21 | Preflight refusal before child start passes `preflight-redaction`. |
| F-1-22 | Tested source, command, report, JSON, and error flows redact values. |
| F-1-23 | Static-host security, cache, and 404 policy pass `site-host-policy`. |
| F-1-24 | Document navigation focuses and announces the h1. |
| F-1-25 | Every route has the complete shared footer. |
| F-1-26 | The visible install control names its result. |
| F-2-1 | Phone hero children fit inside the viewport. |
| F-2-2 | All routes share the four-link primary navigation. |
| F-2-3 | Off-site links visibly name GitHub or Sociobot. |
| F-2-4 | Explanatory copy consistently uses “credential.” |
| F-2-5 | Local execution and credential-like text are described plainly. |
| F-3-1 | The completed demo path is inside the first phone viewport. |
| F-3-2 | All three first-screen facts fit inside the phone viewport. |
| F-3-3 | The allowlist instruction is concrete and non-metaphorical. |

## Missed leverage

No AI feature is implied by this privacy-first local CLI. An AI call would send
credential context outside the product’s local boundary without improving the
declared source-to-sink job. The CLI demo, browser lab, and JSON output already
provide the implied trial and automation paths. No decorative AI, provider key,
import/export, or sync gap was found.

## What would make this perfect

Replace the metaphorical 404 eyebrow and h1 with an explicit page-not-found
message, protect it with an e2e assertion, deploy, and repeat this full fresh
review. Until F-4-1 is fixed, the required zero-finding standard is not met.
