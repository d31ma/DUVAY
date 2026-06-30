import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-confirm-edit renders a built-in editor with label, value, and action labels', async ({ mount, page }) => {
  await mount('<w-confirm-edit id="edit" label="Name" value="Launch review" cancel-text="Discard" ok-text="Commit"></w-confirm-edit>');

  await expect(page.locator('#edit .w-label')).toHaveText('Name');
  await expect(page.locator('#edit input')).toHaveValue('Launch review');
  await expect(page.locator('#edit [data-cancel]')).toHaveText('Discard');
  await expect(page.locator('#edit [data-save]')).toHaveText('Commit');
  await expect(page.locator('#edit [data-save]')).toBeDisabled();
});

test('w-confirm-edit accepts save-text as an alias for ok-text', async ({ mount, page }) => {
  await mount('<w-confirm-edit id="edit" label="X" save-text="Apply"></w-confirm-edit>');
  await expect(page.locator('#edit [data-save]')).toHaveText('Apply');
});

test('w-confirm-edit keeps edits local until cancel or save', async ({ mount, page }) => {
  await mount('<w-confirm-edit id="edit" label="Name" value="Launch review"></w-confirm-edit>');
  await recordEvents(page, '#edit', ['cancel', 'save']);

  await page.locator('#edit input').fill('Launch review v2');
  await expect(page.locator('#edit [data-save]')).toBeEnabled();
  await expect(page.locator('#edit')).toHaveClass(/dirty/);

  await page.locator('#edit [data-cancel]').click();
  await expect(page.locator('#edit input')).toHaveValue('Launch review');
  await expect(page.locator('#edit [data-save]')).toBeDisabled();

  await page.locator('#edit input').fill('Launch review v3');
  await page.locator('#edit [data-save]').click();

  await expect(page.locator('#edit')).toHaveAttribute('value', 'Launch review v3');
  await expect(page.locator('#edit [data-save]')).toBeDisabled();
  expect(await readEvents(page, '#edit')).toEqual([
    { type: 'cancel', detail: { value: 'Launch review' } },
    { type: 'save', detail: { value: 'Launch review v3' } },
  ]);
});

test('w-confirm-edit disabled keeps OK disabled even when dirty', async ({ mount, page }) => {
  await mount('<w-confirm-edit id="edit" label="Name" value="A" disabled></w-confirm-edit>');
  await expect(page.locator('#edit input')).toBeDisabled();
  await expect(page.locator('#edit [data-save]')).toBeDisabled();
  await expect(page.locator('#edit [data-cancel]')).toBeDisabled();
});

test('w-confirm-edit hide-actions renders no built-in buttons; methods still work', async ({ mount, page }) => {
  await mount('<w-confirm-edit id="edit" label="Name" value="A" hide-actions></w-confirm-edit>');
  await recordEvents(page, '#edit', ['save']);

  await expect(page.locator('#edit [data-save]')).toHaveCount(0);
  await page.locator('#edit input').fill('B');
  await page.locator('#edit').evaluate((el) => el.save());

  await expect(page.locator('#edit')).toHaveAttribute('value', 'B');
  expect(await readEvents(page, '#edit')).toEqual([{ type: 'save', detail: { value: 'B' } }]);
});

test('w-confirm-edit wraps a slotted editor (w-text-field) and tracks its value', async ({ mount, page }) => {
  await mount(`
    <w-confirm-edit id="edit" value="hello">
      <w-text-field label="Title" value="hello"></w-text-field>
    </w-confirm-edit>
  `);
  await recordEvents(page, '#edit', ['save']);

  await expect(page.locator('#edit [data-save]')).toBeDisabled();
  await page.locator('#edit w-text-field .w-text-field-input').fill('world');
  await expect(page.locator('#edit [data-save]')).toBeEnabled();

  await page.locator('#edit [data-save]').click();
  await expect(page.locator('#edit')).toHaveAttribute('value', 'world');
  expect(await readEvents(page, '#edit')).toEqual([{ type: 'save', detail: { value: 'world' } }]);
});

test('w-confirm-edit supports a custom actions slot wired with data-save / data-cancel', async ({ mount, page }) => {
  await mount(`
    <w-confirm-edit id="edit" label="Name" value="A">
      <button slot="actions" data-cancel class="w-btn w-btn-text" type="button">Undo</button>
      <button slot="actions" data-save class="w-btn w-btn-filled" type="button">Apply</button>
    </w-confirm-edit>
  `);
  await recordEvents(page, '#edit', ['save', 'cancel']);

  await page.locator('#edit input').fill('B');
  await page.locator('#edit [data-save]').click();
  await expect(page.locator('#edit')).toHaveAttribute('value', 'B');
  expect(await readEvents(page, '#edit')).toEqual([{ type: 'save', detail: { value: 'B' } }]);
});
