import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-dropdown-menu reflects attrs, opens by click and keyboard, and respects disabled', async ({ mount, page }) => {
  await mount('<w-dropdown-menu id="menu" label="Workspace" side="top-end" inline><button role="menuitem">Profile</button><button role="menuitem">Settings</button></w-dropdown-menu>');
  await recordEvents(page, '#menu', ['toggle', 'close']);

  await expect(page.locator('#menu .w-dropdown-menu')).toHaveClass(/w-dropdown-menu--top-end/);
  await expect(page.locator('#menu .w-dropdown-menu')).toHaveClass(/w-dropdown-menu--inline/);
  await expect(page.locator('#menu .w-dropdown-menu-trigger')).toHaveText('Workspace');

  await page.locator('#menu .w-dropdown-menu-trigger').click();
  await expect(page.locator('#menu')).toHaveAttribute('open', '');
  await page.locator('#menu .w-dropdown-menu-trigger').press('ArrowDown');
  await expect(page.locator('#menu [role="menuitem"]').filter({ hasText: 'Profile' })).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.locator('#menu [role="menuitem"]').filter({ hasText: 'Settings' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#menu')).not.toHaveAttribute('open', '');

  await page.locator('#menu .w-dropdown-menu-trigger').click();
  await page.locator('#menu .w-dropdown-menu-trigger').press('Enter');
  await expect(page.locator('#menu')).not.toHaveAttribute('open', '');

  await page.locator('#menu').evaluate((el) => el.setAttribute('disabled', ''));
  await expect(page.locator('#menu .w-dropdown-menu-trigger')).toBeDisabled();
  expect((await readEvents(page, '#menu')).map((event) => event.type)).toEqual([
    'toggle',
    'toggle',
    'close',
    'toggle',
    'toggle',
    'close',
  ]);
});

test('w-dropdown-menu supports outside close, content click persistence, and delayed open', async ({ mount, page }) => {
  await mount(`
    <button id="outside">Outside</button>
    <w-dropdown-menu id="menu" label="Workspace" open-delay="80" close-on-content-click="false">
      <button role="menuitem">Profile</button>
    </w-dropdown-menu>
  `);

  await page.locator('#menu .w-dropdown-menu-trigger').click();
  await expect(page.locator('#menu')).not.toHaveAttribute('open', '');
  await expect.poll(async () => page.locator('#menu').getAttribute('open')).toBe('');

  await page.locator('#menu [role="menuitem"]').click();
  await expect(page.locator('#menu')).toHaveAttribute('open', '');

  await page.locator('#outside').click();
  await expect(page.locator('#menu')).not.toHaveAttribute('open', '');
});

test('w-dropdown-menu closes when Tab leaves the content and cycles items with ArrowUp/Home', async ({ mount, page }) => {
  await mount(`
    <w-dropdown-menu id="menu" label="Workspace">
      <button role="menuitem">Profile</button>
      <button role="menuitem">Settings</button>
    </w-dropdown-menu>
    <button id="after">After</button>
  `);

  await page.locator('#menu .w-dropdown-menu-trigger').focus();
  await page.keyboard.press('ArrowUp');
  await expect(page.locator('#menu')).toHaveAttribute('open', '');
  await expect(page.locator('#menu [role="menuitem"]').filter({ hasText: 'Settings' })).toBeFocused();

  await page.keyboard.press('ArrowUp');
  await expect(page.locator('#menu [role="menuitem"]').filter({ hasText: 'Profile' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#menu [role="menuitem"]').filter({ hasText: 'Settings' })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(page.locator('#menu [role="menuitem"]').filter({ hasText: 'Profile' })).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(page.locator('#menu')).not.toHaveAttribute('open', '');
  await expect(page.locator('#menu .w-dropdown-menu')).not.toHaveClass(/open/);
});

test('w-dropdown-menu submenu opens with ArrowRight and ArrowLeft returns focus to the trigger', async ({ mount, page }) => {
  await mount(`
    <w-dropdown-menu id="menu" submenu label="More">
      <button role="menuitem">Archive</button>
      <button role="menuitem">Delete</button>
    </w-dropdown-menu>
  `);
  await recordEvents(page, '#menu', ['toggle', 'close']);

  await expect(page.locator('#menu .w-dropdown-menu')).toHaveClass(/w-dropdown-menu--submenu/);
  await expect(page.locator('#menu .w-dropdown-menu')).toHaveClass(/w-dropdown-menu--end/);

  await page.locator('#menu .w-dropdown-menu-trigger').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#menu')).toHaveAttribute('open', '');
  await expect(page.locator('#menu [role="menuitem"]').filter({ hasText: 'Archive' })).toBeFocused();

  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#menu')).not.toHaveAttribute('open', '');
  await expect(page.locator('#menu .w-dropdown-menu-trigger')).toBeFocused();

  expect((await readEvents(page, '#menu')).map((event) => event.type)).toEqual([
    'toggle',
    'toggle',
    'close',
  ]);
});
