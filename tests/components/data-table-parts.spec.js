import { expect, readEvents, recordEvents, test } from '../setup/component-test.js';

/* Vuetify parity for the data table subcomponents:
   <w-data-table-footer>, <w-data-table-headers>, <w-data-table-rows>,
   <w-data-table-row>. */

const HEADERS = '[Name,City]';
const ITEMS = '[Alpha|Rome; Beta|Oslo; Gamma|Rome]';

/* ── <w-data-table-footer> ───────────────────────────────────────────────── */

test('w-data-table-footer reports the page range and paginates', async ({ mount, page }) => {
  await mount('<w-data-table-footer id="ft" items-length="95" items-per-page="10" page="1"></w-data-table-footer>');
  await recordEvents(page, '#ft', ['update:options']);

  await expect(page.locator('#ft .w-data-table-range')).toHaveText('1-10 of 95');
  await page.locator('#ft [data-page-action="next"]').click();

  await expect(page.locator('#ft .w-data-table-range')).toHaveText('11-20 of 95');
  expect(await readEvents(page, '#ft')).toEqual([
    { type: 'update:options', detail: { page: 2, itemsPerPage: 10 } },
  ]);
});

test('w-data-table-footer page-text and items-per-page-text are configurable', async ({ mount, page }) => {
  await mount(`<w-data-table-footer id="ft" items-length="30" items-per-page="10"
    page-text="{0} to {1} out of {2}" items-per-page-text="Rows shown"></w-data-table-footer>`);

  await expect(page.locator('#ft .w-data-table-range')).toHaveText('1 to 10 out of 30');
  await expect(page.locator('#ft .w-data-table-per-page')).toContainText('Rows shown');
});

test('w-data-table-footer show-first-last-page adds the edge buttons', async ({ mount, page }) => {
  await mount(`<w-data-table-footer id="none" items-length="30"></w-data-table-footer>
    <w-data-table-footer id="both" items-length="30" show-first-last-page></w-data-table-footer>
    <w-data-table-footer id="first" items-length="30" show-first-last-page="only-first"></w-data-table-footer>`);

  await expect(page.locator('#none [data-page-action]')).toHaveCount(2);
  await expect(page.locator('#both [data-page-action]')).toHaveCount(4);
  await expect(page.locator('#first [data-page-action]')).toHaveCount(3);
  await expect(page.locator('#first [data-page-action="first"]')).toHaveCount(1);
  await expect(page.locator('#first [data-page-action="last"]')).toHaveCount(0);
});

test('w-data-table-footer show-current-page prints the page number', async ({ mount, page }) => {
  await mount('<w-data-table-footer id="ft" items-length="30" items-per-page="10" page="2" show-current-page></w-data-table-footer>');

  await expect(page.locator('#ft .w-data-table-page')).toHaveText('2');
  await expect(page.locator('#ft .w-data-table-page')).toHaveAttribute('aria-current', 'page');
});

test('w-data-table-footer takes custom nav icons and labels', async ({ mount, page }) => {
  await mount(`<w-data-table-footer id="ft" items-length="30" show-first-last-page
    first-icon="A" prev-icon="B" next-icon="C" last-icon="D"
    first-page-label="Start" prev-page-label="Back" next-page-label="Forward" last-page-label="End"></w-data-table-footer>`);

  await expect(page.locator('#ft [data-page-action="first"]')).toHaveText('A');
  await expect(page.locator('#ft [data-page-action="last"]')).toHaveText('D');
  await expect(page.locator('#ft [data-page-action="prev"]')).toHaveAttribute('aria-label', 'Back');
  await expect(page.locator('#ft [data-page-action="next"]')).toHaveAttribute('aria-label', 'Forward');
});

test('w-data-table-footer items-per-page-options accepts titled entries', async ({ mount, page }) => {
  const options = JSON.stringify([{ title: 'Five', value: 5 }, { title: 'Ten', value: 10 }]).replace(/"/g, '&quot;');
  await mount(`<w-data-table-footer id="titled" items-length="30" items-per-page="5" items-per-page-options="${options}"></w-data-table-footer>
    <w-data-table-footer id="plain" items-length="30" items-per-page-options="5,10"></w-data-table-footer>`);

  await expect(page.locator('#titled option')).toHaveText(['Five', 'Ten']);
  await expect(page.locator('#plain option')).toHaveText(['5', '10']);
});

test('w-data-table-footer resets to page one when the page size changes', async ({ mount, page }) => {
  await mount('<w-data-table-footer id="ft" items-length="95" items-per-page="10" page="4" items-per-page-options="10,25"></w-data-table-footer>');
  await recordEvents(page, '#ft', ['update:options']);

  await page.locator('#ft [data-per-page]').selectOption('25');

  await expect(page.locator('#ft .w-data-table-range')).toHaveText('1-25 of 95');
  expect(await readEvents(page, '#ft')).toEqual([
    { type: 'update:options', detail: { page: 1, itemsPerPage: 25 } },
  ]);
});

/* ── <w-data-table-headers> ──────────────────────────────────────────────── */

test('w-data-table-headers marks the sorted column with aria-sort', async ({ mount, page }) => {
  await mount(`<w-data-table-headers id="hd" headers="${HEADERS}"></w-data-table-headers>`);

  await expect(page.locator('#hd [role="columnheader"]').first()).toHaveAttribute('aria-sort', 'none');
  await page.locator('#hd [data-sort="Name"]').click();
  await expect(page.locator('#hd [role="columnheader"]').first()).toHaveAttribute('aria-sort', 'ascending');
  await page.locator('#hd [data-sort="Name"]').click();
  await expect(page.locator('#hd [role="columnheader"]').first()).toHaveAttribute('aria-sort', 'descending');
});

test('w-data-table-headers multi-sort keeps earlier columns sorted', async ({ mount, page }) => {
  await mount(`<w-data-table-headers id="multi" headers="${HEADERS}" multi-sort></w-data-table-headers>
    <w-data-table-headers id="single" headers="${HEADERS}"></w-data-table-headers>`);

  await page.locator('#multi [data-sort="Name"]').click();
  await page.locator('#multi [data-sort="City"]').click();
  await expect(page.locator('#multi [role="columnheader"]').first()).toHaveAttribute('aria-sort', 'ascending');
  await expect(page.locator('#multi [role="columnheader"]').nth(1)).toHaveAttribute('aria-sort', 'ascending');

  await page.locator('#single [data-sort="Name"]').click();
  await page.locator('#single [data-sort="City"]').click();
  await expect(page.locator('#single [role="columnheader"]').first()).toHaveAttribute('aria-sort', 'none');
});

test('w-data-table-headers initial-sort-order starts descending', async ({ mount, page }) => {
  await mount(`<w-data-table-headers id="hd" headers="${HEADERS}" initial-sort-order="desc"></w-data-table-headers>`);
  await recordEvents(page, '#hd', ['change']);

  await page.locator('#hd [data-sort="Name"]').click();

  await expect(page.locator('#hd [role="columnheader"]').first()).toHaveAttribute('aria-sort', 'descending');
  const events = await readEvents(page, '#hd');
  expect(events[0].detail.sortBy).toBe('Name');
  expect(events[0].detail.sortDesc).toBe(true);
});

test('w-data-table-headers disable-sort renders plain labels', async ({ mount, page }) => {
  await mount(`<w-data-table-headers id="hd" headers="${HEADERS}" disable-sort></w-data-table-headers>`);

  await expect(page.locator('#hd button')).toHaveCount(0);
  await expect(page.locator('#hd [role="columnheader"]')).toHaveText(['Name', 'City']);
});

test('w-data-table-headers renders the configured sort glyphs', async ({ mount, page }) => {
  await mount(`<w-data-table-headers id="hd" headers="${HEADERS}" sort-icon="~" sort-asc-icon="^" sort-desc-icon="v"></w-data-table-headers>`);

  await expect(page.locator('#hd .w-table-sort-icon').first()).toHaveText('~');
  await page.locator('#hd [data-sort="Name"]').click();
  await expect(page.locator('#hd .w-table-sort-icon').first()).toHaveText('^');
  await page.locator('#hd [data-sort="Name"]').click();
  await expect(page.locator('#hd .w-table-sort-icon').first()).toHaveText('v');
});

test('w-data-table-headers sticks with fixed-header or the sticky alias', async ({ mount, page }) => {
  await mount(`<w-data-table-headers id="fixed" headers="${HEADERS}" fixed-header></w-data-table-headers>
    <w-data-table-headers id="sticky" headers="${HEADERS}" sticky></w-data-table-headers>
    <w-data-table-headers id="static" headers="${HEADERS}"></w-data-table-headers>`);

  await expect(page.locator('#fixed .w-table-header')).toHaveClass(/w-table-header--sticky/);
  await expect(page.locator('#sticky .w-table-header')).toHaveClass(/w-table-header--sticky/);
  await expect(page.locator('#static .w-table-header')).not.toHaveClass(/w-table-header--sticky/);
  const position = await page.locator('#fixed .w-table-header').evaluate((el) => getComputedStyle(el).position);
  expect(position).toBe('sticky');
});

test('w-data-table-headers select-all-label names the select-all box', async ({ mount, page }) => {
  await mount(`<w-data-table-headers id="hd" headers="${HEADERS}" show-select select-all-label="Select everything"></w-data-table-headers>`);
  await recordEvents(page, '#hd', ['update:selected']);

  await expect(page.locator('#hd [data-select-all]')).toHaveAttribute('aria-label', 'Select everything');
  await page.locator('#hd [data-select-all]').check();
  expect(await readEvents(page, '#hd')).toEqual([
    { type: 'update:selected', detail: { selected: true } },
  ]);
});

test('w-data-table-headers hides itself in mobile mode', async ({ mount, page }) => {
  await page.setViewportSize({ width: 500, height: 700 });
  await mount(`<w-data-table-headers id="hd" headers="${HEADERS}" mobile></w-data-table-headers>
    <w-data-table-headers id="bp" headers="${HEADERS}" mobile-breakpoint="sm"></w-data-table-headers>
    <w-data-table-headers id="wide" headers="${HEADERS}" mobile-breakpoint="400"></w-data-table-headers>`);

  await expect(page.locator('#hd .w-table-header')).toBeHidden();
  await expect(page.locator('#bp .w-table-header')).toBeHidden();
  await expect(page.locator('#wide .w-table-header')).toBeVisible();
});

/* ── <w-data-table-rows> ─────────────────────────────────────────────────── */

test('w-data-table-rows shows the empty and loading messages', async ({ mount, page }) => {
  await mount(`<w-data-table-rows id="empty" headers="${HEADERS}" items="[]" no-data-text="Nothing here"></w-data-table-rows>
    <w-data-table-rows id="busy" headers="${HEADERS}" items="[]" loading loading-text="Fetching…"></w-data-table-rows>
    <w-data-table-rows id="quiet" headers="${HEADERS}" items="[]" hide-no-data></w-data-table-rows>`);

  await expect(page.locator('#empty .w-table-message')).toHaveText('Nothing here');
  await expect(page.locator('#busy .w-table-message')).toHaveText('Fetching…');
  await expect(page.locator('#quiet .w-table-message')).toHaveCount(0);
});

test('w-data-table-rows group-by collapses rows under a header', async ({ mount, page }) => {
  await mount(`<w-data-table-rows id="rows" headers="${HEADERS}" items="${ITEMS}" group-by="City"></w-data-table-rows>`);

  await expect(page.locator('#rows .w-data-table-group-header-row')).toHaveCount(2);
  await expect(page.locator('#rows .w-data-table-group-count').first()).toHaveText('(2)');
  await expect(page.locator('#rows w-data-table-row')).toHaveCount(3);

  await page.locator('#rows [data-group="Rome"]').click();
  await expect(page.locator('#rows [data-group-body="Rome"]')).toBeHidden();
  await expect(page.locator('#rows [data-group="Rome"]')).toHaveAttribute('aria-expanded', 'false');
});

test('w-data-table-rows group icons and expand-transition are configurable', async ({ mount, page }) => {
  await mount(`<w-data-table-rows id="rows" headers="${HEADERS}" items="${ITEMS}" group-by="City" group-collapse-icon="v" group-expand-icon=">"></w-data-table-rows>
    <w-data-table-rows id="plain" headers="${HEADERS}" items="${ITEMS}" group-by="City" expand-transition="false"></w-data-table-rows>`);

  await expect(page.locator('#rows [data-group="Rome"] span').first()).toHaveText('v');
  await page.locator('#rows [data-group="Rome"]').click();
  await expect(page.locator('#rows [data-group="Rome"] span').first()).toHaveText('>');

  await expect(page.locator('#rows [data-group-body="Rome"]')).toHaveClass(/w-data-table-group-body--transition/);
  await expect(page.locator('#plain [data-group-body="Rome"]')).not.toHaveClass(/w-data-table-group-body--transition/);
});

test('w-data-table-rows forwards presentation attributes to each row', async ({ mount, page }) => {
  await mount(`<w-data-table-rows id="rows" headers="${HEADERS}" items="${ITEMS}"
    mobile show-expand show-select expand-icon="+" collapse-icon="-"></w-data-table-rows>`);

  await expect(page.locator('#rows w-data-table-row').first()).toHaveAttribute('mobile', '');
  await expect(page.locator('#rows w-data-table-row').first()).toHaveAttribute('index', '0');
  await expect(page.locator('#rows [data-expand]').first()).toHaveText('+');
  await expect(page.locator('#rows [data-select]')).toHaveCount(3);
  await expect(page.locator('#rows w-data-table-row').first().locator('[role="cell"]').first())
    .toHaveAttribute('data-label', 'Name');
});

/* ── <w-data-table-row> ──────────────────────────────────────────────────── */

test('w-data-table-row index drives aria-rowindex', async ({ mount, page }) => {
  await mount(`<w-data-table-row id="row" headers="${HEADERS}" item="Alpha|Rome" index="3"></w-data-table-row>
    <w-data-table-row id="plain" headers="${HEADERS}" item="Alpha|Rome"></w-data-table-row>`);

  await expect(page.locator('#row w-row')).toHaveAttribute('aria-rowindex', '4');
  await expect(page.locator('#row w-row')).toHaveAttribute('data-index', '3');
  await expect(page.locator('#plain w-row')).not.toHaveAttribute('aria-rowindex', /.*/);
});

test('w-data-table-row select-row-label names the row checkbox', async ({ mount, page }) => {
  await mount(`<w-data-table-row id="row" headers="${HEADERS}" item="Alpha|Rome" index="2" show-select select-row-label="Pick Alpha"></w-data-table-row>`);
  await recordEvents(page, '#row', ['update:selected']);

  await expect(page.locator('#row [data-select]')).toHaveAttribute('aria-label', 'Pick Alpha');
  await page.locator('#row [data-select]').check();

  await expect(page.locator('#row w-row')).toHaveClass(/selected/);
  expect(await readEvents(page, '#row')).toEqual([
    { type: 'update:selected', detail: { index: 2, selected: true } },
  ]);
});

test('w-data-table-row expand toggle swaps its icon', async ({ mount, page }) => {
  await mount(`<w-data-table-row id="row" headers="${HEADERS}" item="Alpha|Rome" index="0" show-expand expand-icon="+" collapse-icon="-"></w-data-table-row>`);
  await recordEvents(page, '#row', ['update:expanded']);

  await expect(page.locator('#row [data-expand]')).toHaveText('+');
  await page.locator('#row [data-expand]').click();

  await expect(page.locator('#row [data-expand]')).toHaveText('-');
  await expect(page.locator('#row [data-expand]')).toHaveAttribute('aria-expanded', 'true');
  expect(await readEvents(page, '#row')).toEqual([
    { type: 'update:expanded', detail: { index: 0, expanded: true } },
  ]);
});

test('w-data-table-row mobile labels each cell with its column', async ({ mount, page }) => {
  await page.setViewportSize({ width: 500, height: 700 });
  await mount(`<w-data-table-row id="row" headers="${HEADERS}" item="Alpha|Rome" mobile></w-data-table-row>
    <w-data-table-row id="bp" headers="${HEADERS}" item="Alpha|Rome" mobile-breakpoint="sm"></w-data-table-row>
    <w-data-table-row id="wide" headers="${HEADERS}" item="Alpha|Rome" mobile-breakpoint="400"></w-data-table-row>`);

  await expect(page.locator('#row w-row')).toHaveClass(/w-data-table-row--mobile/);
  await expect(page.locator('#row [role="cell"]').first()).toHaveAttribute('data-label', 'Name');
  await expect(page.locator('#bp w-row')).toHaveClass(/w-data-table-row--mobile/);
  await expect(page.locator('#wide w-row')).not.toHaveClass(/w-data-table-row--mobile/);
  await expect(page.locator('#row [role="cell"]')).toHaveText(['Alpha', 'Rome']);
});
