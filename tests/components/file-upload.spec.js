import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

function addFiles(input, files) {
  const dt = new DataTransfer();
  for (const file of files) {
    dt.items.add(new File(file.content ? [file.content] : [], file.name, { type: file.type || '' }));
  }
  input.files = dt.files;
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

test('renders dropzone with title, subtitle, divider, and browse button', async ({ mount, page }) => {
  await mount(`
    <w-file-upload id="fu" title="Upload documents" subtitle="PDF, DOC up to 5 MB"
      browse-text="Select files" divider-text="OR"></w-file-upload>
  `);
  await expect(page.locator('#fu .w-file-upload-title')).toHaveText('Upload documents');
  await expect(page.locator('#fu .w-file-upload-subtitle')).toHaveText('PDF, DOC up to 5 MB');
  await expect(page.locator('#fu .w-file-upload-divider span')).toHaveText('OR');
  await expect(page.locator('#fu .w-file-upload-browse')).toHaveText('Select files');
});

test('selecting files renders list items with sizes', async ({ mount, page }) => {
  await mount('<w-file-upload id="fu" clearable show-size multiple></w-file-upload>');
  await page.locator('#fu input[type="file"]').evaluate(addFiles, [
    { name: 'report.pdf', type: 'application/pdf', content: 'pdf content' },
    { name: 'notes.txt', type: 'text/plain', content: 'notes' },
  ]);
  await expect(page.locator('#fu .w-file-upload-item')).toHaveCount(2);
  await expect(page.locator('#fu .w-file-upload-item').first()).toContainText('report.pdf');
  await expect(page.locator('#fu .w-file-upload-item').first()).toContainText('11 B');
});

test('removing an item updates the list', async ({ mount, page }) => {
  await mount('<w-file-upload id="fu" clearable multiple></w-file-upload>');
  await page.locator('#fu input[type="file"]').evaluate(addFiles, [
    { name: 'a.txt', content: 'a' },
    { name: 'b.txt', content: 'b' },
  ]);
  await page.locator('#fu .w-file-upload-item-remove').first().focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#fu .w-file-upload-item')).toHaveCount(1);
  await expect(page.locator('#fu .w-file-upload-item')).toContainText('b.txt');
});

test('multiple mode appends files on repeated selection', async ({ mount, page }) => {
  await mount('<w-file-upload id="fu" multiple clearable></w-file-upload>');
  await page.locator('#fu input[type="file"]').evaluate(addFiles, [{ name: 'first.txt', content: '1' }]);
  await page.locator('#fu input[type="file"]').evaluate(addFiles, [{ name: 'second.txt', content: '2' }]);
  await expect(page.locator('#fu .w-file-upload-item')).toHaveCount(2);
});

test('single mode replaces files on selection', async ({ mount, page }) => {
  await mount('<w-file-upload id="fu" clearable></w-file-upload>');
  await page.locator('#fu input[type="file"]').evaluate(addFiles, [{ name: 'first.txt', content: '1' }]);
  await page.locator('#fu input[type="file"]').evaluate(addFiles, [{ name: 'second.txt', content: '2' }]);
  await expect(page.locator('#fu .w-file-upload-item')).toHaveCount(1);
  await expect(page.locator('#fu .w-file-upload-item')).toContainText('second.txt');
});

test('drag-and-drop sets files', async ({ mount, page }) => {
  await mount('<w-file-upload id="fu"></w-file-upload>');
  await page.locator('#fu .w-file-upload-dropzone').evaluate((dropzone) => {
    const dt = new DataTransfer();
    dt.items.add(new File(['dropped'], 'dropped.txt', { type: 'text/plain' }));
    dropzone.dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true }));
  });
  await expect(page.locator('#fu .w-file-upload-item')).toHaveCount(1);
  await expect(page.locator('#fu .w-file-upload-item')).toContainText('dropped.txt');
});

test('emits change with files detail', async ({ mount, page }) => {
  await mount('<w-file-upload id="fu"></w-file-upload>');
  await recordEvents(page, '#fu', ['change']);
  await page.locator('#fu input[type="file"]').evaluate(addFiles, [{ name: 'x.txt', type: 'text/plain', content: 'x' }]);
  const events = await readEvents(page, '#fu');
  expect(events).toHaveLength(1);
  expect(events[0].type).toBe('change');
  expect(events[0].detail.files).toEqual([{ name: 'x.txt', size: 1, type: 'text/plain' }]);
});

test('disabled dropzone disables browse button and ignores input', async ({ mount, page }) => {
  await mount('<w-file-upload id="fu" disabled></w-file-upload>');
  await expect(page.locator('#fu .w-file-upload-browse')).toBeDisabled();
  await expect(page.locator('#fu input[type="file"]')).toBeDisabled();
});

test('compact density hides title/subtitle/divider and lays out horizontally', async ({ mount, page }) => {
  await mount('<w-file-upload id="fu" density="compact"></w-file-upload>');
  await expect(page.locator('#fu .w-file-upload-dropzone')).toHaveClass(/w-file-upload-dropzone--density-compact/);
  await expect(page.locator('#fu .w-file-upload-title')).not.toBeVisible();
  await expect(page.locator('#fu .w-file-upload-subtitle')).not.toBeVisible();
  await expect(page.locator('#fu .w-file-upload-divider')).not.toBeVisible();
});
