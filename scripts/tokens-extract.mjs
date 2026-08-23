#!/usr/bin/env bun
// DuVay — Phase 0 token extraction
//
// One-way migration: reads the handwritten src/tokens.css and src/themes.css
// and writes tokens/**/*.json in DTCG format. Re-runnable — running it against
// unchanged CSS is a no-op.
//
// After writing, it re-renders the CSS from the JSON it just wrote and asserts
// byte-equality with the input. That is the correctness proof the plan asks
// for: the JSON provably carries everything the CSS did.
//
//   bun scripts/tokens-extract.mjs

import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { splitBlocks, renderEntries, parseEntries } from './tokens-lib.mjs';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const TOKENS = join(ROOT, 'tokens');

const BANNER_RE = /^\s*\/\* ── (.+?) ─+ \*\/\s*$/;

function slug(text) {
  return text
    .toLowerCase()
    .replace(/[—–]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Serialize one DTCG document with stable 2-space formatting. */
async function writeDoc(path, doc) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(doc, null, 2) + '\n');
}

/**
 * Convert an ordered entry list into DTCG tokens.
 * Non-token entries (blanks, comments, plain declarations) attach as raw
 * `before` lines on the next token, or as the document `after` list.
 */
function entriesToTokens(entries) {
  const tokens = {};
  let before = [];
  let after = null;

  for (const e of entries) {
    if (e.kind === 'token') {
      tokens[e.name] = {
        $value: e.value,
        $type: e.type,
        $extensions: {
          duvay: {
            indent: e.indent,
            pad: e.pad,
            ...(e.trail ? { trail: e.trail } : {}),
            ...(before.length ? { before } : {}),
          },
        },
      };
      before = [];
    } else {
      before.push(renderEntries([e])[0]);
    }
  }
  if (before.length) after = before;
  return { tokens, after };
}

/* ── tokens.css → tokens/primitive/*.json ────────────────────────────── */

async function extractPrimitives(css) {
  const chunks = splitBlocks(css);
  const block = chunks.find((c) => c.kind === 'block');
  const blockIndex = chunks.indexOf(block);
  const header = chunks.slice(0, blockIndex).flatMap((c) => c.lines);
  const footer = chunks
    .slice(blockIndex + 1)
    .flatMap((c) => (c.kind === 'raw' ? c.lines : [...c.open, ...renderEntries(c.entries), ...c.close]));

  // Split the :root body at each `/* ── Section ── */` banner.
  const sections = [];
  let current = null;
  for (const e of block.entries) {
    const banner = e.kind === 'comment' ? BANNER_RE.exec(e.text) : null;
    if (banner) {
      current = { name: banner[1].trim(), banner: e.text, entries: [] };
      sections.push(current);
      continue;
    }
    if (!current) {
      // Anything before the first banner belongs to an implicit preamble.
      current = { name: 'Base', banner: null, entries: [] };
      sections.push(current);
    }
    current.entries.push(e);
  }

  const written = [];
  for (const [index, section] of sections.entries()) {
    const { tokens, after } = entriesToTokens(section.entries);
    const first = index === 0;
    const last = index === sections.length - 1;
    const doc = {
      $description: section.name,
      $extensions: {
        duvay: {
          target: 'src/tokens.css',
          order: index + 1,
          ...(first ? { header } : {}),
          ...(first ? { open: block.open } : {}),
          ...(section.banner ? { banner: section.banner } : {}),
          ...(after ? { after } : {}),
          ...(last ? { close: block.close } : {}),
          ...(last && footer.length ? { footer } : {}),
        },
      },
      ...tokens,
    };
    const file = `${String(index + 1).padStart(2, '0')}-${slug(section.name)}.json`;
    await writeDoc(join(TOKENS, 'primitive', file), doc);
    written.push(`primitive/${file}`);
  }
  return written;
}

/* ── themes.css → tokens/semantic/*.json ─────────────────────────────── */

function themeName(open) {
  const joined = open.join(' ');
  const attr = /\[w-theme="([^"]+)"\]/.exec(joined);
  return attr ? attr[1] : slug(joined);
}

async function extractThemes(css) {
  const chunks = splitBlocks(css);
  const written = [];
  let pending = [];
  let order = 0;
  let lastDoc = null;
  let lastPath = null;

  for (const chunk of chunks) {
    if (chunk.kind === 'raw') {
      pending.push(...chunk.lines);
      continue;
    }
    const hasTokens = chunk.entries.some((e) => e.kind === 'token');
    if (!hasTokens) {
      // A non-token rule (e.g. the high-contrast border bump) is raw trailer.
      pending.push(...chunk.open, ...renderEntries(chunk.entries), ...chunk.close);
      continue;
    }

    order++;
    const name = themeName(chunk.open);
    const { tokens, after } = entriesToTokens(chunk.entries);
    const doc = {
      $description: `${name} theme`,
      $extensions: {
        duvay: {
          target: 'src/themes.css',
          order,
          theme: name,
          open: chunk.open,
          close: chunk.close,
          ...(pending.length ? { before: pending } : {}),
          ...(after ? { after } : {}),
        },
      },
      ...tokens,
    };
    pending = [];
    lastPath = join(TOKENS, 'semantic', `${order}`.padStart(2, '0') + `-${name}.json`);
    lastDoc = doc;
    await writeDoc(lastPath, doc);
    written.push(`semantic/${String(order).padStart(2, '0')}-${name}.json`);
  }

  // Whatever trails the final theme block belongs to it.
  if (pending.length && lastDoc) {
    lastDoc.$extensions.duvay.trailer = pending;
    await writeDoc(lastPath, lastDoc);
  }
  return written;
}

/* ── Run ─────────────────────────────────────────────────────────────── */

const tokensCss = await readFile(join(ROOT, 'src', 'tokens.css'), 'utf8');
const themesCss = await readFile(join(ROOT, 'src', 'themes.css'), 'utf8');

await rm(join(TOKENS, 'primitive'), { recursive: true, force: true });
await rm(join(TOKENS, 'semantic'), { recursive: true, force: true });

const primitives = await extractPrimitives(tokensCss);
const themes = await extractThemes(themesCss);

console.log(`✓ extracted ${primitives.length} primitive + ${themes.length} semantic documents → tokens/`);

// Round-trip proof — regenerate and compare.
const { renderTokensCss, renderThemesCss, loadDocs } = await import('./tokens-build.mjs');
const docs = await loadDocs(TOKENS);
const checks = [
  ['src/tokens.css', tokensCss, renderTokensCss(docs)],
  ['src/themes.css', themesCss, renderThemesCss(docs)],
];
let failed = false;
for (const [name, expected, actual] of checks) {
  if (expected === actual) {
    console.log(`✓ round-trip byte-identical: ${name}`);
  } else {
    failed = true;
    console.error(`✗ round-trip MISMATCH: ${name}`);
    const a = expected.split('\n');
    const b = actual.split('\n');
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      if (a[i] !== b[i]) {
        console.error(`    line ${i + 1}\n      expected: ${JSON.stringify(a[i])}\n      actual:   ${JSON.stringify(b[i])}`);
        break;
      }
    }
  }
}
if (failed) process.exit(1);
