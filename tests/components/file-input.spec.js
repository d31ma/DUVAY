import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

function addFiles(input, files) {
  const dt = new DataTransfer();
  for (const file of files) {
    dt.items.add(new File(file.content ? [file.content] : [], file.name, { type: file.type || '' }));
  }
  input.files = dt.files;
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

test('renders simple file input with label and empty state', async ({ mount, page }) => {
  await mount('<w-file-input id="fi" label="Upload"></w-file-input>');
  await expect(page.locator('#fi .w-file-input-label')).toHaveText('Upload');
  await expect(page.locator('#fi .w-file-input-name')).toHaveText('No file chosen');
});

test('selecting files updates simple file input name', async ({ mount, page }) => {
  await mount('<w-file-input id="fi" label="Upload"></w-file-input>');
  await page.locator('#fi input[type="file"]').evaluate(addFiles, [{ name: 'hello.txt', type: 'text/plain', content: 'hello' }]);
  await expect(page.locator('#fi .w-file-input-name')).toHaveText('hello.txt');
});

test('renders enhanced file input with placeholder, chips, counter, and hint', async ({ mount, page }) => {
  await mount(`
    <w-file-input id="fi" label="Attachments" chips counter show-size
      placeholder="Drop files" hint="Select attachments"></w-file-input>
  `);
  await expect(page.locator('#fi .w-field-label')).toHaveText('Attachments');
  await expect(page.locator('#fi .w-file-input-placeholder')).toHaveText('Drop files');
  await expect(page.locator('#fi .w-field-hint')).toHaveText('Select attachments · 0 files');
});

test('selecting files renders chips with sizes and updates counter', async ({ mount, page }) => {
  await mount('<w-file-input id="fi" label="Attachments" chips counter show-size multiple></w-file-input>');
  await page.locator('#fi input[type="file"]').evaluate(addFiles, [
    { name: 'one.txt', type: 'text/plain', content: 'one' },
    { name: 'two.txt', type: 'text/plain', content: 'two content' },
  ]);
  await expect(page.locator('#fi .w-file-input-chip')).toHaveCount(2);
  await expect(page.locator('#fi .w-file-input-chip').first()).toContainText('one.txt');
  await expect(page.locator('#fi .w-file-input-chip').first()).toContainText('3 B');
  await expect(page.locator('#fi .w-field-hint')).toContainText('2 files');
});

test('removing a chip via keyboard updates selection', async ({ mount, page }) => {
  await mount('<w-file-input id="fi" chips multiple></w-file-input>');
  await page.locator('#fi input[type="file"]').evaluate(addFiles, [
    { name: 'a.txt', content: 'a' },
    { name: 'b.txt', content: 'b' },
  ]);
  await page.locator('#fi .w-file-input-chip').first().locator('.w-chip-close').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#fi .w-file-input-chip')).toHaveCount(1);
  await expect(page.locator('#fi .w-file-input-chip')).toContainText('b.txt');
});

test('clearable button clears all files', async ({ mount, page }) => {
  await mount('<w-file-input id="fi" clearable chips multiple placeholder="No files"></w-file-input>');
  await page.locator('#fi input[type="file"]').evaluate(addFiles, [{ name: 'a.txt', content: 'a' }]);
  await page.locator('#fi .w-file-input-clear').click();
  await expect(page.locator('#fi .w-file-input-chip')).toHaveCount(0);
  await expect(page.locator('#fi .w-file-input-placeholder')).toBeVisible();
});

test('emits change with files detail', async ({ mount, page }) => {
  await mount('<w-file-input id="fi"></w-file-input>');
  await recordEvents(page, '#fi', ['change']);
  await page.locator('#fi input[type="file"]').evaluate(addFiles, [{ name: 'x.txt', type: 'text/plain', content: 'x' }]);
  const events = await readEvents(page, '#fi');
  expect(events).toHaveLength(1);
  expect(events[0].type).toBe('change');
  expect(events[0].detail.files).toEqual([{ name: 'x.txt', size: 1, type: 'text/plain' }]);
  expect(events[0].detail.value).toEqual([{ name: 'x.txt', size: 1, type: 'text/plain' }]);
});

test('disabled file input does not show clear button', async ({ mount, page }) => {
  await mount('<w-file-input id="fi" disabled clearable></w-file-input>');
  await expect(page.locator('#fi input[type="file"]')).toBeDisabled();
  await expect(page.locator('#fi .w-file-input-clear')).not.toBeVisible();
});

test('drag-and-drop sets files when not disabled', async ({ mount, page }) => {
  await mount('<w-file-input id="fi" chips></w-file-input>');
  await page.locator('#fi .w-file-input-field').evaluate((field) => {
    const dt = new DataTransfer();
    dt.items.add(new File(['drop'], 'dropped.txt', { type: 'text/plain' }));
    field.dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true }));
  });
  await expect(page.locator('#fi .w-file-input-chip')).toHaveCount(1);
  await expect(page.locator('#fi .w-file-input-chip')).toContainText('dropped.txt');
});

test('truncates long file names', async ({ mount, page }) => {
  await mount('<w-file-input id="fi" chips truncate-length="12"></w-file-input>');
  await page.locator('#fi input[type="file"]').evaluate(addFiles, [{ name: 'very-long-file-name.txt', content: 'x' }]);
  await expect(page.locator('#fi .w-file-input-chip')).toContainText('very-…me.txt');
});

test('forwards name attribute to native input', async ({ mount, page }) => {
  await mount('<w-file-input id="fi" name="resume" accept=".pdf"></w-file-input>');

  await expect(page.locator('#fi input[type="file"]')).toHaveAttribute('name', 'resume');
});

test('readonly prevents file selection via drop and dialog activation', async ({ mount, page }) => {
  await mount('<w-file-input id="fi" chips readonly=""></w-file-input>');

  const input = page.locator('#fi input[type="file"]');
  await expect(input).toHaveAttribute('readonly');
  await expect(input).toHaveAttribute('tabindex', '-1');

  await page.locator('#fi .w-file-input-field').evaluate((field) => {
    const dt = new DataTransfer();
    dt.items.add(new File(['drop'], 'dropped.txt', { type: 'text/plain' }));
    field.dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true }));
  });

  await expect(page.locator('#fi .w-file-input-chip')).toHaveCount(0);
});
