import { expect, test } from '../setup/component-test.js';
import { Axe } from '../setup/axe.js';
import { DocsPage } from '../setup/docs-page.js';

/* Data properties (DUVAY-6).
 *
 * List and object data can be given as an attribute (a string) or as a
 * property (an array or object). Tac's `:values` binding, and other
 * frameworks, assign the property: `el.values = [...]`. A getter with no
 * setter made that assignment throw a TypeError, so the chart never updated.
 *
 * Rule under test: the property wins over the attribute; null or undefined
 * clears it, and the attribute counts again. A NEW value re-renders.
 *
 * Assignments run in strict mode, as Tac's module code does: there, a getter
 * with no setter throws instead of failing silently. */

const THEMES = ['light', 'dark'];

async function useTheme(page, theme) {
  await page.evaluate((value) => document.documentElement.setAttribute('w-theme', value), theme);
}

async function collectErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

async function setProperty(page, selector, name, value) {
  await page.locator(selector).evaluate((el, change) => {
    'use strict';
    el[change.key] = change.next;
  }, { key: name, next: value });
  await page.waitForTimeout(0);
}

for (const theme of THEMES) {
  test(`w-sparkline values property draws a new array and redraws on the next one (${theme})`, async ({ mount, page }) => {
    const errors = await collectErrors(page);
    await useTheme(page, theme);
    await mount('<w-sparkline id="s" type="bar" label="Jobs per hour"></w-sparkline>');

    await setProperty(page, '#s', 'values', [4, 7, 2]);
    await expect(page.locator('#s .w-sparkline-bar')).toHaveCount(3);
    expect(await page.locator('#s').evaluate((el) => el.values)).toEqual([4, 7, 2]);

    await setProperty(page, '#s', 'values', [1, 2, 3, 4, 5]);
    await expect(page.locator('#s .w-sparkline-bar')).toHaveCount(5);
    expect(await page.locator('#s').evaluate((el) => el.values)).toEqual([1, 2, 3, 4, 5]);
    expect(errors).toEqual([]);
  });

  test(`w-sparkline trend line changes its path when a new array is given (${theme})`, async ({ mount, page }) => {
    await useTheme(page, theme);
    await mount('<w-sparkline id="s" show-markers></w-sparkline>');

    await setProperty(page, '#s', 'values', [1, 5, 2]);
    await expect(page.locator('#s .w-sparkline-marker')).toHaveCount(3);
    const first = await page.locator('#s .w-sparkline-line').getAttribute('d');

    await setProperty(page, '#s', 'values', [9, 1, 9, 1]);
    await expect(page.locator('#s .w-sparkline-marker')).toHaveCount(4);
    await expect(page.locator('#s .w-sparkline-line')).not.toHaveAttribute('d', first);
  });

  test(`w-chart values property draws a new array and redraws on the next one (${theme})`, async ({ mount, page }) => {
    const errors = await collectErrors(page);
    await useTheme(page, theme);
    await mount('<w-chart id="c" title="Queue"></w-chart>');

    await setProperty(page, '#c', 'values', [10, 20]);
    await expect(page.locator('#c .w-chart-bar')).toHaveCount(2);
    await expect(page.locator('#c .w-chart-bar').first()).toHaveAttribute('style', /--w-chart-value: 10%/);

    await setProperty(page, '#c', 'values', [30, 40, 50]);
    await expect(page.locator('#c .w-chart-bar')).toHaveCount(3);
    await expect(page.locator('#c .w-chart-bar').first()).toHaveAttribute('style', /--w-chart-value: 30%/);
    expect(errors).toEqual([]);
  });

  test(`charts with property data pass axe (${theme})`, async ({ mount, page }) => {
    test.setTimeout(60000);
    await useTheme(page, theme);
    await mount(`
      <w-sparkline id="s" label="Jobs per hour" interactive tooltip show-labels></w-sparkline>
      <w-sparkline id="b" type="bar" label="Jobs per day"></w-sparkline>
      <w-chart id="c" title="Queue depth"></w-chart>
    `);
    await setProperty(page, '#s', 'values', [3, 8, 5, 10]);
    await setProperty(page, '#b', 'values', [4, 7, 2]);
    await setProperty(page, '#c', 'values', [24, 42, 36]);
    await Axe.inject(page);
    expect(await Axe.violations(page, '#root')).toEqual([]);
  });
}

test('the values property wins over the attribute, and null gives the attribute back', async ({ mount, page }) => {
  await mount(`
    <w-sparkline id="s" type="bar" values="1,2"></w-sparkline>
    <w-chart id="c" values="[10,20]"></w-chart>
  `);
  await expect(page.locator('#s .w-sparkline-bar')).toHaveCount(2);

  await setProperty(page, '#s', 'values', [5, 6, 7]);
  await setProperty(page, '#c', 'values', [5, 6, 7]);
  await page.locator('#root').evaluate((root) => {
    root.querySelector('#s').setAttribute('values', '1,2,3,4');
    root.querySelector('#c').setAttribute('values', '1,2,3,4');
  });
  await expect(page.locator('#s .w-sparkline-bar')).toHaveCount(3);
  await expect(page.locator('#c .w-chart-bar')).toHaveCount(3);

  await setProperty(page, '#s', 'values', null);
  await setProperty(page, '#c', 'values', null);
  await expect(page.locator('#s .w-sparkline-bar')).toHaveCount(4);
  await expect(page.locator('#c .w-chart-bar')).toHaveCount(4);
});

test('an empty values array draws an empty chart, not sample data', async ({ mount, page }) => {
  await mount(`
    <w-sparkline id="s" type="bar"></w-sparkline>
    <w-sparkline id="t" interactive tooltip></w-sparkline>
    <w-chart id="c"></w-chart>
  `);
  await expect(page.locator('#s .w-sparkline-bar')).toHaveCount(6);
  await expect(page.locator('#c .w-chart-bar')).toHaveCount(6);

  await setProperty(page, '#s', 'values', []);
  await setProperty(page, '#t', 'values', []);
  await setProperty(page, '#c', 'values', []);
  await expect(page.locator('#s .w-sparkline-bar')).toHaveCount(0);
  await expect(page.locator('#c .w-chart-bar')).toHaveCount(0);

  await page.locator('#t svg').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#t svg')).toHaveAttribute('aria-label', 'Sparkline');
});

test('a values property given before the element upgrades is used', async ({ page, mount }) => {
  await mount('<div id="slot"></div>');
  const count = await page.evaluate(async () => {
    const holder = document.createElement('div');
    holder.innerHTML = '<w-sparkline type="bar"></w-sparkline>';
    const spark = holder.firstElementChild;
    Object.defineProperty(spark, 'values', { value: [1, 2, 3, 4, 5, 6, 7], writable: true, configurable: true, enumerable: true });
    document.querySelector('#slot').append(spark);
    await new Promise((resolve) => setTimeout(resolve, 0));
    return spark.querySelectorAll('.w-sparkline-bar').length;
  });
  expect(count).toBe(7);
});

test('setting values never throws: bad items are ignored with one warning', async ({ mount, page }) => {
  const errors = await collectErrors(page);
  const warnings = [];
  page.on('console', (message) => { if (message.type() === 'warning') warnings.push(message.text()); });
  await mount('<w-sparkline id="s" type="bar"></w-sparkline><w-chart id="c"></w-chart>');

  const thrown = await page.locator('#root').evaluate((root) => {
    'use strict';
    const inputs = [
      [1, 'x', null, undefined, NaN, Infinity, {}, [], '2', ' ', true],
      { 0: 1 }, 42, true, 'not numbers', null, undefined,
    ];
    const failures = [];
    for (const el of root.querySelectorAll('w-sparkline, w-chart')) {
      for (const input of inputs) {
        try { el.values = input; } catch (error) { failures.push(`${el.localName}: ${error.message}`); }
      }
    }
    return failures;
  });
  expect(thrown).toEqual([]);

  await setProperty(page, '#s', 'values', [3, 'bad', { n: 1 }, 4]);
  await expect(page.locator('#s .w-sparkline-bar')).toHaveCount(2);
  expect(await page.locator('#s').evaluate((el) => el.values)).toEqual([3, 4]);
  expect(warnings.at(-1)).toBe('DuVay: <w-sparkline> values ignored 2 item(s) that are not numbers.');

  const before = warnings.length;
  await setProperty(page, '#c', 'values', { rows: [1, 2] });
  await expect(page.locator('#c .w-chart-bar')).toHaveCount(0);
  expect(warnings.length).toBe(before + 1);
  expect(warnings.at(-1)).toContain('<w-chart> values expects an array of numbers');
  expect(errors).toEqual([]);
});

test('w-sparkline labels and gradient accept arrays', async ({ mount, page }) => {
  await mount('<w-sparkline id="s" values="[1,5,2]"></w-sparkline>');
  await setProperty(page, '#s', 'labels', ['Mon', 'Tue', 'Wed']);
  await setProperty(page, '#s', 'gradient', ['primary', 'error']);
  await expect(page.locator('#s .w-sparkline-labels text')).toHaveText(['Mon', 'Tue', 'Wed']);
  await expect(page.locator('#s defs stop')).toHaveCount(2);
});

/* Every other component whose list or object data had a getter and no setter
 * (or no property at all). Each case mounts the same markup twice and, after
 * the first render, gives the data once as attribute strings and once as
 * properties. Both must render the same DOM, and the property must read back. */
const CASES = [
  { tag: 'w-tabs', props: { items: ['Inbox', 'Drafts'] } },
  { tag: 'w-stepper', html: 'value="1"', props: { items: [{ title: 'Account', value: '1' }, { title: 'Done', value: '2' }] } },
  { tag: 'w-breadcrumbs', props: { items: [{ title: 'Home', href: '/' }, { title: 'Reports' }] } },
  { tag: 'w-command', html: 'label="Commands"', props: { items: [{ title: 'Find', value: 'find' }, { title: 'Quit', value: 'quit' }] } },
  { tag: 'w-select', html: 'label="Fruit"', props: { items: ['Apple', 'Banana'] } },
  { tag: 'w-autocomplete', html: 'label="Fruit"', props: { items: ['Apple', 'Banana'], filterKeys: ['title'], messages: ['Pick one'], errorMessages: ['Required'] } },
  { tag: 'w-virtual-scroll', html: 'height="200"', props: { items: ['One', 'Two', 'Three'] } },
  { tag: 'w-file-upload-list', props: { items: ['one.txt', 'two.txt'] } },
  { tag: 'w-file-upload-list', name: 'w-file-upload-list (files)', props: { files: [{ title: 'a.txt' }, { title: 'b.txt' }] } },
  { tag: 'w-input', html: 'label="Name"', props: { messages: ['Your full name'], errorMessages: ['Required'] } },
  { tag: 'w-text-field', html: 'label="Name"', props: { messages: ['Your full name'], errorMessages: ['Required'] } },
  { tag: 'w-number-input', html: 'label="Count"', props: { messages: ['Whole numbers'], errorMessages: ['Too big'] } },
  { tag: 'w-switch', html: 'label="Alerts"', props: { messages: ['Sends email'], errorMessages: ['Required'] } },
  { tag: 'w-checkbox', html: 'label="Agree"', props: { messages: ['Read the terms'], errorMessages: ['Required'] } },
  { tag: 'w-radio-group', html: 'label="Size"', inner: '<w-radio value="s" label="Small"></w-radio>', props: { messages: ['Pick one'], errorMessages: ['Required'] } },
  { tag: 'w-slider', html: 'label="Volume" min="0" max="2" step="1" show-ticks="always"', props: { messages: ['Loud'], errorMessages: ['Too loud'], tickLabels: ['Low', 'Mid', 'High'] }, attributes: { 'tick-labels': 'Low|Mid|High' } },
  { tag: 'w-messages', props: { messages: ['First', 'Second'] } },
  { tag: 'w-validation', props: { errorMessages: ['Required', 'Too short'] } },
  { tag: 'w-snackbar-queue', props: { messages: ['Saved', 'Sent'] } },
  { tag: 'w-color-picker', props: { modes: ['rgb', 'hex'] }, attributes: { modes: 'rgb,hex' } },
  { tag: 'w-time-picker-clock', props: { allowedValues: [0, 15, 30, 45] }, attributes: { 'allowed-values': '0,15,30,45' } },
  { tag: 'w-date-picker', html: 'value="2026-11-14"', props: { weekdays: [1, 2, 3, 4, 5] }, attributes: { weekdays: '1,2,3,4,5' } },
  {
    tag: 'w-data-table',
    html: `headers='["name","team"]' items='[{"name":"Ada","team":"core"},{"name":"Bob","team":"web"}]' search="core" group-by="team"`,
    props: { filterKeys: ['team'], opened: ['core'], expanded: ['Ada'] },
  },
  { tag: 'w-data-table-headers', props: { headers: ['Name', 'Team'] } },
  { tag: 'w-data-table-row', props: { headers: ['Name', 'Team'] } },
  { tag: 'w-data-table-rows', props: { headers: ['name', 'team'], items: [{ name: 'Ada', team: 'core' }], opened: ['core'] } },
  {
    tag: 'w-list',
    inner: '<w-list-group value="g1" title="Group"><w-list-item title="Item"></w-list-item></w-list-group>',
    props: { opened: ['g1'] },
  },
  {
    tag: 'w-treeview',
    html: `items='[{"title":"Docs","code":"zz","children":[{"title":"Readme","code":"zz"}]}]' search="zz" open-all`,
    props: { filterKeys: ['code'] },
  },
];

function kebab(name) {
  return name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function attributeValues(testCase) {
  return Object.fromEntries(Object.entries(testCase.props).map(([name, value]) => {
    const attribute = kebab(name);
    return [attribute, testCase.attributes?.[attribute] ?? JSON.stringify(value)];
  }));
}

/* Generated ids (`w-ac-x7k2-input`) differ between two mounts, so each distinct
 * value of an id or id-reference attribute is replaced by its order of first
 * appearance. */
async function renderedHtml(page, html, { attributes, properties }) {
  return page.locator('#root').evaluate(async (root, input) => {
    'use strict';
    const { markup, attributeMap, propertyMap } = input;
    root.innerHTML = markup;
    await new Promise((resolve) => setTimeout(resolve, 0));
    const el = root.firstElementChild;
    for (const [name, value] of Object.entries(attributeMap || {})) el.setAttribute(name, value);
    for (const [name, value] of Object.entries(propertyMap || {})) el[name] = value;
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const read = Object.fromEntries(Object.keys(propertyMap || {}).map((name) => [name, el[name]]));
    const ids = new Map();
    const html = el.innerHTML
      .replace(/\b(id|for|name|list|aria-(?:controls|labelledby|describedby|activedescendant|owns|errormessage)|data-id|data-uid|data-key)="([^"]*)"/g, (_, key, value) => {
        const tokens = value.split(' ').map((token) => {
          if (!ids.has(token)) ids.set(token, `id${ids.size}`);
          return ids.get(token);
        });
        return `${key}="${tokens.join(' ')}"`;
      });
    return { html, read: JSON.parse(JSON.stringify(read)) };
  }, { markup: html, attributeMap: attributes, propertyMap: properties });
}

for (const testCase of CASES) {
  test(`${testCase.name || testCase.tag} accepts its data as properties`, async ({ mount, page }) => {
    const errors = await collectErrors(page);
    await mount('');
    const markup = `<${testCase.tag} ${testCase.html || ''}>${testCase.inner || ''}</${testCase.tag}>`;

    const fromAttributes = await renderedHtml(page, markup, { attributes: attributeValues(testCase) });
    const fromProperties = await renderedHtml(page, markup, { properties: testCase.props });

    expect(fromProperties.html).toBe(fromAttributes.html);
    expect(Object.keys(fromProperties.read)).toEqual(Object.keys(testCase.props));
    expect(errors).toEqual([]);
  });
}

test('every data property can be assigned any value without throwing', async ({ mount, page }) => {
  const errors = await collectErrors(page);
  await mount('');
  const failures = await page.locator('#root').evaluate(async (root, cases) => {
    'use strict';
    const inputs = [[], ['a'], [1, 'b', null, {}], {}, { a: 1 }, 'a,b', 7, true, null, undefined];
    const found = [];
    const elements = cases.map((testCase) => root.appendChild(document.createElement(testCase.tag)));
    await new Promise((resolve) => setTimeout(resolve, 0));
    for (const [index, testCase] of cases.entries()) {
      const el = elements[index];
      for (const name of Object.keys(testCase.props)) {
        for (const input of inputs) {
          try { el[name] = input; } catch (error) { found.push(`${testCase.tag}.${name} = ${JSON.stringify(input)}: ${error.message}`); }
        }
      }
    }
    return found;
  }, CASES);
  await page.waitForTimeout(50);
  expect(failures).toEqual([]);
  expect(errors).toEqual([]);
});

test('w-locale-provider messages accepts an object', async ({ mount, page }) => {
  await mount('<w-locale-provider id="l" locale="en" messages=\'{"en":{"hello":"Hi"}}\'></w-locale-provider>');
  expect(await page.locator('#l').evaluate((el) => el.translate('hello'))).toBe('Hi');
  await setProperty(page, '#l', 'messages', { en: { hello: 'Hello there' } });
  expect(await page.locator('#l').evaluate((el) => el.translate('hello'))).toBe('Hello there');
  await setProperty(page, '#l', 'messages', null);
  expect(await page.locator('#l').evaluate((el) => el.translate('hello'))).toBe('Hi');
});

const DOCS = [
  { name: 'components-sparklines', route: '/docs/components/sparklines', tag: 'w-sparkline', property: 'values' },
  { name: 'layout-primitives', route: '/docs/layout-primitives', tag: 'w-chart', property: 'values' },
];

for (const docs of DOCS) {
  for (const theme of THEMES) {
    test(`${docs.route} documents the ${docs.property} property and passes axe (${theme})`, async ({ page, componentServer, duvayOs }) => {
      test.setTimeout(60000);
      await DocsPage.open(page, componentServer, { name: docs.name, route: docs.route, os: duvayOs, theme });
      const table = page.locator(`#api-${docs.tag} ~ .api-group table[data-api-kind="properties"]`);
      await expect(table.locator('tbody tr').filter({ hasText: docs.property }).first()).toContainText('number[]');
      await expect(page.locator('[w-page] pre.code-block').filter({ hasText: `.${docs.property} = [` }).first()).toBeVisible();
      await Axe.inject(page);
      expect(await Axe.violations(page, '[w-page]')).toEqual([]);
    });
  }
}
