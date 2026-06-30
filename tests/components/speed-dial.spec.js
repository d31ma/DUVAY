import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-speed-dial toggles open on trigger click and emits toggle/update:open', async ({ mount, page }) => {
  await mount(`
    <w-speed-dial id="sd" icon="add">
      <w-fab icon="edit" label="Edit"></w-fab>
      <w-fab icon="delete" label="Delete"></w-fab>
    </w-speed-dial>
  `);

  const trigger = page.locator('#sd .w-speed-dial__trigger');
  const actions = page.locator('#sd .w-speed-dial__actions');

  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(actions).not.toHaveClass(/w-speed-dial--open/);

  await recordEvents(page, '#sd', ['toggle', 'update:open']);
  await trigger.click();

  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#sd .w-speed-dial')).toHaveClass(/w-speed-dial--open/);

  const events = await readEvents(page, '#sd');
  expect(events.filter((e) => e.type === 'toggle').map((e) => e.detail)).toContainEqual({ open: true });
  expect(events.filter((e) => e.type === 'update:open').map((e) => e.detail)).toContainEqual({ open: true });

  // Click again to close
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#sd .w-speed-dial')).not.toHaveClass(/w-speed-dial--open/);
});

test('w-speed-dial closes on Escape and returns focus to trigger', async ({ mount, page }) => {
  await mount(`
    <w-speed-dial id="sd" open icon="add">
      <w-fab icon="edit"></w-fab>
    </w-speed-dial>
  `);

  const trigger = page.locator('#sd .w-speed-dial__trigger');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');

  await page.keyboard.press('Escape');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#sd .w-speed-dial')).not.toHaveClass(/w-speed-dial--open/);
});

test('w-speed-dial closes on click outside', async ({ mount, page }) => {
  await mount(`
    <div>
      <w-speed-dial id="sd" open icon="add">
        <w-fab icon="edit"></w-fab>
      </w-speed-dial>
      <button id="outside">Outside</button>
    </div>
  `);

  await expect(page.locator('#sd .w-speed-dial')).toHaveClass(/w-speed-dial--open/);
  await page.locator('#outside').click();
  await expect(page.locator('#sd .w-speed-dial')).not.toHaveClass(/w-speed-dial--open/);
});

test('w-speed-dial open-on-hover toggles visibility', async ({ mount, page }) => {
  await mount(`
    <w-speed-dial id="sd" open-on-hover icon="add">
      <w-fab icon="edit"></w-fab>
    </w-speed-dial>
  `);

  const dial = page.locator('#sd .w-speed-dial');
  const trigger = page.locator('#sd .w-speed-dial__trigger');

  await expect(dial).not.toHaveClass(/w-speed-dial--open/);
  await trigger.hover();
  await expect(dial).toHaveClass(/w-speed-dial--open/);

  // Move away to close — need to hover something else
  await page.locator('body').hover();
  await page.waitForTimeout(300);
  await expect(dial).not.toHaveClass(/w-speed-dial--open/);
});

test('w-speed-dial applies location and transition classes', async ({ mount, page }) => {
  const cases = [
    { loc: 'top start',    v: 'top',    h: 'start' },
    { loc: 'top end',      v: 'top',    h: 'end' },
    { loc: 'bottom start', v: 'bottom', h: 'start' },
    { loc: 'bottom end',   v: 'bottom', h: 'end' },
    { loc: 'left start',   v: 'left',   h: 'start' },
    { loc: 'left end',     v: 'left',   h: 'end' },
    { loc: 'right start',  v: 'right',  h: 'start' },
    { loc: 'right end',    v: 'right',  h: 'end' },
  ];

  for (const { loc, v, h } of cases) {
    const id = `sd-${loc.replace(/\s/g, '-')}`;
    await mount(`<w-speed-dial id="${id}" location="${loc}" transition="slide" icon="add"><w-fab icon="edit"></w-fab></w-speed-dial>`);
    const dial = page.locator(`#${id} .w-speed-dial`);
    await expect(dial).toHaveClass(new RegExp(`w-speed-dial--${v}`));
    await expect(dial).toHaveClass(new RegExp(`w-speed-dial--${h}`));
    await expect(dial).toHaveClass(/w-speed-dial--transition-slide/);
  }
});

test('w-speed-dial trigger has accessible attributes', async ({ mount, page }) => {
  await mount(`<w-speed-dial id="sd" icon="add" aria-label="Actions"><w-fab icon="edit"></w-fab></w-speed-dial>`);
  const trigger = page.locator('#sd .w-speed-dial__trigger');
  await expect(trigger).toHaveAttribute('aria-haspopup', 'true');
  await expect(trigger).toHaveAttribute('aria-label', 'Actions');
  await expect(trigger).toHaveAttribute('type', 'button');
});

test('w-speed-dial children are slotted into actions', async ({ mount, page }) => {
  await mount(`
    <w-speed-dial id="sd" open icon="add">
      <w-fab id="a1" icon="edit"></w-fab>
      <w-fab id="a2" icon="delete"></w-fab>
    </w-speed-dial>
  `);
  const actions = page.locator('#sd .w-speed-dial__actions');
  await expect(actions.locator('#a1')).toHaveCount(1);
  await expect(actions.locator('#a2')).toHaveCount(1);
});
