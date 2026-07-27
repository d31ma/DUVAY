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

test('w-app-bar absolute and floating change how the bar is laid out', async ({ mount, page }) => {
  await mount(`
    <div style="position: relative; height: 200px">
      <w-app-bar id="abs" absolute>Absolute</w-app-bar>
    </div>
    <w-app-bar id="floats" floating>Floating</w-app-bar>
  `);

  await expect(page.locator('#abs > .w-app-bar')).toHaveClass(/w-app-bar--absolute/);
  await expect(page.locator('#abs > .w-app-bar')).toHaveCSS('position', 'absolute');

  const floating = page.locator('#floats > .w-app-bar');
  await expect(floating).toHaveClass(/w-app-bar--floating/);
  await expect(floating).toHaveCSS('display', 'inline-flex');
  const widths = await floating.evaluate((el) => ({
    bar: el.getBoundingClientRect().width,
    host: el.parentElement.getBoundingClientRect().width,
  }));
  expect(widths.bar).toBeLessThan(widths.host);
});

test('w-app-bar name and order reach the rendered header', async ({ mount, page }) => {
  await mount(`<w-app-bar id="bar" name="primary" order="2">Named</w-app-bar>`);

  await expect(page.locator('#bar > .w-app-bar')).toHaveAttribute('data-name', 'primary');
  await expect(page.locator('#bar > .w-app-bar')).toHaveCSS('order', '2');
});

test('w-app-bar collapse-position attaches the collapsed bar to the chosen side', async ({ mount, page }) => {
  await mount(`
    <w-app-bar id="start" collapse>Start</w-app-bar>
    <w-app-bar id="end" collapse collapse-position="end">End</w-app-bar>
  `);

  await expect(page.locator('#start > .w-app-bar')).not.toHaveClass(/w-app-bar--collapse-end/);
  await expect(page.locator('#end > .w-app-bar')).toHaveClass(/w-app-bar--collapse-end/);

  const offsets = await page.evaluate(() => ({
    start: document.querySelector('#start > .w-app-bar').getBoundingClientRect().left,
    end: document.querySelector('#end > .w-app-bar').getBoundingClientRect().left,
  }));
  expect(offsets.end).toBeGreaterThan(offsets.start);
});

test('w-app-bar scroll-target watches a scrolling element instead of the window', async ({ mount, page }) => {
  await mount(`
    <div id="scroller" style="height: 160px; overflow: auto">
      <w-app-bar id="bar" scroll-behavior="elevate" scroll-threshold="10" scroll-target="#scroller">Scoped</w-app-bar>
      <div style="height: 900px"></div>
    </div>
    <div style="height: 1600px"></div>
  `);

  const bar = page.locator('#bar > .w-app-bar');
  await expect(bar).not.toHaveClass(/w-app-bar--scrolled/);

  // Scrolling the window must not move a bar that watches a scoped element.
  await page.evaluate(() => window.scrollTo(0, 400));
  await expect(bar).not.toHaveClass(/w-app-bar--scrolled/);

  await page.evaluate(() => {
    const scroller = document.querySelector('#scroller');
    scroller.scrollTop = 120;
  });
  await expect(bar).toHaveClass(/w-app-bar--scrolled/);
});

// <w-toolbar> is the app bar's sibling surface and shares the same set of
// Vuetify layout props, so its coverage lives alongside the app bar's.
test('w-toolbar renders a title and the flat, absolute and floating variants', async ({ mount, page }) => {
  await mount(`
    <w-toolbar id="plain" title="Inbox"><button>Action</button></w-toolbar>
    <w-toolbar id="flat" flat></w-toolbar>
    <div style="position: relative; height: 160px"><w-toolbar id="abs" absolute></w-toolbar></div>
    <w-toolbar id="floats" floating></w-toolbar>
  `);

  await expect(page.locator('#plain .w-toolbar-title')).toHaveText('Inbox');
  await expect(page.locator('#plain .w-toolbar')).toContainText('Action');

  await expect(page.locator('#flat .w-toolbar')).toHaveClass(/w-toolbar--flat/);
  await expect(page.locator('#flat .w-toolbar')).toHaveCSS('border-bottom-color', 'rgba(0, 0, 0, 0)');

  await expect(page.locator('#abs .w-toolbar')).toHaveCSS('position', 'absolute');
  await expect(page.locator('#floats .w-toolbar')).toHaveCSS('display', 'inline-flex');
});

test('w-toolbar image, collapse and collapse-position shape the bar', async ({ mount, page }) => {
  await mount(`
    <w-toolbar id="pic" image="https://example.com/bar.jpg"></w-toolbar>
    <w-toolbar id="start" collapse></w-toolbar>
    <w-toolbar id="end" collapse collapse-position="end"></w-toolbar>
  `);

  await expect(page.locator('#pic .w-toolbar')).toHaveClass(/w-toolbar--image/);
  await expect(page.locator('#pic .w-toolbar')).toHaveCSS('background-image', 'url("https://example.com/bar.jpg")');

  await expect(page.locator('#start .w-toolbar')).toHaveClass(/w-toolbar--collapse/);
  await expect(page.locator('#end .w-toolbar')).toHaveClass(/w-toolbar--collapse-end/);

  const offsets = await page.evaluate(() => ({
    start: document.querySelector('#start .w-toolbar').getBoundingClientRect().left,
    end: document.querySelector('#end .w-toolbar').getBoundingClientRect().left,
  }));
  expect(offsets.end).toBeGreaterThan(offsets.start);
});

test('w-toolbar extended reveals the extension slot at the requested height', async ({ mount, page }) => {
  await mount(`
    <w-toolbar id="bar" extended extension-height="72">
      <span slot="extension" id="extra">Tabs</span>
    </w-toolbar>
    <w-toolbar id="plain">
      <span slot="extension">Hidden</span>
    </w-toolbar>
  `);

  const extension = page.locator('#bar > .w-toolbar-extension');
  await expect(extension).toBeVisible();
  await expect(extension).toContainText('Tabs');
  await expect(extension).toHaveCSS('--w-toolbar-extension-height', '72px');
  expect((await extension.boundingBox()).height).toBeGreaterThanOrEqual(72);

  await expect(page.locator('#plain .w-toolbar-extension')).toHaveCount(0);
});

test('w-app-bar scroll-behavior fade-image dims the background image on scroll', async ({ mount, page }) => {
  await mount(`
    <w-app-bar id="bar" scroll-behavior="fade-image" scroll-threshold="10" image="https://example.com/bg.jpg">Faded</w-app-bar>
    <div style="height: 1400px"></div>
  `);
  const bar = page.locator('#bar > .w-app-bar');
  await expect(bar).not.toHaveClass(/w-app-bar--image-faded/);

  await page.evaluate(() => window.scrollTo(0, 40));
  await expect(bar).toHaveClass(/w-app-bar--image-faded/);

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(bar).not.toHaveClass(/w-app-bar--image-faded/);
});
