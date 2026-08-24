import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-switch reflects label, name, value, checked, and disabled attrs and emits change', async ({ mount, page }) => {
  await mount('<w-switch id="switch" label="Enabled" name="enabled" value="yes" disabled></w-switch>');
  await recordEvents(page, '#switch', ['change']);

  await expect(page.locator('#switch input')).toHaveAttribute('name', 'enabled');
  await expect(page.locator('#switch input')).toHaveAttribute('value', 'yes');
  await expect(page.locator('#switch input')).toBeDisabled();
  await expect(page.locator('#switch .w-switch-label')).toHaveText('Enabled');

  await page.locator('#switch').evaluate((el) => el.removeAttribute('disabled'));
  await page.locator('#switch .w-switch').click();

  await expect(page.locator('#switch')).toHaveAttribute('checked', '');
  expect(await readEvents(page, '#switch')).toEqual([
    { type: 'change', detail: { checked: true, name: 'enabled', value: 'yes' } },
  ]);
});

test('w-switch checked property toggles the reflected attribute', async ({ mount, page }) => {
  await mount('<w-switch id="switch" label="Wifi"></w-switch>');

  await expect(page.locator('#switch')).not.toHaveAttribute('checked', '');
  await page.locator('#switch').evaluate((el) => { el.checked = true; });
  await expect(page.locator('#switch')).toHaveAttribute('checked', '');
  await expect(page.locator('#switch input')).toBeChecked();
});

test('w-switch applies size, color, inset, and flat modifiers', async ({ mount, page }) => {
  await mount('<w-switch id="switch" label="X" size="lg" color="success" inset flat></w-switch>');

  const sw = page.locator('#switch .w-switch');
  await expect(sw).toHaveClass(/w-switch--lg/);
  await expect(sw).toHaveClass(/w-switch--success/);
  await expect(sw).toHaveClass(/w-switch--inset/);
  await expect(sw).toHaveClass(/w-switch--flat/);
  // success accent feeds the track when on.
  await expect(sw).toHaveCSS('--w-switch-accent', /.+/);
});

test('w-switch inset makes the track enclose the thumb and never shrinks it', async ({ mount, page }) => {
  await mount('<w-switch id="plain" size="md"></w-switch><w-switch id="inset" size="md" inset></w-switch>');

  const plainH = (await page.locator('#plain .w-switch-track').boundingBox()).height;
  const insetH = (await page.locator('#inset .w-switch-track').boundingBox()).height;
  const thumb = (await page.locator('#inset .w-switch-thumb').boundingBox()).height;

  expect(insetH).toBeGreaterThanOrEqual(thumb);   // the point of inset
  expect(insetH).toBeGreaterThanOrEqual(plainH);  // may grow, must never shrink
});

test('w-switch inset grows the default track, which does not enclose its thumb', async ({ mount, page }) => {
  // Asserted unskinned only. Material (32px track / 24px thumb) and Fluent
  // (20/12) are already inset by design, so there the modifier is a no-op —
  // which is why the shared test above asserts the invariant, not the growth.
  await page.evaluate(() => document.documentElement.removeAttribute('w-os'));
  await mount('<w-switch id="plain" size="md"></w-switch><w-switch id="inset" size="md" inset></w-switch>');

  const plainH = (await page.locator('#plain .w-switch-track').boundingBox()).height;
  const insetH = (await page.locator('#inset .w-switch-track').boundingBox()).height;

  expect(insetH).toBeGreaterThan(plainH);
});

test('w-switch readonly and loading block toggling but keep the input present', async ({ mount, page }) => {
  await mount('<w-switch id="ro" label="RO" readonly></w-switch><w-switch id="ld" label="LD" loading></w-switch>');
  await recordEvents(page, '#ro', ['change']);

  await page.locator('#ro .w-switch').click();
  await expect(page.locator('#ro')).not.toHaveAttribute('checked', '');
  expect(await readEvents(page, '#ro')).toEqual([]);

  await expect(page.locator('#ld .w-switch')).toHaveClass(/w-switch--loading/);
  await expect(page.locator('#ld .w-switch-spinner')).toBeVisible();
  await expect(page.locator('#ld input')).toHaveAttribute('aria-busy', 'true');
});

test('w-switch renders hint and error, and error tints with aria-invalid', async ({ mount, page }) => {
  await mount('<w-switch id="hint" label="A" hint="Recommended"></w-switch><w-switch id="err" label="B" error="Required"></w-switch>');

  await expect(page.locator('#hint .w-switch-hint')).toHaveText('Recommended');
  await expect(page.locator('#err .w-switch-error')).toHaveText('Required');
  await expect(page.locator('#err .w-switch')).toHaveClass(/w-switch--error/);
  await expect(page.locator('#err input')).toHaveAttribute('aria-invalid', 'true');
});

test('w-switch hide-details suppresses the hint', async ({ mount, page }) => {
  await mount('<w-switch id="switch" label="A" hint="Hidden" hide-details></w-switch>');
  await expect(page.locator('#switch .w-switch-hint')).toHaveCount(0);
});

test('w-switch thumb slides on toggle', async ({ mount, page }) => {
  await mount('<w-switch id="switch" label="A"></w-switch>');

  const offBox = await page.locator('#switch .w-switch-thumb').boundingBox();
  await page.locator('#switch .w-switch').click();
  await page.waitForTimeout(250);
  const onBox = await page.locator('#switch .w-switch-thumb').boundingBox();

  expect(onBox.x).toBeGreaterThan(offBox.x);
});

test('w-switch supports default slot label and @change handler', async ({ mount, page }) => {
  await mount('<w-switch id="switch" @change="this.dataset.on = String(event.detail.checked)">Dark mode</w-switch>');

  await expect(page.locator('#switch .w-switch-label')).toHaveText('Dark mode');
  await page.locator('#switch .w-switch').click();
  await expect(page.locator('#switch')).toHaveAttribute('data-on', 'true');
});

test('w-switch type=radio backs the control with a radio input', async ({ mount, page }) => {
  await mount('<w-switch id="a" name="mode" value="on" type="radio" label="A"></w-switch>');

  await expect(page.locator('#a input.w-switch-input')).toHaveAttribute('type', 'radio');
  await page.locator('#a .w-switch').click();
  await expect(page.locator('#a input.w-switch-input')).toBeChecked();
});

test('w-switch indeterminate parks the thumb and reports a mixed state', async ({ mount, page }) => {
  await mount('<w-switch id="off" size="md" label="A"></w-switch>'
    + '<w-switch id="mid" size="md" label="B" indeterminate></w-switch>'
    + '<w-switch id="on" size="md" label="C" checked></w-switch>');

  await expect(page.locator('#mid .w-switch')).toHaveClass(/w-switch--indeterminate/);
  await expect(page.locator('#mid input')).toHaveAttribute('aria-checked', 'mixed');
  expect(await page.locator('#mid input').evaluate((el) => el.indeterminate)).toBe(true);

  await page.waitForTimeout(250);
  // Measure each thumb against its own track. Absolute page x is not
  // comparable across the three switches: a skin with a wider track (iOS is
  // 51px against the default 40px) can wrap the row, putting the third switch
  // back at the left margin and inverting the comparison.
  const travel = async (id) => page.locator(`#${id} .w-switch-track`).evaluate((track) => {
    const thumb = track.querySelector('.w-switch-thumb');
    return thumb.getBoundingClientRect().x - track.getBoundingClientRect().x;
  });

  const [off, mid, on] = [await travel('off'), await travel('mid'), await travel('on')];
  expect(mid - off).toBeGreaterThan(0);
  expect(on - mid).toBeGreaterThan(0);
});

test('w-switch multiple posts an array-shaped field name', async ({ mount, page }) => {
  await mount('<w-switch id="one" name="tags" value="a" label="A"></w-switch>'
    + '<w-switch id="many" name="tags" value="a" label="A" multiple></w-switch>');

  await expect(page.locator('#one input')).toHaveAttribute('name', 'tags');
  await expect(page.locator('#many input.w-switch-input')).toHaveAttribute('name', 'tags[]');
  await expect(page.locator('#many .w-switch')).toHaveClass(/w-switch--multiple/);
});

test('w-switch true-value and false-value drive the submitted and emitted value', async ({ mount, page }) => {
  await mount('<w-switch id="switch" name="notify" true-value="yes" false-value="no" label="Notify"></w-switch>');
  await recordEvents(page, '#switch', ['change']);

  // The companion hidden field is what carries `false-value` through a form post.
  await expect(page.locator('#switch input[type="hidden"]')).toHaveAttribute('value', 'no');
  await expect(page.locator('#switch input.w-switch-input')).toHaveAttribute('value', 'yes');

  await page.locator('#switch .w-switch').click();
  await page.locator('#switch .w-switch').click();

  expect(await readEvents(page, '#switch')).toEqual([
    { type: 'change', detail: { checked: true, name: 'notify', value: 'yes' } },
    { type: 'change', detail: { checked: false, name: 'notify', value: 'no' } },
  ]);
});

test('w-switch state icons render inside the thumb', async ({ mount, page }) => {
  await mount('<w-switch id="off" label="A" true-icon="check" false-icon="close"></w-switch>'
    + '<w-switch id="on" label="B" checked true-icon="check" false-icon="close"></w-switch>'
    + '<w-switch id="mid" label="C" indeterminate indeterminate-icon="dash"></w-switch>');

  await expect(page.locator('#off .w-switch-thumb .w-icon')).toHaveText('close');
  await expect(page.locator('#on .w-switch-thumb .w-icon')).toHaveText('check');
  await expect(page.locator('#mid .w-switch-thumb .w-icon')).toHaveText('dash');

  // Toggling swaps the icon in place.
  await page.locator('#off .w-switch').click();
  await expect(page.locator('#off .w-switch-thumb .w-icon')).toHaveText('check');
});

test('w-switch prepend/append icons and icon-color', async ({ mount, page }) => {
  await mount('<w-switch id="switch" label="A" prepend-icon="moon" append-icon="sun" icon-color="warning"></w-switch>');

  await expect(page.locator('#switch .w-switch-prepend .w-icon')).toHaveText('moon');
  await expect(page.locator('#switch .w-switch-append .w-icon')).toHaveText('sun');
  await expect(page.locator('#switch .w-switch')).toHaveAttribute('style', /--w-switch-icon-color:var\(--w-warning\)/);
  await expect(page.locator('#switch .w-switch-outer')).toHaveCount(1);
});

test('w-switch omits the icon row when no outside icon is set', async ({ mount, page }) => {
  await mount('<w-switch id="switch" label="A"></w-switch>');
  await expect(page.locator('#switch .w-switch-outer')).toHaveCount(0);
});

test('w-switch thumb-color repaints the thumb', async ({ mount, page }) => {
  await mount('<w-switch id="token" label="A" thumb-color="error"></w-switch>'
    + '<w-switch id="literal" label="B" thumb-color="#00ff00"></w-switch>');

  await expect(page.locator('#token .w-switch')).toHaveAttribute('style', /--w-switch-thumb-color:var\(--w-error\)/);
  await expect(page.locator('#literal .w-switch')).toHaveAttribute('style', /--w-switch-thumb-color:#00ff00/);
  await expect(page.locator('#literal .w-switch-thumb')).toHaveCSS('background-color', 'rgb(0, 255, 0)');
});

test('w-switch direction=vertical stacks the control above its label', async ({ mount, page }) => {
  await mount('<w-switch id="row" label="Horizontal"></w-switch>'
    + '<w-switch id="col" label="Vertical" direction="vertical"></w-switch>');

  await expect(page.locator('#col .w-switch')).toHaveClass(/w-switch--vertical/);
  const track = await page.locator('#col .w-switch-track').boundingBox();
  const label = await page.locator('#col .w-switch-label').boundingBox();
  expect(label.y).toBeGreaterThan(track.y);

  const rowTrack = await page.locator('#row .w-switch-track').boundingBox();
  const rowLabel = await page.locator('#row .w-switch-label').boundingBox();
  expect(Math.abs(rowLabel.y - rowTrack.y)).toBeLessThan(rowTrack.height);
});

test('w-switch inline lays the label and its hint on one row', async ({ mount, page }) => {
  await mount('<w-switch id="switch" label="A" hint="Recommended" inline></w-switch>');

  await expect(page.locator('#switch .w-switch')).toHaveClass(/w-switch--inline/);
  const label = await page.locator('#switch .w-switch-label').boundingBox();
  const hint = await page.locator('#switch .w-switch-hint').boundingBox();
  expect(hint.x).toBeGreaterThan(label.x);
});

test('w-switch messages, error-messages, and max-errors', async ({ mount, page }) => {
  await mount('<w-switch id="msg" label="A" messages="Applies at once"></w-switch>'
    + '<w-switch id="err" label="B" error-messages="X,Y,Z" max-errors="2"></w-switch>');

  await expect(page.locator('#msg .w-switch-messages')).toHaveText('Applies at once');
  await expect(page.locator('#err .w-switch-error .w-switch-message')).toHaveText(['X', 'Y']);
  await expect(page.locator('#err .w-switch')).toHaveClass(/w-switch--error/);
  await expect(page.locator('#err input')).toHaveAttribute('aria-invalid', 'true');
});

test('w-switch validate-on defers error messages until the trigger fires', async ({ mount, page }) => {
  await mount('<w-switch id="switch" label="A" error-messages="Nope" validate-on="blur"></w-switch>');

  await expect(page.locator('#switch .w-switch-error')).toHaveCount(0);
  await page.locator('#switch input').focus();
  await page.locator('#switch input').blur();
  await expect(page.locator('#switch .w-switch-error')).toHaveText('Nope');
  await expect(page.locator('#switch .w-switch')).toHaveClass(/w-switch--error/);
});

test('w-switch required validates the state, and validation-value overrides it', async ({ mount, page }) => {
  await mount('<w-switch id="empty" label="A" required></w-switch>'
    + '<w-switch id="on" label="B" required checked></w-switch>'
    + '<w-switch id="forced" label="C" required validation-value="ok"></w-switch>');

  await expect(page.locator('#empty .w-switch-error')).toHaveText('This field is required.');
  await expect(page.locator('#on .w-switch-error')).toHaveCount(0);
  await expect(page.locator('#forced .w-switch-error')).toHaveCount(0);

  // Toggling clears the error without a destructive re-render.
  await page.locator('#empty .w-switch').click();
  await expect(page.locator('#empty .w-switch-error')).toHaveCount(0);
});

test('w-switch persistent-hint keeps the hint beside the error', async ({ mount, page }) => {
  await mount('<w-switch id="off" label="A" hint="Tip" error="Bad"></w-switch>'
    + '<w-switch id="on" label="B" hint="Tip" error="Bad" persistent-hint></w-switch>');

  await expect(page.locator('#off .w-switch-hint')).toHaveCount(0);
  await expect(page.locator('#on .w-switch-hint')).toHaveText('Tip');
  await expect(page.locator('#on .w-switch-error')).toHaveText('Bad');
});

test('w-switch hide-details=auto keeps the row only when it has something to say', async ({ mount, page }) => {
  await mount('<w-switch id="bare" label="A" hide-details="auto"></w-switch>'
    + '<w-switch id="full" label="B" hide-details="auto" hint="Tip"></w-switch>');

  await expect(page.locator('#bare .w-switch-details')).toHaveCount(0);
  await expect(page.locator('#full .w-switch-hint')).toHaveText('Tip');
});

test('w-switch ripple adds press feedback to the track', async ({ mount, page }) => {
  await mount('<w-switch id="switch" label="A" ripple></w-switch>');

  const track = page.locator('#switch .w-switch-track');
  await expect(track).toHaveClass(/w-ripple-host/);
  await track.dispatchEvent('pointerdown', { clientX: 5, clientY: 5 });
  await expect(page.locator('#switch .w-ripple-ink')).toHaveCount(1);
});

test('w-switch center-affix, indent-details, and hide-spin-buttons become classes', async ({ mount, page }) => {
  await mount('<w-switch id="switch" label="A" center-affix indent-details hide-spin-buttons></w-switch>');

  const sw = page.locator('#switch .w-switch');
  await expect(sw).toHaveClass(/w-switch--center-affix/);
  await expect(sw).toHaveClass(/w-switch--indent-details/);
  await expect(sw).toHaveClass(/w-switch--hide-spin-buttons/);
});
