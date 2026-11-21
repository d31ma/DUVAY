import { expect, test } from '../setup/component-test.js';

async function accessibleNames(page) {
  const session = await page.context().newCDPSession(page);
  const { nodes } = await session.send('Accessibility.getFullAXTree');
  await session.detach();
  return nodes
    .filter((node) => !node.ignored)
    .map((node) => node.name?.value || '')
    .filter(Boolean);
}

async function expectItemsHidden(page, names) {
  await expect.poll(async () => (await accessibleNames(page)).filter((name) => names.includes(name))).toEqual([]);
}

async function expectItemsShown(page, names) {
  await expect.poll(async () => [...new Set((await accessibleNames(page)).filter((name) => names.includes(name)))].sort()).toEqual([...names].sort());
}

function menuItems() {
  return '<button role="menuitem">Rename file</button><button role="menuitem">Move file</button>';
}

function itemNames() {
  return ['Rename file', 'Move file'];
}

test('closed w-menu keeps its items out of the Tab order and the accessibility tree', async ({ mount, page }) => {
  await mount(`<w-menu id="menu" label="File actions">${menuItems()}</w-menu><button id="after">After</button>`);
  const activator = page.locator('#menu .w-menu-activator');
  const rename = page.locator('#menu [role="menuitem"]').filter({ hasText: 'Rename file' });
  const move = page.locator('#menu [role="menuitem"]').filter({ hasText: 'Move file' });

  await activator.focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#after')).toBeFocused();
  await expectItemsHidden(page, itemNames());

  await activator.focus();
  await page.keyboard.press('ArrowDown');
  await expect(rename).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(move).toBeFocused();
  await expectItemsShown(page, itemNames());

  await page.keyboard.press('Escape');
  await expect(activator).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#after')).toBeFocused();
  await expectItemsHidden(page, itemNames());
});

test('w-menu moves Tab from an open item to the next control after the menu', async ({ mount, page }) => {
  await mount(`<w-menu id="menu" label="File actions">${menuItems()}</w-menu><button id="after">After</button>`);

  await page.locator('#menu .w-menu-activator').focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Tab');
  await expect(page.locator('#menu')).not.toHaveAttribute('open', '');
  await expect(page.locator('#after')).toBeFocused();
  await expectItemsHidden(page, itemNames());
});

test('w-menu moves Shift+Tab from an open item back to its activator', async ({ mount, page }) => {
  await mount(`<button id="before">Before</button><w-menu id="menu" label="File actions">${menuItems()}</w-menu>`);

  await page.locator('#menu .w-menu-activator').focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#menu')).not.toHaveAttribute('open', '');
  await expect(page.locator('#menu .w-menu-activator')).toBeFocused();
  await expectItemsHidden(page, itemNames());
});

test('closed w-menu with an external activator keeps its items out of the Tab order', async ({ mount, page }) => {
  await mount(`<button id="trigger">More</button><w-menu id="menu" activator="trigger">${menuItems()}</w-menu><button id="after">After</button>`);

  await page.locator('#trigger').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#after')).toBeFocused();
  await expectItemsHidden(page, itemNames());

  await page.locator('#trigger').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#menu [role="menuitem"]').first()).toBeFocused();
  await expectItemsShown(page, itemNames());

  await page.keyboard.press('Escape');
  await expect(page.locator('#trigger')).toBeFocused();
  await expectItemsHidden(page, itemNames());
});

test('closed w-dropdown-menu keeps its items out of the Tab order and the accessibility tree', async ({ mount, page }) => {
  await mount(`<w-dropdown-menu id="menu" label="File actions">${menuItems()}</w-dropdown-menu><button id="after">After</button>`);
  const trigger = page.locator('#menu .w-dropdown-menu-trigger');
  const rename = page.locator('#menu [role="menuitem"]').filter({ hasText: 'Rename file' });
  const move = page.locator('#menu [role="menuitem"]').filter({ hasText: 'Move file' });

  await trigger.focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#after')).toBeFocused();
  await expectItemsHidden(page, itemNames());

  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  await expect(rename).toBeFocused();
  await page.keyboard.press('End');
  await expect(move).toBeFocused();
  await expectItemsShown(page, itemNames());

  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#after')).toBeFocused();
  await expectItemsHidden(page, itemNames());
});

test('w-dropdown-menu moves Tab from an open item to the next control after the menu', async ({ mount, page }) => {
  await mount(`<w-dropdown-menu id="menu" label="File actions">${menuItems()}</w-dropdown-menu><button id="after">After</button>`);

  await page.locator('#menu .w-dropdown-menu-trigger').focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Tab');
  await expect(page.locator('#menu')).not.toHaveAttribute('open', '');
  await expect(page.locator('#after')).toBeFocused();
  await expectItemsHidden(page, itemNames());
});

test('w-dropdown-menu moves Shift+Tab from an open item back to its activator', async ({ mount, page }) => {
  await mount(`<button id="before">Before</button><w-dropdown-menu id="menu" label="File actions">${menuItems()}</w-dropdown-menu>`);

  await page.locator('#menu .w-dropdown-menu-trigger').focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#menu')).not.toHaveAttribute('open', '');
  await expect(page.locator('#menu .w-dropdown-menu-trigger')).toBeFocused();
  await expectItemsHidden(page, itemNames());
});

test('closed w-menubar-item keeps its items out of the Tab order and the accessibility tree', async ({ mount, page }) => {
  await mount(`
    <w-menubar>
      <w-menubar-item id="file" label="File">${menuItems()}</w-menubar-item>
      <w-menubar-item id="edit" label="Edit"><button role="menuitem">Undo typing</button></w-menubar-item>
    </w-menubar>
    <button id="after">After</button>
  `);
  const fileTrigger = page.locator('#file .w-menubar-trigger');
  const editTrigger = page.locator('#edit .w-menubar-trigger');

  await fileTrigger.focus();
  await page.keyboard.press('Tab');
  await expect(editTrigger).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#after')).toBeFocused();
  await expectItemsHidden(page, [...itemNames(), 'Undo typing']);

  await fileTrigger.focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#file [role="menuitem"]').filter({ hasText: 'Rename file' })).toBeFocused();
  await expectItemsShown(page, itemNames());

  await page.keyboard.press('Escape');
  await expect(fileTrigger).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(editTrigger).toBeFocused();
  await expectItemsHidden(page, itemNames());
});

test('closed w-context-menu keeps its items out of the Tab order and the accessibility tree', async ({ mount, page }) => {
  await mount(`
    <button id="before">Before</button>
    <w-context-menu id="context" label="File actions">
      <div id="target" style="width: 160px; height: 80px;">Right click</div>
      <button slot="content" role="menuitem">Rename file</button>
      <button slot="content" role="menuitem">Move file</button>
    </w-context-menu>
    <button id="after">After</button>
  `);
  const rename = page.locator('#context [role="menuitem"]').filter({ hasText: 'Rename file' });

  await page.locator('#before').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#after')).toBeFocused();
  await expectItemsHidden(page, itemNames());

  await page.locator('#target').click({ button: 'right', position: { x: 20, y: 20 } });
  await expect(page.locator('#context')).toHaveAttribute('open', '');
  await rename.focus();
  await expect(rename).toBeFocused();
  await expectItemsShown(page, itemNames());

  await page.keyboard.press('Escape');
  await expect(page.locator('#context')).not.toHaveAttribute('open', '');
  await page.locator('#before').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#after')).toBeFocused();
  await expectItemsHidden(page, itemNames());
});

test('closed CSS-class .w-menu keeps its items out of the Tab order and the accessibility tree', async ({ mount, page }) => {
  await mount(`
    <div id="menu" class="w-menu w-menu--bottom-start">
      <button id="trigger" class="w-btn" type="button" aria-haspopup="menu">File actions</button>
      <div class="w-menu-content" role="menu">
        <button class="w-menu-item" role="menuitem">Rename file</button>
        <button class="w-menu-item" role="menuitem">Move file</button>
      </div>
    </div>
    <button id="after">After</button>
  `);
  const rename = page.locator('#menu [role="menuitem"]').filter({ hasText: 'Rename file' });

  await page.locator('#trigger').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#after')).toBeFocused();
  await expectItemsHidden(page, itemNames());

  await page.locator('#menu').evaluate((menu) => menu.classList.add('open'));
  await page.locator('#trigger').focus();
  await page.keyboard.press('Tab');
  await expect(rename).toBeFocused();
  await expectItemsShown(page, itemNames());

  await page.locator('#menu').evaluate((menu) => menu.classList.remove('open'));
  await expectItemsHidden(page, itemNames());
  await page.locator('#trigger').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#after')).toBeFocused();
});

test('a closed submenu inside an open w-menu keeps its items out of the Tab order', async ({ mount, page }) => {
  await mount(`
    <w-menu id="menu" label="File actions">
      <button role="menuitem">Rename file</button>
      <w-dropdown-menu id="sub" submenu label="Share">
        <button role="menuitem">Copy link</button>
      </w-dropdown-menu>
    </w-menu>
    <button id="after">After</button>
  `);

  await page.locator('#menu .w-menu-activator').focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#menu [role="menuitem"]').filter({ hasText: 'Rename file' })).toBeFocused();
  await expectItemsShown(page, ['Rename file', 'Share']);
  await expectItemsHidden(page, ['Copy link']);

  await page.locator('#sub .w-dropdown-menu-trigger').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#sub [role="menuitem"]').filter({ hasText: 'Copy link' })).toBeFocused();
  await expectItemsShown(page, ['Copy link']);
});
