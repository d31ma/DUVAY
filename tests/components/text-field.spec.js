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
