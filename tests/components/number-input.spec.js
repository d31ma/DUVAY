import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-number-input reflects value, min, max, step, label, and disabled attributes', async ({ mount, page }) => {
  await mount('<w-number-input id="number" label="Count" value="4" min="0" max="10" step="2" disabled></w-number-input>');

  await expect(page.locator('#number .w-label')).toHaveText('Count');
  await expect(page.locator('#number input')).toHaveValue('4');
  await expect(page.locator('#number input')).toHaveAttribute('min', '0');
  await expect(page.locator('#number input')).toHaveAttribute('max', '10');
  await expect(page.locator('#number input')).toHaveAttribute('step', '2');
  await expect(page.locator('#number input')).toBeDisabled();

  await page.locator('#number').evaluate((el) => {
    el.removeAttribute('disabled');
    el.setAttribute('value', '6');
  });

  await expect(page.locator('#number input')).toHaveValue('6');
  await expect(page.locator('#number input')).toBeEnabled();
});

test('w-number-input step buttons and input changes commit value', async ({ mount, page }) => {
  await mount('<w-number-input id="number" value="4" step="2"></w-number-input>');
  await recordEvents(page, '#number', ['change']);

  await page.locator('#number [data-step="1"]').click();
  await expect(page.locator('#number')).toHaveAttribute('value', '6');

  await page.locator('#number input').fill('10');
  await page.locator('#number input').dispatchEvent('change');
  await expect(page.locator('#number')).toHaveAttribute('value', '10');
  expect(await readEvents(page, '#number')).toEqual([
    { type: 'change', detail: { value: 6 } },
    { type: 'change', detail: { value: 10 } },
  ]);
});

test('w-number-input renders each control-variant and hide-input', async ({ mount, page }) => {
  await mount(`
    <w-number-input id="default" value="1"></w-number-input>
    <w-number-input id="stacked" value="1" control-variant="stacked"></w-number-input>
    <w-number-input id="split" value="1" control-variant="split"></w-number-input>
    <w-number-input id="hidden" value="1" control-variant="hidden"></w-number-input>
    <w-number-input id="hideinput" value="1" hide-input></w-number-input>
  `);

  await expect(page.locator('#default .w-number-input')).toHaveClass(/w-number-input--default/);
  await expect(page.locator('#default [data-step]')).toHaveCount(2);

  await expect(page.locator('#stacked .w-number-input')).toHaveClass(/w-number-input--stacked/);
  await expect(page.locator('#split .w-number-input')).toHaveClass(/w-number-input--split/);
  await expect(page.locator('#split [data-step]')).toHaveCount(2);

  // hidden has no stepper controls
  await expect(page.locator('#hidden [data-step]')).toHaveCount(0);
  await expect(page.locator('#hidden .w-number-input')).toHaveClass(/w-number-input--hidden/);

  // hide-input implies the stacked variant and hides the text input
  await expect(page.locator('#hideinput .w-number-input')).toHaveClass(/w-number-input--hide-input/);
  await expect(page.locator('#hideinput .w-number-input')).toHaveClass(/w-number-input--stacked/);
});

test('w-number-input clamps to min/max and disables the spent control', async ({ mount, page }) => {
  await mount('<w-number-input id="number" value="9" min="0" max="10" step="2"></w-number-input>');
  await recordEvents(page, '#number', ['change']);

  // 9 + 2 would exceed max 10, so increment is blocked
  await expect(page.locator('#number [data-step="1"]')).toBeDisabled();
  await expect(page.locator('#number [data-step="-1"]')).toBeEnabled();

  await page.locator('#number [data-step="-1"]').click();
  await expect(page.locator('#number')).toHaveAttribute('value', '7');

  // typing past the max is clamped on change
  await page.locator('#number input').fill('999');
  await page.locator('#number input').dispatchEvent('change');
  await expect(page.locator('#number')).toHaveAttribute('value', '10');
  await expect(page.locator('#number [data-step="1"]')).toBeDisabled();
});

test('w-number-input formats with precision, grouping, and custom separators', async ({ mount, page }) => {
  await mount('<w-number-input id="number" value="1234.5" precision="2" grouping></w-number-input>');
  await expect(page.locator('#number input')).toHaveValue('1,234.50');

  await page.locator('#number').evaluate((el) => {
    el.setAttribute('decimal-separator', ',');
    el.setAttribute('group-separator', '.');
  });
  await expect(page.locator('#number input')).toHaveValue('1.234,50');
});

test('w-number-input is read-only with disabled controls and emits change', async ({ mount, page }) => {
  await mount('<w-number-input id="number" value="3" step="1" readonly></w-number-input>');
  await expect(page.locator('#number input')).toHaveAttribute('readonly', '');
  await expect(page.locator('#number [data-step="1"]')).toBeDisabled();
  await expect(page.locator('#number [data-step="-1"]')).toBeDisabled();

  await mount('<w-number-input id="num2" value="3" step="1"></w-number-input>');
  await recordEvents(page, '#num2', ['change']);
  await page.locator('#num2 [data-step="1"]').click();
  expect(await readEvents(page, '#num2')).toEqual([
    { type: 'change', detail: { value: 4 } },
  ]);
});
