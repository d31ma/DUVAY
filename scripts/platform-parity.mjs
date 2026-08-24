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

/** Claims that may be advertised as shipped support on the docs site. */
const PUBLISHABLE = new Set(['tier-1-complete', 'tier-2-complete']);

/* ── Generated artefacts ─────────────────────────────────────────────── */

const LABEL = { web: 'Web', apple: 'Apple', android: 'Android', windows: 'Windows', linux: 'Linux' };
const CLAIM_TEXT = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  'tier-1-code-complete': 'Tier 1 code-complete',
  'tier-2-code-complete': 'Tier 2 code-complete',
  'tier-1-complete': 'Tier 1 complete',
  'tier-2-complete': 'Tier 2 complete',
};

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * The docs page, rendered as static HTML at build time.
 *
 * Generated rather than authored for the same reason src/tokens.css is: a
 * hand-maintained copy of this matrix would drift, and the one thing this page
 * must never do is claim support a platform has not earned. `--check` fails the
 * build when the committed page no longer matches the source of truth.
 */
function renderPage() {
  const statusRows = platformNames.map((platform) => {
    const claim = contract.status?.[platform] ?? 'not-started';
    const publishable = PUBLISHABLE.has(claim);
    const tier1Done = matrix.filter((r) => r.tier === 1 && r.platforms[platform]).length;
    const tier1Total = matrix.filter((r) => r.tier === 1).length;
    return `        <tr>
          <td data-label="Platform">${LABEL[platform]}</td>
          <td data-label="Status">${CLAIM_TEXT[claim]}</td>
          <td data-label="Tier 1">${tier1Done} / ${tier1Total}</td>
          <td data-label="All components">${totals[platform]} / ${matrix.length}</td>
          <td data-label="Published as support">${publishable ? 'Yes' : 'No'}</td>
        </tr>`;
  }).join('\n');

  const componentRows = matrix.map((row) => {
    const cells = platformNames.map((platform) => {
      const ok = row.platforms[platform];
      // The glyph is decorative; the cell carries the real answer for a screen
      // reader, which would otherwise hear a bare bullet.
      return `<td data-label="${LABEL[platform]}"><span aria-hidden="true">${ok ? '✓' : '·'}</span>`
        + `<span class="w-sr-only">${ok ? 'Implemented' : 'Not implemented'}</span></td>`;
    }).join('');
    return `        <tr>
          <td data-label="Component">${escapeHtml(row.name)}</td>
          <td data-label="Tier">${row.tier}</td>
          <td data-label="Web element"><code>${escapeHtml(row.web)}</code></td>
          ${cells}
        </tr>`;
  }).join('\n');

  return `<doc-layout>
  <h1>Platform parity</h1>
  <p>DuVay's Core contract is the set of components that get native implementations on every platform. This page is generated from <code>spec/</code> by <code>scripts/platform-parity.mjs</code>, and a component is only marked as implemented when that platform actually declares it in source — never because a table said so.</p>

  <h2>Status</h2>
  <p>Implementation counts are not the same as shipped support. A platform reaches <strong>code-complete</strong> when every component in its tier exists and builds. It reaches <strong>complete</strong> only after the manual screen-reader pass and the snapshot suite the plan mandates, and only that may be advertised as support.</p>

  <div class="api-table-wrap">
    <table class="w-table api-table" aria-label="Per-platform implementation status">
      <thead>
        <tr><th>Platform</th><th>Status</th><th>Tier 1</th><th>All components</th><th>Published as support</th></tr>
      </thead>
      <tbody>
${statusRows}
      </tbody>
    </table>
  </div>

  <h2>Tiers</h2>
  <p><strong>Tier 1</strong> is the non-negotiable set that defines v1 — every platform implements all of it. <strong>Tier 2</strong> is added one component at a time across all five, so no single platform races ahead of the others. Anything absent from this table is web-only and stays web-only unless it is individually promoted.</p>

  <h2>Coverage</h2>
  <div class="api-table-wrap">
    <table class="w-table api-table" aria-label="Component coverage by platform">
      <thead>
        <tr><th>Component</th><th>Tier</th><th>Web element</th>${platformNames.map((p) => `<th>${LABEL[p]}</th>`).join('')}</tr>
      </thead>
      <tbody>
${componentRows}
      </tbody>
    </table>
  </div>
</doc-layout>
`;
}

const PAGE = join(ROOT, 'website', 'client', 'pages', 'docs', 'platform-parity', 'tac.html');
const JSON_OUT = join(ROOT, 'website', 'client', 'shared', 'assets', 'duvay', 'parity.json');

if (process.argv.includes('--json') || process.argv.includes('--emit') || process.argv.includes('--check')) {
  const out = join(ROOT, 'website', 'client', 'shared', 'assets', 'duvay');
  await mkdir(out, { recursive: true });
  const tier1Rows = matrix.filter((r) => r.tier === 1);
  // The docs page has to render the *claim* alongside the count, or a reader
  // would take 25/25 as shipped support. `publishable` is the same set the gate
  // below uses, so the page and the gate can never disagree.
  const status = Object.fromEntries(platformNames.map((p) => {
    const claim = contract.status?.[p] ?? 'not-started';
    return [p, {
      claim,
      publishable: PUBLISHABLE.has(claim),
      implemented: totals[p],
      tier1: tier1Rows.filter((r) => r.platforms[p]).length,
    }];
  }));
  const json = JSON.stringify({
    generated: 'scripts/platform-parity.mjs',
    platforms: platformNames,
    total: matrix.length,
    tier1Total: tier1Rows.length,
    totals,
    status,
    components: matrix,
  }, null, 2) + '\n';
  const page = renderPage();

  const artefacts = [
    ['website/client/shared/assets/duvay/parity.json', JSON_OUT, json],
    ['website/client/pages/docs/platform-parity/tac.html', PAGE, page],
  ];

  if (process.argv.includes('--check')) {
    let stale = false;
    for (const [label, path, content] of artefacts) {
      const existing = await readFile(path, 'utf8').catch(() => null);
      if (existing === content) {
        console.log(`✓ ${label} up to date`);
        continue;
      }
      console.error(`✗ ${label} is stale — run \`bun run parity:emit\``);
      stale = true;
    }
    if (stale) process.exit(1);
  } else {
    await mkdir(dirname(PAGE), { recursive: true });
    for (const [label, path, content] of artefacts) {
      await writeFile(path, content);
      console.log(`✓ wrote ${label}`);
    }
  }
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
  // Every component exists and builds, but the manual passes have not been done.
  // Deliberately not publishable: the gap between this and `tier-2-complete` is
  // a human on that platform's assistive tech, not more code.
  'tier-2-code-complete': (m) => m.filter((r) => !r.platforms[m.platform]),
  'tier-2-complete': (m) => m.filter((r) => !r.platforms[m.platform]),
};

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

  /* Code-completeness is no longer the binding constraint: every platform now
   * implements all 46, so nothing but this stops someone moving the status to a
   * publishable one and advertising support the plan says has not been earned.
   *
   * A publishable claim therefore has to name the manual passes — which screen
   * reader, which version, who ran it, when. The gate cannot verify that a human
   * really did it, but it can refuse to publish a claim that nobody signed. */
  if (PUBLISHABLE.has(status)) {
    const evidence = contract.verification?.[platform];
    // `method` is required and the two values are not interchangeable: the web
    // has axe, which is a real gate but not a screen-reader pass, and the four
    // native platforms have no equivalent. Recording which one was done stops
    // an automated run being filed as if a human had driven VoiceOver.
    const fields = evidence?.method === 'automated'
      ? ['method', 'tool', 'command', 'date']
      : ['method', 'screenReader', 'version', 'verifiedBy', 'date'];
    const absent = fields.filter((field) => !evidence?.[field]);
    if (absent.length) {
      console.error(
        `✗ ${platform} claims the publishable status "${status}" without recorded verification`
        + ` (missing ${absent.join(', ')} under contract.verification.${platform})`,
      );
      failures++;
    }
  }
}

if (failures) {
  console.error('\n✗ platform-parity — a platform is claiming coverage it has not earned');
  process.exit(1);
}
console.log('\n✓ platform-parity — every platform claim is backed by an implementation');
