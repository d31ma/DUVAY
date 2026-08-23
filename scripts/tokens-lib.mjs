#!/usr/bin/env bun
// DuVay — token pipeline shared library
//
// Parses and renders the CSS custom-property blocks that make up
// src/tokens.css and src/themes.css. Parse and render are exact inverses:
// `render(parse(css)) === css` for any DuVay token file. That property is what
// makes the DTCG JSON in tokens/ safe to adopt as the source of truth — the
// extractor can prove it lost nothing.
//
// Entry kinds inside a declaration block:
//   blank   a single empty line
//   comment one raw line of a comment block
//   token   a `--w-*` custom property
//   decl    any other declaration (e.g. `color-scheme: light;`)

export const CSS_VAR_PREFIX = '--w-';

const TOKEN_RE = /^(\s*)(--[\w-]+):(\s*)(.+?);(.*)$/;
const DECL_RE = /^(\s*)([a-zA-Z-]+):(\s*)(.+?);(.*)$/;

/* ── Type inference ──────────────────────────────────────────────────────
 * Maps a CSS value to a DTCG $type. Values that reference other tokens
 * (`var(--w-…)`) keep their raw text: DTCG alias syntax (`{space.1}`) would
 * force a name-mangling scheme on every consumer, and the var() form is
 * trivially convertible by a platform generator that wants aliases.
 */
export function inferType(value) {
  const v = value.trim();
  if (v.startsWith('var(')) return 'reference';
  if (/^(#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\(|color\()/.test(v)) return 'color';
  if (/^-?[\d.]+m?s$/.test(v)) return 'duration';
  if (/^cubic-bezier\(/.test(v)) return 'cubicBezier';
  if (/\b\d+px\b.*\b(rgba?|var)\(/.test(v)) return 'shadow';
  if (/^-?[\d.]+(rem|em|px|vh|vw|dvh|%|ch)$/.test(v)) return 'dimension';
  if (/^-?[\d.]+$/.test(v)) return 'number';
  if (/,/.test(v) && /['"]|sans-serif|monospace|system-ui/.test(v)) return 'fontFamily';
  if (/^(min|max|clamp|calc)\(/.test(v)) return 'dimension';
  return 'other';
}

/* ── Parsing ─────────────────────────────────────────────────────────── */

/** Parse the inner lines of a declaration block into ordered entries. */
export function parseEntries(lines) {
  const entries = [];
  for (const line of lines) {
    if (line.trim() === '') {
      entries.push({ kind: 'blank' });
      continue;
    }
    const token = TOKEN_RE.exec(line);
    if (token && token[2].startsWith(CSS_VAR_PREFIX)) {
      const [, indent, name, pad, value, trail] = token;
      entries.push({
        kind: 'token',
        name: name.slice(CSS_VAR_PREFIX.length),
        value,
        type: inferType(value),
        indent,
        pad: pad.length,
        trail,
      });
      continue;
    }
    const decl = DECL_RE.exec(line);
    if (decl && !line.trim().startsWith('/*') && !line.includes('*/')) {
      const [, indent, prop, pad, value, trail] = decl;
      entries.push({ kind: 'decl', prop, value, indent, pad: pad.length, trail });
      continue;
    }
    entries.push({ kind: 'comment', text: line });
  }
  return entries;
}

/** Render ordered entries back to CSS lines. */
export function renderEntries(entries) {
  return entries.map((e) => {
    if (e.kind === 'blank') return '';
    if (e.kind === 'comment') return e.text;
    const name = e.kind === 'token' ? CSS_VAR_PREFIX + e.name : e.prop;
    return `${e.indent}${name}:${' '.repeat(e.pad)}${e.value};${e.trail}`;
  });
}

/* ── Block splitting ─────────────────────────────────────────────────── */

/**
 * Split a stylesheet into ordered chunks. A chunk is either raw text
 * (`{ kind: 'raw', lines }`) or a declaration block
 * (`{ kind: 'block', open, entries, close }`) where `open` holds the selector
 * line(s) and `close` the closing brace line.
 *
 * Handles one level of nesting so `@media (…) { [w-theme="auto"] { … } }`
 * round-trips: the outer at-rule becomes part of the inner block's `open`.
 */
export function splitBlocks(css) {
  const lines = css.split('\n');
  const chunks = [];
  let raw = [];
  let i = 0;

  const flushRaw = () => {
    if (raw.length) chunks.push({ kind: 'raw', lines: raw });
    raw = [];
  };

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trimEnd().endsWith('{')) {
      raw.push(line);
      i++;
      continue;
    }

    // Selector may span several lines (`:root,` / `[w-theme="light"] {`).
    let start = i;
    while (start > 0 && /,\s*$/.test(lines[start - 1])) start--;
    for (let k = start; k < i; k++) raw.pop();
    flushRaw();

    const open = lines.slice(start, i + 1);
    i++;

    // An at-rule wrapper contributes its selector to the inner block.
    if (lines[i] !== undefined && lines[i].trimEnd().endsWith('{')) {
      open.push(lines[i]);
      i++;
    }

    const body = [];
    let depth = 0;
    while (i < lines.length) {
      const cur = lines[i];
      if (cur.trimEnd().endsWith('{')) depth++;
      if (/^\s*\}\s*$/.test(cur)) {
        if (depth === 0) break;
        depth--;
      }
      body.push(cur);
      i++;
    }

    const close = [lines[i]];
    i++;
    // Consume the matching brace of an at-rule wrapper.
    if (open.length === 2 && /^\s*\}\s*$/.test(lines[i] ?? '')) {
      close.push(lines[i]);
      i++;
    }

    chunks.push({ kind: 'block', open, entries: parseEntries(body), close });
  }

  flushRaw();
  return chunks;
}

/** Render chunks produced by splitBlocks back to a stylesheet. */
export function renderBlocks(chunks) {
  const out = [];
  for (const chunk of chunks) {
    if (chunk.kind === 'raw') out.push(...chunk.lines);
    else out.push(...chunk.open, ...renderEntries(chunk.entries), ...chunk.close);
  }
  return out.join('\n');
}

/* ── Token map ───────────────────────────────────────────────────────── */

/** Flatten every token declared in a set of chunks to name → value. */
export function tokenMap(chunks) {
  const map = new Map();
  for (const chunk of chunks) {
    if (chunk.kind !== 'block') continue;
    for (const e of chunk.entries) {
      if (e.kind === 'token') map.set(e.name, e.value);
    }
  }
  return map;
}

/** Resolve `var(--w-x)` chains against a name → value map. */
export function resolveValue(value, map, seen = new Set()) {
  const ref = /^var\((--w-[\w-]+)(?:\s*,\s*(.+))?\)$/.exec(value.trim());
  if (!ref) return value.trim();
  const name = ref[1].slice(CSS_VAR_PREFIX.length);
  if (seen.has(name)) return null; // circular
  seen.add(name);
  if (map.has(name)) return resolveValue(map.get(name), map, seen);
  return ref[2] ? resolveValue(ref[2], map, seen) : null;
}
