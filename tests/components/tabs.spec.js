import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-tabs reflects value and variant and supports click and keyboard activation', async ({ mount, page }) => {
  await mount(`
    <w-tabs id="tabs" value="inbox" variant="pills">
      <w-tab value="inbox">Inbox</w-tab>
      <w-tab value="drafts">Drafts</w-tab>
      <w-tab value="sent" disabled>Sent</w-tab>
    </w-tabs>
  `);
  await recordEvents(page, '#tabs', ['change']);

  await expect(page.locator('#tabs .w-tabs')).toHaveClass(/w-tabs-pills/);
  await expect(page.locator('#tabs w-tab[value="inbox"] button')).toHaveAttribute('aria-selected', 'true');

  await page.locator('#tabs w-tab[value="drafts"] button').click();
  await expect(page.locator('#tabs')).toHaveAttribute('value', 'drafts');
  await expect(page.locator('#tabs w-tab[value="drafts"] button')).toHaveAttribute('aria-selected', 'true');

  await page.locator('#tabs w-tab[value="drafts"] button').press('Home');
  await expect(page.locator('#tabs')).toHaveAttribute('value', 'inbox');

  await page.locator('#tabs').evaluate((el) => el.setAttribute('value', 'drafts'));
  await expect(page.locator('#tabs w-tab[value="drafts"]')).toHaveAttribute('active', '');
  expect((await readEvents(page, '#tabs')).filter((event) => event.type === 'change')).toEqual([
    { type: 'change', detail: { value: 'drafts' } },
    { type: 'change', detail: { value: 'inbox' } },
  ]);
});

test('w-tabs renders the animated slider with alignment, vertical, and color modifiers', async ({ mount, page }) => {
  await mount(`
    <w-tabs id="tabs" value="a" align-tabs="center" direction="vertical" color="primary">
      <w-tab value="a">A</w-tab>
      <w-tab value="b">B</w-tab>
    </w-tabs>
  `);

  await expect(page.locator('#tabs .w-tabs')).toHaveClass(/w-tabs--align-center/);
  await expect(page.locator('#tabs .w-tabs')).toHaveClass(/w-tabs--vertical/);
  await expect(page.locator('#tabs .w-tabs')).toHaveClass(/w-tabs--js-slider/);
  await expect(page.locator('#tabs .w-tabs-slider')).toHaveCount(1);
  const tabsColor = await page.locator('#tabs').evaluate((el) => el.style.getPropertyValue('--w-tabs-color'));
  expect(tabsColor).toBe('var(--w-primary)');
});

test('w-tabs hides the slider and shows overflow arrows on demand', async ({ mount, page }) => {
  await mount(`
    <w-tabs id="t1" value="a" hide-slider><w-tab value="a">A</w-tab><w-tab value="b">B</w-tab></w-tabs>
    <w-tabs id="t2" value="a" show-arrows><w-tab value="a">A</w-tab><w-tab value="b">B</w-tab></w-tabs>
  `);

  await expect(page.locator('#t1 .w-tabs-slider')).toHaveCount(0);
  await expect(page.locator('#t1 .w-tabs')).toHaveClass(/w-tabs--no-slider/);

  await expect(page.locator('#t2 .w-tabs-shell')).toHaveCount(1);
  await expect(page.locator('#t2 .w-tabs-arrow')).toHaveCount(2);
});

test('w-tab renders a link tab and a stacked tab', async ({ mount, page }) => {
  await mount(`
    <w-tabs id="tabs" value="docs">
      <w-tab value="docs" href="#docs">Docs</w-tab>
      <w-tab value="api" stacked><span>icon</span>API</w-tab>
    </w-tabs>
  `);

  await expect(page.locator('#tabs w-tab[value="docs"] a.w-tab')).toHaveAttribute('href', '#docs');
  await expect(page.locator('#tabs w-tab[value="api"] .w-tab')).toHaveClass(/w-tab--stacked/);
});

test('w-tabs items generates the tab children from data', async ({ mount, page }) => {
  await mount(`
    <w-tabs id="tabs" value="drafts"
      items='[{"text":"Inbox","value":"inbox"},{"text":"Drafts","value":"drafts"},{"text":"Sent","value":"sent","disabled":true}]'>
    </w-tabs>
  `);

  await expect(page.locator('#tabs w-tab')).toHaveCount(3);
  await expect(page.locator('#tabs w-tab[value="inbox"] button')).toHaveText('Inbox');
  await expect(page.locator('#tabs w-tab[value="sent"] button')).toBeDisabled();
  await expect(page.locator('#tabs w-tab[value="drafts"] button')).toHaveAttribute('aria-selected', 'true');

  await page.locator('#tabs w-tab[value="inbox"] button').click();
  await expect(page.locator('#tabs')).toHaveAttribute('value', 'inbox');
});

test('w-tabs items accepts a plain string list', async ({ mount, page }) => {
  await mount(`<w-tabs id="tabs" value="One" items='["One","Two"]'></w-tabs>`);

  await expect(page.locator('#tabs w-tab')).toHaveCount(2);
  await expect(page.locator('#tabs w-tab[value="Two"] button')).toHaveText('Two');
  await expect(page.locator('#tabs w-tab[value="One"] button')).toHaveAttribute('aria-selected', 'true');
});

test('w-tabs multiple selects several tabs and max caps the selection', async ({ mount, page }) => {
  await mount(`
    <w-tabs id="tabs" multiple max="2" value='["a"]'>
      <w-tab value="a">A</w-tab>
      <w-tab value="b">B</w-tab>
      <w-tab value="c">C</w-tab>
    </w-tabs>
  `);
  await recordEvents(page, '#tabs', ['change']);

  await expect(page.locator('#tabs .w-tabs')).toHaveAttribute('aria-multiselectable', 'true');
  await expect(page.locator('#tabs w-tab[value="a"] button')).toHaveAttribute('aria-selected', 'true');

  await page.locator('#tabs w-tab[value="b"] button').click();
  await expect(page.locator('#tabs w-tab[value="b"] button')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#tabs w-tab[value="a"] button')).toHaveAttribute('aria-selected', 'true');

  // max=2 blocks the third selection outright.
  await page.locator('#tabs w-tab[value="c"] button').click();
  await expect(page.locator('#tabs w-tab[value="c"] button')).toHaveAttribute('aria-selected', 'false');

  // Clicking an active tab removes it while another one remains.
  await page.locator('#tabs w-tab[value="a"] button').click();
  await expect(page.locator('#tabs w-tab[value="a"] button')).toHaveAttribute('aria-selected', 'false');

  expect((await readEvents(page, '#tabs')).map((event) => event.detail.value)).toEqual([
    ['a', 'b'], ['b'],
  ]);
});

test('w-tabs mandatory keeps a tab selected and mandatory=false allows deselect', async ({ mount, page }) => {
  await mount(`
    <w-tabs id="strict" value="a"><w-tab value="a">A</w-tab><w-tab value="b">B</w-tab></w-tabs>
    <w-tabs id="loose" value="a" mandatory="false"><w-tab value="a">A</w-tab><w-tab value="b">B</w-tab></w-tabs>
    <w-tabs id="multi" multiple mandatory value='["a"]'><w-tab value="a">A</w-tab><w-tab value="b">B</w-tab></w-tabs>
  `);

  await page.locator('#strict w-tab[value="a"] button').click();
  await expect(page.locator('#strict')).toHaveAttribute('value', 'a');

  await page.locator('#loose w-tab[value="a"] button').click();
  await expect(page.locator('#loose')).toHaveAttribute('value', '');
  await expect(page.locator('#loose w-tab[value="a"] button')).toHaveAttribute('aria-selected', 'false');

  // The last remaining selection cannot be removed when mandatory.
  await page.locator('#multi w-tab[value="a"] button').click();
  await expect(page.locator('#multi w-tab[value="a"] button')).toHaveAttribute('aria-selected', 'true');
});

test('w-tabs selected-class and content-class land on the tab hosts', async ({ mount, page }) => {
  await mount(`
    <w-tabs id="tabs" value="a" selected-class="is-on" content-class="pad-2 shadow">
      <w-tab value="a">A</w-tab>
      <w-tab value="b">B</w-tab>
    </w-tabs>
  `);

  await expect(page.locator('#tabs w-tab[value="a"]')).toHaveClass(/is-on/);
  await expect(page.locator('#tabs w-tab[value="b"]')).not.toHaveClass(/is-on/);
  await expect(page.locator('#tabs w-tab[value="a"]')).toHaveClass(/pad-2/);
  await expect(page.locator('#tabs w-tab[value="b"]')).toHaveClass(/shadow/);

  await page.locator('#tabs w-tab[value="b"] button').click();
  await expect(page.locator('#tabs w-tab[value="b"]')).toHaveClass(/is-on/);
  await expect(page.locator('#tabs w-tab[value="a"]')).not.toHaveClass(/is-on/);
});

test('w-tabs inset styles the strip and takes custom padding and radius', async ({ mount, page }) => {
  await mount(`
    <w-tabs id="tabs" value="a" inset inset-padding="6" inset-radius="1rem">
      <w-tab value="a">A</w-tab><w-tab value="b">B</w-tab>
    </w-tabs>
  `);

  const strip = page.locator('#tabs .w-tabs');
  await expect(strip).toHaveClass(/w-tabs--inset/);
  await expect(strip).toHaveCSS('padding-top', '6px');
  await expect(strip).toHaveCSS('border-top-left-radius', '16px');

  // `inset` is mirrored onto the tabs so they pick up the borderless shape.
  await expect(page.locator('#tabs w-tab[value="a"]')).toHaveAttribute('inset', '');
  await expect(page.locator('#tabs w-tab[value="a"] .w-tab')).toHaveClass(/w-tab--inset/);
});

test('w-tabs spaced is mirrored onto each tab', async ({ mount, page }) => {
  await mount(`
    <w-tabs id="tabs" value="a" spaced="end"><w-tab value="a">A</w-tab></w-tabs>
  `);

  await expect(page.locator('#tabs .w-tabs')).toHaveClass(/w-tabs--spaced-end/);
  await expect(page.locator('#tabs w-tab[value="a"] .w-tab')).toHaveClass(/w-tab--spaced-end/);
});

test('w-tabs mobile drops the pagination arrows', async ({ mount, page }) => {
  await mount(`
    <w-tabs id="wide" value="a" show-arrows><w-tab value="a">A</w-tab></w-tabs>
    <w-tabs id="small" value="a" show-arrows mobile><w-tab value="a">A</w-tab></w-tabs>
    <w-tabs id="bp" value="a" show-arrows mobile-breakpoint="xxl"><w-tab value="a">A</w-tab></w-tabs>
  `);

  await expect(page.locator('#wide .w-tabs-arrow')).toHaveCount(2);
  await expect(page.locator('#small .w-tabs-arrow')).toHaveCount(0);
  await expect(page.locator('#small .w-tabs')).toHaveClass(/w-tabs--mobile/);
  // The test viewport is narrower than xxl, so the breakpoint form matches too.
  await expect(page.locator('#bp .w-tabs-arrow')).toHaveCount(0);
});

test('w-tabs slider transition and duration are applied to the indicator', async ({ mount, page }) => {
  await mount(`
    <w-tabs id="tabs" value="a" slider-transition="fade" slider-transition-duration="500">
      <w-tab value="a">A</w-tab>
      <w-tab value="b" slider-transition="grow" slider-transition-duration="0.2s" slider-color="success">B</w-tab>
      <w-tab value="c" hide-slider>C</w-tab>
    </w-tabs>
  `);

  const slider = page.locator('#tabs .w-tabs-slider');
  await expect(slider).toHaveClass(/w-tabs-slider--fade/);
  await expect(slider).toHaveCSS('transition-duration', /^0\.5s/);

  // The active tab's own slider-* attributes win over the strip's.
  await page.locator('#tabs w-tab[value="b"] button').click();
  await expect(slider).toHaveClass(/w-tabs-slider--grow/);
  await expect(slider).not.toHaveClass(/w-tabs-slider--fade/);
  await expect(slider).toHaveCSS('transition-duration', /^0\.2s/);
  const bg = await slider.evaluate((el) => el.style.background);
  expect(bg).toBe('var(--w-success)');

  // A tab may hide the shared indicator for itself only.
  await page.locator('#tabs w-tab[value="c"] button').click();
  await expect(slider).toHaveClass(/w-tabs-slider--hidden/);
  await expect(slider).toBeHidden();
});

test('w-tabs scroll-to-active keeps the active tab in view', async ({ mount, page }) => {
  await mount(`
    <div style="width:160px">
      <w-tabs id="tabs" value="a" scroll-to-active>
        ${Array.from({ length: 12 }, (_, i) => `<w-tab value="t${i}">Tab number ${i}</w-tab>`).join('')}
      </w-tabs>
    </div>
  `);

  await page.locator('#tabs').evaluate((el) => el.setAttribute('value', 't10'));
  await expect.poll(async () => (
    page.locator('#tabs .w-tabs').evaluate((el) => el.scrollLeft)
  )).toBeGreaterThan(0);
});
