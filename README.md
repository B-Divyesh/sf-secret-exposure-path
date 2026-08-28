# Secret Exposure Path

`sep` traces a credential you name. It checks command output, Git diffs, and
named artifacts. Reports show redacted fingerprints and locations. The CLI
makes no network calls. Tested report flows do not print declared values.

For developers and CI teams using agents or build scripts. Check a credential
path before it reaches a log, artifact, or commit.

## Install

Install from source with Rust 1.85 or newer:

```sh
cargo install --git https://github.com/B-Divyesh/sf-secret-exposure-path
sep --help
```

Registry publication is a Param Factory action. Check the package with
`cargo package`.

## Usage

Try the complete workflow with bundled fake data. It creates an isolated
temporary workspace and prints its path:

```sh
sep demo
sep demo --json
```

The browser demo at
[secret-exposure-path.sociobot.in/?demo=1](https://secret-exposure-path.sociobot.in/?demo=1)
loads an exposed path in one click. Edits stay in memory. Reloading or choosing
**Start for real** discards them.

Trace a command with a dotenv source, a named artifact, and both Git diffs:

```sh
sep run --source .env --output dist/build.log -- npm run build
```

Repeat `--source` or `--output` to add inputs. Read an environment variable
without printing its value:

```sh
sep run --from-env DEPLOY_TOKEN --output release/ -- ./release.sh
```

JSON mode writes one report to stdout. Redacted command output goes to stderr.
Exit `10` blocks an exposure:

```sh
sep run --json --source .env.ci --output reports/ -- ./ci.sh > sep-report.json
```

Inspect existing sinks without running a child command:

```sh
sep inspect --source .env --input app.log --input dist/ --json
```

Add a known fixture fingerprint to an allowlist:

```sh
sep run --allow-fingerprint 7c2a9f12b3de --source fixtures.env -- cargo test
```

Options can also live in `.seppath.toml`:

```toml
allow_fingerprints = ["7c2a9f12b3de"]
allow_paths = ["test/fixtures/"]
```

Exit `0` means clear. Exit `10` means exposed. Exit `2` means the scan could
not start. A clear `sep run` returns the child command status.

### What detection can and cannot prove

`sep` matches declared in-memory values. It also flags text that looks like a
credential but has no declared source. A declared value in command arguments
stops the child command before it starts. That report redacts the value.

Encoding, encryption, splitting, short values, or unsupported transformations
can break exact tracking. A shape match without a declared source is
`unattributed`. Use narrow fingerprint and path allowlists. This tool
complements a credential manager and repository scanner.

## Develop and verify

```sh
npm ci
npm test
npm run test:claims
npm run test:e2e
npm run build
cargo package --allow-dirty
```

`npm test` runs the Rust suite and site checks. `npm run build` produces
`target/release/sep` and `dist/site/`. Run the site with `npm run dev`. Deploy
`dist/site/` as the static site root. Its configuration sets security headers,
immutable asset caching, and the designed 404 response.

The browser demo has no telemetry, persistent storage, hosted scripts, or
hosted fonts. See [.factory/claims.json](.factory/claims.json) for executable
checks, [LICENSE](LICENSE) for MIT terms, and [CHANGELOG.md](CHANGELOG.md) for
release notes.
