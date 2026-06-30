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

test('w-switch inset grows the track to enclose the thumb', async ({ mount, page }) => {
  await mount('<w-switch id="plain" size="md"></w-switch><w-switch id="inset" size="md" inset></w-switch>');

  const plainH = (await page.locator('#plain .w-switch-track').boundingBox()).height;
  const insetH = (await page.locator('#inset .w-switch-track').boundingBox()).height;
  const thumb = (await page.locator('#inset .w-switch-thumb').boundingBox()).height;

  expect(insetH).toBeGreaterThan(plainH);
  expect(insetH).toBeGreaterThanOrEqual(thumb); // track wraps the thumb
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
