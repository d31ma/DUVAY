# DuVay → Cross-Platform Native UI

> **Status: Phases 0–4 Tier 1 code-complete on all five platforms. Phase 5 blocked on manual accessibility passes.**
>
> | Phase | Scope | State |
> |---|---|---|
> | 0 | Token pipeline, accent split, `spec/`, conformance fixtures | ✅ done |
> | 1 | Five web skins, `w-os` detection, entrypoints, docs | ✅ done |
> | 2 | Apple (SwiftUI) Tier 1 | 🟢 25/25 code-complete, builds iOS + macOS |
> | 3 | Android (Compose) Tier 1 | 🟢 25/25 code-complete, Compose library builds |
> | 4 | Windows (WinUI 3) + Linux (gtk4-rs) Tier 1 | 🟢 25/25 each, both build |
> | 5 | v1 release, parity matrix published | blocked on the a11y passes below |
>
> **Tier 1 is code-complete on all five platforms.**
>
> ```
> tier 1: web 25/25 · apple 25/25 · android 25/25 · windows 25/25 · linux 25/25
> ```
>
> `tier-1-code-complete` is deliberately *not* `tier-1-complete`. The plan
> requires a manual screen-reader pass (VoiceOver, TalkBack, Narrator, Orca) and
> a per-platform snapshot suite before a tier ships, and neither is automatable.
> `scripts/platform-parity.mjs` refuses to publish a code-complete platform as
> supported, so the docs cannot advertise what has not been verified by a human.
>
> **What each platform actually builds**
> - **Apple** — SwiftUI package, `swift build` on macOS and `xcodebuild
>   -destination generic/platform=iOS` both succeed. Controls wrap `Toggle`,
>   `Picker`, `Slider`, `.sheet` and `.alert` so platform press behaviour,
>   button ordering and VoiceOver focus come from the OS.
> - **Android** — `:duvay-compose` assembles against compileSdk 35. The theme
>   bridge maps DuVay semantics onto Material 3's `ColorScheme` (including
>   `--w-outline` → `outline`) and takes Material You dynamic colour by default.
> - **Windows** — WinUI 3 library builds **on real Windows hardware over SSH**
>   (`bun run windows:gate`). Several WinUI controls are `sealed`, so those are
>   composed rather than subclassed.
> - **Linux** — gtk4-rs 0.11 + libadwaita 0.9 against GTK 4.22 / libadwaita 1.9,
>   using `AdwEntryRow`, `AdwComboRow`, `AdwBanner`, `AdwToast`, `AdwAlertDialog`.
>   Widget layer is behind `--features gtk` so conformance still runs without a
>   GTK stack.
>
> **Phases 2–4 foundation — the load-bearing part, done and verified.**
> All four native platforms build and pass the *same* 116 conformance vectors:
>
> ```
> ✓ apple     passed   (swift test)
> ✓ android   passed   (gradle :duvay-core:test)
> ✓ linux     passed   (cargo test)
> ✓ windows   passed   (dotnet test)
> ```
>
> Run with `bun run native:verify` after `source /Volumes/ANNEX/toolchains/duvay-env.sh`.
>
> This validates the plan's central architectural bet: **language-neutral JSON
> test vectors instead of a shared runtime.** Four independent reimplementations
> — Swift, Kotlin, Rust, C# — of the same calendar, value-parsing and mask logic
> agree with the JavaScript reference and with each other. No KMP, no Compose
> Multiplatform, no Skia.
>
> - `tokens/` now generates native constants for all four languages
>   (`bun run tokens:native`): Swift enum, Kotlin object, C# static class, Rust
>   consts, plus a GTK `@define-color` stylesheet.
> - Each platform's core is deliberately UI-free (`DuVayCore`, `duvay-core`,
>   `DuVay.Core`, default crate features) so conformance runs with no Android
>   SDK, no emulator, and no GTK.
> - The parity gate now compares each platform's **declared** status against
>   what is on disk, so a port in progress does not fail the build but a false
>   claim does.
>
> **What the remaining work is**
> 1. **Manual accessibility passes** — VoiceOver, TalkBack, Narrator, Orca. Not
>    automatable; the plan says budget for it rather than assume it. This is what
>    stands between `tier-1-code-complete` and `tier-1-complete`.
> 2. **Snapshot suites** per platform (XCTest, Paparazzi, WinAppDriver, a GTK
>    offscreen renderer). Currently only the web has one (Playwright, 1452 tests).
> 3. **Tier 2** — the remaining 21 components across all five.
>
> Run `bun run verify` for every static gate, `bun run native:verify` for the
> four native conformance suites, and `bun run windows:gate` for the Windows host.
>
> **What landed**
> - `tokens/` — DTCG JSON, 15 documents, source of truth. `src/tokens.css` and
>   `src/themes.css` are now generated. Extraction was proved lossless by
>   byte-identical round-trip before any value changed.
> - Accent split (`--w-accent` / `--w-accent-bg` / `--w-on-accent`) plus a new
>   `--w-outline` control-boundary token, in all four themes.
> - Two real accessibility defects found and fixed: `--w-on-warning` was white
>   on amber at **3.48:1** (AA failure), and no token met the 3:1 control-boundary
>   requirement.
> - `spec/` — 46 component contracts generated from the live source (props,
>   events, slots, a11y role, tier, per-platform names) and 103 conformance
>   vectors, verified timezone-stable across four zones.
> - Five OS skins + entrypoints + `w-os` detection; 1452 existing component
>   tests still pass.
>
> **Deviations from the plan as written**
> - The Core contract is **46 components, not 44** — the plan counted
>   `List/ListItem` and `AppBar/Toolbar` as single entries; they are separate
>   components with separate contracts.
> - The Phase 1 contrast gate is enforced **structurally** rather than by
>   rendering every Tier-1 component in every skin × theme: skins are forbidden
>   from declaring colour tokens, so the theme's validated contrast carries to
>   every skin by construction. Cheaper and stronger than sampling.
> - **The skins are far less divergent than "five distinct OS identities"
>   implies.** The first pass varied control height from 22 px (macOS) to 48 px
>   (Android) — a 2.2x spread that read as five design systems, not one product
>   with a native accent. Control size, the radius scale and the type scale are
>   now brand tokens shared by every skin, alongside colour; `tokens:check`
>   fails a skin that overrides any of them. Platform character is carried by
>   font family, motion, elevation, chrome heights, switch geometry, focus rings
>   and scrollbars. This follows the plan's own brand/platform split, which
>   already listed radius scale and type ramp as brand — the first pass had
>   contradicted it.
> - `--w-outline` is defined and gated but **web components still use the
>   decorative `--w-border`**. Rewiring the ~20 form-control call sites is a
>   visible design change and was left as a follow-up, not done silently.
> - Style Dictionary is still deferred, as the plan allows: the CSS target is a
>   local Bun script, so the repo keeps its zero-dependency promise until the
>   Swift/Kotlin targets exist.
>
> **Findings from Phases 2–4 that changed the contract**
> - The fixture suite did **not** discriminate the mask token classes: an
>   implementation defining `#` as alphanumeric rather than digits-only passed
>   every vector. Caught by deliberately breaking a passing implementation and
>   watching the suite stay green. Eight discriminating vectors added; the same
>   mutation now fails on all four platforms.
> - Two `wDateInRange` vectors encoded a JavaScript `TypeError` because the
>   generator was handed strings where the function takes dates. No other
>   language can reproduce a JS type error, so `fixtures-build.mjs` now fails
>   loudly on an unexpected throw instead of emitting a bug-shaped fixture.
> - `--w-space-1_5` (6px) and `--w-space-15` (60px) both converted to `space15`
>   in camel/Pascal case — a silent collision that emits two constants with one
>   name. The generator now asserts injectivity for all three casings.
>
> **Toolchains** live on the ANNEX drive, not the system:
> `source /Volumes/ANNEX/toolchains/duvay-env.sh` pins JDK 17 (Temurin, needed
> because Gradle 8.14 rejects the machine's JDK 25) and redirects SwiftPM,
> Gradle, cargo and NuGet caches to `/Volumes/ANNEX/build/`.
>
> **Resolved blockers**
> - **WinUI 3 on macOS** — solved by building on a real Windows host over SSH.
>   `bun run windows:gate` syncs `spec/` and `windows/`, runs the conformance
>   suite, and compiles the WinUI 3 library there. Two things were needed on the
>   remote: a per-user .NET 9 SDK (its system SDK is 8, which cannot even restore
>   a net9.0 project), and `EnableCoreMrtTooling=false` so PRI generation does not
>   demand Visual Studio's Appx tooling.
> - **GTK4** — `gtk4 4.22.4` and `libadwaita 1.9.3` installed; the widget layer
>   compiles. Homebrew installs to `/opt/homebrew` rather than ANNEX, which is a
>   limitation of Homebrew's fixed bottle prefix, not a choice.
>
> **Rendered on device.** Both mobile platforms now run a gallery harness:
> `bun run ios:gallery` (iPhone 17, iOS 26.5) and `bun run android:gallery`.
> Tier-1 components render with real native widgets — UISwitch, native Slider
> and Picker on iOS; Material 3 Switch, Slider and TextField on Android — in
> DuVay's palette. The on-device readout confirms the token collision fix:
> `space1_5=6  space15=60  touch=44`.
>
> Two defects were found only by rendering, not by compiling:
> - The Compose theme bridge left M3's `surfaceContainer*` slots unmapped, so a
>   DuVay card rendered in Material's default lavender instead of DuVay's
>   surface. Fixed by mapping all five container slots.
> - The Android gallery drew under the status bar (no `enableEdgeToEdge` +
>   `safeDrawingPadding`).
>
> **The web skins were also verified on the real engines.** The same bundle,
> loaded from both devices, auto-detects a different skin per platform:
>
> | | iOS Simulator (WebKit) | Android emulator (Chrome) |
> |---|---|---|
> | detected `w-os` | `ios` | `material` |
> | `--w-size-md` | 44px | 48px |
> | `--w-touch-min` | 2.75rem (44pt HIG) | 3rem (48dp M3) |
> | button font | `-apple-system` | `Roboto` |
> | `backdrop-filter` | supported | supported |
>
> **Still outstanding:** the manual screen-reader passes. Rendering is not the
> same as a VoiceOver/TalkBack audit, and that remains what separates
> `tier-1-code-complete` from `tier-1-complete`.

## Context

DuVay today is a web-only design system: `src/*.css` (738 KB unminified bundle, 109 partials) plus
257 registered Light-DOM custom elements across 258 files / 40,491 lines of JS
([`src/components/base.js`](src/components/base.js), [`src/duvay-wc.js`](src/duvay-wc.js)). It has
Vuetify-level breadth and a mature token layer ([`src/tokens.css`](src/tokens.css),
[`src/themes.css`](src/themes.css)) with light / dark / auto / high-contrast themes driven by a
`[w-theme]` attribute.

The goal is to turn it into a cross-platform UI for **desktop (Windows, macOS, Linux)** and
**mobile (iOS, Android)**, where the UI **feels native on each OS**. Decisions taken:

- **Rendering:** native widgets per platform (SwiftUI, Jetpack Compose, WinUI 3, GTK4/libadwaita) —
  not a webview shell.
- **Skin depth:** five distinct OS identities on the web side (`ios`, `material`, `macos`, `fluent`,
  `adwaita`).
- **Scope:** UI layer only. DuVay ships UI libraries and a token pipeline. No CLI, no native-API
  bridge, no app templates, no signing/release tooling.

The intended outcome: an application team on any of the five platforms consumes a DuVay package
(SPM, Maven, NuGet, crates.io, or the CSS/WC bundle) and gets components that are visually and
behaviourally the same product, rendered with each OS's own widgets.

---

## The one thing to decide before funding this

Native rendering means implementing every component **five times**. The current surface is 257
components. A naive port is ~1,285 implementations.

The calibration point from the closest real precedent: **Microsoft's Fluent UI**, with a dedicated
team and separate per-platform repos, ships **30+ iOS components and 8 macOS components** against a
web library with hundreds. Their own component counts diverge so sharply that parity has to be
validated per component, not per library. Ionic — the most successful adaptive-styling system —
solved the same problem with **two modes, not five**, and stayed inside a single webview
implementation.

**This plan therefore does not port 257 components.** It defines a *Core contract* of 44 components
that get native implementations on all five platforms, and leaves the remaining ~213 as web-only.
Everything below is sized against that number. If the requirement is genuinely "all 257 native," the
honest estimate is 15–25 engineer-years and the plan should be rejected rather than re-scoped
quietly.

Sized against the 44-component contract: **~176 component-platform implementations, ≈4–5
engineer-years, 12–18 months to v1 with four platform specialists working in parallel.**

---

## Architecture: three layers

```
┌─ Layer 1 ── tokens/*.json (DTCG)  ← single source of truth
│     Style Dictionary → css vars │ Swift │ Kotlin │ C# │ Rust
│
├─ Layer 2 ── spec/*.json          ← component contract + behaviour vectors
│     names, props, events, states, a11y roles, conformance fixtures
│
└─ Layer 3 ── five implementations, each idiomatic to its platform
      web (existing)  SwiftUI  Compose  WinUI 3  GTK4/libadwaita
```

The invariant: **Layers 1 and 2 are shared and machine-checked. Layer 3 is deliberately not shared.**
Fluent's lesson is that native libraries give you *design* parity with platform-idiomatic behaviour —
you do not get pixel parity, and chasing it destroys the native feel you are paying for.

### Why not a shared runtime (KMP / Compose Multiplatform / Avalonia)

- **Compose Multiplatform / Avalonia** render with Skia and own their whole pipeline — no native
  widgets underneath. That directly contradicts the native-feel requirement.
- **Kotlin Multiplatform** shares logic across Android + iOS only; it does nothing for the C# (WinUI)
  and Rust (GTK) targets. It covers 2 of 4 native platforms — not enough leverage to justify the
  build complexity it imposes on the other two.
- Instead, share behaviour as **language-neutral JSON test vectors** (Layer 2). Date parsing,
  validation rules, mask application, data-table sort/filter/paginate, treeview flattening,
  autocomplete filtering — DuVay already has all of this logic in
  [`src/components/calendar-utils.js`](src/components/calendar-utils.js),
  [`src/components/validation.js`](src/components/validation.js),
  [`src/components/utils.js`](src/components/utils.js) and
  [`src/components/mask-input.js`](src/components/mask-input.js). Extract its *inputs and expected
  outputs* to fixtures; every platform reimplements the logic in its own language and passes the same
  suite. This works across Swift/Kotlin/C#/Rust equally, which no shared runtime does.

---

## Layer 1 — Token pipeline

**Source of truth moves from CSS to JSON.** `src/tokens.css` becomes generated output, not
handwritten input.

- New `tokens/` directory: DTCG-format JSON (`$value` / `$type`), split as
  `primitive/` (palette, scale) → `semantic/` (`color.accent.bg`, `space.md`) → `component/`
  (`button.filled.bg`). This is the three-level ontology Material 3 and Fluent 2 both converged on;
  adopt it because both the Android and Windows targets already speak it natively.
- **Style Dictionary v4+** (ESM, DTCG-native) generates:

  | Target | Format | Output |
  |---|---|---|
  | Web | `css/variables` | `src/tokens.css`, `src/themes.css` (generated) |
  | iOS / macOS | `ios-swift/enum.swift` | `DuVayTokens.swift` |
  | Android | `compose/object` | `DuVayTokens.kt` |
  | Windows | custom formatter | `Tokens.xaml` ResourceDictionary |
  | Linux | custom formatter | `tokens.css` (GTK CSS) + Rust consts |

  Note on zero-dependency: Phase 0 only needs the CSS target, which is ~100 lines of a Bun script,
  and the repo advertises zero dependencies with no root devDependencies. Author the tokens as DTCG
  JSON now (that is the portable, valuable part) and generate CSS with a local script; adopt Style
  Dictionary at Phase 2 when the Swift/Kotlin targets actually exist. DTCG is its native input
  format, so nothing is lost by deferring.

- **Two token classes, and the distinction is the whole ballgame:**
  - *Brand tokens* (accent, radius scale, type ramp, motion curves) — identical everywhere. This is
    what makes it recognisably DuVay.
  - *Platform tokens* (control height, corner radius, elevation model, font family, motion duration)
    — resolved per OS. `--w-touch-min: 2.75rem` on mobile becomes 22 pt on macOS.

  Encode this as a `platform` dimension in the token files so one source produces five resolved sets.
- **Accent handling must follow libadwaita's split**: `--accent-bg-color` (fill) vs `--accent-color`
  (text) are separate tokens with separate contrast requirements. DuVay currently has a single
  `--w-primary` concept; conflating fill and text accents is the single most common accessibility
  failure in this class of system. Add `--w-accent` / `--w-accent-bg` as a breaking token change.
- **On each OS, the accent is a system value, not ours.** Android supplies Material You dynamic
  color; GNOME supplies `AdwStyleManager:accent-color`; Windows supplies the user accent; macOS/iOS
  supply the highlight color. Every platform implementation must read the system accent by default
  and redraw when it changes. Never assume the accent is blue.

**Verification:** a `tokens:check` script asserts every semantic token resolves in all five platform
sets and every fg/bg pair clears WCAG AA (4.5:1 text, 3:1 UI) in light, dark and high-contrast. CI
fails on a missing or failing token.

---

## Layer 2 — Component spec + conformance suite

`spec/components/<name>.json` per Core component, describing:

- canonical name and per-platform names (`w-btn` / `DuVayButton` / `DuVayButton` / `DuVayButton` /
  `duvay_button`)
- props with types and defaults, mapped from the existing `static attrs` / `static props` in each
  component file
- events and their payloads (DuVay already uses native event names — keep that as the contract)
- states: default, hover, focus-visible, pressed, disabled, loading, readonly, error
- required a11y role and accessible-name strategy per platform
- **tier** (1, 2, or web-only)

`spec/fixtures/*.json` holds the behaviour vectors — input → expected output for the logic listed
above. Each platform library has one test target that loads the fixtures and asserts. A platform
cannot be released "at parity" until it passes 100% of the fixtures for its declared tier.

This file set is also what generates the parity matrix in the docs, so the site cannot claim support
a platform hasn't earned.

---

## Layer 3 — The Core contract

**Tier 1 — 24 components. Every platform, non-negotiable, defines v1.**

Button, IconButton, TextField, TextArea, Checkbox, Radio/RadioGroup, Switch, Select, Slider,
Card, List/ListItem, Avatar, Badge, Chip, Icon, Divider, Dialog, AlertDialog, Snackbar, Alert,
Tooltip, Menu, ProgressLinear, ProgressCircular.

Chosen because they map 1:1 onto an existing native widget on all four native toolkits — the port is
binding and theming, not invention.

**Tier 2 — 20 components. Ship after Tier 1 is green on all five.**

AppBar/Toolbar, NavigationDrawer, BottomNavigation, Tabs, Breadcrumbs, Pagination, Stepper,
ExpansionPanel, DatePicker, TimePicker, Autocomplete, FileInput, Rating, NumberInput, OTP,
BottomSheet, Popover, Table, Skeleton, EmptyState.

Higher cost: several have no direct native equivalent on every platform and need composition.
DatePicker/TimePicker in particular should **delegate to the OS picker** on iOS and Android rather
than reimplement — that is where native feel is most visible and most cheaply won.

**Web-only — the remaining ~213.** DataTable, TreeView, Calendar, ColorPicker, Carousel,
CommandPalette, Sparkline, Heatmap, VirtualScroll, the transition components, and the full utility
layer stay web-only, permanently, unless individually promoted. `spec/` marks them explicitly so the
docs never imply otherwise.

### Per-platform toolkit decisions

| Platform | Toolkit | Package | Notes |
|---|---|---|---|
| iOS + macOS | **SwiftUI** | SPM, one package, two targets | Not UIKit/AppKit. Fluent chose UIKit in 2019 and is still trying to migrate — do not repeat that. Adopt Liquid Glass via the system materials API, not a hand-rolled effect. |
| Android | **Jetpack Compose + Material 3 Expressive** | Maven | M3 tokens are already three-level; map DuVay semantic → `md.sys.*` and inherit dynamic color free. Use the Expressive motion-physics tokens rather than DuVay's duration/easing pairs. |
| Windows | **WinUI 3** (Windows App SDK) | NuGet | Direct native Fluent controls. Rejected: MAUI (mobile-first, forces phone layouts onto desktop), Avalonia (Skia, no native widgets). |
| Linux | **GTK4 + libadwaita** via `gtk4-rs` | crates.io | Rust bindings, `adw::Application` for free system light/dark and Adwaita stylesheet. Targets GNOME. KDE/Breeze is explicitly out of scope for v1. |

---

## Web side — five OS skins

This is additive to the existing CSS and is the cheapest, earliest-shipping part of the whole plan.

**Mechanism**, mirroring the existing `[w-theme]` pattern in [`src/themes.css`](src/themes.css) and
Ionic's proven mode model:

- New attribute `w-os` on `<html>`, orthogonal to `w-theme`. Values: `ios`, `material`, `macos`,
  `fluent`, `adwaita`.
- New `src/platforms/{ios,material,macos,fluent,adwaita}.css`. Each is a `[w-os="…"]` block that
  **overrides tokens first** and only then adds component deltas. Target the ~25 components where
  platforms genuinely diverge: dialogs (sheet vs centered), nav bars, switches, selects, scrollbars,
  back affordance, focus ring shape, elevation model, motion curves.
- New entrypoints `src/duvay-ios.css` etc., each `@import "./duvay.css"` + one platform file. The
  build already flattens `@import` recursively
  ([`scripts/build.mjs`](scripts/build.mjs) — `flattenCss`) — add the five entries to `CSS_INDEXES`
  and the dist loop and this works with no build changes. **Do not concatenate all five into
  `duvay.css`**; at 567 KB minified today, a five-skin mega-bundle is disqualifying.
- Detection is a ~15-line addition to [`src/duvay.js`](src/duvay.js) (currently 6.6 KB minified,
  budget is ~5 KB — this fits): set `w-os` from `navigator.userAgentData.platform` with a
  `userAgent` fallback, unless already set. Explicit attribute always wins, exactly as Ionic's mode
  works.

**Constraint that shapes every skin:** if these skins are ever consumed inside a system webview, the
floor is **WebKitGTK 4.1 on Linux**, where `backdrop-filter` is partial and `:has()` still varies by
version in 2026. Gate `backdrop-filter`, and anything else past that baseline, behind `@supports`
with an opaque fallback — testing both `backdrop-filter` and `-webkit-backdrop-filter`, since
WKWebView still wants the prefix. The existing use of `env(safe-area-inset-*)` in
[`src/components/application.css`](src/components/application.css),
[`src/components/bottom-navigation.css`](src/components/bottom-navigation.css) and
[`src/components/layout-responsive.css`](src/components/layout-responsive.css) is already correct
and should be extended, not replaced.

**Liquid Glass specifically:** Apple's real implementation is a private CSS property unavailable to
third parties. The SVG-displacement recreations work in Chromium and fall back to plain frosted blur
in Safari/WKWebView — i.e. they fail on the exact platform they're imitating. The `ios` and `macos`
web skins should therefore ship **translucency + vibrancy via `backdrop-filter`, and stop there**.
True Liquid Glass is delivered by the SwiftUI implementation using the system API, which is a large
part of why the native track exists at all.

---

## Repository and release strategy

**One monorepo, five platform directories.** Fluent runs separate repos per platform and pays for it
with badly uneven release cadence — web at 8.122 while mobile sat on 2021 previews. A monorepo with
a shared `tokens/` and `spec/` makes drift visible in CI on every commit.

```
DUVAY/
  tokens/        DTCG JSON — source of truth
  spec/          component contracts + conformance fixtures
  src/           web (existing) + src/platforms/*.css
  apple/         SwiftPM package — iOS + macOS targets
  android/       Gradle library
  windows/       WinUI 3 class library
  linux/         Rust crate (gtk4-rs + libadwaita)
  scripts/       build.mjs (existing) + tokens build + parity matrix
  website/       docs (existing) + per-platform pages
```

- **Versioning:** keep CalVer (`YY.WW.DD`), one version across all five artifacts, released
  together. A platform that isn't ready ships the previous version — it does not hold the train.
- **CI matrix:** macOS runner (Swift build + snapshot tests), Ubuntu (Gradle, Rust/GTK, web),
  Windows (WinUI). Every job runs the Layer-2 conformance fixtures. A token change that breaks any
  platform's contrast check fails the whole build.
- **Snapshot testing per platform** is the only practical regression net for five renderers:
  XCTest snapshots (Apple), Paparazzi or Compose screenshot tests (Android), WinAppDriver (Windows),
  a GTK offscreen renderer (Linux), Playwright (web — already configured in
  [`playwright.config.js`](playwright.config.js)).
- **Accessibility gate per platform:** VoiceOver (iOS/macOS), TalkBack (Android), Narrator +
  Accessibility Insights (Windows), Orca (Linux), axe (web). Tier 1 cannot ship without a manual
  screen-reader pass per platform; this is not automatable and should be budgeted, not assumed.

---

## Phases

**Phase 0 — Foundation (6–8 weeks, no native code)**
Extract `tokens/` from [`src/tokens.css`](src/tokens.css) + [`src/themes.css`](src/themes.css);
write the CSS generator; regenerate the existing CSS from JSON and diff to byte-equivalence against
the committed `dist/duvay.css` as the correctness proof. Split accent into fg/bg. Author `spec/` for
the 44 Core components from the existing `static attrs` declarations. Extract the first conformance
fixtures from [`src/components/validation.js`](src/components/validation.js) and
[`src/components/calendar-utils.js`](src/components/calendar-utils.js).
*Gate: `bun run build` produces an identical bundle from generated tokens.*

**Phase 1 — Web skins (4–6 weeks)**
Five `src/platforms/*.css` files, five entrypoints, `w-os` detection, docs pages. Ships to real users
immediately and validates the token split before any native line is written.
*Gate: all five skins render every Tier-1 component at AA contrast in light/dark/high-contrast.*

**Phase 2 — Apple, Tier 1 (10–14 weeks)**
SwiftUI package, iOS + macOS targets, 24 components, system materials for Liquid Glass, system
accent, snapshot + conformance + VoiceOver.
*Chosen first because SwiftUI covers two of the five platforms and has the highest fidelity ceiling.*

**Phase 3 — Android, Tier 1 (8–12 weeks, parallel with Phase 2 if staffed)**
Compose + M3 Expressive, dynamic color, Paparazzi snapshots, TalkBack.
*Cheapest native target — M3's token model is closest to DuVay's already.*

**Phase 4 — Windows + Linux, Tier 1 (12–16 weeks)**
WinUI 3 library and gtk4-rs/libadwaita crate. Slowest per component (smallest ecosystems, thinnest
prior art) — sequence last so the spec has stabilised against three implementations first.

**Phase 5 — v1 release**
All five at Tier 1, parity matrix published, docs per platform.

**Phase 6+ — Tier 2**, one component at a time across all five, never one platform racing ahead.

---

## Verification

- `bun run build` — must stay clean; Phase 0 additionally requires generated CSS to match the
  committed `dist/duvay.css`.
- `bun run tokens:check` (new) — every token resolves on all five platforms; every fg/bg pair clears
  WCAG AA in all three themes.
- `bun run parity` (extend the existing [`scripts/vuetify-parity.mjs`](scripts/vuetify-parity.mjs)
  pattern) — emits the five-platform coverage matrix from `spec/`; fails if a platform claims a
  component it hasn't implemented.
- `bun run test:components` — existing Playwright suite, extended to run once per `w-os` value.
- Per-platform: `swift test`, `./gradlew test`, `dotnet test`, `cargo test` — each runs its native
  snapshot suite **and** the shared `spec/fixtures` conformance suite.
- Manual, per platform, per release: screen-reader pass on Tier 1; system accent change while the app
  is running (must repaint); light/dark switch while running; RTL layout.

---

## Explicitly out of scope

No CLI. No native-API bridge (camera, filesystem, notifications, biometrics). No app templates or
starter projects. No signing, notarization, or store submission tooling. No shared runtime. No
DataTable/TreeView/Calendar/ColorPicker on native. KDE/Breeze, web/WASM, and TV/watch/XR targets.

Gallery apps per platform exist as **internal dev and snapshot-test harnesses only** — they are not
shipped, documented, or supported as starters. They are unavoidable: you cannot develop or
screenshot-test a native widget library without a host app.

---

## Sources

- [Tauri 2.0 Stable Release](https://v2.tauri.app/blog/tauri-20/) · [Webview Versions](https://v2.tauri.app/reference/webview-versions/)
- [Ionic — Platform Styles](https://ionicframework.com/docs/theming/platform-styles) · [Theming Basics](https://ionicframework.com/docs/theming/basics)
- [Fluent 2 — Design tokens](https://fluent2.microsoft.design/design-tokens) · [Develop](https://fluent2.microsoft.design/get-started/develop) · [fluentui-apple](https://deepwiki.com/microsoft/fluentui-apple)
- [Material Design 3 — Design tokens](https://m3.material.io/foundations/design-tokens)
- [libadwaita — Styles & Appearance](https://gnome.pages.gitlab.gnome.org/libadwaita/doc/main/styles-and-appearance.html) · [gtk4-rs](https://github.com/gtk-rs/gtk4-rs)
- [Style Dictionary](https://styledictionary.com/)
- [CSS-Tricks — Getting Clarity on Apple's Liquid Glass](https://css-tricks.com/getting-clarity-on-apples-liquid-glass/)
- [WebKit bug 169988 — backdrop-filter on GTK/WPE](https://bugs.webkit.org/show_bug.cgi?id=169988)
- [Avalonia vs MAUI](https://avaloniaui.net/maui-compare) · [Quasar — multi-target builds](https://quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor/)
