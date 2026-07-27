import { readFile } from 'node:fs/promises';
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
