# Demo contract

## Browser demo

- URL: `https://secret-exposure-path.sociobot.in/?demo=1` (local: `http://127.0.0.1:4173/?demo=1`). It redirects to the isolated `/demo/?demo=1` document.
- The first landing-page action, **Try it with sample data**, opens this URL.
- It loads one fake deployment credential in `demo:.env.local` and a matching fake release log in `demo:dist/release.log`.
- The exposed path is computed on page load. The value never appears in the result.
- Demo state uses an isolated in-memory `demo:` namespace. It does not use cookies, localStorage, sessionStorage, IndexedDB, or OPFS.
- **Reset demo** replaces all edits with the bundled sample. **Start for real** discards the in-memory state and opens the CLI guide.

## CLI demo

- Command: `sep demo` (or `sep demo --json`).
- The same fake source and sink ship in `examples/demo.env` and `examples/release-output.txt`.
- Each run creates a unique directory under the operating system's temporary directory, copies the sample there, and prints that path.
- The command runs the production tracing engine and prints one redacted finding. It never reads the user's workspace.
- Delete the printed temporary directory to reset the CLI demo. A later run always creates a fresh workspace.
