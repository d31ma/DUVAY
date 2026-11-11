import { expect, test } from '../setup/component-test.js';

test('w-avatar renders image, text, icon, and default slot content with Vuetify aliases', async ({ mount, page }) => {
  await mount('<w-avatar id="avatar" image="/avatar.png" alt="Ada Lovelace"></w-avatar>');

  await expect(page.locator('#avatar .w-avatar')).toHaveAttribute('role', 'img');
  await expect(page.locator('#avatar .w-avatar')).toHaveAttribute('aria-label', 'Ada Lovelace');
  await expect(page.locator('#avatar img')).toHaveAttribute('src', '/avatar.png');
  await expect(page.locator('#avatar img')).toHaveAttribute('alt', 'Ada Lovelace');

  await page.locator('#avatar').evaluate((el) => {
    el.removeAttribute('image');
    el.setAttribute('text', 'AL');
    el.setAttribute('alt', 'Ada initials');
  });

  await expect(page.locator('#avatar .w-avatar-text')).toHaveText('AL');
  await expect(page.locator('#avatar .w-avatar')).toHaveAttribute('aria-label', 'Ada initials');

  await page.locator('#avatar').evaluate((el) => {
    el.removeAttribute('text');
    el.setAttribute('icon', 'person');
  });

  await expect(page.locator('#avatar .w-avatar-icon')).toHaveText('person');

  await mount('<w-avatar id="slot-avatar" text="AL"><strong>DUVAY</strong></w-avatar>');
  await expect(page.locator('#slot-avatar .w-avatar')).toContainText('DUVAY');
  await expect(page.locator('#slot-avatar .w-avatar-text')).toHaveCount(0);
});

test('w-avatar reflects size, density, variant, color, rounded, border, elevation, start, and end', async ({ mount, page }) => {
  await mount('<w-avatar id="avatar" initials="DUVAY" size="x-small" density="compact" variant="outlined" color="success" rounded border elevation="3" start end></w-avatar>');

  const avatar = page.locator('#avatar .w-avatar');
  await expect(avatar).toHaveClass(/w-avatar--x-small/);
  await expect(avatar).toHaveClass(/w-avatar--density-compact/);
  await expect(avatar).toHaveClass(/w-avatar--variant-outlined/);
  await expect(avatar).toHaveClass(/w-avatar--color-success/);
  await expect(avatar).toHaveClass(/w-avatar--rounded/);
  await expect(avatar).toHaveClass(/w-avatar--border/);
  await expect(avatar).toHaveClass(/w-avatar--elevation-3/);
  await expect(avatar).toHaveClass(/w-avatar--start/);
  await expect(avatar).toHaveClass(/w-avatar--end/);

  await page.locator('#avatar').evaluate((el) => {
    el.setAttribute('size', 'lg');
    el.setAttribute('variant', 'elevated');
    el.setAttribute('color', 'danger');
    el.setAttribute('rounded', 'pill');
    el.setAttribute('tile', '');
  });

  await expect(avatar).toHaveClass(/w-avatar--large/);
  await expect(avatar).toHaveClass(/w-avatar--variant-elevated/);
  await expect(avatar).toHaveClass(/w-avatar--color-error/);
  await expect(avatar).toHaveClass(/w-avatar--rounded-pill/);
  await expect(avatar).toHaveClass(/w-avatar--tile/);
});

test('w-avatar supports custom CSS length sizes', async ({ mount, page }) => {
  await mount('<w-avatar id="avatar" text="72" size="72"></w-avatar>');

  const size = await page.locator('#avatar .w-avatar').evaluate((el) => getComputedStyle(el).getPropertyValue('--w-avatar-size').trim());
  expect(size).toBe('72px');
});

test('w-avatar supports badge props, badge slot, and legacy status mapping', async ({ mount, page }) => {
  await mount('<w-avatar id="avatar" text="DUVAY" badge="success" badge-location="bottom start" badge-floating></w-avatar>');

  await expect(page.locator('#avatar .w-avatar-wrap')).toHaveClass(/w-avatar-wrap--floating/);
  await expect(page.locator('#avatar .w-avatar-badge')).toHaveClass(/w-avatar-badge--bottom-start/);
  await expect(page.locator('#avatar .w-avatar-badge')).toHaveClass(/w-avatar-badge--success/);
  await expect(page.locator('#avatar .w-avatar-badge')).toHaveClass(/w-avatar-badge--dot/);
  await expect(page.locator('#avatar .w-avatar')).toHaveCSS('border-radius', '999px');
  await expect(page.locator('#avatar .w-avatar-badge')).toHaveCSS('width', '12px');
  await expect(page.locator('#avatar .w-avatar-badge')).toHaveCSS('height', '12px');

  await page.locator('#avatar').evaluate((el) => {
    el.removeAttribute('badge');
    el.removeAttribute('badge-floating');
    el.setAttribute('badge-content', '4');
    el.setAttribute('badge-color', 'warning');
  });

  await expect(page.locator('#avatar .w-avatar-badge')).toHaveText('4');
  await expect(page.locator('#avatar .w-avatar-badge')).toHaveClass(/w-avatar-badge--warning/);
  await expect(page.locator('#avatar .w-avatar-badge')).not.toHaveClass(/w-avatar-badge--dot/);
  await expect(page.locator('#avatar .w-avatar-badge')).toHaveCSS('min-width', '18px');
  await expect(page.locator('#avatar .w-avatar-badge')).toHaveCSS('height', '18px');

  await mount(`
    <w-avatar id="slot-avatar" initials="DUVAY">
      <span slot="badge" class="custom-badge">VIP</span>
    </w-avatar>
  `);
  await expect(page.locator('#slot-avatar .w-avatar-badge .custom-badge')).toHaveText('VIP');

  await mount('<w-avatar id="status-avatar" initials="DUVAY" status="busy"></w-avatar>');
  await expect(page.locator('#status-avatar .w-avatar-badge')).toHaveClass(/w-avatar-badge--error/);
  await expect(page.locator('#status-avatar .w-avatar-status')).toHaveCount(0);
});

test('w-avatar status names the presence in the avatar and hides the dot', async ({ mount, page }) => {
  await mount(`
    <w-avatar id="online" alt="Ana Lee" status="online"></w-avatar>
    <w-avatar id="away" alt="Ana Lee" status="away"></w-avatar>
    <w-avatar id="custom" alt="Ana Lee" status="busy" status-label="In a call"></w-avatar>
  `);

  await expect(page.locator('#online [role="img"]')).toHaveAccessibleName('Ana Lee, Online');
  await expect(page.locator('#away [role="img"]')).toHaveAccessibleName('Ana Lee, Away');
  await expect(page.locator('#custom [role="img"]')).toHaveAccessibleName('Ana Lee, In a call');
  await expect(page.locator('#online .w-avatar-badge')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('#online .w-avatar-badge')).not.toHaveAttribute('aria-label', /.*/);
});

test('w-avatar supports idle, dnd and offline presence with distinct shapes', async ({ mount, page }) => {
  await mount(`
    <w-avatar id="idle" alt="Ana" status="idle"></w-avatar>
    <w-avatar id="dnd" alt="Ana" status="dnd"></w-avatar>
    <w-avatar id="offline" alt="Ana" status="offline"></w-avatar>
  `);

  await expect(page.locator('#idle [role="img"]')).toHaveAccessibleName('Ana, Idle');
  await expect(page.locator('#dnd [role="img"]')).toHaveAccessibleName('Ana, Do not disturb');
  await expect(page.locator('#offline [role="img"]')).toHaveAccessibleName('Ana, Offline');
  await expect(page.locator('#idle .w-avatar-badge')).toHaveClass(/w-avatar-badge--warning/);
  await expect(page.locator('#dnd .w-avatar-badge')).toHaveClass(/w-avatar-badge--error/);
  await expect(page.locator('#offline .w-avatar-badge')).toHaveClass(/w-avatar-badge--secondary/);
  await expect(page.locator('#offline .w-avatar-badge')).toHaveClass(/w-avatar-badge--status-offline/);
  const dndBar = await page.locator('#dnd .w-avatar-badge').evaluate((el) => getComputedStyle(el, '::after').content);
  expect(dndBar).toBe('""');
  const ring = await page.locator('#idle .w-avatar-badge').evaluate((el) => getComputedStyle(el).boxShadow);
  expect(ring).toContain('inset');
});
