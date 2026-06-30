import { expect, test } from '../setup/component-test.js';

test('w-pull-to-refresh renders the indicator and reflects refreshing state', async ({ mount, page }) => {
  await mount('<w-pull-to-refresh id="p" refreshing><div class="w-list"><div class="w-list-item">Inbox</div></div></w-pull-to-refresh>');
  await expect(page.locator('#p .w-pull-to-refresh')).toHaveClass(/is-refreshing/);
  await expect(page.locator('#p .w-pull-spinner')).toBeVisible();
});

test('w-pull-to-refresh fires load with a done callback and completes', async ({ mount, page }) => {
  await mount('<w-pull-to-refresh id="p"><div class="w-list"><div class="w-list-item">Inbox</div></div></w-pull-to-refresh>');

  const ok = await page.evaluate(() => new Promise((resolve) => {
    const el = document.querySelector('#p');
    el.addEventListener('load', (e) => resolve(!!e.detail && typeof e.detail.done === 'function'));
    el._refresh();
  }));
  expect(ok).toBe(true);
  await expect(page.locator('#p .w-pull-to-refresh')).toHaveClass(/is-refreshing/);

  await page.locator('#p').evaluate((el) => el.complete());
  await expect(page.locator('#p .w-pull-to-refresh')).not.toHaveClass(/is-refreshing/);
});
