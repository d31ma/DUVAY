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

test('w-command gives each listbox a unique id and matching aria-controls', async ({ mount, page }) => {
  await mount(`
    <w-command id="first"><w-command-item value="one">One</w-command-item></w-command>
    <w-command id="second"><w-command-item value="two">Two</w-command-item></w-command>
  `);

  const ids = await page.locator('.w-command-list').evaluateAll((lists) => lists.map((list) => list.id));
  expect(new Set(ids).size).toBe(2);
  await expect(page.locator('#first .w-command-input')).toHaveAttribute('aria-controls', ids[0]);
  await expect(page.locator('#second .w-command-input')).toHaveAttribute('aria-controls', ids[1]);
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

test('w-command restricts matching to filter-keys', async ({ mount, page }) => {
  await mount(`
    <w-command id="cmd" filter-keys="title,value,subtitle">
      <w-command-item value="alpha" subtitle="Red team" shortcut="Zulu">Open Palette</w-command-item>
      <w-command-item value="beta" subtitle="Blue team">Close Panel</w-command-item>
    </w-command>
  `);

  // Title text matches.
  await page.locator('#cmd .w-command-input').fill('palette');
  await expect(page.locator('#cmd w-command-item[value="alpha"]')).toBeVisible();
  await expect(page.locator('#cmd w-command-item[value="beta"]')).toBeHidden();

  // The value attribute matches.
  await page.locator('#cmd .w-command-input').fill('beta');
  await expect(page.locator('#cmd w-command-item[value="alpha"]')).toBeHidden();
  await expect(page.locator('#cmd w-command-item[value="beta"]')).toBeVisible();

  // Any other listed key falls back to the attribute of that name.
  await page.locator('#cmd .w-command-input').fill('blue team');
  await expect(page.locator('#cmd w-command-item[value="alpha"]')).toBeHidden();
  await expect(page.locator('#cmd w-command-item[value="beta"]')).toBeVisible();

  // Fields outside filter-keys are not searched.
  await page.locator('#cmd .w-command-input').fill('zulu');
  await expect(page.locator('#cmd .w-command-empty')).toBeVisible();
});

test('w-command-item renders avatar, tag and snippet while the option name stays its title', async ({ mount, page }) => {
  await mount(`
    <w-command id="cmd">
      <w-command-item value="ada" prepend-avatar="data:image/gif;base64,R0lGODlhAQABAAAAACw=" subtitle="Engineer" snippet="...wrote the first program..." tag="New" tag-color="success" shortcut="A">Ada Lovelace</w-command-item>
      <w-command-item value="plain">Plain item</w-command-item>
    </w-command>
  `);
  const option = page.locator('#cmd w-command-item[value="ada"] .w-command-item');
  await expect(option).toHaveAccessibleName('Ada Lovelace');
  await expect(option).toHaveAccessibleDescription('Engineer ...wrote the first program... New A');
  await expect(option.locator('.w-command-item-avatar')).toHaveAttribute('aria-hidden', 'true');
  await expect(option.locator('.w-command-item-avatar w-avatar')).toHaveAttribute('image', /^data:image/);
  await expect(option.locator('.w-command-item-tag')).toHaveClass(/w-badge-success/);
  await expect(option.locator('.w-command-item-snippet')).toBeVisible();

  const plain = page.locator('#cmd w-command-item[value="plain"] .w-command-item');
  await expect(plain).toHaveAccessibleName('Plain item');
  await expect(plain).not.toHaveAttribute('aria-describedby', /.+/);
});

test('w-command-item prepend and append slots render and survive a re-render', async ({ mount, page }) => {
  await mount(`
    <w-command id="cmd">
      <w-command-item id="row" value="doc">
        <span slot="prepend" id="lead">#</span>
        Design doc
        <span slot="append" id="trail">Shared</span>
      </w-command-item>
    </w-command>
  `);
  const option = page.locator('#row .w-command-item');
  await expect(option.locator('.w-command-item-prepend #lead')).toBeVisible();
  await expect(option.locator('.w-command-item-append #trail')).toBeVisible();
  await expect(option).toHaveAccessibleName('Design doc');
  await expect(option).toHaveAccessibleDescription('Shared');

  await page.locator('#row').evaluate((el) => el.setAttribute('tag', 'Draft'));
  await expect(page.locator('#row .w-command-item-append #trail')).toBeVisible();
  await expect(page.locator('#row .w-command-item')).toHaveAccessibleDescription('Draft Shared');
});

test('w-command items array renders rich rows and filters on the snippet', async ({ mount, page }) => {
  await mount(`
    <w-command id="cmd"
      items='[{"title":"Inbox","value":"inbox","prependAvatar":"data:image/gif;base64,R0lGODlhAQABAAAAACw=","tag":"3","snippet":"Lunch on Friday?"},{"title":"Archive","value":"archive","snippet":"Old invoices"}]'></w-command>
  `);
  const inbox = page.locator('#cmd w-command-item[value="inbox"]');
  await expect(inbox).toHaveAttribute('prepend-avatar', /^data:image/);
  await expect(inbox.locator('.w-command-item')).toHaveAccessibleName('Inbox');
  await expect(inbox.locator('.w-command-item-tag')).toHaveText('3');

  await page.locator('#cmd .w-command-input').fill('invoices');
  await expect(inbox).toBeHidden();
  await expect(page.locator('#cmd w-command-item[value="archive"]')).toBeVisible();
});

test('w-command filter-keys can target the snippet', async ({ mount, page }) => {
  await mount(`
    <w-command id="cmd" filter-keys="title,snippet">
      <w-command-item value="a" snippet="quarterly report">Alpha</w-command-item>
      <w-command-item value="b" subtitle="quarterly">Beta</w-command-item>
    </w-command>
  `);
  await page.locator('#cmd .w-command-input').fill('quarterly');
  await expect(page.locator('#cmd w-command-item[value="a"]')).toBeVisible();
  await expect(page.locator('#cmd w-command-item[value="b"]')).toBeHidden();
});

test('w-command-palette-item renders rich JSON rows with a title-only name', async ({ mount, page }) => {
  await mount(`
    <div role="listbox" aria-label="Results">
      <w-command-palette-item id="row" item='{"title":"Settings","value":"settings","subtitle":"App","snippet":"Theme and fonts","tag":"Beta","tagColor":"warning","hotkey":"S"}'></w-command-palette-item>
    </div>
  `);
  const option = page.locator('#row .w-command-item');
  await expect(option).toHaveAccessibleName('Settings');
  await expect(option).toHaveAccessibleDescription('App Theme and fonts Beta S');
  await expect(option.locator('.w-command-item-tag')).toHaveClass(/w-badge-warning/);
});
