import { expect, readEvents, recordEvents, test } from '../setup/component-test.js';

test('w-color-input renders swatches, selects on click, and emits change', async ({ mount, page }) => {
  await mount('<w-color-input id="ci" label="Brand" value="#3b82f6" swatches="#ef4444,#10b981,#3b82f6"></w-color-input>');
  await recordEvents(page, '#ci', ['change']);

  await expect(page.locator('#ci .w-color-swatch')).toHaveCount(3);
  await expect(page.locator('#ci .w-color-swatch.selected')).toHaveAttribute('data-color', '#3b82f6');

  await page.locator('#ci .w-color-swatch[data-color="#ef4444"]').click();
  await expect(page.locator('#ci')).toHaveAttribute('value', '#ef4444');
  await expect(page.locator('#ci .w-input')).toHaveValue('#ef4444');
  await expect(page.locator('#ci input[type="color"]')).toHaveValue('#ef4444');
  await expect(page.locator('#ci .w-color-swatch.selected')).toHaveAttribute('data-color', '#ef4444');
  expect(await readEvents(page, '#ci')).toEqual([{ type: 'change', detail: { value: '#ef4444' } }]);
});

test('w-color-input formats the text value by mode', async ({ mount, page }) => {
  await mount(`
    <w-color-input id="rgb" value="#10b981" mode="rgb"></w-color-input>
    <w-color-input id="hsl" value="#8b5cf6" mode="hsl"></w-color-input>
  `);

  await expect(page.locator('#rgb .w-input')).toHaveValue('rgb(16, 185, 129)');
  await expect(page.locator('#hsl .w-input')).toHaveValue('hsl(258, 90%, 66%)');
});

test('w-color-input disabled blocks its controls', async ({ mount, page }) => {
  await mount('<w-color-input id="ci" value="#ef4444" swatches="#ef4444,#10b981" disabled></w-color-input>');

  await expect(page.locator('#ci input[type="color"]')).toBeDisabled();
  await expect(page.locator('#ci .w-input')).toBeDisabled();
  await expect(page.locator('#ci .w-color-swatch').first()).toBeDisabled();
});

test('w-color-picker supports swatches and hide-canvas (swatches-only)', async ({ mount, page }) => {
  await mount('<w-color-picker id="cp" value="#3b82f6" hide-canvas swatches="#ef4444,#3b82f6"></w-color-picker>');
  await recordEvents(page, '#cp', ['change']);

  await expect(page.locator('#cp input[type="color"]')).toHaveCount(0);
  await expect(page.locator('#cp .w-color-swatch')).toHaveCount(2);

  await page.locator('#cp .w-color-swatch[data-color="#ef4444"]').click();
  await expect(page.locator('#cp')).toHaveAttribute('value', '#ef4444');
  await expect(page.locator('#cp code')).toHaveText('#ef4444');
  await expect(page.locator('#cp .w-color-swatch.selected')).toHaveAttribute('data-color', '#ef4444');
  expect(await readEvents(page, '#cp')).toEqual([{ type: 'change', detail: { value: '#ef4444' } }]);
});

test('w-color-input normalises any typed CSS colour into hex', async ({ mount, page }) => {
  await mount('<w-color-input id="ci" label="Brand" value="#3b82f6"></w-color-input>');
  await recordEvents(page, '#ci', ['change']);
  const text = page.locator('#ci .w-input');

  await text.fill('rebeccapurple');
  await text.dispatchEvent('change');
  await expect(page.locator('#ci')).toHaveAttribute('value', '#663399');
  await expect(page.locator('#ci input[type="color"]')).toHaveValue('#663399');
  await expect(text).toHaveValue('#663399');

  // A colour the canvas cannot serialise as hex (alpha) keeps the current value.
  await text.fill('rgba(0, 0, 0, 0.5)');
  await text.dispatchEvent('change');
  await expect(page.locator('#ci')).toHaveAttribute('value', '#663399');
  await expect(text).toHaveValue('#663399');

  // An empty entry is ignored outright — no value change and no event.
  await text.fill('');
  await text.dispatchEvent('change');
  await expect(page.locator('#ci')).toHaveAttribute('value', '#663399');
  await expect(text).toHaveValue('');

  expect(await readEvents(page, '#ci')).toEqual([
    { type: 'change', detail: { value: '#663399' } },
    { type: 'change', detail: { value: '#663399' } },
  ]);
});

test('w-color-input keeps its value when a canvas 2D context is unavailable', async ({ mount, page }) => {
  await mount('<w-color-input id="ci" value="#3b82f6"></w-color-input>');
  await recordEvents(page, '#ci', ['change']);
  await page.evaluate(() => {
    window.__wRealGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = () => null;
  });

  const text = page.locator('#ci .w-input');
  await text.fill('tomato');
  await text.dispatchEvent('change');

  await expect(page.locator('#ci')).toHaveAttribute('value', '#3b82f6');
  await expect(text).toHaveValue('#3b82f6');
  expect(await readEvents(page, '#ci')).toEqual([{ type: 'change', detail: { value: '#3b82f6' } }]);

  await page.evaluate(() => { HTMLCanvasElement.prototype.getContext = window.__wRealGetContext; });
});

test('w-color-input renders the text-field surface: title, label, affixes, hint, counter', async ({ mount, page }) => {
  await mount('<w-color-input id="ci" title="Brand colour" label="Brand" placeholder="Pick one" prefix="#" suffix="hex" type="search" name="brand" hint="Choose wisely" counter="12"></w-color-input>');

  await expect(page.locator('#ci .w-color-input-title')).toHaveText('Brand colour');
  await expect(page.locator('#ci label.w-label')).toHaveText('Brand');
  await expect(page.locator('#ci .w-color-input-prefix')).toHaveText('#');
  await expect(page.locator('#ci .w-color-input-suffix')).toHaveText('hex');
  await expect(page.locator('#ci .w-color-input-messages--hint')).toHaveText('Choose wisely');
  await expect(page.locator('#ci .w-color-input-counter')).toHaveText('7 / 12');

  const input = page.locator('#ci .w-input');
  await expect(input).toHaveAttribute('placeholder', 'Pick one');
  await expect(input).toHaveAttribute('type', 'search');
  await expect(input).toHaveAttribute('name', 'brand');

  // The visible label is wired to the text input, not the native colour pip.
  const target = await page.locator('#ci label.w-label').getAttribute('for');
  await expect(input).toHaveAttribute('id', target);
});

test('w-color-input counter defaults to 25 and tracks typing', async ({ mount, page }) => {
  await mount('<w-color-input id="ci" value="#ff0000" counter></w-color-input>');

  await expect(page.locator('#ci .w-color-input-counter')).toHaveText('7 / 25');
  await page.locator('#ci .w-input').fill('red');
  await expect(page.locator('#ci .w-color-input-counter')).toHaveText('3 / 25');
});

test('w-color-input maps the styling flags onto modifier classes', async ({ mount, page }) => {
  await mount('<w-color-input id="ci" variant="filled" flat reverse active dirty glow single-line center-affix indent-details persistent-placeholder persistent-counter persistent-hint persistent-clear hide-spin-buttons></w-color-input>');

  const classes = await page.locator('#ci .w-color-input').evaluate((el) => [...el.classList].sort());
  expect(classes).toEqual([
    'w-color-input',
    'w-color-input--active',
    'w-color-input--center-affix',
    'w-color-input--dirty',
    'w-color-input--filled',
    'w-color-input--flat',
    'w-color-input--glow',
    'w-color-input--hide-spin-buttons',
    'w-color-input--indent-details',
    'w-color-input--persistent-clear',
    'w-color-input--persistent-counter',
    'w-color-input--persistent-hint',
    'w-color-input--persistent-placeholder',
    'w-color-input--reverse',
    'w-color-input--single-line',
    'w-field',
  ]);

  // single-line drops the standalone label and reuses it as the placeholder.
  await expect(page.locator('#ci label.w-label')).toHaveCount(0);
  await expect(page.locator('#ci .w-input')).toHaveAttribute('placeholder', 'Color');
});

test('w-color-input places icons in all four adornment slots', async ({ mount, page }) => {
  await mount('<w-color-input id="ci" prepend-icon="palette" append-icon="tune" prepend-inner-icon="brush" append-inner-icon="check" icon-color="success"></w-color-input>');

  await expect(page.locator('#ci .w-color-input-prepend .w-icon')).toHaveText('palette');
  await expect(page.locator('#ci .w-color-input-append .w-icon')).toHaveText('tune');
  await expect(page.locator('#ci .w-color-input-prepend-inner .w-icon')).toHaveText('brush');
  await expect(page.locator('#ci .w-color-input-append-inner .w-icon')).toHaveText('check');
  // The pip rides in prepend-inner by default, alongside its icon.
  await expect(page.locator('#ci .w-color-input-prepend-inner input[type="color"]')).toHaveCount(1);

  const iconColor = await page.locator('#ci .w-color-input').evaluate((el) => el.style.getPropertyValue('--w-color-input-icon-color'));
  expect(iconColor).toContain('--w-success');
});

test('w-color-input pip can be hidden, re-coloured, re-iconed, and relocated', async ({ mount, page }) => {
  await mount(`
    <w-color-input id="nopip" hide-pip></w-color-input>
    <w-color-input id="pip" value="#ff0000" color-pip pip-icon="brush" pip-variant="tonal" pip-location="append"></w-color-input>
  `);

  await expect(page.locator('#nopip input[type="color"]')).toHaveCount(0);
  await expect(page.locator('#nopip .w-color-input-pip')).toHaveCount(0);

  const pip = page.locator('#pip .w-color-input-pip');
  await expect(pip).toHaveClass(/w-color-input-pip--tonal/);
  await expect(pip).toHaveClass(/w-color-input-pip--colored/);
  await expect(pip).toHaveAttribute('style', /--w-color:#ff0000/);
  await expect(page.locator('#pip .w-color-input-pip .w-icon')).toHaveText('brush');
  await expect(page.locator('#pip .w-color-input-append .w-color-input-pip')).toHaveCount(1);
  await expect(page.locator('#pip .w-color-input-prepend-inner')).toHaveCount(0);
});

test('w-color-input clearable empties the field and emits change then clear', async ({ mount, page }) => {
  await mount('<w-color-input id="ci" value="#ff0000" clearable clear-icon="close"></w-color-input>');
  await recordEvents(page, '#ci', ['change', 'clear']);

  await expect(page.locator('#ci .w-color-input-clear .w-icon')).toHaveText('close');
  await page.locator('#ci .w-color-input-clear').click();

  await expect(page.locator('#ci .w-input')).toHaveValue('');
  await expect(page.locator('#ci')).toHaveAttribute('value', '');
  expect(await readEvents(page, '#ci')).toEqual([
    { type: 'change', detail: { value: '' } },
    { type: 'clear', detail: { value: '' } },
  ]);
});

test('w-color-input error and error-messages put the field in an error state', async ({ mount, page }) => {
  await mount(`
    <w-color-input id="flag" error></w-color-input>
    <w-color-input id="msgs" error-messages='["one","two","three"]' max-errors="2"></w-color-input>
  `);

  await expect(page.locator('#flag .w-color-input')).toHaveClass(/w-field-error/);
  await expect(page.locator('#flag .w-input')).toHaveAttribute('aria-invalid', 'true');

  await expect(page.locator('#msgs .w-color-input-messages--error')).toHaveText('onetwo');
  await expect(page.locator('#msgs .w-color-input')).toHaveClass(/w-field-error/);
});

test('w-color-input validates on the configured trigger and honours validation-value', async ({ mount, page }) => {
  await mount(`
    <w-color-input id="onInput" value="#ff0000" pattern="#[0-9a-f]{6}" validate-on="input"></w-color-input>
    <w-color-input id="eager" pattern="\\d+" validation-value="abc" validate-on="eager"></w-color-input>
    <w-color-input id="lazy" value="#000000" pattern="#00[0-9a-f]{4}" validate-on="blur"></w-color-input>
  `);

  // Pristine fields stay quiet until their trigger fires.
  await expect(page.locator('#onInput .w-color-input-messages--error')).toHaveCount(0);
  await expect(page.locator('#eager .w-color-input-messages--error')).toHaveText('Invalid format.');

  await page.locator('#onInput .w-input').fill('nope');
  await expect(page.locator('#onInput .w-color-input-messages--error')).toHaveText('Invalid format.');
  await expect(page.locator('#onInput .w-input')).toHaveAttribute('aria-invalid', 'true');

  // `blur` does not validate while typing; the message only lands on commit.
  await page.locator('#lazy .w-input').fill('red');
  await expect(page.locator('#lazy .w-color-input-messages--error')).toHaveCount(0);
  await page.locator('#lazy .w-input').blur();
  await expect(page.locator('#lazy')).toHaveAttribute('value', '#ff0000');
  await expect(page.locator('#lazy .w-color-input-messages--error')).toHaveText('Invalid format.');
});

test('w-color-input messages and hide-details control the details row', async ({ mount, page }) => {
  await mount(`
    <w-color-input id="msg" messages="A,B"></w-color-input>
    <w-color-input id="hidden" hint="Nope" hide-details></w-color-input>
    <w-color-input id="auto" hide-details="auto"></w-color-input>
    <w-color-input id="autoMsg" hint="Shown" hide-details="auto"></w-color-input>
  `);

  await expect(page.locator('#msg .w-color-input-messages--info')).toHaveText('AB');
  await expect(page.locator('#hidden .w-color-input-details')).toHaveCount(0);
  await expect(page.locator('#auto .w-color-input-details')).toHaveCount(0);
  await expect(page.locator('#autoMsg .w-color-input-messages--hint')).toHaveText('Shown');
});

test('w-color-input autocomplete suppress also mangles the field name', async ({ mount, page }) => {
  await mount(`
    <w-color-input id="plain" name="brand" autocomplete="on" autofocus></w-color-input>
    <w-color-input id="suppressed" name="brand" autocomplete="suppress"></w-color-input>
  `);

  await expect(page.locator('#plain .w-input')).toHaveAttribute('autocomplete', 'on');
  await expect(page.locator('#plain .w-input')).toHaveAttribute('autofocus', '');

  const suppressed = page.locator('#suppressed .w-input');
  await expect(suppressed).toHaveAttribute('autocomplete', 'off');
  await expect(suppressed).toHaveAttribute('name', /^brand-w-color-input-\d+$/);
});

test('w-color-input picker panel forwards the picker attributes', async ({ mount, page }) => {
  await mount(`<w-color-input id="ci" value="#ff0000" picker title="Pick" divided hide-header hide-title
      canvas-height="180" dot-size="20" hide-sliders landscape modes="hex,rgb" swatches-max-height="60"
      hide-inputs hide-input-labels hide-canvas hide-eye-dropper eye-dropper-icon="colorize"
      ok-text="Apply" cancel-text="Nope"></w-color-input>`);

  const picker = page.locator('#ci w-color-picker');
  await expect(picker).toHaveCount(1);
  await expect(picker).toHaveAttribute('title', 'Pick');
  await expect(picker).toHaveAttribute('canvas-height', '180');
  await expect(picker).toHaveAttribute('dot-size', '20');
  await expect(picker).toHaveAttribute('modes', 'hex,rgb');
  await expect(picker).toHaveAttribute('swatches-max-height', '60');
  await expect(picker).toHaveAttribute('eye-dropper-icon', 'colorize');
  for (const flag of ['divided', 'hide-header', 'hide-title', 'hide-sliders', 'landscape', 'hide-inputs', 'hide-input-labels', 'hide-canvas', 'hide-eye-dropper']) {
    await expect(picker).toHaveAttribute(flag, '');
  }

  // The title moved into the picker header, so the field-level one is dropped.
  await expect(page.locator('#ci .w-color-input-title')).toHaveCount(0);
  await expect(page.locator('#ci .w-color-input-ok')).toHaveText('Apply');
  await expect(page.locator('#ci .w-color-input-cancel')).toHaveText('Nope');
});

test('w-color-input picker panel commits, cancels, and confirms', async ({ mount, page }) => {
  await mount('<w-color-input id="ci" value="#ff0000" picker></w-color-input>');
  await recordEvents(page, '#ci', ['change']);

  const hex = page.locator('#ci w-color-picker .w-color-picker-input');
  await hex.fill('#00ff00');
  await hex.dispatchEvent('change');

  await expect(page.locator('#ci')).toHaveAttribute('value', '#00ff00');
  await expect(page.locator('#ci .w-input')).toHaveValue('#00ff00');
  await expect(page.locator('#ci input[type="color"]')).toHaveValue('#00ff00');

  await page.locator('#ci .w-color-input-cancel').click();
  await expect(page.locator('#ci')).toHaveAttribute('value', '#ff0000');
  await expect(page.locator('#ci w-color-picker')).toHaveAttribute('value', '#ff0000');

  await page.locator('#ci .w-color-input-ok').click();
  const events = await readEvents(page, '#ci');
  expect(events.at(-1)).toEqual({ type: 'change', detail: { value: '#ff0000' } });
});

test('w-color-input hide-actions drops the panel buttons and picker-props pass through', async ({ mount, page }) => {
  await mount(`
    <w-color-input id="bare" picker hide-actions></w-color-input>
    <w-color-input id="props" picker picker-props='{"show-alpha":true,"swatches":"#ff0000"}'></w-color-input>
  `);

  await expect(page.locator('#bare .w-color-input-actions')).toHaveCount(0);
  await expect(page.locator('#props w-color-picker')).toHaveAttribute('show-alpha', '');
  await expect(page.locator('#props w-color-picker .w-color-picker-alpha')).toHaveCount(1);
  await expect(page.locator('#props w-color-picker .w-color-swatch')).toHaveCount(1);
});

test('w-color-input picker sizing and mode attributes reach the rendered picker', async ({ mount, page }) => {
  await mount(`<w-color-input id="ci" value="#ff0000" picker title="Pick" divided
      canvas-height="180" dot-size="20" hide-sliders hide-input-labels modes="hex,rgb"></w-color-input>`);

  const picker = page.locator('#ci w-color-picker .w-color-picker');
  await expect(picker).toHaveAttribute('style', /--w-color-picker-canvas-height:180px/);
  await expect(picker).toHaveAttribute('style', /--w-color-picker-dot-size:20px/);
  await expect(page.locator('#ci .w-color-picker-divider')).toHaveCount(1);
  await expect(page.locator('#ci .w-color-picker-header')).toHaveCount(1);
  await expect(page.locator('#ci .w-color-picker-slider')).toHaveCount(0);
  await expect(page.locator('#ci .w-color-picker-input-label')).toHaveCount(0);
  await expect(page.locator('#ci select.w-color-picker-mode option')).toHaveCount(2);
});

test('w-color-input picker hide-* attributes remove the matching picker sections', async ({ mount, page }) => {
  await mount(`<w-color-input id="ci" value="#ff0000" picker title="Pick" hide-header hide-canvas
      hide-inputs landscape swatches-max-height="60" hide-eye-dropper
      swatches="#ef4444,#10b981"></w-color-input>`);

  await expect(page.locator('#ci .w-color-picker-header')).toHaveCount(0);
  await expect(page.locator('#ci .w-color-picker-canvas')).toHaveCount(0);
  await expect(page.locator('#ci .w-color-picker-edit')).toHaveCount(0);
  await expect(page.locator('#ci .w-color-picker-eye-dropper')).toHaveCount(0);

  const picker = page.locator('#ci w-color-picker .w-color-picker');
  await expect(picker).toHaveClass(/w-color-picker--landscape/);
  await expect(picker).toHaveClass(/w-color-picker--scroll-swatches/);
  await expect(picker).toHaveAttribute('style', /--w-color-picker-swatches-max-height:60px/);
});
