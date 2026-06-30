import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

const SLIDES = `
  <w-carousel-item>One</w-carousel-item>
  <w-carousel-item>Two</w-carousel-item>
  <w-carousel-item>Three</w-carousel-item>
`;

test('w-carousel navigates by arrows and delimiters and emits change', async ({ mount, page }) => {
  await mount(`<w-carousel id="car">${SLIDES}</w-carousel>`);
  await recordEvents(page, '#car', ['change']);

  await expect(page.locator('#car w-carousel-item').nth(0)).toHaveClass(/active/);

  await page.locator('#car [data-carousel-step="1"]').click();
  await expect(page.locator('#car')).toHaveAttribute('value', '1');
  await expect(page.locator('#car w-carousel-item').nth(1)).toHaveClass(/active/);

  await page.locator('#car [data-carousel-index="2"]').click();
  await expect(page.locator('#car')).toHaveAttribute('value', '2');
  await expect(page.locator('#car [data-carousel-index="2"]')).toHaveAttribute('aria-selected', 'true');

  expect((await readEvents(page, '#car')).filter((e) => e.type === 'change')).toEqual([
    { type: 'change', detail: { value: 1 } },
    { type: 'change', detail: { value: 2 } },
  ]);
});

test('w-carousel disables the end arrows when not continuous', async ({ mount, page }) => {
  await mount(`<w-carousel id="car" continuous="false">${SLIDES}</w-carousel>`);

  await expect(page.locator('#car .w-carousel-control.prev')).toBeDisabled();
  await expect(page.locator('#car .w-carousel-control.next')).toBeEnabled();

  await page.locator('#car [data-carousel-step="1"]').click();
  await page.locator('#car [data-carousel-step="1"]').click();
  await expect(page.locator('#car')).toHaveAttribute('value', '2');
  await expect(page.locator('#car .w-carousel-control.next')).toBeDisabled();
  await expect(page.locator('#car .w-carousel-control.prev')).toBeEnabled();
});

test('w-carousel applies fade, hover-arrows, vertical-delimiters, color, and custom delimiter icons', async ({ mount, page }) => {
  await mount(`
    <w-carousel id="car" transition="fade" show-arrows="hover" vertical-delimiters="left" color="success" delimiter-icon="■">${SLIDES}</w-carousel>
  `);

  await expect(page.locator('#car .w-carousel')).toHaveClass(/w-carousel--fade/);
  await expect(page.locator('#car .w-carousel')).toHaveClass(/w-carousel--arrows-hover/);
  await expect(page.locator('#car .w-carousel')).toHaveClass(/w-carousel--vdelim-left/);
  const carColor = await page.locator('#car .w-carousel').evaluate((el) => el.style.getPropertyValue('--w-carousel-color'));
  expect(carColor).toBe('var(--w-success)');
  await expect(page.locator('#car .w-carousel-delimiter--icon').first()).toHaveText('■');

  // Fade mode drives visibility via opacity, so the track keeps no inline transform.
  const transform = await page.locator('#car .w-carousel-track').evaluate((el) => el.style.transform);
  expect(transform).toBe('');
});

test('w-carousel hides delimiters with hide-delimiters', async ({ mount, page }) => {
  await mount(`<w-carousel id="car" hide-delimiters>${SLIDES}</w-carousel>`);
  await expect(page.locator('#car .w-carousel-delimiter')).toHaveCount(0);
});

test('w-carousel navigates with the keyboard', async ({ mount, page }) => {
  await mount(`<w-carousel id="car">${SLIDES}</w-carousel>`);
  await page.locator('#car .w-carousel').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#car w-carousel-item').nth(1)).toHaveClass(/active/);
  await page.keyboard.press('End');
  await expect(page.locator('#car w-carousel-item').nth(2)).toHaveClass(/active/);
  await page.keyboard.press('Home');
  await expect(page.locator('#car w-carousel-item').nth(0)).toHaveClass(/active/);
});
