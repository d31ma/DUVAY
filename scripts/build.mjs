#!/usr/bin/env bun
// DuVay — build script
//
// 1. Resolves CSS imports into dist/duvay.css (the published bundle).
// 2. Mirrors src/ into website/client/shared/assets/duvay/ so the docs site
//    always renders against the live framework.
// 3. Produces the distributable artifacts in dist/ — full + minified CSS,
//    behaviour layer, and a single-file web-component bundle — and mirrors
//    them into the docs site so the Download page can serve them.
//
// Run from the repo root:  bun run build

import { $ } from 'bun';
import { readFile, writeFile, mkdir, copyFile, readdir, stat, rm } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SRC = join(ROOT, 'src');
const CSS_ENTRY = join(SRC, 'duvay.css');
const CORE_ENTRY = join(SRC, 'core.css');
const MOTION = join(SRC, 'components', 'duvay-motion.js');
const WEB_ASSETS = join(ROOT, 'website', 'client', 'shared', 'assets', 'duvay');
const DIST = join(ROOT, 'dist');
const WEB_DIST = join(WEB_ASSETS, 'dist');
const VERSION = JSON.parse(await readFile(join(ROOT, 'package.json'), 'utf8')).version;
const WEB_VERSIONED_DIST = join(WEB_ASSETS, 'versions', VERSION, 'dist');

const CSS_INDEXES = [
  'core.css',
  'grid.css',
  'layout.css',
  'navigation.css',
  'content.css',
  'feedback.css',
  'forms.css',
];

// Five OS skins, each shipped as its own flattened entrypoint. Deliberately
// NOT concatenated into duvay.css: at ~554 KB minified today, a five-skin
// mega-bundle would be disqualifying. Consumers pick one.
//
// `android`, `windows` and `linux` are alias entrypoints for `material`,
// `fluent` and `adwaita`: the skin files carry the vendor's design-language
// name, but most developers look for the operating system. Both are built and
// both `w-os` values activate the same skin.
const PLATFORMS = ['ios', 'material', 'macos', 'fluent', 'adwaita'];
const PLATFORM_ALIASES = ['android', 'windows', 'linux'];
const ENTRYPOINTS = [...PLATFORMS, ...PLATFORM_ALIASES];

const CSS_IMPORT_RE = /@import\s+(?:url\()?["']([^"']+)["']\)?\s*;/g;

function resolveCssPath(from, specifier) {
  if (/^(?:https?:|data:)/.test(specifier)) return null;
  return join(dirname(from), specifier);
}

async function flattenCss(path, seen = new Set()) {
  if (seen.has(path)) return '';
  seen.add(path);

  const source = await readFile(path, 'utf8');
  let output = '';
  let lastIndex = 0;

  for (const match of source.matchAll(CSS_IMPORT_RE)) {
    output += source.slice(lastIndex, match.index);
    const imported = resolveCssPath(path, match[1]);
    output += imported ? await flattenCss(imported, seen) : match[0];
    lastIndex = match.index + match[0].length;
  }

  output += source.slice(lastIndex);
  return output.trim() + '\n';
}

async function copyCssEntrypoints() {
  for (const name of CSS_INDEXES) {
    await copyFile(join(SRC, name), join(DIST, name));
  }

  const componentDist = join(DIST, 'components');
  await mkdir(componentDist, { recursive: true });
  for (const entry of await readdir(join(SRC, 'components'))) {
    if (!entry.endsWith('.css')) continue;
    await copyFile(join(SRC, 'components', entry), join(componentDist, entry));
  }

  // Platform skins, importable on their own alongside an existing duvay.css.
  const platformDist = join(DIST, 'platforms');
  await mkdir(platformDist, { recursive: true });
  for (const os of [...PLATFORMS, 'web']) {
    await copyFile(join(SRC, 'platforms', `${os}.css`), join(platformDist, `${os}.css`));
  }
}

async function copyTree(from, to) {
  await mkdir(to, { recursive: true });
  for (const entry of await readdir(from)) {
    if (entry === 'node_modules' || entry === 'dist' || entry.startsWith('.')) continue;
    const src = join(from, entry);
    const dst = join(to, entry);
    const info = await stat(src);
    if (info.isDirectory()) {
      await copyTree(src, dst);
    } else if (info.isFile()) {
      await copyFile(src, dst);
    }
  }
}

async function syncWebAssets() {
  // Preserve previously-built versioned releases so the site can host
  // every CalVer it has ever been built with.
  let preserved = null;
  const versionsDir = join(WEB_ASSETS, 'versions');
  try {
    await stat(versionsDir);
    preserved = join(ROOT, '.duvay-versions-tmp');
    await rm(preserved, { recursive: true, force: true });
    await $`mv ${versionsDir} ${preserved}`.quiet();
  } catch (_) {}

  await rm(WEB_ASSETS, { recursive: true, force: true });
  await mkdir(WEB_ASSETS, { recursive: true });

  if (preserved) {
    const restored = versionsDir;
    await $`mv ${preserved} ${restored}`.quiet();
  }

  await copyTree(SRC, WEB_ASSETS);
  console.log(`✓ synced ${relative(ROOT, SRC)} → ${relative(ROOT, WEB_ASSETS)}`);
}

async function fileSize(path) {
  return (await stat(path)).size;
}

async function distFiles() {
  const entries = await readdir(DIST);
  const files = [];
  for (const entry of entries) {
    if (entry === 'sizes.json') continue;
    const path = join(DIST, entry);
    if ((await stat(path)).isFile()) files.push(entry);
  }
  return files.sort();
}

async function buildDist() {
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  // CSS — importable entrypoints plus flattened full/core bundles.
  await copyCssEntrypoints();
  await writeFile(join(DIST, 'core.css'), await flattenCss(CORE_ENTRY));
  await writeFile(join(DIST, 'duvay.css'), await flattenCss(CSS_ENTRY));
  await $`bun build ${join(DIST, 'core.css')} --minify --outfile ${join(DIST, 'core.min.css')}`.quiet();
  await $`bun build ${join(DIST, 'duvay.css')} --minify --outfile ${join(DIST, 'duvay.min.css')}`.quiet();

  // One flattened bundle per OS skin — full + minified.
  for (const os of ENTRYPOINTS) {
    const full = join(DIST, `duvay-${os}.css`);
    await writeFile(full, await flattenCss(join(SRC, `duvay-${os}.css`)));
    await $`bun build ${full} --minify --outfile ${join(DIST, `duvay-${os}.min.css`)}`.quiet();
  }

  // Behaviour layer (duvay.js) — full + minified.
  await copyFile(join(SRC, 'duvay.js'), join(DIST, 'duvay.js'));
  await $`bun build ${join(SRC, 'duvay.js')} --minify --outfile ${join(DIST, 'duvay.min.js')}`.quiet();

  // Directives — optional add-on for w-* directive hooks.
  await copyFile(join(SRC, 'duvay-directives.js'), join(DIST, 'duvay-directives.js'));
  await $`bun build ${join(SRC, 'duvay-directives.js')} --minify --outfile ${join(DIST, 'duvay-directives.min.js')}`.quiet();

  // Motion runtime — optional add-on for w-* motion hooks.
  await copyFile(MOTION, join(DIST, 'duvay-motion.js'));
  await $`bun build ${MOTION} --minify --outfile ${join(DIST, 'duvay-motion.min.js')}`.quiet();

  // Web components — bundled to a single file, full + minified
  await $`bun build ${join(SRC, 'duvay-wc.js')} --outfile ${join(DIST, 'duvay-wc.js')}`.quiet();
  await $`bun build ${join(SRC, 'duvay-wc.js')} --minify --outfile ${join(DIST, 'duvay-wc.min.js')}`.quiet();

  // Self-documenting manifest so the Download page never shows stale sizes.
  const built = await distFiles();
  const sizes = {};
  for (const f of built) sizes[f] = await fileSize(join(DIST, f));
  await writeFile(join(DIST, 'sizes.json'), JSON.stringify(sizes, null, 2) + '\n');

  // Mirror into the docs site so the Download page can link them directly.
  await rm(WEB_DIST, { recursive: true, force: true });
  await copyTree(DIST, WEB_DIST);

  // Also keep a permanent CalVer copy so users can pin to a specific release.
  await rm(WEB_VERSIONED_DIST, { recursive: true, force: true });
  await copyTree(DIST, WEB_VERSIONED_DIST);

  const files = await distFiles();
  console.log(`✓ built ${relative(ROOT, DIST)}/ (${files.length} files)`);
  for (const f of files) {
    console.log(`    ${f.padEnd(15)} ${(await fileSize(join(DIST, f)) / 1024).toFixed(1).padStart(6)} KB`);
  }
  console.log(`✓ versioned release ${VERSION} mirrored → ${relative(ROOT, WEB_VERSIONED_DIST)}`);
}

// tokens/ is the source of truth — regenerate src/tokens.css and src/themes.css
// before anything reads them, so a stale committed CSS file cannot leak into a
// build. See scripts/tokens-build.mjs.
await $`bun ${join(ROOT, 'scripts', 'tokens-build.mjs')}`;
// The five skins' token blocks come from tokens/platform/**; the rest of each
// stylesheet stays hand-authored, because a skin also restructures a few
// components and that is real CSS, not token data.
await $`bun ${join(ROOT, 'scripts', 'tokens-platform.mjs')}`.quiet();

await syncWebAssets();
await buildDist();

// The parity matrix and its docs page are generated from spec/ for the same
// reason: a hand-maintained copy would drift, and this is the artefact that
// tells readers which platforms are actually supported.
//
// After syncWebAssets, not before: parity.json lands inside the assets
// directory that sync deletes and repopulates from src/, so emitting earlier
// would write it and then immediately throw it away.
await $`bun ${join(ROOT, 'scripts', 'platform-parity.mjs')} --emit`.quiet();
console.log('✓ parity matrix + docs page generated');
