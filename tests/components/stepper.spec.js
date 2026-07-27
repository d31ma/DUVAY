import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

const STEPPER = `
  <w-stepper-header>
    <w-step value="1" label="Account"></w-step>
    <w-step value="2" label="Billing"></w-step>
    <w-step value="3" label="Confirm"></w-step>
  </w-stepper-header>
  <w-stepper-window>
    <w-stepper-window-item value="1">Panel 1</w-stepper-window-item>
    <w-stepper-window-item value="2">Panel 2</w-stepper-window-item>
    <w-stepper-window-item value="3">Panel 3</w-stepper-window-item>
  </w-stepper-window>
  <w-stepper-actions></w-stepper-actions>
`;

test('w-stepper marks active/complete steps and switches the window via actions', async ({ mount, page }) => {
  await mount(`<w-stepper id="s" value="1">${STEPPER}</w-stepper>`);
  await recordEvents(page, '#s', ['change']);

  await expect(page.locator('#s w-step[value="1"] .w-step')).toHaveClass(/active/);
  await expect(page.locator('#s w-stepper-window-item').nth(0)).toHaveClass(/active/);
  // prev disabled on the first step
  await expect(page.locator('#s [data-stepper-action="prev"]')).toBeDisabled();

  await page.locator('#s [data-stepper-action="next"]').click();
  await expect(page.locator('#s')).toHaveAttribute('value', '2');
  await expect(page.locator('#s w-step[value="2"] .w-step')).toHaveClass(/active/);
  await expect(page.locator('#s w-step[value="1"] .w-step')).toHaveClass(/done/);
  await expect(page.locator('#s w-stepper-window-item').nth(1)).toHaveClass(/active/);

  await page.locator('#s [data-stepper-action="prev"]').click();
  await expect(page.locator('#s')).toHaveAttribute('value', '1');

  expect(await readEvents(page, '#s')).toEqual([
    { type: 'change', detail: { value: '2' } },
    { type: 'change', detail: { value: '1' } },
  ]);
});

test('w-stepper headers are inert when linear and clickable when editable', async ({ mount, page }) => {
  await mount(`<w-stepper id="s" value="1">${STEPPER}</w-stepper>`);
  await page.locator('#s w-step[value="3"]').click();
  await expect(page.locator('#s')).toHaveAttribute('value', '1'); // linear: no jump

  await mount(`<w-stepper id="e" editable value="1">${STEPPER}</w-stepper>`);
  await page.locator('#e w-step[value="3"]').click();
  await expect(page.locator('#e')).toHaveAttribute('value', '3');
  await expect(page.locator('#e w-step[value="3"] .w-step')).toHaveClass(/active/);
});

test('w-step renders complete and error states', async ({ mount, page }) => {
  await mount(`
    <w-stepper id="s" value="2">
      <w-step value="1" label="A"></w-step>
      <w-step value="2" label="B"></w-step>
      <w-step value="3" label="C" error></w-step>
    </w-stepper>
  `);
  await expect(page.locator('#s w-step[value="1"] .w-step')).toHaveClass(/done/);
  await expect(page.locator('#s w-step[value="2"] .w-step')).toHaveClass(/active/);
  await expect(page.locator('#s w-step[value="3"] .w-step')).toHaveClass(/error/);
});

test('w-stepper-vertical reveals the active step content inline', async ({ mount, page }) => {
  await mount(`
    <w-stepper-vertical id="v" value="1">
      <w-stepper-vertical-item value="1" title="One">Content one</w-stepper-vertical-item>
      <w-stepper-vertical-item value="2" title="Two">Content two</w-stepper-vertical-item>
    </w-stepper-vertical>
  `);

  await expect(page.locator('#v .w-stepper')).toHaveClass(/w-stepper--vertical/);
  await expect(page.locator('#v w-stepper-vertical-item[value="1"] .w-stepper-vertical-content')).toBeVisible();
  await expect(page.locator('#v w-stepper-vertical-item[value="2"] .w-stepper-vertical-content')).toBeHidden();

  await page.locator('#v').evaluate((el) => el.setAttribute('value', '2'));
  await expect(page.locator('#v w-stepper-vertical-item[value="2"] .w-stepper-vertical-content')).toBeVisible();
  await expect(page.locator('#v w-stepper-vertical-item[value="1"] .w-stepper-vertical-content')).toBeHidden();
});

test('w-stepper flat drops the surrounding chrome', async ({ mount, page }) => {
  await mount(`<w-stepper id="s" value="1">${STEPPER}</w-stepper>`);
  const bordered = await page.locator('#s .w-stepper').evaluate((el) => getComputedStyle(el).borderTopWidth);
  expect(parseFloat(bordered)).toBeGreaterThan(0);

  await page.locator('#s').evaluate((el) => el.setAttribute('flat', ''));
  await expect(page.locator('#s .w-stepper')).toHaveClass(/w-stepper--flat/);
  const flat = await page.locator('#s .w-stepper').evaluate((el) => getComputedStyle(el).borderTopWidth);
  expect(parseFloat(flat)).toBe(0);
});

test('w-stepper items generates the step headers from data', async ({ mount, page }) => {
  await mount(`<w-stepper id="s" value="2" items='[{"title":"Account","value":"1"},{"title":"Billing","value":"2","subtitle":"Card"},{"title":"Done","value":"3","complete":true}]'></w-stepper>`);

  await expect(page.locator('#s w-stepper-item')).toHaveCount(3);
  await expect(page.locator('#s w-stepper-item[value="1"] .w-step-label')).toHaveText('Account');
  await expect(page.locator('#s w-stepper-item[value="2"] .w-step-caption')).toHaveText('Card');
  await expect(page.locator('#s w-stepper-item[value="2"] .w-step')).toHaveClass(/active/);
  await expect(page.locator('#s w-stepper-item[value="3"] .w-step')).toHaveClass(/done/);

  await page.locator('#s').evaluate((el) => el.setAttribute('items', 'One,Two'));
  await expect(page.locator('#s w-stepper-item')).toHaveCount(2);
  await expect(page.locator('#s w-stepper-item[value="1"] .w-step-label')).toHaveText('One');
});

test('w-stepper mobile and mobile-breakpoint drop the step labels', async ({ mount, page }) => {
  await mount(`<w-stepper id="s" value="1" mobile>${STEPPER}</w-stepper>`);
  await expect(page.locator('#s .w-stepper')).toHaveClass(/w-stepper--mobile/);
  await expect(page.locator('#s w-step[value="1"] .w-step-label')).toBeHidden();

  await mount(`<w-stepper id="w" value="1" mobile-breakpoint="xxl">${STEPPER}</w-stepper>`);
  await expect(page.locator('#w .w-stepper')).toHaveClass(/w-stepper--mobile/);

  await mount(`<w-stepper id="n" value="1" mobile-breakpoint="xs">${STEPPER}</w-stepper>`);
  await expect(page.locator('#n .w-stepper')).not.toHaveClass(/w-stepper--mobile/);
  await expect(page.locator('#n w-step[value="1"] .w-step-label')).toBeVisible();
});

test('w-stepper hide-actions hides the actions bar and prev-text/next-text relabel it', async ({ mount, page }) => {
  await mount(`<w-stepper id="s" value="1" prev-text="Previous" next-text="Continue">${STEPPER}</w-stepper>`);

  await expect(page.locator('#s [data-stepper-action="prev"]')).toHaveText('Previous');
  await expect(page.locator('#s [data-stepper-action="next"]')).toHaveText('Continue');

  await page.locator('#s').evaluate((el) => el.setAttribute('hide-actions', ''));
  await expect(page.locator('#s w-stepper-actions')).toBeHidden();
});

test('w-stepper mirrors selected-class and the indicator icons onto its steps', async ({ mount, page }) => {
  await mount(`
    <w-stepper id="s" value="2" editable selected-class="is-current"
               complete-icon="C" edit-icon="E" error-icon="X">
      <w-step value="1" label="A"></w-step>
      <w-step value="2" label="B"></w-step>
      <w-step value="3" label="C" error></w-step>
    </w-stepper>
  `);

  await expect(page.locator('#s w-step[value="2"] .w-step')).toHaveClass(/is-current/);
  await expect(page.locator('#s w-step[value="1"] .w-step-indicator')).toHaveText('C');
  await expect(page.locator('#s w-step[value="3"] .w-step-indicator')).toHaveText('X');
  // editable, neither complete nor errored, so the edit glyph replaces the number
  await expect(page.locator('#s w-step[value="2"] .w-step-indicator')).toHaveText('E');

  await page.locator('#s').evaluate((el) => el.removeAttribute('complete-icon'));
  await expect(page.locator('#s w-step[value="1"] .w-step-indicator')).toHaveText('✓');
});

test('w-stepper-item supports title, subtitle, icon, and ripple', async ({ mount, page }) => {
  await mount(`
    <w-stepper id="s" value="1" ripple>
      <w-stepper-item value="1" title="Account" subtitle="Who you are" icon="A"></w-stepper-item>
      <w-stepper-item value="2" title="Billing"></w-stepper-item>
    </w-stepper>
  `);

  await expect(page.locator('#s w-stepper-item[value="1"] .w-step-label')).toHaveText('Account');
  await expect(page.locator('#s w-stepper-item[value="1"] .w-step-caption')).toHaveText('Who you are');
  await expect(page.locator('#s w-stepper-item[value="1"] .w-step-indicator')).toHaveText('A');
  await expect(page.locator('#s w-stepper-item[value="1"] .w-step-indicator')).toHaveClass(/w-ripple-host/);
});

test('w-stepper multiple keeps several steps active, capped by max', async ({ mount, page }) => {
  await mount(`
    <w-stepper id="s" editable multiple max="2" value="1">
      <w-step value="1" label="A"></w-step>
      <w-step value="2" label="B"></w-step>
      <w-step value="3" label="C"></w-step>
    </w-stepper>
  `);
  await recordEvents(page, '#s', ['change']);

  await page.locator('#s w-step[value="2"]').click();
  await expect(page.locator('#s')).toHaveAttribute('value', '1,2');
  await expect(page.locator('#s w-step[value="1"] .w-step')).toHaveClass(/active/);
  await expect(page.locator('#s w-step[value="2"] .w-step')).toHaveClass(/active/);

  // max=2, so the oldest drops out
  await page.locator('#s w-step[value="3"]').click();
  await expect(page.locator('#s')).toHaveAttribute('value', '2,3');
  await expect(page.locator('#s w-step[value="1"] .w-step')).not.toHaveClass(/active/);

  // clicking an active step toggles it back off
  await page.locator('#s w-step[value="3"]').click();
  await expect(page.locator('#s')).toHaveAttribute('value', '2');

  expect((await readEvents(page, '#s')).map((event) => event.detail.value)).toEqual(['1,2', '2,3', '2']);
});

test('w-stepper focusable makes headers keyboard reachable and activatable', async ({ mount, page }) => {
  await mount(`<w-stepper id="s" value="1" editable focusable>${STEPPER}</w-stepper>`);

  const header = page.locator('#s w-step[value="3"] .w-step');
  await expect(header).toHaveAttribute('tabindex', '0');
  await expect(header).toHaveAttribute('role', 'button');

  await header.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#s')).toHaveAttribute('value', '3');
});

test('w-stepper-vertical exposes the panel surface: variant, gap, no-divider, hover', async ({ mount, page }) => {
  await mount(`
    <w-stepper-vertical id="v" value="1" variant="inset" gap="12" hover>
      <w-stepper-vertical-item value="1" title="One">Content one</w-stepper-vertical-item>
      <w-stepper-vertical-item value="2" title="Two">Content two</w-stepper-vertical-item>
    </w-stepper-vertical>
  `);

  const root = page.locator('#v .w-stepper');
  await expect(root).toHaveClass(/w-stepper--variant-inset/);
  // gap hides the connectors automatically
  await expect(root).toHaveClass(/w-stepper--no-divider/);
  const layout = await root.evaluate((el) => ({
    gap: getComputedStyle(el).rowGap,
    padding: getComputedStyle(el).paddingLeft,
  }));
  expect(layout.gap).toBe('12px');
  expect(parseFloat(layout.padding)).toBeGreaterThan(16);
  await expect(page.locator('#v w-stepper-vertical-item[value="1"] .w-step-connector')).toBeHidden();
  await expect(page.locator('#v w-stepper-vertical-item[value="1"] .w-step')).toHaveClass(/w-step--hover/);

  await page.locator('#v').evaluate((el) => el.setAttribute('variant', 'accordion'));
  await expect(root).toHaveClass(/w-stepper--variant-accordion/);
});

test('w-stepper-vertical-item renders text, chevrons, and the static modifier', async ({ mount, page }) => {
  await mount(`
    <w-stepper-vertical id="v" value="1" expand-icon="+" collapse-icon="-">
      <w-stepper-vertical-item value="1" title="One" subtitle="First" text="Body copy">Slotted</w-stepper-vertical-item>
      <w-stepper-vertical-item value="2" title="Two">Content two</w-stepper-vertical-item>
    </w-stepper-vertical>
  `);

  const first = page.locator('#v w-stepper-vertical-item[value="1"]');
  await expect(first.locator('.w-step-caption')).toHaveText('First');
  await expect(first.locator('.w-stepper-vertical-text')).toHaveText('Body copy');
  await expect(first.locator('.w-stepper-vertical-content')).toContainText('Slotted');
  await expect(first.locator('.w-stepper-vertical-chevron')).toHaveText('-');
  await expect(page.locator('#v w-stepper-vertical-item[value="2"] .w-stepper-vertical-chevron')).toHaveText('+');

  await page.locator('#v w-stepper-vertical-item[value="2"]').evaluate((el) => el.setAttribute('hide-actions', ''));
  await expect(page.locator('#v w-stepper-vertical-item[value="2"] .w-stepper-vertical-chevron')).toHaveCount(0);

  const size = async (selector) => page.locator(selector).evaluate((el) => getComputedStyle(el).fontSize);
  const grown = await size('#v w-stepper-vertical-item[value="1"] .w-step-label');
  await first.evaluate((el) => el.setAttribute('static', ''));
  const held = await size('#v w-stepper-vertical-item[value="1"] .w-step-label');
  expect(parseFloat(held)).toBeLessThan(parseFloat(grown));
});

test('w-stepper-vertical-actions drives the vertical stepper and takes its labels', async ({ mount, page }) => {
  await mount(`
    <w-stepper-vertical id="v" value="1" prev-text="Back up" next-text="Onward">
      <w-stepper-vertical-item value="1" title="One">
        <w-stepper-vertical-actions></w-stepper-vertical-actions>
      </w-stepper-vertical-item>
      <w-stepper-vertical-item value="2" title="Two">
        <w-stepper-vertical-actions></w-stepper-vertical-actions>
      </w-stepper-vertical-item>
    </w-stepper-vertical>
  `);

  const first = page.locator('#v w-stepper-vertical-item[value="1"]');
  await expect(first.locator('[data-stepper-action="next"]')).toHaveText('Onward');
  await expect(first.locator('[data-stepper-action="prev"]')).toBeDisabled();

  await first.locator('[data-stepper-action="next"]').click();
  await expect(page.locator('#v')).toHaveAttribute('value', '2');
  await expect(page.locator('#v w-stepper-vertical-item[value="2"] .w-stepper-vertical-content')).toBeVisible();

  await page.locator('#v w-stepper-vertical-item[value="2"] [data-stepper-action="prev"]').click();
  await expect(page.locator('#v')).toHaveAttribute('value', '1');
});

test('w-stepper-vertical generates its items from data', async ({ mount, page }) => {
  await mount(`<w-stepper-vertical id="v" value="2" items='["First","Second"]'></w-stepper-vertical>`);

  await expect(page.locator('#v w-stepper-vertical-item')).toHaveCount(2);
  await expect(page.locator('#v w-stepper-vertical-item[value="2"] .w-step-label')).toHaveText('Second');
  await expect(page.locator('#v w-stepper-vertical-item[value="2"] .w-stepper-vertical-content')).toBeVisible();
  await expect(page.locator('#v w-stepper-vertical-item[value="1"] .w-stepper-vertical-content')).toBeHidden();
});

const VERTICAL = `
  <w-stepper-vertical-item value="1" title="One">Content one</w-stepper-vertical-item>
  <w-stepper-vertical-item value="2" title="Two">Content two</w-stepper-vertical-item>
  <w-stepper-vertical-item value="3" title="Three">Content three</w-stepper-vertical-item>
`;

test('w-stepper-vertical editable and non-linear let a header jump to its step', async ({ mount, page }) => {
  await mount(`<w-stepper-vertical id="v" value="1">${VERTICAL}</w-stepper-vertical>`);
  await page.locator('#v w-stepper-vertical-item[value="3"] .w-step').click();
  await expect(page.locator('#v')).toHaveAttribute('value', '1');

  await mount(`<w-stepper-vertical id="e" editable value="1">${VERTICAL}</w-stepper-vertical>`);
  await page.locator('#e w-stepper-vertical-item[value="3"] .w-step').click();
  await expect(page.locator('#e')).toHaveAttribute('value', '3');
  await expect(page.locator('#e w-stepper-vertical-item[value="3"] .w-stepper-vertical-content')).toBeVisible();

  await mount(`<w-stepper-vertical id="n" non-linear value="1">${VERTICAL}</w-stepper-vertical>`);
  await page.locator('#n w-stepper-vertical-item[value="2"] .w-step').click();
  await expect(page.locator('#n')).toHaveAttribute('value', '2');
});

test('w-stepper-vertical mirrors selected-class, the indicator icons, and ripple', async ({ mount, page }) => {
  await mount(`
    <w-stepper-vertical id="v" value="2" editable ripple selected-class="is-current"
                        complete-icon="C" edit-icon="E" error-icon="X">
      <w-stepper-vertical-item value="1" title="One">One</w-stepper-vertical-item>
      <w-stepper-vertical-item value="2" title="Two">Two</w-stepper-vertical-item>
      <w-stepper-vertical-item value="3" title="Three" error>Three</w-stepper-vertical-item>
    </w-stepper-vertical>
  `);

  await expect(page.locator('#v w-stepper-vertical-item[value="2"] .w-step')).toHaveClass(/is-current/);
  await expect(page.locator('#v w-stepper-vertical-item[value="1"] .w-step-indicator')).toHaveText('C');
  await expect(page.locator('#v w-stepper-vertical-item[value="2"] .w-step-indicator')).toHaveText('E');
  await expect(page.locator('#v w-stepper-vertical-item[value="3"] .w-step-indicator')).toHaveText('X');
  await expect(page.locator('#v w-stepper-vertical-item[value="3"] .w-step')).toHaveClass(/error/);
  await expect(page.locator('#v w-stepper-vertical-item[value="1"] .w-step-indicator')).toHaveClass(/w-ripple-host/);
});

test('w-stepper-vertical-item complete and icon override the indicator', async ({ mount, page }) => {
  await mount(`
    <w-stepper-vertical id="v" value="2">
      <w-stepper-vertical-item value="1" title="One" complete>One</w-stepper-vertical-item>
      <w-stepper-vertical-item value="2" title="Two" icon="@" subtitle="Sub">Two</w-stepper-vertical-item>
      <w-stepper-vertical-item value="3" title="Three">Three</w-stepper-vertical-item>
    </w-stepper-vertical>
  `);

  await expect(page.locator('#v w-stepper-vertical-item[value="1"] .w-step-indicator')).toHaveText('✓');
  await expect(page.locator('#v w-stepper-vertical-item[value="2"] .w-step-indicator')).toHaveText('@');
  await expect(page.locator('#v w-stepper-vertical-item[value="2"] .w-step-caption')).toHaveText('Sub');
  await expect(page.locator('#v w-stepper-vertical-item[value="2"] .w-step')).toHaveClass(/active/);
  await expect(page.locator('#v w-stepper-vertical-item[value="3"] .w-step-indicator')).toHaveText('3');
});

test('w-stepper-vertical focusable makes the header and the open panel keyboard reachable', async ({ mount, page }) => {
  await mount(`<w-stepper-vertical id="v" value="1" editable focusable>${VERTICAL}</w-stepper-vertical>`);

  const header = page.locator('#v w-stepper-vertical-item[value="3"] .w-step');
  await expect(header).toHaveAttribute('role', 'button');
  await expect(header).toHaveAttribute('tabindex', '0');
  await expect(page.locator('#v w-stepper-vertical-item[value="1"] .w-stepper-vertical-content'))
    .toHaveAttribute('tabindex', '0');

  await header.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#v')).toHaveAttribute('value', '3');
});

test('w-stepper-vertical multiple keeps several panels open, capped by max', async ({ mount, page }) => {
  await mount(`<w-stepper-vertical id="v" editable multiple max="2" value="1">${VERTICAL}</w-stepper-vertical>`);

  await page.locator('#v w-stepper-vertical-item[value="2"] .w-step').click();
  await expect(page.locator('#v')).toHaveAttribute('value', '1,2');
  await expect(page.locator('#v w-stepper-vertical-item[value="1"] .w-stepper-vertical-content')).toBeVisible();
  await expect(page.locator('#v w-stepper-vertical-item[value="2"] .w-stepper-vertical-content')).toBeVisible();

  await page.locator('#v w-stepper-vertical-item[value="3"] .w-step').click();
  await expect(page.locator('#v')).toHaveAttribute('value', '2,3');
  await expect(page.locator('#v w-stepper-vertical-item[value="1"] .w-stepper-vertical-content')).toBeHidden();

  await page.locator('#v w-stepper-vertical-item[value="3"] .w-step').click();
  await expect(page.locator('#v')).toHaveAttribute('value', '2');
});

test('w-stepper-vertical mandatory always keeps one panel open', async ({ mount, page }) => {
  await mount(`<w-stepper-vertical id="v" editable multiple mandatory>${VERTICAL}</w-stepper-vertical>`);

  // With nothing selected the first item opens instead of leaving all closed.
  await expect(page.locator('#v w-stepper-vertical-item[value="1"] .w-stepper-vertical-content')).toBeVisible();

  await page.locator('#v w-stepper-vertical-item[value="2"] .w-step').click();
  await expect(page.locator('#v')).toHaveAttribute('value', '1,2');

  // Closing back down to one leaves that one open.
  await page.locator('#v w-stepper-vertical-item[value="1"] .w-step').click();
  await expect(page.locator('#v')).toHaveAttribute('value', '2');
  await page.locator('#v w-stepper-vertical-item[value="2"] .w-step').click();
  await expect(page.locator('#v')).toHaveAttribute('value', '2');
  await expect(page.locator('#v w-stepper-vertical-item[value="2"] .w-stepper-vertical-content')).toBeVisible();

  // Without mandatory the last panel can be closed.
  await mount(`<w-stepper-vertical id="o" editable multiple value="2">${VERTICAL}</w-stepper-vertical>`);
  await page.locator('#o w-stepper-vertical-item[value="2"] .w-step').click();
  await expect(page.locator('#o')).toHaveAttribute('value', '');
});

test('w-stepper-vertical supports flat, alt-labels, mobile, and hide-actions', async ({ mount, page }) => {
  await mount(`
    <w-stepper-vertical id="v" value="1" flat alt-labels mobile hide-actions>
      <w-stepper-vertical-item value="1" title="One">
        <w-stepper-vertical-actions></w-stepper-vertical-actions>
      </w-stepper-vertical-item>
      <w-stepper-vertical-item value="2" title="Two">Two</w-stepper-vertical-item>
    </w-stepper-vertical>
  `);

  const root = page.locator('#v .w-stepper');
  await expect(root).toHaveClass(/w-stepper--flat/);
  await expect(root).toHaveClass(/w-stepper--alt-labels/);
  await expect(root).toHaveClass(/w-stepper--mobile/);
  await expect(page.locator('#v w-stepper-vertical-actions')).toBeHidden();
  expect(parseFloat(await root.evaluate((el) => getComputedStyle(el).borderTopWidth))).toBe(0);

  await mount(`<w-stepper-vertical id="w" value="1" mobile-breakpoint="xxl">${VERTICAL}</w-stepper-vertical>`);
  await expect(page.locator('#w .w-stepper')).toHaveClass(/w-stepper--mobile/);
});
