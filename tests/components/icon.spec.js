import { expect, test } from '../setup/component-test.js';

test('w-icon renders the icon name and supports the icon alias', async ({ mount, page }) => {
  await mount('<w-icon id="i" name="home"></w-icon>');
  await expect(page.locator('#i .w-icon')).toHaveText('home');

  await mount('<w-icon id="i2" icon="search"></w-icon>');
  await expect(page.locator('#i2 .w-icon')).toHaveText('search');
});

test('w-icon applies size aliases, start, end, and disabled modifiers', async ({ mount, page }) => {
  await mount('<w-icon id="i" name="star" size="large" start></w-icon>');
  const icon = page.locator('#i .w-icon');
  await expect(icon).toHaveClass(/w-icon--large/);
  await expect(icon).toHaveClass(/w-icon--start/);

  await mount('<w-icon id="i2" name="star" size="x-small" end disabled></w-icon>');
  const icon2 = page.locator('#i2 .w-icon');
  await expect(icon2).toHaveClass(/w-icon--x-small/);
  await expect(icon2).toHaveClass(/w-icon--end/);
  await expect(icon2).toHaveClass(/w-icon--disabled/);
});

test('w-icon applies color, custom size, and opacity via inline style', async ({ mount, page }) => {
  await mount('<w-icon id="i" name="check" color="success" size="2rem" opacity="0.5"></w-icon>');
  const style = await page.locator('#i .w-icon').getAttribute('style');
  expect(style).toContain('color: var(--w-success)');
  expect(style).toContain('font-size: 2rem');
  expect(style).toContain('--w-icon-opacity: 0.5');
  // Named sizes use a class, not inline font-size.
  await mount('<w-icon id="i2" name="check" size="small"></w-icon>');
  expect(await page.locator('#i2 .w-icon').getAttribute('style')).toBeNull();
});
