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

test('clicking the dropzone opens the file chooser and adds the chosen file', async ({ mount, page }) => {
  await mount('<w-file-upload id="fu" multiple clearable></w-file-upload>');

  const [chooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.locator('#fu .w-file-upload-icon').click(),
  ]);
  expect(chooser.isMultiple()).toBe(true);

  await chooser.setFiles({ name: 'clicked.txt', mimeType: 'text/plain', buffer: Buffer.from('hi') });
  await expect(page.locator('#fu .w-file-upload-item')).toHaveCount(1);
  await expect(page.locator('#fu .w-file-upload-item')).toContainText('clicked.txt');
});

test('the dropzone opens the file chooser from the keyboard', async ({ mount, page }) => {
  await mount('<w-file-upload id="fu" clearable></w-file-upload>');
  const dropzone = page.locator('#fu .w-file-upload-dropzone');

  await dropzone.focus();
  await page.keyboard.press('Escape'); // not a dropzone key — nothing happens
  await expect(page.locator('#fu .w-file-upload-item')).toHaveCount(0);

  await dropzone.focus();
  const [chooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.keyboard.press('Enter'),
  ]);
  expect(chooser.isMultiple()).toBe(false);

  await chooser.setFiles({ name: 'typed.txt', mimeType: 'text/plain', buffer: Buffer.from('k') });
  await expect(page.locator('#fu .w-file-upload-item')).toContainText('typed.txt');
});

test('pasting files into the dropzone adds them, unless empty or read-only', async ({ mount, page }) => {
  await mount('<w-file-upload id="fu" multiple clearable></w-file-upload><w-file-upload id="ro" readonly clearable></w-file-upload>');

  const paste = (selector, names) => page.locator(selector).evaluate((dropzone, fileNames) => {
    const dt = new DataTransfer();
    fileNames.forEach((name) => dt.items.add(new File(['payload'], name, { type: 'image/png' })));
    dropzone.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
  }, names);

  await paste('#fu .w-file-upload-dropzone', []);
  await expect(page.locator('#fu .w-file-upload-item')).toHaveCount(0);

  await paste('#ro .w-file-upload-dropzone', ['blocked.png']);
  await expect(page.locator('#ro .w-file-upload-item')).toHaveCount(0);

  await paste('#fu .w-file-upload-dropzone', ['pasted.png', 'pasted-2.png']);
  await expect(page.locator('#fu .w-file-upload-item')).toHaveCount(2);
  await expect(page.locator('#fu .w-file-upload-item').first()).toContainText('pasted.png');
});

test('dragging over the dropzone highlights it until the pointer leaves', async ({ mount, page }) => {
  await mount('<w-file-upload id="fu"></w-file-upload>');
  const dropzone = page.locator('#fu .w-file-upload-dropzone');

  await dropzone.evaluate((el) => el.dispatchEvent(new DragEvent('dragover', { dataTransfer: new DataTransfer(), bubbles: true, cancelable: true })));
  await expect(dropzone).toHaveClass(/w-file-upload-dropzone--dragover/);

  await dropzone.evaluate((el) => el.dispatchEvent(new DragEvent('dragleave', { bubbles: true, cancelable: true })));
  await expect(dropzone).not.toHaveClass(/w-file-upload-dropzone--dragover/);
});

/* ── <w-file-upload> field surface ─────────────────────────────────────────── */

test('label, hint, messages, and error-messages surround the dropzone', async ({ mount, page }) => {
  await mount(`
    <w-file-upload id="fu" label="Attachments" hint="Up to 5 MB"
      messages='["PDF or PNG"]' error-messages='["Too large","Wrong type"]'
      max-errors="2" indent-details></w-file-upload>
  `);

  await expect(page.locator('#fu .w-field-label')).toHaveText('Attachments');
  await expect(page.locator('#fu .w-file-upload')).toHaveClass(/w-field-error/);
  await expect(page.locator('#fu .w-field-hint')).toHaveText('Too large');
  await expect(page.locator('#fu .w-field-message--error')).toHaveText('Wrong type');
  await expect(page.locator('#fu .w-field-details')).toContainText('PDF or PNG');
  await expect(page.locator('#fu .w-field-details')).toHaveClass(/w-field--indent-details/);
});

test('error puts the dropzone in the error state on its own', async ({ mount, page }) => {
  await mount('<w-file-upload id="fu" error></w-file-upload>');
  await expect(page.locator('#fu .w-file-upload')).toHaveClass(/w-field-error/);
  await expect(page.locator('#fu .w-file-upload-dropzone')).toHaveAttribute('aria-invalid', 'true');
});

test('persistent-hint keeps the hint beside an error and hide-details drops the row', async ({ mount, page }) => {
  await mount(`
    <w-file-upload id="kept" hint="Any image" error-messages="Required" persistent-hint></w-file-upload>
    <w-file-upload id="hidden" hint="Any image" hide-details></w-file-upload>
  `);
  await expect(page.locator('#kept .w-field-hint')).toHaveText('Required');
  await expect(page.locator('#kept .w-field-message')).toHaveText('Any image');
  await expect(page.locator('#hidden .w-field-details')).toHaveCount(0);
});

test('validate-on lazy withholds the error until files arrive', async ({ mount, page }) => {
  await mount('<w-file-upload id="fu" validate-on="lazy" error-messages="Required"></w-file-upload>');
  await expect(page.locator('#fu .w-field-hint')).toHaveCount(0);
  await page.locator('#fu input[type="file"]').evaluate(addFiles, [{ name: 'a.txt', content: 'a' }]);
  await expect(page.locator('#fu .w-field-hint')).toHaveText('Required');
});

test('validate-on "blur lazy" waits for the dropzone to lose focus', async ({ mount, page }) => {
  await mount('<w-file-upload id="fu" validate-on="blur lazy" error-messages="Required"></w-file-upload>');
  await page.locator('#fu input[type="file"]').evaluate(addFiles, [{ name: 'a.txt', content: 'a' }]);
  await expect(page.locator('#fu .w-field-hint')).toHaveCount(0);

  await page.locator('#fu .w-file-upload-dropzone').evaluate((el) => { el.focus(); el.blur(); });
  await expect(page.locator('#fu .w-field-hint')).toHaveText('Required');
});

test('name is forwarded and the surface flags become classes', async ({ mount, page }) => {
  await mount(`
    <w-file-upload id="fu" name="docs" center-affix glow hide-spin-buttons
      variant="filled" icon-color="warning"></w-file-upload>
  `);
  await expect(page.locator('#fu input[type="file"]')).toHaveAttribute('name', 'docs');
  const dropzone = page.locator('#fu .w-file-upload-dropzone');
  await expect(dropzone).toHaveClass(/w-field--center-affix/);
  await expect(dropzone).toHaveClass(/w-field--glow/);
  await expect(dropzone).toHaveClass(/w-field--hide-spin-buttons/);
  await expect(dropzone).toHaveClass(/w-field--variant-filled/);
  const tint = await dropzone.evaluate((el) => el.style.getPropertyValue('--w-field-icon-color'));
  expect(tint).toBe('var(--w-warning, warning)');
});

test('prepend-icon and append-icon sit beside the dropzone', async ({ mount, page }) => {
  await mount('<w-file-upload id="fu" prepend-icon="up" append-icon="down"></w-file-upload>');
  await expect(page.locator('#fu .w-file-upload-outer > .w-field-prepend')).toHaveText('up');
  await expect(page.locator('#fu .w-file-upload-outer > .w-field-append')).toHaveText('down');
});

test('hide-browse drops the divider and the browse button', async ({ mount, page }) => {
  await mount('<w-file-upload id="fu" hide-browse></w-file-upload>');
  await expect(page.locator('#fu .w-file-upload-browse')).toHaveCount(0);
  await expect(page.locator('#fu .w-file-upload-divider')).toHaveCount(0);
});

test('inset-file-list renders the list inside the dropzone', async ({ mount, page }) => {
  await mount('<w-file-upload id="fu" inset-file-list clearable></w-file-upload>');
  await page.locator('#fu input[type="file"]').evaluate(addFiles, [{ name: 'a.txt', content: 'a' }]);
  await expect(page.locator('#fu .w-file-upload-dropzone')).toHaveClass(/w-file-upload-dropzone--inset/);
  await expect(page.locator('#fu .w-file-upload-dropzone .w-file-upload-list .w-file-upload-item')).toHaveCount(1);
});

test('scrim veils the dropzone while files hover it', async ({ mount, page }) => {
  await mount(`
    <w-file-upload id="veiled" scrim="success"></w-file-upload>
    <w-file-upload id="off" scrim="false"></w-file-upload>
  `);
  const dropzone = page.locator('#veiled .w-file-upload-dropzone');
  await expect(dropzone).toHaveClass(/w-file-upload-dropzone--scrim/);
  await expect(page.locator('#off .w-file-upload-dropzone')).not.toHaveClass(/w-file-upload-dropzone--scrim/);
  const tint = await dropzone.evaluate((el) => el.style.getPropertyValue('--w-file-upload-scrim'));
  expect(tint).toBe('var(--w-success, success)');

  const veil = () => dropzone.evaluate((el) => getComputedStyle(el, '::after').opacity);
  expect(await veil()).toBe('0');
  await dropzone.evaluate((el) => el.dispatchEvent(new DragEvent('dragover', { dataTransfer: new DataTransfer(), bubbles: true, cancelable: true })));
  await expect.poll(veil).not.toBe('0');
});

test('a bare scrim uses the default tint', async ({ mount, page }) => {
  await mount('<w-file-upload id="fu" scrim></w-file-upload>');
  const dropzone = page.locator('#fu .w-file-upload-dropzone');
  await expect(dropzone).toHaveClass(/w-file-upload-dropzone--scrim/);
  expect(await dropzone.evaluate((el) => el.style.getPropertyValue('--w-file-upload-scrim'))).toBe('');
});

test('filter-by-type turns away files the dropzone should not take', async ({ mount, page }) => {
  await mount('<w-file-upload id="fu" multiple clearable filter-by-type="image/*"></w-file-upload>');
  await recordEvents(page, '#fu', ['rejected']);
  await page.locator('#fu input[type="file"]').evaluate(addFiles, [
    { name: 'shot.png', type: 'image/png', content: 'a' },
    { name: 'notes.txt', type: 'text/plain', content: 'bb' },
  ]);

  await expect(page.locator('#fu .w-file-upload-item')).toHaveCount(1);
  await expect(page.locator('#fu .w-file-upload-item')).toContainText('shot.png');
  const events = await readEvents(page, '#fu');
  expect(events[0].detail.files).toEqual([{ name: 'notes.txt', size: 2, type: 'text/plain' }]);
});

test('filter-by-type can reject the whole selection', async ({ mount, page }) => {
  await mount('<w-file-upload id="fu" clearable filter-by-type=".pdf"></w-file-upload>');
  await page.locator('#fu input[type="file"]').evaluate(addFiles, [{ name: 'notes.txt', content: 'a' }]);
  await expect(page.locator('#fu .w-file-upload-item')).toHaveCount(0);
});

test('the files property drives the list', async ({ mount, page }) => {
  await mount('<w-file-upload id="fu" clearable multiple></w-file-upload>');
  await page.locator('#fu').evaluate((el) => { el.files = [new File(['x'], 'set.txt')]; });
  await expect(page.locator('#fu .w-file-upload-item')).toContainText('set.txt');
});

/* ── <w-file-upload-dropzone> ──────────────────────────────────────────────── */

test('the standalone dropzone renders the upload chrome around its children', async ({ mount, page }) => {
  await mount('<w-file-upload-dropzone id="dz" title="Drop here" browse-text="Pick">Extra</w-file-upload-dropzone>');
  await expect(page.locator('#dz .w-file-upload-title')).toHaveText('Drop here');
  await expect(page.locator('#dz .w-file-upload-browse')).toHaveText('Pick');
  await expect(page.locator('#dz .w-file-upload-dropzone')).toContainText('Extra');
});

test('the standalone dropzone accepts a drop and lists the file', async ({ mount, page }) => {
  await mount('<w-file-upload-dropzone id="dz" clearable show-size></w-file-upload-dropzone>');
  await page.locator('#dz .w-file-upload-dropzone').evaluate((el) => {
    const dt = new DataTransfer();
    dt.items.add(new File(['dropped'], 'dropped.txt', { type: 'text/plain' }));
    el.dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true }));
  });
  await expect(page.locator('#dz .w-file-upload-item')).toContainText('dropped.txt');
  await expect(page.locator('#dz .w-file-upload-item-size')).toHaveText('7 B');
});

test('length, thickness, opacity, and the hover delays reach the dropzone', async ({ mount, page }) => {
  await mount(`
    <w-file-upload-dropzone id="dz" length="240" thickness="3"
      opacity="0.6" open-delay="120" close-delay="80" scrim></w-file-upload-dropzone>
  `);
  const dropzone = page.locator('#dz .w-file-upload-dropzone');
  const style = await dropzone.evaluate((el) => ({
    length: el.style.getPropertyValue('--w-file-upload-divider-length'),
    thickness: el.style.getPropertyValue('--w-file-upload-divider-thickness'),
    opacity: getComputedStyle(el).opacity,
    delay: getComputedStyle(el, '::after').transitionDelay,
  }));
  expect(style.length).toBe('240px');
  expect(style.thickness).toBe('3px');
  expect(style.opacity).toBe('0.6');
  expect(style.delay).toBe('0.08s');

  const divider = await page.locator('#dz .w-file-upload-divider').evaluate((el) => getComputedStyle(el).maxWidth);
  expect(divider).toBe('240px');
});

test('divider lengths keep an explicit unit', async ({ mount, page }) => {
  await mount('<w-file-upload-dropzone id="dz" length="10rem" thickness="0.125rem"></w-file-upload-dropzone>');
  const width = await page.locator('#dz .w-file-upload-divider').evaluate((el) => getComputedStyle(el).maxWidth);
  expect(width).toBe('160px');
});

/* ── <w-file-upload-item> ──────────────────────────────────────────────────── */

test('an item shows the file name, subtitle, and size', async ({ mount, page }) => {
  await mount(`
    <w-file-upload-item id="it" file='{"name":"report.pdf","size":2048,"type":"application/pdf"}'
      subtitle="Uploaded today" show-size index="3"></w-file-upload-item>
  `);
  await expect(page.locator('#it .w-file-upload-item-name')).toHaveText('report.pdf');
  await expect(page.locator('#it .w-file-upload-item-subtitle')).toHaveText('Uploaded today');
  await expect(page.locator('#it .w-file-upload-item-size')).toHaveText('2.0 KB');
  await expect(page.locator('#it .w-file-upload-item')).toHaveAttribute('data-index', '3');
});

test('title overrides the file name and a malformed file record is ignored', async ({ mount, page }) => {
  await mount(`
    <w-file-upload-item id="named" title="Q3 report" file='{"name":"a.pdf"}'></w-file-upload-item>
    <w-file-upload-item id="broken" title="Loose" file="not json" show-size></w-file-upload-item>
  `);
  await expect(page.locator('#named .w-file-upload-item-name')).toHaveText('Q3 report');
  await expect(page.locator('#broken .w-file-upload-item-name')).toHaveText('Loose');
  await expect(page.locator('#broken .w-file-upload-item-size')).toHaveCount(0);
});

test('an item emits remove from the clear button, by click and by keyboard', async ({ mount, page }) => {
  await mount('<w-file-upload-item id="it" title="a.txt" value="a" index="0" clearable></w-file-upload-item>');
  await recordEvents(page, '#it', ['remove', 'change']);

  await page.locator('#it .w-file-upload-item-remove').click();
  await page.locator('#it .w-file-upload-item-remove').focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Escape');

  const events = await readEvents(page, '#it');
  expect(events.map((event) => event.type)).toEqual(['remove', 'remove']);
  expect(events[0].detail).toEqual({ value: 'a', index: '0', title: 'a.txt' });
});

test('clicking an item reports the choice; the remove button does not', async ({ mount, page }) => {
  await mount('<w-file-upload-item id="it" title="a.txt" clearable></w-file-upload-item>');
  await recordEvents(page, '#it', ['change']);
  await page.locator('#it .w-file-upload-item-remove').click();
  await page.locator('#it .w-file-upload-item-name').click();
  const events = await readEvents(page, '#it');
  expect(events).toHaveLength(1);
  expect(events[0].detail.title).toBe('a.txt');
});

test('href renders an anchor and link marks a plain row interactive', async ({ mount, page }) => {
  await mount(`
    <w-file-upload-item id="linked" title="a.txt" href="/files/a.txt" active></w-file-upload-item>
    <w-file-upload-item id="pressable" title="b.txt" link></w-file-upload-item>
  `);
  await expect(page.locator('#linked a.w-file-upload-item')).toHaveAttribute('href', '/files/a.txt');
  await expect(page.locator('#linked a.w-file-upload-item')).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('#pressable .w-file-upload-item')).toHaveAttribute('role', 'link');
  await expect(page.locator('#pressable .w-file-upload-item')).toHaveAttribute('tabindex', '0');

  await recordEvents(page, '#pressable', ['change']);
  await page.locator('#pressable .w-file-upload-item').focus();
  await page.keyboard.press('Enter');
  expect(await readEvents(page, '#pressable')).toHaveLength(1);
});

test('file upload items reject dangerous links and image URLs', async ({ mount, page }) => {
  const safePixel = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
  await mount(`
    <w-file-upload-item id="relative" title="safe" href="/files/safe.txt"></w-file-upload-item>
    <w-file-upload-item id="script" title="bad" href="javascript:alert(1)"></w-file-upload-item>
    <w-file-upload-item id="unsafe-avatar" title="bad" prepend-avatar="data:text/html,bad"></w-file-upload-item>
    <w-file-upload-item id="safe-avatar" title="safe" prepend-avatar="${safePixel}"></w-file-upload-item>
  `);

  await expect(page.locator('#relative a')).toHaveAttribute('href', '/files/safe.txt');
  await expect(page.locator('#script a')).toHaveCount(0);
  await expect(page.locator('#script .w-file-upload-item')).not.toHaveAttribute('href');
  await expect(page.locator('#unsafe-avatar img')).toHaveCount(0);
  await expect(page.locator('#unsafe-avatar .w-avatar-text')).toHaveText('data:text/html,bad');
  await expect(page.locator('#safe-avatar img')).toHaveAttribute('src', safePixel);

  await mount('<w-file-upload-item id="preview" file-icon="file"></w-file-upload-item>');
  await page.locator('#preview').evaluate((el) => {
    el.file = { name: 'bad.png', type: 'image/png', url: 'vbscript:msgbox(1)' };
  });
  await expect(page.locator('#preview img')).toHaveCount(0);
  await expect(page.locator('#preview .w-file-upload-item-icon')).toHaveText('file');
});

test('active and active-class mark the row', async ({ mount, page }) => {
  await mount('<w-file-upload-item id="it" title="a.txt" active active-class="picked"></w-file-upload-item>');
  const row = page.locator('#it .w-file-upload-item');
  await expect(row).toHaveClass(/w-file-upload-item--active/);
  await expect(row).toHaveClass(/picked/);
  await expect(row).toHaveAttribute('aria-selected', 'true');

  await page.locator('#it').evaluate((el) => { el.active = false; });
  await expect(page.locator('#it .w-file-upload-item')).not.toHaveClass(/w-file-upload-item--active/);
});

test('presentation attributes become item modifier classes', async ({ mount, page }) => {
  await mount(`
    <w-file-upload-item id="it" title="a.txt" nav slim lines="two"
      variant="tonal" prepend-gap="12"></w-file-upload-item>
  `);
  const row = page.locator('#it .w-file-upload-item');
  await expect(row).toHaveClass(/w-file-upload-item--nav/);
  await expect(row).toHaveClass(/w-file-upload-item--slim/);
  await expect(row).toHaveClass(/w-file-upload-item--two-line/);
  await expect(row).toHaveClass(/w-file-upload-item--variant-tonal/);
  const gap = await row.evaluate((el) => el.style.getPropertyValue('--w-file-upload-item-prepend-gap'));
  expect(gap).toBe('12px');
});

test('lines="one" needs no modifier', async ({ mount, page }) => {
  await mount('<w-file-upload-item id="it" title="a.txt" lines="one"></w-file-upload-item>');
  await expect(page.locator('#it .w-file-upload-item')).not.toHaveClass(/-line/);
});

test('icons and avatars render on both sides', async ({ mount, page }) => {
  await mount(`
    <w-file-upload-item id="icons" title="a.txt" prepend-icon="doc" append-icon="more"></w-file-upload-item>
    <w-file-upload-item id="avatars" title="b.txt" prepend-avatar="/me.png" append-avatar="AB"></w-file-upload-item>
  `);
  await expect(page.locator('#icons .w-file-upload-item-prepend')).toHaveText('doc');
  await expect(page.locator('#icons .w-file-upload-item-append')).toHaveText('more');
  await expect(page.locator('#avatars .w-file-upload-item-prepend img')).toHaveAttribute('src', '/me.png');
  await expect(page.locator('#avatars .w-file-upload-item-append .w-avatar-text')).toHaveText('AB');
});

test('file-icon leads the row and an image file previews instead', async ({ mount, page }) => {
  await mount(`
    <w-file-upload-item id="doc" file='{"name":"a.pdf","type":"application/pdf"}' file-icon="pdf"></w-file-upload-item>
    <w-file-upload-item id="shot" file='{"name":"a.png","type":"image/png","url":"/a.png"}' file-icon="img"></w-file-upload-item>
  `);
  await expect(page.locator('#doc .w-file-upload-item-prepend')).toHaveText('pdf');
  await expect(page.locator('#shot .w-file-upload-item-preview')).toHaveAttribute('src', '/a.png');
});

test('a File assigned as a property previews from its own address', async ({ mount, page }) => {
  await mount('<w-file-upload-item id="it" show-size></w-file-upload-item>');
  await page.locator('#it').evaluate((el) => {
    el.file = new File(['12345'], 'shot.png', { type: 'image/png' });
  });
  await expect(page.locator('#it .w-file-upload-item-name')).toHaveText('shot.png');
  await expect(page.locator('#it .w-file-upload-item-size')).toHaveText('5 B');
  const src = await page.locator('#it .w-file-upload-item-preview').getAttribute('src');
  expect(src.startsWith('blob:')).toBe(true);
});

test('ripple opts the row into the press effect and slots still render', async ({ mount, page }) => {
  await mount('<w-file-upload-item id="it" ripple><span slot="prepend">P</span>Body<span slot="append">A</span></w-file-upload-item>');
  await expect(page.locator('#it .w-file-upload-item')).toHaveClass(/w-ripple-host/);
  await expect(page.locator('#it .w-file-upload-item-prepend')).toHaveText('P');
  await expect(page.locator('#it .w-file-upload-item-append')).toHaveText('A');
  await expect(page.locator('#it .w-file-upload-item-content')).toHaveText('Body');
});

/* ── <w-file-upload-list> ──────────────────────────────────────────────────── */

test('the list renders rows from files, with sizes and remove buttons', async ({ mount, page }) => {
  await mount(`
    <w-file-upload-list id="l" show-size clearable
      files='[{"name":"a.txt","size":10},{"name":"b.txt","size":2048}]'></w-file-upload-list>
  `);
  await expect(page.locator('#l w-file-upload-item')).toHaveCount(2);
  await expect(page.locator('#l .w-file-upload-item-name').first()).toHaveText('a.txt');
  await expect(page.locator('#l .w-file-upload-item-size').last()).toHaveText('2.0 KB');
  await expect(page.locator('#l .w-file-upload-item-remove')).toHaveCount(2);
  await expect(page.locator('#l .w-file-upload-list')).toHaveAttribute('role', 'list');
});

test('items accepts plain strings and the shell still slots children', async ({ mount, page }) => {
  await mount(`
    <w-file-upload-list id="strings" items='["one.txt","two.txt"]'></w-file-upload-list>
    <w-file-upload-list id="slotted"><div class="own">Authored</div></w-file-upload-list>
  `);
  await expect(page.locator('#strings .w-file-upload-item-name').first()).toHaveText('one.txt');
  await expect(page.locator('#slotted .own')).toHaveText('Authored');
  await expect(page.locator('#slotted w-file-upload-item')).toHaveCount(0);
});

test('selectable rows report the selection and expose it to assistive tech', async ({ mount, page }) => {
  await mount('<w-file-upload-list id="l" selectable items=\'["a","b"]\'></w-file-upload-list>');
  await recordEvents(page, '#l', ['change']);

  await expect(page.locator('#l .w-file-upload-list')).toHaveAttribute('role', 'listbox');
  await page.locator('#l w-file-upload-item').first().click();

  await expect(page.locator('#l .w-file-upload-item').first()).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#l .w-file-upload-item').first()).toHaveClass(/w-file-upload-item--active/);
  const events = await readEvents(page, '#l');
  expect(events).toHaveLength(1);
  expect(events[0].detail).toEqual({ value: ['a'], name: 'selected', id: 'a' });

  // single-leaf keeps one row at a time.
  await page.locator('#l w-file-upload-item').last().click();
  await expect(page.locator('#l .w-file-upload-item').first()).toHaveAttribute('aria-selected', 'false');
  await expect(page.locator('#l .w-file-upload-item').last()).toHaveAttribute('aria-selected', 'true');
});

test('an independent strategy with multiple keeps every chosen row', async ({ mount, page }) => {
  await mount(`
    <w-file-upload-list id="l" selectable multiple select-strategy="independent"
      items='["a","b"]'></w-file-upload-list>
  `);
  await expect(page.locator('#l .w-file-upload-list')).toHaveAttribute('aria-multiselectable', 'true');
  await page.locator('#l w-file-upload-item').first().click();
  await page.locator('#l w-file-upload-item').last().click();
  await expect(page.locator('#l .w-file-upload-item[aria-selected="true"]')).toHaveCount(2);

  await page.locator('#l w-file-upload-item').first().click();
  await expect(page.locator('#l .w-file-upload-item[aria-selected="true"]')).toHaveCount(1);
});

test('mandatory refuses to give up the last chosen row', async ({ mount, page }) => {
  await mount('<w-file-upload-list id="l" selectable mandatory selected=\'["a"]\' items=\'["a","b"]\'></w-file-upload-list>');
  await expect(page.locator('#l .w-file-upload-item').first()).toHaveAttribute('aria-selected', 'true');
  await page.locator('#l w-file-upload-item').first().click();
  await expect(page.locator('#l .w-file-upload-item').first()).toHaveAttribute('aria-selected', 'true');
});

test('activatable tracks activation instead of selection', async ({ mount, page }) => {
  await mount('<w-file-upload-list id="l" activatable items=\'["a","b"]\'></w-file-upload-list>');
  await recordEvents(page, '#l', ['change']);
  await page.locator('#l w-file-upload-item').last().click();
  const events = await readEvents(page, '#l');
  expect(events[0].detail).toEqual({ value: ['b'], name: 'activated', id: 'b' });
  await expect(page.locator('#l')).toHaveAttribute('activated', '["b"]');
});

test('return-object reports the item records', async ({ mount, page }) => {
  await mount(`
    <w-file-upload-list id="l" selectable return-object
      items='[{"title":"A","value":"a"},{"title":"B","value":"b"}]'></w-file-upload-list>
  `);
  await recordEvents(page, '#l', ['change']);
  await page.locator('#l w-file-upload-item').first().click();
  const events = await readEvents(page, '#l');
  expect(events[0].detail.value).toEqual([{ title: 'A', value: 'a' }]);
});

test('groups expand and collapse with their own icons', async ({ mount, page }) => {
  await mount(`
    <w-file-upload-list id="l" expand-icon="plus" collapse-icon="minus"
      items='[{"title":"Docs","value":"docs","children":["a.txt","b.txt"]}]'></w-file-upload-list>
  `);
  await recordEvents(page, '#l', ['change']);

  await expect(page.locator('#l .w-file-upload-list-group-icon')).toHaveText('plus');
  await expect(page.locator('#l details')).not.toHaveAttribute('open', '');

  await page.locator('#l .w-file-upload-list-group-header').click();
  await expect(page.locator('#l .w-file-upload-list-group-icon')).toHaveText('minus');
  await expect(page.locator('#l details')).toHaveAttribute('open', '');
  await expect(page.locator('#l .w-file-upload-list--nested w-file-upload-item')).toHaveCount(2);

  const events = await readEvents(page, '#l');
  expect(events[0].detail).toEqual({ value: ['docs'], name: 'opened' });

  await page.locator('#l .w-file-upload-list-group-header').click();
  await expect(page.locator('#l details')).not.toHaveAttribute('open', '');
});

test('open-strategy single closes the other groups', async ({ mount, page }) => {
  await mount(`
    <w-file-upload-list id="l" open-strategy="single"
      items='[{"title":"One","value":"one","children":["a"]},{"title":"Two","value":"two","children":["b"]}]'></w-file-upload-list>
  `);
  await page.locator('#l .w-file-upload-list-group-header').first().click();
  await page.locator('#l .w-file-upload-list-group-header').last().click();
  await expect(page.locator('#l details[open]')).toHaveCount(1);
  await expect(page.locator('#l')).toHaveAttribute('opened', '["two"]');
});

test('items-registration="props" skips the rows of a collapsed group', async ({ mount, page }) => {
  await mount(`
    <w-file-upload-list id="l" items-registration="props"
      items='[{"title":"Docs","value":"docs","children":["a.txt"]}]'></w-file-upload-list>
  `);
  await expect(page.locator('#l w-file-upload-item')).toHaveCount(0);
  await page.locator('#l .w-file-upload-list-group-header').click();
  await expect(page.locator('#l w-file-upload-item')).toHaveCount(1);
});

test('a leaf strategy leaves group rows alone while classic cascades to the children', async ({ mount, page }) => {
  const items = '[{"title":"Docs","value":"docs","children":[{"title":"a","value":"a"}]}]';
  await mount(`
    <w-file-upload-list id="leaf" selectable opened='["docs"]' items='${items}'></w-file-upload-list>
    <w-file-upload-list id="classic" selectable multiple select-strategy="classic"
      opened='["docs"]' items='${items}'></w-file-upload-list>
  `);

  await page.locator('#leaf .w-file-upload-list-group-title').click();
  await expect(page.locator('#leaf')).not.toHaveAttribute('selected', /./);

  await page.locator('#classic .w-file-upload-list-group-title').click();
  await expect(page.locator('#classic')).toHaveAttribute('selected', '["a"]');
});

test('a branch strategy keeps the group alongside its children', async ({ mount, page }) => {
  await mount(`
    <w-file-upload-list id="l" selectable multiple select-strategy="branch" opened='["docs"]'
      items='[{"title":"Docs","value":"docs","children":[{"title":"a","value":"a"}]}]'></w-file-upload-list>
  `);
  await page.locator('#l .w-file-upload-list-group-title').click();
  await expect(page.locator('#l')).toHaveAttribute('selected', '["docs","a"]');
});

test('keyboard focus walks the rows and Enter chooses one', async ({ mount, page }) => {
  await mount('<w-file-upload-list id="l" selectable items=\'["a","b"]\'></w-file-upload-list>');
  const rows = page.locator('#l .w-file-upload-item');
  await expect(rows.first()).toHaveAttribute('tabindex', '0');

  await rows.first().focus();
  await page.keyboard.press('ArrowDown');
  await expect(rows.last()).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(rows.first()).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(rows.first()).toHaveAttribute('aria-selected', 'true');
});

test('filterable hands the space key back instead of choosing', async ({ mount, page }) => {
  await mount('<w-file-upload-list id="l" selectable filterable items=\'["a","b"]\'></w-file-upload-list>');
  await page.locator('#l .w-file-upload-item').first().focus();
  await page.keyboard.press(' ');
  await expect(page.locator('#l .w-file-upload-item').first()).toHaveAttribute('aria-selected', 'false');

  await page.keyboard.press('Enter');
  await expect(page.locator('#l .w-file-upload-item').first()).toHaveAttribute('aria-selected', 'true');
});

test('navigation-strategy track keeps focus outside and points at a row', async ({ mount, page }) => {
  await mount(`
    <w-file-upload-list id="l" navigation-strategy="track" navigation-index="1"
      items='["a","b"]'></w-file-upload-list>
  `);
  const root = page.locator('#l .w-file-upload-list');
  await expect(root).toHaveAttribute('tabindex', '0');
  const rows = page.locator('#l .w-file-upload-item');
  await expect(rows.first()).toHaveAttribute('tabindex', '-1');
  await expect(rows.last()).toHaveClass(/w-file-upload-item--focused/);

  const active = await root.getAttribute('aria-activedescendant');
  expect(active).toBe(await rows.last().getAttribute('id'));

  // Arrow keys do not move DOM focus in track mode.
  await rows.first().focus();
  await page.keyboard.press('ArrowDown');
  await expect(rows.first()).toBeFocused();
});

test('list presentation attributes reach the container and every row', async ({ mount, page }) => {
  await mount(`
    <w-file-upload-list id="l" nav slim lines="three" variant="tonal"
      active-class="picked" indent="24" prepend-gap="8" selected='["a"]' selectable
      items='["a"]'></w-file-upload-list>
  `);
  const root = page.locator('#l .w-file-upload-list');
  await expect(root).toHaveClass(/w-file-upload-list--nav/);
  await expect(root).toHaveClass(/w-file-upload-list--slim/);
  await expect(root).toHaveClass(/w-file-upload-list--three-line/);
  await expect(root).toHaveClass(/w-file-upload-list--variant-tonal/);
  expect(await root.evaluate((el) => el.style.getPropertyValue('--w-file-upload-list-indent'))).toBe('24px');

  const row = page.locator('#l .w-file-upload-item');
  await expect(row).toHaveClass(/w-file-upload-item--nav/);
  await expect(row).toHaveClass(/w-file-upload-item--three-line/);
  await expect(row).toHaveClass(/picked/);
  expect(await row.evaluate((el) => el.style.getPropertyValue('--w-file-upload-item-prepend-gap'))).toBe('8px');
});

test('a remove button inside the list does not choose the row', async ({ mount, page }) => {
  await mount('<w-file-upload-list id="l" selectable clearable items=\'["a"]\'></w-file-upload-list>');
  await recordEvents(page, '#l', ['remove', 'change']);
  await page.locator('#l .w-file-upload-item-remove').click();
  const events = await readEvents(page, '#l');
  expect(events.map((event) => event.type)).toEqual(['remove']);
  await expect(page.locator('#l .w-file-upload-item')).toHaveAttribute('aria-selected', 'false');
});

test('the expander icon still toggles a group on a selectable list', async ({ mount, page }) => {
  await mount(`
    <w-file-upload-list id="l" selectable multiple select-strategy="independent"
      items='[{"title":"Docs","value":"docs","children":["a"]}]'></w-file-upload-list>
  `);
  await page.locator('#l .w-file-upload-list-group-icon').click();
  await expect(page.locator('#l details')).toHaveAttribute('open', '');
  await expect(page.locator('#l')).not.toHaveAttribute('selected', /./);

  await page.locator('#l .w-file-upload-list-group-title').click();
  await expect(page.locator('#l')).toHaveAttribute('selected', '["docs"]');
});

test('w-file-upload validation-value supplies required validation state', async ({ mount, page }) => {
  await mount(`
    <w-file-upload id="empty" required validation-value="null"></w-file-upload>
    <w-file-upload id="valid" required validation-value='"stored.pdf"'></w-file-upload>
  `);
  await expect(page.locator('#empty .w-field-hint')).toHaveText('Please select a file.');
  await expect(page.locator('#empty .w-file-upload-dropzone')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#empty input')).toHaveAttribute('required', '');
  await expect(page.locator('#valid .w-field-hint')).toHaveCount(0);
  await expect(page.locator('#valid .w-file-upload-dropzone')).not.toHaveAttribute('aria-invalid');
});
