# Changelog

## Unreleased

### Added

- Offline states (Mesail request D1): the spec `docs/offline-states.md` for
  `w-sync-status`, `w-send-status`, `w-storage-meter` and the "Needs your
  attention" list pattern on the web and all four native platforms. This
  first slice adds the two helpers they share: `WOfflineText`
  (`src/components/offline-text.js`: time style, byte units, text
  templates) and `WLiveAnnouncer` (`src/components/live-announcer.js`: one
  polite message line per page that groups a burst of changes into one
  announcement), and the conformance suite `spec/fixtures/offline.json`.
- `w-storage-meter` (offline states, slice S3): the space an offline copy
  uses on the device. `value` and `max` in bytes, `label`, `warn-at`
  (default 0.8) and `full-at` (default 0.95). "Almost full" and "Full" are
  shown in words with an icon, not only in colour. It renders
  `role="meter"` with `aria-valuetext` such as "850 MB of 1 GB used,
  Almost full", is not live and takes no focus. Every text can be replaced
  (`value-text`, `warn-text`, `full-text`). Styles in
  `components/storage-meters.css`; docs page `/docs/storage-meter`.
  Each OS skin lays it out like the platform's own storage row: iOS and
  macOS put "X of Y used" beside the label over a taller bar, Android puts
  it under the label over a thin bar, Windows draws a thin bar on a 1px
  rail, and Linux uses a regular-weight row title.
- `w-send-status` (offline states, slice S2): the send state of one message
  or row written on the device, `waiting`, `sending`, `failed` or `sent`,
  with an icon and words, the failure `reason` and an `actions` slot. Rows
  that change to `failed` are announced politely through `WLiveAnnouncer`,
  grouped over 1 second ("20 not sent. Needs your attention.");
  `announce="off"` stops it. Docs page `/docs/send-status` with the "Needs
  your attention" list pattern and a working demo.
- `w-list-item item-role="none"` with a title shows its default content under
  the subtitle, and a list item with an `id` gives its title the id
  `<id>-title`, so a row's buttons can use `aria-describedby` to say what
  they act on.
- `w-sync-status` (offline states, slice S1): a bar or chip that shows
  whether the app is online, syncing, offline or locked, with the time of
  the last sync and the waiting and attention counts. It is hidden when
  online with nothing waiting (`show-online` keeps it), every text can be
  replaced, and its own hidden polite status line announces only state
  changes, one message per 2 seconds. Docs: `/docs/sync-status`.
  Each OS skin follows the platform's own status surface: iOS and Linux
  centre the text like a toolbar status line and an AdwBanner, Android is
  an M3 banner, macOS a lighter status line, Windows a bordered InfoBar.

- `w-bottom-navigation` takes its landmark name from `label`, `aria-label` or
  `aria-labelledby` on the host and puts it on the rendered `<nav>`. The
  default stays "Bottom navigation".
- `w-btn` and `w-icon-btn` forward `aria-keyshortcuts` to the rendered
  `<button>` (or link).
- `w-list` passes a host `aria-label` and `aria-labelledby` to the element
  with role="list" (or role="listbox"), so a list can have an accessible name.
- `return-focus="<id>"` on `w-dialog`, `w-overlay` and `w-bottom-sheet`: the
  element that gets focus on close. Without it, or when no element has that
  id, focus returns to the control that held it on open. (#18)

### Fixed

- `w-dialog` returns focus however it opened. A dialog opened by setting
  `open`, or inserted with `open` already set, now remembers the control that
  held focus, and gives focus back on Escape, the X, a `w-dialog-close`
  control and `close()`. Removing `open` or removing an open dialog also gives
  focus back, unless the app already moved focus elsewhere. Removing `open`
  now also releases the page scroll lock. (#18)
- `w-dialog` first focus goes to an `autofocus` element (or the input of an
  `autofocus` component such as `w-text-field`), then the first control in the
  body, and only then the close button. (#18)
- `w-bottom-sheet` and `w-overlay` return focus to their built-in activator,
  which is re-rendered on open and close, instead of to `<body>`. Opening
  through the `open` attribute, or inserting the element open, now moves focus
  into the content and back out on close, removal of `open`, or removal of the
  element. An `autofocus` control in the content takes first focus. (#18)
- `.w-dialog-body` no longer cuts off the floating label of an outlined field
  that is the first thing in the body. The gap under the dialog header is now
  the body's top padding (`--w-space-md`) instead of the header's bottom
  padding, so the scrolling body has room for the half of the label that sits
  above the field. On wide screens text sits where it did before; below 760px
  the gap under the header grows from `--w-space-sm` to `--w-space-md`
  (8px to 12px). A dialog written with the CSS classes that has a header and
  a footer but no `.w-dialog-body` loses the header's bottom padding.

### Tests

- `w-card` regression tests: plain children, and a `w-divider` child between
  them, stay visible after a re-render (the fix shipped in 26.46.03).

## 26.46.03 - 2026-11-11

### Added

- `w-hotkey` `mod` key: Command (⌘) on a Mac and Control (Ctrl) elsewhere,
  so one `keys="mod+k"` fits every platform.
- `w-alert` `live="polite"` (role="status") and `live="off"` (a static notice
  with no live role), so notices already on the page do not interrupt screen
  readers. The default stays role="alert".
- `w-snackbar` `live="assertive"` (role="alert") for errors; the default stays
  role="status".
- `w-banner` `label` (the region's accessible name, default "Banner") and
  `live="polite" | "assertive"` (role="status" / role="alert" instead of a
  region).
- `w-select` passes a host `aria-labelledby`, `aria-label` and
  `aria-describedby` to its combobox; `aria-labelledby` wins over every
  generated name, so a visible label stays the name.
- `w-list-item` `item-role`: `button` (a plain action, never aria-pressed),
  `menuitem`, `menuitemradio`, `menuitemcheckbox` (`active` is aria-checked),
  `option`, and `none` (a static, non-interactive row).
- `w-btn-toggle`, `w-chip-group` and `w-avatar-group` take an accessible name
  from `label`, `aria-label` or `aria-labelledby`.
- `w-empty-state` / `w-empty` `heading-level` (1-6, default 2, or `none`).
- `icon-set` on `w-alert`, `w-banner`, `w-snackbar` and `w-empty-state`.
- `w-dialog`: `heading` (preferred name for the title), `heading-level`
  (1-6, default 3) and `sheet="mobile"`, which turns the dialog into a bottom
  sheet below 600px while it stays a modal dialog with the same focus trap.
  The dialog is described by its body when the body has content; a host
  `aria-describedby` overrides that (empty turns it off).
- `w-hover-card`: interactive mode (`interactive`, or automatic when the
  content holds a focusable element). The content is a named non-modal
  dialog; it opens on hover, focus or click, and the trigger gets
  `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls`. The closed
  card is inert.
- `w-avatar`: presence states `idle`, `dnd` (do not disturb) and `offline`,
  and `status-label`. Idle and offline show as rings and dnd as a dot with a
  bar (token-based CSS in `avatars.css`), so colour is not the only cue.
- `w-skeleton` / `w-skeleton-loader`: opt-in `announce` adds one polite
  status message (`loading-text`, default "Loading...").

- `w-command-item` rich rows: `prepend-avatar` (alias `avatar`), `tag` with
  `tag-color`, a `snippet` line, and `prepend`/`append` slots. The same fields
  work in `w-command`'s `items` JSON (`prependAvatar`, `tag`, `tagColor`,
  `snippet`) and in `w-command-palette-item`. Search also matches the snippet
  and tag; `filter-keys` accepts `snippet` and `tag`.
- `w-bottom-nav-item` `icon-set`; `icon` now resolves through `WIcons`
  (`set:name` works). The default `text` set renders exactly as before.
- `w-btn` takes `type` (button | submit | reset) for the inner `<button>`;
  unset keeps the native default. An authored `type` also wins over the
  `type="button"` default of `w-icon-btn` and `w-app-bar-nav-icon`.
- `w-btn` link form takes `target` and `rel`; `target="_blank"` always adds
  `noopener`.
- `w-btn` forwards `aria-disabled`. `aria-disabled="true"` (without
  `disabled`) is a focusable disabled state: the button stays in the tab
  order but clicks, Enter, Space, form submit and link navigation are blocked.
- `w-text-field` (and `w-textarea`) forward `inputmode`, `enterkeyhint`,
  `aria-label`, `aria-labelledby`, `aria-describedby` (joined with the
  field's hint / error row), `aria-controls` and `aria-details` to the
  native control.

- `<w-chip static>` renders a display-only chip: a `<span>` with no button
  role, no `aria-pressed` and no selection toggle.
- `<w-chip>` forwards host `aria-label`, `aria-labelledby`,
  `aria-describedby`, `aria-haspopup`, `aria-expanded`, `aria-controls` and
  `aria-current` to its inner button or link. With `aria-haspopup` the chip is
  a plain popup trigger (no `aria-pressed`, no toggle). `aria-expanded` and
  the others update in place, so focus stays on the chip.
- `<w-chip icon-set>`; `prepend-icon`, `append-icon`, `filter-icon` and
  `close-icon` resolve through `WIcons` like `<w-btn>` (the default text set
  renders the same markup as before).
- `<w-tabs nav>` renders the strip as a `<nav>` of links (no tab roles, no
  arrow keys), as the APG advises for tabs that navigate. `<w-tabs>` passes
  host `aria-label` / `aria-labelledby` to the tablist (or nav).
- `<w-tab>` forwards host `aria-controls`, `aria-label`, `aria-labelledby` and
  `aria-describedby` to the tab control, so tabs can point at their panels.
- `<w-menu activator="id | selector | parent">` uses an existing element as
  the trigger: no built-in trigger is rendered, the element gets click and
  keyboard handling plus `aria-haspopup`, `aria-expanded` and
  `aria-controls`, the surface anchors to it (unless `target` is set), and
  focus returns to it when the menu closes from inside. Without `activator`
  the menu behaves as before.

### Fixed

- WCAG 2.5.8: the `w-chip` close button keeps its 1rem look but has a 24px
  hit area, so it meets the minimum target size.
- `w-alert` `icon`, `w-banner` `icon`, `w-snackbar` `prepend-icon` and
  `w-empty-state` `icon` resolve through the icon registry (`WIcons`) like
  `w-btn` does, instead of printing the name as text. With the default `text`
  set the output is unchanged.
- WCAG 1.3.1: `w-list-item` gets role="listitem" inside a `w-list` with
  role="list", so the list's items are announced. A host role the author set
  is kept.
- WCAG 1.3.1: the `w-empty-state` title is a heading (role="heading",
  aria-level 2 by default) instead of a plain paragraph. A slotted heading
  element keeps its own level.
- WCAG 4.1.2: `w-switch` is announced as a switch (role="switch") instead of a
  checkbox. An indeterminate switch stays a checkbox, because the switch role
  has no mixed state.
- `w-command-item` options are now named by their title only
  (`aria-labelledby`); subtitle, snippet, tag, append content and shortcut
  become the option's description (`aria-describedby`) instead of being read
  as part of its name.
- `w-bottom-navigation` `grow` now gives the items equal widths that fill the
  bar; before, it only sized the inner buttons.
- `w-card` keeps plain children visible after re-renders when a nested
  component (for example a `slot="prepend"` `w-avatar`) renders its own
  `<slot>`; before, the children moved into a hidden slot and the card showed
  empty. `slot="..."` on content inside a nested `w-*` component no longer
  counts as a card slot.
- `w-dialog`: a host `title` no longer shows a browser tooltip over the whole
  dialog. The value moves to `heading`; `title` and `el.title` still work.
- `w-hover-card`: Escape closes the card (focus returns to the trigger when
  it was in the card), and moving the pointer onto the card keeps it open
  (WCAG 1.4.13).
- `w-table`: a native `<table>` is no longer wrapped in a second
  `role="table"`; there is exactly one table in the accessibility tree.
- `w-skeleton` / `w-skeleton-loader`: the bones are no longer a live region
  (`aria-live`/`aria-busy` removed) and are `aria-hidden`, so many loaders no
  longer make many announcements. The page should own one loading status;
  use `announce` on one loader when needed.
- `w-avatar`: a status dot is no longer labelled "warning badge". The
  presence ("Online", "Away", ...) is part of the avatar's accessible name
  ("Ana Lee, Online") and the dot is hidden from assistive technology.
- `w-text-field` clear button is now keyboard reachable (WCAG 2.1.1): it is
  in the tab order and named "Clear <label>". It is disabled, and so out of
  the tab order, while the field is empty or read-only.
- `w-otp` / `w-otp-input` spread a whole code that autofill, a password
  manager or the `one-time-code` suggestion writes into one box across the
  boxes, and emit the usual `input` and `change` events. The boxes no longer
  set `maxlength="1"`, which made browsers cut such a code to one character;
  a typed key still replaces the box's character.

### Changed

- `w-text-field` long values: the single-line `<input>` cannot wrap. The
  header docs now point to `<w-textarea rows="1" auto-grow>` for values that
  must wrap; no new attribute was added.

- `<w-chip closable|removable>`: the close control is a real
  `<button type="button">` named by `close-label`, reachable with Tab
  (WCAG 2.1.1). When the chip also acts (toggle, link, popup), the pill is a
  `<span class="w-chip">` holding two sibling controls, `.w-chip__action` and
  `.w-chip__close`, so no control is nested in another (WCAG 4.1.2). Code
  that reads `aria-pressed` from `.w-chip` on a closable chip should read it
  from `.w-chip__action`.
- `<w-chip>`: Enter and Space work through the native button click; on a link
  chip Enter now follows the link and Space no longer toggles selection.
- `<w-tabs>`: roving tabindex (APG tabs pattern). Only the active tab (or the
  first enabled one) is in the Tab order; arrows, Home and End move focus
  from the focused tab. In a `multiple` strip arrows only move focus and no
  longer change the selection; with `mandatory="false"` an arrow onto the
  active tab no longer deselects it.
- `<w-tab href>` gets `aria-current="page"` while active.


## 26.35.01-1 - 2026-08-24

Documentation-site-only release; the framework is unchanged from 26.35.01.

### Fixed

- The docs site now ships a viewport meta tag, so phones render it at
  device width instead of scaling a ~980px layout down to fit. No zoom cap:
  pinch-zoom stays available (WCAG 1.4.4).
- The docs app bar stays one 56px row on narrow screens instead of wrapping
  to two — which had also broken every offset computed from the header
  height (sticky sidebars, scroll padding).
- The platform-skin tab strip scrolls horizontally on narrow screens rather
  than wrapping a lone tab onto a second row, and keyboard-cycling to an
  off-screen tab scrolls it into view.

### Changed

- Release workflows accept the documented same-UTC-date CalVer suffix
  (`YY.WW.DD-N`); previously the second release on a date failed validation.

## 26.35.01 - 2026-08-24

### Added

- Every component in the Core contract is implemented on all five platforms —
  46/46 on web, Apple, Android, Windows and Linux. The 21 Tier 2 components
  landed in batches across all four native platforms together, so no platform
  raced ahead of the others.
- A generated `/docs/platform-parity` page reporting per-platform coverage and,
  separately, whether a platform may be advertised as supported.
- A snapshot suite per platform: SwiftUI `ImageRenderer` on Apple, Paparazzi on
  Android, a widget-tree binary on Linux, and a control-surface snapshot read
  from assembly metadata on Windows.
- `bun run test:a11y` — axe over every registered element against WCAG 2.0/2.1/
  2.2 A and AA, once per platform skin.
- `bun run test:skins` — the full component suite once per `w-os` value.
- `.w-sr-only`, promoted from a time-picker-local rule to a documented global
  utility.
- `--w-on-scrim`, the foreground for content drawn over `--w-scrim`.
- `windows/DuVay/Tokens.xaml`, a WinUI ResourceDictionary of themed brushes, so
  XAML markup can reach the palette through `{StaticResource}`.
- `tokens/platform/**` and `tokens/component/**`, completing the primitive →
  semantic → component ontology and bringing the five skins into the pipeline.
- A `verification` block in `spec/core-contract.json`; a publishable status is
  now refused without a signed record of the manual accessibility pass.
- `ACCESSIBILITY-PASS.md`, the runbook for that pass, including an AI handoff
  prompt for the capture step.
- A `/docs/accessibility` page describing every guarantee and its gate.

### Fixed

- `.w-sr-only` was defined only inside `.w-time-picker-field`, so `w-heatmap`
  and `w-video` used the class with no styling at all and rendered
  screen-reader-only text visibly.
- `w-pie`, `w-pie-segment`, `w-hotkey` and `w-hover-card` did not forward
  `aria-label` to the element carrying the ARIA role, so they could not be given
  an accessible name.
- `w-file-upload`'s dropzone was a `role="button"` containing focusable
  children, and its file input had no accessible name.
- `w-calendar` carried `aria-selected` on a `role="button"`, where it is invalid
  and ignored; it belongs on the `gridcell`.
- Date-picker day cells and range-slider thumbs fell below the WCAG 2.5.8
  24x24 minimum.
- `w-virtual-scroll` was not keyboard-reachable.
- `.w-video-controls` used `--w-on-primary` over the scrim, rendering the
  timecode at 1.37:1 in the dark theme.
- Breadcrumb separators used `--w-divider`, a hairline colour, for glyphs.
- `inset` on a switch shrank the track on Material and Fluent, whose tracks
  already enclose the thumb.
- The iOS and macOS skins used the `background` shorthand on toolbars, which
  reset `background-image` and wiped `.w-toolbar--image`.
- The iOS and Material skins rounded the top corners of fullscreen bottom
  sheets.

## 26.34.07 - 2026-08-23

### Added

- Added five platform skins selected with `w-os` on `<html>` — `ios`,
  `android`/`material`, `macos`, `windows`/`fluent`, `linux`/`adwaita` — each
  shipped as its own entrypoint (`duvay-<os>.css`) and as a layerable
  stylesheet under `platforms/`. `duvay.js` auto-detects the OS when the
  attribute is absent; an explicit attribute always wins, and `w-os=""` opts
  out. Skins override platform tokens (font, motion, elevation, chrome, focus
  rings) and never brand tokens, so WCAG AA guarantees hold for every skin.
- Added `w-density` (`compact` | default | `comfortable`) as an orthogonal
  control-geometry scale, generated into `src/density.css`. Compact keeps
  touch targets at or above the WCAG 2.5.8 AA minimum, enforced by
  `tokens:check`.
- Added the DTCG token pipeline: `tokens/` JSON is now the source of truth,
  and `src/tokens.css` + `src/themes.css` are generated by `tokens:build`,
  with `tokens:check` failing CI on contrast or skin-rule regressions.
- Added `spec/` — a machine-readable contract for the 46 Core components plus
  116 language-neutral conformance fixtures — and native Tier 1 component
  libraries that pass them: SwiftUI (`apple/`), Jetpack Compose (`android/`),
  WinUI 3 (`windows/`), and GTK4/libadwaita (`linux/`). `platform-parity`
  publishes only human-verified support and fails CI on overclaiming.
- Added focus-ring tokens (`--w-focus-ring-width/style/color/offset/shadow`)
  so skins restyle the ring through the single `reset.css` rule.
- Added property setters (`value`, `disabled`, `readonly`, `checked`,
  `indeterminate`, …) across the component library so frameworks that bind by
  property instead of attribute work without adapters.
- Added a platform-skins docs page with a live `w-os` / `w-density` switcher,
  and restructured every docs page onto the shared `<doc-layout>` component.

### Changed

- Pinned the docs-site Tachyon runner to 26.33.02 (from 26.30.04) with
  refreshed per-binary checksums.

## 26.34.03 - 2026-08-19

### Added

- Added a "Using with Tailwind" guide covering namespace safety and the cascade
  layer import that keeps Tailwind utilities winning over DuVay component
  classes.
- Documented the ARIA forwarding policy for `w-btn` and the progress components
  in the API reference.

### Changed

- Restored the non-zero corner radius scale (`--w-radius-sm` through
  `--w-radius-xl`), so components render with rounded corners again instead of
  square ones.

### Fixed

- `w-btn` now forwards `aria-pressed`, `aria-expanded`, `aria-controls`,
  `aria-haspopup`, `aria-current`, `aria-labelledby`, and `aria-describedby` to
  the rendered control, which is the element the accessibility tree exposes.
  `aria-pressed` is withheld from the link form, where it is not valid ARIA
  (#9).
- `w-progress-linear` and `w-progress-circular` now forward `aria-label`,
  `aria-labelledby`, and `aria-describedby` onto the element carrying
  `role="progressbar"`, so the indicator is no longer an unnamed progressbar
  (#10).

## 26.31.06 - 2026-08-01

### Added

- Added the Vuetify 4.1.7 component additions: avatar groups, command palettes,
  date-range and month pickers, heatmaps, highlights, mask inputs, pie charts,
  unified progress, and video controls.
- Added generated API inventory and fallback documentation pages so every
  registered DuVay element and declared attribute has a website reference.
- Added browser-level behavior coverage for the new components and strict
  documentation inventory tests.

### Changed

- Pinned the parity audit to Vuetify 4.1.7 metadata and expanded the audit to
  fail when a Vuetify component has no DuVay counterpart.
- Added contained command-palette rendering for local demos and embedded user
  interfaces.

### Fixed

- Limited source inspection to each JavaScript class body so API generation
  and parity checks cannot credit a component with attributes read by a later
  class in the same file.
- Put command-palette combobox semantics and live expansion state on the search
  input, and kept video-control focus stable during playback updates.
- Ordered mask-input events after formatting and model synchronization, removed
  conflicting legacy visualization selectors, and contained heatmap/video
  controls on narrow screens.
- Sanitized highlight, heatmap, and pie color inputs before they reach inline
  custom properties.

## 26.31.02 - 2026-07-27

### Breaking

- DuVay is no longer published to any package registry. The `@d31ma/duvay-css`
  package has been removed from GitHub Packages and there is no `npm install`
  path. Use the hosted GitHub Pages URLs, or vendor the files into your own
  asset pipeline. Bare specifier imports such as
  `@import "@d31ma/duvay-css/core.css"` must move to the hosted equivalent at
  `https://d31ma.github.io/DUVAY/latest/core.css`.

### Changed

- The `Publish` workflow no longer packs a tarball or publishes to a registry.
  It validates the release source, runs the full test and docs suite, then tags
  and creates the GitHub release. Pages deployment is unchanged.
- `package.json` is marked `private` so an accidental publish fails fast.

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
