<h1 align="center">
  DuVay
</h1>

<p align="center">
  A zero-dependency CSS framework with design tokens, theming, and accessible web components.
</p>

<p align="center">
  <a href="https://duvay.del.ma">Website</a>
  ·
  <a href="https://duvay.del.ma/docs/getting-started">Docs</a>
  ·
  <a href="https://github.com/d31ma/DUVAY/issues">Issues</a>
  ·
  <a href="https://github.com/d31ma/DUVAY/releases">Releases</a>
</p>

<p align="center">
  <a href="https://github.com/d31ma/DUVAY/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT">
  </a>
  <img src="https://img.shields.io/badge/bun-%3E%3D1.0.0-black?logo=bun" alt="Bun >= 1.0.0">
  <img src="https://img.shields.io/badge/zero--dependencies-yes-success" alt="Zero dependencies">
</p>

---

<p align="center">
  Use utility classes for full control, drop-in <code>&lt;w-*&gt;</code> web components for speed — both share the same design system.
</p>

```html
<link rel="stylesheet" href="https://d31ma.github.io/DUVAY/latest/duvay.min.css">
<script type="module" src="https://d31ma.github.io/DUVAY/latest/duvay-wc.min.js"></script>

<button class="w-btn w-btn-filled">Save</button>
<w-alert variant="success" title="Done!">Your changes are saved.</w-alert>
```

## What you get

- **Design tokens** — colors, spacing (numeric + t-shirt scales), shape, elevation, motion. Every paint value is a CSS custom property.
- **Themes** — light, dark, auto (follows `prefers-color-scheme`), and high-contrast. Switch with `w-theme` on `<html>`.
- **Utility classes** — Tailwind-style helpers for layout, spacing, type, border, radius, position.
- **Component classes** — buttons, inputs, command palettes, menus, overlays, layout primitives, cards, lists, tables, tabs, feedback, typography, and workflow patterns, all token-driven.
- **Web components** — Light-DOM `<w-*>` elements that render the same DuVay classes. Progressive-enhancement-friendly.
- **Accessibility** — focus rings, keyboard nav, ARIA, reduced-motion respect, WCAG-AA contrast in default themes.

Zero dependencies. Zero build step. Ships as a single CSS file (~722 KiB readable / ~554 KiB minified), a ~6.5 KiB minified behavior layer, and an optional ~10 KiB minified motion add-on. The web-component bundle is ~1.05 MiB readable / ~754 KiB minified.

DuVay also ships component-level CSS entrypoints. Import the full framework when you want everything, or import only the core layer and the components your app uses.

## Install

DuVay is distributed as hosted files, not as a package-manager dependency.
There is no `npm install` step — link the CSS and JS directly, or vendor the
files into your own asset pipeline.

### Latest release (hosted)

```html
<link rel="stylesheet" href="https://d31ma.github.io/DUVAY/latest/duvay.min.css">
<script src="https://d31ma.github.io/DUVAY/latest/duvay.min.js" defer></script>

<!-- optional: motion transitions (enter/leave/expand/flip/etc.) -->
<script src="https://d31ma.github.io/DUVAY/latest/duvay-motion.min.js" defer></script>

<!-- optional web components -->
<script type="module" src="https://d31ma.github.io/DUVAY/latest/duvay-wc.min.js"></script>
```

### Selective CSS imports

```css
@import "https://d31ma.github.io/DUVAY/latest/core.css";
@import "https://d31ma.github.io/DUVAY/latest/components/buttons.css";
@import "https://d31ma.github.io/DUVAY/latest/components/cards.css";
@import "https://d31ma.github.io/DUVAY/latest/components/tooltips.css";
```

Component CSS files import their required core layer, so this also works when you want a single component in a small page:

```css
@import "https://d31ma.github.io/DUVAY/latest/components/buttons.css";
```

If you vendor the files instead, the same entrypoints work from whatever local
path you copy them to.

### Pin to a CalVer release

Every release is permanently available under `https://d31ma.github.io/DUVAY/versions/<VERSION>/`. Replace `VERSION` with the CalVer release you want to lock to:

```html
<link rel="stylesheet" href="https://d31ma.github.io/DUVAY/versions/VERSION/duvay.min.css">
<script src="https://d31ma.github.io/DUVAY/versions/VERSION/duvay.min.js" defer></script>

<!-- optional web components -->
<script type="module" src="https://d31ma.github.io/DUVAY/versions/VERSION/duvay-wc.min.js"></script>
```

## Platform skins

DuVay ships a skin per platform, selected with the `w-os` attribute on
`<html>`, orthogonal to `w-theme` — so every skin works in light, dark, auto,
and high-contrast. Write the OS name; each vendor's design-language name is
accepted as an alias, and the two are fully interchangeable.

| Platform | Write | Also accepted | Design language |
|---|---|---|---|
| Web (no skin) | `w-os=""` | — | DuVay's own |
| iOS | `w-os="ios"` | — | Apple HIG |
| Android | `w-os="android"` | `w-os="material"` | Material 3 |
| macOS | `w-os="macos"` | — | Apple HIG |
| Windows | `w-os="windows"` | `w-os="fluent"` | Fluent 2 |
| Linux | `w-os="linux"` | `w-os="adwaita"` | libadwaita / GNOME |

Entrypoints follow the same rule: `duvay-android.css` and `duvay-material.css`
are the same stylesheet under two names.

```html
<link rel="stylesheet" href="https://d31ma.github.io/DUVAY/latest/duvay-android.min.css">
<script src="https://d31ma.github.io/DUVAY/latest/duvay.min.js" defer></script>
```

Or layer a skin onto an existing `duvay.css`:

```css
@import "https://d31ma.github.io/DUVAY/latest/duvay.css";
@import "https://d31ma.github.io/DUVAY/latest/platforms/macos.css";
```

`duvay.js` sets `w-os` from the user agent when the attribute is absent; an
explicit attribute always wins (`<html w-os="material">` pins a skin,
`<html w-os="">` opts out).

Skins override **platform tokens** — font family, motion, elevation, chrome
heights, switch geometry, focus rings — and never override **brand tokens**:
colour, control size, the radius scale or the type scale. That split is what
keeps an app recognisably the same product on every platform, and it means the
WCAG AA guarantees hold for every skin without re-validation.
`bun run tokens:check` enforces it.

### Density

Control size is an application's choice, not the skin's. `w-density` rescales
control geometry, orthogonal to `w-theme` and `w-os`, and works on any subtree:

```html
<html w-density="compact">      <!-- 32px controls, pointer-first -->
<section w-density="compact">   <!-- or scope it to one region -->
```

`duvay.js` sets `compact` automatically alongside `w-os="macos"`. Compact drops
`--w-touch-min` to 28px — deliberate for pointer input, still clear of the 24px
WCAG 2.5.8 AA minimum that `tokens:check` enforces. Don't use it on touch.

See [Platform skins](https://duvay.del.ma/docs/platform-skins) for the live switcher.

## Design tokens

`tokens/` holds the design tokens as [DTCG](https://tr.designtokens.org/) JSON
and is the **source of truth**; `src/tokens.css` and `src/themes.css` are
generated from it by `bun run tokens:build` (a ~100-line Bun script — no Style
Dictionary dependency, so the framework stays zero-dependency).

```sh
bun run tokens:build    # regenerate src/tokens.css + src/themes.css
bun run tokens:check    # WCAG AA contrast + skin rules, fails CI on regression
bun run verify          # every gate: tokens, spec, fixtures, parity
```

## Native platforms

DuVay is becoming a cross-platform UI that renders with each OS's own widgets —
SwiftUI, Jetpack Compose, WinUI 3 and GTK4/libadwaita — rather than a webview
shell. See [CROSS-PLATFORM-PLAN.md](CROSS-PLATFORM-PLAN.md) for scope and status.

```
tokens/    →  bun run tokens:native  →  apple/ android/ windows/ linux/
spec/      →  the component contract + 116 conformance vectors
```

Behaviour is shared as **language-neutral JSON test vectors**, not a shared
runtime. Each platform reimplements the logic idiomatically and must pass the
same suite; four independent implementations (Swift, Kotlin, Rust, C#) currently
agree with the JavaScript reference and each other.

```sh
source /Volumes/ANNEX/toolchains/duvay-env.sh   # toolchains live off-system
bun run tokens:native                            # regenerate native tokens
bun run native:verify                            # all four conformance suites
```

All five platforms now implement the whole Core contract — **46/46** each. That
is *implemented*, not *shipped*: a platform is only advertised as supported once
someone has signed the manual screen-reader pass, and `platform-parity` refuses a
publishable claim without that record. The live matrix is at
[/docs/platform-parity](https://duvay.del.ma/docs/platform-parity).

## Accessibility

Contrast, target size and ARIA correctness are build gates rather than review
steps:

```sh
bun run tokens:check    # 100 contrast pairs across four themes
bun run test:a11y       # axe over every element, once per platform skin
bun run test:skins      # the full component suite once per w-os value
```

All six skin runs produce identical axe results — a skin may not declare colour
or control size, so the guarantees verified once carry to every skin by
construction. Full detail at
[/docs/features/accessibility](https://duvay.del.ma/docs/features/accessibility).

## Using with Tailwind

DuVay and Tailwind coexist cleanly — use DuVay components for structure and
Tailwind utilities for one-off tweaks. DuVay namespaces everything under `w-`
and `<w-*>` elements, so there are no class collisions, and its reset only
touches base elements Tailwind's Preflight already handles compatibly.

The one thing to control is **override direction**: DuVay component classes and
Tailwind utilities share the same specificity, so without help the winner
depends on load order. Import DuVay into a lower [cascade
layer](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) so Tailwind
utilities always win:

```css
/* Tailwind v4 */
@layer duvay, theme, base, components, utilities;
@import "https://d31ma.github.io/DUVAY/latest/duvay.css" layer(duvay);
@import "tailwindcss";
```

```css
/* Tailwind v3 */
@layer duvay;
@import "https://d31ma.github.io/DUVAY/latest/duvay.css" layer(duvay);
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Now `<button class="w-btn w-btn-filled rounded-full">` takes DuVay's button
styling and Tailwind's radius, regardless of source order. DuVay's few
`!important` rules (`[hidden]`, reduced-motion) still hold, since `!important`
inverts layer precedence.

## Project layout

```
tokens/           DTCG JSON — source of truth for tokens.css + themes.css
  primitive/        type, spacing, shape, sizing, layout, motion, z-index
  semantic/         light / dark / auto / high-contrast palettes
spec/             component contracts + conformance fixtures
  core-contract.json  the 46 Core components and their per-platform names
  components/       one contract per Core component (generated from src/)
  fixtures/         language-neutral behaviour vectors for native ports
src/
  core.css          imports reset, tokens, themes, density, motion, type, utilities
  density.css       w-density control scale (generated)
  duvay.css         full framework entrypoint
  duvay-<os>.css    full framework + one OS skin (ios/material/macos/fluent/adwaita)
  platforms/        the five OS skins, each scoped to [w-os="…"]
  grid.css          grid component index
  layout.css        layout component index
  navigation.css    navigation component index
  content.css       content component index
  feedback.css      feedback component index
  forms.css         form component index
  reset.css         baseline reset (minimal, opinionated)
  tokens.css        design tokens (single source of truth)
  themes.css        light / dark / auto / high-contrast
  typography.css    type scale & weight helpers
  utilities.css     utility classes (display, flex, gap, padding, ...)
  duvay.js          ~6.5 KiB minified behavior layer (theme, dropdowns, dialogs, ...)
  duvay-wc.js       web-component barrel
  components/       individual <w-*> custom elements and component CSS files
    buttons.css
    cards.css
    tooltips.css
    ...
website/            docs site (Tachyon, runs at `bun run docs:dev`)
scripts/build.mjs   resolves CSS imports into dist/duvay.css and syncs the
                    docs site's local copy of the framework
```

## Develop

```sh
bun run build       # resolves CSS imports, writes dist/, and syncs the docs site
bun run docs:dev    # docs site at http://localhost:3000
bun run docs:build  # static export to website/dist/
```

After any change to `src/`, run `bun run build` so the docs site picks it up.
Release operators should follow [RELEASING.md](RELEASING.md).

## License

[MIT](LICENSE) © DELMA
