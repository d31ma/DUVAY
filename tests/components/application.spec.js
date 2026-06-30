import { expect, test } from '../setup/component-test.js';

test('w-app applies full-height by default and scopes a theme', async ({ mount, page }) => {
  await mount('<w-app id="a" theme="dark"><div>content</div></w-app>');
  const app = page.locator('#a .w-app');
  await expect(app).toHaveClass(/w-app--full-height/);
  await expect(app).toHaveAttribute('data-w-theme', 'dark');
});

test('w-app full-height="false" opts out of full height', async ({ mount, page }) => {
  await mount('<w-app id="a" full-height="false">content</w-app>');
  await expect(page.locator('#a .w-app')).not.toHaveClass(/w-app--full-height/);
});

test('w-main scrollable becomes its own scroll area', async ({ mount, page }) => {
  await mount('<w-main id="m" scrollable>content</w-main>');
  const main = page.locator('#m .w-main');
  await expect(main).toHaveClass(/w-main--scrollable/);
  await expect(main).toHaveCSS('overflow-y', 'auto');
});
