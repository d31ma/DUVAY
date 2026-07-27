import { expect, test } from '../setup/component-test.js';

test('w-snackbar-queue renders one snackbar per initial message', async ({ mount, page }) => {
  await mount('<w-snackbar-queue id="q" messages="Saved,Exported" timeout="-1"></w-snackbar-queue>');
  await expect(page.locator('#q w-snackbar')).toHaveCount(2);
  await expect(page.locator('#q w-snackbar').first().locator('.w-snackbar-msg')).toHaveText('Saved');
});

test('w-snackbar-queue forwards color to queued snackbars', async ({ mount, page }) => {
  await mount('<w-snackbar-queue id="q" messages="Hi" color="success" timeout="-1"></w-snackbar-queue>');
  await expect(page.locator('#q w-snackbar')).toHaveAttribute('color', 'success');
});

test('w-snackbar-queue push() adds a message and dismissing removes it', async ({ mount, page }) => {
  await mount('<w-snackbar-queue id="q" messages="One" timeout="-1"></w-snackbar-queue>');
  await expect(page.locator('#q w-snackbar')).toHaveCount(1);

  await page.locator('#q').evaluate((el) => el.push('Two'));
  await expect(page.locator('#q w-snackbar')).toHaveCount(2);

  // Dismiss programmatically — queued snackbars are fixed-position and overlap,
  // so a real click on the buried one isn't reliable.
  await page.locator('#q w-snackbar').first().evaluate((el) => el.close());
  await expect(page.locator('#q w-snackbar')).toHaveCount(1);
});

test('w-snackbar-queue splits on semicolons when the message list contains one', async ({ mount, page }) => {
  await mount('<w-snackbar-queue id="q" messages="Saved, then exported;Synced;" timeout="-1"></w-snackbar-queue>');

  // The semicolon wins, so the comma stays part of the first message and the
  // trailing empty segment is dropped.
  await expect(page.locator('#q w-snackbar')).toHaveCount(2);
  await expect(page.locator('#q .w-snackbar-msg')).toHaveText(['Saved, then exported', 'Synced']);
});

test('w-snackbar-queue accepts a JSON array and joins nested rows with a pipe', async ({ mount, page }) => {
  await mount(`<w-snackbar-queue id="q" messages='["One", ["Two", "Three"], "  ", null]' timeout="-1"></w-snackbar-queue>`);

  await expect(page.locator('#q w-snackbar')).toHaveCount(2);
  await expect(page.locator('#q .w-snackbar-msg')).toHaveText(['One', 'Two|Three']);
});

test('w-snackbar-queue recovers bracketed lists that are not valid JSON', async ({ mount, page }) => {
  await mount(`
    <w-snackbar-queue id="loose" messages="[Saved;Exported]" timeout="-1"></w-snackbar-queue>
    <w-snackbar-queue id="unterminated" messages='["Saved"' timeout="-1"></w-snackbar-queue>
    <w-snackbar-queue id="empty" messages="" timeout="-1"></w-snackbar-queue>
    <w-snackbar-queue id="missing" timeout="-1"></w-snackbar-queue>
  `);

  await expect(page.locator('#loose .w-snackbar-msg')).toHaveText(['Saved', 'Exported']);
  // An unclosed bracket is not a list at all, so nothing is queued.
  await expect(page.locator('#unterminated w-snackbar')).toHaveCount(0);
  await expect(page.locator('#empty w-snackbar')).toHaveCount(0);
  await expect(page.locator('#missing w-snackbar')).toHaveCount(0);
});

test('w-snackbar-queue falls back to the text attribute when no messages are listed', async ({ mount, page }) => {
  await mount(`
    <w-snackbar-queue id="single" text="Saved" timeout="-1"></w-snackbar-queue>
    <w-snackbar-queue id="listed" text="Ignored" messages="One,Two" timeout="-1"></w-snackbar-queue>
  `);

  await expect(page.locator('#single .w-snackbar-msg')).toHaveText(['Saved']);
  // An explicit list wins over the single fallback.
  await expect(page.locator('#listed .w-snackbar-msg')).toHaveText(['One', 'Two']);
});

test('w-snackbar-queue total-visible caps how many snackbars are on screen', async ({ mount, page }) => {
  await mount('<w-snackbar-queue id="q" messages="One,Two,Three,Four" total-visible="2" timeout="-1"></w-snackbar-queue>');

  await expect(page.locator('#q w-snackbar')).toHaveCount(2);
  await expect(page.locator('#q .w-snackbar-msg')).toHaveText(['One', 'Two']);

  // "hold" is the default, so dismissing the front one promotes the next.
  await page.locator('#q w-snackbar').first().evaluate((el) => el.close());
  await expect(page.locator('#q .w-snackbar-msg')).toHaveText(['Two', 'Three']);
});

test('w-snackbar-queue display-strategy="overflow" drops the oldest to make room', async ({ mount, page }) => {
  await mount(`
    <w-snackbar-queue id="hold" messages="One,Two" total-visible="2" timeout="-1"></w-snackbar-queue>
    <w-snackbar-queue id="over" messages="One,Two" total-visible="2" display-strategy="overflow" timeout="-1"></w-snackbar-queue>
  `);

  await page.locator('#hold').evaluate((el) => el.push('Three'));
  await expect(page.locator('#hold .w-snackbar-msg')).toHaveText(['One', 'Two']);

  await page.locator('#over').evaluate((el) => el.push('Three'));
  await expect(page.locator('#over .w-snackbar-msg')).toHaveText(['Two', 'Three']);
});

test('w-snackbar-queue gap stacks the snackbars and collapsed compresses the stack', async ({ mount, page }) => {
  await mount(`
    <w-snackbar-queue id="open" messages="One,Two,Three" gap="20" timeout="-1"></w-snackbar-queue>
    <w-snackbar-queue id="stacked" messages="One,Two,Three" gap="20" collapsed timeout="-1"></w-snackbar-queue>
  `);

  await expect(page.locator('#open w-snackbar').nth(2)).toHaveAttribute('queue-index', '2');
  await expect(page.locator('#open w-snackbar').nth(2)).toHaveAttribute('queue-gap', '20');
  await expect(page.locator('#open .w-snackbar').nth(2)).toHaveCSS('bottom', '56px');

  await expect(page.locator('#stacked .w-snackbar-queue')).toHaveClass(/w-snackbar-queue--collapsed/);
  await expect(page.locator('#stacked .w-snackbar').nth(2)).toHaveCSS('bottom', '22px');
});

test('w-snackbar-queue forwards the snackbar surface props to every item', async ({ mount, page }) => {
  await mount(`
    <w-snackbar-queue id="q" messages="One,Two" title="Sync" variant="outlined" vertical
      timer timer-color="error" reverse-timer close-text="Hide" prepend-icon="sync"
      transition="fade" content-class="promo" z-index="1400" timeout="9000"></w-snackbar-queue>
  `);

  const first = page.locator('#q w-snackbar').first();
  await expect(first).toHaveAttribute('title', 'Sync');
  await expect(first).toHaveAttribute('timer-color', 'error');

  await expect(page.locator('#q .w-snackbar-title').first()).toHaveText('Sync');
  await expect(page.locator('#q .w-snackbar-icon').first()).toHaveText('sync');
  await expect(page.locator('#q .w-snackbar').first()).toHaveClass(/w-snackbar--vertical/);
  await expect(page.locator('#q .w-snackbar').first()).toHaveClass(/w-snackbar--outlined/);
  await expect(page.locator('#q .w-snackbar').first()).toHaveClass(/promo/);
  await expect(page.locator('#q .w-snackbar').first()).toHaveCSS('z-index', '1400');
  await expect(page.locator('#q [w-snackbar-close]').first()).toHaveAttribute('aria-label', 'Hide');
  await expect(page.locator('#q .w-snackbar-timer').first()).toHaveClass(/w-snackbar-timer--reverse/);
});

test('w-snackbar-queue forwards closable="false" so items cannot be dismissed by hand', async ({ mount, page }) => {
  await mount('<w-snackbar-queue id="q" messages="One" closable="false" timeout="-1"></w-snackbar-queue>');

  await expect(page.locator('#q w-snackbar')).toHaveCount(1);
  await expect(page.locator('#q [w-snackbar-close]')).toHaveCount(0);
});

test('w-snackbar-queue push() seeds the queue from text before appending', async ({ mount, page }) => {
  await mount('<w-snackbar-queue id="q" text="Saved" timeout="-1"></w-snackbar-queue>');

  await page.locator('#q').evaluate((el) => el.push('Exported'));
  await expect(page.locator('#q .w-snackbar-msg')).toHaveText(['Saved', 'Exported']);
});
