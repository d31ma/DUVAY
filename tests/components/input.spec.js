import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-input reflects input, field, state, and size attributes', async ({ mount, page }) => {
  await mount('<w-input id="input" type="email" placeholder="you@example.com" value="a@b.com" disabled readonly name="email" label="Email" hint="Use work email" size="lg"></w-input>');

  const input = page.locator('#input input');
  await expect(page.locator('#input .w-field-label')).toHaveText('Email');
  await expect(page.locator('#input .w-field-hint')).toHaveText('Use work email');
  await expect(input).toHaveAttribute('type', 'email');
  await expect(input).toHaveAttribute('placeholder', 'you@example.com');
  await expect(input).toHaveValue('a@b.com');
  await expect(input).toBeDisabled();
  await expect(input).toHaveAttribute('readonly', '');
  await expect(input).toHaveAttribute('name', 'email');
  await expect(input).toHaveClass(/w-input--lg/);

  await page.locator('#input').evaluate((el) => {
    el.setAttribute('error', 'Required');
    el.setAttribute('size', 'sm');
    el.removeAttribute('disabled');
  });

  await expect(page.locator('#input .w-field')).toHaveClass(/w-field-error/);
  await expect(page.locator('#input .w-field-hint')).toHaveText('Required');
  await expect(input).toHaveClass(/w-input--sm/);
  await expect(input).toBeEnabled();
});

test('w-input emits native input and change events and supports property value updates', async ({ mount, page }) => {
  await mount('<w-input id="input" name="query" value="alpha"></w-input>');
  await recordEvents(page, '#input', ['input', 'change']);

  await page.locator('#input input').fill('beta');
  await page.locator('#input input').dispatchEvent('change');
  await page.locator('#input').evaluate((el) => {
    el.value = 'gamma';
  });

  await expect(page.locator('#input')).toHaveAttribute('value', 'gamma');
  await expect(page.locator('#input input')).toHaveValue('gamma');
  expect(await readEvents(page, '#input')).toEqual([
    { type: 'input', detail: { value: 'beta', name: 'query' } },
    { type: 'change', detail: { value: 'beta', name: 'query' } },
  ]);
});

test('w-input supports vanilla inline oninput and onchange handlers', async ({ mount, page }) => {
  await mount(`
    <w-input
      id="input"
      value="alpha"
      oninput="this.dataset.inputValue = event.detail.value"
      onchange="this.dataset.changeValue = event.detail.value"
    ></w-input>
  `);

  await page.locator('#input input').fill('beta');
  await page.locator('#input input').dispatchEvent('change');

  await expect(page.locator('#input')).toHaveAttribute('data-input-value', 'beta');
  await expect(page.locator('#input')).toHaveAttribute('data-change-value', 'beta');
  await expect(page.locator('#input')).not.toHaveAttribute('model-value');
});

test('w-input supports @input and @change shorthand handlers', async ({ mount, page }) => {
  await mount(`
    <w-input
      id="input"
      value="alpha"
      @input="this.dataset.inputValue = event.detail.value"
      @change="this.dataset.changeValue = event.detail.value"
    ></w-input>
  `);

  await page.locator('#input input').fill('beta');
  await page.locator('#input input').dispatchEvent('change');

  await expect(page.locator('#input')).toHaveAttribute('data-input-value', 'beta');
  await expect(page.locator('#input')).toHaveAttribute('data-change-value', 'beta');
});

/* ── <w-input> field surface ───────────────────────────────────────────── */

test('w-input renders prepend-icon and append-icon with an icon color', async ({ mount, page }) => {
  await mount('<w-input id="i" label="Search" prepend-icon="search" append-icon="clear" icon-color="success"></w-input>');

  await expect(page.locator('#i .w-input-prepend .w-icon')).toHaveCount(1);
  await expect(page.locator('#i .w-input-append .w-icon')).toHaveCount(1);
  await expect(page.locator('#i .w-input-control')).toHaveAttribute('style', /--w-input-icon-color:var\(--w-success/);
});

test('w-input glow lifts the icons to full opacity while focused', async ({ mount, page }) => {
  await mount('<w-input id="i" label="A" prepend-icon="search" glow></w-input>');

  const icon = page.locator('#i .w-input-prepend');
  const resting = Number(await icon.evaluate((el) => getComputedStyle(el).opacity));
  expect(resting).toBeLessThan(1);
  await page.locator('#i input').focus();
  await expect(icon).toHaveCSS('opacity', '1');
});

test('w-input center-affix centres the icons against the control', async ({ mount, page }) => {
  await mount('<w-input id="i" label="A" prepend-icon="search" center-affix></w-input>');
  await expect(page.locator('#i .w-input-control')).toHaveClass(/w-input-control--center-affix/);
  await expect(page.locator('#i .w-input-prepend')).toHaveCSS('align-self', 'center');
});

test('w-input direction switches the label/control layout', async ({ mount, page }) => {
  await mount(`<w-input id="v" label="A" direction="vertical"></w-input>
    <w-input id="h" label="B" direction="horizontal"></w-input>`);

  await expect(page.locator('#v .w-field')).toHaveCSS('flex-direction', 'column');
  await expect(page.locator('#h .w-field')).toHaveCSS('flex-direction', 'row');
});

test('w-input hide-spin-buttons strips the native number spinners', async ({ mount, page }) => {
  await mount('<w-input id="i" type="number" value="3" hide-spin-buttons></w-input>');
  await expect(page.locator('#i input')).toHaveCSS('appearance', 'textfield');
});

test('w-input persistent-hint keeps the hint beside the error text', async ({ mount, page }) => {
  await mount(`<w-input id="swap" label="A" hint="Helpful" error="Bad"></w-input>
    <w-input id="keep" label="B" hint="Helpful" error="Bad" persistent-hint></w-input>`);

  await expect(page.locator('#swap .w-field-hint')).toHaveCount(1);
  await expect(page.locator('#swap .w-field-hint')).toHaveText('Bad');
  await expect(page.locator('#keep .w-field-hint')).toHaveCount(2);
  await expect(page.locator('#keep .w-field-hint--persistent')).toHaveText('Helpful');
});

test('w-input messages and error-messages populate the details row', async ({ mount, page }) => {
  await mount(`<w-input id="m" label="A" messages="One,Two" max-errors="2"></w-input>
    <w-input id="e" label="B" messages="Ignored" error-messages="Nope,Still nope" max-errors="2"></w-input>`);

  await expect(page.locator('#m .w-input-messages')).toHaveText('OneTwo');
  await expect(page.locator('#m .w-input-messages--error')).toHaveCount(0);
  await expect(page.locator('#e .w-input-messages--error')).toHaveText('NopeStill nope');
  await expect(page.locator('#e .w-field')).toHaveClass(/w-field-error/);
  await expect(page.locator('#e input')).toHaveAttribute('aria-invalid', 'true');
});

test('w-input max-errors caps the number of visible errors', async ({ mount, page }) => {
  await mount('<w-input id="i" error-messages="One,Two,Three"></w-input>');
  await expect(page.locator('#i .w-input-messages')).toHaveText('One');
});

test('w-input validate-on gates the built-in required check', async ({ mount, page }) => {
  await mount(`<w-input id="quiet" label="A" required></w-input>
    <w-input id="eager" label="B" required validate-on="eager"></w-input>`);

  await expect(page.locator('#quiet .w-input-messages')).toHaveCount(0);
  await expect(page.locator('#eager .w-input-messages')).toHaveText('This field is required.');

  await page.locator('#quiet input').fill('a');
  await page.locator('#quiet input').fill('');
  await expect(page.locator('#quiet .w-input-messages')).toHaveText('This field is required.');
  await expect(page.locator('#quiet .w-field')).toHaveClass(/w-field-error/);
});

test('w-input validation-value replaces the value the checks read', async ({ mount, page }) => {
  await mount(`<w-input id="ok" required validate-on="eager" validation-value="set"></w-input>
    <w-input id="bad" value="typed" required validate-on="eager" validation-value=""></w-input>`);

  await expect(page.locator('#ok .w-input-messages')).toHaveCount(0);
  await expect(page.locator('#bad .w-input-messages')).toHaveText('This field is required.');
});

test('w-input hide-details and indent-details control the details row', async ({ mount, page }) => {
  await mount(`<w-input id="hidden" messages="Note" hide-details></w-input>
    <w-input id="auto" label="A" hide-details="auto"></w-input>
    <w-input id="plain" messages="Note"></w-input>
    <w-input id="indent" messages="Note" indent-details></w-input>`);

  await expect(page.locator('#hidden .w-input-details')).toHaveCount(0);
  await expect(page.locator('#auto .w-input-details')).toHaveCount(0);
  const plain = await page.locator('#plain .w-input-details').evaluate((el) => parseFloat(getComputedStyle(el).paddingLeft));
  const indent = await page.locator('#indent .w-input-details').evaluate((el) => parseFloat(getComputedStyle(el).paddingLeft));
  expect(indent).toBeGreaterThan(plain);
});

test('w-input associates its label and details with the input', async ({ mount, page }) => {
  await mount('<w-input id="i" label="Email" messages="Work address"></w-input>');

  const inputId = await page.locator('#i input').getAttribute('id');
  await expect(page.locator('#i .w-field-label')).toHaveAttribute('for', inputId);
  const describedBy = await page.locator('#i input').getAttribute('aria-describedby');
  await expect(page.locator('#i .w-input-details')).toHaveAttribute('id', describedBy);
});

/* ── <w-field> shell ───────────────────────────────────────────────────── */

test('w-field maps the field-surface flags onto the shared modifier classes', async ({ mount, page }) => {
  await mount(`<w-field id="f" label="A" variant="solo" flat reverse active dirty glow
      center-affix single-line persistent-clear><input class="w-input"></w-field>`);

  // The modifiers ride the control row — the same vocabulary <w-select> and
  // <w-file-input> emit through wFieldClasses().
  const control = page.locator('#f .w-field-control');
  for (const name of ['variant-solo', 'flat', 'reverse', 'active', 'dirty', 'glow',
    'center-affix', 'single-line', 'persistent-clear']) {
    await expect(control).toHaveClass(new RegExp('w-field--' + name + '(\\s|$)'));
  }
});

test('w-field flat drops the solo elevation and active tints the border', async ({ mount, page }) => {
  await mount(`<w-field id="solo" variant="solo"><input class="w-input"></w-field>
    <w-field id="flat" variant="solo" flat><input class="w-input"></w-field>
    <w-field id="act" variant="outlined" active><input class="w-input"></w-field>
    <w-field id="out" variant="outlined"><input class="w-input"></w-field>`);

  expect(await page.locator('#solo .w-field-control').evaluate((el) => getComputedStyle(el).boxShadow)).not.toBe('none');
  await expect(page.locator('#flat .w-field-control')).toHaveCSS('box-shadow', 'none');

  const active = await page.locator('#act .w-field-control').evaluate((el) => getComputedStyle(el).borderTopColor);
  const plain = await page.locator('#out .w-field-control').evaluate((el) => getComputedStyle(el).borderTopColor);
  expect(active).not.toBe(plain);
});

test('w-field reverse flips the control row order', async ({ mount, page }) => {
  await mount('<w-field id="f" reverse prepend-inner-icon="search"><input class="w-input"></w-field>');
  await expect(page.locator('#f .w-field-control')).toHaveCSS('flex-direction', 'row-reverse');
});

test('w-field renders inner icons tinted by icon-color', async ({ mount, page }) => {
  await mount('<w-field id="f" label="A" prepend-inner-icon="search" append-inner-icon="clear" icon-color="warning"><input class="w-input"></w-field>');

  await expect(page.locator('#f .w-field-prepend-inner .w-icon')).toHaveCount(1);
  await expect(page.locator('#f .w-field-append-inner .w-icon')).toHaveCount(1);
  await expect(page.locator('#f .w-field')).toHaveAttribute('style', /--w-field-icon-color:var\(--w-warning/);

  const tinted = await page.locator('#f .w-field-prepend-inner').evaluate((el) => getComputedStyle(el).color);
  const token = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--w-warning').trim());
  expect(tinted).not.toBe('');
  expect(token).not.toBe('');
});

test('w-field glow recolours the inner icons while the control is focused', async ({ mount, page }) => {
  await mount('<w-field id="f" label="A" prepend-inner-icon="search" glow><input class="w-input"></w-field>');

  const icon = page.locator('#f .w-field-prepend-inner .w-icon');
  const resting = await icon.evaluate((el) => getComputedStyle(el).color);
  await page.locator('#f input').focus();
  const focused = await icon.evaluate((el) => getComputedStyle(el).color);
  expect(focused).not.toBe(resting);
});

test('w-field clearable empties the slotted control and emits clear', async ({ mount, page }) => {
  await mount('<w-field id="f" label="A" clearable clear-icon="✖" persistent-clear><input class="w-input" value="text"></w-field>');
  await recordEvents(page, '#f', ['clear']);

  const button = page.locator('#f .w-field-clear');
  await expect(button.locator('.w-icon')).toHaveText('✖');
  await expect(button).toHaveCSS('opacity', '1');

  await button.click();
  await expect(page.locator('#f input')).toHaveValue('');
  expect(await readEvents(page, '#f')).toEqual([{ type: 'clear', detail: { value: '' } }]);
  await expect(button).toHaveCSS('opacity', '0');
});

test('w-field hides the clear button until hover unless persistent-clear is set', async ({ mount, page }) => {
  await mount(`<w-field id="plain" clearable><input class="w-input" value="text"></w-field>
    <w-field id="pinned" clearable persistent-clear><input class="w-input" value="text"></w-field>`);

  await expect(page.locator('#plain .w-field-clear')).toHaveCSS('opacity', '0');
  await expect(page.locator('#pinned .w-field-clear')).toHaveCSS('opacity', '1');
});

test('w-field single-line folds the label into the placeholder', async ({ mount, page }) => {
  await mount('<w-field id="f" label="Search" single-line><input class="w-input"></w-field>');

  await expect(page.locator('#f .w-label')).toHaveCount(0);
  await expect(page.locator('#f input')).toHaveAttribute('placeholder', 'Search');
  await expect(page.locator('#f input')).toHaveAttribute('aria-label', 'Search');
});

test('w-field label-id names the label and links it to the control', async ({ mount, page }) => {
  await mount('<w-field id="f" label="Email" label-id="custom-label"><input class="w-input"></w-field>');

  await expect(page.locator('#f .w-label')).toHaveAttribute('id', 'custom-label');
  await expect(page.locator('#f input')).toHaveAttribute('aria-labelledby', 'custom-label');
});

test('w-field details toggles the aria-describedby wiring', async ({ mount, page }) => {
  await mount(`<w-field id="on" label="A" hint="Helper"><input class="w-input"></w-field>
    <w-field id="off" label="B" hint="Helper" details="false"><input class="w-input"></w-field>`);

  const id = await page.locator('#on .w-messages').getAttribute('id');
  await expect(page.locator('#on input')).toHaveAttribute('aria-describedby', id);
  expect(await page.locator('#off input').getAttribute('aria-describedby')).toBeNull();
});

test('w-field error marks the control invalid and keeps the legacy error class', async ({ mount, page }) => {
  await mount('<w-field id="f" label="A" error="Required"><input class="w-input"></w-field>');

  await expect(page.locator('#f .w-field')).toHaveClass(/w-field-error/);
  await expect(page.locator('#f .w-messages')).toHaveText('Required');
  await expect(page.locator('#f input')).toHaveAttribute('aria-invalid', 'true');
});

/* ── <w-validation> shell ──────────────────────────────────────────────── */

test('w-validation labels and names the slotted control', async ({ mount, page }) => {
  await mount('<w-validation id="v" label="Email" name="email"><input class="w-input"></w-validation>');

  const labelId = await page.locator('#v .w-label').getAttribute('id');
  await expect(page.locator('#v .w-label')).toHaveText('Email');
  await expect(page.locator('#v input')).toHaveAttribute('name', 'email');
  await expect(page.locator('#v input')).toHaveAttribute('aria-labelledby', labelId);
  const describedBy = await page.locator('#v input').getAttribute('aria-describedby');
  await expect(page.locator('#v .w-validation-messages')).toHaveAttribute('id', describedBy);
});

test('w-validation error puts the control in a manual error state', async ({ mount, page }) => {
  await mount('<w-validation id="v" label="A" error><input class="w-input"></w-validation>');

  await expect(page.locator('#v .w-validation')).toHaveClass(/w-validation--error/);
  await expect(page.locator('#v input')).toHaveAttribute('aria-invalid', 'true');
});

test('w-validation error-messages and max-errors drive the message list', async ({ mount, page }) => {
  await mount(`<w-validation id="one" error-messages="First,Second"><input class="w-input"></w-validation>
    <w-validation id="two" error-messages="First,Second" max-errors="2"><input class="w-input"></w-validation>`);

  await expect(page.locator('#one .w-validation-messages')).toHaveText('First');
  await expect(page.locator('#two .w-validation-messages')).toHaveText('FirstSecond');
  await expect(page.locator('#two .w-validation')).toHaveClass(/w-validation--error/);
});

test('w-validation validate-on gates the control constraints', async ({ mount, page }) => {
  await mount(`<w-validation id="quiet"><input class="w-input" required></w-validation>
    <w-validation id="eager" validate-on="eager"><input class="w-input" required></w-validation>`);

  await expect(page.locator('#quiet .w-validation-messages')).toHaveText('');
  await expect(page.locator('#eager .w-validation-messages')).toHaveText('This field is required.');

  await page.locator('#quiet input').fill('a');
  await page.locator('#quiet input').fill('');
  await expect(page.locator('#quiet .w-validation-messages')).toHaveText('This field is required.');
});

test('w-validation validation-value overrides the value the checks read', async ({ mount, page }) => {
  await mount(`<w-validation id="ok" validate-on="eager" validation-value="set"><input class="w-input" required></w-validation>
    <w-validation id="bad" validate-on="eager" validation-value=""><input class="w-input" required value="typed"></w-validation>`);

  await expect(page.locator('#ok .w-validation-messages')).toHaveText('');
  await expect(page.locator('#bad .w-validation-messages')).toHaveText('This field is required.');
});

test('w-validation surfaces the native constraint message once validated', async ({ mount, page }) => {
  await mount('<w-validation id="v" validate-on="eager"><input class="w-input" type="email" value="nope"></w-validation>');
  await expect(page.locator('#v .w-validation-messages')).not.toHaveText('');
  await expect(page.locator('#v input')).toHaveAttribute('aria-invalid', 'true');
});

test('w-input focus() moves focus into the input', async ({ mount, page }) => {
  await mount('<w-input id="i" label="A"></w-input>');
  await page.locator('#i').evaluate((el) => el.focus());
  await expect(page.locator('#i input')).toBeFocused();
});
