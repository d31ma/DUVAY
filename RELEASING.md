# Releasing DuVay

DuVay uses UTC CalVer in `YY.WW.DD` form, where `WW` is the ISO week and `DD`
is the ISO weekday, both derived from UTC. A second release on the same UTC
date appends `-1` (then `-2`, and so on): `26.35.01-1`. A release commit must
be merged to `main` before publishing.

## Branches

- `develop` is the integration branch. Each feature or fix is made on its own
  `feat/<name>` or `fix/<name>` branch from `origin/develop`, checked locally,
  and fast-forwarded into `develop`. A push to `develop` starts no workflow.
- `main` holds released code only. A release pull request into `main` comes
  from `develop` or from a `release/<version>` branch cut from `develop`.
- `release/*` branches are kept after merge for audit and backports.

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

Production (`duvay.del.ma`) is an Amplify Hosting app managed in `d31ma/PaaS`
(`infra/duvay/amplify`). Staging (`staging.duvay.del.ma`) is hosted on Floci on
kestrel and is reachable only on the tailnet and the CITADEL LAN.

`Publish` builds the site once. It attaches `duvay-site-<version>.zip` (with
`site-version.json` at its root) and its `.sha256` to the GitHub release, and
attests the zip. kestrel's pull deployer then deploys that zip to staging,
probes it, and sets the commit status `site-staging/floci` on the release
commit, with the description `<version> <first 12 hex of the zip SHA-256>`.

When `Publish` succeeds on a release commit, `Site Deploy` checks the zip's
SHA-256 and waits up to 20 minutes for that status to be `success` for exactly
this zip. It stops at once on `failure` or `error`. It then deploys the same
zip to Amplify **production** and probes it. If the production probes fail, it
redeploys the version production served before and fails the run. A merge that
is not a release deploys nothing.

To roll back or redeploy, dispatch `Site Deploy` with a released `version` and
target `production`. It deploys that release's zip after checking its SHA-256,
without waiting for staging.

The workflow authenticates through OIDC with no stored AWS secrets. Its deploy
job runs in GitHub environment `site-production` (limited to `main`), and PaaS
lets only that environment assume `duvay-site-deploy-production`. It reads the
commit status with its own token (`statuses: read`). The role and probes are in
`.github/site-deploy.json`; headers belong to PaaS.

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
