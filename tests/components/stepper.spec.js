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
