import { expect, test } from '../setup/component-test.js';

test('w-hotkey renders a combo as kbd chips, platform-aware', async ({ mount, page }) => {
  await mount('<w-hotkey id="mac" keys="cmd+k" platform="mac"></w-hotkey><w-hotkey id="pc" keys="cmd+k" platform="pc"></w-hotkey>');

  await expect(page.locator('#mac .w-hotkey-key')).toHaveText(['⌘', 'K']);
  await expect(page.locator('#pc .w-hotkey-key')).toHaveText(['Ctrl', 'K']);
});

test('w-hotkey renders sequential steps separated by "then"', async ({ mount, page }) => {
  await mount('<w-hotkey id="seq" keys="ctrl+k-ctrl+s" platform="pc"></w-hotkey>');

  await expect(page.locator('#seq .w-hotkey-key')).toHaveText(['Ctrl', 'K', 'Ctrl', 'S']);
  await expect(page.locator('#seq .w-hotkey-then')).toHaveText('then');
});

test('w-hotkey display-mode controls modifier rendering', async ({ mount, page }) => {
  await mount('<w-hotkey id="sym" keys="ctrl+shift+p" platform="pc" display-mode="symbol"></w-hotkey><w-hotkey id="txt" keys="ctrl+shift+p" platform="pc" display-mode="text"></w-hotkey>');

  await expect(page.locator('#sym .w-hotkey-key')).toHaveText(['⌃', '⇧', 'P']);
  await expect(page.locator('#txt .w-hotkey-key')).toHaveText(['Control', 'Shift', 'P']);
});

test('w-hotkey normalizes named keys (enter, esc, arrows, space)', async ({ mount, page }) => {
  await mount('<w-hotkey id="named" keys="enter-esc-up-space" platform="mac"></w-hotkey>');
  await expect(page.locator('#named .w-hotkey-key')).toHaveText(['↵', '⎋', '↑', 'Space']);
});

test('w-hotkey variant plain drops the chip box; disabled dims and flags', async ({ mount, page }) => {
  await mount('<w-hotkey id="plain" keys="cmd+k" variant="plain"></w-hotkey><w-hotkey id="dis" keys="cmd+k" disabled></w-hotkey>');

  await expect(page.locator('#plain .w-hotkey')).toHaveClass(/w-hotkey--plain/);
  await expect(page.locator('#plain .w-hotkey-key').first()).toHaveCSS('border-top-width', '0px');
  await expect(page.locator('#dis .w-hotkey')).toHaveClass(/w-hotkey--disabled/);
  await expect(page.locator('#dis .w-hotkey')).toHaveAttribute('aria-disabled', 'true');
});

test('w-hotkey exposes a readable aria-label', async ({ mount, page }) => {
  await mount('<w-hotkey id="a" keys="ctrl+k-ctrl+s" platform="pc"></w-hotkey>');
  await expect(page.locator('#a .w-hotkey')).toHaveAttribute('aria-label', 'Control + K, then Control + S');
});
