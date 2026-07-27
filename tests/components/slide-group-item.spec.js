import { expect, test } from '../setup/component-test.js';

test('w-slide-group-item reflects value and disabled state for selectable slide content', async ({ mount, page }) => {
  await mount('<w-slide-group-item id="item" value="alpha" disabled><button>Alpha</button></w-slide-group-item>');

  await expect(page.locator('#item .w-slide-group-item')).toHaveAttribute('aria-disabled', 'true');
  await expect(page.locator('#item')).toHaveAttribute('value', 'alpha');

  await page.locator('#item').evaluate((el) => el.removeAttribute('disabled'));

  await expect(page.locator('#item .w-slide-group-item')).not.toHaveAttribute('aria-disabled', 'true');
});

test('w-slide-group-item applies selected-class when it is already selected', async ({ mount, page }) => {
  await mount('<w-slide-group-item id="item" value="alpha" selected selected-class="is-special"><button>A</button></w-slide-group-item>');

  await expect(page.locator('#item')).toHaveClass(/is-special/);
});

test('w-slide-group-item without selected-class stays unstyled', async ({ mount, page }) => {
  await mount('<w-slide-group-item id="item" value="alpha" selected><button>A</button></w-slide-group-item>');

  await expect(page.locator('#item .w-slide-group-item')).toHaveCount(1);
  await expect(page.locator('#item')).not.toHaveClass(/is-special/);
});
