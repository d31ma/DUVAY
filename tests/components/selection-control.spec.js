import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-selection-control reflects type, label, name, value, checked, and disabled attributes', async ({ mount, page }) => {
  await mount('<w-selection-control id="control" type="radio" label="Choice" name="choice" value="a" checked disabled></w-selection-control>');

  const input = page.locator('#control input');
  await expect(input).toHaveAttribute('type', 'radio');
  await expect(input).toHaveAttribute('name', 'choice');
  await expect(input).toHaveAttribute('value', 'a');
  await expect(input).toBeChecked();
  await expect(input).toBeDisabled();
  await expect(page.locator('#control label')).toContainText('Choice');

  await page.locator('#control').evaluate((el) => {
    el.setAttribute('type', 'checkbox');
    el.removeAttribute('checked');
    el.removeAttribute('disabled');
  });

  await expect(input).toHaveAttribute('type', 'checkbox');
  await expect(input).not.toBeChecked();
  await expect(input).toBeEnabled();
});

test('w-selection-control toggles checked state and emits change', async ({ mount, page }) => {
  await mount('<w-selection-control id="control" name="notify" value="email"></w-selection-control>');
  await recordEvents(page, '#control', ['change']);

  await page.locator('#control input').check();

  await expect(page.locator('#control')).toHaveAttribute('checked', '');
  expect(await readEvents(page, '#control')).toEqual([
    { type: 'change', detail: { checked: true, name: 'notify', value: 'email' } },
  ]);
});
