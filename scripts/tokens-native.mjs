#!/usr/bin/env bun
// DuVay — token pipeline: DTCG JSON → native language constants
//
// Layer 1's multi-target step. One source (tokens/) produces the resolved
// token set for every platform, so a colour or spacing change lands on all
// five simultaneously and CI can prove it did.
//
//   Target    Output
//   Apple     apple/Sources/DuVayTokens/DuVayTokens.swift
//   Android   android/duvay-core/src/main/kotlin/ma/del/duvay/DuVayTokens.kt
//   Windows   windows/DuVay.Core/DuVayTokens.cs
//   Linux     linux/src/tokens.rs  +  linux/resources/tokens.css (GTK CSS)
//
// Still no Style Dictionary: these emitters are ~40 lines each and the repo's
// zero-dependency promise is worth more than the abstraction. The JSON is DTCG,
// so swapping in Style Dictionary later costs nothing.
//
//   bun scripts/tokens-native.mjs           write all native token files
//   bun scripts/tokens-native.mjs --check   fail if any is stale

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDocs, tokenEntries } from './tokens-build.mjs';
import { resolveValue } from './tokens-lib.mjs';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const meta = (d) => d.$extensions?.duvay ?? {};

/* ── Value conversion ────────────────────────────────────────────────── */

const REM = 16; // CSS root font size; the basis for pt / dp / px conversion.

/** `0.75rem` / `12px` → 12. Returns null when the value is not a length. */
function toNumber(value) {
  const v = String(value).trim();
  let m = /^(-?[\d.]+)rem$/.exec(v);
  if (m) return +(parseFloat(m[1]) * REM).toFixed(4);
  m = /^(-?[\d.]+)px$/.exec(v);
  if (m) return parseFloat(m[1]);
  m = /^(-?[\d.]+)$/.exec(v);
  if (m) return parseFloat(m[1]);
  return null;
}

/** `120ms` / `0.2s` → milliseconds. */
function toMillis(value) {
  const m = /^(-?[\d.]+)(m?s)$/.exec(String(value).trim());
  if (!m) return null;
  return m[2] === 'ms' ? parseFloat(m[1]) : parseFloat(m[1]) * 1000;
}

/** Any CSS colour → { r, g, b, a } with 0–255 channels, or null. */
function toRgba(value) {
  const v = String(value).trim();
  let m = /^#([0-9a-f]{3,8})$/i.exec(v);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
    const n = (i) => parseInt(h.slice(i, i + 2), 16);
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? +(n(6) / 255).toFixed(4) : 1 };
  }
  m = /^rgba?\(([^)]+)\)$/i.exec(v);
  if (m) {
    const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    if (p.length < 3 || p.some(Number.isNaN)) return null;
    return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 };
  }
  return null;
}

/* ── Naming ──────────────────────────────────────────────────────────── */

// Split on `-` only. `_` is DuVay's decimal marker (`--w-space-1_5` is 1.5
// steps, not 15), so folding it away would collide space-1_5 with space-15.
const parts = (name) => name.split('-').filter(Boolean);
const camel = (name) => {
  const [head, ...rest] = parts(name);
  return head.replace(/^\d/, '_$&') + rest.map((p) => p[0].toUpperCase() + p.slice(1)).join('');
};
const pascal = (name) => parts(name).map((p) => p[0].toUpperCase() + p.slice(1)).join('');
const screaming = (name) => parts(name).join('_').toUpperCase().replace(/^\d/, '_$&');

/* ── Token model ─────────────────────────────────────────────────────── */

/**
 * Resolve tokens/ into the shape the emitters want:
 *   scalars  platform-independent lengths, durations and numbers
 *   themes   { theme → { name → rgba } } for every colour token
 *
 * Tokens whose value has no native analogue (font stacks, shadow recipes,
 * gradients, cubic-beziers) are deliberately skipped: each platform expresses
 * those in its own idiom and forcing a shared representation produces a
 * lowest-common-denominator that nobody uses.
 */
async function model() {
  const docs = await loadDocs(join(ROOT, 'tokens'));

  const base = new Map();
  for (const doc of docs.filter((d) => meta(d).target === 'src/tokens.css').sort((a, b) => meta(a).order - meta(b).order)) {
    for (const [name, token] of tokenEntries(doc)) base.set(name, token.$value);
  }

  const scalars = { dimensions: [], durations: [], numbers: [] };
  for (const [name, raw] of base) {
    const value = resolveValue(raw, base) ?? raw;
    if (/^(font-family|shadow-|type-|bp-)/.test(name)) continue;
    if (String(value).includes('cubic-bezier') || String(value).includes('var(')) continue;

    const ms = toMillis(value);
    if (ms !== null) { scalars.durations.push([name, ms]); continue; }
    if (/rem$|px$/.test(String(value).trim())) {
      const n = toNumber(value);
      if (n !== null) scalars.dimensions.push([name, n]);
      continue;
    }
    const n = toNumber(value);
    if (n !== null && /^(z-|.*-opacity$|.*-scale$)/.test(name)) scalars.numbers.push([name, n]);
  }

  const themes = {};
  for (const doc of docs.filter((d) => meta(d).target === 'src/themes.css').sort((a, b) => meta(a).order - meta(b).order)) {
    const map = new Map(base);
    for (const [name, token] of tokenEntries(doc)) map.set(name, token.$value);
    const colors = {};
    for (const [name, token] of tokenEntries(doc)) {
      const rgba = toRgba(resolveValue(token.$value, map) ?? token.$value);
      if (rgba) colors[name] = rgba;
    }
    themes[meta(doc).theme] = colors;
  }

  return { scalars, themes };
}

const BANNER = (lang) => `${lang} DuVay design tokens — GENERATED, do not edit.
${lang} Source of truth: tokens/**/*.json. Regenerate with \`bun run tokens:native\`.`;

/* ── Apple / Swift ───────────────────────────────────────────────────── */

function emitSwift({ scalars, themes }) {
  const L = [];
  L.push(BANNER('//'), '', 'import SwiftUI', '', 'public enum DuVayTokens {', '');

  L.push('    // MARK: - Dimensions (points)');
  for (const [n, v] of scalars.dimensions) L.push(`    public static let ${camel(n)}: CGFloat = ${v}`);
  L.push('', '    // MARK: - Durations (seconds)');
  for (const [n, v] of scalars.durations) L.push(`    public static let ${camel(n)}: TimeInterval = ${+(v / 1000).toFixed(4)}`);
  L.push('', '    // MARK: - Scalars');
  for (const [n, v] of scalars.numbers) L.push(`    public static let ${camel(n)}: Double = ${v}`);

  L.push('', '    // MARK: - Themes', '');
  L.push('    public enum Theme: String, CaseIterable, Sendable {');
  for (const t of Object.keys(themes)) L.push(`        case ${camel(t)} = "${t}"`);
  L.push('    }', '');

  L.push('    public struct Palette: Sendable {');
  const names = [...new Set(Object.values(themes).flatMap((t) => Object.keys(t)))].sort();
  for (const n of names) L.push(`        public let ${camel(n)}: Color`);
  L.push('    }', '');

  for (const [theme, colors] of Object.entries(themes)) {
    L.push(`    public static let ${camel(theme)}Palette = Palette(`);
    L.push(names.map((n) => {
      const c = colors[n] ?? { r: 0, g: 0, b: 0, a: 0 };
      return `        ${camel(n)}: Color(.sRGB, red: ${+(c.r / 255).toFixed(4)}, green: ${+(c.g / 255).toFixed(4)}, blue: ${+(c.b / 255).toFixed(4)}, opacity: ${c.a})`;
    }).join(',\n'));
    L.push('    )', '');
  }

  L.push('    public static func palette(for theme: Theme) -> Palette {');
  L.push('        switch theme {');
  for (const t of Object.keys(themes)) L.push(`        case .${camel(t)}: return ${camel(t)}Palette`);
  L.push('        }', '    }', '}', '');
  return L.join('\n');
}

/* ── Android / Kotlin ────────────────────────────────────────────────── */

/**
 * Plain Kotlin — deliberately no Compose types.
 *
 * Colours are ARGB Longs and dimensions are Doubles in dp, so the module that
 * owns them stays a pure JVM library. That is what lets `./gradlew test` run
 * the conformance suite without the Android SDK or an emulator; the Compose
 * layer adds `Color(...)` / `.dp` wrappers on top.
 */
function emitKotlin({ scalars, themes }) {
  const L = [];
  L.push(BANNER('//'), '', 'package ma.del.duvay', '', 'object DuVayTokens {', '');

  // Kotlin Double literals need an explicit decimal: `4` is an Int.
  const dbl = (v) => (Number.isInteger(v) ? `${v}.0` : `${v}`);
  L.push('    // Dimensions (dp)');
  for (const [n, v] of scalars.dimensions) L.push(`    const val ${camel(n)}: Double = ${dbl(v)}`);
  L.push('', '    // Durations (milliseconds)');
  for (const [n, v] of scalars.durations) L.push(`    const val ${camel(n)}Ms: Int = ${Math.round(v)}`);
  L.push('', '    // Scalars');
  for (const [n, v] of scalars.numbers) L.push(`    const val ${camel(n)}: Double = ${dbl(v)}`);

  L.push('', '    enum class Theme(val id: String) {');
  L.push(Object.keys(themes).map((t) => `        ${screaming(t)}("${t}")`).join(',\n') + ';');
  L.push('    }', '');

  const names = [...new Set(Object.values(themes).flatMap((t) => Object.keys(t)))].sort();
  L.push('    /** sRGB colour packed as 0xAARRGGBB. */');
  L.push('    data class Palette(');
  L.push(names.map((n) => `        val ${camel(n)}: Long`).join(',\n'));
  L.push('    )', '');

  for (const [theme, colors] of Object.entries(themes)) {
    L.push(`    val ${screaming(theme)}_PALETTE = Palette(`);
    L.push(names.map((n) => {
      const c = colors[n] ?? { r: 0, g: 0, b: 0, a: 0 };
      const hex = [Math.round(c.a * 255), c.r, c.g, c.b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('');
      return `        ${camel(n)} = 0x${hex.toUpperCase()}L`;
    }).join(',\n'));
    L.push('    )', '');
  }

  L.push('    fun palette(theme: Theme): Palette = when (theme) {');
  for (const t of Object.keys(themes)) L.push(`        Theme.${screaming(t)} -> ${screaming(t)}_PALETTE`);
  L.push('    }', '}', '');
  return L.join('\n');
}

/* ── Windows / C# ────────────────────────────────────────────────────── */

function emitCSharp({ scalars, themes }) {
  const L = [];
  L.push(BANNER('//'), '', 'namespace DuVay.Core;', '',
    '/// <summary>DuVay design tokens, resolved per theme.</summary>',
    'public static class DuVayTokens', '{');

  L.push('    // Dimensions (device-independent pixels)');
  for (const [n, v] of scalars.dimensions) L.push(`    public const double ${pascal(n)} = ${v};`);
  L.push('', '    // Durations (milliseconds)');
  for (const [n, v] of scalars.durations) L.push(`    public const int ${pascal(n)}Duration = ${Math.round(v)};`);
  L.push('', '    // Scalars');
  for (const [n, v] of scalars.numbers) L.push(`    public const double ${pascal(n)} = ${v};`);
  L.push('}', '');

  L.push('public enum DuVayTheme', '{');
  L.push(Object.keys(themes).map((t) => `    ${pascal(t)}`).join(',\n'));
  L.push('}', '');

  L.push('/// <summary>An sRGB colour with straight alpha.</summary>');
  L.push('public readonly record struct DuVayColor(byte R, byte G, byte B, double A)', '{');
  L.push('    public string ToHex() => $"#{R:X2}{G:X2}{B:X2}";', '}', '');

  const names = [...new Set(Object.values(themes).flatMap((t) => Object.keys(t)))].sort();
  L.push('public sealed class DuVayPalette', '{');
  for (const n of names) L.push(`    public required DuVayColor ${pascal(n)} { get; init; }`);
  L.push('');
  for (const [theme, colors] of Object.entries(themes)) {
    L.push(`    public static readonly DuVayPalette ${pascal(theme)} = new()`, '    {');
    L.push(names.map((n) => {
      const c = colors[n] ?? { r: 0, g: 0, b: 0, a: 0 };
      return `        ${pascal(n)} = new(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)}, ${c.a})`;
    }).join(',\n'));
    L.push('    };', '');
  }
  L.push('    public static DuVayPalette For(DuVayTheme theme) => theme switch', '    {');
  for (const t of Object.keys(themes)) L.push(`        DuVayTheme.${pascal(t)} => ${pascal(t)},`);
  L.push('        _ => throw new ArgumentOutOfRangeException(nameof(theme)),', '    };', '}', '');
  return L.join('\n');
}

/* ── Linux / Rust ────────────────────────────────────────────────────── */

function emitRust({ scalars, themes }) {
  const L = [];
  L.push(BANNER('//'), '', '#![allow(dead_code)]', '');

  L.push('/// Dimensions in logical pixels.');
  L.push('pub mod dimension {');
  for (const [n, v] of scalars.dimensions) L.push(`    pub const ${screaming(n)}: f64 = ${v.toFixed(1)};`);
  L.push('}', '');
  L.push('/// Durations in milliseconds.');
  L.push('pub mod duration {');
  for (const [n, v] of scalars.durations) L.push(`    pub const ${screaming(n)}: u32 = ${Math.round(v)};`);
  L.push('}', '');

  L.push('#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]');
  L.push('pub enum Theme {');
  for (const t of Object.keys(themes)) L.push(`    ${pascal(t)},`);
  L.push('}', '');
  L.push('impl Theme {');
  L.push('    pub fn id(self) -> &\'static str {');
  L.push('        match self {');
  for (const t of Object.keys(themes)) L.push(`            Theme::${pascal(t)} => "${t}",`);
  L.push('        }', '    }', '}', '');

  L.push('#[derive(Debug, Clone, Copy, PartialEq)]');
  L.push('pub struct Rgba { pub r: u8, pub g: u8, pub b: u8, pub a: f32 }', '');

  const names = [...new Set(Object.values(themes).flatMap((t) => Object.keys(t)))].sort();
  L.push('#[derive(Debug, Clone, Copy, PartialEq)]');
  L.push('pub struct Palette {');
  for (const n of names) L.push(`    pub ${screaming(n).toLowerCase()}: Rgba,`);
  L.push('}', '');

  for (const [theme, colors] of Object.entries(themes)) {
    L.push(`pub const ${screaming(theme)}: Palette = Palette {`);
    L.push(names.map((n) => {
      const c = colors[n] ?? { r: 0, g: 0, b: 0, a: 0 };
      return `    ${screaming(n).toLowerCase()}: Rgba { r: ${Math.round(c.r)}, g: ${Math.round(c.g)}, b: ${Math.round(c.b)}, a: ${c.a.toFixed(4)} },`;
    }).join('\n'));
    L.push('};', '');
  }

  L.push('pub fn palette(theme: Theme) -> Palette {');
  L.push('    match theme {');
  for (const t of Object.keys(themes)) L.push(`        Theme::${pascal(t)} => ${screaming(t)},`);
  L.push('    }', '}', '');
  return L.join('\n');
}

/** GTK reads real CSS, so the Linux target also gets a stylesheet of @define-color. */
function emitGtkCss({ themes }) {
  const L = [BANNER('/*').replace(/\n/g, '\n *') + ' */', ''];
  for (const [theme, colors] of Object.entries(themes)) {
    L.push(`/* ── ${theme} ─────────────────────────────────────────────── */`);
    for (const [n, c] of Object.entries(colors)) {
      const value = c.a >= 1
        ? `#${[c.r, c.g, c.b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('')}`
        : `rgba(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)}, ${c.a})`;
      L.push(`@define-color duvay_${theme.replace(/-/g, '_')}_${n.replace(/-/g, '_')} ${value};`);
    }
    L.push('');
  }
  return L.join('\n');
}

/* ── Windows / XAML ──────────────────────────────────────────────────── */

/**
 * A WinUI ResourceDictionary of brushes and scalars.
 *
 * `DuVayTokens.cs` covers C#, but XAML markup cannot reach a static field:
 * a template that wants the accent has to write `{StaticResource
 * DuVayAccentBrush}`. This is the file that makes that possible, and it is why
 * the plan's output table lists a ResourceDictionary alongside the class.
 *
 * Light and dark go in a ThemeDictionaries group so the framework swaps them
 * when the system theme changes — the alternative, resolving the palette in
 * code, would not repaint a running app. High-contrast is a WinUI-recognised
 * key too, so it is emitted where the platform expects it. `auto` is deliberately
 * absent: on Windows that decision belongs to the framework, not to us.
 */
function emitXaml({ scalars, themes }) {
  const hex = (c) => '#'
    + [c.a >= 1 ? 255 : Math.round(c.a * 255), c.r, c.g, c.b]
      .map((x) => Math.round(x).toString(16).padStart(2, '0').toUpperCase())
      .join('');

  // WinUI's own names for the theme dictionaries; DuVay's `auto` has no slot
  // because the framework performs that resolution itself.
  const THEME_KEYS = { light: 'Light', dark: 'Dark', 'high-contrast': 'HighContrast' };

  const L = [
    '<!--',
    '    DuVay design tokens — GENERATED, do not edit.',
    '    Source of truth: tokens/**/*.json. Regenerate with `bun run tokens:native`.',
    '-->',
  ];
  L.push('<ResourceDictionary');
  L.push('    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"');
  L.push('    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">');
  L.push('');
  L.push('    <ResourceDictionary.ThemeDictionaries>');

  for (const [theme, key] of Object.entries(THEME_KEYS)) {
    const colors = themes[theme];
    if (!colors) continue;
    L.push(`        <ResourceDictionary x:Key="${key}">`);
    for (const [n, c] of Object.entries(colors)) {
      // A token already ending in "Color" would otherwise become
      // DuVayHighlightColorColor.
      const base = `DuVay${pascal(n)}`;
      const colorKey = base.endsWith('Color') ? base : `${base}Color`;
      L.push(`            <Color x:Key="${colorKey}">${hex(c)}</Color>`);
      L.push(`            <SolidColorBrush x:Key="${base}Brush" Color="{StaticResource ${colorKey}}" />`);
    }
    L.push('        </ResourceDictionary>');
  }

  L.push('    </ResourceDictionary.ThemeDictionaries>');
  L.push('');
  L.push('    <!-- Theme-independent scalars. x:Double so they bind straight to');
  L.push('         Thickness, CornerRadius and FontSize without a converter. -->');
  for (const [n, v] of scalars.dimensions) L.push(`    <x:Double x:Key="DuVay${pascal(n)}">${v}</x:Double>`);
  for (const [n, v] of scalars.numbers) L.push(`    <x:Double x:Key="DuVay${pascal(n)}">${v}</x:Double>`);
  L.push('');
  L.push('    <!-- Durations, as the TimeSpan storyboards actually take. -->');
  for (const [n, v] of scalars.durations) {
    const ms = Math.round(v);
    const seconds = (ms / 1000).toFixed(3);
    L.push(`    <Duration x:Key="DuVay${pascal(n)}Duration">0:0:${seconds}</Duration>`);
  }
  L.push('</ResourceDictionary>');
  return L.join('\n') + '\n';
}

/* ── Run ─────────────────────────────────────────────────────────────── */

const data = await model();

/* Two token names that differ in CSS must still differ after conversion to
 * each language's casing. `--w-space-1_5` vs `--w-space-15` collided here
 * once; a silent collision emits two constants with one name, which is a
 * compile error at best and a wrong value at worst. */
for (const [label, convert] of [['camelCase', camel], ['PascalCase', pascal], ['SCREAMING_CASE', screaming]]) {
  const seen = new Map();
  const all = [...data.scalars.dimensions, ...data.scalars.durations, ...data.scalars.numbers].map(([n]) => n);
  for (const name of all) {
    const key = convert(name);
    if (seen.has(key)) {
      console.error(`✗ ${label} collision: --w-${seen.get(key)} and --w-${name} both become "${key}"`);
      process.exit(1);
    }
    seen.set(key, name);
  }
}

const OUTPUTS = [
  ['apple/Sources/DuVayTokens/DuVayTokens.swift', emitSwift(data)],
  ['android/duvay-core/src/main/kotlin/ma/del/duvay/DuVayTokens.kt', emitKotlin(data)],
  ['windows/DuVay.Core/DuVayTokens.cs', emitCSharp(data)],
  ['linux/src/tokens.rs', emitRust(data)],
  ['linux/resources/tokens.css', emitGtkCss(data)],
  ['windows/DuVay/Tokens.xaml', emitXaml(data)],
];

const check = process.argv.includes('--check');
let stale = 0;
for (const [rel, content] of OUTPUTS) {
  const path = join(ROOT, rel);
  const existing = await readFile(path, 'utf8').catch(() => null);
  if (existing === content) {
    if (!check) console.log(`✓ ${rel} up to date`);
    continue;
  }
  if (check) {
    console.error(`✗ ${rel} is stale — run \`bun run tokens:native\``);
    stale++;
    continue;
  }
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content);
  console.log(`✓ generated ${rel}`);
}

if (stale) process.exit(1);
if (check) console.log(`✓ tokens:native — ${OUTPUTS.length} native token files up to date`);
else {
  const { scalars, themes } = data;
  console.log(
    `\n  ${scalars.dimensions.length} dimensions · ${scalars.durations.length} durations · `
    + `${scalars.numbers.length} scalars · ${Object.keys(themes).length} themes`,
  );
}
