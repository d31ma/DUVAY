import { readFile } from 'node:fs/promises';
import { expect, test } from '../setup/playwright.js';

const projectFile = (path) => new URL(`../../${path}`, import.meta.url);

test('calendar documentation covers every view with CSS and web-component examples', async () => {
  const markup = await readFile(
    projectFile('website/browser/pages/docs/components/calendars/tac.html'),
    'utf8',
  );
  const comparisons = [...markup.matchAll(/<demo-compare>([\s\S]*?)<\/demo-compare>/g)]
    .map((match) => match[1]);

  expect(comparisons.length).toBeGreaterThanOrEqual(8);
  comparisons.forEach((comparison) => {
    expect(comparison).toMatch(/slot="css"/);
    expect(comparison).toMatch(/slot="wc"/);
  });
  ['month', 'week', 'day', '4day', 'custom-weekly', 'custom-daily', 'category'].forEach((type) => {
    expect(markup).toContain(type);
  });
  expect(markup).toContain('<h2>Attributes</h2>');
  expect(markup).toContain('<h2>Events</h2>');
  expect(markup).toContain('<h2>Methods</h2>');
});

test('documentation demo serialization preserves JSON array attributes', async () => {
  const docsScript = await readFile(
    projectFile('website/browser/shared/scripts/docs.js'),
    'utf8',
  );
  const markup = await readFile(
    projectFile('website/browser/pages/docs/components/calendars/tac.html'),
    'utf8',
  );

  expect(docsScript).toContain('function authoredAttribute(attribute)');
  expect(docsScript).toContain(".map(authoredAttribute)");
  expect(markup).toContain('events="[{&quot;name&quot;');
  expect(markup).toContain('categories="[&quot;Design&quot;,&quot;Operations&quot;]"');
});
