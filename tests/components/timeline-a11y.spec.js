import { expect, test } from '../setup/component-test.js';
import { Axe } from '../setup/axe.js';
import { DocsPage } from '../setup/docs-page.js';

const TIMELINE = '<w-timeline>'
  + '<w-timeline-item time="Mon" title="Shipped v1" dot-color="success"></w-timeline-item>'
  + '<w-timeline-item time="09:00" title="Kickoff">Reviewed scope.</w-timeline-item>'
  + '</w-timeline>';

async function axeInTheme(page, theme, selector) {
  await page.evaluate((value) => document.documentElement.setAttribute('w-theme', value), theme);
  return Axe.violations(page, selector);
}

test('a copy of a rendered timeline keeps one listitem per item', async ({ page, mount }) => {
  await mount(TIMELINE);
  await mount(await page.locator('#root').innerHTML());
  await Axe.inject(page);

  await expect(page.locator('#root [role="listitem"]')).toHaveCount(2);
  await expect(page.locator('#root [role="listitem"] [role="listitem"]')).toHaveCount(0);
  expect(await Axe.violations(page, '#root')).toEqual([]);
});

test('the time label passes axe in the light theme', async ({ page, mount }) => {
  await mount(TIMELINE);
  await Axe.inject(page);

  expect(await axeInTheme(page, 'light', '#root')).toEqual([]);
});

test('the time label passes axe in the dark theme', async ({ page, mount }) => {
  await mount(TIMELINE);
  await Axe.inject(page);

  expect(await axeInTheme(page, 'dark', '#root')).toEqual([]);
});

test('the time label passes axe in the high-contrast theme', async ({ page, mount }) => {
  await mount(TIMELINE);
  await Axe.inject(page);

  expect(await axeInTheme(page, 'high-contrast', '#root')).toEqual([]);
});

test('the time label uses the AA text token', async ({ page, mount }) => {
  await mount(TIMELINE);

  const colors = await page.locator('#root .w-timeline-opposite').first().evaluate((label) => {
    const probe = document.createElement('span');
    probe.style.color = 'var(--w-text-subtle)';
    label.append(probe);
    const result = { label: getComputedStyle(label).color, token: getComputedStyle(probe).color };
    probe.remove();
    return result;
  });
  expect(colors.label).toBe(colors.token);
});

test('the timelines docs page has no nested listitems and readable time labels', async ({ page, componentServer, duvayOs }) => {
  test.setTimeout(60000);
  await DocsPage.open(page, componentServer, { name: 'timelines', os: duvayOs, theme: 'light' });
  await Axe.inject(page);

  await expect(page.locator('.demo-preview w-timeline-item').first()).toBeVisible();
  await expect(page.locator('.demo-preview [role="listitem"] [role="listitem"]')).toHaveCount(0);
  expect(await Axe.violations(page, '[w-page] .demo-preview', ['aria-required-parent', 'listitem', 'color-contrast'])).toEqual([]);
});
