#!/usr/bin/env bun
// DuVay — the platform dimension of the token pipeline
//
// The plan asks for a `platform` dimension in the token files so one source
// resolves five sets. Until now the five skins were hand-authored CSS, which
// left their values outside the pipeline: nothing generated them, nothing
// validated them, and nothing else could read them.
//
// Only the token block moves. A skin is not only tokens — it also restructures
// a handful of components where platforms genuinely diverge (sheet corners,
// filled field shape), and that is real CSS with selectors, which does not
// belong in a token file. So this owns the `[w-os="…"] { … }` declaration block
// and leaves every other rule in the stylesheet alone.
//
//   bun scripts/tokens-platform.mjs --extract   CSS → tokens/platform/*.json
//   bun scripts/tokens-platform.mjs             tokens/platform/*.json → CSS
//   bun scripts/tokens-platform.mjs --check     fail if the CSS is stale

import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { splitBlocks, renderBlocks, inferType, CSS_VAR_PREFIX } from './tokens-lib.mjs';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const PLATFORM_TOKENS = join(ROOT, 'tokens', 'platform');

/** Skin file ↔ the `w-os` values that activate it. */
const SKINS = [
  { file: 'web', selectors: ['[w-os=""]'] },
  { file: 'ios', selectors: ['[w-os="ios"]'] },
  { file: 'material', selectors: ['[w-os="android"]', '[w-os="material"]'] },
  { file: 'macos', selectors: ['[w-os="macos"]'] },
  { file: 'fluent', selectors: ['[w-os="windows"]', '[w-os="fluent"]'] },
  { file: 'adwaita', selectors: ['[w-os="linux"]', '[w-os="adwaita"]'] },
];

/**
 * The skin's own token block: the first block whose selectors are exactly the
 * `w-os` attribute selectors and nothing else.
 *
 * Anchored on the selector list rather than on position, so a skin can grow
 * rules above its token block without silently rewriting the wrong one.
 */
function tokenBlockIndex(chunks, selectors) {
  return chunks.findIndex((chunk) => {
    if (chunk.kind !== 'block') return false;
    const text = chunk.open.join(' ').replace(/[{,]/g, ' ').trim();
    const parts = text.split(/\s+/).filter(Boolean);
    return parts.length === selectors.length && selectors.every((s) => parts.includes(s));
  });
}

async function loadCss(name) {
  const path = join(ROOT, 'src', 'platforms', `${name}.css`);
  return { path, css: await readFile(path, 'utf8') };
}

/* ── Extract ─────────────────────────────────────────────────────────── */

if (process.argv.includes('--extract')) {
  await mkdir(PLATFORM_TOKENS, { recursive: true });

  for (const [order, skin] of SKINS.entries()) {
    const { path, css } = await loadCss(skin.file);
    const chunks = splitBlocks(css);
    const index = tokenBlockIndex(chunks, skin.selectors);
    if (index === -1) {
      console.error(`✗ ${skin.file}: no token block matching ${skin.selectors.join(', ')}`);
      process.exit(1);
    }

    const block = chunks[index];
    const doc = {
      $description: `Platform tokens for the ${skin.file} skin.`,
      $extensions: {
        duvay: {
          target: `src/platforms/${skin.file}.css`,
          order: order + 1,
          selectors: skin.selectors,
          // The block's own framing, kept verbatim so re-rendering is exact.
          open: block.open,
          close: block.close,
        },
      },
    };

    for (const entry of block.entries) {
      if (entry.kind !== 'token') {
        // Comments and blank lines inside the block attach to the token that
        // follows them, the same way the tokens.css documents carry them.
        continue;
      }
      doc[entry.name] = {
        $value: entry.value,
        $type: entry.type ?? inferType(entry.value),
        // Formatting is carried alongside the value so the rendered CSS is
        // byte-identical; the alternative is a reformat-everything diff the
        // first time this runs.
        $extensions: { duvay: { indent: entry.indent, pad: entry.pad, trail: entry.trail } },
      };
    }

    // Everything that is not a token declaration, in order, so the block can be
    // rebuilt byte-for-byte.
    doc.$extensions.duvay.entries = block.entries.map((e) =>
      e.kind === 'token' ? { kind: 'token', name: e.name } : e,
    );

    await writeFile(
      join(PLATFORM_TOKENS, `${String(order + 1).padStart(2, '0')}-${skin.file}.json`),
      JSON.stringify(doc, null, 2) + '\n',
    );
    console.log(`✓ extracted ${skin.file} (${block.entries.filter((e) => e.kind === 'token').length} tokens)`);
  }
}

/* ── Render ──────────────────────────────────────────────────────────── */

/** Rebuild a skin's token block from its document, leaving the rest untouched. */
async function render(skin) {
  const files = await readdir(PLATFORM_TOKENS);
  const match = files.find((f) => f.endsWith(`-${skin.file}.json`));
  if (!match) throw new Error(`no platform document for ${skin.file}`);
  const doc = JSON.parse(await readFile(join(PLATFORM_TOKENS, match), 'utf8'));
  const meta = doc.$extensions.duvay;

  const { path, css } = await loadCss(skin.file);
  const chunks = splitBlocks(css);
  const index = tokenBlockIndex(chunks, skin.selectors);
  if (index === -1) throw new Error(`${skin.file}: token block vanished`);

  chunks[index] = {
    kind: 'block',
    open: meta.open,
    close: meta.close,
    entries: meta.entries.map((entry) => {
      if (entry.kind !== 'token') return entry;
      const token = doc[entry.name];
      const format = token.$extensions.duvay;
      return {
        kind: 'token',
        name: entry.name,
        value: token.$value,
        type: token.$type,
        indent: format.indent,
        pad: format.pad,
        trail: format.trail,
      };
    }),
  };

  return { path, content: renderBlocks(chunks), existing: css };
}

const check = process.argv.includes('--check');
const extracting = process.argv.includes('--extract');

let stale = 0;
for (const skin of SKINS) {
  const { path, content, existing } = await render(skin);
  const rel = `src/platforms/${skin.file}.css`;

  if (extracting) {
    // The correctness proof the plan asks for: re-rendering what was just
    // extracted must reproduce the input exactly, or the JSON lost something.
    if (content !== existing) {
      console.error(`✗ ${rel}: round-trip is not byte-identical — extraction lost information`);
      process.exit(1);
    }
    continue;
  }

  if (content === existing) {
    if (!check) console.log(`✓ ${rel} up to date`);
    continue;
  }
  if (check) {
    console.error(`✗ ${rel} is stale — run \`bun run tokens:platform\``);
    stale++;
    continue;
  }
  await writeFile(path, content);
  console.log(`✓ generated ${rel}`);
}

if (extracting) console.log('\n✓ every skin round-trips byte-for-byte');
if (stale) process.exit(1);
