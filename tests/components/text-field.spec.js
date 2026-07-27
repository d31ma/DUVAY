import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-text-field renders label, placeholder, value, and the default outlined variant', async ({ mount, page }) => {
  await mount('<w-text-field id="tf" label="Name" placeholder="Jane Doe" value="Ada" name="name"></w-text-field>');

  const input = page.locator('#tf .w-text-field-input');
  await expect(page.locator('#tf .w-text-field')).toHaveClass(/w-text-field--outlined/);
  await expect(page.locator('#tf .w-text-field')).toHaveClass(/w-text-field--floating/);
  await expect(page.locator('#tf .w-text-field-label')).toHaveText('Name');
  await expect(input).toHaveValue('Ada');
  await expect(input).toHaveAttribute('name', 'name');
  // Non-empty value floats the label.
  await expect(page.locator('#tf .w-text-field')).toHaveClass(/w-text-field--has-value/);
});

test('w-text-field emits input and change with reflected value', async ({ mount, page }) => {
  await mount('<w-text-field id="tf" name="q"></w-text-field>');
  await recordEvents(page, '#tf', ['input', 'change']);

  await page.locator('#tf .w-text-field-input').fill('hello');
  await page.locator('#tf .w-text-field-input').dispatchEvent('change');

  await expect(page.locator('#tf')).toHaveAttribute('value', 'hello');
  await expect(page.locator('#tf .w-text-field')).toHaveClass(/w-text-field--has-value/);
  expect(await readEvents(page, '#tf')).toEqual([
    { type: 'input', detail: { value: 'hello', name: 'q' } },
    { type: 'change', detail: { value: 'hello', name: 'q' } },
  ]);
});

test('w-text-field value property updates the input', async ({ mount, page }) => {
  await mount('<w-text-field id="tf"></w-text-field>');
  await page.locator('#tf').evaluate((el) => { el.value = 'set via prop'; });
  await expect(page.locator('#tf .w-text-field-input')).toHaveValue('set via prop');
  await expect(page.locator('#tf')).toHaveAttribute('value', 'set via prop');
});

test('w-text-field applies variant, density, size, rounded, and color', async ({ mount, page }) => {
  await mount('<w-text-field id="tf" label="X" variant="filled" density="compact" size="lg" rounded color="success"></w-text-field>');

  const root = page.locator('#tf .w-text-field');
  await expect(root).toHaveClass(/w-text-field--filled/);
  await expect(root).toHaveClass(/w-text-field--density-compact/);
  await expect(root).toHaveClass(/w-text-field--lg/);
  await expect(root).toHaveClass(/w-text-field--rounded/);
  await expect(root).toHaveAttribute('style', /--w-tf-accent:var\(--w-success\)/);
});

test('w-text-field clearable clears the value and emits input + clear', async ({ mount, page }) => {
  await mount('<w-text-field id="tf" value="remove me" name="q" clearable></w-text-field>');
  await recordEvents(page, '#tf', ['input', 'clear']);

  await expect(page.locator('#tf .w-text-field-clear')).toBeVisible();
  await page.locator('#tf .w-text-field-clear').click();

  await expect(page.locator('#tf .w-text-field-input')).toHaveValue('');
  await expect(page.locator('#tf')).not.toHaveClass(/w-text-field--has-value/);
  expect(await readEvents(page, '#tf')).toEqual([
    { type: 'input', detail: { value: '', name: 'q' } },
    { type: 'clear', detail: { name: 'q' } },
  ]);
});

test('w-text-field counter tracks length against maxlength', async ({ mount, page }) => {
  await mount('<w-text-field id="tf" counter maxlength="10" value="abc"></w-text-field>');

  await expect(page.locator('#tf .w-text-field-counter')).toHaveText('3 / 10');
  await page.locator('#tf .w-text-field-input').fill('abcdef');
  await expect(page.locator('#tf .w-text-field-counter')).toHaveText('6 / 10');
});

test('w-text-field renders prefix, suffix, and inner slots', async ({ mount, page }) => {
  await mount('<w-text-field id="tf" prefix="$" suffix=".00"><span slot="prepend-inner" id="pi">@</span><span slot="append-inner" id="ai">!</span></w-text-field>');

  await expect(page.locator('#tf .w-text-field-prefix')).toHaveText('$');
  await expect(page.locator('#tf .w-text-field-suffix')).toHaveText('.00');
  await expect(page.locator('#tf .w-text-field-prepend-inner #pi')).toHaveText('@');
  await expect(page.locator('#tf .w-text-field-append-inner #ai')).toHaveText('!');
});

test('w-text-field resolves prepend-inner-icon and append-inner-icon attributes', async ({ mount, page }) => {
  await mount('<w-text-field id="tf" label="Search" prepend-inner-icon="search" append-inner-icon="clear"></w-text-field>');

  await expect(page.locator('#tf .w-text-field-prepend-inner .w-icon')).toHaveCount(1);
  await expect(page.locator('#tf .w-text-field-append-inner .w-icon')).toHaveCount(1);
  await expect(page.locator('#tf .w-text-field-prepend-inner .w-icon')).toHaveClass(/w-text-field-icon/);
});

test('w-text-field omits the inner adornment span when there is no icon or slot', async ({ mount, page }) => {
  await mount('<w-text-field id="tf" label="Plain"></w-text-field>');
  await expect(page.locator('#tf .w-text-field-prepend-inner')).toHaveCount(0);
  await expect(page.locator('#tf .w-text-field-append-inner')).toHaveCount(0);
});

test('w-text-field error tints the control and shows the message with aria-invalid', async ({ mount, page }) => {
  await mount('<w-text-field id="tf" label="Email" value="bad" error="Invalid email"></w-text-field>');

  await expect(page.locator('#tf .w-text-field')).toHaveClass(/w-text-field--error/);
  await expect(page.locator('#tf .w-text-field-messages')).toHaveText('Invalid email');
  await expect(page.locator('#tf .w-text-field-input')).toHaveAttribute('aria-invalid', 'true');
});

test('w-text-field solo and single-line use the label as the placeholder', async ({ mount, page }) => {
  await mount('<w-text-field id="solo" variant="solo" label="Search"></w-text-field><w-text-field id="sl" single-line label="Filter"></w-text-field>');

  await expect(page.locator('#solo .w-text-field')).not.toHaveClass(/w-text-field--floating/);
  await expect(page.locator('#solo .w-text-field-label')).toHaveCount(0);
  await expect(page.locator('#solo .w-text-field-input')).toHaveAttribute('placeholder', 'Search');
  await expect(page.locator('#sl .w-text-field-input')).toHaveAttribute('placeholder', 'Filter');
});

test('w-text-field disabled and readonly forward to the input', async ({ mount, page }) => {
  await mount('<w-text-field id="d" label="A" disabled></w-text-field><w-text-field id="r" label="B" readonly></w-text-field>');

  await expect(page.locator('#d .w-text-field')).toHaveClass(/w-text-field--disabled/);
  await expect(page.locator('#d .w-text-field-input')).toBeDisabled();
  await expect(page.locator('#r .w-text-field-input')).toHaveAttribute('readonly', '');
});

test('w-text-field loading renders the bar and hide-details drops the details row', async ({ mount, page }) => {
  await mount('<w-text-field id="l" label="A" loading hint="x"></w-text-field><w-text-field id="h" label="B" hint="hidden" hide-details></w-text-field>');

  await expect(page.locator('#l .w-text-field-loader')).toBeVisible();
  await expect(page.locator('#h .w-text-field-details')).toHaveCount(0);
});

test('w-text-field supports the @input shorthand handler', async ({ mount, page }) => {
  await mount('<w-text-field id="tf" @input="this.dataset.v = event.detail.value"></w-text-field>');
  await page.locator('#tf .w-text-field-input').fill('zed');
  await expect(page.locator('#tf')).toHaveAttribute('data-v', 'zed');
});

/* ── Vuetify field surface ─────────────────────────────────────────────── */

test('w-text-field renders prepend-icon and append-icon outside the control', async ({ mount, page }) => {
  await mount('<w-text-field id="tf" label="Search" prepend-icon="search" append-icon="clear" icon-color="success"></w-text-field>');

  const outer = page.locator('#tf .w-text-field-outer');
  await expect(outer).toHaveCount(1);
  await expect(page.locator('#tf .w-text-field-prepend .w-icon')).toHaveCount(1);
  await expect(page.locator('#tf .w-text-field-append .w-icon')).toHaveCount(1);
  await expect(outer).toHaveAttribute('style', /--w-tf-icon-color:var\(--w-success/);
  // The control still sits inside the row so the rest of the chrome is intact.
  await expect(page.locator('#tf .w-text-field-outer > .w-text-field')).toHaveCount(1);
});

test('w-text-field glow lifts the outer icons to full opacity on focus', async ({ mount, page }) => {
  await mount('<w-text-field id="tf" label="A" prepend-icon="search" glow></w-text-field>');

  const icon = page.locator('#tf .w-text-field-prepend');
  const resting = Number(await icon.evaluate((el) => getComputedStyle(el).opacity));
  expect(resting).toBeLessThan(1);

  await page.locator('#tf .w-text-field-input').focus();
  await expect(icon).toHaveCSS('opacity', '1');
});

test('w-text-field maps the field-surface flags onto modifier classes', async ({ mount, page }) => {
  await mount(`<w-text-field id="tf" label="A" variant="solo" flat reverse active dirty glow
      center-affix indent-details hide-spin-buttons persistent-placeholder
      persistent-counter persistent-clear></w-text-field>`);

  const root = page.locator('#tf .w-text-field');
  for (const name of ['flat', 'reverse', 'active', 'dirty', 'glow', 'center-affix', 'indent-details',
    'hide-spin-buttons', 'persistent-placeholder', 'persistent-counter', 'persistent-clear']) {
    await expect(root).toHaveClass(new RegExp('w-text-field--' + name + '(\\s|$)'));
  }
  // `dirty` is the manual form of the has-value state.
  await expect(root).toHaveClass(/w-text-field--has-value/);
});

test('w-text-field flat removes the solo elevation and active tints the border', async ({ mount, page }) => {
  await mount(`<w-text-field id="solo" variant="solo" label="A"></w-text-field>
    <w-text-field id="flat" variant="solo" label="A" flat></w-text-field>
    <w-text-field id="act" label="A" active color="success"></w-text-field>`);

  const soloShadow = await page.locator('#solo .w-text-field-control').evaluate((el) => getComputedStyle(el).boxShadow);
  expect(soloShadow).not.toBe('none');
  await expect(page.locator('#flat .w-text-field-control')).toHaveCSS('box-shadow', 'none');

  const active = await page.locator('#act .w-text-field-control').evaluate((el) => getComputedStyle(el).borderTopColor);
  const plainBorder = await page.locator('#solo .w-text-field-control').evaluate((el) => getComputedStyle(el).borderTopColor);
  expect(active).not.toBe(plainBorder);
});

test('w-text-field reverse flips the text direction inside the control', async ({ mount, page }) => {
  await mount('<w-text-field id="tf" label="A" reverse value="abc"></w-text-field>');
  await expect(page.locator('#tf .w-text-field-input')).toHaveCSS('direction', 'rtl');
});

test('w-text-field persistent-clear pins the clear button open while dirty', async ({ mount, page }) => {
  await mount(`<w-text-field id="plain" value="x" clearable></w-text-field>
    <w-text-field id="pinned" value="x" clearable persistent-clear></w-text-field>`);

  await expect(page.locator('#plain .w-text-field-clear')).toHaveCSS('opacity', '0');
  await expect(page.locator('#pinned .w-text-field-clear')).toHaveCSS('opacity', '1');
});

test('w-text-field clear-icon replaces the default glyph', async ({ mount, page }) => {
  await mount('<w-text-field id="tf" value="x" clearable clear-icon="✖"></w-text-field>');
  await expect(page.locator('#tf .w-text-field-clear .w-icon')).toHaveText('✖');
});

test('w-text-field persistent-counter keeps the counter visible when empty', async ({ mount, page }) => {
  await mount(`<w-text-field id="plain" counter maxlength="10"></w-text-field>
    <w-text-field id="pinned" counter maxlength="10" persistent-counter></w-text-field>`);

  await expect(page.locator('#plain .w-text-field-counter')).toHaveCSS('opacity', '0');
  await expect(page.locator('#pinned .w-text-field-counter')).toHaveCSS('opacity', '1');
  await expect(page.locator('#pinned .w-text-field-counter')).toHaveText('0 / 10');
});

test('w-text-field counter accepts an explicit maximum', async ({ mount, page }) => {
  await mount('<w-text-field id="tf" counter="50" value="abc"></w-text-field>');
  await expect(page.locator('#tf .w-text-field-counter')).toHaveText('3 / 50');
});

test('w-text-field persistent-placeholder keeps the placeholder legible when idle', async ({ mount, page }) => {
  await mount(`<w-text-field id="plain" label="A" placeholder="Type here"></w-text-field>
    <w-text-field id="kept" label="A" placeholder="Type here" persistent-placeholder></w-text-field>`);

  const hidden = await page.locator('#plain .w-text-field-input').evaluate((el) => getComputedStyle(el, '::placeholder').color);
  const shown = await page.locator('#kept .w-text-field-input').evaluate((el) => getComputedStyle(el, '::placeholder').color);
  expect(hidden).not.toBe(shown);
});

test('w-text-field indent-details pads the details row', async ({ mount, page }) => {
  await mount(`<w-text-field id="plain" hint="Help"></w-text-field>
    <w-text-field id="indent" hint="Help" indent-details></w-text-field>`);

  const plain = await page.locator('#plain .w-text-field-details').evaluate((el) => parseFloat(getComputedStyle(el).paddingLeft));
  const indent = await page.locator('#indent .w-text-field-details').evaluate((el) => parseFloat(getComputedStyle(el).paddingLeft));
  expect(indent).toBeGreaterThan(plain);
});

test('w-text-field hide-spin-buttons strips the native number spinners', async ({ mount, page }) => {
  await mount('<w-text-field id="tf" type="number" hide-spin-buttons value="3"></w-text-field>');
  await expect(page.locator('#tf .w-text-field-input')).toHaveCSS('appearance', 'textfield');
});

test('w-text-field messages render below the control and error-messages take over', async ({ mount, page }) => {
  await mount(`<w-text-field id="m" label="A" messages="First,Second" max-errors="2"></w-text-field>
    <w-text-field id="e" label="B" messages="Ignored" error-messages='["Too short","Also bad"]' max-errors="2"></w-text-field>`);

  await expect(page.locator('#m .w-text-field-messages')).toHaveText('FirstSecond');
  await expect(page.locator('#m .w-text-field-messages--error')).toHaveCount(0);

  await expect(page.locator('#e .w-text-field-messages--error')).toHaveText('Too shortAlso bad');
  await expect(page.locator('#e .w-text-field')).toHaveClass(/w-text-field--error/);
  await expect(page.locator('#e .w-text-field-input')).toHaveAttribute('aria-invalid', 'true');
});

test('w-text-field max-errors caps how many error messages are shown', async ({ mount, page }) => {
  await mount('<w-text-field id="tf" error-messages="One,Two,Three"></w-text-field>');
  await expect(page.locator('#tf .w-text-field-messages')).toHaveText('One');
});

test('w-text-field hint and messages share the details row', async ({ mount, page }) => {
  await mount('<w-text-field id="tf" hint="Helper" messages="Extra"></w-text-field>');
  await expect(page.locator('#tf .w-text-field-messages')).toHaveText('HelperExtra');
});

test('w-text-field validate-on gates the built-in required check', async ({ mount, page }) => {
  await mount(`<w-text-field id="lazy" label="A" required></w-text-field>
    <w-text-field id="eager" label="B" required validate-on="eager"></w-text-field>`);

  // Default (validate-on="input") stays quiet until the user types.
  await expect(page.locator('#lazy .w-text-field-messages')).toHaveCount(0);
  await expect(page.locator('#eager .w-text-field-messages')).toHaveText('This field is required.');

  await page.locator('#lazy .w-text-field-input').fill('a');
  await page.locator('#lazy .w-text-field-input').fill('');
  await expect(page.locator('#lazy .w-text-field-messages')).toHaveText('This field is required.');
  await expect(page.locator('#lazy .w-text-field')).toHaveClass(/w-text-field--error/);
});

test('w-text-field validate-on="blur" waits for the field to lose focus', async ({ mount, page }) => {
  await mount('<w-text-field id="tf" label="A" required validate-on="blur"></w-text-field><button id="other">x</button>');

  await page.locator('#tf .w-text-field-input').focus();
  await expect(page.locator('#tf .w-text-field-messages')).toHaveCount(0);
  await page.locator('#other').focus();
  await expect(page.locator('#tf .w-text-field-messages')).toHaveText('This field is required.');
});

test('w-text-field validation-value is checked instead of the typed text', async ({ mount, page }) => {
  await mount(`<w-text-field id="ok" required validate-on="eager" validation-value="present"></w-text-field>
    <w-text-field id="bad" value="looks full" required validate-on="eager" validation-value=""></w-text-field>`);

  await expect(page.locator('#ok .w-text-field-messages')).toHaveCount(0);
  await expect(page.locator('#bad .w-text-field-messages')).toHaveText('This field is required.');
});

test('w-text-field pattern reports an invalid format once validated', async ({ mount, page }) => {
  await mount('<w-text-field id="tf" pattern="\\d+" validate-on="eager" value="abc"></w-text-field>');
  await expect(page.locator('#tf .w-text-field-messages')).toHaveText('Invalid format.');
});

test('w-text-field autocomplete forwards to the input and suppress mangles the name', async ({ mount, page }) => {
  await mount(`<w-text-field id="hint" name="email" autocomplete="email"></w-text-field>
    <w-text-field id="off" name="secret" autocomplete="suppress"></w-text-field>`);

  await expect(page.locator('#hint .w-text-field-input')).toHaveAttribute('autocomplete', 'email');
  await expect(page.locator('#hint .w-text-field-input')).toHaveAttribute('name', 'email');
  await expect(page.locator('#off .w-text-field-input')).toHaveAttribute('autocomplete', 'off');
  await expect(page.locator('#off .w-text-field-input')).toHaveAttribute('name', /^secret-w-tf-\d+$/);
});

test('w-text-field hide-details="auto" keeps the row only while it has content', async ({ mount, page }) => {
  await mount(`<w-text-field id="empty" label="A" hide-details="auto"></w-text-field>
    <w-text-field id="full" label="B" hint="Help" hide-details="auto"></w-text-field>
    <w-text-field id="shown" label="C" hint="Help" hide-details="false"></w-text-field>`);

  await expect(page.locator('#empty .w-text-field-details')).toHaveCount(0);
  await expect(page.locator('#full .w-text-field-details')).toHaveCount(1);
  await expect(page.locator('#shown .w-text-field-details')).toHaveCount(1);
});

test('w-text-field points the control at its label and details for assistive tech', async ({ mount, page }) => {
  await mount('<w-text-field id="tf" label="Email" hint="Work address"></w-text-field>');

  const inputId = await page.locator('#tf .w-text-field-input').getAttribute('id');
  await expect(page.locator('#tf .w-text-field-label')).toHaveAttribute('for', inputId);
  const describedBy = await page.locator('#tf .w-text-field-input').getAttribute('aria-describedby');
  await expect(page.locator('#tf .w-text-field-details')).toHaveAttribute('id', describedBy);
});

test('w-text-field focus() moves focus into the control', async ({ mount, page }) => {
  await mount('<w-text-field id="tf" label="A"></w-text-field>');
  await page.locator('#tf').evaluate((el) => el.focus());
  await expect(page.locator('#tf .w-text-field-input')).toBeFocused();
});
