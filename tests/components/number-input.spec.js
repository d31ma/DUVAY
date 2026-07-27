import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-number-input reflects value, min, max, step, label, and disabled attributes', async ({ mount, page }) => {
  await mount('<w-number-input id="number" label="Count" value="4" min="0" max="10" step="2" disabled></w-number-input>');

  await expect(page.locator('#number .w-label')).toHaveText('Count');
  await expect(page.locator('#number input')).toHaveValue('4');
  await expect(page.locator('#number input')).toHaveAttribute('min', '0');
  await expect(page.locator('#number input')).toHaveAttribute('max', '10');
  await expect(page.locator('#number input')).toHaveAttribute('step', '2');
  await expect(page.locator('#number input')).toBeDisabled();

  await page.locator('#number').evaluate((el) => {
    el.removeAttribute('disabled');
    el.setAttribute('value', '6');
  });

  await expect(page.locator('#number input')).toHaveValue('6');
  await expect(page.locator('#number input')).toBeEnabled();
});

test('w-number-input step buttons and input changes commit value', async ({ mount, page }) => {
  await mount('<w-number-input id="number" value="4" step="2"></w-number-input>');
  await recordEvents(page, '#number', ['change']);

  await page.locator('#number [data-step="1"]').click();
  await expect(page.locator('#number')).toHaveAttribute('value', '6');

  await page.locator('#number input').fill('10');
  await page.locator('#number input').dispatchEvent('change');
  await expect(page.locator('#number')).toHaveAttribute('value', '10');
  expect(await readEvents(page, '#number')).toEqual([
    { type: 'change', detail: { value: 6 } },
    { type: 'change', detail: { value: 10 } },
  ]);
});

test('w-number-input renders each control-variant and hide-input', async ({ mount, page }) => {
  await mount(`
    <w-number-input id="default" value="1"></w-number-input>
    <w-number-input id="stacked" value="1" control-variant="stacked"></w-number-input>
    <w-number-input id="split" value="1" control-variant="split"></w-number-input>
    <w-number-input id="hidden" value="1" control-variant="hidden"></w-number-input>
    <w-number-input id="hideinput" value="1" hide-input></w-number-input>
  `);

  await expect(page.locator('#default .w-number-input')).toHaveClass(/w-number-input--default/);
  await expect(page.locator('#default [data-step]')).toHaveCount(2);

  await expect(page.locator('#stacked .w-number-input')).toHaveClass(/w-number-input--stacked/);
  await expect(page.locator('#split .w-number-input')).toHaveClass(/w-number-input--split/);
  await expect(page.locator('#split [data-step]')).toHaveCount(2);

  // hidden has no stepper controls
  await expect(page.locator('#hidden [data-step]')).toHaveCount(0);
  await expect(page.locator('#hidden .w-number-input')).toHaveClass(/w-number-input--hidden/);

  // hide-input implies the stacked variant and hides the text input
  await expect(page.locator('#hideinput .w-number-input')).toHaveClass(/w-number-input--hide-input/);
  await expect(page.locator('#hideinput .w-number-input')).toHaveClass(/w-number-input--stacked/);
});

test('w-number-input names and exposes its input and stepper controls', async ({ mount, page }) => {
  await mount('<w-number-input id="number" label="Quantity" value="1" control-variant="split"></w-number-input>');

  await expect(page.locator('#number input')).toHaveAttribute('aria-label', 'Quantity');
  await expect(page.locator('#number [data-step="-1"]')).toHaveAttribute('aria-label', 'Decrease Quantity');
  await expect(page.locator('#number [data-step="1"]')).toHaveAttribute('aria-label', 'Increase Quantity');
  await expect(page.locator('#number [data-step]')).toHaveCount(2);
  await expect(page.locator('#number [data-step="-1"]')).not.toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('#number [data-step="1"]')).not.toHaveAttribute('tabindex', '-1');
});

test('w-number-input clamps to min/max and disables the spent control', async ({ mount, page }) => {
  await mount('<w-number-input id="number" value="9" min="0" max="10" step="2"></w-number-input>');
  await recordEvents(page, '#number', ['change']);

  // 9 + 2 would exceed max 10, so increment is blocked
  await expect(page.locator('#number [data-step="1"]')).toBeDisabled();
  await expect(page.locator('#number [data-step="-1"]')).toBeEnabled();

  await page.locator('#number [data-step="-1"]').click();
  await expect(page.locator('#number')).toHaveAttribute('value', '7');

  // typing past the max is clamped on change
  await page.locator('#number input').fill('999');
  await page.locator('#number input').dispatchEvent('change');
  await expect(page.locator('#number')).toHaveAttribute('value', '10');
  await expect(page.locator('#number [data-step="1"]')).toBeDisabled();
});

test('w-number-input formats with precision, grouping, and custom separators', async ({ mount, page }) => {
  await mount('<w-number-input id="number" value="1234.5" precision="2" grouping></w-number-input>');
  await expect(page.locator('#number input')).toHaveValue('1,234.50');

  await page.locator('#number').evaluate((el) => {
    el.setAttribute('decimal-separator', ',');
    el.setAttribute('group-separator', '.');
  });
  await expect(page.locator('#number input')).toHaveValue('1.234,50');
});

/* ── Vuetify field-surface parity ─────────────────────────────────────────── */

test('w-number-input renders the field surface modifiers, affixes, and icons', async ({ mount, page }) => {
  await mount(`
    <w-number-input id="number" value="2" label="Amount" variant="solo" flat active dirty glow
      center-affix single-line indent-details persistent-placeholder persistent-counter
      persistent-clear persistent-hint prefix="$" suffix="kg" prepend-icon="star"
      append-icon="info" prepend-inner-icon="search" append-inner-icon="close"
      icon-color="primary"></w-number-input>
  `);

  const root = page.locator('#number .w-number-input');
  for (const modifier of [
    'w-number-input--solo', 'w-number-input--flat', 'w-number-input--active',
    'w-number-input--dirty', 'w-number-input--glow', 'w-number-input--center-affix',
    'w-number-input--single-line', 'w-number-input--indent-details',
    'w-number-input--persistent-placeholder', 'w-number-input--persistent-counter',
    'w-number-input--persistent-clear', 'w-number-input--persistent-hint',
  ]) {
    await expect(root).toHaveClass(new RegExp(modifier));
  }

  await expect(page.locator('#number .w-number-input-prefix')).toHaveText('$');
  await expect(page.locator('#number .w-number-input-suffix')).toHaveText('kg');
  await expect(page.locator('#number .w-number-input-prepend .w-icon')).toHaveText('star');
  await expect(page.locator('#number .w-number-input-append .w-icon')).toHaveText('info');
  await expect(page.locator('#number .w-number-input-prepend-inner .w-icon')).toHaveText('search');
  await expect(page.locator('#number .w-number-input-append-inner .w-icon')).toHaveText('close');

  // single-line drops the stacked label and uses it as the placeholder.
  await expect(page.locator('#number .w-label')).toHaveCount(0);
  await expect(page.locator('#number input')).toHaveAttribute('placeholder', 'Amount');

  const iconColor = await root.evaluate((el) => el.style.getPropertyValue('--w-number-input-icon-color'));
  expect(iconColor).toContain('--w-primary');
});

test('w-number-input dirty tracks the value when not forced', async ({ mount, page }) => {
  await mount('<w-number-input id="empty"></w-number-input><w-number-input id="filled" value="3"></w-number-input>');

  await expect(page.locator('#empty .w-number-input')).not.toHaveClass(/w-number-input--dirty/);
  await expect(page.locator('#filled .w-number-input')).toHaveClass(/w-number-input--dirty/);
});

test('w-number-input clearable empties the value and hides when empty', async ({ mount, page }) => {
  await mount('<w-number-input id="number" value="5" clearable clear-icon="backspace"></w-number-input>');
  await recordEvents(page, '#number', ['change']);

  const clear = page.locator('#number .w-number-input-clear');
  await expect(clear.locator('.w-icon')).toHaveText('backspace');

  await clear.click();
  await expect(page.locator('#number input')).toHaveValue('');
  await expect(page.locator('#number')).not.toHaveAttribute('value', /.*/);
  await expect(clear).toBeHidden();
  expect(await readEvents(page, '#number')).toEqual([{ type: 'change', detail: { value: null } }]);
});

test('w-number-input hide-spin-buttons removes the stepper controls', async ({ mount, page }) => {
  await mount('<w-number-input id="number" value="1" hide-spin-buttons></w-number-input>');

  await expect(page.locator('#number [data-step]')).toHaveCount(0);
  await expect(page.locator('#number .w-number-input')).toHaveClass(/w-number-input--hide-spin-buttons/);
  await expect(page.locator('#number input')).toBeVisible();
});

test('w-number-input type is accepted and ignored', async ({ mount, page }) => {
  await mount('<w-number-input id="number" value="1" type="number"></w-number-input>');
  await expect(page.locator('#number input')).toHaveAttribute('type', 'text');
});

test('w-number-input autocomplete=suppress and autofocus reach the input', async ({ mount, page }) => {
  await mount('<w-number-input id="number" autocomplete="suppress" autofocus></w-number-input>');

  const input = page.locator('#number input');
  await expect(input).toHaveAttribute('autocomplete', 'off');
  await expect(input).toHaveAttribute('autofocus', '');
  expect(await input.getAttribute('name')).toMatch(/nosuggest$/);

  await mount('<w-number-input id="n2" autocomplete="tel"></w-number-input>');
  await expect(page.locator('#n2 input')).toHaveAttribute('autocomplete', 'tel');
});

test('w-number-input counter tracks the formatted value', async ({ mount, page }) => {
  await mount('<w-number-input id="number" value="1234" counter grouping></w-number-input>');
  await expect(page.locator('#number .w-number-input-counter')).toHaveText('5 / 25');

  await page.locator('#number [data-step="1"]').click();
  await expect(page.locator('#number .w-number-input-counter')).toHaveText('5 / 25');

  await mount('<w-number-input id="n2" value="7" counter="4"></w-number-input>');
  await expect(page.locator('#n2 .w-number-input-counter')).toHaveText('1 / 4');
});

test('w-number-input messages, error-messages, and max-errors render in the details row', async ({ mount, page }) => {
  await mount('<w-number-input id="number" messages="Pick one,Or two"></w-number-input>');
  await expect(page.locator('#number .w-number-input-message')).toHaveCount(2);

  await mount('<w-number-input id="n2" error-messages="Required,Too small"></w-number-input>');
  await expect(page.locator('#n2 .w-number-input-message')).toHaveCount(1);
  await expect(page.locator('#n2 .w-number-input-message')).toHaveText('Required');
  await expect(page.locator('#n2 .w-number-input')).toHaveClass(/w-field-error/);

  await mount('<w-number-input id="n3" error-messages="Required,Too small" max-errors="2"></w-number-input>');
  await expect(page.locator('#n3 .w-number-input-message')).toHaveCount(2);
});

test('w-number-input hide-details suppresses the details row', async ({ mount, page }) => {
  await mount('<w-number-input id="number" counter hide-details></w-number-input>');
  await expect(page.locator('#number .w-number-input-details')).toHaveCount(0);

  await mount('<w-number-input id="n2" counter hide-details="auto"></w-number-input>');
  await expect(page.locator('#n2 .w-number-input-details')).toHaveCount(1);
});

test('w-number-input validate-on delays the error messages', async ({ mount, page }) => {
  await mount('<w-number-input id="number" counter error-messages="Required" validate-on="input"></w-number-input>');

  await expect(page.locator('#number .w-number-input-message')).toHaveCount(0);
  await expect(page.locator('#number .w-number-input')).not.toHaveClass(/w-field-error/);

  await page.locator('#number input').fill('2');
  await expect(page.locator('#number .w-number-input-message')).toHaveText('Required');
  await expect(page.locator('#number .w-number-input')).toHaveClass(/w-field-error/);
});

test('w-number-input persistent-hint keeps the hint beside the error', async ({ mount, page }) => {
  await mount('<w-number-input id="number" hint="Helper" error="Bad value"></w-number-input>');
  await expect(page.locator('#number .w-field-hint')).toHaveCount(1);
  await expect(page.locator('#number .w-field-hint')).toHaveText('Bad value');

  await mount('<w-number-input id="n2" hint="Helper" error="Bad value" persistent-hint></w-number-input>');
  await expect(page.locator('#n2 .w-field-hint')).toHaveCount(2);
  await expect(page.locator('#n2 .w-field-hint--persistent')).toHaveText('Helper');
});

test('w-number-input is read-only with disabled controls and emits change', async ({ mount, page }) => {
  await mount('<w-number-input id="number" value="3" step="1" readonly></w-number-input>');
  await expect(page.locator('#number input')).toHaveAttribute('readonly', '');
  await expect(page.locator('#number [data-step="1"]')).toBeDisabled();
  await expect(page.locator('#number [data-step="-1"]')).toBeDisabled();

  await mount('<w-number-input id="num2" value="3" step="1"></w-number-input>');
  await recordEvents(page, '#num2', ['change']);
  await page.locator('#num2 [data-step="1"]').click();
  expect(await readEvents(page, '#num2')).toEqual([
    { type: 'change', detail: { value: 4 } },
  ]);
});
