import { access, readFile } from 'node:fs/promises';
import { expect, test } from '../setup/playwright.js';

const projectFile = (path) => new URL(`../../${path}`, import.meta.url);

const sidebarSource = async () => {
  const source = await readFile(
    projectFile('website/browser/shared/scripts/docs.js'),
    'utf8',
  );
  const sidebarStart = source.indexOf('const HE_DOC_SECTIONS');
  const sidebarEnd = source.indexOf('\n];', sidebarStart) + 3;
  const sidebar = source.slice(sidebarStart, sidebarEnd);
  const start = source.indexOf("type: 'group',\n    title: 'Components',\n    items: [");
  const end = source.indexOf("title: 'Directives'", start);
  return { components: source.slice(start, end), sidebar };
};

test('sidebar items use dedicated documentation routes', async () => {
  const { components, sidebar } = await sidebarSource();
  const items = [...sidebar.matchAll(
    /\{\s*type: 'item',\s*title: '([^']+)'[^}]*path: '([^']+)'/g,
  )].map(([, title, path]) => ({ title, path }));
  const componentItems = [...components.matchAll(
    /\{\s*type: 'item',\s*title: '([^']+)'[^}]*path: '([^']+)'/g,
  )].map(([, title, path]) => ({ title, path }));

  expect(items.filter(({ path }) => path.includes('#'))).toEqual([]);
  expect(Object.fromEntries(componentItems.map(({ title, path }) => [title, path]))).toMatchObject({
    'Bottom sheets': '/docs/bottom-sheets',
    'Icon buttons': '/docs/icon-buttons',
    Sheets: '/docs/sheets',
    Toolbars: '/docs/toolbars',
  });

  for (const { path } of items) {
    await expect(access(projectFile(`website/browser/pages${path}/tac.html`)))
      .resolves.toBeUndefined();
  }
});
