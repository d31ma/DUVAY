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
