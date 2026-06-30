import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-list-group reflects title, icon, subgroup, fluid, open, and disabled attributes', async ({ mount, page }) => {
  await mount(`
    <w-list nav>
      <w-list-group id="group" title="Components" prepend-icon="*" append-icon="+" subgroup fluid open disabled>
        <w-list-item title="Lists"></w-list-item>
      </w-list-group>
    </w-list>
  `);

  await expect(page.locator('#group .w-list-group')).toHaveClass(/open/);
  await expect(page.locator('#group .w-list-group')).toHaveClass(/w-list-group--subgroup/);
  await expect(page.locator('#group .w-list-group')).toHaveClass(/w-list-group--fluid/);
  await expect(page.locator('#group .w-list-group-activator')).toBeDisabled();
  await expect(page.locator('#group .w-list-group-activator .w-list-item-title')).toHaveText('Components');
  await expect(page.locator('#group .w-list-group-activator')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#group .w-list-group-activator')).toHaveAttribute('aria-controls', /w-list-group-components/);
  await expect(page.locator('#group .w-list-group-items')).not.toHaveAttribute('hidden', '');
  const listIndent = await page.locator('#group .w-list-group-items').evaluate((el) => getComputedStyle(el).paddingLeft);
  expect(Number.parseFloat(listIndent)).toBeLessThanOrEqual(8);

  await page.locator('#group').evaluate((el) => {
    el.removeAttribute('disabled');
    el.removeAttribute('open');
    el.removeAttribute('subgroup');
    el.removeAttribute('fluid');
    el.setAttribute('title', 'Updated');
  });

  await expect(page.locator('#group .w-list-group-activator')).toBeEnabled();
  await expect(page.locator('#group .w-list-group-activator .w-list-item-title')).toHaveText('Updated');
  await expect(page.locator('#group .w-list-group-items')).toHaveAttribute('hidden', '');
});

test('w-list-group toggles icons and emits toggle', async ({ mount, page }) => {
  await mount('<w-list-group id="group" title="Components" value="components" expand-icon="+" collapse-icon="-"><w-list-item title="Lists"></w-list-item></w-list-group>');
  await recordEvents(page, '#group', ['toggle']);

  await expect(page.locator('#group .w-list-group-activator .w-list-item-append')).toHaveText('+');
  await page.locator('#group .w-list-group-activator').click();

  await expect(page.locator('#group')).toHaveAttribute('open', 'true');
  await expect(page.locator('#group .w-list-group-items')).not.toHaveAttribute('hidden', '');
  await expect(page.locator('#group .w-list-group-activator .w-list-item-append')).toHaveText('-');
  expect(await readEvents(page, '#group')).toEqual([{ type: 'toggle', detail: { open: true, value: 'components' } }]);
});
