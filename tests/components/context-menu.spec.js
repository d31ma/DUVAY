import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-context-menu opens on right click, positions content, and closes from menu item, escape, or outside click', async ({ mount, page }) => {
  await mount(`
    <button id="outside">Outside</button>
    <w-context-menu id="context" label="Actions">
      <div id="target" style="width: 160px; height: 80px;">Right click</div>
      <button slot="content" role="menuitem">Copy</button>
    </w-context-menu>
  `);
  await recordEvents(page, '#context', ['toggle', 'close']);

  await page.locator('#target').click({ button: 'right', position: { x: 20, y: 20 } });
  await expect(page.locator('#context')).toHaveAttribute('open', '');
  await expect(page.locator('#context .w-context-menu-content')).toHaveClass(/open/);
  await expect(page.locator('#context .w-context-menu-content')).toHaveAttribute('aria-label', 'Actions');

  await page.locator('#context [role="menuitem"]').click();
  await expect(page.locator('#context')).not.toHaveAttribute('open', '');

  await page.locator('#target').click({ button: 'right' });
  await page.keyboard.press('Escape');
  await expect(page.locator('#context')).not.toHaveAttribute('open', '');

  await page.locator('#target').click({ button: 'right' });
  await page.locator('#outside').click();
  await expect(page.locator('#context')).not.toHaveAttribute('open', '');

  expect((await readEvents(page, '#context')).map((event) => event.type)).toEqual([
    'toggle',
    'close',
    'toggle',
    'close',
    'toggle',
    'close',
  ]);
});
