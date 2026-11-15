import { expect, test } from '../setup/component-test.js';
import { Axe } from '../setup/axe.js';

/* Keep focus, caret and value when an attribute changes (DUVAY-8).
 *
 * Live form validation sets `error` (or `hint`, `label`, `placeholder`) while
 * the user types. Every observed attribute used to re-render the element, so
 * the inner control was rebuilt: focus fell to <body>, the caret was lost,
 * w-input dropped the typed text and an open w-select lost its focus.
 *
 * Each case puts focus in the control, types or chooses, then sets each text
 * attribute three times with setAttribute and checks that focus, the caret,
 * the value and an open list stay. The project (skin) comes from
 * playwright.config.js; each case runs in light and dark mode. */

const THEMES = ['light', 'dark'];
const TEXT_ATTRIBUTES = ['hint', 'error', 'label', 'placeholder'];
const ROUNDS = [1, 2, 3];

const TEXT_CASES = [
  {
    tag: 'w-input',
    html: '<w-input id="c" label="Label 0" hint="Hint 0" placeholder="Type 0"></w-input>',
    control: 'input',
    typed: 'abcdef',
  },
  {
    tag: 'w-text-field',
    html: '<w-text-field id="c" label="Label 0" hint="Hint 0" placeholder="Type 0" persistent-hint></w-text-field>',
    control: 'input',
    typed: 'abcdef',
  },
  {
    tag: 'w-textarea',
    html: '<w-textarea id="c" label="Label 0" hint="Hint 0" placeholder="Type 0" persistent-hint></w-textarea>',
    control: 'textarea',
    typed: 'abcdef',
  },
  {
    tag: 'w-number-input',
    html: '<w-number-input id="c" label="Label 0" hint="Hint 0" placeholder="Type 0"></w-number-input>',
    control: 'input',
    typed: '123456',
  },
  {
    tag: 'w-autocomplete',
    html: '<w-autocomplete id="c" label="Label 0" hint="Hint 0" placeholder="Type 0" items="[Apple,Apricot,Banana]"></w-autocomplete>',
    control: '.w-autocomplete-input',
    typed: 'apri',
    commitKeys: ['ArrowDown', 'Enter'],
    kept: 'Apricot',
  },
];

const TOGGLE_CASES = [
  { tag: 'w-switch', html: '<w-switch id="c" label="Label 0" hint="Hint 0"></w-switch>', control: 'input' },
  { tag: 'w-checkbox', html: '<w-checkbox id="c" label="Label 0" hint="Hint 0"></w-checkbox>', control: 'input' },
];

const SELECT_HTML = `
  <w-select id="c" label="Label 0" hint="Hint 0" placeholder="Pick 0">
    <w-option value="a">Apple</w-option>
    <w-option value="b">Banana</w-option>
    <w-option value="c">Cherry</w-option>
  </w-select>`;

async function useTheme(page, theme) {
  await page.evaluate((value) => document.documentElement.setAttribute('w-theme', value), theme);
}

async function watchPage(page) {
  const problems = [];
  page.on('pageerror', (error) => problems.push(error.message));
  page.on('console', (message) => {
    if (message.text().includes('DuVay')) problems.push(message.text());
  });
  return problems;
}

async function recordFocusLoss(page) {
  await page.evaluate(() => {
    window.__wFocusLoss = [];
    ['focusout', 'focusin'].forEach((type) => {
      document.querySelector('#root').addEventListener(type, (event) => {
        window.__wFocusLoss.push(type + ':' + event.target.localName);
      });
    });
  });
}

async function focusLoss(page) {
  return page.evaluate(() => window.__wFocusLoss);
}

async function rememberControl(page, control) {
  await page.locator('#c').evaluate((host, selector) => {
    window.__wHost = host;
    window.__wControl = host.querySelector(selector);
  }, control);
}

async function expectSameNodes(page, control, message) {
  const same = await page.evaluate((selector) => {
    const host = document.querySelector('#c');
    return { host: host === window.__wHost, control: host.querySelector(selector) === window.__wControl };
  }, control);
  expect(same, message).toEqual({ host: true, control: true });
}

async function setAttribute(page, name, value) {
  await page.locator('#c').evaluate((host, change) => host.setAttribute(change.name, change.value), { name, value });
  await page.waitForTimeout(0);
}

async function removeAttribute(page, name) {
  await page.locator('#c').evaluate((host, attribute) => host.removeAttribute(attribute), name);
  await page.waitForTimeout(0);
}

async function textState(page, control) {
  return page.locator('#c').evaluate((host, selector) => {
    const active = document.activeElement;
    const focused = host.contains(active) && active.matches(selector);
    return {
      focused,
      value: focused ? active.value : null,
      caret: focused ? [active.selectionStart, active.selectionEnd, active.selectionDirection] : null,
      placeholder: focused ? active.getAttribute('placeholder') : null,
    };
  }, control);
}

async function sameControl(page, control) {
  return page.locator('#c').evaluate((host, selector) => host.querySelector(selector) === window.__wControl, control);
}

async function hostText(page) {
  return page.locator('#c').evaluate((host) => host.textContent.replace(/\s+/g, ' '));
}

async function typeWithCaret(page, control, typed) {
  await page.locator(`#c ${control}`).first().focus();
  await page.keyboard.type(typed);
  await page.keyboard.press('ArrowLeft');
}

async function pressKeys(page, keys) {
  for (const key of keys) {
    await page.keyboard.press(key);
  }
}

async function selectBackward(page) {
  await page.keyboard.press('Shift+ArrowLeft');
  await page.keyboard.press('Shift+ArrowLeft');
}

async function expectTextKept(page, testCase, attribute, round, expected) {
  const value = `${attribute} ${round}`;
  await setAttribute(page, attribute, value);
  const state = await textState(page, testCase.control);
  await expectSameNodes(page, testCase.control, `${testCase.tag} ${attribute} #${round}: same host and control`);
  expect(state.focused, `${testCase.tag} ${attribute} #${round}: focus stays`).toBe(true);
  expect(state.value).toBe(expected.value);
  expect(state.caret).toEqual(expected.caret);
  await expectAttributeShown(page, attribute, value, state);
}

async function expectAttributeShown(page, attribute, value, state) {
  if (attribute === 'placeholder') {
    expect([value, null]).toContain(state.placeholder);
    return;
  }
  expect(await hostText(page)).toContain(value);
}

async function updateEachTextAttribute(page, testCase, expected) {
  for (const attribute of TEXT_ATTRIBUTES) {
    for (const round of ROUNDS) {
      await expectTextKept(page, testCase, attribute, round, expected);
    }
  }
}

async function toggleDisabledThreeTimes(page, control) {
  for (const round of ROUNDS) {
    await setAttribute(page, 'disabled', '');
    await expectNoEnabledFocus(page, round);
    await expectSameNodes(page, control, `disabled on #${round}: same host and control`);
    await removeAttribute(page, 'disabled');
    await expectSameNodes(page, control, `disabled off #${round}: same host and control`);
  }
}

async function expectNoEnabledFocus(page, round) {
  const focusedEnabled = await page.locator('#c').evaluate((host) => {
    const active = document.activeElement;
    return host.contains(active) && !active.disabled && !host.inert;
  });
  expect(focusedEnabled, `disabled #${round}: no enabled control keeps focus`).toBe(false);
}

async function expectNoViolations(page) {
  await Axe.inject(page);
  expect(await Axe.violations(page, '#root')).toEqual([]);
}

async function selectState(page) {
  return page.locator('#c').evaluate((host) => {
    const trigger = host.querySelector('.w-select-field');
    const list = host.querySelector('.w-select-list');
    return {
      focused: document.activeElement === trigger,
      expanded: trigger.getAttribute('aria-expanded'),
      listShown: !list.hidden,
      activeText: host.querySelector('.w-select-item.active')?.textContent.trim() || null,
    };
  });
}

async function openSelectOnBanana(page) {
  await page.locator('#c .w-select-field').focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
}

async function expectSelectKept(page, attribute, round, before) {
  await setAttribute(page, attribute, `${attribute} ${round}`);
  await expectSameNodes(page, '.w-select-field', `w-select ${attribute} #${round}: same host and trigger`);
  expect(await selectState(page), `w-select ${attribute} #${round}`).toEqual(before);
}

async function updateSelect(page, before) {
  for (const attribute of TEXT_ATTRIBUTES) {
    for (const round of ROUNDS) {
      await expectSelectKept(page, attribute, round, before);
    }
  }
}

async function toggleState(page, control) {
  return page.locator('#c').evaluate((host, selector) => {
    const input = host.querySelector(selector);
    return { focused: document.activeElement === input, checked: input.checked, disabled: input.disabled };
  }, control);
}

async function expectToggleKept(page, testCase, attribute, round) {
  await setAttribute(page, attribute, `${attribute} ${round}`);
  await expectSameNodes(page, testCase.control, `${testCase.tag} ${attribute} #${round}: same host and control`);
  expect(await toggleState(page, testCase.control), `${testCase.tag} ${attribute} #${round}`)
    .toEqual({ focused: true, checked: true, disabled: false });
  expect(await hostText(page)).toContain(`${attribute} ${round}`);
}

async function updateToggle(page, testCase) {
  for (const attribute of ['hint', 'error', 'label']) {
    for (const round of ROUNDS) {
      await expectToggleKept(page, testCase, attribute, round);
    }
  }
}

for (const theme of THEMES) {
  for (const testCase of TEXT_CASES) {
    test(`${testCase.tag} keeps focus, caret and value while hint, error, label and placeholder change (${theme})`, async ({ mount, page }) => {
      const problems = await watchPage(page);
      await useTheme(page, theme);
      await mount(testCase.html);
      await typeWithCaret(page, testCase.control, testCase.typed);
      await rememberControl(page, testCase.control);
      await recordFocusLoss(page);
      const length = testCase.typed.length;
      const expected = { value: testCase.typed, caret: (await textState(page, testCase.control)).caret };
      expect(expected.caret.slice(0, 2)).toEqual([length - 1, length - 1]);

      await updateEachTextAttribute(page, testCase, expected);

      expect(await sameControl(page, testCase.control)).toBe(true);
      expect(await focusLoss(page)).toEqual([]);
      await expectNoViolations(page);
      await page.keyboard.type('X');
      const typedAgain = testCase.typed.slice(0, length - 1) + 'X' + testCase.typed.slice(length - 1);
      expect((await textState(page, testCase.control)).value).toBe(typedAgain);
      expect(problems).toEqual([]);
    });

    test(`${testCase.tag} keeps a backward selection while the hint changes (${theme})`, async ({ mount, page }) => {
      await useTheme(page, theme);
      await mount(testCase.html);
      await page.locator(`#c ${testCase.control}`).first().focus();
      await page.keyboard.type(testCase.typed);
      await selectBackward(page);
      await rememberControl(page, testCase.control);
      const length = testCase.typed.length;
      const expected = { value: testCase.typed, caret: [length - 2, length, 'backward'] };
      expect((await textState(page, testCase.control)).caret).toEqual(expected.caret);

      await expectTextKept(page, testCase, 'hint', 1, expected);
      await expectTextKept(page, testCase, 'error', 1, expected);
    });

    test(`${testCase.tag} keeps the typed value while disabled turns on and off (${theme})`, async ({ mount, page }) => {
      await useTheme(page, theme);
      await mount(testCase.html);
      await typeWithCaret(page, testCase.control, testCase.typed);
      await pressKeys(page, testCase.commitKeys || []);
      await rememberControl(page, testCase.control);

      await toggleDisabledThreeTimes(page, testCase.control);

      const value = await page.locator(`#c ${testCase.control}`).first().evaluate((control) => [control.value, control.disabled]);
      expect(value).toEqual([testCase.kept || testCase.typed, false]);
    });
  }

  for (const testCase of TOGGLE_CASES) {
    test(`${testCase.tag} keeps focus and checked state while hint, error and label change (${theme})`, async ({ mount, page }) => {
      const problems = await watchPage(page);
      await useTheme(page, theme);
      await mount(testCase.html);
      await page.locator(`#c ${testCase.control}`).focus();
      await page.keyboard.press('Space');
      await rememberControl(page, testCase.control);
      await recordFocusLoss(page);

      await updateToggle(page, testCase);

      expect(await focusLoss(page)).toEqual([]);
      await page.keyboard.press('Space');
      expect(await toggleState(page, testCase.control)).toEqual({ focused: true, checked: false, disabled: false });
      await expectNoViolations(page);
      expect(problems).toEqual([]);
    });

    test(`${testCase.tag} keeps checked state while disabled turns on and off (${theme})`, async ({ mount, page }) => {
      await useTheme(page, theme);
      await mount(testCase.html);
      await page.locator(`#c ${testCase.control}`).focus();
      await page.keyboard.press('Space');
      await rememberControl(page, testCase.control);

      await toggleDisabledThreeTimes(page, testCase.control);

      const state = await toggleState(page, testCase.control);
      expect([state.checked, state.disabled]).toEqual([true, false]);
    });
  }

  test(`w-select stays open on the same option while hint, error, label and placeholder change (${theme})`, async ({ mount, page }) => {
    const problems = await watchPage(page);
    await useTheme(page, theme);
    await mount(SELECT_HTML);
    await openSelectOnBanana(page);
    await rememberControl(page, '.w-select-field');
    await recordFocusLoss(page);
    const before = await selectState(page);
    expect(before).toMatchObject({ focused: true, expanded: 'true', listShown: true, activeText: 'Banana' });

    await updateSelect(page, before);

    expect(await focusLoss(page)).toEqual([]);
    await page.keyboard.press('Enter');
    expect(await page.locator('#c').evaluate((host) => host.value)).toBe('b');
    await expectNoViolations(page);
    expect(problems).toEqual([]);
  });

  test(`w-select keeps its value while disabled turns on and off (${theme})`, async ({ mount, page }) => {
    await useTheme(page, theme);
    await mount(SELECT_HTML);
    await openSelectOnBanana(page);
    await page.keyboard.press('Enter');
    await rememberControl(page, '.w-select-field');

    await toggleDisabledThreeTimes(page, '.w-select-field');

    expect(await page.locator('#c').evaluate((host) => host.value)).toBe('b');
  });
}

/* DUVAY-7 found this with a control test that used no framework:
 * `ctl-inp` and `ctl-sel` in ~/Library/Logs/local/DUVAY/tac-retest/focus-result.txt.
 * Before the fix, update #1 already showed focus on <body>, the w-input value
 * empty and the caret null. */
test('DUVAY-7 regression: w-input keeps the same input, focus, value and caret while the hint changes', async ({ mount, page }) => {
  await mount('<w-input id="c" hint="Hint 0"></w-input>');
  await page.locator('#c input').focus();
  await page.keyboard.type('abcdef');
  await page.locator('#c input').evaluate((input) => input.setSelectionRange(3, 3));
  await rememberControl(page, 'input');
  const expected = { value: 'abcdef', caret: (await textState(page, 'input')).caret };
  expect(expected.caret.slice(0, 2)).toEqual([3, 3]);

  await expectTextKept(page, { tag: 'w-input', control: 'input' }, 'hint', 1, expected);
  await expectTextKept(page, { tag: 'w-input', control: 'input' }, 'hint', 2, expected);
  await expectTextKept(page, { tag: 'w-input', control: 'input' }, 'hint', 3, expected);

  expect(await sameControl(page, 'input')).toBe(true);
});

test('DUVAY-7 regression: an open w-select keeps focus, its value and its list while the hint changes', async ({ mount, page }) => {
  await mount(SELECT_HTML.replace('placeholder="Pick 0"', 'value="b"'));
  await page.locator('#c .w-select-field').focus();
  await page.keyboard.press('ArrowDown');
  await rememberControl(page, '.w-select-field');
  const before = await selectState(page);
  expect(before).toMatchObject({ focused: true, expanded: 'true', activeText: 'Banana' });

  await expectSelectKept(page, 'hint', 1, before);
  await expectSelectKept(page, 'hint', 2, before);
  await expectSelectKept(page, 'hint', 3, before);

  expect(await page.locator('#c').evaluate((host) => host.value)).toBe('b');
});

test('w-input keeps the same input, focus, caret and value when an error adds the field wrapper', async ({ mount, page }) => {
  await mount('<w-input id="c"></w-input>');
  await page.locator('#c input').focus();
  await page.keyboard.type('abcdef');
  await page.locator('#c input').evaluate((input) => input.setSelectionRange(2, 4));
  await rememberControl(page, 'input');
  await recordFocusLoss(page);

  await setAttribute(page, 'error', 'Too short');

  await expectSameNodes(page, 'input', 'the input is moved into the new wrapper, not rebuilt');
  expect(await page.locator('#c .w-field').count()).toBe(1);
  const state = await textState(page, 'input');
  expect([state.focused, state.value, state.caret.slice(0, 2)]).toEqual([true, 'abcdef', [2, 4]]);
  expect(await hostText(page)).toContain('Too short');
  expect(await focusLoss(page)).toEqual([]);
});

test('a new value attribute still replaces the typed text', async ({ mount, page }) => {
  await mount('<w-input id="c" hint="Hint 0"></w-input>');
  await page.locator('#c input').focus();
  await page.keyboard.type('abcdef');

  await setAttribute(page, 'value', 'server');

  expect(await page.locator('#c input').inputValue()).toBe('server');
});

test('w-text-field keeps focus and value when error-messages is set as a property', async ({ mount, page }) => {
  await mount('<w-text-field id="c" label="Name"></w-text-field>');
  await page.locator('#c input').focus();
  await page.keyboard.type('abcdef');
  await rememberControl(page, 'input');

  await page.locator('#c').evaluate((host) => { host.errorMessages = ['Name is taken']; });
  await page.waitForTimeout(0);

  await expectSameNodes(page, 'input', 'error-messages property: same host and input');
  const state = await textState(page, 'input');
  expect([state.focused, state.value, state.caret.slice(0, 2)]).toEqual([true, 'abcdef', [6, 6]]);
  expect(await hostText(page)).toContain('Name is taken');
});

test('a slotted control keeps its identity and focus when its host re-renders', async ({ mount, page }) => {
  await mount('<w-card id="c" title="Title 0"><input id="inside" aria-label="Inside"></w-card>');
  await page.locator('#inside').focus();
  await page.keyboard.type('abc');

  await setAttribute(page, 'title', 'Title 1');

  const state = await page.evaluate(() => [document.activeElement.id, document.activeElement.value]);
  expect(state).toEqual(['inside', 'abc']);
});

test('keeping focus works under a strict Content Security Policy', async ({ mount, page }) => {
  const violations = [];
  await page.route('**/tests/fixtures/component-page.html', async (route) => {
    const response = await route.fetch();
    const headers = { ...response.headers(), 'content-security-policy': "script-src 'self'; object-src 'none'" };
    await route.fulfill({ response, headers });
  });
  page.on('console', (message) => {
    if (/Content Security Policy/.test(message.text()) && !/inline script/i.test(message.text())) violations.push(message.text());
  });
  await mount('<w-input id="c" label="Label 0" hint="Hint 0"></w-input>');
  await page.locator('#c input').focus();
  await page.keyboard.type('abcdef');

  await setAttribute(page, 'error', 'Error 1');
  await setAttribute(page, 'disabled', '');
  await removeAttribute(page, 'disabled');

  expect(await page.locator('#c input').inputValue()).toBe('abcdef');
  expect(violations).toEqual([]);
});

/* The in-place patch must leave the same markup a full render would make.
 * Copy A is focused and patched; copy B is rendered fresh with the final
 * attributes and focused the same way. Ids differ per copy, so they are
 * blanked before the two are compared. */
const PATCH_CASES = [
  { tag: 'w-input', control: 'input' },
  { tag: 'w-text-field', control: 'input' },
  { tag: 'w-textarea', control: 'textarea' },
  { tag: 'w-number-input', control: 'input' },
  { tag: 'w-autocomplete', control: '.w-autocomplete-input', extra: ' items="[Apple,Banana]"' },
  { tag: 'w-select', control: '.w-select-field', body: '<w-option value="a">Apple</w-option><w-option value="b">Banana</w-option>' },
  { tag: 'w-switch', control: 'input' },
  { tag: 'w-checkbox', control: 'input' },
];

const FINAL_ATTRIBUTES = 'label="Label 9" hint="Hint 9" error="Error 9" placeholder="Type 9" disabled';

async function normalizedMarkup(page, selector, control) {
  await page.locator(`${selector} ${control}`).first().focus();
  return page.locator(selector).evaluate((host) => {
    const blanked = new Set(['id', 'for', 'aria-describedby', 'aria-controls', 'aria-labelledby', 'aria-activedescendant', 'list']);
    const attributeText = (element, name) => {
      if (blanked.has(name)) return name;
      if (name === 'class') return 'class=' + Array.from(element.classList).sort().join(' ');
      return name + '=' + element.getAttribute(name);
    };
    const describe = (node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return node.textContent.trim();
      const names = node.getAttributeNames().sort().map((name) => attributeText(node, name));
      return `<${node.localName} ${names.join(' ')}>` + Array.from(node.childNodes).map(describe).join('') + '</>';
    };
    return Array.from(host.childNodes).map(describe).join('');
  });
}

async function patchAll(page) {
  await page.locator('#a').evaluate((host) => {
    host.setAttribute('label', 'Label 9');
    host.setAttribute('hint', 'Hint 9');
    host.setAttribute('error', 'Error 9');
    host.setAttribute('placeholder', 'Type 9');
    host.setAttribute('disabled', '');
  });
  await page.waitForTimeout(0);
}

for (const patchCase of PATCH_CASES) {
  test(`${patchCase.tag} patched in place matches a fresh render`, async ({ mount, page }) => {
    const extra = patchCase.extra || '';
    const body = patchCase.body || '';
    await mount(`<${patchCase.tag} id="a" label="Label 0" hint="Hint 0" placeholder="Type 0"${extra}>${body}</${patchCase.tag}>`
      + `<${patchCase.tag} id="b" ${FINAL_ATTRIBUTES}${extra}>${body}</${patchCase.tag}>`);
    await page.locator(`#a ${patchCase.control}`).first().focus();
    await rememberControlOf(page, '#a', patchCase.control);

    await patchAll(page);

    expect(await page.locator('#a').evaluate((host, selector) => host.querySelector(selector) === window.__wControl, patchCase.control)).toBe(true);
    const patched = await normalizedMarkup(page, '#a', patchCase.control);
    const fresh = await normalizedMarkup(page, '#b', patchCase.control);
    expect(patched).toBe(fresh);
  });
}

async function rememberControlOf(page, selector, control) {
  await page.locator(selector).evaluate((host, inner) => {
    window.__wControl = host.querySelector(inner);
  }, control);
}

test('after disabled turns on and off, a keystroke fires one input event, not one per toggle', async ({ mount, page }) => {
  await mount('<w-text-field id="c" label="Name" hint="Hint 0"></w-text-field>');
  await rememberControl(page, 'input');
  await toggleDisabledThreeTimes(page, 'input');
  await page.evaluate(() => {
    window.__wInputs = 0;
    document.querySelector('#c').addEventListener('input', () => { window.__wInputs += 1; });
  });

  await page.locator('#c input').focus();
  await page.keyboard.type('a');

  expect(await page.evaluate(() => window.__wInputs)).toBe(1);
});

test('a w-list-group that starts disabled opens on click once it is enabled', async ({ mount, page }) => {
  await mount('<w-list-group id="c" title="Group" disabled><w-list-item title="One"></w-list-item></w-list-group>');
  await rememberControl(page, '.w-list-group-activator');

  await removeAttribute(page, 'disabled');
  await page.locator('#c .w-list-group-activator').first().click();

  await expect(page.locator('#c .w-list-group-items')).toBeVisible();
  await expect(page.locator('#c w-list-group-activator button')).toHaveCount(1);
});

/* Every registered element: changing the patched attributes on a live copy
 * must give the same markup as a fresh copy made with the final attributes.
 * KNOWN lists elements whose markup after an attribute change already
 * differed from a fresh render before DUVAY-8 (their own re-render problems,
 * such as rendering into their own slot); it may only shrink. */
const KNOWN_RERENDER_DIFFERENCES = new Set([
  'w-empty', 'w-empty-state', 'w-infinite-scroll', 'w-picker', 'w-progress', 'w-progress-linear',
  'w-progress-circular', 'w-skeleton', 'w-skeleton-loader', 'w-stepper-actions', 'w-stepper-vertical-actions',
]);

const PATCHED_CHANGES = [['label', 'Label 9'], ['hint', 'Hint 9'], ['error', 'Error 9'], ['placeholder', 'Type 9'], ['disabled', ''], ['readonly', '']];

async function matchesFreshRender(page) {
  return page.evaluate(async ({ changes }) => {
    const blanked = new Set(['id', 'for', 'aria-describedby', 'aria-controls', 'aria-labelledby', 'aria-activedescendant', 'aria-owns', 'list', 'style', 'name', 'href']);
    const attributeText = (element, name) => {
      if (blanked.has(name)) return name;
      if (name === 'class') return 'class=' + Array.from(element.classList).sort().join(' ');
      return name + '=' + element.getAttribute(name);
    };
    const describe = (node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return node.textContent.trim().replace(/\d{2,}/g, '#');
      const names = node.getAttributeNames().sort().map((name) => attributeText(node, name));
      return `<${node.localName} ${names.join(' ')}>` + Array.from(node.childNodes).map(describe).join('') + '</>';
    };
    const markup = (host) => Array.from(host.childNodes).map(describe).join('');
    const live = document.querySelector('#a');
    changes.forEach(([name, value]) => live.setAttribute(name, value));
    await new Promise((resolve) => setTimeout(resolve, 20));
    return markup(live) === markup(document.querySelector('#b'));
  }, { changes: PATCHED_CHANGES });
}

async function tagsThatDiffer(mount, page, tags) {
  const different = [];
  for (const tag of tags) {
    await mount(`<${tag} id="a" label="Label 0" hint="Hint 0" placeholder="Type 0"></${tag}>`
      + `<${tag} id="b" label="Label 9" hint="Hint 9" error="Error 9" placeholder="Type 9" disabled readonly></${tag}>`);
    await page.waitForTimeout(20);
    if (!(await matchesFreshRender(page))) different.push(tag);
  }
  return different;
}

test('every element patched in place matches a fresh render, apart from the known list', async ({ mount, page }) => {
  test.setTimeout(120000);
  await mount('');
  const tags = await page.evaluate(() => window.__wTags.slice());
  const different = await tagsThatDiffer(mount, page, tags);
  expect(different.filter((tag) => !KNOWN_RERENDER_DIFFERENCES.has(tag))).toEqual([]);
  expect([...KNOWN_RERENDER_DIFFERENCES].filter((tag) => !different.includes(tag))).toEqual([]);
});
