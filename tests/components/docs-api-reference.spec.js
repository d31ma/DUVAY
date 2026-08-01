import { readdir, readFile } from 'node:fs/promises';
import { API_DATA } from '../../website/client/shared/scripts/api-data.js';
import { expect, test } from '../setup/component-test.js';

const projectFile = (path) => new URL(`../../${path}`, import.meta.url);
const metaRoutes = new Set(['/docs/components', '/docs/components/explorer']);

function componentRoutes(source) {
  const start = source.indexOf('const PAGES = [');
  const end = source.indexOf('\n];', start);
  const pages = source.slice(start, end);

  return [...pages.matchAll(
    /\{\s*path:\s*'([^']+)',\s*title:\s*'[^']+',\s*group:\s*'Components'/g,
  )]
    .map((match) => match[1])
    .filter((path) => !metaRoutes.has(path));
}

test('every component documentation route has a structured API reference', async () => {
  const docsSource = await readFile(
    projectFile('website/client/shared/scripts/docs.js'),
    'utf8',
  );
  const routes = componentRoutes(docsSource);
  const missing = routes.filter((path) => !API_DATA[path]);

  expect(missing).toEqual([]);
  routes.forEach((path) => {
    expect(API_DATA[path].length, `${path} has no component blocks`).toBeGreaterThan(0);
    API_DATA[path].forEach((block) => {
      expect(block.tag, `${path} has an unnamed component block`).toBeTruthy();
      expect(
        ['attributes', 'events', 'slots', 'methods'].some((key) => block[key]?.length),
        `${path} <${block.tag}> has no documented API surface`,
      ).toBe(true);
    });
  });
});

test('every registered web component and declared attribute is documented', async () => {
  const directory = projectFile('src/components/');
  const files = (await readdir(directory)).filter((name) => name.endsWith('.js'));
  const classes = new Map();
  const tags = new Map();

  for (const file of files) {
    const source = await readFile(new URL(file, directory), 'utf8');
    for (const match of source.matchAll(/(?:export\s+)?class\s+(\w+)\s+extends\s+(\w+)/g)) {
      const body = classBody(source, match.index);
      const declared = /static\s+attrs\s*=\s*\[([\s\S]*?)\]/.exec(body);
      classes.set(match[1], {
        parent: match[2],
        attrs: new Set(declared ? [...declared[1].matchAll(/'([^']+)'/g)].map((entry) => entry[1]) : []),
      });
    }
    for (const match of source.matchAll(/customElements\.define\(\s*'([\w-]+)'\s*,\s*(\w+)/g)) {
      tags.set(match[1], match[2]);
    }
  }

  const documented = new Map();
  Object.values(API_DATA).flat().forEach((block) => {
    if (!documented.has(block.tag)) documented.set(block.tag, new Set());
    (block.attributes || []).forEach((row) => {
      row[0].split(/\s*\/\s*/).forEach((name) => documented.get(block.tag).add(name));
    });
  });

  const inherited = (name, seen = new Set()) => {
    if (!name || seen.has(name)) return new Set();
    seen.add(name);
    const entry = classes.get(name);
    return entry ? new Set([...entry.attrs, ...inherited(entry.parent, seen)]) : new Set();
  };

  const missingTags = [...tags.keys()].filter((tag) => !documented.has(tag));
  expect(missingTags).toEqual([]);
  for (const [tag, className] of tags) {
    const missingAttrs = [...inherited(className)].filter((name) => !documented.get(tag).has(name));
    expect(missingAttrs, `${tag} has undocumented attributes`).toEqual([]);
  }
});

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
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = '';
      continue;
    }
    if (char === '/' && next === '/') { lineComment = true; index += 1; continue; }
    if (char === '/' && next === '*') { blockComment = true; index += 1; continue; }
    if (char === "'" || char === '"' || char === '`') { quote = char; continue; }
    if (char === '{') depth += 1;
    if (char === '}' && --depth === 0) return source.slice(open + 1, index);
  }
  return source.slice(open + 1);
}

test('API reference tables share responsive markup and fit a mobile viewport', async ({
  componentServer,
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(componentServer.url(
    '/tests/fixtures/docs-api-page.html?route=/docs/images',
  ));

  const reference = page.locator('[w-api]');
  await expect(reference).toBeVisible();
  await expect(reference.getByRole('heading', { name: 'API reference' })).toBeVisible();

  const result = await reference.locator('[data-api-kind="attributes"]').evaluate((table) => {
    const wrapper = table.parentElement;
    const row = table?.querySelector('tbody tr');
    const labels = [...(row?.querySelectorAll('td') || [])]
      .map((cell) => cell.getAttribute('data-label'));

    return {
      tableClasses: [...(table?.classList || [])],
      rowDisplay: row ? getComputedStyle(row).display : '',
      labels,
      overflows: wrapper.scrollWidth > wrapper.clientWidth,
    };
  });

  expect(result.tableClasses).toEqual(expect.arrayContaining(['w-table', 'api-table']));
  expect(result.rowDisplay).toBe('grid');
  expect(result.labels).toEqual(['Attribute', 'Type', 'Default', 'Description']);
  expect(result.overflows).toBe(false);

  const authored = await page.locator('[data-manual-api]').evaluate((table) => ({
    tableClasses: [...table.classList],
    wrapperClass: table.parentElement?.className || '',
    labels: [...table.querySelectorAll('tbody td')]
      .map((cell) => cell.getAttribute('data-label')),
  }));

  expect(authored.tableClasses).toEqual(expect.arrayContaining(['w-table', 'api-table']));
  expect(authored.wrapperClass).toContain('api-table-wrap');
  expect(authored.labels).toEqual(['Attribute', 'Description']);
});
