import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-list renders Vuetify-style items, nested groups, and selected state', async ({ mount, page }) => {
  await mount(`
    <w-list
      id="list"
      selectable
      selected='["inbox"]'
      opened='["settings"]'
      items='[
        {"type":"subheader","title":"Workspace"},
        {"title":"Inbox","value":"inbox","subtitle":"12 unread","prependIcon":"@"},
        {"type":"divider"},
        {"title":"Settings","value":"settings","children":[
          {"title":"Profile","value":"profile"},
          {"title":"Billing","value":"billing"}
        ]}
      ]'
    ></w-list>
  `);
  await recordEvents(page, '#list', ['change']);

  await expect(page.locator('#list .w-list-subheader')).toHaveText('Workspace');
  await expect(page.locator('#list w-list-item[value="inbox"] .w-list-item')).toHaveClass(/active/);
  await expect(page.locator('#list w-list-group[value="settings"] .w-list-group-items')).not.toHaveAttribute('hidden', '');

  await page.locator('#list w-list-item[value="profile"] .w-list-item').click();

  await expect(page.locator('#list')).toHaveAttribute('selected', 'profile');
  await expect(page.locator('#list w-list-item[value="profile"] .w-list-item')).toHaveAttribute('aria-selected', 'true');
  expect(await readEvents(page, '#list')).toEqual([
    { type: 'change', detail: { value: 'profile', name: 'selected', id: 'profile' } },
  ]);
});

test('w-list supports multiple selection arrays, opened updates, and keyboard navigation', async ({ mount, page }) => {
  await mount(`
    <w-list id="list" selectable multiple selected='["alpha"]'>
      <w-list-item title="Alpha" value="alpha"></w-list-item>
      <w-list-item title="Beta" value="beta"></w-list-item>
      <w-list-group title="More" value="more">
        <w-list-item title="Gamma" value="gamma"></w-list-item>
      </w-list-group>
    </w-list>
  `);
  await recordEvents(page, '#list', ['change']);

  await page.locator('#list w-list-item[value="beta"] .w-list-item').click();
  await expect(page.locator('#list')).toHaveAttribute('selected', '["alpha","beta"]');

  await page.locator('#list w-list-group .w-list-group-activator').click();
  await expect(page.locator('#list')).toHaveAttribute('opened', '["more"]');

  await page.locator('#list w-list-item[value="alpha"] .w-list-item').focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#list w-list-item[value="beta"] .w-list-item')).toBeFocused();

  expect(await readEvents(page, '#list')).toEqual([
    { type: 'change', detail: { value: ['alpha', 'beta'], name: 'selected', id: 'beta' } },
    { type: 'change', detail: { value: ['more'], name: 'opened' } },
  ]);
});

test('w-list accepts HTML-safe single-quoted array attributes', async ({ mount, page }) => {
  await mount(`
    <w-list
      id="list"
      selectable
      selected="[&#39;inbox&#39;]"
      opened="[&#39;settings&#39;]"
      items="[{&#39;title&#39;:&#39;Inbox&#39;,&#39;value&#39;:&#39;inbox&#39;},{&#39;title&#39;:&#39;Settings&#39;,&#39;value&#39;:&#39;settings&#39;,&#39;children&#39;:[{&#39;title&#39;:&#39;Profile&#39;,&#39;value&#39;:&#39;profile&#39;}]}]"
    ></w-list>
  `);

  await expect(page.locator('#list w-list-item[value="inbox"] .w-list-item')).toHaveClass(/active/);
  await expect(page.locator('#list w-list-group[value="settings"] .w-list-group-items')).not.toHaveAttribute('hidden', '');
  await expect(page.locator('#list w-list-item[value="profile"] .w-list-item-title')).toHaveText('Profile');
});
