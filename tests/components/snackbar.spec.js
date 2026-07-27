import { expect, readEvents, recordEvents, test } from '../setup/component-test.js';

test('w-snackbar renders message and action with default bottom-center location', async ({ mount, page }) => {
  await mount('<w-snackbar id="s" text="Saved" action="Undo" timeout="-1" open inline></w-snackbar>');

  const bar = page.locator('#s .w-snackbar');
  await expect(bar).toHaveClass(/w-snackbar--bottom/);
  await expect(bar).toHaveClass(/w-snackbar--center/);
  await expect(page.locator('#s .w-snackbar-msg')).toHaveText('Saved');
  await expect(page.locator('#s [w-snackbar-action]')).toHaveText('Undo');
});

test('w-snackbar maps color, location, and timer', async ({ mount, page }) => {
  await mount('<w-snackbar id="s" text="Hi" color="success" location="top end" timer timeout="-1" open inline></w-snackbar>');
  const bar = page.locator('#s .w-snackbar');
  await expect(bar).toHaveClass(/w-snackbar--top/);
  await expect(bar).toHaveClass(/w-snackbar--end/);
  expect(await bar.getAttribute('style')).toContain('--w-snackbar-bg: var(--w-success-container)');
});

test('w-snackbar close button hides it and emits update:model-value and close', async ({ mount, page }) => {
  await mount('<w-snackbar id="s" text="Bye" timeout="-1" open inline></w-snackbar>');
  await recordEvents(page, '#s', ['update:model-value', 'close']);

  await page.locator('#s [w-snackbar-close]').click();

  await expect(page.locator('#s')).not.toHaveAttribute('open', '');
  await expect(page.locator('#s .w-snackbar')).toHaveCount(0);
  // Note: the test harness records falsy event detail as null.
  expect(await readEvents(page, '#s')).toEqual([
    { type: 'update:model-value', detail: null },
    { type: 'close', detail: null },
  ]);
});

test('w-snackbar renders a custom actions slot', async ({ mount, page }) => {
  await mount('<w-snackbar id="s" text="Hi" timeout="-1" open inline><button slot="actions" class="a">Retry</button></w-snackbar>');
  await expect(page.locator('#s .w-snackbar-actions .a')).toHaveText('Retry');
});

test('w-snackbar timer bar resolves boolean, token, and custom colors', async ({ mount, page }) => {
  await mount(`
    <w-snackbar id="plain" text="Plain" timer timeout="20000" open inline></w-snackbar>
    <w-snackbar id="bool" text="Bool" timer="true" timeout="20000" open inline></w-snackbar>
    <w-snackbar id="token" text="Token" timer="success" timeout="20000" open inline></w-snackbar>
    <w-snackbar id="info" text="Info" timer="info" timeout="20000" open inline></w-snackbar>
    <w-snackbar id="custom" text="Custom" timer="#ff8800" timeout="20000" open inline></w-snackbar>
  `);

  await expect(page.locator('#plain .w-snackbar-timer')).toHaveAttribute('style', 'animation-duration:20000ms');
  await expect(page.locator('#bool .w-snackbar-timer')).toHaveAttribute('style', 'animation-duration:20000ms');
  await expect(page.locator('#token .w-snackbar-timer')).toHaveAttribute('style', 'animation-duration:20000ms;background:var(--w-success)');
  await expect(page.locator('#info .w-snackbar-timer')).toHaveAttribute('style', 'animation-duration:20000ms;background:var(--w-primary)');
  await expect(page.locator('#custom .w-snackbar-timer')).toHaveAttribute('style', 'animation-duration:20000ms;background:#ff8800');
});

test('w-snackbar omits the timer bar when the timeout never expires', async ({ mount, page }) => {
  await mount('<w-snackbar id="s" text="Sticky" timer="warning" timeout="-1" open inline></w-snackbar>');
  await expect(page.locator('#s .w-snackbar')).toBeVisible();
  await expect(page.locator('#s .w-snackbar-timer')).toHaveCount(0);
});

test('w-snackbar renders a title and a prepend icon or avatar', async ({ mount, page }) => {
  await mount(`
    <w-snackbar id="titled" title="Upload complete" text="3 files" prepend-icon="check" timeout="-1" open inline></w-snackbar>
    <w-snackbar id="avatar" text="Mentioned you" prepend-avatar="/avatar.png" timeout="-1" open inline></w-snackbar>
    <w-snackbar id="plain" text="Nothing" timeout="-1" open inline></w-snackbar>
  `);

  await expect(page.locator('#titled .w-snackbar-title')).toHaveText('Upload complete');
  await expect(page.locator('#titled .w-snackbar-msg')).toHaveText('3 files');
  await expect(page.locator('#titled .w-snackbar-icon')).toHaveText('check');
  await expect(page.locator('#avatar .w-snackbar-avatar img')).toHaveAttribute('src', '/avatar.png');
  // An avatar wins over an icon, and neither renders without an attribute.
  await expect(page.locator('#plain .w-snackbar-icon')).toHaveCount(0);
  await expect(page.locator('#plain .w-snackbar-title')).toHaveCount(0);
});

test('w-snackbar closable and close-text control the dismiss button', async ({ mount, page }) => {
  await mount(`
    <w-snackbar id="labelled" text="Saved" close-text="Hide" timeout="-1" open inline></w-snackbar>
    <w-snackbar id="locked" text="Saved" closable="false" timeout="-1" open inline></w-snackbar>
  `);

  await expect(page.locator('#labelled [w-snackbar-close]')).toHaveAttribute('aria-label', 'Hide');
  await expect(page.locator('#locked [w-snackbar-close]')).toHaveCount(0);
});

test('w-snackbar queue-index and queue-gap offset it from the edge', async ({ mount, page }) => {
  await mount(`
    <w-snackbar id="front" text="Front" queue-index="0" queue-gap="20" timeout="-1" open></w-snackbar>
    <w-snackbar id="third" text="Third" queue-index="2" queue-gap="20" timeout="-1" open></w-snackbar>
    <w-snackbar id="topped" text="Top" location="top" queue-index="1" queue-gap="1rem" timeout="-1" open></w-snackbar>
  `);

  await expect(page.locator('#front .w-snackbar')).toHaveCSS('bottom', '16px');
  await expect(page.locator('#third .w-snackbar')).toHaveCSS('bottom', '56px');
  await expect(page.locator('#topped .w-snackbar')).toHaveCSS('top', '32px');
});

test('w-snackbar collapsed sizes the snackbar sitting behind another', async ({ mount, page }) => {
  await mount(`
    <w-snackbar id="sized" text="Behind" collapsed='{"width":260,"height":40}' timeout="-1" open></w-snackbar>
    <w-snackbar id="bare" text="Behind" collapsed timeout="-1" open></w-snackbar>
    <w-snackbar id="broken" text="Behind" collapsed="{oops" timeout="-1" open></w-snackbar>
  `);

  await expect(page.locator('#sized .w-snackbar')).toHaveClass(/w-snackbar--collapsed/);
  await expect(page.locator('#sized .w-snackbar')).toHaveCSS('width', '260px');
  await expect(page.locator('#sized .w-snackbar')).toHaveCSS('height', '40px');
  // A bare or unparseable value still marks the snackbar, at the default size.
  await expect(page.locator('#bare .w-snackbar')).toHaveCSS('width', '344px');
  await expect(page.locator('#broken .w-snackbar')).toHaveCSS('width', '344px');
});

test('w-snackbar reverse-timer and timer-color restyle the countdown bar', async ({ mount, page }) => {
  await mount(`
    <w-snackbar id="rev" text="Hi" timer reverse-timer timeout="9000" open inline></w-snackbar>
    <w-snackbar id="tinted" text="Hi" timer timer-color="error" timeout="9000" open inline></w-snackbar>
  `);

  await expect(page.locator('#rev .w-snackbar-timer')).toHaveClass(/w-snackbar-timer--reverse/);
  await expect(page.locator('#rev .w-snackbar-timer')).toHaveCSS('animation-direction', 'reverse');
  await expect(page.locator('#tinted .w-snackbar-timer')).toHaveAttribute('style', 'animation-duration:9000ms;background:var(--w-error)');
});

test('w-snackbar absolute, contained, opacity, z-index and content-class reach the surface', async ({ mount, page }) => {
  await mount(`
    <div style="position:relative;height:120px">
      <w-snackbar id="held" text="Held" contained content-class="promo" opacity="0.5" z-index="1400" timeout="-1" open></w-snackbar>
    </div>
    <w-snackbar id="abs" text="Abs" absolute timeout="-1" open></w-snackbar>
  `);

  const bar = page.locator('#held .w-snackbar');
  await expect(bar).toHaveClass(/promo/);
  await expect(bar).toHaveCSS('position', 'absolute');
  await expect(bar).toHaveCSS('opacity', '0.5');
  await expect(bar).toHaveCSS('z-index', '1400');
  await expect(page.locator('#abs .w-snackbar')).toHaveCSS('position', 'absolute');
});

test('w-snackbar applies a named transition and can opt out', async ({ mount, page }) => {
  await mount(`
    <w-snackbar id="faded" text="Hi" transition="fade" timeout="-1" open inline></w-snackbar>
    <w-snackbar id="still" text="Hi" transition="none" timeout="-1" open inline></w-snackbar>
  `);

  await expect(page.locator('#faded .w-snackbar')).toHaveCSS('animation-name', 'w-snackbar-fade');
  await expect(page.locator('#still .w-snackbar')).toHaveCSS('animation-name', 'none');
});

test('w-snackbar target and origin pin it to an element', async ({ mount, page }) => {
  await mount(`
    <div id="anchor" style="position:fixed;left:300px;top:200px;width:80px;height:20px"></div>
    <w-snackbar id="pinned" text="Pinned" target="#anchor" origin="top" offset="6" timeout="-1" open></w-snackbar>
    <w-snackbar id="loose" text="Loose" origin="end" timeout="-1" open inline></w-snackbar>
  `);

  const bar = page.locator('#pinned .w-snackbar');
  await expect(bar).toHaveClass(/w-snackbar--connected/);
  await expect(bar).toHaveCSS('left', '340px');
  await expect(bar).toHaveCSS('top', '206px');
  expect(await page.locator('#loose .w-snackbar').getAttribute('style')).toContain('transform-origin: 100% 50%');
});

test('w-snackbar opens from an activator and closes on a content click', async ({ mount, page }) => {
  await mount(`
    <w-snackbar id="s" text="Copied" timeout="-1" inline close-on-content-click>
      <button slot="activator" id="trigger">Copy</button>
    </w-snackbar>
  `);

  await expect(page.locator('#s .w-snackbar')).toHaveCount(0);
  await page.locator('#trigger').click();
  await expect(page.locator('#s')).toHaveAttribute('open', '');
  await expect(page.locator('#s .w-snackbar-msg')).toHaveText('Copied');

  await page.locator('#s .w-snackbar-content').click();
  await expect(page.locator('#s')).not.toHaveAttribute('open', '');
  await expect(page.locator('#s .w-snackbar')).toHaveCount(0);
});

test('w-snackbar opens on hover after open-delay', async ({ mount, page }) => {
  await mount(`
    <w-snackbar id="s" text="Hint" timeout="-1" inline open-on-hover open-on-click="false" open-delay="300">
      <button slot="activator" id="trigger">Hover</button>
    </w-snackbar>
  `);

  await page.locator('#trigger').click();
  await expect(page.locator('#s')).not.toHaveAttribute('open', '');

  await page.locator('#s .w-snackbar-activator').dispatchEvent('mouseenter');
  await expect(page.locator('#s')).toHaveAttribute('open', '');
});

test('w-snackbar close-on-back dismisses when the browser goes back', async ({ mount, page }) => {
  await mount(`
    <w-snackbar id="s" text="Undo" timeout="-1" inline close-on-back>
      <button slot="activator" id="trigger">Show</button>
    </w-snackbar>
  `);

  await page.locator('#trigger').click();
  await expect(page.locator('#s')).toHaveAttribute('open', '');

  await page.evaluate(() => history.back());
  await expect(page.locator('#s')).not.toHaveAttribute('open', '');
});
