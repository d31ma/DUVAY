import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-icon-btn renders an accessible icon-only button', async ({ mount, page }) => {
  await mount('<w-icon-btn id="b" icon="home"></w-icon-btn>');

  const button = page.locator('#b button');
  await expect(button).toHaveClass(/w-btn/);
  await expect(button).toHaveClass(/w-btn-icon/);
  await expect(button).toHaveClass(/w-icon-btn/);
  await expect(button).toHaveAttribute('type', 'button');
  await expect(button).toHaveAttribute('aria-label', 'home');
  await expect(page.locator('#b button > .w-icon')).toHaveCount(1);

  await mount('<w-icon-btn id="labelled" icon="home" aria-label="Go home"></w-icon-btn>');
  await expect(page.locator('#labelled button')).toHaveAttribute('aria-label', 'Go home');
});

test('w-icon-btn named sizes size the box and the glyph', async ({ mount, page }) => {
  await mount('<w-icon-btn id="b" icon="home" size="large"></w-icon-btn>');
  const button = page.locator('#b button');
  await expect(button).toHaveClass(/w-icon-btn--large/);
  await expect(button).toHaveCSS('width', '48px');
  await expect(button).toHaveCSS('height', '48px');
  await expect(page.locator('#b button > .w-icon')).toHaveCSS('font-size', '24px');

  await mount('<w-icon-btn id="xl" icon="home" size="x-large"></w-icon-btn>');
  await expect(page.locator('#xl button')).toHaveCSS('width', '56px');
});

test('w-icon-btn sizes and icon-sizes tuple lists override the named scale', async ({ mount, page }) => {
  await mount(`
    <w-icon-btn id="pipe" icon="home" size="large" sizes="small|30,large|72" icon-sizes="large|30"></w-icon-btn>
    <w-icon-btn id="json" icon="home" size="small" sizes='[["small",30],["large",72]]'></w-icon-btn>
  `);

  await expect(page.locator('#pipe button')).toHaveCSS('width', '72px');
  await expect(page.locator('#pipe button > .w-icon')).toHaveCSS('font-size', '30px');
  await expect(page.locator('#json button')).toHaveCSS('width', '30px');

  // A named size with no tuple entry falls back to the CSS scale.
  await mount('<w-icon-btn id="miss" icon="home" size="large" sizes="small|30"></w-icon-btn>');
  await expect(page.locator('#miss button')).toHaveCSS('width', '48px');
});

test('w-icon-btn icon-size accepts a length, a number and a named size', async ({ mount, page }) => {
  await mount(`
    <w-icon-btn id="named" icon="home" icon-size="x-large"></w-icon-btn>
    <w-icon-btn id="number" icon="home" icon-size="19"></w-icon-btn>
    <w-icon-btn id="length" icon="home" icon-size="2.5rem"></w-icon-btn>
  `);

  await expect(page.locator('#named button > .w-icon')).toHaveCSS('font-size', '28px');
  await expect(page.locator('#number button > .w-icon')).toHaveCSS('font-size', '19px');
  await expect(page.locator('#length button > .w-icon')).toHaveCSS('font-size', '40px');
});

test('w-icon-btn icon-color, rotate and opacity reach the rendered control', async ({ mount, page }) => {
  await mount('<w-icon-btn id="b" icon="home" icon-color="primary" rotate="90" opacity="0.5"></w-icon-btn>');

  const painted = await page.locator('#b button').evaluate((el) => ({
    opacity: getComputedStyle(el).opacity,
    iconColor: getComputedStyle(el.querySelector('.w-icon')).color,
    transform: getComputedStyle(el.querySelector('.w-icon')).transform,
    token: getComputedStyle(el).getPropertyValue('--w-primary').trim(),
  }));

  expect(painted.opacity).toBe('0.5');
  expect(painted.transform).not.toBe('none');
  expect(painted.iconColor).not.toBe('rgb(0, 0, 0)');
  expect(painted.token).not.toBe('');

  // A raw CSS colour is used verbatim.
  await mount('<w-icon-btn id="raw" icon="home" icon-color="#ff0000"></w-icon-btn>');
  await expect(page.locator('#raw button > .w-icon')).toHaveCSS('color', 'rgb(255, 0, 0)');
});

test('w-icon-btn active switches the variant and the icon', async ({ mount, page }) => {
  await mount(`
    <w-icon-btn id="on" icon="star-outline" active active-icon="star"
      active-variant="tonal" base-variant="outlined" variant="plain"></w-icon-btn>
    <w-icon-btn id="off" icon="star-outline" active="false" active-icon="star"
      active-variant="tonal" base-variant="outlined" variant="plain"></w-icon-btn>
    <w-icon-btn id="none" icon="star-outline" active-variant="tonal" variant="plain"></w-icon-btn>
  `);

  await expect(page.locator('#on button')).toHaveClass(/w-btn-tonal/);
  await expect(page.locator('#on button')).toContainText('star');
  await expect(page.locator('#on button')).toHaveClass(/active/);

  await expect(page.locator('#off button')).toHaveClass(/w-btn-outlined/);
  await expect(page.locator('#off button')).toContainText('star-outline');

  // Without `active` at all the component keeps its own variant.
  await expect(page.locator('#none button')).toHaveClass(/w-btn-plain/);
});

test('w-icon-btn hide-overlay removes the press overlay and the hover tint', async ({ mount, page }) => {
  await mount(`
    <w-icon-btn id="bare" icon="home" hide-overlay></w-icon-btn>
    <w-icon-btn id="normal" icon="home"></w-icon-btn>
  `);

  await expect(page.locator('#bare button')).toHaveClass(/w-icon-btn--no-overlay/);

  await page.locator('#bare button').hover();
  await expect(page.locator('#bare button')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');

  const overlay = await page.locator('#bare button').evaluate((el) => ({
    bare: getComputedStyle(el, '::before').content,
    normal: getComputedStyle(document.querySelector('#normal button'), '::before').content,
  }));
  expect(overlay.bare).toBe('none');
  expect(overlay.normal).not.toBe('none');
});

test('w-icon-btn inherits text, href, disabled and ripple from w-btn', async ({ mount, page }) => {
  await mount('<w-icon-btn id="link" icon="home" href="/home" text="Home"></w-icon-btn>');
  await expect(page.locator('#link a')).toHaveAttribute('href', '/home');
  await expect(page.locator('#link a')).toContainText('Home');
  await expect(page.locator('#link a')).not.toHaveAttribute('type', 'button');

  await mount('<w-icon-btn id="off" icon="home" disabled></w-icon-btn>');
  await expect(page.locator('#off button')).toBeDisabled();

  await mount('<w-icon-btn id="rip" icon="home" ripple></w-icon-btn>');
  const inks = await page.locator('#rip button').evaluate((el) => {
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    return el.querySelectorAll('.w-ripple-ink').length;
  });
  expect(inks).toBe(1);
});

test('w-icon-btn emits focus and blur from the inner control', async ({ mount, page }) => {
  await mount('<w-icon-btn id="b" icon="home"></w-icon-btn>');
  await recordEvents(page, '#b', ['focus', 'blur']);

  await page.locator('#b button').focus();
  await page.locator('body').click();

  const events = await readEvents(page, '#b');
  expect(events.map((event) => event.type)).toEqual(['focus', 'blur']);
});
