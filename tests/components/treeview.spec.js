import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

const ITEMS = `items='[
  {"title":"Components","value":"components","children":[
    {"title":"Inputs","value":"inputs","children":[
      {"title":"Checkbox","value":"checkbox"},
      {"title":"Select","value":"select"}
    ]},
    {"title":"Tables","value":"tables"}
  ]}
]'`;

test('w-treeview renders nested items and toggles branches with the expand button', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" ${ITEMS}></w-treeview>`);
  await recordEvents(page, '#tree', ['change']);

  await expect(page.locator('#tree [role="tree"]')).toBeVisible();
  await expect(page.locator('#tree .w-treeview-node[data-value="components"]')).not.toHaveClass(/open/);

  await page.locator('#tree .w-treeview-node[data-value="components"] > .w-treeview-row .w-treeview-toggle').click();
  await expect(page.locator('#tree .w-treeview-node[data-value="components"]')).toHaveClass(/open/);
  await expect(page.locator('#tree')).toHaveAttribute('opened', '["components"]');
  expect(await readEvents(page, '#tree')).toEqual([
    { type: 'change', detail: { value: ['components'], name: 'opened' } },
  ]);
});

test('w-treeview open-all expands every branch', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" open-all ${ITEMS}></w-treeview>`);
  await expect(page.locator('#tree .w-treeview-node[data-value="components"]')).toHaveClass(/open/);
  await expect(page.locator('#tree .w-treeview-node[data-value="inputs"]')).toHaveClass(/open/);
  await expect(page.locator('#tree .w-treeview-label', { hasText: 'Checkbox' })).toBeVisible();
});

test('w-treeview activatable highlights a row and emits change', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" activatable open-all ${ITEMS}></w-treeview>`);
  await recordEvents(page, '#tree', ['change']);

  await page.locator('#tree .w-treeview-node[data-value="tables"] > .w-treeview-row .w-treeview-label').click();

  await expect(page.locator('#tree .w-treeview-node[data-value="tables"] > .w-treeview-row')).toHaveClass(/active/);
  await expect(page.locator('#tree')).toHaveAttribute('activated', '["tables"]');
  expect(await readEvents(page, '#tree')).toEqual([
    { type: 'change', detail: { value: 'tables', name: 'activated', id: 'tables' } },
  ]);
});

test('w-treeview selectable cascades to leaves with an indeterminate parent', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" selectable open-all ${ITEMS}></w-treeview>`);
  await recordEvents(page, '#tree', ['change']);

  // Selecting the Inputs branch selects its two leaves.
  await page.locator('#tree .w-treeview-node[data-value="inputs"] > .w-treeview-row .w-treeview-checkbox').click();
  await expect(page.locator('#tree')).toHaveAttribute('selected', '["checkbox","select"]');
  await expect(page.locator('#tree .w-treeview-node[data-value="inputs"] > .w-treeview-row .w-treeview-checkbox')).toHaveAttribute('aria-checked', 'true');
  // Root has an unselected sibling leaf (Tables) -> indeterminate.
  await expect(page.locator('#tree .w-treeview-node[data-value="components"] > .w-treeview-row .w-treeview-checkbox')).toHaveAttribute('aria-checked', 'mixed');

  expect(await readEvents(page, '#tree')).toEqual([
    { type: 'change', detail: { value: ['checkbox', 'select'], name: 'selected', id: 'inputs' } },
  ]);
});

test('w-treeview still accepts legacy A>B>C path syntax', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" open-all items="[Components>Inputs>Checkbox; Components>Display>Tables]"></w-treeview>`);
  await expect(page.locator('#tree .w-treeview-node[data-value="Components"]')).toHaveClass(/open/);
  await expect(page.locator('#tree .w-treeview-label', { hasText: 'Checkbox' })).toBeVisible();
  await expect(page.locator('#tree .w-treeview-label', { hasText: 'Tables' })).toBeVisible();
});

test('w-treeview moves focus between visible rows with the arrow keys', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" open-all ${ITEMS}></w-treeview>`);
  await page.locator('#tree .w-treeview-node[data-value="components"] > .w-treeview-row').focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#tree .w-treeview-node[data-value="inputs"] > .w-treeview-row')).toBeFocused();
});

const MIXED = `items='[
  {"title":"Fruit","value":"fruit","children":[
    {"title":"Apple","value":"apple"},
    {"title":"Banana","value":"banana","disabled":true}
  ]},
  {"title":"Solo","value":"solo"}
]'`;

const row = (value) => `#tree .w-treeview-node[data-value="${value}"] > .w-treeview-row`;

test('w-treeview Home and End jump to the first and last visible rows', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" open-all ${ITEMS}></w-treeview>`);
  await page.locator(row('components')).focus();

  await page.keyboard.press('End');
  await expect(page.locator(row('tables'))).toBeFocused();

  await page.keyboard.press('Home');
  await expect(page.locator(row('components'))).toBeFocused();
});

test('w-treeview clamps arrow navigation at the first and last rows', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" open-all ${ITEMS}></w-treeview>`);
  await page.locator(row('components')).focus();

  await page.keyboard.press('ArrowUp');
  await expect(page.locator(row('components'))).toBeFocused();

  await page.keyboard.press('End');
  await page.keyboard.press('ArrowDown');
  await expect(page.locator(row('tables'))).toBeFocused();

  await page.keyboard.press('ArrowUp');
  await expect(page.locator(row('select'))).toBeFocused();
});

test('w-treeview arrow keys start at the first row when focus is not on a row', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" open-all ${ITEMS}></w-treeview>`);
  await page.locator(`${row('inputs')} .w-treeview-toggle`).focus();

  await page.keyboard.press('ArrowDown');
  await expect(page.locator(row('components'))).toBeFocused();
});

test('w-treeview ArrowRight expands a branch and then steps into it', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" ${ITEMS}></w-treeview>`);
  await recordEvents(page, '#tree', ['change']);
  await page.locator(row('components')).focus();

  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#tree .w-treeview-node[data-value="components"]')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator(row('components'))).toBeFocused();

  await page.keyboard.press('ArrowRight');
  await expect(page.locator(row('inputs'))).toBeFocused();

  expect(await readEvents(page, '#tree')).toEqual([
    { type: 'change', detail: { value: ['components'], name: 'opened' } },
  ]);
});

test('w-treeview ArrowRight does nothing on a leaf row', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" open-all ${ITEMS}></w-treeview>`);
  await recordEvents(page, '#tree', ['change']);
  await page.locator(row('tables')).focus();

  await page.keyboard.press('ArrowRight');
  await expect(page.locator(row('tables'))).toBeFocused();
  expect(await readEvents(page, '#tree')).toEqual([]);
});

test('w-treeview ArrowLeft collapses an open branch then walks up to the parent', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" opened='["components","inputs"]' ${ITEMS}></w-treeview>`);
  await page.locator(row('checkbox')).focus();

  await page.keyboard.press('ArrowLeft');
  await expect(page.locator(row('inputs'))).toBeFocused();

  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#tree .w-treeview-node[data-value="inputs"]')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator(row('checkbox'))).toBeHidden();
  await expect(page.locator('#tree')).toHaveAttribute('opened', '["components"]');

  await page.keyboard.press('ArrowLeft');
  await expect(page.locator(row('components'))).toBeFocused();
});

test('w-treeview ArrowLeft keeps focus on a root-level leaf', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" open-all ${MIXED}></w-treeview>`);
  await page.locator(row('solo')).focus();

  await page.keyboard.press('ArrowLeft');
  await expect(page.locator(row('solo'))).toBeFocused();
});

test('w-treeview Enter toggles a branch when it is neither selectable nor activatable', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" ${ITEMS}></w-treeview>`);
  await recordEvents(page, '#tree', ['change']);
  await page.locator(row('components')).focus();

  await page.keyboard.press('Enter');
  await expect(page.locator('#tree .w-treeview-node[data-value="components"]')).toHaveClass(/open/);
  expect(await readEvents(page, '#tree')).toEqual([
    { type: 'change', detail: { value: ['components'], name: 'opened' } },
  ]);
});

test('w-treeview Enter activates the focused row when activatable', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" activatable open-all ${ITEMS}></w-treeview>`);
  await recordEvents(page, '#tree', ['change']);
  await page.locator(row('tables')).focus();

  await page.keyboard.press('Enter');
  await expect(page.locator(row('tables'))).toHaveClass(/active/);
  await expect(page.locator('#tree')).toHaveAttribute('activated', '["tables"]');
  expect(await readEvents(page, '#tree')).toEqual([
    { type: 'change', detail: { value: 'tables', name: 'activated', id: 'tables' } },
  ]);
});

test('w-treeview Space selects the focused row when selectable', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" selectable open-all ${ITEMS}></w-treeview>`);
  await recordEvents(page, '#tree', ['change']);
  await page.locator(row('inputs')).focus();

  await page.keyboard.press(' ');
  await expect(page.locator('#tree')).toHaveAttribute('selected', '["checkbox","select"]');
  await expect(page.locator(`${row('inputs')} .w-treeview-checkbox`)).toHaveAttribute('aria-checked', 'true');
  expect(await readEvents(page, '#tree')).toEqual([
    { type: 'change', detail: { value: ['checkbox', 'select'], name: 'selected', id: 'inputs' } },
  ]);
});

test('w-treeview ignores Enter on a disabled node and on a disabled tree', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" activatable open-all ${MIXED}></w-treeview>`);
  await recordEvents(page, '#tree', ['change']);
  await page.locator(row('banana')).focus();

  await page.keyboard.press('Enter');
  await expect(page.locator(row('banana'))).not.toHaveClass(/active/);
  expect(await readEvents(page, '#tree')).toEqual([]);

  await mount(`<w-treeview id="tree" activatable disabled open-all ${MIXED}></w-treeview>`);
  await recordEvents(page, '#tree', ['change']);
  await page.locator(row('apple')).focus();

  await page.keyboard.press('Enter');
  await expect(page.locator(row('apple'))).not.toHaveClass(/active/);
  expect(await readEvents(page, '#tree')).toEqual([]);
});

test('w-treeview leaves unhandled keys alone', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" activatable open-all ${ITEMS}></w-treeview>`);
  await recordEvents(page, '#tree', ['change']);
  await page.locator(row('inputs')).focus();

  await page.keyboard.press('a');
  await page.keyboard.press('PageDown');
  await expect(page.locator(row('inputs'))).toBeFocused();
  expect(await readEvents(page, '#tree')).toEqual([]);
});

test('w-treeview normalizes a plain comma list of labels into rows', async ({ mount, page }) => {
  await mount('<w-treeview id="tree" items="Alpha, Beta, Gamma"></w-treeview>');

  await expect(page.locator('#tree .w-treeview-node')).toHaveCount(3);
  expect(await page.locator('#tree .w-treeview-label').allTextContents()).toEqual(['Alpha', 'Beta', 'Gamma']);
  await expect(page.locator('#tree .w-treeview-node[data-value="Beta"]')).toHaveCount(1);
});

test('w-treeview drops blank and null entries from a JSON array of labels', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" items='["Alpha", "", null, "Beta"]'></w-treeview>`);

  await expect(page.locator('#tree .w-treeview-node')).toHaveCount(2);
  expect(await page.locator('#tree .w-treeview-label').allTextContents()).toEqual(['Alpha', 'Beta']);
});

/* ── Vuetify parity: filtering ──────────────────────────────────────────── */

test('w-treeview search keeps matching branches and auto-expands them', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" search="check" ${ITEMS}></w-treeview>`);

  expect(await page.locator('#tree .w-treeview-label').allTextContents())
    .toEqual(['Components', 'Inputs', 'Checkbox']);
  await expect(page.locator('#tree .w-treeview-node[data-value="components"]')).toHaveClass(/open/);
  await expect(page.locator(row('checkbox'))).toBeVisible();
});

test('w-treeview no-filter disables searching entirely', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" search="zzz" no-filter ${ITEMS}></w-treeview>`);
  await expect(page.locator('#tree .w-treeview-node')).toHaveCount(5);
});

const CODED = `items='[
  {"title":"Alpha","value":"a","code":"alpha-1"},
  {"title":"Beta","value":"b","code":"alpha-2"}
]'`;

test('w-treeview filter-keys searches item fields other than the title', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" search="alpha-2" filter-keys="code" ${CODED}></w-treeview>`);
  expect(await page.locator('#tree .w-treeview-label').allTextContents()).toEqual(['Beta']);
});

test('w-treeview filter-mode every requires all filter keys to match', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" search="alpha" filter-keys="title,code" filter-mode="every" ${CODED}></w-treeview>`);
  expect(await page.locator('#tree .w-treeview-label').allTextContents()).toEqual(['Alpha']);

  await mount(`<w-treeview id="tree" search="alpha" filter-keys="title,code" filter-mode="some" ${CODED}></w-treeview>`);
  expect(await page.locator('#tree .w-treeview-label').allTextContents()).toEqual(['Alpha', 'Beta']);
});

test('w-treeview shows no-data-text when nothing is left and hide-no-data suppresses it', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" search="zzz" no-data-text="Nothing here" ${ITEMS}></w-treeview>`);
  await expect(page.locator('#tree .w-treeview-no-data')).toHaveText('Nothing here');

  await mount(`<w-treeview id="tree" search="zzz" no-data-text="Nothing here" hide-no-data ${ITEMS}></w-treeview>`);
  await expect(page.locator('#tree .w-treeview-no-data')).toHaveCount(0);
});

/* ── Vuetify parity: presentation ───────────────────────────────────────── */

test('w-treeview maps variant, slim, lines, fluid and separate-roots onto classes', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" variant="tonal" slim lines="three" fluid separate-roots ${ITEMS}></w-treeview>`);

  const tree = page.locator('#tree .w-treeview');
  await expect(tree).toHaveClass(/w-treeview--variant-tonal/);
  await expect(tree).toHaveClass(/w-treeview--slim/);
  await expect(tree).toHaveClass(/w-treeview--three-line/);
  await expect(tree).toHaveClass(/w-treeview--fluid/);
  await expect(tree).toHaveClass(/w-treeview--separate-roots/);
});

test('w-treeview fluid removes the nested indentation', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" open-all ${ITEMS}></w-treeview>`);
  const nested = '#tree .w-treeview-node[data-value="components"] > .w-treeview-list';
  const indented = await page.locator(nested).evaluate((el) => getComputedStyle(el).marginLeft);
  expect(indented).not.toBe('0px');

  await mount(`<w-treeview id="tree" open-all fluid ${ITEMS}></w-treeview>`);
  await expect(page.locator(nested)).toHaveCSS('margin-left', '0px');
});

test('w-treeview indent and prepend-gap drive the layout custom properties', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" open-all indent="40" prepend-gap="1.5rem" ${ITEMS}></w-treeview>`);

  const nested = '#tree .w-treeview-node[data-value="components"] > .w-treeview-list';
  await expect(page.locator(nested)).toHaveCSS('margin-left', '40px');
  await expect(page.locator(row('components'))).toHaveCSS('column-gap', '24px');
});

test('w-treeview indent-lines draws guide lines with a colour and opacity', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" open-all indent-lines indent-lines-color="rgb(255, 0, 0)" indent-lines-opacity="0.5" ${ITEMS}></w-treeview>`);

  const nested = page.locator('#tree .w-treeview-node[data-value="components"] > .w-treeview-list');
  await expect(page.locator('#tree .w-treeview')).toHaveClass(/w-treeview--indent-lines-default/);
  await expect(nested).toHaveCSS('border-left-style', 'solid');
  expect(await nested.evaluate((el) => getComputedStyle(el).borderLeftColor)).toBe('color(srgb 1 0 0 / 0.5)');

  await mount(`<w-treeview id="tree" open-all indent-lines="simple" ${ITEMS}></w-treeview>`);
  await expect(page.locator('#tree .w-treeview-node[data-value="components"] > .w-treeview-list'))
    .toHaveCSS('border-left-style', 'dashed');
});

test('w-treeview separate-roots drops the guide line under root branches only', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" open-all indent-lines separate-roots ${ITEMS}></w-treeview>`);

  const rootChild = page.locator('#tree .w-treeview-node[data-value="components"] > .w-treeview-list');
  const deeper = page.locator('#tree .w-treeview-node[data-value="inputs"] > .w-treeview-list');
  await expect(rootChild).toHaveCSS('border-left-color', 'rgba(0, 0, 0, 0)');
  expect(await deeper.evaluate((el) => getComputedStyle(el).borderLeftColor)).not.toBe('rgba(0, 0, 0, 0)');
});

test('w-treeview selected-color paints the selection checkbox', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" selectable open-all selected='["tables"]' selected-color="rgb(0, 128, 0)" ${ITEMS}></w-treeview>`);
  await expect(page.locator(`${row('tables')} .w-treeview-checkbox`))
    .toHaveCSS('background-color', 'rgb(0, 128, 0)');
});

/* ── Vuetify parity: rows, icons, and actions ───────────────────────────── */

test('w-treeview exposes aria-level for every depth', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" open-all ${ITEMS}></w-treeview>`);

  await expect(page.locator('#tree .w-treeview-node[data-value="components"]')).toHaveAttribute('aria-level', '1');
  await expect(page.locator('#tree .w-treeview-node[data-value="inputs"]')).toHaveAttribute('aria-level', '2');
  await expect(page.locator('#tree .w-treeview-node[data-value="checkbox"]')).toHaveAttribute('aria-level', '3');
});

test('w-treeview hide-actions removes the expand toggles', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" open-all hide-actions ${ITEMS}></w-treeview>`);
  await expect(page.locator('#tree .w-treeview-toggle')).toHaveCount(0);
  await expect(page.locator('#tree .w-treeview-leaf')).toHaveCount(5);
});

const LOADING = `items='[
  {"title":"Lazy","value":"lazy","loading":true,"children":[{"title":"Kid","value":"kid"}]}
]'`;

test('w-treeview renders a loading indicator for a busy node', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" ${LOADING}></w-treeview>`);
  await expect(page.locator('#tree .w-treeview-loading')).toHaveText('⟳');

  await mount(`<w-treeview id="tree" loading-icon="…" ${LOADING}></w-treeview>`);
  await expect(page.locator('#tree .w-treeview-loading')).toHaveText('…');
});

test('w-treeview true-icon, false-icon and indeterminate-icon fill the checkbox', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" selectable open-all true-icon="Y" false-icon="N" indeterminate-icon="M" ${ITEMS}></w-treeview>`);

  await expect(page.locator(`${row('components')} .w-treeview-checkbox`)).toHaveText('N');
  await page.locator(`${row('inputs')} .w-treeview-checkbox`).click();
  await expect(page.locator(`${row('inputs')} .w-treeview-checkbox`)).toHaveText('Y');
  await expect(page.locator(`${row('components')} .w-treeview-checkbox`)).toHaveText('M');
});

/* ── Vuetify parity: activation and selection strategies ────────────────── */

test('w-treeview active-class adds the caller class to the active row', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" activatable active-class="chosen" open-all ${ITEMS}></w-treeview>`);

  await page.locator(`${row('tables')} .w-treeview-label`).click();
  await expect(page.locator(row('tables'))).toHaveClass(/chosen/);

  await page.locator(`${row('inputs')} .w-treeview-label`).click();
  await expect(page.locator(row('tables'))).not.toHaveClass(/chosen/);
});

test('w-treeview mandatory refuses to clear the last activated row', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" activatable mandatory open-all ${ITEMS}></w-treeview>`);
  await recordEvents(page, '#tree', ['change']);

  const label = `${row('tables')} .w-treeview-label`;
  await page.locator(label).click();
  await page.locator(label).click();

  await expect(page.locator('#tree')).toHaveAttribute('activated', '["tables"]');
  await expect(page.locator(row('tables'))).toHaveClass(/active/);
  expect(await readEvents(page, '#tree')).toHaveLength(1);
});

test('w-treeview active-strategy leaf refuses to activate a branch row', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" activatable active-strategy="single-leaf" open-all ${ITEMS}></w-treeview>`);

  await page.locator(`${row('inputs')} .w-treeview-label`).click();
  await expect(page.locator(row('inputs'))).not.toHaveClass(/active/);

  await page.locator(`${row('tables')} .w-treeview-label`).click();
  await expect(page.locator(row('tables'))).toHaveClass(/active/);
});

test('w-treeview active-strategy independent activates several rows at once', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" activatable active-strategy="independent" open-all ${ITEMS}></w-treeview>`);
  await recordEvents(page, '#tree', ['change']);

  await page.locator(`${row('tables')} .w-treeview-label`).click();
  await page.locator(`${row('inputs')} .w-treeview-label`).click();

  await expect(page.locator('#tree')).toHaveAttribute('activated', '["tables","inputs"]');
  expect(await readEvents(page, '#tree')).toEqual([
    { type: 'change', detail: { value: ['tables'], name: 'activated', id: 'tables' } },
    { type: 'change', detail: { value: ['tables', 'inputs'], name: 'activated', id: 'inputs' } },
  ]);
});

test('w-treeview return-object reports the source item instead of the key', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" activatable return-object open-all ${ITEMS}></w-treeview>`);
  await recordEvents(page, '#tree', ['change']);

  await page.locator(`${row('tables')} .w-treeview-label`).click();

  await expect(page.locator('#tree')).toHaveAttribute('activated', '["tables"]');
  expect(await readEvents(page, '#tree')).toEqual([
    { type: 'change', detail: { value: { title: 'Tables', value: 'tables' }, name: 'activated', id: 'tables' } },
  ]);
});

test('w-treeview filterable hands the space key back to an external input', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" selectable filterable open-all ${ITEMS}></w-treeview>`);
  await recordEvents(page, '#tree', ['change']);
  await page.locator(row('inputs')).focus();

  await page.keyboard.press(' ');
  await expect(page.locator('#tree')).not.toHaveAttribute('selected', /.+/);
  expect(await readEvents(page, '#tree')).toEqual([]);

  await page.keyboard.press('Enter');
  await expect(page.locator('#tree')).toHaveAttribute('selected', '["checkbox","select"]');
});

/* ── Vuetify parity: registration and navigation strategies ─────────────── */

test('w-treeview items-registration props keeps collapsed branches out of the DOM', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" items-registration="props" ${ITEMS}></w-treeview>`);
  await expect(page.locator('#tree .w-treeview-node')).toHaveCount(1);

  await page.locator(`${row('components')} .w-treeview-toggle`).click();
  await expect(page.locator('#tree .w-treeview-node')).toHaveCount(3);
  await expect(page.locator('#tree .w-treeview-node[data-value="checkbox"]')).toHaveCount(0);
});

test('w-treeview navigation-strategy track moves a cursor without moving DOM focus', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" navigation-strategy="track" open-all ${ITEMS}></w-treeview>`);
  await recordEvents(page, '#tree', ['change']);

  const tree = page.locator('#tree .w-treeview');
  await expect(tree).toHaveAttribute('tabindex', '0');
  await expect(tree).toHaveAttribute('aria-activedescendant', 'tree-row-0');
  await expect(page.locator(row('components'))).toHaveClass(/w-treeview-row--focused/);

  await tree.focus();
  await page.keyboard.press('ArrowDown');

  await expect(tree).toHaveAttribute('aria-activedescendant', 'tree-row-1');
  await expect(page.locator(row('inputs'))).toHaveClass(/w-treeview-row--focused/);
  await expect(page.locator('#tree')).toHaveAttribute('navigation-index', '1');
  await expect(tree).toBeFocused();
  expect(await readEvents(page, '#tree')).toEqual([
    { type: 'change', detail: { value: 1, name: 'navigation-index' } },
  ]);
});

test('w-treeview navigation-index seeds the tracked cursor', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" navigation-strategy="track" navigation-index="2" open-all ${ITEMS}></w-treeview>`);

  await expect(page.locator(row('checkbox'))).toHaveClass(/w-treeview-row--focused/);
  await expect(page.locator('#tree .w-treeview')).toHaveAttribute('aria-activedescendant', 'tree-row-2');
});

/* ── w-treeview-item ────────────────────────────────────────────────────── */

test('w-treeview-item renders title, subtitle, value, index and active state', async ({ mount, page }) => {
  await mount('<w-treeview-item id="item" title="Node" subtitle="Sub" value="n1" index="2" active active-class="chosen"></w-treeview-item>');

  const item = page.locator('#item .w-treeview-item');
  await expect(item).toHaveClass(/chosen/);
  await expect(item).toHaveClass(/active/);
  await expect(item).toHaveAttribute('role', 'treeitem');
  await expect(item).toHaveAttribute('data-value', 'n1');
  await expect(item).toHaveAttribute('data-index', '2');
  await expect(item).toHaveAttribute('aria-posinset', '2');
  await expect(item).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#item .w-treeview-item-title')).toHaveText('Node');
  await expect(page.locator('#item .w-treeview-item-subtitle')).toHaveText('Sub');
});

test('w-treeview-item becomes an anchor with href and a link role with link', async ({ mount, page }) => {
  await mount('<w-treeview-item id="item" title="Docs" href="/docs" target="_blank" rel="noopener"></w-treeview-item>');
  const anchor = page.locator('#item a.w-treeview-item');
  await expect(anchor).toHaveAttribute('href', '/docs');
  await expect(anchor).toHaveAttribute('target', '_blank');
  await expect(anchor).toHaveClass(/w-treeview-item--link/);

  await mount('<w-treeview-item id="item" title="Docs" link></w-treeview-item>');
  await expect(page.locator('#item .w-treeview-item')).toHaveAttribute('role', 'link');
});

test('w-treeview-item renders prepend and append media plus a forced prepend slot', async ({ mount, page }) => {
  await mount('<w-treeview-item id="item" title="Node" prepend-icon="P" append-icon="A"></w-treeview-item>');
  expect(await page.locator('#item .w-treeview-item-icon').allTextContents()).toEqual(['P', 'A']);

  await mount('<w-treeview-item id="item" title="Node" prepend-avatar="AB" append-avatar="/logo.png"></w-treeview-item>');
  await expect(page.locator('#item .w-treeview-item-prepend .w-avatar-text')).toHaveText('AB');
  await expect(page.locator('#item .w-treeview-item-append .w-avatar-image')).toHaveAttribute('src', '/logo.png');

  await mount('<w-treeview-item id="item" title="Node" has-custom-prepend><span slot="prepend">X</span></w-treeview-item>');
  await expect(page.locator('#item .w-treeview-item')).toHaveClass(/w-treeview-item--custom-prepend/);
  await expect(page.locator('#item .w-treeview-item-prepend')).toHaveText('X');
});

test('w-treeview-item toggle-icon renders a toggle that hide-actions removes', async ({ mount, page }) => {
  await mount('<w-treeview-item id="item" title="Branch" toggle-icon="+"></w-treeview-item>');
  await expect(page.locator('#item .w-treeview-item-toggle')).toHaveText('+');
  await expect(page.locator('#item .w-treeview-item-toggle')).toHaveAttribute('aria-label', 'Toggle Branch');

  await mount('<w-treeview-item id="item" title="Branch" toggle-icon="+" hide-actions></w-treeview-item>');
  await expect(page.locator('#item .w-treeview-item-toggle')).toHaveCount(0);
  await expect(page.locator('#item .w-treeview-item')).toHaveClass(/w-treeview-item--hide-actions/);
});

test('w-treeview-item indent-lines renders one guide per entry', async ({ mount, page }) => {
  await mount(`<w-treeview-item id="item" title="Leaf" indent-lines='["line","none","leaf"]'></w-treeview-item>`);

  await expect(page.locator('#item .w-treeview-indent-line')).toHaveCount(3);
  await expect(page.locator('#item .w-treeview-indent-line').nth(0)).toHaveClass(/w-treeview-indent-line--line/);
  await expect(page.locator('#item .w-treeview-indent-line').nth(1)).toHaveClass(/w-treeview-indent-line--none/);
  await expect(page.locator('#item .w-treeview-indent-line').nth(2)).toHaveClass(/w-treeview-indent-line--leaf/);
});

test('w-treeview-item maps nav, slim, lines, variant and prepend-gap', async ({ mount, page }) => {
  await mount('<w-treeview-item id="item" title="Node" nav slim lines="two" variant="tonal" prepend-gap="20"></w-treeview-item>');

  const item = page.locator('#item .w-treeview-item');
  await expect(item).toHaveClass(/w-treeview-item--nav/);
  await expect(item).toHaveClass(/w-treeview-item--slim/);
  await expect(item).toHaveClass(/w-treeview-item--two-line/);
  await expect(item).toHaveClass(/w-treeview-item--variant-tonal/);
  await expect(item).toHaveCSS('column-gap', '20px');
});

test('w-treeview-item emits change on click and on keyboard activation', async ({ mount, page }) => {
  await mount('<w-treeview-item id="item" title="Node" value="n1" ripple></w-treeview-item>');
  await recordEvents(page, '#item', ['change']);

  await page.locator('#item .w-treeview-item').click();
  await page.locator('#item .w-treeview-item').focus();
  await page.keyboard.press('Enter');

  expect(await readEvents(page, '#item')).toEqual([
    { type: 'change', detail: { value: 'n1', title: 'Node' } },
    { type: 'change', detail: { value: 'n1', title: 'Node' } },
  ]);
});

test('w-treeview-item disabled drops the tab stop and the change event', async ({ mount, page }) => {
  await mount('<w-treeview-item id="item" title="Node" value="n1" disabled></w-treeview-item>');
  await recordEvents(page, '#item', ['change']);

  const item = page.locator('#item .w-treeview-item');
  await expect(item).toHaveAttribute('aria-disabled', 'true');
  await expect(item).not.toHaveAttribute('tabindex', '0');
  await item.click({ force: true });
  expect(await readEvents(page, '#item')).toEqual([]);
});

/* ── w-treeview-group ───────────────────────────────────────────────────── */

test('w-treeview-group toggles its branch and reports the value', async ({ mount, page }) => {
  await mount('<w-treeview-group id="group" title="Branch" value="b1" expand-icon="+" collapse-icon="-">Child</w-treeview-group>');
  await recordEvents(page, '#group', ['toggle']);

  const activator = page.locator('#group .w-treeview-group-activator');
  await expect(activator).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#group .w-treeview-group-toggle')).toHaveText('+');
  await expect(page.locator('#group .w-treeview-group-items')).toBeHidden();
  await expect(page.locator('#group .w-treeview-group-title')).toHaveText('Branch');

  await activator.click();

  await expect(page.locator('#group .w-treeview-group-activator')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#group .w-treeview-group-toggle')).toHaveText('-');
  await expect(page.locator('#group .w-treeview-group-items')).toBeVisible();
  await expect(page.locator('#group .w-treeview-group')).toHaveClass(/open/);
  expect(await readEvents(page, '#group')).toEqual([
    { type: 'toggle', detail: { open: true, value: 'b1' } },
  ]);
});

test('w-treeview-group raw-id seeds the root id and aria-controls', async ({ mount, page }) => {
  await mount('<w-treeview-group id="group" title="Branch" raw-id="42" open>Child</w-treeview-group>');

  await expect(page.locator('#group .w-treeview-group')).toHaveAttribute('id', 'w-treeview-group--id-42');
  await expect(page.locator('#group .w-treeview-group-activator'))
    .toHaveAttribute('aria-controls', 'w-treeview-group--id-42-items');
  await expect(page.locator('#group .w-treeview-group-items')).toHaveAttribute('role', 'group');
});

test('w-treeview-group renders prepend and append icons', async ({ mount, page }) => {
  await mount('<w-treeview-group id="group" title="Branch" prepend-icon="P" append-icon="A">Child</w-treeview-group>');

  await expect(page.locator('#group .w-treeview-group-icon--prepend')).toHaveText('P');
  await expect(page.locator('#group .w-treeview-group-icon--append')).toHaveText('A');
});

test('w-treeview-group fluid removes the child indentation and disabled freezes it', async ({ mount, page }) => {
  await mount('<w-treeview-group id="group" title="Branch" open>Child</w-treeview-group>');
  const indented = await page.locator('#group .w-treeview-group-items')
    .evaluate((el) => getComputedStyle(el).marginInlineStart);
  expect(indented).not.toBe('0px');

  await mount('<w-treeview-group id="group" title="Branch" open fluid>Child</w-treeview-group>');
  await expect(page.locator('#group .w-treeview-group-items')).toHaveCSS('margin-inline-start', '0px');

  await mount('<w-treeview-group id="group" title="Branch" disabled>Child</w-treeview-group>');
  await recordEvents(page, '#group', ['toggle']);
  await page.locator('#group .w-treeview-group-activator').click({ force: true });
  await expect(page.locator('#group .w-treeview-group-activator')).toHaveAttribute('aria-expanded', 'false');
  expect(await readEvents(page, '#group')).toEqual([]);
});

test('w-treeview select-strategy classic reports branches alongside their leaves', async ({ mount, page }) => {
  await mount(`<w-treeview id="tree" selectable select-strategy="classic" open-all ${ITEMS}></w-treeview>`);

  await page.locator(`${row('inputs')} .w-treeview-checkbox`).click();

  await expect(page.locator('#tree')).toHaveAttribute('selected', '["inputs","checkbox","select"]');
  await expect(page.locator(`${row('inputs')} .w-treeview-checkbox`)).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator(`${row('components')} .w-treeview-checkbox`)).toHaveAttribute('aria-checked', 'mixed');
});
