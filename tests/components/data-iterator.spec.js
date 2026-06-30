import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

const ITEMS = '[Alpha|Ready|Owner: Maya; Beta|Review|Owner: Iyor; Gamma|Queued|Owner: Sora; Delta|Done|Owner: Kai; Echo|Ready|Owner: Lee]';

test('w-data-iterator renders a card grid paginated by items-per-page with a footer range', async ({ mount, page }) => {
  await mount(`<w-data-iterator id="di" items="${ITEMS}" items-per-page="2"></w-data-iterator>`);

  await expect(page.locator('#di .w-data-iterator-item')).toHaveCount(2);
  await expect(page.locator('#di .w-data-iterator-item strong').first()).toHaveText('Alpha');
  await expect(page.locator('#di .w-data-iterator-range')).toHaveText('1–2 of 5');
  await expect(page.locator('#di w-pagination')).toHaveAttribute('length', '3');
});

test('w-data-iterator paginates and emits change', async ({ mount, page }) => {
  await mount(`<w-data-iterator id="di" items="${ITEMS}" items-per-page="2"></w-data-iterator>`);
  await recordEvents(page, '#di', ['change']);

  await page.locator('#di w-pagination').evaluate((el) => {
    el.dispatchEvent(new CustomEvent('change', { detail: { page: 2 }, bubbles: true }));
  });

  await expect(page.locator('#di .w-data-iterator-item strong').first()).toHaveText('Gamma');
  await expect(page.locator('#di .w-data-iterator-range')).toHaveText('3–4 of 5');
  expect(await readEvents(page, '#di')).toEqual([{ type: 'change', detail: { value: 2 } }]);
});

test('w-data-iterator filters by search', async ({ mount, page }) => {
  await mount(`<w-data-iterator id="di" items="${ITEMS}" items-per-page="10" search="ready"></w-data-iterator>`);

  await expect(page.locator('#di .w-data-iterator-item')).toHaveCount(2);
  await expect(page.locator('#di .w-data-iterator-range')).toHaveText('1–2 of 2');
});

test('w-data-iterator sorts by field ascending and descending', async ({ mount, page }) => {
  await mount(`<w-data-iterator id="di" items="${ITEMS}" items-per-page="10" sort-by="title"></w-data-iterator>`);
  await expect(page.locator('#di .w-data-iterator-item strong').first()).toHaveText('Alpha');

  await page.locator('#di').evaluate((el) => el.setAttribute('sort-desc', ''));
  await expect(page.locator('#di .w-data-iterator-item strong').first()).toHaveText('Gamma');
});

test('w-data-iterator items-per-page-options renders a per-page select and updates page size', async ({ mount, page }) => {
  await mount(`<w-data-iterator id="di" items="${ITEMS}" items-per-page="2" items-per-page-options="2,4,10"></w-data-iterator>`);
  await recordEvents(page, '#di', ['update']);

  await expect(page.locator('#di [data-per-page]')).toBeVisible();
  await expect(page.locator('#di .w-data-iterator-item')).toHaveCount(2);

  await page.locator('#di [data-per-page]').selectOption('4');
  await expect(page.locator('#di .w-data-iterator-item')).toHaveCount(4);
  await expect(page.locator('#di .w-data-iterator-range')).toHaveText('1–4 of 5');
  expect(await readEvents(page, '#di')).toEqual([{ type: 'update', detail: { page: 1, itemsPerPage: 4 } }]);
});

test('w-data-iterator shows a loading skeleton', async ({ mount, page }) => {
  await mount(`<w-data-iterator id="di" items="${ITEMS}" items-per-page="3" loading></w-data-iterator>`);

  await expect(page.locator('#di .w-data-iterator-grid[aria-busy="true"]')).toBeVisible();
  await expect(page.locator('#di .w-skeleton')).toHaveCount(6);
  await expect(page.locator('#di .w-data-iterator-footer')).toHaveCount(0);
});

test('w-data-iterator shows a no-data message when nothing matches', async ({ mount, page }) => {
  await mount(`<w-data-iterator id="di" items="${ITEMS}" search="zzz" no-data-text="Nothing here"></w-data-iterator>`);

  await expect(page.locator('#di .w-data-iterator-empty')).toHaveText('Nothing here');
  await expect(page.locator('#di .w-data-iterator-item')).toHaveCount(0);
});

test('w-data-iterator supports configurable title/subtitle/meta fields via array rows', async ({ mount, page }) => {
  await mount('<w-data-iterator id="di" items="[Alpha|Ready|Owner: Maya]"></w-data-iterator>');

  await expect(page.locator('#di .w-data-iterator-item strong')).toHaveText('Alpha');
  await expect(page.locator('#di .w-data-iterator-item span')).toHaveText('Ready');
  await expect(page.locator('#di .w-data-iterator-item small')).toHaveText('Owner: Maya');
});
