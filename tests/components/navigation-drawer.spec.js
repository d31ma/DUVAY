import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-navigation-drawer exposes an accessible responsive drawer contract', async ({ mount, page }) => {
  await page.setViewportSize({ width: 800, height: 720 });
  await mount(`
    <w-navigation-drawer id="drawer" label="Project navigation">
      <a href="#overview">Overview</a>
    </w-navigation-drawer>
  `);
  await recordEvents(page, '#drawer', ['toggle', 'close']);

  await expect(page.locator('#drawer aside')).toHaveAttribute('aria-label', 'Project navigation');
  await expect(page.locator('#drawer aside')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('#drawer .w-navigation-drawer-scrim')).toBeHidden();

  await page.locator('#drawer').evaluate((element) => element.show());
  await expect(page.locator('#drawer')).toHaveAttribute('open', '');
  await expect(page.locator('#drawer aside')).toHaveAttribute('aria-hidden', 'false');
  await expect(page.locator('#drawer .w-navigation-drawer-scrim')).toBeVisible();

  await page.locator('#drawer .w-navigation-drawer-scrim').click();
  await expect(page.locator('#drawer')).not.toHaveAttribute('open', '');

  await page.locator('#drawer').evaluate((element) => element.toggle());
  await page.keyboard.press('Escape');
  await expect(page.locator('#drawer')).not.toHaveAttribute('open', '');

  expect(await readEvents(page, '#drawer')).toEqual([
    { type: 'toggle', detail: { open: true, reason: 'programmatic' } },
    { type: 'toggle', detail: { open: false, reason: 'scrim' } },
    { type: 'close', detail: { open: false, reason: 'scrim' } },
    { type: 'toggle', detail: { open: true, reason: 'toggle' } },
    { type: 'toggle', detail: { open: false, reason: 'escape' } },
    { type: 'close', detail: { open: false, reason: 'escape' } },
  ]);
});

test('w-navigation-drawer closes after compact navigation and keeps permanent drawers open', async ({ mount, page }) => {
  await page.setViewportSize({ width: 800, height: 720 });
  await mount(`
    <w-navigation-drawer id="temporary" open>
      <a id="destination" href="#destination">Destination</a>
    </w-navigation-drawer>
    <w-navigation-drawer id="permanent" permanent>
      <a href="#fixed">Fixed</a>
    </w-navigation-drawer>
  `);

  await page.locator('#destination').click();
  await expect(page.locator('#temporary')).not.toHaveAttribute('open', '');

  await expect(page.locator('#permanent')).toHaveAttribute('open', '');
  await expect(page.locator('#permanent aside')).toHaveAttribute('aria-hidden', 'false');
  await page.locator('#permanent').evaluate((element) => element.close());
  await expect(page.locator('#permanent')).toHaveAttribute('open', '');
});

test('w-app-bar-nav-icon toggles its target drawer and reflects expanded state', async ({ mount, page }) => {
  await page.setViewportSize({ width: 800, height: 720 });
  await mount(`
    <w-app-bar-nav-icon id="trigger" for="drawer"></w-app-bar-nav-icon>
    <w-navigation-drawer id="drawer">
      <a href="#overview">Overview</a>
    </w-navigation-drawer>
  `);

  await expect(page.locator('#trigger button')).toHaveAttribute('aria-controls', 'drawer');
  await expect(page.locator('#trigger button')).toHaveAttribute('aria-expanded', 'false');

  await page.locator('#trigger button').click();
  await expect(page.locator('#drawer')).toHaveAttribute('open', '');
  await expect(page.locator('#trigger button')).toHaveAttribute('aria-expanded', 'true');

  await page.locator('#drawer').evaluate((element) => element.close());
  await expect(page.locator('#trigger button')).toHaveAttribute('aria-expanded', 'false');
});

test('w-navigation-drawer width custom value', async ({ mount, page }) => {
  await page.setViewportSize({ width: 1200, height: 720 });
  await mount(`
    <w-navigation-drawer id="drawer" permanent width="320">
      <a href="#overview">Overview</a>
    </w-navigation-drawer>
  `);
  const drawer = page.locator('#drawer aside');
  await expect(drawer).toHaveCSS('--w-drawer-width', '320px');
});

test('w-navigation-drawer floating removes border', async ({ mount, page }) => {
  await page.setViewportSize({ width: 1200, height: 720 });
  await mount(`
    <w-navigation-drawer id="drawer" permanent floating>
      <a href="#overview">Overview</a>
    </w-navigation-drawer>
  `);
  const drawer = page.locator('#drawer aside');
  await expect(drawer).toHaveClass(/w-navigation-drawer--floating/);
  await expect(drawer).toHaveCSS('border-right-width', '0px');
});

test('w-navigation-drawer expand-on-hover expands rail', async ({ mount, page }) => {
  await page.setViewportSize({ width: 1200, height: 720 });
  await mount(`
    <w-navigation-drawer id="drawer" permanent rail expand-on-hover>
      <a href="#overview">Overview</a>
    </w-navigation-drawer>
  `);
  const drawer = page.locator('#drawer aside');
  await expect(drawer).toHaveClass(/w-navigation-drawer--expand-on-hover/);
  await expect(drawer).toHaveClass(/w-navigation-drawer--rail/);

  // Hover to expand
  await drawer.hover();
  await expect(drawer).toHaveClass(/w-navigation-drawer--rail-expanded/);
});

test('w-navigation-drawer scrim toggle', async ({ mount, page }) => {
  await page.setViewportSize({ width: 800, height: 720 });
  await mount(`
    <w-navigation-drawer id="drawer" open scrim>
      <a href="#overview">Overview</a>
    </w-navigation-drawer>
  `);
  const scrim = page.locator('#drawer .w-navigation-drawer-scrim');
  await expect(scrim).toBeVisible();

  await scrim.click();
  await expect(page.locator('#drawer')).not.toHaveAttribute('open', '');
});

test('w-navigation-drawer border variant', async ({ mount, page }) => {
  await page.setViewportSize({ width: 1200, height: 720 });
  await mount(`
    <w-navigation-drawer id="drawer" permanent border>
      <a href="#overview">Overview</a>
    </w-navigation-drawer>
  `);
  const drawer = page.locator('#drawer aside');
  await expect(drawer).toHaveClass(/w-navigation-drawer--border/);
});

test('w-navigation-drawer elevation', async ({ mount, page }) => {
  await page.setViewportSize({ width: 1200, height: 720 });
  await mount(`
    <w-navigation-drawer id="drawer" permanent elevation="4">
      <a href="#overview">Overview</a>
    </w-navigation-drawer>
  `);
  const drawer = page.locator('#drawer aside');
  await expect(drawer).toHaveClass(/\belevation-4\b/);
});

test('w-navigation-drawer color', async ({ mount, page }) => {
  await page.setViewportSize({ width: 1200, height: 720 });
  await mount(`
    <w-navigation-drawer id="drawer" permanent color="surface">
      <a href="#overview">Overview</a>
    </w-navigation-drawer>
  `);
  const drawer = page.locator('#drawer aside');
  const bgVar = await drawer.evaluate((el) => getComputedStyle(el).getPropertyValue('--w-drawer-bg').trim());
  const surface = await drawer.evaluate((el) => getComputedStyle(el).getPropertyValue('--w-surface').trim());
  expect(bgVar).toBe(surface);
});

test('w-navigation-drawer right location', async ({ mount, page }) => {
  await page.setViewportSize({ width: 800, height: 720 });
  await mount(`
    <w-navigation-drawer id="drawer" open temporary location="right">
      <a href="#overview">Overview</a>
    </w-navigation-drawer>
  `);
  const drawer = page.locator('#drawer aside');
  await expect(drawer).toHaveClass(/w-navigation-drawer--right/);
});

test('w-navigation-drawer name, order, absolute and sticky reach the rendered panel', async ({ mount, page }) => {
  await page.setViewportSize({ width: 1200, height: 720 });
  await mount(`
    <div style="position: relative; display: flex">
      <w-navigation-drawer id="abs" permanent name="primary" order="3" absolute>
        <a href="#a">A</a>
      </w-navigation-drawer>
      <w-navigation-drawer id="stuck" permanent sticky>
        <a href="#b">B</a>
      </w-navigation-drawer>
    </div>
  `);

  await expect(page.locator('#abs aside')).toHaveAttribute('data-name', 'primary');
  await expect(page.locator('#abs aside')).toHaveCSS('order', '3');
  await expect(page.locator('#abs aside')).toHaveCSS('position', 'absolute');
  await expect(page.locator('#stuck aside')).toHaveClass(/w-navigation-drawer--sticky/);
  await expect(page.locator('#stuck aside')).toHaveCSS('position', 'sticky');
});

test('w-navigation-drawer image paints a background and rail-width sizes the rail', async ({ mount, page }) => {
  await page.setViewportSize({ width: 1200, height: 720 });
  await mount(`
    <w-navigation-drawer id="drawer" permanent rail rail-width="88" image="https://example.com/bg.jpg">
      <a href="#a">A</a>
    </w-navigation-drawer>
  `);

  const drawer = page.locator('#drawer aside');
  await expect(drawer).toHaveClass(/w-navigation-drawer--image/);
  await expect(drawer).toHaveCSS('--w-drawer-image', 'url(https://example.com/bg.jpg)');
  await expect(drawer).toHaveCSS('background-image', 'url("https://example.com/bg.jpg")');
  await expect(drawer).toHaveCSS('--w-drawer-rail-width', '88px');
  await expect(drawer).toHaveCSS('width', '88px');
});

test('w-navigation-drawer persistent refuses the scrim and Escape', async ({ mount, page }) => {
  await page.setViewportSize({ width: 800, height: 720 });
  await mount(`
    <w-navigation-drawer id="drawer" open persistent>
      <a href="#a">A</a>
    </w-navigation-drawer>
  `);

  await page.locator('#drawer .w-navigation-drawer-scrim').click();
  await expect(page.locator('#drawer')).toHaveAttribute('open', '');

  await page.keyboard.press('Escape');
  await expect(page.locator('#drawer')).toHaveAttribute('open', '');
});

test('w-navigation-drawer mobile forces compact navigation closing on a wide viewport', async ({ mount, page }) => {
  await page.setViewportSize({ width: 1400, height: 720 });
  await mount(`
    <w-navigation-drawer id="mobile" open mobile>
      <a id="mobile-link" href="#a">A</a>
    </w-navigation-drawer>
    <w-navigation-drawer id="desktop" open>
      <a id="desktop-link" href="#b">B</a>
    </w-navigation-drawer>
  `);

  await expect(page.locator('#mobile aside')).toHaveClass(/w-navigation-drawer--mobile/);
  await page.locator('#desktop-link').click();
  await expect(page.locator('#desktop')).toHaveAttribute('open', '');

  await page.locator('#mobile-link').click();
  await expect(page.locator('#mobile')).not.toHaveAttribute('open', '');
});

test('w-navigation-drawer disable-route-watcher keeps the drawer open on navigation', async ({ mount, page }) => {
  await page.setViewportSize({ width: 800, height: 720 });
  await mount(`
    <w-navigation-drawer id="drawer" open disable-route-watcher>
      <a id="link" href="#a">A</a>
    </w-navigation-drawer>
  `);

  await page.locator('#link').click();
  await expect(page.locator('#drawer')).toHaveAttribute('open', '');
});

test('w-navigation-drawer reopens on resize unless the watcher is disabled', async ({ mount, page }) => {
  await page.setViewportSize({ width: 700, height: 720 });
  await mount(`
    <w-navigation-drawer id="watched"><a href="#a">A</a></w-navigation-drawer>
    <w-navigation-drawer id="frozen" disable-resize-watcher><a href="#b">B</a></w-navigation-drawer>
  `);

  await expect(page.locator('#watched')).not.toHaveAttribute('open', '');

  await page.setViewportSize({ width: 1400, height: 720 });
  await expect(page.locator('#watched')).toHaveAttribute('open', '');
  await expect(page.locator('#frozen')).not.toHaveAttribute('open', '');

  await page.setViewportSize({ width: 700, height: 720 });
  await expect(page.locator('#watched')).not.toHaveAttribute('open', '');
});

test('w-navigation-drawer mobile-breakpoint moves the compact threshold', async ({ mount, page }) => {
  await page.setViewportSize({ width: 1400, height: 720 });
  await mount(`
    <w-navigation-drawer id="wide" open mobile-breakpoint="sm"><a href="#a">A</a></w-navigation-drawer>
    <w-navigation-drawer id="default" open><a href="#b">B</a></w-navigation-drawer>
  `);

  // 900px is above the `sm` (600px) threshold but below the 1024px default, so
  // only the default drawer crosses into mobile and closes itself.
  await page.setViewportSize({ width: 900, height: 720 });
  await expect(page.locator('#default')).not.toHaveAttribute('open', '');
  await expect(page.locator('#wide')).toHaveAttribute('open', '');
});

test('w-navigation-drawer open-delay and close-delay time the rail expansion', async ({ mount, page }) => {
  await page.setViewportSize({ width: 1200, height: 720 });
  await mount(`
    <w-navigation-drawer id="drawer" permanent rail expand-on-hover open-delay="80" close-delay="80">
      <a href="#a">A</a>
    </w-navigation-drawer>
  `);

  const drawer = page.locator('#drawer aside');
  await drawer.dispatchEvent('mouseenter');
  await expect(drawer).not.toHaveClass(/w-navigation-drawer--rail-expanded/);
  await expect(drawer).toHaveClass(/w-navigation-drawer--rail-expanded/, { timeout: 2000 });

  await drawer.dispatchEvent('mouseleave');
  await expect(drawer).toHaveClass(/w-navigation-drawer--rail-expanded/);
  await expect(drawer).not.toHaveClass(/w-navigation-drawer--rail-expanded/, { timeout: 2000 });
});

test('w-navigation-drawer retain-focus keeps Tab inside the panel', async ({ mount, page }) => {
  await page.setViewportSize({ width: 800, height: 720 });
  await mount(`
    <w-navigation-drawer id="drawer" open retain-focus>
      <a id="first" href="#a">A</a>
      <a id="last" href="#b">B</a>
    </w-navigation-drawer>
    <button id="after">After</button>
  `);

  await page.locator('#last').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#first')).toBeFocused();

  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#last')).toBeFocused();
});

test('w-navigation-drawer swipes closed unless touchless is set', async ({ mount, page }) => {
  await page.setViewportSize({ width: 800, height: 720 });
  await mount(`
    <w-navigation-drawer id="drawer" open temporary><a href="#a">A</a></w-navigation-drawer>
    <w-navigation-drawer id="locked" open temporary touchless><a href="#b">B</a></w-navigation-drawer>
  `);

  const swipe = (selector) => page.locator(selector).evaluate((el) => {
    const at = (clientX) => new Touch({ identifier: 1, target: el, clientX, clientY: 120 });
    el.dispatchEvent(new TouchEvent('touchstart', { changedTouches: [at(220)], bubbles: true }));
    el.dispatchEvent(new TouchEvent('touchend', { changedTouches: [at(40)], bubbles: true }));
  });

  await swipe('#locked aside');
  await expect(page.locator('#locked')).toHaveAttribute('open', '');

  await swipe('#drawer aside');
  await expect(page.locator('#drawer')).not.toHaveAttribute('open', '');
});

test('w-navigation-drawer detaches its document and window listeners on unmount', async ({ mount, page }) => {
  await page.setViewportSize({ width: 800, height: 720 });
  await mount(`
    <w-navigation-drawer id="drawer" open expand-on-hover rail><a href="#a">A</a></w-navigation-drawer>
  `);
  await expect(page.locator('#drawer aside')).toBeVisible();

  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));

  await mount('<p id="after-unmount">Unmounted</p>');
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 1200, height: 720 });

  await expect(page.locator('#after-unmount')).toBeVisible();
  expect(errors).toEqual([]);
});
