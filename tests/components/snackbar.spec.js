import { expect, readEvents, recordEvents, test } from '../setup/component-test.js';

test('w-snackbar renders message and action with default bottom-center location', async ({ mount, page }) => {
  await mount('<w-snackbar id="s" text="Saved" action="Undo" timeout="-1" open inline></w-snackbar>');

  const bar = page.locator('#s .w-snackbar');
  await expect(bar).toHaveClass(/w-snackbar--bottom/);
  await expect(bar).toHaveClass(/w-snackbar--center/);
  await expect(page.locator('#s .w-snackbar-msg')).toHaveText('Saved');
  await expect(page.locator('#s [data-w-snackbar-action]')).toHaveText('Undo');
});

test('w-snackbar maps color, location, and timer', async ({ mount, page }) => {
  await mount('<w-snackbar id="s" text="Hi" color="success" location="top end" timer timeout="-1" open inline></w-snackbar>');
  const bar = page.locator('#s .w-snackbar');
  await expect(bar).toHaveClass(/w-snackbar--top/);
  await expect(bar).toHaveClass(/w-snackbar--end/);
  expect(await bar.getAttribute('style')).toContain('--w-snackbar-bg: var(--w-success-container)');
});

test('w-snackbar close button hides it and emits update:model-value and close', async ({ mount, page }) => {
  await mount('<w-snackbar id="s" text="Bye" timeout="-1" open inline></w-snackbar>');
  await recordEvents(page, '#s', ['update:model-value', 'close']);

  await page.locator('#s [data-w-snackbar-close]').click();

  await expect(page.locator('#s')).not.toHaveAttribute('open', '');
  await expect(page.locator('#s .w-snackbar')).toHaveCount(0);
  // Note: the test harness records falsy event detail as null.
  expect(await readEvents(page, '#s')).toEqual([
    { type: 'update:model-value', detail: null },
    { type: 'close', detail: null },
  ]);
});

test('w-snackbar renders a custom actions slot', async ({ mount, page }) => {
  await mount('<w-snackbar id="s" text="Hi" timeout="-1" open inline><button slot="actions" class="a">Retry</button></w-snackbar>');
  await expect(page.locator('#s .w-snackbar-actions .a')).toHaveText('Retry');
});
