import { expect, test } from '../setup/component-test.js';

test('w-table defaults to responsive auto and labels native table cells', async ({ mount, page }) => {
  await mount(`
    <w-table id="table">
      <table>
        <thead><tr><th>Name</th><th>Status</th><th>Owner</th></tr></thead>
        <tbody><tr><td>Design system</td><td>Live</td><td>Avery</td></tr></tbody>
      </table>
    </w-table>
  `);

  await expect(page.locator('#table .w-table-wrap')).toHaveClass(/w-table-wrap--responsive-auto/);
  await expect(page.locator('#table table')).toHaveClass(/w-table--responsive-auto/);
  await expect(page.locator('#table tbody td').nth(0)).toHaveAttribute('data-label', 'Name');
  await expect(page.locator('#table tbody td').nth(1)).toHaveAttribute('data-label', 'Status');
  await expect(page.locator('#table tbody td').nth(2)).toHaveAttribute('data-label', 'Owner');

  await page.locator('#table').evaluate((element) => element.setAttribute('responsive', 'scroll'));
  await expect(page.locator('#table .w-table-wrap')).toHaveClass(/w-table-wrap--responsive-scroll/);
  await expect(page.locator('#table table')).not.toHaveClass(/w-table--responsive-auto/);
});

test('w-table derives mobile labels for row and column grid tables', async ({ mount, page }) => {
  await mount(`
    <w-table id="table" grid responsive="stack">
      <w-row header><w-col>Name</w-col><w-col>Status</w-col></w-row>
      <w-row><w-col>Billing</w-col><w-col>Review</w-col></w-row>
    </w-table>
  `);

  await expect(page.locator('#table .w-table-wrap')).toHaveClass(/w-table-wrap--responsive-stack/);
  await expect(page.locator('#table .w-table-grid')).toHaveClass(/w-table-grid--responsive-stack/);
  await expect(page.locator('#table w-row:not([header]) w-col').nth(0)).toHaveAttribute('data-label', 'Name');
  await expect(page.locator('#table w-row:not([header]) w-col').nth(1)).toHaveAttribute('data-label', 'Status');
});

test('w-table applies gridlines, striped odd/even and fixed-footer to native tables', async ({ mount, page }) => {
  await mount(`
    <w-table id="table" gridlines="all" striped="odd" fixed-footer hover height="200px">
      <table>
        <thead><tr><th>Name</th><th>Status</th></tr></thead>
        <tbody><tr><td>Design system</td><td>Live</td></tr></tbody>
        <tfoot><tr><td>1 item</td><td></td></tr></tfoot>
      </table>
    </w-table>
  `);

  await expect(page.locator('#table table')).toHaveClass(/w-table--gridlines-all/);
  await expect(page.locator('#table table')).toHaveClass(/w-table--striped-odd/);
  await expect(page.locator('#table table')).not.toHaveClass(/w-table--no-hover/);
  await expect(page.locator('#table .w-table-wrap')).toHaveClass(/w-table-wrap--fixed-footer/);
  await expect(page.locator('#table .w-table-wrap')).toHaveAttribute('style', /max-height: 200px/);

  await page.locator('#table').evaluate((element) => element.setAttribute('striped', 'even'));
  await expect(page.locator('#table table')).toHaveClass(/w-table--striped(?!-odd)/);
  await expect(page.locator('#table table')).not.toHaveClass(/w-table--striped-odd/);

  await page.locator('#table').evaluate((element) => element.removeAttribute('gridlines'));
  await expect(page.locator('#table table')).toHaveClass(/w-table--gridlines-horizontal/);
});

test('w-table renders top and bottom slots around the table', async ({ mount, page }) => {
  await mount(`
    <w-table id="table">
      <div slot="top">Toolbar</div>
      <table><tbody><tr><td>Row</td></tr></tbody></table>
      <div slot="bottom">Footer</div>
    </w-table>
  `);

  await expect(page.locator('#table .w-table-top')).toHaveText('Toolbar');
  await expect(page.locator('#table .w-table-bottom')).toHaveText('Footer');
  // Order: top region precedes the wrap, bottom region follows it.
  await expect(page.locator('#table > :nth-child(1)')).toHaveClass(/w-table-top/);
  await expect(page.locator('#table > :nth-child(3)')).toHaveClass(/w-table-bottom/);
});
