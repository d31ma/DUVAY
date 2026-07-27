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

test('w-list mandatory seeds a selection and refuses to clear the last one', async ({ mount, page }) => {
  await mount(`
    <w-list id="list" selectable multiple mandatory>
      <w-list-item title="Alpha" value="alpha"></w-list-item>
      <w-list-item title="Beta" value="beta"></w-list-item>
    </w-list>
  `);

  // Nothing was selected, so the first enabled row is adopted.
  await expect(page.locator('#list')).toHaveAttribute('selected', '["alpha"]');

  await page.locator('#list w-list-item[value="alpha"] .w-list-item').click();
  await expect(page.locator('#list')).toHaveAttribute('selected', '["alpha"]');

  await page.locator('#list w-list-item[value="beta"] .w-list-item').click();
  await expect(page.locator('#list')).toHaveAttribute('selected', '["alpha","beta"]');

  await page.locator('#list w-list-item[value="alpha"] .w-list-item').click();
  await expect(page.locator('#list')).toHaveAttribute('selected', '["beta"]');
});

test('w-list active-class decorates the selected row', async ({ mount, page }) => {
  await mount(`
    <w-list id="list" selectable active-class="is-current" selected="alpha">
      <w-list-item title="Alpha" value="alpha"></w-list-item>
      <w-list-item title="Beta" value="beta"></w-list-item>
    </w-list>
  `);

  await expect(page.locator('#list w-list-item[value="alpha"] .w-list-item')).toHaveClass(/is-current/);
  await expect(page.locator('#list w-list-item[value="beta"] .w-list-item')).not.toHaveClass(/is-current/);

  await page.locator('#list w-list-item[value="beta"] .w-list-item').click();
  await expect(page.locator('#list w-list-item[value="beta"] .w-list-item')).toHaveClass(/is-current/);
  await expect(page.locator('#list w-list-item[value="alpha"] .w-list-item')).not.toHaveClass(/is-current/);
});

test('w-list filterable keeps [space] away from the rows', async ({ mount, page }) => {
  await mount(`
    <w-list id="filterable" filterable selectable>
      <w-list-item title="Alpha" value="alpha"></w-list-item>
    </w-list>
    <w-list id="plain" selectable>
      <w-list-item title="Alpha" value="alpha"></w-list-item>
    </w-list>
  `);

  await page.locator('#filterable w-list-item .w-list-item').focus();
  await page.keyboard.press(' ');
  await expect(page.locator('#filterable')).not.toHaveAttribute('selected', 'alpha');

  await page.locator('#plain w-list-item .w-list-item').focus();
  await page.keyboard.press(' ');
  await expect(page.locator('#plain')).toHaveAttribute('selected', 'alpha');
});

test('w-list navigation-strategy=track moves a visual cursor without moving focus', async ({ mount, page }) => {
  await mount(`
    <w-list id="list" navigation-strategy="track" navigation-index="0">
      <w-list-item title="Alpha" value="alpha"></w-list-item>
      <w-list-item title="Beta" value="beta"></w-list-item>
      <w-list-item title="Gamma" value="gamma"></w-list-item>
    </w-list>
  `);
  await recordEvents(page, '#list', ['update:navigationIndex']);

  const list = page.locator('#list .w-list');
  await expect(list).toHaveAttribute('role', 'listbox');
  await expect(list).toHaveAttribute('tabindex', '0');
  await expect(page.locator('#list w-list-item[value="alpha"] .w-list-item')).toHaveClass(/w-list-item--focused/);
  await expect(page.locator('#list w-list-item[value="beta"] .w-list-item')).toHaveAttribute('tabindex', '-1');

  await list.focus();
  await page.keyboard.press('ArrowDown');

  await expect(page.locator('#list')).toHaveAttribute('navigation-index', '1');
  await expect(page.locator('#list w-list-item[value="beta"] .w-list-item')).toHaveClass(/w-list-item--focused/);
  // Focus stayed on the container; only aria-activedescendant moved.
  await expect(list).toBeFocused();
  const active = await list.getAttribute('aria-activedescendant');
  expect(await page.locator('#list w-list-item[value="beta"] .w-list-item').getAttribute('id')).toBe(active);
  expect(await readEvents(page, '#list')).toEqual([
    { type: 'update:navigationIndex', detail: { value: 1 } },
  ]);
});

test('w-list items-registration=props skips a collapsed group until it opens', async ({ mount, page }) => {
  await mount(`
    <w-list
      id="list"
      items-registration="props"
      items='[{"title":"Settings","value":"settings","children":[{"title":"Profile","value":"profile"}]}]'
    ></w-list>
  `);

  await expect(page.locator('#list w-list-item[value="profile"]')).toHaveCount(0);

  await page.locator('#list w-list-group .w-list-group-activator').click();
  await expect(page.locator('#list w-list-item[value="profile"]')).toHaveCount(1);
});

test('w-list open-strategy single keeps one group open, list closes them on select', async ({ mount, page }) => {
  await mount(`
    <w-list id="single" open-strategy="single">
      <w-list-group title="One" value="one"></w-list-group>
      <w-list-group title="Two" value="two"></w-list-group>
    </w-list>
  `);

  await page.locator('#single w-list-group[value="one"] .w-list-group-activator').click();
  await expect(page.locator('#single')).toHaveAttribute('opened', '["one"]');
  await page.locator('#single w-list-group[value="two"] .w-list-group-activator').click();
  await expect(page.locator('#single')).toHaveAttribute('opened', '["two"]');
  await expect(page.locator('#single w-list-group[value="one"]')).not.toHaveAttribute('open', 'true');

  await mount(`
    <w-list id="listy" open-strategy="list" selectable>
      <w-list-item title="Alpha" value="alpha"></w-list-item>
      <w-list-group title="One" value="one"></w-list-group>
    </w-list>
  `);

  await page.locator('#listy w-list-group[value="one"] .w-list-group-activator').click();
  await expect(page.locator('#listy')).toHaveAttribute('opened', '["one"]');
  await page.locator('#listy w-list-item[value="alpha"] .w-list-item').click();
  await expect(page.locator('#listy')).toHaveAttribute('opened', '[]');
});

test('w-list select-strategy and active-strategy pick single vs multiple selection', async ({ mount, page }) => {
  await mount(`
    <w-list id="list" selectable multiple select-strategy="single-leaf">
      <w-list-item title="Alpha" value="alpha"></w-list-item>
      <w-list-item title="Beta" value="beta"></w-list-item>
    </w-list>
  `);

  await page.locator('#list w-list-item[value="alpha"] .w-list-item').click();
  await page.locator('#list w-list-item[value="beta"] .w-list-item').click();
  // single-leaf overrides `multiple`, so only the last click survives.
  await expect(page.locator('#list')).toHaveAttribute('selected', 'beta');

  await mount(`
    <w-list id="multi" activatable active-strategy="independent">
      <w-list-item title="Alpha" value="alpha"></w-list-item>
      <w-list-item title="Beta" value="beta"></w-list-item>
    </w-list>
  `);

  await page.locator('#multi w-list-item[value="alpha"] .w-list-item').click();
  await page.locator('#multi w-list-item[value="beta"] .w-list-item').click();
  await expect(page.locator('#multi')).toHaveAttribute('activated', '["alpha","beta"]');
});

test('w-list return-object hands the source item back on change', async ({ mount, page }) => {
  await mount(`
    <w-list
      id="list"
      selectable
      return-object
      items='[{"title":"Inbox","value":"inbox","subtitle":"12 unread"}]'
    ></w-list>
  `);
  await recordEvents(page, '#list', ['change']);

  await page.locator('#list w-list-item[value="inbox"] .w-list-item').click();

  expect(await readEvents(page, '#list')).toEqual([
    {
      type: 'change',
      detail: { value: { title: 'Inbox', value: 'inbox', subtitle: '12 unread' }, name: 'selected', id: 'inbox' },
    },
  ]);
});
