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
