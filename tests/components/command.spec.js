import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-command filters, navigates with the keyboard (skipping disabled), and emits change', async ({ mount, page }) => {
  await mount(`
    <w-command id="cmd">
      <w-command-item value="new">New File</w-command-item>
      <w-command-item value="open">Open Project</w-command-item>
      <w-command-item value="save" disabled>Save</w-command-item>
    </w-command>
  `);
  await recordEvents(page, '#cmd', ['change']);

  // Filter actually hides non-matching items.
  await page.locator('#cmd .w-command-input').fill('open');
  await expect(page.locator('#cmd w-command-item[value="new"]')).toBeHidden();
  await expect(page.locator('#cmd w-command-item[value="open"]')).toBeVisible();
  await page.locator('#cmd .w-command-input').fill('');

  // Keyboard: first item active, ArrowDown moves to the next visible item.
  await page.locator('#cmd .w-command-input').focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#cmd w-command-item[value="open"] .w-command-item')).toHaveClass(/active/);
  await page.keyboard.press('Enter');

  // Click selects; disabled items do not.
  await page.locator('#cmd w-command-item[value="save"] .w-command-item').click({ force: true });
  await page.locator('#cmd w-command-item[value="new"] .w-command-item').click();

  expect(await readEvents(page, '#cmd')).toEqual([
    { type: 'change', detail: { value: 'open' } },
    { type: 'change', detail: { value: 'new' } },
  ]);
});

test('w-command shows the empty state when nothing matches', async ({ mount, page }) => {
  await mount(`
    <w-command id="cmd" empty="Nothing here">
      <w-command-item value="alpha">Alpha</w-command-item>
    </w-command>
  `);

  await expect(page.locator('#cmd .w-command-empty')).toBeHidden();
  await page.locator('#cmd .w-command-input').fill('zzz');
  await expect(page.locator('#cmd .w-command-empty')).toBeVisible();
  await expect(page.locator('#cmd .w-command-empty')).toHaveText('Nothing here');
});

test('w-command renders the items array with subheaders, dividers, subtitles, and icons', async ({ mount, page }) => {
  await mount(`
    <w-command id="cmd"
      items='[{"type":"subheader","title":"Files"},{"title":"Find","value":"find","subtitle":"By name","icon":"F","shortcut":"P"},{"type":"divider"},{"title":"Quit","value":"quit"}]'></w-command>
  `);

  await expect(page.locator('#cmd .w-command-subheader')).toHaveCount(1);
  await expect(page.locator('#cmd .w-command-divider')).toHaveCount(1);
  await expect(page.locator('#cmd w-command-item')).toHaveCount(2);
  await expect(page.locator('#cmd w-command-item[value="find"] .w-command-item-subtitle')).toHaveText('By name');
  await expect(page.locator('#cmd w-command-item[value="find"] .w-command-item-icon')).toHaveText('F');
});

test('w-command opens an overlay via hotkey/show() and closes on Escape', async ({ mount, page }) => {
  await mount(`
    <w-command id="cmd" hotkey="mod+k" placeholder="Search…">
      <w-command-item value="profile">Profile</w-command-item>
    </w-command>
  `);

  await expect(page.locator('#cmd .w-command-overlay')).not.toHaveClass(/open/);

  await page.locator('#cmd').evaluate((el) => el.show());
  await expect(page.locator('#cmd .w-command-overlay')).toHaveClass(/open/);

  await page.locator('#cmd .w-command-input').press('Escape');
  await expect(page.locator('#cmd .w-command-overlay')).not.toHaveClass(/open/);
});
