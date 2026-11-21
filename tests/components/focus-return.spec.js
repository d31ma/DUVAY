import { expect, test } from '../setup/component-test.js';

/* DUVAY-12: when a component gives focus back to an element, focus must land
 * on a control that can take it. A DuVay wrapper such as <w-btn> or
 * <w-icon-btn> is not focusable itself, so focus goes to its inner <button>,
 * never to <body>. */

const ACTIVATORS = [
  { name: 'w-icon-btn', markup: '<w-icon-btn id="more" icon="home" aria-label="More actions"></w-icon-btn>' },
  { name: 'w-btn', markup: '<w-btn id="more">More actions</w-btn>' },
];

function menuPage(activator) {
  return `<button id="before">Before</button>
    ${activator.markup}
    <w-menu id="menu" activator="more">
      <button role="menuitem" id="rename">Rename file</button>
      <button role="menuitem" id="move">Move file</button>
    </w-menu>
    <button id="after">After</button>`;
}

async function expectFocusOn(page, selector) {
  await expect(page.locator(selector)).toBeFocused();
  expect(await page.evaluate(() => document.activeElement === document.body)).toBe(false);
}

async function openFromInnerButton(page, key) {
  await page.locator('#more button').focus();
  await page.keyboard.press(key);
  await expect(page.locator('#menu')).toHaveAttribute('open', '');
  await expectFocusOn(page, '#rename');
}

async function focusTargetOf(page, selector) {
  return page.evaluate(async (query) => {
    const { WFocusTarget } = await import('/src/components/focus-target.js');
    const target = WFocusTarget.of(query === 'body' ? document.body : document.querySelector(query));
    return target ? target.id || target.tagName.toLowerCase() : null;
  }, selector);
}

for (const activator of ACTIVATORS) {
  test(`w-menu returns focus to the button inside an external ${activator.name} on Escape`, async ({ mount, page }) => {
    await mount(menuPage(activator));

    await openFromInnerButton(page, ' ');
    await page.keyboard.press('Escape');
    await expect(page.locator('#menu')).not.toHaveAttribute('open', '');
    await expectFocusOn(page, '#more button');
  });

  test(`w-menu returns focus to the button inside an external ${activator.name} on Shift+Tab`, async ({ mount, page }) => {
    await mount(menuPage(activator));

    await openFromInnerButton(page, 'ArrowDown');
    await page.keyboard.press('Shift+Tab');
    await expect(page.locator('#menu')).not.toHaveAttribute('open', '');
    await expectFocusOn(page, '#more button');
  });

  test(`w-menu moves Tab past an external ${activator.name} to the next control`, async ({ mount, page }) => {
    await mount(menuPage(activator));

    await openFromInnerButton(page, 'ArrowDown');
    await page.keyboard.press('Tab');
    await expect(page.locator('#menu')).not.toHaveAttribute('open', '');
    await expectFocusOn(page, '#after');
  });

  test(`w-menu returns focus to the button inside an external ${activator.name} after an item click`, async ({ mount, page }) => {
    await mount(menuPage(activator));

    await openFromInnerButton(page, 'Enter');
    await page.locator('#move').click();
    await expect(page.locator('#menu')).not.toHaveAttribute('open', '');
    await expectFocusOn(page, '#more button');
  });

  test(`w-dialog return-focus on a ${activator.name} focuses its inner button`, async ({ mount, page }) => {
    await mount(`<button id="opener">Open</button>
      ${activator.markup}
      <w-dialog id="dialog" heading="Hi" return-focus="more"><button id="inside">Inside</button></w-dialog>`);

    await page.locator('#opener').evaluate((button) => {
      button.focus();
      document.querySelector('#dialog').setAttribute('open', '');
    });
    await expectFocusOn(page, '#inside');
    await page.keyboard.press('Escape');
    await expectFocusOn(page, '#more button');
  });

  test(`w-dialog opened by clicking a slotted ${activator.name} returns focus to its inner button`, async ({ mount, page }) => {
    await mount(`<w-dialog id="dialog" heading="Hi">
        ${activator.markup.replace(' id="more"', ' slot="activator" id="more"')}
        <button id="inside">Inside</button>
      </w-dialog>`);

    await page.locator('#more').click();
    await expectFocusOn(page, '#inside');
    await page.keyboard.press('Escape');
    await expectFocusOn(page, '#more button');
  });

  test(`w-bottom-sheet return-focus on a ${activator.name} focuses its inner button`, async ({ mount, page }) => {
    await mount(`<button id="opener">Open</button>
      ${activator.markup}
      <w-bottom-sheet id="sheet" return-focus="more"><button id="inside">Inside</button></w-bottom-sheet>`);

    await page.locator('#opener').evaluate((button) => {
      button.focus();
      document.querySelector('#sheet').setAttribute('open', '');
    });
    await expectFocusOn(page, '#inside');
    await page.keyboard.press('Escape');
    await expectFocusOn(page, '#more button');
  });

  test(`w-overlay return-focus on a ${activator.name} focuses its inner button`, async ({ mount, page }) => {
    await mount(`<button id="opener">Open</button>
      ${activator.markup}
      <w-overlay id="overlay" return-focus="more"><button id="inside">Inside</button></w-overlay>`);

    await page.locator('#opener').evaluate((button) => {
      button.focus();
      document.querySelector('#overlay').setAttribute('open', '');
    });
    await expectFocusOn(page, '#inside');
    await page.keyboard.press('Escape');
    await expectFocusOn(page, '#more button');
  });

  test(`w-hover-card with a ${activator.name} trigger returns focus to its inner button on Escape`, async ({ mount, page }) => {
    await mount(`<w-hover-card id="card" side="bottom">
        ${activator.markup}
        <span slot="content"><button id="follow">Follow</button></span>
      </w-hover-card>`);

    await expect(page.locator('#more button')).toHaveAttribute('aria-haspopup', 'dialog');
    await expect(page.locator('#card .w-hover-card-trigger')).not.toHaveAttribute('tabindex', /.*/);
    await page.locator('#more button').focus();
    await page.keyboard.press('Tab');
    await expectFocusOn(page, '#follow');
    await page.keyboard.press('Escape');
    await expect(page.locator('#card')).not.toHaveAttribute('open', '');
    await expectFocusOn(page, '#more button');
  });

  test(`w-command and w-command-palette give focus back to the button inside a ${activator.name}`, async ({ mount, page }) => {
    await mount(`${activator.markup}
      <w-command id="cmd" hotkey="mod+k"><w-command-item value="profile">Profile</w-command-item></w-command>
      <w-command-palette id="palette" hotkey="mod+j" items='[{"title":"Settings","value":"settings"}]'></w-command-palette>`);

    for (const id of ['#cmd', '#palette']) {
      await page.locator('#more button').focus();
      await page.locator(id).evaluate((element) => element.show());
      await expectFocusOn(page, `${id} .w-command-input`);
      await page.locator(id).evaluate((element) => element.hide());
      await expectFocusOn(page, '#more button');
    }
  });
}

test('WFocusTarget picks the element, its first tabbable descendant, or its tabbable ancestor', async ({ mount, page }) => {
  await mount(`
    <button id="plain">Plain</button>
    <div id="roving" tabindex="-1">Row</div>
    <w-btn id="wrapped">Wrapped</w-btn>
    <div id="skips"><button disabled>Off</button><button hidden>Hidden</button><span inert><button>Inert</button></span><a id="link" href="#x">Link</a></div>
    <div id="none"><span>Text</span><button disabled>Off</button></div>
    <button id="outer"><span id="label">Label</span></button>
    <a id="anchor">No href</a>
  `);

  expect(await focusTargetOf(page, '#plain')).toBe('plain');
  expect(await focusTargetOf(page, '#roving')).toBe('roving');
  expect(await focusTargetOf(page, '#wrapped')).toBe('button');
  expect(await focusTargetOf(page, '#skips')).toBe('link');
  expect(await focusTargetOf(page, '#none')).toBe(null);
  expect(await focusTargetOf(page, '#label')).toBe('outer');
  expect(await focusTargetOf(page, '#anchor')).toBe(null);
  expect(await focusTargetOf(page, 'body')).toBe(null);
  expect(await focusTargetOf(page, '#missing')).toBe(null);
});

test('WFocusTarget.focus moves focus to the inner control and returns it', async ({ mount, page }) => {
  await mount('<w-icon-btn id="more" icon="home" aria-label="More actions"></w-icon-btn>');

  const focused = await page.evaluate(async () => {
    const { WFocusTarget } = await import('/src/components/focus-target.js');
    const target = WFocusTarget.focus(document.querySelector('#more'), { preventScroll: true });
    return target === document.activeElement && target.tagName;
  });
  expect(focused).toBe('BUTTON');
  await expectFocusOn(page, '#more button');
  expect(await page.evaluate(async () => {
    const { WFocusTarget } = await import('/src/components/focus-target.js');
    return WFocusTarget.focus(null);
  })).toBe(null);
});
