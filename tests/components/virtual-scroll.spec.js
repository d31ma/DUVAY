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

test('w-virtual-scroll accepts single-quoted object arrays', async ({ mount, page }) => {
  await mount(`<w-virtual-scroll id="vs" items="[{'title':'Alpha'},{'title':'Beta'},{'title':'Gamma'}]" height="200px" item-height="40"></w-virtual-scroll>`);

  const texts = await page.locator('#vs .w-virtual-scroll-item').allTextContents();
  expect(texts).toEqual(['Alpha', 'Beta', 'Gamma']);
});

test('w-virtual-scroll falls back to a bracketed plain list when the JSON is malformed', async ({ mount, page }) => {
  await mount(`<w-virtual-scroll id="vs" items="[Alpha, Beta, Gamma]" height="200px" item-height="40"></w-virtual-scroll>`);

  const texts = await page.locator('#vs .w-virtual-scroll-item').allTextContents();
  expect(texts).toEqual(['Alpha', 'Beta', 'Gamma']);
});

test('w-virtual-scroll falls back when a stray apostrophe defeats the single-quote repair', async ({ mount, page }) => {
  await mount(`<w-virtual-scroll id="vs" items="[Alpha; O'Brien; Gamma]" height="200px" item-height="40"></w-virtual-scroll>`);

  const texts = await page.locator('#vs .w-virtual-scroll-item').allTextContents();
  expect(texts).toEqual(['Alpha', "O'Brien", 'Gamma']);
});

test('w-virtual-scroll renders slotted content when items is a plain comma list or absent', async ({ mount, page }) => {
  await mount(`
    <w-virtual-scroll id="list" items="Alpha,Beta" height="200px" item-height="40"></w-virtual-scroll>
    <w-virtual-scroll id="empty" height="200px" item-height="40"><p class="fallback">Nothing to virtualise</p></w-virtual-scroll>
  `);

  expect(await page.locator('#list .w-virtual-scroll-item').allTextContents()).toEqual(['Alpha', 'Beta']);
  await expect(page.locator('#empty .fallback')).toHaveText('Nothing to virtualise');
  await expect(page.locator('#empty .w-virtual-scroll-item')).toHaveCount(0);
});

test('w-virtual-scroll item-key keys the rows and keeps an unchanged window', async ({ mount, page }) => {
  const data = JSON.stringify(Array.from({ length: 200 }, (_, i) => ({ id: 'k' + i, title: 'Item ' + i })))
    .replace(/"/g, '&quot;');
  await mount(`<w-virtual-scroll id="vs" items="${data}" height="300px" item-height="40" item-key="id"></w-virtual-scroll>`);

  await expect(page.locator('#vs .w-virtual-scroll-item').first()).toHaveAttribute('data-key', 'k0');

  // Re-measuring the same window leaves the existing nodes in place…
  const kept = await page.locator('#vs').evaluate((el) => {
    el.querySelector('[data-index="0"]').setAttribute('data-touched', 'yes');
    el.calculateVisibleItems();
    return el.querySelector('[data-index="0"]').getAttribute('data-touched');
  });
  expect(kept).toBe('yes');

  // …while a window holding different items is rebuilt.
  const replaced = await page.locator('#vs').evaluate((el) => {
    const scroller = el.querySelector('[data-virtual-scroll]');
    scroller.scrollTop = 2000;
    scroller.dispatchEvent(new Event('scroll'));
    return el.querySelector('[data-index="0"]');
  });
  expect(replaced).toBeNull();
});

test('w-virtual-scroll without item-key rebuilds the window on every pass', async ({ mount, page }) => {
  await mount(`<w-virtual-scroll id="vs" items="${items(200)}" height="300px" item-height="40"></w-virtual-scroll>`);

  await expect(page.locator('#vs .w-virtual-scroll-item').first()).not.toHaveAttribute('data-key', /./);
  const kept = await page.locator('#vs').evaluate((el) => {
    el.querySelector('[data-index="0"]').setAttribute('data-touched', 'yes');
    el.calculateVisibleItems();
    return el.querySelector('[data-index="0"]').getAttribute('data-touched');
  });
  expect(kept).toBeNull();
});

test('w-virtual-scroll renderless virtualises against the parent scroller', async ({ mount, page }) => {
  await mount(`
    <div id="host" style="position:relative;height:300px;overflow:auto">
      <w-virtual-scroll id="vs" items="${items(1000)}" item-height="40" renderless></w-virtual-scroll>
    </div>
  `);

  // No scroll box of its own — the parent owns the scrolling.
  await expect(page.locator('#vs .w-virtual-scroll')).toHaveCount(0);
  await expect(page.locator('#vs [data-virtual-container]')).toHaveAttribute('role', 'list');
  const rendered = await page.locator('#vs .w-virtual-scroll-item').count();
  expect(rendered).toBeGreaterThan(0);
  expect(rendered).toBeLessThan(60);
  await expect(page.locator('#vs .w-virtual-scroll-item').first()).toHaveText('Item 0');

  await page.locator('#host').evaluate((el) => { el.scrollTop = 4000; el.dispatchEvent(new Event('scroll')); });
  const texts = await page.locator('#vs .w-virtual-scroll-item').allTextContents();
  expect(texts).toContain('Item 100');
  expect(texts).not.toContain('Item 0');
});
