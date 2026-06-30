import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-textarea renders label, value, rows, and the outlined variant', async ({ mount, page }) => {
  await mount('<w-textarea id="ta" label="Bio" value="Hello" rows="6" name="bio"></w-textarea>');

  const ta = page.locator('#ta textarea');
  await expect(page.locator('#ta .w-text-field')).toHaveClass(/w-text-field--textarea/);
  await expect(page.locator('#ta .w-text-field')).toHaveClass(/w-text-field--outlined/);
  await expect(page.locator('#ta .w-text-field-label')).toHaveText('Bio');
  await expect(ta).toHaveValue('Hello');
  await expect(ta).toHaveAttribute('rows', '6');
  await expect(ta).toHaveAttribute('name', 'bio');
});

test('w-textarea emits input and change and reflects value', async ({ mount, page }) => {
  await mount('<w-textarea id="ta" name="bio" value="alpha"></w-textarea>');
  await recordEvents(page, '#ta', ['input', 'change']);

  await page.locator('#ta textarea').fill('beta');
  await page.locator('#ta textarea').dispatchEvent('change');
  await page.locator('#ta').evaluate((el) => { el.value = 'gamma'; });

  await expect(page.locator('#ta')).toHaveAttribute('value', 'gamma');
  await expect(page.locator('#ta textarea')).toHaveValue('gamma');
  expect(await readEvents(page, '#ta')).toEqual([
    { type: 'input', detail: { value: 'beta', name: 'bio' } },
    { type: 'change', detail: { value: 'beta', name: 'bio' } },
  ]);
});

test('w-textarea applies variant, density, size, and color', async ({ mount, page }) => {
  await mount('<w-textarea id="ta" label="X" variant="filled" density="compact" size="lg" color="success"></w-textarea>');

  const root = page.locator('#ta .w-text-field');
  await expect(root).toHaveClass(/w-text-field--filled/);
  await expect(root).toHaveClass(/w-text-field--density-compact/);
  await expect(root).toHaveClass(/w-text-field--lg/);
  await expect(root).toHaveAttribute('style', /--w-tf-accent:var\(--w-success\)/);
});

test('w-textarea no-resize and auto-grow disable the manual resize handle', async ({ mount, page }) => {
  await mount('<w-textarea id="nr" no-resize></w-textarea><w-textarea id="ag" auto-grow></w-textarea>');

  await expect(page.locator('#nr .w-text-field')).toHaveClass(/w-text-field--no-resize/);
  await expect(page.locator('#nr textarea')).toHaveCSS('resize', 'none');
  await expect(page.locator('#ag .w-text-field')).toHaveClass(/w-text-field--no-resize/);
});

test('w-textarea auto-grow expands height as content is added', async ({ mount, page }) => {
  await mount('<w-textarea id="ta" auto-grow rows="2"></w-textarea>');

  const startH = (await page.locator('#ta textarea').boundingBox()).height;
  await page.locator('#ta textarea').fill('one\ntwo\nthree\nfour\nfive\nsix');
  const grownH = (await page.locator('#ta textarea').boundingBox()).height;

  expect(grownH).toBeGreaterThan(startH);
});

test('w-textarea max-rows caps auto-grow height', async ({ mount, page }) => {
  await mount('<w-textarea id="ta" auto-grow max-rows="3"></w-textarea>');

  await page.locator('#ta textarea').fill(Array.from({ length: 12 }, (_, i) => 'line ' + i).join('\n'));
  const cappedH = (await page.locator('#ta textarea').boundingBox()).height;
  // 3 rows at ~1.5 line-height on the base font stays well under 200px.
  expect(cappedH).toBeLessThan(200);
  await expect(page.locator('#ta textarea')).toHaveCSS('overflow-y', 'auto');
});

test('w-textarea counter, clearable, prefix, and inner icons work', async ({ mount, page }) => {
  await mount('<w-textarea id="ta" value="abc" counter maxlength="20" clearable prefix="#" prepend-inner-icon="📝"></w-textarea>');
  await recordEvents(page, '#ta', ['clear']);

  await expect(page.locator('#ta .w-text-field-counter')).toHaveText('3 / 20');
  await expect(page.locator('#ta .w-text-field-prefix')).toHaveText('#');
  await expect(page.locator('#ta .w-text-field-prepend-inner .w-icon')).toHaveText('📝');

  await page.locator('#ta .w-text-field-clear').click();
  await expect(page.locator('#ta textarea')).toHaveValue('');
  expect(await readEvents(page, '#ta')).toEqual([{ type: 'clear', detail: { name: '' } }]);
});

test('w-textarea error and hide-details behave like the text field', async ({ mount, page }) => {
  await mount('<w-textarea id="e" label="A" error="Required"></w-textarea><w-textarea id="h" label="B" hint="x" hide-details></w-textarea>');

  await expect(page.locator('#e .w-text-field')).toHaveClass(/w-text-field--error/);
  await expect(page.locator('#e .w-text-field-messages')).toHaveText('Required');
  await expect(page.locator('#e textarea')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#h .w-text-field-details')).toHaveCount(0);
});

test('w-textarea disabled and readonly forward to the textarea', async ({ mount, page }) => {
  await mount('<w-textarea id="d" label="A" disabled></w-textarea><w-textarea id="r" label="B" readonly></w-textarea>');

  await expect(page.locator('#d textarea')).toBeDisabled();
  await expect(page.locator('#r textarea')).toHaveAttribute('readonly', '');
});

test('w-textarea supports the @input shorthand handler', async ({ mount, page }) => {
  await mount('<w-textarea id="ta" @input="this.dataset.v = event.detail.value"></w-textarea>');
  await page.locator('#ta textarea').fill('typed');
  await expect(page.locator('#ta')).toHaveAttribute('data-v', 'typed');
});
