import { expect, test } from '../setup/component-test.js';

const ANNOUNCE_WAIT_MS = 1400;

async function recordRegion(page) {
  await page.evaluate(async () => {
    const { WLiveAnnouncer } = await import('/src/components/live-announcer.js');
    window.__announcements = [];
    const region = WLiveAnnouncer.region();
    new MutationObserver(() => {
      if (region.textContent) window.__announcements.push(region.textContent);
    }).observe(region, { childList: true, characterData: true, subtree: true });
  });
}

async function failRows(page, ids) {
  await page.waitForTimeout(50);
  await recordRegion(page);
  await page.evaluate((list) => list.forEach((id) => document.getElementById(id).setAttribute('state', 'failed')), ids);
  await page.waitForTimeout(ANNOUNCE_WAIT_MS);
  return page.evaluate(() => window.__announcements);
}

async function helper(page, name, args) {
  return page.evaluate(async ({ fn, values }) => {
    const { WOfflineText } = await import('/src/components/offline-text.js');
    return WOfflineText[fn](...values);
  }, { fn: name, values: args });
}

test('WOfflineText.textNames looks up the plural form, then other, then the plain text', async ({ mount, page }) => {
  await mount('<p>names</p>');
  expect(await helper(page, 'textNames', ['pending', 'few'])).toEqual(['pending-text-few', 'pending-text-other', 'pending-text']);
  expect(await helper(page, 'textNames', ['attention', 'other'])).toEqual(['attention-text-other', 'attention-text']);
});

test('WOfflineText.pluralAttributes lists the six forms of each name', async ({ mount, page }) => {
  await mount('<p>names</p>');
  expect(await helper(page, 'pluralAttributes', [['sent']])).toEqual([
    'sent-text-zero', 'sent-text-one', 'sent-text-two', 'sent-text-few', 'sent-text-many', 'sent-text-other',
  ]);
});

test('WOfflineText.queueParts gives the item being sent and the total', async ({ mount, page }) => {
  await mount('<p>queue</p>');
  expect(await helper(page, 'queueParts', [2, 2])).toEqual({ current: 3, total: 4 });
  expect(await helper(page, 'queueParts', [0, 1])).toEqual({ current: 1, total: 1 });
  expect(await helper(page, 'queueParts', [4, 0])).toBeNull();
  expect(await helper(page, 'queueParts', [-3, 2.7])).toEqual({ current: 1, total: 2 });
});

test('WOfflineText.hourCycle accepts only the four Intl hour cycles', async ({ mount, page }) => {
  await mount('<p>cycle</p>');
  expect(await helper(page, 'hourCycle', ['h23'])).toBe('h23');
  expect(await helper(page, 'hourCycle', ['h12'])).toBe('h12');
  expect(await helper(page, 'hourCycle', ['24'])).toBe('');
  expect(await helper(page, 'hourCycle', [''])).toBe('');
});

test('WOfflineText.time takes an hour cycle', async ({ mount, page }) => {
  await mount('<p>time</p>');
  const times = await page.evaluate(async () => {
    const { WOfflineText } = await import('/src/components/offline-text.js');
    const now = new Date(2026, 10, 11, 22, 0);
    const iso = new Date(2026, 10, 11, 20, 5).toISOString();
    return [WOfflineText.time(iso, 'en', now, 'h23'), WOfflineText.time(iso, 'en-GB', now, 'h12'), WOfflineText.time(iso, 'en-GB', now)];
  });
  expect(times[0]).toBe('20:05');
  expect(times[1]).toMatch(/^08:05\spm$/i);
  expect(times[2]).toBe('20:05');
});

test('w-sync-status picks the English singular and plural count texts', async ({ mount, page }) => {
  const plural = 'pending-text-one="{count} item waits" pending-text-other="{count} items wait" attention-text-one="{count} item needs your attention" attention-text-other="{count} items need your attention"';
  await mount(`
    <w-sync-status id="one" state="offline" pending="1" attention="1" ${plural}></w-sync-status>
    <w-sync-status id="many" state="offline" pending="3" attention="3" ${plural}></w-sync-status>
  `);
  await expect(page.locator('#one .w-sync-status__part')).toHaveText(['1 item waits', '1 item needs your attention']);
  await expect(page.locator('#many .w-sync-status__part')).toHaveText(['3 items wait', '3 items need your attention']);
});

test('w-sync-status uses the language plural rules for the closest lang', async ({ mount, page }) => {
  const plural = 'pending-text-one="{count} wiadomość czeka" pending-text-few="{count} wiadomości czekają" pending-text-many="{count} wiadomości czeka"';
  await mount(`<div lang="pl">
    <w-sync-status id="p1" state="offline" pending="1" ${plural}></w-sync-status>
    <w-sync-status id="p3" state="offline" pending="3" ${plural}></w-sync-status>
    <w-sync-status id="p5" state="offline" pending="5" ${plural}></w-sync-status>
    <w-sync-status id="p22" state="offline" pending="22" ${plural}></w-sync-status>
  </div>`);
  await expect(page.locator('#p1 .w-sync-status__part')).toHaveText('1 wiadomość czeka');
  await expect(page.locator('#p3 .w-sync-status__part')).toHaveText('3 wiadomości czekają');
  await expect(page.locator('#p5 .w-sync-status__part')).toHaveText('5 wiadomości czeka');
  await expect(page.locator('#p22 .w-sync-status__part')).toHaveText('22 wiadomości czekają');
});

test('w-sync-status falls back from a missing plural form to other, then the plain text, then the default', async ({ mount, page }) => {
  await mount(`
    <w-sync-status id="o" state="offline" pending="3" pending-text-one="{count} item" pending-text-other="{count} items" pending-text="plain {count}"></w-sync-status>
    <w-sync-status id="p" state="offline" pending="3" pending-text-one="{count} item" pending-text="plain {count}"></w-sync-status>
    <w-sync-status id="d" state="offline" pending="3" pending-text-one="{count} item"></w-sync-status>
  `);
  await expect(page.locator('#o .w-sync-status__part')).toHaveText('3 items');
  await expect(page.locator('#p .w-sync-status__part')).toHaveText('plain 3');
  await expect(page.locator('#d .w-sync-status__part')).toHaveText('3 waiting to send');
});

test('w-sync-status plural forms apply to the queue, sent and others-sent texts', async ({ mount, page }) => {
  await mount(`
    <w-sync-status id="q" state="sending" sent="0" pending="1" queue-text-one="the last one" queue-text-other="{current} of {total}"></w-sync-status>
    <w-sync-status id="s" state="sent" sent="1" sent-timeout="0" sent-text-one="{count} message sent" sent-text-other="{count} messages sent"></w-sync-status>
    <w-sync-status id="a" state="sent" sent="1" attention="2" sent-timeout="0" others-sent-text-one="{count} other sent" others-sent-text-other="{count} others sent"></w-sync-status>
  `);
  await expect(page.locator('#q .w-sync-status__part')).toHaveText('the last one');
  await expect(page.locator('#s .w-sync-status__part')).toHaveText('1 message sent');
  await expect(page.locator('#a .w-sync-status__part')).toHaveText(['Needs your attention: 2', '1 other sent']);
});

test('w-sync-status re-renders when a plural text attribute changes', async ({ mount, page }) => {
  await mount('<w-sync-status id="s" state="offline" pending="1"></w-sync-status>');
  await page.evaluate(() => document.querySelector('#s').setAttribute('pending-text-one', 'one item waits'));
  await expect(page.locator('#s .w-sync-status__part')).toHaveText('one item waits');
});

test('w-sync-status announces the sent summary in the plural form', async ({ mount, page }) => {
  await mount('<w-sync-status id="s" state="sending" pending="1" sent-timeout="0" sent-announce-text-one="Up to date. {count} item sent." sent-announce-text-other="Up to date. {count} items sent."></w-sync-status>');
  const line = await page.evaluate(async () => {
    const element = document.querySelector('#s');
    const heard = [];
    const live = element.querySelector('.w-sync-status__live');
    new MutationObserver(() => { if (live.textContent) heard.push(live.textContent); }).observe(live, { childList: true, characterData: true, subtree: true });
    element.setAttribute('sent', '1');
    element.setAttribute('pending', '0');
    element.setAttribute('state', 'sent');
    await new Promise((resolve) => { setTimeout(resolve, 2400); });
    return heard;
  });
  expect(line).toEqual(['Up to date. 1 item sent.']);
});

test('w-send-status announces one failure in the singular form', async ({ mount, page }) => {
  const plural = 'failed-announce-text-one="{count} item not sent." failed-announce-text-other="{count} items not sent."';
  await mount(`<w-send-status id="a" state="sending" ${plural}></w-send-status>`);
  expect(await failRows(page, ['a'])).toEqual(['1 item not sent.']);
});

test('w-send-status announces several failures in the plural form', async ({ mount, page }) => {
  const plural = 'failed-announce-text-one="{count} item not sent." failed-announce-text-other="{count} items not sent."';
  await mount(`<w-send-status id="a" state="sending" ${plural}></w-send-status><w-send-status id="b" state="sending" ${plural}></w-send-status><w-send-status id="c" state="sending" ${plural}></w-send-status>`);
  expect(await failRows(page, ['a', 'b', 'c'])).toEqual(['3 items not sent.']);
});

test('w-send-status keeps the plain failed-announce-text without plural forms', async ({ mount, page }) => {
  await mount('<w-send-status id="a" state="sending"></w-send-status><w-send-status id="b" state="sending"></w-send-status>');
  expect(await failRows(page, ['a', 'b'])).toEqual(['2 not sent. Needs your attention.']);
});

test('w-send-status hour-cycle sets the written time to 24 hours', async ({ mount, page }) => {
  const iso = await page.evaluate(() => {
    const date = new Date();
    date.setHours(20, 5, 0, 0);
    return date.toISOString();
  });
  await mount(`<div lang="en"><w-send-status id="s" state="sent" written-at="${iso}" hour-cycle="h23"></w-send-status><w-send-status id="d" state="sent" written-at="${iso}"></w-send-status></div>`);
  await expect(page.locator('#s .w-send-status-text')).toHaveText('Written offline at 20:05');
  await expect(page.locator('#d .w-send-status-text')).toHaveText(/^Written offline at 08:05\sPM$/i);
});

test('WLiveAnnouncer.tally takes a template function of the count', async ({ mount, page }) => {
  await mount('<p>tally</p>');
  await recordRegion(page);
  await page.evaluate(async () => {
    const { WLiveAnnouncer } = await import('/src/components/live-announcer.js');
    const template = (count) => (count === 1 ? '{count} thing' : '{count} things');
    WLiveAnnouncer.tally('things', template, 100);
    WLiveAnnouncer.tally('things', template, 100);
  });
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => window.__announcements)).toEqual(['2 things']);
});

test('w-storage-meter has no count texts: byte units are plural through Intl', async ({ mount, page }) => {
  await mount('<w-storage-meter id="m" value="1000" max="2000000"></w-storage-meter>');
  await expect(page.locator('#m .w-storage-meter-value')).toHaveText('1 kB of 2 MB used');
});
