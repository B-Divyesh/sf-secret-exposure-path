# Secret Exposure Path

`sep` is a local shell and CI wrapper that shows where a credential traveled:
from an explicitly declared source file or environment variable into command
output, a Git diff, or a generated artifact. Reports contain only redacted
fingerprints and locations. The CLI makes no network calls. It does not write
detected values to its reports.

It is for developers and teams using coding agents, build scripts, and CI who
want an answer before a secret lands in a log, artifact, or commit.

## Install

Install from source with Rust 1.85 or newer:

```sh
cargo install --git https://github.com/B-Divyesh/sf-secret-exposure-path
sep --help
```

Registry publication is intentionally left to the Param Factory. The package
can be checked with `cargo package`.

## Usage

Try the complete workflow with bundled fake data. This creates an isolated
temporary workspace and prints its path:

```sh
sep demo
sep demo --json
```

The browser demo at
[secret-exposure-path.sociobot.in/demo/](https://secret-exposure-path.sociobot.in/demo/)
loads an exposed path in one click. Its edits stay in memory and are discarded
on reload or when you select **Start for real**.

Trace a command, loading candidate values from a dotenv file and scanning a
declared artifact plus the staged and unstaged Git diff:

```sh
sep run --source .env --output dist/build.log -- npm run build
```

Declare more than one source/output by repeating the option. Read a secret from
an environment variable without exposing its value in the report:

```sh
sep run --from-env DEPLOY_TOKEN --output release/ -- ./release.sh
```

CI can consume one JSON document and use exit code `10` to block an exposure:

```sh
sep run --json --source .env.ci --output reports/ -- ./ci.sh > sep-report.json
```

Inspect existing sinks without running a command:

```sh
sep inspect --source .env --input app.log --input dist/ --json
```

Known false positive or accepted fixture? Add its redacted fingerprint to an
allowlist (the fingerprint is shown in a prior report):

```sh
sep run --allow-fingerprint 7c2a9f12b3de --source fixtures.env -- cargo test
```

Options may also live in `.seppath.toml`:

```toml
allow_fingerprints = ["7c2a9f12b3de"]
allow_paths = ["test/fixtures/"]
```

Exit codes are stable: `0` means no exposure, `10` means at least one exposure,
`2` means the scan could not run, and otherwise `sep run` returns the wrapped
command's failing exit code. In JSON mode command output stays redacted on
stderr so stdout remains machine-readable.

### What detection can and cannot prove

`sep` tracks exact in-memory values from declared dotenv files and environment
variables, and separately flags high-confidence credential shapes in sinks.
If a declared value appears literally in the planned command arguments, the
preflight reports the path and refuses to start the command.
It never recovers or prints a value. Encoding, encryption, splitting, very
short values, or transformations it does not recognize can break a path. A
shape match without a declared source is labeled `unattributed`. Review results
and use narrow fingerprint/path allowlists; this complements a secret manager
and repository scanner rather than replacing either.

## Develop and verify

```sh
npm ci
npm test
npm run test:claims
npm run test:e2e
npm run build
cargo package --allow-dirty
```

`npm test` runs the Rust suite and site checks. `npm run build` produces the
release CLI in `target/release/sep` and the deployable site in `dist/site/`.
Run the docs site locally with `npm run dev`. Deploy `dist/site/` as the static
site root. Its `staticwebapp.config.json` defines security headers, immutable
asset caching, and the designed 404 response.

The browser demo has no telemetry, persistent storage, hosted scripts, or
hosted fonts. See [.factory/claims.json](.factory/claims.json) for executable
claim checks, [LICENSE](LICENSE) for the MIT license, and
[CHANGELOG.md](CHANGELOG.md) for release notes.
