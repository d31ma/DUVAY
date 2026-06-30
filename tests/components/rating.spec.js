import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-rating reflects Vuetify-style visual, form, label, and layout attributes', async ({ mount, page }) => {
  await mount(`
    <w-rating
      id="rating"
      value="2.5"
      length="7"
      half-increments
      name="quality"
      label="Release quality"
      item-aria-label="{value} out of {length}"
      item-labels='["Poor","Fair","Okay","Good","Great","Excellent","Perfect"]'
      item-label-position="bottom"
      empty-icon="☆"
      full-icon="★"
      color="secondary"
      active-color="warning"
      density="compact"
      size="lg"
      tag="section"
      theme="dark"
      hover
      ripple
      clearable
    ></w-rating>
  `);

  const root = page.locator('#rating > .w-rating');
  await expect(root).toHaveJSProperty('tagName', 'SECTION');
  await expect(root).toHaveAttribute('role', 'radiogroup');
  await expect(root).toHaveAttribute('aria-label', 'Release quality');
  await expect(root).toHaveAttribute('data-w-theme', 'dark');
  await expect(root).toHaveClass(/w-rating--half-increments/);
  await expect(root).toHaveClass(/w-rating--hover/);
  await expect(root).toHaveClass(/w-rating--ripple/);
  await expect(root).toHaveClass(/w-rating--density-compact/);
  await expect(root).toHaveClass(/w-rating--labels-bottom/);
  await expect(root).toHaveCSS('--w-rating-size', '32px');
  await expect(root).toHaveCSS('--w-rating-color', '#adc9c2');
  await expect(root).toHaveCSS('--w-rating-active-color', '#ffb86b');

  await expect(page.locator('#rating .w-rating__wrapper')).toHaveCount(7);
  await expect(page.locator('#rating .w-rating__control')).toHaveCount(14);
  await expect(page.locator('#rating .w-rating__label')).toHaveCount(7);
  await expect(page.locator('#rating .w-rating__label').first()).toHaveText('Poor');
  await expect(page.locator('#rating .w-rating__control[data-value="2.5"]')).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('#rating .w-rating__control[data-value="2.5"]')).toHaveAttribute('aria-label', '2.5 out of 7');
  await expect(page.locator('#rating .w-rating__input')).toHaveAttribute('name', 'quality');
  await expect(page.locator('#rating .w-rating__input')).toHaveValue('2.5');
  await expect(page.locator('#rating .w-rating__icon--empty').first()).toContainText('☆');
  await expect(page.locator('#rating .w-rating__icon--filled').first()).toContainText('★');
});

test('w-rating selects and clears values while reflecting value and change events', async ({ mount, page }) => {
  await mount('<w-rating id="rating" value="2" clearable></w-rating>');
  await recordEvents(page, '#rating', ['change']);

  await page.locator('#rating .w-rating__control[data-value="4"]').click();
  await expect(page.locator('#rating')).toHaveAttribute('value', '4');
  await expect(page.locator('#rating .w-rating__input')).toHaveValue('4');
  await expect(page.locator('#rating .w-rating__control[data-value="4"]')).toHaveAttribute('aria-checked', 'true');

  await page.locator('#rating .w-rating__control[data-value="4"]').click();
  await expect(page.locator('#rating')).toHaveAttribute('value', '0');
  await expect(page.locator('#rating .w-rating__control[aria-checked="true"]')).toHaveCount(0);

  expect(await readEvents(page, '#rating')).toEqual([
    { type: 'change', detail: { value: 4 } },
    { type: 'change', detail: { value: 0 } },
  ]);
});

test('w-rating supports half-step roving focus and keyboard changes', async ({ mount, page }) => {
  await mount('<w-rating id="rating" value="2.5" half-increments></w-rating>');
  await recordEvents(page, '#rating', ['change']);

  const current = page.locator('#rating .w-rating__control[data-value="2.5"]');
  await expect(current).toHaveAttribute('tabindex', '0');
  await current.focus();
  await current.press('ArrowRight');
  await expect(page.locator('#rating')).toHaveAttribute('value', '3');
  await expect(page.locator('#rating .w-rating__control[data-value="3"]')).toBeFocused();

  await page.locator('#rating .w-rating__control[data-value="3"]').press('ArrowLeft');
  await expect(page.locator('#rating')).toHaveAttribute('value', '2.5');

  await page.locator('#rating .w-rating__control[data-value="2.5"]').press('End');
  await expect(page.locator('#rating')).toHaveAttribute('value', '5');

  await page.locator('#rating .w-rating__control[data-value="5"]').press('Home');
  await expect(page.locator('#rating')).toHaveAttribute('value', '0');
  await expect(page.locator('#rating .w-rating__control[data-value="0.5"]')).toBeFocused();

  expect((await readEvents(page, '#rating')).map((event) => event.detail.value)).toEqual([3, 2.5, 5, 0]);
});

test('w-rating previews hover values without committing them', async ({ mount, page }) => {
  await mount('<w-rating id="rating" value="2" hover></w-rating>');

  await page.locator('#rating .w-rating__control[data-value="4"]').dispatchEvent('mouseenter');
  await expect(page.locator('#rating > .w-rating')).toHaveAttribute('data-hover-value', '4');
  await expect(page.locator('#rating .w-rating__wrapper[data-index="4"]')).toHaveAttribute('data-state', 'full');
  await expect(page.locator('#rating')).toHaveAttribute('value', '2');

  await page.locator('#rating .w-rating__control[data-value="4"]').dispatchEvent('mouseleave');
  await expect(page.locator('#rating > .w-rating')).not.toHaveAttribute('data-hover-value');
  await expect(page.locator('#rating .w-rating__wrapper[data-index="4"]')).toHaveAttribute('data-state', 'empty');
});

test('w-rating blocks disabled and readonly interaction', async ({ mount, page }) => {
  await mount(`
    <w-rating id="disabled" value="2" disabled></w-rating>
    <w-rating id="readonly" value="3" readonly></w-rating>
  `);

  await expect(page.locator('#disabled > .w-rating')).toHaveAttribute('aria-disabled', 'true');
  await expect(page.locator('#disabled .w-rating__control').first()).toBeDisabled();
  await expect(page.locator('#readonly > .w-rating')).toHaveAttribute('aria-readonly', 'true');
  await expect(page.locator('#readonly .w-rating__control').first()).not.toBeDisabled();

  await page.locator('#disabled .w-rating__control[data-value="5"]').click({ force: true });
  await page.locator('#readonly .w-rating__control[data-value="5"]').click({ force: true });
  await expect(page.locator('#disabled')).toHaveAttribute('value', '2');
  await expect(page.locator('#readonly')).toHaveAttribute('value', '3');
});

test('w-rating clones item and item-label slots and responds to attribute changes', async ({ mount, page }) => {
  await mount(`
    <w-rating id="rating" value="1" length="3" item-labels='["Low","Medium","High"]'>
      <template slot="item"><span class="custom-rating-icon">◆</span></template>
      <template slot="item-label"><strong class="custom-rating-label">{{label}}</strong></template>
    </w-rating>
  `);

  await expect(page.locator('#rating .custom-rating-icon')).toHaveCount(6);
  await expect(page.locator('#rating .custom-rating-label')).toHaveCount(3);
  await expect(page.locator('#rating .custom-rating-label').first()).toHaveText('Low');

  await page.locator('#rating').evaluate((rating) => {
    rating.setAttribute('length', '4');
    rating.setAttribute('value', '3.5');
    rating.setAttribute('half-increments', '');
    rating.setAttribute('item-label-position', 'bottom');
    rating.setAttribute('item-labels', '["One","Two","Three","Four"]');
  });

  await expect(page.locator('#rating .w-rating__wrapper')).toHaveCount(4);
  await expect(page.locator('#rating .w-rating__control')).toHaveCount(8);
  await expect(page.locator('#rating .w-rating__control[data-value="3.5"]')).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('#rating > .w-rating')).toHaveClass(/w-rating--labels-bottom/);
  await expect(page.locator('#rating .custom-rating-label').last()).toHaveText('Four');
});

test('w-rating accepts Vuetify size aliases, numeric sizes, CSS colors, and DuVay color aliases', async ({ mount, page }) => {
  await mount(`
    <w-rating id="named" value="2" size="x-large" active-color="danger"></w-rating>
    <w-rating id="numeric" value="2" size="28" color="rebeccapurple"></w-rating>
  `);

  await expect(page.locator('#named > .w-rating')).toHaveCSS('--w-rating-size', '2.5rem');
  await expect(page.locator('#named > .w-rating')).toHaveCSS('--w-rating-active-color', '#f2b8b5');
  await expect(page.locator('#numeric > .w-rating')).toHaveCSS('--w-rating-size', '28px');
  await expect(page.locator('#numeric > .w-rating')).toHaveCSS('--w-rating-color', 'rebeccapurple');

  await page.locator('#named').evaluate((rating) => {
    rating.setAttribute('value', '1');
    rating.value = 4;
  });
  await expect(page.locator('#named')).toHaveAttribute('value', '4');
});
