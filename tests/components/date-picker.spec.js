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

/* ── Vuetify VDatePicker parity attributes ─────────────────────────────────── */

test('w-date-picker renders text, header fallback, and hide-title', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" text="Pick a day" header="Enter date"></w-date-picker>');

  await expect(page.locator('#dp .w-date-picker-text')).toHaveText('Pick a day');
  await expect(page.locator('#dp .w-date-picker-picker-title strong')).toHaveText('Enter date');
  await expect(page.locator('#dp .w-date-picker-picker-title span')).toHaveText('Select date');

  await mount('<w-date-picker id="dp2" year="2026" month="6" hide-title></w-date-picker>');
  await expect(page.locator('#dp2 .w-date-picker-picker-title span')).toHaveCount(0);
  await expect(page.locator('#dp2 .w-date-picker-picker-title strong')).toBeVisible();
});

test('w-date-picker header-date-format rewrites the selection label', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" value="2026-06-12" header-date-format="dd/MM/yyyy"></w-date-picker>');

  await expect(page.locator('#dp .w-date-picker-picker-title strong')).toHaveText('12/06/2026');
});

test('w-date-picker multiple aliases the selection mode', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" multiple></w-date-picker>');
  await page.locator('#dp [data-date="2026-06-10"]').click();
  await page.locator('#dp [data-date="2026-06-12"]').click();
  await expect(page.locator('#dp')).toHaveAttribute('value', '2026-06-10,2026-06-12');

  await mount('<w-date-picker id="dp2" year="2026" month="6" multiple="range"></w-date-picker>');
  await page.locator('#dp2 [data-date="2026-06-10"]').click();
  await page.locator('#dp2 [data-date="2026-06-14"]').click();
  await expect(page.locator('#dp2')).toHaveAttribute('value', '2026-06-10,2026-06-14');
  await expect(page.locator('#dp2 [data-date="2026-06-12"]')).toHaveClass(/in-range/);
});

test('w-date-picker multiple caps the number of selected dates', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" multiple="2"></w-date-picker>');

  await page.locator('#dp [data-date="2026-06-10"]').click();
  await page.locator('#dp [data-date="2026-06-11"]').click();
  await page.locator('#dp [data-date="2026-06-12"]').click();

  await expect(page.locator('#dp')).toHaveAttribute('value', '2026-06-10,2026-06-11');
  await expect(page.locator('#dp [data-date="2026-06-12"]')).not.toHaveClass(/selected/);
});

test('w-date-picker show-week and first-day-of-year render week numbers', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" show-week></w-date-picker>');
  expect(await page.locator('#dp .w-date-picker-week').allTextContents()).toEqual(['22', '23', '24', '25', '26']);
  await expect(page.locator('#dp .w-date-picker-weekday--week')).toHaveCount(1);

  await mount('<w-date-picker id="dp2" year="2026" month="6" show-week first-day-of-year="1"></w-date-picker>');
  expect(await page.locator('#dp2 .w-date-picker-week').allTextContents()).toEqual(['23', '24', '25', '26', '27']);
});

test('w-date-picker weekdays filters columns and hide-weekdays drops the header row', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" weekdays="[1,2,3,4,5]"></w-date-picker>');

  expect(await page.locator('#dp .w-date-picker-weekday').allTextContents()).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  await expect(page.locator('#dp [data-date="2026-06-06"]')).toHaveCount(0);
  await expect(page.locator('#dp [data-date="2026-06-05"]')).toHaveCount(1);

  await mount('<w-date-picker id="dp2" year="2026" month="6" hide-weekdays></w-date-picker>');
  await expect(page.locator('#dp2 .w-date-picker-weekday')).toHaveCount(0);
  await expect(page.locator('#dp2 [data-date="2026-06-12"]')).toHaveCount(1);
});

test('w-date-picker weeks-in-month static always renders six week rows', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" show-week></w-date-picker>');
  await expect(page.locator('#dp .w-date-picker-week')).toHaveCount(5);
  await expect(page.locator('#dp .w-date-picker-spacer')).toHaveCount(1);

  await mount('<w-date-picker id="dp2" year="2026" month="6" show-week weeks-in-month="static"></w-date-picker>');
  await expect(page.locator('#dp2 .w-date-picker-week')).toHaveCount(6);
  await expect(page.locator('#dp2 .w-date-picker-spacer')).toHaveCount(12);
});

test('w-date-picker renders event dots from arrays, records, and event-color', async ({ mount, page }) => {
  await mount(`<w-date-picker id="dp" year="2026" month="6" events='["2026-06-10"]' event-color="error"></w-date-picker>`);
  await expect(page.locator('#dp [data-date="2026-06-10"] .w-date-picker-event')).toHaveCount(1);
  await expect(page.locator('#dp [data-date="2026-06-11"] .w-date-picker-event')).toHaveCount(0);
  await expect(page.locator('#dp [data-date="2026-06-10"] .w-date-picker-event'))
    .toHaveAttribute('style', /var\(--w-error\)/);

  await mount(`<w-date-picker id="dp2" year="2026" month="6" events='{"2026-06-11":["error","success"]}'></w-date-picker>`);
  await expect(page.locator('#dp2 [data-date="2026-06-11"] .w-date-picker-event')).toHaveCount(2);
});

test('w-date-picker events accepts a function property', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6"></w-date-picker>');
  await page.locator('#dp').evaluate((el) => { el.events = (iso) => iso === '2026-06-09'; });

  await expect(page.locator('#dp [data-date="2026-06-09"] .w-date-picker-event')).toHaveCount(1);
  await expect(page.locator('#dp [data-date="2026-06-10"] .w-date-picker-event')).toHaveCount(0);
});

test('w-date-picker allowed-dates restricts selection', async ({ mount, page }) => {
  await mount(`<w-date-picker id="dp" year="2026" month="6" allowed-dates='["2026-06-10","2026-06-12"]'></w-date-picker>`);

  await expect(page.locator('#dp [data-date="2026-06-10"]')).toBeEnabled();
  await expect(page.locator('#dp [data-date="2026-06-11"]')).toBeDisabled();
  await expect(page.locator('#dp [data-date="2026-06-11"]')).toHaveAttribute('aria-disabled', 'true');
});

test('w-date-picker allowed-dates accepts a predicate property', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6"></w-date-picker>');
  await page.locator('#dp').evaluate((el) => { el.allowedDates = (iso) => !iso.endsWith('13'); });

  await expect(page.locator('#dp [data-date="2026-06-13"]')).toBeDisabled();
  await expect(page.locator('#dp [data-date="2026-06-14"]')).toBeEnabled();
});

test('w-date-picker allowed-months and allowed-years disable out-of-set cells', async ({ mount, page }) => {
  await mount(`<w-date-picker id="dp" year="2026" month="6" view="months" allowed-months="[5,6]"></w-date-picker>`);
  await expect(page.locator('#dp [data-month="6"]')).toBeEnabled();
  await expect(page.locator('#dp [data-month="7"]')).toBeEnabled();
  await expect(page.locator('#dp [data-month="1"]')).toBeDisabled();

  await mount(`<w-date-picker id="dp2" year="2026" month="6" view="years" allowed-years="[2026,2027]"></w-date-picker>`);
  await expect(page.locator('#dp2 [data-year="2026"]')).toBeEnabled();
  await expect(page.locator('#dp2 [data-year="2027"]')).toBeEnabled();
  await expect(page.locator('#dp2 [data-year="2025"]')).toBeDisabled();
});

test('w-date-picker min and max also bound the month and year grids', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" view="months" min="2026-05-01" max="2026-08-31"></w-date-picker>');
  await expect(page.locator('#dp [data-month="4"]')).toBeDisabled();
  await expect(page.locator('#dp [data-month="5"]')).toBeEnabled();
  await expect(page.locator('#dp [data-month="9"]')).toBeDisabled();

  await mount('<w-date-picker id="dp2" year="2026" month="6" view="years" min="2026-05-01" max="2026-08-31"></w-date-picker>');
  await expect(page.locator('#dp2 [data-year="2026"]')).toBeEnabled();
  await expect(page.locator('#dp2 [data-year="2025"]')).toBeDisabled();
});

test('w-date-picker preview-value marks the pending range', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" mode="range" value="2026-06-10" preview-value="2026-06-14"></w-date-picker>');

  await expect(page.locator('#dp [data-date="2026-06-12"]')).toHaveClass(/in-preview/);
  await expect(page.locator('#dp [data-date="2026-06-14"]')).toHaveClass(/preview-end/);
  await expect(page.locator('#dp [data-date="2026-06-16"]')).not.toHaveClass(/in-preview/);
});

test('w-date-picker previews the range on hover', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" mode="range"></w-date-picker>');

  await page.locator('#dp [data-date="2026-06-10"]').click();
  await page.locator('#dp [data-date="2026-06-14"]').hover();

  await expect(page.locator('#dp')).toHaveAttribute('preview-value', '2026-06-14');
  await expect(page.locator('#dp [data-date="2026-06-12"]')).toHaveClass(/in-preview/);
});

test('w-date-picker view-mode aliases the view attribute', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" view-mode="months"></w-date-picker>');
  await expect(page.locator('#dp .w-date-picker')).toHaveClass(/w-date-picker--view-months/);
  await expect(page.locator('#dp [data-month="6"]')).toBeVisible();

  await mount('<w-date-picker id="dp2" year="2026" month="6" view-mode="year"></w-date-picker>');
  await expect(page.locator('#dp2 .w-date-picker')).toHaveClass(/w-date-picker--view-years/);
  await expect(page.locator('#dp2 [data-year="2026"]')).toBeVisible();
});

test('w-date-picker prev-icon, next-icon, and mode-icon are configurable', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" prev-icon="<<" next-icon=">>"></w-date-picker>');

  await expect(page.locator('#dp .w-date-picker-nav--prev')).toHaveText('<<');
  await expect(page.locator('#dp .w-date-picker-nav--next')).toHaveText('>>');
});

test('w-date-picker control-variant modal exposes a mode button', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" control-variant="modal" mode-icon="v"></w-date-picker>');

  await expect(page.locator('#dp .w-date-picker')).toHaveClass(/w-date-picker--control-modal/);
  await expect(page.locator('#dp .w-date-picker-title')).toHaveAttribute('data-view-target', 'months');
  await expect(page.locator('#dp .w-date-picker-mode')).toHaveText('v');

  await page.locator('#dp .w-date-picker-mode').click();
  await expect(page.locator('#dp')).toHaveAttribute('view', 'years');
  await page.locator('#dp .w-date-picker-mode').click();
  await expect(page.locator('#dp')).toHaveAttribute('view', 'date');

  await page.locator('#dp .w-date-picker-title').click();
  await expect(page.locator('#dp')).toHaveAttribute('view', 'months');
});

test('w-date-picker no-month-picker points the modal title at the year view', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" control-variant="modal" no-month-picker></w-date-picker>');

  await expect(page.locator('#dp .w-date-picker-title')).toHaveAttribute('data-view-target', 'years');
  await page.locator('#dp .w-date-picker-title').click();
  await expect(page.locator('#dp')).toHaveAttribute('view', 'years');
});

test('w-date-picker transition and reverse-transition class the body', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" transition="slide-x" reverse-transition="slide-x-reverse"></w-date-picker>');

  await expect(page.locator('#dp .w-date-picker-body')).toHaveClass(/w-date-picker-body--transition-slide-x$/);

  await page.locator('#dp .w-date-picker-nav--prev').click();
  await expect(page.locator('#dp .w-date-picker-body')).toHaveClass(/w-date-picker-body--transition-slide-x-reverse/);

  await page.locator('#dp .w-date-picker-nav--next').click();
  await expect(page.locator('#dp .w-date-picker-body')).toHaveClass(/w-date-picker-body--transition-slide-x$/);
});

test('w-date-picker landscape, divided, header-color, and sizing props', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" landscape divided header-color="secondary" '
    + 'landscape-header-width="12rem" control-height="3rem"></w-date-picker>');

  const root = page.locator('#dp .w-date-picker');
  await expect(root).toHaveClass(/w-date-picker--landscape/);
  await expect(root).toHaveClass(/w-date-picker--divided/);
  await expect(root).toHaveClass(/w-date-picker--header-color/);
  await expect(root).toHaveAttribute('style', /--w-date-picker-header-color:var\(--w-secondary\)/);
  await expect(root).toHaveAttribute('style', /--w-date-picker-landscape-header-width:12rem/);
  await expect(root).toHaveAttribute('style', /--w-date-picker-control-height:3rem/);
});

test('w-date-picker control-height accepts a bare number as pixels', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" control-height="48"></w-date-picker>');

  await expect(page.locator('#dp .w-date-picker')).toHaveAttribute('style', /--w-date-picker-control-height:48px/);
});

test('w-date-picker columns lays out the month and year grids', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" view="months" columns="4"></w-date-picker>');

  await expect(page.locator('#dp .w-date-picker-months')).toHaveAttribute('style', /--w-date-picker-columns:4/);
  await expect(page.locator('#dp .w-date-picker-months > .w-date-picker-row')).toHaveCount(3);
});

test('w-date-picker follows the selected value unless no-auto-navigation is set', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" value="2026-06-12"></w-date-picker>');
  await expect(page.locator('#dp .w-date-picker-title')).toHaveText('June 2026');

  await mount('<w-date-picker id="dp2" value="2026-06-12" no-auto-navigation></w-date-picker>');
  const today = await page.evaluate(() => new Date().toLocaleString(undefined, { month: 'long', year: 'numeric' }));
  await expect(page.locator('#dp2 .w-date-picker-title')).toHaveText(today);
});

test('w-date-picker exposes grid row semantics', async ({ mount, page }) => {
  await mount('<w-date-picker id="dp" year="2026" month="6" value="2026-06-12"></w-date-picker>');

  await expect(page.locator('#dp [role="grid"] [role="columnheader"]')).toHaveCount(7);
  await expect(page.locator('#dp [data-date="2026-06-12"][role="gridcell"]')).toBeAttached();
  await expect(page.locator('#dp [data-date="2026-06-12"]')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#dp [data-date="2026-06-11"]')).toHaveAttribute('aria-selected', 'false');
});

/* ── w-date-picker-month ───────────────────────────────────────────────────── */

test('w-date-picker-month renders a standalone day grid and selects', async ({ mount, page }) => {
  await mount('<w-date-picker-month id="dpm" year="2026" month="6" value="2026-06-12"></w-date-picker-month>');

  await expect(page.locator('#dpm .w-date-picker-grid')).toBeVisible();
  await expect(page.locator('#dpm .w-date-picker-header')).toHaveCount(0);
  await expect(page.locator('#dpm [data-date="2026-06-12"]')).toHaveClass(/selected/);

  await recordEvents(page, '#dpm', ['change']);
  await page.locator('#dpm [data-date="2026-06-15"]').click();
  await expect(page.locator('#dpm')).toHaveAttribute('value', '2026-06-15');
  expect(await readEvents(page, '#dpm')).toEqual([{ type: 'change', detail: { value: '2026-06-15' } }]);
});

test('w-date-picker-month honours min, max, and allowed-dates', async ({ mount, page }) => {
  await mount(`<w-date-picker-month id="dpm" year="2026" month="6" min="2026-06-10" max="2026-06-20" allowed-dates='["2026-06-12","2026-06-15"]'></w-date-picker-month>`);

  await expect(page.locator('#dpm [data-date="2026-06-12"]')).toBeEnabled();
  await expect(page.locator('#dpm [data-date="2026-06-13"]')).toBeDisabled();
  await expect(page.locator('#dpm [data-date="2026-06-09"]')).toBeDisabled();
});

test('w-date-picker-month supports show-week, hide-weekdays, and static weeks', async ({ mount, page }) => {
  await mount('<w-date-picker-month id="dpm" year="2026" month="6" show-week hide-weekdays weeks-in-month="static"></w-date-picker-month>');

  await expect(page.locator('#dpm .w-date-picker-weekday')).toHaveCount(0);
  await expect(page.locator('#dpm .w-date-picker-week')).toHaveCount(6);
});

test('w-date-picker-month supports multiple, weekdays, and adjacent months', async ({ mount, page }) => {
  await mount('<w-date-picker-month id="dpm" year="2026" month="6" multiple first-day-of-week="1" show-adjacent-months></w-date-picker-month>');

  expect(await page.locator('#dpm .w-date-picker-weekday').allTextContents())
    .toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  expect(await page.locator('#dpm .w-date-picker-day.other-month').count()).toBeGreaterThan(0);

  await page.locator('#dpm [data-date="2026-06-10"]').click();
  await page.locator('#dpm [data-date="2026-06-12"]').click();
  await expect(page.locator('#dpm')).toHaveAttribute('value', '2026-06-10,2026-06-12');
});

test('w-date-picker-month renders events and preview-value', async ({ mount, page }) => {
  await mount(`<w-date-picker-month id="dpm" year="2026" month="6" multiple="range" value="2026-06-10" preview-value="2026-06-14" events='["2026-06-18"]' event-color="warning"></w-date-picker-month>`);

  await expect(page.locator('#dpm [data-date="2026-06-12"]')).toHaveClass(/in-preview/);
  await expect(page.locator('#dpm [data-date="2026-06-18"] .w-date-picker-event'))
    .toHaveAttribute('style', /var\(--w-warning\)/);
});

/* ── w-date-picker-months / w-date-picker-years ────────────────────────────── */

test('w-date-picker-months renders a month grid with columns and bounds', async ({ mount, page }) => {
  await mount('<w-date-picker-months id="dpms" year="2026" month="6" columns="2" min="2026-03-01" max="2026-09-30"></w-date-picker-months>');

  await expect(page.locator('#dpms .w-date-picker-months > .w-date-picker-row')).toHaveCount(6);
  await expect(page.locator('#dpms [data-month="6"]')).toHaveClass(/selected/);
  await expect(page.locator('#dpms [data-month="2"]')).toBeDisabled();
  await expect(page.locator('#dpms [data-month="10"]')).toBeDisabled();

  await recordEvents(page, '#dpms', ['change']);
  await page.locator('#dpms [data-month="8"]').click();
  await expect(page.locator('#dpms')).toHaveAttribute('month', '8');
  expect(await readEvents(page, '#dpms')).toEqual([{ type: 'change', detail: { month: 8, year: 2026, view: 'date' } }]);
});

test('w-date-picker-months honours allowed-months', async ({ mount, page }) => {
  await mount('<w-date-picker-months id="dpms" year="2026" allowed-months="[0,11]"></w-date-picker-months>');

  await expect(page.locator('#dpms [data-month="1"]')).toBeEnabled();
  await expect(page.locator('#dpms [data-month="12"]')).toBeEnabled();
  await expect(page.locator('#dpms [data-month="6"]')).toBeDisabled();
});

test('w-date-picker-years spans min to max and honours allowed-years', async ({ mount, page }) => {
  await mount('<w-date-picker-years id="dpy" year="2026" min="2024-01-01" max="2028-12-31" columns="5"></w-date-picker-years>');

  await expect(page.locator('#dpy .w-date-picker-year')).toHaveCount(5);
  await expect(page.locator('#dpy .w-date-picker-years')).toHaveAttribute('style', /--w-date-picker-columns:5/);
  await expect(page.locator('#dpy [data-year="2026"]')).toHaveClass(/selected/);

  await mount('<w-date-picker-years id="dpy2" year="2026" allowed-years="[2026,2027]"></w-date-picker-years>');
  await expect(page.locator('#dpy2 [data-year="2027"]')).toBeEnabled();
  await expect(page.locator('#dpy2 [data-year="2025"]')).toBeDisabled();
});

/* ── w-date-picker-controls ────────────────────────────────────────────────── */

test('w-date-picker-controls renders month and year buttons and toggles view-mode', async ({ mount, page }) => {
  await mount('<w-date-picker-controls id="dpc" month-text="June" year-text="2026"></w-date-picker-controls>');

  await expect(page.locator('#dpc .w-date-picker-controls__btn--month')).toContainText('June');
  await expect(page.locator('#dpc .w-date-picker-controls__btn--year')).toContainText('2026');

  await recordEvents(page, '#dpc', ['change', 'update:view-mode']);
  await page.locator('#dpc .w-date-picker-controls__btn--month').click();

  await expect(page.locator('#dpc')).toHaveAttribute('view-mode', 'months');
  await expect(page.locator('#dpc .w-date-picker-controls__btn--month')).toHaveAttribute('aria-expanded', 'true');
  expect(await readEvents(page, '#dpc')).toEqual([
    { type: 'change', detail: { control: 'month', viewMode: 'month' } },
    { type: 'update:view-mode', detail: { value: 'months', control: 'month' } },
  ]);
});

test('w-date-picker-controls emits prev and next without changing the view', async ({ mount, page }) => {
  await mount('<w-date-picker-controls id="dpc" prev-icon="<" next-icon=">" view-mode="month"></w-date-picker-controls>');
  await recordEvents(page, '#dpc', ['change']);

  await expect(page.locator('#dpc .w-date-picker-controls__btn--prev')).toHaveText('<');
  await page.locator('#dpc .w-date-picker-controls__btn--next').click();

  await expect(page.locator('#dpc')).toHaveAttribute('view-mode', 'month');
  expect(await readEvents(page, '#dpc')).toEqual([{ type: 'change', detail: { control: 'next', viewMode: 'month' } }]);
});

test('w-date-picker-controls modal variant combines the chooser buttons', async ({ mount, page }) => {
  await mount('<w-date-picker-controls id="dpc" control-variant="modal" month-text="June" year-text="2026" mode-icon="v"></w-date-picker-controls>');

  await expect(page.locator('#dpc .w-date-picker-controls')).toHaveClass(/w-date-picker-controls--modal/);
  await expect(page.locator('#dpc .w-date-picker-controls__btn--month')).toContainText('June 2026');
  await expect(page.locator('#dpc .w-date-picker-controls__btn--mode')).toHaveText('v');

  await mount('<w-date-picker-controls id="dpc2" control-variant="modal" no-month-picker month-text="June" year-text="2026"></w-date-picker-controls>');
  await expect(page.locator('#dpc2 .w-date-picker-controls__btn--year')).toContainText('June 2026');
  await page.locator('#dpc2 .w-date-picker-controls__btn--year').click();
  await expect(page.locator('#dpc2')).toHaveAttribute('view-mode', 'year');
});

test('w-date-picker-controls active, text, and control-height', async ({ mount, page }) => {
  await mount('<w-date-picker-controls id="dpc" active="year" text="Navigate" control-height="56" month-text="June" year-text="2026"></w-date-picker-controls>');

  await expect(page.locator('#dpc .w-date-picker-controls__btn--year')).toHaveClass(/active/);
  await expect(page.locator('#dpc .w-date-picker-controls__btn--year')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#dpc .w-date-picker-controls__btn--month')).not.toHaveClass(/active/);
  await expect(page.locator('#dpc .w-date-picker-controls__text')).toHaveText('Navigate');
  await expect(page.locator('#dpc .w-date-picker-controls')).toHaveAttribute('style', /--w-date-picker-control-height:56px/);
});

/* ── w-date-picker-header ──────────────────────────────────────────────────── */

test('w-date-picker-header applies a named transition', async ({ mount, page }) => {
  await mount('<w-date-picker-header id="dph" header="Enter date" transition="fade"></w-date-picker-header>');

  const header = page.locator('#dph .w-date-picker-header');
  await expect(header).toHaveClass(/w-date-picker-header--transition-fade/);
  await expect(header).toHaveAttribute('data-transition', 'fade');
  await expect(header).toContainText('Enter date');

  await mount('<w-date-picker-header id="dph2" header="Enter date"></w-date-picker-header>');
  await expect(page.locator('#dph2 .w-date-picker-header')).not.toHaveAttribute('data-transition', /.*/);
});
