import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-radio-group reflects label, name, value, and disabled attrs on child radios', async ({ mount, page }) => {
  await mount(`
    <w-radio-group id="group" label="Plan" name="plan" value="pro" disabled>
      <w-radio value="free" label="Free"></w-radio>
      <w-radio value="pro" label="Pro"></w-radio>
    </w-radio-group>
  `);

  await expect(page.locator('#group .w-radio-group')).toHaveAttribute('aria-label', 'Plan');
  await expect(page.locator('#group w-radio[value="pro"]')).toHaveAttribute('checked', '');
  await expect(page.locator('#group w-radio[value="free"] input')).toHaveAttribute('name', 'plan');
  await expect(page.locator('#group w-radio input').first()).toBeDisabled();

  await page.locator('#group').evaluate((el) => {
    el.removeAttribute('disabled');
    el.setAttribute('value', 'free');
  });

  await expect(page.locator('#group w-radio[value="free"]')).toHaveAttribute('checked', '');
  await expect(page.locator('#group w-radio input').first()).toBeEnabled();
});

test('w-radio-group updates value when child radios change', async ({ mount, page }) => {
  await mount(`
    <w-radio-group id="group" name="plan" value="free">
      <w-radio value="free" label="Free"></w-radio>
      <w-radio value="pro" label="Pro"></w-radio>
    </w-radio-group>
  `);
  await recordEvents(page, '#group', ['change']);

  await page.locator('#group w-radio[value="pro"] input').check();

  await expect(page.locator('#group')).toHaveAttribute('value', 'pro');
  await expect(page.locator('#group w-radio[value="pro"]')).toHaveAttribute('checked', '');
  await expect(page.locator('#group w-radio[value="free"]')).not.toHaveAttribute('checked', '');
  expect(await readEvents(page, '#group')).toEqual([
    { type: 'change', detail: { value: 'pro', name: 'plan' } },
  ]);
});

test('w-radio-group applies the inline modifier when inline is set', async ({ mount, page }) => {
  await mount(`
    <w-radio-group id="group" name="contact" value="email" inline>
      <w-radio value="email" label="Email"></w-radio>
      <w-radio value="phone" label="Phone"></w-radio>
    </w-radio-group>
  `);

  await expect(page.locator('#group .w-radio-group')).toHaveClass(/w-radio-group--inline/);
  // Inline lays the options out in a single row (same vertical position).
  const tops = await page.locator('#group w-radio').evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().top)));
  expect(new Set(tops).size).toBe(1);

  await page.locator('#group').evaluate((el) => el.removeAttribute('inline'));
  await expect(page.locator('#group .w-radio-group')).not.toHaveClass(/w-radio-group--inline/);
});


const RADIOS = `
  <w-radio value="free" label="Free"></w-radio>
  <w-radio value="pro" label="Pro"></w-radio>
`;

test('w-radio-group renders hint, messages, and error-messages under the options', async ({ mount, page }) => {
  await mount(`<w-radio-group id="g" label="Plan" hint="Change any time" messages="Billed monthly">${RADIOS}</w-radio-group>`);

  await expect(page.locator('#g .w-checkbox-hint')).toHaveText('Change any time');
  await expect(page.locator('#g .w-checkbox-message')).toHaveText('Billed monthly');

  await page.locator('#g').evaluate((el) => {
    el.setAttribute('error-messages', 'Pick one,Then confirm');
    el.setAttribute('max-errors', '2');
  });

  await expect(page.locator('#g .w-checkbox-error')).toHaveCount(2);
  await expect(page.locator('#g .w-radio-group')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#g .w-checkbox-hint')).toHaveCount(0);

  await page.locator('#g').evaluate((el) => el.setAttribute('persistent-hint', ''));
  await expect(page.locator('#g .w-checkbox-hint')).toHaveCount(1);

  await page.locator('#g').evaluate((el) => el.setAttribute('hide-details', ''));
  await expect(page.locator('#g .w-checkbox-error')).toHaveCount(0);
});

test('w-radio-group required validates the selected value and validate-on gates it', async ({ mount, page }) => {
  await mount(`<w-radio-group id="g" label="Plan" required>${RADIOS}</w-radio-group>`);

  await expect(page.locator('#g .w-checkbox-error')).toHaveText('This field is required.');
  await expect(page.locator('#g .w-radio-group')).toHaveAttribute('aria-required', 'true');

  await page.locator('#g w-radio[value="pro"] input').check();
  await expect(page.locator('#g .w-checkbox-error')).toHaveCount(0);

  await mount(`<w-radio-group id="v" label="Plan" required validation-value="preset">${RADIOS}</w-radio-group>`);
  await expect(page.locator('#v .w-checkbox-error')).toHaveCount(0);

  await mount(`<w-radio-group id="b" label="Plan" error-messages="Choose a plan" validate-on="blur">${RADIOS}</w-radio-group>`);
  await expect(page.locator('#b .w-checkbox-error')).toHaveCount(0);
  await page.locator('#b w-radio[value="free"] input').focus();
  await page.locator('#b w-radio[value="free"] input').blur();
  await expect(page.locator('#b .w-checkbox-error')).toHaveText('Choose a plan');
});

test('w-radio-group renders prepend/append icons and the surface modifiers', async ({ mount, page }) => {
  await mount(`<w-radio-group id="g" label="Plan" prepend-icon="P" append-icon="A" icon-color="primary"
                 center-affix indent-details hide-spin-buttons hint="Pick">${RADIOS}</w-radio-group>`);

  await expect(page.locator('#g .w-selection-affix--prepend')).toHaveText('P');
  await expect(page.locator('#g .w-selection-affix--append')).toHaveText('A');
  const outer = page.locator('#g .w-selection-outer');
  await expect(outer).toHaveClass(/w-selection--center-affix/);
  await expect(outer).toHaveClass(/w-selection--indent-details/);
  await expect(outer).toHaveClass(/w-selection--hide-spin-buttons/);

  const pad = await page.locator('#g .w-radio-group-details').evaluate((el) => getComputedStyle(el).paddingInlineStart);
  expect(parseFloat(pad)).toBeGreaterThan(0);
});

test('w-radio-group pushes type, ripple, and icons onto children that do not set them', async ({ mount, page }) => {
  await mount(`
    <w-radio-group id="g" name="plan" value="free" type="checkbox" ripple true-icon="Y" false-icon="N" error>
      <w-radio value="free" label="Free"></w-radio>
      <w-radio value="pro" label="Pro" type="radio"></w-radio>
    </w-radio-group>
  `);

  await expect(page.locator('#g w-radio[value="free"] input')).toHaveAttribute('type', 'checkbox');
  // An explicit attribute on the child wins over the group default.
  await expect(page.locator('#g w-radio[value="pro"] input')).toHaveAttribute('type', 'radio');
  await expect(page.locator('#g w-radio[value="free"] .w-checkbox-box')).toHaveClass(/w-ripple-host/);
  await expect(page.locator('#g w-radio[value="free"] .w-checkbox-mark--true')).toBeVisible();
  await expect(page.locator('#g w-radio[value="pro"] label')).toHaveClass(/w-checkbox--error/);
  await expect(page.locator('#g .w-radio-group')).toHaveClass(/w-radio-group--error/);

  // Removing the group prop removes it from the children it owns.
  await page.locator('#g').evaluate((el) => el.removeAttribute('type'));
  await expect(page.locator('#g w-radio[value="free"] input')).toHaveAttribute('type', 'radio');
});
