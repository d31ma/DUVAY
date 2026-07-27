import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-color-picker renders HSV canvas and edits hex values', async ({ mount, page }) => {
  await mount('<w-color-picker id="cp" value="#1f6f8b"></w-color-picker>');

  await expect(page.locator('#cp .w-color-picker-canvas')).toBeVisible();
  await expect(page.locator('#cp .w-color-picker-hue')).toBeVisible();
  await expect(page.locator('#cp .w-color-picker-input')).toHaveValue('#1f6f8b');

  await recordEvents(page, '#cp', ['change']);
  await page.locator('#cp .w-color-picker-input').fill('#ff0000');
  await page.locator('#cp .w-color-picker-input').dispatchEvent('change');

  await expect(page.locator('#cp')).toHaveAttribute('value', '#ff0000');
  expect(await readEvents(page, '#cp')).toEqual([{ type: 'change', detail: { value: '#ff0000' } }]);
});

test('w-color-picker supports swatches and alpha', async ({ mount, page }) => {
  await mount('<w-color-picker id="cp" value="#10b981" show-alpha alpha="0.5" swatches="#ef4444,#10b981,#3b82f6"></w-color-picker>');

  await expect(page.locator('#cp .w-color-picker-alpha')).toBeVisible();
  await expect(page.locator('#cp [data-color="#10b981"]')).toHaveClass(/selected/);

  await recordEvents(page, '#cp', ['change']);
  await page.locator('#cp [data-color="#3b82f6"]').click();

  await expect(page.locator('#cp')).toHaveAttribute('value', /#3b82f6/i);
  const events = await readEvents(page, '#cp');
  expect(events.at(-1).type).toBe('change');
  expect(events.at(-1).detail.value).toMatch(/^#3b82f6/i);
  expect(events.at(-1).detail.alpha).toBe(0.5);
});

test('w-color-picker keyboard adjusts the canvas', async ({ mount, page }) => {
  await mount('<w-color-picker id="cp" value="#808080"></w-color-picker>');
  await recordEvents(page, '#cp', ['change']);

  await page.locator('#cp .w-color-picker-canvas').focus();
  await page.keyboard.press('ArrowRight');

  expect((await readEvents(page, '#cp')).length).toBeGreaterThan(0);
});

test('w-color-picker hue slider steps, clamps, and jumps with the keyboard', async ({ mount, page }) => {
  await mount('<w-color-picker id="cp" value="#ff0000"></w-color-picker>');
  await recordEvents(page, '#cp', ['change']);
  const hue = page.locator('#cp .w-color-picker-hue');

  // Shift takes the large 10% step: 0deg + 36deg.
  await hue.focus();
  await page.keyboard.press('Shift+ArrowRight');
  await expect(page.locator('#cp')).toHaveAttribute('value', '#ff9900');
  await expect(hue).toHaveAttribute('aria-valuenow', '36');

  await hue.focus();
  await page.keyboard.press('Home');
  await expect(page.locator('#cp')).toHaveAttribute('value', '#ff0000');
  await expect(hue).toHaveAttribute('aria-valuenow', '0');

  // ArrowLeft at the low end clamps rather than wrapping negative.
  await hue.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#cp')).toHaveAttribute('value', '#ff0000');
  await expect(hue).toHaveAttribute('aria-valuenow', '0');

  await hue.focus();
  await page.keyboard.press('End');
  await expect(page.locator('#cp')).toHaveAttribute('value', '#ff0000');

  // Keys the slider does not own are left to the page.
  await hue.focus();
  await page.keyboard.press('ArrowUp');
  expect(await readEvents(page, '#cp')).toHaveLength(4);
});

test('w-color-picker alpha slider is keyboard operable and reflects the alpha attribute', async ({ mount, page }) => {
  await mount('<w-color-picker id="cp" value="#ff0000" show-alpha alpha="0.5"></w-color-picker>');
  await recordEvents(page, '#cp', ['change']);
  const alpha = page.locator('#cp .w-color-picker-alpha');

  await alpha.focus();
  await page.keyboard.press('Home');
  await expect(page.locator('#cp')).toHaveAttribute('alpha', '0');
  await expect(page.locator('#cp')).toHaveAttribute('value', '#ff000000');
  await expect(alpha).toHaveAttribute('aria-valuenow', '0');

  await alpha.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#cp')).toHaveAttribute('alpha', '0.02');
  await expect(page.locator('#cp')).toHaveAttribute('value', '#ff000005');

  await alpha.focus();
  await page.keyboard.press('End');
  await expect(page.locator('#cp')).toHaveAttribute('alpha', '1');
  await expect(page.locator('#cp')).toHaveAttribute('value', '#ff0000');
  await expect(alpha).toHaveAttribute('aria-valuenow', '100');

  const events = await readEvents(page, '#cp');
  expect(events).toHaveLength(3);
  expect(events.at(-1).detail).toEqual({ value: '#ff0000', alpha: 1 });
});

test('w-color-picker formats the edit field by mode and switches between modes', async ({ mount, page }) => {
  await mount('<w-color-picker id="cp" value="#1f6f8b" mode="rgb" modes="hex,rgb,hsl"></w-color-picker>');

  await expect(page.locator('#cp .w-color-picker-input')).toHaveValue('rgb(31, 111, 139)');
  await expect(page.locator('#cp .w-color-picker-input-label')).toHaveText('rgb');
  await expect(page.locator('#cp .w-color-picker-mode option')).toHaveCount(3);

  await recordEvents(page, '#cp', ['update:mode']);
  await page.locator('#cp .w-color-picker-mode').selectOption('hsl');

  await expect(page.locator('#cp')).toHaveAttribute('mode', 'hsl');
  await expect(page.locator('#cp .w-color-picker-input')).toHaveValue(/^hsl\(/);
  expect(await readEvents(page, '#cp')).toEqual([{ type: 'update:mode', detail: { mode: 'hsl' } }]);
});

test('w-color-picker accepts any CSS colour typed into the edit field', async ({ mount, page }) => {
  await mount('<w-color-picker id="cp" value="#1f6f8b" mode="rgb"></w-color-picker>');
  const field = page.locator('#cp .w-color-picker-input');

  await field.fill('rgb(255, 0, 0)');
  await field.dispatchEvent('change');
  await expect(page.locator('#cp')).toHaveAttribute('value', '#ff0000');

  // Nonsense keeps the current value rather than falling back to black.
  await field.fill('not-a-colour');
  await field.dispatchEvent('change');
  await expect(page.locator('#cp')).toHaveAttribute('value', '#ff0000');
});

test('w-color-picker renders a header, title, and divider', async ({ mount, page }) => {
  await mount(`
    <w-color-picker id="plain" title="Brand"></w-color-picker>
    <w-color-picker id="notitle" title="Brand" hide-title></w-color-picker>
    <w-color-picker id="noheader" title="Brand" hide-header></w-color-picker>
    <w-color-picker id="divided" title="Brand" divided></w-color-picker>
  `);

  await expect(page.locator('#plain .w-color-picker-title')).toHaveText('Brand');
  await expect(page.locator('#notitle .w-color-picker-header')).toHaveCount(0);
  await expect(page.locator('#noheader .w-color-picker-header')).toHaveCount(0);
  await expect(page.locator('#divided hr.w-color-picker-divider')).toHaveCount(1);
  await expect(page.locator('#plain hr.w-color-picker-divider')).toHaveCount(0);
});

test('w-color-picker hides sliders, inputs, and input labels independently', async ({ mount, page }) => {
  await mount(`
    <w-color-picker id="nosliders" show-alpha hide-sliders></w-color-picker>
    <w-color-picker id="noinputs" modes="hex,rgb" hide-inputs></w-color-picker>
    <w-color-picker id="nolabels" hide-input-labels></w-color-picker>
  `);

  await expect(page.locator('#nosliders .w-color-picker-canvas')).toHaveCount(1);
  await expect(page.locator('#nosliders .w-color-picker-slider')).toHaveCount(0);

  await expect(page.locator('#noinputs .w-color-picker-edit')).toHaveCount(0);
  await expect(page.locator('#noinputs .w-color-picker-mode')).toHaveCount(0);

  await expect(page.locator('#nolabels .w-color-picker-input')).toHaveCount(1);
  await expect(page.locator('#nolabels .w-color-picker-input-label')).toHaveCount(0);
});

test('w-color-picker sizing props drive the canvas, dot, and swatch area', async ({ mount, page }) => {
  await mount('<w-color-picker id="cp" canvas-height="240" dot-size="24" swatches-max-height="80" swatches="#ff0000,#00ff00"></w-color-picker>');

  const sizes = await page.locator('#cp').evaluate((host) => ({
    canvas: getComputedStyle(host.querySelector('.w-color-picker-canvas')).height,
    dot: getComputedStyle(host.querySelector('.w-color-picker-canvas-thumb')).width,
    swatches: getComputedStyle(host.querySelector('.w-color-picker-swatches')).maxHeight,
  }));

  expect(sizes).toEqual({ canvas: '240px', dot: '24px', swatches: '80px' });
  await expect(page.locator('#cp > .w-color-picker')).toHaveClass(/w-color-picker--scroll-swatches/);
});

test('w-color-picker landscape lays the panel out in two columns', async ({ mount, page }) => {
  await mount('<w-color-picker id="portrait"></w-color-picker><w-color-picker id="landscape" landscape></w-color-picker>');

  const columns = await page.evaluate(() => [
    getComputedStyle(document.querySelector('#portrait > .w-color-picker')).gridTemplateColumns.split(' ').length,
    getComputedStyle(document.querySelector('#landscape > .w-color-picker')).gridTemplateColumns.split(' ').length,
  ]);

  expect(columns[0]).toBe(1);
  expect(columns[1]).toBe(2);
});

test('w-color-picker eye dropper trigger picks a colour and can be hidden or re-iconed', async ({ mount, page }) => {
  await page.evaluate(() => {
    window.EyeDropper = class {
      open() { return Promise.resolve({ sRGBHex: '#123456' }); }
    };
  });
  await mount(`
    <w-color-picker id="cp" value="#ff0000"></w-color-picker>
    <w-color-picker id="hidden" hide-eye-dropper></w-color-picker>
    <w-color-picker id="icon" eye-dropper-icon="colorize"></w-color-picker>
  `);

  const trigger = page.locator('#cp .w-color-picker-eye-dropper');
  await expect(trigger).toHaveCount(1);
  await expect(trigger).toHaveAttribute('aria-label', 'Pick a color from the screen');
  await expect(page.locator('#hidden .w-color-picker-eye-dropper')).toHaveCount(0);
  await expect(page.locator('#icon .w-color-picker-eye-dropper .w-icon')).toHaveText('colorize');

  await recordEvents(page, '#cp', ['change']);
  await trigger.click();

  await expect(page.locator('#cp')).toHaveAttribute('value', '#123456');
  expect((await readEvents(page, '#cp')).at(-1)).toEqual({ type: 'change', detail: { value: '#123456' } });
});
