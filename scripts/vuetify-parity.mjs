#!/usr/bin/env bun
// Vuetify → DuVay attribute parity report.
//
// The checked-in metadata snapshot makes this deterministic in CI. To audit a
// different release, point VUETIFY_ATTRIBUTES at that package's attributes.json.
//
// Vuetify publishes every component prop, with type and description, in
// `dist/json/attributes.json`. This script pairs each VComponent with the
// `w-*` element of the same name and reports which props DuVay does not accept.
//
//   bun run parity                 # per-component gap counts
//   bun run parity detail w-btn    # every prop of one component, ✓ / ✗
//   bun run parity json            # machine-readable gaps
//   bun run parity markdown        # the checked-in report table
import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const componentDir = join(projectRoot, 'src/components');
const attributesPath = process.env.VUETIFY_ATTRIBUTES
  || join(projectRoot, 'scripts/data/vuetify-attributes.json');
const versionPath = join(projectRoot, 'scripts/data/vuetify-version.json');
const strictProps = process.env.DUVAY_STRICT_PARITY === '1';

// Props that cannot exist as an HTML attribute in a Light-DOM, zero-dependency
// framework: they need Vue's render layer, vue-router, or a function/object
// value that no attribute string can carry.
const NOT_APPLICABLE = new Set([
  'tag', 'model-value', 'model-modifiers', 'focused', 'eager', 'symbol', 'defaults-target',
  'attach', 'activator', 'activator-props', 'content-props', 'header-props', 'menu-props',
  'list-props', 'row-props', 'cell-props', 'item-props', 'options',
  'to', 'replace', 'exact',
  'rules', 'value-comparator', 'custom-filter', 'custom-key-filter', 'custom-key-sort',
  'get-matches', 'group-key', 'counter-value', 'weekday-format', 'month-format', 'year-format',
  'day-format', 'header-format', 'title-format', 'item-selectable', 'item-children',
  'item-title', 'item-value', 'item-type', 'sort-func', 'filter',
  'location-strategy', 'scroll-strategy', 'transition-duration',
]);

// Props that are only inapplicable on a particular Vuetify component. Keeping
// these scoped avoids hiding real gaps on components where the same prop does
// have a useful HTML-attribute equivalent.
const NOT_APPLICABLE_BY_COMPONENT = new Map([
  ['VApp', new Set(['overlaps'])], // explicitly marked for Vuetify internals
  ['VLayout', new Set(['overlaps'])],
  ['VCalendar', new Set(['interval-format', 'interval-style', 'show-interval-label'])],
  ['VSelect', new Set(['type', 'hide-spin-buttons'])], // inherited text-field props; VSelect is not numeric
  ['VTreeview', new Set(['load-children'])], // Promise-returning callback
]);

// Applied to every element by WElement._applyCommonProps, so no component
// declares them individually.
const COMMON = [
  'color', 'bg-color', 'base-color', 'active-color', 'density', 'elevation', 'hover-elevation',
  'location', 'position', 'rounded', 'border', 'tile', 'loading', 'readonly', 'disabled', 'theme',
  'width', 'height', 'min-width', 'max-width', 'min-height', 'max-height',
  'id', 'class', 'style', 'role', 'tabindex',
];
const VALIDATION = ['required', 'pattern', 'minlength', 'maxlength', 'min', 'max', 'step'];

const kebab = (name) => name
  .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
  .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
  .toLowerCase();

const vuetify = await readVuetify();
const vuetifyVersion = await readVuetifyVersion();
const duvay = await readDuvay();
const { pairs, unpairedVuetify, unpairedDuvay } = pair(vuetify, duvay);

const [mode = 'summary', argument] = process.argv.slice(2);
if (mode === 'summary') summary();
else if (mode === 'json') console.log(JSON.stringify(gaps(), null, 2));
else if (mode === 'markdown') markdown();
else if (mode === 'detail') detail(argument);
else { console.error(`unknown mode: ${mode}`); process.exit(1); }

async function readVuetify() {
  let raw;
  try {
    raw = await readFile(attributesPath, 'utf8');
  } catch {
    console.error(`Vuetify attribute data not found at ${attributesPath}.`);
    console.error('Set VUETIFY_ATTRIBUTES to a checkout of vuetify/dist/json/attributes.json.');
    process.exit(1);
  }
  const components = new Map();
  for (const [key, meta] of Object.entries(JSON.parse(raw))) {
    const slash = key.indexOf('/');
    const component = key.slice(0, slash);
    if (!components.has(component)) components.set(component, new Map());
    components.get(component).set(key.slice(slash + 1), {
      type: meta.type.trim().replace(/\s+/g, ' '),
      description: meta.description,
    });
  }
  return components;
}

async function readVuetifyVersion() {
  if (process.env.VUETIFY_ATTRIBUTES) return process.env.VUETIFY_VERSION || 'external metadata';
  try { return JSON.parse(await readFile(versionPath, 'utf8')).version || 'unknown'; }
  catch { return 'unknown'; }
}

async function readDuvay() {
  const files = (await readdir(componentDir)).filter((name) => name.endsWith('.js'));
  const classes = new Map();
  const tagByClass = new Map();
  const aliases = new Map();
  const aliasVariables = new Map();
  const mixins = new Map();

  for (const file of files) {
    const source = await readFile(join(componentDir, file), 'utf8');

    for (const match of source.matchAll(/class\s+(\w+)\s+extends\s+customElements\.get\(\s*'([\w-]+)'/g)) {
      aliases.set(match[1], match[2]);
    }
    // Some aliases need a fallback when the base custom element may not have
    // been registered yet: `const Base = customElements.get('w-x') || WElement`.
    for (const match of source.matchAll(/const\s+(\w+)\s*=\s*customElements\.get\(\s*'([\w-]+)'/g)) {
      aliasVariables.set(match[1], match[2]);
    }
    // `function wMixin(Base) { return class WMixin extends Base {…} }` — record
    // which class a mixin call resolves to so `extends wMixin(WElement)` works.
    for (const match of source.matchAll(/function\s+(\w+)\s*\([^)]*\)\s*\{\s*return\s+class\s+(\w+)\s+extends/g)) {
      mixins.set(match[1], match[2]);
    }
    for (const match of source.matchAll(/(?:export\s+)?class\s+(\w+)\s+extends\s+(\w+)(\s*\(\s*(\w+))?/g)) {
      const [, name, parent, , mixinArg] = match;
      classes.set(name, { file, parent, mixinArg, attrs: declaredAttrs(classBody(source, match.index)) });
    }
    for (const match of source.matchAll(/customElements\.define\(\s*'([\w-]+)'\s*,\s*(\w+)/g)) {
      tagByClass.set(match[2], match[1]);
    }
  }

  const inherited = (name, seen = new Set()) => {
    if (!name || seen.has(name)) return new Set();
    seen.add(name);
    const entry = classes.get(name);
    // A mixin call contributes both the class the mixin returns and its argument.
    if (!entry) {
      if (mixins.has(name)) return inherited(mixins.get(name), seen);
      const sourceTag = aliasVariables.get(name);
      const sourceClass = sourceTag
        ? [...tagByClass].find(([, tag]) => tag === sourceTag)?.[0]
        : null;
      return sourceClass ? inherited(sourceClass, seen) : new Set();
    }
    return new Set([
      ...entry.attrs,
      ...inherited(entry.parent, seen),
      ...inherited(entry.mixinArg, seen),
    ]);
  };

  const byTag = new Map();
  for (const [className, tag] of tagByClass) {
    byTag.set(tag, { className, file: classes.get(className)?.file, attrs: inherited(className) });
  }
  // `class WOtpInput extends customElements.get('w-otp')` inherits the whole surface.
  for (const [className, sourceTag] of aliases) {
    const tag = tagByClass.get(className);
    const base = byTag.get(sourceTag);
    const own = byTag.get(tag);
    if (tag && base) {
      byTag.set(tag, {
        ...own,
        attrs: new Set([...base.attrs, ...(own?.attrs || [])]),
        aliasOf: sourceTag,
      });
    }
  }
  for (const entry of byTag.values()) COMMON.forEach((name) => entry.attrs.add(name));
  return byTag;
}

// Return one class declaration only. Scanning `source.slice(match.index)` would
// accidentally assign attributes read by every later class in the same file to
// the first class, producing false parity and misleading API documentation.
function classBody(source, classIndex) {
  const open = source.indexOf('{', classIndex);
  if (open < 0) return '';
  let depth = 0;
  let quote = '';
  let lineComment = false;
  let blockComment = false;
  let escaped = false;
  for (let index = open; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    if (lineComment) {
      if (char === '\n') lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === '*' && next === '/') { blockComment = false; index += 1; }
      continue;
    }
    if (quote) {
      if (escaped) { escaped = false; continue; }
      if (char === '\\') { escaped = true; continue; }
      if (char === quote) quote = '';
      continue;
    }
    if (char === '/' && next === '/') { lineComment = true; index += 1; continue; }
    if (char === '/' && next === '*') { blockComment = true; index += 1; continue; }
    if (char === "'" || char === '"' || char === '`') { quote = char; continue; }
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(open + 1, index);
    }
  }
  return source.slice(open + 1);
}

// Attributes a class observes or reads. Observed ones come from `static attrs`;
// the rest are read directly and would be missed by looking at that list alone.
function declaredAttrs(body) {
  const attrs = new Set();
  const declared = /static\s+attrs\s*=\s*\[([\s\S]*?)\]/.exec(body);
  if (declared) for (const quoted of declared[1].matchAll(/'([^']+)'/g)) attrs.add(quoted[1]);

  const readers = [
    /this\._attr\(\s*'([^']+)'/g,
    /this\._bool\(\s*'([^']+)'/g,
    /this\.(?:getAttribute|hasAttribute)\(\s*'([^']+)'/g,
    /w(?:Bool|Number|Primitive(?:Bool)?)Attr\(\s*this\s*,\s*'([^']+)'/g,
  ];
  for (const pattern of readers) for (const quoted of body.matchAll(pattern)) attrs.add(quoted[1]);

  if (/this\._validationAttrs\(\s*\)/.test(body)) VALIDATION.forEach((name) => attrs.add(name));
  const list = /this\._validationAttrs\(\s*\[([\s\S]*?)\]/.exec(body);
  if (list) for (const quoted of list[1].matchAll(/'([^']+)'/g)) attrs.add(quoted[1]);

  return attrs;
}

function pair(components, byTag) {
  const paired = [];
  const unpairedV = [];
  for (const [component, props] of components) {
    const tag = 'w-' + kebab(component.replace(/^V/, ''));
    const element = byTag.get(tag);
    if (element) paired.push({ component, tag, props, element });
    else unpairedV.push({ component, tag, count: props.size });
  }
  const matched = new Set(paired.map((entry) => entry.tag));
  return {
    pairs: paired,
    unpairedVuetify: unpairedV,
    unpairedDuvay: [...byTag.keys()].filter((tag) => !matched.has(tag)),
  };
}

function missingFor(entry) {
  const missing = new Map();
  for (const [prop, meta] of entry.props) {
    if (entry.element.attrs.has(prop) || notApplicable(entry, prop)) continue;
    missing.set(prop, meta);
  }
  return missing;
}

function notApplicable(entry, prop) {
  if (strictProps) return false;
  return NOT_APPLICABLE.has(prop)
    || NOT_APPLICABLE_BY_COMPONENT.get(entry.component)?.has(prop);
}

function gaps() {
  const out = {};
  for (const entry of pairs) {
    const missing = missingFor(entry);
    if (missing.size) out[entry.tag] = { component: entry.component, file: entry.element.file, missing: Object.fromEntries(missing) };
  }
  return out;
}

function summary() {
  const rows = pairs.map((entry) => ({ ...entry, missing: missingFor(entry).size }))
    .sort((a, b) => b.missing - a.missing);
  const total = rows.reduce((sum, row) => sum + row.missing, 0);
  const complete = rows.filter((row) => !row.missing).length;

  console.log(`Vuetify ${vuetifyVersion} components ${vuetify.size} · DuVay elements ${duvay.size} · paired ${pairs.length}`);
  console.log(`At full parity: ${complete}/${pairs.length}   outstanding attributes: ${total}\n`);
  for (const row of rows) {
    if (!row.missing) continue;
    console.log(`  ${String(row.missing).padStart(3)}  ${row.tag.padEnd(30)} (${row.component})`);
  }
  console.log(`\nVuetify components with no DuVay counterpart (${unpairedVuetify.length}): `
    + unpairedVuetify.map((entry) => entry.component).join(', '));
  console.log(`\nDuVay elements beyond Vuetify (${unpairedDuvay.length}): ${unpairedDuvay.join(', ')}`);
  process.exitCode = total || unpairedVuetify.length ? 1 : 0;
}

function detail(tag) {
  const entry = pairs.find((candidate) => candidate.tag === tag);
  if (!entry) { console.error(`no Vuetify counterpart for ${tag}`); process.exit(1); }
  console.log(`${entry.component} → ${entry.tag}  (src/components/${entry.element.file})\n`);
  for (const [prop, meta] of entry.props) {
    const mark = entry.element.attrs.has(prop) ? '✓' : notApplicable(entry, prop) ? '–' : '✗';
    console.log(`  ${mark} ${prop.padEnd(28)} ${meta.type}`);
  }
  console.log('\n  ✓ supported   – not applicable to a Light-DOM framework   ✗ missing');
}

function markdown() {
  const rows = pairs.map((entry) => {
    const missing = missingFor(entry);
    const supported = [...entry.props.keys()].filter((prop) => entry.element.attrs.has(prop)).length;
    const skipped = [...entry.props.keys()].filter((prop) => !entry.element.attrs.has(prop) && notApplicable(entry, prop)).length;
    return { tag: entry.tag, component: entry.component, supported, skipped, missing: [...missing.keys()] };
  }).sort((a, b) => b.missing.length - a.missing.length || a.tag.localeCompare(b.tag));

  const total = rows.reduce((sum, row) => sum + row.missing.length, 0);
  console.log('# Vuetify parity\n');
  console.log('Generated by `bun run parity markdown`. Every Vuetify component prop is compared');
  console.log('against the attributes the matching DuVay element accepts.\n');
  console.log(`- Paired components: **${rows.length}**`);
  console.log(`- At full parity: **${rows.filter((row) => !row.missing.length).length}**`);
  console.log(`- Outstanding attributes: **${total}**\n`);
  console.log(`- Vuetify release: **${vuetifyVersion}**\n`);
  console.log('“N/A” counts props that need Vue’s render layer, vue-router, or a function value,');
  console.log('and therefore cannot exist as an HTML attribute. They are listed in');
  console.log('`scripts/vuetify-parity.mjs`.\n');
  console.log('| Element | Vuetify | Supported | N/A | Missing |');
  console.log('| --- | --- | ---: | ---: | --- |');
  for (const row of rows) {
    const missing = row.missing.length ? row.missing.map((name) => `\`${name}\``).join(', ') : '—';
    console.log(`| \`<${row.tag}>\` | ${row.component} | ${row.supported} | ${row.skipped} | ${missing} |`);
  }
  console.log(`\n## Vuetify components with no DuVay counterpart (${unpairedVuetify.length})\n`);
  console.log(unpairedVuetify.map((entry) => `- ${entry.component}`).join('\n') || '- none');
  console.log(`\n## DuVay elements beyond Vuetify (${unpairedDuvay.length})\n`);
  console.log(unpairedDuvay.map((tag) => `- \`<${tag}>\``).join('\n') || '- none');
}
