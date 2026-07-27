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

test('w-data-table-row reads pipe, bracketed, and JSON array item values', async ({ mount, page }) => {
  await mount(`
    <w-data-table-row id="pipes" headers="[Dessert,Calories,Fat]" item="Frozen yogurt|159|6"></w-data-table-row>
    <w-data-table-row id="brackets" headers="[Dessert,Calories,Fat]" item="[Ice cream,237,9]"></w-data-table-row>
    <w-data-table-row id="jsonlist" headers="[Dessert,Calories,Fat]" item='["Eclair","262","16"]'></w-data-table-row>
  `);

  await expect(page.locator('#pipes [role="cell"]')).toHaveText(['Frozen yogurt', '159', '6']);
  await expect(page.locator('#brackets [role="cell"]')).toHaveText(['Ice cream', '237', '9']);
  await expect(page.locator('#jsonlist [role="cell"]')).toHaveText(['Eclair', '262', '16']);
});

test('w-data-table-row reads JSON object items by header key', async ({ mount, page }) => {
  const record = JSON.stringify({ Dessert: 'Cupcake', Calories: '305', Fat: '3' }).replace(/"/g, '&quot;');
  await mount(`<w-data-table-row id="record" headers="[Dessert,Calories,Fat]" item="${record}" active></w-data-table-row>`);

  await expect(page.locator('#record [role="cell"]')).toHaveText(['Cupcake', '305', '3']);
  await expect(page.locator('#record w-row')).toHaveClass(/selected/);
});

test('w-data-table-row degrades to blank cells for missing or malformed items', async ({ mount, page }) => {
  await mount(`
    <w-data-table-row id="none" headers="[Dessert,Calories]"></w-data-table-row>
    <w-data-table-row id="openlist" headers="[Dessert,Calories]" item="[oops"></w-data-table-row>
    <w-data-table-row id="openobj" headers="[Dessert,Calories]" item="{oops"></w-data-table-row>
  `);

  await expect(page.locator('#none [role="cell"]')).toHaveText(['', '']);
  await expect(page.locator('#openlist [role="cell"]')).toHaveText(['', '']);
  await expect(page.locator('#openobj [role="cell"]')).toHaveText(['', '']);
});

test('w-data-table-row without headers just renders its slotted cells', async ({ mount, page }) => {
  await mount('<w-data-table-row id="slotted"><span class="custom">Manual cell</span></w-data-table-row>');
  await expect(page.locator('#slotted .custom')).toHaveText('Manual cell');
  await expect(page.locator('#slotted [role="cell"]')).toHaveCount(0);
});

/* ── Vuetify parity attributes ───────────────────────────────────────────── */

const GROUPED = 'headers="[Name,Color]" items="[Alpha|red; Beta|blue; Gamma|red]" items-per-page="10"';

test('w-data-table sticky is an alias of fixed-header', async ({ mount, page }) => {
  await mount(`<w-data-table id="dt" ${SIMPLE} sticky></w-data-table>`);
  await expect(page.locator('#dt .w-table-wrap')).toHaveClass(/w-table-wrap--fixed-header/);
});

test('w-data-table mobile stacks the rows and labels every cell', async ({ mount, page }) => {
  await mount(`<w-data-table id="dt" ${SIMPLE} mobile></w-data-table>`);
  await expect(page.locator('#dt table')).toHaveClass(/w-table--responsive-stack/);
  await expect(page.locator('#dt .w-table-wrap')).toHaveClass(/w-table-wrap--responsive-stack/);
  await expect(page.locator('#dt tbody td').first()).toHaveAttribute('data-label', 'Dessert');
  await expect(page.locator('#dt thead')).toBeHidden();
});

test('w-data-table mobile-breakpoint switches on viewport width', async ({ mount, page }) => {
  await page.setViewportSize({ width: 420, height: 720 });
  await mount(`<w-data-table id="narrow" ${SIMPLE} mobile-breakpoint="md"></w-data-table>
    <w-data-table id="never" ${SIMPLE} mobile-breakpoint="xs"></w-data-table>`);

  await expect(page.locator('#narrow table')).toHaveClass(/w-table--responsive-stack/);
  await expect(page.locator('#never table')).not.toHaveClass(/w-table--responsive-stack/);

  await page.setViewportSize({ width: 1200, height: 720 });
  await expect(page.locator('#narrow table')).not.toHaveClass(/w-table--responsive-stack/);
});

test('w-data-table gridlines selects the border style', async ({ mount, page }) => {
  await mount(`<w-data-table id="v" ${SIMPLE} gridlines="vertical"></w-data-table>
    <w-data-table id="all" ${SIMPLE} gridlines></w-data-table>
    <w-data-table id="off" ${SIMPLE} gridlines="false"></w-data-table>
    <w-data-table id="plain" ${SIMPLE}></w-data-table>`);

  await expect(page.locator('#v table')).toHaveClass(/w-table--gridlines-vertical/);
  await expect(page.locator('#all table')).toHaveClass(/w-table--gridlines-all/);
  await expect(page.locator('#off table')).toHaveClass(/w-table--gridlines-none/);
  await expect(page.locator('#plain table')).not.toHaveClass(/gridlines/);
  await expect(page.locator('#off tbody td').first()).toHaveCSS('border-bottom-width', '0px');
});

test('w-data-table fixed-footer sticks the footer to the bottom', async ({ mount, page }) => {
  await mount(`<w-data-table id="dt" ${SIMPLE} fixed-footer height="120px"></w-data-table>`);
  await expect(page.locator('#dt .w-data-table')).toHaveClass(/w-data-table--fixed-footer/);
  await expect(page.locator('#dt .w-data-table-footer')).toHaveCSS('position', 'sticky');
});

test('w-data-table no-filter ignores search', async ({ mount, page }) => {
  await mount(`<w-data-table id="dt" ${SIMPLE} items-per-page="10" search="cup" no-filter></w-data-table>`);
  await expect(page.locator('#dt tbody tr')).toHaveCount(5);
});

test('w-data-table filter-keys limits search to the listed columns', async ({ mount, page }) => {
  await mount(`<w-data-table id="hit" ${GROUPED} search="red" filter-keys="Color"></w-data-table>
    <w-data-table id="miss" ${GROUPED} search="alpha" filter-keys="Color" hide-no-data></w-data-table>`);

  await expect(page.locator('#hit tbody tr')).toHaveCount(2);
  await expect(page.locator('#miss tbody tr')).toHaveCount(0);
});

test('w-data-table filter-mode every requires all filter-keys to match', async ({ mount, page }) => {
  const data = 'headers="[Name,Color]" items="[redcar|red; bluecar|red]" items-per-page="10" search="red" filter-keys="Name,Color"';
  await mount(`<w-data-table id="some" ${data}></w-data-table>
    <w-data-table id="every" ${data} filter-mode="every"></w-data-table>
    <w-data-table id="inter" ${data} filter-mode="intersection"></w-data-table>`);

  await expect(page.locator('#some tbody tr')).toHaveCount(2);
  await expect(page.locator('#every tbody tr')).toHaveCount(1);
  await expect(page.locator('#every tbody td').first()).toHaveText('redcar');
  await expect(page.locator('#inter tbody tr')).toHaveCount(1);
});

test('w-data-table initial-sort-order desc sorts down on the first click', async ({ mount, page }) => {
  await mount(`<w-data-table id="dt" ${SIMPLE} items-per-page="2" initial-sort-order="desc"></w-data-table>`);
  await page.locator('#dt thead th').nth(1).locator('button').click();
  await expect(page.locator('#dt thead th').nth(1)).toHaveAttribute('aria-sort', 'descending');
  await expect(page.locator('#dt tbody tr').first().locator('td').first()).toHaveText('Gingerbread');
});

test('w-data-table must-sort never returns a column to unsorted', async ({ mount, page }) => {
  await mount(`<w-data-table id="dt" ${SIMPLE} items-per-page="2" must-sort></w-data-table>`);
  const header = page.locator('#dt thead th').nth(1);

  await header.locator('button').click();
  await expect(header).toHaveAttribute('aria-sort', 'ascending');
  await header.locator('button').click();
  await expect(header).toHaveAttribute('aria-sort', 'descending');
  await header.locator('button').click();
  await expect(header).toHaveAttribute('aria-sort', 'ascending');
});

test('w-data-table disable-sort removes the sort buttons', async ({ mount, page }) => {
  await mount(`<w-data-table id="dt" ${SIMPLE} disable-sort></w-data-table>`);
  await expect(page.locator('#dt thead button')).toHaveCount(0);
  await expect(page.locator('#dt thead th').first()).toHaveText('Dessert');
});

test('w-data-table sort icons are configurable', async ({ mount, page }) => {
  await mount(`<w-data-table id="dt" ${SIMPLE} sort-icon="~" sort-asc-icon="U" sort-desc-icon="D"></w-data-table>`);
  const icon = page.locator('#dt thead th').first().locator('.w-table-sort-icon');

  await expect(icon).toHaveText('~');
  await expect(icon).toHaveClass(/w-table-sort-icon--inactive/);
  await page.locator('#dt thead th').first().locator('button').click();
  await expect(page.locator('#dt thead th').first().locator('.w-table-sort-icon')).toHaveText('U');
  await page.locator('#dt thead th').first().locator('button').click();
  await expect(page.locator('#dt thead th').first().locator('.w-table-sort-icon')).toHaveText('D');
});

test('w-data-table select-all-label labels the header checkbox', async ({ mount, page }) => {
  await mount(`<w-data-table id="dt" ${SIMPLE} show-select select-all-label="Pick every dessert"></w-data-table>`);
  await expect(page.locator('#dt [data-select-all]')).toHaveAttribute('aria-label', 'Pick every dessert');
});

test('w-data-table return-object emits the row objects', async ({ mount, page }) => {
  const headers = JSON.stringify([{ title: 'Name', key: 'name' }]).replace(/"/g, '&quot;');
  const items = JSON.stringify([{ name: 'A' }, { name: 'B' }]).replace(/"/g, '&quot;');
  await mount(`<w-data-table id="dt" headers="${headers}" items="${items}" item-value="name" show-select return-object items-per-page="10"></w-data-table>`);
  await recordEvents(page, '#dt', ['update:selected']);

  await page.locator('#dt tbody [data-select="B"]').check();
  expect((await readEvents(page, '#dt')).pop()).toEqual({ type: 'update:selected', detail: { selected: [{ name: 'B' }] } });
});

test('w-data-table expand-on-click toggles the detail row by click and keyboard', async ({ mount, page }) => {
  await mount(`<w-data-table id="dt" ${SIMPLE} items-per-page="2" item-value="Dessert" expand-on-click></w-data-table>`);

  await page.locator('#dt tbody tr').first().locator('td').first().click();
  await expect(page.locator('#dt .w-data-table-expanded')).toHaveCount(1);
  await expect(page.locator('#dt .w-data-table-expanded')).toContainText('Calories: 159');
  await expect(page.locator('#dt tbody tr').first()).toHaveAttribute('aria-expanded', 'true');

  await page.locator('#dt tbody tr').first().focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#dt .w-data-table-expanded')).toHaveCount(0);
});

test('w-data-table expand-strategy single collapses the previous row', async ({ mount, page }) => {
  await mount(`<w-data-table id="dt" ${SIMPLE} items-per-page="3" item-value="Dessert" show-expand expand-strategy="single"></w-data-table>`);

  await page.locator('#dt [data-expand]').first().click();
  await expect(page.locator('#dt .w-data-table-expanded')).toContainText('159');
  await page.locator('#dt [data-expand]').nth(1).click();
  await expect(page.locator('#dt .w-data-table-expanded')).toHaveCount(1);
  await expect(page.locator('#dt .w-data-table-expanded')).toContainText('237');
});

test('w-data-table expand-icon and collapse-icon are configurable', async ({ mount, page }) => {
  await mount(`<w-data-table id="dt" ${SIMPLE} items-per-page="2" item-value="Dessert" show-expand expand-icon="+" collapse-icon="-"></w-data-table>`);

  await expect(page.locator('#dt [data-expand]').first()).toHaveText('+');
  await page.locator('#dt [data-expand]').first().click();
  await expect(page.locator('#dt [data-expand]').first()).toHaveText('-');
});

test('w-data-table expand-transition animates the detail row when enabled', async ({ mount, page }) => {
  await mount(`<w-data-table id="on" ${SIMPLE} items-per-page="1" item-value="Dessert" show-expand expand-transition></w-data-table>
    <w-data-table id="named" ${SIMPLE} items-per-page="1" item-value="Dessert" show-expand expand-transition="slide fade"></w-data-table>
    <w-data-table id="off" ${SIMPLE} items-per-page="1" item-value="Dessert" show-expand expand-transition="false"></w-data-table>`);

  await page.locator('#on [data-expand]').first().click();
  await page.locator('#named [data-expand]').first().click();
  await page.locator('#off [data-expand]').first().click();

  await expect(page.locator('#on .w-data-table-expanded')).toHaveClass(/w-data-table-expanded--transition/);
  await expect(page.locator('#named .w-data-table-expanded')).toHaveClass(/w-data-table-expanded--slide-fade/);
  await expect(page.locator('#off .w-data-table-expanded')).not.toHaveClass(/transition/);
});

test('w-data-table group-by renders collapsible group headers', async ({ mount, page }) => {
  await mount(`<w-data-table id="dt" ${GROUPED} group-by="Color"></w-data-table>`);

  await expect(page.locator('#dt tbody tr')).toHaveCount(2); // both groups closed
  await expect(page.locator('#dt [data-group]').first()).toContainText('blue');
  await expect(page.locator('#dt [data-group]').first()).toHaveAttribute('aria-expanded', 'false');

  await recordEvents(page, '#dt', ['update:opened']);
  await page.locator('#dt [data-group="red"]').click();
  await expect(page.locator('#dt tbody tr')).toHaveCount(4); // 2 headers + 2 red rows
  await expect(page.locator('#dt [data-group="red"]')).toHaveAttribute('aria-expanded', 'true');
  expect(await readEvents(page, '#dt')).toEqual([{ type: 'update:opened', detail: { opened: ['red'] } }]);
});

test('w-data-table open-all and opened control which groups start open', async ({ mount, page }) => {
  await mount(`<w-data-table id="all" ${GROUPED} group-by="Color" open-all></w-data-table>
    <w-data-table id="one" ${GROUPED} group-by="Color" opened="blue"></w-data-table>`);

  await expect(page.locator('#all tbody tr')).toHaveCount(5); // 2 headers + 3 rows
  await expect(page.locator('#one tbody tr')).toHaveCount(3); // 2 headers + 1 blue row
  await expect(page.locator('#one [data-group="blue"]')).toHaveAttribute('aria-expanded', 'true');
});

test('w-data-table group-by accepts JSON sort items and orders groups', async ({ mount, page }) => {
  const groupBy = JSON.stringify([{ key: 'Color', order: 'desc' }]).replace(/"/g, '&quot;');
  await mount(`<w-data-table id="dt" ${GROUPED} group-by="${groupBy}"></w-data-table>`);
  await expect(page.locator('#dt [data-group]').first()).toContainText('red');
});

test('w-data-table group expand icons are configurable', async ({ mount, page }) => {
  await mount(`<w-data-table id="dt" ${GROUPED} group-by="Color" group-expand-icon="+" group-collapse-icon="-"></w-data-table>`);

  await expect(page.locator('#dt [data-group="blue"] .w-data-table-group-icon')).toHaveText('+');
  await page.locator('#dt [data-group="blue"]').click();
  await expect(page.locator('#dt [data-group="blue"] .w-data-table-group-icon')).toHaveText('-');
});

test('w-data-table page-by auto paginates whole groups', async ({ mount, page }) => {
  await mount(`<w-data-table id="dt" headers="[Name,Color]" items="[Alpha|red; Beta|blue; Gamma|red]" group-by="Color" open-all page-by="auto" items-per-page="1"></w-data-table>`);

  await expect(page.locator('#dt .w-data-table-range')).toHaveText('1–1 of 2');
  await expect(page.locator('#dt [data-group]')).toHaveCount(1);
  await expect(page.locator('#dt [data-group]')).toContainText('blue');

  await page.locator('#dt [data-page-action="next"]').click();
  await expect(page.locator('#dt [data-group]')).toContainText('red');
  await expect(page.locator('#dt tbody tr')).toHaveCount(3); // header + 2 red rows
});

test('w-data-table page-by any counts group headers as units', async ({ mount, page }) => {
  await mount(`<w-data-table id="dt" headers="[Name,Color]" items="[Alpha|red; Beta|blue; Gamma|red]" group-by="Color" open-all page-by="any" items-per-page="2"></w-data-table>`);

  await expect(page.locator('#dt .w-data-table-range')).toHaveText('1–2 of 5');
  await expect(page.locator('#dt tbody tr')).toHaveCount(2); // blue header + Beta
  await expect(page.locator('#dt tbody tr').nth(1)).toContainText('Beta');
});

test('w-data-table hide-default-header, -body and -footer drop their regions', async ({ mount, page }) => {
  await mount(`<w-data-table id="nh" ${SIMPLE} hide-default-header></w-data-table>
    <w-data-table id="nb" ${SIMPLE} hide-default-body></w-data-table>
    <w-data-table id="nf" ${SIMPLE} hide-default-footer></w-data-table>`);

  await expect(page.locator('#nh thead')).toHaveCount(0);
  await expect(page.locator('#nh tbody tr')).toHaveCount(5);
  await expect(page.locator('#nb tbody tr')).toHaveCount(0);
  await expect(page.locator('#nb thead th')).toHaveCount(3);
  await expect(page.locator('#nf .w-data-table-footer')).toHaveCount(0);
});

test('w-data-table hide-no-data suppresses the empty message', async ({ mount, page }) => {
  await mount(`<w-data-table id="quiet" headers="[A,B]" items="[]" hide-no-data></w-data-table>
    <w-data-table id="loud" headers="[A,B]" items="[]"></w-data-table>`);

  await expect(page.locator('#quiet .w-table-message')).toHaveCount(0);
  await expect(page.locator('#loud .w-table-message')).toHaveCount(1);
});

test('w-data-table items-per-page-text and page-text are configurable', async ({ mount, page }) => {
  await mount(`<w-data-table id="dt" ${SIMPLE} items-per-page="2" items-per-page-text="Per page" page-text="{0} to {1} / {2} desserts"></w-data-table>`);

  await expect(page.locator('#dt .w-data-table-per-page')).toContainText('Per page');
  await expect(page.locator('#dt .w-data-table-range')).toHaveText('1 to 2 / 5 desserts');
});

test('w-data-table pagination icons and labels are configurable', async ({ mount, page }) => {
  await mount(`<w-data-table id="dt" ${SIMPLE} items-per-page="2"
    first-icon="F" prev-icon="P" next-icon="N" last-icon="L"
    first-page-label="Start" prev-page-label="Back" next-page-label="Forward" last-page-label="End"></w-data-table>`);

  await expect(page.locator('#dt [data-page-action="first"]')).toHaveText('F');
  await expect(page.locator('#dt [data-page-action="prev"]')).toHaveText('P');
  await expect(page.locator('#dt [data-page-action="next"]')).toHaveText('N');
  await expect(page.locator('#dt [data-page-action="last"]')).toHaveText('L');
  await expect(page.locator('#dt [data-page-action="first"]')).toHaveAttribute('aria-label', 'Start');
  await expect(page.locator('#dt [data-page-action="prev"]')).toHaveAttribute('aria-label', 'Back');
  await expect(page.locator('#dt [data-page-action="next"]')).toHaveAttribute('aria-label', 'Forward');
  await expect(page.locator('#dt [data-page-action="last"]')).toHaveAttribute('aria-label', 'End');
});

test('w-data-table show-current-page renders the page indicator', async ({ mount, page }) => {
  await mount(`<w-data-table id="dt" ${SIMPLE} items-per-page="2" show-current-page></w-data-table>`);

  await expect(page.locator('#dt .w-data-table-page')).toHaveText('1 / 3');
  await page.locator('#dt [data-page-action="next"]').click();
  await expect(page.locator('#dt .w-data-table-page')).toHaveText('2 / 3');
});

test('w-data-table show-first-last-page hides or limits the edge buttons', async ({ mount, page }) => {
  await mount(`<w-data-table id="off" ${SIMPLE} items-per-page="2" show-first-last-page="false"></w-data-table>
    <w-data-table id="first" ${SIMPLE} items-per-page="2" show-first-last-page="only-first"></w-data-table>`);

  await expect(page.locator('#off [data-page-action="first"]')).toHaveCount(0);
  await expect(page.locator('#off [data-page-action="last"]')).toHaveCount(0);
  await expect(page.locator('#off [data-page-action="next"]')).toHaveCount(1);
  await expect(page.locator('#first [data-page-action="first"]')).toHaveCount(1);
  await expect(page.locator('#first [data-page-action="last"]')).toHaveCount(0);
});

test('w-data-table multi-sort layers, flips, and drops sort columns', async ({ mount, page }) => {
  await mount(`<w-data-table id="dt" ${SIMPLE} multi-sort items-per-page="5"></w-data-table>`);
  const fat = page.locator('#dt thead th').nth(2);
  const calories = page.locator('#dt thead th').nth(1);
  const names = () => page.locator('#dt tbody tr td:first-child').allTextContents();

  await fat.locator('button').click();
  await expect(fat).toHaveAttribute('aria-sort', 'ascending');

  // A second column layers on top of the first rather than replacing it.
  await calories.locator('button').click();
  await expect(fat).toHaveAttribute('aria-sort', 'ascending');
  await expect(calories).toHaveAttribute('aria-sort', 'ascending');
  expect(await names()).toEqual(['Cupcake', 'Frozen yogurt', 'Ice cream', 'Eclair', 'Gingerbread']);

  // Clicking a layered column flips only that column.
  await fat.locator('button').click();
  await expect(fat).toHaveAttribute('aria-sort', 'descending');
  await expect(calories).toHaveAttribute('aria-sort', 'ascending');
  expect(await names()).toEqual(['Eclair', 'Gingerbread', 'Ice cream', 'Frozen yogurt', 'Cupcake']);

  // A third click drops it, leaving the other column sorted.
  await fat.locator('button').click();
  await expect(fat).toHaveAttribute('aria-sort', 'none');
  await expect(calories).toHaveAttribute('aria-sort', 'ascending');
  expect(await names()).toEqual(['Frozen yogurt', 'Ice cream', 'Eclair', 'Cupcake', 'Gingerbread']);
});

test('w-data-table must-sort keeps a multi-sort column instead of clearing it', async ({ mount, page }) => {
  await mount(`<w-data-table id="dt" ${SIMPLE} multi-sort must-sort items-per-page="5"></w-data-table>`);
  const fat = page.locator('#dt thead th').nth(2);

  await fat.locator('button').click();
  await expect(fat).toHaveAttribute('aria-sort', 'ascending');
  await fat.locator('button').click();
  await expect(fat).toHaveAttribute('aria-sort', 'descending');
  await fat.locator('button').click();
  await expect(fat).toHaveAttribute('aria-sort', 'ascending');
});
