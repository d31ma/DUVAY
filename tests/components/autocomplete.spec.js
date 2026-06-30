import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-autocomplete renders field, opens list, and selects on click', async ({ mount, page }) => {
  await mount(`
    <w-autocomplete id="ac" label="Flavor" name="flavor" placeholder="Pick a flavor"
      items="[Vanilla,Chocolate,Strawberry]"></w-autocomplete>
  `);

  const input = page.locator('#ac .w-autocomplete-input');
  await expect(page.locator('#ac .w-field-label')).toHaveText('Flavor');
  await expect(input).toHaveAttribute('placeholder', 'Pick a flavor');
  await expect(input).toHaveAttribute('role', 'combobox');

  await input.click();
  await expect(page.locator('#ac .w-autocomplete-list')).toBeVisible();
  await expect(page.locator('#ac .w-autocomplete-item')).toHaveCount(3);

  await page.locator('#ac .w-autocomplete-item[title="Chocolate"]').click();
  await expect(page.locator('#ac input[type="hidden"]')).toHaveValue('Chocolate');
  await expect(input).toHaveValue('Chocolate');
  await expect(page.locator('#ac .w-autocomplete-list')).toBeHidden();
});

test('w-autocomplete filters on input and emits input', async ({ mount, page }) => {
  await mount(`
    <w-autocomplete id="ac"
      items='[{"title":"Apple","value":"a"},{"title":"Banana","value":"b"},{"title":"Cherry","value":"c"}]'
      item-title="title" item-value="value"></w-autocomplete>
  `);
  await recordEvents(page, '#ac', ['input']);

  await page.locator('#ac .w-autocomplete-input').fill('an');
  await expect(page.locator('#ac .w-autocomplete-item[title="Apple"]')).toBeHidden();
  await expect(page.locator('#ac .w-autocomplete-item[title="Banana"]')).toBeVisible();
  await expect(page.locator('#ac .w-autocomplete-item[title="Cherry"]')).toBeHidden();

  expect(await readEvents(page, '#ac')).toContainEqual({ type: 'input', detail: { value: 'an', name: '' } });
});

test('w-autocomplete navigates and selects with the keyboard', async ({ mount, page }) => {
  await mount(`<w-autocomplete id="ac" items="[One,Two,Three]" name="num"></w-autocomplete>`);

  const input = page.locator('#ac .w-autocomplete-input');
  await input.focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#ac .w-autocomplete-item[title="One"]')).toHaveClass(/active/);

  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#ac .w-autocomplete-item[title="Two"]')).toHaveClass(/active/);

  await page.keyboard.press('Enter');
  await expect(input).toHaveValue('Two');
  await expect(page.locator('#ac input[type="hidden"]')).toHaveValue('Two');
  await expect(page.locator('#ac .w-autocomplete-list')).toBeHidden();
});

test('w-autocomplete supports multiple selection with chips', async ({ mount, page }) => {
  await mount(`
    <w-autocomplete id="ac" items="[Red,Green,Blue]" multiple chips closable-chips name="colors"></w-autocomplete>
  `);

  await page.locator('#ac .w-autocomplete-input').click();
  await page.locator('#ac .w-autocomplete-item[title="Red"]').click();
  await page.locator('#ac .w-autocomplete-item[title="Blue"]').click();

  await expect(page.locator('#ac w-chip')).toHaveCount(2);
  await expect(page.locator('#ac input[type="hidden"]')).toHaveValue('Red,Blue');

  await page.locator('#ac w-chip[text="Red"] .w-chip__close').click();
  await expect(page.locator('#ac w-chip')).toHaveCount(1);
  await expect(page.locator('#ac input[type="hidden"]')).toHaveValue('Blue');
});

test('w-autocomplete clearable clears the value', async ({ mount, page }) => {
  await mount(`<w-autocomplete id="ac" items="[A,B,C]" value="B" clearable name="letter"></w-autocomplete>`);

  await expect(page.locator('#ac .w-autocomplete-input')).toHaveValue('B');
  await page.locator('#ac .w-autocomplete-clear').click();
  await expect(page.locator('#ac .w-autocomplete-input')).toHaveValue('');
  await expect(page.locator('#ac input[type="hidden"]')).toHaveValue('');
});

test('w-autocomplete shows no-data-text when nothing matches', async ({ mount, page }) => {
  await mount(`<w-autocomplete id="ac" items="[X]" no-data-text="Nothing found"></w-autocomplete>`);

  await expect(page.locator('#ac .w-autocomplete-empty')).toBeHidden();
  await page.locator('#ac .w-autocomplete-input').fill('zzz');
  await expect(page.locator('#ac .w-autocomplete-empty')).toBeVisible();
  await expect(page.locator('#ac .w-autocomplete-empty')).toHaveText('Nothing found');
});

test('w-combobox commits free-text values on Enter', async ({ mount, page }) => {
  await mount(`<w-combobox id="cb" items="[Alpha,Beta]" name="skill"></w-combobox>`);
  await recordEvents(page, '#cb', ['change']);

  await page.locator('#cb .w-autocomplete-input').fill('Custom');
  await page.keyboard.press('Enter');

  await expect(page.locator('#cb .w-autocomplete-input')).toHaveValue('Custom');
  await expect(page.locator('#cb input[type="hidden"]')).toHaveValue('Custom');

  expect(await readEvents(page, '#cb')).toContainEqual({
    type: 'change',
    detail: { value: 'Custom', title: 'Custom', name: 'skill' },
  });
});

test('w-autocomplete hide-selected removes chosen items from the list', async ({ mount, page }) => {
  await mount(`<w-autocomplete id="ac" items="[Red,Green,Blue]" multiple chips closable-chips hide-selected></w-autocomplete>`);

  await page.locator('#ac .w-autocomplete-input').click();
  await expect(page.locator('#ac .w-autocomplete-item:visible')).toHaveCount(3);

  await page.locator('#ac .w-autocomplete-item[title="Green"]').click();
  // Green is now selected, so it drops out of the visible options.
  await expect(page.locator('#ac .w-autocomplete-item[title="Green"]')).toBeHidden();
  await expect(page.locator('#ac .w-autocomplete-item:visible')).toHaveCount(2);

  // Removing its chip brings the option back while the list is open.
  await page.locator('#ac w-chip[text="Green"] .w-chip__close').click();
  await expect(page.locator('#ac .w-autocomplete-item:visible')).toHaveCount(3);
});

test('w-autocomplete auto-select-first highlights the first match', async ({ mount, page }) => {
  await mount(`<w-autocomplete id="ac" items="[Cat,Dog,Bird]" auto-select-first></w-autocomplete>`);

  await page.locator('#ac .w-autocomplete-input').fill('d');
  await expect(page.locator('#ac .w-autocomplete-item[title="Dog"]')).toHaveClass(/active/);
});

test('w-autocomplete exposes accessible combobox attributes', async ({ mount, page }) => {
  await mount(`<w-autocomplete id="ac" label="Search" items="[A,B]"></w-autocomplete>`);

  const input = page.locator('#ac .w-autocomplete-input');
  await expect(input).toHaveAttribute('role', 'combobox');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await expect(input).toHaveAttribute('aria-autocomplete', 'list');

  const controls = await input.getAttribute('aria-controls');
  await input.click();
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator(`#${controls}`)).toHaveAttribute('role', 'listbox');
});
