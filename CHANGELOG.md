# Changelog

## 26.31.01 - 2026-07-27

### Breaking

- Renamed the npm package from `duvay-css` to `@d31ma/duvay-css`. Update
  package-manager installs and CSS or JavaScript imports to use the scoped
  package name. Hosted GitHub Pages URLs are unchanged.

### Added

- Expanded the Light DOM web-component APIs across application shells,
  navigation, overlays, forms, selection controls, data display, date and time
  inputs, file upload, and motion. Component documentation now pairs CSS-class
  and web-component examples with structured attribute, event, slot, and method
  references.
- Added common `hover-elevation`, `theme`, `min-height`, and `max-height`
  attributes to the web-component base API. `theme` scopes semantic tokens to a
  component subtree without changing the document theme.
- Added shared icon-glyph size tokens and automated component coverage, CRAP
  scoring, and Vuetify-parity reporting for release validation.

### Changed

- Migrated the documentation app from `website/browser/` to the Tachyon
  `website/client/` layout and broadened component, feature, style, directive,
  accessibility, installation, and upgrade coverage.
- Pinned the documentation build to a checksum-verified Tachyon release for
  deterministic local and CI builds on supported macOS, Linux, and Windows
  runners.
- Raised the smallest text tokens to a 12px default floor and standardized
  coarse-pointer controls on the shared 44px touch-target token.
- Hardened release automation around one immutable `main` commit: CI validates
  tooling, components, and docs; one integrity-checked tarball is published to
  npm and GitHub Packages; and the annotated tag and GitHub release are created
  only after registry publication succeeds.
- Pages deployment now requires the annotated source tag, preserves immutable
  version directories with source-SHA metadata, and updates `latest` only when
  the deployed CalVer is not older than the current release.

### Fixed

- Escaped component-authored text and attributes consistently and hardened
  high-risk URL, icon-adapter, and inline-style entry points. Button, FAB, and
  file-upload links now reject unsupported schemes; upload previews use a
  narrow image URL policy; and unsafe icon tags, class tokens, and style values
  are ignored.
- Kept visual-only hover cards out of the keyboard tab order while preserving
  keyboard activation for cards explicitly configured as links.

## 26.27.06 - 2026-07-04

### Added

- New documentation pages under Getting started: Wireframes, Unit testing,
  Upgrade guide, and Release notes.

### Changed

- The documentation sidebar's Getting started section now mirrors Vuetify's
  structure: Installation, Frequently asked questions, Wireframes, Unit
  testing, Browser support, Upgrade guide, Release notes, Contributing.
- The documentation site chrome now uses DuVay web components consistently:
  the header menu and search buttons and the sidebar close button are
  `<w-btn variant="icon">` instead of styled native buttons.

### Fixed

- Multi-line code samples on 44 documentation pages now render with preserved
  line breaks (converted `div.code-block` containers to `pre`).
- The sidebar Installation item now stays highlighted; previously the header
  Install button stole the single active-link marker for `/docs/install`.
- ARIA state (`aria-expanded`, `aria-controls`, `aria-label`) and focus
  management in the docs navigation now target the native button rendered
  inside `w-btn` hosts.
- Removed committed build staging artifacts (`website/dist-staging-*`) and
  added a `.gitignore` rule so they cannot return.

## 26.27.04 - 2026-07-02

### Breaking

- Replaced every DuVay-owned `data-w-*` attribute with the consistent `w-*`
  prefix across CSS, web components, motion helpers, documentation, examples,
  tests, and generated distribution assets. Applications using CSS-class
  components must rename hooks such as `data-w-theme` to `w-theme` and
  `data-w-dialog-open` to `w-dialog-open`.

### Changed

- Added uniform, responsive API references across component documentation.
- Gave Bottom sheets, Icon buttons, Sheets, and Toolbars dedicated documentation
  routes instead of forwarding their sidebar entries to unrelated page anchors.

### Added

- Added regression coverage that prevents legacy attribute prefixes, missing
  component API references, and broken sidebar destinations from returning.
