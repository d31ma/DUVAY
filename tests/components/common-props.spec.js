import { expect, test } from '../setup/component-test.js';

// Attributes WElement applies for every component, so a component author never
// re-implements sizing, elevation, or theming. Vuetify exposes the same names
// on nearly every component; these are the cross-cutting ones.

test('sizing attributes map to custom properties and applied classes', async ({ page, mount }) => {
  await mount('<w-card id="c" width="300px" height="120px" min-width="200px" max-width="400px" min-height="80px" max-height="240px">Body</w-card>');

  const applied = await page.evaluate(() => {
    const el = document.querySelector('#c');
    const styles = getComputedStyle(el);
    return {
      classes: [...el.classList].filter((name) => name.startsWith('w-has-')).sort(),
      minHeight: styles.minHeight,
      maxHeight: styles.maxHeight,
      minWidth: styles.minWidth,
      maxWidth: styles.maxWidth,
    };
  });

  expect(applied.classes).toEqual([
    'w-has-height', 'w-has-max-height', 'w-has-max-width',
    'w-has-min-height', 'w-has-min-width', 'w-has-width',
  ]);
  expect(applied.minHeight).toBe('80px');
  expect(applied.maxHeight).toBe('240px');
  expect(applied.minWidth).toBe('200px');
  expect(applied.maxWidth).toBe('400px');
});

test('removing a sizing attribute clears the class and the custom property', async ({ page, mount }) => {
  await mount('<w-card id="c" min-height="80px" max-height="240px">Body</w-card>');

  const cleared = await page.evaluate(() => {
    const el = document.querySelector('#c');
    el.removeAttribute('min-height');
    el.removeAttribute('max-height');
    return {
      classes: [...el.classList].filter((name) => name.startsWith('w-has-')),
      minHeight: el.style.getPropertyValue('--w-prop-min-height'),
      maxHeight: el.style.getPropertyValue('--w-prop-max-height'),
    };
  });

  expect(cleared).toEqual({ classes: [], minHeight: '', maxHeight: '' });
});

test('hover-elevation applies a hover-only shadow class', async ({ page, mount }) => {
  await mount('<w-card id="flat" hover-elevation="4">Body</w-card>');

  const el = page.locator('#flat');
  await expect(el).toHaveClass(/w-hover-elevation-4/);
  const resting = await el.evaluate((node) => getComputedStyle(node).boxShadow);
  await el.hover();
  const hovered = await el.evaluate((node) => getComputedStyle(node).boxShadow);

  expect(resting).toBe('none');
  expect(hovered).not.toBe('none');
});

test('theme scopes a palette to one subtree without touching the document', async ({ page, mount }) => {
  await mount('<w-card id="light" theme="light">Light</w-card><w-card id="dark">Dark</w-card>');

  await expect(page.locator('#light')).toHaveAttribute('w-theme', 'light');
  expect(await page.locator('#dark').getAttribute('w-theme')).toBeNull();
  expect(await page.evaluate(() => document.documentElement.getAttribute('w-theme'))).toBe('dark');

  const surfaces = await page.evaluate(() => ({
    scoped: getComputedStyle(document.querySelector('#light')).getPropertyValue('--w-surface').trim(),
    inherited: getComputedStyle(document.querySelector('#dark')).getPropertyValue('--w-surface').trim(),
  }));
  expect(surfaces.scoped).not.toBe('');
  expect(surfaces.scoped).not.toBe(surfaces.inherited);
});

test('theme can be changed and removed after mount', async ({ page, mount }) => {
  await mount('<w-card id="c" theme="light">Body</w-card>');

  await page.evaluate(() => document.querySelector('#c').setAttribute('theme', 'high-contrast'));
  await expect(page.locator('#c')).toHaveAttribute('w-theme', 'high-contrast');

  await page.evaluate(() => document.querySelector('#c').removeAttribute('theme'));
  expect(await page.locator('#c').getAttribute('w-theme')).toBeNull();
});

test('an explicit w-theme is not overwritten by the theme attribute', async ({ page, mount }) => {
  await mount('<w-card id="c" w-theme="high-contrast" theme="light">Body</w-card>');
  await expect(page.locator('#c')).toHaveAttribute('w-theme', 'high-contrast');
});
