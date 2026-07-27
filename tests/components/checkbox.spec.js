import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-checkbox reflects checked, indeterminate, disabled, name, value, and label attributes', async ({ mount, page }) => {
  await mount('<w-checkbox id="box" checked indeterminate disabled name="terms" value="yes" label="Accept"></w-checkbox>');

  const input = page.locator('#box input');
  await expect(input).toBeChecked();
  await expect(input).toBeDisabled();
  await expect(input).toHaveAttribute('name', 'terms');
  await expect(input).toHaveAttribute('value', 'yes');
  await expect(input).toHaveAttribute('aria-checked', 'mixed');
  await expect(page.locator('#box label')).toContainText('Accept');

  await page.locator('#box').evaluate((el) => {
    el.removeAttribute('disabled');
    el.removeAttribute('checked');
    el.removeAttribute('indeterminate');
    el.setAttribute('label', 'Subscribe');
  });

  await expect(input).not.toBeChecked();
  await expect(input).toBeEnabled();
  await expect(input).not.toHaveAttribute('aria-checked', 'mixed');
  await expect(page.locator('#box label')).toContainText('Subscribe');
});

test('w-checkbox toggles host state and emits change', async ({ mount, page }) => {
  await mount('<w-checkbox id="box" name="alerts" value="email">Email alerts</w-checkbox>');
  await recordEvents(page, '#box', ['change']);

  await page.locator('#box input').check();

  await expect(page.locator('#box')).toHaveAttribute('checked', '');
  expect(await readEvents(page, '#box')).toEqual([
    { type: 'change', detail: { checked: true, indeterminate: false, name: 'alerts', value: 'email' } },
  ]);
});

test('true-value and false-value drive the reported model', async ({ mount, page }) => {
  await mount('<w-checkbox id="box" name="tos" true-value="accepted" false-value="declined"></w-checkbox>');
  await recordEvents(page, '#box', ['change']);

  const input = page.locator('#box input');
  await expect(input).toHaveAttribute('value', 'accepted');

  await input.check();
  await input.uncheck();

  expect(await readEvents(page, '#box')).toEqual([
    { type: 'change', detail: { checked: true, indeterminate: false, name: 'tos', value: 'accepted' } },
    { type: 'change', detail: { checked: false, indeterminate: false, name: 'tos', value: 'declined' } },
  ]);
});

test('multiple reports every checked same-named control as an array model', async ({ mount, page }) => {
  await mount(`
    <w-checkbox id="a" multiple name="fruit" value="apple"></w-checkbox>
    <w-checkbox id="b" multiple name="fruit" value="pear"></w-checkbox>
    <w-checkbox id="c" multiple name="veg" value="leek"></w-checkbox>
  `);
  await recordEvents(page, '#b', ['change']);

  await page.locator('#a input').check();
  await page.locator('#c input').check();
  await page.locator('#b input').check();

  expect(await readEvents(page, '#b')).toEqual([
    { type: 'change', detail: { checked: true, indeterminate: false, name: 'fruit', value: ['apple', 'pear'] } },
  ]);
});

test('true/false/indeterminate icons replace the drawn mark per state', async ({ mount, page }) => {
  await mount('<w-checkbox id="box" true-icon="Y" false-icon="N" indeterminate-icon="M" label="Pick"></w-checkbox>');

  await expect(page.locator('#box label')).toHaveClass(/w-checkbox--custom-mark/);
  await expect(page.locator('#box .w-checkbox-mark--false')).toBeVisible();
  await expect(page.locator('#box .w-checkbox-mark--false')).toHaveText('N');
  await expect(page.locator('#box .w-checkbox-mark--true')).toBeHidden();

  await page.locator('#box input').check();
  await expect(page.locator('#box .w-checkbox-mark--true')).toBeVisible();
  await expect(page.locator('#box .w-checkbox-mark--false')).toBeHidden();

  await page.locator('#box').evaluate((el) => el.setAttribute('indeterminate', ''));
  await expect(page.locator('#box .w-checkbox-mark--indeterminate')).toBeVisible();
});

test('prepend-icon, append-icon, and icon-color render the affixes', async ({ mount, page }) => {
  await mount('<w-checkbox id="box" prepend-icon="P" append-icon="A" icon-color="error" label="Flagged"></w-checkbox>');

  await expect(page.locator('#box .w-selection-affix--prepend')).toHaveText('P');
  await expect(page.locator('#box .w-selection-affix--append')).toHaveText('A');

  const affixColor = (selector) => page.locator(selector).evaluate((el) => getComputedStyle(el).color);
  const tinted = await affixColor('#box .w-selection-affix--prepend');

  await mount('<w-checkbox id="d" prepend-icon="P" label="Plain"></w-checkbox>');
  expect(tinted).not.toBe(await affixColor('#d .w-selection-affix--prepend'));

  // A literal color is passed through untouched.
  await mount('<w-checkbox id="lit" prepend-icon="P" icon-color="rgb(1, 2, 3)" label="Lit"></w-checkbox>');
  expect(await affixColor('#lit .w-selection-affix--prepend')).toBe('rgb(1, 2, 3)');

  // A plain checkbox keeps its original DOM — no wrapper is emitted.
  await mount('<w-checkbox id="plain" label="Plain"></w-checkbox>');
  await expect(page.locator('#plain .w-selection-outer')).toHaveCount(0);
});

test('hint, messages, and error-messages render in the details row', async ({ mount, page }) => {
  await mount('<w-checkbox id="box" label="Ship" hint="We only ship on weekdays" messages="Free over 50,Tracked"></w-checkbox>');

  await expect(page.locator('#box .w-checkbox-hint')).toHaveText('We only ship on weekdays');
  await expect(page.locator('#box .w-checkbox-message')).toHaveCount(2);

  await page.locator('#box').evaluate((el) => {
    el.setAttribute('error-messages', 'Too heavy,Out of area');
    el.setAttribute('max-errors', '2');
  });

  await expect(page.locator('#box .w-checkbox-error')).toHaveCount(2);
  await expect(page.locator('#box .w-checkbox-error').first()).toHaveText('Too heavy');
  // The error replaces the hint unless it is persistent.
  await expect(page.locator('#box .w-checkbox-hint')).toHaveCount(0);
  await expect(page.locator('#box input')).toHaveAttribute('aria-invalid', 'true');

  await page.locator('#box').evaluate((el) => el.setAttribute('max-errors', '1'));
  await expect(page.locator('#box .w-checkbox-error')).toHaveCount(1);

  await page.locator('#box').evaluate((el) => el.setAttribute('persistent-hint', ''));
  await expect(page.locator('#box .w-checkbox-hint')).toHaveCount(1);
});

test('validate-on gates when error messages surface', async ({ mount, page }) => {
  await mount('<w-checkbox id="box" label="Terms" error-messages="Required" validate-on="blur"></w-checkbox>');

  await expect(page.locator('#box .w-checkbox-error')).toHaveCount(0);

  await page.locator('#box input').focus();
  await page.locator('#box input').blur();

  await expect(page.locator('#box .w-checkbox-error')).toHaveText('Required');
  await expect(page.locator('#box label')).toHaveClass(/w-checkbox--error/);
});

test('required reports a rule error unless validation-value overrides the model', async ({ mount, page }) => {
  await mount('<w-checkbox id="box" label="Terms" required></w-checkbox>');

  await expect(page.locator('#box .w-checkbox-error')).toHaveText('This field is required.');
  await expect(page.locator('#box input')).toHaveAttribute('required', '');

  await page.locator('#box input').check();
  await expect(page.locator('#box .w-checkbox-error')).toHaveCount(0);

  await mount('<w-checkbox id="ok" label="Terms" required validation-value="already-agreed"></w-checkbox>');
  await expect(page.locator('#ok .w-checkbox-error')).toHaveCount(0);
});

test('hide-details suppresses the details row, auto keeps it when there is content', async ({ mount, page }) => {
  await mount('<w-checkbox id="box" label="Ship" hint="Weekdays only" hide-details></w-checkbox>');
  await expect(page.locator('#box .w-checkbox-hint')).toHaveCount(0);

  await page.locator('#box').evaluate((el) => el.setAttribute('hide-details', 'auto'));
  await expect(page.locator('#box .w-checkbox-hint')).toHaveCount(1);

  await page.locator('#box').evaluate((el) => el.removeAttribute('hint'));
  await expect(page.locator('#box .w-checkbox-details')).toBeHidden();
});

test('center-affix, indent-details, inline, and hide-spin-buttons shape the surface', async ({ mount, page }) => {
  const markup = (extra) => `<w-checkbox id="box" ${extra} prepend-icon="P" label="Ship" hint="A hint that wraps"></w-checkbox>`;

  await mount(markup(''));
  const top = await page.locator('#box .w-selection-affix--prepend').evaluate((el) => el.getBoundingClientRect().top);

  await mount(markup('center-affix'));
  await expect(page.locator('#box .w-selection-outer')).toHaveClass(/w-selection--center-affix/);
  const centered = await page.locator('#box .w-selection-affix--prepend').evaluate((el) => el.getBoundingClientRect().top);
  expect(centered).toBeGreaterThan(top);

  await mount(markup('indent-details'));
  const pad = await page.locator('#box .w-checkbox-details').evaluate((el) => getComputedStyle(el).paddingInlineStart);
  expect(parseFloat(pad)).toBeGreaterThan(0);

  await mount(markup('hide-spin-buttons'));
  await expect(page.locator('#box .w-selection-outer')).toHaveClass(/w-selection--hide-spin-buttons/);

  // inline puts the details beside the label instead of under it.
  const sides = async (extra) => {
    await mount(`<w-checkbox id="i" ${extra} label="Ship" hint="Weekdays"></w-checkbox>`);
    return page.evaluate(() => ({
      label: document.querySelector('#i .w-checkbox-label').getBoundingClientRect().right,
      hint: document.querySelector('#i .w-checkbox-hint').getBoundingClientRect().left,
    }));
  };
  expect((await sides('inline')).hint).toBeGreaterThanOrEqual((await sides('inline')).label);
  const stacked = await sides('');
  expect(stacked.hint).toBeLessThan(stacked.label);
});

test('type renders the matching native control and ripple attaches to the box', async ({ mount, page }) => {
  await mount('<w-checkbox id="box" type="radio" label="One" ripple></w-checkbox>');

  await expect(page.locator('#box input')).toHaveAttribute('type', 'radio');
  await expect(page.locator('#box label')).toHaveClass(/w-radio/);
  await expect(page.locator('#box .w-checkbox-box')).toHaveClass(/w-ripple-host/);
});

test('a bare error attribute flags the error state without any text', async ({ mount, page }) => {
  await mount('<w-checkbox id="box" label="Terms" error></w-checkbox>');

  await expect(page.locator('#box label')).toHaveClass(/w-checkbox--error/);
  await expect(page.locator('#box input')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#box .w-checkbox-error')).toHaveCount(0);
});

test('w-checkbox-btn is the bare control: same surface, no details row', async ({ mount, page }) => {
  await mount('<w-checkbox-btn id="btn" name="opt" value="a" label="Option A" indeterminate hint="ignored"></w-checkbox-btn>');

  const input = page.locator('#btn input[type="checkbox"]');
  await expect(input).toHaveAttribute('name', 'opt');
  await expect(input).toHaveAttribute('value', 'a');
  await expect(input).toHaveAttribute('aria-checked', 'mixed');
  await expect(page.locator('#btn label')).toHaveClass(/w-checkbox-btn/);
  await expect(page.locator('#btn')).toContainText('Option A');
  await expect(page.locator('#btn .w-checkbox-hint')).toHaveCount(0);
});

test('validate-on input, submit, and lazy each pick their own trigger', async ({ mount, page }) => {
  await mount('<w-checkbox id="box" label="Terms" error-messages="Required" validate-on="input"></w-checkbox>');
  await expect(page.locator('#box .w-checkbox-error')).toHaveCount(0);
  await page.locator('#box input').check();
  await expect(page.locator('#box .w-checkbox-error')).toHaveText('Required');

  await mount(`
    <form id="f">
      <w-checkbox id="s" label="Terms" error-messages="Required" validate-on="submit"></w-checkbox>
      <button type="submit">Go</button>
    </form>
  `);
  await expect(page.locator('#s .w-checkbox-error')).toHaveCount(0);
  await page.locator('#f').evaluate((form) => {
    form.addEventListener('submit', (event) => event.preventDefault());
    form.requestSubmit();
  });
  await expect(page.locator('#s .w-checkbox-error')).toHaveText('Required');

  await mount('<w-checkbox id="l" label="Terms" error-messages="Required" validate-on="lazy"></w-checkbox>');
  await expect(page.locator('#l .w-checkbox-error')).toHaveCount(0);
  await page.locator('#l input').focus();
  await page.locator('#l input').blur();
  await expect(page.locator('#l .w-checkbox-error')).toHaveText('Required');
});
