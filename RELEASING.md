# Releasing DuVay

DuVay uses UTC CalVer in `YY.WW.DD` form, where `WW` is the ISO week and `DD`
is the ISO weekday, both derived from UTC. A second release on the same UTC
date appends `-1` (then `-2`, and so on): `26.35.01-1`. A release commit must
be merged to `main` before publishing.

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
3. creates an annotated version tag only after every check passes; and
4. creates or repairs the matching GitHub release.

DuVay does not publish to any package registry. It is distributed solely as
hosted assets on GitHub Pages, so there is no tarball, no npm or GitHub
Packages step, and no `NPM_TOKEN` secret. `package.json` is marked `private`
to prevent an accidental publish.

## Documentation site

The docs site is an Amplify Hosting app (managed in `d31ma/PaaS` at
`infra/duvay/amplify`) with one branch per environment rail:

| Rail | Host |
|---|---|
| dev | `dev.duvay.del.ma` |
| staging | `staging.duvay.del.ma` |
| production | `duvay.del.ma` |

A successful `Publish` run deploys its tagged release to the **dev** rail
automatically (`Deploy Docs to Amplify` workflow). Promoting is manual and
deliberate: dispatch the same workflow with the rail (`staging`, then
`production`) and the tagged commit SHA. The workflow refuses any commit
that is not on `main` and tagged `v<version>` by an annotated tag, and it
authenticates via OIDC (`duvay-docs-deploy` role) — there are no stored AWS
secrets in this repository.

A release is immutable: an existing tag that resolves to a different commit is
a hard failure. Because the tag is derived from the CalVer version, only one
release per UTC day is possible without changing the version scheme.

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
