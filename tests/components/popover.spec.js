import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-popover reflects attrs and toggles with pointer and keyboard', async ({ mount, page }) => {
  await mount('<w-popover id="popover" label="Open" side="right" inline>Content</w-popover>');
  await recordEvents(page, '#popover', ['toggle', 'close']);

  await expect(page.locator('#popover .w-popover')).toHaveClass(/w-popover--right/);
  await expect(page.locator('#popover .w-popover')).toHaveClass(/w-popover--inline/);

  await page.locator('#popover .w-popover-trigger').click();
  await expect(page.locator('#popover')).toHaveAttribute('open', '');
  await page.locator('#popover .w-popover-trigger').press(' ');
  await expect(page.locator('#popover')).not.toHaveAttribute('open', '');
  expect((await readEvents(page, '#popover')).map((event) => event.type)).toEqual(['toggle', 'close']);
});
