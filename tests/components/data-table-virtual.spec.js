import { expect, test } from '../setup/component-test.js';

function bigItems(n) {
  return JSON.stringify(Array.from({ length: n }, (_, i) => ({ name: 'Row ' + i, n: i }))).replace(/"/g, '&quot;');
}
const HEADERS = JSON.stringify([{ title: 'Name', key: 'name' }, { title: 'N', key: 'n' }]).replace(/"/g, '&quot;');

test('w-data-table-virtual renders only a window of rows for a large dataset', async ({ mount, page }) => {
  await mount(`<w-data-table-virtual id="dt" headers="${HEADERS}" items="${bigItems(1000)}" height="300px" item-height="40"></w-data-table-virtual>`);

  // Far fewer <tr> than 1000 (window + spacer rows), and the first row is visible.
  const dataRows = await page.locator('#dt tbody tr:not([aria-hidden="true"])').count();
  expect(dataRows).toBeGreaterThan(0);
  expect(dataRows).toBeLessThan(60);
  await expect(page.locator('#dt tbody tr:not([aria-hidden="true"])').first().locator('td').first()).toHaveText('Row 0');
});

test('w-data-table-virtual reveals later rows after scrolling', async ({ mount, page }) => {
  await mount(`<w-data-table-virtual id="dt" headers="${HEADERS}" items="${bigItems(1000)}" height="300px" item-height="40"></w-data-table-virtual>`);

  await page.locator('#dt [data-virtual-scroll]').evaluate((el) => { el.scrollTop = 4000; el.dispatchEvent(new Event('scroll')); });
  const texts = await page.locator('#dt tbody tr:not([aria-hidden="true"]) td:first-child').allTextContents();
  expect(texts.some((t) => t === 'Row 100')).toBe(true);
});

test('w-data-table-virtual sorts the full dataset', async ({ mount, page }) => {
  await mount(`<w-data-table-virtual id="dt" headers="${HEADERS}" items="${bigItems(100)}" height="300px" item-height="40"></w-data-table-virtual>`);

  await page.locator('#dt thead th').nth(1).locator('button').click(); // asc by n (numeric)
  await page.locator('#dt thead th').nth(1).locator('button').click(); // desc → highest first
  await expect(page.locator('#dt tbody tr:not([aria-hidden="true"])').first().locator('td').first()).toHaveText('Row 99');
});
