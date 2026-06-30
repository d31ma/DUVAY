import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

const SIMPLE = 'items="[Frozen yogurt|159|6; Ice cream|237|9; Eclair|262|16; Cupcake|305|3; Gingerbread|356|16]" headers="[Dessert,Calories,Fat]"';

test('w-data-table renders a semantic table with headers and a paged body', async ({ mount, page }) => {
  await mount(`<w-data-table id="dt" ${SIMPLE} items-per-page="2"></w-data-table>`);

  await expect(page.locator('#dt table.w-table')).toBeVisible();
  await expect(page.locator('#dt thead th')).toHaveCount(3);
  await expect(page.locator('#dt tbody tr')).toHaveCount(2);
  await expect(page.locator('#dt tbody tr').first().locator('td').first()).toHaveText('Frozen yogurt');
  await expect(page.locator('#dt .w-data-table-range')).toHaveText('1–2 of 5');
});

test('w-data-table paginates with the footer nav and emits update:options', async ({ mount, page }) => {
  await mount(`<w-data-table id="dt" ${SIMPLE} items-per-page="2"></w-data-table>`);
  await recordEvents(page, '#dt', ['update:options']);

  await page.locator('#dt [data-page-action="next"]').click();
  await expect(page.locator('#dt tbody tr').first().locator('td').first()).toHaveText('Eclair');
  await expect(page.locator('#dt .w-data-table-range')).toHaveText('3–4 of 5');

  await page.locator('#dt [data-page-action="last"]').click();
  await expect(page.locator('#dt .w-data-table-range')).toHaveText('5–5 of 5');
  await expect(page.locator('#dt [data-page-action="next"]')).toBeDisabled();

  const events = await readEvents(page, '#dt');
  expect(events[0]).toEqual({ type: 'update:options', detail: { page: 2, itemsPerPage: 2, sortBy: '', sortDesc: false } });
});

test('w-data-table per-page select changes the page size', async ({ mount, page }) => {
  await mount(`<w-data-table id="dt" ${SIMPLE} items-per-page="2" items-per-page-options="2,5,10"></w-data-table>`);

  await page.locator('#dt [data-per-page]').selectOption('5');
  await expect(page.locator('#dt tbody tr')).toHaveCount(5);
  await expect(page.locator('#dt .w-data-table-range')).toHaveText('1–5 of 5');
});

test('w-data-table filters via search', async ({ mount, page }) => {
  await mount(`<w-data-table id="dt" ${SIMPLE} items-per-page="10" search="cup"></w-data-table>`);
  await expect(page.locator('#dt tbody tr')).toHaveCount(1);
  await expect(page.locator('#dt tbody tr td').first()).toHaveText('Cupcake');
});

test('w-data-table sorts a column ascending, descending, then clears', async ({ mount, page }) => {
  await mount(`<w-data-table id="dt" ${SIMPLE} items-per-page="2"></w-data-table>`);
  const firstCell = page.locator('#dt tbody tr').first().locator('td').first();
  const calHeader = page.locator('#dt thead th').nth(1).locator('button');

  await calHeader.click(); // ascending by calories: 159 first
  await expect(page.locator('#dt thead th').nth(1)).toHaveAttribute('aria-sort', 'ascending');
  await expect(firstCell).toHaveText('Frozen yogurt');

  await calHeader.click(); // descending: 356 first
  await expect(page.locator('#dt thead th').nth(1)).toHaveAttribute('aria-sort', 'descending');
  await expect(firstCell).toHaveText('Gingerbread');

  await calHeader.click(); // cleared
  await expect(page.locator('#dt thead th').nth(1)).toHaveAttribute('aria-sort', 'none');
});

test('w-data-table rich headers honor key, align, and sortable:false', async ({ mount, page }) => {
  const headers = JSON.stringify([
    { title: 'Name', key: 'name' },
    { title: 'Cal', key: 'calories', align: 'end' },
    { title: 'Tag', key: 'tag', sortable: false },
  ]).replace(/"/g, '&quot;');
  const items = JSON.stringify([{ name: 'B', calories: 9, tag: 'x' }, { name: 'A', calories: 2, tag: 'y' }]).replace(/"/g, '&quot;');
  await mount(`<w-data-table id="dt" headers="${headers}" items="${items}" items-per-page="10"></w-data-table>`);

  await expect(page.locator('#dt thead th').nth(2).locator('button')).toHaveCount(0); // not sortable
  await expect(page.locator('#dt tbody tr').first().locator('td').nth(1)).toHaveCSS('text-align', 'right');

  await page.locator('#dt thead th').first().locator('button').click(); // sort by name asc
  await expect(page.locator('#dt tbody tr').first().locator('td').first()).toHaveText('A');
});

test('w-data-table show-select selects rows and emits update:selected', async ({ mount, page }) => {
  const headers = JSON.stringify([{ title: 'Name', key: 'name' }]).replace(/"/g, '&quot;');
  const items = JSON.stringify([{ name: 'A' }, { name: 'B' }, { name: 'C' }]).replace(/"/g, '&quot;');
  await mount(`<w-data-table id="dt" headers="${headers}" items="${items}" item-value="name" show-select items-per-page="10"></w-data-table>`);
  await recordEvents(page, '#dt', ['update:selected']);

  await page.locator('#dt tbody [data-select="A"]').check();
  await expect(page.locator('#dt tbody tr').first()).toHaveClass(/selected/);
  await expect(page.locator('#dt')).toHaveAttribute('selected', 'A');

  await page.locator('#dt thead [data-select-all]').check();
  await expect(page.locator('#dt')).toHaveAttribute('selected', 'A,B,C');
  expect((await readEvents(page, '#dt')).pop()).toEqual({ type: 'update:selected', detail: { selected: ['A', 'B', 'C'] } });
});

test('w-data-table show-expand toggles a detail row and emits update:expanded', async ({ mount, page }) => {
  const headers = JSON.stringify([{ title: 'Name', key: 'name' }, { title: 'Cal', key: 'calories' }]).replace(/"/g, '&quot;');
  const items = JSON.stringify([{ name: 'A', calories: 1 }, { name: 'B', calories: 2 }]).replace(/"/g, '&quot;');
  await mount(`<w-data-table id="dt" headers="${headers}" items="${items}" item-value="name" show-expand items-per-page="10"></w-data-table>`);
  await recordEvents(page, '#dt', ['update:expanded']);

  await page.locator('#dt [data-expand="A"]').click();
  await expect(page.locator('#dt .w-data-table-expanded')).toHaveCount(1);
  await expect(page.locator('#dt .w-data-table-expanded')).toContainText('Cal: 1');
  expect(await readEvents(page, '#dt')).toEqual([{ type: 'update:expanded', detail: { expanded: ['A'] } }]);
});

test('w-data-table shows loading and no-data states', async ({ mount, page }) => {
  await mount(`<w-data-table id="ld" ${SIMPLE} loading></w-data-table><w-data-table id="empty" headers="[A,B]" items="[]" no-data-text="Nothing"></w-data-table>`);

  await expect(page.locator('#ld .w-data-table-loader')).toBeVisible();
  await expect(page.locator('#empty .w-table-message')).toHaveText('Nothing');
});

test('w-data-table density compact applies the dense modifier', async ({ mount, page }) => {
  await mount(`<w-data-table id="dt" ${SIMPLE} density="compact"></w-data-table>`);
  await expect(page.locator('#dt table')).toHaveClass(/w-table--dense/);
});
