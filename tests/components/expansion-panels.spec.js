import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-expansion-panels single closes sibling panels', async ({ mount, page }) => {
  await mount(`
    <w-expansion-panels id="panels" single>
      <w-expansion-panel id="first" header="First" open>First content</w-expansion-panel>
      <w-expansion-panel id="second" header="Second">Second content</w-expansion-panel>
    </w-expansion-panels>
  `);

  await page.locator('#second .w-expand-header').click();

  await expect(page.locator('#second')).toHaveAttribute('open', '');
  await expect(page.locator('#first')).not.toHaveAttribute('open', '');
});

test('w-expansion-panels syncs value, multiple selection, and mandatory state', async ({ mount, page }) => {
  await mount(`
    <w-expansion-panels id="panels" multiple value="one,three">
      <w-expansion-panel id="one" value="one" title="One">One content</w-expansion-panel>
      <w-expansion-panel id="two" value="two" title="Two">Two content</w-expansion-panel>
      <w-expansion-panel id="three" value="three" title="Three">Three content</w-expansion-panel>
    </w-expansion-panels>
  `);
  await recordEvents(page, '#panels', ['change']);

  await expect(page.locator('#one')).toHaveAttribute('open', '');
  await expect(page.locator('#two')).not.toHaveAttribute('open', '');
  await expect(page.locator('#three')).toHaveAttribute('open', '');

  await page.locator('#two .w-expand-header').click();
  await expect(page.locator('#panels')).toHaveAttribute('value', 'one,two,three');
  expect((await readEvents(page, '#panels'))
    .filter((event) => event.type !== 'toggle')
    .map((event) => event.detail.value)).toEqual([
    ['one', 'two', 'three'],
  ]);

  await page.locator('#panels').evaluate((el) => {
    el.removeAttribute('multiple');
    el.setAttribute('mandatory', '');
    el.setAttribute('value', 'one');
  });
  await page.locator('#one .w-expand-header').click();
  await expect(page.locator('#one')).toHaveAttribute('open', '');
});

test('w-expansion-panels multiple groups can close the final item when not mandatory', async ({ mount, page }) => {
  await mount(`
    <w-expansion-panels id="panels" multiple value="handoff">
      <w-expansion-panel value="planning" title="Planning">Planning content</w-expansion-panel>
      <w-expansion-panel value="handoff" title="Handoff">Handoff content</w-expansion-panel>
    </w-expansion-panels>
  `);

  await expect(page.locator('#handoff')).toHaveCount(0);
  await expect(page.locator('w-expansion-panel[value="handoff"]')).toHaveAttribute('open', '');
  await page.locator('w-expansion-panel[value="handoff"] .w-expand-header').click();
  await expect(page.locator('w-expansion-panel[value="handoff"]')).not.toHaveAttribute('open', '');
  await expect(page.locator('#panels')).toHaveAttribute('value', '');
});

test('w-expansion-panels reflects variants and supports header keyboard navigation', async ({ mount, page }) => {
  await mount(`
    <w-expansion-panels id="panels" variant="popout" flat tile no-divider gap="12">
      <w-expansion-panel id="first" title="First">First content</w-expansion-panel>
      <w-expansion-panel id="second" title="Second">Second content</w-expansion-panel>
      <w-expansion-panel id="third" title="Third" disabled>Third content</w-expansion-panel>
    </w-expansion-panels>
  `);

  await expect(page.locator('#panels .w-accordion')).toHaveClass(/w-accordion--variant-popout/);
  await expect(page.locator('#panels .w-accordion')).toHaveClass(/w-accordion--flat/);
  await expect(page.locator('#panels .w-accordion')).toHaveClass(/w-accordion--tile/);
  await expect(page.locator('#panels .w-accordion')).toHaveClass(/w-accordion--no-divider/);
  await expect(page.locator('#panels .w-accordion')).toHaveCSS('--w-expansion-gap', '12px');

  await page.locator('#first .w-expand-header').focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#second .w-expand-header')).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.locator('#second .w-expand-header')).toBeFocused();
});
