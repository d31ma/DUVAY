import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test as base } from './playwright.js';
import { startComponentTestServer } from './component-test-server.js';

const projectRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

export { expect };

export const test = base.extend({
  componentServer: [async ({}, use) => {
    const server = await startComponentTestServer(projectRoot);
    await use(server);
    await server.close();
  }, { scope: 'worker' }],

  mount: async ({ page, componentServer }, use) => {
    await page.goto(componentServer.url('/tests/fixtures/component-page.html'));
    await page.waitForFunction(() => customElements.get('w-btn') && customElements.get('w-window'));

    const mountComponent = async (html) => {
      await page.locator('#root').evaluate((root, nextHtml) => {
        root.innerHTML = nextHtml;
      }, html);
      await page.waitForTimeout(0);
      return page.locator('#root');
    };

    await use(mountComponent);
  },
});

export async function recordEvents(page, selector, eventNames) {
  await page.evaluate(({ selector: targetSelector, eventNames: names }) => {
    const target = document.querySelector(targetSelector);
    target.__wRecordedEvents = [];
    names.forEach((name) => {
      target.addEventListener(name, (event) => {
        target.__wRecordedEvents.push({
          type: event.type,
          detail: event.detail || null,
        });
      });
    });
  }, { selector, eventNames });
}

export async function readEvents(page, selector) {
  return page.evaluate((targetSelector) => {
    return document.querySelector(targetSelector).__wRecordedEvents || [];
  }, selector);
}
