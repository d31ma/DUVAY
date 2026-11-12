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

test('w-list-item item-role gives plain buttons, menu rows and static rows', async ({ mount, page }) => {
  await mount(`<div role="menu" aria-label="Sort">
      <w-list-item id="radio" item-role="menuitemradio" title="Newest" active></w-list-item>
      <w-list-item id="radio2" item-role="menuitemradio" title="Oldest"></w-list-item>
    </div>
    <w-list-item id="plain" item-role="button" title="Archive" active></w-list-item>
    <w-list-item id="static" item-role="none" title="Read only"></w-list-item>`);

  await expect(page.getByRole('menuitemradio', { name: 'Newest' })).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByRole('menuitemradio', { name: 'Oldest' })).toHaveAttribute('aria-checked', 'false');
  await expect(page.locator('#radio')).toHaveAttribute('role', 'none');
  await expect(page.locator('#plain button')).not.toHaveAttribute('aria-pressed', /./);
  await expect(page.locator('#static button, #static a')).toHaveCount(0);
  await expect(page.locator('#static .w-list-item')).toContainText('Read only');
});

const LONG_TITLE = 'Here are the two logo options we talked about on Monday, with the colours from the brand guide';
const LONG_SUBTITLE = 'Chat with Ana Silva and the design team at example.com';

async function titleBox(page, selector) {
  return page.locator(`${selector} .w-list-item-title`).evaluate((element) => ({
    cut: element.scrollWidth > element.clientWidth,
    lines: Math.round(element.getBoundingClientRect().height / Number.parseFloat(getComputedStyle(element).lineHeight)),
  }));
}

test('w-list-item keeps a one-line title by default and wrap shows all of it', async ({ mount, page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await mount(`<w-list aria-label="Rows">
      <w-list-item id="cut" item-role="none" title="${LONG_TITLE}" subtitle="${LONG_SUBTITLE}"></w-list-item>
      <w-list-item id="whole" item-role="none" wrap title="${LONG_TITLE}" subtitle="${LONG_SUBTITLE}"></w-list-item>
    </w-list>`);

  expect(await titleBox(page, '#cut')).toEqual({ cut: true, lines: 1 });
  const whole = await titleBox(page, '#whole');
  expect([whole.cut, whole.lines > 1]).toEqual([false, true]);
  const subtitle = await page.locator('#whole .w-list-item-subtitle').evaluate((element) => element.scrollWidth > element.clientWidth);
  expect(subtitle).toBe(false);
  await expect(page.locator('#whole .w-list-item')).toHaveClass(/w-list-item--wrap/);
});

test('w-list-item wrap also works on an interactive row', async ({ mount, page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await mount(`<w-list-item id="whole" wrap title="${LONG_TITLE}"></w-list-item>`);
  const whole = await titleBox(page, '#whole');
  expect([whole.cut, whole.lines > 1]).toEqual([false, true]);
  await expect(page.getByRole('button', { name: LONG_TITLE })).toBeVisible();
});

async function textStart(page, selector) {
  return page.locator(selector).evaluate((host) => {
    const row = host.querySelector('.w-list-item');
    const content = host.querySelector('.w-list-item-content');
    return Math.round(content.getBoundingClientRect().left - row.getBoundingClientRect().left);
  });
}

test('w-list-item no-prepend-space drops the empty leading space when nothing is prepended', async ({ mount, page }) => {
  await mount(`<div style="width: 400px"><w-list aria-label="Rows">
      <w-list-item id="spacer" title="Keeps the space"></w-list-item>
      <w-list-item id="flush" no-prepend-space title="Starts at the padding"></w-list-item>
      <w-list-item id="icon" no-prepend-space prepend-icon="@" title="Has an icon"></w-list-item>
      <w-list-item id="slotted" no-prepend-space title="Has slotted content"><span slot="prepend">#</span></w-list-item>
      <w-list-item id="static" no-prepend-space item-role="none" title="Static row"></w-list-item>
    </w-list></div>`);

  const padding = await page.locator('#flush .w-list-item').evaluate((row) => Math.round(Number.parseFloat(getComputedStyle(row).paddingInlineStart)));
  expect(await textStart(page, '#flush')).toBe(padding);
  expect(await textStart(page, '#static')).toBe(padding);
  expect(await textStart(page, '#spacer')).toBeGreaterThan(padding + 24);
  await expect(page.locator('#flush .w-list-item-prepend')).toHaveCount(0);
  await expect(page.locator('#icon .w-list-item-prepend')).toHaveText('@');
  await expect(page.locator('#slotted .w-list-item-prepend')).toContainText('#');
  expect(await textStart(page, '#icon')).toBe(await textStart(page, '#spacer'));
});

test('w-list-item no-prepend-space starts at the right padding in right-to-left layout', async ({ mount, page }) => {
  await mount('<div dir="rtl" style="width: 400px"><w-list aria-label="Rows"><w-list-item id="flush" no-prepend-space title="שלום"></w-list-item></w-list></div>');
  const gap = await page.locator('#flush').evaluate((host) => {
    const row = host.querySelector('.w-list-item');
    const content = host.querySelector('.w-list-item-content');
    return Math.round(row.getBoundingClientRect().right - content.getBoundingClientRect().right);
  });
  const padding = await page.locator('#flush .w-list-item').evaluate((row) => Math.round(Number.parseFloat(getComputedStyle(row).paddingInlineStart)));
  expect(gap).toBe(padding);
});
