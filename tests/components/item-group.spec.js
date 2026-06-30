import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-item-group reflects value, multiple, mandatory, selected-class, and disabled attrs', async ({ mount, page }) => {
  await mount(`
    <w-item-group id="items" value="a" selected-class="picked">
      <button value="a">A</button>
      <button value="b">B</button>
    </w-item-group>
  `);
  await recordEvents(page, '#items', ['change']);

  await expect(page.locator('#items')).toHaveAttribute('value', 'a');
  await expect(page.locator('#items button[value="a"]')).toHaveClass(/picked/);
  await page.locator('#items button[value="b"]').click({ force: true });
  await expect(page.locator('#items')).toHaveAttribute('value', 'b');
  await expect(page.locator('#items button[value="b"]')).toHaveAttribute('selected', '');

  await page.locator('#items').evaluate((el) => {
    el.setAttribute('multiple', '');
    el.setAttribute('mandatory', '');
    el.setAttribute('value', '["a","b"]');
    el.setAttribute('disabled', '');
  });
  await page.locator('#items button[value="b"]').click({ force: true });
  await expect(page.locator('#items')).toHaveAttribute('value', '["a","b"]');

  expect((await readEvents(page, '#items')).filter((event) => event.type === 'change')).toEqual([
    { type: 'change', detail: { value: 'b' } },
  ]);
});

test('w-item-group max limits selections in multiple mode', async ({ mount, page }) => {
  await mount(`
    <w-item-group id="items" multiple max="2" value='["a"]'>
      <button value="a">A</button>
      <button value="b">B</button>
      <button value="c">C</button>
    </w-item-group>
  `);
  await recordEvents(page, '#items', ['change']);

  await page.locator('#items button[value="b"]').click();
  await expect(page.locator('#items')).toHaveAttribute('value', '["a","b"]');

  await page.locator('#items button[value="c"]').click();
  await expect(page.locator('#items')).toHaveAttribute('value', '["a","b"]');

  expect((await readEvents(page, '#items')).filter((event) => event.type === 'change')).toEqual([
    { type: 'change', detail: { value: ['a', 'b'] } },
  ]);
});

test('w-item-group max is ignored in single mode', async ({ mount, page }) => {
  await mount(`
    <w-item-group id="items" max="1" value="a">
      <button value="a">A</button>
      <button value="b">B</button>
    </w-item-group>
  `);

  await page.locator('#items button[value="b"]').click();
  await expect(page.locator('#items')).toHaveAttribute('value', 'b');
});

test('w-item-group active-class aliases selected-class', async ({ mount, page }) => {
  await mount(`
    <w-item-group id="items" value="a" active-class="picked">
      <button value="a">A</button>
      <button value="b">B</button>
    </w-item-group>
  `);

  await expect(page.locator('#items button[value="a"]')).toHaveClass(/picked/);
  await page.locator('#items button[value="b"]').click();
  await expect(page.locator('#items button[value="b"]')).toHaveClass(/picked/);
  await expect(page.locator('#items button[value="a"]')).not.toHaveClass(/picked/);
});

test('w-item-group active-class takes precedence over selected-class', async ({ mount, page }) => {
  await mount(`
    <w-item-group id="items" value="a" active-class="picked" selected-class="ignored">
      <button value="a">A</button>
    </w-item-group>
  `);

  await expect(page.locator('#items button[value="a"]')).toHaveClass(/picked/);
  await expect(page.locator('#items button[value="a"]')).not.toHaveClass(/ignored/);
});

test('w-item-group syncs newly added and removed items', async ({ mount, page }) => {
  await mount(`
    <w-item-group id="items" multiple value='["a"]'>
      <button value="a">A</button>
    </w-item-group>
  `);

  await page.locator('#items').evaluate((el) => {
    const b = document.createElement('button');
    b.setAttribute('value', 'b');
    b.textContent = 'B';
    el.appendChild(b);
  });

  await page.locator('#items button[value="b"]').click();
  await expect(page.locator('#items')).toHaveAttribute('value', '["a","b"]');

  await page.locator('#items button[value="a"]').evaluate((el) => el.remove());
  await expect(page.locator('#items button')).toHaveCount(1);

  await page.locator('#items button[value="b"]').click();
  await expect(page.locator('#items')).toHaveAttribute('value', '[]');
});

test('w-item-group uses roving tabindex and keyboard navigation', async ({ mount, page }) => {
  await mount(`
    <w-item-group id="items" value="a">
      <button value="a">A</button>
      <button value="b">B</button>
      <button value="c" disabled>C</button>
      <button value="d">D</button>
    </w-item-group>
  `);

  await expect(page.locator('#items button[value="a"]')).toHaveAttribute('tabindex', '0');
  await expect(page.locator('#items button[value="b"]')).toHaveAttribute('tabindex', '-1');
  await expect(page.locator('#items button[value="c"]')).toHaveAttribute('tabindex', '-1');

  await page.locator('#items button[value="a"]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#items button[value="b"]')).toBeFocused();
  await expect(page.locator('#items button[value="b"]')).toHaveAttribute('tabindex', '0');
  await expect(page.locator('#items button[value="a"]')).toHaveAttribute('tabindex', '-1');

  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#items button[value="d"]')).toBeFocused();

  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#items button[value="b"]')).toBeFocused();

  await page.keyboard.press('End');
  await expect(page.locator('#items button[value="d"]')).toBeFocused();

  await page.keyboard.press('Home');
  await expect(page.locator('#items button[value="a"]')).toBeFocused();
});

test('w-item-group Space and Enter toggle focused item', async ({ mount, page }) => {
  await mount(`
    <w-item-group id="items" multiple value='["a"]'>
      <button value="a">A</button>
      <button value="b">B</button>
    </w-item-group>
  `);

  await page.locator('#items button[value="b"]').focus();
  await page.keyboard.press('Space');
  await expect(page.locator('#items')).toHaveAttribute('value', '["a","b"]');

  await page.locator('#items button[value="b"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#items')).toHaveAttribute('value', '["a"]');
});

test('w-item-group sets aria-multiselectable and aria-disabled on the group', async ({ mount, page }) => {
  await mount(`
    <w-item-group id="items" multiple disabled>
      <button value="a">A</button>
    </w-item-group>
  `);

  const group = page.locator('#items .w-item-group');
  await expect(group).toHaveAttribute('aria-multiselectable', 'true');
  await expect(group).toHaveAttribute('aria-disabled', 'true');

  await page.locator('#items').evaluate((el) => {
    el.removeAttribute('disabled');
    el.removeAttribute('multiple');
  });
  await expect(group).not.toHaveAttribute('aria-multiselectable');
  await expect(group).not.toHaveAttribute('aria-disabled');
});

test('w-item-group mandatory plus max keeps one selection and respects the cap', async ({ mount, page }) => {
  await mount(`
    <w-item-group id="items" multiple mandatory max="2" value='["a"]'>
      <button value="a">A</button>
      <button value="b">B</button>
      <button value="c">C</button>
    </w-item-group>
  `);

  await page.locator('#items button[value="a"]').click();
  await expect(page.locator('#items')).toHaveAttribute('value', '["a"]');

  await page.locator('#items button[value="b"]').click();
  await expect(page.locator('#items')).toHaveAttribute('value', '["a","b"]');

  await page.locator('#items button[value="c"]').click();
  await expect(page.locator('#items')).toHaveAttribute('value', '["a","b"]');

  await page.locator('#items button[value="b"]').click();
  await expect(page.locator('#items')).toHaveAttribute('value', '["a"]');
});

test('w-item-group disabled item cannot be selected', async ({ mount, page }) => {
  await mount(`
    <w-item-group id="items" multiple value='["a"]'>
      <button value="a">A</button>
      <button value="b" disabled>B</button>
    </w-item-group>
  `);

  await page.locator('#items button[value="b"]').click({ force: true });
  await expect(page.locator('#items')).toHaveAttribute('value', '["a"]');
});

test('w-item-group single mandatory cannot be cleared and reports string detail', async ({ mount, page }) => {
  await mount(`
    <w-item-group id="g" mandatory value="b">
      <button value="a">A</button>
      <button value="b">B</button>
      <button value="c">C</button>
    </w-item-group>
  `);
  await recordEvents(page, '#g', ['change']);

  // Re-clicking the only selected item keeps it selected.
  await page.locator('#g [value="b"]').click();
  await expect(page.locator('#g')).toHaveAttribute('value', 'b');

  await page.locator('#g [value="c"]').click();
  await expect(page.locator('#g')).toHaveAttribute('value', 'c');
  expect(await readEvents(page, '#g')).toEqual([
    { type: 'change', detail: { value: 'c' } },
  ]);
});
