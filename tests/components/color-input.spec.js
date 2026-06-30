import { expect, readEvents, recordEvents, test } from '../setup/component-test.js';

test('w-color-input renders swatches, selects on click, and emits change', async ({ mount, page }) => {
  await mount('<w-color-input id="ci" label="Brand" value="#3b82f6" swatches="#ef4444,#10b981,#3b82f6"></w-color-input>');
  await recordEvents(page, '#ci', ['change']);

  await expect(page.locator('#ci .w-color-swatch')).toHaveCount(3);
  await expect(page.locator('#ci .w-color-swatch.selected')).toHaveAttribute('data-color', '#3b82f6');

  await page.locator('#ci .w-color-swatch[data-color="#ef4444"]').click();
  await expect(page.locator('#ci')).toHaveAttribute('value', '#ef4444');
  await expect(page.locator('#ci .w-input')).toHaveValue('#ef4444');
  await expect(page.locator('#ci input[type="color"]')).toHaveValue('#ef4444');
  await expect(page.locator('#ci .w-color-swatch.selected')).toHaveAttribute('data-color', '#ef4444');
  expect(await readEvents(page, '#ci')).toEqual([{ type: 'change', detail: { value: '#ef4444' } }]);
});

test('w-color-input formats the text value by mode', async ({ mount, page }) => {
  await mount(`
    <w-color-input id="rgb" value="#10b981" mode="rgb"></w-color-input>
    <w-color-input id="hsl" value="#8b5cf6" mode="hsl"></w-color-input>
  `);

  await expect(page.locator('#rgb .w-input')).toHaveValue('rgb(16, 185, 129)');
  await expect(page.locator('#hsl .w-input')).toHaveValue('hsl(258, 90%, 66%)');
});

test('w-color-input disabled blocks its controls', async ({ mount, page }) => {
  await mount('<w-color-input id="ci" value="#ef4444" swatches="#ef4444,#10b981" disabled></w-color-input>');

  await expect(page.locator('#ci input[type="color"]')).toBeDisabled();
  await expect(page.locator('#ci .w-input')).toBeDisabled();
  await expect(page.locator('#ci .w-color-swatch').first()).toBeDisabled();
});

test('w-color-picker supports swatches and hide-canvas (swatches-only)', async ({ mount, page }) => {
  await mount('<w-color-picker id="cp" value="#3b82f6" hide-canvas swatches="#ef4444,#3b82f6"></w-color-picker>');
  await recordEvents(page, '#cp', ['change']);

  await expect(page.locator('#cp input[type="color"]')).toHaveCount(0);
  await expect(page.locator('#cp .w-color-swatch')).toHaveCount(2);

  await page.locator('#cp .w-color-swatch[data-color="#ef4444"]').click();
  await expect(page.locator('#cp')).toHaveAttribute('value', '#ef4444');
  await expect(page.locator('#cp code')).toHaveText('#ef4444');
  await expect(page.locator('#cp .w-color-swatch.selected')).toHaveAttribute('data-color', '#ef4444');
  expect(await readEvents(page, '#cp')).toEqual([{ type: 'change', detail: { value: '#ef4444' } }]);
});
