import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-window reflects value, height, direction, crossfade, reverse, and show-arrows attributes', async ({ mount, page }) => {
  await mount(`
    <w-window id="window" value="1" show-arrows height="180px" direction="vertical" crossfade reverse>
      <w-window-item>Overview</w-window-item>
      <w-window-item>Details</w-window-item>
      <w-window-item>Review</w-window-item>
    </w-window>
  `);

  await expect(page.locator('#window')).toHaveAttribute('value', '1');
  await expect(page.locator('#window .w-window')).toHaveCSS('height', '180px');
  await expect(page.locator('#window .w-window')).toHaveClass(/w-window--vertical/);
  await expect(page.locator('#window .w-window')).toHaveClass(/w-window--crossfade/);
  await expect(page.locator('#window w-window-item').nth(1)).toHaveAttribute('selected', '');
  await expect(page.locator('#window [data-window-step]')).toHaveCount(2);

  await page.locator('#window').evaluate((el) => {
    el.removeAttribute('show-arrows');
    el.setAttribute('direction', 'horizontal');
    el.setAttribute('value', '2');
  });

  await expect(page.locator('#window [data-window-step]')).toHaveCount(0);
  await expect(page.locator('#window .w-window')).not.toHaveClass(/w-window--vertical/);
  await expect(page.locator('#window w-window-item').nth(2)).toHaveAttribute('selected', '');
});

test('w-window changes by arrows, dots, and keyboard while syncing value', async ({ mount, page }) => {
  await mount(`
    <w-window id="window" value="0" show-arrows continuous>
      <w-window-item>Overview</w-window-item>
      <w-window-item>Details</w-window-item>
      <w-window-item>Review</w-window-item>
    </w-window>
  `);
  await recordEvents(page, '#window', ['change']);

  await page.locator('#window [data-window-step="1"]').click();
  await expect(page.locator('#window')).toHaveAttribute('value', '1');

  await page.locator('#window [data-window-index="2"]').click();
  await expect(page.locator('#window')).toHaveAttribute('value', '2');
  await expect(page.locator('#window [data-window-index="2"]')).toHaveAttribute('aria-selected', 'true');

  await page.locator('#window .w-window').focus();
  await page.keyboard.press('Home');
  await expect(page.locator('#window')).toHaveAttribute('value', '0');

  await page.locator('#window .w-window').focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#window')).toHaveAttribute('value', '2');

  expect((await readEvents(page, '#window')).filter((event) => event.type === 'change')).toEqual([
    { type: 'change', detail: { value: 1 } },
    { type: 'change', detail: { value: 2 } },
    { type: 'change', detail: { value: 0 } },
    { type: 'change', detail: { value: 2 } },
  ]);
});

test('w-window supports custom icons, selected-class, and a disabled state', async ({ mount, page }) => {
  await mount(`
    <w-window id="w" value="0" show-arrows prev-icon="«" next-icon="»" selected-class="is-current">
      <w-window-item>One</w-window-item>
      <w-window-item>Two</w-window-item>
    </w-window>
  `);
  await expect(page.locator('#w .w-window-arrow--prev')).toHaveText('«');
  await expect(page.locator('#w .w-window-arrow--next')).toHaveText('»');
  await expect(page.locator('#w w-window-item').nth(0)).toHaveClass(/is-current/);

  await page.locator('#w [data-window-step="1"]').click();
  await expect(page.locator('#w')).toHaveAttribute('value', '1');
  await expect(page.locator('#w w-window-item').nth(1)).toHaveClass(/is-current/);

  await page.locator('#w').evaluate((el) => el.setAttribute('disabled', ''));
  await expect(page.locator('#w .w-window')).toHaveClass(/w-window--disabled/);
  await page.locator('#w [data-window-step="-1"]').click({ force: true });
  await expect(page.locator('#w')).toHaveAttribute('value', '1'); // disabled blocks navigation
});

test('w-tabs-window drives w-tabs-window-item panels via the alias item selector', async ({ mount, page }) => {  await mount(`
    <w-tabs-window id="win" value="0">
      <w-tabs-window-item>Overview</w-tabs-window-item>
      <w-tabs-window-item>Details</w-tabs-window-item>
      <w-tabs-window-item>Review</w-tabs-window-item>
    </w-tabs-window>
  `);

  // The alias items are found by _itemSelector → dots + selection sync work.
  await expect(page.locator('#win .w-window-dot')).toHaveCount(3);
  await expect(page.locator('#win w-tabs-window-item').nth(0)).toHaveAttribute('selected', '');

  await page.locator('#win').evaluate((el) => el.setAttribute('value', '2'));
  await expect(page.locator('#win w-tabs-window-item').nth(2)).toHaveAttribute('selected', '');
  await expect(page.locator('#win w-tabs-window-item').nth(0)).not.toHaveAttribute('selected', '');
});
