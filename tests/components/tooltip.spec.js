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
