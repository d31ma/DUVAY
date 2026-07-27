import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-expansion-panel reflects header, open, disabled, and layout attributes', async ({ mount, page }) => {
  await mount('<w-expansion-panel id="panel" header="Details" open disabled><p>Panel content</p></w-expansion-panel>');

  await expect(page.locator('#panel .w-expand-header')).toHaveText(/Details/);
  await expect(page.locator('#panel .w-expand-header')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#panel .w-expand-header')).toBeDisabled();
  await expect(page.locator('#panel .w-expand')).toHaveClass(/open/);
  const padding = await page.locator('#panel .w-expand-body').evaluate((el) => {
    const styles = getComputedStyle(el);
    return { top: styles.paddingTop, bottom: styles.paddingBottom };
  });
  const paddingTop = padding.top;
  expect(Number.parseFloat(paddingTop)).toBeGreaterThan(0);
  expect(padding.top).toBe(padding.bottom);

  await page.locator('#panel').evaluate((el) => {
    el.removeAttribute('disabled');
    el.removeAttribute('open');
    el.setAttribute('header', 'Updated');
  });

  await expect(page.locator('#panel .w-expand-header')).toHaveText(/Updated/);
  await expect(page.locator('#panel .w-expand-header')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#panel .w-expand-header')).toBeEnabled();
});

test('w-expansion-panel toggles and emits toggle', async ({ mount, page }) => {
  await mount('<w-expansion-panel id="panel" header="Details"><p>Panel content</p></w-expansion-panel>');
  await recordEvents(page, '#panel', ['toggle']);

  await page.locator('#panel .w-expand-header').click();

  await expect(page.locator('#panel')).toHaveAttribute('open', '');
  await expect(page.locator('#panel .w-expand-header')).toHaveAttribute('aria-expanded', 'true');
  expect(await readEvents(page, '#panel')).toEqual([{ type: 'toggle', detail: { open: true, value: '' } }]);
});

test('w-expansion-panel supports Vuetify-style title, text, value, readonly, and hidden actions', async ({ mount, page }) => {
  await mount(`
    <w-expansion-panel id="panel" title="Release notes" text="Compact summary" value="release" hide-actions readonly>
      <span slot="text">Slotted text</span>
      <p>Default body</p>
    </w-expansion-panel>
  `);
  await recordEvents(page, '#panel', ['toggle']);

  await expect(page.locator('#panel .w-expand-header')).toHaveText(/Release notes/);
  await expect(page.locator('#panel .w-expansion-panel-title__icon')).toHaveCount(0);
  await expect(page.locator('#panel .w-expansion-panel-text__wrapper')).toContainText('Compact summary');
  await expect(page.locator('#panel .w-expansion-panel-text__wrapper')).toContainText('Slotted text');
  await expect(page.locator('#panel .w-expansion-panel-text__wrapper')).toContainText('Default body');

  await page.locator('#panel .w-expand-header').click();
  await expect(page.locator('#panel')).not.toHaveAttribute('open', '');
  expect(await readEvents(page, '#panel')).toEqual([]);
});

test('w-expansion-panel hover, focusable, ripple, and selected-class change the rendered panel', async ({ mount, page }) => {
  await mount(`
    <w-expansion-panel id="panel" title="Details" hover focusable ripple selected-class="is-open">
      <p>Panel content</p>
    </w-expansion-panel>
  `);

  const root = page.locator('#panel .w-expand');
  await expect(root).toHaveClass(/w-expand--hover/);
  await expect(root).not.toHaveClass(/is-open/);
  await expect(page.locator('#panel .w-expand-body')).toHaveAttribute('tabindex', '0');
  await expect(page.locator('#panel .w-expand-header')).toHaveClass(/w-ripple-host/);

  await page.locator('#panel .w-expand-header').click();
  await expect(root).toHaveClass(/is-open/);

  await page.locator('#panel .w-expand-header').click();
  await expect(root).not.toHaveClass(/is-open/);
});

test('w-expansion-panel-title renders icons, hides actions, and reflects panel state', async ({ mount, page }) => {
  await mount(`
    <w-expansion-panel-title id="collapsed" expand-icon="+" collapse-icon="-">Plain</w-expansion-panel-title>
    <w-expansion-panel-title id="bare" hide-actions>Bare</w-expansion-panel-title>
    <w-expansion-panel-title id="fancy" static hover focusable ripple>Fancy</w-expansion-panel-title>
    <w-expansion-panel open title="Outer">
      <w-expansion-panel-title id="inside" expand-icon="+" collapse-icon="-" slot="title">Inside</w-expansion-panel-title>
    </w-expansion-panel>
  `);

  await expect(page.locator('#collapsed .w-expand-chevron')).toHaveText('+');
  await expect(page.locator('#collapsed .w-expansion-panel-title')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#bare .w-expansion-panel-title__icon')).toHaveCount(0);
  await expect(page.locator('#fancy .w-expansion-panel-title')).toHaveClass(/w-expand-header--static/);
  await expect(page.locator('#fancy .w-expansion-panel-title')).toHaveClass(/w-expansion-panel-title--hover/);
  await expect(page.locator('#fancy .w-expansion-panel-title')).toHaveClass(/w-expansion-panel-title--focusable/);
  await expect(page.locator('#fancy .w-expansion-panel-title')).toHaveClass(/w-ripple-host/);

  // Nested in an open panel, the title flips to the collapse icon.
  await expect(page.locator('#inside .w-expand-chevron')).toHaveText('-');
  await expect(page.locator('#inside .w-expansion-panel-title')).toHaveAttribute('aria-expanded', 'true');
});
