import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-color-picker renders HSV canvas and edits hex values', async ({ mount, page }) => {
  await mount('<w-color-picker id="cp" value="#1f6f8b"></w-color-picker>');

  await expect(page.locator('#cp .w-color-picker-canvas')).toBeVisible();
  await expect(page.locator('#cp .w-color-picker-hue')).toBeVisible();
  await expect(page.locator('#cp .w-color-picker-input')).toHaveValue('#1f6f8b');

  await recordEvents(page, '#cp', ['change']);
  await page.locator('#cp .w-color-picker-input').fill('#ff0000');
  await page.locator('#cp .w-color-picker-input').dispatchEvent('change');

  await expect(page.locator('#cp')).toHaveAttribute('value', '#ff0000');
  expect(await readEvents(page, '#cp')).toEqual([{ type: 'change', detail: { value: '#ff0000' } }]);
});

test('w-color-picker supports swatches and alpha', async ({ mount, page }) => {
  await mount('<w-color-picker id="cp" value="#10b981" show-alpha alpha="0.5" swatches="#ef4444,#10b981,#3b82f6"></w-color-picker>');

  await expect(page.locator('#cp .w-color-picker-alpha')).toBeVisible();
  await expect(page.locator('#cp [data-color="#10b981"]')).toHaveClass(/selected/);

  await recordEvents(page, '#cp', ['change']);
  await page.locator('#cp [data-color="#3b82f6"]').click();

  await expect(page.locator('#cp')).toHaveAttribute('value', /#3b82f6/i);
  const events = await readEvents(page, '#cp');
  expect(events.at(-1).type).toBe('change');
  expect(events.at(-1).detail.value).toMatch(/^#3b82f6/i);
  expect(events.at(-1).detail.alpha).toBe(0.5);
});

test('w-color-picker keyboard adjusts the canvas', async ({ mount, page }) => {
  await mount('<w-color-picker id="cp" value="#808080"></w-color-picker>');
  await recordEvents(page, '#cp', ['change']);

  await page.locator('#cp .w-color-picker-canvas').focus();
  await page.keyboard.press('ArrowRight');

  expect((await readEvents(page, '#cp')).length).toBeGreaterThan(0);
});
