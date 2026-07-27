import { expect, test } from '../setup/component-test.js';

// Every registered element gets mounted bare, with a spread of common
// attributes, and with slotted children. Component-specific behaviour lives in
// the per-component specs; this one exists so that no element ships with its
// template and event wiring completely unexercised.
const ATTRIBUTES = [
  'active', 'block', 'border', 'clearable', 'closable', 'dismissible', 'disabled',
  'loading', 'multiple', 'open', 'readonly', 'ripple', 'rounded', 'stacked', 'tile',
];
const VALUES = {
  color: 'primary',
  density: 'compact',
  elevation: '2',
  label: 'Label',
  location: 'top',
  max: '10',
  min: '0',
  placeholder: 'Placeholder',
  size: 'lg',
  step: '1',
  text: 'Text',
  title: 'Title',
  value: '1',
  variant: 'outlined',
};
const CHILDREN = '<span slot="prepend">P</span>Body text<span slot="append">A</span>';

test('every registered element renders bare, configured, and with slotted children', async ({ page, mount }) => {
  const tags = await page.evaluate(() => window.__wTags);
  expect(tags.length).toBeGreaterThan(100);

  let current = '';
  const errors = [];
  page.on('pageerror', (error) => errors.push(`${current}: ${error}`));

  const attributes = ATTRIBUTES.map((name) => ` ${name}`).join('')
    + Object.entries(VALUES).map(([name, value]) => ` ${name}="${value}"`).join('');

  for (const tag of tags) {
    current = tag;
    await mount(`<${tag}></${tag}>`);
    await mount(`<${tag}${attributes}>${CHILDREN}</${tag}>`);
    await mount(`<${tag} href="#anchor">${CHILDREN}</${tag}>`);
  }

  expect(errors).toEqual([]);
});

test('elements survive attribute changes after mount', async ({ page, mount }) => {
  const tags = await page.evaluate(() => window.__wTags);
  let current = '';
  const errors = [];
  page.on('pageerror', (error) => errors.push(`${current}: ${error}`));

  for (const tag of tags) {
    current = tag;
    await mount(`<${tag} id="subject">Body</${tag}>`);
    await page.evaluate((names) => {
      const element = document.querySelector('#subject');
      names.forEach((name) => element.setAttribute(name, ''));
      names.forEach((name) => element.removeAttribute(name));
    }, ATTRIBUTES);
  }

  expect(errors).toEqual([]);
});
