import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

const CHIPS = `
  <w-chip value="design">Design</w-chip>
  <w-chip value="code">Code</w-chip>
  <w-chip value="docs">Docs</w-chip>
`;

test('w-chip-group single-selects and emits change', async ({ mount, page }) => {
  await mount(`<w-chip-group id="g" value="design">${CHIPS}</w-chip-group>`);
  await recordEvents(page, '#g', ['change']);

  await expect(page.locator('#g w-chip[value="design"] .w-chip')).toHaveClass(/selected/);
  await page.locator('#g w-chip[value="code"] .w-chip').click();
  await expect(page.locator('#g')).toHaveAttribute('value', 'code');
  await expect(page.locator('#g w-chip[value="design"] .w-chip')).not.toHaveClass(/w-chip--selected/);
  expect(await readEvents(page, '#g')).toEqual([
    { type: 'change', detail: { value: 'code' } },
  ]);
});

test('w-chip-group multiple selection respects max', async ({ mount, page }) => {
  await mount(`<w-chip-group id="g" multiple max="2" value="design">${CHIPS}</w-chip-group>`);

  await page.locator('#g w-chip[value="code"] .w-chip').click();
  await expect(page.locator('#g')).toHaveAttribute('value', 'design,code');

  // Third selection blocked by max=2.
  await page.locator('#g w-chip[value="docs"] .w-chip').click();
  await expect(page.locator('#g')).toHaveAttribute('value', 'design,code');
});

test('w-chip-group mandatory keeps one selected and disabled blocks changes', async ({ mount, page }) => {
  await mount(`<w-chip-group id="g" mandatory value="design">${CHIPS}</w-chip-group>`);
  await page.locator('#g w-chip[value="design"] .w-chip').click();
  await expect(page.locator('#g')).toHaveAttribute('value', 'design'); // can't clear the last one

  await mount(`<w-chip-group id="d" disabled value="design">${CHIPS}</w-chip-group>`);
  await page.locator('#d w-chip[value="code"] .w-chip').click({ force: true });
  await expect(page.locator('#d')).toHaveAttribute('value', 'design');
});

test('w-chip-group applies column, filter, and propagates variant/color', async ({ mount, page }) => {
  await mount(`<w-chip-group id="g" column filter variant="outlined" color="primary" value="design">${CHIPS}</w-chip-group>`);
  await expect(page.locator('#g .w-chip-group')).toHaveClass(/w-chip-group--column/);
  await expect(page.locator('#g .w-chip-group')).toHaveClass(/w-chip-group--filter/);
  await expect(page.locator('#g w-chip[value="design"]')).toHaveAttribute('variant', 'outlined');
  await expect(page.locator('#g w-chip[value="design"]')).toHaveAttribute('color', 'primary');
});
