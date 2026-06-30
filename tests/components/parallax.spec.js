import { expect, test } from '../setup/component-test.js';

test('w-parallax renders the image and centered content slot', async ({ mount, page }) => {
  await mount('<w-parallax id="px" src="/bg.jpg" alt="Mountains" height="300px"><h2>Title</h2></w-parallax>');
  await expect(page.locator('#px .w-parallax-img')).toHaveAttribute('src', '/bg.jpg');
  await expect(page.locator('#px .w-parallax-img')).toHaveAttribute('alt', 'Mountains');
  await expect(page.locator('#px .w-parallax')).toHaveCSS('height', '300px');
  await expect(page.locator('#px .w-parallax-content')).toContainText('Title');
});

test('w-parallax shifts the image on scroll (when motion is allowed)', async ({ mount, page }) => {
  // Tall spacer so the parallax element can scroll through the viewport.
  await mount('<div style="height:150vh"></div><w-parallax id="px" src="/bg.jpg" alt="" scale="0.8"></w-parallax><div style="height:150vh"></div>');
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(50);
  const transform = await page.locator('#px .w-parallax-img').evaluate((el) => el.style.transform);
  expect(transform).toContain('translateY');
});
