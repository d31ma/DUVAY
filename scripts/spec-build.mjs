#!/usr/bin/env bun
// DuVay — Layer 2: component spec generation
//
// Derives spec/components/<name>.json from the live web implementation so the
// contract cannot drift from the code it describes. Sources, per component:
//   props   `static attrs` + inherited WElement.attrs, described by the
//           JSDoc `Attributes:` block at the top of each component file
//   events  every `new CustomEvent('name'…)` the component dispatches
//   role    declared in spec/core-contract.json (a11y is a contract decision,
//           not something to scrape)
//
//   bun scripts/spec-build.mjs           write spec/components/*.json
//   bun scripts/spec-build.mjs --check   fail if the committed spec is stale

import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const COMPONENTS = join(ROOT, 'src', 'components');
const SPEC = join(ROOT, 'spec');
const OUT = join(SPEC, 'components');

/** Every state a Core component must be able to render, per the plan. */
const STATES = ['default', 'hover', 'focus-visible', 'pressed', 'disabled', 'loading', 'readonly', 'error'];

/* ── Source scraping ─────────────────────────────────────────────────── */

/** Attribute names from `static attrs = [ … ]`. */
function staticAttrs(source) {
  const m = /static\s+attrs\s*=\s*\[([\s\S]*?)\]/.exec(source);
  if (!m) return [];
  return [...m[1].matchAll(/['"]([\w-]+)['"]/g)].map((x) => x[1]);
}

/** `static props = { 'attr-name': 'propName' }` reflection map. */
function staticProps(source) {
  const m = /static\s+props\s*=\s*\{([\s\S]*?)\}/.exec(source);
  if (!m) return {};
  const out = {};
  for (const p of m[1].matchAll(/['"]?([\w-]+)['"]?\s*:\s*['"]([\w]+)['"]/g)) out[p[1]] = p[2];
  return out;
}

/**
 * Descriptions from the leading JSDoc `Attributes:` block. Lines look like
 *   *   variant       - filled | tonal | outlined …
 * Continuation lines (no ` - `) append to the previous attribute.
 */
function docAttributes(source) {
  const header = /^\/\*([\s\S]*?)\*\//.exec(source);
  if (!header) return {};
  const lines = header[1].split('\n').map((l) => l.replace(/^\s*\*?/, ''));
  const start = lines.findIndex((l) => /^\s*Attributes:/.test(l));
  if (start === -1) return {};

  const out = {};
  let last = null;
  for (const line of lines.slice(start + 1)) {
    if (/^\s*$/.test(line)) break;
    if (/^\s{0,3}\w[\w ]*:\s*$/.test(line)) break; // next section header
    const m = /^\s{2,}([\w-]+)\s*-\s*(.*)$/.exec(line);
    if (m) {
      last = m[1];
      out[last] = m[2].trim();
    } else if (last) {
      out[last] = (out[last] + ' ' + line.trim()).trim();
    }
  }
  return out;
}

/** Slot names used in `_template()` output. */
function slots(source) {
  const found = new Set();
  for (const m of source.matchAll(/<slot(?:\s+name=["']([\w-]+)["'])?/g)) found.add(m[1] ?? 'default');
  return [...found];
}

/** Every CustomEvent name the component dispatches. */
function events(source) {
  const found = new Set();
  for (const m of source.matchAll(/new CustomEvent\(\s*['"]([\w:-]+)['"]/g)) found.add(m[1]);
  // Components that route through a helper (`_dispatch('close', …)`) rather
  // than constructing the CustomEvent at the call site.
  for (const m of source.matchAll(/_(?:emit|dispatch|fire)\(\s*['"]([\w:-]+)['"]/g)) found.add(m[1]);
  return [...found].sort();
}

/** Infer a prop type from its documented value list. */
function propType(name, doc) {
  const d = (doc ?? '').toLowerCase();
  if (/^(disabled|readonly|loading|block|stacked|slim|flat|active|tile|border|ripple|persistent|dismissible|multiple|indeterminate|clearable|chips|hide-details|inset|rounded)$/.test(name)) {
    return 'boolean';
  }
  if (/\|/.test(d)) return 'enum';
  if (/^(value|model-value)$/.test(name)) return 'string';
  if (/number|count|min|max|step|length|size|elevation/.test(name)) return 'number';
  return 'string';
}

/** Pull the `a | b | c` alternatives out of a documented value list. */
function enumValues(doc) {
  if (!doc || !doc.includes('|')) return undefined;
  const head = doc.split(/\s{2,}|\(|,\s/)[0];
  const parts = head.split('|').map((s) => s.trim()).filter((s) => /^[\w-]+$/.test(s));
  return parts.length > 1 ? parts : undefined;
}

/* ── Inheritance ─────────────────────────────────────────────────────────
 * Several Core components are subclasses (w-textarea extends WTextField,
 * w-icon-btn extends WBtn, w-bottom-sheet extends WOverlay). Their real API is
 * mostly the parent's, so the spec walks the `extends` chain and merges —
 * otherwise the contract would claim these components have no props or events.
 */

/** class name → source file, built once by scanning src/components/. */
async function classIndex() {
  const index = new Map();
  for (const file of await readdir(COMPONENTS)) {
    if (!file.endsWith('.js')) continue;
    const source = await readFile(join(COMPONENTS, file), 'utf8');
    for (const m of source.matchAll(/(?:export\s+)?class\s+(W[A-Za-z0-9_]*)\s+extends/g)) {
      if (!index.has(m[1])) index.set(m[1], file);
    }
  }
  return index;
}

/** Ordered [self, parent, grandparent, …] sources for a component file. */
async function sourceChain(file, index, seen = new Set()) {
  if (seen.has(file)) return [];
  seen.add(file);
  const source = await readFile(join(COMPONENTS, file), 'utf8');
  const parent = /class\s+W[A-Za-z0-9_]*\s+extends\s+(W[A-Za-z0-9_]*)/.exec(source);
  const parentFile = parent && index.get(parent[1]);
  const rest = parentFile ? await sourceChain(parentFile, index, seen) : [];
  return [{ file, source }, ...rest];
}

/* ── Spec assembly ───────────────────────────────────────────────────── */

async function buildSpec(entry, baseAttrs, index) {
  const chain = await sourceChain(entry.source, index);
  const source = chain[0].source;
  // Merge child-first so a subclass's own docs and reflection win.
  const own = chain.flatMap((c) => staticAttrs(c.source));
  const docs = Object.assign({}, ...chain.slice().reverse().map((c) => docAttributes(c.source)));
  const props = Object.assign({}, ...chain.slice().reverse().map((c) => staticProps(c.source)));
  const inheritsFrom = chain.slice(1).map((c) => `src/components/${c.file}`);

  // Own attrs first (the component's real API), then inherited layout attrs.
  const names = [...new Set([...own, ...Object.keys(docs)])].filter((n) => !n.startsWith('aria-'));
  const inherited = baseAttrs.filter((a) => !names.includes(a));

  const propSpec = {};
  for (const name of names.sort()) {
    const doc = docs[name];
    const type = propType(name, doc);
    const values = type === 'enum' ? enumValues(doc) : undefined;
    propSpec[name] = {
      type,
      ...(values ? { values } : {}),
      ...(type === 'boolean' ? { default: false } : {}),
      ...(doc ? { description: doc } : {}),
      ...(props[name] ? { property: props[name] } : {}),
    };
  }

  return {
    $description: `DuVay ${entry.name} — Core contract, tier ${entry.tier}.`,
    name: entry.name,
    tier: entry.tier,
    names: { web: entry.tag, ...entry.native },
    accessibility: {
      role: entry.role,
      // Every Core component takes its accessible name from its label/text
      // content, falling back to an explicit aria-label. Platform bindings map
      // this to accessibilityLabel / contentDescription / AutomationProperties
      // / accessible-name respectively.
      nameFrom: ['label', 'text', 'slotted content', 'aria-label'],
      keyboard: entry.role === 'button' || entry.role === 'checkbox' || entry.role === 'switch'
        ? ['Enter', 'Space']
        : undefined,
    },
    states: STATES,
    props: propSpec,
    events: [...new Set(chain.flatMap((c) => events(c.source)))].sort().map((name) => ({ name, detail: 'object' })),
    slots: [...new Set(chain.flatMap((c) => slots(c.source)))],
    ...(entry.delegatesToSystemPicker ? { delegatesToSystemPicker: entry.delegatesToSystemPicker } : {}),
    source: `src/components/${entry.source}`,
    ...(inheritsFrom.length ? { inheritsFrom } : {}),
    inheritedProps: inherited,
  };
}

/* ── Run ─────────────────────────────────────────────────────────────── */

const contract = JSON.parse(await readFile(join(SPEC, 'core-contract.json'), 'utf8'));
const baseSource = await readFile(join(COMPONENTS, 'base.js'), 'utf8');
const baseAttrs = staticAttrs(baseSource);
const index = await classIndex();

const check = process.argv.includes('--check');
if (!check) {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });
}

let stale = 0;
let total = 0;
for (const entry of contract.components) {
  const spec = await buildSpec(entry, baseAttrs, index);
  const file = join(OUT, `${entry.tag}.json`);
  const json = JSON.stringify(spec, null, 2) + '\n';
  total++;
  if (check) {
    const existing = await readFile(file, 'utf8').catch(() => null);
    if (existing !== json) {
      console.error(`✗ spec stale: ${entry.tag}`);
      stale++;
    }
  } else {
    await writeFile(file, json);
  }
}

if (check) {
  if (stale) {
    console.error(`\n✗ spec:check — ${stale}/${total} specs stale, run \`bun run spec:build\``);
    process.exit(1);
  }
  console.log(`✓ spec:check — ${total} component specs up to date`);
} else {
  const written = (await readdir(OUT)).length;
  console.log(`✓ generated ${written} component specs → spec/components/`);
}
