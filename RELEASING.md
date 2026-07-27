# Releasing DuVay

DuVay uses UTC CalVer in `YY.WW.DD` form, where `WW` is the ISO week and `DD`
is the ISO weekday. A release commit must be merged to `main` before publishing.

## Before merge

- Set the release version in `package.json` and replace the `Unreleased`
  changelog heading with that version and its UTC date.
- Run `bun run build`, `bun run test:components`, `bun scripts/crap.test.mjs`,
  `bun run --cwd website test:ty`, and `bun run --cwd website bundle`.
- Open a release pull request and require the CI component, tooling, and
  documentation jobs to pass.

## Publish sequence

Merging the release pull request to `main` starts the `Publish` workflow for
that exact commit. The workflow:

1. verifies that the requested SHA is the current `main`, the package is
   `@d31ma/duvay-css`, and the version is valid CalVer;
2. runs tooling tests, the sharded component suite, and the documentation build;
3. builds one npm tarball and records its integrity;
4. publishes that same tarball to GitHub Packages with the `latest` tag;
5. creates an annotated version tag only after the registry contains the
   expected artifact; and
6. creates or repairs the matching GitHub release.

DuVay does not publish to npmjs.org — the `@d31ma` scope is not registered
there. GitHub Packages is the only package registry, and it authenticates with
the workflow's built-in `GITHUB_TOKEN`; no `NPM_TOKEN` secret is required.

Publishing is idempotent only when an existing registry version has the same
integrity. A different artifact at the same version is a hard failure.

## Pages assets

A successful `Publish` run on `main` starts `Publish Pages Assets`. It rebuilds
the framework from the tagged source, writes the release to
`versions/<VERSION>/`, and records the source SHA. Existing version directories
must match both that SHA and the rebuilt asset manifest or deployment stops.

The `latest/` directory advances only when the incoming CalVer is at least as
new as the current release. Re-running an older release can restore its
immutable version directory without rolling `latest` backward.

For an authorized retry, dispatch `Publish` with the exact current `main` SHA.
Dispatch Pages directly only with the exact tagged source SHA and matching
version.
