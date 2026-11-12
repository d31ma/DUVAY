import { expect, test } from '../setup/component-test.js';

const GIGABYTE = 1000000000;
const MEGABYTE = 1000000;
const LEVELS_HTML = `
  <w-storage-meter id="normal" value="${312 * MEGABYTE}" max="${GIGABYTE}"></w-storage-meter>
  <w-storage-meter id="warn" value="${850 * MEGABYTE}" max="${GIGABYTE}"></w-storage-meter>
  <w-storage-meter id="full" value="${980 * MEGABYTE}" max="${GIGABYTE}"></w-storage-meter>`;

async function meterAttributes(page, selector) {
  const meter = page.locator(`${selector} [role="meter"]`);
  await expect(meter).toHaveCount(1);
  return meter.evaluate((element) => ({
    min: element.getAttribute('aria-valuemin'),
    max: element.getAttribute('aria-valuemax'),
    now: element.getAttribute('aria-valuenow'),
    text: element.getAttribute('aria-valuetext'),
    name: element.getAttribute('aria-labelledby') && document.getElementById(element.getAttribute('aria-labelledby')).textContent,
    live: element.getAttribute('aria-live'),
    tabIndex: element.tabIndex,
  }));
}

async function visibleParts(page, selector) {
  return page.locator(selector).evaluate((host) => ({
    label: host.querySelector('.w-storage-meter-label').textContent,
    state: host.querySelector('.w-storage-meter-state')?.textContent ?? '',
    hasIcon: Boolean(host.querySelector('.w-storage-meter-state svg')),
    value: host.querySelector('.w-storage-meter-value').textContent,
    fill: host.querySelector('.w-storage-meter-bar').style.inlineSize,
  }));
}

async function contrastReport(page, theme) {
  await page.evaluate((name) => document.documentElement.setAttribute('w-theme', name), theme);
  return page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const paint = (colors) => {
      context.clearRect(0, 0, 1, 1);
      colors.forEach((color) => {
        context.fillStyle = color;
        context.fillRect(0, 0, 1, 1);
      });
      return Array.from(context.getImageData(0, 0, 1, 1).data.slice(0, 3));
    };
    const channel = (value) => {
      const share = value / 255;
      return share <= 0.03928 ? share / 12.92 : ((share + 0.055) / 1.055) ** 2.4;
    };
    const luminance = (rgb) => 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
    const ratio = (first, second) => {
      const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
      return (light + 0.05) / (dark + 0.05);
    };
    const pageColor = getComputedStyle(document.body).backgroundColor;
    const style = (element) => getComputedStyle(element);
    const report = {};
    document.querySelectorAll('w-storage-meter').forEach((host) => {
      const track = paint([pageColor, style(host.querySelector('.w-storage-meter-track')).backgroundColor]);
      const bar = paint([pageColor, style(host.querySelector('.w-storage-meter-bar')).backgroundColor]);
      const textOn = (selector, background) => {
        const element = host.querySelector(selector);
        return element ? ratio(paint([background, style(element).color]), paint([background])) : null;
      };
      const state = host.querySelector('.w-storage-meter-state');
      const stateBackground = state ? `rgb(${paint([pageColor, style(state).backgroundColor]).join(',')})` : pageColor;
      report[host.id] = {
        bar: ratio(bar, track),
        label: textOn('.w-storage-meter-label', pageColor),
        value: textOn('.w-storage-meter-value', pageColor),
        state: textOn('.w-storage-meter-state', stateBackground),
        icon: textOn('.w-storage-meter-icon', stateBackground),
      };
    });
    return report;
  });
}

function lowestRatio(report, part) {
  return Math.min(...Object.values(report).map((meter) => meter[part]).filter((value) => value !== null));
}

test('w-storage-meter renders role="meter" with its values in bytes', async ({ mount, page }) => {
  await mount(`<w-storage-meter value="${312 * MEGABYTE}" max="${GIGABYTE}"></w-storage-meter>`);
  const meter = await meterAttributes(page, 'w-storage-meter');
  expect(meter).toEqual({
    min: '0',
    max: String(GIGABYTE),
    now: String(312 * MEGABYTE),
    text: '312 MB of 1 GB used',
    name: 'Space used on this device',
    live: null,
    tabIndex: -1,
  });
});

test('w-storage-meter shows the label, the bar and the value text', async ({ mount, page }) => {
  await mount(`<w-storage-meter value="${312 * MEGABYTE}" max="${GIGABYTE}"></w-storage-meter>`);
  const parts = await visibleParts(page, 'w-storage-meter');
  expect(parts).toEqual({ label: 'Space used on this device', state: '', hasIcon: false, value: '312 MB of 1 GB used', fill: '31.2%' });
});

test('w-storage-meter uses the label attribute as visible label and accessible name', async ({ mount, page }) => {
  await mount(`<w-storage-meter label="Mail" value="${MEGABYTE}" max="${GIGABYTE}"></w-storage-meter>`);
  await expect(page.getByRole('meter', { name: 'Mail' })).toBeVisible();
});

test('w-storage-meter takes no keyboard focus', async ({ mount, page }) => {
  await mount(`<button id="before">Before</button><w-storage-meter value="1" max="10"></w-storage-meter><button id="after">After</button>`);
  await page.locator('#before').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#after')).toBeFocused();
});

test('w-storage-meter formats bytes in English', async ({ mount, page }) => {
  await mount(`<div lang="en"><w-storage-meter value="1500000" max="${12 * GIGABYTE}"></w-storage-meter></div>`);
  const parts = await visibleParts(page, 'w-storage-meter');
  expect(parts.value).toBe('1.5 MB of 12 GB used');
});

test('w-storage-meter formats bytes in German with a translated text', async ({ mount, page }) => {
  await mount(`<div lang="de"><w-storage-meter value="1500000" max="${12 * GIGABYTE}" label="Belegter Speicher" value-text="{used} von {max} belegt"></w-storage-meter></div>`);
  const meter = await meterAttributes(page, 'w-storage-meter');
  expect([meter.name, meter.text.replace(/\s/g, ' ')]).toEqual(['Belegter Speicher', '1,5 MB von 12 GB belegt']);
});

test('w-storage-meter shows "Almost full" in words and the warning colour from warn-at', async ({ mount, page }) => {
  await mount(LEVELS_HTML);
  const parts = await visibleParts(page, '#warn');
  const meter = await meterAttributes(page, '#warn');
  await expect(page.locator('#warn .w-storage-meter')).toHaveClass(/w-storage-meter--warn/);
  expect([parts.state, parts.hasIcon, meter.text]).toEqual(['Almost full', true, '850 MB of 1 GB used, almost full']);
});

test('w-storage-meter shows "Full" in words and the error colour from full-at', async ({ mount, page }) => {
  await mount(LEVELS_HTML);
  const parts = await visibleParts(page, '#full');
  const meter = await meterAttributes(page, '#full');
  await expect(page.locator('#full .w-storage-meter')).toHaveClass(/w-storage-meter--full/);
  expect([parts.state, parts.hasIcon, meter.text]).toEqual(['Full', true, '980 MB of 1 GB used, full']);
});

test('w-storage-meter shows no state words below warn-at', async ({ mount, page }) => {
  await mount(LEVELS_HTML);
  const parts = await visibleParts(page, '#normal');
  await expect(page.locator('#normal .w-storage-meter')).toHaveClass('w-storage-meter');
  expect(parts.state).toBe('');
});

test('w-storage-meter uses the three fill colours in order', async ({ mount, page }) => {
  await mount(LEVELS_HTML);
  const fills = await page.locator('.w-storage-meter-bar').evaluateAll((bars) => bars.map((bar) => getComputedStyle(bar).backgroundColor));
  expect(new Set(fills).size).toBe(3);
});

test('w-storage-meter honours custom warn-at and full-at', async ({ mount, page }) => {
  await mount(`
    <w-storage-meter id="warn" value="50" max="100" warn-at="0.5" full-at="0.9"></w-storage-meter>
    <w-storage-meter id="full" value="90" max="100" warn-at="0.5" full-at="0.9"></w-storage-meter>`);
  const states = [(await visibleParts(page, '#warn')).state, (await visibleParts(page, '#full')).state];
  expect(states).toEqual(['Almost full', 'Full']);
});

test('w-storage-meter falls back to the default shares for invalid warn-at and full-at', async ({ mount, page }) => {
  await mount(`<w-storage-meter value="85" max="100" warn-at="2" full-at="nope"></w-storage-meter>`);
  const parts = await visibleParts(page, 'w-storage-meter');
  expect(parts.state).toBe('Almost full');
});

test('w-storage-meter replaces the warn and full texts', async ({ mount, page }) => {
  await mount(`
    <w-storage-meter id="warn" value="85" max="100" warn-text="Fast voll"></w-storage-meter>
    <w-storage-meter id="full" value="99" max="100" full-text="Voll"></w-storage-meter>`);
  const states = [(await visibleParts(page, '#warn')).state, (await visibleParts(page, '#full')).state];
  expect(states).toEqual(['Fast voll', 'Voll']);
});

test('w-storage-meter fills the bar and counts as full when value is above max', async ({ mount, page }) => {
  await mount(`<w-storage-meter value="${1200 * MEGABYTE}" max="${GIGABYTE}"></w-storage-meter>`);
  const parts = await visibleParts(page, 'w-storage-meter');
  const meter = await meterAttributes(page, 'w-storage-meter');
  expect([parts.fill, parts.state, meter.now, meter.max, meter.text]).toEqual(['100%', 'Full', String(GIGABYTE), String(GIGABYTE), '1.2 GB of 1 GB used, full']);
});

test('w-storage-meter with max 0 shows the value without a bar fill', async ({ mount, page }) => {
  await mount(`<w-storage-meter value="${312 * MEGABYTE}"></w-storage-meter>`);
  const parts = await visibleParts(page, 'w-storage-meter');
  const meter = await meterAttributes(page, 'w-storage-meter');
  expect([parts.fill, parts.state, parts.value, meter.text, meter.now, meter.max]).toEqual(['0%', '', '312 MB', '312 MB', '0', '0']);
});

test('w-storage-meter counts a negative or empty value as 0', async ({ mount, page }) => {
  await mount(`<w-storage-meter value="-5" max="${GIGABYTE}"></w-storage-meter>`);
  const meter = await meterAttributes(page, 'w-storage-meter');
  expect([meter.now, meter.text]).toEqual(['0', '0 kB of 1 GB used']);
});

test('w-storage-meter updates when value changes, without a live region', async ({ mount, page }) => {
  await mount(`<w-storage-meter value="${100 * MEGABYTE}" max="${GIGABYTE}"></w-storage-meter>`);
  await page.locator('w-storage-meter').evaluate((host) => { host.value = 960000000; });
  const meter = await meterAttributes(page, 'w-storage-meter');
  const liveRegions = await page.locator('w-storage-meter [aria-live], w-storage-meter [role="status"]').count();
  expect([meter.text, liveRegions]).toEqual(['960 MB of 1 GB used, full', 0]);
});

test('w-storage-meter keeps the same label id across renders', async ({ mount, page }) => {
  await mount(`<w-storage-meter value="1" max="10"></w-storage-meter>`);
  const before = await page.locator('w-storage-meter [role="meter"]').getAttribute('aria-labelledby');
  await page.locator('w-storage-meter').evaluate((host) => host.setAttribute('value', '9'));
  const after = await page.locator('w-storage-meter [role="meter"]').getAttribute('aria-labelledby');
  expect(after).toBe(before);
});

test('w-storage-meter fills from the right in right-to-left layout', async ({ mount, page }) => {
  await mount(`<div dir="rtl" style="inline-size: 300px"><w-storage-meter value="25" max="100"></w-storage-meter></div>`);
  const edges = await page.locator('w-storage-meter').evaluate((host) => {
    const track = host.querySelector('.w-storage-meter-track').getBoundingClientRect();
    const bar = host.querySelector('.w-storage-meter-bar').getBoundingClientRect();
    return Math.round(track.right - bar.right);
  });
  expect(edges).toBe(0);
});

test('w-storage-meter bar keeps 3:1 against its track in the light theme', async ({ mount, page }) => {
  await mount(LEVELS_HTML);
  const report = await contrastReport(page, 'light');
  expect(lowestRatio(report, 'bar')).toBeGreaterThanOrEqual(3);
});

test('w-storage-meter bar keeps 3:1 against its track in the dark theme', async ({ mount, page }) => {
  await mount(LEVELS_HTML);
  const report = await contrastReport(page, 'dark');
  expect(lowestRatio(report, 'bar')).toBeGreaterThanOrEqual(3);
});

test('w-storage-meter bar keeps 3:1 against its track in the high-contrast theme', async ({ mount, page }) => {
  await mount(LEVELS_HTML);
  const report = await contrastReport(page, 'high-contrast');
  expect(lowestRatio(report, 'bar')).toBeGreaterThanOrEqual(3);
});

test('w-storage-meter text keeps 4.5:1 and icons 3:1 in the light theme', async ({ mount, page }) => {
  await mount(LEVELS_HTML);
  const report = await contrastReport(page, 'light');
  const lowest = [lowestRatio(report, 'label'), lowestRatio(report, 'value'), lowestRatio(report, 'state')];
  expect([Math.min(...lowest) >= 4.5, lowestRatio(report, 'icon') >= 3]).toEqual([true, true]);
});

test('w-storage-meter text keeps 4.5:1 and icons 3:1 in the dark theme', async ({ mount, page }) => {
  await mount(LEVELS_HTML);
  const report = await contrastReport(page, 'dark');
  const lowest = [lowestRatio(report, 'label'), lowestRatio(report, 'value'), lowestRatio(report, 'state')];
  expect([Math.min(...lowest) >= 4.5, lowestRatio(report, 'icon') >= 3]).toEqual([true, true]);
});

test('w-storage-meter text keeps 4.5:1 and icons 3:1 in the high-contrast theme', async ({ mount, page }) => {
  await mount(LEVELS_HTML);
  const report = await contrastReport(page, 'high-contrast');
  const lowest = [lowestRatio(report, 'label'), lowestRatio(report, 'value'), lowestRatio(report, 'state')];
  expect([Math.min(...lowest) >= 4.5, lowestRatio(report, 'icon') >= 3]).toEqual([true, true]);
});

test('w-storage-meter fits a 360 px wide screen without overflow', async ({ mount, page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await mount(`<w-storage-meter label="Attachments and other files kept on this device" value="${980 * MEGABYTE}" max="${GIGABYTE}"></w-storage-meter>`);
  const overflow = await page.locator('w-storage-meter').evaluate((host) => host.scrollWidth - host.clientWidth);
  expect(overflow).toBe(0);
});

test('w-storage-meter fills the width of its container', async ({ mount, page }) => {
  await mount(`<div style="inline-size: 600px"><w-storage-meter value="1" max="10"></w-storage-meter></div>`);
  const width = await page.locator('w-storage-meter .w-storage-meter-track').evaluate((track) => Math.round(track.getBoundingClientRect().width));
  expect(width).toBe(600);
});

test('w-storage-meter reads the state words in lower case after the comma', async ({ mount, page }) => {
  await mount(`
    <div lang="de"><w-storage-meter id="de" value="${850 * MEGABYTE}" max="${GIGABYTE}" value-text="{used} von {max} belegt" warn-text="Fast voll"></w-storage-meter></div>
    <w-storage-meter id="acronym" value="${990 * MEGABYTE}" max="${GIGABYTE}" full-text="SSD full"></w-storage-meter>`);
  const german = await meterAttributes(page, '#de');
  const acronym = await meterAttributes(page, '#acronym');
  expect([(await visibleParts(page, '#de')).state, german.text.replace(/\s/g, ' ')]).toEqual(['Fast voll', '850 MB von 1 GB belegt, fast voll']);
  expect(acronym.text).toBe('990 MB of 1 GB used, SSD full');
});
