import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

const CHIPS = `
  <w-chip value="design">Design</w-chip>
  <w-chip value="code">Code</w-chip>
  <w-chip value="docs">Docs</w-chip>
`;

test('w-chip-group single-selects and emits change', async ({ mount, page }) => {
  await mount(`<w-chip-group id="g" value="design">${CHIPS}</w-chip-group>`);
  await recordEvents(page, '#g', ['change']);

  await expect(page.locator('#g w-chip[value="design"] .w-chip')).toHaveClass(/selected/);
  await page.locator('#g w-chip[value="code"] .w-chip').click();
  await expect(page.locator('#g')).toHaveAttribute('value', 'code');
  await expect(page.locator('#g w-chip[value="design"] .w-chip')).not.toHaveClass(/w-chip--selected/);
  expect(await readEvents(page, '#g')).toEqual([
    { type: 'change', detail: { value: 'code' } },
  ]);
});

test('w-chip-group multiple selection respects max', async ({ mount, page }) => {
  await mount(`<w-chip-group id="g" multiple max="2" value="design">${CHIPS}</w-chip-group>`);

  await page.locator('#g w-chip[value="code"] .w-chip').click();
  await expect(page.locator('#g')).toHaveAttribute('value', 'design,code');

  // Third selection blocked by max=2.
  await page.locator('#g w-chip[value="docs"] .w-chip').click();
  await expect(page.locator('#g')).toHaveAttribute('value', 'design,code');
});

test('w-chip-group mandatory keeps one selected and disabled blocks changes', async ({ mount, page }) => {
  await mount(`<w-chip-group id="g" mandatory value="design">${CHIPS}</w-chip-group>`);
  await page.locator('#g w-chip[value="design"] .w-chip').click();
  await expect(page.locator('#g')).toHaveAttribute('value', 'design'); // can't clear the last one

  await mount(`<w-chip-group id="d" disabled value="design">${CHIPS}</w-chip-group>`);
  await page.locator('#d w-chip[value="code"] .w-chip').click({ force: true });
  await expect(page.locator('#d')).toHaveAttribute('value', 'design');
});

test('w-chip-group applies column, filter, and propagates variant/color', async ({ mount, page }) => {
  await mount(`<w-chip-group id="g" column filter variant="outlined" color="primary" value="design">${CHIPS}</w-chip-group>`);
  await expect(page.locator('#g .w-chip-group')).toHaveClass(/w-chip-group--column/);
  await expect(page.locator('#g .w-chip-group')).toHaveClass(/w-chip-group--filter/);
  await expect(page.locator('#g w-chip[value="design"]')).toHaveAttribute('variant', 'outlined');
  await expect(page.locator('#g w-chip[value="design"]')).toHaveAttribute('color', 'primary');
});

test('w-chip-group show-arrows pages the scrolling row', async ({ mount, page }) => {
  await mount(`
    <w-chip-group id="g" show-arrows width="180px">
      <w-chip value="a">Alpha</w-chip>
      <w-chip value="b">Bravo</w-chip>
      <w-chip value="c">Charlie</w-chip>
      <w-chip value="d">Delta</w-chip>
      <w-chip value="e">Echo</w-chip>
      <w-chip value="f">Foxtrot</w-chip>
    </w-chip-group>
  `);

  await expect(page.locator('#g .w-chip-group-shell')).toHaveCount(1);
  await expect(page.locator('#g .w-chip-group')).toHaveClass(/w-chip-group--scrollable/);
  await expect(page.locator('#g .w-chip-group-arrow--prev')).toHaveAttribute('aria-label', 'Previous chips');

  await page.locator('#g .w-chip-group-arrow--next').click();
  await expect.poll(() => page.locator('#g .w-chip-group').evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
});

test('w-chip-group direction, icons, and content-class reach the markup', async ({ mount, page }) => {
  await mount(`
    <w-chip-group id="g" direction="vertical" show-arrows prev-icon="^" next-icon="v" content-class="dense wide">
      <w-chip value="a">Alpha</w-chip>
    </w-chip-group>
  `);

  await expect(page.locator('#g .w-chip-group-shell')).toHaveClass(/w-chip-group-shell--vertical/);
  await expect(page.locator('#g .w-chip-group')).toHaveClass(/w-chip-group--vertical/);
  await expect(page.locator('#g .w-chip-group')).toHaveClass(/dense/);
  await expect(page.locator('#g .w-chip-group')).toHaveClass(/wide/);
  await expect(page.locator('#g .w-chip-group-arrow--prev')).toHaveText('^');
  await expect(page.locator('#g .w-chip-group-arrow--next')).toHaveText('v');
});

test('w-chip-group mobile and mobile-breakpoint drop the arrows for touch scrolling', async ({ mount, page }) => {
  // The suite runs at 1280px wide, so xl (1920) matches and sm (600) does not.
  await mount(`
    <w-chip-group id="forced" mobile show-arrows><w-chip value="a">Alpha</w-chip></w-chip-group>
    <w-chip-group id="narrow" mobile-breakpoint="xl" show-arrows><w-chip value="a">Alpha</w-chip></w-chip-group>
    <w-chip-group id="wide" mobile-breakpoint="sm" show-arrows><w-chip value="a">Alpha</w-chip></w-chip-group>
  `);

  await expect(page.locator('#forced .w-chip-group')).toHaveClass(/w-chip-group--mobile/);
  await expect(page.locator('#forced .w-chip-group-arrow')).toHaveCount(0);
  await expect(page.locator('#narrow .w-chip-group')).toHaveClass(/w-chip-group--mobile/);
  await expect(page.locator('#narrow .w-chip-group-arrow')).toHaveCount(0);
  await expect(page.locator('#wide .w-chip-group')).not.toHaveClass(/w-chip-group--mobile/);
  await expect(page.locator('#wide .w-chip-group-arrow')).toHaveCount(2);
});

test('w-chip-group center-active and scroll-to-active bring the selection into view', async ({ mount, page }) => {
  const CHIPS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    .map((value) => `<w-chip value="${value}">Chip ${value.toUpperCase()}</w-chip>`).join('');

  await mount(`<w-chip-group id="g" show-arrows center-active width="180px">${CHIPS}</w-chip-group>`);
  await expect(page.locator('#g .w-chip-group').first()).toBeVisible();
  await page.locator('#g').evaluate((el) => el.setAttribute('value', 'h'));
  await expect.poll(() => page.locator('#g .w-chip-group').evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);

  await mount(`<w-chip-group id="s" show-arrows scroll-to-active width="180px">${CHIPS}</w-chip-group>`);
  await page.locator('#s').evaluate((el) => el.setAttribute('value', 'h'));
  await expect.poll(() => page.locator('#s .w-chip-group').evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
});
