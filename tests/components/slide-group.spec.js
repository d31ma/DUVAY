import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-slide-group reflects selection, arrows, direction, and selected-class attrs', async ({ mount, page }) => {
  await mount(`
    <div style="width: 220px; height: 140px">
      <w-slide-group id="group" value="alpha" selected-class="is-picked" direction="vertical" center-active>
        <w-slide-group-item value="alpha"><button>Alpha</button></w-slide-group-item>
        <w-slide-group-item value="beta"><button>Beta</button></w-slide-group-item>
      </w-slide-group>
    </div>
  `);

  await expect(page.locator('#group')).toHaveAttribute('value', 'alpha');
  await expect(page.locator('#group .w-slide-group-shell')).toHaveClass(/w-slide-group-shell--vertical/);
  await expect(page.locator('#group w-slide-group-item[value="alpha"]')).toHaveClass(/is-picked/);
  await expect(page.locator('#group w-slide-group-item[value="alpha"]')).toHaveAttribute('selected', '');

  await page.locator('#group').evaluate((el) => {
    el.setAttribute('show-arrows', 'false');
    el.setAttribute('value', 'beta');
  });

  await expect(page.locator('#group [data-slide-scroll]')).toHaveCount(0);
  await expect(page.locator('#group w-slide-group-item[value="beta"]')).toHaveClass(/is-picked/);
});

test('w-slide-group supports single, multiple, disabled, keyboard, and scroll interactions', async ({ mount, page }) => {
  await mount(`
    <div style="width: 180px">
      <w-slide-group id="group" multiple value='["alpha"]' show-arrows>
        <w-slide-group-item value="alpha"><button>Alpha</button></w-slide-group-item>
        <w-slide-group-item value="beta"><button>Beta</button></w-slide-group-item>
        <w-slide-group-item value="gamma" disabled><button>Gamma</button></w-slide-group-item>
        <w-slide-group-item value="delta"><button>Delta</button></w-slide-group-item>
        <w-slide-group-item value="epsilon"><button>Epsilon</button></w-slide-group-item>
      </w-slide-group>
    </div>
  `);
  await recordEvents(page, '#group', ['change']);

  const scroller = page.locator('#group .w-slide-group');
  const initialScrollLeft = await scroller.evaluate((el) => el.scrollLeft);
  await page.locator('#group [data-slide-scroll="1"]').click();
  await expect.poll(async () => scroller.evaluate((el) => el.scrollLeft)).toBeGreaterThan(initialScrollLeft);

  await page.locator('#group w-slide-group-item[value="beta"] button').click();
  await expect(page.locator('#group')).toHaveAttribute('value', '["alpha","beta"]');
  await expect(page.locator('#group w-slide-group-item[value="beta"]')).toHaveAttribute('selected', '');

  await page.locator('#group w-slide-group-item[value="gamma"] button').click({ force: true });
  await expect(page.locator('#group')).toHaveAttribute('value', '["alpha","beta"]');

  await page.locator('#group .w-slide-group').press('End');
  await expect(page.locator('#group w-slide-group-item[value="epsilon"] button')).toBeFocused();

  expect((await readEvents(page, '#group')).filter((event) => event.type === 'change')).toEqual([
    { type: 'change', detail: { value: ['alpha', 'beta'] } },
  ]);
});

test('w-slide-group auto-hides arrows when it fits, keeps them with always, and uses custom icons', async ({ mount, page }) => {
  await mount(`
    <div style="width: 420px">
      <w-slide-group id="fits">
        <w-slide-group-item value="a"><button>A</button></w-slide-group-item>
        <w-slide-group-item value="b"><button>B</button></w-slide-group-item>
      </w-slide-group>
      <w-slide-group id="always" show-arrows="always">
        <w-slide-group-item value="a"><button>A</button></w-slide-group-item>
        <w-slide-group-item value="b"><button>B</button></w-slide-group-item>
      </w-slide-group>
      <w-slide-group id="icons" prev-icon="−" next-icon="+" style="width: 120px">
        <w-slide-group-item value="1"><button>One</button></w-slide-group-item>
        <w-slide-group-item value="2"><button>Two</button></w-slide-group-item>
        <w-slide-group-item value="3"><button>Three</button></w-slide-group-item>
        <w-slide-group-item value="4"><button>Four</button></w-slide-group-item>
      </w-slide-group>
    </div>
  `);

  // Fits: arrows auto-hidden.
  await expect(page.locator('#fits .w-slide-group-arrow--prev')).toBeHidden();
  // always: arrows stay visible even with no overflow.
  await expect(page.locator('#always .w-slide-group-shell')).toHaveClass(/w-slide-group-shell--arrows-always/);
  await expect(page.locator('#always .w-slide-group-arrow--prev')).toBeVisible();
  // Custom glyphs.
  await expect(page.locator('#icons .w-slide-group-arrow--prev')).toHaveText('−');
  await expect(page.locator('#icons .w-slide-group-arrow--next')).toHaveText('+');
});

test('w-slide-group disables prev/next arrows at the scroll ends', async ({ mount, page }) => {
  await mount(`
    <div style="width: 160px">
      <w-slide-group id="group" show-arrows>
        <w-slide-group-item value="1"><button>One</button></w-slide-group-item>
        <w-slide-group-item value="2"><button>Two</button></w-slide-group-item>
        <w-slide-group-item value="3"><button>Three</button></w-slide-group-item>
        <w-slide-group-item value="4"><button>Four</button></w-slide-group-item>
        <w-slide-group-item value="5"><button>Five</button></w-slide-group-item>
        <w-slide-group-item value="6"><button>Six</button></w-slide-group-item>
      </w-slide-group>
    </div>
  `);

  await expect(page.locator('#group .w-slide-group-arrow--prev')).toBeDisabled();
  await expect(page.locator('#group .w-slide-group-arrow--next')).toBeEnabled();

  await page.locator('#group .w-slide-group').evaluate((el) => { el.scrollLeft = el.scrollWidth; });
  await expect(page.locator('#group .w-slide-group-arrow--next')).toBeDisabled();
  await expect(page.locator('#group .w-slide-group-arrow--prev')).toBeEnabled();
});

test('w-slide-group max caps multiple selection', async ({ mount, page }) => {
  await mount(`
    <w-slide-group id="g" multiple max="2" value="a">
      <w-slide-group-item value="a"><button class="w-btn">A</button></w-slide-group-item>
      <w-slide-group-item value="b"><button class="w-btn">B</button></w-slide-group-item>
      <w-slide-group-item value="c"><button class="w-btn">C</button></w-slide-group-item>
    </w-slide-group>
  `);
  await page.locator('#g w-slide-group-item[value="b"]').click();
  await page.locator('#g w-slide-group-item[value="c"]').click();
  const value = await page.locator('#g').getAttribute('value');
  // Only two selections survive the max cap.
  expect(JSON.parse(value).length).toBe(2);
});

test('w-slide-group walks items with horizontal arrow keys and Home', async ({ mount, page }) => {
  await mount(`
    <div style="width: 200px">
      <w-slide-group id="group">
        <w-slide-group-item value="a"><button id="a">A</button></w-slide-group-item>
        <w-slide-group-item value="b"><button id="b">B</button></w-slide-group-item>
        <w-slide-group-item value="c"><button id="c">C</button></w-slide-group-item>
      </w-slide-group>
    </div>
  `);

  // Home jumps to the first item from the scroller itself.
  await page.locator('#group .w-slide-group').press('Home');
  await expect(page.locator('#a')).toBeFocused();

  await page.locator('#a').press('ArrowRight');
  await expect(page.locator('#b')).toBeFocused();

  await page.locator('#b').press('ArrowRight');
  await expect(page.locator('#c')).toBeFocused();

  // The last item is a hard stop, not a wrap.
  await page.locator('#c').press('ArrowRight');
  await expect(page.locator('#c')).toBeFocused();

  await page.locator('#c').press('ArrowLeft');
  await expect(page.locator('#b')).toBeFocused();

  // Vertical arrows do nothing in a horizontal group.
  await page.locator('#b').press('ArrowDown');
  await expect(page.locator('#b')).toBeFocused();
  await page.locator('#b').press('ArrowUp');
  await expect(page.locator('#b')).toBeFocused();

  // Keys the group does not own are ignored.
  await page.locator('#b').press('Escape');
  await expect(page.locator('#b')).toBeFocused();
});

test('w-slide-group walks items with vertical arrow keys when direction is vertical', async ({ mount, page }) => {
  await mount(`
    <div style="width: 200px; height: 120px">
      <w-slide-group id="group" direction="vertical">
        <w-slide-group-item value="a"><button id="a">A</button></w-slide-group-item>
        <w-slide-group-item value="b"><button id="b">B</button></w-slide-group-item>
        <w-slide-group-item value="c"><button id="c">C</button></w-slide-group-item>
      </w-slide-group>
    </div>
  `);

  await page.locator('#group .w-slide-group').press('End');
  await expect(page.locator('#c')).toBeFocused();

  await page.locator('#c').press('ArrowUp');
  await expect(page.locator('#b')).toBeFocused();

  await page.locator('#b').press('ArrowDown');
  await expect(page.locator('#c')).toBeFocused();

  await page.locator('#c').press('Home');
  await expect(page.locator('#a')).toBeFocused();

  // Horizontal arrows do nothing in a vertical group.
  await page.locator('#a').press('ArrowRight');
  await expect(page.locator('#a')).toBeFocused();
  await page.locator('#a').press('ArrowLeft');
  await expect(page.locator('#a')).toBeFocused();
});

test('w-slide-group content-class lands on the scrolling content element', async ({ mount, page }) => {
  await mount(`
    <w-slide-group id="g" content-class="pad-2 gap-4">
      <w-slide-group-item value="a"><button>A</button></w-slide-group-item>
      <w-slide-group-item value="b"><button>B</button></w-slide-group-item>
    </w-slide-group>
  `);

  await expect(page.locator('#g .w-slide-group')).toHaveClass(/pad-2/);
  await expect(page.locator('#g .w-slide-group')).toHaveClass(/gap-4/);
});

test('w-slide-group mobile drops the arrows and collapses the shell', async ({ mount, page }) => {
  await mount(`
    <w-slide-group id="desktop"><w-slide-group-item value="a"><button>A</button></w-slide-group-item></w-slide-group>
    <w-slide-group id="mobile" mobile><w-slide-group-item value="a"><button>A</button></w-slide-group-item></w-slide-group>
    <w-slide-group id="bp" mobile-breakpoint="xxl"><w-slide-group-item value="a"><button>A</button></w-slide-group-item></w-slide-group>
  `);

  await expect(page.locator('#desktop .w-slide-group-arrow')).toHaveCount(2);
  await expect(page.locator('#mobile .w-slide-group-arrow')).toHaveCount(0);
  await expect(page.locator('#mobile .w-slide-group-shell')).toHaveClass(/w-slide-group-shell--mobile/);
  // The test viewport is narrower than xxl, so the breakpoint form matches too.
  await expect(page.locator('#bp .w-slide-group-arrow')).toHaveCount(0);
});

test('w-slide-group scroll-to-active restores the selected item on resize', async ({ mount, page }) => {
  const items = Array.from({ length: 12 }, (_, i) => (
    `<w-slide-group-item value="i${i}"><button style="width:120px">Item ${i}</button></w-slide-group-item>`
  )).join('');
  await mount(`
    <div id="box" style="width:400px">
      <w-slide-group id="keep" scroll-to-active value="i9">${items}</w-slide-group>
      <w-slide-group id="free" value="i9">${items}</w-slide-group>
    </div>
  `);

  // Both start scrolled to the selection; only `scroll-to-active` restores it.
  await page.locator('#keep .w-slide-group').evaluate((el) => { el.scrollLeft = 0; });
  await page.locator('#free .w-slide-group').evaluate((el) => { el.scrollLeft = 0; });
  await page.locator('#box').evaluate((el) => { el.style.width = '200px'; });

  await expect.poll(async () => (
    page.locator('#keep .w-slide-group').evaluate((el) => el.scrollLeft)
  )).toBeGreaterThan(0);
  expect(await page.locator('#free .w-slide-group').evaluate((el) => el.scrollLeft)).toBe(0);
});

test('w-slide-group-item selected-class is applied on top of the group class', async ({ mount, page }) => {
  await mount(`
    <w-slide-group id="g" value="b" selected-class="is-on">
      <w-slide-group-item value="a"><button>A</button></w-slide-group-item>
      <w-slide-group-item value="b" selected-class="is-special"><button>B</button></w-slide-group-item>
    </w-slide-group>
  `);

  const b = page.locator('#g w-slide-group-item[value="b"]');
  await expect(b).toHaveClass(/is-on/);
  await expect(b).toHaveClass(/is-special/);

  await page.locator('#g w-slide-group-item[value="a"] button').click();
  await expect(b).not.toHaveClass(/is-special/);
  await expect(page.locator('#g w-slide-group-item[value="a"]')).toHaveClass(/is-on/);
});

test('w-slide-group keeps its generated shell out of its own slot across concurrent updates', async ({ mount, page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));

  const group = (id, count) => `
    <w-slide-group id="${id}" value="item-0" show-arrows center-active mandatory>
      ${Array.from({ length: count }, (_, index) => `
        <w-slide-group-item value="item-${index}">
          <w-btn variant="outlined">Item ${index}</w-btn>
        </w-slide-group-item>
      `).join('')}
    </w-slide-group>
  `;

  await mount(Array.from({ length: 5 }, (_, index) => group(`group-${index}`, 12)).join(''));
  await page.locator('w-slide-group').evaluateAll((groups) => {
    groups.forEach((group, index) => {
      group.setAttribute('value', `item-${index + 1}`);
      group.style.width = `${180 + index * 20}px`;
    });
  });
  await page.waitForTimeout(100);

  await expect(page.locator('w-slide-group > .w-slide-group-shell')).toHaveCount(5);
  await expect(page.locator('w-slide-group > .w-slide-group-shell > .w-slide-group > slot > w-slide-group-item')).toHaveCount(60);
  expect(errors).toEqual([]);
});
