import { expect, test } from '../setup/component-test.js';

test('w-system-bar renders default slot and role', async ({ mount, page }) => {
  await mount('<w-system-bar id="sb">No Wi-Fi</w-system-bar>');

  await expect(page.locator('#sb .w-system-bar')).toHaveAttribute('role', 'status');
  await expect(page.locator('#sb .w-system-bar')).toHaveText('No Wi-Fi');
});

test('w-system-bar supports color prop with semantic tokens and custom CSS', async ({ mount, page }) => {
  await mount('<w-system-bar id="sb" color="primary">Primary</w-system-bar>');
  await expect(page.locator('#sb .w-system-bar')).toHaveClass(/w-system-bar--color-primary/);

  await mount('<w-system-bar id="sb2" color="#ff5722">Custom</w-system-bar>');
  const bg = await page.locator('#sb2 .w-system-bar').evaluate((el) => getComputedStyle(el).getPropertyValue('--w-system-bar-bg').trim());
  expect(bg).toBe('#ff5722');
});

test('w-system-bar supports height and window props', async ({ mount, page }) => {
  await mount('<w-system-bar id="sb" window>Window</w-system-bar>');
  const heightWindow = await page.locator('#sb .w-system-bar').evaluate((el) => getComputedStyle(el).getPropertyValue('--w-system-bar-height').trim());
  expect(heightWindow).toBe('32px');
  await expect(page.locator('#sb .w-system-bar')).toHaveClass(/w-system-bar--window/);

  await mount('<w-system-bar id="sb2" height="48">48px</w-system-bar>');
  const height48 = await page.locator('#sb2 .w-system-bar').evaluate((el) => getComputedStyle(el).getPropertyValue('--w-system-bar-height').trim());
  expect(height48).toBe('48px');

  await mount('<w-system-bar id="sb3" height="2rem">2rem</w-system-bar>');
  const heightRem = await page.locator('#sb3 .w-system-bar').evaluate((el) => getComputedStyle(el).getPropertyValue('--w-system-bar-height').trim());
  expect(heightRem).toBe('2rem');
});

test('w-system-bar supports rounded prop', async ({ mount, page }) => {
  await mount('<w-system-bar id="sb" rounded>Basic</w-system-bar>');
  await expect(page.locator('#sb .w-system-bar')).toHaveClass(/w-system-bar--rounded/);

  await mount('<w-system-bar id="sb2" rounded="lg">Large</w-system-bar>');
  await expect(page.locator('#sb2 .w-system-bar')).toHaveClass(/w-system-bar--rounded-lg/);
});

test('w-system-bar supports elevation prop', async ({ mount, page }) => {
  await mount('<w-system-bar id="sb" elevation="3">Elevated</w-system-bar>');
  await expect(page.locator('#sb .w-system-bar')).toHaveClass(/w-system-bar--elevation-3/);
});

test('w-system-bar supports absolute prop', async ({ mount, page }) => {
  await mount('<w-system-bar id="sb" absolute>Absolute</w-system-bar>');
  await expect(page.locator('#sb .w-system-bar')).toHaveClass(/w-system-bar--absolute/);
});

test('w-system-bar re-renders on attribute change', async ({ mount, page }) => {
  await mount('<w-system-bar id="sb">Default</w-system-bar>');

  await page.locator('#sb').evaluate((el) => {
    el.setAttribute('color', 'success');
    el.setAttribute('window', '');
    el.setAttribute('elevation', '2');
  });

  await expect(page.locator('#sb .w-system-bar')).toHaveClass(/w-system-bar--color-success/);
  await expect(page.locator('#sb .w-system-bar')).toHaveClass(/w-system-bar--window/);
  await expect(page.locator('#sb .w-system-bar')).toHaveClass(/w-system-bar--elevation-2/);
});
