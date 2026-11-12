import { readFileSync } from 'node:fs';
import { expect, test } from '../setup/component-test.js';

const AXE = readFileSync(new URL('../../website/node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const WCAG_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const ANNOUNCE_WAIT_MS = 2400;
const THEMES = ['light', 'dark', 'high-contrast'];
const PHONE = { width: 375, height: 740 };

async function recordAnnouncements(page, selector) {
  await page.evaluate((target) => {
    const line = document.querySelector(`${target} .w-sync-status__live`);
    window.__announcements = [];
    new MutationObserver(() => {
      if (line.textContent) window.__announcements.push(line.textContent);
    }).observe(line, { childList: true, characterData: true, subtree: true });
  }, selector);
}

async function readAnnouncements(page) {
  await page.waitForTimeout(ANNOUNCE_WAIT_MS);
  return page.evaluate(() => window.__announcements);
}

async function setAttributes(page, values) {
  await page.evaluate((pairs) => {
    const element = document.querySelector('#s');
    Object.entries(pairs).forEach(([name, value]) => element.setAttribute(name, value));
  }, values);
}

async function todayAt(page, hours, minutes) {
  return page.evaluate(({ h, m }) => {
    const date = new Date();
    date.setHours(h, m, 0, 0);
    return date.toISOString();
  }, { h: hours, m: minutes });
}

async function runAxe(page) {
  await page.addScriptTag({ content: AXE });
  const { violations } = await page.evaluate((tags) => window.axe.run('#root', { runOnly: { type: 'tag', values: tags } }), WCAG_AA);
  return violations.map((violation) => violation.id);
}

test('w-sync-status sending shows the queue progress instead of the waiting count', async ({ mount, page }) => {
  await mount('<w-sync-status id="s" state="sending" sent="2" pending="2"></w-sync-status>');
  await expect(page.locator('#s .w-sync-status')).toHaveClass(/w-sync-status--sending/);
  await expect(page.locator('#s .w-sync-status__text')).toHaveText('Sending…·3 of 4');
  await expect(page.locator('#s .w-sync-status__part')).toHaveCount(1);
});

test('w-sync-status sending counts up as the queue empties', async ({ mount, page }) => {
  await mount('<w-sync-status id="s" state="sending" sent="0" pending="4"></w-sync-status>');
  await expect(page.locator('#s .w-sync-status__part')).toHaveText('1 of 4');
  await setAttributes(page, { sent: '3', pending: '1' });
  await expect(page.locator('#s .w-sync-status__part')).toHaveText('4 of 4');
  await setAttributes(page, { pending: '0' });
  await expect(page.locator('#s .w-sync-status__text')).toHaveText('Sending…');
});

test('w-sync-status sending takes its words and the queue text from attributes', async ({ mount, page }) => {
  await mount('<div lang="de"><w-sync-status id="s" state="sending" sent="999" pending="1001" sending-text="Senden" queue-text="{current} von {total}"></w-sync-status></div>');
  await expect(page.locator('#s .w-sync-status__text')).toHaveText('Senden·1.000 von 2.000');
});

test('w-sync-status sending spins, and stands still with reduced motion', async ({ mount, page }) => {
  await mount('<w-sync-status id="s" state="sending" pending="2"></w-sync-status>');
  await expect(page.locator('#s .w-sync-status__spinner')).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#s .w-sync-status__spinner')).toBeHidden();
  await expect(page.locator('#s .w-sync-status__still svg path')).toHaveAttribute('d', 'M12 19V5M6 11l6-6 6 6');
});

test('w-sync-status sent shows "Up to date · 4 sent" with the check icon', async ({ mount, page }) => {
  await mount('<w-sync-status id="s" state="sent" sent="4" sent-timeout="0"></w-sync-status>');
  await expect(page.locator('#s .w-sync-status')).toBeVisible();
  await expect(page.locator('#s .w-sync-status')).toHaveClass(/w-sync-status--sent/);
  await expect(page.locator('#s .w-sync-status__text')).toHaveText('Up to date·4 sent');
  await expect(page.locator('#s .w-sync-status__svg path')).toHaveAttribute('d', 'M20 6L9 17l-5-5');
});

test('w-sync-status sent hides itself after sent-timeout', async ({ mount, page }) => {
  await mount('<w-sync-status id="s" state="sent" sent="4" sent-timeout="300"></w-sync-status>');
  await expect(page.locator('#s .w-sync-status')).toBeVisible();
  await expect(page.locator('#s .w-sync-status')).toBeHidden({ timeout: 2000 });
  await expect(page.locator('#s .w-sync-status')).toHaveClass(/w-sync-status--online/);
});

test('w-sync-status sent stays about 4 seconds by default', async ({ mount, page }) => {
  await mount('<w-sync-status id="s" state="sent" sent="4"></w-sync-status>');
  await page.waitForTimeout(3000);
  await expect(page.locator('#s .w-sync-status')).toBeVisible();
  await expect(page.locator('#s .w-sync-status')).toBeHidden({ timeout: 2500 });
});

test('w-sync-status sent with show-online turns into "Up to date" after the timeout', async ({ mount, page }) => {
  await mount('<w-sync-status id="s" state="sent" sent="4" sent-timeout="200" show-online></w-sync-status>');
  await expect(page.locator('#s .w-sync-status__text')).toHaveText('Up to date', { timeout: 2000 });
  await expect(page.locator('#s .w-sync-status')).toBeVisible();
});

test('w-sync-status sent shows again for the next round', async ({ mount, page }) => {
  await mount('<w-sync-status id="s" state="sent" sent="4" sent-timeout="200"></w-sync-status>');
  await expect(page.locator('#s .w-sync-status')).toBeHidden({ timeout: 2000 });
  await setAttributes(page, { state: 'sending', sent: '0', pending: '2' });
  await setAttributes(page, { state: 'sent', sent: '2', pending: '0' });
  await expect(page.locator('#s .w-sync-status__text')).toHaveText('Up to date·2 sent');
  await expect(page.locator('#s .w-sync-status')).toBeHidden({ timeout: 2000 });
});

test('w-sync-status sent with items that need attention shows both counts and stays', async ({ mount, page }) => {
  await mount('<w-sync-status id="s" state="sent" sent="3" attention="1" sent-timeout="200"><w-btn slot="actions">Review</w-btn></w-sync-status>');
  await expect(page.locator('#s .w-sync-status__text')).toHaveText('Up to date·Needs your attention: 1·3 others sent');
  await page.waitForTimeout(600);
  await expect(page.locator('#s .w-sync-status')).toBeVisible();
  await setAttributes(page, { attention: '0' });
  await expect(page.locator('#s .w-sync-status')).toBeHidden({ timeout: 2000 });
});

test('w-sync-status shows the mockup line "1 item needs your attention · 3 others sent"', async ({ mount, page }) => {
  await mount(`<w-sync-status id="s" state="sent" sent="3" attention="1" online-text=""
    attention-text-one="{count} item needs your attention" attention-text-other="{count} items need your attention"></w-sync-status>`);
  await expect(page.locator('#s .w-sync-status__text')).toHaveText('1 item needs your attention·3 others sent');
  await expect(page.locator('#s .w-sync-status__state')).toHaveCount(0);
  await expect(page.locator('#s .w-sync-status__separator')).toHaveCount(1);
});

test('w-sync-status announces the sent summary once', async ({ mount, page }) => {
  await mount('<w-sync-status id="s" state="sending" sent="3" pending="1" sent-timeout="500"></w-sync-status>');
  await recordAnnouncements(page, '#s');
  await setAttributes(page, { state: 'sent', sent: '4', pending: '0' });
  expect(await readAnnouncements(page)).toEqual(['Up to date. 4 sent.']);
  await setAttributes(page, { sent: '5' });
  expect(await readAnnouncements(page)).toEqual(['Up to date. 4 sent.']);
  await expect(page.locator('#s .w-sync-status')).toBeHidden();
});

test('w-sync-status makes one announcement per state change through a whole round', async ({ mount, page }) => {
  await mount('<w-sync-status id="s" state="online" sent-timeout="0"></w-sync-status>');
  await recordAnnouncements(page, '#s');
  await setAttributes(page, { state: 'offline', pending: '2' });
  expect(await readAnnouncements(page)).toEqual(['Offline']);
  await setAttributes(page, { state: 'syncing' });
  expect(await readAnnouncements(page)).toEqual(['Offline', 'Back online']);
  await setAttributes(page, { state: 'sending', sent: '0' });
  await setAttributes(page, { sent: '1', pending: '1' });
  expect(await readAnnouncements(page)).toEqual(['Offline', 'Back online']);
  await setAttributes(page, { state: 'sent', sent: '2', pending: '0' });
  expect(await readAnnouncements(page)).toEqual(['Offline', 'Back online', 'Up to date. 2 sent.']);
  await setAttributes(page, { state: 'online' });
  expect(await readAnnouncements(page)).toEqual(['Offline', 'Back online', 'Up to date. 2 sent.']);
});

test('w-sync-status does not announce a sent summary on first render or with nothing sent', async ({ mount, page }) => {
  await mount('<w-sync-status id="s" state="sent" sent="4" sent-timeout="0"></w-sync-status><w-sync-status id="z" state="sending"></w-sync-status>');
  await recordAnnouncements(page, '#s');
  expect(await readAnnouncements(page)).toEqual([]);
  await page.evaluate(() => {
    window.__zero = [];
    const line = document.querySelector('#z .w-sync-status__live');
    new MutationObserver(() => { if (line.textContent) window.__zero.push(line.textContent); }).observe(line, { childList: true, characterData: true, subtree: true });
    document.querySelector('#z').setAttribute('state', 'sent');
  });
  await page.waitForTimeout(ANNOUNCE_WAIT_MS);
  expect(await page.evaluate(() => window.__zero)).toEqual([]);
});

test('w-sync-status announces offline and locked with their own texts and the time', async ({ mount, page }) => {
  const iso = await todayAt(page, 8, 12);
  await mount(`<div lang="en-GB"><w-sync-status id="s" updated-at="${iso}"
    offline-announce-text="Offline. Showing the copy on this device, updated {time}."
    locked-announce-text="Locked since {time}. Sign in."></w-sync-status></div>`);
  await recordAnnouncements(page, '#s');
  await setAttributes(page, { state: 'offline' });
  expect(await readAnnouncements(page)).toEqual(['Offline. Showing the copy on this device, updated 08:12.']);
  await expect(page.locator('#s .w-sync-status__state')).toHaveText('Offline');
  await setAttributes(page, { state: 'locked' });
  expect(await readAnnouncements(page)).toEqual(['Offline. Showing the copy on this device, updated 08:12.', 'Locked since 08:12. Sign in.']);
});

test('w-sync-status announce texts with {time} fall back to the state words when there is no time', async ({ mount, page }) => {
  await mount('<w-sync-status id="s" offline-text="Hors ligne" offline-announce-text="Hors ligne, mis à jour {time}."></w-sync-status>');
  await recordAnnouncements(page, '#s');
  await setAttributes(page, { state: 'offline' });
  expect(await readAnnouncements(page)).toEqual(['Hors ligne']);
});

test('w-sync-status announce texts without {time} are used as they are', async ({ mount, page }) => {
  await mount('<w-sync-status id="s" offline-announce-text="You are offline."></w-sync-status>');
  await recordAnnouncements(page, '#s');
  await setAttributes(page, { state: 'offline' });
  expect(await readAnnouncements(page)).toEqual(['You are offline.']);
});

test('w-sync-status syncing says "Getting changes since {time}" with syncing-updated-text', async ({ mount, page }) => {
  const iso = await todayAt(page, 8, 12);
  await mount(`<div lang="en-GB">
    <w-sync-status id="s" state="syncing" updated-at="${iso}" syncing-text="Updating" syncing-updated-text="Getting changes since {time}"></w-sync-status>
    <w-sync-status id="o" state="offline" updated-at="${iso}" syncing-updated-text="Getting changes since {time}"></w-sync-status>
    <w-sync-status id="d" state="syncing" updated-at="${iso}"></w-sync-status>
  </div>`);
  await expect(page.locator('#s .w-sync-status__text')).toHaveText('Updating·Getting changes since 08:12');
  await expect(page.locator('#o .w-sync-status__part')).toHaveText('updated 08:12');
  await expect(page.locator('#d .w-sync-status__part')).toHaveText('updated 08:12');
});

test('w-sync-status draws a thin progress line while syncing or sending', async ({ mount, page }) => {
  await mount(`<div style="width: 400px">
    <w-sync-status id="s" state="syncing" progress="0.5"></w-sync-status>
    <w-sync-status id="q" state="sending" pending="2" progress="1.7"></w-sync-status>
  </div>`);
  const line = page.locator('#s .w-sync-status__progress');
  await expect(line).toHaveAttribute('aria-hidden', 'true');
  const box = await line.boundingBox();
  const bar = await page.locator('#s .w-sync-status__progress-bar').boundingBox();
  const host = await page.locator('#s .w-sync-status').boundingBox();
  expect(box.height).toBeGreaterThan(1);
  expect(box.height).toBeLessThanOrEqual(3);
  expect(host.y + host.height - (box.y + box.height)).toBeLessThanOrEqual(1.5);
  expect(Math.round(bar.width)).toBe(Math.round(box.width / 2));
  const full = await page.locator('#q .w-sync-status__progress-bar').boundingBox();
  const track = await page.locator('#q .w-sync-status__progress').boundingBox();
  expect(Math.round(full.width)).toBe(Math.round(track.width));
});

test('w-sync-status shows no progress line without progress or outside syncing and sending', async ({ mount, page }) => {
  await mount(`
    <w-sync-status id="a" state="syncing"></w-sync-status>
    <w-sync-status id="b" state="offline" progress="0.5"></w-sync-status>
    <w-sync-status id="c" state="syncing" progress="soon"></w-sync-status>
    <w-sync-status id="d" state="syncing" progress=""></w-sync-status>
  `);
  await expect(page.locator('.w-sync-status__progress')).toHaveCount(0);
});

test('w-sync-status progress line does not move with reduced motion', async ({ mount, page }) => {
  await mount('<w-sync-status id="s" state="syncing" progress="0.2"></w-sync-status>');
  const duration = () => page.locator('#s .w-sync-status__progress-bar').evaluate((element) => parseFloat(getComputedStyle(element).transitionDuration));
  expect(await duration()).toBeGreaterThan(0.05);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await duration()).toBeLessThan(0.01);
  await expect(page.locator('#s .w-sync-status__progress-bar')).toHaveCSS('animation-name', 'none');
});

test('w-sync-status hour-cycle chooses 12 or 24 hours, and the locale decides otherwise', async ({ mount, page }) => {
  const iso = await todayAt(page, 20, 5);
  await mount(`<div lang="en">
    <w-sync-status id="l" state="offline" updated-at="${iso}"></w-sync-status>
    <w-sync-status id="h23" state="offline" updated-at="${iso}" hour-cycle="h23"></w-sync-status>
    <w-sync-status id="gb" lang="en-GB" state="offline" updated-at="${iso}"></w-sync-status>
    <w-sync-status id="h12" lang="en-GB" state="offline" updated-at="${iso}" hour-cycle="h12"></w-sync-status>
    <w-sync-status id="bad" lang="en-GB" state="offline" updated-at="${iso}" hour-cycle="24"></w-sync-status>
  </div>`);
  await expect(page.locator('#l .w-sync-status__part')).toHaveText(/^updated 08:05\sPM$/i);
  await expect(page.locator('#h23 .w-sync-status__part')).toHaveText('updated 20:05');
  await expect(page.locator('#gb .w-sync-status__part')).toHaveText('updated 20:05');
  await expect(page.locator('#h12 .w-sync-status__part')).toHaveText(/^updated 08:05\spm$/i);
  await expect(page.locator('#bad .w-sync-status__part')).toHaveText('updated 20:05');
});

test('w-sync-status follows the page language when no element sets lang', async ({ mount, page }) => {
  const iso = await todayAt(page, 20, 5);
  await page.evaluate(() => document.documentElement.setAttribute('lang', 'de'));
  await mount(`<w-sync-status id="s" state="offline" updated-at="${iso}" pending="1234"></w-sync-status>`);
  await expect(page.locator('#s .w-sync-status__part')).toHaveText(['updated 20:05', '1.234 waiting to send']);
});

test('w-sync-status keeps one action button on the text line at 375 px', async ({ mount, page }) => {
  await page.setViewportSize(PHONE);
  await mount(`<w-sync-status id="s" state="sent" sent="3" attention="1" online-text="" attention-text-one="{count} item needs your attention">
    <w-btn slot="actions" variant="text" size="small">Review</w-btn></w-sync-status>`);
  const bar = await page.locator('#s .w-sync-status').boundingBox();
  const text = await page.locator('#s .w-sync-status__text').boundingBox();
  const actions = await page.locator('#s .w-sync-status__actions').boundingBox();
  expect(actions.y).toBeLessThan(text.y + text.height);
  expect(actions.x).toBeGreaterThan(text.x);
  expect(bar.x + bar.width).toBeLessThanOrEqual(PHONE.width);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBe(0);
});

test('w-sync-status keeps a "Details" button on the line of a long offline text at 375 px', async ({ mount, page }) => {
  await page.setViewportSize(PHONE);
  const iso = await todayAt(page, 8, 12);
  await mount(`<w-sync-status id="s" state="offline" updated-at="${iso}" pending="4">
    <w-btn slot="actions" variant="text" size="small">Details</w-btn></w-sync-status>`);
  const text = await page.locator('#s .w-sync-status__text').boundingBox();
  const actions = await page.locator('#s .w-sync-status__actions').boundingBox();
  expect(actions.y).toBeLessThan(text.y + text.height);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBe(0);
});

test('w-sync-status wraps wide actions under the text without sideways scroll at 320 px', async ({ mount, page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await mount(`<w-sync-status id="s" state="locked" pending="3">
    <w-btn slot="actions" variant="tonal" size="small">Sign in again</w-btn><w-btn slot="actions" variant="text" size="small">Details</w-btn></w-sync-status>`);
  const text = await page.locator('#s .w-sync-status__text').boundingBox();
  expect(text.width).toBeGreaterThanOrEqual(120);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBe(0);
});

test('w-sync-status "Details" button in the actions slot is reachable and the bar is not', async ({ mount, page }) => {
  await mount('<button id="before">Before</button><w-sync-status id="s" state="offline"><w-btn slot="actions" id="details" variant="text" size="small">Details</w-btn></w-sync-status>');
  await page.locator('#before').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#details button')).toBeFocused();
  await expect(page.locator('#s .w-sync-status')).not.toHaveAttribute('role', /./);
  await expect(page.locator('#s .w-sync-status')).not.toHaveAttribute('tabindex', /./);
});

for (const theme of THEMES) {
  test(`w-sync-status sending, sent and the progress line pass WCAG A/AA in ${theme}`, async ({ mount, page }) => {
    await page.evaluate((name) => document.documentElement.setAttribute('w-theme', name), theme);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await mount(`
      <w-sync-status state="sending" sent="2" pending="2" progress="0.5"></w-sync-status>
      <w-sync-status state="sent" sent="3" attention="1" sent-timeout="0"><w-btn slot="actions" variant="text" size="small">Review</w-btn></w-sync-status>
      <w-sync-status state="syncing" progress="0.3" updated-at="2026-11-03T08:12:00" syncing-updated-text="Getting changes since {time}"></w-sync-status>
    `);
    expect(await runAxe(page)).toEqual([]);
  });
}

async function mountDocsDemos(mount) {
  const source = readFileSync(new URL('../../website/client/pages/docs/sync-status/tac.html', import.meta.url), 'utf8');
  const demos = [...source.matchAll(/<div slot="wc">([\s\S]*?)<\/div>\s*<\/demo-compare>/g)].map((match) => match[1]);
  await mount(demos.join(''));
}

test('the sync-status docs demos, with the "Details" button, pass WCAG A/AA', async ({ mount, page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await mountDocsDemos(mount);
  await expect(page.locator('w-sync-status[state="sending"] .w-sync-status__part')).toHaveText('3 of 4');
  await expect(page.locator('w-btn[aria-haspopup="dialog"]')).toHaveText('Details');
  expect(await runAxe(page)).toEqual([]);
});

test('the sync-status docs demos fit a 375 px screen', async ({ mount, page }) => {
  await page.setViewportSize(PHONE);
  await mountDocsDemos(mount);
  const details = page.locator('w-sync-status:has(w-btn[aria-haspopup="dialog"])');
  const text = await details.locator('.w-sync-status__text').boundingBox();
  const actions = await details.locator('.w-sync-status__actions').boundingBox();
  expect(actions.y).toBeLessThan(text.y + text.height);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBe(0);
});
