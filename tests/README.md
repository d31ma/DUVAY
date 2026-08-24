# DuVay Component Tests

This folder owns framework-level component behavior tests. It follows Vuetify's package-level test structure: shared setup lives under `tests/setup`, and component-facing specs live under `tests/components`.

Run the suite from the repository root:

```bash
bun run test:components
```

The test runner is installed by the documentation workspace, but the specs and fixtures stay with the framework so component behavior is not hidden inside website-only tests.

## Running once per OS skin

`playwright.config.js` declares one project per `w-os` value — `web` (no skin)
plus the five operating systems. The fixture page loads all five skin
stylesheets; each is scoped to its own `[w-os="…"]`, so they stay inert until
the runner sets the attribute. One page therefore serves every skin.

```bash
bun run test:components   # the unskinned project only — fast inner loop
bun run test:skins        # all six projects
```

This matters because a skin changes font, motion, elevation, chrome heights,
switch geometry, focus rings and scrollbars — all things the specs assert on.
Behaviour that holds unskinned does not automatically hold in a skin, and the
per-skin run has already caught a modifier that inverted itself under Material
and Fluent, a `background` shorthand that wiped a toolbar image, and a skin
rounding the corners of a fullscreen sheet.

Six projects saturate the machine, so the config sets `retries: 1`. A test that
only passes on retry is reported as `flaky` rather than silently swallowed, and
one that fails twice still fails the run.

## Accessibility

```bash
bun run test:a11y
```

`axe.spec.js` mounts every registered element on its own and scans it with
axe-core against WCAG 2.0/2.1/2.2 A and AA, once per skin. This is the web half
of the plan's accessibility gate; the four native platforms are audited by hand
because nothing else can judge a screen-reader experience.

Two composition rules (`aria-required-parent`, `aria-required-children`) are
skipped — a `w-command-item` has no `w-command` around it when mounted alone.
They are covered by the per-component specs and the manual passes.

Pre-existing violations live in an explicit `KNOWN` baseline that may only
shrink: an entry that stops failing is reported as stale, so fixing a defect
forces its removal and the list cannot become a permanent exemption.

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
