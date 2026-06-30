import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

// The server table renders `items` as-is (already the current page) and uses
// `items-length` for the footer math, emitting update:options on navigation.
const PAGE1 = 'items="[Alpha|1; Beta|2]" headers="[Name,N]" items-length="50" items-per-page="2"';

test('w-data-table-server renders the given page and footer from items-length', async ({ mount, page }) => {
  await mount(`<w-data-table-server id="dt" ${PAGE1}></w-data-table-server>`);

  await expect(page.locator('#dt tbody tr')).toHaveCount(2);
  await expect(page.locator('#dt .w-data-table-range')).toHaveText('1–2 of 50');
  await expect(page.locator('#dt [data-page-action="next"]')).toBeEnabled();
});

test('w-data-table-server does not sort locally but emits update:options', async ({ mount, page }) => {
  await mount(`<w-data-table-server id="dt" ${PAGE1}></w-data-table-server>`);
  await recordEvents(page, '#dt', ['update:options']);

  await page.locator('#dt thead th').first().locator('button').click();
  // order is unchanged (server owns sorting), but the request is announced
  await expect(page.locator('#dt tbody tr').first().locator('td').first()).toHaveText('Alpha');
  expect((await readEvents(page, '#dt'))[0].detail).toMatchObject({ sortBy: 'Name', page: 1 });
});

test('w-data-table-server paginates by emitting the requested page', async ({ mount, page }) => {
  await mount(`<w-data-table-server id="dt" ${PAGE1}></w-data-table-server>`);
  await recordEvents(page, '#dt', ['update:options']);

  await page.locator('#dt [data-page-action="next"]').click();
  expect((await readEvents(page, '#dt'))[0].detail).toMatchObject({ page: 2, itemsPerPage: 2 });
});
