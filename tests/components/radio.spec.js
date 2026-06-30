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
