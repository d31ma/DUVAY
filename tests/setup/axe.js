import { readFileSync } from 'node:fs';

export class Axe {
  static source = readFileSync(
    new URL('../../website/node_modules/axe-core/axe.min.js', import.meta.url),
    'utf8',
  );

  static wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

  /**
   * @param {import('@playwright/test').Page} page
   * @returns {Promise<void>}
   */
  static async inject(page) {
    await page.addScriptTag({ content: Axe.source });
  }

  /**
   * @param {import('@playwright/test').Page} page
   * @param {string} selector
   * @param {string[]} [rules]
   * @returns {Promise<string[]>}
   */
  static async violations(page, selector, rules = []) {
    return page.evaluate(async ({ context, tags, ruleIds }) => {
      const runOnly = ruleIds.length ? { type: 'rule', values: ruleIds } : { type: 'tag', values: tags };
      const result = await window.axe.run(context, { runOnly });
      return result.violations.flatMap((violation) => violation.nodes.map(
        (node) => `${violation.id} ${node.target.join(' ')}`,
      ));
    }, { context: selector, tags: Axe.wcagTags, ruleIds: rules });
  }
}
