import { expect, test } from '../setup/component-test.js';

test('w-tab reflects value, active, and disabled attributes', async ({ mount, page }) => {
  await mount('<w-tab id="tab" value="inbox" active disabled>Inbox</w-tab>');

  await expect(page.locator('#tab button')).toHaveAttribute('role', 'tab');
  await expect(page.locator('#tab button')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#tab button')).toHaveClass(/active/);
  await expect(page.locator('#tab button')).toBeDisabled();
  await expect(page.locator('#tab')).toHaveAttribute('value', 'inbox');

  await page.locator('#tab').evaluate((el) => {
    el.removeAttribute('active');
    el.removeAttribute('disabled');
  });

  await expect(page.locator('#tab button')).toHaveAttribute('aria-selected', 'false');
  await expect(page.locator('#tab button')).not.toHaveClass(/active/);
  await expect(page.locator('#tab button')).toBeEnabled();
});
