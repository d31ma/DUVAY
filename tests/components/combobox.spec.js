import { expect, readEvents, recordEvents, test } from '../setup/component-test.js';

test('w-combobox commits free text on Enter', async ({ mount, page }) => {
  await mount('<w-combobox id="cb" items="Apple,Banana"></w-combobox>');
  await recordEvents(page, '#cb', ['change']);

  await page.locator('#cb .w-autocomplete-input').fill('Cherry');
  await page.locator('#cb .w-autocomplete-input').press('Enter');

  await expect(page.locator('#cb')).toHaveAttribute('value', 'Cherry');
  expect(await readEvents(page, '#cb')).toContainEqual({
    type: 'change',
    detail: { value: 'Cherry', title: 'Cherry', name: '' },
  });
});

test('w-combobox delimiters commit tags in multiple mode', async ({ mount, page }) => {
  await mount('<w-combobox id="cb" multiple chips items="Apple,Banana" delimiters=","></w-combobox>');
  const input = page.locator('#cb .w-autocomplete-input');

  await input.pressSequentially('red,');
  await input.pressSequentially('green,');

  await expect(page.locator('#cb')).toHaveAttribute('value', 'red,green');
  await expect(page.locator('#cb w-chip')).toHaveCount(2);
  await expect(input).toHaveValue('');
});

test('w-combobox commits pending text on blur', async ({ mount, page }) => {
  await mount('<w-combobox id="cb" items="Apple,Banana"></w-combobox>');

  await page.locator('#cb .w-autocomplete-input').fill('Custom');
  await page.locator('#cb .w-autocomplete-input').blur();

  await expect(page.locator('#cb')).toHaveAttribute('value', 'Custom');
});

test('w-combobox does not re-commit a selected item on blur', async ({ mount, page }) => {
  await mount('<w-combobox id="cb" items="Apple,Banana"></w-combobox><button id="elsewhere">x</button>');
  const input = page.locator('#cb .w-autocomplete-input');

  await input.click();
  await page.locator('#cb .w-autocomplete-item[value="Apple"]').click();
  await page.locator('#elsewhere').click();

  await expect(page.locator('#cb')).toHaveAttribute('value', 'Apple');
});

test('w-autocomplete hide-no-data suppresses the empty message', async ({ mount, page }) => {
  await mount('<w-autocomplete id="ac" items="Apple,Banana" hide-no-data></w-autocomplete>');
  const input = page.locator('#ac .w-autocomplete-input');

  await input.fill('zzz');
  await expect(page.locator('#ac .w-autocomplete-empty')).toBeHidden();
});
