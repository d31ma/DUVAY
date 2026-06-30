import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-fab renders icon, label, and emits click', async ({ mount, page }) => {
  await mount('<w-fab id="f" icon="add" label="Create"></w-fab>');

  const fab = page.locator('#f .w-fab');
  await expect(fab).toHaveAttribute('aria-label', 'Create');
  await expect(fab).toHaveClass(/w-fab--extended/);
  await expect(fab).toContainText('Create');

  await recordEvents(page, '#f', ['click']);
  await fab.click();
  const events = await readEvents(page, '#f');
  expect(events.map((e) => e.type)).toContain('click');
});

test('w-fab reflects size, color, variant, rounded, absolute, location, and active', async ({ mount, page }) => {
  await mount(`
    <w-fab id="f"
      size="large"
      color="success"
      variant="tonal"
      rounded="pill"
      absolute
      location="top end"
      active
    ></w-fab>
  `);

  const fab = page.locator('#f .w-fab');
  await expect(fab).toHaveClass(/w-fab--large/);
  await expect(fab).toHaveClass(/w-fab--color-success/);
  await expect(fab).toHaveClass(/w-fab--variant-tonal/);
  await expect(fab).toHaveClass(/w-fab--rounded-pill/);
  await expect(fab).toHaveClass(/w-fab--absolute/);
  await expect(fab).toHaveClass(/w-fab--top/);
  await expect(fab).toHaveClass(/w-fab--end/);
  await expect(fab).toHaveClass(/w-fab--active/);
});

test('w-fab supports all Vuetify sizes', async ({ mount, page }) => {
  for (const size of ['x-small', 'small', 'default', 'large', 'x-large']) {
    const id = `fab-${size.replace('-', '')}`;
    await mount(`<w-fab id="${id}" size="${size}"></w-fab>`);
    const fab = page.locator(`#${id} .w-fab`);
    await expect(fab).toHaveClass(new RegExp(`w-fab--${size}`));
  }
});

test('w-fab supports all Vuetify variants', async ({ mount, page }) => {
  for (const variant of ['elevated', 'flat', 'tonal', 'outlined', 'text', 'plain']) {
    const id = `fab-${variant}`;
    await mount(`<w-fab id="${id}" variant="${variant}"></w-fab>`);
    const fab = page.locator(`#${id} .w-fab`);
    if (variant === 'elevated') {
      // elevated is default, no extra class
      await expect(fab).not.toHaveClass(/w-fab--variant-/);
    } else {
      await expect(fab).toHaveClass(new RegExp(`w-fab--variant-${variant}`));
    }
  }
});

test('w-fab fixed + legacy position still works', async ({ mount, page }) => {
  await mount('<w-fab id="f" fixed position="bottom-left"></w-fab>');
  const fab = page.locator('#f .w-fab');
  await expect(fab).toHaveClass(/w-fab--fixed/);
  await expect(fab).toHaveClass(/w-fab--bottom/);
  await expect(fab).toHaveClass(/w-fab--left/);
});

test('w-fab icon-set resolves correctly', async ({ mount, page }) => {
  await mount('<w-fab id="f" icon="home" icon-set="mdi"></w-fab>');
  const icon = page.locator('#f .w-icon');
  await expect(icon).toHaveCount(1);
});

test('w-fab focus-visible outline is present', async ({ mount, page }) => {
  await mount('<w-fab id="f"></w-fab>');
  const fab = page.locator('#f .w-fab');
  await fab.focus();
  await expect(fab).toHaveCSS('outline-width', '2px');
});
