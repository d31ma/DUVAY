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
