import { expect, test } from '../setup/component-test.js';

// window.WMotion is the public motion runtime shipped as duvay-motion.js. Every
// exported helper plus the document-level [w-*] click delegation is exercised
// here; the visual result is CSS, so the assertions target the DOM side effects
// each helper is contracted to produce.

test('enter, leave, and toggle drive hidden state and aria-hidden', async ({ page, mount }) => {
  await mount('<div id="panel" hidden>Panel</div>');

  const afterEnter = await page.evaluate(async () => {
    const el = document.querySelector('#panel');
    await window.WMotion.enter(el, 'fade', { duration: 0 });
    return { hidden: el.hidden, className: el.className };
  });
  expect(afterEnter.hidden).toBe(false);
  expect(afterEnter.className).not.toContain('w-transition-hidden');

  const afterLeave = await page.evaluate(async () => {
    const el = document.querySelector('#panel');
    await window.WMotion.leave(el, 'slide-y', { duration: 0 });
    return { hidden: el.hidden, className: el.className };
  });
  expect(afterLeave.hidden).toBe(true);
  expect(afterLeave.className).toContain('w-transition-hidden');

  const kept = await page.evaluate(async () => {
    const el = document.querySelector('#panel');
    await window.WMotion.enter(el, 'scale', { duration: 0 });
    await window.WMotion.leave(el, 'scale', { duration: 0, hide: false });
    return el.hidden;
  });
  expect(kept).toBe(false);

  const toggled = await page.evaluate(async () => {
    const el = document.querySelector('#panel');
    el.hidden = true;
    await window.WMotion.toggle(el, null, 'fade', { duration: 0 });
    const opened = el.getAttribute('aria-hidden');
    await window.WMotion.toggle(el, false, 'fade', { duration: 0 });
    return { opened, closed: el.getAttribute('aria-hidden') };
  });
  expect(toggled).toEqual({ opened: 'false', closed: 'true' });
});

test('enter and leave run a real transition when a duration is set', async ({ page, mount }) => {
  await mount('<div id="panel" w-transition="slide-x" w-transition-duration="30" hidden>Panel</div>');

  const result = await page.evaluate(async () => {
    const el = document.querySelector('#panel');
    const entering = window.WMotion.enter(el);
    const midClass = el.className;
    await entering;
    await window.WMotion.leave(el);
    return { midClass, endClass: el.className, hidden: el.hidden };
  });

  expect(result.midClass).toContain('w-slide-x-transition');
  expect(result.endClass).not.toContain('w-enter-active');
  expect(result.hidden).toBe(true);
});

test('setExpand animates a body and falls back to an open class without one', async ({ page, mount }) => {
  await mount(`
    <div id="withBody" class="w-expand">
      <button class="w-expand-header">Header</button>
      <div class="w-expand-body">Body content</div>
    </div>
    <div id="withoutBody">Plain</div>
  `);

  const instant = await page.evaluate(async () => {
    const panel = document.querySelector('#withBody');
    await window.WMotion.setExpand(panel, true, { duration: 0 });
    return {
      open: panel.classList.contains('open'),
      expanded: panel.querySelector('.w-expand-header').getAttribute('aria-expanded'),
      height: panel.querySelector('.w-expand-body').style.height,
    };
  });
  expect(instant).toEqual({ open: true, expanded: 'true', height: '' });

  const animated = await page.evaluate(async () => {
    const panel = document.querySelector('#withBody');
    await window.WMotion.setExpand(panel, null, { duration: 30 });
    const body = panel.querySelector('.w-expand-body');
    return { open: panel.classList.contains('open'), height: body.style.height, overflow: body.style.overflow };
  });
  expect(animated).toEqual({ open: false, height: '', overflow: '' });

  const reopened = await page.evaluate(async () => {
    const panel = document.querySelector('#withBody');
    await window.WMotion.setExpand(panel, true, { duration: 30 });
    return panel.classList.contains('open');
  });
  expect(reopened).toBe(true);

  const fallback = await page.evaluate(async () => {
    const panel = document.querySelector('#withoutBody');
    await window.WMotion.setExpand(panel, true);
    return panel.classList.contains('open');
  });
  expect(fallback).toBe(true);

  expect(await page.evaluate(() => window.WMotion.setExpand(null).then(() => 'resolved'))).toBe('resolved');
});

test('flip and watchFlip animate reordered children', async ({ page, mount }) => {
  await mount(`
    <ul id="list" w-flip w-flip-items="li" w-flip-duration="30" style="display:flex;flex-direction:column">
      <li id="a">A</li><li id="b">B</li><li id="c">C</li>
    </ul>
  `);

  const order = await page.evaluate(async () => {
    const list = document.querySelector('#list');
    await window.WMotion.flip(list, () => {
      list.append(...Array.from(list.children).reverse());
    });
    return Array.from(list.children).map((el) => el.id);
  });
  expect(order).toEqual(['c', 'b', 'a']);

  const watched = await page.evaluate(async () => {
    const list = document.querySelector('#list');
    window.WMotion.watchFlip(list);
    const extra = document.createElement('li');
    extra.id = 'd';
    list.appendChild(extra);
    await new Promise((resolve) => setTimeout(resolve, 120));
    return Array.from(list.children).map((el) => el.id);
  });
  expect(watched).toEqual(['c', 'b', 'a', 'd']);

  expect(await page.evaluate(() => window.WMotion.flip(null).then(() => 'resolved'))).toBe('resolved');
});

test('crossfade clones the source and cleans the clone up', async ({ page, mount }) => {
  await mount('<div id="from" style="width:40px;height:20px">From</div><div id="to" style="width:80px;height:40px">To</div>');

  const clones = await page.evaluate(async () => {
    const from = document.querySelector('#from');
    const to = document.querySelector('#to');
    const running = window.WMotion.crossfade(from, to, { duration: 30 });
    const during = document.querySelectorAll('.w-motion-crossfade-clone').length;
    await running;
    return { during, after: document.querySelectorAll('.w-motion-crossfade-clone').length };
  });
  expect(clones.during).toBe(1);
  expect(clones.after).toBe(0);

  await page.evaluate(() => window.WMotion.crossfade(document.querySelector('#from'), document.querySelector('#to'), { duration: 0 }));
  expect(await page.evaluate(() => document.querySelectorAll('.w-motion-crossfade-clone').length)).toBe(0);
  expect(await page.evaluate(() => window.WMotion.crossfade(null, null).then(() => 'resolved'))).toBe('resolved');
});

test('tween writes every supported property and number format', async ({ page, mount }) => {
  await mount('<div id="t">0</div>');

  const results = await page.evaluate(async () => {
    const el = document.querySelector('#t');
    const run = (options) => window.WMotion.tween(el, Object.assign({ from: 0, to: 10, duration: 0 }, options));
    const out = {};

    await run({ property: 'text', format: 'integer', prefix: '$', suffix: '+' });
    out.text = el.textContent;
    await run({ property: 'text', format: 'fixed-2' });
    out.fixed2 = el.textContent;
    await run({ property: 'text', format: 'fixed-1' });
    out.fixed1 = el.textContent;
    await run({ property: 'text', format: 'raw' });
    out.raw = el.textContent;

    await run({ property: 'width' });
    out.width = el.style.width;
    await run({ property: 'height' });
    out.height = el.style.height;
    await run({ property: 'opacity' });
    out.opacity = el.style.opacity;
    await run({ property: 'scale' });
    out.scale = el.style.transform;
    await run({ property: 'translateX' });
    out.translateX = el.style.transform;
    await run({ property: 'translateY', unit: 'em' });
    out.translateY = el.style.transform;
    await run({ property: 'css:--w-demo', unit: 'px' });
    out.custom = el.style.getPropertyValue('--w-demo');
    await run({ property: 'attr:data-count' });
    out.attr = el.getAttribute('data-count');

    await run({ from: NaN, to: 5 });
    out.nonFinite = el.textContent;
    return out;
  });

  expect(results).toEqual({
    text: '$10+',
    fixed2: '10.00',
    fixed1: '10.0',
    raw: '10',
    width: '10%',
    height: '10px',
    opacity: '10',
    scale: 'scale(10)',
    translateX: 'translateX(10px)',
    translateY: 'translateY(10em)',
    custom: '10px',
    attr: '10',
    nonFinite: '5',
  });

  const animated = await page.evaluate(async () => {
    const el = document.querySelector('#t');
    await window.WMotion.tween(el, { from: 0, to: 25, duration: 40, property: 'text' });
    return el.textContent;
  });
  expect(animated).toBe('25');

  expect(await page.evaluate(() => window.WMotion.tween(null).then(() => 'resolved'))).toBe('resolved');
});

test('tween reads its configuration from w-tween-* attributes', async ({ page, mount }) => {
  await mount('<div id="t" w-tween-from="0" w-tween-to="42" w-tween-duration="0" w-tween-property="text" w-tween-format="fixed-1" w-tween-prefix="~" w-tween-suffix="k">0</div>');
  await page.evaluate(() => window.WMotion.tween(document.querySelector('#t')));
  await expect(page.locator('#t')).toHaveText('~42.0k');
});

test('spring settles on its target value', async ({ page, mount }) => {
  await mount('<div id="s">Spring</div>');

  const settled = await page.evaluate(async () => {
    const el = document.querySelector('#s');
    await window.WMotion.spring(el, { from: 0, to: 1, property: 'scale' });
    return el.style.transform;
  });
  expect(settled).toBe('scale(1)');

  const nonFinite = await page.evaluate(async () => {
    const el = document.querySelector('#s');
    await window.WMotion.spring(el, { from: NaN, to: 2, property: 'opacity' });
    return el.style.opacity;
  });
  expect(nonFinite).toBe('2');

  expect(await page.evaluate(() => window.WMotion.spring(null).then(() => 'resolved'))).toBe('resolved');
});

test('spring reads its configuration from w-spring-* attributes', async ({ page, mount }) => {
  await mount('<div id="s" w-spring-from="0" w-spring-to="0.5" w-spring-property="opacity" w-spring-stiffness="0.3" w-spring-damping="0.6">Spring</div>');
  await page.evaluate(() => window.WMotion.spring(document.querySelector('#s')));
  await expect(page.locator('#s')).toHaveCSS('opacity', '0.5');
});

test('init auto-runs tween and spring targets once', async ({ page, mount }) => {
  await mount(`
    <div id="auto" w-tween w-tween-from="0" w-tween-to="7" w-tween-duration="0">0</div>
    <div id="manual" w-tween w-tween-auto="false" w-tween-from="0" w-tween-to="9" w-tween-duration="0">0</div>
    <div id="autoSpring" w-spring w-spring-from="0" w-spring-to="1" w-spring-property="opacity"></div>
    <div id="flipped" w-flip><span>x</span></div>
  `);

  await page.evaluate(async () => {
    window.WMotion.init(document);
    window.WMotion.init();
    await new Promise((resolve) => setTimeout(resolve, 150));
  });

  await expect(page.locator('#auto')).toHaveText('7');
  await expect(page.locator('#manual')).toHaveText('0');
  expect(await page.locator('#auto').getAttribute('w-tween-ready')).toBe('1');
  expect(await page.locator('#autoSpring').getAttribute('w-spring-ready')).toBe('1');
});

test('click delegation drives transition, flip, crossfade, tween, and spring triggers', async ({ page, mount }) => {
  await mount(`
    <button id="toggleBtn" w-transition-toggle="target" w-transition-name="fade">Toggle</button>
    <div id="target" hidden>Target</div>

    <button id="reverseBtn" w-flip-reorder="flipList">Reverse</button>
    <button id="rotateBtn" w-flip-reorder="flipList" w-flip-mode="rotate">Rotate</button>
    <ul id="flipList" w-flip-items="li" w-flip-duration="0"><li id="i1">1</li><li id="i2">2</li><li id="i3">3</li></ul>

    <button id="crossBtn" w-crossfade="one two" w-crossfade-toggle>Cross</button>
    <div w-crossfade-key="one" style="width:20px;height:10px">One</div>
    <div w-crossfade-key="two" hidden style="width:20px;height:10px">Two</div>

    <button id="tweenBtn" w-tween-start="tweenTarget">Tween</button>
    <div id="tweenTarget" w-tween-from="0" w-tween-to="5" w-tween-duration="0">0</div>

    <button id="springBtn" w-spring-start="springTarget">Spring</button>
    <div id="springTarget" w-spring-from="0" w-spring-to="1" w-spring-property="opacity"></div>

    <button id="missingBtn" w-transition-toggle="nope">Missing</button>
  `);

  await page.click('#toggleBtn');
  await expect(page.locator('#target')).toHaveAttribute('aria-hidden', 'false');

  await page.click('#reverseBtn');
  await page.waitForTimeout(80);
  expect(await page.locator('#flipList li').evaluateAll((items) => items.map((el) => el.id))).toEqual(['i3', 'i2', 'i1']);

  await page.click('#rotateBtn');
  await page.waitForTimeout(80);
  expect(await page.locator('#flipList li').evaluateAll((items) => items.map((el) => el.id))).toEqual(['i2', 'i1', 'i3']);

  await page.click('#crossBtn');
  await page.waitForTimeout(400);
  await expect(page.locator('[w-crossfade-key="two"]')).not.toHaveAttribute('hidden', '');

  await page.click('#tweenBtn');
  await expect(page.locator('#tweenTarget')).toHaveText('5');

  await page.click('#springBtn');
  await page.waitForTimeout(400);
  await expect(page.locator('#springTarget')).toHaveCSS('opacity', '1');

  // A trigger pointing at nothing must not throw.
  await page.click('#missingBtn');
});
