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
