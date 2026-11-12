import { readFileSync } from 'node:fs';
import { expect, readEvents, recordEvents, test } from '../setup/component-test.js';

const AXE = readFileSync(new URL('../../website/node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const WCAG_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

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

test('w-empty-state title attribute renders a real heading element', async ({ mount, page }) => {
  await mount(`<w-empty-state id="a" title="Nothing needs your attention"></w-empty-state>
    <w-empty-state id="b" title="Level three" heading-level="3"></w-empty-state>
    <w-empty-state id="c" title="Plain" heading-level="none"></w-empty-state>
    <w-empty-state id="d" title="Too deep" heading-level="9"></w-empty-state>
    <w-empty-state id="e"><span slot="title">Slotted words</span></w-empty-state>`);

  await expect(page.locator('#a h2.w-empty-title')).toHaveText('Nothing needs your attention');
  await expect(page.locator('#a .w-empty-title')).not.toHaveAttribute('role', /./);
  await expect(page.locator('#b h3.w-empty-title')).toHaveText('Level three');
  await expect(page.locator('#c p.w-empty-title')).toHaveText('Plain');
  await expect(page.locator('#d h6.w-empty-title')).toHaveText('Too deep');
  await expect(page.locator('#e h2.w-empty-title')).toHaveText('Slotted words');
  await expect(page.getByRole('heading', { name: 'Nothing needs your attention', level: 2 })).toHaveCount(1);
});

test('w-empty-state heading title looks the same as the paragraph title', async ({ mount, page }) => {
  await mount(`<w-empty-state id="heading" title="Same look"></w-empty-state>
    <w-empty-state id="plain" title="Same look" heading-level="none"></w-empty-state>`);
  const look = (selector) => page.locator(selector).evaluate((element) => {
    const style = getComputedStyle(element);
    return [style.fontSize, style.fontWeight, style.lineHeight, style.marginTop, style.marginBottom].join(' ');
  });
  expect(await look('#heading .w-empty-title')).toBe(await look('#plain .w-empty-title'));
});

test('w-empty-state with a heading title passes WCAG A/AA', async ({ mount, page }) => {
  await mount(`<w-empty-state title="Nothing needs your attention" text="Items that could not be sent show here."></w-empty-state>
    <w-empty-state title="Level three" heading-level="3"></w-empty-state>`);
  await page.addScriptTag({ content: AXE });
  const { violations } = await page.evaluate((tags) => window.axe.run('#root', { runOnly: { type: 'tag', values: tags } }), WCAG_AA);
  expect(violations.map((violation) => violation.id)).toEqual([]);
});
