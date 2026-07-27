import { expect, test } from '../setup/component-test.js';

// The <w-*-transition> wrappers all share one implementation (WTransition in
// src/components/base-transition.js): a display:contents element around a
// <slot>, driving window.WMotion for the slotted children. Every assertion
// here targets what an author can see — the classes on the wrapper, and the
// state each phase leaves the children in.

const TAGS = [
  'w-fade-transition',
  'w-scale-transition',
  'w-slide-x-transition',
  'w-slide-x-reverse-transition',
  'w-slide-y-transition',
  'w-slide-y-reverse-transition',
  'w-scroll-x-transition',
  'w-scroll-x-reverse-transition',
  'w-scroll-y-transition',
  'w-scroll-y-reverse-transition',
  'w-dialog-transition',
  'w-dialog-bottom-transition',
  'w-dialog-top-transition',
  'w-fab-transition',
  'w-expand-transition',
  'w-expand-x-transition',
  'w-expand-both-transition',
];

test('every wrapper renders its own transition class around the slotted content', async ({ page, mount }) => {
  await mount(TAGS.map((tag) => `<${tag}><i>${tag}</i></${tag}>`).join(''));

  const rendered = await page.evaluate((tags) => tags.map((tag) => {
    const host = document.querySelector(tag);
    return { className: host.firstElementChild.className, slotted: host.querySelector('slot > i').textContent };
  }), TAGS);

  rendered.forEach((entry, index) => {
    const tag = TAGS[index];
    // w-dialog-transition is the one wrapper that owns its own box.
    expect(entry.className).toBe(tag === 'w-dialog-transition' ? tag : `${tag} w-transition-wrapper`);
    expect(entry.slotted).toBe(tag);
  });
});

test('group transitions every child, and without it only the first', async ({ page, mount }) => {
  await mount(`
    <w-fade-transition id="single" duration="0"><i>a</i><i>b</i><i>c</i></w-fade-transition>
    <w-fade-transition id="grouped" group duration="0"><i>a</i><i>b</i><i>c</i></w-fade-transition>
  `);

  const result = await page.evaluate(async () => {
    const hidden = (id) => [...document.querySelectorAll(`${id} i`)].map((el) => el.hidden);
    await document.querySelector('#single').leave();
    await document.querySelector('#grouped').leave();
    return {
      single: hidden('#single'),
      grouped: hidden('#grouped'),
      singleClass: document.querySelector('#single').firstElementChild.className,
      groupedClass: document.querySelector('#grouped').firstElementChild.className,
    };
  });

  expect(result.single).toEqual([true, false, false]);
  expect(result.grouped).toEqual([true, true, true]);
  expect(result.singleClass).not.toContain('w-transition-group');
  expect(result.groupedClass).toContain('w-transition-group');
});

test('hide-on-leave hides the leaving child instead of animating it out', async ({ page, mount }) => {
  await mount(`
    <w-fade-transition id="animated" duration="60"><i>a</i></w-fade-transition>
    <w-fade-transition id="instant" hide-on-leave duration="60"><i>a</i></w-fade-transition>
  `);

  const result = await page.evaluate(async () => {
    const child = (id) => document.querySelector(`${id} i`);
    const running = [document.querySelector('#animated').leave(), document.querySelector('#instant').leave()];
    const during = {
      animated: { hidden: child('#animated').hidden, className: child('#animated').className },
      instant: { hidden: child('#instant').hidden, className: child('#instant').className },
    };
    await Promise.all(running);
    return { during, animated: child('#animated').hidden, instant: child('#instant').hidden };
  });

  expect(result.during.instant.hidden).toBe(true);
  expect(result.during.instant.className).toContain('w-transition-hidden');
  expect(result.during.instant.className).not.toContain('w-leave-active');
  expect(result.during.animated.hidden).toBe(false);
  expect(result.during.animated.className).toContain('w-leave-active');
  expect(result.animated).toBe(true);
  expect(result.instant).toBe(true);
});

test('leave-absolute takes the leaving child out of flow for the leave only', async ({ page, mount }) => {
  await mount('<w-slide-y-transition id="t" leave-absolute duration="60"><i id="child">a</i></w-slide-y-transition>');

  const result = await page.evaluate(async () => {
    const child = document.querySelector('#child');
    const leaving = document.querySelector('#t').leave();
    const during = { position: getComputedStyle(child).position, className: child.className };
    await leaving;
    return { during, position: getComputedStyle(child).position, className: child.className };
  });

  expect(result.during.position).toBe('absolute');
  expect(result.during.className).toContain('w-leave-absolute');
  expect(result.position).toBe('static');
  expect(result.className).not.toContain('w-leave-absolute');
});

test('mode orders the leave and enter phases of a swap', async ({ page, mount }) => {
  const children = '<i class="from">a</i><i class="to" hidden>b</i>';
  await mount(`
    <w-fade-transition id="together" duration="0">${children}</w-fade-transition>
    <w-fade-transition id="outIn" mode="out-in" duration="0">${children}</w-fade-transition>
    <w-fade-transition id="inOut" mode="in-out" duration="0">${children}</w-fade-transition>
  `);

  const result = await page.evaluate(async () => {
    const sample = async (id) => {
      const host = document.querySelector(id);
      const from = host.querySelector('.from');
      const to = host.querySelector('.to');
      const running = host.swap(to);
      const during = { from: from.hidden, to: to.hidden };
      await running;
      return { during, after: { from: from.hidden, to: to.hidden } };
    };
    return {
      together: await sample('#together'),
      outIn: await sample('#outIn'),
      inOut: await sample('#inOut'),
    };
  });

  // Default: both phases start together.
  expect(result.together.during).toEqual({ from: true, to: false });
  // out-in: the old child leaves first, the new one has not entered yet.
  expect(result.outIn.during).toEqual({ from: true, to: true });
  // in-out: the new child enters first, the old one is still in place.
  expect(result.inOut.during).toEqual({ from: false, to: false });
  // Whatever the ordering, every mode ends in the same state.
  ['together', 'outIn', 'inOut'].forEach((key) => {
    expect(result[key].after, key).toEqual({ from: true, to: false });
  });
});

test('swap accepts an explicit outgoing child and enters alone when there is none', async ({ page, mount }) => {
  await mount(`
    <w-fade-transition id="pair" duration="0"><i class="from">a</i><i class="to" hidden>b</i></w-fade-transition>
    <w-fade-transition id="lone" duration="0"><i class="to" hidden>b</i></w-fade-transition>
  `);

  const result = await page.evaluate(async () => {
    const pair = document.querySelector('#pair');
    await pair.swap(pair.querySelector('.to'), pair.querySelector('.from'));
    const lone = document.querySelector('#lone');
    await lone.swap(lone.querySelector('.to'));
    return {
      from: pair.querySelector('.from').hidden,
      to: pair.querySelector('.to').hidden,
      lone: lone.querySelector('.to').hidden,
    };
  });

  expect(result).toEqual({ from: true, to: false, lone: false });
});

test('origin sets the transform-origin of the children and is cleared with the attribute', async ({ page, mount }) => {
  await mount('<w-scale-transition id="t" origin="top left"><i id="child">a</i></w-scale-transition>');

  await expect(page.locator('#child')).toHaveCSS('transform-origin', '0px 0px');

  const changed = await page.evaluate(() => {
    document.querySelector('#t').setAttribute('origin', 'bottom right');
    return document.querySelector('#child').style.transformOrigin;
  });
  // The CSSOM normalises keyword pairs to horizontal-then-vertical order.
  expect(changed).toBe('right bottom');

  const cleared = await page.evaluate(() => {
    document.querySelector('#t').removeAttribute('origin');
    return document.querySelector('#child').style.transformOrigin;
  });
  expect(cleared).toBe('');
});

test('origin is applied to a child passed straight to a phase', async ({ page, mount }) => {
  await mount('<w-scale-transition id="t" origin="top right" duration="0"><i id="child" hidden>a</i></w-scale-transition>');

  const applied = await page.evaluate(async () => {
    const child = document.querySelector('#child');
    child.style.transformOrigin = '';
    await document.querySelector('#t').enter(child);
    return { origin: child.style.transformOrigin, hidden: child.hidden };
  });

  expect(applied).toEqual({ origin: 'right top', hidden: false });
});

test('target anchors the origin on an element or on an x,y point', async ({ page, mount }) => {
  await mount(`
    <div id="anchor" style="position: absolute; left: 200px; top: 120px; width: 40px; height: 20px;">anchor</div>
    <w-dialog-transition id="byId" target="anchor"><i id="a">a</i></w-dialog-transition>
    <w-dialog-transition id="byPoint" target="0,0"><i id="b">b</i></w-dialog-transition>
    <w-dialog-transition id="unknown" target="#nope"><i id="c">c</i></w-dialog-transition>
    <w-dialog-transition id="invalid" target="!!!"><i id="d">d</i></w-dialog-transition>
    <w-dialog-transition id="both" origin="center" target="anchor"><i id="e">e</i></w-dialog-transition>
  `);

  const result = await page.evaluate(() => {
    const host = document.querySelector('#byId').getBoundingClientRect();
    const anchor = document.querySelector('#anchor').getBoundingClientRect();
    const origin = (id) => document.querySelector(id).style.transformOrigin;
    return {
      byId: origin('#a'),
      expected: `${Math.round(anchor.left + anchor.width / 2 - host.left)}px `
        + `${Math.round(anchor.top + anchor.height / 2 - host.top)}px`,
      byPoint: origin('#b'),
      unknown: origin('#c'),
      invalid: origin('#d'),
      both: origin('#e'),
    };
  });

  expect(result.byId).toBe(result.expected);
  expect(result.byPoint).toMatch(/^-?\d+px -?\d+px$/);
  expect(result.unknown).toBe('');
  expect(result.invalid).toBe('');
  // An explicit origin wins over the target it would otherwise be derived from.
  expect(result.both).toBe('center center');
});

test('disabled skips the animation entirely on the expand transitions', async ({ page, mount }) => {
  await mount(`
    <w-expand-transition id="animated" duration="60"><i>a</i></w-expand-transition>
    <w-expand-x-transition id="skipped" disabled duration="60"><i>a</i></w-expand-x-transition>
  `);

  const result = await page.evaluate(async () => {
    const child = (id) => document.querySelector(`${id} i`);
    const running = [document.querySelector('#animated').leave(), document.querySelector('#skipped').leave()];
    const during = {
      animated: { hidden: child('#animated').hidden, className: child('#animated').className },
      skipped: { hidden: child('#skipped').hidden, className: child('#skipped').className },
    };
    await Promise.all(running);
    return { during, animated: child('#animated').hidden, skipped: child('#skipped').hidden };
  });

  expect(result.during.skipped.hidden).toBe(true);
  expect(result.during.skipped.className).not.toContain('w-leave-active');
  expect(result.during.animated.hidden).toBe(false);
  expect(result.during.animated.className).toContain('w-leave-active');
  expect(result.animated).toBe(true);
  expect(result.skipped).toBe(true);
});

test('toggle opens hidden children, closes visible ones, and reflects aria-hidden', async ({ page, mount }) => {
  await mount('<w-fade-transition id="t" group duration="0"><i class="a" hidden>a</i><i class="b">b</i></w-fade-transition>');

  const result = await page.evaluate(async () => {
    const host = document.querySelector('#t');
    const a = host.querySelector('.a');
    const b = host.querySelector('.b');
    await host.toggle();
    const auto = {
      a: a.hidden,
      b: b.hidden,
      ariaA: a.getAttribute('aria-hidden'),
      ariaB: b.getAttribute('aria-hidden'),
    };
    await host.toggle(a, false);
    const forced = a.hidden;
    await host.enter(a);
    return { auto, forced, entered: a.hidden, items: host.items().length };
  });

  expect(result.auto).toEqual({ a: false, b: true, ariaA: 'false', ariaB: 'true' });
  expect(result.forced).toBe(true);
  expect(result.entered).toBe(false);
  expect(result.items).toBe(2);
});
