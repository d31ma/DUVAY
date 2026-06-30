import { expect, test } from '../setup/component-test.js';

test('w-menubar renders a menubar navigation wrapper around menu items', async ({ mount, page }) => {
  await mount(`
    <w-menubar id="menubar">
      <w-menubar-item label="File"><button role="menuitem">New</button></w-menubar-item>
    </w-menubar>
  `);

  await expect(page.locator('#menubar .w-menubar')).toHaveAttribute('role', 'menubar');
  await expect(page.locator('#menubar w-menubar-item')).toHaveCount(1);
});
