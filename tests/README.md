# DuVay Component Tests

This folder owns framework-level component behavior tests. It follows Vuetify's package-level test structure: shared setup lives under `tests/setup`, and component-facing specs live under `tests/components`.

Run the suite from the repository root:

```bash
bun run test:components
```

The test runner is installed by the documentation workspace, but the specs and fixtures stay with the framework so component behavior is not hidden inside website-only tests.

## Coverage and the CRAP score

`smoke.spec.js` mounts every element the framework registers, so no component
ships with its template and event wiring completely unexercised. Per-component
specs cover the behavior on top of that.

The CRAP score of a function is `complexity² × (1 − coverage)³ + complexity`: it
is high when code is both branchy and untested, and it can never fall below the
complexity itself. To measure it:

```bash
bun run test:coverage
bun run crap
```

`test:coverage` re-runs the suite with `DUVAY_COVERAGE=1`, which makes each
worker capture V8 coverage and write it to `coverage/raw/`. `crap` merges those
dumps and reports the distribution plus every function above the limit. Function
boundaries and hit counts come from V8 itself, so there is no parser or
instrumentation dependency.

Useful switches: `CRAP_LIMIT` (default 12) sets the threshold and the exit code,
`CRAP_FILTER=<path substring>` lists every function in the matching files rather
than only the offenders, `CRAP_TOP` caps the printed rows, and
`DUVAY_COVERAGE_DIR` / `CRAP_RAW` point the capture and the report at a
different directory so two runs can proceed side by side.

`scripts/crap.test.mjs` guards the complexity counter itself — run it with
`bun scripts/crap.test.mjs`.
