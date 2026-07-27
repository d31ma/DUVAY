import { readdir, readFile } from 'node:fs/promises';
import { expect, test } from '../setup/playwright.js';

const projectFile = (path) => new URL(`../../${path}`, import.meta.url);
const sourceRoots = ['src', 'website/client', 'scripts', 'tests'];
const sourceExtensions = /\.(?:css|html|js|json|md|mjs)$/;
const ignoredDirectories = new Set(['node_modules', 'dist', 'versions']);
const legacyAttributePrefix = `${['data', 'w'].join('-')}-`;
const legacyDatasetAccess = new RegExp(`\\.${['data', 'set'].join('')}\\.w[A-Z]`);

async function sourceFiles(directory) {
  const entries = await readdir(projectFile(directory), { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) {
      if (ignoredDirectories.has(entry.name) || entry.name.includes('conflicted copy')) continue;
      files.push(...await sourceFiles(path));
    } else if (sourceExtensions.test(entry.name)) {
      files.push(path);
    }
  }

  return files;
}

test('DuVay-owned attributes use the w-* prefix', async () => {
  const files = [
    'AGENTS.md',
    'CLAUDE.md',
    'README.md',
    ...await Promise.all(sourceRoots.map(sourceFiles)).then((groups) => groups.flat()),
  ];
  const violations = [];

  for (const file of files) {
    const source = await readFile(projectFile(file), 'utf8');
    if (source.includes(legacyAttributePrefix) || legacyDatasetAccess.test(source)) {
      violations.push(file);
    }
  }

  expect(violations).toEqual([]);
});
