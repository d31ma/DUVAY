import { expect, test, readEvents, recordEvents } from '../setup/component-test.js';

test('w-chip renders Vuetify-style variants, shape, size, link, and media attrs', async ({ mount, page }) => {
  await mount(`
    <w-chip
      id="chip"
      href="/docs/chips"
      target="_blank"
      rel="noreferrer"
      color="danger"
      variant="outlined"
      size="lg"
      density="compact"
      rounded="lg"
      border
      elevation="2"
      label
      pill
      prepend-icon="#"
      append-avatar="/avatar.png"
      text="Release"
    ></w-chip>
  `);

  const chip = page.locator('#chip .w-chip');
  await expect(chip).toHaveAttribute('href', '/docs/chips');
  await expect(chip).toHaveAttribute('target', '_blank');
  await expect(chip).toHaveAttribute('rel', 'noreferrer');
  await expect(chip).toHaveClass(/w-chip-outlined/);
  await expect(chip).toHaveClass(/w-chip-error/);
  await expect(chip).toHaveClass(/w-chip--large/);
  await expect(chip).toHaveClass(/w-chip--density-compact/);
  await expect(chip).toHaveClass(/w-chip--rounded-lg/);
  await expect(chip).toHaveClass(/w-chip--border/);
  await expect(chip).toHaveClass(/w-chip--elevation-2/);
  await expect(chip).toHaveClass(/w-chip--label/);
  await expect(chip).toHaveClass(/w-chip--pill/);
  await expect(page.locator('#chip .w-chip__prepend .w-chip__icon')).toHaveText('#');
  await expect(page.locator('#chip .w-chip__append img')).toHaveAttribute('src', '/avatar.png');
  await expect(page.locator('#chip .w-chip__content')).toHaveText('Release');
});

test('w-chip toggles selected state and supports filter plus closable hidden state', async ({ mount, page }) => {
  await mount('<w-chip id="chip" value="qa" filter closable close-label="Remove chip">QA</w-chip>');
  await recordEvents(page, '#chip', ['change', 'close']);

  await page.locator('#chip .w-chip__action').click();
  await expect(page.locator('#chip .w-chip')).toHaveClass(/selected/);
  await expect(page.locator('#chip .w-chip__action')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#chip .w-chip__filter')).toBeVisible();

  let events = await readEvents(page, '#chip');
  expect(events[0]).toEqual({ type: 'change', detail: { selected: true, value: 'qa' } });

  await expect(page.locator('#chip .w-chip__close')).toHaveAttribute('aria-label', 'Remove chip');
  await page.locator('#chip .w-chip__close').click();
  await expect(page.locator('#chip .w-chip')).toHaveCount(0);
  await expect(page.locator('#chip')).toHaveAttribute('hidden', '');

  events = await readEvents(page, '#chip');
  expect(events.map((event) => event.type)).toEqual(['change', 'close']);
});

test('w-chip preserves slots and removable chips can remove themselves', async ({ mount, page }) => {
  await mount(`
    <w-chip id="chip" removable>
      <span slot="prepend" class="custom-prepend">P</span>
      Body
      <span slot="append" class="custom-append">A</span>
      <span slot="close" class="custom-close">close</span>
    </w-chip>
  `);

  await expect(page.locator('#chip .w-chip__prepend .custom-prepend')).toHaveText('P');
  await expect(page.locator('#chip .w-chip__content')).toContainText('Body');
  await expect(page.locator('#chip .w-chip__append .custom-append')).toHaveText('A');
  await expect(page.locator('#chip .w-chip__close .custom-close')).toHaveText('close');

  await page.locator('#chip .w-chip__close').click();
  await expect(page.locator('#chip')).toHaveCount(0);
});

test('w-chip-group syncs single, multiple, mandatory, and disabled selection', async ({ mount, page }) => {
  await mount(`
    <w-chip-group id="group" value="design" selected-class="is-picked">
      <w-chip value="design">Design</w-chip>
      <w-chip value="code">Code</w-chip>
      <w-chip value="docs">Docs</w-chip>
    </w-chip-group>
  `);

  await expect(page.locator('w-chip[value="design"] .w-chip')).toHaveClass(/is-picked/);
  await page.locator('w-chip[value="code"] .w-chip').click();
  await expect(page.locator('#group')).toHaveAttribute('value', 'code');
  await expect(page.locator('w-chip[value="design"] .w-chip')).not.toHaveClass(/is-picked/);
  await expect(page.locator('w-chip[value="code"] .w-chip')).toHaveClass(/is-picked/);

  await page.locator('#group').evaluate((el) => {
    el.setAttribute('multiple', '');
    el.setAttribute('value', 'design,docs');
  });
  await expect(page.locator('w-chip[value="design"] .w-chip')).toHaveClass(/is-picked/);
  await expect(page.locator('w-chip[value="docs"] .w-chip')).toHaveClass(/is-picked/);

  await page.locator('#group').evaluate((el) => el.setAttribute('disabled', ''));
  await expect(page.locator('w-chip[value="design"]')).toHaveAttribute('disabled', '');
});

test('w-chip toggles from the keyboard and closes when the close affordance is activated', async ({ mount, page }) => {
  await mount('<w-chip id="chip" value="qa" filter closable>QA</w-chip>');
  await recordEvents(page, '#chip', ['change', 'close']);
  const action = page.locator('#chip .w-chip__action');
  const pill = page.locator('#chip .w-chip');

  // Keys the chip does not own are ignored.
  await action.focus();
  await page.keyboard.press('a');
  await expect(action).toHaveAttribute('aria-pressed', 'false');

  await action.focus();
  await page.keyboard.press('Enter');
  await expect(action).toHaveAttribute('aria-pressed', 'true');
  await expect(pill).toHaveClass(/selected/);

  await action.focus();
  await page.keyboard.press(' ');
  await expect(action).toHaveAttribute('aria-pressed', 'false');
  await expect(pill).not.toHaveClass(/selected/);

  // Enter on the close button closes instead of toggling selection.
  await page.locator('#chip .w-chip__close').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#chip .w-chip')).toHaveCount(0);
  await expect(page.locator('#chip')).toHaveAttribute('hidden', '');

  const events = await readEvents(page, '#chip');
  expect(events.map((event) => event.type)).toEqual(['change', 'change', 'close']);
  expect(events.at(-1).detail).toEqual({ value: 'qa' });
});

test('w-chip close is a separate button that Tab reaches, never nested in the action', async ({ mount, page }) => {
  await mount(`
    <button id="before">Before</button>
    <w-chip id="chip" value="ana" closable close-label="Remove Ana">Ana</w-chip>
  `);
  await recordEvents(page, '#chip', ['change', 'close']);

  await expect(page.locator('#chip .w-chip')).toHaveJSProperty('localName', 'span');
  await expect(page.locator('#chip .w-chip__action .w-chip__close')).toHaveCount(0);
  await expect(page.locator('#chip button button, #chip a button')).toHaveCount(0);

  await page.locator('#before').focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Ana', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  const close = page.getByRole('button', { name: 'Remove Ana' });
  await expect(close).toBeFocused();
  await expect(close).toHaveAttribute('type', 'button');

  await page.keyboard.press('Enter');
  await expect(page.locator('#chip')).toHaveAttribute('hidden', '');
  const events = await readEvents(page, '#chip');
  expect(events.map((event) => event.type)).toEqual(['close']);
});

test('w-chip disabled closable chip disables its close button', async ({ mount, page }) => {
  await mount('<w-chip id="chip" closable disabled>Off</w-chip>');
  await expect(page.locator('#chip .w-chip__close')).toBeDisabled();
  await expect(page.locator('#chip .w-chip__action')).toBeDisabled();
});

test('w-chip static renders a non-interactive label that never toggles', async ({ mount, page }) => {
  await mount(`
    <button id="before">Before</button>
    <w-chip id="chip" static value="draft" text="Draft"></w-chip>
    <button id="after">After</button>
  `);
  await recordEvents(page, '#chip', ['change']);
  const chip = page.locator('#chip .w-chip');

  await expect(chip).toHaveJSProperty('localName', 'span');
  await expect(chip).toHaveClass(/w-chip--static/);
  await expect(chip).not.toHaveAttribute('aria-pressed', /.*/);
  await expect(chip).not.toHaveAttribute('role', /.*/);
  await expect(page.locator('#chip .w-chip__overlay')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Draft' })).toHaveCount(0);

  await chip.click();
  await expect(page.locator('#chip')).not.toHaveAttribute('selected', /.*/);
  await page.locator('#before').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#after')).toBeFocused();
  expect(await readEvents(page, '#chip')).toEqual([]);
});

test('w-chip static closable keeps one reachable close button', async ({ mount, page }) => {
  await mount('<w-chip id="chip" static removable close-label="Remove draft">Draft</w-chip>');
  await expect(page.locator('#chip .w-chip__action')).toHaveCount(0);
  await page.getByRole('button', { name: 'Remove draft' }).focus();
  await page.keyboard.press(' ');
  await expect(page.locator('#chip')).toHaveCount(0);
});

test('w-chip forwards host aria to the inner button and acts as a popup trigger', async ({ mount, page }) => {
  await mount(`
    <w-chip id="chip" value="ana" aria-label="Ana Lopez, options" aria-haspopup="menu"
      aria-expanded="false" aria-controls="ana-menu" aria-describedby="hint" closable close-label="Remove Ana">Ana</w-chip>
    <p id="hint">Recipient</p>
  `);
  await recordEvents(page, '#chip', ['change']);
  const trigger = page.getByRole('button', { name: 'Ana Lopez, options' });

  await expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(trigger).toHaveAttribute('aria-controls', 'ana-menu');
  await expect(trigger).toHaveAttribute('aria-describedby', 'hint');
  await expect(trigger).not.toHaveAttribute('aria-pressed', /.*/);

  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#chip')).not.toHaveAttribute('selected', /.*/);
  expect(await readEvents(page, '#chip')).toEqual([]);

  // The host state is patched in place, so focus stays on the trigger.
  await page.locator('#chip').evaluate((el) => el.setAttribute('aria-expanded', 'true'));
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(trigger).toBeFocused();
  await page.locator('#chip').evaluate((el) => el.removeAttribute('aria-expanded'));
  await expect(trigger).not.toHaveAttribute('aria-expanded', /.*/);
});

test('w-chip link forwards aria-current and does not toggle on Space', async ({ mount, page }) => {
  await mount('<w-chip id="chip" href="#here" aria-current="page">Here</w-chip>');
  const link = page.getByRole('link', { name: 'Here' });
  await expect(link).toHaveAttribute('aria-current', 'page');
  await expect(link).not.toHaveAttribute('aria-pressed', /.*/);
  await link.focus();
  await page.keyboard.press(' ');
  await expect(page.locator('#chip')).not.toHaveAttribute('selected', /.*/);
});

test('w-chip icons resolve through WIcons and honour icon-set', async ({ mount, page }) => {
  await page.evaluate(() => {
    window.WIcons.set('chip-test', { type: 'class', prefix: 'chip-test-' });
  });
  await mount(`
    <w-chip id="text" prepend-icon="#" append-icon="+">Text set</w-chip>
    <w-chip id="classed" icon-set="chip-test" prepend-icon="mail" closable close-icon="x">Class set</w-chip>
  `);

  await expect(page.locator('#text .w-chip__prepend .w-chip__icon')).toHaveText('#');
  await expect(page.locator('#text .w-chip__prepend .w-chip__icon')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('#text .w-chip__append .w-chip__icon')).toHaveText('+');

  const icon = page.locator('#classed .w-chip__prepend .w-chip__icon');
  await expect(icon).toHaveClass(/chip-test- mail/);
  await expect(icon).toHaveText('');
  await expect(page.locator('#classed .w-chip__close .w-chip__icon')).toHaveClass(/chip-test- x/);
});

test('w-chip space on the close affordance removes a removable chip', async ({ mount, page }) => {
  await mount('<w-chip id="chip" value="tag" removable>Tag</w-chip>');
  await page.locator('#chip .w-chip__close').focus();
  await page.keyboard.press(' ');
  await expect(page.locator('#chip')).toHaveCount(0);
});

test('w-chip selected-class follows the selection and active-class follows the route', async ({ mount, page }) => {
  const here = new URL(page.url()).pathname;
  await mount(`
    <w-chip id="pick" value="qa" selected-class="is-picked">QA</w-chip>
    <w-chip id="here" href="${here}" active-class="is-here">Here</w-chip>
    <w-chip id="away" href="/somewhere-else" active-class="is-here">Away</w-chip>
  `);

  await expect(page.locator('#pick .w-chip')).not.toHaveClass(/is-picked/);
  await page.locator('#pick .w-chip').click();
  await expect(page.locator('#pick .w-chip')).toHaveClass(/is-picked/);
  await page.locator('#pick .w-chip').click();
  await expect(page.locator('#pick .w-chip')).not.toHaveClass(/is-picked/);

  await expect(page.locator('#here .w-chip')).toHaveClass(/is-here/);
  await expect(page.locator('#away .w-chip')).not.toHaveClass(/is-here/);
});
