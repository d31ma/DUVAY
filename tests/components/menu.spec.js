import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-menu reflects activator, location, open, and disabled attributes', async ({ mount, page }) => {
  await mount(`
    <w-menu id="menu" label="Actions" location="top-end" open disabled>
      <button class="w-menu-item" role="menuitem">Profile</button>
    </w-menu>
  `);

  await expect(page.locator('#menu .w-menu')).toHaveClass(/open/);
  await expect(page.locator('#menu .w-menu')).toHaveClass(/w-menu--top-end/);
  await expect(page.locator('#menu .w-menu-activator')).toHaveText('Actions');
  await expect(page.locator('#menu .w-menu-activator')).toBeDisabled();
  await expect(page.locator('#menu .w-menu-activator')).toHaveAttribute('aria-haspopup', 'menu');
  await expect(page.locator('#menu .w-menu-activator')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#menu .w-menu-content')).toHaveAttribute('role', 'menu');

  await page.locator('#menu').evaluate((el) => {
    el.removeAttribute('disabled');
    el.removeAttribute('open');
    el.setAttribute('label', 'Workspace');
  });

  await expect(page.locator('#menu .w-menu-activator')).toBeEnabled();
  await expect(page.locator('#menu .w-menu-activator')).toHaveText('Workspace');
  await expect(page.locator('#menu .w-menu-activator')).toHaveAttribute('aria-expanded', 'false');
});

test('w-menu opens by click and keyboard, focuses items, and closes from content, escape, or outside', async ({ mount, page }) => {
  await mount(`
    <button id="outside">Outside</button>
    <w-menu id="menu" label="Actions">
      <button class="w-menu-item" role="menuitem">Profile</button>
      <button class="w-menu-item" role="menuitem">Settings</button>
    </w-menu>
  `);
  await recordEvents(page, '#menu', ['toggle', 'close']);

  await page.locator('#menu .w-menu-activator').click();
  await expect(page.locator('#menu')).toHaveAttribute('open', '');

  await page.locator('#menu .w-menu-activator').press('ArrowDown');
  await expect(page.locator('#menu [role="menuitem"]').filter({ hasText: 'Profile' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#menu [role="menuitem"]').filter({ hasText: 'Settings' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#menu')).not.toHaveAttribute('open', '');

  await page.locator('#menu .w-menu-activator').click();
  await page.locator('#menu [role="menuitem"]').filter({ hasText: 'Profile' }).click();
  await expect(page.locator('#menu')).not.toHaveAttribute('open', '');

  await page.locator('#menu .w-menu-activator').click();
  await page.locator('#outside').click();
  await expect(page.locator('#menu')).not.toHaveAttribute('open', '');

  expect((await readEvents(page, '#menu')).map((event) => event.type)).toEqual([
    'toggle',
    'toggle',
    'close',
    'toggle',
    'toggle',
    'close',
    'toggle',
    'toggle',
    'close',
  ]);
});

test('w-menu supports delayed open and persistent mode', async ({ mount, page }) => {
  await mount(`
    <button id="outside">Outside</button>
    <w-menu id="menu" label="Delayed" open-delay="80" persistent>
      <button class="w-menu-item" role="menuitem">Profile</button>
    </w-menu>
  `);

  await page.locator('#menu .w-menu-activator').click();
  await expect(page.locator('#menu')).not.toHaveAttribute('open', '');
  await expect.poll(async () => page.locator('#menu').getAttribute('open')).toBe('');

  await page.locator('#outside').click();
  await expect(page.locator('#menu')).toHaveAttribute('open', '');

  await page.locator('#menu').evaluate((el) => el.removeAttribute('persistent'));
  await page.locator('#outside').click();
  await expect(page.locator('#menu')).not.toHaveAttribute('open', '');
});
