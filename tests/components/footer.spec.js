import { expect, test } from '../setup/component-test.js';

test('w-footer renders default slot', async ({ mount, page }) => {
  await mount('<w-footer id="f">© 2026 DuVay</w-footer>');
  await expect(page.locator('#f .w-footer')).toHaveText('© 2026 DuVay');
});

test('w-footer supports color prop with semantic tokens and custom CSS', async ({ mount, page }) => {
  await mount('<w-footer id="f" color="primary">Primary</w-footer>');
  await expect(page.locator('#f .w-footer')).toHaveClass(/w-footer--color-primary/);

  await mount('<w-footer id="f2" color="#ff5722">Custom</w-footer>');
  const bg = await page.locator('#f2 .w-footer').evaluate((el) => getComputedStyle(el).getPropertyValue('--w-footer-bg').trim());
  expect(bg).toBe('#ff5722');
});

test('w-footer supports height prop', async ({ mount, page }) => {
  await mount('<w-footer id="f" height="64">64px</w-footer>');
  const height = await page.locator('#f .w-footer').evaluate((el) => getComputedStyle(el).getPropertyValue('--w-footer-height').trim());
  expect(height).toBe('64px');

  await mount('<w-footer id="f2" height="3rem">3rem</w-footer>');
  const heightRem = await page.locator('#f2 .w-footer').evaluate((el) => getComputedStyle(el).getPropertyValue('--w-footer-height').trim());
  expect(heightRem).toBe('3rem');
});

test('w-footer supports border prop', async ({ mount, page }) => {
  await mount('<w-footer id="f" border>Bordered</w-footer>');
  await expect(page.locator('#f .w-footer')).toHaveClass(/w-footer--border/);
});

test('w-footer supports elevation prop', async ({ mount, page }) => {
  await mount('<w-footer id="f" elevation="3">Elevated</w-footer>');
  await expect(page.locator('#f .w-footer')).toHaveClass(/w-footer--elevation-3/);
});

test('w-footer supports rounded prop', async ({ mount, page }) => {
  await mount('<w-footer id="f" rounded>Basic</w-footer>');
  await expect(page.locator('#f .w-footer')).toHaveClass(/w-footer--rounded/);

  await mount('<w-footer id="f2" rounded="pill">Pill</w-footer>');
  await expect(page.locator('#f2 .w-footer')).toHaveClass(/w-footer--rounded-pill/);
});

test('w-footer supports app prop', async ({ mount, page }) => {
  await mount('<w-footer id="f" app>App</w-footer>');
  await expect(page.locator('#f .w-footer')).toHaveClass(/w-footer--app/);
});

test('w-footer re-renders on attribute change', async ({ mount, page }) => {
  await mount('<w-footer id="f">Default</w-footer>');

  await page.locator('#f').evaluate((el) => {
    el.setAttribute('color', 'error');
    el.setAttribute('border', '');
    el.setAttribute('elevation', '1');
  });

  await expect(page.locator('#f .w-footer')).toHaveClass(/w-footer--color-error/);
  await expect(page.locator('#f .w-footer')).toHaveClass(/w-footer--border/);
  await expect(page.locator('#f .w-footer')).toHaveClass(/w-footer--elevation-1/);
});
