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

test('w-carousel crossfade behaves like the fade transition', async ({ mount, page }) => {
  await mount(`<w-carousel id="car" crossfade>${SLIDES}</w-carousel>`);

  await expect(page.locator('#car .w-carousel')).toHaveClass(/w-carousel--crossfade/);
  await expect(page.locator('#car .w-carousel')).toHaveClass(/w-carousel--fade/);
  expect(await page.locator('#car .w-carousel-track').evaluate((el) => el.style.transform)).toBe('');
});

test('w-carousel direction=vertical slides on the Y axis, reverse flips the sign', async ({ mount, page }) => {
  await mount(`
    <w-carousel id="vert" direction="vertical" height="200px">${SLIDES}</w-carousel>
    <w-carousel id="rev" reverse>${SLIDES}</w-carousel>
  `);

  await expect(page.locator('#vert .w-carousel')).toHaveClass(/w-carousel--vertical/);
  await page.locator('#vert [data-carousel-step="1"]').click();
  expect(await page.locator('#vert .w-carousel-track').evaluate((el) => el.style.transform))
    .toBe('translateY(-100%)');

  await expect(page.locator('#rev .w-carousel')).toHaveClass(/w-carousel--reverse/);
  await page.locator('#rev [data-carousel-step="1"]').click();
  expect(await page.locator('#rev .w-carousel-track').evaluate((el) => el.style.transform))
    .toBe('translateX(100%)');
});

test('w-carousel vertical direction responds to up/down arrow keys', async ({ mount, page }) => {
  await mount(`<w-carousel id="car" direction="vertical" height="200px">${SLIDES}</w-carousel>`);

  await page.locator('#car .w-carousel').focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#car w-carousel-item').nth(1)).toHaveClass(/active/);
  await page.keyboard.press('ArrowUp');
  await expect(page.locator('#car w-carousel-item').nth(0)).toHaveClass(/active/);
});

test('w-carousel vertical-arrows stacks the controls on one edge', async ({ mount, page }) => {
  await mount(`
    <w-carousel id="right" vertical-arrows height="220px">${SLIDES}</w-carousel>
    <w-carousel id="left" vertical-arrows="left" height="220px">${SLIDES}</w-carousel>
  `);

  await expect(page.locator('#right .w-carousel')).toHaveClass(/w-carousel--varrows-right/);
  await expect(page.locator('#left .w-carousel')).toHaveClass(/w-carousel--varrows-left/);

  const boxes = await page.locator('#right .w-carousel-control').evaluateAll(
    (nodes) => nodes.map((node) => node.getBoundingClientRect()).map((r) => [Math.round(r.x), Math.round(r.y)]),
  );
  expect(boxes[0][0]).toBe(boxes[1][0]);
  expect(boxes[1][1]).toBeGreaterThan(boxes[0][1]);
});

test('w-carousel mandatory=false lets the active delimiter deselect the slide', async ({ mount, page }) => {
  await mount(`<w-carousel id="car" mandatory="false">${SLIDES}</w-carousel>`);
  await recordEvents(page, '#car', ['change']);

  await expect(page.locator('#car w-carousel-item').nth(0)).toHaveClass(/active/);

  await page.locator('#car [data-carousel-index="0"]').click();
  await expect(page.locator('#car')).toHaveAttribute('value', '-1');
  await expect(page.locator('#car w-carousel-item').nth(0)).not.toHaveClass(/active/);

  // Any other target re-selects normally.
  await page.locator('#car [data-carousel-index="1"]').click();
  await expect(page.locator('#car w-carousel-item').nth(1)).toHaveClass(/active/);

  expect((await readEvents(page, '#car')).map((e) => e.detail.value)).toEqual([-1, 1]);
});

test('w-carousel selects slides by their value attribute', async ({ mount, page }) => {
  await mount(`
    <w-carousel id="car" value="beta">
      <w-carousel-item value="alpha">One</w-carousel-item>
      <w-carousel-item value="beta">Two</w-carousel-item>
      <w-carousel-item value="gamma">Three</w-carousel-item>
    </w-carousel>
  `);

  await expect(page.locator('#car w-carousel-item[value="beta"]')).toHaveClass(/active/);

  await page.locator('#car [data-carousel-step="1"]').click();
  await expect(page.locator('#car')).toHaveAttribute('value', 'gamma');
  await expect(page.locator('#car w-carousel-item[value="gamma"]')).toHaveClass(/active/);
});

test('w-carousel selected-class applies, and a slide can override it', async ({ mount, page }) => {
  await mount(`
    <w-carousel id="car" selected-class="is-current">
      <w-carousel-item>One</w-carousel-item>
      <w-carousel-item selected-class="is-special">Two</w-carousel-item>
    </w-carousel>
  `);

  await expect(page.locator('#car w-carousel-item').nth(0)).toHaveClass(/is-current/);

  await page.locator('#car [data-carousel-step="1"]').click();
  await expect(page.locator('#car w-carousel-item').nth(1)).toHaveClass(/is-special/);
  await expect(page.locator('#car w-carousel-item').nth(1)).not.toHaveClass(/is-current/);
});

test('w-carousel-item transition and reverse-transition drive the incoming slide', async ({ mount, page }) => {
  await mount(`
    <w-carousel id="car">
      <w-carousel-item>One</w-carousel-item>
      <w-carousel-item transition="fade" reverse-transition="scale">Two</w-carousel-item>
      <w-carousel-item transition="none">Three</w-carousel-item>
    </w-carousel>
  `);

  await page.locator('#car [data-carousel-step="1"]').click();
  await expect(page.locator('#car w-carousel-item').nth(1).locator('.w-carousel-item'))
    .toHaveClass(/w-transition--fade/);

  await page.locator('#car [data-carousel-step="1"]').click();
  await expect(page.locator('#car w-carousel-item').nth(2).locator('.w-carousel-item'))
    .toHaveClass(/w-transition--none/);

  // Moving backwards prefers reverse-transition.
  await page.locator('#car [data-carousel-step="-1"]').click();
  await expect(page.locator('#car w-carousel-item').nth(1).locator('.w-carousel-item'))
    .toHaveClass(/w-transition--scale/);
});

test('w-carousel-item renders the image attribute set', async ({ mount, page }) => {
  await mount(`
    <w-carousel-item id="item"
      src="/a.png" alt="A picture" srcset="/a.png 1x, /a2.png 2x" sizes="100vw"
      draggable="false" crossorigin="anonymous" referrerpolicy="no-referrer"
      image-class="rounded shadow" content-class="pad-2" aspect-ratio="16 / 9">
    </w-carousel-item>
  `);

  const img = page.locator('#item .w-carousel-img');
  await expect(img).toHaveAttribute('alt', 'A picture');
  await expect(img).toHaveAttribute('srcset', '/a.png 1x, /a2.png 2x');
  await expect(img).toHaveAttribute('sizes', '100vw');
  await expect(img).toHaveAttribute('draggable', 'false');
  await expect(img).toHaveAttribute('crossorigin', 'anonymous');
  await expect(img).toHaveAttribute('referrerpolicy', 'no-referrer');
  await expect(img).toHaveClass(/rounded/);
  await expect(img).toHaveClass(/shadow/);
  await expect(img).toHaveClass(/w-carousel-img--cover/);

  const box = page.locator('#item .w-carousel-item');
  await expect(box).toHaveClass(/pad-2/);
  await expect(box).toHaveCSS('aspect-ratio', '16 / 9');
});

test('w-carousel-item renders the lazy-src placeholder and the gradient overlay', async ({ mount, page }) => {
  await mount(`
    <w-carousel-item id="item" src="/a.png" lazy-src="/tiny.png"
      gradient="to top, rgba(0, 0, 0, 0.6), transparent"></w-carousel-item>
  `);

  await expect(page.locator('#item .w-carousel-item__placeholder')).toHaveCSS('filter', 'blur(4px)');
  const overlay = page.locator('#item .w-carousel-item__gradient');
  await expect(overlay).toHaveCount(1);
  await expect(overlay).toHaveCSS('background-image', /linear-gradient/);
});

test('w-carousel-item absolute and inline change how the slide is laid out', async ({ mount, page }) => {
  await mount(`
    <w-carousel-item id="abs" absolute>A</w-carousel-item>
    <w-carousel-item id="inl" inline>B</w-carousel-item>
    <w-carousel-item id="plain">C</w-carousel-item>
  `);

  await expect(page.locator('#abs .w-carousel-item')).toHaveCSS('position', 'absolute');
  await expect(page.locator('#inl .w-carousel-item')).toHaveCSS('display', 'inline-flex');
  await expect(page.locator('#plain .w-carousel-item')).toHaveCSS('position', 'relative');
});

test('w-carousel-item cover can be turned off', async ({ mount, page }) => {
  await mount('<w-carousel-item id="item" src="/a.png" cover="false"></w-carousel-item>');
  await expect(page.locator('#item .w-carousel-img')).not.toHaveClass(/w-carousel-img--cover/);
});
