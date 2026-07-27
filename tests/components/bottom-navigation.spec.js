import { expect, test } from '../setup/component-test.js';

test('w-bottom-navigation manages active item and emits change', async ({ mount, page }) => {
  await mount(`
    <w-bottom-navigation id="nav" value="home">
      <w-bottom-nav-item id="home" value="home" icon="🏠" label="Home"></w-bottom-nav-item>
      <w-bottom-nav-item id="search" value="search" icon="🔍" label="Search"></w-bottom-nav-item>
      <w-bottom-nav-item id="fav" value="favorites" icon="⭐" label="Favorites"></w-bottom-nav-item>
    </w-bottom-navigation>
  `);

  await expect(page.locator('#home')).toHaveAttribute('active', '');
  await expect(page.locator('#search')).not.toHaveAttribute('active', '');

  await page.locator('#search').click();
  await expect(page.locator('#search')).toHaveAttribute('active', '');
  await expect(page.locator('#home')).not.toHaveAttribute('active', '');
  await expect(page.locator('#nav')).toHaveAttribute('value', 'search');
});

test('w-bottom-navigation color and bg-color', async ({ mount, page }) => {
  await mount(`
    <w-bottom-navigation id="nav" color="primary" bg-color="surface">
      <w-bottom-nav-item value="a" label="A"></w-bottom-nav-item>
    </w-bottom-navigation>
  `);
  const nav = page.locator('#nav > .w-bottom-navigation');
  const colorVar = await nav.evaluate((el) => getComputedStyle(el).getPropertyValue('--w-bottom-nav-color').trim());
  const primary = await nav.evaluate((el) => getComputedStyle(el).getPropertyValue('--w-primary').trim());
  expect(colorVar).toBe(primary);
  const bgVar = await nav.evaluate((el) => getComputedStyle(el).getPropertyValue('--w-bottom-nav-bg').trim());
  const surface = await nav.evaluate((el) => getComputedStyle(el).getPropertyValue('--w-surface').trim());
  expect(bgVar).toBe(surface);
});

test('w-bottom-navigation grow mode', async ({ mount, page }) => {
  await mount(`
    <w-bottom-navigation id="nav" grow>
      <w-bottom-nav-item value="a" label="A"></w-bottom-nav-item>
      <w-bottom-nav-item value="b" label="B"></w-bottom-nav-item>
    </w-bottom-navigation>
  `);
  const nav = page.locator('#nav > .w-bottom-navigation');
  await expect(nav).toHaveClass(/w-bottom-navigation--grow/);
});

test('w-bottom-navigation shift mode', async ({ mount, page }) => {
  await mount(`
    <w-bottom-navigation id="nav" mode="shift" value="a">
      <w-bottom-nav-item id="a" value="a" icon="🏠" label="Home"></w-bottom-nav-item>
      <w-bottom-nav-item id="b" value="b" icon="🔍" label="Search"></w-bottom-nav-item>
    </w-bottom-navigation>
  `);
  const nav = page.locator('#nav > .w-bottom-navigation');
  await expect(nav).toHaveClass(/w-bottom-navigation--shift/);
});

test('w-bottom-navigation density variants', async ({ mount, page }) => {
  await mount(`
    <w-bottom-navigation id="comf" density="comfortable">
      <w-bottom-nav-item value="a" label="A"></w-bottom-nav-item>
    </w-bottom-navigation>
    <w-bottom-navigation id="comp" density="compact">
      <w-bottom-nav-item value="b" label="B"></w-bottom-nav-item>
    </w-bottom-navigation>
  `);
  await expect(page.locator('#comf > .w-bottom-navigation')).toHaveClass(/w-bottom-navigation--comfortable/);
  await expect(page.locator('#comp > .w-bottom-navigation')).toHaveClass(/w-bottom-navigation--compact/);
});

test('w-bottom-navigation elevation', async ({ mount, page }) => {
  await mount(`
    <w-bottom-navigation id="nav" elevation="4">
      <w-bottom-nav-item value="a" label="A"></w-bottom-nav-item>
    </w-bottom-navigation>
  `);
  const nav = page.locator('#nav > .w-bottom-navigation');
  await expect(nav).toHaveClass(/\belevation-4\b/);
});

test('w-bottom-navigation height', async ({ mount, page }) => {
  await mount(`
    <w-bottom-navigation id="nav" height="72">
      <w-bottom-nav-item value="a" label="A"></w-bottom-nav-item>
    </w-bottom-navigation>
  `);
  const nav = page.locator('#nav > .w-bottom-navigation');
  await expect(nav).toHaveCSS('--w-bottom-nav-height', '72px');
});

test('w-bottom-nav-item disabled prevents activation', async ({ mount, page }) => {
  await mount(`
    <w-bottom-navigation id="nav" value="a">
      <w-bottom-nav-item id="a" value="a" label="A"></w-bottom-nav-item>
      <w-bottom-nav-item id="b" value="b" label="B" disabled></w-bottom-nav-item>
    </w-bottom-navigation>
  `);

  await page.locator('#b .w-bottom-nav-item').dispatchEvent('click');
  await expect(page.locator('#nav')).toHaveAttribute('value', 'a');
  await expect(page.locator('#b')).not.toHaveAttribute('active', '');
});

test('w-bottom-nav-item href renders as anchor', async ({ mount, page }) => {
  await mount(`
    <w-bottom-nav-item id="link" value="link" href="/page" label="Link"></w-bottom-nav-item>
  `);
  const link = page.locator('#link > .w-bottom-nav-item');
  await expect(link).toHaveAttribute('href', '/page');
});

test('w-bottom-nav-item color override', async ({ mount, page }) => {
  await mount(`
    <w-bottom-navigation id="nav" value="a">
      <w-bottom-nav-item id="a" value="a" label="A" color="success"></w-bottom-nav-item>
    </w-bottom-navigation>
  `);
  const item = page.locator('#a > .w-bottom-nav-item');
  const colorVar = await item.evaluate((el) => getComputedStyle(el).getPropertyValue('--w-bottom-nav-item-color').trim());
  const success = await item.evaluate((el) => getComputedStyle(el).getPropertyValue('--w-success').trim());
  expect(colorVar).toBe(success);
});

test('w-bottom-navigation emits change event', async ({ mount, page }) => {
  await mount(`
    <w-bottom-navigation id="nav" value="a">
      <w-bottom-nav-item id="a" value="a" label="A"></w-bottom-nav-item>
      <w-bottom-nav-item id="b" value="b" label="B"></w-bottom-nav-item>
    </w-bottom-navigation>
  `);

  await page.evaluate(() => {
    window.changeEvents = [];
    document.querySelector('#nav').addEventListener('change', (e) => {
      window.changeEvents.push(e.detail);
    });
  });

  await page.locator('#b').click();
  await page.waitForTimeout(50);

  const events = await page.evaluate(() => window.changeEvents);
  expect(events.length).toBe(1);
  expect(events[0]).toEqual({ value: 'b' });
});

test('w-bottom-navigation name, order and absolute reach the rendered nav', async ({ mount, page }) => {
  await mount(`
    <div style="position: relative; height: 200px">
      <w-bottom-navigation id="nav" name="footer" order="4" absolute>
        <w-bottom-nav-item value="a" label="A"></w-bottom-nav-item>
      </w-bottom-navigation>
    </div>
  `);

  const nav = page.locator('#nav > .w-bottom-navigation');
  await expect(nav).toHaveAttribute('data-name', 'footer');
  await expect(nav).toHaveCSS('order', '4');
  await expect(nav).toHaveClass(/w-bottom-navigation--absolute/);
  await expect(nav).toHaveCSS('position', 'absolute');
});

test('w-bottom-navigation active hides the bar without unmounting it', async ({ mount, page }) => {
  await mount(`
    <w-bottom-navigation id="nav" active="false">
      <w-bottom-nav-item value="a" label="A"></w-bottom-nav-item>
    </w-bottom-navigation>
  `);

  const nav = page.locator('#nav > .w-bottom-navigation');
  await expect(nav).toHaveClass(/w-bottom-navigation--inactive/);
  await expect(nav).toHaveAttribute('aria-hidden', 'true');
  await expect(nav).toHaveCSS('visibility', 'hidden');

  await page.locator('#nav').evaluate((el) => el.setAttribute('active', ''));
  await expect(page.locator('#nav > .w-bottom-navigation')).not.toHaveClass(/w-bottom-navigation--inactive/);
  await expect(page.locator('#nav > .w-bottom-navigation')).toHaveCSS('visibility', 'visible');
});

test('w-bottom-navigation multiple keeps several items active and max caps them', async ({ mount, page }) => {
  await mount(`
    <w-bottom-navigation id="nav" multiple max="2" value="a">
      <w-bottom-nav-item id="a" value="a" label="A"></w-bottom-nav-item>
      <w-bottom-nav-item id="b" value="b" label="B"></w-bottom-nav-item>
      <w-bottom-nav-item id="c" value="c" label="C"></w-bottom-nav-item>
    </w-bottom-navigation>
  `);

  await page.evaluate(() => {
    window.changes = [];
    document.querySelector('#nav').addEventListener('change', (e) => window.changes.push(e.detail.value));
  });

  await page.locator('#b').click();
  await expect(page.locator('#nav')).toHaveAttribute('value', 'a,b');
  await expect(page.locator('#a')).toHaveAttribute('active', '');
  await expect(page.locator('#b')).toHaveAttribute('active', '');

  // `max="2"` refuses the third selection.
  await page.locator('#c').click();
  await expect(page.locator('#nav')).toHaveAttribute('value', 'a,b');
  await expect(page.locator('#c')).not.toHaveAttribute('active', '');

  await page.locator('#a').click();
  await expect(page.locator('#nav')).toHaveAttribute('value', 'b');

  expect(await page.evaluate(() => window.changes)).toEqual([['a', 'b'], ['b']]);
});

test('w-bottom-navigation mandatory keeps a selection and force seeds the first item', async ({ mount, page }) => {
  await mount(`
    <w-bottom-navigation id="nav" mandatory value="a">
      <w-bottom-nav-item id="a" value="a" label="A"></w-bottom-nav-item>
      <w-bottom-nav-item id="b" value="b" label="B"></w-bottom-nav-item>
    </w-bottom-navigation>
    <w-bottom-navigation id="forced" mandatory="force">
      <w-bottom-nav-item id="x" value="x" label="X"></w-bottom-nav-item>
      <w-bottom-nav-item id="y" value="y" label="Y"></w-bottom-nav-item>
    </w-bottom-navigation>
  `);

  await page.locator('#a').click();
  await expect(page.locator('#nav')).toHaveAttribute('value', 'a');
  await expect(page.locator('#a')).toHaveAttribute('active', '');

  await expect(page.locator('#forced')).toHaveAttribute('value', 'x');
  await expect(page.locator('#x')).toHaveAttribute('active', '');
});

test('w-bottom-navigation without mandatory deselects the active item on a second click', async ({ mount, page }) => {
  await mount(`
    <w-bottom-navigation id="nav" value="a">
      <w-bottom-nav-item id="a" value="a" label="A"></w-bottom-nav-item>
      <w-bottom-nav-item id="b" value="b" label="B"></w-bottom-nav-item>
    </w-bottom-navigation>
  `);

  await page.locator('#a').click();
  await expect(page.locator('#nav')).not.toHaveAttribute('value', 'a');
  await expect(page.locator('#a')).not.toHaveAttribute('active', '');
});

test('w-bottom-navigation selected-class marks the selected item hosts', async ({ mount, page }) => {
  await mount(`
    <w-bottom-navigation id="nav" value="a" selected-class="is-current">
      <w-bottom-nav-item id="a" value="a" label="A"></w-bottom-nav-item>
      <w-bottom-nav-item id="b" value="b" label="B"></w-bottom-nav-item>
    </w-bottom-navigation>
  `);

  await expect(page.locator('#a')).toHaveClass(/\bis-current\b/);
  await expect(page.locator('#b')).not.toHaveClass(/\bis-current\b/);

  await page.locator('#b').click();
  await expect(page.locator('#b')).toHaveClass(/\bis-current\b/);
  await expect(page.locator('#a')).not.toHaveClass(/\bis-current\b/);
});
