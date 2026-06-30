import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-input reflects input, field, state, and size attributes', async ({ mount, page }) => {
  await mount('<w-input id="input" type="email" placeholder="you@example.com" value="a@b.com" disabled readonly name="email" label="Email" hint="Use work email" size="lg"></w-input>');

  const input = page.locator('#input input');
  await expect(page.locator('#input .w-field-label')).toHaveText('Email');
  await expect(page.locator('#input .w-field-hint')).toHaveText('Use work email');
  await expect(input).toHaveAttribute('type', 'email');
  await expect(input).toHaveAttribute('placeholder', 'you@example.com');
  await expect(input).toHaveValue('a@b.com');
  await expect(input).toBeDisabled();
  await expect(input).toHaveAttribute('readonly', '');
  await expect(input).toHaveAttribute('name', 'email');
  await expect(input).toHaveClass(/w-input--lg/);

  await page.locator('#input').evaluate((el) => {
    el.setAttribute('error', 'Required');
    el.setAttribute('size', 'sm');
    el.removeAttribute('disabled');
  });

  await expect(page.locator('#input .w-field')).toHaveClass(/w-field-error/);
  await expect(page.locator('#input .w-field-hint')).toHaveText('Required');
  await expect(input).toHaveClass(/w-input--sm/);
  await expect(input).toBeEnabled();
});

test('w-input emits native input and change events and supports property value updates', async ({ mount, page }) => {
  await mount('<w-input id="input" name="query" value="alpha"></w-input>');
  await recordEvents(page, '#input', ['input', 'change']);

  await page.locator('#input input').fill('beta');
  await page.locator('#input input').dispatchEvent('change');
  await page.locator('#input').evaluate((el) => {
    el.value = 'gamma';
  });

  await expect(page.locator('#input')).toHaveAttribute('value', 'gamma');
  await expect(page.locator('#input input')).toHaveValue('gamma');
  expect(await readEvents(page, '#input')).toEqual([
    { type: 'input', detail: { value: 'beta', name: 'query' } },
    { type: 'change', detail: { value: 'beta', name: 'query' } },
  ]);
});

test('w-input supports vanilla inline oninput and onchange handlers', async ({ mount, page }) => {
  await mount(`
    <w-input
      id="input"
      value="alpha"
      oninput="this.dataset.inputValue = event.detail.value"
      onchange="this.dataset.changeValue = event.detail.value"
    ></w-input>
  `);

  await page.locator('#input input').fill('beta');
  await page.locator('#input input').dispatchEvent('change');

  await expect(page.locator('#input')).toHaveAttribute('data-input-value', 'beta');
  await expect(page.locator('#input')).toHaveAttribute('data-change-value', 'beta');
  await expect(page.locator('#input')).not.toHaveAttribute('model-value');
});

test('w-input supports @input and @change shorthand handlers', async ({ mount, page }) => {
  await mount(`
    <w-input
      id="input"
      value="alpha"
      @input="this.dataset.inputValue = event.detail.value"
      @change="this.dataset.changeValue = event.detail.value"
    ></w-input>
  `);

  await page.locator('#input input').fill('beta');
  await page.locator('#input input').dispatchEvent('change');

  await expect(page.locator('#input')).toHaveAttribute('data-input-value', 'beta');
  await expect(page.locator('#input')).toHaveAttribute('data-change-value', 'beta');
});
