import { expect, recordEvents, readEvents, test } from '../setup/component-test.js';

test('w-overlay reflects open and scrim attributes', async ({ mount, page }) => {
  await mount('<w-overlay id="overlay" label="Open details" open scrim="primary" opacity="0.6" z-index="2500" width="18rem">Overlay content</w-overlay>');

  const overlay = page.locator('#overlay .w-overlay');
  await expect(overlay).toHaveClass(/open/);
  await expect(overlay).toHaveClass(/w-overlay--scrim/);
  await expect(overlay).not.toHaveAttribute('hidden', '');
  await expect(overlay).toHaveCSS('--w-overlay-opacity', '60%');
  await expect(overlay).toHaveCSS('z-index', '2500');
  await expect(page.locator('#overlay .w-overlay-activator')).toHaveText('Open details');
  await expect(page.locator('#overlay .w-overlay-activator')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#overlay .w-overlay-content')).toHaveText('Overlay content');
  await expect(page.locator('#overlay .w-overlay-content')).toHaveCSS('width', '288px');

  await page.locator('#overlay').evaluate((el) => {
    el.removeAttribute('open');
    el.setAttribute('scrim', 'false');
  });

  await expect(overlay).not.toHaveClass(/open/);
  await expect(overlay).not.toHaveClass(/w-overlay--scrim/);
  await expect(page.locator('#overlay .w-overlay-scrim')).toHaveCount(0);
  await expect(overlay).toHaveAttribute('hidden', '');
});

test('w-overlay closes from outside click and escape unless persistent', async ({ mount, page }) => {
  await mount('<w-overlay id="overlay" open>Overlay content</w-overlay>');
  await recordEvents(page, '#overlay', ['toggle', 'close']);

  await page.locator('#overlay .w-overlay').evaluate((overlay) => {
    overlay.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await expect(page.locator('#overlay')).not.toHaveAttribute('open', '');
  expect((await readEvents(page, '#overlay')).map((event) => event.type)).toEqual(['toggle', 'close']);

  await page.locator('#overlay').evaluate((el) => {
    el.setAttribute('persistent', '');
    el.show();
  });
  await page.keyboard.press('Escape');
  await expect(page.locator('#overlay')).toHaveAttribute('open', '');
});

test('w-overlay opens from activator, supports location, and returns focus', async ({ mount, page }) => {
  await mount(`
    <w-overlay id="overlay" location="bottom-end" contained>
      <button slot="activator" id="trigger">Show overlay</button>
      <div class="w-card"><button id="inside">Inside action</button></div>
    </w-overlay>
  `);
  await recordEvents(page, '#overlay', ['toggle', 'close']);

  await page.locator('#trigger').click();

  await expect(page.locator('#overlay')).toHaveAttribute('open', '');
  await expect(page.locator('#overlay .w-overlay')).toHaveClass(/w-overlay--contained/);
  await expect(page.locator('#overlay .w-overlay')).toHaveClass(/w-overlay--location-bottom-end/);
  await expect(page.locator('#inside')).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(page.locator('#overlay')).not.toHaveAttribute('open', '');
  await expect(page.locator('#trigger')).toBeFocused();
  expect((await readEvents(page, '#overlay')).map((event) => event.type)).toEqual(['toggle', 'toggle', 'close']);
});
