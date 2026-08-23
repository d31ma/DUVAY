#!/usr/bin/env bun
// DuVay — token pipeline: DTCG JSON → CSS
//
// tokens/**/*.json is the source of truth. src/tokens.css and src/themes.css
// are generated output. This is ~100 lines of Bun rather than a Style
// Dictionary dependency, which keeps the repo's zero-dependency promise; the
// JSON is DTCG so Style Dictionary can take over at Phase 2 when the
// Swift/Kotlin/C#/Rust targets actually exist.
//
//   bun scripts/tokens-build.mjs           write src/tokens.css + src/themes.css
//   bun scripts/tokens-build.mjs --check   fail if the committed CSS is stale

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CSS_VAR_PREFIX } from './tokens-lib.mjs';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

/* ── Loading ─────────────────────────────────────────────────────────── */

export async function loadDocs(tokensDir) {
  const docs = [];
  for (const group of await readdir(tokensDir, { withFileTypes: true })) {
    if (!group.isDirectory()) continue;
    for (const file of await readdir(join(tokensDir, group.name))) {
      if (!file.endsWith('.json')) continue;
      const doc = JSON.parse(await readFile(join(tokensDir, group.name, file), 'utf8'));
      docs.push({ ...doc, $file: `${group.name}/${file}` });
    }
  }
  return docs;
}

const meta = (doc) => doc.$extensions?.duvay ?? {};
const tokenMeta = (token) => token.$extensions?.duvay ?? {};

/** Ordered [name, token] pairs for a document, skipping $-prefixed keys. */
export function tokenEntries(doc) {
  return Object.entries(doc).filter(([k]) => !k.startsWith('$'));
}

function renderToken(name, token) {
  const m = tokenMeta(token);
  const indent = m.indent ?? '  ';
  const pad = ' '.repeat(m.pad ?? 1);
  return `${indent}${CSS_VAR_PREFIX}${name}:${pad}${token.$value};${m.trail ?? ''}`;
}

function docsFor(docs, target) {
  return docs.filter((d) => meta(d).target === target).sort((a, b) => meta(a).order - meta(b).order);
}

/* ── Rendering ───────────────────────────────────────────────────────── */

/** src/tokens.css — one :root block, sections concatenated in order. */
export function renderTokensCss(docs) {
  const sections = docsFor(docs, 'src/tokens.css');
  if (!sections.length) throw new Error('no tokens.css documents found');
  const first = meta(sections[0]);
  const last = meta(sections[sections.length - 1]);
  const out = [...(first.header ?? []), ...(first.open ?? [])];

  for (const doc of sections) {
    const m = meta(doc);
    if (m.banner) out.push(m.banner);
    for (const [name, token] of tokenEntries(doc)) {
      out.push(...(tokenMeta(token).before ?? []));
      out.push(renderToken(name, token));
    }
    out.push(...(m.after ?? []));
  }

  out.push(...(last.close ?? []), ...(last.footer ?? []));
  return out.join('\n');
}

/**
 * Render any stylesheet built from one declaration block per document —
 * themes.css and density.css have exactly this shape, differing only in which
 * attribute their selectors key off.
 */
export function renderBlockedCss(docs, target) {
  const blocks = docsFor(docs, target);
  if (!blocks.length) throw new Error(`no ${target} documents found`);
  const out = [];

  for (const doc of blocks) {
    const m = meta(doc);
    out.push(...(m.before ?? []), ...m.open);
    for (const [name, token] of tokenEntries(doc)) {
      out.push(...(tokenMeta(token).before ?? []));
      out.push(renderToken(name, token));
    }
    out.push(...(m.after ?? []), ...m.close);
  }

  out.push(...(meta(blocks[blocks.length - 1]).trailer ?? []));
  return out.join('\n');
}

/** src/themes.css — one block per theme, plus any raw rules between them. */
export const renderThemesCss = (docs) => renderBlockedCss(docs, 'src/themes.css');

/** src/density.css — one block per density. */
export const renderDensityCss = (docs) => renderBlockedCss(docs, 'src/density.css');

/* ── CLI ─────────────────────────────────────────────────────────────── */

if (import.meta.main) {
  const check = process.argv.includes('--check');
  const docs = await loadDocs(join(ROOT, 'tokens'));
  const outputs = [
    ['src/tokens.css', renderTokensCss(docs)],
    ['src/themes.css', renderThemesCss(docs)],
    ['src/density.css', renderDensityCss(docs)],
  ];

  let stale = false;
  for (const [rel, css] of outputs) {
    const path = join(ROOT, rel);
    const existing = await readFile(path, 'utf8').catch(() => null);
    if (existing === css) {
      console.log(`✓ ${rel} up to date`);
      continue;
    }
    if (check) {
      stale = true;
      console.error(`✗ ${rel} is stale — run \`bun run tokens:build\``);
      continue;
    }
    await writeFile(path, css);
    console.log(`✓ generated ${rel}`);
  }
  if (stale) process.exit(1);
}
