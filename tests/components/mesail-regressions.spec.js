import { expect, test } from '../setup/component-test.js';

/* Cases Mesail reported against v26.35.01-1, written as Mesail's mockups use
 * the elements, so a regression shows up here even if a unit spec changes. */

test('card plain child survives re-render', async ({ mount, page }) => {
  await mount('<w-card id="c" variant="outlined"><div id="kid"><w-avatar text="AL"></w-avatar> Hello <w-chip>Tag</w-chip></div></w-card>');
  await page.locator('#c').evaluate((el) => { el.setAttribute('elevation', '2'); el.setAttribute('variant', 'tonal'); el.setAttribute('variant', 'outlined'); });
  await expect(page.locator('#kid')).toBeVisible();
  await expect(page.locator('#c slot[hidden] #kid')).toHaveCount(0);
});

test('bottom nav grow widths at 375px', async ({ mount, page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await mount('<w-bottom-navigation id="b" grow><w-bottom-nav-item icon="a" label="Inbox"></w-bottom-nav-item><w-bottom-nav-item icon="b" label="Calendar long"></w-bottom-nav-item><w-bottom-nav-item icon="c" label="Me"></w-bottom-nav-item><w-bottom-nav-item icon="d" label="Settings"></w-bottom-nav-item></w-bottom-navigation>');
  const widths = await page.locator('#b .w-bottom-nav-item').evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().width)));
  const bar = await page.locator('#b .w-bottom-navigation').evaluate((el) => { const s = getComputedStyle(el); return el.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight); });
  expect(widths.reduce((a, b) => a + b, 0)).toBeGreaterThanOrEqual(bar - 8);
  expect(Math.max(...widths) - Math.min(...widths)).toBeLessThanOrEqual(2);
});

test('nav list items are listitems', async ({ mount, page }) => {
  await mount('<w-list id="l" nav><w-list-item title="Inbox"></w-list-item><w-list-item title="Sent"></w-list-item></w-list>');
  await expect(page.locator('#l w-list-item').first()).toHaveAttribute('role', 'listitem');
});

test('avatar away dot is round and unlabelled', async ({ mount, page }) => {
  await mount('<w-avatar id="a" text="AL" alt="Ana Lee" status="away"></w-avatar>');
  const dot = page.locator('#a [class*="badge"], #a [class*="status"]').last();
  const box = await dot.boundingBox();
  expect(Math.abs(box.width - box.height)).toBeLessThanOrEqual(1);
  await expect(page.locator('#a [aria-label="warning badge"]')).toHaveCount(0);
});

test('text field copies pattern', async ({ mount, page }) => {
  await mount('<w-text-field id="t" label="Code" pattern="[0-9]{6}" inputmode="numeric" aria-describedby="h"></w-text-field><p id="h">Six digits</p>');
  const input = page.locator('#t input');
  await expect(input).toHaveAttribute('pattern', '[0-9]{6}');
  await expect(input).toHaveAttribute('inputmode', 'numeric');
  await expect(input).toHaveAttribute('aria-describedby', /h/);
});

test('hotkey mod', async ({ mount, page }) => {
  await mount('<w-hotkey id="m" keys="mod+k" platform="mac"></w-hotkey><w-hotkey id="p" keys="mod+k" platform="pc"></w-hotkey>');
  await expect(page.locator('#m kbd').first()).toHaveText('⌘');
  await expect(page.locator('#p kbd').first()).toHaveText('Ctrl');
});

test('chip close button has a 24px target and is reachable by Tab', async ({ mount, page }) => {
  await mount('<w-chip id="c" closable close-label="Remove Ana">Ana Lee</w-chip>');
  const close = page.locator('#c button.w-chip__close');
  await expect(close).toHaveAccessibleName('Remove Ana');
  const box = await close.boundingBox();
  const hit = await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.closest('button')?.className || '', { x: box.x + box.width / 2, y: box.y + box.height / 2 + 11.5 });
  expect(hit).toContain('w-chip__close');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
});

test('menu opens from an external activator', async ({ mount, page }) => {
  await mount('<button id="anchor" type="button">More</button><w-menu id="m" activator="#anchor"><w-list><w-list-item title="Archive"></w-list-item></w-list></w-menu>');
  await expect(page.locator('#m button:not(.w-list-item)')).toHaveCount(0);
  await page.locator('#anchor').click();
  await expect(page.locator('#anchor')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText('Archive')).toBeVisible();
});
