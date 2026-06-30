import { expect, test } from '../setup/component-test.js';

test('w-defaults-provider fills missing attributes without overriding explicit ones', async ({ mount, page }) => {
  await mount(`
    <w-defaults-provider defaults='{"w-btn":{"variant":"outlined","size":"sm"}}'>
      <w-btn id="bare">Bare</w-btn>
      <w-btn id="explicit" variant="text">Explicit</w-btn>
    </w-defaults-provider>
  `);
  // Bare button receives both defaults.
  await expect(page.locator('#bare')).toHaveAttribute('variant', 'outlined');
  await expect(page.locator('#bare')).toHaveAttribute('size', 'sm');
  // Explicit variant is preserved; missing size still filled.
  await expect(page.locator('#explicit')).toHaveAttribute('variant', 'text');
  await expect(page.locator('#explicit')).toHaveAttribute('size', 'sm');
});

test('w-defaults-provider disabled applies nothing', async ({ mount, page }) => {
  await mount(`
    <w-defaults-provider disabled defaults='{"w-btn":{"variant":"outlined"}}'>
      <w-btn id="b">Btn</w-btn>
    </w-defaults-provider>
  `);
  await expect(page.locator('#b')).not.toHaveAttribute('variant', 'outlined');
});

test('w-defaults-provider nests — nearest provider wins per key, others merge', async ({ mount, page }) => {
  await mount(`
    <w-defaults-provider defaults='{"w-btn":{"variant":"filled","color":"primary"}}'>
      <w-btn id="outer">Outer</w-btn>
      <w-defaults-provider defaults='{"w-btn":{"color":"success"}}'>
        <w-btn id="inner">Inner</w-btn>
      </w-defaults-provider>
    </w-defaults-provider>
  `);
  await expect(page.locator('#outer')).toHaveAttribute('color', 'primary');
  await expect(page.locator('#outer')).toHaveAttribute('variant', 'filled');
  // Inner overrides color, but still inherits variant from the outer provider.
  await expect(page.locator('#inner')).toHaveAttribute('color', 'success');
  await expect(page.locator('#inner')).toHaveAttribute('variant', 'filled');
});
