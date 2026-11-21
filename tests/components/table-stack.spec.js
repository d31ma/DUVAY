import { expect, test } from '../setup/component-test.js';
import { Axe } from '../setup/axe.js';
import { DocsPage } from '../setup/docs-page.js';

/* A <w-table> around a native <table> on a phone (DUVAY-6, item 8).
 *
 * In "stack" mode, and in "auto" mode at a narrow width, rows turn into
 * label / value pairs. The wrapper's grid kept its 560px minimum width there,
 * so stacked rows still ran off the right edge of a phone screen and the page
 * scrolled sideways. "scroll" mode keeps the minimum width on purpose. */

const WIDTHS = [375, 400];
const STACKED = ['auto', 'stack'];

function nativeTable(responsive) {
  return `
    <div class="w-card"><div class="w-card-body">
      <w-table id="t" responsive="${responsive}">
        <table>
          <thead><tr><th>State</th><th>Owner</th><th>Coordinator</th><th>Note</th></tr></thead>
          <tbody>
            <tr><td>running</td><td>offline-t11-tabs-windows-lane</td><td>tachyon-build</td><td>cores 2 of 12 (weight 1)</td></tr>
            <tr><td>waiting</td><td>fylo-tier-s1</td><td>fylo</td><td>queued behind 3 jobs on the mac lane</td></tr>
          </tbody>
        </table>
      </w-table>
    </div></div>`;
}

async function layout(page) {
  return page.evaluate(() => {
    const wrap = document.querySelector('#t .w-table-wrap');
    const viewport = document.documentElement.clientWidth;
    const cells = [...document.querySelectorAll('#t td')].map((cell) => {
      const rect = cell.getBoundingClientRect();
      const label = getComputedStyle(cell, '::before').content;
      return { left: rect.left, right: rect.right, label, text: cell.textContent };
    });
    return {
      viewport,
      pageWidth: document.documentElement.scrollWidth,
      wrapScroll: wrap.scrollWidth,
      wrapClient: wrap.clientWidth,
      cells,
    };
  });
}

for (const width of WIDTHS) {
  for (const responsive of STACKED) {
    test(`w-table responsive="${responsive}" around a native table fits a ${width}px phone`, async ({ mount, page }) => {
      await page.setViewportSize({ width, height: 800 });
      await mount(nativeTable(responsive));
      await expect(page.locator('#t td').first()).toHaveAttribute('data-label', 'State');

      const result = await layout(page);
      expect(result.pageWidth).toBe(result.viewport);
      expect(result.wrapScroll).toBeLessThanOrEqual(result.wrapClient);
      for (const cell of result.cells) {
        expect(cell.left, `${cell.text} starts on screen`).toBeGreaterThanOrEqual(0);
        expect(cell.right, `${cell.text} ends on screen`).toBeLessThanOrEqual(result.viewport);
      }
      expect(result.cells.map((cell) => cell.label)).toEqual([
        '"State"', '"Owner"', '"Coordinator"', '"Note"',
        '"State"', '"Owner"', '"Coordinator"', '"Note"',
      ]);
    });
  }
}

test('w-table responsive="scroll" keeps its minimum width and scrolls inside its wrapper', async ({ mount, page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await mount(nativeTable('scroll'));
  await expect(page.locator('#t td').first()).toHaveAttribute('data-label', 'State');

  const minWidth = await page.locator('#t .w-table-grid').evaluate((grid) => getComputedStyle(grid).minWidth);
  expect(minWidth).toBe('560px');
  const result = await layout(page);
  expect(result.pageWidth).toBe(result.viewport);
  expect(result.wrapScroll).toBeGreaterThan(result.wrapClient);
});

test('a native table switched from scroll to stack drops the minimum width', async ({ mount, page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await mount(nativeTable('scroll'));
  await page.locator('#t').evaluate((table) => table.setAttribute('responsive', 'stack'));
  await expect(page.locator('#t .w-table-grid')).toHaveClass(/w-table-grid--responsive-stack/);
  const result = await layout(page);
  expect(result.wrapScroll).toBeLessThanOrEqual(result.wrapClient);
});

/* Known violations on the tables docs page at phone width. DUVAY-9 fixed the
 * last two (aria-required-parent and scrollable-region-focusable). This list
 * may only shrink: a rule that stops failing fails the test, so a fix must
 * remove it here. */
const KNOWN_DOCS_RULES = [];

for (const theme of ['light', 'dark']) {
  test(`the tables docs page passes axe on a 375px phone (${theme})`, async ({ page, componentServer, duvayOs }) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width: 375, height: 800 });
    await DocsPage.open(page, componentServer, { name: 'tables', os: duvayOs, theme });
    await Axe.inject(page);
    const violations = await Axe.violations(page, '[w-page]');
    const rules = new Set(violations.map((violation) => violation.split(' ')[0]));
    expect(violations.filter((violation) => !KNOWN_DOCS_RULES.includes(violation.split(' ')[0]))).toEqual([]);
    expect(KNOWN_DOCS_RULES.filter((rule) => !rules.has(rule)), 'stale known rules').toEqual([]);
  });
}
