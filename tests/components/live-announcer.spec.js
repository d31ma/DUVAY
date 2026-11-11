import { expect, test } from '../setup/component-test.js';

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

async function readAnnouncements(page, waitMs) {
  await page.waitForTimeout(waitMs);
  return page.evaluate(() => window.__announcements);
}

test('WLiveAnnouncer adds one hidden polite status region to the page', async ({ mount, page }) => {
  await mount('<p>page</p>');
  await page.evaluate(async () => {
    const { WLiveAnnouncer } = await import('/src/components/live-announcer.js');
    WLiveAnnouncer.announce('a', 'First');
    WLiveAnnouncer.announce('b', 'Second');
  });
  const region = page.locator('#w-live-announcer');
  await expect(region).toHaveCount(1);
  await expect(region).toHaveAttribute('role', 'status');
  await expect(region).toHaveAttribute('aria-live', 'polite');
  await expect(region).toHaveAttribute('aria-atomic', 'true');
  await expect(region).toHaveClass(/w-sr-only/);
});

test('WLiveAnnouncer.tally says 20 changes inside the window once', async ({ mount, page }) => {
  await mount('<p>page</p>');
  await recordAnnouncements(page);
  await page.evaluate(async () => {
    const { WLiveAnnouncer } = await import('/src/components/live-announcer.js');
    Array.from({ length: 20 }).forEach(() => {
      WLiveAnnouncer.tally('failed', '{count} not sent. Needs your attention.', 200);
    });
  });
  expect(await readAnnouncements(page, 500)).toEqual(['20 not sent. Needs your attention.']);
});

test('WLiveAnnouncer.tally starts a new count after the window', async ({ mount, page }) => {
  await mount('<p>page</p>');
  await recordAnnouncements(page);
  await page.evaluate(async () => {
    const { WLiveAnnouncer } = await import('/src/components/live-announcer.js');
    WLiveAnnouncer.tally('failed', '{count} not sent.', 100);
    WLiveAnnouncer.tally('failed', '{count} not sent.', 100);
    await new Promise((resolve) => { setTimeout(resolve, 300); });
    WLiveAnnouncer.tally('failed', '{count} not sent.', 100);
  });
  expect(await readAnnouncements(page, 400)).toEqual(['2 not sent.', '1 not sent.']);
});

test('WLiveAnnouncer.announce keeps the latest text for a key', async ({ mount, page }) => {
  await mount('<p>page</p>');
  await recordAnnouncements(page);
  await page.evaluate(async () => {
    const { WLiveAnnouncer } = await import('/src/components/live-announcer.js');
    WLiveAnnouncer.announce('network', 'Offline', 200);
    WLiveAnnouncer.announce('network', 'Back online', 200);
    WLiveAnnouncer.announce('network', 'Offline', 200);
  });
  expect(await readAnnouncements(page, 500)).toEqual(['Offline']);
});

test('WLiveAnnouncer joins messages of several keys that are due together', async ({ mount, page }) => {
  await mount('<p>page</p>');
  await recordAnnouncements(page);
  await page.evaluate(async () => {
    const { WLiveAnnouncer } = await import('/src/components/live-announcer.js');
    WLiveAnnouncer.announce('network', 'Offline.');
    WLiveAnnouncer.tally('failed', '{count} not sent.', 0);
  });
  expect(await readAnnouncements(page, 300)).toEqual(['Offline. 1 not sent.']);
});

test('WLiveAnnouncer repeats the same text as a new announcement', async ({ mount, page }) => {
  await mount('<p>page</p>');
  await recordAnnouncements(page);
  await page.evaluate(async () => {
    const { WLiveAnnouncer } = await import('/src/components/live-announcer.js');
    WLiveAnnouncer.announce('network', 'Offline');
    await new Promise((resolve) => { setTimeout(resolve, 200); });
    WLiveAnnouncer.announce('network', 'Offline');
  });
  expect(await readAnnouncements(page, 300)).toEqual(['Offline', 'Offline']);
});

test('WLiveAnnouncer.cancel drops a waiting message', async ({ mount, page }) => {
  await mount('<p>page</p>');
  await recordAnnouncements(page);
  await page.evaluate(async () => {
    const { WLiveAnnouncer } = await import('/src/components/live-announcer.js');
    WLiveAnnouncer.announce('network', 'Offline', 100);
    WLiveAnnouncer.cancel('network');
  });
  expect(await readAnnouncements(page, 300)).toEqual([]);
});

test('WLiveAnnouncer ignores an empty text', async ({ mount, page }) => {
  await mount('<p>page</p>');
  await recordAnnouncements(page);
  await page.evaluate(async () => {
    const { WLiveAnnouncer } = await import('/src/components/live-announcer.js');
    WLiveAnnouncer.announce('network', '');
  });
  expect(await readAnnouncements(page, 200)).toEqual([]);
});

test('WLiveAnnouncer makes a new region when the old one was removed', async ({ mount, page }) => {
  await mount('<p>page</p>');
  const count = await page.evaluate(async () => {
    const { WLiveAnnouncer } = await import('/src/components/live-announcer.js');
    WLiveAnnouncer.region().remove();
    WLiveAnnouncer.announce('network', 'Offline');
    await new Promise((resolve) => { setTimeout(resolve, 100); });
    return document.querySelectorAll('#w-live-announcer').length;
  });
  expect(count).toBe(1);
});
