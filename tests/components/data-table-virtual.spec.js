import { expect, readEvents, recordEvents, test } from '../setup/component-test.js';

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

/* ── Vuetify parity attributes ───────────────────────────────────────────── */

const CITY_HEADERS = JSON.stringify([
  { title: 'Name', key: 'name' },
  { title: 'City', key: 'city' },
]).replace(/"/g, '&quot;');

function records(rows) {
  return JSON.stringify(rows).replace(/"/g, '&quot;');
}

const CITIES = records([
  { name: 'Alpha', city: 'Rome' },
  { name: 'Rome', city: 'Alpha' },
  { name: 'Beta', city: 'Oslo' },
]);

function virtual(attrs, headers = CITY_HEADERS, items = CITIES) {
  return `<w-data-table-virtual id="dt" headers="${headers}" items="${items}" height="300px" item-height="40" ${attrs}></w-data-table-virtual>`;
}

const rows = (page) => page.locator('#dt tbody tr:not([aria-hidden="true"])');

test('w-data-table-virtual item-height falls back to 48 when unset', async ({ mount, page }) => {
  await mount(`<w-data-table-virtual id="dt" headers="${HEADERS}" items="${bigItems(1000)}" height="300px"></w-data-table-virtual>`);

  // A 300px viewport over 48px rows is ~15 windowed rows; a 1px row height
  // (the old fallback) would put 300+ of them in the DOM.
  const dataRows = await rows(page).count();
  expect(dataRows).toBeGreaterThan(8);
  expect(dataRows).toBeLessThan(30);
});

test('w-data-table-virtual sticky is an alias of fixed-header', async ({ mount, page }) => {
  await mount(`${virtual('')}<w-data-table-virtual id="loose" headers="${CITY_HEADERS}" items="${CITIES}" sticky="false"></w-data-table-virtual>`);

  await expect(page.locator('#dt [data-virtual-scroll]')).toHaveClass(/w-table-wrap--fixed-header/);
  await expect(page.locator('#loose [data-virtual-scroll]')).not.toHaveClass(/w-table-wrap--fixed-header/);
});

test('w-data-table-virtual gridlines picks the matching table modifier', async ({ mount, page }) => {
  await mount(`${virtual('gridlines="vertical"')}
    <w-data-table-virtual id="all" headers="${CITY_HEADERS}" items="${CITIES}" gridlines></w-data-table-virtual>
    <w-data-table-virtual id="off" headers="${CITY_HEADERS}" items="${CITIES}" gridlines="false"></w-data-table-virtual>`);

  await expect(page.locator('#dt table')).toHaveClass(/w-table--gridlines-vertical/);
  await expect(page.locator('#all table')).toHaveClass(/w-table--gridlines-all/);
  await expect(page.locator('#off table')).toHaveClass(/w-table--gridlines-none/);
});

test('w-data-table-virtual mobile stacks the cells with their column labels', async ({ mount, page }) => {
  await mount(virtual('mobile'));

  await expect(page.locator('#dt table')).toHaveClass(/w-table--responsive-stack/);
  await expect(rows(page).first().locator('td').first()).toHaveAttribute('data-label', 'Name');
  await expect(page.locator('#dt thead')).toBeHidden();
});

test('w-data-table-virtual mobile-breakpoint stacks below the named width', async ({ mount, page }) => {
  await page.setViewportSize({ width: 500, height: 700 });
  await mount(`${virtual('mobile-breakpoint="sm"')}
    <w-data-table-virtual id="wide" headers="${CITY_HEADERS}" items="${CITIES}" mobile-breakpoint="400"></w-data-table-virtual>`);

  await expect(page.locator('#dt table')).toHaveClass(/w-table--responsive-stack/);
  await expect(page.locator('#wide table')).not.toHaveClass(/w-table--responsive-stack/);
});

test('w-data-table-virtual hides the default header and body on request', async ({ mount, page }) => {
  await mount(`${virtual('hide-default-header')}
    <w-data-table-virtual id="nobody" headers="${CITY_HEADERS}" items="${CITIES}" hide-default-body></w-data-table-virtual>`);

  await expect(page.locator('#dt thead')).toHaveCount(0);
  await expect(page.locator('#nobody tbody tr')).toHaveCount(0);
});

test('w-data-table-virtual hide-no-data suppresses the empty message', async ({ mount, page }) => {
  await mount(`<w-data-table-virtual id="dt" headers="${CITY_HEADERS}" items="[]" no-data-text="Nothing here"></w-data-table-virtual>
    <w-data-table-virtual id="quiet" headers="${CITY_HEADERS}" items="[]" hide-no-data></w-data-table-virtual>`);

  await expect(page.locator('#dt .w-table-message')).toHaveText('Nothing here');
  await expect(page.locator('#quiet .w-table-message')).toHaveCount(0);
});

test('w-data-table-virtual no-filter ignores the search term', async ({ mount, page }) => {
  await mount(`${virtual('search="alpha"')}
    <w-data-table-virtual id="unfiltered" headers="${CITY_HEADERS}" items="${CITIES}" search="alpha" no-filter></w-data-table-virtual>`);

  await expect(rows(page)).toHaveCount(2);
  await expect(page.locator('#unfiltered tbody tr:not([aria-hidden="true"])')).toHaveCount(3);
});

test('w-data-table-virtual filter-keys narrows the search to named columns', async ({ mount, page }) => {
  await mount(virtual('search="alpha" filter-keys="name"'));

  await expect(rows(page)).toHaveCount(1);
  await expect(rows(page).first().locator('td').first()).toHaveText('Alpha');
});

test('w-data-table-virtual filter-mode combines the filter keys', async ({ mount, page }) => {
  const items = records([
    { name: 'aa', city: 'bb' },
    { name: 'aa', city: 'ba' },
  ]);
  await mount(`<w-data-table-virtual id="dt" headers="${CITY_HEADERS}" items="${items}" search="a" filter-keys="name,city" filter-mode="every"></w-data-table-virtual>
    <w-data-table-virtual id="some" headers="${CITY_HEADERS}" items="${items}" search="a" filter-keys="name,city" filter-mode="some"></w-data-table-virtual>`);

  await expect(rows(page)).toHaveCount(1);
  await expect(page.locator('#some tbody tr:not([aria-hidden="true"])')).toHaveCount(2);
});

test('w-data-table-virtual disable-sort drops the sort buttons', async ({ mount, page }) => {
  await mount(virtual('disable-sort'));

  await expect(page.locator('#dt thead button')).toHaveCount(0);
  await expect(page.locator('#dt thead th').first()).toHaveText('Name');
});

test('w-data-table-virtual initial-sort-order starts the cycle descending', async ({ mount, page }) => {
  await mount(virtual('initial-sort-order="desc"'));

  await page.locator('#dt thead th').first().locator('button').click();
  await expect(page.locator('#dt thead th').first()).toHaveAttribute('aria-sort', 'descending');
  await expect(rows(page).first().locator('td').first()).toHaveText('Rome');
});

test('w-data-table-virtual must-sort never returns to unsorted', async ({ mount, page }) => {
  await mount(`${virtual('must-sort')}
    <w-data-table-virtual id="free" headers="${CITY_HEADERS}" items="${CITIES}"></w-data-table-virtual>`);

  const clickThrice = async (selector) => {
    for (let i = 0; i < 3; i++) await page.locator(selector).locator('thead th').first().locator('button').click();
  };
  await clickThrice('#dt');
  await clickThrice('#free');

  await expect(page.locator('#dt thead th').first()).toHaveAttribute('aria-sort', 'ascending');
  await expect(page.locator('#free thead th').first()).toHaveAttribute('aria-sort', 'none');
});

test('w-data-table-virtual renders the configured sort glyphs', async ({ mount, page }) => {
  await mount(virtual('sort-icon="↕" sort-asc-icon="^" sort-desc-icon="v"'));

  await expect(page.locator('#dt thead th').first().locator('.w-table-sort-icon')).toHaveText('↕');
  await page.locator('#dt thead th').first().locator('button').click();
  await expect(page.locator('#dt thead th').first().locator('.w-table-sort-icon')).toHaveText('^');
  await page.locator('#dt thead th').first().locator('button').click();
  await expect(page.locator('#dt thead th').first().locator('.w-table-sort-icon')).toHaveText('v');
});

test('w-data-table-virtual select-all-label names the header checkbox', async ({ mount, page }) => {
  await mount(virtual('show-select item-value="name" select-all-label="Select every row"'));

  await expect(page.locator('#dt [data-select-all]')).toHaveAttribute('aria-label', 'Select every row');
});

test('w-data-table-virtual return-object emits the items instead of the keys', async ({ mount, page }) => {
  await mount(virtual('show-select item-value="name" return-object'));
  await recordEvents(page, '#dt', ['update:selected']);

  await page.locator('#dt tbody [data-select]').first().check();

  const events = await readEvents(page, '#dt');
  expect(events[0].detail.selected).toEqual([{ name: 'Alpha', city: 'Rome' }]);
});

test('w-data-table-virtual item-key is an alias of item-value', async ({ mount, page }) => {
  await mount(virtual('show-select item-key="name"'));
  await recordEvents(page, '#dt', ['update:selected']);

  await page.locator('#dt tbody [data-select]').first().check();

  const events = await readEvents(page, '#dt');
  expect(events[0].detail.selected).toEqual(['Alpha']);
});

test('w-data-table-virtual expand-icon and collapse-icon drive the toggle glyph', async ({ mount, page }) => {
  await mount(virtual('show-expand item-value="name" expand-icon="+" collapse-icon="-"'));

  const toggle = page.locator('#dt tbody [data-expand]').first();
  await expect(toggle).toHaveText('+');
  await toggle.click();
  await expect(page.locator('#dt tbody [data-expand]').first()).toHaveText('-');
  await expect(page.locator('#dt .w-data-table-expanded')).toHaveCount(1);
});

test('w-data-table-virtual expand-strategy single collapses the previous row', async ({ mount, page }) => {
  await mount(virtual('show-expand item-value="name" expand-strategy="single"'));

  await page.locator('#dt tbody [data-expand]').nth(0).click();
  await page.locator('#dt tbody [data-expand]').nth(1).click();

  await expect(page.locator('#dt .w-data-table-expanded')).toHaveCount(1);
  await expect(page.locator('#dt')).toHaveAttribute('expanded', 'Rome');
});

test('w-data-table-virtual expand-on-click expands from the row itself', async ({ mount, page }) => {
  await mount(virtual('show-expand item-value="name" expand-on-click'));

  await page.locator('#dt tbody tr[data-row]').first().locator('td').last().click();
  await expect(page.locator('#dt .w-data-table-expanded')).toHaveCount(1);
});

test('w-data-table-virtual expand-transition animates the detail row', async ({ mount, page }) => {
  await mount(`${virtual('show-expand item-value="name" expanded="Alpha" expand-transition')}
    <w-data-table-virtual id="plain" headers="${CITY_HEADERS}" items="${CITIES}" show-expand item-value="name" expanded="Alpha" expand-transition="false"></w-data-table-virtual>`);

  await expect(page.locator('#dt .w-data-table-expanded')).toHaveClass(/w-data-table-expanded--transition/);
  await expect(page.locator('#plain .w-data-table-expanded')).not.toHaveClass(/w-data-table-expanded--transition/);
});

test('w-data-table-virtual group-by buckets rows under collapsible headers', async ({ mount, page }) => {
  const items = records([
    { name: 'Alpha', city: 'Rome' },
    { name: 'Beta', city: 'Rome' },
    { name: 'Gamma', city: 'Oslo' },
  ]);
  await mount(`<w-data-table-virtual id="dt" headers="${CITY_HEADERS}" items="${items}" item-value="name" group-by="city" open-all height="300px" item-height="40"></w-data-table-virtual>`);

  await expect(page.locator('#dt tbody tr.w-data-table-group')).toHaveCount(2);
  await expect(page.locator('#dt tbody tr[data-row]')).toHaveCount(3);
  await expect(page.locator('#dt [data-group="Rome"]')).toContainText('(2)');

  await page.locator('#dt [data-group="Rome"]').click();
  await expect(page.locator('#dt tbody tr[data-row]')).toHaveCount(1);
});

test('w-data-table-virtual groups stay closed without open-all and honour opened', async ({ mount, page }) => {
  const items = records([
    { name: 'Alpha', city: 'Rome' },
    { name: 'Gamma', city: 'Oslo' },
  ]);
  await mount(`<w-data-table-virtual id="dt" headers="${CITY_HEADERS}" items="${items}" group-by="city"></w-data-table-virtual>
    <w-data-table-virtual id="open" headers="${CITY_HEADERS}" items="${items}" group-by="city" opened="Rome"></w-data-table-virtual>`);

  await expect(page.locator('#dt tbody tr[data-row]')).toHaveCount(0);
  await expect(page.locator('#open tbody tr[data-row]')).toHaveCount(1);
});

test('w-data-table-virtual group icons reflect the open state', async ({ mount, page }) => {
  const items = records([{ name: 'Alpha', city: 'Rome' }]);
  await mount(`<w-data-table-virtual id="dt" headers="${CITY_HEADERS}" items="${items}" group-by="city" group-expand-icon=">" group-collapse-icon="v"></w-data-table-virtual>`);

  await expect(page.locator('#dt [data-group] span').first()).toHaveText('>');
  await page.locator('#dt [data-group]').click();
  await expect(page.locator('#dt [data-group] span').first()).toHaveText('v');
});

test('w-data-table-virtual group-by accepts Vuetify sort descriptors', async ({ mount, page }) => {
  const items = records([{ name: 'Alpha', city: 'Rome' }]);
  const groupBy = JSON.stringify([{ key: 'city', order: 'asc' }]).replace(/"/g, '&quot;');
  await mount(`<w-data-table-virtual id="dt" headers="${CITY_HEADERS}" items="${items}" group-by="${groupBy}" open-all></w-data-table-virtual>`);

  await expect(page.locator('#dt tbody tr.w-data-table-group')).toHaveCount(1);
  await expect(page.locator('#dt [data-group]')).toContainText('Rome');
});

test('w-data-table-virtual fixed-footer sticks a footer slot to the scroll area', async ({ mount, page }) => {
  await mount(`<w-data-table-virtual id="dt" headers="${CITY_HEADERS}" items="${CITIES}" fixed-footer height="300px" item-height="40"><span slot="footer">3 rows</span></w-data-table-virtual>`);

  await expect(page.locator('#dt [data-virtual-scroll]')).toHaveClass(/w-table-wrap--fixed-footer/);
  await expect(page.locator('#dt tfoot')).toContainText('3 rows');
  const position = await page.locator('#dt tfoot td').evaluate((el) => getComputedStyle(el).position);
  expect(position).toBe('sticky');
});
