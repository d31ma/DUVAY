import { expect, test } from '../setup/component-test.js';

function items(n) {
  return JSON.stringify(Array.from({ length: n }, (_, i) => 'Item ' + i)).replace(/"/g, '&quot;');
}

test('w-virtual-scroll renders only a window of items for a large dataset', async ({ mount, page }) => {
  await mount(`<w-virtual-scroll id="vs" items="${items(1000)}" height="300px" item-height="40"></w-virtual-scroll>`);

  const rendered = await page.locator('#vs .w-virtual-scroll-item').count();
  expect(rendered).toBeGreaterThan(0);
  expect(rendered).toBeLessThan(60);
  await expect(page.locator('#vs .w-virtual-scroll-item').first()).toHaveText('Item 0');
});

test('w-virtual-scroll reveals later items after scrolling', async ({ mount, page }) => {
  await mount(`<w-virtual-scroll id="vs" items="${items(1000)}" height="300px" item-height="40"></w-virtual-scroll>`);

  await page.locator('#vs [data-virtual-scroll]').evaluate((el) => { el.scrollTop = 4000; el.dispatchEvent(new Event('scroll')); });
  const texts = await page.locator('#vs .w-virtual-scroll-item').allTextContents();
  expect(texts).toContain('Item 100');
  expect(texts).not.toContain('Item 0');
});

test('w-virtual-scroll scrollToIndex jumps to an item', async ({ mount, page }) => {
  await mount(`<w-virtual-scroll id="vs" items="${items(1000)}" height="300px" item-height="40"></w-virtual-scroll>`);

  await page.locator('#vs').evaluate((el) => el.scrollToIndex(500));
  await expect(page.locator('#vs [data-virtual-scroll]')).toHaveJSProperty('scrollTop', 20000);
  const texts = await page.locator('#vs .w-virtual-scroll-item').allTextContents();
  expect(texts).toContain('Item 500');
});

test('w-virtual-scroll renders object items via item-title', async ({ mount, page }) => {
  const data = JSON.stringify([{ title: 'Alpha' }, { title: 'Beta' }, { title: 'Gamma' }]).replace(/"/g, '&quot;');
  await mount(`<w-virtual-scroll id="vs" items="${data}" height="200px" item-height="40"></w-virtual-scroll>`);

  const texts = await page.locator('#vs .w-virtual-scroll-item').allTextContents();
  expect(texts).toEqual(expect.arrayContaining(['Alpha', 'Beta', 'Gamma']));
});

test('w-virtual-scroll supports dynamic item heights when item-height is omitted', async ({ mount, page }) => {
  await mount(`<w-virtual-scroll id="vs" items="${items(500)}" height="200px"></w-virtual-scroll>`);

  // No fixed height attribute is written onto the items in dynamic mode.
  await expect(page.locator('#vs .w-virtual-scroll-item').first()).not.toHaveAttribute('style', /height/);
  await expect(page.locator('#vs .w-virtual-scroll-item').first()).toHaveText('Item 0');

  // scrollToIndex relies on measured offsets and still lands on the right item.
  await page.locator('#vs').evaluate((el) => el.scrollToIndex(100));
  const texts = await page.locator('#vs .w-virtual-scroll-item').allTextContents();
  expect(texts).toContain('Item 100');
});
