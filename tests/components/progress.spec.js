import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-progress-linear renders a determinate bar width and color custom property', async ({ mount, page }) => {
  await mount('<w-progress-linear id="p" value="60" color="success" buffer-value="80"></w-progress-linear>');

  const root = page.locator('#p .w-progress');
  await expect(root).toHaveAttribute('aria-valuenow', '60');
  await expect(page.locator('#p .w-progress-bar')).toHaveAttribute('style', /inline-size:\s*60%/);
  await expect(page.locator('#p .w-progress-buffer')).toHaveAttribute('style', /inline-size:\s*80%/);
  expect(await root.getAttribute('style')).toContain('--w-progress-color: var(--w-success)');
});

test('w-progress-linear indeterminate drops aria-valuenow and adds the modifier', async ({ mount, page }) => {
  await mount('<w-progress-linear id="p" indeterminate></w-progress-linear>');
  const root = page.locator('#p .w-progress');
  await expect(root).toHaveClass(/w-progress--indeterminate/);
  await expect(root).not.toHaveAttribute('aria-valuenow', /.*/);
});

test('w-progress-linear honours model-value, striped, and reverse', async ({ mount, page }) => {
  await mount('<w-progress-linear id="p" model-value="25" striped reverse rounded></w-progress-linear>');
  await expect(page.locator('#p .w-progress-bar')).toHaveAttribute('style', /inline-size:\s*25%/);
  await expect(page.locator('#p .w-progress')).toHaveClass(/w-progress--striped/);
  await expect(page.locator('#p .w-progress')).toHaveClass(/w-progress--reverse/);
});

test('w-progress-circular applies size, stroke width, rotate, and centered slot content', async ({ mount, page }) => {
  await mount('<w-progress-circular id="p" value="75" size="64" width="6" rotate="90">75%</w-progress-circular>');

  const root = page.locator('#p .w-progress-circular');
  const style = await root.getAttribute('style');
  expect(style).toContain('width: 64px');
  expect(style).toContain('--w-progress-width: 6');
  expect(style).toContain('--w-progress-rotate: 90deg');
  await expect(page.locator('#p .w-progress-content')).toHaveText('75%');
  await expect(page.locator('#p svg .w-progress-fill')).toHaveCount(1);
});

test('w-progress tween drives the bar and the circular fill through WMotion', async ({ mount, page }) => {
  await page.evaluate(() => {
    window.__wTweens = [];
    const original = window.WMotion.tween;
    window.WMotion.tween = (el, options) => {
      window.__wTweens.push({ property: options.property, from: options.from, to: options.to });
      return original(el, options);
    };
  });

  await mount('<w-progress-linear id="p" value="40" tween></w-progress-linear>');
  await mount('<w-progress-circular id="p" value="50" tween></w-progress-circular>');
  await mount('<w-progress-linear id="p" value="40" tween indeterminate></w-progress-linear>');

  const tweens = await page.evaluate(() => window.__wTweens);
  expect(tweens).toHaveLength(2);
  expect(tweens[0]).toEqual({ property: 'inline-size', from: 0, to: 40 });
  expect(tweens[1].property).toBe('attr:stroke-dashoffset');
  expect(Math.round(tweens[1].from)).toBe(126);
  expect(Math.round(tweens[1].to)).toBe(63);
});

test('w-progress-linear renders stream, buffer, absolute, and location modifiers', async ({ mount, page }) => {
  await mount('<w-progress-linear id="p" value="30" stream buffer-value="70" absolute location="bottom" height="8" bg-color="surface" buffer-color="secondary"></w-progress-linear>');

  const root = page.locator('#p .w-progress');
  await expect(root).toHaveClass(/w-progress--stream/);
  await expect(root).toHaveClass(/w-progress--absolute/);
  await expect(root).toHaveClass(/w-progress--bottom/);
  await expect(page.locator('#p .w-progress-stream')).toHaveAttribute('style', /inline-size:\s*70%/);

  const style = await root.getAttribute('style');
  expect(style).toContain('--w-progress-height: 8px');
  expect(style).toContain('--w-progress-bg: var(--w-surface-container-high)');
  expect(style).toContain('--w-progress-buffer-color: var(--w-secondary)');
});

test('w-progress-linear indeterminate stream fills the track and drops the buffer', async ({ mount, page }) => {
  await mount('<w-progress-linear id="p" indeterminate stream buffer-value="40"></w-progress-linear>');

  await expect(page.locator('#p .w-progress-stream')).toHaveAttribute('style', /inline-size:\s*100%/);
  await expect(page.locator('#p .w-progress-buffer')).toHaveCount(0);
});

test('w-progress-linear active=false collapses the bar without unmounting it', async ({ mount, page }) => {
  await mount(`
    <w-progress-linear id="on" value="40"></w-progress-linear>
    <w-progress-linear id="off" value="40" active="false"></w-progress-linear>
  `);

  await expect(page.locator('#off .w-progress')).toHaveClass(/w-progress--inactive/);
  await expect(page.locator('#off .w-progress-bar')).toHaveCount(1);
  expect(await page.locator('#off .w-progress').evaluate((el) => el.getBoundingClientRect().height)).toBe(0);
  expect(await page.locator('#on .w-progress').evaluate((el) => el.getBoundingClientRect().height)).toBeGreaterThan(0);
});

test('w-progress-linear opacity, bg-opacity, buffer-opacity, and rounded-bar reach the layers', async ({ mount, page }) => {
  await mount('<w-progress-linear id="p" value="40" buffer-value="70" opacity="0.5" bg-opacity="0.25" buffer-opacity="0.75" rounded-bar></w-progress-linear>');

  await expect(page.locator('#p .w-progress-bar')).toHaveCSS('opacity', '0.5');
  await expect(page.locator('#p .w-progress-buffer')).toHaveCSS('opacity', '0.75');
  await expect(page.locator('#p .w-progress')).toHaveCSS('--w-progress-bg-opacity', '0.25');
  await expect(page.locator('#p .w-progress')).toHaveClass(/w-progress--rounded-bar/);
  expect(await page.locator('#p .w-progress-bar')
    .evaluate((el) => Number.parseFloat(getComputedStyle(el).borderStartStartRadius))).toBeGreaterThan(0);
});

test('w-progress rejects style-breaking opacity and length values', async ({ mount, page }) => {
  await mount(`
    <w-progress-linear id="unsafe" value="40"
      opacity="1&quot;; color:red; --owned:1"
      height="4px&quot;; color:red; --owned:1"
      chunk-width="12px; --owned:1"></w-progress-linear>
    <w-progress-linear id="clamped" value="40" opacity="2" bg-opacity="-1" buffer-opacity="NaN"></w-progress-linear>
    <w-progress-linear id="safe" value="40" opacity="0" bg-opacity="0.25"
      height="0.5rem" chunk-width="12px" chunk-gap="4"></w-progress-linear>
  `);

  const unsafe = page.locator('#unsafe .w-progress');
  const unsafeStyle = await unsafe.getAttribute('style');
  expect(unsafeStyle || '').not.toContain('--owned');
  expect(unsafeStyle || '').not.toContain('color:red');
  await expect(unsafe).not.toHaveCSS('--w-progress-opacity', /.+/);
  await expect(unsafe).not.toHaveCSS('--w-progress-height', /.+/);

  const clampedStyle = await page.locator('#clamped .w-progress').getAttribute('style');
  expect(clampedStyle || '').not.toContain('opacity');

  const safe = page.locator('#safe .w-progress');
  await expect(safe).toHaveCSS('--w-progress-opacity', '0');
  await expect(safe).toHaveCSS('--w-progress-bg-opacity', '0.25');
  await expect(safe).toHaveCSS('--w-progress-height', '0.5rem');
  await expect(safe).toHaveCSS('--w-progress-chunk-size', '12px');
  await expect(safe).toHaveCSS('--w-progress-chunk-gap', '4px');
});

test('w-progress-linear clickable sets the value from a click and the arrow keys', async ({ mount, page }) => {
  await mount('<w-progress-linear id="p" value="0" clickable height="16" width="400px"></w-progress-linear>');
  await recordEvents(page, '#p', ['change']);

  const track = page.locator('#p .w-progress');
  await expect(track).toHaveAttribute('role', 'slider');
  await expect(track).toHaveAttribute('tabindex', '0');

  const box = await track.boundingBox();
  await page.mouse.click(box.x + box.width * 0.5, box.y + box.height / 2);
  await expect(page.locator('#p')).toHaveAttribute('value', /^(49|50|51)$/);
  await expect(track).toHaveAttribute('aria-valuenow', /^(49|50|51)$/);

  const afterClick = Number(await page.locator('#p').getAttribute('value'));
  await track.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#p')).toHaveAttribute('value', String(afterClick + 1));

  const events = await readEvents(page, '#p');
  expect(events.length).toBe(2);
  expect(events.at(-1).detail.value).toBe(afterClick + 1);
});

test('w-progress-linear clickable reads right-to-left when reversed', async ({ mount, page }) => {
  await mount('<w-progress-linear id="p" value="0" clickable reverse height="16" width="400px"></w-progress-linear>');

  const track = page.locator('#p .w-progress');
  const box = await track.boundingBox();
  await page.mouse.click(box.x + box.width * 0.25, box.y + box.height / 2);
  await expect(page.locator('#p')).toHaveAttribute('value', /^(74|75|76)$/);
});

test('w-progress-linear chunk-count, chunk-width, and chunk-gap mask the bar', async ({ mount, page }) => {
  await mount(`
    <w-progress-linear id="counted" value="80" chunk-count="5" chunk-gap="4"></w-progress-linear>
    <w-progress-linear id="fixed" value="80" chunk-width="12"></w-progress-linear>
    <w-progress-linear id="plain" value="80"></w-progress-linear>
  `);

  const counted = page.locator('#counted .w-progress');
  await expect(counted).toHaveClass(/w-progress--chunked/);
  await expect(counted).toHaveCSS('--w-progress-chunk-gap', '4px');
  await expect(counted).toHaveCSS('--w-progress-chunk-size', 'calc((100% + 4px) / 5 - 4px)');

  const fixed = page.locator('#fixed .w-progress');
  await expect(fixed).toHaveClass(/w-progress--chunked/);
  await expect(fixed).toHaveCSS('--w-progress-chunk-size', '12px');
  await expect(fixed).toHaveCSS('--w-progress-chunk-gap', '2px');
  expect(await fixed.evaluate((el) => getComputedStyle(el).maskImage)).toContain('repeating-linear-gradient');

  await expect(page.locator('#plain .w-progress')).not.toHaveClass(/w-progress--chunked/);
});

test('w-progress-circular reveal animates from zero and accepts a duration', async ({ mount, page }) => {
  await page.evaluate(() => {
    window.__wReveals = [];
    const original = window.WMotion.tween;
    window.WMotion.tween = (el, options) => {
      window.__wReveals.push({ from: options.from, to: options.to, duration: options.duration });
      return original(el, options);
    };
  });

  await mount('<w-progress-circular id="p" value="50" reveal></w-progress-circular>');
  await mount('<w-progress-linear id="p" value="50" reveal="1200"></w-progress-linear>');

  const reveals = await page.evaluate(() => window.__wReveals);
  expect(reveals).toHaveLength(2);
  expect(reveals[0].duration).toBe(700);
  expect(reveals[1]).toEqual({ from: 0, to: 50, duration: 1200 });
});
