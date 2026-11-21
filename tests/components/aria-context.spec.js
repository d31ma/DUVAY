import { expect, test } from '../setup/component-test.js';
import { Axe } from '../setup/axe.js';
import { DocsPage } from '../setup/docs-page.js';

/* axe.spec.js mounts one element at a time, so it cannot judge the rules that
 * need a parent (a cell needs a row, a row needs a table). These tests mount
 * the elements together, the way an author uses them. */

const CONTEXT_RULES = ['aria-required-parent', 'aria-required-children', 'aria-allowed-attr', 'aria-prohibited-attr'];

const PARTS = `<div class="w-table-wrap"><div class="w-table-grid">
  <w-data-table-headers headers="[Name,Status,Owner]"></w-data-table-headers>
  <w-data-table-rows headers="[Name,Status,Owner]" items="[Design system|Live|Avery; Billing flow|Review|Nora]"></w-data-table-rows>
</div></div>`;

async function contextViolations(page, mount, html) {
  await mount(html);
  await page.waitForTimeout(50);
  await Axe.inject(page);
  return Axe.violations(page, '#root', CONTEXT_RULES);
}

test('a w-avatar dot badge has an allowed name', async ({ page, mount }) => {
  const html = '<w-avatar id="avatar" text="AL" alt="Ada Lovelace" badge-color="success"></w-avatar>';
  expect(await contextViolations(page, mount, html)).toEqual([]);
  await expect(page.locator('#avatar .w-avatar-badge')).toHaveAttribute('role', 'img');
  await expect(page.locator('#avatar .w-avatar-badge')).toHaveAttribute('aria-label', 'success badge');
});

test('a w-avatar badge with text keeps its text readable', async ({ page, mount }) => {
  const html = '<w-avatar id="avatar" text="AL" alt="Ada Lovelace" badge-content="3"></w-avatar>';
  expect(await contextViolations(page, mount, html)).toEqual([]);
  await expect(page.locator('#avatar .w-avatar-badge')).not.toHaveAttribute('role', 'img');
  await expect(page.locator('#avatar .w-avatar-badge')).toHaveText('3');
});

test('w-data-table headers and rows sit in a table and rows', async ({ page, mount }) => {
  expect(await contextViolations(page, mount, PARTS)).toEqual([]);
  await expect(page.getByRole('table')).toHaveCount(1);
  await expect(page.getByRole('row')).toHaveCount(3);
  await expect(page.getByRole('columnheader')).toHaveCount(3);
  await expect(page.getByRole('cell')).toHaveCount(6);
});

test('a lone w-data-table-row is a row of its own table', async ({ page, mount }) => {
  const html = '<w-data-table-row headers="[Name,Status]" item="[Design|Live]" index="0"></w-data-table-row>';
  expect(await contextViolations(page, mount, html)).toEqual([]);
  await expect(page.getByRole('row')).toHaveCount(1);
  await expect(page.getByRole('cell')).toHaveCount(2);
});

test('w-data-table parts inside w-table form one table', async ({ page, mount }) => {
  const html = `<w-table grid responsive="scroll">
    <w-data-table-headers headers="[Name,Status]"></w-data-table-headers>
    <w-data-table-rows headers="[Name,Status]" items="[Design|Live; Billing|Review]"></w-data-table-rows>
  </w-table>`;
  expect(await contextViolations(page, mount, html)).toEqual([]);
  await expect(page.getByRole('table')).toHaveCount(1);
  await expect(page.getByRole('cell')).toHaveCount(4);
});

test('w-row cells inside w-table pass through the row slot', async ({ page, mount }) => {
  const html = `<w-table grid responsive="scroll">
    <w-row header><w-col cols="6">Dessert</w-col><w-col cols="6">Calories</w-col></w-row>
    <w-row><w-col cols="6">Eclair</w-col><w-col cols="6">262</w-col></w-row>
  </w-table>`;
  expect(await contextViolations(page, mount, html)).toEqual([]);
  await expect(page.getByRole('row')).toHaveCount(2);
  await expect(page.getByRole('cell')).toHaveCount(2);
});

test('the tables docs page has no ARIA context errors', async ({ page, componentServer, duvayOs }) => {
  test.setTimeout(60000);
  await DocsPage.open(page, componentServer, { name: 'tables', os: duvayOs, theme: 'light' });
  await Axe.inject(page);
  expect(await Axe.violations(page, '[w-page]', CONTEXT_RULES)).toEqual([]);
});

test('the avatars docs page has no ARIA context errors', async ({ page, componentServer, duvayOs }) => {
  test.setTimeout(60000);
  await DocsPage.open(page, componentServer, { name: 'avatars', os: duvayOs, theme: 'light' });
  await Axe.inject(page);
  expect(await Axe.violations(page, '[w-page]', CONTEXT_RULES)).toEqual([]);
});
