#!/usr/bin/env bun
// DuVay — token conformance gate
//
// Asserts, for every theme in tokens/semantic/:
//   1. every token referenced by another token resolves (no dangling var())
//   2. every declared foreground/background pair clears its WCAG AA ratio
//
// CI fails on a missing or failing token, so a palette change cannot silently
// regress contrast.
//
//   bun scripts/tokens-check.mjs

import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { loadDocs, tokenEntries } from './tokens-build.mjs';
import { resolveValue, CSS_VAR_PREFIX, inferType } from './tokens-lib.mjs';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

/* ── Contrast pairs ──────────────────────────────────────────────────────
 * `min` follows WCAG 2.2: 4.5:1 for body text, 3:1 for UI components and
 * large text. Each entry is [foreground, background, min, label].
 */
const PAIRS = [
  ['text', 'surface', 4.5, 'body text on surface'],
  ['text', 'surface-container', 4.5, 'body text on container'],
  ['text', 'surface-container-high', 4.5, 'body text on raised container'],
  ['text', 'sidebar', 4.5, 'body text on sidebar'],
  ['text', 'toolbar', 4.5, 'body text on toolbar'],
  ['text-subtle', 'surface', 4.5, 'subtle text on surface'],
  ['on-primary', 'primary', 4.5, 'label on primary fill'],
  ['on-primary-container', 'primary-container', 4.5, 'label on primary container'],
  ['on-error', 'error', 4.5, 'label on error fill'],
  ['on-error-container', 'error-container', 4.5, 'label on error container'],
  ['on-success', 'success', 4.5, 'label on success fill'],
  ['on-success-container', 'success-container', 4.5, 'label on success container'],
  ['on-warning', 'warning', 4.5, 'label on warning fill'],
  ['on-warning-container', 'warning-container', 4.5, 'label on warning container'],
  ['on-secondary-container', 'secondary-container', 4.5, 'label on secondary container'],
  ['on-tertiary-container', 'tertiary-container', 4.5, 'label on tertiary container'],
  ['inverse-on-surface', 'inverse-surface', 4.5, 'label on inverse surface'],
  ['selected-text', 'selected', 4.5, 'label on selected row'],
  // Accent split (libadwaita model): the text accent and the fill accent have
  // different contrast duties and must be validated separately.
  ['accent', 'surface', 4.5, 'accent text on surface'],
  ['accent', 'surface-container', 4.5, 'accent text on container'],
  ['on-accent', 'accent-bg', 4.5, 'label on accent fill'],
  // UI components (3:1) — control boundaries must remain perceivable.
  // --w-outline is the functional control boundary and is gated here.
  // --w-border stays decorative (container edges) and is deliberately not
  // gated, mirroring Material 3's outline / outline-variant split.
  ['outline', 'surface', 3, 'control outline on surface'],
  ['outline', 'surface-container', 3, 'control outline on container'],
  ['accent-bg', 'surface', 3, 'accent fill against surface'],
  ['primary', 'surface', 3, 'primary fill against surface'],
];

/* ── Color math ──────────────────────────────────────────────────────── */

function parseColor(value) {
  const v = String(value).trim();
  let m = /^#([0-9a-f]{3,8})$/i.exec(v);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
    const n = (i) => parseInt(h.slice(i, i + 2), 16);
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 };
  }
  m = /^rgba?\(([^)]+)\)$/i.exec(v);
  if (m) {
    const parts = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    if (parts.length < 3 || parts.some(Number.isNaN)) return null;
    return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 };
  }
  return null;
}

/** Composite a possibly-translucent color over an opaque backdrop. */
function flatten(fg, bg) {
  if (fg.a >= 1) return fg;
  return {
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  };
}

function luminance({ r, g, b }) {
  const ch = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

export function contrast(fgValue, bgValue, pageValue) {
  const fg = parseColor(fgValue);
  const bg = parseColor(bgValue);
  if (!fg || !bg) return null;
  const page = pageValue ? parseColor(pageValue) : null;
  // A translucent background sits on the page surface; text then sits on that.
  const solidBg = flatten(bg, page ?? { r: 255, g: 255, b: 255, a: 1 });
  const solidFg = flatten(fg, solidBg);
  const [a, b] = [luminance(solidFg), luminance(solidBg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

/* ── Run ─────────────────────────────────────────────────────────────── */

export async function run() {
const docs = await loadDocs(join(ROOT, 'tokens'));
const meta = (d) => d.$extensions?.duvay ?? {};

// Primitives are theme-independent and form the base of every resolution map.
const base = new Map();
for (const doc of docs.filter((d) => meta(d).target === 'src/tokens.css')) {
  for (const [name, token] of tokenEntries(doc)) base.set(name, token.$value);
}

const themes = docs
  .filter((d) => meta(d).target === 'src/themes.css')
  .sort((a, b) => meta(a).order - meta(b).order);

let failures = 0;
let checked = 0;

for (const doc of themes) {
  const theme = meta(doc).theme;
  const map = new Map(base);
  for (const [name, token] of tokenEntries(doc)) map.set(name, token.$value);

  // 1. Every var() reference resolves.
  for (const [name, value] of map) {
    for (const ref of String(value).matchAll(/var\((--w-[\w-]+)/g)) {
      const target = ref[1].slice(CSS_VAR_PREFIX.length);
      if (!map.has(target)) {
        console.error(`✗ [${theme}] --w-${name} references undefined --w-${target}`);
        failures++;
      }
    }
  }

  // 2. Every declared pair clears its ratio.
  const page = resolveValue(map.get('surface') ?? '#ffffff', map);
  for (const [fgName, bgName, min, label] of PAIRS) {
    if (!map.has(fgName) || !map.has(bgName)) {
      console.error(`✗ [${theme}] missing token for "${label}" (--w-${fgName} / --w-${bgName})`);
      failures++;
      continue;
    }
    const fg = resolveValue(map.get(fgName), map);
    const bg = resolveValue(map.get(bgName), map);
    const ratio = contrast(fg, bg, page);
    if (ratio === null) {
      console.error(`✗ [${theme}] cannot evaluate "${label}" (${fg} on ${bg})`);
      failures++;
      continue;
    }
    checked++;
    if (ratio < min) {
      console.error(
        `✗ [${theme}] ${label}: ${ratio.toFixed(2)}:1 < ${min}:1  (--w-${fgName} ${fg} on --w-${bgName} ${bg})`,
      );
      failures++;
    }
  }
}

/* ── Platform skins ──────────────────────────────────────────────────────
 * The Phase-1 gate is "all five skins render every Tier-1 component at AA
 * contrast in light/dark/high-contrast". Rather than sample that by rendering,
 * it is enforced structurally: a skin may not declare a colour token. Colour
 * therefore comes only from the theme, whose pairs are validated above, and
 * the guarantee holds for every skin × theme combination by construction.
 */
// Keyed on the skin *files*, which keep the design-language names. The OS-named
// aliases (android/windows/linux) live inside those same files as extra
// selectors, so there is nothing separate to validate.
const SKINS = ['ios', 'material', 'macos', 'fluent', 'adwaita'];

/**
 * Tokens a skin may not override, beyond colour.
 *
 * Control size, the radius scale and the type scale are brand tokens: they are
 * what makes an app recognisably the same product on every platform. Left
 * unguarded they drift fast — the first pass of these skins ranged from a 22px
 * macOS control to a 48px Material one, a 2.2x spread that read as five
 * different design systems rather than one with a native accent.
 *
 * Platform character lives in font family, motion, elevation, chrome heights,
 * switch geometry, focus rings and scrollbars, none of which are gated.
 */
const BRAND_TOKEN = /^(size-|size-icon-|radius$|radius-|touch-min$|font-base$|font-(xs|sm|md|lg|xl|2xl|3xl)$|type-|space-|grid-gutter$|container-max$)/;

const declared = {};
for (const skin of SKINS) {
  const path = join(ROOT, 'src', 'platforms', `${skin}.css`);
  const css = await readFile(path, 'utf8').catch(() => null);
  if (css === null) {
    console.error(`✗ [${skin}] src/platforms/${skin}.css is missing`);
    failures++;
    continue;
  }

  const tokens = new Map();
  for (const m of css.matchAll(/^\s+(--w-[\w-]+):\s*([^;]+);/gm)) tokens.set(m[1].slice(4), m[2].trim());
  declared[skin] = tokens;

  for (const [name, value] of tokens) {
    if (inferType(value) === 'color') {
      console.error(
        `✗ [${skin}] declares colour token --w-${name}: ${value} — skins must not override colour, `
        + 'or the theme contrast guarantee no longer covers them',
      );
      failures++;
    } else if (BRAND_TOKEN.test(name)) {
      console.error(
        `✗ [${skin}] declares brand token --w-${name}: ${value} — control size, radius and type `
        + 'are shared across skins so the product stays recognisable',
      );
      failures++;
    }
  }
}

// Every skin must cover the same platform-token surface. A skin that defines
// a motion curve but no font family, say, is half a skin — the gap is filled
// silently by the base and only shows up on one platform.
const complete = SKINS.filter((s) => declared[s]);
if (complete.length > 1) {
  const reference = new Set(declared[complete[0]].keys());
  for (const skin of complete.slice(1)) {
    const missing = [...reference].filter((k) => !declared[skin].has(k));
    const required = missing.filter((k) => /^(font-family|motion|transition|shadow-|switch-)/.test(k));
    if (required.length) {
      console.error(`✗ [${skin}] missing platform tokens declared by ${complete[0]}: ${required.join(', ')}`);
      failures++;
    }
  }
}

/* ── Density ─────────────────────────────────────────────────────────────
 * Density rescales control geometry, which is the one place a token change can
 * push a control under an accessibility floor. WCAG 2.5.8 Target Size
 * (Minimum) is 24x24 CSS px at AA; the 44px touch floor is stricter but only
 * applies to touch, so compact is allowed below it and gated here instead.
 */
const WCAG_MIN_TARGET_PX = 24;

const densities = docs
  .filter((d) => meta(d).target === 'src/density.css')
  .sort((a, b) => meta(a).order - meta(b).order);
// Selectable densities, excluding the media-wrapped coarse-pointer guard.
const selectableDensities = densities.filter((d) => !meta(d).density.endsWith('-coarse'));

for (const doc of densities) {
  const name = meta(doc).density;
  // The coarse-pointer guard restates comfortable inside a media query; it is
  // not a selectable density and is validated by the density it restores.
  if (name.endsWith('-coarse')) continue;
  const values = new Map(tokenEntries(doc).map(([k, t]) => [k, t.$value]));

  const touch = values.get('touch-min');
  if (!touch) {
    console.error(`✗ [density:${name}] does not declare --w-touch-min`);
    failures++;
  } else {
    const px = touch.endsWith('rem') ? parseFloat(touch) * 16 : parseFloat(touch);
    if (!(px >= WCAG_MIN_TARGET_PX)) {
      console.error(
        `✗ [density:${name}] --w-touch-min ${touch} (${px}px) is below the `
        + `${WCAG_MIN_TARGET_PX}px WCAG 2.5.8 AA target-size minimum`,
      );
      failures++;
    }
  }

  // A density that shrinks the scale but leaves an icon size behind produces
  // controls that no longer line up with their icons.
  for (const step of ['xs', 'sm', 'md', 'lg', 'xl']) {
    for (const prefix of ['size-', 'size-icon-']) {
      if (!values.has(prefix + step)) {
        console.error(`✗ [density:${name}] missing --w-${prefix}${step}`);
        failures++;
      }
    }
  }
}

if (failures) {
  console.error(`\n✗ tokens:check — ${failures} failure(s) across ${themes.length} themes`);
  process.exit(1);
}
console.log(
  `✓ tokens:check — ${checked} contrast pairs pass across ${themes.length} themes; `
  + `${complete.length} skins override no brand tokens; `
  + `${selectableDensities.length} densities clear the WCAG target-size minimum`,
);
}

if (import.meta.main) await run();
