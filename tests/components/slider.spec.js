import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-slider reflects min, max, value, step, label, name, and size attributes', async ({ mount, page }) => {
  await mount('<w-slider id="slider" min="10" max="90" value="40" step="5" name="volume" size="lg" label="Volume"></w-slider>');

  const input = page.locator('#slider .w-slider-input');
  await expect(page.locator('#slider .w-label')).toHaveText('Volume');
  await expect(input).toHaveAttribute('min', '10');
  await expect(input).toHaveAttribute('max', '90');
  await expect(input).toHaveValue('40');
  await expect(input).toHaveAttribute('step', '5');
  await expect(input).toHaveAttribute('name', 'volume');
  await expect(page.locator('#slider .w-slider-field')).toHaveClass(/w-slider-field--lg/);

  // Fill spans from min to the value: (40-10)/(90-10) = 37.5%.
  await expect(page.locator('#slider .w-slider-control')).toHaveAttribute('style', /--value:\s*37\.5%/);

  await page.locator('#slider').evaluate((el) => {
    el.value = '50';
    el.setAttribute('size', 'sm');
  });

  await expect(input).toHaveValue('50');
  await expect(page.locator('#slider .w-slider-field')).toHaveClass(/w-slider-field--sm/);
});

test('w-slider emits input and change with reflected host value', async ({ mount, page }) => {
  await mount('<w-slider id="slider" value="40" name="volume"></w-slider>');
  await recordEvents(page, '#slider', ['input', 'change']);

  await page.locator('#slider .w-slider-input').evaluate((input) => {
    input.value = '60';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  await expect(page.locator('#slider')).toHaveAttribute('value', '60');
  await expect(page.locator('#slider .w-messages')).toHaveText('60');
  expect(await readEvents(page, '#slider')).toEqual([
    { type: 'input', detail: { value: '60', name: 'volume' } },
    { type: 'change', detail: { value: '60', name: 'volume' } },
  ]);
});

test('w-slider disabled and readonly disable the input; only disabled dims', async ({ mount, page }) => {
  await mount('<w-slider id="d" value="50" disabled></w-slider><w-slider id="r" value="50" readonly></w-slider>');

  await expect(page.locator('#d .w-slider-field')).toHaveClass(/w-slider-field--disabled/);
  await expect(page.locator('#d .w-slider-input')).toBeDisabled();
  await expect(page.locator('#r .w-slider-field')).toHaveClass(/w-slider-field--readonly/);
  await expect(page.locator('#r .w-slider-field')).not.toHaveClass(/w-slider-field--disabled/);
  await expect(page.locator('#r .w-slider-input')).toBeDisabled();
});

test('w-slider thumb-label renders a bubble that tracks the value', async ({ mount, page }) => {
  await mount('<w-slider id="slider" min="0" max="100" value="30" thumb-label="always"></w-slider>');

  const bubble = page.locator('#slider .w-slider-thumb-label');
  await expect(page.locator('#slider .w-slider-field')).toHaveClass(/w-slider-field--thumb-label-always/);
  await expect(bubble).toHaveText('30');
  await expect(bubble).toHaveAttribute('style', /--pos:\s*30%/);

  await page.locator('#slider .w-slider-input').evaluate((input) => {
    input.value = '75';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(bubble).toHaveText('75');
  await expect(bubble).toHaveAttribute('style', /--pos:\s*75%/);
});

test('w-slider draws a tick per step and labels them with tick-labels', async ({ mount, page }) => {
  await mount('<w-slider id="slider" min="0" max="4" step="1" value="2" tick-labels="A|B|C|D|E"></w-slider>');

  await expect(page.locator('#slider .w-slider-tick')).toHaveCount(5);
  await expect(page.locator('#slider .w-slider-tick-label')).toHaveText(['A', 'B', 'C', 'D', 'E']);
});

test('w-slider vertical orientation and color theming', async ({ mount, page }) => {
  await mount('<w-slider id="slider" value="40" direction="vertical" color="success" track-color="surface-container"></w-slider>');

  await expect(page.locator('#slider .w-slider-field')).toHaveClass(/w-slider-field--vertical/);
  await expect(page.locator('#slider .w-slider-control')).toHaveAttribute('style', /--w-slider-color:var\(--w-success\)/);
  await expect(page.locator('#slider .w-slider-control')).toHaveAttribute('style', /--w-slider-track-color:var\(--w-surface-container\)/);
});

test('w-slider reverse flips the fill anchor', async ({ mount, page }) => {
  await mount('<w-slider id="slider" min="0" max="100" value="25" reverse></w-slider>');

  await expect(page.locator('#slider .w-slider-field')).toHaveClass(/w-slider-field--reverse/);
  // reverse maps value 25 to 75% along the track.
  await expect(page.locator('#slider .w-slider-control')).toHaveAttribute('style', /--value:\s*75%/);
});

test('w-slider supports inline oninput and @input handlers', async ({ mount, page }) => {
  await mount(`
    <w-slider id="slider" value="10"
      oninput="this.dataset.on = event.detail.value"
      @input="this.dataset.at = event.detail.value"></w-slider>
  `);

  await page.locator('#slider .w-slider-input').evaluate((input) => {
    input.value = '20';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });

  await expect(page.locator('#slider')).toHaveAttribute('data-on', '20');
  await expect(page.locator('#slider')).toHaveAttribute('data-at', '20');
});
