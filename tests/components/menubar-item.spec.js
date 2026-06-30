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
