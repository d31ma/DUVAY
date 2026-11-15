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

test('w-table exposes exactly one table for a native table and for a grid', async ({ mount, page }) => {
  await mount(`
    <w-table id="native"><table><thead><tr><th>Name</th></tr></thead><tbody><tr><td>Ana</td></tr></tbody></table></w-table>
    <w-table id="grid"><w-row header><w-col>Name</w-col></w-row><w-row><w-col>Ana</w-col></w-row></w-table>
  `);

  await expect(page.locator('#native [role="table"]')).toHaveCount(0);
  await expect(page.locator('#native').getByRole('table')).toHaveCount(1);
  await expect(page.locator('#grid [role="table"]')).toHaveCount(1);
  await expect(page.locator('#grid').getByRole('table')).toHaveCount(1);

  await page.locator('#native').evaluate((el) => el.setAttribute('striped', ''));
  await expect(page.locator('#native').getByRole('table')).toHaveCount(1);
});

async function cellLabels(page, selector) {
  return page.locator(selector).evaluateAll((cells) => cells.map((cell) => {
    const before = getComputedStyle(cell, '::before');
    return { label: cell.getAttribute('data-label'), before: before.content, display: before.display };
  }));
}

function visibleLabels(labels) {
  return labels.map((label) => ({ label, before: `"${label}"`, display: 'block' }));
}

const nativeTable = (attrs) => `
  <w-table id="table" ${attrs}>
    <table>
      <thead><tr><th>Name</th><th>Status</th><th>Owner</th></tr></thead>
      <tbody><tr><td>Design system</td><td>Live</td><td>Avery</td></tr></tbody>
    </table>
  </w-table>
`;

const gridTable = (attrs) => `
  <w-table id="table" grid ${attrs}>
    <w-row header><w-col>Name</w-col><w-col>Status</w-col></w-row>
    <w-row><w-col>Billing</w-col><w-col>Review</w-col></w-row>
  </w-table>
`;

async function appendNativeRows(page) {
  await page.locator('#table tbody').evaluate((body) => {
    body.insertAdjacentHTML('beforeend', '<tr><td>Docs</td><td>Draft</td><td>Kai</td></tr>');
    const row = document.createElement('tr');
    row.innerHTML = '<td>Tokens</td><td data-label="State">Review</td><td>Lee</td>';
    body.appendChild(row);
  });
}

async function appendGridRows(page) {
  await page.locator('#table .w-table-grid > slot').evaluate((slot) => {
    slot.insertAdjacentHTML('beforeend', '<w-row><w-col>Search</w-col><w-col>Live</w-col></w-row>');
    const row = document.createElement('w-row');
    row.innerHTML = '<w-col data-label="Area">Audit</w-col><w-col>Blocked</w-col>';
    slot.appendChild(row);
  });
}

const NATIVE_NEW_CELLS = '#table tbody tr:nth-child(n+2) td';
const GRID_NEW_CELLS = '#table w-row:nth-child(n+3) w-col';

for (const [mode, width] of [['stack', 1280], ['auto', 360]]) {
  test(`w-table labels native rows added after render (responsive ${mode}, ${width}px)`, async ({ mount, page }) => {
    await page.setViewportSize({ width, height: 720 });
    await mount(nativeTable(`responsive="${mode}"`));
    await expect(page.locator('#table tbody td').first()).toHaveAttribute('data-label', 'Name');

    await appendNativeRows(page);

    await expect.poll(() => cellLabels(page, NATIVE_NEW_CELLS)).toEqual(
      visibleLabels(['Name', 'Status', 'Owner', 'Name', 'State', 'Owner']),
    );
    await expect(page.locator('#table thead')).toBeHidden();
  });

  test(`w-table labels grid rows added after render (responsive ${mode}, ${width}px)`, async ({ mount, page }) => {
    await page.setViewportSize({ width, height: 720 });
    await mount(gridTable(`responsive="${mode}"`));
    await expect(page.locator('#table w-row:not([header]) w-col').first()).toHaveAttribute('data-label', 'Name');

    await appendGridRows(page);

    await expect.poll(() => cellLabels(page, GRID_NEW_CELLS)).toEqual(
      visibleLabels(['Name', 'Status', 'Area', 'Status']),
    );
    await expect(page.locator('#table w-row').nth(2)).toHaveAttribute('role', 'row');
    await expect(page.locator('#table w-row').nth(2).locator('w-col').first()).toHaveAttribute('role', 'cell');
  });
}

test('w-table follows header text changes but keeps author labels', async ({ mount, page }) => {
  await mount(nativeTable('responsive="stack"'));
  await appendNativeRows(page);
  await expect(page.locator('#table tbody tr').nth(2).locator('td').nth(1)).toHaveAttribute('data-label', 'State');

  await page.locator('#table thead th').nth(1).evaluate((cell) => { cell.textContent = 'Phase'; });

  await expect.poll(() => page.locator('#table tbody td').evaluateAll((cells) => cells.map((cell) => cell.getAttribute('data-label'))))
    .toEqual(['Name', 'Phase', 'Owner', 'Name', 'Phase', 'Owner', 'Name', 'State', 'Owner']);
});

test('w-table follows grid header text changes but keeps author labels', async ({ mount, page }) => {
  await mount(gridTable('responsive="stack"'));
  await appendGridRows(page);
  await expect(page.locator('#table w-row').nth(3).locator('w-col').first()).toHaveAttribute('data-label', 'Area');

  await page.locator('#table w-row[header] w-col').first().evaluate((cell) => { cell.textContent = 'Team'; });

  await expect.poll(() => page.locator('#table w-row:not([header]) w-col').evaluateAll((cells) => cells.map((cell) => cell.getAttribute('data-label'))))
    .toEqual(['Team', 'Status', 'Team', 'Status', 'Area', 'Status']);
});

test('w-table keeps labelling new rows after a re-render and after being moved', async ({ mount, page }) => {
  await mount(nativeTable('responsive="stack"'));

  await page.locator('#table').evaluate((element) => element.setAttribute('striped', ''));
  await expect(page.locator('#table table')).toHaveClass(/w-table--striped/);
  await appendNativeRows(page);
  await expect.poll(() => cellLabels(page, NATIVE_NEW_CELLS)).toEqual(
    visibleLabels(['Name', 'Status', 'Owner', 'Name', 'State', 'Owner']),
  );

  await page.locator('#table').evaluate((element) => {
    const parent = element.parentElement;
    element.remove();
    element.querySelector('tbody').insertAdjacentHTML('beforeend', '<tr><td>Offline</td><td>Added</td><td>Mo</td></tr>');
    parent.appendChild(element);
  });
  await expect(page.locator('#table tbody tr').nth(3).locator('td').nth(2)).toHaveAttribute('data-label', 'Owner');

  await page.locator('#table tbody').evaluate((body) => body.insertAdjacentHTML('beforeend', '<tr><td>Later</td><td>Added</td><td>Jo</td></tr>'));
  await expect(page.locator('#table tbody tr').nth(4).locator('td').nth(1)).toHaveAttribute('data-label', 'Status');
});
