import { expect, readEvents, recordEvents, test } from '../setup/component-test.js';

test('w-bottom-sheet renders a scrimmed dialog surface and tracks open', async ({ mount, page }) => {
  await mount('<w-bottom-sheet id="sheet" open>Sheet body</w-bottom-sheet>');

  const overlay = page.locator('#sheet .w-overlay');
  const sheet = page.locator('#sheet .w-bottom-sheet');

  await expect(overlay).toHaveClass(/w-bottom-sheet-overlay/);
  await expect(overlay).toHaveClass(/open/);
  await expect(overlay).not.toHaveAttribute('hidden', '');
  await expect(page.locator('#sheet .w-overlay-scrim')).toHaveCount(1);
  await expect(sheet).toHaveClass(/open/);
  await expect(sheet).toHaveAttribute('role', 'dialog');
  await expect(sheet).toHaveAttribute('aria-modal', 'true');
  await expect(sheet).toHaveText('Sheet body');
  // No activator slot means no implicit trigger button.
  await expect(page.locator('#sheet .w-overlay-activator')).toHaveCount(0);

  await page.locator('#sheet').evaluate((el) => el.removeAttribute('open'));
  await expect(overlay).toHaveAttribute('hidden', '');
  await expect(sheet).not.toHaveClass(/open/);
});

test('w-bottom-sheet inset, fullscreen and scrollable reshape the sheet', async ({ mount, page }) => {
  await mount(`
    <w-bottom-sheet id="plain" open>Plain</w-bottom-sheet>
    <w-bottom-sheet id="inset" inset open>Inset</w-bottom-sheet>
    <w-bottom-sheet id="full" fullscreen open>Full</w-bottom-sheet>
    <w-bottom-sheet id="scroll" scrollable open>Scroll</w-bottom-sheet>
  `);

  await expect(page.locator('#plain .w-bottom-sheet')).toHaveCSS('max-width', '720px');
  await expect(page.locator('#inset .w-bottom-sheet')).toHaveClass(/w-bottom-sheet--inset/);
  await expect(page.locator('#inset .w-bottom-sheet')).toHaveCSS('max-width', '70%');
  // 70% of the 1280px viewport, instead of the default 720px cap.
  expect((await page.locator('#inset .w-bottom-sheet').boundingBox()).width).toBe(896);
  await expect(page.locator('#full .w-bottom-sheet')).toHaveCSS('height', '720px');
  await expect(page.locator('#full .w-bottom-sheet')).toHaveCSS('border-radius', '0px');
  await expect(page.locator('#scroll .w-bottom-sheet')).toHaveCSS('overflow-y', 'auto');
});

test('w-bottom-sheet opens from its activator, closes on Escape, and returns focus', async ({ mount, page }) => {
  await mount(`
    <w-bottom-sheet id="sheet">
      <button slot="activator" id="trigger">Open sheet</button>
      <button id="inside">Confirm</button>
    </w-bottom-sheet>
  `);
  await recordEvents(page, '#sheet', ['toggle', 'close']);

  await page.locator('#trigger').click();
  await expect(page.locator('#sheet')).toHaveAttribute('open', '');
  await expect(page.locator('#sheet .w-overlay-activator')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#inside')).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(page.locator('#sheet')).not.toHaveAttribute('open', '');
  await expect(page.locator('#trigger')).toBeFocused();
  expect((await readEvents(page, '#sheet')).map((event) => event.type)).toEqual(['toggle', 'toggle', 'close']);
});

test('w-bottom-sheet persistent keeps the sheet open on Escape and scrim clicks', async ({ mount, page }) => {
  await mount('<w-bottom-sheet id="sheet" persistent open>Body</w-bottom-sheet>');

  await page.locator('#sheet .w-overlay').evaluate((overlay) => {
    overlay.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await expect(page.locator('#sheet')).toHaveAttribute('open', '');
  await expect(page.locator('#sheet .w-bottom-sheet')).toHaveClass(/w-overlay-content--bounce/);

  await page.keyboard.press('Escape');
  await expect(page.locator('#sheet')).toHaveAttribute('open', '');
});

test('w-bottom-sheet no-click-animation drops the persistent bounce', async ({ mount, page }) => {
  await mount('<w-bottom-sheet id="sheet" persistent no-click-animation open>Body</w-bottom-sheet>');

  await page.keyboard.press('Escape');
  await expect(page.locator('#sheet')).toHaveAttribute('open', '');
  await expect(page.locator('#sheet .w-bottom-sheet')).not.toHaveClass(/w-overlay-content--bounce/);
});

test('w-bottom-sheet closes from a scrim click when it is not persistent', async ({ mount, page }) => {
  await mount('<w-bottom-sheet id="sheet" open>Body</w-bottom-sheet>');

  await page.locator('#sheet .w-overlay-scrim').click();
  await expect(page.locator('#sheet')).not.toHaveAttribute('open', '');
});

test('w-bottom-sheet forwards scrim, opacity, z-index and content-class', async ({ mount, page }) => {
  await mount(`
    <w-bottom-sheet id="styled" scrim="primary" opacity="0.4" z-index="1200" content-class="promo" open>Body</w-bottom-sheet>
    <w-bottom-sheet id="bare" scrim="false" open>Body</w-bottom-sheet>
  `);

  const overlay = page.locator('#styled .w-overlay');
  await expect(overlay).toHaveCSS('--w-overlay-opacity', '40%');
  await expect(overlay).toHaveCSS('z-index', '1200');
  expect(await overlay.getAttribute('style')).toContain('--w-overlay-scrim: var(--w-primary');
  await expect(page.locator('#styled .w-bottom-sheet')).toHaveClass(/promo/);

  await expect(page.locator('#bare .w-overlay-scrim')).toHaveCount(0);
  await expect(page.locator('#bare .w-overlay')).not.toHaveClass(/w-overlay--scrim/);
});

test('w-bottom-sheet absolute and contained pin the sheet to its ancestor', async ({ mount, page }) => {
  await mount(`
    <div style="position:relative;height:200px">
      <w-bottom-sheet id="abs" absolute open>Absolute</w-bottom-sheet>
    </div>
    <div style="position:relative;height:200px">
      <w-bottom-sheet id="held" contained open>Contained</w-bottom-sheet>
    </div>
  `);

  await expect(page.locator('#abs .w-overlay')).toHaveCSS('position', 'absolute');
  await expect(page.locator('#abs .w-bottom-sheet')).toHaveCSS('position', 'absolute');
  await expect(page.locator('#held .w-bottom-sheet')).toHaveCSS('position', 'absolute');
  await expect(page.locator('#held .w-bottom-sheet')).toHaveAttribute('aria-modal', 'false');
});

test('w-bottom-sheet applies a named transition and can opt out', async ({ mount, page }) => {
  await mount(`
    <w-bottom-sheet id="faded" transition="fade" open>Body</w-bottom-sheet>
    <w-bottom-sheet id="still" transition="none" open>Body</w-bottom-sheet>
  `);

  await expect(page.locator('#faded .w-overlay')).toHaveClass(/w-overlay--transition-fade/);
  await expect(page.locator('#still .w-overlay')).toHaveClass(/w-overlay--no-transition/);
  await expect(page.locator('#still .w-bottom-sheet')).toHaveCSS('transition-duration', '0s');
});

test('w-bottom-sheet pins itself to a target with origin and offset', async ({ mount, page }) => {
  await mount(`
    <div id="anchor" style="position:fixed;left:200px;top:120px;width:60px;height:20px"></div>
    <w-bottom-sheet id="sheet" target="#anchor" origin="top" offset="8" open>Body</w-bottom-sheet>
  `);

  await expect(page.locator('#sheet .w-overlay')).toHaveClass(/w-overlay--connected/);
  await expect(page.locator('#sheet .w-bottom-sheet')).toHaveCSS('position', 'absolute');
  await expect(page.locator('#sheet .w-bottom-sheet')).toHaveCSS('left', '230px');
  await expect(page.locator('#sheet .w-bottom-sheet')).toHaveCSS('top', '128px');
});

test('w-bottom-sheet close-on-content-click and close-on-back dismiss the sheet', async ({ mount, page }) => {
  await mount('<w-bottom-sheet id="sheet" close-on-content-click close-on-back><button slot="activator" id="trigger">Open</button><span id="body">Body</span></w-bottom-sheet>');

  await page.locator('#trigger').click();
  await expect(page.locator('#sheet')).toHaveAttribute('open', '');

  await page.evaluate(() => history.back());
  await expect(page.locator('#sheet')).not.toHaveAttribute('open', '');

  await page.locator('#trigger').click();
  await page.locator('#body').dispatchEvent('click');
  await expect(page.locator('#sheet')).not.toHaveAttribute('open', '');
});

test('w-bottom-sheet opens on hover after a delay and traps Tab inside the sheet', async ({ mount, page }) => {
  await mount(`
    <w-bottom-sheet id="sheet" open-on-hover open-delay="300" open-on-click="false">
      <button slot="activator" id="trigger">Hover</button>
      <button id="first">First</button>
      <button id="last">Last</button>
    </w-bottom-sheet>
  `);

  await page.locator('#trigger').click();
  await expect(page.locator('#sheet')).not.toHaveAttribute('open', '');

  await page.locator('#sheet .w-overlay-activator').dispatchEvent('mouseenter');
  await expect(page.locator('#sheet')).toHaveAttribute('open', '');

  await page.locator('#last').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#first')).toBeFocused();
});

test('w-bottom-sheet disabled ignores activation', async ({ mount, page }) => {
  await mount('<w-bottom-sheet id="sheet" disabled><button slot="activator" id="trigger">Open</button>Body</w-bottom-sheet>');

  await page.locator('#sheet').evaluate((el) => el.show());
  await expect(page.locator('#sheet')).not.toHaveAttribute('open', '');
  await expect(page.locator('#sheet .w-overlay-activator')).toHaveAttribute('tabindex', '-1');
});
