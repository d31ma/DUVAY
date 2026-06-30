# DuVay

A zero-dependency CSS framework with design tokens, theming, and accessible
web components. Use utility classes for full control, drop-in `<w-*>` web
components for speed — both share the same design system.

```html
<link rel="stylesheet" href="https://duvay.del.ma/shared/assets/duvay/dist/duvay.min.css">
<script type="module" src="https://duvay.del.ma/shared/assets/duvay/dist/duvay-wc.min.js"></script>

<button class="w-btn w-btn-filled">Save</button>
<w-alert variant="success" title="Done!">Your changes are saved.</w-alert>
```

## What you get

- **Design tokens** — colors, spacing (numeric + t-shirt scales), shape,
  elevation, motion. Every paint value is a CSS custom property.
- **Themes** — light, dark, auto (follows `prefers-color-scheme`), and
  high-contrast. Switch with `data-w-theme` on `<html>`.
- **Utility classes** — Tailwind-style helpers for layout, spacing, type,
  border, radius, position.
- **Component classes** — buttons, inputs, command palettes, menus,
  overlays, layout primitives, cards, lists, tables, tabs, feedback,
  typography, and workflow patterns, all token-driven.
- **Web components** — Light-DOM `<w-*>` elements that render the same
  DuVay classes. Progressive-enhancement-friendly.
- **Accessibility** — focus rings, keyboard nav, ARIA, reduced-motion
  respect, WCAG-AA contrast in default themes.

Zero dependencies. Zero build step. Ships as a single CSS file
(~307 KB readable / ~231 KB minified), a ~6.8 KB minified behavior layer,
and an optional ~10 KB motion add-on. The web-component bundle is
~417 KB readable / ~291 KB minified.

DuVay also ships component-level CSS entrypoints. Import the full framework
when you want everything, or import only the core layer and the components
your app uses.

## Install

### Latest release (hosted)

```html
<link rel="stylesheet" href="https://duvay.del.ma/shared/assets/duvay/dist/duvay.min.css">
<script src="https://duvay.del.ma/shared/assets/duvay/dist/duvay.min.js" defer></script>

<!-- optional: motion transitions (enter/leave/expand/flip/etc.) -->
<script src="https://duvay.del.ma/shared/assets/duvay/dist/duvay-motion.min.js" defer></script>

<!-- optional web components -->
<script type="module" src="https://duvay.del.ma/shared/assets/duvay/dist/duvay-wc.min.js"></script>
```

### Selective CSS imports

```css
@import "duvay-css/core.css";
@import "duvay-css/components/buttons.css";
@import "duvay-css/components/cards.css";
@import "duvay-css/components/tooltips.css";
```

Component CSS files import their required core layer, so this also works when
you want a single component in a small page:

```css
@import "duvay-css/components/buttons.css";
```

### Pin to a CalVer release

Every release is permanently available under `/shared/assets/duvay/versions/<VERSION>/dist/`.
Replace `VERSION` with the CalVer release you want to lock to:

```html
<link rel="stylesheet" href="https://duvay.del.ma/shared/assets/duvay/versions/VERSION/dist/duvay.min.css">
<script src="https://duvay.del.ma/shared/assets/duvay/versions/VERSION/dist/duvay.min.js" defer></script>

<!-- optional web components -->
<script type="module" src="https://duvay.del.ma/shared/assets/duvay/versions/VERSION/dist/duvay-wc.min.js"></script>
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

After any change to `src/`, run `bun run build` so the docs site picks
it up.

## License

MIT
