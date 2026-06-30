import { expect, test } from '../setup/component-test.js';

test('w-hover-card reflects attrs and opens on hover and focus', async ({ mount, page }) => {
  await mount(`
    <w-hover-card id="hover" side="bottom" inline>
      <button>Target</button>
      <span slot="content">Preview</span>
    </w-hover-card>
  `);

  await expect(page.locator('#hover .w-hover-card')).toHaveClass(/w-hover-card--bottom/);
  await expect(page.locator('#hover .w-hover-card')).toHaveClass(/w-hover-card--inline/);

  await page.locator('#hover .w-hover-card-trigger').hover();
  await expect(page.locator('#hover')).toHaveAttribute('open', '');

  await page.mouse.move(0, 0);
  await expect(page.locator('#hover')).not.toHaveAttribute('open', '');

  await page.locator('#hover button').focus();
  await expect(page.locator('#hover')).toHaveAttribute('open', '');
  await page.locator('#hover button').evaluate((el) => el.blur());
  await expect(page.locator('#hover')).not.toHaveAttribute('open', '');
});
