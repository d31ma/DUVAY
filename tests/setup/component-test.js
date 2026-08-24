import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test as base } from './playwright.js';
import { startComponentTestServer } from './component-test-server.js';
import { coverageEnabled, createCoverageAccumulator } from './coverage.js';

const projectRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

export { expect };

export const test = base.extend({
  // Set per project in playwright.config.js. Empty string means no skin.
  duvayOs: ['', { option: true }],

  componentServer: [async ({}, use) => {
    const server = await startComponentTestServer(projectRoot);
    await use(server);
    await server.close();
  }, { scope: 'worker' }],

  coverageAccumulator: [async ({}, use, workerInfo) => {
    const accumulator = createCoverageAccumulator();
    await use(accumulator);
    if (coverageEnabled) {
      const directory = process.env.DUVAY_COVERAGE_DIR || `${projectRoot}/coverage/raw`;
      // Playwright resets worker indexes for every invocation. Include the
      // process id so a focused coverage run can augment, rather than overwrite,
      // the files produced by the full suite.
      await accumulator.write(directory, `worker-${process.pid}-${workerInfo.workerIndex}`);
    }
  }, { scope: 'worker' }],

  coverage: [async ({ page, coverageAccumulator }, use) => {
    if (!coverageEnabled) {
      await use();
      return;
    }
    await page.coverage.startJSCoverage({ resetOnNavigation: false });
    await use();
    coverageAccumulator.add(await page.coverage.stopJSCoverage());
  }, { auto: true }],

  mount: async ({ page, componentServer, coverage, duvayOs }, use) => {
    await page.goto(componentServer.url('/tests/fixtures/component-page.html'));
    await page.waitForFunction(() => customElements.get('w-btn') && customElements.get('w-window'));

    // Skins are attribute-scoped, so this is the whole switch. Set before the
    // first mount so components see their final geometry on connect.
    if (duvayOs) {
      await page.evaluate((os) => document.documentElement.setAttribute('w-os', os), duvayOs);
    }

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
