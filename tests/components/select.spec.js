import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-select renders field, size, placeholder, options, and hidden input', async ({ mount, page }) => {
  await mount(`
    <w-select id="select" name="plan" label="Plan" hint="Choose carefully" placeholder="Pick one" size="lg">
      <w-option value="free">Free</w-option>
      <w-option value="pro">Pro</w-option>
    </w-select>
  `);

  await expect(page.locator('#select .w-field-label')).toHaveText('Plan');
  await expect(page.locator('#select .w-field-hint')).toHaveText('Choose carefully');
  await expect(page.locator('#select .w-select-field')).toHaveClass(/w-select--lg/);
  await expect(page.locator('#select .w-select-placeholder')).toHaveText('Pick one');
  await expect(page.locator('#select input[type="hidden"]')).toHaveAttribute('name', 'plan');
  await expect(page.locator('#select .w-select-list')).toBeHidden();
  await expect(page.locator('#select .w-select-item')).toHaveCount(2);

  await page.locator('#select').evaluate((el) => {
    el.setAttribute('error', 'Required');
    el.setAttribute('size', 'sm');
  });
  await expect(page.locator('#select .w-field')).toHaveClass(/w-field-error/);
  await expect(page.locator('#select .w-field-hint')).toHaveText('Required');
  await expect(page.locator('#select .w-select-field')).toHaveClass(/w-select--sm/);
});

test('w-select opens, selects a single value, and closes', async ({ mount, page }) => {
  await mount(`
    <w-select id="select" name="plan">
      <w-option value="free">Free</w-option>
      <w-option value="pro">Pro</w-option>
    </w-select>
  `);
  await recordEvents(page, '#select', ['change']);

  await page.locator('#select .w-select-field').click();
  await expect(page.locator('#select .w-select-list')).toBeVisible();

  await page.locator('#select .w-select-item[value="pro"]').click();
  await expect(page.locator('#select')).toHaveAttribute('value', 'pro');
  await expect(page.locator('#select .w-select-list')).toBeHidden();
  await expect(page.locator('#select .w-select-value')).toHaveText('Pro');
  await expect(page.locator('#select input[type="hidden"]')).toHaveValue('pro');
  await expect(page.locator('#select .w-select-item[value="pro"]')).toHaveAttribute('aria-selected', 'true');

  expect(await readEvents(page, '#select')).toEqual([
    { type: 'change', detail: { value: 'pro', name: 'plan' } },
  ]);
});

test('w-select multiple selects several values as chips and keeps the menu open', async ({ mount, page }) => {
  await mount(`
    <w-select id="select" name="tags" multiple closable-chips>
      <w-option value="a">Alpha</w-option>
      <w-option value="b">Beta</w-option>
      <w-option value="c">Gamma</w-option>
    </w-select>
  `);

  await page.locator('#select .w-select-field').click();
  await page.locator('#select .w-select-item[value="a"]').click();
  await page.locator('#select .w-select-item[value="c"]').click();

  await expect(page.locator('#select')).toHaveAttribute('value', 'a,c');
  await expect(page.locator('#select .w-select-list')).toBeVisible();
  await expect(page.locator('#select w-chip')).toHaveCount(2);
  await expect(page.locator('#select .w-select-item[value="a"]')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#select .w-select-item[value="b"]')).toHaveAttribute('aria-selected', 'false');

  // Toggling a selected item removes it.
  await page.locator('#select .w-select-item[value="a"]').click();
  await expect(page.locator('#select')).toHaveAttribute('value', 'c');
  await expect(page.locator('#select w-chip')).toHaveCount(1);
});

test('w-select clearable resets the selection', async ({ mount, page }) => {
  await mount(`
    <w-select id="select" name="plan" clearable value="pro">
      <w-option value="free">Free</w-option>
      <w-option value="pro">Pro</w-option>
    </w-select>
  `);
  await recordEvents(page, '#select', ['change']);

  await expect(page.locator('#select .w-select-clear')).toBeVisible();
  await page.locator('#select .w-select-clear').click();
  await expect(page.locator('#select')).toHaveAttribute('value', '');
  await expect(page.locator('#select .w-select-clear')).toBeHidden();
  expect((await readEvents(page, '#select')).pop()).toEqual({ type: 'change', detail: { value: '', name: 'plan' } });
});

test('w-select keyboard opens, navigates, selects, and Escape closes', async ({ mount, page }) => {
  await mount(`
    <w-select id="select" name="plan">
      <w-option value="free">Free</w-option>
      <w-option value="pro">Pro</w-option>
      <w-option value="team">Team</w-option>
    </w-select>
  `);

  await page.locator('#select .w-select-field').focus();
  await page.keyboard.press('ArrowDown'); // opens, activates first
  await expect(page.locator('#select .w-select-list')).toBeVisible();
  await page.keyboard.press('ArrowDown'); // -> Pro
  await page.keyboard.press('Enter');
  await expect(page.locator('#select')).toHaveAttribute('value', 'pro');
  await expect(page.locator('#select .w-select-list')).toBeHidden();

  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#select .w-select-list')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#select .w-select-list')).toBeHidden();
});

test('w-select disabled does not open', async ({ mount, page }) => {
  await mount(`
    <w-select id="select" value="pro" disabled>
      <w-option value="free">Free</w-option>
      <w-option value="pro">Pro</w-option>
    </w-select>
  `);

  await expect(page.locator('#select .w-select-field')).toHaveAttribute('aria-disabled', 'true');
  await page.locator('#select .w-select-field').click({ force: true });
  await expect(page.locator('#select .w-select-list')).toBeHidden();
});

test('w-select updates the menu when w-option children change', async ({ mount, page }) => {
  await mount(`
    <w-select id="select" name="plan">
      <w-option value="free">Free</w-option>
      <w-option value="pro">Pro</w-option>
    </w-select>
  `);

  await page.locator('#select').evaluate((el) => {
    const option = document.createElement('w-option');
    option.setAttribute('value', 'team');
    option.textContent = 'Team';
    el.appendChild(option);
  });

  await expect(page.locator('#select .w-select-item[value="team"]')).toHaveText('Team');
});
