import { expect, test } from '../setup/component-test.js';

const LIST = '<div class="w-list"><div class="w-list-item">A</div><div class="w-list-item">B</div></div>';

test('w-infinite-scroll renders a scroller with an end trigger by default', async ({ mount, page }) => {
  await mount(`<w-infinite-scroll id="s" mode="manual" height="180px">${LIST}</w-infinite-scroll>`);

  await expect(page.locator('#s [data-infinite-scroll]')).toHaveCount(1);
  await expect(page.locator('#s .w-infinite-scroll-content')).toHaveCount(1);
  await expect(page.locator('#s .w-infinite-scroll-trigger')).toHaveCount(1);
  await expect(page.locator('#s .w-infinite-scroll-trigger')).toHaveAttribute('data-side', 'end');
});

test('w-infinite-scroll side="both" renders start and end triggers', async ({ mount, page }) => {
  await mount(`<w-infinite-scroll id="s" mode="manual" side="both" height="180px">${LIST}</w-infinite-scroll>`);
  await expect(page.locator('#s .w-infinite-scroll-trigger')).toHaveCount(2);
  await expect(page.locator('#s .w-infinite-scroll-trigger[data-side="start"]')).toHaveCount(1);
  await expect(page.locator('#s .w-infinite-scroll-trigger[data-side="end"]')).toHaveCount(1);
});

test('w-infinite-scroll manual mode shows a Load more button and does not auto-load', async ({ mount, page }) => {
  await mount(`<w-infinite-scroll id="s" mode="manual" height="180px" load-more-text="Show more">${LIST}</w-infinite-scroll>`);

  await expect(page.locator('#s [data-load-more]')).toHaveText('Show more');
  await page.waitForTimeout(100);
  // No auto-load: the button is still there and nothing is loading.
  await expect(page.locator('#s [data-load-more]')).toBeVisible();
  await expect(page.locator('#s .w-infinite-scroll-spinner')).toHaveCount(0);
});

test('w-infinite-scroll manual load → done("empty") shows the empty text', async ({ mount, page }) => {
  await mount(`<w-infinite-scroll id="s" mode="manual" height="180px" empty-text="All done" @load="event.detail.done('empty')">${LIST}</w-infinite-scroll>`);

  await page.locator('#s [data-load-more]').click();
  await expect(page.locator('#s .w-infinite-scroll-empty')).toHaveText('All done');
  await expect(page.locator('#s')).toHaveAttribute('status', 'empty');
});

test('w-infinite-scroll intersect mode auto-loads when the sentinel is visible', async ({ mount, page }) => {
  await mount(`<w-infinite-scroll id="s" height="300px" empty-text="No more" @load="event.detail.done('empty')">${LIST}</w-infinite-scroll>`);

  await expect(page.locator('#s .w-infinite-scroll-empty')).toHaveText('No more');
});

test('w-infinite-scroll done("error") shows a retry that re-loads', async ({ mount, page }) => {
  await mount(`<w-infinite-scroll id="s" mode="manual" height="180px" error-text="Failed"
    @load="this.dataset.loads = String((+this.dataset.loads || 0) + 1); event.detail.done(this.dataset.loads === '1' ? 'error' : 'empty')">${LIST}</w-infinite-scroll>`);

  await page.locator('#s [data-load-more]').click();
  await expect(page.locator('#s .w-infinite-scroll-error')).toHaveText('Failed');
  await expect(page.locator('#s [data-retry]')).toBeVisible();

  await page.locator('#s [data-retry]').click();
  await expect(page.locator('#s')).toHaveAttribute('status', 'empty');
});

test('w-infinite-scroll loading status shows a spinner', async ({ mount, page }) => {
  // done is never called → stays loading after the click.
  await mount(`<w-infinite-scroll id="s" mode="manual" height="180px" @load="void 0">${LIST}</w-infinite-scroll>`);
  await page.locator('#s [data-load-more]').click();
  await expect(page.locator('#s .w-infinite-scroll-spinner')).toBeVisible();
  await expect(page.locator('#s')).toHaveAttribute('status', 'loading');
});

test('w-infinite-scroll applies color and horizontal direction', async ({ mount, page }) => {
  await mount(`<w-infinite-scroll id="c" mode="manual" color="success">${LIST}</w-infinite-scroll><w-infinite-scroll id="h" mode="manual" direction="horizontal">${LIST}</w-infinite-scroll>`);

  await expect(page.locator('#c [data-infinite-scroll]')).toHaveAttribute('style', /--w-infinite-color:var\(--w-success/);
  await expect(page.locator('#h .w-infinite-scroll')).toHaveClass(/w-infinite-scroll--horizontal/);
});
