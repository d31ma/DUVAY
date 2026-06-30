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
