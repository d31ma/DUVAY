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

const ACTIONS = '<w-fab id="a1" icon="edit"></w-fab><w-fab id="a2" icon="delete"></w-fab>';

test('w-speed-dial opens with the arrow keys, and submenu swaps them for left/right', async ({ mount, page }) => {
  await mount(`<w-speed-dial id="sd" icon="add">${ACTIONS}</w-speed-dial>`);
  const dial = page.locator('#sd .w-speed-dial');
  const trigger = page.locator('#sd .w-speed-dial__trigger');

  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  await expect(dial).toHaveClass(/w-speed-dial--open/);
  await page.locator('#sd .w-speed-dial__trigger').press('ArrowUp');
  await expect(page.locator('#sd .w-speed-dial')).not.toHaveClass(/w-speed-dial--open/);

  await mount(`<w-speed-dial id="sub" icon="add" submenu>${ACTIONS}</w-speed-dial>`);
  const submenu = page.locator('#sub .w-speed-dial');
  // submenu implies an "end" anchor rather than the default top/center.
  await expect(submenu).toHaveClass(/w-speed-dial--submenu/);
  await expect(submenu).toHaveClass(/w-speed-dial--right/);

  await page.locator('#sub .w-speed-dial__trigger').press('ArrowRight');
  await expect(page.locator('#sub .w-speed-dial')).toHaveClass(/w-speed-dial--open/);
  await page.locator('#sub .w-speed-dial__trigger').press('ArrowLeft');
  await expect(page.locator('#sub .w-speed-dial')).not.toHaveClass(/w-speed-dial--open/);
});

test('w-speed-dial open-on-click can be turned off and open-on-focus turned on', async ({ mount, page }) => {
  await mount(`<w-speed-dial id="sd" icon="add" open-on-click="false" open-on-focus>${ACTIONS}</w-speed-dial>`);
  const dial = page.locator('#sd .w-speed-dial');

  await page.locator('#sd .w-speed-dial__trigger').click();
  await page.waitForTimeout(50);
  await expect(dial).not.toHaveClass(/w-speed-dial--open/);

  await page.locator('#sd .w-speed-dial__trigger').evaluate((element) => element.blur());
  await page.locator('#sd .w-speed-dial__trigger').focus();
  await expect(page.locator('#sd .w-speed-dial')).toHaveClass(/w-speed-dial--open/);
});

test('w-speed-dial open-delay and close-delay time the hover transitions', async ({ mount, page }) => {
  await mount(`<w-speed-dial id="sd" icon="add" open-on-hover open-delay="300" close-delay="500">${ACTIONS}</w-speed-dial>`);
  const dial = page.locator('#sd .w-speed-dial');

  await page.locator('#sd .w-speed-dial__trigger').hover();
  await page.waitForTimeout(100);
  await expect(dial).not.toHaveClass(/w-speed-dial--open/);
  await expect(dial).toHaveClass(/w-speed-dial--open/);

  await page.locator('body').hover();
  await page.waitForTimeout(150);
  await expect(page.locator('#sd .w-speed-dial')).toHaveClass(/w-speed-dial--open/);
  await expect(page.locator('#sd .w-speed-dial')).not.toHaveClass(/w-speed-dial--open/);
});

test('w-speed-dial close-on-content-click dismisses when an action is clicked', async ({ mount, page }) => {
  await mount(`<w-speed-dial id="sd" open icon="add" close-on-content-click>${ACTIONS}</w-speed-dial>`);
  await page.locator('#a1 button').click();
  await expect(page.locator('#sd .w-speed-dial')).not.toHaveClass(/w-speed-dial--open/);

  await mount(`<w-speed-dial id="keep" open icon="add">${ACTIONS}</w-speed-dial>`);
  await page.locator('#a1 button').click();
  await expect(page.locator('#keep .w-speed-dial')).toHaveClass(/w-speed-dial--open/);
});

test('w-speed-dial persistent refuses outside clicks and Escape, bouncing unless suppressed', async ({ mount, page }) => {
  await mount(`
    <w-speed-dial id="sd" open icon="add" persistent>${ACTIONS}</w-speed-dial>
    <button id="outside">Outside</button>
  `);

  // Dispatched synchronously so the short-lived bounce class can be observed.
  const bounced = await page.evaluate(() => {
    document.querySelector('#outside').click();
    return document.querySelector('#sd .w-speed-dial__actions').className;
  });
  expect(bounced).toContain('w-speed-dial__actions--bounce');
  await expect(page.locator('#sd .w-speed-dial')).toHaveClass(/w-speed-dial--open/);

  await page.keyboard.press('Escape');
  await expect(page.locator('#sd .w-speed-dial')).toHaveClass(/w-speed-dial--open/);

  await mount(`
    <w-speed-dial id="quiet" open icon="add" persistent no-click-animation>${ACTIONS}</w-speed-dial>
    <button id="away">Outside</button>
  `);
  const quiet = await page.evaluate(() => {
    document.querySelector('#away').click();
    return document.querySelector('#quiet .w-speed-dial__actions').className;
  });
  expect(quiet).not.toContain('bounce');
  await expect(page.locator('#quiet .w-speed-dial')).toHaveClass(/w-speed-dial--open/);
});

test('w-speed-dial scrim, opacity and z-index paint a backdrop only when asked', async ({ mount, page }) => {
  await mount(`<w-speed-dial id="plain" open icon="add">${ACTIONS}</w-speed-dial>`);
  await expect(page.locator('#plain .w-speed-dial__scrim')).toHaveCount(0);

  await mount(`<w-speed-dial id="sd" open icon="add" scrim="primary" opacity="60%" z-index="99">${ACTIONS}</w-speed-dial>`);
  const root = page.locator('#sd .w-speed-dial');
  await expect(root).toHaveClass(/w-speed-dial--scrim/);
  await expect(root).toHaveCSS('z-index', '99');
  await expect(page.locator('#sd .w-speed-dial__scrim')).toHaveCount(1);
  await expect(page.locator('#sd .w-speed-dial__scrim')).toHaveCSS('opacity', '1');

  const painted = await root.evaluate((el) => ({
    scrim: el.style.getPropertyValue('--w-speed-dial-scrim'),
    opacity: el.style.getPropertyValue('--w-speed-dial-opacity'),
  }));
  expect(painted.scrim).toContain('--w-primary');
  expect(painted.opacity).toBe('60%');

  await mount(`<w-speed-dial id="off" open icon="add" scrim="false">${ACTIONS}</w-speed-dial>`);
  await expect(page.locator('#off .w-speed-dial__scrim')).toHaveCount(0);
});

test('w-speed-dial contained clips to the offset parent and content-class reaches the actions', async ({ mount, page }) => {
  await mount(`
    <div style="position: relative; height: 200px">
      <w-speed-dial id="sd" open icon="add" contained content-class="my-actions extra">${ACTIONS}</w-speed-dial>
    </div>
  `);

  await expect(page.locator('#sd .w-speed-dial')).toHaveClass(/w-speed-dial--contained/);
  await expect(page.locator('#sd .w-speed-dial')).toHaveCSS('position', 'absolute');
  await expect(page.locator('#sd .w-speed-dial__actions')).toHaveClass(/my-actions/);
  await expect(page.locator('#sd .w-speed-dial__actions')).toHaveClass(/extra/);
});

test('w-speed-dial target and origin pin the actions to another element', async ({ mount, page }) => {
  await mount(`
    <div style="position: relative; height: 320px">
      <div id="anchor" style="position: absolute; left: 100px; top: 120px; width: 40px; height: 40px"></div>
      <w-speed-dial id="sd" open icon="add" target="#anchor" origin="bottom">${ACTIONS}</w-speed-dial>
    </div>
  `);

  await expect(page.locator('#sd .w-speed-dial')).toHaveClass(/w-speed-dial--connected/);
  await expect(page.locator('#sd .w-speed-dial__actions')).toHaveCSS('position', 'fixed');

  const placement = await page.evaluate(() => {
    const anchor = document.querySelector('#anchor').getBoundingClientRect();
    const actions = document.querySelector('#sd .w-speed-dial__actions').getBoundingClientRect();
    return { dx: actions.left - anchor.left, dy: actions.top - anchor.top };
  });
  // origin "bottom" is the bottom-centre of the target box.
  expect(placement.dx).toBeCloseTo(20, 0);
  expect(placement.dy).toBeCloseTo(40, 0);
});

test('w-speed-dial viewport-margin clamps the actions unless stick-to-target opts out', async ({ mount, page }) => {
  await mount(`<w-speed-dial id="sd" open icon="add" target="99999,99999" viewport-margin="20">${ACTIONS}</w-speed-dial>`);
  const clamped = await page.evaluate(() => ({
    left: document.querySelector('#sd .w-speed-dial__actions').style.left,
    limit: `${window.innerWidth - 20}px`,
  }));
  expect(clamped.left).toBe(clamped.limit);

  await mount(`<w-speed-dial id="stuck" open icon="add" target="99999,99999" stick-to-target>${ACTIONS}</w-speed-dial>`);
  await expect(page.locator('#stuck .w-speed-dial')).toHaveClass(/w-speed-dial--stuck/);
  expect(await page.locator('#stuck .w-speed-dial__actions').evaluate((el) => el.style.left)).toBe('99999px');
});

test('w-speed-dial offset widens the gap and origin sets the transform origin', async ({ mount, page }) => {
  await mount(`<w-speed-dial id="sd" open icon="add" offset="24">${ACTIONS}</w-speed-dial>`);
  // Default location is "top center", so the gap is the bottom margin.
  await expect(page.locator('#sd .w-speed-dial__actions')).toHaveCSS('margin-bottom', '32px');

  await mount(`<w-speed-dial id="plain" open icon="add">${ACTIONS}</w-speed-dial>`);
  await expect(page.locator('#plain .w-speed-dial__actions')).toHaveCSS('margin-bottom', '8px');

  await mount(`<w-speed-dial id="origin" open icon="add" origin="top">${ACTIONS}</w-speed-dial>`);
  expect(await page.locator('#origin .w-speed-dial__actions').evaluate((el) => el.style.transformOrigin)).toBe('50% 0%');
});

test('w-speed-dial keeps Tab inside the actions unless focus capture is disabled', async ({ mount, page }) => {
  const focused = () => page.evaluate(() => (
    document.activeElement?.closest('w-fab')?.id || document.activeElement?.id
  ));

  await mount(`<w-speed-dial id="sd" open icon="add">${ACTIONS}</w-speed-dial><button id="after">After</button>`);
  await page.locator('#a2 button').focus();
  await page.keyboard.press('Tab');
  expect(await focused()).toBe('a1');

  await mount(`<w-speed-dial id="free" open icon="add" capture-focus="false">${ACTIONS}</w-speed-dial><button id="after">After</button>`);
  await page.locator('#a2 button').focus();
  await page.keyboard.press('Tab');
  expect(await focused()).toBe('after');

  await mount(`<w-speed-dial id="legacy" open icon="add" disable-initial-focus>${ACTIONS}</w-speed-dial><button id="after">After</button>`);
  await page.locator('#a2 button').focus();
  await page.keyboard.press('Tab');
  expect(await focused()).toBe('after');
});

test('w-speed-dial close-on-back dismisses on the browser back button', async ({ mount, page }) => {
  await mount(`<w-speed-dial id="sd" icon="add" close-on-back>${ACTIONS}</w-speed-dial>`);

  await page.locator('#sd .w-speed-dial__trigger').click();
  await expect(page.locator('#sd .w-speed-dial')).toHaveClass(/w-speed-dial--open/);

  await page.evaluate(() => history.back());
  await expect(page.locator('#sd .w-speed-dial')).not.toHaveClass(/w-speed-dial--open/);
});

test('w-speed-dial transition="none" opts out of the actions animation', async ({ mount, page }) => {
  await mount(`<w-speed-dial id="sd" open icon="add" transition="none">${ACTIONS}</w-speed-dial>`);
  await expect(page.locator('#sd .w-speed-dial')).toHaveClass(/w-speed-dial--no-transition/);
  await expect(page.locator('#sd .w-speed-dial__actions')).toHaveCSS('transition-duration', '0s');
});
