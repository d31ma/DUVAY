import { expect, test } from '../setup/component-test.js';

// The base class lets `@event` and `onevent` be used interchangeably: `@event`
// is always wired by the framework, and `onevent` is wired for the framework's
// CUSTOM events (standard events stay with the browser to avoid double-firing).

test('onevent works for a custom component event (save)', async ({ mount, page }) => {
  await mount('<w-confirm-edit id="c" label="X" value="a" onsave="this.dataset.v = event.detail.value"></w-confirm-edit>');

  await page.locator('#c input').fill('b');
  await page.locator('#c [data-save]').click();
  await expect(page.locator('#c')).toHaveAttribute('data-v', 'b');
});

test('@event works for the same custom event (load)', async ({ mount, page }) => {
  await mount('<w-infinite-scroll id="s" mode="manual" @load="event.detail.done(\'empty\')"><div class="w-list"><div class="w-list-item">A</div></div></w-infinite-scroll>');
  await page.locator('#s [data-load-more]').click();
  await expect(page.locator('#s .w-infinite-scroll-empty')).toBeVisible();
});

test('onevent equivalently wires the load event', async ({ mount, page }) => {
  await mount('<w-infinite-scroll id="s" mode="manual" onload="event.detail.done(\'empty\')"><div class="w-list"><div class="w-list-item">A</div></div></w-infinite-scroll>');
  await page.locator('#s [data-load-more]').click();
  await expect(page.locator('#s .w-infinite-scroll-empty')).toBeVisible();
});

test('colon event names also fire a colon-free alias for Angular/Svelte/plain HTML', async ({ mount, page }) => {
  const headers = '[Name]';
  const items = '[A; B]';
  await mount(`<w-data-table id="dt" headers="${headers}" items="${items}" item-value="Name" show-select items-per-page="10"></w-data-table>`);

  // Bind the colon-free alias the way Angular/Svelte/`onupdate-selected` would.
  await page.locator('#dt').evaluate((el) => {
    el.addEventListener('update-selected', (e) => { el.dataset.alias = (e.detail.selected || []).join(','); });
    el.addEventListener('update:selected', (e) => { el.dataset.colon = (e.detail.selected || []).join(','); });
  });

  await page.locator('#dt tbody [data-select="A"]').check();
  await expect(page.locator('#dt')).toHaveAttribute('data-alias', 'A');
  await expect(page.locator('#dt')).toHaveAttribute('data-colon', 'A');
});

test('@ shorthand yields to a host template framework (Tac); on* still works', async ({ mount, page }) => {
  await page.evaluate(() => { window.Tac = { version: 'test' }; });
  await mount('<w-input id="i" @input="this.dataset.at=\'1\'" oninput="this.dataset.on=\'1\'"></w-input>');

  await page.locator('#i input').fill('x');
  // DuVay leaves @input to Tac (no handler bound here)…
  await expect(page.locator('#i')).not.toHaveAttribute('data-at', '1');
  // …but on* is never claimed by Tac, so it still works.
  await expect(page.locator('#i')).toHaveAttribute('data-on', '1');

  await page.evaluate(() => { delete window.Tac; });
});

test('standard events are not double-fired (onchange runs once)', async ({ mount, page }) => {
  await mount('<w-input id="i" value="a" onchange="this.dataset.n = String((+this.dataset.n || 0) + 1)"></w-input>');

  await page.locator('#i input').evaluate((input) => {
    input.value = 'b';
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await expect(page.locator('#i')).toHaveAttribute('data-n', '1');
});
