import { expect, test } from '../setup/component-test.js';

test('w-navigation-menu-item reflects href, label, value, active, and disabled attributes', async ({ mount, page }) => {
  await mount('<w-navigation-menu-item id="item" value="components" label="Components" href="/docs/components" active></w-navigation-menu-item>');

  await expect(page.locator('#item a')).toHaveAttribute('href', '/docs/components');
  await expect(page.locator('#item a')).toHaveAttribute('data-value', 'components');
  await expect(page.locator('#item a')).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('#item a')).toHaveText('Components');

  await page.locator('#item').evaluate((el) => {
    el.setAttribute('disabled', '');
    el.removeAttribute('active');
  });

  await expect(page.locator('#item button')).toBeDisabled();
  await expect(page.locator('#item button')).toHaveAttribute('aria-disabled', 'true');
  await expect(page.locator('#item button')).not.toHaveAttribute('aria-current', 'page');
});
