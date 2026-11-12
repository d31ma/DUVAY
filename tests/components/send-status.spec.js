import { readFileSync } from 'node:fs';
import { expect, test } from '../setup/component-test.js';

const AXE = readFileSync(new URL('../../website/node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const WCAG_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const THEMES = ['light', 'dark', 'high-contrast'];
const FAILED_MESSAGE = '20 not sent. Needs your attention.';
const ANNOUNCE_WAIT_MS = 1600;

const ATTENTION_LIST = `
  <w-list id="attention" aria-label="Needs your attention">
    <w-list-item id="row-1" item-role="none" wrap no-prepend-space title="Lunch on Friday?" subtitle="Chat with Ana">
      <w-send-status state="failed" reason="The server refused the message.">
        <w-btn slot="actions" id="retry-1" size="small" variant="tonal" aria-describedby="row-1-title">Retry</w-btn>
        <w-btn slot="actions" id="discard-1" size="small" variant="text" aria-describedby="row-1-title">Discard</w-btn>
      </w-send-status>
    </w-list-item>
    <w-list-item id="row-2" item-role="none" wrap no-prepend-space title="Quarterly report" subtitle="Mail to Finance">
      <w-send-status state="failed" reason="Attachment too large.">
        <w-btn slot="actions" id="retry-2" size="small" variant="tonal" aria-describedby="row-2-title">Retry</w-btn>
        <w-btn slot="actions" id="discard-2" size="small" variant="text" aria-describedby="row-2-title">Discard</w-btn>
      </w-send-status>
    </w-list-item>
  </w-list>`;

async function recordAnnouncements(page) {
  await page.evaluate(async () => {
    const { WLiveAnnouncer } = await import('/src/components/live-announcer.js');
    window.__announcements = [];
    const region = WLiveAnnouncer.region();
    new MutationObserver(() => {
      if (region.textContent) window.__announcements.push(region.textContent);
    }).observe(region, { childList: true, characterData: true, subtree: true });
  });
}

async function readAnnouncements(page) {
  await page.waitForTimeout(ANNOUNCE_WAIT_MS);
  return page.evaluate(() => window.__announcements);
}

async function mountRows(mount, page, count, state) {
  const rows = Array.from({ length: count }, (_, index) => `<w-send-status id="s${index}" state="${state}"></w-send-status>`);
  await mount(rows.join(''));
  await page.waitForTimeout(50);
}

async function setAllStates(page, state) {
  await page.evaluate((next) => {
    document.querySelectorAll('w-send-status').forEach((element) => element.setAttribute('state', next));
  }, state);
}

async function runAxe(page) {
  await page.addScriptTag({ content: AXE });
  const { violations } = await page.evaluate((tags) => window.axe.run('#root', { runOnly: { type: 'tag', values: tags } }), WCAG_AA);
  return violations.map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`);
}

async function todayAtEightTwelve(page) {
  return page.evaluate(() => {
    const date = new Date();
    date.setHours(8, 12, 0, 0);
    return { iso: date.toISOString(), clock: new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit' }).format(date) };
  });
}

test('w-send-status waiting shows a clock icon and its words', async ({ mount, page }) => {
  await mount('<w-send-status id="s" state="waiting"></w-send-status>');
  await expect(page.locator('#s .w-send-status')).toHaveClass(/w-send-status--waiting/);
  await expect(page.locator('#s .w-send-status-text')).toHaveText('Waiting to send');
  await expect(page.locator('#s .w-send-status-icon svg')).toBeVisible();
});

test('w-send-status sending shows a spinner and its words', async ({ mount, page }) => {
  await mount('<w-send-status id="s" state="sending"></w-send-status>');
  await expect(page.locator('#s .w-send-status-text')).toHaveText('Sending…');
  await expect(page.locator('#s .w-send-status-spinner')).toBeVisible();
  await expect(page.locator('#s .w-send-status-still')).toBeHidden();
});

test('w-send-status sending shows a still icon with reduced motion', async ({ mount, page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await mount('<w-send-status id="s" state="sending"></w-send-status>');
  await expect(page.locator('#s .w-send-status-spinner')).toBeHidden();
  await expect(page.locator('#s .w-send-status-still')).toBeVisible();
});

test('w-send-status failed shows an error icon, the failed text and the reason', async ({ mount, page }) => {
  await mount('<w-send-status id="s" state="failed" reason="Mailbox full."></w-send-status>');
  await expect(page.locator('#s .w-send-status')).toHaveClass(/w-send-status--failed/);
  await expect(page.locator('#s .w-send-status-icon svg')).toBeVisible();
  await expect(page.locator('#s .w-send-status-text')).toHaveText('Not sent');
  await expect(page.locator('#s .w-send-status-reason')).toHaveText('Mailbox full.');
});

test('w-send-status failed without a reason shows no separator', async ({ mount, page }) => {
  await mount('<w-send-status id="s" state="failed"></w-send-status>');
  await expect(page.locator('#s .w-send-status-separator')).toHaveCount(0);
});

test('w-send-status reason shows only in the failed state', async ({ mount, page }) => {
  await mount('<w-send-status id="s" state="waiting" reason="Mailbox full."></w-send-status>');
  await expect(page.locator('#s .w-send-status-reason')).toHaveCount(0);
});

test('w-send-status sent with written-at shows the written note', async ({ mount, page }) => {
  const time = await todayAtEightTwelve(page);
  await mount(`<w-send-status id="s" state="sent" written-at="${time.iso}"></w-send-status>`);
  await expect(page.locator('#s .w-send-status-text')).toHaveText(`Written offline at ${time.clock}`);
  await expect(page.locator('#s .w-send-status-icon svg')).toBeVisible();
});

test('w-send-status sent without written-at shows nothing', async ({ mount, page }) => {
  await mount('<w-send-status id="s" state="sent"></w-send-status>');
  await expect(page.locator('#s .w-send-status')).toBeHidden();
});

test('w-send-status with no state shows nothing', async ({ mount, page }) => {
  await mount('<w-send-status id="s"></w-send-status>');
  await expect(page.locator('#s .w-send-status')).toBeHidden();
});

test('w-send-status with an unknown state shows nothing', async ({ mount, page }) => {
  await mount('<w-send-status id="s" state="queued"></w-send-status>');
  await expect(page.locator('#s .w-send-status')).toBeHidden();
});

test('w-send-status text attributes replace every default', async ({ mount, page }) => {
  const time = await todayAtEightTwelve(page);
  await mount(`
    <w-send-status id="w" state="waiting" waiting-text="Wartet"></w-send-status>
    <w-send-status id="g" state="sending" sending-text="Wird gesendet"></w-send-status>
    <w-send-status id="f" state="failed" failed-text="Nicht gesendet"></w-send-status>
    <w-send-status id="t" state="sent" written-at="${time.iso}" written-text="Offline geschrieben um {time}"></w-send-status>`);
  await expect(page.locator('#w .w-send-status-text')).toHaveText('Wartet');
  await expect(page.locator('#g .w-send-status-text')).toHaveText('Wird gesendet');
  await expect(page.locator('#f .w-send-status-text')).toHaveText('Nicht gesendet');
  await expect(page.locator('#t .w-send-status-text')).toHaveText(`Offline geschrieben um ${time.clock}`);
});

test('w-send-status icon="false" hides the icon and keeps the words', async ({ mount, page }) => {
  await mount('<w-send-status id="s" state="failed" icon="false"></w-send-status>');
  await expect(page.locator('#s .w-send-status-icon')).toHaveCount(0);
  await expect(page.locator('#s .w-send-status-text')).toHaveText('Not sent');
});

test('w-send-status icon replaces the built-in icon', async ({ mount, page }) => {
  await mount('<w-send-status id="s" state="waiting" icon="⏳"></w-send-status>');
  await expect(page.locator('#s .w-send-status-icon')).toHaveText('⏳');
  await expect(page.locator('#s .w-send-status-icon')).toHaveAttribute('aria-hidden', 'true');
});

test('w-send-status escapes the reason text', async ({ mount, page }) => {
  await mount('<w-send-status id="s" state="failed" reason="<b>bold</b>"></w-send-status>');
  await expect(page.locator('#s .w-send-status-reason')).toHaveText('<b>bold</b>');
  await expect(page.locator('#s b')).toHaveCount(0);
});

test('w-send-status is not a live region and takes no focus', async ({ mount, page }) => {
  await mount('<w-send-status id="s" state="failed" reason="Mailbox full."></w-send-status>');
  await expect(page.locator('#s [aria-live], #s [role="status"], #s [role="alert"], #s [tabindex]')).toHaveCount(0);
  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => document.activeElement.closest('w-send-status') !== null);
  expect(focused).toBe(false);
});

test('w-send-status keeps slotted actions across state changes', async ({ mount, page }) => {
  await mount('<w-send-status id="s" state="failed"><w-btn slot="actions" id="retry">Retry</w-btn></w-send-status>');
  await page.locator('#s').evaluate((element) => element.setAttribute('state', 'sending'));
  await expect(page.locator('#s .w-send-status-actions #retry')).toHaveCount(1);
  await page.locator('#s').evaluate((element) => element.setAttribute('state', 'failed'));
  await expect(page.locator('#s .w-send-status-actions #retry')).toBeVisible();
});

test('w-send-status announces 20 rows failing within one second once', async ({ mount, page }) => {
  await mountRows(mount, page, 20, 'sending');
  await recordAnnouncements(page);
  await setAllStates(page, 'failed');
  expect(await readAnnouncements(page)).toEqual([FAILED_MESSAGE]);
});

test('w-send-status uses failed-announce-text for the announcement', async ({ mount, page }) => {
  await mount('<w-send-status id="s" state="sending" failed-announce-text="{count} nicht gesendet."></w-send-status>');
  await page.waitForTimeout(50);
  await recordAnnouncements(page);
  await setAllStates(page, 'failed');
  expect(await readAnnouncements(page)).toEqual(['1 nicht gesendet.']);
});

test('w-send-status announce="off" stops the failure announcement', async ({ mount, page }) => {
  await mount('<w-send-status id="s" state="sending" announce="off"></w-send-status>');
  await page.waitForTimeout(50);
  await recordAnnouncements(page);
  await setAllStates(page, 'failed');
  expect(await readAnnouncements(page)).toEqual([]);
});

test('w-send-status never announces waiting, sending or sent', async ({ mount, page }) => {
  const time = await todayAtEightTwelve(page);
  await mountRows(mount, page, 3, 'failed');
  await recordAnnouncements(page);
  await setAllStates(page, 'waiting');
  await setAllStates(page, 'sending');
  await page.evaluate((iso) => {
    document.querySelectorAll('w-send-status').forEach((element) => element.setAttribute('written-at', iso));
  }, time.iso);
  await setAllStates(page, 'sent');
  expect(await readAnnouncements(page)).toEqual([]);
});

test('w-send-status does not announce a row first shown already failed', async ({ mount, page }) => {
  await recordAnnouncements(page);
  await mountRows(mount, page, 5, 'failed');
  expect(await readAnnouncements(page)).toEqual([]);
});

test('w-send-status does not announce a failed row whose reason changes', async ({ mount, page }) => {
  await mountRows(mount, page, 1, 'failed');
  await recordAnnouncements(page);
  await page.locator('#s0').evaluate((element) => element.setAttribute('reason', 'Mailbox full.'));
  expect(await readAnnouncements(page)).toEqual([]);
});

test('w-send-status announces a retry that fails again', async ({ mount, page }) => {
  await mountRows(mount, page, 1, 'failed');
  await recordAnnouncements(page);
  await setAllStates(page, 'sending');
  await setAllStates(page, 'failed');
  expect(await readAnnouncements(page)).toEqual(['1 not sent. Needs your attention.']);
});

test('w-send-status mirrors its line for right-to-left languages', async ({ mount, page }) => {
  await mount('<div dir="rtl" lang="ar" style="width:320px"><w-send-status id="s" state="waiting"></w-send-status></div>');
  const icon = await page.locator('#s .w-send-status-icon').boundingBox();
  const text = await page.locator('#s .w-send-status-text').boundingBox();
  expect(icon.x).toBeGreaterThan(text.x);
});

test('w-send-status wraps its buttons inside a 360 px row', async ({ mount, page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await mount(ATTENTION_LIST);
  const overflow = await page.locator('#row-1').evaluate((element) => element.scrollWidth - element.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  await expect(page.locator('#retry-1')).toBeInViewport();
  await expect(page.locator('#discard-1')).toBeInViewport();
});

for (const theme of THEMES) {
  test(`w-send-status passes WCAG A/AA in every state (${theme})`, async ({ mount, page }) => {
    const time = await todayAtEightTwelve(page);
    await page.evaluate((name) => document.documentElement.setAttribute('w-theme', name), theme);
    await mount(`
      <w-send-status state="waiting"></w-send-status>
      <w-send-status state="sending"></w-send-status>
      <w-send-status state="failed" reason="Mailbox full."></w-send-status>
      <w-send-status state="sent" written-at="${time.iso}"></w-send-status>`);
    expect(await runAxe(page)).toEqual([]);
  });

  test(`the "Needs your attention" list passes WCAG A/AA (${theme})`, async ({ mount, page }) => {
    await page.evaluate((name) => document.documentElement.setAttribute('w-theme', name), theme);
    await mount(ATTENTION_LIST);
    expect(await runAxe(page)).toEqual([]);
  });
}

test('the "Needs your attention" list names the list and its rows', async ({ mount, page }) => {
  await mount(ATTENTION_LIST);
  await expect(page.getByRole('list', { name: 'Needs your attention' })).toBeVisible();
  await expect(page.getByRole('listitem')).toHaveCount(2);
  await expect(page.locator('#row-1 .w-list-item-subtitle')).toHaveText('Chat with Ana');
  await expect(page.locator('#row-1 .w-send-status-reason')).toHaveText('The server refused the message.');
});

test('the "Needs your attention" buttons say what they act on', async ({ mount, page }) => {
  await mount(ATTENTION_LIST);
  const retry = page.locator('#retry-1 button');
  await expect(retry).toHaveAccessibleName('Retry');
  await expect(retry).toHaveAccessibleDescription('Lunch on Friday?');
  await expect(page.locator('#discard-2 button')).toHaveAccessibleDescription('Quarterly report');
});

test('the "Needs your attention" list tabs through the buttons in reading order', async ({ mount, page }) => {
  await mount(ATTENTION_LIST);
  const order = [];
  for (let step = 0; step < 4; step += 1) {
    await page.keyboard.press('Tab');
    order.push(await page.evaluate(() => document.activeElement.closest('w-btn')?.id || ''));
  }
  expect(order).toEqual(['retry-1', 'discard-1', 'retry-2', 'discard-2']);
});

test('the "Needs your attention" empty state uses w-empty-state', async ({ mount, page }) => {
  await mount('<w-empty-state id="empty" title="Nothing needs your attention"></w-empty-state>');
  await expect(page.locator('#empty h2')).toHaveText('Nothing needs your attention');
});

test('w-list-item gives its title the id "<host id>-title"', async ({ mount, page }) => {
  await mount('<w-list-item id="row" title="Hello"></w-list-item><w-list-item title="No id"></w-list-item>');
  await expect(page.locator('#row-title')).toHaveText('Hello');
  await expect(page.locator('.w-list-item-title[id]')).toHaveCount(1);
});

test('w-list-item static row shows its default content under the subtitle', async ({ mount, page }) => {
  await mount('<w-list-item id="row" item-role="none" title="Hello" subtitle="Inbox"><span id="extra">More</span></w-list-item>');
  await expect(page.locator('#row .w-list-item-content #extra')).toBeVisible();
  await page.locator('#row').evaluate((element) => element.setAttribute('subtitle', 'Sent'));
  await expect(page.locator('#row .w-list-item-content #extra')).toHaveText('More');
});

test('w-list-item interactive row still drops default content when titled', async ({ mount, page }) => {
  await mount('<w-list-item id="row" title="Hello"><span id="extra">More</span></w-list-item>');
  await expect(page.locator('#row #extra')).toHaveCount(0);
});

test('the docs demo removes rows, shows the empty state and fails them again', async ({ mount, page }) => {
  const source = readFileSync(new URL('../../website/client/pages/docs/send-status/tac.html', import.meta.url), 'utf8');
  const start = source.indexOf('<div data-attention-demo>');
  const end = source.indexOf('</demo-compare>', start);
  await mount(source.slice(start, end));
  await page.evaluate(async () => {
    const { default: SendStatusPage } = await import('/website/client/pages/docs/send-status/tac.js');
    new SendStatusPage().onMount();
  });
  await recordAnnouncements(page);
  await page.locator('#attention-1 [data-attention-discard] button').click();
  await page.locator('#attention-2 [data-attention-retry] button').click();
  await expect(page.locator('#attention-2 w-send-status')).toHaveAttribute('state', 'sending');
  await page.locator('#attention-3 [data-attention-discard] button').click();
  await expect(page.locator('w-list-item')).toHaveCount(0);
  await expect(page.locator('[data-attention-empty]')).toBeVisible();
  await expect(page.locator('[data-attention-list]')).toBeHidden();
  await page.locator('[data-attention-reset] button').click();
  await expect(page.locator('w-list-item')).toHaveCount(3);
  await expect(page.locator('[data-attention-empty]')).toBeHidden();
  await expect(page.locator('w-send-status[state="failed"]')).toHaveCount(3);
  expect(await readAnnouncements(page)).toEqual(['3 not sent. Needs your attention.']);
});

async function lineReport(page, selector) {
  return page.locator(selector).evaluate((host) => {
    const middle = (element) => {
      const box = element.getClientRects()[0];
      return box.top + box.height / 2;
    };
    const text = host.querySelector('.w-send-status-text');
    const separator = host.querySelector('.w-send-status-separator');
    const reason = host.querySelector('.w-send-status-reason');
    const lineHeight = Number.parseFloat(getComputedStyle(text).lineHeight);
    return {
      separatorOnTextLine: Math.abs(middle(separator) - middle(text)) < lineHeight / 2,
      reasonOnTextLine: Math.abs(middle(reason) - middle(text)) < lineHeight / 2,
      separatorAfterText: getComputedStyle(host).direction === 'rtl'
        ? separator.getBoundingClientRect().right <= text.getBoundingClientRect().left + 1
        : separator.getBoundingClientRect().left >= text.getBoundingClientRect().right - 1,
    };
  });
}

test('w-send-status keeps the separator with the failed text when the reason wraps', async ({ mount, page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await mount(`<div style="width: 220px"><w-send-status id="s" state="failed" reason="Bo Lee is no longer in example.com"></w-send-status></div>`);
  expect(await lineReport(page, '#s')).toEqual({ separatorOnTextLine: true, reasonOnTextLine: false, separatorAfterText: true });
});

test('w-send-status keeps the separator with the failed text in right-to-left layout', async ({ mount, page }) => {
  await mount(`<div dir="rtl" style="width: 220px"><w-send-status id="s" state="failed" failed-text="לא נשלח" reason="בו לי כבר לא נמצא ב-example.com"></w-send-status></div>`);
  expect(await lineReport(page, '#s')).toEqual({ separatorOnTextLine: true, reasonOnTextLine: false, separatorAfterText: true });
});

test('w-send-status keeps the reason on one line with the text when there is room', async ({ mount, page }) => {
  await mount('<w-send-status id="s" state="failed" reason="Mailbox full."></w-send-status>');
  expect(await lineReport(page, '#s')).toEqual({ separatorOnTextLine: true, reasonOnTextLine: true, separatorAfterText: true });
  await expect(page.locator('#s .w-send-status-separator')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('#s .w-send-status-text')).toHaveText('Not sent');
});

test('the "Needs your attention" rows show the whole title and start at the row padding', async ({ mount, page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await mount(ATTENTION_LIST.replace('title="Lunch on Friday?"', 'title="Here are the two logo options we talked about on Monday, with the brand colours"'));
  const row = await page.locator('#row-1').evaluate((host) => {
    const control = host.querySelector('.w-list-item');
    const title = host.querySelector('.w-list-item-title');
    return {
      cut: title.scrollWidth > title.clientWidth,
      start: Math.round(title.getBoundingClientRect().left - control.getBoundingClientRect().left),
      padding: Math.round(Number.parseFloat(getComputedStyle(control).paddingInlineStart)),
    };
  });
  expect([row.cut, row.start]).toEqual([false, row.padding]);
});

test('the docs attention demo wraps its titles and drops the empty leading space', async ({ mount, page }) => {
  const source = readFileSync(new URL('../../website/client/pages/docs/send-status/tac.html', import.meta.url), 'utf8');
  const start = source.indexOf('<div data-attention-demo>');
  const end = source.indexOf('</demo-compare>', start);
  await mount(source.slice(start, end));
  await expect(page.locator('w-list-item[wrap][no-prepend-space]')).toHaveCount(3);
  await expect(page.locator('[data-attention-empty] h2')).toHaveText('Nothing needs your attention');
});
