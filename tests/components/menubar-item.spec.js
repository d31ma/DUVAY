import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-menubar-item reflects label, inline, and open attributes', async ({ mount, page }) => {
  await mount(`
    <w-menubar>
      <w-menubar-item id="file" label="File" inline open>
        <button role="menuitem">New</button>
      </w-menubar-item>
    </w-menubar>
  `);

  await expect(page.locator('#file .w-menubar-trigger')).toHaveText('File');
  await expect(page.locator('#file .w-menubar-trigger')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#file .w-menubar-item')).toHaveClass(/open/);
  await expect(page.locator('#file .w-menubar-item')).toHaveClass(/w-menubar-item--inline/);

  await page.locator('#file').evaluate((el) => {
    el.setAttribute('label', 'Project');
    el.removeAttribute('inline');
    el.removeAttribute('open');
  });

  await expect(page.locator('#file .w-menubar-trigger')).toHaveText('Project');
  await expect(page.locator('#file .w-menubar-trigger')).toHaveAttribute('aria-expanded', 'false');
});

test('w-menubar-item opens one item at a time, supports keyboard flow, and emits open-close events', async ({ mount, page }) => {
  await mount(`
    <w-menubar id="menubar">
      <w-menubar-item id="file" label="File"><button role="menuitem">New</button><button role="menuitem">Save</button></w-menubar-item>
      <w-menubar-item id="edit" label="Edit"><button role="menuitem">Undo</button></w-menubar-item>
      <w-menubar-item id="view" label="View"><button role="menuitem">Zoom</button></w-menubar-item>
    </w-menubar>
  `);
  await recordEvents(page, '#file', ['toggle', 'close']);
  await recordEvents(page, '#edit', ['toggle', 'close']);

  await page.locator('#file .w-menubar-trigger').click();
  await expect(page.locator('#file')).toHaveAttribute('open', '');

  await page.locator('#file .w-menubar-trigger').press('ArrowRight');
  await expect(page.locator('#file')).not.toHaveAttribute('open', '');
  await expect(page.locator('#edit')).toHaveAttribute('open', '');

  await page.locator('#edit .w-menubar-trigger').press('Escape');
  await expect(page.locator('#edit')).not.toHaveAttribute('open', '');

  expect((await readEvents(page, '#file')).map((event) => event.type)).toEqual(['toggle']);
  expect((await readEvents(page, '#edit')).map((event) => event.type)).toEqual(['toggle', 'close']);
});

const MENUBAR = `
  <w-menubar id="menubar">
    <w-menubar-item id="file" label="File"><button role="menuitem">New</button><button role="menuitem">Save</button></w-menubar-item>
    <w-menubar-item id="edit" label="Edit"><button role="menuitem">Undo</button></w-menubar-item>
    <w-menubar-item id="view" label="View"><button role="menuitem">Zoom</button></w-menubar-item>
  </w-menubar>
`;

test('w-menubar-item opens with ArrowDown, Enter, and Space and focuses the first menu item', async ({ mount, page }) => {
  await mount(MENUBAR);

  for (const key of ['ArrowDown', 'Enter', ' ']) {
    await page.locator('#file .w-menubar-trigger').press(key);
    await expect(page.locator('#file')).toHaveAttribute('open', '');
    await expect(page.locator('#file [role="menuitem"]:not(.w-menubar-trigger)').first()).toBeFocused();

    await page.locator('#file .w-menubar-trigger').focus();
    await page.locator('#file .w-menubar-trigger').press('Escape');
    await expect(page.locator('#file')).not.toHaveAttribute('open', '');
    await expect(page.locator('#file .w-menubar-trigger')).toHaveAttribute('aria-expanded', 'false');
  }
});

test('w-menubar-item Escape from inside the menu closes it', async ({ mount, page }) => {
  await mount(MENUBAR);

  await page.locator('#file .w-menubar-trigger').press('ArrowDown');
  await page.locator('#file [role="menuitem"]:not(.w-menubar-trigger)').first().press('Escape');

  await expect(page.locator('#file')).not.toHaveAttribute('open', '');
  await expect(page.locator('#file .w-menubar-item')).not.toHaveClass(/open/);
});

test('w-menubar-item ArrowLeft moves to the previous item and wraps around', async ({ mount, page }) => {
  await mount(MENUBAR);

  await page.locator('#edit .w-menubar-trigger').click();
  await page.locator('#edit .w-menubar-trigger').press('ArrowLeft');
  await expect(page.locator('#file')).toHaveAttribute('open', '');
  await expect(page.locator('#edit')).not.toHaveAttribute('open', '');
  await expect(page.locator('#file .w-menubar-trigger')).toBeFocused();

  await page.locator('#file .w-menubar-trigger').press('ArrowLeft');
  await expect(page.locator('#view')).toHaveAttribute('open', '');
  await expect(page.locator('#view .w-menubar-trigger')).toBeFocused();

  await page.locator('#view .w-menubar-trigger').press('ArrowRight');
  await expect(page.locator('#file')).toHaveAttribute('open', '');
});

test('w-menubar-item navigates between siblings without a menubar wrapper', async ({ mount, page }) => {
  await mount(`
    <div>
      <w-menubar-item id="file" label="File"><button role="menuitem">New</button></w-menubar-item>
      <w-menubar-item id="edit" label="Edit"><button role="menuitem">Undo</button></w-menubar-item>
    </div>
  `);

  await page.locator('#file .w-menubar-trigger').press('ArrowRight');
  await expect(page.locator('#edit')).toHaveAttribute('open', '');
  await expect(page.locator('#edit .w-menubar-trigger')).toBeFocused();
});

test('w-menubar-item falls back to the open attribute when a sibling is not upgraded', async ({ mount, page }) => {
  await mount(MENUBAR);

  await page.locator('#edit').evaluate((el) => { el._setOpen = undefined; });
  await page.locator('#file .w-menubar-trigger').click();
  await page.locator('#file .w-menubar-trigger').press('ArrowRight');

  await expect(page.locator('#edit')).toHaveAttribute('open', '');
  await expect(page.locator('#file')).not.toHaveAttribute('open', '');
  await expect(page.locator('#edit .w-menubar-trigger')).toBeFocused();
});

test('w-menubar-item ignores keys it does not handle', async ({ mount, page }) => {
  await mount(MENUBAR);
  await recordEvents(page, '#file', ['toggle', 'close']);

  await page.locator('#file .w-menubar-trigger').press('ArrowUp');
  await page.locator('#file .w-menubar-trigger').press('a');

  await expect(page.locator('#file')).not.toHaveAttribute('open', '');
  await expect(page.locator('#file .w-menubar-trigger')).toBeFocused();
  expect(await readEvents(page, '#file')).toEqual([]);
});
