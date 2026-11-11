import { readFileSync } from 'node:fs';
import { expect, test } from '../setup/component-test.js';

const AXE = readFileSync(new URL('../../website/node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const WCAG_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const ANNOUNCE_WAIT_MS = 2400;

const VISIBLE_STATES = [
  { state: 'offline', words: 'Offline', extra: '' },
  { state: 'syncing', words: 'Updating…', extra: '' },
  { state: 'locked', words: 'Locked. Sign in to open the copy on this device.', extra: '' },
  { state: 'online', words: 'Up to date', extra: ' show-online' },
];
const THEMES = ['light', 'dark', 'high-contrast'];

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

async function setStates(page, states, gapMs) {
  await page.evaluate(async ({ list, gap }) => {
    const element = document.querySelector('#s');
    for (const state of list) {
      element.setAttribute('state', state);
      await new Promise((resolve) => { setTimeout(resolve, gap); });
    }
  }, { list: states, gap: gapMs });
}

async function todayAt(page, hours, minutes) {
  return page.evaluate(({ h, m }) => {
    const date = new Date();
    date.setHours(h, m, 0, 0);
    return date.toISOString();
  }, { h: hours, m: minutes });
}

async function contrastOf(page, selector) {
  return page.evaluate((target) => {
    const parse = (value) => (value.match(/rgba?\(([^)]+)\)/) || [null, '0, 0, 0, 0'])[1].split(',').map(Number);
    const over = (top, bottom) => {
      const alpha = top[3] ?? 1;
      return [0, 1, 2].map((index) => top[index] * alpha + bottom[index] * (1 - alpha)).concat(1);
    };
    const luminance = (color) => {
      const [r, g, b] = color.slice(0, 3).map((channel) => {
        const value = channel / 255;
        return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const ratio = (one, two) => {
      const [light, dark] = [luminance(one), luminance(two)].sort((a, b) => b - a);
      return (light + 0.05) / (dark + 0.05);
    };
    const bar = document.querySelector(target);
    const style = getComputedStyle(bar);
    const background = over(parse(style.backgroundImage), parse(style.backgroundColor));
    const text = over(parse(getComputedStyle(bar.querySelector('.w-sync-status__state')).color), background);
    const icon = over(parse(getComputedStyle(bar.querySelector('.w-sync-status__svg')).color), background);
    return { text: ratio(text, background), icon: ratio(icon, background), opaque: (parse(style.backgroundColor)[3] ?? 1) === 1 };
  }, selector);
}

for (const { state, words, extra } of VISIBLE_STATES) {
  test(`w-sync-status ${state} shows an icon and its words`, async ({ mount, page }) => {
    await mount(`<w-sync-status id="s" state="${state}"${extra}></w-sync-status>`);
    await expect(page.locator('#s .w-sync-status')).toBeVisible();
    await expect(page.locator('#s .w-sync-status')).toHaveClass(new RegExp(`w-sync-status--${state}`));
    await expect(page.locator('#s .w-sync-status__state')).toHaveText(words);
    await expect(page.locator('#s .w-sync-status__icon')).toBeVisible();
    await expect(page.locator('#s .w-sync-status__icon')).toHaveAttribute('aria-hidden', 'true');
  });

  for (const theme of THEMES) {
    test(`w-sync-status ${state} meets AA contrast in ${theme}`, async ({ mount, page }) => {
      await page.evaluate((name) => document.documentElement.setAttribute('w-theme', name), theme);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await mount(`<w-sync-status id="s" state="${state}" pending="3" updated-at="2026-11-03T08:12:00"${extra}><button slot="actions" class="w-btn">Show</button></w-sync-status>`);
      const contrast = await contrastOf(page, '#s .w-sync-status');
      expect(contrast.opaque).toBe(true);
      expect(contrast.text).toBeGreaterThanOrEqual(4.5);
      expect(contrast.icon).toBeGreaterThanOrEqual(3);
      await page.addScriptTag({ content: AXE });
      const { violations } = await page.evaluate((tags) => window.axe.run('#root', { runOnly: { type: 'tag', values: tags } }), WCAG_AA);
      expect(violations.map((violation) => violation.id)).toEqual([]);
    });
  }
}

test('w-sync-status is hidden when online with nothing waiting', async ({ mount, page }) => {
  await mount('<w-sync-status id="s"></w-sync-status><w-sync-status id="o" state="online" pending="0" attention="0"></w-sync-status>');
  await expect(page.locator('#s .w-sync-status')).toBeHidden();
  await expect(page.locator('#o .w-sync-status')).toBeHidden();
});

test('w-sync-status shows when online with items waiting or needing attention', async ({ mount, page }) => {
  await mount('<w-sync-status id="p" state="online" pending="2"></w-sync-status><w-sync-status id="a" state="online" attention="1"></w-sync-status>');
  await expect(page.locator('#p .w-sync-status')).toBeVisible();
  await expect(page.locator('#p .w-sync-status__text')).toHaveText('Up to date·2 waiting to send');
  await expect(page.locator('#a .w-sync-status__text')).toHaveText('Up to date·Needs your attention: 1');
});

test('w-sync-status show-online shows a check icon and "Up to date"', async ({ mount, page }) => {
  await mount('<w-sync-status id="s" show-online></w-sync-status>');
  await expect(page.locator('#s .w-sync-status')).toBeVisible();
  await expect(page.locator('#s .w-sync-status__state')).toHaveText('Up to date');
  await expect(page.locator('#s .w-sync-status__svg path')).toHaveAttribute('d', 'M20 6L9 17l-5-5');
});

test('w-sync-status joins the time and counts and leaves out empty parts', async ({ mount, page }) => {
  const iso = await todayAt(page, 8, 12);
  await mount(`<w-sync-status id="s" state="offline" updated-at="${iso}" pending="3" attention="2"></w-sync-status><w-sync-status id="z" state="offline" updated-at="" pending="0" attention="0"></w-sync-status>`);
  const time = await page.evaluate(async (value) => {
    const { WOfflineText } = await import('/src/components/offline-text.js');
    return WOfflineText.time(value, 'en');
  }, iso);
  await expect(page.locator('#s .w-sync-status__part')).toHaveText([`updated ${time}`, '3 waiting to send', 'Needs your attention: 2']);
  await expect(page.locator('#s .w-sync-status__separator')).toHaveCount(3);
  await expect(page.locator('#s .w-sync-status__separator').first()).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('#z .w-sync-status__text')).toHaveText('Offline');
  await expect(page.locator('#z .w-sync-status__separator')).toHaveCount(0);
});

test('w-sync-status ignores an invalid time, count and state', async ({ mount, page }) => {
  await mount('<w-sync-status id="s" state="offline" updated-at="not a time" pending="-4" attention="many"></w-sync-status><w-sync-status id="u" state="unknown"></w-sync-status>');
  await expect(page.locator('#s .w-sync-status__text')).toHaveText('Offline');
  await expect(page.locator('#u .w-sync-status')).toBeHidden();
  await expect(page.locator('#u .w-sync-status')).toHaveClass(/w-sync-status--online/);
});

test('w-sync-status formats the time and counts in the page language', async ({ mount, page }) => {
  const iso = await todayAt(page, 20, 5);
  await mount(`<div lang="de"><w-sync-status id="s" state="offline" updated-at="${iso}" pending="1234" updated-text="aktualisiert {time}" pending-text="{count} warten"></w-sync-status></div>`);
  await expect(page.locator('#s .w-sync-status__part')).toHaveText(['aktualisiert 20:05', '1.234 warten']);
});

test('w-sync-status takes every text override', async ({ mount, page }) => {
  await mount(`
    <w-sync-status id="o" state="offline" offline-text="Hors ligne" pending="2" pending-text="{count} en attente" attention="1" attention-text="À vérifier : {count}"></w-sync-status>
    <w-sync-status id="y" state="syncing" syncing-text="Mise à jour…"></w-sync-status>
    <w-sync-status id="l" state="locked" locked-text="Verrouillé"></w-sync-status>
    <w-sync-status id="n" state="online" show-online online-text="À jour"></w-sync-status>
  `);
  await expect(page.locator('#o .w-sync-status__text')).toHaveText('Hors ligne·2 en attente·À vérifier : 1');
  await expect(page.locator('#y .w-sync-status__state')).toHaveText('Mise à jour…');
  await expect(page.locator('#l .w-sync-status__state')).toHaveText('Verrouillé');
  await expect(page.locator('#n .w-sync-status__state')).toHaveText('À jour');
});

test('w-sync-status uses the locked colours and the neutral surface otherwise', async ({ mount, page }) => {
  await mount('<w-sync-status id="l" state="locked"></w-sync-status><w-sync-status id="o" state="offline"></w-sync-status>');
  const colours = await page.evaluate(() => {
    const probe = document.createElement('span');
    probe.style.color = 'var(--w-on-warning-container)';
    document.body.appendChild(probe);
    return {
      locked: getComputedStyle(document.querySelector('#l .w-sync-status')).color,
      lockedToken: getComputedStyle(probe).color,
      offlineImage: getComputedStyle(document.querySelector('#o .w-sync-status')).backgroundImage,
    };
  });
  expect(colours.locked).toBe(colours.lockedToken);
  expect(colours.offlineImage).toContain('gradient');
});

test('w-sync-status takes a custom icon, an icon set, the prepend slot, or no icon', async ({ mount, page }) => {
  await page.evaluate(() => window.WIcons.set('mdi', { type: 'class', prefix: 'mdi' }));
  await mount(`
    <w-sync-status id="i" state="offline" icon="wifi-off" icon-set="mdi"></w-sync-status>
    <w-sync-status id="p" state="offline"><span slot="prepend" class="mine">!</span></w-sync-status>
    <w-sync-status id="n" state="offline" icon="false"></w-sync-status>
  `);
  await expect(page.locator('#i .w-sync-status__icon .mdi.wifi-off')).toHaveCount(1);
  await expect(page.locator('#p .w-sync-status__icon .mine')).toHaveText('!');
  await expect(page.locator('#p .w-sync-status__svg')).toHaveCount(0);
  await expect(page.locator('#n .w-sync-status__icon')).toHaveCount(0);
  await expect(page.locator('#n .w-sync-status__state')).toHaveText('Offline');
});

test('w-sync-status keeps the app buttons in the actions slot and in tab order', async ({ mount, page }) => {
  await mount('<button id="before">Before</button><w-sync-status id="s" state="locked"><w-btn slot="actions" id="sign-in">Sign in</w-btn></w-sync-status><button id="after">After</button>');
  await expect(page.locator('#s .w-sync-status__actions #sign-in')).toBeVisible();
  await page.locator('#before').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#sign-in button')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#after')).toBeFocused();
  await page.evaluate(() => document.querySelector('#s').setAttribute('pending', '4'));
  await expect(page.locator('#s .w-sync-status__actions #sign-in')).toHaveText('Sign in');
});

test('w-sync-status never takes focus and is never an alert', async ({ mount, page }) => {
  await mount('<w-sync-status id="s" state="offline" pending="1"></w-sync-status>');
  await expect(page.locator('#s [tabindex]')).toHaveCount(0);
  await expect(page.locator('#s [role="alert"]')).toHaveCount(0);
  await expect(page.locator('#s .w-sync-status')).not.toHaveAttribute('aria-live', /./);
  const line = page.locator('#s .w-sync-status__live');
  await expect(line).toHaveAttribute('role', 'status');
  await expect(line).toHaveAttribute('aria-live', 'polite');
  await expect(line).toHaveAttribute('aria-atomic', 'true');
  await expect(line).toHaveClass(/w-sr-only/);
});

test('w-sync-status says nothing on first render', async ({ mount, page }) => {
  await mount('<w-sync-status id="s" state="offline" pending="2"></w-sync-status>');
  await recordAnnouncements(page, '#s');
  expect(await readAnnouncements(page)).toEqual([]);
  await expect(page.locator('#s .w-sync-status__live')).toHaveText('');
});

test('w-sync-status announces going offline, being locked and coming back', async ({ mount, page }) => {
  await mount('<w-sync-status id="s"></w-sync-status>');
  await recordAnnouncements(page, '#s');
  await setStates(page, ['offline'], 0);
  expect(await readAnnouncements(page)).toEqual(['Offline']);
  await setStates(page, ['syncing'], 0);
  expect(await readAnnouncements(page)).toEqual(['Offline', 'Back online']);
  await setStates(page, ['locked'], 0);
  expect(await readAnnouncements(page)).toEqual(['Offline', 'Back online', 'Locked. Sign in to open the copy on this device.']);
});

test('w-sync-status does not announce syncing or online after syncing', async ({ mount, page }) => {
  await mount('<w-sync-status id="s"></w-sync-status>');
  await recordAnnouncements(page, '#s');
  await setStates(page, ['syncing'], 0);
  expect(await readAnnouncements(page)).toEqual([]);
  await setStates(page, ['online'], 0);
  expect(await readAnnouncements(page)).toEqual([]);
});

test('w-sync-status makes one announcement for 5 state flips in 2 seconds', async ({ mount, page }) => {
  await mount('<w-sync-status id="s"></w-sync-status>');
  await recordAnnouncements(page, '#s');
  await setStates(page, ['offline', 'online', 'offline', 'online', 'offline'], 300);
  expect(await readAnnouncements(page)).toEqual(['Offline']);
});

test('w-sync-status says nothing when a burst ends where it started', async ({ mount, page }) => {
  await mount('<w-sync-status id="s"></w-sync-status>');
  await recordAnnouncements(page, '#s');
  await setStates(page, ['offline', 'online', 'offline', 'online'], 300);
  expect(await readAnnouncements(page)).toEqual([]);
});

test('w-sync-status does not announce time or count changes', async ({ mount, page }) => {
  await mount('<w-sync-status id="s" state="offline"></w-sync-status>');
  await recordAnnouncements(page, '#s');
  await page.evaluate(() => {
    const element = document.querySelector('#s');
    element.setAttribute('pending', '3');
    element.setAttribute('attention', '1');
    element.setAttribute('updated-at', new Date().toISOString());
  });
  expect(await readAnnouncements(page)).toEqual([]);
  await expect(page.locator('#s .w-sync-status__part')).toHaveCount(3);
});

test('w-sync-status announces the back-online and locked text overrides', async ({ mount, page }) => {
  await mount('<w-sync-status id="s" state="locked" back-online-text="De nouveau en ligne" offline-text="Hors ligne"></w-sync-status>');
  await recordAnnouncements(page, '#s');
  await setStates(page, ['online'], 0);
  expect(await readAnnouncements(page)).toEqual(['De nouveau en ligne']);
  await setStates(page, ['offline'], 0);
  expect(await readAnnouncements(page)).toEqual(['De nouveau en ligne', 'Hors ligne']);
});

test('w-sync-status keeps one live line across re-renders', async ({ mount, page }) => {
  await mount('<w-sync-status id="s" state="offline"></w-sync-status>');
  const same = await page.evaluate(() => {
    const element = document.querySelector('#s');
    const line = element.querySelector('.w-sync-status__live');
    element.setAttribute('pending', '5');
    element.setAttribute('state', 'syncing');
    return element.querySelector('.w-sync-status__live') === line && element.querySelectorAll('.w-sync-status__live').length === 1;
  });
  expect(same).toBe(true);
});

test('w-sync-status bar fills the width and the chip stays small', async ({ mount, page }) => {
  await mount('<div style="width: 600px"><w-sync-status id="b" state="offline"></w-sync-status><w-sync-status id="c" state="offline" variant="chip"></w-sync-status></div>');
  const bar = await page.locator('#b .w-sync-status').boundingBox();
  const chip = await page.locator('#c .w-sync-status').boundingBox();
  expect(bar.width).toBe(600);
  expect(chip.width).toBeLessThan(200);
  await expect(page.locator('#c .w-sync-status')).toHaveClass(/w-sync-status--chip/);
  await expect(page.locator('#c .w-sync-status')).toHaveCSS('border-radius', /px/);
});

test('w-sync-status bar and chip fit a 360 px screen without scrolling sideways', async ({ mount, page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await mount(`
    <w-sync-status id="b" state="locked" updated-at="2025-11-03T08:12:00" pending="12" attention="3"><w-btn slot="actions">Sign in</w-btn></w-sync-status>
    <w-sync-status id="c" state="offline" variant="chip" updated-at="2025-11-03T08:12:00" pending="12"></w-sync-status>
  `);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBe(0);
  const bar = await page.locator('#b .w-sync-status').boundingBox();
  const chip = await page.locator('#c .w-sync-status').boundingBox();
  expect(bar.x + bar.width).toBeLessThanOrEqual(360);
  expect(chip.x + chip.width).toBeLessThanOrEqual(360);
});

test('w-sync-status sticky pins the bar to the top of its scroll container', async ({ mount, page }) => {
  await mount('<div id="scroller" style="height: 200px; overflow: auto"><w-sync-status id="s" state="offline" sticky></w-sync-status><div style="height: 1000px"></div></div>');
  await page.locator('#scroller').evaluate((element) => { element.scrollTop = 400; });
  const scroller = await page.locator('#scroller').boundingBox();
  const bar = await page.locator('#s .w-sync-status').boundingBox();
  expect(Math.round(bar.y)).toBe(Math.round(scroller.y));
  await expect(page.locator('#s .w-sync-status')).toHaveCSS('position', 'sticky');
});

test('w-sync-status spins while syncing and shows a still icon with reduced motion', async ({ mount, page }) => {
  await mount('<w-sync-status id="s" state="syncing"></w-sync-status>');
  await expect(page.locator('#s .w-sync-status__spinner')).toBeVisible();
  await expect(page.locator('#s .w-sync-status__still')).toBeHidden();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#s .w-sync-status__spinner')).toBeHidden();
  await expect(page.locator('#s .w-sync-status__still')).toBeVisible();
});

test('w-sync-status mirrors for right-to-left languages', async ({ mount, page }) => {
  await mount('<div dir="rtl" style="width: 600px"><w-sync-status id="s" state="offline"><button slot="actions">Show</button></w-sync-status></div>');
  const icon = await page.locator('#s .w-sync-status__icon').boundingBox();
  const text = await page.locator('#s .w-sync-status__text').boundingBox();
  const actions = await page.locator('#s .w-sync-status__actions').boundingBox();
  expect(icon.x).toBeGreaterThan(text.x);
  expect(actions.x).toBeLessThan(text.x);
});

test('w-sync-status CSS classes work without the element', async ({ mount, page }) => {
  await mount(`
    <div id="css" class="w-sync-status w-sync-status--bar w-sync-status--offline">
      <span class="w-sync-status__icon" aria-hidden="true">!</span>
      <span class="w-sync-status__text"><span class="w-sync-status__state">Offline</span></span>
    </div>
  `);
  await expect(page.locator('#css')).toHaveCSS('display', 'flex');
  await expect(page.locator('#css .w-sync-status__state')).toHaveCSS('font-weight', /[5-9]00/);
});
