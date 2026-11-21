import { expect, test } from '../setup/component-test.js';
import { Axe } from '../setup/axe.js';
import { DocsPage } from '../setup/docs-page.js';

/* A table wrapper that scrolls must be reachable from the keyboard, or a
 * keyboard user cannot scroll it (WCAG 2.1.1, axe scrollable-region-focusable).
 * It becomes a named, focusable region only while it scrolls, so a table that
 * fits adds no extra tab stop. */

const RULES = ['scrollable-region-focusable'];

const GRID_ROWS = `<w-row header><w-col cols="4">Dessert</w-col><w-col cols="4">Calories</w-col><w-col cols="4">Fat</w-col></w-row>
  <w-row><w-col cols="4">Eclair</w-col><w-col cols="4">262</w-col><w-col cols="4">16 g</w-col></w-row>`;

const NATIVE_ROWS = Array.from({ length: 12 }, (_, index) => `<tr><td>Row ${index}</td><td>${index}</td></tr>`).join('');

async function scrollViolations(page) {
  await Axe.inject(page);
  return Axe.violations(page, '#root', RULES);
}

test('a w-table that scrolls sideways is a focusable, named region', async ({ page, mount }) => {
  await mount(`<div id="box" style="width: 240px"><w-table id="table" grid responsive="scroll" aria-label="Desserts">${GRID_ROWS}</w-table></div>`);
  const wrap = page.locator('#table .w-table-wrap');

  await expect(wrap).toHaveAttribute('tabindex', '0');
  await expect(wrap).toHaveAttribute('role', 'region');
  await expect(wrap).toHaveAccessibleName('Desserts');
  expect(await scrollViolations(page)).toEqual([]);

  await wrap.focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => wrap.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
});

test('a w-table that fits adds no tab stop, and gains one when it starts to scroll', async ({ page, mount }) => {
  await mount(`<div id="box" style="width: 900px"><w-table id="table" grid responsive="scroll">${GRID_ROWS}</w-table></div>`);
  const wrap = page.locator('#table .w-table-wrap');

  await expect(wrap).not.toHaveAttribute('tabindex', /.*/);
  await expect(wrap).not.toHaveAttribute('role', /.*/);

  await page.locator('#box').evaluate((box) => { box.style.width = '240px'; });
  await expect(wrap).toHaveAttribute('tabindex', '0');
  await expect(wrap).toHaveAccessibleName('Table');

  await page.locator('#box').evaluate((box) => { box.style.width = '900px'; });
  await expect(wrap).not.toHaveAttribute('tabindex', /.*/);
});

test('a fixed-header w-table with a height is focusable when its rows scroll', async ({ page, mount }) => {
  await mount(`<w-table id="table" fixed-header height="120px"><table><caption>Rows</caption><thead><tr><th>Name</th><th>Value</th></tr></thead><tbody>${NATIVE_ROWS}</tbody></table></w-table>`);
  const wrap = page.locator('#table .w-table-wrap');

  await expect(wrap).toHaveAttribute('tabindex', '0');
  await expect(wrap).toHaveAccessibleName('Rows');
  expect(await scrollViolations(page)).toEqual([]);
});

test('a w-data-table with a height is focusable when its rows scroll', async ({ page, mount }) => {
  const items = JSON.stringify(Array.from({ length: 12 }, (_, index) => ({ name: `Row ${index}`, value: index })));
  await mount(`<w-data-table id="table" height="120px" aria-label="Values" headers="[name,value]" items='${items}'></w-data-table>`);
  const wrap = page.locator('#table .w-table-wrap');

  await expect(wrap).toHaveAttribute('tabindex', '0');
  await expect(wrap).toHaveAccessibleName('Values');
  expect(await scrollViolations(page)).toEqual([]);
});

test('scrolling docs API tables are focusable, named regions', async ({ page, componentServer, duvayOs }) => {
  test.setTimeout(60000);
  await DocsPage.open(page, componentServer, { name: 'buttons', os: duvayOs, theme: 'light' });
  await Axe.inject(page);

  const scrolling = page.locator('.api-table-wrap[tabindex="0"]');
  await expect.poll(() => scrolling.count()).toBeGreaterThan(0);
  await expect(scrolling.first()).toHaveAttribute('role', 'region');
  await expect(scrolling.first()).toHaveAccessibleName(/.+/);
  expect(await Axe.violations(page, '[w-page]', RULES)).toEqual([]);
});

test('the tables docs page has no unreachable scroll regions', async ({ page, componentServer, duvayOs }) => {
  test.setTimeout(60000);
  await DocsPage.open(page, componentServer, { name: 'tables', os: duvayOs, theme: 'light' });
  await Axe.inject(page);
  expect(await Axe.violations(page, '[w-page]', RULES)).toEqual([]);
});
