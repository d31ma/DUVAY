import { expect, test } from '../setup/component-test.js';

test('w-locale-provider sets lang and defaults to ltr', async ({ mount, page }) => {
  await mount('<w-locale-provider id="lp" locale="fr-FR">bonjour</w-locale-provider>');
  const box = page.locator('#lp .w-locale-provider');
  await expect(box).toHaveAttribute('lang', 'fr-FR');
  await expect(box).toHaveAttribute('dir', 'ltr');
});

test('w-locale-provider rtl flips direction and reflects fallback-locale', async ({ mount, page }) => {
  await mount('<w-locale-provider id="lp" locale="ar" fallback-locale="en" rtl><span class="inner">مرحبا</span></w-locale-provider>');
  const box = page.locator('#lp .w-locale-provider');
  await expect(box).toHaveAttribute('dir', 'rtl');
  await expect(box).toHaveAttribute('data-fallback-locale', 'en');
  // Descendants inherit RTL direction.
  await expect(page.locator('#lp .inner')).toHaveCSS('direction', 'rtl');
});
