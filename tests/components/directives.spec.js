import { expect, test } from '../setup/component-test.js';

// Directive event details carry DOM nodes (entries, mutations, target) that can't
// cross the Playwright boundary, so record only the primitive fields we assert on.
async function listen(page, selector, eventName) {
  await page.evaluate(({ selector, eventName }) => {
    const el = document.querySelector(selector);
    el.__events = el.__events || {};
    el.__events[eventName] = [];
    el.addEventListener(eventName, (e) => {
      const d = e.detail || {};
      el.__events[eventName].push({
        isIntersecting: d.isIntersecting,
        direction: d.direction,
        scrollTop: d.scrollTop,
        width: d.width,
        height: d.height,
        offsetX: d.offsetX,
        offsetY: d.offsetY,
        mutations: d.mutations ? d.mutations.length : undefined,
      });
    });
  }, { selector, eventName });
}

async function events(page, selector, eventName) {
  return page.evaluate(({ selector, eventName }) => {
    const el = document.querySelector(selector);
    return (el.__events && el.__events[eventName]) || [];
  }, { selector, eventName });
}

// Give the document MutationObserver a tick to auto-wire freshly injected markup.
async function settle(page) {
  await page.waitForTimeout(50);
}

test('w-click-outside fires only for clicks outside the element', async ({ mount, page }) => {
  await mount('<div id="box" w-click-outside style="width:120px;height:80px">inside</div><button id="outside">outside</button>');
  await settle(page);
  await listen(page, '#box', 'w-click-outside');

  await page.locator('#box').click();
  expect((await events(page, '#box', 'w-click-outside')).length).toBe(0);

  await page.locator('#outside').click();
  expect((await events(page, '#box', 'w-click-outside')).length).toBe(1);
});

test('w-intersect emits on visibility change and reflects w-intersecting', async ({ mount, page }) => {
  await mount('<div style="height:1500px"></div><div id="target" w-intersect w-intersect-quiet>watch me</div>');
  await settle(page);
  await listen(page, '#target', 'w-intersect');

  await expect(page.locator('#target')).toHaveAttribute('w-intersecting', 'false');

  await page.locator('#target').scrollIntoViewIfNeeded();
  await expect(page.locator('#target')).toHaveAttribute('w-intersecting', 'true');

  await expect.poll(async () => (await events(page, '#target', 'w-intersect')).some((e) => e.isIntersecting === true)).toBe(true);
});

test('w-mutate emits when the subtree changes', async ({ mount, page }) => {
  await mount('<div id="m" w-mutate><span>one</span></div>');
  await settle(page);
  await listen(page, '#m', 'w-mutate');

  await page.locator('#m').evaluate((el) => {
    const span = document.createElement('span');
    span.textContent = 'two';
    el.appendChild(span);
  });

  await expect.poll(async () => (await events(page, '#m', 'w-mutate')).length).toBeGreaterThan(0);
  const rec = await events(page, '#m', 'w-mutate');
  expect(rec[0].mutations).toBeGreaterThan(0);
});

test('w-resize emits the new size when the element resizes', async ({ mount, page }) => {
  await mount('<div id="r" w-resize style="width:100px;height:40px">box</div>');
  await settle(page);
  await listen(page, '#r', 'w-resize');

  await page.locator('#r').evaluate((el) => { el.style.width = '400px'; });

  await expect.poll(async () => (await events(page, '#r', 'w-resize')).some((e) => Math.round(e.width) >= 380)).toBe(true);
});

test('w-ripple injects an ink span on pointer press', async ({ mount, page }) => {
  await mount('<button id="rip" w-ripple style="width:120px;height:48px">press</button>');
  await settle(page);
  await expect(page.locator('#rip')).toHaveClass(/w-ripple-host/);

  await page.locator('#rip').dispatchEvent('pointerdown');
  await expect(page.locator('#rip .w-ripple-ink')).toHaveCount(1);
});

test('w-scroll emits scroll position from a self target', async ({ mount, page }) => {
  await mount('<div id="sc" w-scroll w-scroll-self style="height:80px;overflow:auto"><div style="height:600px">tall</div></div>');
  await settle(page);
  await listen(page, '#sc', 'w-scroll');

  await page.locator('#sc').evaluate((el) => { el.scrollTop = 120; });

  await expect.poll(async () => (await events(page, '#sc', 'w-scroll')).some((e) => Math.round(e.scrollTop) === 120)).toBe(true);
});

test('w-touch emits w-swipe with a direction', async ({ mount, page }) => {
  await mount('<div id="tc" w-touch style="width:240px;height:80px">swipe</div>');
  await settle(page);
  await listen(page, '#tc', 'w-swipe');

  const box = await page.locator('#tc').boundingBox();
  const y = box.y + box.height / 2;
  await page.mouse.move(box.x + box.width - 10, y);
  await page.mouse.down();
  await page.mouse.move(box.x + 10, y, { steps: 4 });
  await page.mouse.up();

  await expect.poll(async () => (await events(page, '#tc', 'w-swipe')).map((e) => e.direction)).toContain('left');
});

test('w-tooltip reveals its label on hover (CSS-only)', async ({ mount, page }) => {
  await mount('<button class="w-tooltip" w-tooltip="Helpful detail" style="margin:60px">hover me</button>');
  await settle(page);

  const before = await page.locator('.w-tooltip').evaluate((el) => getComputedStyle(el, '::after').opacity);
  expect(Number(before)).toBeLessThan(1);

  await page.locator('.w-tooltip').hover();
  await expect.poll(async () => Number(await page.locator('.w-tooltip').evaluate((el) => getComputedStyle(el, '::after').opacity))).toBeGreaterThan(0);
});

test('w-btn opts into ripple via the ripple attribute', async ({ mount, page }) => {
  await mount('<w-btn id="r1" variant="filled" ripple>Ripple</w-btn><w-btn id="r2" variant="filled">No ripple</w-btn>');
  await settle(page);

  await page.locator('#r1 button').dispatchEvent('pointerdown');
  await expect(page.locator('#r1 .w-ripple-ink')).toHaveCount(1);

  await page.locator('#r2 button').dispatchEvent('pointerdown');
  await expect(page.locator('#r2 .w-ripple-ink')).toHaveCount(0);
});

test('directives tear down when their attribute is removed', async ({ mount, page }) => {
  await mount('<button id="rip" w-ripple>press</button>');
  await settle(page);
  await expect(page.locator('#rip')).toHaveClass(/w-ripple-host/);

  await page.locator('#rip').evaluate((el) => el.setAttribute('w-ripple', 'false'));
  await expect(page.locator('#rip')).not.toHaveClass(/w-ripple-host/);
});
