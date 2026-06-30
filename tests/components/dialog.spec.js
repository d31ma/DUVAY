import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-dialog reflects open and title attributes and closes from all public interactions', async ({ mount, page }) => {
  await mount(`
    <button id="outside">Outside</button>
    <w-dialog id="dialog" title="Confirm" open>
      <p>Body</p>
      <button slot="footer" data-w-dialog-close>OK</button>
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
      <button slot="footer" id="save" data-w-dialog-close>Save</button>
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
      <w-btn slot="footer" id="close" data-w-dialog-close>Done</w-btn>
    </w-dialog>
  `);

  await page.locator('#activator button').click();
  await expect(page.locator('#dialog')).toHaveAttribute('open', '');

  await page.locator('#close button').click();
  await expect(page.locator('#dialog')).not.toHaveAttribute('open', '');
});
