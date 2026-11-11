import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-btn keeps the native button type unless type is set', async ({ mount, page }) => {
  await mount(`<w-btn id="plain">Plain</w-btn>
    <w-btn id="submit" type="submit">Send</w-btn>
    <w-btn id="reset" type="reset">Reset</w-btn>
    <w-btn id="bad" type="link">Bad</w-btn>`);

  await expect(page.locator('#plain button')).not.toHaveAttribute('type', /.*/);
  await expect(page.locator('#submit button')).toHaveAttribute('type', 'submit');
  await expect(page.locator('#reset button')).toHaveAttribute('type', 'reset');
  await expect(page.locator('#bad button')).not.toHaveAttribute('type', /.*/);
});

test('w-btn type="button" does not submit its form', async ({ mount, page }) => {
  await mount(`<form id="f" onsubmit="event.preventDefault(); this.dataset.submitted = 'yes'">
    <w-btn id="b" type="button">Not a submit</w-btn></form>`);

  await page.locator('#b button').click();

  await expect(page.locator('#f')).not.toHaveAttribute('data-submitted', /.*/);
});

test('w-icon-btn takes an authored type over its button default', async ({ mount, page }) => {
  await mount(`<w-icon-btn id="default" icon="home"></w-icon-btn>
    <w-icon-btn id="submit" icon="send" type="submit" aria-label="Send"></w-icon-btn>`);

  await expect(page.locator('#default button')).toHaveAttribute('type', 'button');
  await expect(page.locator('#submit button')).toHaveAttribute('type', 'submit');
});

test('w-btn link form passes target and adds noopener for a new tab', async ({ mount, page }) => {
  await mount(`<w-btn id="blank" href="/docs" target="_blank">Docs</w-btn>
    <w-btn id="kept" href="/docs" target="_blank" rel="noopener external">Docs</w-btn>
    <w-btn id="frame" href="/docs" target="preview" rel="help">Docs</w-btn>
    <w-btn id="button" target="_blank" rel="help">No link</w-btn>`);

  await expect(page.locator('#blank a')).toHaveAttribute('target', '_blank');
  await expect(page.locator('#blank a')).toHaveAttribute('rel', 'noopener');
  await expect(page.locator('#kept a')).toHaveAttribute('rel', 'noopener external');
  await expect(page.locator('#frame a')).toHaveAttribute('rel', 'help');
  await expect(page.locator('#frame a')).toHaveAttribute('target', 'preview');
  await expect(page.locator('#button button')).not.toHaveAttribute('target', /.*/);
});

test('w-btn aria-disabled stays focusable but blocks activation', async ({ mount, page }) => {
  await mount(`<form id="f" onsubmit="event.preventDefault(); this.dataset.submitted = 'yes'">
    <w-btn id="b" type="submit" aria-disabled="true">Send</w-btn></form>`);
  await recordEvents(page, '#b', ['click']);
  const control = page.locator('#b button');

  await expect(control).toHaveAttribute('aria-disabled', 'true');
  await expect(control).not.toHaveAttribute('disabled', /.*/);
  await expect(page.locator('#b')).toHaveAttribute('aria-disabled', 'true');
  await control.focus();
  await expect(control).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Space');
  await control.click({ force: true });

  await expect(page.locator('#f')).not.toHaveAttribute('data-submitted', /.*/);
  expect(await readEvents(page, '#b')).toEqual([]);
});

test('w-btn aria-disabled link does not navigate', async ({ mount, page }) => {
  await mount('<w-btn id="b" href="#moved" aria-disabled="true">Go</w-btn>');
  const link = page.locator('#b a');

  await expect(link).toHaveAttribute('aria-disabled', 'true');
  await link.click({ force: true });

  expect(await page.evaluate(() => location.hash)).toBe('');
});

test('w-btn activates again once aria-disabled is removed', async ({ mount, page }) => {
  await mount('<w-btn id="b" aria-disabled="true">Go</w-btn>');
  await recordEvents(page, '#b', ['click']);

  await page.locator('#b').evaluate((host) => host.removeAttribute('aria-disabled'));
  await page.locator('#b button').click();

  await expect(page.locator('#b button')).not.toHaveAttribute('aria-disabled', /.*/);
  expect((await readEvents(page, '#b')).length).toBe(1);
});

test('w-btn disabled and re-enabled does not leave aria-disabled behind', async ({ mount, page }) => {
  await mount('<w-btn id="b" disabled>Go</w-btn>');

  await expect(page.locator('#b')).toHaveAttribute('aria-disabled', 'true');
  await page.locator('#b').evaluate((host) => host.removeAttribute('disabled'));

  await expect(page.locator('#b')).not.toHaveAttribute('aria-disabled', /.*/);
  await expect(page.locator('#b button')).not.toHaveAttribute('aria-disabled', /.*/);
  await expect(page.locator('#b button')).toBeEnabled();
});
