import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-radio-group reflects label, name, value, and disabled attrs on child radios', async ({ mount, page }) => {
  await mount(`
    <w-radio-group id="group" label="Plan" name="plan" value="pro" disabled>
      <w-radio value="free" label="Free"></w-radio>
      <w-radio value="pro" label="Pro"></w-radio>
    </w-radio-group>
  `);

  await expect(page.locator('#group .w-radio-group')).toHaveAttribute('aria-label', 'Plan');
  await expect(page.locator('#group w-radio[value="pro"]')).toHaveAttribute('checked', '');
  await expect(page.locator('#group w-radio[value="free"] input')).toHaveAttribute('name', 'plan');
  await expect(page.locator('#group w-radio input').first()).toBeDisabled();

  await page.locator('#group').evaluate((el) => {
    el.removeAttribute('disabled');
    el.setAttribute('value', 'free');
  });

  await expect(page.locator('#group w-radio[value="free"]')).toHaveAttribute('checked', '');
  await expect(page.locator('#group w-radio input').first()).toBeEnabled();
});

test('w-radio-group updates value when child radios change', async ({ mount, page }) => {
  await mount(`
    <w-radio-group id="group" name="plan" value="free">
      <w-radio value="free" label="Free"></w-radio>
      <w-radio value="pro" label="Pro"></w-radio>
    </w-radio-group>
  `);
  await recordEvents(page, '#group', ['change']);

  await page.locator('#group w-radio[value="pro"] input').check();

  await expect(page.locator('#group')).toHaveAttribute('value', 'pro');
  await expect(page.locator('#group w-radio[value="pro"]')).toHaveAttribute('checked', '');
  await expect(page.locator('#group w-radio[value="free"]')).not.toHaveAttribute('checked', '');
  expect(await readEvents(page, '#group')).toEqual([
    { type: 'change', detail: { value: 'pro', name: 'plan' } },
  ]);
});

test('w-radio-group applies the inline modifier when inline is set', async ({ mount, page }) => {
  await mount(`
    <w-radio-group id="group" name="contact" value="email" inline>
      <w-radio value="email" label="Email"></w-radio>
      <w-radio value="phone" label="Phone"></w-radio>
    </w-radio-group>
  `);

  await expect(page.locator('#group .w-radio-group')).toHaveClass(/w-radio-group--inline/);
  // Inline lays the options out in a single row (same vertical position).
  const tops = await page.locator('#group w-radio').evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().top)));
  expect(new Set(tops).size).toBe(1);

  await page.locator('#group').evaluate((el) => el.removeAttribute('inline'));
  await expect(page.locator('#group .w-radio-group')).not.toHaveClass(/w-radio-group--inline/);
});
