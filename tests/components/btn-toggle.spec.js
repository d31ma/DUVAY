import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

const BTNS = `
  <w-btn value="day">Day</w-btn>
  <w-btn value="week">Week</w-btn>
  <w-btn value="month">Month</w-btn>
`;

test('w-btn-toggle renders the joined group and single-selects with a change event', async ({ mount, page }) => {
  await mount(`<w-btn-toggle id="t" value="day">${BTNS}</w-btn-toggle>`);
  await recordEvents(page, '#t', ['change']);

  await expect(page.locator('#t .w-btn-group.w-btn-toggle')).toBeVisible();
  await expect(page.locator('#t w-btn[value="day"]')).toHaveAttribute('active', '');

  await page.locator('#t w-btn[value="week"] button').click();
  await expect(page.locator('#t')).toHaveAttribute('value', 'week');
  await expect(page.locator('#t w-btn[value="week"]')).toHaveAttribute('active', '');
  await expect(page.locator('#t w-btn[value="day"]')).not.toHaveAttribute('active', '');
  expect(await readEvents(page, '#t')).toEqual([
    { type: 'change', detail: { value: 'week' } },
  ]);
});

test('w-btn-toggle multiple selection uses a comma list and respects max', async ({ mount, page }) => {
  await mount(`<w-btn-toggle id="t" multiple max="2" value="day">${BTNS}</w-btn-toggle>`);

  await page.locator('#t w-btn[value="week"] button').click();
  await expect(page.locator('#t')).toHaveAttribute('value', 'day,week');

  // Third selection is blocked by max=2.
  await page.locator('#t w-btn[value="month"] button').click();
  await expect(page.locator('#t')).toHaveAttribute('value', 'day,week');
  await expect(page.locator('#t w-btn[value="month"]')).not.toHaveAttribute('active', '');

  // Deselecting frees a slot.
  await page.locator('#t w-btn[value="day"] button').click();
  await expect(page.locator('#t')).toHaveAttribute('value', 'week');
});

test('w-btn-toggle mandatory keeps a selection and "force" picks the first initially', async ({ mount, page }) => {
  await mount(`<w-btn-toggle id="t" mandatory value="day">${BTNS}</w-btn-toggle>`);
  // Clicking the only selected item does not clear it.
  await page.locator('#t w-btn[value="day"] button').click();
  await expect(page.locator('#t')).toHaveAttribute('value', 'day');

  await mount(`<w-btn-toggle id="f" mandatory="force">${BTNS}</w-btn-toggle>`);
  await expect(page.locator('#f')).toHaveAttribute('value', 'day');
  await expect(page.locator('#f w-btn[value="day"]')).toHaveAttribute('active', '');
});

test('w-btn-toggle applies divided, propagates variant/color, and honours disabled', async ({ mount, page }) => {
  await mount(`<w-btn-toggle id="t" divided variant="outlined" color="primary" value="day">${BTNS}</w-btn-toggle>`);
  await expect(page.locator('#t .w-btn-group')).toHaveClass(/w-btn-group--divided/);
  await expect(page.locator('#t w-btn[value="day"]')).toHaveAttribute('variant', 'outlined');
  await expect(page.locator('#t w-btn[value="day"] button')).toHaveClass(/w-btn-outlined/);

  await mount(`<w-btn-toggle id="d" disabled value="day">${BTNS}</w-btn-toggle>`);
  await page.locator('#d w-btn[value="week"] button').click({ force: true });
  await expect(page.locator('#d')).toHaveAttribute('value', 'day');
  await expect(page.locator('#d w-btn[value="day"]')).toHaveAttribute('disabled', '');
});
