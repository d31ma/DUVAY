import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

const latestTags = [
  'w-avatar-group', 'w-command-palette', 'w-command-palette-item',
  'w-date-range-picker', 'w-heatmap', 'w-heatmap-cell', 'w-highlight',
  'w-mask-input', 'w-month-picker', 'w-pie', 'w-pie-segment', 'w-pie-tooltip',
  'w-progress', 'w-video', 'w-video-controls', 'w-video-volume',
];

test('Vuetify 4.1.7 component additions are all registered', async ({ mount, page }) => {
  await mount('<div></div>');
  const registered = await page.evaluate((tags) => tags.filter((tag) => !!customElements.get(tag)), latestTags);
  expect(registered).toEqual(latestTags);
});

test('avatar group renders items, limit overflow, direction, and sizing', async ({ mount, page }) => {
  await mount(`<w-avatar-group id="group" size="48" gap="6" limit="2" reverse hoverable items='[{"text":"AL"},{"text":"GH"},{"text":"KT"}]'></w-avatar-group>`);
  await expect(page.locator('#group w-avatar')).toHaveCount(2);
  await expect(page.locator('#group .w-avatar-group-overflow')).toHaveText('+1');
  await expect(page.locator('#group .w-avatar-group')).toHaveClass(/w-avatar-group--reverse/);
  await expect(page.locator('#group .w-avatar-group')).toHaveCSS('--w-avatar-group-size', '48px');
});

test('command palette opens, filters, selects, and restores its model state', async ({ mount, page }) => {
  await mount(`<w-command-palette id="palette" model-value search="open" items='[{"title":"Open file","value":"open"},{"title":"Save file","value":"save"}]'></w-command-palette>`);
  await recordEvents(page, '#palette', ['change', 'update:modelValue']);
  await expect(page.locator('#palette .w-command-overlay')).toHaveClass(/open/);
  const input = page.locator('#palette .w-command-input');
  await expect(input).toHaveValue('open');
  await expect(input).toHaveAttribute('role', 'combobox');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await expect(input).toHaveAttribute('aria-controls', /.+/);
  await expect(page.locator('#palette w-command-item:not([hidden])')).toHaveCount(1);
  await page.locator('#palette w-command-item:not([hidden]) button').click();
  const events = await readEvents(page, '#palette');
  expect(events.some((event) => event.type === 'change' && event.detail.value === 'open')).toBe(true);
  await expect(page.locator('#palette')).not.toHaveAttribute('model-value');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
});

test('contained command palette anchors its overlay to a local container', async ({ mount, page }) => {
  await mount(`<div style="position:relative;height:20rem"><w-command-palette id="palette" model-value contained items='[{"title":"Open file","value":"open"}]'></w-command-palette></div>`);
  const overlay = page.locator('#palette .w-command-overlay');
  await expect(overlay).toHaveClass(/w-command-overlay--contained/);
  await expect(overlay).toHaveCSS('position', 'absolute');
  await expect(page.locator('#palette .w-command-item')).toBeVisible();
});

test('command palette item accepts an object property and exposes a native option', async ({ mount, page }) => {
  await mount('<w-command-palette-item id="item"></w-command-palette-item>');
  await page.locator('#item').evaluate((element) => { element.item = { title: 'Deploy', value: 'deploy', hotkey: 'D' }; });
  await expect(page.locator('#item button')).toHaveText(/Deploy/);
  await expect(page.locator('#item button')).toHaveAttribute('value', 'deploy');
  await expect(page.locator('#item .w-kbd')).toHaveText('D');
});

test('date range picker selects two endpoints and emits model updates', async ({ mount, page }) => {
  await mount('<w-date-range-picker id="range" month="7" year="2026" hide-header></w-date-range-picker>');
  await recordEvents(page, '#range', ['update:modelValue']);
  const days = page.locator('#range [data-date]:not([disabled])');
  await days.nth(5).click();
  await days.nth(10).click();
  await expect(page.locator('#range')).toHaveAttribute('model-value', /^2026-\d{2}-\d{2},2026-\d{2}-\d{2}$/);
  expect((await readEvents(page, '#range')).length).toBeGreaterThan(0);
});

test('month picker supports range selection and column props', async ({ mount, page }) => {
  await mount('<w-month-picker id="months" year="2026" multiple="range" months-columns="4"></w-month-picker>');
  await page.locator('#months [data-month="2"]').click();
  await page.locator('#months [data-month="5"]').click();
  await expect(page.locator('#months')).toHaveAttribute('model-value', '2026-02,2026-05');
  await expect(page.locator('#months .w-date-picker-months')).toHaveCSS('--w-date-picker-columns', '4');
});

test('highlight supports query matching, case folding, and explicit range properties', async ({ mount, page }) => {
  await mount('<w-highlight id="highlight" text="DuVay makes duvay accessible" query="duvay" ignore-case match-all></w-highlight>');
  await expect(page.locator('#highlight mark')).toHaveCount(2);
  await page.locator('#highlight').evaluate((element) => { element.matches = [[0, 5]]; });
  await expect(page.locator('#highlight mark')).toHaveCount(1);
  await expect(page.locator('#highlight mark')).toHaveText('DuVay');
});

test('mask input formats native input and exposes unmasked model value', async ({ mount, page }) => {
  await mount('<w-mask-input id="mask" label="Phone" mask="(###) ###-####"></w-mask-input>');
  await recordEvents(page, '#mask', ['input', 'change', 'update:modelValue']);
  const input = page.locator('#mask input');
  await input.fill('4165550199');
  await expect(input).toHaveValue('(416) 555-0199');
  await expect(page.locator('#mask')).toHaveAttribute('model-value', '4165550199');
  await input.press('Tab');
  const events = await readEvents(page, '#mask');
  expect(events.find((event) => event.type === 'input')?.detail).toMatchObject({
    value: '4165550199',
    maskedValue: '(416) 555-0199',
  });
  expect(events.find((event) => event.type === 'change')?.detail.value).toBe('4165550199');

  await page.locator('#mask').evaluate((element) => { element.mask = { mask: 'AA-##' }; });
  await input.fill('ab12');
  await expect(input).toHaveValue('ab-12');
});

test('heatmap builds an accessible row-column grid and honors thresholds', async ({ mount, page }) => {
  await mount(`<w-heatmap id="heat" rows='["Mon","Tue"]' columns='["AM","PM"]' thresholds='[{"min":0,"color":"#d7edf4"},{"min":5,"color":"#1f6f8b"}]' items='[{"row":"Mon","column":"AM","value":2},{"row":"Tue","column":"PM","value":8}]' legend hover></w-heatmap>`);
  await expect(page.locator('#heat .w-heatmap-cell')).toHaveCount(4);
  await expect(page.locator('#heat .w-heatmap-cell').first()).toHaveAttribute('aria-label', 'Mon, AM: 2');
  await expect(page.locator('#heat .w-heatmap-legend span')).toHaveCount(2);
});

test('heatmap cell accepts an item property', async ({ mount, page }) => {
  await mount('<w-heatmap-cell id="cell"></w-heatmap-cell>');
  await page.locator('#cell').evaluate((element) => { element.item = { row: 'A', column: 'B', value: 9, color: '#1f6f8b' }; });
  await expect(page.locator('#cell .w-heatmap-cell')).toHaveAttribute('aria-label', 'A, B: 9');
});

test('visualization colors cannot inject additional style declarations', async ({ mount, page }) => {
  await mount(`<w-heatmap id="heat" rows='["A"]' columns='["B"]' empty-color="red;--injected:url(javascript:alert(1))"></w-heatmap><w-pie id="pie" items='[{"title":"A","value":1,"color":"red;--injected:url(javascript:alert(1))"}]' legend></w-pie>`);
  const styles = await page.evaluate(() => [
    document.querySelector('#heat .w-heatmap-cell').getAttribute('style'),
    document.querySelector('#pie .w-pie-legend i').getAttribute('style'),
  ]);
  expect(styles.every((style) => !/(?:^|;)--injected\s*:/.test(style) && !style.includes('javascript:'))).toBe(true);
});

test('pie renders accessible data, legend, segment progress, and tooltip state', async ({ mount, page }) => {
  await mount(`<w-pie id="pie" title="Sales" inner-cut="55" legend items='[{"title":"North","value":30,"color":"#1f6f8b"},{"title":"South","value":70,"color":"#c47800"}]'></w-pie><w-pie-segment id="segment" value="35"></w-pie-segment><w-pie-tooltip id="tip" model-value item='{"title":"North","value":30}'></w-pie-tooltip>`);
  await expect(page.locator('#pie .w-pie-chart')).toHaveCSS('--w-pie-inner-cut', '55%');
  await expect(page.locator('#pie .w-pie-legend li')).toHaveCount(2);
  await expect(page.locator('#segment .w-pie-segment')).toHaveAttribute('aria-valuenow', '35');
  await expect(page.locator('#tip [role="tooltip"]')).toContainText('North');
});

test('unified progress supports type, label, formatting, and visibility props', async ({ mount, page }) => {
  await mount('<w-progress id="progress" type="circular" model-value="25" max="50" label="Upload" value-format="{value}/{max}"></w-progress>');
  await expect(page.locator('#progress .w-progress-circular')).toHaveCount(1);
  await expect(page.locator('#progress .w-progress-content')).toContainText('Upload');
  await expect(page.locator('#progress .w-progress-content')).toContainText('25/50');
});

test('video renders native media plus accessible custom controls and volume events', async ({ mount, page }) => {
  await mount('<w-video id="video" src="/sample.mp4" controls-variant="mini" hide-fullscreen></w-video>');
  await expect(page.locator('#video video')).toHaveAttribute('src', '/sample.mp4');
  await expect(page.locator('#video w-video-controls')).toHaveCount(1);
  await expect(page.locator('#video [data-video-action="play"]')).toHaveAttribute('aria-label', 'Play');
  await expect(page.locator('#video [data-video-action="fullscreen"]')).toHaveCount(0);

  await mount('<w-video-volume id="volume" label="Media volume" model-value="0.5"></w-video-volume>');
  await recordEvents(page, '#volume', ['input']);
  await page.locator('#volume input').fill('0.8');
  expect((await readEvents(page, '#volume')).at(-1).detail.value).toBe(0.8);
});

test('video controls update without replacing the focused control', async ({ mount, page }) => {
  await mount('<w-video-controls id="controls" split-time></w-video-controls>');
  const seek = page.locator('#controls [data-video-action="seek"]');
  await seek.focus();
  const state = await page.locator('#controls').evaluate((controls) => {
    const original = controls.querySelector('[data-video-action="seek"]');
    controls.media = { paused: false, duration: 100, currentTime: 25, volume: 0.5 };
    controls.sync();
    return {
      sameNode: original === controls.querySelector('[data-video-action="seek"]'),
      focused: document.activeElement === original,
      progress: original.value,
      time: controls.querySelector('.w-video-time').textContent,
    };
  });
  expect(state).toEqual({ sameNode: true, focused: true, progress: '0.25', time: '0:25 / 1:40' });
});

test('new visual components stay contained on narrow screens', async ({ mount, page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await mount(`<w-heatmap rows='["Mon"]' columns='["1","2","3","4","5","6","7","8","9","10","11","12"]'></w-heatmap><w-video src="about:blank" controls-variant="mini"></w-video>`);
  const layout = await page.evaluate(() => ({
    documentContained: document.documentElement.scrollWidth <= window.innerWidth,
    heatmapOverflow: getComputedStyle(document.querySelector('.w-heatmap')).overflowX,
    targets: [...document.querySelectorAll('.w-video-controls button')].map((button) => {
      const rect = button.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }),
  }));
  expect(layout.documentContained).toBe(true);
  expect(layout.heatmapOverflow).toBe('auto');
  expect(layout.targets.length).toBeGreaterThan(0);
  expect(layout.targets.every(({ width, height }) => width >= 44 && height >= 44)).toBe(true);
});
