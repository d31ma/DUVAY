import { readFile } from 'node:fs/promises';
import { expect, test } from '../setup/playwright.js';

const projectFile = (path) => new URL(`../../${path}`, import.meta.url);

test('homepage composition dogfoods DuVay components and utilities', async () => {
  const markup = await readFile(projectFile('website/browser/pages/tac.html'), 'utf8');

  expect(markup).not.toContain('landing-');
  expect(markup).toContain('<w-app>');
  expect(markup).toContain('<w-container');
  expect(markup).toContain('<w-row');
  expect(markup).toContain('<w-col');
  expect(markup).toContain('<w-card');
  expect(markup).toContain('<w-btn');
});

test('site header dogfoods the DuVay application and button surfaces', async () => {
  const markup = await readFile(projectFile('website/browser/components/site/header/tac.html'), 'utf8');

  expect(markup).toContain('<w-app-bar');
  expect(markup).toContain('<w-container');
  expect(markup).toContain('<w-btn');
  expect(markup).not.toMatch(/class="[^"]*site-/);
});
