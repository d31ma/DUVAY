import { expect, test } from '../setup/component-test.js';
import { readFileSync } from 'node:fs';

/* The web half of the plan's accessibility gate.
 *
 * The four native platforms are audited by hand (VoiceOver, TalkBack, Narrator,
 * Orca) because nothing else can judge a screen-reader experience. The web has
 * axe, so the web half is automated: every registered element is mounted on its
 * own and scanned against WCAG 2.0/2.1/2.2 A and AA.
 *
 * This runs once per `w-os` project, which is the point — a skin must not be
 * able to introduce an accessibility defect. Skins are forbidden from declaring
 * colour or control-size tokens (`tokens:check` enforces it), so contrast and
 * target size ought to be identical in all six. This is the empirical proof of
 * that claim rather than an argument for it.
 */

const AXE = readFileSync(
  new URL('../../website/node_modules/axe-core/axe.min.js', import.meta.url),
  'utf8',
);

const WCAG_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/* Mounted in isolation, so give every element the things an author would:
 * a name, a value, and text content. Without this, axe reports the harness's
 * omissions rather than the framework's. */
const CONFIGURED = ' label="Label" placeholder="Placeholder" title="Title" text="Text"'
  + ' value="1" aria-label="Accessible name" alt="Alt text"';

/* Composition rules cannot be judged one element at a time: `w-command-item`
 * has no `w-command` around it here, and `w-list` has no items in it. Both are
 * exercised in context by the per-component specs, and by the screen-reader
 * passes. Every other WCAG A/AA rule applies to a lone element and is enforced. */
const NEEDS_CONTEXT = new Set(['aria-required-children', 'aria-required-parent']);

/* Accepted violations. This list may only shrink: an entry that stops failing is
 * reported as stale, so a fix forces its removal and the list cannot quietly rot
 * into a permanent exemption.
 *
 * The one entry is a limit of the harness rather than a defect.
 * `w-heatmap-cell` is a fixed-size colour swatch whose documented API takes no
 * children — the reading is carried by its `aria-label`, not by visible text.
 * This harness slots `Body text` into every element uniformly, which puts text
 * on a swatch coloured from author data. No contrast guarantee is possible
 * there: the framework does not choose that background, and CSS cannot yet
 * derive a contrasting foreground from an arbitrary colour. */
const KNOWN = new Set([
  'w-heatmap-cell:color-contrast',
]);

test('every element passes WCAG A/AA in this skin', async ({ page, mount }) => {
  test.setTimeout(180000);

  const tags = await page.evaluate(() => window.__wTags);
  expect(tags.length).toBeGreaterThan(100);
  await page.addScriptTag({ content: AXE });

  const found = new Set();
  const details = [];

  for (const tag of tags) {
    await mount(`<${tag}${CONFIGURED}>Body text</${tag}>`);
    const { violations } = await page.evaluate(
      (tagNames) => window.axe.run('#root', { runOnly: { type: 'tag', values: tagNames } }),
      WCAG_AA,
    );

    for (const violation of violations) {
      if (NEEDS_CONTEXT.has(violation.id)) continue;
      const key = `${tag}:${violation.id}`;
      found.add(key);
      if (!KNOWN.has(key)) details.push(`${key} (${violation.impact}) — ${violation.help}`);
    }
  }

  // New defects fail loudly, with enough detail to act on.
  expect(details, `new accessibility violations:\n${details.join('\n')}`).toEqual([]);

  // Fixed defects must be removed from KNOWN, or the baseline rots.
  const stale = [...KNOWN].filter((key) => !found.has(key)).sort();
  expect(stale, `these no longer fail — delete them from KNOWN:\n${stale.join('\n')}`).toEqual([]);
});
