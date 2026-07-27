import { expect, test } from '../setup/component-test.js';

test('w-icon renders the icon name and supports the icon alias', async ({ mount, page }) => {
  await mount('<w-icon id="i" name="home"></w-icon>');
  await expect(page.locator('#i .w-icon')).toHaveText('home');

  await mount('<w-icon id="i2" icon="search"></w-icon>');
  await expect(page.locator('#i2 .w-icon')).toHaveText('search');
});

test('w-icon applies size aliases, start, end, and disabled modifiers', async ({ mount, page }) => {
  await mount('<w-icon id="i" name="star" size="large" start></w-icon>');
  const icon = page.locator('#i .w-icon');
  await expect(icon).toHaveClass(/w-icon--large/);
  await expect(icon).toHaveClass(/w-icon--start/);

  await mount('<w-icon id="i2" name="star" size="x-small" end disabled></w-icon>');
  const icon2 = page.locator('#i2 .w-icon');
  await expect(icon2).toHaveClass(/w-icon--x-small/);
  await expect(icon2).toHaveClass(/w-icon--end/);
  await expect(icon2).toHaveClass(/w-icon--disabled/);
});

test('w-icon applies color, custom size, and opacity via inline style', async ({ mount, page }) => {
  await mount('<w-icon id="i" name="check" color="success" size="2rem" opacity="0.5"></w-icon>');
  const style = await page.locator('#i .w-icon').getAttribute('style');
  expect(style).toContain('color: var(--w-success)');
  expect(style).toContain('font-size: 2rem');
  expect(style).toContain('--w-icon-opacity: 0.5');
  // Named sizes use a class, not inline font-size.
  await mount('<w-icon id="i2" name="check" size="small"></w-icon>');
  expect(await page.locator('#i2 .w-icon').getAttribute('style')).toBeNull();
});

test('w-icon treats icon names as data and rejects unsafe component tags and class tokens', async ({ mount, page }) => {
  await mount('<w-icon id="text"></w-icon><w-icon id="ligature" icon-set="ligature"></w-icon>');
  const payload = '<img src=x onerror="window.__iconInjected=true">';
  await page.locator('#text').evaluate((el, value) => el.setAttribute('name', value), payload);
  await page.locator('#ligature').evaluate((el, value) => el.setAttribute('name', value), payload);

  await expect(page.locator('#text .w-icon')).toHaveText(payload);
  await expect(page.locator('#ligature .w-icon')).toHaveText(payload);
  await expect(page.locator('#text img, #ligature img')).toHaveCount(0);
  expect(await page.evaluate(() => window.__iconInjected)).toBeUndefined();

  await page.evaluate(() => {
    window.WIcons.set('unsafe-class', { type: 'class', prefix: 'safe-prefix " onmouseover="bad' });
  });
  await mount('<w-icon id="classed" icon-set="unsafe-class" name="home"></w-icon>');
  const classed = page.locator('#classed .w-icon');
  await expect(classed).toHaveClass(/safe-prefix/);
  await expect(classed).not.toHaveAttribute('onmouseover');

  await mount(`
    <w-icon id="valid-component" icon-set="component" name="safe-icon"></w-icon>
    <w-icon id="invalid-component" icon-set="component"></w-icon>
  `);
  await page.locator('#invalid-component').evaluate((el) => {
    el.setAttribute('name', 'safe-icon></safe-icon><img src=x onerror=alert(1)');
  });
  await expect(page.locator('#valid-component safe-icon')).toHaveCount(1);
  await expect(page.locator('#invalid-component safe-icon, #invalid-component img')).toHaveCount(0);
});
