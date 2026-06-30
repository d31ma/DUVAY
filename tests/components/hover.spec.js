import { expect, readEvents, recordEvents, test } from '../setup/component-test.js';

// Drive hover via the events the component listens for, rather than a real
// pointer hover, so the assertions are deterministic regardless of layout.
const enter = (page, sel) => page.locator(sel).evaluate((el) =>
  el.querySelector('[data-hover-root]').dispatchEvent(new MouseEvent('mouseenter', { bubbles: true })));

test('w-hover exposes hover state via class, attribute, and update:model-value', async ({ mount, page }) => {
  await mount('<w-hover id="h"><div class="t">Target</div></w-hover>');
  await recordEvents(page, '#h', ['update:model-value']);

  await expect(page.locator('#h [data-hover-root]')).toHaveAttribute('data-hovering', 'false');

  await enter(page, '#h');

  await expect(page.locator('#h .w-hover')).toHaveClass(/is-hovering/);
  await expect(page.locator('#h [data-hover-root]')).toHaveAttribute('data-hovering', 'true');
  await expect(page.locator('#h')).toHaveAttribute('active', '');
  expect(await readEvents(page, '#h')).toContainEqual({ type: 'update:model-value', detail: true });
});

test('w-hover disabled tracks no active state and fires no events', async ({ mount, page }) => {
  await mount('<w-hover id="h" disabled><div class="t">Target</div></w-hover>');
  await recordEvents(page, '#h', ['update:model-value', 'change']);

  await enter(page, '#h');
  await page.waitForTimeout(50);

  await expect(page.locator('#h')).not.toHaveAttribute('active', '');
  expect(await readEvents(page, '#h')).toEqual([]);
});
