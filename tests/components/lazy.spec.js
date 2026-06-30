import { expect, test } from '../setup/component-test.js';

test('w-lazy shows a placeholder until active', async ({ mount, page }) => {
  // Keep the lazy region below the fold so the observer does not activate it.
  await mount('<div style="height:200vh"></div><w-lazy id="l" min-height="160px"><div class="content">Loaded</div></w-lazy>');
  await expect(page.locator('#l .w-lazy-placeholder')).toBeVisible();
  await expect(page.locator('#l .content')).toBeHidden();
});

test('w-lazy active (and model-value) reveals content with a fade transition', async ({ mount, page }) => {
  await mount('<w-lazy id="l" active><div class="content">Loaded</div></w-lazy>');
  const box = page.locator('#l .w-lazy');
  await expect(box).toHaveClass(/is-active/);
  await expect(box).toHaveClass(/w-lazy--transition-fade/);
  await expect(page.locator('#l .content')).toBeVisible();
  await expect(page.locator('#l .w-lazy-placeholder')).toBeHidden();

  await mount('<w-lazy id="l2" model-value><div class="content">MV</div></w-lazy>');
  await expect(page.locator('#l2 .content')).toBeVisible();
});
