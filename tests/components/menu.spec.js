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

test('w-menu closes when Tab leaves the content and cycles items with ArrowUp/Home', async ({ mount, page }) => {
  await mount(`
    <w-menu id="menu" label="Actions">
      <button class="w-menu-item" role="menuitem">Profile</button>
      <button class="w-menu-item" role="menuitem">Settings</button>
    </w-menu>
    <button id="after">After</button>
  `);

  await page.locator('#menu .w-menu-activator').focus();
  await page.keyboard.press('ArrowUp');
  await expect(page.locator('#menu')).toHaveAttribute('open', '');
  await expect(page.locator('#menu [role="menuitem"]').filter({ hasText: 'Settings' })).toBeFocused();

  await page.keyboard.press('ArrowUp');
  await expect(page.locator('#menu [role="menuitem"]').filter({ hasText: 'Profile' })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(page.locator('#menu [role="menuitem"]').filter({ hasText: 'Profile' })).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(page.locator('#menu')).not.toHaveAttribute('open', '');
  await expect(page.locator('#menu .w-menu')).not.toHaveClass(/open/);
});

test('w-menu submenu opens with ArrowRight and ArrowLeft returns focus to the activator', async ({ mount, page }) => {
  await mount(`
    <w-menu id="menu" submenu label="More">
      <button class="w-menu-item" role="menuitem">Archive</button>
      <button class="w-menu-item" role="menuitem">Delete</button>
    </w-menu>
  `);
  await recordEvents(page, '#menu', ['toggle', 'close']);

  await expect(page.locator('#menu .w-menu')).toHaveClass(/w-menu--submenu/);
  await expect(page.locator('#menu .w-menu')).toHaveClass(/w-menu--end/);

  await page.locator('#menu .w-menu-activator').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#menu')).toHaveAttribute('open', '');
  await expect(page.locator('#menu [role="menuitem"]').filter({ hasText: 'Archive' })).toBeFocused();

  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#menu')).not.toHaveAttribute('open', '');
  await expect(page.locator('#menu .w-menu-activator')).toBeFocused();

  expect((await readEvents(page, '#menu')).map((event) => event.type)).toEqual([
    'toggle',
    'toggle',
    'close',
  ]);
});

test('w-menu scrim renders a dismissible backdrop with a colour and opacity', async ({ mount, page }) => {
  await mount(`
    <w-menu id="menu" label="Actions" open scrim="primary" opacity="0.4">
      <button class="w-menu-item" role="menuitem">Profile</button>
    </w-menu>
  `);

  const scrim = page.locator('#menu .w-menu-scrim');
  await expect(scrim).toBeVisible();
  await expect(scrim).toHaveCSS('--w-menu-scrim-opacity', '40%');
  const color = await scrim.evaluate((el) => getComputedStyle(el).getPropertyValue('--w-menu-scrim-color').trim());
  const primary = await scrim.evaluate((el) => getComputedStyle(el).getPropertyValue('--w-primary').trim());
  expect(color).toBe(primary);

  await scrim.click();
  await expect(page.locator('#menu')).not.toHaveAttribute('open', '');
  await expect(page.locator('#menu .w-menu-scrim')).toHaveCount(0);
});

test('w-menu content-class, z-index, origin and contained shape the surface', async ({ mount, page }) => {
  await mount(`
    <div style="width: 240px">
      <w-menu id="menu" label="Actions" open content-class="promo" z-index="80" origin="top-left" contained>
        <button class="w-menu-item" role="menuitem">Profile</button>
      </w-menu>
    </div>
  `);

  const content = page.locator('#menu .w-menu-content');
  await expect(content).toHaveClass(/\bpromo\b/);
  await expect(content).toHaveCSS('z-index', '80');
  await expect(content).toHaveCSS('transform-origin', '0px 0px');
  await expect(page.locator('#menu .w-menu')).toHaveClass(/w-menu--contained/);

  // `contained` clamps the rendered surface to the offset parent, so it can no
  // longer spill past the activator the way the default 180px floor does.
  const widths = await page.locator('#menu .w-menu').evaluate((root) => ({
    root: root.getBoundingClientRect().width,
    content: root.querySelector('.w-menu-content').getBoundingClientRect().width,
  }));
  expect(widths.content).toBeLessThanOrEqual(widths.root + 1);
  expect(widths.root).toBeLessThan(180);
});

test('w-menu viewport-margin caps the surface against the viewport', async ({ mount, page }) => {
  await page.setViewportSize({ width: 1000, height: 720 });
  await mount(`
    <w-menu id="menu" label="Actions" open viewport-margin="120">
      <button class="w-menu-item" role="menuitem">Profile</button>
    </w-menu>
  `);

  await expect(page.locator('#menu .w-menu-content')).toHaveCSS('max-width', '760px');
});

test('w-menu offset increases the distance from the activator', async ({ mount, page }) => {
  await mount(`
    <w-menu id="menu" label="Actions" open offset="18,6">
      <button class="w-menu-item" role="menuitem">Profile</button>
    </w-menu>
  `);

  const content = page.locator('#menu .w-menu-content');
  await expect(page.locator('#menu .w-menu')).toHaveClass(/w-menu--offset/);
  await expect(content).toHaveCSS('margin-top', '18px');
  await expect(content).toHaveCSS('margin-left', '6px');
});

test('w-menu target anchors the surface and stick-to-target keeps it in page space', async ({ mount, page }) => {
  await mount(`
    <div id="anchor" style="position: absolute; left: 140px; top: 260px; width: 40px; height: 24px">A</div>
    <w-menu id="fixed" label="Fixed" open target="#anchor">
      <button class="w-menu-item" role="menuitem">Profile</button>
    </w-menu>
    <w-menu id="stuck" label="Stuck" open target="#anchor" stick-to-target>
      <button class="w-menu-item" role="menuitem">Profile</button>
    </w-menu>
  `);

  const content = page.locator('#fixed .w-menu-content');
  await expect(content).toHaveCSS('position', 'fixed');
  const box = await content.boundingBox();
  expect(Math.round(box.x)).toBe(140);
  expect(Math.round(box.y)).toBe(284);

  await expect(page.locator('#stuck .w-menu-content')).toHaveCSS('position', 'absolute');
});

test('w-menu transition selects a named animation and none removes it', async ({ mount, page }) => {
  await mount(`
    <w-menu id="plain" label="None" transition="none">
      <button class="w-menu-item" role="menuitem">Profile</button>
    </w-menu>
    <w-menu id="scaled" label="Scale" transition="scale">
      <button class="w-menu-item" role="menuitem">Profile</button>
    </w-menu>
  `);

  await expect(page.locator('#plain .w-menu')).toHaveClass(/w-menu--no-transition/);
  await expect(page.locator('#plain .w-menu-content')).toHaveCSS('transition-duration', '0s');
  await expect(page.locator('#scaled .w-menu-content')).toHaveCSS('transform', 'matrix(0.96, 0, 0, 0.96, 0, 0)');

  await page.locator('#scaled').evaluate((el) => el.setAttribute('open', ''));
  await expect(page.locator('#scaled .w-menu-content')).toHaveCSS('transform', 'none');
});

test('w-menu open-on-click can be switched off while hover and focus opt in', async ({ mount, page }) => {
  await mount(`
    <w-menu id="menu" label="Actions" open-on-click="false">
      <button class="w-menu-item" role="menuitem">Profile</button>
    </w-menu>
  `);

  await page.locator('#menu .w-menu-activator').click();
  await expect(page.locator('#menu')).not.toHaveAttribute('open', '');

  await mount(`
    <w-menu id="hover" label="Actions" open-on-hover>
      <button class="w-menu-item" role="menuitem">Profile</button>
    </w-menu>
  `);
  await page.locator('#hover .w-menu-activator').dispatchEvent('mouseenter');
  await expect(page.locator('#hover')).toHaveAttribute('open', '');

  await mount(`
    <w-menu id="focus" label="Actions" open-on-focus open-on-click="false">
      <button class="w-menu-item" role="menuitem">Profile</button>
    </w-menu>
  `);
  await page.locator('#focus .w-menu-activator').focus();
  await expect(page.locator('#focus')).toHaveAttribute('open', '');
});

test('w-menu retain-focus keeps Tab inside the surface and disable-initial-focus skips the focus move', async ({ mount, page }) => {
  await mount(`
    <w-menu id="menu" label="Actions" retain-focus>
      <button class="w-menu-item" role="menuitem">Profile</button>
      <button class="w-menu-item" role="menuitem">Settings</button>
    </w-menu>
    <button id="after">After</button>
  `);

  await page.locator('#menu .w-menu-activator').click();
  await expect(page.locator('#menu [role="menuitem"]').filter({ hasText: 'Profile' })).toBeFocused();

  await page.locator('#menu [role="menuitem"]').filter({ hasText: 'Settings' }).focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#menu')).toHaveAttribute('open', '');
  await expect(page.locator('#menu [role="menuitem"]').filter({ hasText: 'Profile' })).toBeFocused();

  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#menu [role="menuitem"]').filter({ hasText: 'Settings' })).toBeFocused();

  await mount(`
    <w-menu id="quiet" label="Actions" capture-focus disable-initial-focus>
      <button class="w-menu-item" role="menuitem">Profile</button>
    </w-menu>
  `);
  await page.locator('#quiet .w-menu-activator').click();
  await expect(page.locator('#quiet')).toHaveAttribute('open', '');
  await expect(page.locator('#quiet [role="menuitem"]')).not.toBeFocused();
});

test('w-menu persistent bounces on dismissal unless no-click-animation is set', async ({ mount, page }) => {
  await mount(`
    <button id="outside">Outside</button>
    <w-menu id="menu" label="Actions" open persistent>
      <button class="w-menu-item" role="menuitem">Profile</button>
    </w-menu>
  `);

  await page.locator('#outside').click();
  await expect(page.locator('#menu')).toHaveAttribute('open', '');
  await expect(page.locator('#menu .w-menu-content')).toHaveClass(/w-menu-content--bounce/);

  await mount(`
    <button id="quiet-outside">Outside</button>
    <w-menu id="quiet" label="Actions" open persistent no-click-animation>
      <button class="w-menu-item" role="menuitem">Profile</button>
    </w-menu>
  `);

  await page.locator('#quiet-outside').click();
  await expect(page.locator('#quiet')).toHaveAttribute('open', '');
  await expect(page.locator('#quiet .w-menu-content')).not.toHaveClass(/w-menu-content--bounce/);
});

test('w-menu close-on-back closes when the browser goes back', async ({ mount, page }) => {
  await mount(`
    <w-menu id="menu" label="Actions" close-on-back>
      <button class="w-menu-item" role="menuitem">Profile</button>
    </w-menu>
  `);

  await page.locator('#menu .w-menu-activator').click();
  await expect(page.locator('#menu')).toHaveAttribute('open', '');

  await page.evaluate(() => history.back());
  await expect.poll(() => page.locator('#menu').getAttribute('open')).toBe(null);
});
