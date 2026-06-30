import { expect, test } from '../setup/component-test.js';

test('w-breadcrumbs renders composed crumbs with link/active semantics and auto dividers', async ({ mount, page }) => {
  await mount(`
    <w-breadcrumbs id="bc">
      <w-breadcrumb href="/">Home</w-breadcrumb>
      <w-breadcrumb href="/team">Team</w-breadcrumb>
      <w-breadcrumb active>Members</w-breadcrumb>
    </w-breadcrumbs>
  `);

  await expect(page.locator('#bc nav.w-breadcrumbs')).toHaveAttribute('aria-label', 'Breadcrumb');
  await expect(page.locator('#bc a.w-breadcrumb')).toHaveCount(2);
  await expect(page.locator('#bc w-breadcrumb[active] .w-breadcrumb')).toHaveAttribute('aria-current', 'page');

  // Auto divider is drawn between adjacent composed crumbs (host-adjacency rule).
  const dividerContent = await page.locator('#bc w-breadcrumb:nth-child(2) .w-breadcrumb').evaluate(
    (el) => getComputedStyle(el, '::before').content,
  );
  expect(dividerContent).toBe('"/"');
});

test('w-breadcrumbs renders the items array with the current page, disabled, and custom divider', async ({ mount, page }) => {
  await mount(`
    <w-breadcrumbs id="bc" divider="›"
      items='[{"title":"Home","href":"/","icon":"H"},{"title":"Reports","href":"/r","disabled":true},{"title":"Q2"}]'></w-breadcrumbs>
  `);

  await expect(page.locator('#bc .w-breadcrumb')).toHaveCount(3);
  // Home is a link; the disabled middle crumb and the last crumb are spans.
  await expect(page.locator('#bc a.w-breadcrumb')).toHaveCount(1);
  await expect(page.locator('#bc .w-breadcrumb[aria-disabled="true"]')).toHaveText(/Reports/);
  await expect(page.locator('#bc .w-breadcrumb.active')).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('#bc .w-breadcrumb-icon')).toHaveCount(1);

  const dividerContent = await page.locator('#bc .w-breadcrumb:nth-child(3)').evaluate(
    (el) => getComputedStyle(el, '::before').content,
  );
  expect(dividerContent).toBe('"›"');
});

test('w-breadcrumbs maps color / active-color to scoped custom properties', async ({ mount, page }) => {
  await mount('<w-breadcrumbs id="bc" color="primary" active-color="success"><w-breadcrumb active>Now</w-breadcrumb></w-breadcrumbs>');

  const vars = await page.locator('#bc').evaluate((el) => ({
    color: el.style.getPropertyValue('--w-breadcrumb-color'),
    active: el.style.getPropertyValue('--w-breadcrumb-active-color'),
  }));
  expect(vars.color).toBe('var(--w-primary)');
  expect(vars.active).toBe('var(--w-success)');
});
