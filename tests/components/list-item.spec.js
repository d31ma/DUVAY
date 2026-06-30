import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-list-item reflects link, media, variant, density, lines, and active attrs', async ({ mount, page }) => {
  await mount(`
    <w-list-item
      id="item"
      href="/docs/lists"
      title="Avery Morgan"
      subtitle="Shared the revised roadmap."
      value="avery"
      prepend-avatar="AM"
      append-icon="9:42"
      variant="tonal"
      density="compact"
      lines="two"
      active-class="is-current"
      active
      border
      rounded
      elevation="1"
    ></w-list-item>
  `);

  const control = page.locator('#item .w-list-item');
  await expect(control).toHaveAttribute('href', '/docs/lists');
  await expect(control).toHaveClass(/w-list-item--variant-tonal/);
  await expect(control).toHaveClass(/w-list-item--compact/);
  await expect(control).toHaveClass(/w-list-item--two-line/);
  await expect(control).toHaveClass(/w-list-item--border/);
  await expect(control).toHaveClass(/w-list-item--rounded/);
  await expect(control).toHaveClass(/w-list-item--elevation-1/);
  await expect(control).toHaveClass(/is-current/);
  await expect(page.locator('#item .w-avatar-text')).toHaveText('AM');
  await expect(page.locator('#item .w-list-item-subtitle')).toHaveText('Shared the revised roadmap.');

  await page.locator('#item').evaluate((el) => {
    el.removeAttribute('active');
    el.setAttribute('append-avatar', 'https://example.test/avatar.png');
    el.setAttribute('variant', 'outlined');
  });

  await expect(control).not.toHaveClass(/is-current/);
  await expect(control).toHaveClass(/w-list-item--variant-outlined/);
  await expect(page.locator('#item .w-list-item-append img')).toHaveAttribute('src', 'https://example.test/avatar.png');
});

test('w-list-item emits change and supports keyboard activation', async ({ mount, page }) => {
  await mount('<w-list-item id="item" title="Inbox" value="inbox"></w-list-item>');
  await recordEvents(page, '#item', ['change']);

  await page.locator('#item .w-list-item').focus();
  await page.keyboard.press('Enter');

  expect(await readEvents(page, '#item')).toEqual([
    { type: 'change', detail: { value: 'inbox', title: 'Inbox' } },
  ]);
});
