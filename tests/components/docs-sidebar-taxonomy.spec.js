import { readFile } from 'node:fs/promises';
import { expect, test } from '../setup/playwright.js';

const projectFile = (path) => new URL(`../../${path}`, import.meta.url);

/* Vuetify's component taxonomy plus DuVay's own overview entries (Layout
 * primitives, Surfaces, Feedback, Command, Workflows) after API Explorer.
 * "Feedback" appears twice on purpose: once as the overview link, once as the
 * Vuetify group subhead. The old duplicate "Grids" entry and the misplaced
 * "Hotkeys" row were navigation defects, fixed with the docs-index gate. */
const vuetifyComponentTitles = [
  'All Components', 'API Explorer',
  'Layout primitives', 'Surfaces', 'Feedback', 'Command', 'Workflows',
  'Application',
  'Containment', 'Bottom sheets', 'Buttons', 'Icon buttons', 'Cards', 'Chips', 'Command palettes',
  'Dialogs', 'Dividers', 'Expansion panels', 'Lists', 'Menus', 'Overlays',
  'Sheets', 'Toolbars', 'Tooltips',
  'Navigation', 'App bars', 'Bottom navigation', 'Breadcrumbs',
  'Floating Action Buttons', 'Footers', 'Navigation drawers', 'Pagination',
  'Speed Dials', 'System bars', 'Tabs',
  'Form inputs & controls', 'Autocompletes', 'Checkboxes', 'Color inputs',
  'Combobox', 'Date inputs', 'File inputs', 'File upload', 'Forms', 'Mask inputs',
  'Custom inputs', 'Number inputs', 'OTP Input', 'Radio buttons',
  'Range sliders', 'Selects', 'Sliders', 'Switches', 'Text fields', 'Textareas',
  'Data & display', 'Calendars', 'Confirm Edit', 'Data iterators', 'Data tables',
  'Introduction', 'Guide', 'Basics', 'Data and Display', 'Types',
  'Server side tables', 'Virtual tables', 'Heatmaps', 'Highlights', 'Pie charts', 'Sparklines',
  'Infinite scrollers', 'Tables', 'Treeview', 'Virtual scrollers',
  'Grids',
  'Selection', 'Button toggles', 'Carousels', 'Chip groups', 'Item groups',
  'Slide groups', 'Steppers', 'Steppers Vertical', 'Windows',
  'Feedback', 'Alerts', 'Badges', 'Banners', 'Empty states', 'Hover',
  'Progress circular', 'Progress linear', 'Progress', 'Ratings', 'Skeleton loaders',
  'Snackbars', 'Snackbar Queue', 'Timelines',
  'Images & icons', 'Aspect ratios', 'Avatars', 'Avatar groups', 'Icons', 'Images', 'Parallax', 'Videos',
  'Pickers', 'Color pickers', 'Date pickers', 'Date range pickers', 'Month pickers', 'Time pickers',
  'Providers', 'Defaults providers', 'Locale providers', 'Theme providers',
  'Miscellaneous', 'Lazy', 'No SSR', 'Pull To Refresh',
];

test('Components sidebar matches Vuetify labels, groups, and ordering', async () => {
  const source = await readFile(projectFile('website/client/shared/scripts/docs.js'), 'utf8');
  const start = source.indexOf("type: 'group',\n    title: 'Components',\n    items: [");
  const end = source.indexOf("title: 'Directives'", start);
  const components = source.slice(start, end);
  const titles = [...components.matchAll(/\{\s*type: '(?:item|subhead|group)',\s*title: '([^']+)'/g)]
    .map((match) => match[1]);

  expect(titles).toEqual(vuetifyComponentTitles);
  expect(components).toContain("subtitle: 'Browse Components'");
});
