import { readFileSync } from 'node:fs';

export class DocsPage {
  static assetsUrl = new URL('../../website/client/shared/assets/', import.meta.url);

  static componentsUrl = new URL('../../website/client/components/docs/', import.meta.url);

  static layoutTags = /<\/?doc-layout>/g;

  /**
   * @param {string} name
   * @returns {string}
   */
  static content(name) {
    const source = readFileSync(new URL(`${name}/tac.html`, DocsPage.componentsUrl), 'utf8');
    return source.replace(DocsPage.layoutTags, '');
  }

  /**
   * @param {import('@playwright/test').Page} page
   * @returns {Promise<void>}
   */
  static async serveSiteAssets(page) {
    await page.route('**/shared/assets/**', async (route) => {
      const name = new URL(route.request().url()).pathname.split('/shared/assets/')[1];
      await route.fulfill({ path: new URL(name, DocsPage.assetsUrl).pathname });
    });
  }

  /**
   * @param {import('@playwright/test').Page} page
   * @param {{ url: (path: string) => string }} server
   * @param {{ name: string, os: string, theme: string }} options
   * @returns {Promise<void>}
   */
  static async open(page, server, { name, os, theme }) {
    await DocsPage.serveSiteAssets(page);
    await page.addInitScript((value) => localStorage.setItem('w-theme', value), theme);
    await page.goto(server.url('/tests/fixtures/docs-page.html'));
    await page.waitForFunction(() => customElements.get('w-btn'));
    await page.evaluate(async ({ html, route, skin }) => {
      if (skin) document.documentElement.setAttribute('w-os', skin);
      history.replaceState(null, '', route);
      document.querySelector('[w-page]').innerHTML = html;
      await import('/website/site/scripts/docs.js');
    }, { html: DocsPage.content(name), route: `/docs/${name}`, skin: os });
    await page.waitForSelector('[w-api] table');
    await page.waitForTimeout(100);
  }

  /**
   * @param {import('@playwright/test').Page} page
   * @returns {Promise<string[]>}
   */
  static cspViolations(page) {
    return page.evaluate(() => window.__cspViolations);
  }
}
