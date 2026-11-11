import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-otp renders length boxes, reflects value and disabled', async ({ mount, page }) => {
  await mount('<w-otp id="otp" length="4" value="12" disabled></w-otp>');

  await expect(page.locator('#otp input')).toHaveCount(4);
  await expect(page.locator('#otp input').nth(0)).toHaveValue('1');
  await expect(page.locator('#otp input').nth(1)).toHaveValue('2');
  await expect(page.locator('#otp input').nth(2)).toHaveValue('');
  await expect(page.locator('#otp input').nth(0)).toBeDisabled();
});

test('w-otp typing auto-advances and emits input then change', async ({ mount, page }) => {
  await mount('<w-otp id="otp" length="3"></w-otp>');
  await recordEvents(page, '#otp', ['input', 'change']);

  await page.locator('#otp input').nth(0).focus();
  await page.keyboard.type('123');

  await expect(page.locator('#otp')).toHaveAttribute('value', '123');
  const events = await readEvents(page, '#otp');
  expect(events.filter((e) => e.type === 'input').length).toBe(3);
  expect(events.filter((e) => e.type === 'change').pop()).toEqual({ type: 'change', detail: { value: '123' } });
});

test('w-otp backspace on an empty box moves focus back', async ({ mount, page }) => {
  await mount('<w-otp id="otp" length="3" value="12"></w-otp>');

  await page.locator('#otp input').nth(2).focus();
  await page.keyboard.press('Backspace');
  await expect(page.locator('#otp input').nth(1)).toBeFocused();
});

test('w-otp arrow keys navigate between boxes', async ({ mount, page }) => {
  await mount('<w-otp id="otp" length="3" value="123"></w-otp>');

  await page.locator('#otp input').nth(1).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#otp input').nth(0)).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#otp input').nth(1)).toBeFocused();
});

test('w-otp paste distributes a code across the boxes', async ({ mount, page }) => {
  await mount('<w-otp id="otp" length="4"></w-otp>');

  await page.locator('#otp input').nth(0).evaluate((input) => {
    const data = new DataTransfer();
    data.setData('text', '4321');
    input.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true }));
  });

  await expect(page.locator('#otp')).toHaveAttribute('value', '4321');
  await expect(page.locator('#otp input').nth(3)).toHaveValue('1');
});

test('w-otp type=password masks and type=number filters non-digits', async ({ mount, page }) => {
  await mount('<w-otp id="pw" length="3" type="password" value="12"></w-otp><w-otp id="num" length="3" type="number"></w-otp>');

  await expect(page.locator('#pw input').nth(0)).toHaveAttribute('type', 'password');

  await page.locator('#num input').nth(0).focus();
  await page.keyboard.type('a5');
  await expect(page.locator('#num input').nth(0)).toHaveValue('5');
});

test('w-otp divider renders separators between boxes', async ({ mount, page }) => {
  await mount('<w-otp id="otp" length="3" divider="-"></w-otp>');

  await expect(page.locator('#otp .w-otp-separator')).toHaveCount(2);
  await expect(page.locator('#otp .w-otp-separator').nth(0)).toHaveText('-');
});

test('w-otp spreads an autofilled code from one box across the row', async ({ mount, page }) => {
  await mount('<w-otp id="otp" length="6" type="number"></w-otp>');
  await recordEvents(page, '#otp', ['input', 'change']);

  await page.locator('#otp input').nth(0).evaluate((input) => {
    input.value = '482913';
    input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertReplacementText' }));
  });

  const boxes = page.locator('#otp input');
  expect(await boxes.evaluateAll((inputs) => inputs.map((input) => input.value))).toEqual(['4', '8', '2', '9', '1', '3']);
  await expect(page.locator('#otp')).toHaveAttribute('value', '482913');
  await expect(boxes.nth(5)).toBeFocused();
  const events = await readEvents(page, '#otp');
  expect(events.filter((e) => e.type === 'change')).toEqual([{ type: 'change', detail: { value: '482913' } }]);
});

test('w-otp boxes accept a whole code from the one-time-code autofill', async ({ mount, page }) => {
  await mount('<w-otp id="otp" length="4"></w-otp>');
  const first = page.locator('#otp input').nth(0);

  await expect(first).toHaveAttribute('autocomplete', 'one-time-code');
  await expect(first).not.toHaveAttribute('maxlength', /.*/);
});

test('w-otp autofill drops characters the pattern rejects and stops at the last box', async ({ mount, page }) => {
  await mount('<w-otp id="otp" length="3" type="number"></w-otp>');

  await page.locator('#otp input').nth(1).evaluate((input) => {
    input.value = '7-8-9';
    input.dispatchEvent(new InputEvent('input', { bubbles: true }));
  });

  await expect(page.locator('#otp input').nth(0)).toHaveValue('');
  await expect(page.locator('#otp input').nth(1)).toHaveValue('7');
  await expect(page.locator('#otp input').nth(2)).toHaveValue('8');
  await expect(page.locator('#otp')).toHaveAttribute('value', '78');
});

test('w-otp typing into a filled box replaces its character', async ({ mount, page }) => {
  await mount('<w-otp id="otp" length="3" value="12"></w-otp>');
  const first = page.locator('#otp input').nth(0);

  await first.focus();
  await page.keyboard.press('End');
  await page.keyboard.type('5');

  await expect(first).toHaveValue('5');
  await expect(page.locator('#otp input').nth(1)).toBeFocused();
  await expect(page.locator('#otp')).toHaveAttribute('value', '52');
});

test('w-otp-input spreads an autofilled code like w-otp', async ({ mount, page }) => {
  await mount('<w-otp-input id="otp" length="4"></w-otp-input>');

  await page.locator('#otp input').nth(0).evaluate((input) => {
    input.value = 'AB12';
    input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertReplacementText' }));
  });

  await expect(page.locator('#otp')).toHaveAttribute('value', 'AB12');
  await expect(page.locator('#otp input').nth(3)).toHaveValue('2');
});
