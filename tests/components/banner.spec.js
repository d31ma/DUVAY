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

test('w-banner takes a region name, a live role and a registry icon', async ({ mount, page }) => {
  await page.evaluate(() => window.WIcons.set('mdi', { type: 'class', prefix: 'mdi' }));
  await mount('<w-banner id="named" label="Offline notice" icon="mdi:wifi-off" text="You are offline."></w-banner><w-banner id="live" live="polite" text="Synced."></w-banner><w-banner id="plain" text="Plain"></w-banner>');

  await expect(page.locator('#named .w-banner')).toHaveAttribute('role', 'region');
  await expect(page.locator('#named .w-banner')).toHaveAttribute('aria-label', 'Offline notice');
  await expect(page.locator('#named .w-banner__icon .mdi.wifi-off')).toHaveCount(1);
  await expect(page.locator('#live .w-banner')).toHaveAttribute('role', 'status');
  await expect(page.locator('#live .w-banner')).not.toHaveAttribute('aria-label', /./);
  await expect(page.locator('#plain .w-banner')).toHaveAttribute('aria-label', 'Banner');
});
