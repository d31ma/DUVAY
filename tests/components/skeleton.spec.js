import { expect, test } from '../setup/component-test.js';

test('w-skeleton composes the card preset into image, heading, and text bones', async ({ mount, page }) => {
  await mount('<w-skeleton id="s" type="card"></w-skeleton>');
  await expect(page.locator('#s .w-skeleton-card')).toHaveCount(1);
  await expect(page.locator('#s .w-skeleton-image')).toHaveCount(1);
  await expect(page.locator('#s .w-skeleton-heading')).toHaveCount(1);
  await expect(page.locator('#s .w-skeleton-text')).toHaveCount(3); // paragraph = text@3
});

test('w-skeleton builds a list-item with avatar and two text lines', async ({ mount, page }) => {
  await mount('<w-skeleton id="s" type="list-item-avatar-two-line"></w-skeleton>');
  await expect(page.locator('#s .w-skeleton-list-item .w-skeleton-avatar')).toHaveCount(1);
  await expect(page.locator('#s .w-skeleton-list-item__content .w-skeleton-text')).toHaveCount(2);
});

test('w-skeleton boilerplate disables animation and @n repeats expand', async ({ mount, page }) => {
  await mount('<w-skeleton id="s" type="text@4" boilerplate></w-skeleton>');
  await expect(page.locator('#s .w-skeleton-loader')).toHaveClass(/w-skeleton--boilerplate/);
  await expect(page.locator('#s .w-skeleton-text')).toHaveCount(4);
});

test('w-skeleton shows slotted content when not loading, skeleton while loading', async ({ mount, page }) => {
  await mount('<w-skeleton id="s"><p class="real">Loaded</p></w-skeleton>');
  await expect(page.locator('#s .real')).toHaveText('Loaded');
  await expect(page.locator('#s .w-skeleton-loader')).toHaveCount(0);

  await page.locator('#s').evaluate((el) => el.setAttribute('loading', ''));
  await expect(page.locator('#s .w-skeleton-loader')).toHaveCount(1);
});

test('w-skeleton-loader alias supports the legacy variant/lines API', async ({ mount, page }) => {
  await mount('<w-skeleton-loader id="s" lines="3"></w-skeleton-loader>');
  await expect(page.locator('#s .w-skeleton-text')).toHaveCount(3);
});
