import { expect, test } from '../setup/component-test.js';

async function formatTimes(page, locale) {
  return page.evaluate(async (pageLocale) => {
    const { WOfflineText } = await import('/src/components/offline-text.js');
    const now = new Date(2026, 10, 11, 10, 0);
    const at = (year, month, day) => new Date(year, month, day, 8, 12).toISOString();
    return {
      today: WOfflineText.time(at(2026, 10, 11), pageLocale, now),
      twoDaysAgo: WOfflineText.time(at(2026, 10, 9), pageLocale, now),
      eightDaysAgo: WOfflineText.time(at(2026, 10, 3), pageLocale, now),
      lastYear: WOfflineText.time(at(2025, 10, 3), pageLocale, now),
      tomorrow: WOfflineText.time(at(2026, 10, 12), pageLocale, now),
      invalid: WOfflineText.time('not a time', pageLocale, now),
      empty: WOfflineText.time('', pageLocale, now),
    };
  }, locale);
}

async function formatBytes(page, locale, counts) {
  return page.evaluate(async ({ pageLocale, pageCounts }) => {
    const { WOfflineText } = await import('/src/components/offline-text.js');
    return pageCounts.map((count) => WOfflineText.bytes(count, pageLocale));
  }, { pageLocale: locale, pageCounts: counts });
}

test('WOfflineText.time shows only the clock time today', async ({ mount, page }) => {
  await mount('<p>time</p>');
  const times = await formatTimes(page, 'en-GB');
  expect(times.today).toBe('08:12');
});

test('WOfflineText.time adds the weekday in the 6 days before', async ({ mount, page }) => {
  await mount('<p>time</p>');
  const times = await formatTimes(page, 'en-GB');
  expect(times.twoDaysAgo).toBe('Mon 08:12');
});

test('WOfflineText.time adds day and month earlier this year', async ({ mount, page }) => {
  await mount('<p>time</p>');
  const times = await formatTimes(page, 'en-GB');
  expect(times.eightDaysAgo).toMatch(/^3 Nov.* 08:12$/);
});

test('WOfflineText.time adds the year for another year', async ({ mount, page }) => {
  await mount('<p>time</p>');
  const times = await formatTimes(page, 'en-GB');
  expect(times.lastYear).toMatch(/^3 Nov 2025.* 08:12$/);
});

test('WOfflineText.time shows a future day with its date', async ({ mount, page }) => {
  await mount('<p>time</p>');
  const times = await formatTimes(page, 'en-GB');
  expect(times.tomorrow).toMatch(/^12 Nov.* 08:12$/);
});

test('WOfflineText.time gives an empty text for an invalid or empty time', async ({ mount, page }) => {
  await mount('<p>time</p>');
  const times = await formatTimes(page, 'en-GB');
  expect([times.invalid, times.empty]).toEqual(['', '']);
});

test('WOfflineText.time follows a 12-hour locale', async ({ mount, page }) => {
  await mount('<p>time</p>');
  const times = await formatTimes(page, 'en-US');
  expect(times.today).toMatch(/^08:12\sAM$/);
});

test('WOfflineText.time falls back to English for an invalid locale', async ({ mount, page }) => {
  await mount('<p>time</p>');
  const times = await formatTimes(page, 'not_a_locale!');
  expect(times.today).toMatch(/^08:12/);
});

test('WOfflineText.bytes uses decimal units with kB at least', async ({ mount, page }) => {
  await mount('<p>bytes</p>');
  const sizes = await formatBytes(page, 'en', [0, 500, 1500, 312e6, 1e9, 1.234e9, 5e15]);
  expect(sizes).toEqual(['0 kB', '0.5 kB', '1.5 kB', '312 MB', '1 GB', '1.2 GB', '5,000 TB']);
});

test('WOfflineText.bytes treats a negative or non-number count as zero', async ({ mount, page }) => {
  await mount('<p>bytes</p>');
  const sizes = await formatBytes(page, 'en', [-5, 'abc', null]);
  expect(sizes).toEqual(['0 kB', '0 kB', '0 kB']);
});

test('WOfflineText.bytes follows the locale number style', async ({ mount, page }) => {
  await mount('<p>bytes</p>');
  const sizes = await formatBytes(page, 'de', [1.234e9]);
  expect(sizes[0]).toMatch(/^1,2\sGB$/);
});

test('WOfflineText.fill replaces known names and keeps unknown ones', async ({ mount, page }) => {
  await mount('<p>fill</p>');
  const text = await page.evaluate(async () => {
    const { WOfflineText } = await import('/src/components/offline-text.js');
    return WOfflineText.fill('{count} waiting to send {other}', { count: 3 });
  });
  expect(text).toBe('3 waiting to send {other}');
});

test('WOfflineText.locale reads the closest lang, then the page lang', async ({ mount, page }) => {
  await mount('<div lang="fr-CA"><span id="inner">x</span></div><span id="outer">y</span>');
  const locales = await page.evaluate(async () => {
    const { WOfflineText } = await import('/src/components/offline-text.js');
    return [
      WOfflineText.locale(document.getElementById('inner')),
      WOfflineText.locale(document.getElementById('outer')),
      WOfflineText.locale(null),
    ];
  });
  expect(locales).toEqual(['fr-CA', 'en', 'en']);
});
