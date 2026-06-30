import { expect, test } from '../setup/component-test.js';

test('w-timeline-item renders opposite time, dot, title, and body', async ({ mount, page }) => {
  await mount(`
    <w-timeline id="t">
      <w-timeline-item time="09:00" title="Kickoff">Reviewed scope.</w-timeline-item>
    </w-timeline>
  `);

  await expect(page.locator('#t .w-timeline')).toHaveClass(/w-timeline--align-start/);
  await expect(page.locator('#t .w-timeline-opposite')).toHaveText('09:00');
  await expect(page.locator('#t .w-timeline-dot')).toHaveCount(1);
  await expect(page.locator('#t .w-timeline-title')).toHaveText('Kickoff');
  await expect(page.locator('#t .w-timeline-body')).toContainText('Reviewed scope.');
});

test('w-timeline align=center adds the alternating modifier', async ({ mount, page }) => {
  await mount('<w-timeline id="t" align="center"><w-timeline-item title="A"></w-timeline-item></w-timeline>');
  await expect(page.locator('#t .w-timeline')).toHaveClass(/w-timeline--align-center/);
});

test('w-timeline-item supports dot-color, an icon, and hide-dot', async ({ mount, page }) => {
  await mount('<w-timeline id="t"><w-timeline-item title="A" dot-color="success" icon="✓"></w-timeline-item></w-timeline>');
  const dot = page.locator('#t .w-timeline-dot');
  expect(await dot.getAttribute('style')).toContain('--w-timeline-dot-color: var(--w-success)');
  await expect(page.locator('#t .w-timeline-dot__icon')).toHaveText('✓');

  await mount('<w-timeline id="t2"><w-timeline-item title="B" hide-dot></w-timeline-item></w-timeline>');
  await expect(page.locator('#t2 .w-timeline-dot')).toHaveCount(0);
});

test('w-timeline-item renders an opposite slot', async ({ mount, page }) => {
  await mount('<w-timeline id="t"><w-timeline-item title="A"><span slot="opposite" class="opp">2pm</span></w-timeline-item></w-timeline>');
  await expect(page.locator('#t .w-timeline-opposite .opp')).toHaveText('2pm');
});

test('w-timeline justify=center and hide-opposite add their modifiers', async ({ mount, page }) => {
  await mount('<w-timeline id="t" justify="center" hide-opposite><w-timeline-item title="A"></w-timeline-item></w-timeline>');
  await expect(page.locator('#t .w-timeline')).toHaveClass(/w-timeline--justify-center/);
  await expect(page.locator('#t .w-timeline')).toHaveClass(/w-timeline--hide-opposite/);
});

test('w-timeline-item hide-opposite drops its opposite column', async ({ mount, page }) => {
  await mount('<w-timeline id="t"><w-timeline-item time="09:00" title="A" hide-opposite></w-timeline-item></w-timeline>');
  await expect(page.locator('#t .w-timeline-item')).toHaveClass(/w-timeline-item--hide-opposite/);
  await expect(page.locator('#t .w-timeline-opposite')).toHaveCount(0);
});

test('w-timeline-item icon-color sets the icon color variable', async ({ mount, page }) => {
  await mount('<w-timeline id="t"><w-timeline-item title="A" icon="✓" icon-color="warning"></w-timeline-item></w-timeline>');
  const dot = page.locator('#t .w-timeline-dot');
  expect(await dot.getAttribute('style')).toContain('--w-timeline-icon-color: var(--w-warning)');
});
