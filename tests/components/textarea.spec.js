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

/* ── Vuetify field surface (inherited from <w-text-field>) ─────────────── */

test('w-textarea maps the field-surface flags onto modifier classes', async ({ mount, page }) => {
  await mount(`<w-textarea id="ta" label="A" variant="solo" flat reverse active dirty glow
      center-affix indent-details hide-spin-buttons persistent-placeholder
      persistent-counter persistent-clear></w-textarea>`);

  const root = page.locator('#ta .w-text-field');
  for (const name of ['textarea', 'flat', 'reverse', 'active', 'dirty', 'glow', 'center-affix',
    'indent-details', 'hide-spin-buttons', 'persistent-placeholder', 'persistent-counter',
    'persistent-clear']) {
    await expect(root).toHaveClass(new RegExp('w-text-field--' + name + '(\\s|$)'));
  }
  await expect(root).toHaveClass(/w-text-field--has-value/);
});

test('w-textarea single-line folds the label into the placeholder', async ({ mount, page }) => {
  await mount('<w-textarea id="ta" label="Notes" single-line></w-textarea>');

  await expect(page.locator('#ta .w-text-field-label')).toHaveCount(0);
  await expect(page.locator('#ta .w-text-field')).not.toHaveClass(/w-text-field--floating/);
  await expect(page.locator('#ta textarea')).toHaveAttribute('placeholder', 'Notes');
  await expect(page.locator('#ta textarea')).toHaveAttribute('aria-label', 'Notes');
});

test('w-textarea center-affix pulls the adornments to the vertical centre', async ({ mount, page }) => {
  await mount(`<w-textarea id="top" rows="6" prefix="#"></w-textarea>
    <w-textarea id="mid" rows="6" prefix="#" center-affix></w-textarea>`);

  const top = await page.locator('#top .w-text-field-prefix').evaluate((el) => el.getBoundingClientRect().top
    - el.closest('.w-text-field-control').getBoundingClientRect().top);
  const mid = await page.locator('#mid .w-text-field-prefix').evaluate((el) => el.getBoundingClientRect().top
    - el.closest('.w-text-field-control').getBoundingClientRect().top);
  expect(mid).toBeGreaterThan(top);
});

test('w-textarea renders outer prepend/append icons with an icon color', async ({ mount, page }) => {
  await mount('<w-textarea id="ta" label="A" prepend-icon="search" append-icon="clear" icon-color="warning"></w-textarea>');

  await expect(page.locator('#ta .w-text-field-prepend .w-icon')).toHaveCount(1);
  await expect(page.locator('#ta .w-text-field-append .w-icon')).toHaveCount(1);
  await expect(page.locator('#ta .w-text-field-outer')).toHaveAttribute('style', /--w-tf-icon-color:var\(--w-warning/);
});

test('w-textarea reverse mirrors the text direction', async ({ mount, page }) => {
  await mount('<w-textarea id="ta" reverse value="abc"></w-textarea>');
  await expect(page.locator('#ta textarea')).toHaveCSS('direction', 'rtl');
});

test('w-textarea persistent-clear and clear-icon control the clear button', async ({ mount, page }) => {
  await mount(`<w-textarea id="plain" value="x" clearable></w-textarea>
    <w-textarea id="pinned" value="x" clearable persistent-clear clear-icon="✖"></w-textarea>`);

  await expect(page.locator('#plain .w-text-field-clear')).toHaveCSS('opacity', '0');
  await expect(page.locator('#pinned .w-text-field-clear')).toHaveCSS('opacity', '1');
  await expect(page.locator('#pinned .w-text-field-clear .w-icon')).toHaveText('✖');
});

test('w-textarea persistent-counter keeps the counter visible when empty', async ({ mount, page }) => {
  await mount(`<w-textarea id="plain" counter maxlength="10"></w-textarea>
    <w-textarea id="pinned" counter maxlength="10" persistent-counter></w-textarea>`);

  await expect(page.locator('#plain .w-text-field-counter')).toHaveCSS('opacity', '0');
  await expect(page.locator('#pinned .w-text-field-counter')).toHaveCSS('opacity', '1');
});

test('w-textarea messages, error-messages, and max-errors drive the details row', async ({ mount, page }) => {
  await mount(`<w-textarea id="m" messages="Keep it short"></w-textarea>
    <w-textarea id="e" error-messages="Too long,Also rude" max-errors="2"></w-textarea>`);

  await expect(page.locator('#m .w-text-field-messages')).toHaveText('Keep it short');
  await expect(page.locator('#e .w-text-field-messages--error')).toHaveText('Too longAlso rude');
  await expect(page.locator('#e .w-text-field')).toHaveClass(/w-text-field--error/);
  await expect(page.locator('#e textarea')).toHaveAttribute('aria-invalid', 'true');
});

test('w-textarea validate-on and validation-value gate the built-in checks', async ({ mount, page }) => {
  await mount(`<w-textarea id="quiet" required></w-textarea>
    <w-textarea id="eager" required validate-on="eager"></w-textarea>
    <w-textarea id="override" required validate-on="eager" validation-value="filled"></w-textarea>`);

  await expect(page.locator('#quiet .w-text-field-messages')).toHaveCount(0);
  await expect(page.locator('#eager .w-text-field-messages')).toHaveText('This field is required.');
  await expect(page.locator('#override .w-text-field-messages')).toHaveCount(0);
});

test('w-textarea autocomplete forwards to the textarea and suppress mangles the name', async ({ mount, page }) => {
  await mount(`<w-textarea id="hint" name="bio" autocomplete="off"></w-textarea>
    <w-textarea id="off" name="bio" autocomplete="suppress"></w-textarea>`);

  await expect(page.locator('#hint textarea')).toHaveAttribute('autocomplete', 'off');
  await expect(page.locator('#off textarea')).toHaveAttribute('name', /^bio-w-tf-\d+$/);
});

test('w-textarea indent-details pads the details row and hide-details="auto" prunes it', async ({ mount, page }) => {
  await mount(`<w-textarea id="plain" hint="Help"></w-textarea>
    <w-textarea id="indent" hint="Help" indent-details></w-textarea>
    <w-textarea id="auto" hide-details="auto"></w-textarea>`);

  const plain = await page.locator('#plain .w-text-field-details').evaluate((el) => parseFloat(getComputedStyle(el).paddingLeft));
  const indent = await page.locator('#indent .w-text-field-details').evaluate((el) => parseFloat(getComputedStyle(el).paddingLeft));
  expect(indent).toBeGreaterThan(plain);
  await expect(page.locator('#auto .w-text-field-details')).toHaveCount(0);
});

test('w-textarea associates the label and details with the textarea', async ({ mount, page }) => {
  await mount('<w-textarea id="ta" label="Bio" hint="Tell us more"></w-textarea>');

  const controlId = await page.locator('#ta textarea').getAttribute('id');
  await expect(page.locator('#ta .w-text-field-label')).toHaveAttribute('for', controlId);
  const describedBy = await page.locator('#ta textarea').getAttribute('aria-describedby');
  await expect(page.locator('#ta .w-text-field-details')).toHaveAttribute('id', describedBy);
});

test('w-textarea focus() moves focus into the textarea', async ({ mount, page }) => {
  await mount('<w-textarea id="ta" label="A"></w-textarea>');
  await page.locator('#ta').evaluate((el) => el.focus());
  await expect(page.locator('#ta textarea')).toBeFocused();
});
