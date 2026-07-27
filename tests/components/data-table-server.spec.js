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

/* ── Vuetify parity attributes (inherited from <w-data-table>) ───────────── */

const ROWS = 'items="[Alpha|red; Beta|blue; Gamma|red]" headers="[Name,Color]" items-length="30" items-per-page="3"';

test('w-data-table-server honors the presentation attributes', async ({ mount, page }) => {
  await mount(`<w-data-table-server id="dt" ${ROWS} sticky gridlines="all" fixed-footer height="140px"></w-data-table-server>
    <w-data-table-server id="m" ${ROWS} mobile></w-data-table-server>`);

  await expect(page.locator('#dt .w-table-wrap')).toHaveClass(/w-table-wrap--fixed-header/);
  await expect(page.locator('#dt table')).toHaveClass(/w-table--gridlines-all/);
  await expect(page.locator('#dt .w-data-table-footer')).toHaveCSS('position', 'sticky');
  await expect(page.locator('#m table')).toHaveClass(/w-table--responsive-stack/);
  await expect(page.locator('#m tbody td').first()).toHaveAttribute('data-label', 'Name');
});

test('w-data-table-server mobile-breakpoint reacts to the viewport', async ({ mount, page }) => {
  await page.setViewportSize({ width: 420, height: 720 });
  await mount(`<w-data-table-server id="dt" ${ROWS} mobile-breakpoint="md"></w-data-table-server>`);
  await expect(page.locator('#dt table')).toHaveClass(/w-table--responsive-stack/);

  await page.setViewportSize({ width: 1200, height: 720 });
  await expect(page.locator('#dt table')).not.toHaveClass(/w-table--responsive-stack/);
});

test('w-data-table-server sorting attributes drive the header state', async ({ mount, page }) => {
  await mount(`<w-data-table-server id="off" ${ROWS} disable-sort></w-data-table-server>
    <w-data-table-server id="dt" ${ROWS} must-sort initial-sort-order="desc" sort-icon="~" sort-asc-icon="U" sort-desc-icon="D"></w-data-table-server>`);

  await expect(page.locator('#off thead button')).toHaveCount(0);
  const header = page.locator('#dt thead th').first();
  await expect(header.locator('.w-table-sort-icon')).toHaveText('~');

  await header.locator('button').click();
  await expect(header).toHaveAttribute('aria-sort', 'descending');
  await expect(header.locator('.w-table-sort-icon')).toHaveText('D');
  await header.locator('button').click();
  await expect(header).toHaveAttribute('aria-sort', 'ascending');
  await expect(header.locator('.w-table-sort-icon')).toHaveText('U');
  await header.locator('button').click();
  await expect(header).toHaveAttribute('aria-sort', 'descending'); // must-sort: never cleared
});

test('w-data-table-server selection attributes label and return objects', async ({ mount, page }) => {
  const headers = JSON.stringify([{ title: 'Name', key: 'name' }]).replace(/"/g, '&quot;');
  const items = JSON.stringify([{ name: 'A' }, { name: 'B' }]).replace(/"/g, '&quot;');
  await mount(`<w-data-table-server id="dt" headers="${headers}" items="${items}" items-length="9" item-value="name" show-select return-object select-all-label="Select the page"></w-data-table-server>`);
  await recordEvents(page, '#dt', ['update:selected']);

  await expect(page.locator('#dt [data-select-all]')).toHaveAttribute('aria-label', 'Select the page');
  await page.locator('#dt tbody [data-select="A"]').check();
  expect((await readEvents(page, '#dt')).pop()).toEqual({ type: 'update:selected', detail: { selected: [{ name: 'A' }] } });
});

test('w-data-table-server expansion attributes toggle detail rows', async ({ mount, page }) => {
  await mount(`<w-data-table-server id="dt" ${ROWS} item-value="Name" show-expand expand-strategy="single" expand-icon="+" collapse-icon="-" expand-transition></w-data-table-server>
    <w-data-table-server id="click" ${ROWS} item-value="Name" expand-on-click></w-data-table-server>`);

  await expect(page.locator('#dt [data-expand]').first()).toHaveText('+');
  await page.locator('#dt [data-expand="Alpha"]').click();
  await expect(page.locator('#dt [data-expand="Alpha"]')).toHaveText('-');
  await expect(page.locator('#dt .w-data-table-expanded')).toHaveClass(/w-data-table-expanded--transition/);
  await page.locator('#dt [data-expand="Beta"]').click();
  await expect(page.locator('#dt .w-data-table-expanded')).toHaveCount(1);
  await expect(page.locator('#dt .w-data-table-expanded')).toContainText('blue');

  await page.locator('#click tbody tr').first().locator('td').first().click();
  await expect(page.locator('#click .w-data-table-expanded')).toHaveCount(1);
});

test('w-data-table-server groups the returned page and announces group options', async ({ mount, page }) => {
  await mount(`<w-data-table-server id="dt" ${ROWS} group-by="Color" group-expand-icon="+" group-collapse-icon="-" page-by="auto"></w-data-table-server>
    <w-data-table-server id="all" ${ROWS} group-by="Color" open-all></w-data-table-server>
    <w-data-table-server id="one" ${ROWS} group-by="Color" opened="blue"></w-data-table-server>`);
  await recordEvents(page, '#dt', ['update:options']);

  await expect(page.locator('#dt tbody tr')).toHaveCount(2); // both groups closed
  await expect(page.locator('#dt [data-group="blue"] .w-data-table-group-icon')).toHaveText('+');
  await page.locator('#dt [data-group="blue"]').click();
  await expect(page.locator('#dt [data-group="blue"] .w-data-table-group-icon')).toHaveText('-');
  await expect(page.locator('#dt tbody tr')).toHaveCount(3);

  await expect(page.locator('#all tbody tr')).toHaveCount(5);
  await expect(page.locator('#one tbody tr')).toHaveCount(3);

  await page.locator('#dt [data-page-action="next"]').click();
  expect((await readEvents(page, '#dt')).pop().detail).toMatchObject({
    page: 2, pageBy: 'auto', groupBy: [{ key: 'Color', order: 'asc' }],
  });
});

test('w-data-table-server can hide its default regions', async ({ mount, page }) => {
  await mount(`<w-data-table-server id="nh" ${ROWS} hide-default-header></w-data-table-server>
    <w-data-table-server id="nb" ${ROWS} hide-default-body></w-data-table-server>
    <w-data-table-server id="nf" ${ROWS} hide-default-footer></w-data-table-server>
    <w-data-table-server id="quiet" headers="[Name,Color]" items="[]" items-length="0" hide-no-data></w-data-table-server>`);

  await expect(page.locator('#nh thead')).toHaveCount(0);
  await expect(page.locator('#nb tbody tr')).toHaveCount(0);
  await expect(page.locator('#nf .w-data-table-footer')).toHaveCount(0);
  await expect(page.locator('#quiet .w-table-message')).toHaveCount(0);
});

test('w-data-table-server footer text, icons, labels and page controls', async ({ mount, page }) => {
  await mount(`<w-data-table-server id="dt" ${ROWS} show-current-page
    items-per-page-text="Per page" page-text="{0} to {1} of {2}"
    first-icon="F" prev-icon="P" next-icon="N" last-icon="L"
    first-page-label="Start" prev-page-label="Back" next-page-label="Forward" last-page-label="End"></w-data-table-server>
    <w-data-table-server id="off" ${ROWS} show-first-last-page="false"></w-data-table-server>
    <w-data-table-server id="only" ${ROWS} show-first-last-page="only-first"></w-data-table-server>`);

  await expect(page.locator('#dt .w-data-table-per-page')).toContainText('Per page');
  await expect(page.locator('#dt .w-data-table-range')).toHaveText('1 to 3 of 30');
  await expect(page.locator('#dt .w-data-table-page')).toHaveText('1 / 10');
  await expect(page.locator('#dt [data-page-action="first"]')).toHaveText('F');
  await expect(page.locator('#dt [data-page-action="prev"]')).toHaveText('P');
  await expect(page.locator('#dt [data-page-action="next"]')).toHaveText('N');
  await expect(page.locator('#dt [data-page-action="last"]')).toHaveText('L');
  await expect(page.locator('#dt [data-page-action="next"]')).toHaveAttribute('aria-label', 'Forward');
  await expect(page.locator('#dt [data-page-action="last"]')).toHaveAttribute('aria-label', 'End');
  await expect(page.locator('#off [data-page-action="first"]')).toHaveCount(0);
  await expect(page.locator('#only [data-page-action="first"]')).toHaveCount(1);
  await expect(page.locator('#only [data-page-action="last"]')).toHaveCount(0);
});
