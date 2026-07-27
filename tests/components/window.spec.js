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

test('w-window vertical-arrows stacks the controls on one edge', async ({ mount, page }) => {
  await mount(`
    <w-window id="right" value="0" show-arrows vertical-arrows height="220px">
      <w-window-item>One</w-window-item><w-window-item>Two</w-window-item>
    </w-window>
    <w-window id="left" value="0" show-arrows vertical-arrows="left">
      <w-window-item>One</w-window-item><w-window-item>Two</w-window-item>
    </w-window>
  `);

  await expect(page.locator('#right .w-window')).toHaveClass(/w-window--varrows/);
  await expect(page.locator('#right .w-window')).toHaveClass(/w-window--varrows-right/);
  await expect(page.locator('#left .w-window')).toHaveClass(/w-window--varrows-left/);

  // Stacked arrows sit one above the other rather than side by side.
  const boxes = await page.locator('#right .w-window-arrow').evaluateAll(
    (nodes) => nodes.map((node) => node.getBoundingClientRect()).map((r) => [Math.round(r.x), Math.round(r.y)]),
  );
  expect(boxes[0][0]).toBe(boxes[1][0]);
  expect(boxes[1][1]).toBeGreaterThan(boxes[0][1]);
});

test('w-window selects items by their value attribute', async ({ mount, page }) => {
  await mount(`
    <w-window id="w" value="details" show-arrows>
      <w-window-item value="overview">Overview</w-window-item>
      <w-window-item value="details">Details</w-window-item>
      <w-window-item value="review">Review</w-window-item>
    </w-window>
  `);

  await expect(page.locator('#w w-window-item[value="details"]')).toHaveAttribute('selected', '');

  // Navigation writes the named value back, not a bare index.
  await page.locator('#w [data-window-step="1"]').click();
  await expect(page.locator('#w')).toHaveAttribute('value', 'review');
  await expect(page.locator('#w w-window-item[value="review"]')).toHaveAttribute('selected', '');
});

test('w-window-item selected-class overrides the window default', async ({ mount, page }) => {
  await mount(`
    <w-window id="w" value="0" show-arrows selected-class="is-current">
      <w-window-item>One</w-window-item>
      <w-window-item selected-class="is-special">Two</w-window-item>
    </w-window>
  `);

  await expect(page.locator('#w w-window-item').nth(0)).toHaveClass(/is-current/);

  await page.locator('#w [data-window-step="1"]').click();
  await expect(page.locator('#w w-window-item').nth(1)).toHaveClass(/is-special/);
  await expect(page.locator('#w w-window-item').nth(1)).not.toHaveClass(/is-current/);
});

test('w-window-item transition and reverse-transition drive the incoming panel', async ({ mount, page }) => {
  await mount(`
    <w-window id="w" value="0" show-arrows continuous>
      <w-window-item transition="fade">One</w-window-item>
      <w-window-item transition="slide-x" reverse-transition="slide-x-reverse">Two</w-window-item>
      <w-window-item transition="false">Three</w-window-item>
    </w-window>
  `);

  // The active item carries its transition; the inactive ones do not.
  await expect(page.locator('#w w-window-item').nth(0).locator('.w-window-item')).toHaveClass(/w-transition--fade/);
  await expect(page.locator('#w w-window-item').nth(1).locator('.w-window-item')).not.toHaveClass(/w-transition--/);

  await page.locator('#w [data-window-step="1"]').click();
  await expect(page.locator('#w w-window-item').nth(1).locator('.w-window-item')).toHaveClass(/w-transition--slide-x$/);

  // Moving backwards prefers reverse-transition.
  await page.locator('#w [data-window-step="-1"]').click();
  await page.locator('#w [data-window-step="1"]').click();
  await page.locator('#w [data-window-step="1"]').click();
  await page.locator('#w [data-window-step="-1"]').click();
  await expect(page.locator('#w w-window-item').nth(1).locator('.w-window-item')).toHaveClass(/w-transition--slide-x-reverse/);

  // `false` maps onto the no-animation class.
  await page.locator('#w [data-window-step="1"]').click();
  await expect(page.locator('#w w-window-item').nth(2).locator('.w-window-item')).toHaveClass(/w-transition--none/);
});

test('w-stepper-window-item and w-tabs-window-item inherit the item attributes', async ({ mount, page }) => {
  await mount(`
    <w-stepper-window id="sw" value="two" show-arrows>
      <w-stepper-window-item value="one" transition="fade">One</w-stepper-window-item>
      <w-stepper-window-item value="two" selected-class="is-here">Two</w-stepper-window-item>
    </w-stepper-window>
    <w-tabs-window id="tw" value="b" show-arrows vertical-arrows="left">
      <w-tabs-window-item value="a">A</w-tabs-window-item>
      <w-tabs-window-item value="b">B</w-tabs-window-item>
    </w-tabs-window>
  `);

  await expect(page.locator('#sw w-stepper-window-item[value="two"]')).toHaveClass(/is-here/);
  await page.locator('#sw [data-window-step="-1"]').click();
  await expect(page.locator('#sw')).toHaveAttribute('value', 'one');
  await expect(page.locator('#sw w-stepper-window-item[value="one"] .w-window-item')).toHaveClass(/w-transition--fade/);

  await expect(page.locator('#tw w-tabs-window-item[value="b"]')).toHaveAttribute('selected', '');
  await expect(page.locator('#tw .w-window')).toHaveClass(/w-window--varrows-left/);
});
