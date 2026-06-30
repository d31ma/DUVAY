import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-pagination renders page numbers with ellipsis truncation and aria-current', async ({ mount, page }) => {
  await mount('<w-pagination id="p" length="20" page="10" total-visible="5"></w-pagination>');

  const nav = page.locator('#p nav');
  await expect(nav).toHaveAttribute('aria-label', 'Pagination');

  // With total-visible=5, page=10, length=20: should show [1, ..., 9, 10, 11, ..., 20]
  const items = await page.locator('#p .w-page-item').allTextContents();
  expect(items).toContain('1');
  expect(items).toContain('20');
  expect(items).toContain('9');
  expect(items).toContain('10');
  expect(items).toContain('11');

  // Ellipsis should be present
  await expect(page.locator('#p .w-page-ellipsis')).toHaveCount(2);

  // Active page has aria-current
  const active = page.locator('#p .w-page-item.active');
  await expect(active).toHaveText('10');
  await expect(active).toHaveAttribute('aria-current', 'page');
  await expect(active).toHaveAttribute('aria-label', 'Current page, page 10');
});

test('w-pagination prev/next disabled at bounds, first/last buttons shown', async ({ mount, page }) => {
  await mount('<w-pagination id="p" length="5" page="1" show-first-last-page></w-pagination>');

  const prev = page.locator('#p .w-page-item[data-page="1"]').first();
  const next = page.locator('#p .w-page-item[data-page="2"]').last();
  const first = page.locator('#p .w-page-item[data-page="1"]').first();
  const last = page.locator('#p .w-page-item[data-page="5"]').last();

  // Prev button (data-page=1) should be disabled when page=1
  await expect(prev).toBeDisabled();
  await expect(first).toBeDisabled();
  await expect(next).toBeEnabled();
  await expect(last).toBeEnabled();

  // Click to last page
  await last.click();

  // After re-render, last and next should be disabled
  const lastAfter = page.locator('#p .w-page-item[data-page="5"]').last();
  const nextAfter = page.locator('#p .w-page-item[data-page="5"]').nth(1); // next button points to 5 now
  await expect(lastAfter).toBeDisabled();
  await expect(nextAfter).toBeDisabled();
});

test('w-pagination clicking a page fires change and update:modelValue with correct page', async ({ mount, page }) => {
  await mount('<w-pagination id="p" length="10" page="3"></w-pagination>');
  await recordEvents(page, '#p', ['change', 'update:modelValue']);

  await page.locator('#p .w-page-item[data-page="7"]').click();

  const events = await readEvents(page, '#p');
  expect(events.filter(e => e.type === 'change')).toEqual([{ type: 'change', detail: { page: 7 } }]);
  expect(events.filter(e => e.type === 'update:modelValue')).toEqual([{ type: 'update:modelValue', detail: { page: 7 } }]);

  // Active page updated
  await expect(page.locator('#p .w-page-item.active')).toHaveText('7');
  await expect(page.locator('#p .w-page-item.active')).toHaveAttribute('aria-current', 'page');
});

test('w-pagination first/last/prev/next events fire for navigation buttons', async ({ mount, page }) => {
  await mount('<w-pagination id="p" length="10" page="5" show-first-last-page></w-pagination>');
  await recordEvents(page, '#p', ['first', 'prev', 'next', 'last', 'change']);

  // First button
  await page.locator('#p .w-page-item[aria-label="First page"]').click();
  let events = await readEvents(page, '#p');
  expect(events.find(e => e.type === 'first')).toEqual({ type: 'first', detail: { page: 1 } });

  // Reset to middle
  await page.locator('#p').evaluate(el => el.setAttribute('page', '5'));
  await page.waitForTimeout(50);

  // Prev button
  await page.locator('#p .w-page-item[aria-label="Previous page"]').click();
  events = await readEvents(page, '#p');
  expect(events.filter(e => e.type === 'prev').pop()).toEqual({ type: 'prev', detail: { page: 4 } });

  // Next button
  await page.locator('#p .w-page-item[aria-label="Next page"]').click();
  events = await readEvents(page, '#p');
  expect(events.filter(e => e.type === 'next').pop()).toEqual({ type: 'next', detail: { page: 5 } });

  // Last button
  await page.locator('#p .w-page-item[aria-label="Last page"]').click();
  events = await readEvents(page, '#p');
  expect(events.filter(e => e.type === 'last').pop()).toEqual({ type: 'last', detail: { page: 10 } });
});

test('w-pagination disabled disables all controls', async ({ mount, page }) => {
  await mount('<w-pagination id="p" length="5" page="3" disabled></w-pagination>');

  const buttons = page.locator('#p .w-page-item');
  const count = await buttons.count();
  for (let i = 0; i < count; i++) {
    await expect(buttons.nth(i)).toBeDisabled();
  }
});

test('w-pagination variant classes applied', async ({ mount, page }) => {
  await mount('<w-pagination id="p" length="5" page="2" variant="outlined"></w-pagination>');
  const active = page.locator('#p .w-page-item.active');
  await expect(active).toHaveClass(/w-page-item--outlined/);
});

test('w-pagination size classes applied', async ({ mount, page }) => {
  await mount('<w-pagination id="p" length="5" page="2" size="large"></w-pagination>');
  const active = page.locator('#p .w-page-item.active');
  await expect(active).toHaveClass(/w-page-item--large/);
});

test('w-pagination rounded circle renders pill class', async ({ mount, page }) => {
  await mount('<w-pagination id="p" length="5" page="2" rounded="circle"></w-pagination>');
  const active = page.locator('#p .w-page-item.active');
  await expect(active).toHaveClass(/w-page-item--pill/);
});

test('w-pagination color and active-color classes applied', async ({ mount, page }) => {
  await mount('<w-pagination id="p" length="5" page="2" color="success" active-color="error"></w-pagination>');
  const active = page.locator('#p .w-page-item.active');
  await expect(active).toHaveClass(/w-page-item--color-success/);
  await expect(active).toHaveClass(/w-page-item--active-color-error/);
});

test('w-pagination custom icons and ellipsis', async ({ mount, page }) => {
  await mount('<w-pagination id="p" length="10" page="5" total-visible="5" show-first-last-page first-icon="First" last-icon="Last" prev-icon="Prev" next-icon="Next" ellipsis="..."></w-pagination>');

  await expect(page.locator('#p .w-page-item[aria-label="First page"]')).toHaveText('First');
  await expect(page.locator('#p .w-page-item[aria-label="Previous page"]')).toHaveText('Prev');
  await expect(page.locator('#p .w-page-item[aria-label="Next page"]')).toHaveText('Next');
  await expect(page.locator('#p .w-page-item[aria-label="Last page"]')).toHaveText('Last');
  await expect(page.locator('#p .w-page-ellipsis').first()).toHaveText('...');
});

test('w-pagination start offset shifts page numbers', async ({ mount, page }) => {
  await mount('<w-pagination id="p" length="5" page="7" start="5"></w-pagination>');
  const items = await page.locator('#p .w-page-item').allTextContents();
  expect(items).toContain('5');
  expect(items).toContain('9');
});
