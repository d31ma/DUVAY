import { readdirSync, readFileSync } from 'node:fs';
import { expect, test } from '../setup/component-test.js';
import { Axe } from '../setup/axe.js';
import { DocsPage } from '../setup/docs-page.js';

const EXTERNAL_IMAGE = /(?:src|image|lazy-src|poster|prepend-avatar|append-avatar)="https?:\/\/[^"]+"/g;

/* Pages whose demos still load images from another host, which the site CSP
 * (img-src 'self' data:) blocks. This list may only shrink: a page that no
 * longer needs to be here fails the stale check below. */
const KNOWN = ['app-bars', 'aspect-ratios', 'components-carousels', 'images', 'parallax'];

function pagesWithExternalImages() {
  return readdirSync(DocsPage.componentsUrl).filter((name) => {
    const matches = DocsPage.content(name).match(EXTERNAL_IMAGE) || [];
    return matches.filter((match) => !match.endsWith('.js"')).length > 0;
  }).sort();
}

async function loadedImages(page) {
  await page.waitForFunction(() => [...document.querySelectorAll('.demo-preview img')]
    .every((image) => image.complete));
  return page.locator('.demo-preview img').evaluateAll((images) => images.map(
    (image) => `${image.getAttribute('src')} ${image.naturalWidth > 0}`,
  ));
}

test('no new docs page loads images from another host', async () => {
  expect(pagesWithExternalImages()).toEqual(KNOWN);
});

test('the chips docs page shows its avatar under the site CSP', async ({ page, componentServer, duvayOs }) => {
  test.setTimeout(60000);
  await DocsPage.open(page, componentServer, { name: 'chips', os: duvayOs, theme: 'light' });
  await Axe.inject(page);

  const images = await loadedImages(page);
  expect(images).toContain('/shared/assets/avatars/person-1.svg true');
  expect(images.filter((entry) => entry.endsWith(' false'))).toEqual([]);
  expect(await DocsPage.cspViolations(page)).toEqual([]);
  expect(await Axe.violations(page, '[w-page] .demo-preview', ['image-alt', 'role-img-alt'])).toEqual([]);
});

test('the avatars docs page shows its images under the site CSP', async ({ page, componentServer, duvayOs }) => {
  test.setTimeout(60000);
  await DocsPage.open(page, componentServer, { name: 'avatars', os: duvayOs, theme: 'light' });
  await Axe.inject(page);

  const images = await loadedImages(page);
  expect(images.length).toBeGreaterThanOrEqual(5);
  expect(images.filter((entry) => entry.endsWith(' false'))).toEqual([]);
  expect(await DocsPage.cspViolations(page)).toEqual([]);
  expect(await Axe.violations(page, '[w-page] .demo-preview', ['image-alt', 'role-img-alt'])).toEqual([]);
});
