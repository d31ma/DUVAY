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
