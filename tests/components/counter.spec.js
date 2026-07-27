import { expect, test } from '../setup/component-test.js';

test('w-counter renders its value and an optional max', async ({ mount, page }) => {
  await mount(`
    <w-counter id="plain" value="42"></w-counter>
    <w-counter id="capped" value="42" max="120"></w-counter>
  `);

  await expect(page.locator('#plain .w-counter')).toHaveText('42');
  await expect(page.locator('#capped .w-counter')).toHaveText('42 / 120');

  await page.locator('#capped').evaluate((el) => el.setAttribute('value', '99'));
  await expect(page.locator('#capped .w-counter')).toHaveText('99 / 120');
});

test('w-counter tweens to a rounded value and keeps the max suffix', async ({ mount, page }) => {
  await mount(`
    <w-counter id="tweened" value="42.7" tween></w-counter>
    <w-counter id="tweened-max" value="42.7" max="120" tween></w-counter>
    <w-counter id="static" value="42.7"></w-counter>
  `);

  // The tween writes integer-formatted text, so the fractional source value is
  // rounded once the animation settles; the untweened counter keeps it verbatim.
  await expect(page.locator('#tweened .w-counter')).toHaveText('43');
  await expect(page.locator('#tweened-max .w-counter')).toHaveText('43 / 120');
  await expect(page.locator('#static .w-counter')).toHaveText('42.7');
});

test('w-counter leaves a non-numeric value untouched when tween is set', async ({ mount, page }) => {
  await mount('<w-counter id="counter" value="soon" tween></w-counter>');

  await expect(page.locator('#counter .w-counter')).toHaveText('soon');
  await page.waitForTimeout(50);
  await expect(page.locator('#counter .w-counter')).toHaveText('soon');
});
