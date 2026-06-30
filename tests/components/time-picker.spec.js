import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-time-picker renders an analog hour clock and selects hour/minute', async ({ mount, page }) => {
  await mount('<w-time-picker id="tp" label="Time" value="09:30"></w-time-picker>');

  await expect(page.locator('#tp .w-time-picker-clock')).toBeVisible();
  await expect(page.locator('#tp .w-time-picker-display.active')).toHaveText('09');

  await recordEvents(page, '#tp', ['change']);
  await page.locator('#tp [data-time-unit="hour"][data-time-value="3"]').click();

  await expect(page.locator('#tp')).toHaveAttribute('value', '03:30');
  await expect(page.locator('#tp .w-time-picker-display.active')).toHaveText('30');
  expect(await readEvents(page, '#tp')).toEqual([{ type: 'change', detail: { value: '03:30' } }]);
});

test('w-time-picker toggles AM and PM', async ({ mount, page }) => {
  await mount('<w-time-picker id="tp" value="09:15"></w-time-picker>');

  const headerLayout = await page.locator('#tp .w-time-picker-header').evaluate((header) => {
    const displays = header.querySelectorAll('.w-time-picker-display');
    const first = displays[0].getBoundingClientRect();
    const minute = displays[1].getBoundingClientRect();
    const period = header.querySelector('.w-time-picker-period').getBoundingClientRect();
    const bounds = header.getBoundingClientRect();
    return {
      periodGap: period.left - minute.right,
      centeringDelta: Math.abs((first.left - bounds.left) - (bounds.right - period.right)),
    };
  });
  expect(headerLayout.periodGap).toBeLessThanOrEqual(8);
  expect(headerLayout.centeringDelta).toBeLessThanOrEqual(2);

  await page.locator('#tp [data-time-period="PM"]').click();

  await expect(page.locator('#tp')).toHaveAttribute('value', '21:15');
  await expect(page.locator('#tp [data-time-period="PM"]')).toHaveClass(/active/);
});

test('w-time-picker supports 24-hour seconds mode', async ({ mount, page }) => {
  await mount('<w-time-picker id="tp" value="18:45:00" format="24hr" use-seconds view="minutes"></w-time-picker>');

  await expect(page.locator('#tp .w-time-picker-display')).toHaveCount(3);
  await page.locator('#tp [data-time-unit="minute"][data-time-value="5"]').click();

  await expect(page.locator('#tp')).toHaveAttribute('value', '18:05:00');
  await expect(page.locator('#tp')).toHaveAttribute('view', 'seconds');
});

test('w-time-picker supports Vuetify validation props', async ({ mount, page }) => {
  await mount('<w-time-picker id="tp" value="11:15" format="24hr" min="09:30" max="22:15" allowed-hours="[9,11,13,15,17,19,21]" allowed-minutes="10,15,20,25,30,35,40,45,50"></w-time-picker>');

  await expect(page.locator('#tp [data-time-unit="hour"][data-time-value="10"]')).toBeDisabled();
  await expect(page.locator('#tp [data-time-unit="hour"][data-time-value="11"]')).toBeEnabled();

  await page.locator('#tp [data-time-unit="hour"][data-time-value="13"]').click();
  await expect(page.locator('#tp')).toHaveAttribute('value', '13:15');
  await expect(page.locator('#tp')).toHaveAttribute('view-mode', 'minute');

  await expect(page.locator('#tp [data-time-unit="minute"][data-time-value="0"]')).toBeDisabled();
  await page.locator('#tp [data-time-unit="minute"][data-time-value="20"]').click();
  await expect(page.locator('#tp')).toHaveAttribute('value', '13:20');
});

test('w-time-picker supports scrollable wheels and update events', async ({ mount, page }) => {
  await mount('<w-time-picker id="tp" value="09:15" scrollable></w-time-picker>');
  await recordEvents(page, '#tp', ['change', 'input']);

  await page.locator('#tp .w-time-picker-clock').dispatchEvent('wheel', { deltaY: -100 });

  await expect(page.locator('#tp')).toHaveAttribute('value', '10:15');
  const events = await readEvents(page, '#tp');
  expect(events.some(event => event.type === 'input' && event.detail.value === 10)).toBe(true);
  expect(events.some(event => event.type === 'change' && event.detail.value === '10:15')).toBe(true);
});

test('w-time-picker reflects visual props and input variant', async ({ mount, page }) => {
  await mount('<w-time-picker id="tp" value="18:45:30" title="Deploy" label="Window" format="24hr" use-seconds variant="input" color="success" elevation="4" density="compact" width="320px" hide-header></w-time-picker>');

  const picker = page.locator('#tp .w-time-picker');
  await expect(picker).toHaveClass(/w-time-picker--variant-input/);
  await expect(picker).toHaveClass(/w-time-picker--color-success/);
  await expect(picker).toHaveClass(/w-time-picker--elevation-4/);
  await expect(picker).toHaveClass(/w-time-picker--density-compact/);
  await expect(picker).toHaveAttribute('style', /width:320px/);
  await expect(page.locator('#tp .w-time-picker-title')).toHaveCount(0);
  await expect(page.locator('#tp [data-time-field]')).toHaveCount(3);

  await page.locator('#tp [data-time-field="minutes"]').fill('5');
  await page.locator('#tp [data-time-field="minutes"]').dispatchEvent('change');
  await expect(page.locator('#tp')).toHaveAttribute('value', '18:05:30');
});

test('w-time-picker has stable default geometry and visually hidden field labels', async ({ mount, page }) => {
  await mount('<w-time-picker id="tp" value="18:45:30" format="24hr" use-seconds variant="input"></w-time-picker>');

  await expect(page.locator('#tp')).toHaveCSS('display', 'block');
  await expect(page.locator('#tp .w-time-picker')).toHaveCSS('width', '328px');
  await expect(page.locator('#tp .w-time-picker-clock')).toHaveCSS('width', '256px');
  await expect(page.locator('#tp .w-time-picker-header')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(page.locator('#tp .w-time-picker-field.active input')).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(page.locator('#tp .w-time-picker-field .w-sr-only').first()).toHaveCSS('position', 'absolute');
});

test('w-time-picker fits common mobile viewports without horizontal overflow', async ({ mount, page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await mount('<w-time-picker id="tp" value="09:30"></w-time-picker>');

  const widths = await page.locator('#root').evaluate((root) => {
    const picker = root.querySelector('.w-time-picker');
    return {
      available: root.clientWidth,
      picker: picker.getBoundingClientRect().width,
    };
  });

  expect(widths.picker).toBeLessThanOrEqual(widths.available);
});

test('w-time-picker supports readonly, disabled, and ampm-in-title', async ({ mount, page }) => {
  await mount(`
    <w-time-picker id="ro" value="09:15" readonly ampm-in-title title="Schedule"></w-time-picker>
    <w-time-picker id="dis" value="09:15" disabled></w-time-picker>
  `);

  await expect(page.locator('#ro .w-time-picker-title')).toHaveText('Schedule AM');
  await expect(page.locator('#ro .w-time-picker')).toHaveClass(/w-time-picker--readonly/);
  await expect(page.locator('#ro [data-time-unit="hour"][data-time-value="3"]')).toBeDisabled();
  await expect(page.locator('#dis .w-time-picker')).toHaveClass(/w-time-picker--disabled/);
});
