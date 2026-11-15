import { expect, test } from '../setup/component-test.js';

const INFO_TOKENS = ['--w-info', '--w-on-info', '--w-info-container', '--w-on-info-container'];
const THEMES = ['light', 'dark', 'high-contrast'];
const BLACK = 'rgb(0, 0, 0)';

const COMPONENTS = [
  ['w-alert type', '<w-alert type="info">Saved for later</w-alert>'],
  ['w-alert color', '<w-alert color="info">Saved for later</w-alert>'],
  ['w-alert border-color', '<w-alert border="start" border-color="info">Saved for later</w-alert>'],
  ['w-avatar color', '<w-avatar color="info">AB</w-avatar>'],
  ['w-avatar badge-color', '<w-avatar badge badge-color="info">AB</w-avatar>'],
  ['w-badge', '<w-badge color="info" content="3"></w-badge>'],
  ['w-banner', '<w-banner bg-color="info" text="Maintenance tonight"></w-banner>'],
  ['w-btn', '<w-btn color="info">Details</w-btn>'],
  ['w-btn outlined', '<w-btn color="info" variant="outlined">Details</w-btn>'],
  ['w-card', '<w-card color="info" title="Queue">3 jobs</w-card>'],
  ['w-checkbox', '<w-checkbox color="info" checked label="Notify me"></w-checkbox>'],
  ['w-radio', '<w-radio color="info" checked label="Daily"></w-radio>'],
  ['w-switch', '<w-switch color="info" checked label="Live updates"></w-switch>'],
  ['w-chip', '<w-chip color="info">Queued</w-chip>'],
  ['w-empty', '<w-empty color="info" bg-color="info" headline="No jobs"></w-empty>'],
  ['w-fab', '<w-fab color="info" icon="plus" aria-label="Add"></w-fab>'],
  ['w-footer', '<w-footer color="info">Footer</w-footer>'],
  ['w-icon', '<w-icon color="info" icon="info"></w-icon>'],
  ['w-img', '<w-img color="info" alt="Placeholder" width="40" height="40"></w-img>'],
  ['w-pagination', '<w-pagination color="info" active-color="info" length="3" value="1"></w-pagination>'],
  ['w-progress-linear', '<w-progress-linear color="info" value="40"></w-progress-linear>'],
  ['w-progress-circular', '<w-progress-circular color="info" value="40"></w-progress-circular>'],
  ['w-rating', '<w-rating color="info" active-color="info" value="3"></w-rating>'],
  ['w-skeleton', '<w-skeleton color="info" type="text"></w-skeleton>'],
  ['w-snackbar', '<w-snackbar color="info" open text="Job queued"></w-snackbar>'],
  ['w-system-bar', '<w-system-bar color="info">12:00</w-system-bar>'],
  ['w-time-picker', '<w-time-picker color="info"></w-time-picker>'],
  ['w-timeline', '<w-timeline><w-timeline-item dot-color="info">Started</w-timeline-item></w-timeline>'],
];

class InfoColors {
  static async tokenColors(page) {
    return page.evaluate((names) => {
      const probe = document.createElement('span');
      document.body.append(probe);
      const colors = names.map((name) => {
        probe.style.color = `var(${name})`;
        return getComputedStyle(probe).color;
      });
      probe.remove();
      return colors;
    }, INFO_TOKENS);
  }

  static async drawnColors(locator) {
    return locator.evaluate((root) => {
      const properties = ['color', 'background-color', 'border-top-color', 'border-left-color',
        'border-bottom-color', 'border-right-color', 'fill', 'stroke', 'outline-color'];
      const elements = [root, ...root.querySelectorAll('*')];
      const styles = elements.flatMap((element) => [
        getComputedStyle(element),
        getComputedStyle(element, '::before'),
        getComputedStyle(element, '::after'),
      ]);
      return [...new Set(styles.flatMap((style) => properties.map((name) => style.getPropertyValue(name))))];
    });
  }

  static async useTheme(page, theme) {
    await page.evaluate((name) => document.documentElement.setAttribute('w-theme', name), theme);
  }
}

for (const theme of THEMES) {
  test(`--w-info tokens are defined in the ${theme} theme`, async ({ mount, page }) => {
    await mount('');
    await InfoColors.useTheme(page, theme);
    const colors = await InfoColors.tokenColors(page);
    expect(new Set(colors).size).toBe(4);
    expect(colors).not.toContain(BLACK);
  });

  test(`w-sparkline color="info" draws its line in the info colour in the ${theme} theme`, async ({ mount, page }) => {
    await InfoColors.useTheme(page, theme);
    await mount('<w-sparkline id="s" values="[3,8,5,10,6,12]" color="info"></w-sparkline>');
    const [info] = await InfoColors.tokenColors(page);
    const stroke = await page.locator('#s .w-sparkline-line').evaluate((line) => getComputedStyle(line).stroke);
    expect(stroke).toBe(info);
    expect(stroke).not.toBe(BLACK);
  });

  test(`w-sparkline type="bar" color="info" fills its bars in the info colour in the ${theme} theme`, async ({ mount, page }) => {
    await InfoColors.useTheme(page, theme);
    await mount('<w-sparkline id="s" type="bar" values="[4,7,2]" color="info"></w-sparkline>');
    const [info] = await InfoColors.tokenColors(page);
    const fill = await page.locator('#s .w-sparkline-bar').first().evaluate((bar) => getComputedStyle(bar).fill);
    expect(fill).toBe(info);
  });
}

for (const theme of ['light', 'dark']) {
  for (const [name, html] of COMPONENTS) {
    test(`${name} with info draws an info token colour in the ${theme} theme`, async ({ mount, page }) => {
      await InfoColors.useTheme(page, theme);
      const root = await mount(html);
      const info = await InfoColors.tokenColors(page);
      const drawn = await InfoColors.drawnColors(root.locator(':scope > *'));
      expect(drawn.filter((color) => info.includes(color)).length).toBeGreaterThan(0);
    });
  }
}

test('.text-info and .bg-info utilities use the info tokens', async ({ mount, page }) => {
  await InfoColors.useTheme(page, 'light');
  await mount('<p id="t" class="text-info">Note</p><div id="b" class="bg-info">Note</div>');
  const [info, , container, onContainer] = await InfoColors.tokenColors(page);
  await expect(page.locator('#t')).toHaveCSS('color', info);
  await expect(page.locator('#b')).toHaveCSS('background-color', container);
  await expect(page.locator('#b')).toHaveCSS('color', onContainer);
});
