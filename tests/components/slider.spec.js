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

test('w-slider error and error-messages set the error surface', async ({ mount, page }) => {
  await mount('<w-slider id="flag" value="10" error></w-slider>'
    + '<w-slider id="msgs" value="10" error-messages="Too quiet"></w-slider>');

  await expect(page.locator('#flag .w-slider-field')).toHaveClass(/w-slider-surface--error/);
  await expect(page.locator('#flag .w-slider-input')).toHaveAttribute('aria-invalid', 'true');

  await expect(page.locator('#msgs .w-slider-message')).toHaveText('Too quiet');
  await expect(page.locator('#msgs .w-slider-message')).toHaveClass(/w-slider-message--error/);
  // The value row steps aside for the error unless persistent-hint asks for both.
  await expect(page.locator('#msgs .w-messages')).toBeHidden();
});

test('w-slider max-errors caps how many error messages show', async ({ mount, page }) => {
  await mount('<w-slider id="one" value="1" error-messages="A,B,C"></w-slider>'
    + '<w-slider id="two" value="1" error-messages="A,B,C" max-errors="2"></w-slider>');

  await expect(page.locator('#one .w-slider-message')).toHaveText(['A']);
  await expect(page.locator('#two .w-slider-message')).toHaveText(['A', 'B']);
});

test('w-slider validate-on defers error messages until the trigger fires', async ({ mount, page }) => {
  await mount('<w-slider id="slider" value="10" error-messages="Nope" validate-on="blur"></w-slider>');

  await expect(page.locator('#slider .w-slider-message')).toHaveCount(0);

  await page.locator('#slider .w-slider-input').focus();
  await page.locator('#slider .w-slider-input').blur();

  await expect(page.locator('#slider .w-slider-message')).toHaveText('Nope');
  await expect(page.locator('#slider .w-slider-field')).toHaveClass(/w-slider-surface--error/);
});

test('w-slider validation-value is what the range rule checks', async ({ mount, page }) => {
  await mount('<w-slider id="ok" min="0" max="10" value="5"></w-slider>'
    + '<w-slider id="bad" min="0" max="10" value="5" validation-value="50"></w-slider>');

  await expect(page.locator('#ok .w-slider-message')).toHaveCount(0);
  await expect(page.locator('#bad .w-slider-message')).toHaveText('Value is out of range');
});

test('w-slider messages render below the control', async ({ mount, page }) => {
  await mount('<w-slider id="slider" value="10" messages=\'["Drag me","Or type"]\'></w-slider>');

  await expect(page.locator('#slider .w-slider-message')).toHaveText(['Drag me', 'Or type']);
  await expect(page.locator('#slider .w-slider-message').first()).not.toHaveClass(/w-slider-message--error/);
});

test('w-slider persistent-hint keeps the hint visible beside an error', async ({ mount, page }) => {
  await mount('<w-slider id="off" value="1" hint="Pick one" error-messages="Nope"></w-slider>'
    + '<w-slider id="on" value="1" hint="Pick one" error-messages="Nope" persistent-hint></w-slider>');

  await expect(page.locator('#off .w-messages')).toBeHidden();
  await expect(page.locator('#on .w-messages')).toBeVisible();
  await expect(page.locator('#on .w-messages')).toHaveText('Pick one');
  await expect(page.locator('#on .w-slider-message')).toHaveText('Nope');
});

test('w-slider hide-details drops the row; auto keeps it only when it has content', async ({ mount, page }) => {
  await mount('<w-slider id="off" value="1" hide-details></w-slider>'
    + '<w-slider id="auto" value="1" hide-details="auto"></w-slider>'
    + '<w-slider id="autofull" value="1" hide-details="auto" messages="Hello"></w-slider>');

  await expect(page.locator('#off .w-messages')).toHaveCount(0);
  await expect(page.locator('#auto .w-messages')).toHaveCount(0);
  await expect(page.locator('#autofull .w-slider-message')).toHaveText('Hello');
});

test('w-slider prepend-icon, append-icon, and icon-color', async ({ mount, page }) => {
  await mount('<w-slider id="slider" value="10" prepend-icon="volume-low" append-icon="volume-high" icon-color="error"></w-slider>');

  await expect(page.locator('#slider .w-slider-prepend .w-icon')).toHaveText('volume-low');
  await expect(page.locator('#slider .w-slider-append .w-icon')).toHaveText('volume-high');
  await expect(page.locator('#slider .w-slider-control')).toHaveAttribute('style', /--w-slider-icon-color:var\(--w-error\)/);
  // The icons only earn a flex row when at least one of them is present.
  await expect(page.locator('#slider .w-slider-outer')).toHaveCount(1);
});

test('w-slider omits the icon row when no outside icon is set', async ({ mount, page }) => {
  await mount('<w-slider id="slider" value="10"></w-slider>');
  await expect(page.locator('#slider .w-slider-outer')).toHaveCount(0);
});

test('w-slider field-surface modifiers become classes', async ({ mount, page }) => {
  await mount('<w-slider id="slider" value="10" glow center-affix indent-details hide-spin-buttons></w-slider>');

  const field = page.locator('#slider .w-slider-field');
  await expect(field).toHaveClass(/w-slider-surface--glow/);
  await expect(field).toHaveClass(/w-slider-surface--center-affix/);
  await expect(field).toHaveClass(/w-slider-surface--indent-details/);
  await expect(field).toHaveClass(/w-slider-surface--hide-spin-buttons/);
});

test('w-slider thumb, track, and tick sizing feed custom properties', async ({ mount, page }) => {
  await mount('<w-slider id="px" value="10" thumb-size="24" track-size="8" tick-size="4" ticks'
    + ' thumb-color="warning" track-fill-color="success" track-color="surface-container"></w-slider>'
    + '<w-slider id="css" value="10" thumb-size="1.5rem" thumb-color="#ff0000"></w-slider>');

  const px = page.locator('#px .w-slider-control');
  await expect(px).toHaveAttribute('style', /--w-slider-thumb-size:24px/);
  await expect(px).toHaveAttribute('style', /--w-slider-track-size:8px/);
  await expect(px).toHaveAttribute('style', /--w-slider-tick-size:4px/);
  await expect(px).toHaveAttribute('style', /--w-slider-thumb-color:var\(--w-warning\)/);
  // track-fill-color wins over color for the filled run.
  await expect(px).toHaveAttribute('style', /--w-slider-color:var\(--w-success\)/);
  await expect(px).toHaveCSS('--w-slider-track-size', '8px');

  const css = page.locator('#css .w-slider-control');
  await expect(css).toHaveAttribute('style', /--w-slider-thumb-size:1\.5rem/);
  await expect(css).toHaveAttribute('style', /--w-slider-thumb-color:#ff0000/);
});

test('w-slider ticks accepts a JSON value array and a JSON label map', async ({ mount, page }) => {
  await mount('<w-slider id="arr" min="0" max="100" value="10" ticks="[0,50,100]"></w-slider>'
    + '<w-slider id="map" min="0" max="100" value="10" ticks=\'{"0":"Low","100":"High"}\'></w-slider>'
    + '<w-slider id="bad" min="0" max="4" step="1" value="1" ticks="{oops"></w-slider>');

  await expect(page.locator('#arr .w-slider-tick')).toHaveCount(3);
  await expect(page.locator('#arr .w-slider-tick').nth(1)).toHaveAttribute('style', /--pos:\s*50%/);

  await expect(page.locator('#map .w-slider-tick')).toHaveCount(2);
  await expect(page.locator('#map .w-slider-tick-label')).toHaveText(['Low', 'High']);
  await expect(page.locator('#map .w-slider-ticks')).toHaveClass(/w-slider-ticks--labelled/);

  // Unparseable JSON falls back to one tick per step rather than throwing.
  await expect(page.locator('#bad .w-slider-tick')).toHaveCount(5);
});

test('w-slider skips ticks when the step would produce an unreasonable number', async ({ mount, page }) => {
  await mount('<w-slider id="many" min="0" max="1000" step="1" value="10" ticks></w-slider>'
    + '<w-slider id="none" min="0" max="1" step="10" value="0" ticks></w-slider>');

  await expect(page.locator('#many .w-slider-tick')).toHaveCount(0);
  await expect(page.locator('#none .w-slider-tick')).toHaveCount(0);
});

test('w-slider show-ticks fades ticks in; always pins them on', async ({ mount, page }) => {
  await mount('<w-slider id="hover" min="0" max="4" step="1" value="2" show-ticks></w-slider>'
    + '<w-slider id="always" min="0" max="4" step="1" value="2" show-ticks="always"></w-slider>');

  await expect(page.locator('#hover .w-slider-tick')).toHaveCount(5);
  await expect(page.locator('#hover .w-slider-field')).toHaveClass(/w-slider-surface--ticks-hover/);
  await expect(page.locator('#hover .w-slider-tick').first()).toHaveCSS('opacity', '0');

  await expect(page.locator('#always .w-slider-field')).toHaveClass(/w-slider-surface--ticks-always/);
  await expect(page.locator('#always .w-slider-tick').first()).toHaveCSS('opacity', '0.5');
});

test('w-slider ripple adds press feedback to the control', async ({ mount, page }) => {
  await mount('<w-slider id="slider" value="10" ripple></w-slider>');

  const control = page.locator('#slider .w-slider-control');
  await expect(control).toHaveClass(/w-ripple-host/);
  await control.dispatchEvent('pointerdown', { clientX: 20, clientY: 10 });
  await expect(page.locator('#slider .w-ripple-ink')).toHaveCount(1);
});

test('w-slider no-keyboard swallows arrow keys', async ({ mount, page }) => {
  await mount('<w-slider id="live" min="0" max="100" step="10" value="50"></w-slider>'
    + '<w-slider id="dead" min="0" max="100" step="10" value="50" no-keyboard></w-slider>');

  await page.locator('#live .w-slider-input').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#live .w-slider-input')).toHaveValue('60');

  await page.locator('#dead .w-slider-input').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#dead .w-slider-input')).toHaveValue('50');
});

test('w-slider publishes slider ARIA that tracks the value', async ({ mount, page }) => {
  await mount('<w-slider id="slider" min="5" max="25" value="10"></w-slider>');

  const input = page.locator('#slider .w-slider-input');
  await expect(input).toHaveAttribute('role', 'slider');
  await expect(input).toHaveAttribute('aria-valuemin', '5');
  await expect(input).toHaveAttribute('aria-valuemax', '25');
  await expect(input).toHaveAttribute('aria-valuenow', '10');

  await page.locator('#slider').evaluate((el) => { el.value = '20'; });
  await expect(input).toHaveAttribute('aria-valuenow', '20');
});
