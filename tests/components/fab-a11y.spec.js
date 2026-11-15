import { expect, test } from '../setup/component-test.js';
import { Axe } from '../setup/axe.js';
import { DocsPage } from '../setup/docs-page.js';

async function mountCopyOfRender(page, mount, html) {
  await mount(html);
  const rendered = await page.locator('#root').innerHTML();
  await mount(rendered);
  return rendered;
}

test('a copy of a rendered icon fab keeps one button and passes axe', async ({ page, mount }) => {
  const rendered = await mountCopyOfRender(page, mount, '<w-fab icon="+" aria-label="Add"></w-fab>');
  await Axe.inject(page);

  expect(rendered).toContain('<button');
  await expect(page.locator('#root button')).toHaveCount(1);
  await expect(page.locator('#root button button')).toHaveCount(0);
  expect(await Axe.violations(page, '#root')).toEqual([]);
});

test('a copy of a rendered extended fab keeps its label once', async ({ page, mount }) => {
  await mountCopyOfRender(page, mount, '<w-fab icon="+" label="Compose">Draft</w-fab>');
  await Axe.inject(page);

  await expect(page.locator('#root button')).toHaveCount(1);
  await expect(page.locator('#root .w-fab__label')).toHaveCount(1);
  await expect(page.locator('#root button slot')).toHaveText('Draft');
  expect(await Axe.violations(page, '#root')).toEqual([]);
});

test('a copy of a rendered link fab keeps one link', async ({ page, mount }) => {
  await mountCopyOfRender(page, mount, '<w-fab icon="+" href="/new" aria-label="New"></w-fab>');
  await Axe.inject(page);

  await expect(page.locator('#root a')).toHaveCount(1);
  await expect(page.locator('#root a a, #root a button')).toHaveCount(0);
  expect(await Axe.violations(page, '#root')).toEqual([]);
});

test('the floating action buttons docs page has no nested controls', async ({ page, componentServer, duvayOs }) => {
  test.setTimeout(60000);
  await DocsPage.open(page, componentServer, { name: 'floating-action-buttons', os: duvayOs, theme: 'light' });
  await Axe.inject(page);

  await expect(page.locator('.demo-preview w-fab').first()).toBeVisible();
  await expect(page.locator('.demo-preview w-fab button button')).toHaveCount(0);
  await expect(page.locator('.demo-code').first()).toContainText('<w-fab icon="+" aria-label="Add"></w-fab>');
  expect(await Axe.violations(page, '[w-page] .demo-preview', ['nested-interactive'])).toEqual([]);
});
