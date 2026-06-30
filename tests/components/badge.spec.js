import { expect, test } from '../setup/component-test.js';

test('w-badge renders inline content, max capping, icon, label, and variants', async ({ mount, page }) => {
  await mount('<w-badge id="badge" inline content="128" max="99" color="success" text-color="warning" label="Unread messages"></w-badge>');

  const badge = page.locator('#badge .w-badge');
  await expect(badge).toHaveText('99+');
  await expect(badge).toHaveClass(/w-badge-filled/);
  await expect(badge).toHaveClass(/w-badge-success/);
  await expect(badge).toHaveClass(/w-badge-text-warning/);
  await expect(badge).toHaveAttribute('aria-label', 'Unread messages');
  await expect(badge).toHaveAttribute('role', 'status');

  await page.locator('#badge').evaluate((el) => {
    el.setAttribute('icon', 'mail');
    el.setAttribute('variant', 'outlined');
    el.setAttribute('rounded', 'sm');
    el.setAttribute('label', '');
  });

  await expect(page.locator('#badge .w-badge-icon')).toHaveText('mail');
  await expect(badge).toHaveClass(/w-badge-outlined/);
  await expect(badge).toHaveClass(/w-badge-rounded-sm/);
  await expect(badge).toHaveClass(/w-badge-label/);
});

test('w-badge wraps default slot content with location, offsets, dot size, bordered, and floating props', async ({ mount, page }) => {
  await mount(`
    <w-badge id="badge" dot dot-size="14" color="danger" bordered floating location="bottom start" offset-x="6" offset-y="8">
      <button type="button">Inbox</button>
    </w-badge>
  `);

  await expect(page.locator('#badge .w-badge-wrap')).toHaveClass(/w-badge-wrap--bottom-start/);
  await expect(page.locator('#badge')).toHaveClass(/w-location-bottom-start/);
  await expect(page.locator('#badge .w-badge-wrap')).toHaveClass(/w-badge-wrap--floating/);
  await expect(page.locator('#badge .w-badge-content')).toHaveClass(/w-badge-dot/);
  await expect(page.locator('#badge .w-badge-content')).toHaveClass(/w-badge-error/);
  await expect(page.locator('#badge .w-badge-content')).toHaveClass(/w-badge-bordered/);
  await expect(page.locator('#badge .w-badge-content')).toHaveAttribute('aria-label', 'Badge');
  await expect(page.locator('#badge button')).toHaveText('Inbox');

  const vars = await page.locator('#badge .w-badge-content').evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      dotSize: style.getPropertyValue('--w-badge-dot-size').trim(),
      offsetX: style.getPropertyValue('--w-badge-offset-x').trim(),
      offsetY: style.getPropertyValue('--w-badge-offset-y').trim(),
    };
  });
  expect(vars).toEqual({ dotSize: '14px', offsetX: '6px', offsetY: '8px' });
});

test('w-badge hides its bubble with active while keeping wrapped content', async ({ mount, page }) => {
  await mount('<w-badge id="badge" content="5" active="false"><span>Alerts</span></w-badge>');

  await expect(page.locator('#badge .w-badge-content')).toHaveCount(0);
  await expect(page.locator('#badge')).toContainText('Alerts');

  await page.locator('#badge').evaluate((el) => el.setAttribute('active', 'true'));

  await expect(page.locator('#badge .w-badge-content')).toHaveText('5');
});

test('w-badge supports custom badge slot and legacy slot-only inline labels', async ({ mount, page }) => {
  await mount(`
    <w-badge id="badge" color="primary">
      <span>Profile</span>
      <span slot="badge" class="custom-badge">new</span>
    </w-badge>
  `);

  await expect(page.locator('#badge .w-badge-content .custom-badge')).toHaveText('new');
  await expect(page.locator('#badge .w-badge-content')).toHaveClass(/w-badge-primary/);

  await mount('<w-badge id="inline">Beta</w-badge>');
  await expect(page.locator('#inline .w-badge')).toHaveText('Beta');
  await expect(page.locator('#inline .w-badge-wrap')).toHaveCount(0);
});
