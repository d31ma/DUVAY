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

test('w-time-picker steps input fields with arrow keys', async ({ mount, page }) => {
  await mount('<w-time-picker id="tp" value="09:30:15" format="24hr" use-seconds variant="input"></w-time-picker>');
  await recordEvents(page, '#tp', ['change']);

  await page.locator('#tp [data-time-field="hours"]').press('ArrowUp');
  await expect(page.locator('#tp')).toHaveAttribute('value', '10:30:15');

  await page.locator('#tp [data-time-field="hours"]').press('ArrowDown');
  await expect(page.locator('#tp')).toHaveAttribute('value', '09:30:15');

  await page.locator('#tp [data-time-field="minutes"]').press('ArrowUp');
  await expect(page.locator('#tp')).toHaveAttribute('value', '09:31:15');

  await page.locator('#tp [data-time-field="seconds"]').press('ArrowDown');
  await expect(page.locator('#tp')).toHaveAttribute('value', '09:31:14');

  // Keys the picker does not own leave the value alone.
  await page.locator('#tp [data-time-field="seconds"]').press('Enter');
  await expect(page.locator('#tp')).toHaveAttribute('value', '09:31:14');

  const events = await readEvents(page, '#tp');
  expect(events.map((event) => event.detail.value)).toEqual(['10:30:15', '09:30:15', '09:31:15', '09:31:14']);
});

test('w-time-picker commits typed hour fields and rejects disallowed ones', async ({ mount, page }) => {
  await mount('<w-time-picker id="tp" value="09:30" variant="input"></w-time-picker>');

  await page.locator('#tp [data-time-field="hours"]').fill('11');
  await page.locator('#tp [data-time-field="hours"]').dispatchEvent('change');
  await expect(page.locator('#tp')).toHaveAttribute('value', '11:30');

  await mount('<w-time-picker id="limited" value="09:30" format="24hr" variant="input" allowed-hours="9,11"></w-time-picker>');

  await page.locator('#limited [data-time-field="hours"]').fill('10');
  await page.locator('#limited [data-time-field="hours"]').dispatchEvent('change');
  await expect(page.locator('#limited')).toHaveAttribute('value', '09:30');
  await expect(page.locator('#limited [data-time-field="hours"]')).toHaveValue('09');
});

test('w-time-picker arrow keys respect allowed values and wrap the hour', async ({ mount, page }) => {
  await mount('<w-time-picker id="tp" value="23:30" format="24hr" variant="input" allowed-minutes="0,30"></w-time-picker>');

  await page.locator('#tp [data-time-field="hours"]').press('ArrowUp');
  await expect(page.locator('#tp')).toHaveAttribute('value', '00:30');

  await page.locator('#tp [data-time-field="minutes"]').press('ArrowUp');
  await expect(page.locator('#tp')).toHaveAttribute('value', '00:00');
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

test('w-time-picker hide-title drops the title and divided rules off the header', async ({ mount, page }) => {
  await mount(`
    <w-time-picker id="t" value="09:15" title="Pick"></w-time-picker>
    <w-time-picker id="h" value="09:15" title="Pick" hide-title></w-time-picker>
    <w-time-picker id="d" value="09:15" title="Pick" divided></w-time-picker>
  `);

  await expect(page.locator('#t .w-time-picker-title')).toHaveText('Pick');
  await expect(page.locator('#h .w-time-picker-title')).toHaveCount(0);

  await expect(page.locator('#d .w-time-picker')).toHaveClass(/w-time-picker--divided/);
  const border = await page.locator('#d .w-time-picker-header').evaluate((el) => getComputedStyle(el).borderBottomWidth);
  expect(parseFloat(border)).toBeGreaterThan(0);
  const plain = await page.locator('#t .w-time-picker-header').evaluate((el) => getComputedStyle(el).borderBottomWidth);
  expect(parseFloat(plain)).toBe(0);
});

/* ── w-time-picker-controls ─────────────────────────────────────────────── */

test('w-time-picker-controls renders the units, marks the view mode, and reports changes', async ({ mount, page }) => {
  await mount('<w-time-picker-controls id="c" value="09:07:03" use-seconds view-mode="minute"></w-time-picker-controls>');
  await recordEvents(page, '#c', ['update:view-mode', 'update:period']);

  await expect(page.locator('#c [data-time-view]')).toHaveCount(3);
  await expect(page.locator('#c [data-time-view="hour"]')).toHaveText('09');
  await expect(page.locator('#c [data-time-view="minute"]')).toHaveText('07');
  await expect(page.locator('#c [data-time-view="second"]')).toHaveText('03');
  await expect(page.locator('#c [data-time-view="minute"]')).toHaveClass(/active/);
  await expect(page.locator('#c [data-time-view="minute"]')).toHaveAttribute('aria-pressed', 'true');

  await page.locator('#c [data-time-view="hour"]').click();
  await expect(page.locator('#c')).toHaveAttribute('view-mode', 'hour');
  await expect(page.locator('#c [data-time-view="hour"]')).toHaveClass(/active/);
  expect(await readEvents(page, '#c')).toEqual([
    { type: 'update:view-mode', detail: { viewMode: 'hour' } },
  ]);
});

test('w-time-picker-controls hides seconds by default and honours hour/minute/second overrides', async ({ mount, page }) => {
  await mount('<w-time-picker-controls id="c" hour="7" minute="5"></w-time-picker-controls>');

  await expect(page.locator('#c [data-time-view]')).toHaveCount(2);
  await expect(page.locator('#c [data-time-view="hour"]')).toHaveText('07');
  await expect(page.locator('#c [data-time-view="minute"]')).toHaveText('05');
  await expect(page.locator('#c .w-time-picker-period')).toHaveCount(0);
});

test('w-time-picker-controls ampm shows a 12-hour clock with a working period toggle', async ({ mount, page }) => {
  await mount('<w-time-picker-controls id="c" value="21:15" ampm></w-time-picker-controls>');
  await recordEvents(page, '#c', ['update:period']);

  await expect(page.locator('#c [data-time-view="hour"]')).toHaveText('09');
  await expect(page.locator('#c [data-time-period="pm"]')).toHaveClass(/active/);

  await page.locator('#c [data-time-period="am"]').click();
  await expect(page.locator('#c')).toHaveAttribute('period', 'am');
  await expect(page.locator('#c [data-time-period="am"]')).toHaveClass(/active/);
  await expect(page.locator('#c [data-time-view="hour"]')).toHaveText('09');
  expect(await readEvents(page, '#c')).toEqual([{ type: 'update:period', detail: { period: 'am' } }]);
});

test('w-time-picker-controls flags values outside min/max or the allowed lists', async ({ mount, page }) => {
  await mount(`
    <w-time-picker-controls id="c" value="10:20" allowed-hours="9,11" allowed-minutes="0,20"></w-time-picker-controls>
    <w-time-picker-controls id="r" value="10:20" min="11:00" max="12:00"></w-time-picker-controls>
    <w-time-picker-controls id="p" value="10:20" ampm min="09:00" max="11:00"></w-time-picker-controls>
  `);

  await expect(page.locator('#c [data-time-view="hour"]')).toHaveAttribute('aria-invalid', 'true');
  expect(await page.locator('#c [data-time-view="minute"]').getAttribute('aria-invalid')).toBeNull();
  await expect(page.locator('#r [data-time-view="hour"]')).toHaveAttribute('aria-invalid', 'true');

  // 22:20 would fall outside max, so PM cannot be picked.
  await expect(page.locator('#p [data-time-period="pm"]')).toBeDisabled();
  await expect(page.locator('#p [data-time-period="am"]')).toBeEnabled();
});

test('w-time-picker-controls input-hints labels each control', async ({ mount, page }) => {
  await mount(`
    <w-time-picker-controls id="c" value="09:07:03" use-seconds input-hints></w-time-picker-controls>
    <w-time-picker-controls id="p" value="09:07"></w-time-picker-controls>
  `);

  expect(await page.locator('#c .w-time-picker-hint').allTextContents()).toEqual(['Hour', 'Minute', 'Second']);
  await expect(page.locator('#p .w-time-picker-hint')).toHaveCount(0);
});

test('w-time-picker-controls stays put while readonly', async ({ mount, page }) => {
  await mount('<w-time-picker-controls id="c" value="09:15" ampm readonly view-mode="hour"></w-time-picker-controls>');

  await page.locator('#c [data-time-view="minute"]').click();
  await expect(page.locator('#c')).toHaveAttribute('view-mode', 'hour');
  await page.locator('#c [data-time-period="pm"]').click();
  await expect(page.locator('#c [data-time-period="am"]')).toHaveClass(/active/);
});

/* ── w-time-picker-clock ────────────────────────────────────────────────── */

test('w-time-picker-clock lays out a minute dial and selects on click', async ({ mount, page }) => {
  await mount('<w-time-picker-clock id="c" value="15"></w-time-picker-clock>');
  await recordEvents(page, '#c', ['change']);

  // 0…59 by 5 = twelve numbers, zero padded.
  await expect(page.locator('#c [data-clock-value]')).toHaveCount(12);
  await expect(page.locator('#c [data-clock-value="5"]')).toHaveText('05');
  await expect(page.locator('#c [data-clock-value="15"]')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#c .w-time-picker-hand')).toHaveAttribute('style', /90deg/);

  await page.locator('#c [data-clock-value="30"]').click();
  await expect(page.locator('#c')).toHaveAttribute('value', '30');
  await expect(page.locator('#c [data-clock-value="30"]')).toHaveClass(/selected/);
  expect(await readEvents(page, '#c')).toEqual([{ type: 'change', detail: { value: 30 } }]);
});

test('w-time-picker-clock ampm, min, max, step, rotate and format shape the dial', async ({ mount, page }) => {
  await mount(`
    <w-time-picker-clock id="a" ampm value="3"></w-time-picker-clock>
    <w-time-picker-clock id="r" min="1" max="4" step="1" rotate="180" format="ampm" value="1"></w-time-picker-clock>
  `);

  await expect(page.locator('#a [data-clock-value]')).toHaveCount(12);
  await expect(page.locator('#a [data-clock-value="1"]')).toHaveText('1');
  await expect(page.locator('#a [data-clock-value="12"]')).toHaveCount(1);

  expect(await page.locator('#r [data-clock-value]').allTextContents()).toEqual(['1', '2', '3', '4']);
  // rotate="180" pushes the first number to the bottom of the dial.
  await expect(page.locator('#r [data-clock-value="1"]')).toHaveAttribute('style', /top:92\.000%/);
});

test('w-time-picker-clock double splits the numbers over two rings', async ({ mount, page }) => {
  await mount('<w-time-picker-clock id="c" min="0" max="23" step="1" double value="0"></w-time-picker-clock>');

  await expect(page.locator('#c [data-clock-value]')).toHaveCount(24);
  const rings = await page.locator('#c').evaluate((el) => {
    const outer = el.querySelector('[data-clock-value="0"]');
    const inner = el.querySelector('[data-clock-value="12"]');
    return { outer: outer.style.top, inner: inner.style.top };
  });
  // Both sit at the top of the dial, the second ring closer to the centre.
  expect(parseFloat(rings.outer)).toBeLessThan(parseFloat(rings.inner));
});

test('w-time-picker-clock displayed-value and allowed-values restrict the dial', async ({ mount, page }) => {
  await mount('<w-time-picker-clock id="c" value="0" allowed-values="0,15,30" displayed-value="min"></w-time-picker-clock>');

  await expect(page.locator('#c .w-time-picker-clock-display')).toHaveText('min');
  await expect(page.locator('#c [data-clock-value="5"]')).toBeDisabled();
  await expect(page.locator('#c [data-clock-value="15"]')).toBeEnabled();

  await page.locator('#c [data-clock-value="15"]').click();
  await expect(page.locator('#c')).toHaveAttribute('value', '15');
});

test('w-time-picker-clock is fully keyboard operable', async ({ mount, page }) => {
  await mount('<w-time-picker-clock id="c" value="0" allowed-values="0,15,30,45"></w-time-picker-clock>');

  await page.locator('#c [data-clock-value="0"]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#c')).toHaveAttribute('value', '15');
  // Focus follows the selection, so the next key keeps working.
  await page.keyboard.press('ArrowUp');
  await expect(page.locator('#c')).toHaveAttribute('value', '30');
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#c')).toHaveAttribute('value', '15');
  await page.keyboard.press('End');
  await expect(page.locator('#c')).toHaveAttribute('value', '45');
  await page.keyboard.press('Home');
  await expect(page.locator('#c')).toHaveAttribute('value', '0');
  // Keys the dial does not own leave the value alone.
  await page.keyboard.press('KeyA');
  await expect(page.locator('#c')).toHaveAttribute('value', '0');

  // Only the selected number is in the tab order.
  await expect(page.locator('#c [data-clock-value="0"]')).toHaveAttribute('tabindex', '0');
  await expect(page.locator('#c [data-clock-value="15"]')).toHaveAttribute('tabindex', '-1');
});

test('w-time-picker-clock scrollable steps through values and readonly freezes it', async ({ mount, page }) => {
  await mount(`
    <w-time-picker-clock id="s" value="0" scrollable></w-time-picker-clock>
    <w-time-picker-clock id="r" value="0" scrollable readonly></w-time-picker-clock>
  `);

  await page.locator('#s .w-time-picker-clock').dispatchEvent('wheel', { deltaY: -100 });
  await expect(page.locator('#s')).toHaveAttribute('value', '5');
  await page.locator('#s .w-time-picker-clock').dispatchEvent('wheel', { deltaY: 100 });
  await expect(page.locator('#s')).toHaveAttribute('value', '0');

  await page.locator('#r .w-time-picker-clock').dispatchEvent('wheel', { deltaY: -100 });
  await expect(page.locator('#r')).toHaveAttribute('value', '0');
  await expect(page.locator('#r [data-clock-value="5"]')).toBeDisabled();
});

/* ── w-picker ───────────────────────────────────────────────────────────── */

test('w-picker renders a titled card and hides the title or the whole header', async ({ mount, page }) => {
  await mount(`
    <w-picker id="p" title="Pick a date">Body</w-picker>
    <w-picker id="t" title="Pick a date" hide-title><span slot="header">Extra</span>Body</w-picker>
    <w-picker id="h" title="Pick a date" hide-header><span slot="header">Extra</span>Body</w-picker>
    <w-picker id="n">Body</w-picker>
  `);

  await expect(page.locator('#p .w-card-header')).toHaveText('Pick a date');
  await expect(page.locator('#p .w-card-body')).toContainText('Body');

  // hide-title drops the text but keeps authored header content…
  await expect(page.locator('#t .w-card-header')).toBeVisible();
  await expect(page.locator('#t .w-card-header')).toHaveText('Extra');
  // …hide-header drops the row entirely.
  await expect(page.locator('#h .w-card-header')).toHaveCount(0);
  // A picker with nothing to show has no header either.
  await expect(page.locator('#n .w-card-header')).toHaveCount(0);
});

test('w-picker divided and landscape rearrange the header', async ({ mount, page }) => {
  await mount(`
    <w-picker id="p" title="Pick">Body</w-picker>
    <w-picker id="d" title="Pick" divided>Body</w-picker>
    <w-picker id="l" title="Pick" landscape divided>Body</w-picker>
  `);

  await expect(page.locator('#p .w-divider')).toHaveCount(0);
  await expect(page.locator('#d .w-divider')).toHaveCount(1);
  await expect(page.locator('#d .w-picker')).toHaveClass(/w-picker--divided/);

  await expect(page.locator('#l .w-picker')).toHaveClass(/w-picker--landscape/);
  await expect(page.locator('#l .w-divider')).toHaveClass(/w-divider--vertical/);
  const boxes = await page.locator('#l').evaluate((el) => {
    const header = el.querySelector('.w-card-header').getBoundingClientRect();
    const body = el.querySelector('.w-card-body').getBoundingClientRect();
    return { headerRight: header.right, bodyLeft: body.left };
  });
  expect(boxes.bodyLeft).toBeGreaterThanOrEqual(boxes.headerRight);
});
