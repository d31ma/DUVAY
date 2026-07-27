import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-fab renders icon, label, and emits click', async ({ mount, page }) => {
  await mount('<w-fab id="f" icon="add" label="Create"></w-fab>');

  const fab = page.locator('#f .w-fab');
  await expect(fab).toHaveAttribute('aria-label', 'Create');
  await expect(fab).toHaveClass(/w-fab--extended/);
  await expect(fab).toContainText('Create');

  await recordEvents(page, '#f', ['click']);
  await fab.click();
  const events = await readEvents(page, '#f');
  expect(events.map((e) => e.type)).toContain('click');
});

test('w-fab reflects size, color, variant, rounded, absolute, location, and active', async ({ mount, page }) => {
  await mount(`
    <w-fab id="f"
      size="large"
      color="success"
      variant="tonal"
      rounded="pill"
      absolute
      location="top end"
      active
    ></w-fab>
  `);

  const fab = page.locator('#f .w-fab');
  await expect(fab).toHaveClass(/w-fab--large/);
  await expect(fab).toHaveClass(/w-fab--color-success/);
  await expect(fab).toHaveClass(/w-fab--variant-tonal/);
  await expect(fab).toHaveClass(/w-fab--rounded-pill/);
  await expect(fab).toHaveClass(/w-fab--absolute/);
  await expect(fab).toHaveClass(/w-fab--top/);
  await expect(fab).toHaveClass(/w-fab--end/);
  await expect(fab).toHaveClass(/w-fab--active/);
});

test('w-fab supports all Vuetify sizes', async ({ mount, page }) => {
  for (const size of ['x-small', 'small', 'default', 'large', 'x-large']) {
    const id = `fab-${size.replace('-', '')}`;
    await mount(`<w-fab id="${id}" size="${size}"></w-fab>`);
    const fab = page.locator(`#${id} .w-fab`);
    await expect(fab).toHaveClass(new RegExp(`w-fab--${size}`));
  }
});

test('w-fab supports all Vuetify variants', async ({ mount, page }) => {
  for (const variant of ['elevated', 'flat', 'tonal', 'outlined', 'text', 'plain']) {
    const id = `fab-${variant}`;
    await mount(`<w-fab id="${id}" variant="${variant}"></w-fab>`);
    const fab = page.locator(`#${id} .w-fab`);
    if (variant === 'elevated') {
      // elevated is default, no extra class
      await expect(fab).not.toHaveClass(/w-fab--variant-/);
    } else {
      await expect(fab).toHaveClass(new RegExp(`w-fab--variant-${variant}`));
    }
  }
});

test('w-fab fixed + legacy position still works', async ({ mount, page }) => {
  await mount('<w-fab id="f" fixed position="bottom-left"></w-fab>');
  const fab = page.locator('#f .w-fab');
  await expect(fab).toHaveClass(/w-fab--fixed/);
  await expect(fab).toHaveClass(/w-fab--bottom/);
  await expect(fab).toHaveClass(/w-fab--left/);
});

test('w-fab icon-set resolves correctly', async ({ mount, page }) => {
  await mount('<w-fab id="f" icon="home" icon-set="mdi"></w-fab>');
  const icon = page.locator('#f .w-icon');
  await expect(icon).toHaveCount(1);
});

test('w-fab focus-visible outline is present', async ({ mount, page }) => {
  await mount('<w-fab id="f"></w-fab>');
  const fab = page.locator('#f .w-fab');
  await fab.focus();
  await expect(fab).toHaveCSS('outline-width', '2px');
});

test('w-fab text is an alias for label and extended can be forced on its own', async ({ mount, page }) => {
  await mount('<w-fab id="f" icon="add" text="Create"></w-fab>');
  await expect(page.locator('#f .w-fab')).toHaveClass(/w-fab--extended/);
  await expect(page.locator('#f .w-fab__label')).toHaveText('Create');

  // label wins when both are given.
  await mount('<w-fab id="both" icon="add" label="Label" text="Text"></w-fab>');
  await expect(page.locator('#both .w-fab__label')).toHaveText('Label');

  await mount('<w-fab id="ext" icon="add" extended></w-fab>');
  await expect(page.locator('#ext .w-fab')).toHaveClass(/w-fab--extended/);
});

test('w-fab flat drops the shadow and block, slim and stacked reshape the control', async ({ mount, page }) => {
  await mount(`
    <div style="width: 280px">
      <w-fab id="flat" icon="add" flat></w-fab>
      <w-fab id="block" icon="add" label="Wide" block></w-fab>
      <w-fab id="slim" icon="add" label="Slim" slim></w-fab>
      <w-fab id="stacked" icon="add" label="Stacked" stacked></w-fab>
    </div>
  `);

  await expect(page.locator('#flat .w-fab')).toHaveCSS('box-shadow', 'none');
  await expect(page.locator('#block .w-fab')).toHaveCSS('width', '280px');
  await expect(page.locator('#slim .w-fab')).toHaveCSS('padding-left', '8px');
  await expect(page.locator('#stacked .w-fab')).toHaveCSS('flex-direction', 'column');

  expect(await page.locator('#block .w-fab').evaluate((el) => getComputedStyle(el).boxShadow)).not.toBe('none');
});

test('w-fab prepend-icon and append-icon bracket the label', async ({ mount, page }) => {
  await mount('<w-fab id="f" icon="add" label="Create" prepend-icon="left" append-icon="right"></w-fab>');

  await expect(page.locator('#f .w-fab__prepend')).toHaveCount(1);
  await expect(page.locator('#f .w-fab__append')).toHaveCount(1);

  const order = await page.locator('#f .w-fab').evaluate((el) => (
    [...el.children].map((child) => child.className.split(' ').pop())
  ));
  expect(order[0]).toBe('w-fab__prepend');
  expect(order[order.length - 1]).toBe('w-fab__append');
});

test('w-fab href renders an anchor and value, name and order reach the control', async ({ mount, page }) => {
  await mount('<w-fab id="link" icon="add" href="/new" label="New" name="create" order="3"></w-fab>');

  const anchor = page.locator('#link a.w-fab');
  await expect(anchor).toHaveAttribute('href', '/new');
  await expect(anchor).toHaveAttribute('data-name', 'create');
  await expect(anchor).toHaveCSS('order', '3');
  await expect(anchor).not.toHaveAttribute('value', /.*/);

  await mount('<w-fab id="btn" icon="add" value="create"></w-fab>');
  await expect(page.locator('#btn button.w-fab')).toHaveAttribute('value', 'create');
});

test('w-fab rejects dangerous href protocols', async ({ mount, page }) => {
  await mount(`
    <w-fab id="safe" icon="add" href="../new"></w-fab>
    <w-fab id="script" icon="add" href="javaScript:alert(1)"></w-fab>
    <w-fab id="data" icon="add" href="data:text/html,bad"></w-fab>
  `);

  await expect(page.locator('#safe a.w-fab')).toHaveAttribute('href', '../new');
  await expect(page.locator('#script a, #data a')).toHaveCount(0);
  await expect(page.locator('#script button, #data button')).toHaveCount(2);
});

test('w-fab app pins to the viewport and layout keeps it in flow', async ({ mount, page }) => {
  await mount('<w-fab id="f" icon="add" app location="bottom end"></w-fab>');
  const fab = page.locator('#f .w-fab');
  await expect(fab).toHaveClass(/w-fab--app/);
  await expect(fab).toHaveClass(/w-fab--bottom/);
  await expect(fab).toHaveClass(/w-fab--end/);
  await expect(fab).toHaveCSS('position', 'fixed');

  await mount('<w-fab id="l" icon="add" app layout location="bottom end"></w-fab>');
  await expect(page.locator('#l .w-fab')).toHaveCSS('position', 'sticky');
});

test('w-fab offset straddles the edge it is anchored to', async ({ mount, page }) => {
  await mount('<w-fab id="f" icon="add" app location="bottom end" offset></w-fab>');
  const fab = page.locator('#f .w-fab');
  await expect(fab).toHaveClass(/w-fab--offset/);
  expect(await fab.evaluate((el) => getComputedStyle(el).transform)).not.toBe('none');

  await mount('<w-fab id="plain" icon="add" app location="bottom end"></w-fab>');
  expect(await page.locator('#plain .w-fab').evaluate((el) => getComputedStyle(el).transform)).toBe('none');
});

test('w-fab transition names the enter animation and can opt out', async ({ mount, page }) => {
  await mount('<w-fab id="fade" icon="add" transition="fade"></w-fab>');
  await expect(page.locator('#fade .w-fab')).toHaveClass(/w-fab--transition-fade/);
  await expect(page.locator('#fade .w-fab')).toHaveCSS('animation-name', 'w-fab-fade-in');

  await mount('<w-fab id="slide" icon="add" transition="slide"></w-fab>');
  await expect(page.locator('#slide .w-fab')).toHaveCSS('animation-name', 'w-fab-slide-in');

  await mount('<w-fab id="off" icon="add" transition="none"></w-fab>');
  await expect(page.locator('#off .w-fab')).toHaveClass(/w-fab--no-transition/);
  await expect(page.locator('#off .w-fab')).toHaveCSS('animation-name', 'none');
});

test('w-fab selected-class rides along with active, and ripple is opt-in', async ({ mount, page }) => {
  await mount('<w-fab id="on" icon="add" active selected-class="is-chosen"></w-fab>');
  await expect(page.locator('#on .w-fab')).toHaveClass(/is-chosen/);

  await mount('<w-fab id="off" icon="add" selected-class="is-chosen"></w-fab>');
  await expect(page.locator('#off .w-fab')).not.toHaveClass(/is-chosen/);

  await mount('<w-fab id="rip" icon="add" ripple></w-fab>');
  const inks = await page.locator('#rip .w-fab').evaluate((el) => {
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    return el.querySelectorAll('.w-ripple-ink').length;
  });
  expect(inks).toBe(1);

  await mount('<w-fab id="norip" icon="add"></w-fab>');
  const none = await page.locator('#norip .w-fab').evaluate((el) => {
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    return el.querySelectorAll('.w-ripple-ink').length;
  });
  expect(none).toBe(0);
});
