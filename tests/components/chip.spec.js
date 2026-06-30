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

  await page.locator('#chip .w-chip').click();
  await expect(page.locator('#chip .w-chip')).toHaveClass(/selected/);
  await expect(page.locator('#chip .w-chip')).toHaveAttribute('aria-pressed', 'true');
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
