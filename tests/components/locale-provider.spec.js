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

test('w-locale-provider messages resolve nested keys and replacements', async ({ mount, page }) => {
  await mount(`<w-locale-provider id="lp" locale="fr"
    messages='{"fr":{"actions":{"save":"Enregistrer {name}"}}}'>bonjour</w-locale-provider>`);
  const translated = await page.locator('#lp').evaluate((element) => (
    element.translate('actions.save', { name: 'Ada' })
  ));
  expect(translated).toBe('Enregistrer Ada');
});

test('w-locale-provider messages use fallback-locale and return unknown keys', async ({ mount, page }) => {
  await mount(`<w-locale-provider id="lp" locale="fr" fallback-locale="en"
    messages='{"en":{"actions":{"cancel":"Cancel"}}}'>bonjour</w-locale-provider>`);
  const values = await page.locator('#lp').evaluate((element) => [
    element.translate('actions.cancel'),
    element.translate('actions.missing'),
  ]);
  expect(values).toEqual(['Cancel', 'actions.missing']);
});
