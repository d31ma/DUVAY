import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-navigation-menu reflects label and value while syncing item state', async ({ mount, page }) => {
  await mount(`
    <w-navigation-menu id="nav" label="Docs navigation" value="docs">
      <w-navigation-menu-item value="docs" label="Docs" active></w-navigation-menu-item>
      <w-navigation-menu-item value="components" label="Components" href="/docs/components"></w-navigation-menu-item>
      <w-navigation-menu-item value="resources" label="Resources" disabled></w-navigation-menu-item>
    </w-navigation-menu>
  `);

  await expect(page.locator('#nav .w-navigation-menu')).toHaveAttribute('aria-label', 'Docs navigation');
  await expect(page.locator('#nav')).toHaveAttribute('value', 'docs');
  await expect(page.locator('#nav w-navigation-menu-item[value="docs"]')).toHaveAttribute('active', '');
  await expect(page.locator('#nav w-navigation-menu-item[value="components"] a')).toHaveAttribute('href', '/docs/components');
  await expect(page.locator('#nav w-navigation-menu-item[value="resources"] button')).toBeDisabled();

  await page.locator('#nav').evaluate((el) => {
    el.setAttribute('label', 'Primary');
    el.setAttribute('value', 'components');
  });

  await expect(page.locator('#nav .w-navigation-menu')).toHaveAttribute('aria-label', 'Primary');
  await expect(page.locator('#nav')).toHaveAttribute('value', 'components');
  await expect(page.locator('#nav w-navigation-menu-item[value="components"]')).toHaveAttribute('active', '');
});

test('w-navigation-menu updates selection from clicks and ignores disabled items', async ({ mount, page }) => {
  await mount(`
    <w-navigation-menu id="nav" value="docs">
      <w-navigation-menu-item value="docs" label="Docs"></w-navigation-menu-item>
      <w-navigation-menu-item value="components" label="Components"></w-navigation-menu-item>
      <w-navigation-menu-item value="resources" label="Resources" disabled></w-navigation-menu-item>
    </w-navigation-menu>
  `);
  await recordEvents(page, '#nav', ['change']);

  await page.locator('#nav w-navigation-menu-item[value="components"] button').click();
  await expect(page.locator('#nav')).toHaveAttribute('value', 'components');

  await page.locator('#nav w-navigation-menu-item[value="resources"] button').click({ force: true });
  await expect(page.locator('#nav')).toHaveAttribute('value', 'components');
  expect(await readEvents(page, '#nav')).toEqual([
    { type: 'change', detail: { value: 'components' } },
  ]);
});
