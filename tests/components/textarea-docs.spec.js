import { readFile } from 'node:fs/promises';
import { expect, test } from '../setup/playwright.js';

const projectFile = (path) => new URL(`../../${path}`, import.meta.url);

test('textarea variants document CSS and web-component implementations side by side', async () => {
  const markup = await readFile(
    projectFile('website/browser/pages/docs/textareas/tac.html'),
    'utf8',
  );
  const comparisons = [...markup.matchAll(/<demo-compare>([\s\S]*?)<\/demo-compare>/g)]
    .map((match) => match[1]);

  expect(comparisons).toHaveLength(6);
  comparisons.forEach((comparison) => {
    expect(comparison).toMatch(/slot="css"/);
    expect(comparison).toMatch(/slot="wc"/);
  });
});
