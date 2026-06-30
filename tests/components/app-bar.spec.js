import { expect, test } from '../setup/component-test.js';

test('w-app-bar sticky pins the host while preserving its document space', async ({ mount, page }) => {
  await mount(`
    <w-app-bar id="bar" sticky title="DuVay">
      <w-btn>Docs</w-btn>
    </w-app-bar>
    <div style="height: 1400px"></div>
  `);

  const host = page.locator('#bar');
  const bar = page.locator('#bar > .w-app-bar');

  await expect(host).toHaveCSS('position', 'sticky');
  await expect(host).toHaveCSS('top', '0px');
  await expect(host).toHaveCSS('z-index', '10');
  await expect(bar).toHaveCSS('position', 'relative');
  await expect(bar).toContainText('DuVay');
  await expect(bar).toContainText('Docs');

  await page.evaluate(() => window.scrollTo(0, 500));
  const top = await host.evaluate((element) => Math.round(element.getBoundingClientRect().top));
  expect(top).toBe(0);
  await expect(host).toHaveAttribute('data-scrolled', '');
  await expect(bar).toHaveClass(/w-app-bar--scrolled/);
  await expect(bar).not.toHaveCSS('backdrop-filter', 'none');

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(host).not.toHaveAttribute('data-scrolled');
  await expect(bar).not.toHaveClass(/w-app-bar--scrolled/);
});

test('w-app-bar density variants', async ({ mount, page }) => {
  await mount(`
    <w-app-bar id="prom" density="prominent">Prominent</w-app-bar>
    <w-app-bar id="comf" density="comfortable">Comfortable</w-app-bar>
    <w-app-bar id="comp" density="compact">Compact</w-app-bar>
  `);

  await expect(page.locator('#prom > .w-app-bar')).toHaveClass(/w-app-bar--prominent/);
  await expect(page.locator('#comf > .w-app-bar')).toHaveClass(/w-app-bar--comfortable/);
  await expect(page.locator('#comp > .w-app-bar')).toHaveClass(/w-app-bar--compact/);
});

test('w-app-bar flat removes elevation', async ({ mount, page }) => {
  await mount(`<w-app-bar id="bar" flat elevation="4">Flat</w-app-bar>`);
  const bar = page.locator('#bar > .w-app-bar');
  await expect(bar).toHaveClass(/w-app-bar--flat/);
  await expect(bar).not.toHaveClass(/\belevation-4\b/);
});

test('w-app-bar color and bg-color', async ({ mount, page }) => {
  await mount(`<w-app-bar id="bar" color="primary" bg-color="surface">Colored</w-app-bar>`);
  const bar = page.locator('#bar > .w-app-bar');
  const colorVar = await bar.evaluate((el) => getComputedStyle(el).getPropertyValue('--w-app-bar-color').trim());
  const primary = await bar.evaluate((el) => getComputedStyle(el).getPropertyValue('--w-primary').trim());
  expect(colorVar).toBe(primary);
  const bgVar = await bar.evaluate((el) => getComputedStyle(el).getPropertyValue('--w-app-bar-bg').trim());
  const surface = await bar.evaluate((el) => getComputedStyle(el).getPropertyValue('--w-surface').trim());
  expect(bgVar).toBe(surface);
});

test('w-app-bar extended with extension slot', async ({ mount, page }) => {
  await mount(`
    <w-app-bar id="bar" extended extension-height="64">
      <span slot="extension">Extension Content</span>
    </w-app-bar>
  `);
  const bar = page.locator('#bar > .w-app-bar');
  const ext = page.locator('#bar > .w-app-bar-extension');
  await expect(ext).toBeVisible();
  await expect(ext).toContainText('Extension Content');
});

test('w-app-bar location bottom', async ({ mount, page }) => {
  await mount(`<w-app-bar id="bar" location="bottom">Bottom</w-app-bar>`);
  const bar = page.locator('#bar > .w-app-bar');
  await expect(bar).toHaveClass(/w-app-bar--bottom/);
  await expect(bar).toHaveCSS('position', 'fixed');
  await expect(bar).toHaveCSS('bottom', '0px');
});

test('w-app-bar scroll-behavior hide', async ({ mount, page }) => {
  await mount(`
    <w-app-bar id="bar" scroll-behavior="hide" scroll-threshold="10">Hide</w-app-bar>
    <div style="height: 1400px"></div>
  `);
  const bar = page.locator('#bar > .w-app-bar');
  await expect(bar).not.toHaveClass(/w-app-bar--hidden/);

  await page.evaluate(() => window.scrollTo(0, 20));
  await expect(bar).toHaveClass(/w-app-bar--hidden/);

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(bar).not.toHaveClass(/w-app-bar--hidden/);
});

test('w-app-bar scroll-behavior elevate', async ({ mount, page }) => {
  await mount(`
    <w-app-bar id="bar" scroll-behavior="elevate" scroll-threshold="10">Elevate</w-app-bar>
    <div style="height: 1400px"></div>
  `);
  const bar = page.locator('#bar > .w-app-bar');

  await page.evaluate(() => window.scrollTo(0, 20));
  await expect(bar).toHaveClass(/w-app-bar--scrolled/);

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(bar).not.toHaveClass(/w-app-bar--scrolled/);
});

test('w-app-bar scroll-behavior collapse', async ({ mount, page }) => {
  await mount(`
    <w-app-bar id="bar" scroll-behavior="collapse" scroll-threshold="10">Collapse</w-app-bar>
    <div style="height: 1400px"></div>
  `);
  const bar = page.locator('#bar > .w-app-bar');

  await page.evaluate(() => window.scrollTo(0, 20));
  await expect(bar).toHaveClass(/w-app-bar--collapsed/);

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(bar).not.toHaveClass(/w-app-bar--collapsed/);
});

test('w-app-bar image background', async ({ mount, page }) => {
  await mount(`<w-app-bar id="bar" image="https://example.com/bg.jpg">Image</w-app-bar>`);
  const bar = page.locator('#bar > .w-app-bar');
  await expect(bar).toHaveClass(/w-app-bar--image/);
  await expect(bar).toHaveCSS('--w-app-bar-image', 'url(https://example.com/bg.jpg)');
});

test('w-app-bar border and rounded', async ({ mount, page }) => {
  await mount(`<w-app-bar id="bar" border rounded="lg">Styled</w-app-bar>`);
  const bar = page.locator('#bar > .w-app-bar');
  await expect(bar).toHaveClass(/w-app-bar--border/);
  await expect(bar).toHaveClass(/\brounded-lg\b/);
});

test('w-app-bar height custom value', async ({ mount, page }) => {
  await mount(`<w-app-bar id="bar" height="80">Tall</w-app-bar>`);
  const bar = page.locator('#bar > .w-app-bar');
  await expect(bar).toHaveCSS('--w-app-bar-height', '80px');
});

test('w-app-bar emits scroll event', async ({ mount, page }) => {
  await mount(`
    <w-app-bar id="bar" scroll-behavior="elevate" scroll-threshold="5">Event</w-app-bar>
    <div style="height: 1400px"></div>
  `);

  await page.evaluate(() => {
    window.scrollEvents = [];
    document.querySelector('#bar').addEventListener('scroll', (e) => {
      window.scrollEvents.push(e.detail);
    });
  });

  await page.evaluate(() => window.scrollTo(0, 10));
  await page.waitForTimeout(50);

  const events = await page.evaluate(() => window.scrollEvents);
  expect(events.length).toBeGreaterThan(0);
  expect(events[0]).toMatchObject({ scrolled: true, behavior: 'elevate' });
});
