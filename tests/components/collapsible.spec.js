import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-collapsible renders an SVG chevron and toggles, emitting toggle', async ({ mount, page }) => {
  await mount('<w-collapsible id="col" header="Advanced filters"><p>Saved views</p></w-collapsible>');
  await recordEvents(page, '#col', ['toggle']);

  // The chevron is a crisp SVG (not a text caret).
  await expect(page.locator('#col svg.w-collapsible-icon')).toHaveCount(1);
  await expect(page.locator('#col svg.w-collapsible-icon polyline')).toHaveCount(1);

  await expect(page.locator('#col .w-collapsible-trigger')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#col .w-collapsible-content')).toBeHidden();

  await page.locator('#col .w-collapsible-trigger').click();
  await expect(page.locator('#col')).toHaveAttribute('open', '');
  await expect(page.locator('#col .w-collapsible-trigger')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#col .w-collapsible-content')).toBeVisible();
  // Chevron rotates when open.
  await expect(page.locator('#col .w-collapsible')).toHaveClass(/open/);

  expect(await readEvents(page, '#col')).toEqual([{ type: 'toggle', detail: { open: true } }]);
});
