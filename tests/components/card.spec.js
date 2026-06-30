import { expect, test } from '../setup/component-test.js';

test('w-card generates Vuetify-style image, item, text, actions, and plain body sections', async ({ mount, page }) => {
  await mount(`
    <w-card
      id="card"
      image="/hero.png"
      title="Release plan"
      subtitle="Q3 roadmap"
      text="Review milestones before publishing."
      prepend-icon="calendar"
      append-icon="more"
      style="max-width: 360px"
    >
      Extra body content
      <w-btn slot="actions" variant="text">Cancel</w-btn>
      <w-btn slot="actions" variant="filled">Publish</w-btn>
    </w-card>
  `);

  const card = page.locator('#card > .w-card');
  await expect(card).toHaveClass(/w-card--variant-elevated/);
  await expect(page.locator('#card .w-card__image img')).toHaveAttribute('src', '/hero.png');
  await expect(page.locator('#card .w-card-title')).toHaveText('Release plan');
  await expect(page.locator('#card .w-card-subtitle')).toHaveText('Q3 roadmap');
  await expect(page.locator('#card .w-card-text')).toHaveText('Review milestones before publishing.');
  await expect(page.locator('#card .w-card-item__prepend .w-card-icon')).toHaveText('calendar');
  await expect(page.locator('#card .w-card-item__append .w-card-icon')).toHaveText('more');
  await expect(page.locator('#card .w-card-body')).toContainText('Extra body content');
  await expect(page.locator('#card .w-card-actions w-btn')).toHaveCount(2);
});

test('w-card reflects link, disabled, hover, variant, color, rounded, border, density, elevation, and loading attrs', async ({ mount, page }) => {
  await mount(`
    <w-card
      id="card"
      href="/docs/cards"
      target="_blank"
      rel="noreferrer"
      hover
      variant="outlined"
      color="success"
      rounded="lg"
      border
      density="compact"
      elevation="4"
      loading="warning"
      title="Linked card"
    ></w-card>
  `);

  const card = page.locator('#card > .w-card');
  await expect(card).toHaveAttribute('href', '/docs/cards');
  await expect(card).toHaveAttribute('target', '_blank');
  await expect(card).toHaveAttribute('rel', 'noreferrer');
  await expect(card).toHaveClass(/w-card--link/);
  await expect(card).toHaveClass(/w-card--hover/);
  await expect(card).toHaveClass(/w-card--variant-outlined/);
  await expect(card).toHaveClass(/w-card--color-success/);
  await expect(card).toHaveClass(/w-card--rounded-lg/);
  await expect(card).toHaveClass(/w-card--border/);
  await expect(card).toHaveClass(/w-card--density-compact/);
  await expect(card).toHaveClass(/w-card--elevation-4/);
  await expect(page.locator('#card .w-card__loader-bar')).toHaveClass(/w-card__loader-bar--warning/);
  await expect(page.locator('#card')).toHaveClass(/w-common-loading/);
  await expect(page.locator('#card')).toHaveCSS('cursor', 'progress');

  const hostLoaderContent = await page.locator('#card').evaluate((el) => getComputedStyle(el, '::after').content);
  expect(hostLoaderContent).toBe('none');

  await page.locator('#card').evaluate((el) => {
    el.setAttribute('disabled', '');
    el.setAttribute('flat', '');
    el.setAttribute('color', 'danger');
    el.removeAttribute('href');
  });

  await expect(page.locator('#card > a.w-card')).toHaveCount(0);
  await expect(page.locator('#card > div.w-card')).toHaveClass(/w-card--disabled/);
  await expect(page.locator('#card > div.w-card')).toHaveClass(/w-card--variant-flat/);
  await expect(page.locator('#card > div.w-card')).toHaveClass(/w-card--color-error/);
});

test('w-card supports named image, item, text, header, footer, and loader slots', async ({ mount, page }) => {
  await mount(`
    <w-card id="card" loading>
      <div slot="loader" class="custom-loader">Loading</div>
      <img slot="image" src="/slot.png" alt="Slot image">
      <div slot="header" class="custom-header">Legacy header</div>
      <div slot="item" class="custom-item">Custom item</div>
      <span slot="text" class="custom-text">Slotted text</span>
      <span slot="footer" class="custom-footer">Footer</span>
    </w-card>
  `);

  await expect(page.locator('#card .w-card__loader .custom-loader')).toHaveText('Loading');
  await expect(page.locator('#card .w-card__image img')).toHaveAttribute('src', '/slot.png');
  await expect(page.locator('#card .w-card-header .custom-header')).toHaveText('Legacy header');
  await expect(page.locator('#card .w-card-item .custom-item')).toHaveText('Custom item');
  await expect(page.locator('#card .w-card-text .custom-text')).toHaveText('Slotted text');
  await expect(page.locator('#card .w-card-footer .custom-footer')).toHaveText('Footer');
});

test('w-card-item reflects title, subtitle, prepend/append media, density, and slotted title content', async ({ mount, page }) => {
  await mount(`
    <w-card id="card">
      <w-card-item id="item" title="Card item" subtitle="Generated" prepend-avatar="/avatar.png" append-icon="more" density="compact">
        Body
      </w-card-item>
    </w-card>
  `);

  await expect(page.locator('#item .w-card-item')).toHaveClass(/w-card-item--compact/);
  await expect(page.locator('#item .w-card-title')).toHaveText('Card item');
  await expect(page.locator('#item .w-card-subtitle')).toHaveText('Generated');
  await expect(page.locator('#item .w-card-item__prepend img')).toHaveAttribute('src', '/avatar.png');
  await expect(page.locator('#item .w-card-item__append .w-card-icon')).toHaveText('more');
  await expect(page.locator('#item .w-card-item__content')).toContainText('Body');

  await page.locator('#item').evaluate((el) => {
    el.innerHTML = '<span slot="title">Slot title</span><span slot="subtitle">Slot subtitle</span>';
    el.removeAttribute('title');
    el.removeAttribute('subtitle');
    el.setAttribute('density', 'comfortable');
  });
  await expect(page.locator('#item .w-card-title')).toHaveText('Slot title');
  await expect(page.locator('#item .w-card-subtitle')).toHaveText('Slot subtitle');
});

test('w-card subcomponents share a consistent padded content rhythm', async ({ mount, page }) => {
  await mount(`
    <w-card id="card">
      <w-card-title>Field Notes</w-card-title>
      <w-card-text>A compact, thoughtful release.</w-card-text>
      <w-card-actions><w-btn>Rate</w-btn></w-card-actions>
    </w-card>
  `);

  const title = page.locator('#card w-card-title > .w-card-title');
  const text = page.locator('#card w-card-text > .w-card-text');
  const actions = page.locator('#card w-card-actions > .w-card-actions');

  await expect(title).toHaveCSS('padding-top', '16px');
  await expect(title).toHaveCSS('padding-right', '20px');
  await expect(title).toHaveCSS('padding-bottom', '8px');
  await expect(title).toHaveCSS('padding-left', '20px');
  await expect(text).toHaveCSS('padding-top', '0px');
  await expect(text).toHaveCSS('padding-right', '20px');
  await expect(actions).toHaveCSS('padding-left', '20px');
});
