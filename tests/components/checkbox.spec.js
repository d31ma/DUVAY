import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-checkbox reflects checked, indeterminate, disabled, name, value, and label attributes', async ({ mount, page }) => {
  await mount('<w-checkbox id="box" checked indeterminate disabled name="terms" value="yes" label="Accept"></w-checkbox>');

  const input = page.locator('#box input');
  await expect(input).toBeChecked();
  await expect(input).toBeDisabled();
  await expect(input).toHaveAttribute('name', 'terms');
  await expect(input).toHaveAttribute('value', 'yes');
  await expect(input).toHaveAttribute('aria-checked', 'mixed');
  await expect(page.locator('#box label')).toContainText('Accept');

  await page.locator('#box').evaluate((el) => {
    el.removeAttribute('disabled');
    el.removeAttribute('checked');
    el.removeAttribute('indeterminate');
    el.setAttribute('label', 'Subscribe');
  });

  await expect(input).not.toBeChecked();
  await expect(input).toBeEnabled();
  await expect(input).not.toHaveAttribute('aria-checked', 'mixed');
  await expect(page.locator('#box label')).toContainText('Subscribe');
});

test('w-checkbox toggles host state and emits change', async ({ mount, page }) => {
  await mount('<w-checkbox id="box" name="alerts" value="email">Email alerts</w-checkbox>');
  await recordEvents(page, '#box', ['change']);

  await page.locator('#box input').check();

  await expect(page.locator('#box')).toHaveAttribute('checked', '');
  expect(await readEvents(page, '#box')).toEqual([
    { type: 'change', detail: { checked: true, indeterminate: false, name: 'alerts', value: 'email' } },
  ]);
});
