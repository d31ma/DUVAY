import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-alert renders contextual type, title, text, icon, and live region state', async ({ mount, page }) => {
  await mount('<w-alert id="alert" type="error" title="Payment failed" text="Try another card.">Card declined.</w-alert>');

  const alert = page.locator('#alert .w-alert');
  await expect(alert).toHaveAttribute('role', 'alert');
  await expect(alert).toHaveAttribute('aria-live', 'assertive');
  await expect(alert).toHaveClass(/w-alert-error/);
  await expect(alert).toHaveClass(/w-alert--variant-flat/);
  await expect(page.locator('#alert .w-alert-title')).toHaveText('Payment failed');
  await expect(page.locator('#alert .w-alert-text')).toHaveText('Try another card.');
  await expect(page.locator('#alert .w-alert-body')).toContainText('Card declined.');
  await expect(page.locator('#alert .w-alert-icon svg')).toHaveCount(1);

  await page.locator('#alert').evaluate((el) => {
    el.setAttribute('type', 'success');
    el.setAttribute('title', 'Saved');
    el.setAttribute('text', 'The new copy is live.');
  });

  await expect(alert).toHaveAttribute('aria-live', 'polite');
  await expect(alert).toHaveClass(/w-alert-success/);
  await expect(page.locator('#alert .w-alert-title')).toHaveText('Saved');
  await expect(page.locator('#alert .w-alert-text')).toHaveText('The new copy is live.');
});

test('w-alert preserves legacy contextual variant while adding Vuetify style variants', async ({ mount, page }) => {
  await mount('<w-alert id="alert" variant="warning" border="end" border-color="success" density="compact" prominent>Legacy warning</w-alert>');

  const alert = page.locator('#alert .w-alert');
  await expect(alert).toHaveClass(/w-alert-warning/);
  await expect(alert).toHaveClass(/w-alert--variant-flat/);
  await expect(alert).toHaveClass(/w-alert--border-end/);
  await expect(alert).toHaveClass(/w-alert--border-color-success/);
  await expect(alert).toHaveClass(/w-alert--prominent/);
  await expect(page.locator('#alert')).toHaveClass(/w-density-compact/);

  await page.locator('#alert').evaluate((el) => {
    el.setAttribute('type', 'info');
    el.setAttribute('variant', 'outlined');
    el.setAttribute('color', 'tertiary');
    el.setAttribute('border', 'top');
  });

  await expect(alert).toHaveClass(/w-alert-info/);
  await expect(alert).toHaveClass(/w-alert--variant-outlined/);
  await expect(alert).toHaveClass(/w-alert--color-tertiary/);
  await expect(alert).toHaveClass(/w-alert--border-top/);
});

test('w-alert supports custom icon, hidden icon, close label, and native hidden state', async ({ mount, page }) => {
  await mount('<w-alert id="alert" type="info" icon="!" closable close-label="Dismiss notification">Heads up</w-alert>');
  await recordEvents(page, '#alert', ['close']);

  await expect(page.locator('#alert .w-alert-icon-text')).toHaveText('!');
  await expect(page.locator('#alert [data-w-alert-close]')).toHaveAttribute('aria-label', 'Dismiss notification');

  await page.locator('#alert [data-w-alert-close]').click();

  await expect(page.locator('#alert')).toHaveAttribute('hidden', '');
  await expect(page.locator('#alert .w-alert')).toBeHidden();
  expect(await readEvents(page, '#alert')).toEqual([
    { type: 'close', detail: { value: false } },
  ]);

  await page.locator('#alert').evaluate((el) => {
    el.removeAttribute('hidden');
    el.setAttribute('icon', 'false');
  });

  await expect(page.locator('#alert .w-alert')).toBeVisible();
  await expect(page.locator('#alert .w-alert-icon')).toHaveCount(0);
});

test('w-alert renders named slots for prepend, title, text, append, and close', async ({ mount, page }) => {
  await mount(`
    <w-alert id="alert" type="success">
      <span slot="prepend" class="custom-prepend">OK</span>
      <span slot="title" class="custom-title">Slot title</span>
      <span slot="text" class="custom-text">Slot text</span>
      Body slot
      <span slot="append" class="custom-append">Action</span>
      <span slot="close" class="custom-close">Close</span>
    </w-alert>
  `);
  await recordEvents(page, '#alert', ['close']);

  await expect(page.locator('#alert .w-alert-prepend .custom-prepend')).toHaveText('OK');
  await expect(page.locator('#alert .w-alert-title .custom-title')).toHaveText('Slot title');
  await expect(page.locator('#alert .w-alert-text .custom-text')).toHaveText('Slot text');
  await expect(page.locator('#alert .w-alert-body')).toContainText('Body slot');
  await expect(page.locator('#alert .w-alert-append .custom-append')).toHaveText('Action');
  await expect(page.locator('#alert [data-w-alert-close] .custom-close')).toHaveText('Close');

  await page.locator('#alert [data-w-alert-close]').click();
  expect(await readEvents(page, '#alert')).toEqual([
    { type: 'close', detail: { value: false } },
  ]);
});
