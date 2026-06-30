import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-date-picker renders the current month and selects a day', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" value="2026-06-12"></w-date-picker>');

  await expect(page.locator('#dp .w-date-picker-title')).toHaveText('June 2026');
  await expect(page.locator('#dp [data-date="2026-06-12"]')).toHaveClass(/selected/);

  await recordEvents(page, '#dp', ['change']);
  await page.locator('#dp [data-date="2026-06-15"]').click();

  await expect(page.locator('#dp')).toHaveAttribute('value', '2026-06-15');
  await expect(page.locator('#dp [data-date="2026-06-15"]')).toHaveClass(/selected/);
  expect(await readEvents(page, '#dp')).toEqual([{ type: 'change', detail: { value: '2026-06-15' } }]);
});

test('w-date-picker navigates months', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6"></w-date-picker>');

  await page.locator('#dp .w-date-picker-nav--next').click();
  await expect(page.locator('#dp')).toHaveAttribute('month', '7');
  await expect(page.locator('#dp .w-date-picker-title')).toHaveText('July 2026');

  await page.locator('#dp .w-date-picker-nav--prev').click();
  await expect(page.locator('#dp')).toHaveAttribute('month', '6');
});

test('w-date-picker switches month and year views', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" value="2026-06-12"></w-date-picker>');

  await page.locator('#dp .w-date-picker-title').click();
  await expect(page.locator('#dp')).toHaveAttribute('view', 'months');
  await expect(page.locator('#dp .w-date-picker-month.selected')).toHaveText('Jun');

  await page.locator('#dp .w-date-picker-title').click();
  await expect(page.locator('#dp')).toHaveAttribute('view', 'years');

  await page.locator('#dp [data-year="2027"]').click();
  await expect(page.locator('#dp')).toHaveAttribute('year', '2027');
  await expect(page.locator('#dp')).toHaveAttribute('view', 'months');

  await page.locator('#dp [data-month="9"]').click();
  await expect(page.locator('#dp')).toHaveAttribute('month', '9');
  await expect(page.locator('#dp')).toHaveAttribute('view', 'date');
  await expect(page.locator('#dp .w-date-picker-title')).toHaveText('September 2027');
});

test('w-date-picker supports compact popup mode', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" hide-header year="2026" month="6"></w-date-picker>');

  await expect(page.locator('#dp .w-date-picker-picker-title')).not.toBeVisible();
  await expect(page.locator('#dp .w-date-picker-title')).toHaveText('June 2026');
});

test('w-date-picker respects min and max', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" min="2026-06-10" max="2026-06-20"></w-date-picker>');

  await expect(page.locator('#dp [data-date="2026-06-09"]')).toBeDisabled();
  await expect(page.locator('#dp [data-date="2026-06-21"]')).toBeDisabled();
  await expect(page.locator('#dp [data-date="2026-06-15"]')).toBeEnabled();
});

test('w-date-picker supports multiple selection', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" mode="multiple"></w-date-picker>');

  await page.locator('#dp [data-date="2026-06-10"]').click();
  await page.locator('#dp [data-date="2026-06-12"]').click();
  await page.locator('#dp [data-date="2026-06-10"]').click();

  await expect(page.locator('#dp')).toHaveAttribute('value', '2026-06-12');
  await expect(page.locator('#dp [data-date="2026-06-12"]')).toHaveClass(/selected/);
  await expect(page.locator('#dp [data-date="2026-06-10"]')).not.toHaveClass(/selected/);
});

test('w-date-picker supports range selection', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" mode="range"></w-date-picker>');

  await page.locator('#dp [data-date="2026-06-10"]').click();
  await page.locator('#dp [data-date="2026-06-14"]').click();

  await expect(page.locator('#dp')).toHaveAttribute('value', '2026-06-10,2026-06-14');
  await expect(page.locator('#dp [data-date="2026-06-10"]')).toHaveClass(/range-start/);
  await expect(page.locator('#dp [data-date="2026-06-14"]')).toHaveClass(/range-end/);
  await expect(page.locator('#dp [data-date="2026-06-12"]')).toHaveClass(/in-range/);
});

test('w-date-picker rotates the first day of the week', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" first-day-of-week="1"></w-date-picker>');

  const headers = await page.locator('#dp .w-date-picker-weekday').allTextContents();
  expect(headers).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
});

test('w-date-picker shows adjacent month days', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" show-adjacent-months=""></w-date-picker>');

  const others = await page.locator('#dp .w-date-picker-day.other-month').count();
  expect(others).toBeGreaterThan(0);
});

test('w-date-picker arrow keys move focus between days', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" value="2026-06-12"></w-date-picker>');

  await page.locator('#dp [data-date="2026-06-12"]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#dp [data-date="2026-06-13"]')).toBeFocused();

  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#dp [data-date="2026-06-20"]')).toBeFocused();
});

test('w-date-picker Enter selects the focused day', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" value="2026-06-12"></w-date-picker>');
  await recordEvents(page, '#dp', ['change']);

  await page.locator('#dp [data-date="2026-06-15"]').focus();
  await page.keyboard.press('Enter');

  await expect(page.locator('#dp')).toHaveAttribute('value', '2026-06-15');
  expect(await readEvents(page, '#dp')).toEqual([{ type: 'change', detail: { value: '2026-06-15' } }]);
});

test('w-date-picker arrow keys cross month boundaries', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" value="2026-06-01"></w-date-picker>');

  await page.locator('#dp [data-date="2026-06-01"]').focus();
  await page.keyboard.press('ArrowLeft');

  await expect(page.locator('#dp .w-date-picker-title')).toHaveText('May 2026');
  await expect(page.locator('#dp [data-date="2026-05-31"]')).toBeFocused();
});
