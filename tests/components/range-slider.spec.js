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
