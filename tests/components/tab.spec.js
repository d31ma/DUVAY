import { expect, test } from '../setup/component-test.js';

test('w-tab reflects value, active, and disabled attributes', async ({ mount, page }) => {
  await mount('<w-tab id="tab" value="inbox" active disabled>Inbox</w-tab>');

  await expect(page.locator('#tab button')).toHaveAttribute('role', 'tab');
  await expect(page.locator('#tab button')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#tab button')).toHaveClass(/active/);
  await expect(page.locator('#tab button')).toBeDisabled();
  await expect(page.locator('#tab')).toHaveAttribute('value', 'inbox');

  await page.locator('#tab').evaluate((el) => {
    el.removeAttribute('active');
    el.removeAttribute('disabled');
  });

  await expect(page.locator('#tab button')).toHaveAttribute('aria-selected', 'false');
  await expect(page.locator('#tab button')).not.toHaveClass(/active/);
  await expect(page.locator('#tab button')).toBeEnabled();
});

test('w-tab renders text, prepend/append icons, and a round icon tab', async ({ mount, page }) => {
  await mount(`
    <w-tab id="t1" value="a" text="Inbox" prepend-icon="mail" append-icon="chevron"></w-tab>
    <w-tab id="t2" value="b" icon="star">Star</w-tab>
    <w-tab id="t3" value="c" icon>Bare</w-tab>
  `);

  await expect(page.locator('#t1 .w-tab__text')).toHaveText('Inbox');
  await expect(page.locator('#t1 .w-tab-leading-icon')).toHaveText('mail');
  await expect(page.locator('#t1 .w-tab-append-icon')).toHaveText('chevron');

  // A glyph-valued `icon` both rounds the tab and becomes the leading icon.
  await expect(page.locator('#t2 .w-tab')).toHaveClass(/w-tab--icon/);
  await expect(page.locator('#t2 .w-tab-leading-icon')).toHaveText('star');

  // A bare `icon` only rounds the tab.
  await expect(page.locator('#t3 .w-tab')).toHaveClass(/w-tab--icon/);
  await expect(page.locator('#t3 .w-tab-leading-icon')).toHaveCount(0);
});

test('w-tab layout modifiers land as classes: fixed, slim, inset, spaced, vertical', async ({ mount, page }) => {
  await mount(`
    <w-tab id="t" value="a" fixed slim inset spaced="both" direction="vertical">A</w-tab>
  `);

  const cls = page.locator('#t .w-tab');
  await expect(cls).toHaveClass(/w-tab--fixed/);
  await expect(cls).toHaveClass(/w-tab--slim/);
  await expect(cls).toHaveClass(/w-tab--inset/);
  await expect(cls).toHaveClass(/w-tab--spaced-both/);
  await expect(cls).toHaveClass(/w-tab--vertical/);

  await page.locator('#t').evaluate((el) => el.setAttribute('spaced', 'nonsense'));
  await expect(page.locator('#t .w-tab')).not.toHaveClass(/w-tab--spaced-/);
});

test('w-tab size uses the named scale and falls back to a length', async ({ mount, page }) => {
  await mount(`
    <w-tab id="small" value="a" size="small">A</w-tab>
    <w-tab id="custom" value="b" size="70">B</w-tab>
    <w-tab id="len" value="c" size="4rem">C</w-tab>
  `);

  await expect(page.locator('#small .w-tab')).toHaveClass(/w-tab--small/);
  await expect(page.locator('#small .w-tab')).toHaveCSS('min-height', '36px');

  // A non-preset size becomes the tab's own sizing custom property.
  await expect(page.locator('#custom .w-tab')).not.toHaveClass(/w-tab--/);
  await expect(page.locator('#custom .w-tab')).toHaveCSS('min-height', '70px');
  await expect(page.locator('#len .w-tab')).toHaveCSS('min-height', '64px');
});

test('w-tab variant applies a distinct surface', async ({ mount, page }) => {
  await mount(`
    <w-tab id="tonal" value="a" variant="tonal">A</w-tab>
    <w-tab id="outlined" value="b" variant="outlined">B</w-tab>
    <w-tab id="bogus" value="c" variant="nope">C</w-tab>
  `);

  await expect(page.locator('#tonal .w-tab')).toHaveClass(/w-tab--tonal/);
  await expect(page.locator('#outlined .w-tab')).toHaveClass(/w-tab--outlined/);
  await expect(page.locator('#outlined .w-tab')).toHaveCSS('border-top-width', '1px');
  await expect(page.locator('#bogus .w-tab')).not.toHaveClass(/w-tab--nope/);
});

test('w-tab selected-class is applied only while the tab is active', async ({ mount, page }) => {
  await mount('<w-tab id="t" value="a" selected-class="is-on">A</w-tab>');

  await expect(page.locator('#t .w-tab')).not.toHaveClass(/is-on/);

  await page.locator('#t').evaluate((el) => el.setAttribute('active', ''));
  await expect(page.locator('#t .w-tab')).toHaveClass(/is-on/);

  await page.locator('#t').evaluate((el) => el.removeAttribute('active'));
  await expect(page.locator('#t .w-tab')).not.toHaveClass(/is-on/);
});
