import { expect, test } from '../setup/component-test.js';

test('w-sparkline renders a trend line by default', async ({ mount, page }) => {
  await mount('<w-sparkline id="s" values="[3,8,5,10,6,12]"></w-sparkline>');

  await expect(page.locator('#s svg.w-sparkline')).toHaveClass(/w-sparkline--trend/);
  await expect(page.locator('#s .w-sparkline-line')).toHaveCount(1);
  await expect(page.locator('#s .w-sparkline-fill')).toHaveCount(0);
  await expect(page.locator('#s .w-sparkline-line')).toHaveAttribute('d', /^M/);
});

test('w-sparkline fill adds an area path', async ({ mount, page }) => {
  await mount('<w-sparkline id="s" values="[3,8,5,10]" fill></w-sparkline>');
  await expect(page.locator('#s svg')).toHaveClass(/w-sparkline--fill/);
  await expect(page.locator('#s .w-sparkline-fill')).toHaveCount(1);
  await expect(page.locator('#s .w-sparkline-fill')).toHaveAttribute('d', /Z$/);
});

test('w-sparkline bar type renders one rect per value', async ({ mount, page }) => {
  await mount('<w-sparkline id="s" type="bar" values="[4,7,2,9,5]"></w-sparkline>');
  await expect(page.locator('#s svg')).toHaveClass(/w-sparkline--bar/);
  await expect(page.locator('#s .w-sparkline-bar')).toHaveCount(5);
  await expect(page.locator('#s .w-sparkline-line')).toHaveCount(0);
});

test('w-sparkline color sets the stroke variable', async ({ mount, page }) => {
  await mount('<w-sparkline id="s" values="[1,2,3]" color="success"></w-sparkline>');
  await expect(page.locator('#s svg')).toHaveAttribute('style', /--w-sparkline-color:var\(--w-success/);
});

test('w-sparkline gradient renders a linearGradient and references it', async ({ mount, page }) => {
  await mount('<w-sparkline id="s" values="[1,5,2,8]" gradient="#f72047,#ffd200,#1feaea" gradient-direction="right"></w-sparkline>');

  await expect(page.locator('#s svg defs linearGradient')).toHaveCount(1);
  await expect(page.locator('#s svg defs stop')).toHaveCount(3);
  await expect(page.locator('#s svg')).toHaveAttribute('style', /--w-sparkline-color:url\(#w-spark/);
});

test('w-sparkline line-width and smooth affect the path', async ({ mount, page }) => {
  await mount('<w-sparkline id="s" values="[3,8,5,10,6,12]" line-width="2" smooth></w-sparkline>');
  await expect(page.locator('#s svg')).toHaveAttribute('style', /--w-sparkline-width:2/);
  await expect(page.locator('#s .w-sparkline-line')).toHaveAttribute('d', /C/); // bezier => smoothed
});

test('w-sparkline monotone smoothing passes through turning points', async ({ mount, page }) => {
  await mount('<w-sparkline id="s" values="[1,5,2,8]" smooth smooth-mode="monotone"></w-sparkline>');
  await expect(page.locator('#s .w-sparkline-line')).toHaveAttribute('d', /C/);

  const tangents = await page.evaluate(async () => {
    const { wMonotoneTangents } = await import('/src/components/sparkline.js');
    return [
      wMonotoneTangents([]),
      wMonotoneTangents([{ x: 0, y: 1 }]),
      wMonotoneTangents([{ x: 0, y: 0 }, { x: 0, y: 2 }, { x: 2, y: 1 }]),
    ];
  });
  expect(tangents[0]).toEqual([]);
  expect(tangents[1]).toEqual([0]);
  expect(tangents[2]).toEqual([2, 0, -0.5]);
});

test('w-sparkline draws labels and show-labels', async ({ mount, page }) => {
  await mount('<w-sparkline id="lbl" values="[1,2,3]" labels="Jan,Feb,Mar"></w-sparkline><w-sparkline id="vals" values="[10,20,30]" show-labels></w-sparkline>');

  await expect(page.locator('#lbl .w-sparkline-labels text')).toHaveText(['Jan', 'Feb', 'Mar']);
  await expect(page.locator('#vals .w-sparkline-labels text')).toHaveText(['10', '20', '30']);
});

test('w-sparkline auto-draw applies the animation hook', async ({ mount, page }) => {
  await mount('<w-sparkline id="s" values="[1,4,2,6]" auto-draw auto-draw-duration="500"></w-sparkline>');
  await expect(page.locator('#s svg')).toHaveClass(/w-sparkline--auto-draw/);
  await expect(page.locator('#s svg')).toHaveAttribute('style', /--w-sparkline-draw-duration:500ms/);
});

test('w-sparkline animation parses bare, JSON, malformed, and disabled values', async ({ mount, page }) => {
  await mount(`
    <w-sparkline id="bare" values="[1,2]" animation></w-sparkline>
    <w-sparkline id="json" values="[1,2]" animation='{"duration":650,"easing":"linear"}'></w-sparkline>
    <w-sparkline id="bad" values="[1,2]" animation="{bad"></w-sparkline>
    <w-sparkline id="off" values="[1,2]" animation="false"></w-sparkline>
  `);
  await expect(page.locator('#bare .w-sparkline-line')).toHaveAttribute('style', /300ms ease/);
  await expect(page.locator('#json .w-sparkline-line')).toHaveAttribute('style', /650ms linear/);
  await expect(page.locator('#bad .w-sparkline-line')).toHaveAttribute('style', /300ms ease/);
  await expect(page.locator('#off .w-sparkline-line')).not.toHaveAttribute('style');
});

test('w-sparkline interaction updates its accessible point and tooltip', async ({ mount, page }) => {
  await mount(`
    <w-sparkline id="plain" values="[3,8,5]" interactive></w-sparkline>
    <w-sparkline id="tip" values="[3,8,5]" interactive
      tooltip='{"offset":6,"showCrosshair":true}'></w-sparkline>
  `);

  const plain = page.locator('#plain svg');
  await plain.focus();
  await expect(plain).toHaveAttribute('data-active-index', '0');
  await expect(plain).toHaveAttribute('aria-label', /point 1 of 3: 3/);
  await plain.press('ArrowRight');
  await expect(plain).toHaveAttribute('data-active-index', '1');
  await plain.press('End');
  await expect(plain).toHaveAttribute('data-active-index', '1');
  await plain.evaluate((element) => element.blur());
  await expect(plain).toHaveAttribute('data-active-index', '-1');

  const tip = page.locator('#tip svg');
  await tip.focus();
  const layer = page.locator('#tip .w-sparkline-tooltip');
  await expect(layer).not.toHaveAttribute('hidden');
  await expect(page.locator('#tip .w-sparkline-tooltip-text')).toHaveText('3');
  await expect(page.locator('#tip .w-sparkline-tooltip-tip')).toHaveAttribute('transform', /translate/);
  await expect(page.locator('#tip .w-sparkline-crosshair')).toHaveAttribute('x1', /./);
  await tip.press('ArrowRight');
  await expect(page.locator('#tip .w-sparkline-tooltip-text')).toHaveText('8');
  await tip.dispatchEvent('pointerleave');
  await expect(layer).toHaveAttribute('hidden', '');
});

test('w-sparkline-tooltip positions and exposes the active value', async ({ mount, page }) => {
  await mount(`
    <w-sparkline-tooltip id="tip" index="2" value="42" target="[120,80]"
      offset="8" location="right" content-class="chart-tip"></w-sparkline-tooltip>
  `);
  const tooltip = page.locator('#tip .w-sparkline-tooltip-content');
  await expect(tooltip).toHaveClass(/chart-tip/);
  await expect(tooltip).toHaveClass(/w-sparkline-tooltip--right/);
  await expect(tooltip).toHaveAttribute('data-index', '2');
  await expect(tooltip).toHaveAttribute('style', /--w-sparkline-tooltip-x:120px/);
  await expect(tooltip).toHaveAttribute('style', /--w-sparkline-tooltip-y:80px/);
  await expect(tooltip).toHaveAttribute('style', /--w-sparkline-tooltip-offset:8px/);
  await expect(tooltip).toContainText('42');
  await expect(tooltip).not.toHaveAttribute('hidden');
});

test('w-sparkline-tooltip hides without an index and supports custom content', async ({ mount, page }) => {
  await mount(`
    <w-sparkline-tooltip id="hidden" value="7" target="10,20"></w-sparkline-tooltip>
    <w-sparkline-tooltip id="custom" index="0" value="7" target="10,20">
      <strong>Seven units</strong>
    </w-sparkline-tooltip>
  `);
  await expect(page.locator('#hidden .w-sparkline-tooltip-content')).toHaveAttribute('hidden', '');
  await expect(page.locator('#custom strong')).toHaveText('Seven units');
  await expect(page.locator('#custom .w-sparkline-tooltip-default')).toHaveCSS('display', 'none');
});
