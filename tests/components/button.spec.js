import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-btn reflects variant, color, size, loading, active, disabled, icon, and aria attributes', async ({ mount, page }) => {
  await mount(`
    <w-btn id="button" variant="filled" color="danger" size="lg" loading active disabled icon="check" aria-label="Save">Save</w-btn>
  `);

  const host = page.locator('#button');
  const button = page.locator('#button button');
  await expect(button).toHaveClass(/w-btn-filled/);
  await expect(button).toHaveClass(/w-btn-danger/);
  await expect(button).toHaveClass(/w-btn--lg/);
  await expect(button).toHaveClass(/loading/);
  await expect(button).toHaveClass(/active/);
  await expect(button).toBeDisabled();
  await expect(button).toHaveAttribute('aria-busy', 'true');
  await expect(button).toHaveAttribute('aria-label', 'Save');
  await expect(host.locator('.w-btn-leading-icon')).toHaveCount(1);
  expect(await host.evaluate((el) => getComputedStyle(el, '::after').content)).toBe('none');
  expect(await button.evaluate((el) => getComputedStyle(el, '::after').content)).toBe('""');

  await host.evaluate((el) => {
    el.variant = 'outlined';
    el.size = 'sm';
    el.disabled = false;
    el.loading = false;
    el.active = false;
  });

  await expect(button).toHaveClass(/w-btn-outlined/);
  await expect(button).toHaveClass(/w-btn--sm/);
  await expect(button).toBeEnabled();
  await expect(button).not.toHaveAttribute('aria-busy', 'true');
  await expect(button).not.toHaveClass(/active/);
});

test('w-btn renders links for href and emits focus and blur events from the inner control', async ({ mount, page }) => {
  await mount('<w-btn id="button" href="/docs" variant="text">Docs</w-btn>');
  await expect(page.locator('#button a')).toHaveAttribute('href', '/docs');

  await recordEvents(page, '#button', ['focus', 'blur']);
  await page.locator('#button a').focus();
  await page.locator('body').click();

  const events = await readEvents(page, '#button');
  expect(events.map((event) => event.type)).toEqual(['focus', 'blur']);
});

test('w-btn ripple inks on Enter and Space keydown but not on other keys', async ({ mount, page }) => {
  await mount('<w-btn id="button" variant="filled" ripple>Ripple</w-btn>');
  const button = page.locator('#button button');

  // One synchronous pass so no animationend can retire an ink mid-measurement.
  const counts = await button.evaluate((el) => {
    const press = (key) => el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    const inks = () => el.querySelectorAll('.w-ripple-ink').length;
    const seen = {};
    press('Escape');
    seen.afterEscape = inks();
    press('ArrowDown');
    seen.afterArrow = inks();
    press('Enter');
    seen.afterEnter = inks();
    press(' ');
    seen.afterSpace = inks();
    press('Spacebar');
    seen.afterLegacySpace = inks();
    return seen;
  });

  expect(counts).toEqual({
    afterEscape: 0,
    afterArrow: 0,
    afterEnter: 1,
    afterSpace: 2,
    afterLegacySpace: 3,
  });

  // A keyboard ripple has no pointer coordinates, so it starts from the centre.
  const geometry = await button.evaluate((el) => {
    const ink = el.querySelector('.w-ripple-ink');
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    return {
      size: Number.parseFloat(ink.style.width),
      centreX: Number.parseFloat(ink.style.left) + Number.parseFloat(ink.style.width) / 2,
      centreY: Number.parseFloat(ink.style.top) + Number.parseFloat(ink.style.height) / 2,
      expectedSize: size,
      expectedCentreX: rect.width / 2,
      expectedCentreY: rect.height / 2,
    };
  });
  expect(geometry.size).toBeCloseTo(geometry.expectedSize, 2);
  expect(geometry.centreX).toBeCloseTo(geometry.expectedCentreX, 2);
  expect(geometry.centreY).toBeCloseTo(geometry.expectedCentreY, 2);
});

test('w-btn text renders the label and keeps slotted children in the tree', async ({ mount, page }) => {
  await mount('<w-btn id="button" text="Save">Fallback</w-btn>');

  const button = page.locator('#button button');
  await expect(button).toContainText('Save');
  // The slot survives so a later re-render can still redistribute the children.
  await expect(page.locator('#button button > slot')).toHaveAttribute('hidden', '');
  await expect(page.locator('#button button > slot')).toContainText('Fallback');
});

test('w-btn value, flat and slim reach the rendered control', async ({ mount, page }) => {
  await mount('<w-btn id="button" variant="elevated" value="save" flat slim>Save</w-btn>');

  const button = page.locator('#button button');
  await expect(button).toHaveAttribute('value', 'save');
  await expect(button).toHaveCSS('box-shadow', 'none');
  await expect(button).toHaveCSS('padding-left', '8px');
  await expect(button).toHaveCSS('padding-right', '8px');

  await mount('<w-btn id="plain" variant="elevated">Save</w-btn>');
  expect(await page.locator('#plain button').evaluate((el) => getComputedStyle(el).boxShadow)).not.toBe('none');
});

test('w-btn selected-class is applied only while the button is active', async ({ mount, page }) => {
  await mount('<w-btn id="button" selected-class="is-chosen">Day</w-btn>');
  await expect(page.locator('#button button')).not.toHaveClass(/is-chosen/);

  await page.locator('#button').evaluate((el) => { el.active = true; });
  await expect(page.locator('#button button')).toHaveClass(/is-chosen/);

  await page.locator('#button').evaluate((el) => { el.active = false; });
  await expect(page.locator('#button button')).not.toHaveClass(/is-chosen/);
});

test('w-btn preserves safe selected-class tokens without allowing markup or attributes', async ({ mount, page }) => {
  await mount('<w-btn id="button" active>Day</w-btn>');
  await page.locator('#button').evaluate((el) => {
    el.setAttribute('selected-class', 'is-chosen emphasized bad" autofocus onclick="window.__classInjected=true <img');
  });

  const button = page.locator('#button button');
  await expect(button).toHaveClass(/is-chosen/);
  await expect(button).toHaveClass(/emphasized/);
  await expect(button).not.toHaveAttribute('autofocus');
  await expect(button).not.toHaveAttribute('onclick');
  await expect(page.locator('#button img')).toHaveCount(0);
  expect(await page.evaluate(() => window.__classInjected)).toBeUndefined();
});

test('w-btn rejects dangerous href protocols and keeps safe web URLs', async ({ mount, page }) => {
  await mount(`
    <w-btn id="relative" href="/docs">Docs</w-btn>
    <w-btn id="fragment" href="#details">Details</w-btn>
    <w-btn id="web" href="https://example.com/docs">Web</w-btn>
    <w-btn id="script" href="javascript:window.__urlInjected=true">Bad</w-btn>
    <w-icon-btn id="icon-script" icon="home" href="vbscript:msgbox(1)"></w-icon-btn>
  `);

  await expect(page.locator('#relative a')).toHaveAttribute('href', '/docs');
  await expect(page.locator('#fragment a')).toHaveAttribute('href', '#details');
  await expect(page.locator('#web a')).toHaveAttribute('href', 'https://example.com/docs');
  await expect(page.locator('#script a, #icon-script a')).toHaveCount(0);
  await expect(page.locator('#script button, #icon-script button')).toHaveCount(2);
});

test('w-btn spaced pushes the prepend and append icons out to the edges', async ({ mount, page }) => {
  await mount(`
    <div style="width: 320px">
      <w-btn id="plain" block prepend-icon="A" append-icon="B">Label</w-btn>
      <w-btn id="spread" block spaced="both" prepend-icon="A" append-icon="B">Label</w-btn>
      <w-btn id="lead" block spaced="start" prepend-icon="A" append-icon="B">Label</w-btn>
    </div>
  `);

  const gap = (selector) => page.locator(selector).evaluate((root) => {
    const lead = root.querySelector('.w-btn-leading-icon').getBoundingClientRect();
    const tail = root.querySelector('.w-btn-append-icon').getBoundingClientRect();
    return tail.left - lead.right;
  });

  await expect(page.locator('#spread button')).toHaveClass(/w-btn--spaced-both/);
  const plain = await gap('#plain');
  expect(await gap('#spread')).toBeGreaterThan(plain + 40);
  expect(await gap('#lead')).toBeGreaterThan(plain + 20);
});

test('w-btn accepts the Vuetify variant and size spellings', async ({ mount, page }) => {
  await mount('<w-btn id="button" variant="flat" size="x-large">Go</w-btn>');
  await expect(page.locator('#button button')).toHaveClass(/w-btn-filled/);
  await expect(page.locator('#button button')).toHaveClass(/w-btn--xl/);

  await mount('<w-btn id="small" size="small">Go</w-btn>');
  await expect(page.locator('#small button')).toHaveClass(/w-btn--sm/);
});

test('w-btn-group applies divided, direction and fills in the child variant', async ({ mount, page }) => {
  await mount(`
    <w-btn-group id="group" variant="outlined" divided direction="vertical">
      <w-btn>One</w-btn>
      <w-btn variant="filled">Two</w-btn>
    </w-btn-group>
  `);

  const group = page.locator('#group .w-btn-group');
  await expect(group).toHaveClass(/w-btn-group--divided/);
  await expect(group).toHaveClass(/w-btn-group--vertical/);
  await expect(group).toHaveAttribute('role', 'group');
  // The group only fills gaps — a child that declares a variant keeps it.
  await expect(page.locator('#group w-btn').first().locator('button')).toHaveClass(/w-btn-outlined/);
  await expect(page.locator('#group w-btn').nth(1).locator('button')).toHaveClass(/w-btn-filled/);

  await mount('<w-btn-group id="row"><w-btn>One</w-btn></w-btn-group>');
  await expect(page.locator('#row .w-btn-group')).not.toHaveClass(/w-btn-group--vertical/);
});

test('w-app-bar-nav-icon inherits the w-btn surface and keeps its hamburger default', async ({ mount, page }) => {
  await mount('<w-app-bar-nav-icon id="nav"></w-app-bar-nav-icon>');
  const button = page.locator('#nav button');
  await expect(button).toHaveClass(/w-app-bar-nav-icon/);
  await expect(button).toHaveClass(/w-btn-icon/);
  await expect(button).toHaveAttribute('aria-label', 'Open navigation');
  await expect(page.locator('#nav button > svg')).toHaveCount(1);

  // Button props inherited from <w-btn>.
  await mount('<w-app-bar-nav-icon id="styled" variant="outlined" size="large" slim active selected-class="on"></w-app-bar-nav-icon>');
  const styled = page.locator('#styled button');
  await expect(styled).toHaveClass(/w-btn-outlined/);
  await expect(styled).toHaveClass(/w-btn--lg/);
  await expect(styled).toHaveClass(/w-btn--slim/);
  await expect(styled).toHaveClass(/on/);

  // An authored icon or text replaces the hamburger.
  await mount('<w-app-bar-nav-icon id="custom" icon="close"></w-app-bar-nav-icon>');
  await expect(page.locator('#custom button > svg')).toHaveCount(0);
  await expect(page.locator('#custom button')).toContainText('close');

  // href turns it into a link and keeps the expanded state reporting.
  await mount('<w-app-bar-nav-icon id="link" href="/menu"></w-app-bar-nav-icon>');
  await expect(page.locator('#link a')).toHaveAttribute('href', '/menu');
  await expect(page.locator('#link a')).toHaveAttribute('aria-expanded', 'false');
});

test('w-btn forwards authored ARIA state to the control that carries the role', async ({ mount, page }) => {
  await mount(`
    <w-btn id="toggle" aria-label="Show contact sidebar" aria-pressed="false"
           aria-controls="sidebar" aria-haspopup="dialog" aria-describedby="hint">Contact</w-btn>
  `);

  const control = page.locator('#toggle button');
  await expect(control).toHaveAttribute('aria-pressed', 'false');
  await expect(control).toHaveAttribute('aria-controls', 'sidebar');
  await expect(control).toHaveAttribute('aria-haspopup', 'dialog');
  await expect(control).toHaveAttribute('aria-describedby', 'hint');
  await expect(page.getByRole('button', { name: 'Show contact sidebar' })).toHaveAttribute('aria-pressed', 'false');

  // The state stays in sync when the host attribute changes...
  await page.locator('#toggle').evaluate((el) => el.setAttribute('aria-pressed', 'true'));
  await expect(control).toHaveAttribute('aria-pressed', 'true');

  // ...and survives a re-render triggered by an unrelated attribute.
  await page.locator('#toggle').evaluate((el) => { el.variant = 'outlined'; });
  await expect(control).toHaveClass(/w-btn-outlined/);
  await expect(control).toHaveAttribute('aria-pressed', 'true');
});

test('w-btn withholds button-only ARIA state from the link form', async ({ mount, page }) => {
  await mount('<w-btn id="link" href="/docs" aria-pressed="true" aria-current="page">Docs</w-btn>');

  const link = page.locator('#link a');
  await expect(link).toHaveAttribute('aria-current', 'page');
  await expect(link).not.toHaveAttribute('aria-pressed', /.*/);
});

test('w-btn escapes forwarded ARIA values instead of letting them close the tag', async ({ mount, page }) => {
  await mount('<w-btn id="xss" aria-controls=\'x" onclick="window.__wPwned = true\'>Escape</w-btn>');

  const control = page.locator('#xss button');
  await expect(control).toHaveAttribute('aria-controls', 'x" onclick="window.__wPwned = true');
  await expect(control).not.toHaveAttribute('onclick', /.*/);
  expect(await page.evaluate(() => window.__wPwned)).toBeUndefined();
});
