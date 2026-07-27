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

test('w-autocomplete Home and End highlight the first and last options', async ({ mount, page }) => {
  await mount(`<w-autocomplete id="ac" items="[One,Two,Three]"></w-autocomplete>`);

  await page.locator('#ac .w-autocomplete-input').focus();
  await page.keyboard.press('ArrowDown');

  await page.keyboard.press('End');
  await expect(page.locator('#ac .w-autocomplete-item[title="Three"]')).toHaveClass(/active/);
  await expect(page.locator('#ac .w-autocomplete-item[title="One"]')).not.toHaveClass(/active/);

  await page.keyboard.press('Home');
  await expect(page.locator('#ac .w-autocomplete-item[title="One"]')).toHaveClass(/active/);
});

test('w-autocomplete Home and End are inert when nothing matches', async ({ mount, page }) => {
  await mount(`<w-autocomplete id="ac" items="[One,Two]"></w-autocomplete>`);

  const input = page.locator('#ac .w-autocomplete-input');
  await input.fill('zzz');
  await page.keyboard.press('Home');
  await page.keyboard.press('End');
  await expect(page.locator('#ac .w-autocomplete-item.active')).toHaveCount(0);
  await expect(input).toHaveAttribute('aria-expanded', 'true');
});

test('w-autocomplete ArrowUp walks backwards and wraps around', async ({ mount, page }) => {
  await mount(`<w-autocomplete id="ac" items="[One,Two,Three]"></w-autocomplete>`);

  await page.locator('#ac .w-autocomplete-input').focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#ac .w-autocomplete-item[title="Two"]')).toHaveClass(/active/);

  await page.keyboard.press('ArrowUp');
  await expect(page.locator('#ac .w-autocomplete-item[title="One"]')).toHaveClass(/active/);

  await page.keyboard.press('ArrowUp');
  await expect(page.locator('#ac .w-autocomplete-item[title="Three"]')).toHaveClass(/active/);
});

test('w-autocomplete Escape and Tab close the list', async ({ mount, page }) => {
  await mount(`<w-autocomplete id="ac" items="[One,Two]"></w-autocomplete>`);

  const input = page.locator('#ac .w-autocomplete-input');
  const list = page.locator('#ac .w-autocomplete-list');

  await input.click();
  await expect(list).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(list).toBeHidden();
  await expect(input).toHaveAttribute('aria-expanded', 'false');

  await input.click();
  await expect(list).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(list).toBeHidden();
});

test('w-autocomplete Enter without a highlighted option keeps the value empty', async ({ mount, page }) => {
  await mount(`<w-autocomplete id="ac" items="[One,Two]" name="num"></w-autocomplete>`);
  await recordEvents(page, '#ac', ['change']);

  await page.locator('#ac .w-autocomplete-input').click();
  await page.keyboard.press('Enter');

  await expect(page.locator('#ac input[type="hidden"]')).toHaveValue('');
  expect(await readEvents(page, '#ac')).toEqual([]);
});

test('w-autocomplete ignores keys it does not handle', async ({ mount, page }) => {
  await mount(`<w-autocomplete id="ac" items="[One,Two]"></w-autocomplete>`);

  await page.locator('#ac .w-autocomplete-input').focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('PageDown');

  await expect(page.locator('#ac .w-autocomplete-list')).toBeVisible();
  await expect(page.locator('#ac .w-autocomplete-item[title="One"]')).toHaveClass(/active/);
});

/* ── Vuetify field-surface parity ─────────────────────────────────────────── */

test('w-autocomplete renders the field surface modifiers, affixes, and icons', async ({ mount, page }) => {
  await mount(`
    <w-autocomplete id="ac" items="[A,B]" label="Pick" variant="solo" flat reverse active glow
      center-affix single-line indent-details hide-spin-buttons persistent-placeholder
      persistent-clear persistent-counter persistent-hint prefix="$" suffix="kg"
      prepend-icon="star" append-icon="info" prepend-inner-icon="search"
      append-inner-icon="close" icon-color="primary"></w-autocomplete>
  `);

  const root = page.locator('#ac .w-autocomplete');
  for (const modifier of [
    'w-autocomplete--solo', 'w-autocomplete--flat', 'w-autocomplete--reverse',
    'w-autocomplete--active', 'w-autocomplete--glow', 'w-autocomplete--center-affix',
    'w-autocomplete--single-line', 'w-autocomplete--indent-details',
    'w-autocomplete--hide-spin-buttons', 'w-autocomplete--persistent-placeholder',
    'w-autocomplete--persistent-clear', 'w-autocomplete--persistent-counter',
    'w-autocomplete--persistent-hint',
  ]) {
    await expect(root).toHaveClass(new RegExp(modifier));
  }

  await expect(page.locator('#ac .w-autocomplete-prefix')).toHaveText('$');
  await expect(page.locator('#ac .w-autocomplete-suffix')).toHaveText('kg');
  await expect(page.locator('#ac .w-autocomplete-prepend .w-icon')).toHaveText('star');
  await expect(page.locator('#ac .w-autocomplete-append .w-icon')).toHaveText('info');
  await expect(page.locator('#ac .w-autocomplete-prepend-inner .w-icon')).toHaveText('search');
  await expect(page.locator('#ac .w-autocomplete-append-inner .w-icon')).toHaveText('close');

  // single-line drops the stacked label and uses it as the placeholder instead.
  await expect(page.locator('#ac .w-field-label')).toHaveCount(0);
  await expect(page.locator('#ac .w-autocomplete-input')).toHaveAttribute('placeholder', 'Pick');

  const iconColor = await page.locator('#ac .w-autocomplete').evaluate(
    (el) => el.style.getPropertyValue('--w-autocomplete-icon-color'));
  expect(iconColor).toContain('--w-primary');
});

test('w-autocomplete type, autocomplete=suppress, and autofocus reach the input', async ({ mount, page }) => {
  await mount(`<w-autocomplete id="ac" items="[A]" type="search" autocomplete="suppress" autofocus></w-autocomplete>`);

  const input = page.locator('#ac .w-autocomplete-input');
  await expect(input).toHaveAttribute('type', 'search');
  await expect(input).toHaveAttribute('autocomplete', 'off');
  await expect(input).toHaveAttribute('autofocus', '');
  expect(await input.getAttribute('name')).toMatch(/nosuggest$/);

  await mount(`<w-autocomplete id="ac2" items="[A]" autocomplete="email"></w-autocomplete>`);
  await expect(page.locator('#ac2 .w-autocomplete-input')).toHaveAttribute('autocomplete', 'email');
});

test('w-autocomplete search seeds and re-filters the list', async ({ mount, page }) => {
  await mount(`<w-autocomplete id="ac" items="[Apple,Banana]" search="ban" open></w-autocomplete>`);

  await expect(page.locator('#ac .w-autocomplete-input')).toHaveValue('ban');
  await expect(page.locator('#ac .w-autocomplete-item[title="Banana"]')).toBeVisible();
  await expect(page.locator('#ac .w-autocomplete-item[title="Apple"]')).toBeHidden();

  await page.locator('#ac').evaluate((el) => el.setAttribute('search', 'app'));
  await expect(page.locator('#ac .w-autocomplete-input')).toHaveValue('app');
  await expect(page.locator('#ac .w-autocomplete-item[title="Apple"]')).toBeVisible();
  await expect(page.locator('#ac .w-autocomplete-item[title="Banana"]')).toBeHidden();
});

test('w-autocomplete menu is an alias of open', async ({ mount, page }) => {
  await mount(`<w-autocomplete id="ac" items="[A,B]" menu></w-autocomplete>`);
  await expect(page.locator('#ac .w-autocomplete-list')).toBeVisible();

  await page.locator('#ac').evaluate((el) => el.removeAttribute('menu'));
  await expect(page.locator('#ac .w-autocomplete-list')).toBeHidden();
});

test('w-autocomplete counter tracks the search text', async ({ mount, page }) => {
  await mount(`<w-autocomplete id="ac" items="[A]" counter></w-autocomplete>`);
  await expect(page.locator('#ac .w-autocomplete-counter')).toHaveText('0 / 25');

  await page.locator('#ac .w-autocomplete-input').fill('abc');
  await expect(page.locator('#ac .w-autocomplete-counter')).toHaveText('3 / 25');

  await mount(`<w-autocomplete id="ac2" items="[A]" counter="10"></w-autocomplete>`);
  await expect(page.locator('#ac2 .w-autocomplete-counter')).toHaveText('0 / 10');
});

test('w-autocomplete messages, error-messages, and max-errors render in the details row', async ({ mount, page }) => {
  await mount(`<w-autocomplete id="ac" items="[A]" messages="Pick one,Or two"></w-autocomplete>`);
  await expect(page.locator('#ac .w-autocomplete-message')).toHaveCount(2);
  await expect(page.locator('#ac .w-autocomplete-messages')).not.toHaveClass(/error/);

  await mount(`<w-autocomplete id="ac2" items="[A]" error-messages="Required,Too short"></w-autocomplete>`);
  await expect(page.locator('#ac2 .w-autocomplete-message')).toHaveCount(1);
  await expect(page.locator('#ac2 .w-autocomplete-message')).toHaveText('Required');
  await expect(page.locator('#ac2 .w-autocomplete-messages')).toHaveClass(/w-autocomplete-messages--error/);
  await expect(page.locator('#ac2 .w-field')).toHaveClass(/w-field-error/);

  await mount(`<w-autocomplete id="ac3" items="[A]" error-messages="Required,Too short" max-errors="2"></w-autocomplete>`);
  await expect(page.locator('#ac3 .w-autocomplete-message')).toHaveCount(2);
});

test('w-autocomplete hide-details suppresses the details row', async ({ mount, page }) => {
  await mount(`<w-autocomplete id="ac" items="[A]" counter hide-details></w-autocomplete>`);
  await expect(page.locator('#ac .w-autocomplete-details')).toHaveCount(0);

  await mount(`<w-autocomplete id="ac2" items="[A]" counter hide-details="auto"></w-autocomplete>`);
  await expect(page.locator('#ac2 .w-autocomplete-details')).toHaveCount(1);
});

test('w-autocomplete validate-on delays the error messages', async ({ mount, page }) => {
  await mount(`<w-autocomplete id="ac" items="[A]" counter error-messages="Required" validate-on="blur"></w-autocomplete>`);

  await expect(page.locator('#ac .w-autocomplete-message')).toHaveCount(0);
  await expect(page.locator('#ac .w-field')).not.toHaveClass(/w-field-error/);

  await page.locator('#ac .w-autocomplete-input').focus();
  await page.locator('#ac .w-autocomplete-input').blur();

  await expect(page.locator('#ac .w-autocomplete-message')).toHaveText('Required');
  await expect(page.locator('#ac .w-field')).toHaveClass(/w-field-error/);
});

test('w-autocomplete filter-keys searches extra record fields', async ({ mount, page }) => {
  await mount(`
    <w-autocomplete id="ac"
      items='[{"title":"Apple","value":"a","group":"fruit"},{"title":"Beet","value":"b","group":"veg"}]'
      filter-keys="group"></w-autocomplete>
  `);

  await page.locator('#ac .w-autocomplete-input').fill('fruit');
  await expect(page.locator('#ac .w-autocomplete-item[title="Apple"]')).toBeVisible();
  await expect(page.locator('#ac .w-autocomplete-item[title="Beet"]')).toBeHidden();
});

test('w-autocomplete filter-mode every requires all fields to match', async ({ mount, page }) => {
  const items = '[{"title":"Apple","value":"apple"},{"title":"Apple pie","value":"pie"}]';

  await mount(`<w-autocomplete id="some" items='${items}'></w-autocomplete>`);
  await page.locator('#some .w-autocomplete-input').fill('apple');
  await expect(page.locator('#some .w-autocomplete-item:visible')).toHaveCount(2);

  await mount(`<w-autocomplete id="every" items='${items}' filter-mode="every"></w-autocomplete>`);
  await page.locator('#every .w-autocomplete-input').fill('apple');
  await expect(page.locator('#every .w-autocomplete-item[title="Apple"]')).toBeVisible();
  await expect(page.locator('#every .w-autocomplete-item[title="Apple pie"]')).toBeHidden();
});

test('w-autocomplete filter-mode intersection needs both the keys and the rest to match', async ({ mount, page }) => {
  const items = '[{"title":"fruit salad","value":"s","group":"fruit"},{"title":"apple","value":"a","group":"fruit"}]';

  await mount(`<w-autocomplete id="union" items='${items}' filter-keys="group" filter-mode="union"></w-autocomplete>`);
  await page.locator('#union .w-autocomplete-input').fill('fruit');
  await expect(page.locator('#union .w-autocomplete-item:visible')).toHaveCount(2);

  await mount(`<w-autocomplete id="inter" items='${items}' filter-keys="group" filter-mode="intersection"></w-autocomplete>`);
  await page.locator('#inter .w-autocomplete-input').fill('fruit');
  await expect(page.locator('#inter .w-autocomplete-item[title="fruit salad"]')).toBeVisible();
  await expect(page.locator('#inter .w-autocomplete-item[title="apple"]')).toBeHidden();
});

test('w-autocomplete clear-on-select="false" keeps the search text', async ({ mount, page }) => {
  await mount(`<w-autocomplete id="keep" items="[Red,Green]" multiple clear-on-select="false"></w-autocomplete>`);
  await page.locator('#keep .w-autocomplete-input').fill('re');
  await page.locator('#keep .w-autocomplete-item[title="Red"]').click();
  await expect(page.locator('#keep .w-autocomplete-input')).toHaveValue('re');

  await mount(`<w-autocomplete id="wipe" items="[Red,Green]" multiple></w-autocomplete>`);
  await page.locator('#wipe .w-autocomplete-input').fill('re');
  await page.locator('#wipe .w-autocomplete-item[title="Red"]').click();
  await expect(page.locator('#wipe .w-autocomplete-input')).toHaveValue('');
});

test('w-autocomplete return-object submits the record and reports it on change', async ({ mount, page }) => {
  await mount(`
    <w-autocomplete id="ac" name="fruit" return-object
      items='[{"title":"Apple","value":"a","group":"fruit"}]'></w-autocomplete>
  `);
  await recordEvents(page, '#ac', ['change']);

  await page.locator('#ac .w-autocomplete-input').click();
  await page.locator('#ac .w-autocomplete-item[title="Apple"]').click();

  const hidden = await page.locator('#ac input[type="hidden"]').inputValue();
  expect(JSON.parse(hidden)).toMatchObject({ title: 'Apple', value: 'a', group: 'fruit' });

  const [event] = await readEvents(page, '#ac');
  expect(event.detail.item).toMatchObject({ title: 'Apple', group: 'fruit' });
});

test('w-autocomplete no-auto-scroll leaves the list scroll position alone', async ({ mount, page }) => {
  const items = Array.from({ length: 25 }, (_, index) => `Item${index}`).join(',');

  await mount(`<w-autocomplete id="scroll" items="[${items}]"></w-autocomplete>`);
  await page.locator('#scroll .w-autocomplete-input').focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('End');
  expect(await page.locator('#scroll .w-autocomplete-list').evaluate((el) => el.scrollTop)).toBeGreaterThan(0);

  await mount(`<w-autocomplete id="still" items="[${items}]" no-auto-scroll></w-autocomplete>`);
  await page.locator('#still .w-autocomplete-input').focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('End');
  await expect(page.locator('#still .w-autocomplete-item[title="Item24"]')).toHaveClass(/active/);
  expect(await page.locator('#still .w-autocomplete-list').evaluate((el) => el.scrollTop)).toBe(0);
});

test('w-autocomplete open-on-clear reopens the list after clearing', async ({ mount, page }) => {
  await mount(`<w-autocomplete id="ac" items="[A,B]" value="A" clearable open-on-clear></w-autocomplete>`);

  await page.locator('#ac .w-autocomplete-clear').click();
  await expect(page.locator('#ac .w-autocomplete-list')).toBeVisible();

  await mount(`<w-autocomplete id="ac2" items="[A,B]" value="A" clearable></w-autocomplete>`);
  await page.locator('#ac2 .w-autocomplete-clear').click();
  await expect(page.locator('#ac2 .w-autocomplete-list')).toBeHidden();
});

test('w-autocomplete menu-icon toggles the list and menu-elevation lands on it', async ({ mount, page }) => {
  await mount(`<w-autocomplete id="ac" items="[A,B]" menu-icon="expand" menu-elevation="4"></w-autocomplete>`);

  await expect(page.locator('#ac .w-autocomplete-list')).toHaveClass(/elevation-4/);
  await expect(page.locator('#ac .w-autocomplete-menu-icon .w-icon')).toHaveText('expand');

  await page.locator('#ac .w-autocomplete-menu-icon').click();
  await expect(page.locator('#ac .w-autocomplete-list')).toBeVisible();
  await page.locator('#ac .w-autocomplete-menu-icon').click();
  await expect(page.locator('#ac .w-autocomplete-list')).toBeHidden();
});

test('w-autocomplete item-color paints the selected option', async ({ mount, page }) => {
  await mount(`<w-autocomplete id="ac" items="[A,B]" value="A" item-color="#ff0000"></w-autocomplete>`);

  const color = await page.locator('#ac .w-autocomplete-item[title="A"]')
    .evaluate((el) => getComputedStyle(el).color);
  expect(color).toBe('rgb(255, 0, 0)');
});

test('w-autocomplete open-text and close-text label the input per menu state', async ({ mount, page }) => {
  await mount(`<w-autocomplete id="ac" items="[A]" open-text="Close list" close-text="Open list"></w-autocomplete>`);

  const input = page.locator('#ac .w-autocomplete-input');
  await expect(input).toHaveAttribute('aria-label', 'Open list');
  await expect(input).toHaveAttribute('title', 'Open list');

  await input.click();
  await expect(input).toHaveAttribute('aria-label', 'Close list');
  await expect(input).toHaveAttribute('title', 'Close list');
});

test('w-autocomplete uses its visible label as the default accessible name', async ({ mount, page }) => {
  await mount(`<w-autocomplete id="ac" label="Country" items="[Canada,Mexico]"></w-autocomplete>`);
  await expect(page.locator('#ac .w-autocomplete-input')).toHaveAttribute('aria-label', 'Country');
});

test('w-autocomplete persistent-hint keeps the hint beside the error', async ({ mount, page }) => {
  await mount(`<w-autocomplete id="ac" items="[A]" hint="Helper" error="Bad value"></w-autocomplete>`);
  await expect(page.locator('#ac .w-field-hint')).toHaveCount(1);
  await expect(page.locator('#ac .w-field-hint')).toHaveText('Bad value');

  await mount(`<w-autocomplete id="ac2" items="[A]" hint="Helper" error="Bad value" persistent-hint></w-autocomplete>`);
  await expect(page.locator('#ac2 .w-field-hint')).toHaveCount(2);
  await expect(page.locator('#ac2 .w-field-hint--persistent')).toHaveText('Helper');
});

test('w-autocomplete clear-icon replaces the clear glyph', async ({ mount, page }) => {
  await mount(`<w-autocomplete id="ac" items="[A]" value="A" clearable clear-icon="backspace"></w-autocomplete>`);
  await expect(page.locator('#ac .w-autocomplete-clear .w-icon')).toHaveText('backspace');
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
