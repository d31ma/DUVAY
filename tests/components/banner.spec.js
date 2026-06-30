import { expect, test } from '../setup/component-test.js';

test('w-banner renders icon, text, and actions in the banner surface', async ({ mount, page }) => {
  await mount(`
    <w-banner id="b" icon="!" text="Update available">
      <div slot="actions"><button class="act">Update</button></div>
    </w-banner>
  `);

  const banner = page.locator('#b .w-banner');
  await expect(banner).toHaveAttribute('role', 'region');
  await expect(page.locator('#b .w-banner__icon')).toHaveText('!');
  await expect(page.locator('#b .w-banner-text')).toHaveText('Update available');
  await expect(page.locator('#b .w-banner-actions .act')).toHaveText('Update');
});

test('w-banner applies lines, stacked, and sticky modifiers', async ({ mount, page }) => {
  await mount('<w-banner id="b" text="Hi" lines="two" stacked sticky></w-banner>');
  const banner = page.locator('#b .w-banner');
  await expect(banner).toHaveClass(/w-banner--lines-two/);
  await expect(banner).toHaveClass(/w-banner--stacked/);
  await expect(banner).toHaveClass(/w-banner--sticky/);
});

test('w-banner maps bg-color tokens to surface custom properties', async ({ mount, page }) => {
  await mount('<w-banner id="b" text="Hi" bg-color="primary"></w-banner>');
  const style = await page.locator('#b .w-banner').getAttribute('style');
  expect(style).toContain('--w-banner-bg: var(--w-primary-container)');
  expect(style).toContain('--w-banner-fg: var(--w-on-primary-container)');
});

test('w-banner prepend slot overrides the icon, avatar renders an image', async ({ mount, page }) => {
  await mount('<w-banner id="b" text="Hi" avatar="/a.png"></w-banner>');
  await expect(page.locator('#b .w-banner__avatar img')).toHaveAttribute('src', '/a.png');
});
