import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-date-input renders field attributes and size', async ({ mount, page }) => {
  await mount('<w-date-input id="di" label="Start" hint="Pick a date" placeholder="yyyy-mm-dd" size="lg" name="start" value="2026-06-12"></w-date-input>');

  await expect(page.locator('#di .w-field-label')).toHaveText('Start');
  await expect(page.locator('#di .w-field-hint')).toHaveText('Pick a date');
  await expect(page.locator('#di .w-date-input-field')).toHaveAttribute('placeholder', 'yyyy-mm-dd');
  await expect(page.locator('#di .w-date-input-field')).toHaveAttribute('name', 'start');
  await expect(page.locator('#di .w-date-input-field')).toHaveClass(/w-input--lg/);
  await expect(page.locator('#di .w-date-input-field')).toHaveValue('2026-06-12');
});

test('w-date-input shows error state', async ({ mount, page }) => {
  await mount('<w-date-input id="di" label="Start" error="Required"></w-date-input>');

  await expect(page.locator('#di .w-field')).toHaveClass(/w-field-error/);
  await expect(page.locator('#di .w-field-hint')).toHaveText('Required');
});

test('w-date-input opens popup and selects a date', async ({ mount, page }) => {
  await mount('<w-date-input id="di" label="Start" value="2026-06-12"></w-date-input>');
  await recordEvents(page, '#di', ['change']);

  await page.locator('#di .w-date-input-icon').click();
  await expect(page.locator('#di .w-date-input-popup')).toBeVisible();

  await page.locator('#di [data-date="2026-06-15"]').click();

  await expect(page.locator('#di .w-date-input-popup')).toBeHidden();
  await expect(page.locator('#di')).toHaveAttribute('value', '2026-06-15');
  await expect(page.locator('#di .w-date-input-field')).toHaveValue('2026-06-15');
  expect(await readEvents(page, '#di')).toEqual([{ type: 'change', detail: { value: '2026-06-15', name: '' } }]);
});

test('w-date-input formats display value', async ({ mount, page }) => {
  await mount('<w-date-input id="di" value="2026-06-12" format="MM/dd/yyyy"></w-date-input>');

  await expect(page.locator('#di .w-date-input-field')).toHaveValue('06/12/2026');
});

test('w-date-input clearable clears the value', async ({ mount, page }) => {
  await mount('<w-date-input id="di" value="2026-06-12" clearable=""></w-date-input>');
  await recordEvents(page, '#di', ['change']);

  await page.locator('#di .w-date-input-clear').click();

  await expect(page.locator('#di')).toHaveAttribute('value', '');
  await expect(page.locator('#di .w-date-input-field')).toHaveValue('');
  await expect(page.locator('#di .w-date-input-clear')).toBeHidden();
  expect(await readEvents(page, '#di')).toEqual([{ type: 'change', detail: { value: '', name: '' } }]);
});

test('w-date-input rejects single value outside min/max', async ({ mount, page }) => {
  await mount('<w-date-input id="di" value="2026-06-12" min="2026-06-10" max="2026-06-20"></w-date-input>');

  await page.locator('#di .w-date-input-field').fill('2026-06-25');
  await page.locator('#di .w-date-input-field').dispatchEvent('change');

  await expect(page.locator('#di')).toHaveAttribute('value', '2026-06-12');
  await expect(page.locator('#di .w-date-input-field')).toHaveValue('2026-06-12');
});

test('w-date-input supports multiple mode', async ({ mount, page }) => {
  await mount('<w-date-input id="di" mode="multiple" value="2026-06-12"></w-date-input>');

  await page.locator('#di .w-date-input-icon').click();
  await page.locator('#di [data-date="2026-06-15"]').click();
  await page.locator('#di [data-date="2026-06-12"]').click();

  await expect(page.locator('#di')).toHaveAttribute('value', '2026-06-15');
});

test('w-date-input supports range mode', async ({ mount, page }) => {
  await page.clock.setFixedTime(new Date('2026-06-01T12:00:00'));
  await mount('<w-date-input id="di" mode="range"></w-date-input>');

  await page.locator('#di .w-date-input-icon').click();
  await page.locator('#di [data-date="2026-06-10"]').click();
  await page.locator('#di [data-date="2026-06-14"]').click();

  await expect(page.locator('#di')).toHaveAttribute('value', '2026-06-10,2026-06-14');
  await expect(page.locator('#di .w-date-input-field')).toHaveValue('2026-06-10 – 2026-06-14');
});

test('w-date-input emits input while typing', async ({ mount, page }) => {
  await mount('<w-date-input id="di" name="dob"></w-date-input>');
  await recordEvents(page, '#di', ['input', 'change']);

  await page.locator('#di .w-date-input-field').fill('2026-06-15');
  await page.locator('#di .w-date-input-field').dispatchEvent('change');

  const events = await readEvents(page, '#di');
  expect(events).toContainEqual({ type: 'input', detail: { value: '2026-06-15', name: 'dob' } });
  expect(events).toContainEqual({ type: 'change', detail: { value: '2026-06-15', name: 'dob' } });
});

test('w-date-input closes popup on Escape and outside click', async ({ mount, page }) => {
  await mount(`
    <div>
      <button id="outside">Outside</button>
      <w-date-input id="di" value="2026-06-12"></w-date-input>
    </div>
  `);

  await page.locator('#di .w-date-input-icon').click();
  await expect(page.locator('#di .w-date-input-popup')).toBeVisible();

  await page.locator('#di .w-date-input-field').press('Escape');
  await expect(page.locator('#di .w-date-input-popup')).toBeHidden();

  await page.locator('#di .w-date-input-icon').click();
  await page.locator('#outside').click();
  await expect(page.locator('#di .w-date-input-popup')).toBeHidden();
});

test('w-date-input does not render label when attribute is omitted', async ({ mount, page }) => {
  await mount('<w-date-input id="di" value="2026-06-12"></w-date-input>');

  await expect(page.locator('#di .w-field-label')).not.toBeVisible();
  await expect(page.locator('#di .w-date-input-field')).toHaveValue('2026-06-12');
});

test('w-date-input readonly disables calendar icon and hides clear button', async ({ mount, page }) => {
  await mount('<w-date-input id="di" value="2026-06-12" readonly=""></w-date-input>');

  const icon = page.locator('#di .w-date-input-icon');
  await expect(icon).toBeDisabled();
  await expect(page.locator('#di .w-date-input-popup')).toBeHidden();
  await expect(page.locator('#di .w-date-input-clear')).not.toBeVisible();
});

test('w-date-input popup syncs to value month and year', async ({ mount, page }) => {
  await mount('<w-date-input id="di" value="2026-03-15"></w-date-input>');

  await page.locator('#di .w-date-input-icon').click();
  await expect(page.locator('#di .w-date-input-popup')).toBeVisible();
  await expect(page.locator('#di .w-date-input-popup .w-date-picker-title')).toHaveText('March 2026');
});

test('w-date-input passes first-day-of-week and show-adjacent-months to picker', async ({ mount, page }) => {
  await mount('<w-date-input id="di" value="2026-06-12" first-day-of-week="1" show-adjacent-months=""></w-date-input>');

  await page.locator('#di .w-date-input-icon').click();
  const picker = page.locator('#di .w-date-input-popup w-date-picker');
  await expect(picker).toHaveAttribute('first-day-of-week', '1');
  await expect(picker).toHaveAttribute('show-adjacent-months', '');

  const headers = await page.locator('#di .w-date-picker-weekday').allTextContents();
  expect(headers).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  const others = await page.locator('#di .w-date-picker-day.other-month').count();
  expect(others).toBeGreaterThan(0);
});

test('w-date-input parses a typed locale date in single mode', async ({ mount, page }) => {
  await mount('<w-date-input id="di" value="2026-06-12"></w-date-input>');

  await page.locator('#di .w-date-input-field').fill('06/15/2026');
  await page.locator('#di .w-date-input-field').dispatchEvent('change');

  await expect(page.locator('#di')).toHaveAttribute('value', '2026-06-15');
  await expect(page.locator('#di .w-date-input-field')).toHaveValue('2026-06-15');
});

test('w-date-input keeps the previous value when typed text is not a date', async ({ mount, page }) => {
  await mount('<w-date-input id="di" value="2026-06-12"></w-date-input>');

  await page.locator('#di .w-date-input-field').fill('not a date');
  await page.locator('#di .w-date-input-field').dispatchEvent('change');

  await expect(page.locator('#di')).toHaveAttribute('value', '2026-06-12');
  await expect(page.locator('#di .w-date-input-field')).toHaveValue('2026-06-12');
});

test('w-date-input clears the value when the field is emptied', async ({ mount, page }) => {
  await mount('<w-date-input id="di" value="2026-06-12"></w-date-input>');

  await page.locator('#di .w-date-input-field').fill('   ');
  await page.locator('#di .w-date-input-field').dispatchEvent('change');

  await expect(page.locator('#di')).toHaveAttribute('value', '');
  await expect(page.locator('#di .w-date-input-field')).toHaveValue('');
});

test('w-date-input parses typed lists in multiple mode and drops bad entries', async ({ mount, page }) => {
  await mount('<w-date-input id="di" mode="multiple" value="2026-06-12"></w-date-input>');

  await page.locator('#di .w-date-input-field').fill('2026-06-15; 06/20/2026, nope');
  await page.locator('#di .w-date-input-field').dispatchEvent('change');

  await expect(page.locator('#di')).toHaveAttribute('value', '2026-06-15,2026-06-20');
});

test('w-date-input parses a typed range and keeps the value for partial input', async ({ mount, page }) => {
  await mount('<w-date-input id="di" mode="range" value="2026-06-01,2026-06-05"></w-date-input>');

  const field = page.locator('#di .w-date-input-field');

  await field.fill('06/10/2026,06/14/2026');
  await field.dispatchEvent('change');
  await expect(page.locator('#di')).toHaveAttribute('value', '2026-06-10,2026-06-14');

  await field.fill('june');
  await field.dispatchEvent('change');
  await expect(page.locator('#di')).toHaveAttribute('value', '2026-06-10,2026-06-14');

  await field.fill('start,end');
  await field.dispatchEvent('change');
  await expect(page.locator('#di')).toHaveAttribute('value', '2026-06-10,2026-06-14');
});

/* ── Vuetify parity: field surface ────────────────────────────────────────── */

test('w-date-input applies presentation modifier classes', async ({ mount, page }) => {
  await mount(`<w-date-input id="di" value="2026-06-12" variant="filled" flat reverse active dirty
    single-line center-affix glow indent-details persistent-placeholder persistent-counter
    persistent-clear persistent-hint hide-spin-buttons mobile></w-date-input>`);

  const root = page.locator('#di .w-date-input');
  for (const name of [
    'w-date-input--filled', 'w-date-input--flat', 'w-date-input--reverse',
    'w-date-input--active', 'w-date-input--dirty', 'w-date-input--single-line',
    'w-date-input--center-affix', 'w-date-input--glow', 'w-date-input--indent-details',
    'w-date-input--persistent-placeholder', 'w-date-input--persistent-counter',
    'w-date-input--persistent-clear', 'w-date-input--persistent-hint',
    'w-date-input--hide-spin-buttons', 'w-date-input--mobile',
  ]) {
    await expect(root).toHaveClass(new RegExp(name + '(\\s|$)'));
  }
});

test('w-date-input marks the field dirty only when it holds a value', async ({ mount, page }) => {
  await mount('<w-date-input id="a"></w-date-input><w-date-input id="b" value="2026-06-12"></w-date-input>');

  await expect(page.locator('#a .w-date-input')).not.toHaveClass(/w-date-input--dirty/);
  await expect(page.locator('#b .w-date-input')).toHaveClass(/w-date-input--dirty/);
});

test('w-date-input forwards type, autocomplete and autofocus to the input', async ({ mount, page }) => {
  await mount('<w-date-input id="di" type="search" autocomplete="bday" autofocus name="dob"></w-date-input>');

  const field = page.locator('#di .w-date-input-field');
  await expect(field).toHaveAttribute('type', 'search');
  await expect(field).toHaveAttribute('autocomplete', 'bday');
  await expect(field).toHaveAttribute('autofocus', '');
  await expect(field).toHaveAttribute('name', 'dob');
});

test('w-date-input autocomplete="suppress" turns autofill off and perturbs the name', async ({ mount, page }) => {
  await mount('<w-date-input id="di" autocomplete="suppress" name="dob"></w-date-input>');

  const field = page.locator('#di .w-date-input-field');
  await expect(field).toHaveAttribute('autocomplete', 'off');
  await expect(field).not.toHaveAttribute('name', 'dob');
  expect(await field.getAttribute('name')).toMatch(/^w-di-/);
});

test('w-date-input renders prefix and suffix text', async ({ mount, page }) => {
  await mount('<w-date-input id="di" prefix="from" suffix="UTC"></w-date-input>');

  await expect(page.locator('#di .w-date-input-prefix')).toHaveText('from');
  await expect(page.locator('#di .w-date-input-suffix')).toHaveText('UTC');
});

test('w-date-input renders outer, inner and clear icons', async ({ mount, page }) => {
  await mount(`<w-date-input id="di" value="2026-06-12" clearable prepend-icon="lead" append-icon="trail"
    prepend-inner-icon="in-lead" append-inner-icon="in-trail" clear-icon="x-mark"></w-date-input>`);

  await expect(page.locator('#di .w-date-input-prepend .w-icon')).toHaveText('lead');
  await expect(page.locator('#di .w-date-input-append .w-icon')).toHaveText('trail');
  await expect(page.locator('#di .w-date-input-prepend-inner .w-icon')).toHaveText('in-lead');
  await expect(page.locator('#di .w-date-input-append-inner .w-icon')).toHaveText('in-trail');
  await expect(page.locator('#di .w-date-input-clear .w-icon')).toHaveText('x-mark');
});

test('w-date-input icon-color, control-height and landscape-header-width set custom properties', async ({ mount, page }) => {
  await mount('<w-date-input id="di" icon-color="primary" header-color="surface" control-height="3rem" landscape-header-width="180"></w-date-input>');

  const style = await page.locator('#di .w-date-input').getAttribute('style');
  expect(style).toContain('--w-di-icon-color:var(--w-primary');
  expect(style).toContain('--w-di-header-color:var(--w-surface');
  expect(style).toContain('--w-di-control-height:3rem');
  expect(style).toContain('--w-di-header-width:180px');
});

/* ── Vuetify parity: details, messages, counter ───────────────────────────── */

test('w-date-input counter tracks the field text', async ({ mount, page }) => {
  await mount('<w-date-input id="di" counter value="2026-06-12" update-on="enter"></w-date-input>');

  await expect(page.locator('#di .w-date-input-counter')).toHaveText('10 / 25');

  await page.locator('#di .w-date-input-field').fill('2026-06');
  await expect(page.locator('#di .w-date-input-counter')).toHaveText('7 / 25');
});

test('w-date-input counter accepts an explicit limit', async ({ mount, page }) => {
  await mount('<w-date-input id="di" counter="8"></w-date-input>');

  await expect(page.locator('#di .w-date-input-counter')).toHaveText('0 / 8');
});

test('w-date-input renders extra messages below the hint', async ({ mount, page }) => {
  await mount('<w-date-input id="di" hint="Pick" messages="Also this,And this"></w-date-input>');

  expect(await page.locator('#di .w-field-hint').allTextContents()).toEqual(['Pick', 'Also this', 'And this']);
});

test('w-date-input error-messages set the error state and honour max-errors', async ({ mount, page }) => {
  await mount('<w-date-input id="one" error-messages="Bad,Worse"></w-date-input><w-date-input id="two" error-messages="Bad,Worse" max-errors="2"></w-date-input>');

  await expect(page.locator('#one .w-date-input')).toHaveClass(/w-field-error/);
  expect(await page.locator('#one .w-field-hint').allTextContents()).toEqual(['Bad']);
  expect(await page.locator('#two .w-field-hint').allTextContents()).toEqual(['Bad', 'Worse']);
});

test('w-date-input persistent-hint keeps the hint visible beside an error', async ({ mount, page }) => {
  await mount('<w-date-input id="di" hint="Pick a date" error="Required" persistent-hint></w-date-input>');

  expect(await page.locator('#di .w-field-hint').allTextContents()).toEqual(['Required', 'Pick a date']);
});

test('w-date-input hide-details removes the details row', async ({ mount, page }) => {
  await mount('<w-date-input id="di" hint="Pick" hide-details></w-date-input>');

  await expect(page.locator('#di .w-date-input-details')).toHaveCount(0);
  await expect(page.locator('#di .w-date-input-field')).not.toHaveAttribute('aria-describedby', /./);
});

test('w-date-input hide-details="auto" collapses only when there is nothing to show', async ({ mount, page }) => {
  await mount('<w-date-input id="empty" hide-details="auto"></w-date-input><w-date-input id="full" hint="Pick" hide-details="auto"></w-date-input>');

  await expect(page.locator('#empty .w-date-input-details')).toBeHidden();
  await expect(page.locator('#full .w-date-input-details')).toBeVisible();
});

test('w-date-input describes the field with its details row', async ({ mount, page }) => {
  await mount('<w-date-input id="di" hint="Pick"></w-date-input>');

  const described = await page.locator('#di .w-date-input-field').getAttribute('aria-describedby');
  expect(described).toBeTruthy();
  await expect(page.locator('#di .w-date-input-details')).toHaveAttribute('id', described);
});

/* ── Vuetify parity: validation ───────────────────────────────────────────── */

test('w-date-input validate-on="eager" reports an unparseable value on mount', async ({ mount, page }) => {
  await mount('<w-date-input id="di" value="nope" validate-on="eager"></w-date-input>');

  await expect(page.locator('#di .w-field-hint')).toHaveText('Enter a valid date');
  await expect(page.locator('#di .w-date-input')).toHaveClass(/w-field-error/);
  await expect(page.locator('#di .w-date-input-field')).toHaveAttribute('aria-invalid', 'true');
});

test('w-date-input validation-value is validated instead of the field text', async ({ mount, page }) => {
  await mount('<w-date-input id="di" value="2026-06-12" validation-value="not a date" validate-on="eager"></w-date-input>');

  await expect(page.locator('#di .w-field-hint')).toHaveText('Enter a valid date');
});

test('w-date-input eager validation reports out-of-range and disallowed dates', async ({ mount, page }) => {
  await mount(`<w-date-input id="range" value="2026-06-25" min="2026-06-10" max="2026-06-20" validate-on="eager"></w-date-input>
    <w-date-input id="allow" value="2026-06-12" allowed-dates="2026-06-15" validate-on="eager"></w-date-input>`);

  await expect(page.locator('#range .w-field-hint')).toHaveText('Date is out of range');
  await expect(page.locator('#allow .w-field-hint')).toHaveText('Date is not available');
});

test('w-date-input validates on input by default', async ({ mount, page }) => {
  await mount('<w-date-input id="di" update-on="enter"></w-date-input>');

  await page.locator('#di .w-date-input-field').fill('not a date');
  await expect(page.locator('#di .w-field-hint')).toHaveText('Enter a valid date');

  await page.locator('#di .w-date-input-field').fill('2026-06-15');
  await expect(page.locator('#di .w-field-hint')).toHaveCount(0);
});

test('w-date-input validate-on="blur lazy" defers validation until blur', async ({ mount, page }) => {
  await mount('<w-date-input id="di" update-on="enter" validate-on="blur lazy"></w-date-input>');

  const field = page.locator('#di .w-date-input-field');
  await field.fill('not a date');
  await expect(page.locator('#di .w-field-hint')).toHaveCount(0);

  await field.dispatchEvent('blur');
  await expect(page.locator('#di .w-field-hint')).toHaveText('Enter a valid date');
});

/* ── Vuetify parity: value formatting and commit ──────────────────────────── */

test('w-date-input display-format is an alias of format', async ({ mount, page }) => {
  await mount('<w-date-input id="alias" value="2026-06-12" display-format="MM/dd/yyyy"></w-date-input><w-date-input id="both" value="2026-06-12" format="dd.MM.yyyy" display-format="MM/dd/yyyy"></w-date-input>');

  await expect(page.locator('#alias .w-date-input-field')).toHaveValue('06/12/2026');
  await expect(page.locator('#both .w-date-input-field')).toHaveValue('12.06.2026');
});

test('w-date-input input-format parses typed text with the given pattern', async ({ mount, page }) => {
  await mount('<w-date-input id="di" input-format="dd/mm/yyyy"></w-date-input>');

  await page.locator('#di .w-date-input-field').fill('15/06/2026');
  await page.locator('#di .w-date-input-field').dispatchEvent('change');

  await expect(page.locator('#di')).toHaveAttribute('value', '2026-06-15');
});

test('w-date-input update-on="enter" commits only on Enter', async ({ mount, page }) => {
  await mount('<w-date-input id="di" update-on="enter"></w-date-input>');

  const field = page.locator('#di .w-date-input-field');
  await field.fill('2026-06-15');
  await expect(page.locator('#di')).not.toHaveAttribute('value', '2026-06-15');

  await field.press('Enter');
  await expect(page.locator('#di')).toHaveAttribute('value', '2026-06-15');
});

test('w-date-input update-on="blur" commits on blur', async ({ mount, page }) => {
  await mount('<w-date-input id="di" update-on="blur"></w-date-input>');

  const field = page.locator('#di .w-date-input-field');
  await field.fill('2026-06-15');
  await expect(page.locator('#di')).not.toHaveAttribute('value', '2026-06-15');

  await field.dispatchEvent('blur');
  await expect(page.locator('#di')).toHaveAttribute('value', '2026-06-15');
});

test('w-date-input update-on="" makes the text read-only', async ({ mount, page }) => {
  await mount('<w-date-input id="di" update-on="" value="2026-06-12"></w-date-input>');

  await expect(page.locator('#di .w-date-input-field')).toHaveAttribute('readonly', '');
});

test('w-date-input multiple is an alias of mode', async ({ mount, page }) => {
  await page.clock.setFixedTime(new Date('2026-06-01T12:00:00'));
  await mount('<w-date-input id="many" multiple></w-date-input><w-date-input id="span" multiple="range"></w-date-input>');

  await page.locator('#many .w-date-input-icon').click();
  await page.locator('#many [data-date="2026-06-10"]').click();
  await page.locator('#many [data-date="2026-06-14"]').click();
  await expect(page.locator('#many')).toHaveAttribute('value', '2026-06-10,2026-06-14');

  // The open popup overlays its sibling, so close it before driving the next one.
  await page.locator('#many .w-date-input-icon').click();
  await expect(page.locator('#many .w-date-input-popup')).toBeHidden();

  await page.locator('#span .w-date-input-icon').click();
  await page.locator('#span [data-date="2026-06-10"]').click();
  await page.locator('#span [data-date="2026-06-14"]').click();
  await expect(page.locator('#span .w-date-input-field')).toHaveValue('2026-06-10 – 2026-06-14');
});

test('w-date-input multiple="2" caps the number of selected dates', async ({ mount, page }) => {
  await mount('<w-date-input id="di" multiple="2" value="2026-06-01,2026-06-02"></w-date-input>');

  await page.locator('#di .w-date-input-icon').click();
  await page.locator('#di [data-date="2026-06-15"]').click();

  await expect(page.locator('#di')).toHaveAttribute('value', '2026-06-02,2026-06-15');
});

/* ── Vuetify parity: popup chrome ─────────────────────────────────────────── */

test('w-date-input menu opens the picker on render', async ({ mount, page }) => {
  await mount('<w-date-input id="di" menu value="2026-06-12"></w-date-input>');

  await expect(page.locator('#di .w-date-input-popup')).toBeVisible();
  await expect(page.locator('#di .w-date-input-icon')).toHaveAttribute('aria-expanded', 'true');
});

test('w-date-input renders the popup header with title, text and header fallback', async ({ mount, page }) => {
  await mount('<w-date-input id="di" menu title="Enter date" text="Any weekday" header="No date selected"></w-date-input>');

  // <w-date-picker> owns the popup header, so these forward straight through.
  await expect(page.locator('#di .w-date-picker-picker-title > span')).toHaveText('Enter date');
  await expect(page.locator('#di .w-date-picker-text')).toHaveText('Any weekday');
  await expect(page.locator('#di .w-date-picker-picker-title > strong')).toHaveText('No date selected');
});

test('w-date-input header date follows the selection and header-date-format', async ({ mount, page }) => {
  await mount('<w-date-input id="di" menu title="Enter date" header="None" value="2026-06-12" header-date-format="dd/MM/yyyy"></w-date-input>');

  await expect(page.locator('#di .w-date-picker-picker-title > strong')).toHaveText('12/06/2026');

  await page.locator('#di [data-date="2026-06-15"]').click();
  await expect(page.locator('#di .w-date-picker-picker-title > strong')).toHaveText('15/06/2026');
});

test('w-date-input hide-title and hide-header remove header content', async ({ mount, page }) => {
  await mount('<w-date-input id="title" menu title="Enter date" header="None" hide-title></w-date-input><w-date-input id="all" menu title="Enter date" header="None" hide-header></w-date-input>');

  await expect(page.locator('#title .w-date-picker-picker-title > span')).toHaveCount(0);
  await expect(page.locator('#title .w-date-picker-picker-title > strong')).toHaveText('None');
  await expect(page.locator('#all .w-date-picker-picker-title')).toHaveCount(0);
});

test('w-date-input popup layout flags map to popup classes', async ({ mount, page }) => {
  await mount('<w-date-input id="di" menu landscape divided control-variant="modal" hide-weekdays show-week no-month-picker mobile></w-date-input>');

  const popup = page.locator('#di .w-date-input-popup');
  for (const name of [
    'w-date-input-popup--landscape', 'w-date-input-popup--divided',
    'w-date-input-popup--modal', 'w-date-input-popup--hide-weekdays',
    'w-date-input-popup--show-week', 'w-date-input-popup--no-month-picker',
    'w-date-input-popup--mobile',
  ]) {
    await expect(popup).toHaveClass(new RegExp(name + '(\\s|$)'));
  }
  await expect(page.locator('#di .w-date-picker-weekday').first()).toBeHidden();
});

test('w-date-input shows Cancel and OK actions when hide-actions is false', async ({ mount, page }) => {
  await mount('<w-date-input id="di" menu value="2026-06-12" hide-actions="false" cancel-text="Nope" ok-text="Yep" title="Pick"></w-date-input>');
  await recordEvents(page, '#di', ['change']);

  await expect(page.locator('#di .w-date-input-cancel')).toHaveText('Nope');
  await expect(page.locator('#di .w-date-input-ok')).toHaveText('Yep');

  await page.locator('#di [data-date="2026-06-15"]').click();
  await expect(page.locator('#di')).toHaveAttribute('value', '2026-06-12');
  // The picker's own header format, since no header-date-format is set here.
  await expect(page.locator('#di .w-date-picker-picker-title > strong')).toHaveText('Mon, Jun 15');
  expect(await readEvents(page, '#di')).toEqual([]);

  await page.locator('#di .w-date-input-ok').click();
  await expect(page.locator('#di')).toHaveAttribute('value', '2026-06-15');
  await expect(page.locator('#di .w-date-input-popup')).toBeHidden();
});

test('w-date-input Cancel discards the pending selection', async ({ mount, page }) => {
  await mount('<w-date-input id="di" menu value="2026-06-12" hide-actions="false"></w-date-input>');

  await page.locator('#di [data-date="2026-06-15"]').click();
  await page.locator('#di .w-date-input-cancel').click();

  await expect(page.locator('#di')).toHaveAttribute('value', '2026-06-12');
  await expect(page.locator('#di .w-date-input-popup')).toBeHidden();
});

/* ── Vuetify parity: picker configuration ─────────────────────────────────── */

test('w-date-input view-mode selects the initial picker view', async ({ mount, page }) => {
  await mount('<w-date-input id="di" menu view-mode="year" value="2026-06-12"></w-date-input>');

  await expect(page.locator('#di .w-date-picker-years')).toBeVisible();
});

test('w-date-input picker-props forwards extra attributes to the picker', async ({ mount, page }) => {
  await mount(`<w-date-input id="di" menu value="2026-06-12" picker-props='{"view":"months"}'></w-date-input>`);

  await expect(page.locator('#di .w-date-picker-months')).toBeVisible();
});

test('w-date-input month and year set the view, no-auto-navigation keeps it there', async ({ mount, page }) => {
  await mount('<w-date-input id="pinned" menu value="2026-06-12" month="1" year="2020" no-auto-navigation></w-date-input><w-date-input id="auto" menu value="2026-06-12" month="1" year="2020"></w-date-input>');

  await expect(page.locator('#pinned .w-date-picker-title')).toHaveText('January 2020');
  await expect(page.locator('#auto .w-date-picker-title')).toHaveText('June 2026');
});

test('w-date-input replaces the picker nav and mode icons', async ({ mount, page }) => {
  // The mode toggle only exists in the modal control variant.
  await mount('<w-date-input id="di" menu value="2026-06-12" control-variant="modal" prev-icon="back" next-icon="fwd" mode-icon="caret"></w-date-input>');

  await expect(page.locator('#di .w-date-picker-nav--prev')).toHaveText('back');
  await expect(page.locator('#di .w-date-picker-nav--next')).toHaveText('fwd');
  await expect(page.locator('#di .w-date-picker-mode')).toHaveCount(1);
  await expect(page.locator('#di .w-date-picker-mode')).toHaveText('caret');
});

test('w-date-input no-month-picker jumps straight to the year view', async ({ mount, page }) => {
  await mount('<w-date-input id="di" menu value="2026-06-12" no-month-picker control-variant="modal"></w-date-input>');

  await page.locator('#di .w-date-picker-title').click();

  await expect(page.locator('#di .w-date-picker-years')).toBeVisible();
  await expect(page.locator('#di .w-date-picker-months')).toHaveCount(0);
});

test('w-date-input weekdays restricts the visible columns', async ({ mount, page }) => {
  await mount('<w-date-input id="di" menu value="2026-06-12" first-day-of-week="1" weekdays="[1,2,3,4,5]"></w-date-input>');

  // Restricted weekdays are dropped from the grid rather than hidden in place.
  expect(await page.locator('#di .w-date-picker-weekday').allTextContents()).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  await expect(page.locator('#di [data-date="2026-06-13"]')).toHaveCount(0);
  await expect(page.locator('#di [data-date="2026-06-12"]')).toHaveCount(1);
});

test('w-date-input show-week numbers each row using first-day-of-year', async ({ mount, page }) => {
  await mount('<w-date-input id="di" menu value="2026-06-12" first-day-of-week="1" first-day-of-year="4" show-week></w-date-input>');

  // June 2026 starts on a Monday, so the grid is exactly five ISO weeks, 23–27.
  await expect(page.locator('#di .w-date-picker-weekday--week')).toHaveText('#');
  expect(await page.locator('#di .w-date-picker-week').allTextContents()).toEqual(['23', '24', '25', '26', '27']);
});

test('w-date-input weeks-in-month="static" pads the grid to six rows', async ({ mount, page }) => {
  await mount('<w-date-input id="static" menu value="2026-06-12" weeks-in-month="static"></w-date-input><w-date-input id="dynamic" menu value="2026-06-12"></w-date-input>');

  await expect(page.locator('#static .w-date-picker-grid > *')).toHaveCount(49);
  await expect(page.locator('#dynamic .w-date-picker-grid > *')).toHaveCount(38);
});

test('w-date-input allowed-dates disables every other day', async ({ mount, page }) => {
  await mount('<w-date-input id="di" menu value="2026-06-15" allowed-dates="2026-06-15,2026-06-16"></w-date-input>');

  await expect(page.locator('#di [data-date="2026-06-16"]')).toBeEnabled();
  await expect(page.locator('#di [data-date="2026-06-17"]')).toBeDisabled();
});

test('w-date-input allowed-months and allowed-years disable picker cells', async ({ mount, page }) => {
  await mount('<w-date-input id="di" menu value="2026-06-15" allowed-months="[6,7]" allowed-years="[2026]"></w-date-input>');

  await page.locator('#di .w-date-picker-title').click();
  await expect(page.locator('#di [data-month="7"]')).toBeEnabled();
  await expect(page.locator('#di [data-month="5"]')).toBeDisabled();

  await page.locator('#di .w-date-picker-title').click();
  await expect(page.locator('#di [data-year="2026"]')).toBeEnabled();
  await expect(page.locator('#di [data-year="2025"]')).toBeDisabled();
});

test('w-date-input renders event dots with event-color', async ({ mount, page }) => {
  await mount(`<w-date-input id="di" menu value="2026-06-01" event-color="success"
    events='{"2026-06-10":true,"2026-06-11":["#ff0000","#00ff00"],"2026-06-12":false}'></w-date-input>`);

  await expect(page.locator('#di [data-date="2026-06-10"] .w-date-input-event')).toHaveCount(1);
  await expect(page.locator('#di [data-date="2026-06-10"] .w-date-input-event')).toHaveAttribute('style', /--w-success/);
  await expect(page.locator('#di [data-date="2026-06-11"] .w-date-input-event')).toHaveCount(2);
  await expect(page.locator('#di [data-date="2026-06-12"] .w-date-input-event')).toHaveCount(0);
});

test('w-date-input events accepts a plain date list', async ({ mount, page }) => {
  await mount('<w-date-input id="di" menu value="2026-06-01" events="2026-06-10,2026-06-20"></w-date-input>');

  await expect(page.locator('#di [data-date="2026-06-10"] .w-date-input-event')).toHaveCount(1);
  await expect(page.locator('#di [data-date="2026-06-20"] .w-date-input-event')).toHaveCount(1);
  await expect(page.locator('#di [data-date="2026-06-11"] .w-date-input-event')).toHaveCount(0);
});

test('w-date-input preview-value highlights a date and the range up to it', async ({ mount, page }) => {
  await mount('<w-date-input id="di" menu mode="range" value="2026-06-10" preview-value="2026-06-14"></w-date-input>');

  await expect(page.locator('#di [data-date="2026-06-14"]')).toHaveClass(/w-date-input-preview(\s|$)/);
  await expect(page.locator('#di [data-date="2026-06-12"]')).toHaveClass(/w-date-input-preview-range/);
  await expect(page.locator('#di [data-date="2026-06-20"]')).not.toHaveClass(/w-date-input-preview/);
});

test('w-date-input records the transition used to page the calendar', async ({ mount, page }) => {
  await mount('<w-date-input id="di" menu value="2026-06-12" transition="slide-x-transition" reverse-transition="slide-x-reverse-transition"></w-date-input>');

  await page.locator('#di .w-date-picker-nav--next').click();
  await expect(page.locator('#di .w-date-input-popup')).toHaveAttribute('data-transition', 'slide-x-transition');

  await page.locator('#di .w-date-picker-nav--prev').click();
  await expect(page.locator('#di .w-date-input-popup')).toHaveAttribute('data-transition', 'slide-x-reverse-transition');

  await expect(page.locator('#di')).toHaveAttribute('value', '2026-06-12');
});

test('w-date-input mobile-breakpoint switches the presentation by viewport width', async ({ mount, page }) => {
  await mount('<w-date-input id="wide" mobile-breakpoint="xl"></w-date-input><w-date-input id="narrow" mobile-breakpoint="xs"></w-date-input>');

  await expect(page.locator('#wide .w-date-input')).toHaveClass(/w-date-input--mobile/);
  await expect(page.locator('#narrow .w-date-input')).not.toHaveClass(/w-date-input--mobile/);
});
