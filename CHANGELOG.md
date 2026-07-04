# Changelog

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
