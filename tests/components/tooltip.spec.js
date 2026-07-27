import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-tooltip reflects text, location, color, offset, and controlled visibility', async ({ mount, page }) => {
  await mount('<w-tooltip id="tip" text="Helpful detail" location="left" color="primary" offset="12" open>Target</w-tooltip>');

  await expect(page.locator('#tip')).toHaveAttribute('open', '');
  await expect(page.locator('#tip .w-tooltip')).toHaveClass(/open/);
  await expect(page.locator('#tip .w-tooltip')).toHaveClass(/w-tooltip--left/);
  await expect(page.locator('#tip .w-tooltip')).toHaveCSS('--w-tooltip-offset', '12px');
  await expect(page.locator('#tip .w-tooltip')).toHaveCSS('--w-tooltip-bg', '#83cde3');
  await expect(page.locator('#tip .w-tooltip-activator')).toHaveAttribute('aria-describedby', 'tip-content');
  await expect(page.locator('#tip .w-tooltip-content')).toHaveText('Helpful detail');
  await expect(page.locator('#tip .w-tooltip-content')).toHaveCSS('width', /[6-9]\d(\.\d+)?px|1\d\d(\.\d+)?px/);
  await expect(page.locator('#tip .w-tooltip-content')).not.toHaveAttribute('hidden', '');

  await page.locator('#tip').evaluate((el) => {
    el.removeAttribute('open');
    el.setAttribute('location', 'bottom');
  });

  await expect(page.locator('#tip .w-tooltip')).toHaveClass(/w-tooltip--bottom/);
  await expect(page.locator('#tip .w-tooltip-content')).toHaveAttribute('hidden', '');
});

test('w-tooltip opens from hover and focus, then closes on escape', async ({ mount, page }) => {
  await mount('<w-tooltip id="tip" text="Hover copy" close-delay="10"><button>Hover me</button></w-tooltip>');
  await recordEvents(page, '#tip', ['toggle', 'close']);

  await page.locator('#tip .w-tooltip-activator').hover();
  await expect(page.locator('#tip')).toHaveAttribute('open', '');

  await page.keyboard.press('Escape');
  await expect(page.locator('#tip')).not.toHaveAttribute('open', '');

  const events = (await readEvents(page, '#tip')).map((event) => event.type);
  expect(events).toEqual([
    'toggle',
    'toggle',
    'close',
  ]);

  await mount('<w-tooltip id="focus-tip" text="Focus copy"><button>Focus me</button></w-tooltip>');
  await page.locator('#focus-tip button').focus();
  await expect(page.locator('#focus-tip')).toHaveAttribute('open', '');
});

test('w-tooltip supports click activation, cursor target, interactive content, and delayed close', async ({ mount, page }) => {
  await mount(`
    <w-tooltip id="tip" text="Click copy" open-on-click open-on-hover="false" target="cursor" interactive close-delay="20" close-on-content-click>
      <button slot="activator" id="trigger">Deploy</button>
      <button slot="content" id="inside">Copy token</button>
    </w-tooltip>
  `);

  await expect(page.locator('#tip .w-tooltip')).toHaveClass(/w-tooltip--interactive/);
  await expect(page.locator('#tip .w-tooltip')).toHaveClass(/w-tooltip--target-cursor/);
  await expect(page.locator('#tip .w-tooltip')).not.toHaveClass(/w-tooltip--cursor-ready/);
  await expect(page.locator('#tip .w-tooltip-content')).toHaveAttribute('hidden', '');
  expect(await page.locator('#tip .w-tooltip').getAttribute('style')).not.toContain('--w-tooltip-cursor-x');
  await page.locator('#trigger').click({ position: { x: 8, y: 8 } });

  await expect(page.locator('#tip')).toHaveAttribute('open', '');
  await expect(page.locator('#tip .w-tooltip')).toHaveClass(/w-tooltip--cursor-ready/);
  await expect(page.locator('#inside')).toBeVisible();
  await expect(page.locator('#tip .w-tooltip')).toHaveCSS('--w-tooltip-cursor-x', /px/);
  await expect(page.locator('#tip .w-tooltip')).toHaveCSS('--w-tooltip-cursor-y', /px/);
  expect((await page.locator('#tip .w-tooltip-content').boundingBox())?.height).toBeGreaterThan(16);

  await page.locator('#inside').click();
  await expect(page.locator('#tip')).not.toHaveAttribute('open', { timeout: 1000 });
});

test('w-tooltip open-on-click toggles from Enter and Space on the activator', async ({ mount, page }) => {
  await mount('<w-tooltip id="tip" text="Keyboard copy" open-on-click open-on-hover="false"><button id="trigger">Deploy</button></w-tooltip>');
  await recordEvents(page, '#tip', ['toggle', 'close']);

  // A key the tooltip does not own leaves it closed.
  await page.locator('#trigger').focus();
  await page.keyboard.press('Escape');
  await expect(page.locator('#tip')).not.toHaveAttribute('open', '');

  await page.locator('#trigger').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#tip')).toHaveAttribute('open', '');
  await expect(page.locator('#tip .w-tooltip-content')).toHaveText('Keyboard copy');
  await expect(page.locator('#tip .w-tooltip-content')).not.toHaveAttribute('hidden', '');

  await page.locator('#trigger').focus();
  await page.keyboard.press(' ');
  await expect(page.locator('#tip')).not.toHaveAttribute('open', '');
  await expect(page.locator('#tip .w-tooltip-content')).toHaveAttribute('hidden', '');

  const events = await readEvents(page, '#tip');
  expect(events.map((event) => event.type)).toEqual(['toggle', 'toggle', 'close']);
  expect(events.map((event) => event.detail.reason)).toEqual(['keyboard', 'keyboard', 'keyboard']);
});

test('w-tooltip persistent refuses Escape and bounces unless no-click-animation is set', async ({ mount, page }) => {
  await mount('<w-tooltip id="tip" text="Sticky" open persistent><button id="trigger">Target</button></w-tooltip>');

  await page.locator('#trigger').focus();
  await page.keyboard.press('Escape');
  await expect(page.locator('#tip')).toHaveAttribute('open', '');
  await expect(page.locator('#tip .w-tooltip')).toHaveClass(/w-tooltip--persistent/);
  await expect(page.locator('#tip .w-tooltip-content')).toHaveClass(/w-tooltip-content--bounce/);

  await mount('<w-tooltip id="quiet" text="Sticky" open persistent no-click-animation><button id="quiet-trigger">Target</button></w-tooltip>');
  await page.locator('#quiet-trigger').focus();
  await page.keyboard.press('Escape');
  await expect(page.locator('#quiet')).toHaveAttribute('open', '');
  await expect(page.locator('#quiet .w-tooltip-content')).not.toHaveClass(/w-tooltip-content--bounce/);
});

test('w-tooltip scrim renders a dismissible backdrop with a colour and opacity', async ({ mount, page }) => {
  await mount('<w-tooltip id="tip" text="Backdrop" open scrim="primary" opacity="0.5" open-on-hover="false">Target</w-tooltip>');

  const scrim = page.locator('#tip .w-tooltip-scrim');
  await expect(scrim).toBeVisible();
  await expect(scrim).toHaveCSS('--w-tooltip-scrim-opacity', '50%');
  const color = await scrim.evaluate((el) => getComputedStyle(el).getPropertyValue('--w-tooltip-scrim-color').trim());
  const primary = await scrim.evaluate((el) => getComputedStyle(el).getPropertyValue('--w-primary').trim());
  expect(color).toBe(primary);

  await scrim.click();
  await expect(page.locator('#tip')).not.toHaveAttribute('open', '');
  await expect(page.locator('#tip .w-tooltip-scrim')).toHaveCount(0);
});

test('w-tooltip contained, z-index and origin shape the surface', async ({ mount, page }) => {
  await mount(`
    <div style="width: 200px">
      <w-tooltip id="tip" text="Contained copy that would otherwise run wide" open contained z-index="70" origin="top-left">Target</w-tooltip>
    </div>
  `);

  const content = page.locator('#tip .w-tooltip-content');
  await expect(page.locator('#tip .w-tooltip')).toHaveClass(/w-tooltip--contained/);
  await expect(content).toHaveCSS('z-index', '70');
  await expect(content).toHaveCSS('transform-origin', '0px 0px');

  const widths = await page.locator('#tip .w-tooltip').evaluate((root) => ({
    root: root.getBoundingClientRect().width,
    content: root.querySelector('.w-tooltip-content').getBoundingClientRect().width,
  }));
  expect(widths.content).toBeLessThanOrEqual(widths.root + 1);
});

test('w-tooltip viewport-margin caps the surface against the viewport', async ({ mount, page }) => {
  await page.setViewportSize({ width: 900, height: 720 });
  await mount('<w-tooltip id="tip" text="Some fairly long tooltip copy" open viewport-margin="380">Target</w-tooltip>');

  await expect(page.locator('#tip .w-tooltip-content')).toHaveCSS('max-width', '140px');
});

test('w-tooltip stick-to-target parks a cursor tooltip in page space', async ({ mount, page }) => {
  await mount(`
    <w-tooltip id="tip" text="Stuck" open target="cursor" stick-to-target open-on-click open-on-hover="false">
      <button slot="activator" id="trigger">Target</button>
    </w-tooltip>
  `);

  await expect(page.locator('#tip .w-tooltip')).toHaveClass(/w-tooltip--stick/);
  await expect(page.locator('#tip .w-tooltip-content')).toHaveCSS('position', 'absolute');
});

test('w-tooltip transition selects the animated properties and none removes them', async ({ mount, page }) => {
  await mount(`
    <w-tooltip id="plain" text="None" open transition="none">A</w-tooltip>
    <w-tooltip id="fade" text="Fade" open transition="fade">B</w-tooltip>
  `);

  await expect(page.locator('#plain .w-tooltip')).toHaveClass(/w-tooltip--no-transition/);
  await expect(page.locator('#plain .w-tooltip-content')).toHaveCSS('transition-duration', '0s');

  await expect(page.locator('#fade .w-tooltip')).toHaveClass(/w-tooltip--transition-fade/);
  await expect(page.locator('#fade .w-tooltip-content')).toHaveCSS('transition-property', 'opacity');
});

test('w-tooltip close-on-back hides when the browser goes back', async ({ mount, page }) => {
  await mount('<w-tooltip id="tip" text="Back" close-on-back open-on-click open-on-hover="false"><button id="trigger">Target</button></w-tooltip>');

  await page.locator('#tip .w-tooltip-activator').click();
  await expect(page.locator('#tip')).toHaveAttribute('open', '');

  await page.evaluate(() => history.back());
  await expect.poll(() => page.locator('#tip').getAttribute('open')).toBe(null);
});
