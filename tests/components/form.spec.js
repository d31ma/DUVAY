import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-form cascades disabled and readonly to contained controls', async ({ mount, page }) => {
  await mount(`
    <w-form id="form" disabled readonly>
      <input id="native" type="text">
      <w-input id="wrapped" label="Email" type="email"></w-input>
    </w-form>
  `);

  await expect(page.locator('#native')).toBeDisabled();
  await expect(page.locator('#wrapped input')).toBeDisabled();

  await page.locator('#form').evaluate((el) => el.removeAttribute('disabled'));
  await expect(page.locator('#native')).toBeEnabled();
  await expect(page.locator('#native')).toHaveJSProperty('readOnly', true);
});

test('w-form validate() reports native constraint errors and validity', async ({ mount, page }) => {
  await mount(`
    <w-form id="form">
      <input name="email" type="email" required>
    </w-form>
  `);

  let result = await page.locator('#form').evaluate((el) => el.validate());
  expect(result.valid).toBe(false);
  expect(result.errors).toHaveLength(1);
  expect(result.errors[0].id).toBe('email');
  expect(result.errors[0].errorMessages[0]).toBeTruthy();
  await expect(page.locator('#form input')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#form')).toHaveAttribute('value', 'false');

  await page.locator('#form input').fill('person@example.com');
  result = await page.locator('#form').evaluate((el) => el.validate());
  expect(result.valid).toBe(true);
  expect(result.errors).toHaveLength(0);
  await expect(page.locator('#form input')).not.toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#form')).toHaveAttribute('value', 'true');
});

test('w-form fast-fail stops at the first failing field', async ({ mount, page }) => {
  await mount(`
    <w-form id="form" fast-fail>
      <input name="a" required>
      <input name="b" required>
    </w-form>
  `);

  const result = await page.locator('#form').evaluate((el) => el.validate());
  expect(result.valid).toBe(false);
  expect(result.errors).toHaveLength(1);
  expect(result.errors[0].id).toBe('a');
});

test('w-form submit emits submit with the validation result and is prevented', async ({ mount, page }) => {
  await mount(`
    <w-form id="form">
      <input name="name" required>
      <button type="submit">Go</button>
    </w-form>
  `);
  await recordEvents(page, '#form', ['submit', 'change']);

  await page.locator('#form button').click();
  let events = await readEvents(page, '#form');
  expect(events.find((e) => e.type === 'submit').detail.valid).toBe(false);
  expect(events.some((e) => e.type === 'change' && e.detail.value === false)).toBe(true);

  await page.locator('#form input').fill('Ada');
  await page.locator('#form button').click();
  events = await readEvents(page, '#form');
  const submits = events.filter((e) => e.type === 'submit');
  expect(submits[submits.length - 1].detail.valid).toBe(true);
});

test('w-form validates w-input and w-textarea through forwarded constraint attributes', async ({ mount, page }) => {
  await mount(`
    <w-form id="form">
      <w-input name="email" type="email" required></w-input>
      <w-textarea name="bio" required minlength="5"></w-textarea>
    </w-form>
  `);

  // Constraint attributes reach the native controls.
  await expect(page.locator('#form w-input input')).toHaveAttribute('required', '');
  await expect(page.locator('#form w-textarea textarea')).toHaveAttribute('minlength', '5');

  let result = await page.locator('#form').evaluate((el) => el.validate());
  expect(result.valid).toBe(false);
  expect(result.errors.map((e) => e.id).sort()).toEqual(['bio', 'email']);

  await page.locator('#form w-input input').fill('person@example.com');
  await page.locator('#form w-textarea textarea').fill('A long enough bio');
  result = await page.locator('#form').evaluate((el) => el.validate());
  expect(result.valid).toBe(true);
});

test('w-form validate-on="input" validates fields as they change, reset clears it', async ({ mount, page }) => {
  await mount(`
    <w-form id="form" validate-on="input">
      <input name="email" type="email" required value="bad">
    </w-form>
  `);

  await page.locator('#form input').fill('still-bad');
  await page.locator('#form input').dispatchEvent('input');
  await expect(page.locator('#form input')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#form')).toHaveAttribute('value', 'false');

  await page.locator('#form input').fill('good@example.com');
  await page.locator('#form input').dispatchEvent('input');
  await expect(page.locator('#form input')).not.toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#form')).toHaveAttribute('value', 'true');

  await page.locator('#form').evaluate((el) => el.resetValidation());
  await expect(page.locator('#form input')).not.toHaveAttribute('aria-invalid');
  await expect(page.locator('#form')).not.toHaveAttribute('value');
});
