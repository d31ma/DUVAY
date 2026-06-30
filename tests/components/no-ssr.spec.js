import { expect, test } from '../setup/component-test.js';

test('w-no-ssr reveals default content after the client mounts', async ({ mount, page }) => {
  await mount('<w-no-ssr id="n"><span slot="placeholder" class="ph">loading…</span><div class="content">client only</div></w-no-ssr>');
  // After mount the default content is shown and the placeholder is hidden.
  await expect(page.locator('#n .content')).toBeVisible();
  await expect(page.locator('#n .ph')).toBeHidden();
});

test('w-no-ssr renders content even without a placeholder', async ({ mount, page }) => {
  await mount('<w-no-ssr id="n"><div class="content">browser only</div></w-no-ssr>');
  await expect(page.locator('#n .content')).toBeVisible();
});
