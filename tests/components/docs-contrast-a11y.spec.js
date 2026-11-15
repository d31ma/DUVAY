import { expect, test } from '../setup/component-test.js';
import { Axe } from '../setup/axe.js';
import { DocsPage } from '../setup/docs-page.js';

const CHROME = '[data-docs-sidebar], [w-api], [w-toc], [w-pager]';

async function chromeContrast(page, componentServer, duvayOs, theme) {
  await DocsPage.open(page, componentServer, { name: 'floating-action-buttons', os: duvayOs, theme });
  await Axe.inject(page);
  await expect(page.locator('.docs-sidebar-subhead:visible').first()).toBeVisible();
  await expect(page.locator('.docs-sidebar-note').first()).toBeAttached();
  await expect(page.locator('[w-api] thead th:visible').first()).toBeVisible();
  return Axe.violations(page, CHROME, ['color-contrast']);
}

test('docs sidebar and API table headers pass contrast in the light theme', async ({ page, componentServer, duvayOs }) => {
  test.setTimeout(60000);
  expect(await chromeContrast(page, componentServer, duvayOs, 'light')).toEqual([]);
});

test('docs sidebar and API table headers pass contrast in the dark theme', async ({ page, componentServer, duvayOs }) => {
  test.setTimeout(60000);
  expect(await chromeContrast(page, componentServer, duvayOs, 'dark')).toEqual([]);
});

test('docs sidebar and API table headers pass contrast in the high-contrast theme', async ({ page, componentServer, duvayOs }) => {
  test.setTimeout(60000);
  expect(await chromeContrast(page, componentServer, duvayOs, 'high-contrast')).toEqual([]);
});

test('docs labels use the AA text token', async ({ page, componentServer, duvayOs }) => {
  test.setTimeout(60000);
  await DocsPage.open(page, componentServer, { name: 'floating-action-buttons', os: duvayOs, theme: 'light' });

  const colors = await page.evaluate(() => {
    const probe = document.createElement('span');
    probe.style.color = 'var(--w-text-subtle)';
    document.body.append(probe);
    const token = getComputedStyle(probe).color;
    probe.remove();
    const labels = ['.docs-sidebar-subhead', '.docs-sidebar-note', '[w-api] thead th', '.docs-toc-title', '.docs-pager-rel'];
    return { token, labels: labels.map((selector) => getComputedStyle(document.querySelector(selector)).color) };
  });
  expect(colors.labels).toEqual(Array(5).fill(colors.token));
});
