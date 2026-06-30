import { expect, test } from '../setup/component-test.js';

test('w-aspect-ratio sets the ratio variable from ratio or aspect-ratio', async ({ mount, page }) => {
  await mount('<w-aspect-ratio id="ar" ratio="4 / 3"><img src="/x.png" alt=""></w-aspect-ratio>');
  const box = page.locator('#ar .w-aspect-ratio');
  expect(await box.evaluate((el) => getComputedStyle(el).getPropertyValue('--w-aspect-ratio').trim())).toBe('4 / 3');
  await expect(page.locator('#ar .w-aspect-ratio__content')).toHaveCount(1);

  await mount('<w-aspect-ratio id="ar2" aspect-ratio="21 / 9"></w-aspect-ratio>');
  expect(await page.locator('#ar2 .w-aspect-ratio').evaluate((el) => getComputedStyle(el).getPropertyValue('--w-aspect-ratio').trim())).toBe('21 / 9');
});

test('w-aspect-ratio applies dimension props, content-class, and inline', async ({ mount, page }) => {
  await mount('<w-aspect-ratio id="ar" max-width="320" content-class="hero" inline></w-aspect-ratio>');
  const box = page.locator('#ar .w-aspect-ratio');
  await expect(box).toHaveClass(/w-aspect-ratio--inline/);
  await expect(box).toHaveCSS('max-width', '320px');
  await expect(page.locator('#ar .w-aspect-ratio__content')).toHaveClass(/hero/);
});
