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
