import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-range-slider reflects range attrs and renders a single filled track', async ({ mount, page }) => {
  await mount('<w-range-slider id="range" label="Budget" min="0" max="100" start="20" end="80" step="10"></w-range-slider>');

  await expect(page.locator('#range .w-label')).toHaveText('Budget');
  await expect(page.locator('#range .w-range-slider-input')).toHaveCount(2);
  await expect(page.locator('#range .w-range-slider-input').first()).toHaveValue('20');
  await expect(page.locator('#range .w-range-slider-input').last()).toHaveValue('80');
  await expect(page.locator('#range .w-messages')).toHaveText(/20\s+.\s+80/);

  // Both thumbs share one line, and the fill spans the selected segment.
  const fill = await page.locator('#range .w-range-slider-control').evaluate((el) => {
    const f = el.querySelector('.w-range-slider-fill').getBoundingClientRect();
    return { start: el.style.getPropertyValue('--start'), end: el.style.getPropertyValue('--end'), fillWidth: Math.round(f.width) };
  });
  expect(fill.start).toBe('20%');
  expect(fill.end).toBe('80%');
  expect(fill.fillWidth).toBeGreaterThan(0);
  const tops = await page.locator('#range .w-range-slider-input').evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().top)));
  expect(new Set(tops).size).toBe(1);
});

test('w-range-slider clamps thumbs so they cannot cross and emits input', async ({ mount, page }) => {
  await mount('<w-range-slider id="range" min="0" max="100" start="20" end="80" step="10"></w-range-slider>');
  await recordEvents(page, '#range', ['input']);

  // Push the start thumb past the end — it should stop at the end value.
  await page.locator('#range .w-range-slider-input').first().evaluate((input) => {
    input.value = '90';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });

  await expect(page.locator('#range')).toHaveAttribute('start', '80');
  await expect(page.locator('#range')).toHaveAttribute('end', '80');
  await expect(page.locator('#range .w-messages')).toHaveText(/80\s+.\s+80/);
  expect(await readEvents(page, '#range')).toEqual([
    { type: 'input', detail: { start: 80, end: 80 } },
  ]);
});

test('w-range-slider disabled disables both inputs', async ({ mount, page }) => {
  await mount('<w-range-slider id="range" start="30" end="70" disabled></w-range-slider>');

  await expect(page.locator('#range .w-range-slider')).toHaveClass(/w-range-slider--disabled/);
  await expect(page.locator('#range .w-range-slider-input').first()).toBeDisabled();
  await expect(page.locator('#range .w-range-slider-input').last()).toBeDisabled();
});

test('w-range-slider thumb-label renders bubbles that track each thumb', async ({ mount, page }) => {
  await mount('<w-range-slider id="range" min="0" max="100" start="20" end="80" step="10" thumb-label="always"></w-range-slider>');

  await expect(page.locator('#range .w-range-slider')).toHaveClass(/w-range-slider--thumb-label-always/);
  await expect(page.locator('#range .w-range-slider-thumb-label')).toHaveCount(2);
  await expect(page.locator('#range .w-range-slider-thumb-label[data-thumb="start"]')).toHaveText('20');
  await expect(page.locator('#range .w-range-slider-thumb-label[data-thumb="end"]')).toHaveText('80');

  // Moving a thumb updates its bubble text.
  await page.locator('#range .w-range-slider-input').last().evaluate((input) => {
    input.value = '60';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(page.locator('#range .w-range-slider-thumb-label[data-thumb="end"]')).toHaveText('60');
});

test('w-range-slider ticks renders one mark per step', async ({ mount, page }) => {
  await mount('<w-range-slider id="range" min="0" max="10" step="1" start="3" end="7" ticks></w-range-slider>');

  // 0..10 inclusive = 11 marks.
  await expect(page.locator('#range .w-range-slider-tick')).toHaveCount(11);
});

test('w-range-slider vertical applies the modifier and stays interactive', async ({ mount, page }) => {
  await mount('<w-range-slider id="range" min="0" max="100" start="20" end="80" step="2" direction="vertical"></w-range-slider>');

  await expect(page.locator('#range .w-range-slider')).toHaveClass(/w-range-slider--vertical/);
  const box = await page.locator('#range .w-range-slider-control').boundingBox();
  expect(box.height).toBeGreaterThan(box.width);

  await page.locator('#range .w-range-slider-input').last().evaluate((input) => {
    input.value = '70';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(page.locator('#range')).toHaveAttribute('end', '70');
});

test('w-range-slider reverse mirrors the track and still spans the selection', async ({ mount, page }) => {
  await mount('<w-range-slider id="range" min="0" max="100" start="20" end="80" reverse></w-range-slider>');

  await expect(page.locator('#range .w-range-slider')).toHaveClass(/w-range-slider--reverse/);
  const vars = await page.locator('#range .w-range-slider-control').evaluate((el) => ({
    start: el.style.getPropertyValue('--start'),
    end: el.style.getPropertyValue('--end'),
  }));
  // 20 -> 80% and 80 -> 20% once mirrored; the pair stays ordered so the fill spans.
  expect(vars).toEqual({ start: '20%', end: '80%' });
});

test('w-range-slider strict reflects the non-crossing rule DuVay always applies', async ({ mount, page }) => {
  await mount('<w-range-slider id="range" min="0" max="100" start="20" end="80" step="10" strict></w-range-slider>');

  await expect(page.locator('#range .w-range-slider')).toHaveClass(/w-range-slider--strict/);
  await page.locator('#range .w-range-slider-input').last().evaluate((input) => {
    input.value = '0';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(page.locator('#range')).toHaveAttribute('end', '20');
});

test('w-range-slider name gives each thumb its own form field', async ({ mount, page }) => {
  await mount('<w-range-slider id="range" name="budget" start="10" end="90"></w-range-slider>');

  await expect(page.locator('#range .w-range-slider-input').first()).toHaveAttribute('name', 'budget-start');
  await expect(page.locator('#range .w-range-slider-input').last()).toHaveAttribute('name', 'budget-end');
});

test('w-range-slider colour and size attributes feed the shared custom properties', async ({ mount, page }) => {
  await mount('<w-range-slider id="range" start="20" end="80" color="success" track-color="surface-container"'
    + ' thumb-color="warning" thumb-size="24" track-size="8" tick-size="4" ticks></w-range-slider>');

  const control = page.locator('#range .w-range-slider-control');
  await expect(control).toHaveAttribute('style', /--w-slider-color:var\(--w-success\)/);
  await expect(control).toHaveAttribute('style', /--w-slider-track-color:var\(--w-surface-container\)/);
  await expect(control).toHaveAttribute('style', /--w-slider-thumb-color:var\(--w-warning\)/);
  await expect(control).toHaveCSS('--w-slider-thumb-size', '24px');
  await expect(control).toHaveCSS('--w-slider-track-size', '8px');
  const tick = await page.locator('#range .w-range-slider-tick').first().boundingBox();
  expect(Math.round(tick.width)).toBe(4);
});

test('w-range-slider track-fill-color overrides color for the filled run', async ({ mount, page }) => {
  await mount('<w-range-slider id="range" start="20" end="80" color="success" track-fill-color="warning"></w-range-slider>');
  await expect(page.locator('#range .w-range-slider-control')).toHaveAttribute('style', /--w-slider-color:var\(--w-warning\)/);
});

test('w-range-slider show-ticks and a JSON tick list', async ({ mount, page }) => {
  await mount('<w-range-slider id="hover" min="0" max="4" step="1" start="1" end="3" show-ticks></w-range-slider>'
    + '<w-range-slider id="json" min="0" max="100" start="10" end="90" ticks="[0,50,100]"></w-range-slider>');

  await expect(page.locator('#hover .w-range-slider-tick')).toHaveCount(5);
  await expect(page.locator('#hover .w-range-slider-tick').first()).toHaveCSS('opacity', '0');
  await expect(page.locator('#json .w-range-slider-tick')).toHaveCount(3);
});

test('w-range-slider renders hint, messages, and error messages', async ({ mount, page }) => {
  await mount('<w-range-slider id="hint" start="1" end="9" hint="Pick a band"></w-range-slider>'
    + '<w-range-slider id="msg" start="1" end="9" messages="Inclusive"></w-range-slider>'
    + '<w-range-slider id="err" start="1" end="9" error-messages="Too wide"></w-range-slider>');

  await expect(page.locator('#hint .w-messages')).toHaveText('Pick a band');
  await expect(page.locator('#msg .w-slider-message')).toHaveText('Inclusive');
  await expect(page.locator('#err .w-slider-message')).toHaveText('Too wide');
  await expect(page.locator('#err .w-range-slider')).toHaveClass(/w-slider-surface--error/);
  await expect(page.locator('#err .w-messages')).toBeHidden();
});

test('w-range-slider hide-details drops the message row', async ({ mount, page }) => {
  await mount('<w-range-slider id="range" start="1" end="9" hide-details></w-range-slider>');
  await expect(page.locator('#range .w-messages')).toHaveCount(0);
});

test('w-range-slider validation-value drives the range rule; validate-on gates it', async ({ mount, page }) => {
  await mount('<w-range-slider id="ok" min="0" max="10" start="2" end="8"></w-range-slider>'
    + '<w-range-slider id="bad" min="0" max="10" start="2" end="8" validation-value="2,80"></w-range-slider>'
    + '<w-range-slider id="late" min="0" max="10" start="2" end="8" validation-value="99" validate-on="blur"></w-range-slider>');

  await expect(page.locator('#ok .w-slider-message')).toHaveCount(0);
  await expect(page.locator('#bad .w-slider-message')).toHaveText('Value is out of range');

  await expect(page.locator('#late .w-slider-message')).toHaveCount(0);
  await page.locator('#late .w-range-slider-input').first().focus();
  await page.locator('#late .w-range-slider-input').first().blur();
  await expect(page.locator('#late .w-slider-message')).toHaveText('Value is out of range');
});

test('w-range-slider error and persistent-hint', async ({ mount, page }) => {
  await mount('<w-range-slider id="flag" start="1" end="9" error></w-range-slider>'
    + '<w-range-slider id="both" start="1" end="9" hint="Range" error-messages="Nope" persistent-hint></w-range-slider>');

  await expect(page.locator('#flag .w-range-slider')).toHaveClass(/w-slider-surface--error/);
  await expect(page.locator('#flag .w-range-slider-input').first()).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#both .w-messages')).toBeVisible();
  await expect(page.locator('#both .w-slider-message')).toHaveText('Nope');
});

test('w-range-slider max-errors caps the shown errors', async ({ mount, page }) => {
  await mount('<w-range-slider id="range" start="1" end="9" error-messages="A,B,C" max-errors="2"></w-range-slider>');
  await expect(page.locator('#range .w-slider-message')).toHaveText(['A', 'B']);
});

test('w-range-slider outside icons and surface modifiers', async ({ mount, page }) => {
  await mount('<w-range-slider id="range" start="1" end="9" prepend-icon="min" append-icon="max"'
    + ' icon-color="success" glow center-affix indent-details hide-spin-buttons></w-range-slider>');

  await expect(page.locator('#range .w-slider-prepend .w-icon')).toHaveText('min');
  await expect(page.locator('#range .w-slider-append .w-icon')).toHaveText('max');
  await expect(page.locator('#range .w-range-slider-control')).toHaveAttribute('style', /--w-slider-icon-color:var\(--w-success\)/);

  const root = page.locator('#range .w-range-slider');
  await expect(root).toHaveClass(/w-slider-surface--glow/);
  await expect(root).toHaveClass(/w-slider-surface--center-affix/);
  await expect(root).toHaveClass(/w-slider-surface--indent-details/);
  await expect(root).toHaveClass(/w-slider-surface--hide-spin-buttons/);
});

test('w-range-slider ripple and no-keyboard', async ({ mount, page }) => {
  await mount('<w-range-slider id="rip" start="1" end="9" ripple></w-range-slider>'
    + '<w-range-slider id="dead" min="0" max="100" step="10" start="20" end="80" no-keyboard></w-range-slider>');

  const control = page.locator('#rip .w-range-slider-control');
  await expect(control).toHaveClass(/w-ripple-host/);
  await control.dispatchEvent('pointerdown', { clientX: 20, clientY: 10 });
  await expect(page.locator('#rip .w-ripple-ink')).toHaveCount(1);

  await page.locator('#dead .w-range-slider-input').first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#dead .w-range-slider-input').first()).toHaveValue('20');
});

test('w-range-slider publishes slider ARIA per thumb', async ({ mount, page }) => {
  await mount('<w-range-slider id="range" min="5" max="25" start="10" end="20"></w-range-slider>');

  const first = page.locator('#range .w-range-slider-input').first();
  await expect(first).toHaveAttribute('role', 'slider');
  await expect(first).toHaveAttribute('aria-valuemin', '5');
  await expect(first).toHaveAttribute('aria-valuemax', '25');
  await expect(first).toHaveAttribute('aria-valuenow', '10');

  await first.evaluate((input) => {
    input.value = '15';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(first).toHaveAttribute('aria-valuenow', '15');
});

test('w-range-slider readonly keeps the thumbs inert without dimming', async ({ mount, page }) => {
  await mount('<w-range-slider id="range" start="1" end="9" readonly></w-range-slider>');

  await expect(page.locator('#range .w-range-slider')).toHaveClass(/w-range-slider--readonly/);
  await expect(page.locator('#range .w-range-slider')).not.toHaveClass(/w-range-slider--disabled/);
  await expect(page.locator('#range .w-range-slider-input').first()).toBeDisabled();
});
