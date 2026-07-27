import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-list-item reflects link, media, variant, density, lines, and active attrs', async ({ mount, page }) => {
  await mount(`
    <w-list-item
      id="item"
      href="/docs/lists"
      title="Avery Morgan"
      subtitle="Shared the revised roadmap."
      value="avery"
      prepend-avatar="AM"
      append-icon="9:42"
      variant="tonal"
      density="compact"
      lines="two"
      active-class="is-current"
      active
      border
      rounded
      elevation="1"
    ></w-list-item>
  `);

  const control = page.locator('#item .w-list-item');
  await expect(control).toHaveAttribute('href', '/docs/lists');
  await expect(control).toHaveClass(/w-list-item--variant-tonal/);
  await expect(control).toHaveClass(/w-list-item--compact/);
  await expect(control).toHaveClass(/w-list-item--two-line/);
  await expect(control).toHaveClass(/w-list-item--border/);
  await expect(control).toHaveClass(/w-list-item--rounded/);
  await expect(control).toHaveClass(/w-list-item--elevation-1/);
  await expect(control).toHaveClass(/is-current/);
  await expect(page.locator('#item .w-avatar-text')).toHaveText('AM');
  await expect(page.locator('#item .w-list-item-subtitle')).toHaveText('Shared the revised roadmap.');

  await page.locator('#item').evaluate((el) => {
    el.removeAttribute('active');
    el.setAttribute('append-avatar', 'https://example.test/avatar.png');
    el.setAttribute('variant', 'outlined');
  });

  await expect(control).not.toHaveClass(/is-current/);
  await expect(control).toHaveClass(/w-list-item--variant-outlined/);
  await expect(page.locator('#item .w-list-item-append img')).toHaveAttribute('src', 'https://example.test/avatar.png');
});

test('w-list-item emits change and supports keyboard activation', async ({ mount, page }) => {
  await mount('<w-list-item id="item" title="Inbox" value="inbox"></w-list-item>');
  await recordEvents(page, '#item', ['change']);

  await page.locator('#item .w-list-item').focus();
  await page.keyboard.press('Enter');

  expect(await readEvents(page, '#item')).toEqual([
    { type: 'change', detail: { value: 'inbox', title: 'Inbox' } },
  ]);
});

test('w-list-item prepend-gap widens the leading column and index sets aria-posinset', async ({ mount, page }) => {
  await mount('<w-list-item id="item" title="Inbox" value="inbox" prepend-icon="@" prepend-gap="4rem" index="2"></w-list-item>');
  await recordEvents(page, '#item', ['change']);

  const control = page.locator('#item .w-list-item');
  await expect(control).toHaveCSS('--w-list-prepend-gap', '4rem');
  await expect(control).toHaveAttribute('aria-posinset', '2');

  const columns = await control.evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ')[0]);
  expect(Number.parseFloat(columns)).toBeGreaterThanOrEqual(64);

  await control.click();
  expect(await readEvents(page, '#item')).toEqual([
    { type: 'change', detail: { value: 'inbox', title: 'Inbox', index: 2 } },
  ]);
});

test('w-list-subheader renders a title and applies sticky and inset', async ({ mount, page }) => {
  await mount(`
    <w-list-subheader id="plain" title="Workspace"></w-list-subheader>
    <w-list-subheader id="fancy" title="Pinned" sticky inset></w-list-subheader>
  `);

  await expect(page.locator('#plain .w-list-subheader')).toHaveText('Workspace');
  await expect(page.locator('#fancy .w-list-subheader')).toHaveClass(/w-list-subheader--sticky/);
  await expect(page.locator('#fancy .w-list-subheader')).toHaveClass(/w-list-subheader--inset/);
  await expect(page.locator('#fancy .w-list-subheader')).toHaveCSS('position', 'sticky');
  expect(await page.locator('#fancy .w-list-subheader')
    .evaluate((el) => Number.parseFloat(getComputedStyle(el).paddingInlineStart))).toBeGreaterThan(16);
});

test('w-list-item-action and w-list-item-media put the gap on the far side', async ({ mount, page }) => {
  await mount(`
    <w-list-item-action id="action-start" start>A</w-list-item-action>
    <w-list-item-action id="action-end" end>A</w-list-item-action>
    <w-list-item-media id="media-start" start>M</w-list-item-media>
    <w-list-item-media id="media-end" end>M</w-list-item-media>
  `);

  const margins = await page.evaluate(() => {
    const read = (id, selector) => {
      const styles = getComputedStyle(document.querySelector(`#${id} ${selector}`));
      return { start: styles.marginInlineStart, end: styles.marginInlineEnd };
    };
    return {
      actionStart: read('action-start', '.w-list-item-action'),
      actionEnd: read('action-end', '.w-list-item-action'),
      mediaStart: read('media-start', '.w-list-item-media'),
      mediaEnd: read('media-end', '.w-list-item-media'),
    };
  });

  expect(margins.actionStart).toEqual({ start: '0px', end: '16px' });
  expect(margins.actionEnd).toEqual({ start: '16px', end: '0px' });
  expect(margins.mediaStart).toEqual({ start: '0px', end: '16px' });
  expect(margins.mediaEnd).toEqual({ start: '16px', end: '0px' });
});

test('w-list-item-subtitle applies the opacity attribute', async ({ mount, page }) => {
  await mount(`
    <w-list-item-subtitle id="faded" opacity="0.4">Muted</w-list-item-subtitle>
    <w-list-item-subtitle id="plain">Normal</w-list-item-subtitle>
  `);

  await expect(page.locator('#faded .w-list-item-subtitle')).toHaveCSS('opacity', '0.4');
  await expect(page.locator('#plain .w-list-item-subtitle')).toHaveCSS('opacity', '1');
});
