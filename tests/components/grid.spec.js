import { expect, test } from '../setup/component-test.js';

test('w-col emits span, offset, order, and align-self classes per breakpoint', async ({ mount, page }) => {
  await mount(`<w-col id="c" cols="6" md="4" xl="3" offset="2" offset-md="1" order="2" order-lg="first" align-self="center"></w-col>`);

  const col = page.locator('#c');
  await expect(col).toHaveClass(/\bw-grid-col\b/);
  await expect(col).toHaveClass(/\bw-grid-col-6\b/);
  await expect(col).toHaveClass(/\bw-grid-col-md-4\b/);
  await expect(col).toHaveClass(/\bw-grid-col-xl-3\b/);
  await expect(col).toHaveClass(/\bw-grid-offset-2\b/);
  await expect(col).toHaveClass(/\bw-grid-offset-md-1\b/);
  await expect(col).toHaveClass(/\bw-grid-order-2\b/);
  await expect(col).toHaveClass(/\bw-grid-order-lg-first\b/);
  await expect(col).toHaveClass(/\bw-grid-col--align-self-center\b/);
});

test('w-col supports auto width and reacts to attribute changes', async ({ mount, page }) => {
  await mount(`<w-col id="c" cols="auto"></w-col>`);
  await expect(page.locator('#c')).toHaveClass(/\bw-grid-col-auto\b/);

  await page.locator('#c').evaluate((el) => { el.setAttribute('cols', '8'); });
  await expect(page.locator('#c')).toHaveClass(/\bw-grid-col-8\b/);
  await expect(page.locator('#c')).not.toHaveClass(/w-grid-col-auto/);
});

test('w-row emits align, justify, align-content and responsive variants', async ({ mount, page }) => {
  await mount(`<w-row id="r" align="center" justify="space-between" align-content="center" justify-md="end" align-lg="stretch"></w-row>`);

  const row = page.locator('#r');
  await expect(row).toHaveClass(/\bw-grid-row--align-center\b/);
  await expect(row).toHaveClass(/\bw-grid-row--justify-space-between\b/);
  await expect(row).toHaveClass(/\bw-grid-row--align-content-center\b/);
  await expect(row).toHaveClass(/\bw-grid-row--justify-md-end\b/);
  await expect(row).toHaveClass(/\bw-grid-row--align-lg-stretch\b/);
});

test('w-row normalizes legacy justify aliases and handles gutters', async ({ mount, page }) => {
  await mount(`<w-row id="r" justify="between"></w-row>`);
  await expect(page.locator('#r')).toHaveClass(/\bw-grid-row--justify-space-between\b/);

  await mount(`<w-row id="g" gutter="xl"></w-row>`);
  await expect(page.locator('#g')).toHaveClass(/\bw-grid-row--custom\b/);
  await expect(page.locator('#g')).toHaveAttribute('style', /--w-grid-gutter/);

  await mount(`<w-row id="f" no-gutters></w-row>`);
  await expect(page.locator('#f')).toHaveClass(/\bw-grid-row--flush\b/);
});

test('w-container emits fluid, fill-height, and size classes', async ({ mount, page }) => {
  await mount(`<w-container id="ct" fluid fill-height size="md"></w-container>`);
  const ct = page.locator('#ct');
  await expect(ct).toHaveClass(/\bw-container\b/);
  await expect(ct).toHaveClass(/\bw-container--fluid\b/);
  await expect(ct).toHaveClass(/\bw-container--fill-height\b/);
  await expect(ct).toHaveClass(/\bw-container--md\b/);
});

test('w-spacer renders a flex spacer', async ({ mount, page }) => {
  await mount(`<w-spacer id="s"></w-spacer>`);
  await expect(page.locator('#s .w-spacer')).toBeAttached();
});
