import { expect, test } from '../setup/component-test.js';

test('w-progress-linear renders a determinate bar width and color custom property', async ({ mount, page }) => {
  await mount('<w-progress-linear id="p" value="60" color="success" buffer-value="80"></w-progress-linear>');

  const root = page.locator('#p .w-progress');
  await expect(root).toHaveAttribute('aria-valuenow', '60');
  await expect(page.locator('#p .w-progress-bar')).toHaveAttribute('style', /inline-size:\s*60%/);
  await expect(page.locator('#p .w-progress-buffer')).toHaveAttribute('style', /inline-size:\s*80%/);
  expect(await root.getAttribute('style')).toContain('--w-progress-color: var(--w-success)');
});

test('w-progress-linear indeterminate drops aria-valuenow and adds the modifier', async ({ mount, page }) => {
  await mount('<w-progress-linear id="p" indeterminate></w-progress-linear>');
  const root = page.locator('#p .w-progress');
  await expect(root).toHaveClass(/w-progress--indeterminate/);
  await expect(root).not.toHaveAttribute('aria-valuenow', /.*/);
});

test('w-progress-linear honours model-value, striped, and reverse', async ({ mount, page }) => {
  await mount('<w-progress-linear id="p" model-value="25" striped reverse rounded></w-progress-linear>');
  await expect(page.locator('#p .w-progress-bar')).toHaveAttribute('style', /inline-size:\s*25%/);
  await expect(page.locator('#p .w-progress')).toHaveClass(/w-progress--striped/);
  await expect(page.locator('#p .w-progress')).toHaveClass(/w-progress--reverse/);
});

test('w-progress-circular applies size, stroke width, rotate, and centered slot content', async ({ mount, page }) => {
  await mount('<w-progress-circular id="p" value="75" size="64" width="6" rotate="90">75%</w-progress-circular>');

  const root = page.locator('#p .w-progress-circular');
  const style = await root.getAttribute('style');
  expect(style).toContain('width: 64px');
  expect(style).toContain('--w-progress-width: 6');
  expect(style).toContain('--w-progress-rotate: 90deg');
  await expect(page.locator('#p .w-progress-content')).toHaveText('75%');
  await expect(page.locator('#p svg .w-progress-fill')).toHaveCount(1);
});
