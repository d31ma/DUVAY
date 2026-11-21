import { expect, test } from '../setup/component-test.js';

/* `--w-text-very-subtle` is a text colour (hints, footers, disabled labels), so
 * it must reach WCAG AA for small text (4.5:1) on every surface a component
 * may draw it on, in every theme. Skins may not declare colour tokens, so
 * running this in each `w-os` project proves no skin changes the result. */

const MINIMUM = 4.5;

const SURFACES = [
  '--w-surface',
  '--w-surface-container-low',
  '--w-surface-container',
  '--w-surface-container-high',
  '--w-sidebar',
  '--w-toolbar',
  '--w-hover',
  '--w-selected',
];

const THEMES = [
  { theme: 'light', scheme: 'light' },
  { theme: 'dark', scheme: 'dark' },
  { theme: 'high-contrast', scheme: 'light' },
  { theme: 'auto', scheme: 'light' },
  { theme: 'auto', scheme: 'dark' },
];

async function lowestContrast(page, surfaces) {
  return page.evaluate((names) => {
    const probe = document.createElement('span');
    document.body.append(probe);
    const read = (name) => {
      probe.style.color = `var(${name})`;
      const parts = getComputedStyle(probe).color.match(/[\d.]+/g).map(Number);
      return { rgb: parts.slice(0, 3), alpha: parts.length > 3 ? parts[3] : 1 };
    };
    const over = (top, bottom) => top.rgb.map((value, index) => value * top.alpha + bottom[index] * (1 - top.alpha));
    const channel = (value) => {
      const unit = value / 255;
      return unit <= 0.03928 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
    };
    const luminance = (rgb) => 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
    const ratio = (first, second) => {
      const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
      return (light + 0.05) / (dark + 0.05);
    };
    const base = read('--w-surface').rgb;
    const text = read('--w-text-very-subtle');
    const results = names.map((name) => {
      const background = over(read(name), base);
      return { name, ratio: Math.round(ratio(over(text, background), background) * 100) / 100 };
    });
    probe.remove();
    return results.sort((a, b) => a.ratio - b.ratio)[0];
  }, surfaces);
}

for (const { theme, scheme } of THEMES) {
  test(`--w-text-very-subtle reaches 4.5:1 on every surface in the ${theme} theme (${scheme} system)`, async ({ page, mount }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await mount('<p>Text</p>');
    await page.evaluate((value) => document.documentElement.setAttribute('w-theme', value), theme);

    const lowest = await lowestContrast(page, SURFACES);
    expect(lowest.ratio, `lowest contrast is on ${lowest.name}`).toBeGreaterThanOrEqual(MINIMUM);
  });
}
