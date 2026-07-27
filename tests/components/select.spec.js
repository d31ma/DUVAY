import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-select renders field, size, placeholder, options, and hidden input', async ({ mount, page }) => {
  await mount(`
    <w-select id="select" name="plan" label="Plan" hint="Choose carefully" placeholder="Pick one" size="lg">
      <w-option value="free">Free</w-option>
      <w-option value="pro">Pro</w-option>
    </w-select>
  `);

  await expect(page.locator('#select .w-field-label')).toHaveText('Plan');
  await expect(page.locator('#select .w-select-field')).toHaveAttribute('aria-label', 'Plan');
  await expect(page.locator('#select .w-field-hint')).toHaveText('Choose carefully');
  await expect(page.locator('#select .w-select-field')).toHaveClass(/w-select--lg/);
  await expect(page.locator('#select .w-select-placeholder')).toHaveText('Pick one');
  await expect(page.locator('#select input[type="hidden"]')).toHaveAttribute('name', 'plan');
  await expect(page.locator('#select .w-select-list')).toBeHidden();
  await expect(page.locator('#select .w-select-item')).toHaveCount(2);

  await page.locator('#select').evaluate((el) => {
    el.setAttribute('error', 'Required');
    el.setAttribute('size', 'sm');
  });
  await expect(page.locator('#select .w-field')).toHaveClass(/w-field-error/);
  await expect(page.locator('#select .w-field-hint')).toHaveText('Required');
  await expect(page.locator('#select .w-select-field')).toHaveClass(/w-select--sm/);
});

test('w-select opens, selects a single value, and closes', async ({ mount, page }) => {
  await mount(`
    <w-select id="select" name="plan">
      <w-option value="free">Free</w-option>
      <w-option value="pro">Pro</w-option>
    </w-select>
  `);
  await recordEvents(page, '#select', ['change']);

  await page.locator('#select .w-select-field').click();
  await expect(page.locator('#select .w-select-list')).toBeVisible();

  await page.locator('#select .w-select-item[value="pro"]').click();
  await expect(page.locator('#select')).toHaveAttribute('value', 'pro');
  await expect(page.locator('#select .w-select-list')).toBeHidden();
  await expect(page.locator('#select .w-select-value')).toHaveText('Pro');
  await expect(page.locator('#select input[type="hidden"]')).toHaveValue('pro');
  await expect(page.locator('#select .w-select-item[value="pro"]')).toHaveAttribute('aria-selected', 'true');

  expect(await readEvents(page, '#select')).toEqual([
    { type: 'change', detail: { value: 'pro', name: 'plan' } },
  ]);
});

test('w-select multiple selects several values as chips and keeps the menu open', async ({ mount, page }) => {
  await mount(`
    <w-select id="select" name="tags" multiple closable-chips>
      <w-option value="a">Alpha</w-option>
      <w-option value="b">Beta</w-option>
      <w-option value="c">Gamma</w-option>
    </w-select>
  `);

  await page.locator('#select .w-select-field').click();
  await page.locator('#select .w-select-item[value="a"]').click();
  await page.locator('#select .w-select-item[value="c"]').click();

  await expect(page.locator('#select')).toHaveAttribute('value', 'a,c');
  await expect(page.locator('#select .w-select-list')).toBeVisible();
  await expect(page.locator('#select w-chip')).toHaveCount(2);
  await expect(page.locator('#select .w-select-item[value="a"]')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#select .w-select-item[value="b"]')).toHaveAttribute('aria-selected', 'false');

  // Toggling a selected item removes it.
  await page.locator('#select .w-select-item[value="a"]').click();
  await expect(page.locator('#select')).toHaveAttribute('value', 'c');
  await expect(page.locator('#select w-chip')).toHaveCount(1);
});

test('w-select clearable resets the selection', async ({ mount, page }) => {
  await mount(`
    <w-select id="select" name="plan" clearable value="pro">
      <w-option value="free">Free</w-option>
      <w-option value="pro">Pro</w-option>
    </w-select>
  `);
  await recordEvents(page, '#select', ['change']);

  await expect(page.locator('#select .w-select-clear')).toBeVisible();
  await page.locator('#select .w-select-clear').click();
  await expect(page.locator('#select')).toHaveAttribute('value', '');
  await expect(page.locator('#select .w-select-clear')).toBeHidden();
  expect((await readEvents(page, '#select')).pop()).toEqual({ type: 'change', detail: { value: '', name: 'plan' } });
});

test('w-select keyboard opens, navigates, selects, and Escape closes', async ({ mount, page }) => {
  await mount(`
    <w-select id="select" name="plan">
      <w-option value="free">Free</w-option>
      <w-option value="pro">Pro</w-option>
      <w-option value="team">Team</w-option>
    </w-select>
  `);

  await page.locator('#select .w-select-field').focus();
  await page.keyboard.press('ArrowDown'); // opens, activates first
  await expect(page.locator('#select .w-select-list')).toBeVisible();
  await page.keyboard.press('ArrowDown'); // -> Pro
  await page.keyboard.press('Enter');
  await expect(page.locator('#select')).toHaveAttribute('value', 'pro');
  await expect(page.locator('#select .w-select-list')).toBeHidden();

  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#select .w-select-list')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#select .w-select-list')).toBeHidden();
});

test('w-select disabled does not open', async ({ mount, page }) => {
  await mount(`
    <w-select id="select" value="pro" disabled>
      <w-option value="free">Free</w-option>
      <w-option value="pro">Pro</w-option>
    </w-select>
  `);

  await expect(page.locator('#select .w-select-field')).toHaveAttribute('aria-disabled', 'true');
  await page.locator('#select .w-select-field').click({ force: true });
  await expect(page.locator('#select .w-select-list')).toBeHidden();
});

test('w-select updates the menu when w-option children change', async ({ mount, page }) => {
  await mount(`
    <w-select id="select" name="plan">
      <w-option value="free">Free</w-option>
      <w-option value="pro">Pro</w-option>
    </w-select>
  `);

  await page.locator('#select').evaluate((el) => {
    const option = document.createElement('w-option');
    option.setAttribute('value', 'team');
    option.textContent = 'Team';
    el.appendChild(option);
  });

  await expect(page.locator('#select .w-select-item[value="team"]')).toHaveText('Team');
});

test('w-select removes a value through a closable chip', async ({ mount, page }) => {
  await mount(`
    <w-select id="select" name="tags" multiple closable-chips value="a,b">
      <w-option value="a">Alpha</w-option>
      <w-option value="b">Beta</w-option>
    </w-select>
  `);
  await recordEvents(page, '#select', ['change']);

  await expect(page.locator('#select w-chip')).toHaveCount(2);
  await page.locator('#select w-chip[value="a"] .w-chip__close').click();

  await expect(page.locator('#select')).toHaveAttribute('value', 'b');
  await expect(page.locator('#select w-chip')).toHaveCount(1);
  await expect(page.locator('#select w-chip')).toHaveAttribute('value', 'b');
  expect((await readEvents(page, '#select')).pop()).toEqual({ type: 'change', detail: { value: 'b', name: 'tags' } });
});

test('w-select ignores close events from chips outside the component', async ({ mount, page }) => {
  await mount(`
    <w-select id="select" name="tags" multiple closable-chips value="a,b">
      <w-option value="a">Alpha</w-option>
      <w-option value="b">Beta</w-option>
    </w-select>
    <w-chip id="loose" value="a" closable>Alpha</w-chip>
  `);

  await page.locator('#loose .w-chip__close').click();
  await expect(page.locator('#select')).toHaveAttribute('value', 'a,b');
});

test('w-select keyboard Home, End, ArrowUp, Space, and Tab drive the open listbox', async ({ mount, page }) => {
  await mount(`
    <w-select id="select" name="plan">
      <w-option value="free">Free</w-option>
      <w-option value="pro">Pro</w-option>
      <w-option value="team">Team</w-option>
    </w-select>
  `);

  await page.locator('#select .w-select-field').focus();
  await page.keyboard.press('Enter'); // opens
  await expect(page.locator('#select .w-select-list')).toBeVisible();

  await page.keyboard.press('End');
  await expect(page.locator('#select .w-select-item[value="team"]')).toHaveClass(/active/);

  await page.keyboard.press('Home');
  await expect(page.locator('#select .w-select-item[value="free"]')).toHaveClass(/active/);

  await page.keyboard.press('ArrowUp'); // wraps to the last item
  await expect(page.locator('#select .w-select-item[value="team"]')).toHaveClass(/active/);

  await page.keyboard.press('Space');
  await expect(page.locator('#select')).toHaveAttribute('value', 'team');
  await expect(page.locator('#select .w-select-list')).toBeHidden();

  await page.keyboard.press('ArrowDown'); // reopens
  await expect(page.locator('#select .w-select-list')).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.locator('#select .w-select-list')).toBeHidden();

  // Unhandled keys leave the listbox untouched.
  await page.locator('#select .w-select-field').focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('x');
  await expect(page.locator('#select .w-select-list')).toBeVisible();
});

/* ── Vuetify field surface ───────────────────────────────────────────────── */

test('w-select variant, flat, and reverse restyle the control', async ({ mount, page }) => {
  await mount(`
    <w-select id="filled" variant="filled"><w-option value="a">A</w-option></w-select>
    <w-select id="solo" variant="solo"><w-option value="a">A</w-option></w-select>
    <w-select id="flat" variant="solo" flat><w-option value="a">A</w-option></w-select>
    <w-select id="rev" reverse><w-option value="a">A</w-option></w-select>
  `);

  const styleOf = (id, prop) => page.locator(`#${id} .w-select-field`).evaluate(
    (el, name) => getComputedStyle(el)[name], prop);

  expect(await styleOf('filled', 'borderTopWidth')).toBe('0px');
  expect(await styleOf('filled', 'borderBottomWidth')).toBe('1px');
  expect(await styleOf('solo', 'boxShadow')).not.toBe('none');
  expect(await styleOf('flat', 'boxShadow')).toBe('none');
  expect(await styleOf('rev', 'flexDirection')).toBe('row-reverse');
});

test('w-select active and glow tint the control and its icons', async ({ mount, page }) => {
  await mount(`
    <w-select id="plain"><w-option value="a">A</w-option></w-select>
    <w-select id="active" active><w-option value="a">A</w-option></w-select>
    <w-select id="glow" glow><w-option value="a">A</w-option></w-select>
  `);

  const borderOf = (id) => page.locator(`#${id} .w-select-field`).evaluate((el) => getComputedStyle(el).borderColor);
  expect(await borderOf('active')).not.toBe(await borderOf('plain'));

  const chevron = page.locator('#glow .w-select-chevron');
  const resting = await chevron.evaluate((el) => getComputedStyle(el).color);
  await page.locator('#glow .w-select-field').focus();
  expect(await chevron.evaluate((el) => getComputedStyle(el).color)).not.toBe(resting);
});

test('w-select single-line drops the label into the placeholder', async ({ mount, page }) => {
  await mount('<w-select id="s" label="Plan" single-line><w-option value="a">A</w-option></w-select>');

  await expect(page.locator('#s .w-field-label')).toHaveCount(0);
  await expect(page.locator('#s .w-select-placeholder')).toHaveText('Plan');
});

test('w-select prefix, suffix, and center-affix render inside the control', async ({ mount, page }) => {
  await mount(`
    <w-select id="s" prefix="$" suffix="/mo"><w-option value="a">A</w-option></w-select>
    <w-select id="c" prefix="$" center-affix><w-option value="a">A</w-option></w-select>
  `);

  await expect(page.locator('#s .w-field-prefix')).toHaveText('$');
  await expect(page.locator('#s .w-field-suffix')).toHaveText('/mo');
  expect(await page.locator('#c .w-field-prefix').evaluate((el) => getComputedStyle(el).alignSelf)).toBe('center');
});

test('w-select renders outer and inner icons and colors them', async ({ mount, page }) => {
  await mount(`
    <w-select id="s" prepend-icon="star" append-icon="flag"
      prepend-inner-icon="search" append-inner-icon="info" icon-color="#ff0000">
      <w-option value="a">A</w-option>
    </w-select>
  `);

  await expect(page.locator('#s .w-field-prepend')).toHaveText('star');
  await expect(page.locator('#s .w-field-append')).toHaveText('flag');
  await expect(page.locator('#s .w-field-prepend-inner')).toHaveText('search');
  await expect(page.locator('#s .w-field-append-inner')).toHaveText('info');
  expect(await page.locator('#s .w-select-chevron').evaluate((el) => getComputedStyle(el).color)).toBe('rgb(255, 0, 0)');
});

test('w-select menu-icon replaces or removes the chevron', async ({ mount, page }) => {
  await mount(`
    <w-select id="custom" menu-icon="caret"><w-option value="a">A</w-option></w-select>
    <w-select id="none" menu-icon="false"><w-option value="a">A</w-option></w-select>
  `);

  await expect(page.locator('#custom .w-select-chevron')).toHaveText('caret');
  await expect(page.locator('#none .w-select-chevron')).toHaveCount(0);
});

test('w-select clear-icon, persistent-clear, and open-on-clear', async ({ mount, page }) => {
  await mount(`
    <w-select id="s" clearable clear-icon="reset" persistent-clear open-on-clear value="a">
      <w-option value="a">A</w-option>
      <w-option value="b">B</w-option>
    </w-select>
  `);

  await expect(page.locator('#s .w-select-clear')).toHaveText('reset');
  await page.locator('#s .w-select-clear').click();
  await expect(page.locator('#s')).toHaveAttribute('value', '');
  await expect(page.locator('#s .w-select-list')).toBeVisible();
  // persistent-clear keeps the button available with nothing selected.
  await expect(page.locator('#s .w-select-clear')).toBeVisible();
});

test('w-select persistent-placeholder keeps the placeholder beside the value', async ({ mount, page }) => {
  await mount(`
    <w-select id="s" placeholder="Pick one" persistent-placeholder value="a">
      <w-option value="a">Alpha</w-option>
    </w-select>
  `);

  await expect(page.locator('#s .w-select-placeholder')).toHaveText('Pick one');
  await expect(page.locator('#s .w-select-value')).toHaveText('Alpha');
});

test('w-select menu opens the listbox on render and menu-elevation raises it', async ({ mount, page }) => {
  await mount('<w-select id="s" menu menu-elevation="4"><w-option value="a">A</w-option></w-select>');

  await expect(page.locator('#s .w-select-list')).toBeVisible();
  await expect(page.locator('#s .w-select-list')).toHaveClass(/elevation-4/);
  expect(await page.locator('#s .w-select-list').evaluate((el) => getComputedStyle(el).boxShadow)).not.toBe('none');
});

test('w-select transition animates the menu while it is open', async ({ mount, page }) => {
  await mount('<w-select id="s" transition="fade"><w-option value="a">A</w-option></w-select>');

  await expect(page.locator('#s .w-select-list')).not.toHaveClass(/w-animate-fade-in/);
  await page.locator('#s .w-select-field').click();
  await expect(page.locator('#s .w-select-list')).toHaveClass(/w-animate-fade-in/);
});

test('w-select item-color recolors the selected option', async ({ mount, page }) => {
  await mount(`
    <w-select id="s" item-color="#00ff00" value="a">
      <w-option value="a">A</w-option>
      <w-option value="b">B</w-option>
    </w-select>
  `);

  const color = await page.locator('#s .w-select-item[value="a"]').evaluate((el) => getComputedStyle(el).color);
  expect(color).toBe('rgb(0, 255, 0)');
});

test('w-select no-auto-scroll leaves the menu unscrolled', async ({ mount, page }) => {
  const options = Array.from({ length: 30 }, (_, i) => `<w-option value="v${i}">Item ${i}</w-option>`).join('');
  await mount(`
    <w-select id="scrolls" value="v29">${options}</w-select>
    <w-select id="still" value="v29" no-auto-scroll>${options}</w-select>
  `);

  await page.locator('#scrolls .w-select-field').click();
  expect(await page.locator('#scrolls .w-select-list').evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
  await page.locator('#scrolls .w-select-field').click(); // close before reaching the next menu

  await page.locator('#still .w-select-field').click();
  expect(await page.locator('#still .w-select-list').evaluate((el) => el.scrollTop)).toBe(0);
});

test('w-select open-text and close-text label the trigger', async ({ mount, page }) => {
  await mount('<w-select id="s" open-text="Close menu" close-text="Open menu"><w-option value="a">A</w-option></w-select>');

  const trigger = page.locator('#s .w-select-field');
  await expect(trigger).toHaveAttribute('aria-label', 'Open menu');
  await expect(trigger).toHaveAttribute('title', 'Open menu');
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-label', 'Close menu');
});

test('w-select autofocus focuses the trigger and autocomplete reaches the hidden input', async ({ mount, page }) => {
  await mount('<w-select id="s" name="plan" autofocus autocomplete="suppress"><w-option value="a">A</w-option></w-select>');

  await expect(page.locator('#s .w-select-field')).toBeFocused();
  await expect(page.locator('#s input[type="hidden"]')).toHaveAttribute('autocomplete', 'off');
});

/* ── Items, filtering, and the details row ───────────────────────────────── */

test('w-select builds options from items with item-title and item-value', async ({ mount, page }) => {
  await mount(`
    <w-select id="s" item-title="name" item-value="id"
      items='[{"name":"Free","id":"f"},{"name":"Pro","id":"p"}]'></w-select>
  `);

  await expect(page.locator('#s .w-select-item')).toHaveCount(2);
  await expect(page.locator('#s .w-select-item[value="p"] .w-select-item-label')).toHaveText('Pro');
});

test('w-select return-object reports the whole item on change', async ({ mount, page }) => {
  await mount(`
    <w-select id="s" return-object item-title="name" item-value="id"
      items='[{"name":"Free","id":"f","tier":1}]'></w-select>
  `);
  await recordEvents(page, '#s', ['change']);

  await page.locator('#s .w-select-field').click();
  await page.locator('#s .w-select-item[value="f"]').click();

  expect((await readEvents(page, '#s')).pop().detail.value).toEqual({ name: 'Free', id: 'f', tier: 1 });
});

test('w-select search filters options and no-filter disables it', async ({ mount, page }) => {
  await mount(`
    <w-select id="s" items="Apple,Banana,Cherry" search="an"></w-select>
    <w-select id="raw" items="Apple,Banana,Cherry" search="an" no-filter></w-select>
  `);

  await expect(page.locator('#s .w-select-item[value="Banana"]')).toBeHidden();
  await page.locator('#s .w-select-field').click();
  await expect(page.locator('#s .w-select-item[value="Banana"]')).toBeVisible();
  await expect(page.locator('#s .w-select-item[value="Apple"]')).toBeHidden();
  await page.locator('#s .w-select-field').click(); // close before reaching the next menu

  await page.locator('#raw .w-select-field').click();
  await expect(page.locator('#raw .w-select-item[value="Apple"]')).toBeVisible();
});

test('w-select filter-keys and filter-mode narrow the search', async ({ mount, page }) => {
  const items = `items='[{"title":"Alpha","code":"AA"},{"title":"Alba","code":"XX"}]'`;
  await mount(`
    <w-select id="some" ${items} filter-keys='["title","code"]' search="a"></w-select>
    <w-select id="every" ${items} filter-keys='["title","code"]' filter-mode="every" search="a"></w-select>
  `);

  await page.locator('#some .w-select-field').click();
  await expect(page.locator('#some .w-select-item[value="Alba"]')).toBeVisible();
  await page.locator('#some .w-select-field').click(); // close before reaching the next menu

  await page.locator('#every .w-select-field').click();
  await expect(page.locator('#every .w-select-item[value="Alpha"]')).toBeVisible();
  await expect(page.locator('#every .w-select-item[value="Alba"]')).toBeHidden();
});

test('w-select hide-selected removes chosen options from the menu', async ({ mount, page }) => {
  await mount(`
    <w-select id="s" multiple hide-selected>
      <w-option value="a">A</w-option>
      <w-option value="b">B</w-option>
    </w-select>
  `);

  await page.locator('#s .w-select-field').click();
  await page.locator('#s .w-select-item[value="a"]').click();
  await expect(page.locator('#s .w-select-item[value="a"]')).toBeHidden();
  await expect(page.locator('#s .w-select-item[value="b"]')).toBeVisible();
});

test('w-select no-data-text shows when the menu is empty and hide-no-data suppresses it', async ({ mount, page }) => {
  await mount(`
    <w-select id="s" items="[]" no-data-text="Nothing here"></w-select>
    <w-select id="quiet" items="[]" hide-no-data></w-select>
  `);

  await page.locator('#s .w-select-field').click();
  await expect(page.locator('#s .w-select-empty')).toBeVisible();
  await expect(page.locator('#s .w-select-empty')).toHaveText('Nothing here');
  await expect(page.locator('#quiet .w-select-empty')).toHaveCount(0);
});

test('w-select messages, error-messages, and max-errors fill the details row', async ({ mount, page }) => {
  await mount(`
    <w-select id="s" messages="Heads up" error-messages='["Too few","Too many"]' max-errors="2">
      <w-option value="a">A</w-option>
    </w-select>
  `);

  await expect(page.locator('#s .w-field')).toHaveClass(/w-field-error/);
  await expect(page.locator('#s .w-field-hint')).toHaveText('Too few');
  await expect(page.locator('#s .w-field-message')).toHaveText(['Too many', 'Heads up']);
  await expect(page.locator('#s .w-field-message--error')).toHaveCount(1);
});

test('w-select persistent-hint keeps the hint beside an error', async ({ mount, page }) => {
  await mount(`
    <w-select id="s" hint="Pick your plan" error="Required" persistent-hint>
      <w-option value="a">A</w-option>
    </w-select>
  `);

  await expect(page.locator('#s .w-field-hint')).toHaveText('Required');
  await expect(page.locator('#s .w-field-message')).toHaveText(['Pick your plan']);
});

test('w-select validate-on lazy withholds errors until the field is used', async ({ mount, page }) => {
  await mount(`
    <w-select id="lazy" error-messages="Required" validate-on="lazy">
      <w-option value="a">A</w-option>
    </w-select>
    <w-select id="onblur" error-messages="Required" validate-on="blur lazy">
      <w-option value="a">A</w-option>
    </w-select>
  `);

  await expect(page.locator('#lazy .w-field-hint')).toHaveCount(0);
  await page.locator('#lazy .w-select-field').click();
  await page.locator('#lazy .w-select-item[value="a"]').click();
  await expect(page.locator('#lazy .w-field-hint')).toHaveText('Required');

  // `blur` waits for the field to be left, so selecting is not enough.
  await page.locator('#onblur .w-select-field').click();
  await page.locator('#onblur .w-select-item[value="a"]').click();
  await expect(page.locator('#onblur .w-field-hint')).toHaveCount(0);
  await page.locator('#onblur .w-select-field').blur();
  await expect(page.locator('#onblur .w-field-hint')).toHaveText('Required');
});

test('w-select counter tracks the selection and persistent-counter always shows it', async ({ mount, page }) => {
  await mount(`
    <w-select id="s" multiple counter="3">
      <w-option value="a">A</w-option>
      <w-option value="b">B</w-option>
    </w-select>
    <w-select id="p" multiple counter="3" persistent-counter>
      <w-option value="a">A</w-option>
    </w-select>
  `);

  await expect(page.locator('#p .w-field-counter')).toHaveText('0 / 3');
  await expect(page.locator('#s .w-field-counter')).toHaveCount(0);

  await page.locator('#s .w-select-field').click();
  await page.locator('#s .w-select-item[value="a"]').click();
  await page.locator('#s .w-select-item[value="b"]').click();
  await expect(page.locator('#s .w-field-counter')).toHaveText('2 / 3');
});

test('w-select hide-details removes the details row and indent-details insets it', async ({ mount, page }) => {
  await mount(`
    <w-select id="s" hint="Helper" counter hide-details><w-option value="a">A</w-option></w-select>
    <w-select id="i" hint="Helper" indent-details><w-option value="a">A</w-option></w-select>
  `);

  await expect(page.locator('#s .w-field-details')).toHaveCount(0);
  await expect(page.locator('#s .w-field-hint')).toHaveCount(0);
  expect(await page.locator('#i .w-field-details').evaluate((el) => getComputedStyle(el).paddingLeft)).toBe('12px');
});
