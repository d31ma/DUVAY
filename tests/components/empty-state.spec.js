import { expect, readEvents, recordEvents, test } from '../setup/component-test.js';

test('w-empty renders icon, title, text, and an action button', async ({ mount, page }) => {
  await mount('<w-empty id="e" icon="X" title="No items" text="Nothing here yet." action-text="Add" justify="start"></w-empty>');

  await expect(page.locator('#e .w-empty')).toHaveClass(/w-empty--start/);
  await expect(page.locator('#e .w-empty-icon')).toHaveText('X');
  await expect(page.locator('#e .w-empty-title')).toHaveText('No items');
  await expect(page.locator('#e .w-empty-subtitle')).toHaveText('Nothing here yet.');
  await expect(page.locator('#e [w-empty-action]')).toHaveText('Add');
});

test('w-empty fires click:action for a button, and renders a link when href is set', async ({ mount, page }) => {
  await mount('<w-empty id="e" title="T" action-text="Go"></w-empty>');
  await recordEvents(page, '#e', ['click:action']);
  await page.locator('#e [w-empty-action]').click();
  expect(await readEvents(page, '#e')).toEqual([{ type: 'click:action', detail: { value: true } }]);

  await mount('<w-empty id="e2" title="T" action-text="Home" href="/home"></w-empty>');
  await expect(page.locator('#e2 a[w-empty-action]')).toHaveAttribute('href', '/home');
});

test('w-empty renders a headline and an image override', async ({ mount, page }) => {
  await mount('<w-empty id="e" headline="404" title="Lost" image="/x.png"></w-empty>');
  await expect(page.locator('#e .w-empty-headline')).toHaveText('404');
  await expect(page.locator('#e .w-empty-image')).toHaveAttribute('src', '/x.png');
});

test('w-empty-state is an alias with the same behaviour and legacy subtitle', async ({ mount, page }) => {
  await mount('<w-empty-state id="e" title="None" subtitle="Empty inbox"></w-empty-state>');
  await expect(page.locator('#e .w-empty-title')).toHaveText('None');
  await expect(page.locator('#e .w-empty-subtitle')).toHaveText('Empty inbox');
});

test('w-empty-state title is a heading and icon uses the registry', async ({ mount, page }) => {
  await page.evaluate(() => window.WIcons.set('mdi', { type: 'class', prefix: 'mdi' }));
  await mount(`<w-empty-state id="a" title="No mail" icon="mdi:inbox"></w-empty-state>
    <w-empty-state id="b" title="Level three" heading-level="3"></w-empty-state>
    <w-empty-state id="c" title="Plain" heading-level="none"></w-empty-state>
    <w-empty-state id="d"><h4 slot="title">Own heading</h4></w-empty-state>`);

  await expect(page.getByRole('heading', { name: 'No mail', level: 2 })).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Level three', level: 3 })).toHaveCount(1);
  await expect(page.locator('#c .w-empty-title')).not.toHaveAttribute('role', /./);
  await expect(page.locator('#d .w-empty-title')).not.toHaveAttribute('role', /./);
  await expect(page.getByRole('heading', { name: 'Own heading', level: 4 })).toHaveCount(1);
  await expect(page.locator('#a .w-empty-icon .mdi.inbox')).toHaveCount(1);
});
