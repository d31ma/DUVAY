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
- **Themes** — light, dark, auto (follows `prefers-color-scheme`), and high-contrast. Switch with `data-w-theme` on `<html>`.
- **Utility classes** — Tailwind-style helpers for layout, spacing, type, border, radius, position.
- **Component classes** — buttons, inputs, command palettes, menus, overlays, layout primitives, cards, lists, tables, tabs, feedback, typography, and workflow patterns, all token-driven.
- **Web components** — Light-DOM `<w-*>` elements that render the same DuVay classes. Progressive-enhancement-friendly.
- **Accessibility** — focus rings, keyboard nav, ARIA, reduced-motion respect, WCAG-AA contrast in default themes.

Zero dependencies. Zero build step. Ships as a single CSS file (~307 KB readable / ~231 KB minified), a ~6.8 KB minified behavior layer, and an optional ~10 KB motion add-on. The web-component bundle is ~417 KB readable / ~291 KB minified.

DuVay also ships component-level CSS entrypoints. Import the full framework when you want everything, or import only the core layer and the components your app uses.

## Install

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
@import "duvay-css/core.css";
@import "duvay-css/components/buttons.css";
@import "duvay-css/components/cards.css";
@import "duvay-css/components/tooltips.css";
```

Component CSS files import their required core layer, so this also works when you want a single component in a small page:

```css
@import "duvay-css/components/buttons.css";
```

### Pin to a CalVer release

Every release is permanently available under `https://d31ma.github.io/DUVAY/versions/<VERSION>/`. Replace `VERSION` with the CalVer release you want to lock to:

```html
<link rel="stylesheet" href="https://d31ma.github.io/DUVAY/versions/VERSION/duvay.min.css">
<script src="https://d31ma.github.io/DUVAY/versions/VERSION/duvay.min.js" defer></script>

<!-- optional web components -->
<script type="module" src="https://d31ma.github.io/DUVAY/versions/VERSION/duvay-wc.min.js"></script>
```

## Project layout

```
src/
  core.css          imports reset, tokens, themes, motion, typography, utilities
  duvay.css         full framework entrypoint
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
  duvay.js          ~6.8 KB minified behavior layer (theme, dropdowns, dialogs, ...)
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

## License

[MIT](LICENSE) © DELMA
