import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-native-select preserves native options and emits change', async ({ mount, page }) => {
  await mount(`
    <w-native-select id="native" value="pro" name="plan" label="Plan" hint="Native" size="lg">
      <option value="free">Free</option>
      <option value="pro">Pro</option>
    </w-native-select>
  `);
  await recordEvents(page, '#native', ['change']);

  await expect(page.locator('#native select')).toHaveValue('pro');
  await expect(page.locator('#native select')).toHaveClass(/w-select--lg/);

  await page.locator('#native select').selectOption('free');
  await expect(page.locator('#native')).toHaveAttribute('value', 'free');
  expect(await readEvents(page, '#native')).toEqual([
    { type: 'change', detail: { value: 'free', name: 'plan' } },
  ]);
});
