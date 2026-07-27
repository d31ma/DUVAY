import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-radio reflects checked, disabled, name, value, and label attributes', async ({ mount, page }) => {
  await mount('<w-radio id="radio" checked disabled name="choice" value="a" label="Choice A"></w-radio>');

  const input = page.locator('#radio input');
  await expect(input).toBeChecked();
  await expect(input).toBeDisabled();
  await expect(input).toHaveAttribute('name', 'choice');
  await expect(input).toHaveAttribute('value', 'a');
  await expect(page.locator('#radio label')).toContainText('Choice A');

  await page.locator('#radio').evaluate((el) => {
    el.removeAttribute('disabled');
    el.removeAttribute('checked');
    el.setAttribute('label', 'Updated');
  });

  await expect(input).not.toBeChecked();
  await expect(input).toBeEnabled();
  await expect(page.locator('#radio label')).toContainText('Updated');
});

test('w-radio checks itself, unchecks same-name siblings, and emits change', async ({ mount, page }) => {
  await mount(`
    <w-radio id="first" name="choice" value="a" label="A" checked></w-radio>
    <w-radio id="second" name="choice" value="b" label="B"></w-radio>
  `);
  await recordEvents(page, '#second', ['change']);

  await page.locator('#second input').check();

  await expect(page.locator('#first')).not.toHaveAttribute('checked', '');
  await expect(page.locator('#second')).toHaveAttribute('checked', '');
  expect(await readEvents(page, '#second')).toEqual([
    { type: 'change', detail: { checked: true, name: 'choice', value: 'b' } },
  ]);
});

test('w-radio inherits the selection-control surface: type, values, icons, inline, error', async ({ mount, page }) => {
  await mount(`
    <w-radio id="r" name="plan" value="pro" label="Pro"
             true-value="pro-annual" true-icon="Y" false-icon="N" inline error ripple></w-radio>
  `);

  const input = page.locator('#r input');
  await expect(input).toHaveAttribute('type', 'radio');
  await expect(input).toHaveAttribute('value', 'pro-annual');
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#r label')).toHaveClass(/w-checkbox--error/);
  await expect(page.locator('#r label')).toHaveClass(/w-checkbox--inline/);
  await expect(page.locator('#r .w-checkbox-mark--false')).toBeVisible();
  await expect(page.locator('#r .w-checkbox-box')).toHaveClass(/w-ripple-host/);

  await page.locator('#r').evaluate((el) => el.setAttribute('type', 'checkbox'));
  await expect(page.locator('#r input')).toHaveAttribute('type', 'checkbox');
});

test('w-radio true-value is what the change event reports', async ({ mount, page }) => {
  await mount('<w-radio id="r" name="plan" value="pro" true-value="pro-annual" label="Pro"></w-radio>');
  await recordEvents(page, '#r', ['change']);

  await page.locator('#r input').check();

  expect(await readEvents(page, '#r')).toEqual([
    { type: 'change', detail: { checked: true, name: 'plan', value: 'pro-annual' } },
  ]);
});

test('w-radio multiple reports the checked peers as an array model', async ({ mount, page }) => {
  await mount(`
    <w-radio id="a" multiple name="pick" value="a" label="A"></w-radio>
    <w-radio id="b" multiple name="pick" value="b" label="B"></w-radio>
  `);
  await recordEvents(page, '#b', ['change']);

  await page.locator('#b input').check();

  // Radios stay exclusive, so the array holds only the newly checked one.
  expect(await readEvents(page, '#b')).toEqual([
    { type: 'change', detail: { checked: true, name: 'pick', value: ['b'] } },
  ]);
});
