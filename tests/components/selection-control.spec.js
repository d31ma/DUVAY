import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-selection-control reflects type, label, name, value, checked, and disabled attributes', async ({ mount, page }) => {
  await mount('<w-selection-control id="control" type="radio" label="Choice" name="choice" value="a" checked disabled></w-selection-control>');

  const input = page.locator('#control input');
  await expect(input).toHaveAttribute('type', 'radio');
  await expect(input).toHaveAttribute('name', 'choice');
  await expect(input).toHaveAttribute('value', 'a');
  await expect(input).toBeChecked();
  await expect(input).toBeDisabled();
  await expect(page.locator('#control label')).toContainText('Choice');

  await page.locator('#control').evaluate((el) => {
    el.setAttribute('type', 'checkbox');
    el.removeAttribute('checked');
    el.removeAttribute('disabled');
  });

  await expect(input).toHaveAttribute('type', 'checkbox');
  await expect(input).not.toBeChecked();
  await expect(input).toBeEnabled();
});

test('w-selection-control toggles checked state and emits change', async ({ mount, page }) => {
  await mount('<w-selection-control id="control" name="notify" value="email"></w-selection-control>');
  await recordEvents(page, '#control', ['change']);

  await page.locator('#control input').check();

  await expect(page.locator('#control')).toHaveAttribute('checked', '');
  expect(await readEvents(page, '#control')).toEqual([
    { type: 'change', detail: { checked: true, name: 'notify', value: 'email' } },
  ]);
});

test('w-selection-control error marks the control invalid', async ({ mount, page }) => {
  await mount('<w-selection-control id="control" label="A" error></w-selection-control>');

  await expect(page.locator('#control .w-selection-control')).toHaveClass(/w-selection-control--error/);
  await expect(page.locator('#control input')).toHaveAttribute('aria-invalid', 'true');
});

test('w-selection-control indeterminate reports a mixed state', async ({ mount, page }) => {
  await mount('<w-selection-control id="control" label="A" indeterminate></w-selection-control>');

  await expect(page.locator('#control .w-selection-control')).toHaveClass(/w-selection-control--indeterminate/);
  await expect(page.locator('#control input')).toHaveAttribute('aria-checked', 'mixed');
  expect(await page.locator('#control input').evaluate((el) => el.indeterminate)).toBe(true);

  // Toggling resolves the mixed state.
  await page.locator('#control input').check();
  await expect(page.locator('#control')).not.toHaveAttribute('indeterminate', '');
});

test('w-selection-control multiple posts an array-shaped field name', async ({ mount, page }) => {
  await mount('<w-selection-control id="one" name="tags" value="a"></w-selection-control>'
    + '<w-selection-control id="many" name="tags" value="a" multiple></w-selection-control>');

  await expect(page.locator('#one input')).toHaveAttribute('name', 'tags');
  await expect(page.locator('#many input')).toHaveAttribute('name', 'tags[]');
  await expect(page.locator('#many .w-selection-control')).toHaveClass(/w-selection-control--multiple/);
});

test('w-selection-control true-value and false-value drive the value it carries', async ({ mount, page }) => {
  await mount('<w-selection-control id="control" name="notify" true-value="yes" false-value="no"></w-selection-control>');
  await recordEvents(page, '#control', ['change']);

  await expect(page.locator('#control input[type="hidden"]')).toHaveAttribute('value', 'no');
  await expect(page.locator('#control input[type="checkbox"]')).toHaveAttribute('value', 'yes');

  await page.locator('#control input[type="checkbox"]').check();
  await page.locator('#control input[type="checkbox"]').uncheck();

  expect(await readEvents(page, '#control')).toEqual([
    { type: 'change', detail: { checked: true, name: 'notify', value: 'yes' } },
    { type: 'change', detail: { checked: false, name: 'notify', value: 'no' } },
  ]);
});

test('w-selection-control renders the icon for its current state', async ({ mount, page }) => {
  await mount('<w-selection-control id="off" true-icon="check" false-icon="close"></w-selection-control>'
    + '<w-selection-control id="on" checked true-icon="check" false-icon="close"></w-selection-control>'
    + '<w-selection-control id="mid" indeterminate indeterminate-icon="dash"></w-selection-control>');

  await expect(page.locator('#off .w-selection-control-icon')).toHaveText('close');
  await expect(page.locator('#on .w-selection-control-icon')).toHaveText('check');
  await expect(page.locator('#mid .w-selection-control-icon')).toHaveText('dash');
});

test('w-selection-control inline and ripple', async ({ mount, page }) => {
  await mount('<w-selection-control id="control" label="A" inline ripple></w-selection-control>');

  const control = page.locator('#control .w-selection-control');
  await expect(control).toHaveClass(/w-selection-control--inline/);
  await expect(control).toHaveClass(/w-ripple-host/);
  await control.dispatchEvent('pointerdown', { clientX: 5, clientY: 5 });
  await expect(page.locator('#control .w-ripple-ink')).toHaveCount(1);
});

test('w-selection-control-group hands its defaults down to the children', async ({ mount, page }) => {
  await mount(`<w-selection-control-group id="group" type="radio" name="plan" label="Plan" multiple ripple true-icon="check" error>
    <w-selection-control id="a" value="a" label="A"></w-selection-control>
    <w-selection-control id="b" value="b" label="B" type="checkbox"></w-selection-control>
  </w-selection-control-group>`);

  const box = page.locator('#group .w-selection-control-group');
  await expect(box).toHaveAttribute('role', 'radiogroup');
  await expect(box).toHaveAttribute('aria-label', 'Plan');
  await expect(box).toHaveAttribute('aria-invalid', 'true');
  await expect(box).toHaveClass(/w-selection-control-group--error/);

  // Inherited by the child that declares nothing of its own...
  await expect(page.locator('#a input')).toHaveAttribute('type', 'radio');
  await expect(page.locator('#a input')).toHaveAttribute('name', 'plan[]');
  await expect(page.locator('#a .w-selection-control')).toHaveClass(/w-ripple-host/);
  await expect(page.locator('#a .w-selection-control')).toHaveClass(/w-selection-control--error/);
  // The inherited true-icon only shows once the child is on.
  await expect(page.locator('#a .w-selection-control-icon')).toHaveCount(0);
  await page.locator('#a input').check();
  await expect(page.locator('#a .w-selection-control-icon')).toHaveText('check');

  // ...and overridden by the child that declares its own.
  await expect(page.locator('#b input')).toHaveAttribute('type', 'checkbox');
});

test('w-selection-control-group defaults to a plain group and can go inline', async ({ mount, page }) => {
  await mount('<w-selection-control-group id="plain"><w-selection-control label="A"></w-selection-control></w-selection-control-group>'
    + '<w-selection-control-group id="row" inline><w-selection-control label="B"></w-selection-control></w-selection-control-group>');

  await expect(page.locator('#plain .w-selection-control-group')).toHaveAttribute('role', 'group');
  await expect(page.locator('#plain .w-selection-control-group')).not.toHaveAttribute('aria-label', /./);
  await expect(page.locator('#row .w-selection-control-group')).toHaveClass(/w-selection-control-group--inline/);
});
