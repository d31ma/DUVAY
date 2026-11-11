import { expect, test } from '../setup/component-test.js';

test('w-hover-card reflects attrs and opens on hover and focus', async ({ mount, page }) => {
  await mount(`
    <w-hover-card id="hover" side="bottom" inline>
      <button>Target</button>
      <span slot="content">Preview</span>
    </w-hover-card>
  `);

  await expect(page.locator('#hover .w-hover-card')).toHaveClass(/w-hover-card--bottom/);
  await expect(page.locator('#hover .w-hover-card')).toHaveClass(/w-hover-card--inline/);

  await page.locator('#hover .w-hover-card-trigger').hover();
  await expect(page.locator('#hover')).toHaveAttribute('open', '');

  await page.mouse.move(0, 0);
  await expect(page.locator('#hover')).not.toHaveAttribute('open', '');

  await page.locator('#hover button').focus();
  await expect(page.locator('#hover')).toHaveAttribute('open', '');
  await page.locator('#hover button').evaluate((el) => el.blur());
  await expect(page.locator('#hover')).not.toHaveAttribute('open', '');
});

test('w-hover-card with focusable content is a named non-modal dialog that Escape closes', async ({ mount, page }) => {
  await mount(`
    <w-hover-card id="card" side="bottom">
      <button id="trigger">Ana Lee</button>
      <span slot="content"><button id="follow">Follow</button></span>
    </w-hover-card>
  `);

  const trigger = page.locator('#trigger');
  const content = page.locator('#card .w-hover-card-content');
  await expect(content).toHaveAttribute('role', 'dialog');
  await expect(content).toHaveAttribute('aria-modal', 'false');
  await expect(content).toHaveAccessibleName('Ana Lee');
  await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(trigger).toHaveAttribute('aria-controls', await content.getAttribute('id'));
  await expect(page.locator('#card .w-hover-card-trigger')).not.toHaveAttribute('tabindex', /.*/);
  await expect(content).toHaveAttribute('inert', '');

  await trigger.focus();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(content).not.toHaveAttribute('inert', /.*/);
  await page.keyboard.press('Tab');
  await expect(page.locator('#follow')).toBeFocused();
  await expect(page.locator('#card')).toHaveAttribute('open', '');

  await page.keyboard.press('Escape');
  await expect(page.locator('#card')).not.toHaveAttribute('open', '');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('w-hover-card interactive opens on click and stays open while the pointer moves onto it', async ({ mount, page }) => {
  await mount(`
    <button id="outside">Outside</button>
    <w-hover-card id="card" interactive aria-label="Profile" side="bottom">
      <span>Ana</span>
      <span slot="content">Bio text</span>
    </w-hover-card>
  `);

  const wrapper = page.locator('#card .w-hover-card-trigger');
  await expect(wrapper).toHaveAttribute('role', 'button');
  await expect(wrapper).toHaveAttribute('tabindex', '0');
  await expect(page.locator('#card .w-hover-card-content')).toHaveAccessibleName('Profile');

  await wrapper.dispatchEvent('click');
  await expect(page.locator('#card')).toHaveAttribute('open', '');
  await page.locator('#outside').click();
  await expect(page.locator('#card')).not.toHaveAttribute('open', '');

  await wrapper.hover();
  await expect(page.locator('#card')).toHaveAttribute('open', '');
  await page.locator('#card .w-hover-card-content').hover();
  await page.waitForTimeout(300);
  await expect(page.locator('#card')).toHaveAttribute('open', '');
});

test('w-hover-card tooltip mode stays a tooltip and Escape dismisses it', async ({ mount, page }) => {
  await mount(`
    <w-hover-card id="tip">
      <span>Term</span>
      <span slot="content">Definition</span>
    </w-hover-card>
  `);

  await expect(page.locator('#tip .w-hover-card-content')).toHaveAttribute('role', 'tooltip');
  await page.locator('#tip .w-hover-card-trigger').hover();
  await expect(page.locator('#tip')).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(page.locator('#tip')).not.toHaveAttribute('open', '');
});
