#!/usr/bin/env bun
// DuVay — docs navigation coverage gate
//
// The sidebar and the search index used to be two hand-maintained lists that
// disagreed: eleven authored pages were missing from the navigation, six
// sidebar entries were invisible to search, and two paths appeared twice.
// `PAGES` is now derived from `HE_DOC_SECTIONS`, so those two can no longer
// diverge — but a *third* thing can still drift, which is what this checks:
// a page can exist on disk and be in neither.
//
// Reachability is the point. A route nobody links to is a route nobody reads.
//
//   bun scripts/docs-index-check.mjs

import { readFile, readdir } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const PAGES_DIR = join(ROOT, 'website', 'client', 'pages', 'docs');
const DOCS_JS = join(ROOT, 'website', 'client', 'shared', 'scripts', 'docs.js');
const GENERATED = join(ROOT, 'website', 'client', 'shared', 'scripts', 'generated-api-data.js');

/** Every `tac.html` under pages/docs, as the route it becomes. */
async function authoredRoutes(dir = PAGES_DIR, prefix = '/docs') {
  const routes = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      routes.push(...await authoredRoutes(path, `${prefix}/${entry.name}`));
    } else if (entry.name === 'tac.html' && prefix !== '/docs') {
      routes.push(prefix);
    }
  }
  return routes;
}

const docs = await readFile(DOCS_JS, 'utf8');
const generated = await readFile(GENERATED, 'utf8');

// Anchored on `type: 'item'` so the taxonomy is read, not any other literal
// that happens to carry a path.
const taxonomy = [...docs.matchAll(/\{ type: 'item',[^}]*path: '(\/docs\/[^']*)'/g)].map((m) => m[1]);
const searchOnly = new Set(
  [...generated.matchAll(/"path":\s*"(\/docs\/[^"]*)"/g)].map((m) => m[1]),
);

/* Pages deliberately left out of both indexes, and why.
 *
 * This list should stay at or near empty. An entry here is a question that has
 * not been answered, kept visible rather than buried: the gate names it on
 * every run instead of silently passing. */
const EXCLUDED = new Map();

const routes = (await authoredRoutes()).sort().filter((route) => !EXCLUDED.has(route));
const inNav = new Set(taxonomy);

let failures = 0;

const duplicates = taxonomy.filter((path, i) => taxonomy.indexOf(path) !== i);
if (duplicates.length) {
  console.error(`✗ ${duplicates.length} path(s) listed twice in the sidebar:`);
  for (const path of new Set(duplicates)) console.error(`    ${path}`);
  failures += duplicates.length;
}

// A page on disk that is in neither the sidebar nor the generated API index is
// reachable only by typing its URL.
const orphans = routes.filter((route) => !inNav.has(route) && !searchOnly.has(route));
if (orphans.length) {
  console.error(`✗ ${orphans.length} page(s) exist but are in no index:`);
  for (const route of orphans) console.error(`    ${route}`);
  failures += orphans.length;
}

// A sidebar entry with no page behind it is a 404 in the navigation.
const dangling = [...inNav].filter((path) => !routes.includes(path)).sort();
if (dangling.length) {
  console.error(`✗ ${dangling.length} sidebar link(s) have no page:`);
  for (const path of dangling) console.error(`    ${path}`);
  failures += dangling.length;
}

if (failures) {
  console.error(`\n✗ docs-index — ${failures} navigation problem(s)`);
  process.exit(1);
}

console.log(
  `✓ docs-index — ${routes.length} pages, all reachable`
  + ` (${inNav.size} in the sidebar, ${routes.length - inNav.size} API-only)`,
);

for (const [route, why] of EXCLUDED) {
  console.log(`  · excluded ${route} — ${why}`);
}
