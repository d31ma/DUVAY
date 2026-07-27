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

const PULL_CONTENT = '<div class="w-list" style="height:320px"><div class="w-list-item">Inbox</div></div>';

async function pull(page, selector, distance) {
  const box = await page.locator(selector).boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + 4);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + 4 + distance, { steps: 6 });
  await page.mouse.up();
}

async function recordLoads(page, selector) {
  await page.evaluate((target) => {
    window.__wPullLoads = [];
    document.querySelector(target).addEventListener('load', (event) => {
      window.__wPullLoads.push(typeof event.detail?.done);
    });
  }, selector);
}

test('w-pull-to-refresh dragging past the threshold refreshes', async ({ mount, page }) => {
  await mount(`<w-pull-to-refresh id="p" pull-down-threshold="40">${PULL_CONTENT}</w-pull-to-refresh>`);
  await recordLoads(page, '#p');

  await pull(page, '#p .w-pull-to-refresh', 90);

  await expect(page.locator('#p .w-pull-to-refresh')).toHaveClass(/is-refreshing/);
  await expect(page.locator('#p .w-pull-to-refresh')).not.toHaveClass(/is-pulling/);
  expect(await page.evaluate(() => window.__wPullLoads)).toEqual(['function']);

  await page.locator('#p').evaluate((el) => el.complete());
  await expect(page.locator('#p .w-pull-to-refresh')).not.toHaveClass(/is-refreshing/);
});

test('w-pull-to-refresh releasing short of the threshold snaps back without refreshing', async ({ mount, page }) => {
  await mount(`<w-pull-to-refresh id="p" pull-down-threshold="120">${PULL_CONTENT}</w-pull-to-refresh>`);
  await recordLoads(page, '#p');

  await pull(page, '#p .w-pull-to-refresh', 30);

  await expect(page.locator('#p .w-pull-to-refresh')).not.toHaveClass(/is-refreshing/);
  await expect(page.locator('#p .w-pull-to-refresh')).not.toHaveClass(/is-pulling/);
  expect(await page.evaluate(() => window.__wPullLoads)).toEqual([]);
  expect(await page.locator('#p .w-pull-to-refresh').evaluate((el) => el.style.getPropertyValue('--w-pull-distance'))).toBe('0px');
});

test('w-pull-to-refresh ignores a release that never started with a drag', async ({ mount, page }) => {
  await mount(`<w-pull-to-refresh id="p" pull-down-threshold="10">${PULL_CONTENT}</w-pull-to-refresh>`);
  await recordLoads(page, '#p');

  await page.locator('#p .w-pull-to-refresh').evaluate((el) => {
    el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientY: 400 }));
  });

  await expect(page.locator('#p .w-pull-to-refresh')).not.toHaveClass(/is-refreshing/);
  expect(await page.evaluate(() => window.__wPullLoads)).toEqual([]);
});
