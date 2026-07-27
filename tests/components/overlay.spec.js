import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-overlay reflects open and scrim attributes', async ({ mount, page }) => {
  await mount('<w-overlay id="overlay" label="Open details" open scrim="primary" opacity="0.6" z-index="2500" width="18rem">Overlay content</w-overlay>');

  const overlay = page.locator('#overlay .w-overlay');
  await expect(overlay).toHaveClass(/open/);
  await expect(overlay).toHaveClass(/w-overlay--scrim/);
  await expect(overlay).not.toHaveAttribute('hidden', '');
  await expect(overlay).toHaveCSS('--w-overlay-opacity', '60%');
  await expect(overlay).toHaveCSS('z-index', '2500');
  await expect(page.locator('#overlay .w-overlay-activator')).toHaveText('Open details');
  await expect(page.locator('#overlay .w-overlay-activator')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#overlay .w-overlay-content')).toHaveText('Overlay content');
  await expect(page.locator('#overlay .w-overlay-content')).toHaveCSS('width', '288px');

  await page.locator('#overlay').evaluate((el) => {
    el.removeAttribute('open');
    el.setAttribute('scrim', 'false');
  });

  await expect(overlay).not.toHaveClass(/open/);
  await expect(overlay).not.toHaveClass(/w-overlay--scrim/);
  await expect(page.locator('#overlay .w-overlay-scrim')).toHaveCount(0);
  await expect(overlay).toHaveAttribute('hidden', '');
});

test('w-overlay closes from outside click and escape unless persistent', async ({ mount, page }) => {
  await mount('<w-overlay id="overlay" open>Overlay content</w-overlay>');
  await recordEvents(page, '#overlay', ['toggle', 'close']);

  await page.locator('#overlay .w-overlay').evaluate((overlay) => {
    overlay.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await expect(page.locator('#overlay')).not.toHaveAttribute('open', '');
  expect((await readEvents(page, '#overlay')).map((event) => event.type)).toEqual(['toggle', 'close']);

  await page.locator('#overlay').evaluate((el) => {
    el.setAttribute('persistent', '');
    el.show();
  });
  await page.keyboard.press('Escape');
  await expect(page.locator('#overlay')).toHaveAttribute('open', '');
});

test('w-overlay opens from activator, supports location, and returns focus', async ({ mount, page }) => {
  await mount(`
    <w-overlay id="overlay" location="bottom-end" contained>
      <button slot="activator" id="trigger">Show overlay</button>
      <div class="w-card"><button id="inside">Inside action</button></div>
    </w-overlay>
  `);
  await recordEvents(page, '#overlay', ['toggle', 'close']);

  await page.locator('#trigger').click();

  await expect(page.locator('#overlay')).toHaveAttribute('open', '');
  await expect(page.locator('#overlay .w-overlay')).toHaveClass(/w-overlay--contained/);
  await expect(page.locator('#overlay .w-overlay')).toHaveClass(/w-overlay--location-bottom-end/);
  await expect(page.locator('#inside')).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(page.locator('#overlay')).not.toHaveAttribute('open', '');
  await expect(page.locator('#trigger')).toBeFocused();
  expect((await readEvents(page, '#overlay')).map((event) => event.type)).toEqual(['toggle', 'toggle', 'close']);
});

test('w-overlay applies a named transition and can opt out of one', async ({ mount, page }) => {
  await mount(`
    <w-overlay id="scaled" transition="Slide Y" open>Scaled</w-overlay>
    <w-overlay id="plain" transition="false" open>Plain</w-overlay>
    <w-overlay id="none" open>None</w-overlay>
  `);

  await expect(page.locator('#scaled .w-overlay')).toHaveClass(/w-overlay--transition-slide-y/);
  await expect(page.locator('#scaled .w-overlay-content')).toHaveCSS('animation-name', 'w-overlay-slide-y');
  await expect(page.locator('#plain .w-overlay')).toHaveClass(/w-overlay--no-transition/);
  await expect(page.locator('#plain .w-overlay-content')).toHaveCSS('animation-name', 'none');
  await expect(page.locator('#none .w-overlay')).not.toHaveClass(/w-overlay--transition/);
});

test('w-overlay pins its content to a target and clamps it to the viewport', async ({ mount, page }) => {
  await mount(`
    <div id="anchor" style="position:fixed;left:1000px;top:600px;width:40px;height:40px"></div>
    <w-overlay id="near" target="#anchor" origin="bottom" offset="10,5" open>Near</w-overlay>
    <w-overlay id="clamped" target="#anchor" origin="bottom" offset="200" viewport-margin="24" open>Clamped</w-overlay>
    <w-overlay id="stuck" target="#anchor" origin="bottom" offset="200" viewport-margin="24" stick-to-target open>Stuck</w-overlay>
  `);

  await expect(page.locator('#near .w-overlay')).toHaveClass(/w-overlay--connected/);
  await expect(page.locator('#near .w-overlay-content')).toHaveCSS('position', 'absolute');
  // anchor centre-x 1020 + skid 5, anchor bottom 640 + distance 10.
  await expect(page.locator('#near .w-overlay-content')).toHaveCSS('left', '1025px');
  await expect(page.locator('#near .w-overlay-content')).toHaveCSS('top', '650px');
  expect(await page.locator('#near .w-overlay-content').getAttribute('style')).toContain('transform-origin: 50% 100%');

  // 640 + 200 overflows a 720px viewport, so it stops 24px short of the edge.
  await expect(page.locator('#clamped .w-overlay-content')).toHaveCSS('top', '696px');
  await expect(page.locator('#stuck .w-overlay-content')).toHaveCSS('top', '840px');
});

test('w-overlay ignores an unusable target and still honours origin', async ({ mount, page }) => {
  await mount(`
    <w-overlay id="cursor" target="cursor" origin="top-left" open>Cursor</w-overlay>
    <w-overlay id="broken" target="!!!" open>Broken</w-overlay>
    <w-overlay id="missing" target="#nope" open>Missing</w-overlay>
    <w-overlay id="parent" target="parent" open>Parent</w-overlay>
  `);

  await expect(page.locator('#cursor .w-overlay')).not.toHaveClass(/w-overlay--connected/);
  await expect(page.locator('#broken .w-overlay')).not.toHaveClass(/w-overlay--connected/);
  await expect(page.locator('#missing .w-overlay')).not.toHaveClass(/w-overlay--connected/);
  await expect(page.locator('#parent .w-overlay')).toHaveClass(/w-overlay--connected/);
  // An unknown origin falls back to the bottom anchor.
  expect(await page.locator('#cursor .w-overlay-content').getAttribute('style')).toContain('transform-origin: 50% 100%');
});

test('w-overlay keeps Tab inside the content unless the trap is turned off', async ({ mount, page }) => {
  await mount(`
    <w-overlay id="trap" open><button id="first">First</button><button id="last">Last</button></w-overlay>
    <w-overlay id="loose" retain-focus="false" open><button id="loose-first">First</button><button id="loose-last">Last</button></w-overlay>
  `);

  await page.locator('#last').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#first')).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#last')).toBeFocused();

  await page.locator('#loose-last').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#loose-first')).not.toBeFocused();
});

test('w-overlay capture-focus="false" also releases the Tab trap', async ({ mount, page }) => {
  await mount('<w-overlay id="o" capture-focus="false" open><button id="a">A</button><button id="b">B</button></w-overlay>');

  await page.locator('#b').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#a')).not.toBeFocused();
});

test('w-overlay close-on-content-click dismisses from inside the surface', async ({ mount, page }) => {
  await mount(`
    <w-overlay id="sticky" open><span id="sticky-body">Body</span></w-overlay>
    <w-overlay id="quick" close-on-content-click open><span id="quick-body">Body</span></w-overlay>
  `);

  // Both overlays cover the viewport, so the clicks are dispatched rather than
  // driven through the stacking order.
  await page.locator('#sticky-body').dispatchEvent('click');
  await expect(page.locator('#sticky')).toHaveAttribute('open', '');

  await page.locator('#quick-body').dispatchEvent('click');
  await expect(page.locator('#quick')).not.toHaveAttribute('open', '');
});

test('w-overlay close-on-back dismisses when the browser goes back', async ({ mount, page }) => {
  await mount('<w-overlay id="o" close-on-back label="Open"></w-overlay>');

  await page.locator('#o .w-overlay-activator').click();
  await expect(page.locator('#o')).toHaveAttribute('open', '');

  await page.evaluate(() => history.back());
  await expect(page.locator('#o')).not.toHaveAttribute('open', '');
});

test('w-overlay open-on-click="false" leaves the activator inert', async ({ mount, page }) => {
  await mount('<w-overlay id="o" open-on-click="false" label="Inert"></w-overlay>');

  await page.locator('#o .w-overlay-activator').click();
  await expect(page.locator('#o')).not.toHaveAttribute('open', '');
  await page.locator('#o .w-overlay-activator').press('Enter');
  await expect(page.locator('#o')).not.toHaveAttribute('open', '');

  await page.locator('#o').evaluate((el) => el.show());
  await expect(page.locator('#o')).toHaveAttribute('open', '');
});

test('w-overlay opens on hover after open-delay and closes on leave', async ({ mount, page }) => {
  await mount('<w-overlay id="o" open-on-hover open-delay="400" close-delay="0" label="Hover"></w-overlay>');

  await page.locator('#o .w-overlay-activator').dispatchEvent('mouseenter');
  expect(await page.locator('#o').getAttribute('open')).toBeNull();
  await expect(page.locator('#o')).toHaveAttribute('open', '');

  await page.locator('#o .w-overlay-activator').dispatchEvent('mouseleave');
  await expect(page.locator('#o')).not.toHaveAttribute('open', '');
});

test('w-overlay opens on focus and stays open while focus moves into it', async ({ mount, page }) => {
  await mount(`
    <w-overlay id="o" open-on-focus open-on-click="false" close-delay="0">
      <button slot="activator" id="trigger">Focus me</button>
      <button id="inside">Inside</button>
    </w-overlay>
  `);

  await page.locator('#trigger').focus();
  await expect(page.locator('#o')).toHaveAttribute('open', '');
  await expect(page.locator('#o .w-overlay-activator')).toHaveAttribute('aria-expanded', 'true');

  // Focus staying on the activator must not immediately close it again.
  await page.waitForTimeout(50);
  await expect(page.locator('#o')).toHaveAttribute('open', '');

  await page.locator('#o').evaluate((el) => el.close());
  await expect(page.locator('#o')).not.toHaveAttribute('open', '');
});

test('w-overlay activates from Enter and Space but ignores other keys', async ({ mount, page }) => {
  await mount('<w-overlay id="o"><span slot="activator" id="trigger">Open</span><button id="inside">Inside</button></w-overlay>');

  const activator = page.locator('#o .w-overlay-activator');
  await activator.press('ArrowDown');
  await expect(page.locator('#o')).not.toHaveAttribute('open', '');

  await activator.press('Space');
  await expect(page.locator('#o')).toHaveAttribute('open', '');

  await page.locator('#o').evaluate((el) => el.close());
  await page.locator('#o .w-overlay-activator').press('Enter');
  await expect(page.locator('#o')).toHaveAttribute('open', '');
});

test('w-overlay accepts a pair of viewport coordinates as its target', async ({ mount, page }) => {
  await mount('<w-overlay id="o" target="120, 340" offset="0,0" open>Body</w-overlay>');

  await expect(page.locator('#o .w-overlay')).toHaveClass(/w-overlay--connected/);
  await expect(page.locator('#o .w-overlay-content')).toHaveCSS('left', '120px');
  await expect(page.locator('#o .w-overlay-content')).toHaveCSS('top', '340px');
});

test('w-overlay releases its document listeners when it is removed', async ({ mount, page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));

  await mount('<w-overlay id="o" close-on-back label="Open">Body</w-overlay>');
  await page.locator('#o .w-overlay-activator').click();
  await expect(page.locator('#o')).toHaveAttribute('open', '');

  await page.locator('#o').evaluate((el) => el.remove());
  await page.evaluate(() => history.back());
  await page.keyboard.press('Escape');

  await expect(page.locator('#o')).toHaveCount(0);
  expect(errors).toEqual([]);
});
