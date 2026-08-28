# Adversarial first-read review 2 — Secret Exposure Path

Date: 2026-08-28
URL: <https://secret-exposure-path.sociobot.in/>
Verdict: **FAIL**

Fresh Chromium contexts at 390 × 844 and 1440 × 960, plus a new clean clone at `/tmp/sep-review2-KY2Phb`.

## Cold first read

Before scrolling: “Trace secrets before they reach logs.” “For developers and CI teams, it maps declared credentials into command output, Git diffs, and artifacts.” “Try it with sample data” — “Loads a ready exposed path.”

At desktop, the job (trace a credential path to a possible leak), audience (developers and CI teams), and first action (try the sample) are clear. The phone first read fails in use because the content is clipped; see F-2-1.

## Findings

### Blocking

| ID | Exact quote/location | Why this fails | Concrete fix |
| --- | --- | --- | --- |
| F-2-1 | Live `/` at 390px: “Trace secrets before they reach logs.”, the install control, and “Read the CLI guide”. Measured `.hero-copy`: **538.30px** wide inside a **358px** hero. `main { overflow: hidden; }` is at `site/src/style.css:41`. | The h1, install control, and secondary CTA extend beyond the right edge and are clipped. No horizontal scrollbar appears because overflow is hidden. A phone visitor cannot fully read or use the first screen. The passing `mobile layout does not overflow` test checks only document scroll width, not visible child bounds. | At the mobile breakpoint let the relevant hero grid item shrink (`min-width: 0`), fit/wrap install/actions, and add a 390px test asserting the h1, install control, and both actions have bounds within the viewport. |

### Medium

| ID | Exact quote/location | Why this fails | Concrete fix |
| --- | --- | --- | --- |
| F-2-2 | Headers differ: `/` has “How it works”, “Demo”, “GitHub ↗”; `/demo/` has “Home”, “Privacy”; `/privacy/` has “Demo”, “Terms”; `/terms/` and `/404/` have “Demo”, “Privacy”. | The required consistent header with Privacy/Terms navigation is absent. Privacy is not in the landing header. | Use a shared wordmark and stable nav such as **How it works**, **Demo**, **Privacy**, **Terms**; current page may be non-link text. Move GitHub to a marked secondary/footer link. |
| F-2-3 | Live `/`: “Read the detection limits →” links to GitHub. Live `/privacy/`: “issue tracker” links to GitHub. | External links must say so. A forward arrow and bare “issue tracker” do not tell a visitor that the action leaves the site. | Use **Read the detection limits on GitHub ↗** and **public GitHub issue tracker ↗**, or equivalent visible “opens GitHub” wording. |

### Minor

| ID | Exact quote/location | Why this fails | Concrete fix |
| --- | --- | --- | --- |
| F-2-4 | Landing h1: “Trace **secrets** before they reach logs.” The next sentence and README use “**credentials**” / “credential values” for the same thing. | One concept has two names, contrary to the terminology rule. | Use `credential` consistently in explanatory copy, for example **“Trace credentials before they reach logs.”** The product name may remain Secret Exposure Path. |
| F-2-5 | Landing eyebrow: “Local-first credential tracing.” Landing/README: “high-confidence credential shapes.” | These specialist phrases are not explained on first read. | Rewrite as **“Runs on your computer.”** and **“It also flags text that looks like a credential but has no declared source.”** Explain the exact `unattributed` result label where it appears. |

## Copy audit

Counts treat commands, numbers, URLs, and hyphenated terms as one word. Headings and runtime messages are included; navigation, code samples, field labels, and image alt text are not sentences. No item exceeds 22 words. F-2-4 and F-2-5 are the only copy flags.

### Landing page

| Words | Sentence |
| ---: | --- |
| 3 | Local-first credential tracing |
| 6 | Trace secrets before they reach logs. |
| 15 | For developers and CI teams, it maps declared credentials into command output, Git diffs, and artifacts. |
| 5 | Loads a ready exposed path. |
| 3 | Free under MIT |
| 5 | Browser demo has no telemetry |
| 5 | Loaded demo survives a disconnect |
| 6 | Credential values stay out of reports. |
| 7 | Reports contain a 12-character fingerprint and location. |
| 5 | Scan every output you name. |
| 15 | `sep` reads only the sources and outputs you name, plus staged and unstaged Git diffs. |
| 8 | It maps exact matches and high-confidence credential shapes. |
| 2 | Declare sources |
| 9 | Dotenv files and selected environment variables become in-memory candidates. |
| 3 | Wrap the command |
| 11 | Output is captured, scanned, redacted, and then forwarded to your terminal. |
| 3 | Trace each sink |
| 11 | Findings link source → command → log, artifact, working tree, or staged diff. |
| 5 | Watch the bundled sample trace. |
| 6 | This transcript comes from `sep demo`. |
| 13 | The command creates a temporary sample workspace and runs the production tracing engine. |
| 8 | Run the same isolated sample with `sep demo`. |
| 5 | Add `--json` for machine-readable output. |
| 6 | Test a path in this tab. |
| 12 | This small browser model uses the same declared-value idea as the CLI. |
| 10 | Change either side to test exposed, clear, and error states. |
| 8 | The loaded lab works if your connection drops. |
| 6 | Input stays only in this tab. |
| 8 | Edit the sample or run the ready trace. |
| 8 | Run the scan locally or in CI. |
| 1 | Clear |
| 6 | No finding reached a scanned sink. |
| 2 | Exposure found |
| 11 | Use the stable exit code to stop CI before publishing or committing. |
| 3 | Could not scan |
| 6 | The scan could not start. |
| 6 | Check the source path and command. |
| 5 | What this tool cannot detect. |
| 13 | Exact tracking stops when a value is encrypted, split, or transformed beyond recognition. |
| 5 | Shape-only findings are labeled `unattributed`. |
| 12 | Narrow fingerprint and path allowlists tame known fixtures without hiding every result. |
| 5 | Trace declared credential paths locally. |
| 13 | Add a credential-like variable name and a value of at least 8 characters. |
| 6 | Comparing declared values with the sink… |
| 6 | No declared value reached this sink. |
| 2 | Value redacted. |
| 4 | Fingerprint and locations only. |
| 9 | This browser does not provide the local hashing API. |
| 4 | Try a current browser. |
| 8 | Connection dropped — this loaded lab still works. |

### README

| Words | Sentence |
| ---: | --- |
| 6 | `sep` traces a credential you name. |
| 9 | It checks command output, Git diffs, and named artifacts. |
| 6 | Reports show redacted fingerprints and locations. |
| 6 | The CLI makes no network calls. |
| 8 | Tested report flows do not print declared values. |
| 10 | For developers and CI teams using agents or build scripts. |
| 12 | Check a credential path before it reaches a log, artifact, or commit. |
| 8 | Install from source with Rust 1.85 or newer. |
| 7 | Registry publication is a Param Factory action. |
| 6 | Check the package with `cargo package`. |
| 8 | Try the complete workflow with bundled fake data. |
| 10 | It creates an isolated temporary workspace and prints its path. |
| 12 | The browser demo at secret-exposure-path.sociobot.in/demo/ loads an exposed path in one click. |
| 4 | Edits stay in memory. |
| 8 | Reloading or choosing Start for real discards them. |
| 14 | Trace a command with a dotenv source, a named artifact, and both Git diffs. |
| 7 | Repeat `--source` or `--output` to add inputs. |
| 8 | Read an environment variable without printing its value. |
| 7 | JSON mode writes one report to stdout. |
| 6 | Redacted command output goes to stderr. |
| 5 | Exit `10` blocks an exposure. |
| 8 | Inspect existing sinks without running a child command. |
| 8 | Add a known fixture fingerprint to an allowlist. |
| 6 | Options can also live in `.seppath.toml`. |
| 4 | Exit `0` means clear. |
| 4 | Exit `10` means exposed. |
| 8 | Exit `2` means the scan could not start. |
| 9 | A clear `sep run` returns the child command status. |
| 5 | `sep` matches declared in-memory values. |
| 8 | It also flags high-confidence credential shapes in sinks. |
| 13 | A declared value in command arguments stops the child command before it starts. |
| 5 | That report redacts the value. |
| 12 | Encoding, encryption, splitting, short values, or unsupported transformations can break exact tracking. |
| 9 | A shape match without a declared source is `unattributed`. |
| 6 | Use narrow fingerprint and path allowlists. |
| 9 | This tool complements a secret manager and repository scanner. |
| 9 | `npm test` runs the Rust suite and site checks. |
| 7 | `npm run build` produces `target/release/sep` and `dist/site/`. |
| 7 | Run the site with `npm run dev`. |
| 7 | Deploy `dist/site/` as the static site root. |
| 13 | Its configuration sets security headers, immutable asset caching, and the designed 404 response. |
| 13 | The browser demo has no telemetry, persistent storage, hosted scripts, or hosted fonts. |
| 14 | See `.factory/claims.json` for executable checks, `LICENSE` for MIT terms, and `CHANGELOG.md` for release notes. |

## Demo and sandbox

**Pass.** The first CTA opens `/demo/` in one click. In a fresh 390px context the first screen already showed a redacted exposed path from `demo:.env.local:2` through `command` to `demo:dist/release.log:2`. The banner was exactly “Demo — sample data, nothing is saved” with Reset demo and Start for real.

I entered `review2-unique-9347`, traced it, and reset. It was redacted from the result; Reset restored `DEPLOY_TOKEN=demo-river-9347`. Cookies, localStorage, sessionStorage, and storage writes were empty. The request log had only same-origin document/assets, with no input sent to another origin. Direct `sep demo --json` created an isolated temporary directory and emitted one redacted finding.

## Claims and clean-clone tests

All commands listed by `.factory/claims.json` were run separately in the clean clone with `npm run test:claims -- --grep @claim:<id>`. Every one passed. `npm test`, `npm run build`, and `npm run test:e2e` also passed. Therefore there is no failing, untested, or unlisted claim finding.

| Claim ID | Result |
| --- | --- |
| cli-path-redaction; fingerprint-format; declared-boundary; detection-methods; source-types; command-forwarding | pass (each command) |
| sink-paths; json-ci-contract; browser-model; clear-result; exit-code-contract; detection-limits | pass (each command) |
| allowlists; multiple-inputs; inspect-mode; preflight-redaction; report-redaction; site-host-policy | pass (each command) |
| cli-demo; browser-private; cli-no-network; mit-license; offline-loaded-demo; false-positive-rate | pass (each command) |

## Structure, history, and missed leverage

Root, demo, privacy, terms, 404, robots, sitemap, favicon, social card, GitHub repository/issues, and Sociobot links all returned 200. An unknown URL returned the designed page with HTTP 404. Every inspected route has `lang="en"`, one main, one h1, route-specific title/description/canonical/OG/favicon, and direct deep links. Live Demo navigation and browser Back moved focus to the new h1 and updated the polite announcement. The footer is complete on every route. No console errors occurred.

The luminous glass/prism route art is distinct and not a generic SaaS template. F-2-1 through F-2-3 are the remaining mobile/structure defects.

I read every prior review, polish document, verification report, and handoff. I rechecked every earlier finding live and in the corresponding source/test; none is merely marked fixed.

| Earlier ID | Confirmed live and code state |
| --- | --- |
| F-1-1 | 12-character fingerprint plus source/sink locations are live; `fingerprint-format` passes. |
| F-1-2 | Named sources and both Git diff modes are live; `declared-boundary` passes. |
| F-1-3 | Literal and shape detection are live; `detection-methods` passes. |
| F-1-4 | Dotenv and environment sources are live; `source-types` passes. |
| F-1-5 | Redacted output forwarding is live; `command-forwarding` passes. |
| F-1-6 | Command/artifact/working/staged path coverage passes `sink-paths`. |
| F-1-7 | JSON stdout, redacted stderr, and exit 10 pass `json-ci-contract`. |
| F-1-8 | Browser trace/redaction and unavailable-hash state pass `browser-model`. |
| F-1-9 | Clear wording and fixture pass `clear-result`. |
| F-1-10 | Exit 0/10/2/child-status behavior passes `exit-code-contract`. |
| F-1-11 | Actionable cannot-scan wording and source/start failures are present. |
| F-1-12 | Limits and `unattributed` behavior pass `detection-limits`. |
| F-1-13 | Flag/TOML allowlists retain other findings; `allowlists` passes. |
| F-1-14 | The workflow heading is “Scan every output you name.” |
| F-1-15 | The install heading is “Run the scan locally or in CI.” |
| F-1-16 | The limits heading names the limitation directly. |
| F-1-17 | README opening/usage copy is short and claimed behavior is tested. |
| F-1-18 | README audience copy is split into short sentences. |
| F-1-19 | Repeated inputs pass `multiple-inputs`. |
| F-1-20 | `inspect` without a child process passes `inspect-mode`. |
| F-1-21 | Preflight refusal before child start passes `preflight-redaction`. |
| F-1-22 | Source/command/report/JSON/error redaction passes `report-redaction`. |
| F-1-23 | Static host security/cache/404 policy passes `site-host-policy`. |
| F-1-24 | Live document navigation focuses and announces the h1. |
| F-1-25 | Every live footer has one-liner/version/legal/factory links. |
| F-1-26 | The visible control says “Copy install command.” |

The F-1 repairs do not cover the newly observed clipped mobile child bounds, route-header inconsistency, or external-link labelling.

No AI, import/export, or sync feature is implied by this privacy-first local CLI. JSON output, the browser lab, and `sep demo` cover the useful try/automation paths; there is no decorative AI or embedded provider key.

## What would make this perfect

Fix visible mobile bounds first. Then use one stable header, mark off-site links, and use one plain credential term plus a plain description of shape detection. Re-run this entire fresh review after deployment. Until every finding is fixed, **FAIL** remains the correct verdict.
