import { expect, test } from '../setup/component-test.js';

test('w-snackbar-queue renders one snackbar per initial message', async ({ mount, page }) => {
  await mount('<w-snackbar-queue id="q" messages="Saved,Exported" timeout="-1"></w-snackbar-queue>');
  await expect(page.locator('#q w-snackbar')).toHaveCount(2);
  await expect(page.locator('#q w-snackbar').first().locator('.w-snackbar-msg')).toHaveText('Saved');
});

test('w-snackbar-queue forwards color to queued snackbars', async ({ mount, page }) => {
  await mount('<w-snackbar-queue id="q" messages="Hi" color="success" timeout="-1"></w-snackbar-queue>');
  await expect(page.locator('#q w-snackbar')).toHaveAttribute('color', 'success');
});

test('w-snackbar-queue push() adds a message and dismissing removes it', async ({ mount, page }) => {
  await mount('<w-snackbar-queue id="q" messages="One" timeout="-1"></w-snackbar-queue>');
  await expect(page.locator('#q w-snackbar')).toHaveCount(1);

  await page.locator('#q').evaluate((el) => el.push('Two'));
  await expect(page.locator('#q w-snackbar')).toHaveCount(2);

  // Dismiss programmatically — queued snackbars are fixed-position and overlap,
  // so a real click on the buried one isn't reliable.
  await page.locator('#q w-snackbar').first().evaluate((el) => el.close());
  await expect(page.locator('#q w-snackbar')).toHaveCount(1);
});
