import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-btn reflects variant, color, size, loading, active, disabled, icon, and aria attributes', async ({ mount, page }) => {
  await mount(`
    <w-btn id="button" variant="filled" color="danger" size="lg" loading active disabled icon="check" aria-label="Save">Save</w-btn>
  `);

  const host = page.locator('#button');
  const button = page.locator('#button button');
  await expect(button).toHaveClass(/w-btn-filled/);
  await expect(button).toHaveClass(/w-btn-danger/);
  await expect(button).toHaveClass(/w-btn--lg/);
  await expect(button).toHaveClass(/loading/);
  await expect(button).toHaveClass(/active/);
  await expect(button).toBeDisabled();
  await expect(button).toHaveAttribute('aria-busy', 'true');
  await expect(button).toHaveAttribute('aria-label', 'Save');
  await expect(host.locator('.w-btn-leading-icon')).toHaveCount(1);

  await host.evaluate((el) => {
    el.variant = 'outlined';
    el.size = 'sm';
    el.disabled = false;
    el.loading = false;
    el.active = false;
  });

  await expect(button).toHaveClass(/w-btn-outlined/);
  await expect(button).toHaveClass(/w-btn--sm/);
  await expect(button).toBeEnabled();
  await expect(button).not.toHaveAttribute('aria-busy', 'true');
  await expect(button).not.toHaveClass(/active/);
});

test('w-btn renders links for href and emits focus and blur events from the inner control', async ({ mount, page }) => {
  await mount('<w-btn id="button" href="/docs" variant="text">Docs</w-btn>');
  await expect(page.locator('#button a')).toHaveAttribute('href', '/docs');

  await recordEvents(page, '#button', ['focus', 'blur']);
  await page.locator('#button a').focus();
  await page.locator('body').click();

  const events = await readEvents(page, '#button');
  expect(events.map((event) => event.type)).toEqual(['focus', 'blur']);
});
