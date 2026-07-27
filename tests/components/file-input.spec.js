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

/* ── Vuetify field surface ─────────────────────────────────────────────────── */

test('field-surface flags and variant become modifier classes', async ({ mount, page }) => {
  await mount(`
    <w-file-input id="fi" variant="filled" flat reverse active center-affix glow
      single-line indent-details hide-spin-buttons persistent-clear></w-file-input>
  `);

  const field = page.locator('#fi .w-file-input--field');
  for (const name of [
    'w-field--variant-filled', 'w-field--flat', 'w-field--reverse', 'w-field--active',
    'w-field--center-affix', 'w-field--glow', 'w-field--single-line',
    'w-field--indent-details', 'w-field--hide-spin-buttons', 'w-field--persistent-clear',
  ]) {
    await expect(field).toHaveClass(new RegExp(name));
  }
  // `single-line` drops the label row and hands the text to the placeholder.
  await expect(page.locator('#fi .w-field-label')).toHaveCount(0);
  await expect(page.locator('#fi .w-file-input-placeholder')).toHaveText('Choose file');
});

test('an unknown variant is ignored', async ({ mount, page }) => {
  await mount('<w-file-input id="fi" variant="nonsense"></w-file-input>');
  await expect(page.locator('#fi .w-file-input--field')).not.toHaveClass(/w-field--variant/);
});

test('icons render outside and inside the control, tinted by icon-color', async ({ mount, page }) => {
  await mount(`
    <w-file-input id="fi" prepend-icon="up" append-icon="down"
      prepend-inner-icon="in" append-inner-icon="out" icon-color="success"></w-file-input>
  `);

  await expect(page.locator('#fi .w-file-input-outer > .w-field-prepend')).toHaveText('up');
  await expect(page.locator('#fi .w-file-input-outer > .w-field-append')).toHaveText('down');
  await expect(page.locator('#fi .w-file-input-field .w-field-prepend-inner')).toHaveText('in');
  await expect(page.locator('#fi .w-file-input-field .w-field-append-inner')).toHaveText('out');

  const tint = await page.locator('#fi .w-file-input--field')
    .evaluate((el) => el.style.getPropertyValue('--w-field-icon-color'));
  expect(tint).toBe('var(--w-success, success)');
});

test('icon-set prefixes every icon name and a raw color value is kept', async ({ mount, page }) => {
  await mount('<w-file-input id="fi" prepend-icon="up" icon-set="mdi" icon-color="#c00"></w-file-input>');
  await expect(page.locator('#fi .w-field-prepend')).toHaveText('up');
  const tint = await page.locator('#fi .w-file-input--field')
    .evaluate((el) => el.style.getPropertyValue('--w-field-icon-color'));
  expect(tint).toBe('#c00');
});

test('clear-icon replaces the clear glyph', async ({ mount, page }) => {
  await mount('<w-file-input id="fi" clearable clear-icon="wipe"></w-file-input>');
  await page.locator('#fi input[type="file"]').evaluate(addFiles, [{ name: 'a.txt', content: 'a' }]);
  await expect(page.locator('#fi .w-file-input-clear')).toHaveText('wipe');
});

test('persistent-clear keeps the clear button visible without hover', async ({ mount, page }) => {
  await mount(`
    <w-file-input id="plain" clearable></w-file-input>
    <w-file-input id="pinned" clearable persistent-clear></w-file-input>
  `);
  for (const id of ['#plain', '#pinned']) {
    await page.locator(`${id} input[type="file"]`).evaluate(addFiles, [{ name: 'a.txt', content: 'a' }]);
  }

  const opacity = (id) => page.locator(`${id} .w-file-input-clear`)
    .evaluate((el) => getComputedStyle(el).opacity);
  expect(await opacity('#plain')).toBe('0');
  expect(await opacity('#pinned')).toBe('1');
});

test('messages and error-messages fill the details row, capped by max-errors', async ({ mount, page }) => {
  await mount(`
    <w-file-input id="fi" hint="Pick a file" messages='["Max 5 MB","PDF only"]'
      error-messages='["Too large","Wrong type"]' max-errors="2"></w-file-input>
  `);

  await expect(page.locator('#fi .w-field')).toHaveClass(/w-field-error/);
  await expect(page.locator('#fi .w-field-hint')).toHaveText('Too large');
  await expect(page.locator('#fi .w-field-message')).toHaveCount(3);
  await expect(page.locator('#fi .w-field-message--error')).toHaveText('Wrong type');
  await expect(page.locator('#fi .w-field-details')).toContainText('Max 5 MB');
  await expect(page.locator('#fi .w-field-details')).toContainText('PDF only');
});

test('max-errors defaults to one and a single string message works', async ({ mount, page }) => {
  await mount('<w-file-input id="fi" error-messages="Required" messages="Note"></w-file-input>');
  await expect(page.locator('#fi .w-field-hint')).toHaveText('Required');
  await expect(page.locator('#fi .w-field-message')).toHaveCount(1);
  await expect(page.locator('#fi .w-field-message')).toHaveText('Note');
});

test('persistent-hint keeps the hint beside an error', async ({ mount, page }) => {
  await mount('<w-file-input id="fi" hint="Any image" error-messages="Required" persistent-hint></w-file-input>');
  await expect(page.locator('#fi .w-field-hint')).toHaveText('Required');
  await expect(page.locator('#fi .w-field-message')).toHaveText('Any image');
});

test('validate-on lazy withholds the error until a file is chosen', async ({ mount, page }) => {
  await mount('<w-file-input id="fi" chips validate-on="lazy" error-messages="Required"></w-file-input>');
  await expect(page.locator('#fi .w-field')).not.toHaveClass(/w-field-error/);
  await expect(page.locator('#fi .w-field-hint')).toHaveCount(0);

  await page.locator('#fi input[type="file"]').evaluate(addFiles, [{ name: 'a.txt', content: 'a' }]);
  await expect(page.locator('#fi .w-field-hint')).toHaveText('Required');
});

test('validate-on "blur lazy" waits for the field to be left', async ({ mount, page }) => {
  await mount('<w-file-input id="fi" chips validate-on="blur lazy" error-messages="Required"></w-file-input>');
  await page.locator('#fi input[type="file"]').evaluate(addFiles, [{ name: 'a.txt', content: 'a' }]);
  await expect(page.locator('#fi .w-field-hint')).toHaveCount(0);

  await page.locator('#fi input[type="file"]').evaluate((el) => { el.focus(); el.blur(); });
  await expect(page.locator('#fi .w-field-hint')).toHaveText('Required');
  // A second blur is a no-op once the field has been touched.
  await page.locator('#fi input[type="file"]').evaluate((el) => { el.focus(); el.blur(); });
  await expect(page.locator('#fi .w-field-hint')).toHaveText('Required');
});

test('hide-details suppresses the details row unless it is "auto"', async ({ mount, page }) => {
  await mount(`
    <w-file-input id="hidden" hint="Helper" hide-details></w-file-input>
    <w-file-input id="auto" hint="Helper" hide-details="auto"></w-file-input>
  `);
  await expect(page.locator('#hidden .w-field-details')).toHaveCount(0);
  await expect(page.locator('#auto .w-field-hint')).toHaveText('Helper');
});

test('counter-string and counter-size-string replace the counter text', async ({ mount, page }) => {
  await mount(`
    <w-file-input id="count" counter multiple counter-string="{0} attached"></w-file-input>
    <w-file-input id="size" counter show-size multiple counter-size-string="{0} files, {1}"></w-file-input>
  `);
  const files = [{ name: 'a.txt', content: 'aa' }, { name: 'b.txt', content: 'bbb' }];
  await page.locator('#count input[type="file"]').evaluate(addFiles, files);
  await page.locator('#size input[type="file"]').evaluate(addFiles, files);

  await expect(page.locator('#count .w-field-hint')).toHaveText('2 attached');
  await expect(page.locator('#size .w-field-hint')).toHaveText('2 files, 5 B');
});

test('hide-input keeps the icons and drops the file names', async ({ mount, page }) => {
  await mount('<w-file-input id="fi" hide-input prepend-icon="up" placeholder="Pick"></w-file-input>');
  await expect(page.locator('#fi .w-file-input--field')).toHaveClass(/w-file-input--hide-input/);
  await expect(page.locator('#fi .w-file-input-placeholder')).toHaveCount(0);

  await page.locator('#fi input[type="file"]').evaluate(addFiles, [{ name: 'a.txt', content: 'a' }]);
  await expect(page.locator('#fi .w-file-input-name')).toHaveCount(0);
  await expect(page.locator('#fi .w-field-prepend')).toHaveText('up');
});

test('dirty applies the has-value styling with or without a selection', async ({ mount, page }) => {
  await mount(`
    <w-file-input id="resting" label="Resume" placeholder="none"></w-file-input>
    <w-file-input id="forced" label="Resume" dirty></w-file-input>
  `);
  await expect(page.locator('#forced .w-file-input--field')).toHaveClass(/w-file-input--dirty/);
  await expect(page.locator('#resting .w-file-input--field')).not.toHaveClass(/w-file-input--dirty/);

  const color = (id) => page.locator(`${id} .w-field-label`).evaluate((el) => getComputedStyle(el).color);
  expect(await color('#forced')).not.toBe(await color('#resting'));

  // A selection makes the field dirty on its own.
  await page.locator('#resting input[type="file"]').evaluate(addFiles, [{ name: 'a.txt', content: 'a' }]);
  await expect(page.locator('#resting .w-file-input--field')).toHaveClass(/w-file-input--dirty/);
});

test('filter-by-type turns away files that do not match and reports them', async ({ mount, page }) => {
  await mount('<w-file-input id="fi" chips multiple filter-by-type=".txt, image/*"></w-file-input>');
  await recordEvents(page, '#fi', ['rejected']);
  await page.locator('#fi input[type="file"]').evaluate(addFiles, [
    { name: 'notes.txt', type: 'text/plain', content: 'a' },
    { name: 'shot.png', type: 'image/png', content: 'bb' },
    { name: 'sheet.csv', type: 'text/csv', content: 'ccc' },
  ]);

  await expect(page.locator('#fi .w-file-input-chip')).toHaveCount(2);
  await expect(page.locator('#fi .w-file-input-chips')).not.toContainText('sheet.csv');

  const events = await readEvents(page, '#fi');
  expect(events).toHaveLength(1);
  expect(events[0].detail.files).toEqual([{ name: 'sheet.csv', size: 3, type: 'text/csv' }]);
});

test('filter-by-type matches an exact MIME type', async ({ mount, page }) => {
  await mount('<w-file-input id="fi" chips multiple filter-by-type="application/pdf"></w-file-input>');
  await page.locator('#fi input[type="file"]').evaluate(addFiles, [
    { name: 'doc.pdf', type: 'application/pdf', content: 'a' },
    { name: 'shot.png', type: 'image/png', content: 'b' },
  ]);
  await expect(page.locator('#fi .w-file-input-chip')).toHaveCount(1);
  await expect(page.locator('#fi .w-file-input-chip')).toContainText('doc.pdf');
});

test('the files property drives the selection', async ({ mount, page }) => {
  await mount('<w-file-input id="fi" chips multiple></w-file-input>');
  await page.locator('#fi').evaluate((el) => {
    el.files = [new File(['x'], 'set.txt', { type: 'text/plain' })];
  });
  await expect(page.locator('#fi .w-file-input-chip')).toContainText('set.txt');

  const names = await page.locator('#fi').evaluate((el) => el.files.map((f) => f.name));
  expect(names).toEqual(['set.txt']);
});

test('validation-value drives required validation and dirty state', async ({ mount, page }) => {
  await mount(`
    <w-file-input id="empty" required validation-value="[]"></w-file-input>
    <w-file-input id="valid" required validation-value='["stored.pdf"]'></w-file-input>
  `);
  await expect(page.locator('#empty .w-field-hint')).toHaveText('Please select a file.');
  await expect(page.locator('#empty input')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#valid .w-field-hint')).toHaveCount(0);
  await expect(page.locator('#valid .w-file-input--field')).toHaveClass(/w-file-input--dirty/);
  await expect(page.locator('#valid input')).not.toHaveAttribute('aria-invalid');
});
