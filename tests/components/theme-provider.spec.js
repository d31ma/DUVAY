import { expect, test } from '../setup/component-test.js';

test('w-theme-provider scopes a theme via data-w-theme', async ({ mount, page }) => {
  await mount('<w-theme-provider id="tp" theme="dark"><span class="inner">x</span></w-theme-provider>');
  await expect(page.locator('#tp .w-theme-provider')).toHaveAttribute('data-w-theme', 'dark');

  // Tokens inside the scope resolve to the dark palette.
  const ref = await page.evaluate(() => {
    const d = document.createElement('div');
    d.setAttribute('data-w-theme', 'dark');
    document.body.appendChild(d);
    const v = getComputedStyle(d).getPropertyValue('--w-surface').trim();
    d.remove();
    return v;
  });
  const scoped = await page.locator('#tp .w-theme-provider').evaluate((el) => getComputedStyle(el).getPropertyValue('--w-surface').trim());
  expect(scoped).toBe(ref);
});

test('w-theme-provider with-background paints the themed surface', async ({ mount, page }) => {
  await mount('<w-theme-provider id="tp" theme="dark" with-background>content</w-theme-provider>');
  const box = page.locator('#tp .w-theme-provider');
  await expect(box).toHaveClass(/w-theme-provider--with-background/);
  await expect(box).toHaveCSS('display', 'block');
  // dark surface #1c2224 → rgb(28, 34, 36)
  await expect(box).toHaveCSS('background-color', 'rgb(28, 34, 36)');
});
