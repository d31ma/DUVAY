# Changelog

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
