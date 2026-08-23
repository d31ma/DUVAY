import { expect, test } from '../setup/component-test.js';

// `wMaskValue` is part of the public helper surface exported from
// src/components/utils.js, but no shipped component consumes it yet, so there
// is no attribute to drive it through. Exercise it against the very same module
// instance the components load (same URL => same module record), and assert on
// the returned string, which is the helper's entire observable contract.
async function mask(page, value, pattern) {
  return page.evaluate(async ({ value: input, pattern: tokens }) => {
    const { wMaskValue } = await import('/src/components/utils.js');
    return wMaskValue(input, tokens);
  }, { value, pattern });
}

test('wNumberAttr preserves its fallback for absent and empty attributes', async ({ mount, page }) => {
  await mount('<div id="host"></div>');

  const values = await page.evaluate(async () => {
    const { wNumberAttr } = await import('/src/components/utils.js');
    const host = document.querySelector('#host');
    const absent = wNumberAttr(host, 'max', 59);
    host.setAttribute('max', '');
    const empty = wNumberAttr(host, 'max', 59);
    host.setAttribute('max', '12');
    const present = wNumberAttr(host, 'max', 59);
    return { absent, empty, present };
  });

  expect(values).toEqual({ absent: 59, empty: 59, present: 12 });
});

test('wMaskValue keeps the raw value when no mask is supplied', async ({ mount, page }) => {
  await mount('<div></div>');

  expect(await mask(page, '5551234', '')).toBe('5551234');
  expect(await mask(page, '5551234', null)).toBe('5551234');
  expect(await mask(page, '', '')).toBe('');
});

test('wMaskValue fills # tokens with digits and copies literal separators', async ({ mount, page }) => {
  await mount('<div></div>');

  expect(await mask(page, '4111111111111111', '#### #### #### ####')).toBe('4111 1111 1111 1111');
  // Non-word characters are stripped before the mask is applied, so an already
  // formatted value re-formats to exactly the same string.
  expect(await mask(page, '(555) 867-5309', '(###) ###-####')).toBe('(555) 867-5309');
});

test('wMaskValue uppercases A tokens and passes anything through * tokens', async ({ mount, page }) => {
  await mount('<div></div>');

  expect(await mask(page, 'ab1234', 'AA-####')).toBe('AB-1234');
  expect(await mask(page, 'a1b2', '****')).toBe('a1b2');
});

test('wMaskValue skips characters that do not fit the token type', async ({ mount, page }) => {
  await mount('<div></div>');

  // A leading letter cannot fill a `#`, so it is consumed and dropped.
  expect(await mask(page, 'a12', '###')).toBe('12');
  // A leading digit cannot fill an `A`, so it is consumed and dropped.
  expect(await mask(page, '1ab', 'AAA')).toBe('AB');
});

test('wMaskValue stops as soon as the input runs out, trailing literals included', async ({ mount, page }) => {
  await mount('<div></div>');

  // The closing bracket never lands: the mask stops the moment there is no
  // input character left to place.
  expect(await mask(page, '123', '(###) ###-####')).toBe('(123');
  expect(await mask(page, null, '###')).toBe('');
  expect(await mask(page, undefined, '(###)')).toBe('');
});

test('wSetValue writes whichever attribute the value getter reads', async ({ mount, page }) => {
  await mount('<div id="host"></div>');

  const states = await page.evaluate(async () => {
    const { wSetValue } = await import('/src/components/utils.js');
    const host = document.querySelector('#host');
    const snapshot = () => ({ value: host.getAttribute('value'), model: host.getAttribute('model-value') });
    const states = {};

    wSetValue(host, '42');
    states.plain = snapshot();

    wSetValue(host, ['a', 'b', 'c']);
    states.list = snapshot();

    wSetValue(host, null);
    states.cleared = snapshot();

    // A host authored with model-value keeps receiving model-value.
    host.setAttribute('model-value', '1');
    wSetValue(host, 7);
    states.model = snapshot();

    wSetValue(host, undefined);
    states.modelCleared = snapshot();

    return states;
  });

  expect(states).toEqual({
    plain: { value: '42', model: null },
    list: { value: 'a,b,c', model: null },
    cleared: { value: null, model: null },
    model: { value: null, model: '7' },
    modelCleared: { value: null, model: null },
  });
});

test('setting .value on a component reaches the attribute its getter reads', async ({ mount, page }) => {
  await mount('<w-chip id="chip">Tag</w-chip>');

  const value = await page.evaluate(() => {
    const chip = document.querySelector('#chip');
    chip.value = 'archived';
    return { prop: chip.value, attr: chip.getAttribute('value') };
  });

  expect(value).toEqual({ prop: 'archived', attr: 'archived' });
});
