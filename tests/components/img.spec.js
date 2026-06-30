import { expect, test } from '../setup/component-test.js';

test('w-img renders the inner image with src, alt, and lazy loading by default', async ({ mount, page }) => {
  await mount('<w-img id="im" src="/photo.jpg" alt="A photo"></w-img>');
  const img = page.locator('#im .w-img__img');
  await expect(img).toHaveAttribute('src', '/photo.jpg');
  await expect(img).toHaveAttribute('alt', 'A photo');
  await expect(img).toHaveAttribute('loading', 'lazy');

  await mount('<w-img id="im2" src="/photo.jpg" alt="" eager></w-img>');
  await expect(page.locator('#im2 .w-img__img')).not.toHaveAttribute('loading', 'lazy');
});

test('w-img applies cover, position, aspect-ratio, dimensions, and rounded', async ({ mount, page }) => {
  await mount('<w-img id="im" src="/p.jpg" alt="" cover position="center top" aspect-ratio="16 / 9" max-width="400" rounded="lg"></w-img>');
  const box = page.locator('#im .w-img');
  await expect(page.locator('#im .w-img__img')).toHaveClass(/w-img__img--cover/);
  await expect(page.locator('#im .w-img__img')).toHaveCSS('object-position', '50% 0%');
  await expect(box).toHaveClass(/w-img--rounded-lg/);
  await expect(box).toHaveCSS('aspect-ratio', '16 / 9');
  await expect(box).toHaveCSS('max-width', '400px');
});

test('w-img renders a gradient overlay and lazy-src placeholder', async ({ mount, page }) => {
  await mount('<w-img id="im" src="/p.jpg" alt="" gradient="to top, rgba(0,0,0,.6), transparent" lazy-src="/tiny.jpg"></w-img>');
  await expect(page.locator('#im .w-img__gradient')).toHaveCount(1);
  await expect(page.locator('#im .w-img__placeholder--lazy')).toHaveCount(1);
});

test('w-img supports placeholder and error slots', async ({ mount, page }) => {
  await mount('<w-img id="im" src="/p.jpg" alt=""><span slot="placeholder" class="ph">loading</span><span slot="error" class="er">broken</span></w-img>');
  await expect(page.locator('#im .w-img__placeholder .ph')).toHaveText('loading');
  await expect(page.locator('#im .w-img__error .er')).toHaveText('broken');
});

test('w-img emits a load event when the image loads', async ({ mount, page }) => {
  await mount('<w-img id="im" alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></w-img>');
  await page.waitForFunction(() => document.querySelector('#im')?.classList.contains('w-img--loaded'));
  await expect(page.locator('#im')).toHaveClass(/w-img--loaded/);
});
