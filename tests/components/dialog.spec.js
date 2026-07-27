import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-dialog reflects open and title attributes and closes from all public interactions', async ({ mount, page }) => {
  await mount(`
    <button id="outside">Outside</button>
    <w-dialog id="dialog" title="Confirm" open>
      <p>Body</p>
      <button slot="footer" w-dialog-close>OK</button>
    </w-dialog>
  `);
  await recordEvents(page, '#dialog', ['toggle', 'close']);

  await expect(page.locator('#dialog .w-dialog-title')).toHaveText('Confirm');
  await expect(page.locator('#dialog .w-dialog-wrapper')).toHaveClass(/open/);
  await expect(page.locator('#dialog .w-dialog-wrapper')).toHaveAttribute('aria-hidden', 'false');
  await expect(page.locator('#dialog .w-overlay')).toHaveClass(/w-overlay--scrim/);

  await page.locator('#dialog [aria-label="Close"]').click();
  await expect(page.locator('#dialog')).not.toHaveAttribute('open', '');

  await page.locator('#dialog').evaluate((el) => el.show());
  await expect(page.locator('#dialog')).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(page.locator('#dialog')).not.toHaveAttribute('open', '');

  await page.locator('#dialog').evaluate((el) => {
    el.setAttribute('title', 'Updated');
    el.setAttribute('open', '');
  });
  await expect(page.locator('#dialog .w-dialog-title')).toHaveText('Updated');
  await page.locator('#dialog .w-overlay').evaluate((overlay) => {
    overlay.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await expect(page.locator('#dialog')).not.toHaveAttribute('open', '');

  expect((await readEvents(page, '#dialog')).map((event) => event.type)).toEqual([
    'toggle',
    'close',
    'toggle',
    'toggle',
    'close',
    'toggle',
    'close',
  ]);
});

test('w-dialog supports activator slot, persistent mode, fullscreen, scrollable, and focus return', async ({ mount, page }) => {
  await mount(`
    <button id="before">Before</button>
    <w-dialog id="dialog" title="Settings" persistent fullscreen scrollable width="640" max-width="720">
      <button slot="activator" id="activator">Open settings</button>
      <p>Settings body</p>
      <button slot="footer" id="save" w-dialog-close>Save</button>
    </w-dialog>
  `);
  await recordEvents(page, '#dialog', ['toggle', 'close']);

  await page.locator('#activator').click();
  await expect(page.locator('#dialog')).toHaveAttribute('open', '');
  await expect(page.locator('#dialog .w-dialog-wrapper')).toHaveClass(/w-dialog-wrapper--fullscreen/);
  await expect(page.locator('#dialog .w-dialog-wrapper')).toHaveClass(/w-dialog-wrapper--scrollable/);
  await expect(page.locator('#dialog .w-dialog')).toHaveClass(/w-dialog--fullscreen/);
  await expect(page.locator('#dialog .w-dialog')).toHaveCSS('--w-dialog-width', '640px');
  await expect(page.locator('#dialog .w-dialog')).toHaveCSS('--w-dialog-max-width', '720px');

  await page.locator('#dialog .w-overlay').evaluate((overlay) => {
    overlay.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await expect(page.locator('#dialog')).toHaveAttribute('open', '');
  await expect(page.locator('#dialog .w-dialog')).toHaveClass(/w-dialog--shake/);

  await page.keyboard.press('Escape');
  await expect(page.locator('#dialog')).toHaveAttribute('open', '');

  await page.locator('#save').click();
  await expect(page.locator('#dialog')).not.toHaveAttribute('open', '');
  await expect(page.locator('#activator')).toBeFocused();

  expect((await readEvents(page, '#dialog')).map((event) => event.type)).toEqual([
    'toggle',
    'toggle',
    'close',
  ]);
});

test('w-dialog opens and closes from nested w-btn controls', async ({ mount, page }) => {
  await mount(`
    <w-dialog id="dialog" title="Nested controls">
      <w-btn slot="activator" id="activator" variant="filled">Open nested</w-btn>
      <p>Nested button body</p>
      <w-btn slot="footer" id="close" w-dialog-close>Done</w-btn>
    </w-dialog>
  `);

  await page.locator('#activator button').click();
  await expect(page.locator('#dialog')).toHaveAttribute('open', '');

  await page.locator('#close button').click();
  await expect(page.locator('#dialog')).not.toHaveAttribute('open', '');
});

test('w-dialog traps Tab focus inside the dialog and ignores other keys', async ({ mount, page }) => {
  await mount(`
    <button id="outside">Outside</button>
    <w-dialog id="dialog" title="Trap" open hide-close>
      <button id="one">One</button>
      <button id="two">Two</button>
      <button slot="footer" id="three">Three</button>
    </w-dialog>
  `);

  // hide-close drops the header button, so the slotted controls are the trap.
  await expect(page.locator('#dialog [aria-label="Close"]')).toHaveCount(0);
  await expect(page.locator('#one')).toBeFocused();

  // Tab off the last control wraps back to the first.
  await page.locator('#three').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#one')).toBeFocused();

  // Shift+Tab off the first control wraps to the last.
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#three')).toBeFocused();

  // Shift+Tab from the middle is left to the browser.
  await page.locator('#two').focus();
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#one')).toBeFocused();

  // Forward Tab from the middle is left to the browser too.
  await page.locator('#two').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#three')).toBeFocused();

  // Keys other than Tab never move focus.
  await page.keyboard.press('a');
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#three')).toBeFocused();

  // The trap never closes the dialog.
  await expect(page.locator('#dialog')).toHaveAttribute('open', '');
});

test('w-dialog leaves Tab alone when the dialog holds nothing focusable', async ({ mount, page }) => {
  await mount(`
    <w-dialog id="dialog" title="Read only" open hide-close>
      <p>Nothing here can take focus.</p>
    </w-dialog>
    <button id="after">After</button>
  `);

  // With no focusable content the panel itself takes focus.
  await expect(page.locator('#dialog .w-dialog')).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(page.locator('#after')).toBeFocused();
  await expect(page.locator('#dialog')).toHaveAttribute('open', '');
});

test('w-dialog absolute, contained and stick-to-target lay the surface out against the offset parent', async ({ mount, page }) => {
  await mount(`
    <div style="position: relative">
      <w-dialog id="abs" title="Absolute" absolute open hide-close>Body</w-dialog>
      <w-dialog id="contained" title="Contained" contained open hide-close>Body</w-dialog>
      <w-dialog id="stick" title="Stick" stick-to-target target="parent" open hide-close>Body</w-dialog>
      <w-dialog id="fixed" title="Fixed" open hide-close>Body</w-dialog>
    </div>
  `);

  await expect(page.locator('#abs .w-dialog-wrapper')).toHaveCSS('position', 'absolute');
  await expect(page.locator('#contained .w-dialog-wrapper')).toHaveCSS('position', 'absolute');
  await expect(page.locator('#stick .w-dialog-wrapper')).toHaveCSS('position', 'absolute');
  await expect(page.locator('#fixed .w-dialog-wrapper')).toHaveCSS('position', 'fixed');
});

test('w-dialog content-class, z-index, opacity and viewport-margin reach the rendered surface', async ({ mount, page }) => {
  await mount(`
    <w-dialog id="dialog" title="Styled" open hide-close content-class="promo raised" z-index="99" opacity="0.25" viewport-margin="48">
      Body
    </w-dialog>
  `);

  await expect(page.locator('#dialog .w-dialog')).toHaveClass(/\bpromo\b/);
  await expect(page.locator('#dialog .w-dialog')).toHaveClass(/\braised\b/);
  await expect(page.locator('#dialog .w-dialog-wrapper')).toHaveCSS('z-index', '99');
  await expect(page.locator('#dialog .w-overlay')).toHaveCSS('z-index', '99');
  await expect(page.locator('#dialog .w-overlay')).toHaveCSS('--w-dialog-scrim-opacity', '25%');
  await expect(page.locator('#dialog .w-dialog-wrapper')).toHaveCSS('padding', '48px');
});

test('w-dialog origin sets the transform-origin used by the transition', async ({ mount, page }) => {
  await mount(`<w-dialog id="dialog" title="Origin" open hide-close origin="top-left">Body</w-dialog>`);
  await expect(page.locator('#dialog .w-dialog')).toHaveCSS('transform-origin', '0px 0px');
});

test('w-dialog transition selects a named animation and none removes it', async ({ mount, page }) => {
  await mount(`
    <w-dialog id="plain" title="None" transition="none" hide-close>Body</w-dialog>
    <w-dialog id="scaled" title="Scale" transition="scale" hide-close>Body</w-dialog>
  `);

  await expect(page.locator('#plain .w-dialog-wrapper')).toHaveClass(/w-dialog-wrapper--no-transition/);
  await expect(page.locator('#plain .w-dialog-wrapper')).toHaveCSS('transition-duration', '0s');

  await expect(page.locator('#scaled .w-dialog-wrapper')).toHaveClass(/w-dialog-wrapper--transition-scale/);
  await expect(page.locator('#scaled .w-dialog')).toHaveCSS('transform', 'matrix(0.92, 0, 0, 0.92, 0, 0)');

  await page.locator('#scaled').evaluate((el) => el.setAttribute('open', ''));
  await expect(page.locator('#scaled .w-dialog')).toHaveCSS('transform', 'none');
});

test('w-dialog target anchors the surface to an element and offset pushes it away', async ({ mount, page }) => {
  await mount(`
    <div id="anchor" style="position: absolute; left: 100px; top: 200px; width: 60px; height: 20px">Anchor</div>
    <w-dialog id="dialog" title="Anchored" target="#anchor" offset="16" open hide-close width="200">Body</w-dialog>
  `);

  await expect(page.locator('#dialog .w-dialog-wrapper')).toHaveClass(/w-dialog-wrapper--anchored/);
  const box = await page.locator('#dialog .w-dialog').boundingBox();
  expect(Math.round(box.x)).toBe(100);
  expect(Math.round(box.y)).toBe(236);
});

test('w-dialog target accepts an x,y pair and falls back safely for unknown targets', async ({ mount, page }) => {
  await mount(`
    <w-dialog id="point" title="Point" target="[40,90]" open hide-close width="150">Body</w-dialog>
    <w-dialog id="missing" title="Missing" target="#nope" open hide-close width="150">Body</w-dialog>
  `);

  const box = await page.locator('#point .w-dialog').boundingBox();
  expect(Math.round(box.x)).toBe(40);
  expect(Math.round(box.y)).toBe(90);

  // No matching target leaves the anchor variables unset, so the surface parks
  // at the wrapper origin instead of throwing.
  await expect(page.locator('#missing .w-dialog')).toBeVisible();
});

test('w-dialog open-on-click can be switched off while hover and focus opt in', async ({ mount, page }) => {
  await mount(`
    <w-dialog id="dialog" title="Hover" hide-close open-on-click="false" open-on-hover open-on-focus open-delay="40">
      <button slot="activator" id="activator">Open</button>
      Body
    </w-dialog>
  `);

  await page.locator('#activator').click();
  await expect(page.locator('#dialog')).not.toHaveAttribute('open', '');

  await page.locator('#dialog .w-dialog-activator').dispatchEvent('mouseenter');
  await expect(page.locator('#dialog')).not.toHaveAttribute('open', '');
  await expect.poll(() => page.locator('#dialog').getAttribute('open')).toBe('');

  await page.locator('#dialog [aria-label="Close"]').count();
  await page.locator('#dialog').evaluate((el) => el.close());
  await expect(page.locator('#dialog')).not.toHaveAttribute('open', '');

  await page.locator('#activator').focus();
  await expect.poll(() => page.locator('#dialog').getAttribute('open')).toBe('');
});

test('w-dialog close-delay defers the hover close', async ({ mount, page }) => {
  await mount(`
    <w-dialog id="dialog" title="Hover close" hide-close open-on-hover close-delay="60">
      <button slot="activator" id="activator">Open</button>
      Body
    </w-dialog>
  `);

  await page.locator('#dialog .w-dialog-activator').dispatchEvent('mouseenter');
  await expect(page.locator('#dialog')).toHaveAttribute('open', '');

  await page.locator('#dialog .w-dialog-activator').dispatchEvent('mouseleave');
  await expect(page.locator('#dialog')).toHaveAttribute('open', '');
  await expect.poll(() => page.locator('#dialog').getAttribute('open')).toBe(null);
});

test('w-dialog close-on-content-click closes from the body', async ({ mount, page }) => {
  await mount(`
    <w-dialog id="dialog" title="Content" open hide-close close-on-content-click>
      <p id="body">Body copy</p>
    </w-dialog>
  `);

  await page.locator('#body').click();
  await expect(page.locator('#dialog')).not.toHaveAttribute('open', '');
});

test('w-dialog no-click-animation suppresses the persistent bounce', async ({ mount, page }) => {
  await mount(`
    <w-dialog id="quiet" title="Quiet" open hide-close persistent no-click-animation>Body</w-dialog>
  `);

  await page.keyboard.press('Escape');
  await expect(page.locator('#quiet')).toHaveAttribute('open', '');
  await expect(page.locator('#quiet .w-dialog')).not.toHaveClass(/w-dialog--shake/);
});

test('w-dialog close-on-back closes when the browser goes back', async ({ mount, page }) => {
  await mount(`<w-dialog id="dialog" title="Back" hide-close close-on-back>Body</w-dialog>`);

  await page.locator('#dialog').evaluate((el) => el.show());
  await expect(page.locator('#dialog')).toHaveAttribute('open', '');

  await page.evaluate(() => history.back());
  await expect.poll(() => page.locator('#dialog').getAttribute('open')).toBe(null);
});

test('w-dialog retain-focus and capture-focus can release the Tab trap', async ({ mount, page }) => {
  await mount(`
    <w-dialog id="dialog" title="Loose" open hide-close retain-focus="false">
      <button id="one">One</button>
      <button id="two">Two</button>
    </w-dialog>
    <button id="after">After</button>
  `);

  // The dialog moves focus to its first control on open; wait for that before
  // driving the keyboard so the assertion is not racing the initial focus.
  await expect(page.locator('#one')).toBeFocused();
  await page.locator('#two').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#after')).toBeFocused();

  await mount(`
    <w-dialog id="capture" title="Loose" open hide-close capture-focus="false">
      <button id="three">Three</button>
    </w-dialog>
    <button id="later">Later</button>
  `);

  await expect(page.locator('#three')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#later')).toBeFocused();
});
