import { readFileSync } from 'node:fs';
import { expect, test } from '../setup/component-test.js';

const FIXTURE = readFileSync(new URL('../fixtures/component-page.html', import.meta.url), 'utf8');
const STRICT_PAGE = '/tests/fixtures/strict-csp-page.html';
const STRICT_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
].join('; ');

// The markup is parsed by the page itself. Markup that a Playwright `evaluate`
// inserts upgrades inside the DevTools call, where Chrome does not enforce the
// page's eval rules, so the normal `mount` fixture cannot show a CSP failure.
async function openStrictCspPage(page, componentServer, html) {
  const body = FIXTURE.replace('<main id="root"></main>', `<main id="root">${html}</main>`);
  await page.route(`**${STRICT_PAGE}`, (route) => route.fulfill({
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'content-security-policy': STRICT_CSP,
    },
    body,
  }));
  const errors = [];
  const warnings = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'warning') warnings.push(message.text());
  });
  await page.goto(componentServer.url(STRICT_PAGE));
  await page.waitForFunction(() => customElements.get('w-btn') && customElements.get('w-window'));
  return { errors, warnings };
}

test('the strict CSP page really blocks eval in page code', async ({ page, componentServer }) => {
  await openStrictCspPage(page, componentServer, '<button id="b" onclick="try { new Function(\'\'); this.dataset.r = \'allowed\'; } catch (e) { this.dataset.r = e.name; }">x</button>');

  await page.locator('#b').click();
  await expect(page.locator('#b')).toHaveAttribute('data-r', 'EvalError');
});

test('w-sync-status online-text renders under a strict CSP with no page error', async ({ page, componentServer }) => {
  const { errors, warnings } = await openStrictCspPage(page, componentServer, '<w-sync-status id="s" state="online" show-online online-text="All synced"></w-sync-status>');

  await expect(page.locator('#s')).toContainText('All synced');
  expect(errors).toEqual([]);
  expect(warnings.filter((text) => text.includes('online-text'))).toEqual([]);
});

test('a handler blocked by a strict CSP is skipped with a warning and never breaks render', async ({ page, componentServer }) => {
  const { errors, warnings } = await openStrictCspPage(page, componentServer, '<w-confirm-edit id="c" label="Name" value="a" onsave="this.dataset.v = 1"></w-confirm-edit>');

  await expect(page.locator('#c input')).toHaveValue('a');
  await expect.poll(() => warnings.some((text) => text.includes('onsave'))).toBe(true);
  expect(errors).toEqual([]);
});

test('attributes that only start with "on" are never run as code', async ({ mount, page }) => {
  await mount('<w-sync-status id="s" state="online" show-online online-text="window.__pwned = 1" onfoo-bar="window.__pwned = 2" once="window.__pwned = 3"></w-sync-status>');

  await expect(page.locator('#s')).toContainText('window.__pwned = 1');
  const pwned = await page.locator('#s').evaluate((element) => {
    ['line-text', 'foo-bar', 'ce'].forEach((type) => {
      element.dispatchEvent(new CustomEvent(type, { bubbles: true }));
    });
    return window.__pwned;
  });
  expect(pwned).toBeUndefined();
});

test('on<custom> and @<custom> handlers still run', async ({ mount, page }) => {
  await mount('<w-confirm-edit id="c" label="X" value="a" onsave="this.dataset.on = event.detail.value" @save="this.dataset.at = event.detail.value"></w-confirm-edit>');

  await page.locator('#c input').fill('b');
  await page.locator('#c [data-save]').click();
  await expect(page.locator('#c')).toHaveAttribute('data-on', 'b');
  await expect(page.locator('#c')).toHaveAttribute('data-at', 'b');
});
