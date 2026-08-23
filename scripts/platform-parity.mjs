#!/usr/bin/env bun
// DuVay — five-platform coverage matrix
//
// Emits the parity matrix from spec/ and fails if a platform claims a
// component it has not implemented. Implementation is *detected*, never
// declared: a platform counts as implementing a component only when a source
// file matching the spec's native name exists under that platform's directory.
// That is what stops the docs site from advertising support that isn't there.
//
//   bun scripts/platform-parity.mjs            print the matrix
//   bun scripts/platform-parity.mjs --json     machine-readable, for the docs site

import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SPEC = join(ROOT, 'spec');

/** Where each platform's implementations live, and what a source file looks like. */
const PLATFORMS = {
  web: { dir: 'src/components', ext: ['.js'] },
  apple: { dir: 'apple/Sources/DuVay', ext: ['.swift'] },
  android: { dir: 'android/duvay-compose/src/main/kotlin', ext: ['.kt'] },
  windows: { dir: 'windows/DuVay', ext: ['.cs'] },
  linux: { dir: 'linux/src', ext: ['.rs'] },
};

/**
 * Every source file under a platform directory, with its text.
 *
 * Detection reads declarations rather than filenames: a language's convention
 * for grouping types into files is its own business, and requiring
 * one-file-per-component would make the matrix dictate file layout. Missing
 * directory → nothing, which is how a not-yet-started platform reports.
 */
async function sourceFiles(dir, exts) {
  const out = [];
  async function walk(path) {
    let entries;
    try {
      entries = await readdir(path, { withFileTypes: true });
    } catch {
      return; // platform not started yet
    }
    for (const entry of entries) {
      const full = join(path, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'build' || entry.name === 'bin' || entry.name === 'obj') continue;
        await walk(full);
      } else if (exts.some((e) => entry.name.endsWith(e))) {
        out.push({ name: entry.name, text: await readFile(full, 'utf8') });
      }
    }
  }
  await walk(join(ROOT, dir));
  return out;
}

/**
 * Whether a platform declares a type/function with the spec's native name.
 * Anchored on a declaration keyword so a mere mention in a comment or a call
 * site does not count as an implementation.
 */
const DECLARATION = {
  apple: (n) => new RegExp(`\\b(?:struct|class|enum|actor)\\s+${n}\\b`),
  // Kotlin puts type parameters between `fun` and the name (`fun <T> Foo`),
  // unlike Swift, Rust and C# which put them after it.
  android: (n) => new RegExp(`\\bfun\\s+(?:<[^>]*>\\s*)?${n}\\b|\\b(?:class|object)\\s+${n}\\b`),
  windows: (n) => new RegExp(`\\b(?:class|record|struct)\\s+${n}\\b`),
  linux: (n) => new RegExp(`\\bfn\\s+${n}\\b|\\b(?:struct|enum)\\s+${n}\\b`),
};

const contract = JSON.parse(await readFile(join(SPEC, 'core-contract.json'), 'utf8'));
const specs = [];
for (const file of (await readdir(join(SPEC, 'components'))).sort()) {
  specs.push(JSON.parse(await readFile(join(SPEC, 'components', file), 'utf8')));
}

// Index each platform's files once.
const files = {};
for (const [name, cfg] of Object.entries(PLATFORMS)) {
  files[name] = await sourceFiles(cfg.dir, cfg.ext);
}

const platformNames = Object.keys(PLATFORMS);
const matrix = specs.map((spec) => {
  const row = { name: spec.name, tier: spec.tier, web: spec.names.web, platforms: {} };
  for (const platform of platformNames) {
    const expected = spec.names[platform];
    if (platform === 'web') {
      // web components are one file per tag: w-btn → btn.js
      const stem = spec.source.split('/').pop();
      row.platforms[platform] = files[platform].some((f) => f.name === stem);
      continue;
    }
    const pattern = DECLARATION[platform](expected);
    row.platforms[platform] = files[platform].some((f) => pattern.test(f.text));
  }
  return row;
});

const totals = Object.fromEntries(
  platformNames.map((p) => [p, matrix.filter((r) => r.platforms[p]).length]),
);

if (process.argv.includes('--json')) {
  const out = join(ROOT, 'website', 'client', 'shared', 'assets', 'duvay');
  await mkdir(out, { recursive: true });
  await writeFile(
    join(out, 'parity.json'),
    JSON.stringify({ generated: 'scripts/platform-parity.mjs', totals, components: matrix }, null, 2) + '\n',
  );
  console.log(`✓ wrote website/client/shared/assets/duvay/parity.json`);
}

/* ── Report ──────────────────────────────────────────────────────────── */

const mark = (ok) => (ok ? '  ✓  ' : '  ·  ');
const pad = (s, n) => String(s).padEnd(n);

console.log(`\nDuVay Core contract — ${matrix.length} components\n`);
console.log(pad('component', 20) + pad('tier', 6) + platformNames.map((p) => pad(p, 9)).join(''));
console.log('─'.repeat(20 + 6 + platformNames.length * 9));
for (const row of matrix) {
  console.log(
    pad(row.name, 20) + pad(row.tier, 6) + platformNames.map((p) => pad(mark(row.platforms[p]), 9)).join(''),
  );
}
console.log('─'.repeat(20 + 6 + platformNames.length * 9));
console.log(pad('implemented', 26) + platformNames.map((p) => pad(`${totals[p]}/${matrix.length}`, 9)).join(''));

const tier1 = matrix.filter((r) => r.tier === 1);
console.log(
  '\ntier 1: ' + platformNames.map((p) => `${p} ${tier1.filter((r) => r.platforms[p]).length}/${tier1.length}`).join('  ·  '),
);

/* ── Gate ────────────────────────────────────────────────────────────── */

// The gate compares each platform's DECLARED status against what is actually
// on disk. A port in progress is fine and does not fail the build — the plan is
// explicit that a platform which isn't ready ships the previous version rather
// than holding the train. What must never happen is a platform claiming a tier
// it has not finished, because that claim is what the docs publish.
// `tier-1-code-complete` is deliberately distinct from `tier-1-complete`.
// The plan requires a manual screen-reader pass and a snapshot suite before a
// tier ships, and neither is automatable. Code-complete means every component
// exists and builds; complete means it has also been verified by a human on
// that platform's assistive tech. Only the latter may be published as support.
const CLAIMS = {
  'not-started': () => [],
  'in-progress': () => [],
  'tier-1-code-complete': (m) => m.filter((r) => r.tier === 1 && !r.platforms[m.platform]),
  'tier-1-complete': (m) => m.filter((r) => r.tier === 1 && !r.platforms[m.platform]),
  'tier-2-complete': (m) => m.filter((r) => !r.platforms[m.platform]),
};

/** Claims that may be advertised as shipped support on the docs site. */
const PUBLISHABLE = new Set(['tier-1-complete', 'tier-2-complete']);

let failures = 0;
console.log('\nclaimed status');
for (const platform of platformNames) {
  const status = contract.status?.[platform] ?? 'not-started';
  const check = CLAIMS[status];
  if (!check) {
    console.error(`✗ ${platform}: unknown status "${status}"`);
    failures++;
    continue;
  }
  const rows = Object.assign(matrix.slice(), { platform });
  const missing = check(rows);
  const done = matrix.filter((r) => r.platforms[platform]).length;
  const note = PUBLISHABLE.has(status) ? '' : '  (not published as support)';
  console.log(`  ${pad(platform, 10)} ${pad(status, 22)} ${done}/${matrix.length} implemented${note}`);
  if (missing.length) {
    console.error(
      `✗ ${platform} claims "${status}" but is missing ${missing.length}: ` + missing.map((m) => m.name).join(', '),
    );
    failures++;
  }
}

if (failures) {
  console.error('\n✗ platform-parity — a platform is claiming coverage it has not earned');
  process.exit(1);
}
console.log('\n✓ platform-parity — every platform claim is backed by an implementation');
