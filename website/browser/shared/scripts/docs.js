/* DuVay docs — progressive enhancement layer.
 *
 * Loaded globally via shared/scripts/imports.js. Re-runs on every SPA
 * navigation (the renderer fires `tachyon:navigate` on window after each
 * route change, including first paint). Every DOM mutation here is
 * idempotent so it survives Tachyon's HTML diffing.
 */

import { API_DATA } from './api-data.js';

/* ── Ordered docs index — single source of truth for prev/next + search ── */
const PAGES = [
  { path: '/docs/introduction', title: 'Introduction',    group: 'Introduction',            keywords: 'intro overview he zero dependency design system css web components vuetify material' },
  { path: '/docs/roadmap',      title: 'Roadmap',         group: 'Introduction',            keywords: 'roadmap future coverage polish stable labs' },
  { path: '/docs/getting-started', title: 'Getting started', group: 'Getting started',       keywords: 'getting started start setup install download cdn npm entry point' },
  { path: '/docs/install',    title: 'Installation',      group: 'Getting started',         keywords: 'install npm cdn download setup import bun' },
  { path: '/docs/download',   title: 'Download',          group: 'Getting started',         keywords: 'download cdn jsdelivr unpkg minified full version head link script npm bundle' },
  { path: '/docs/styles-and-animations', title: 'Styles and animations', group: 'Styles and animations', keywords: 'styles animations motion transition elevation radius typography utility theme css reset' },
  { path: '/docs/animations', title: 'Animations',         group: 'Styles and animations',   keywords: 'animations motion transition expand flip crossfade tween spring vuetify svelte reduced motion' },
  { path: '/docs/themes',     title: 'Themes',            group: 'Styles and animations',   keywords: 'theme dark light auto high contrast tokens colors data-w-theme' },
  { path: '/docs/utilities',  title: 'Utilities',         group: 'Styles and animations',   keywords: 'utility spacing margin padding flex display sizing text elevation shadow radius helpers' },
  { path: '/docs/grid',       title: 'Grid',              group: 'Common concepts',         keywords: 'grid container row column col responsive 12 columns offset gutter flex layout' },
  { path: '/docs/navigation', title: 'Navigation',        group: 'Common concepts',         keywords: 'topbar sidebar tabs breadcrumbs pagination drawer mobile shell' },
  { path: '/docs/breadcrumbs', title: 'Breadcrumbs',      group: 'Components',              keywords: 'breadcrumb navigation path hierarchy' },
  { path: '/docs/components', title: 'Components',        group: 'Components',              keywords: 'components catalog buttons inputs lists tables cards badges avatars dialogs overlays feedback' },
  { path: '/docs/components/explorer', title: 'API Explorer', group: 'Components',           keywords: 'api explorer browse components props events examples' },
  { path: '/docs/components/application', title: 'Application', group: 'Components',         keywords: 'application app shell app bar layout drawer main' },
  { path: '/docs/components/calendars', title: 'Calendars', group: 'Components',             keywords: 'calendar date month week day schedule' },
  { path: '/docs/components/carousels', title: 'Carousels', group: 'Components',             keywords: 'carousel slides image gallery selection' },
  { path: '/docs/windows', title: 'Windows', group: 'Components',                            keywords: 'window panel slide transition crossfade carousel tabs stepper' },
  { path: '/docs/chip-groups', title: 'Chip groups', group: 'Components',                    keywords: 'chip group selection single multiple mandatory filter column max' },
  { path: '/docs/steppers', title: 'Steppers', group: 'Components',                          keywords: 'stepper steps wizard editable non-linear actions window progress' },
  { path: '/docs/vertical-steppers', title: 'Vertical steppers', group: 'Components',        keywords: 'stepper vertical steps wizard accordion inline content' },
  { path: '/docs/components/confirm-edit', title: 'Confirm Edit', group: 'Components',       keywords: 'confirm edit inline save cancel field' },
  { path: '/docs/components/data-iterators', title: 'Data Iterators', group: 'Components',   keywords: 'data iterator cards records pagination' },
  { path: '/docs/components/data-tables/introduction', title: 'Data Tables', group: 'Components', keywords: 'data tables sorting pagination rows columns select expand search filter density' },
  { path: '/docs/components/data-tables/basics', title: 'Data Tables: Basics', group: 'Components', keywords: 'data table basics sorting search pagination page size' },
  { path: '/docs/components/data-tables/data-and-display', title: 'Data Tables: Data and Display', group: 'Components', keywords: 'data table rich headers selection expand density loading no data' },
  { path: '/docs/components/data-tables/server-side-tables', title: 'Server-side Tables', group: 'Components', keywords: 'server side data table pagination remote fetch items-length update options' },
  { path: '/docs/components/data-tables/virtual-tables', title: 'Virtual Tables', group: 'Components', keywords: 'virtual tables virtual scroll rows data table' },
  { path: '/docs/components/defaults-providers', title: 'Defaults Providers', group: 'Components', keywords: 'defaults provider default props configuration' },
  { path: '/docs/components/dividers', title: 'Dividers', group: 'Components',               keywords: 'divider separator line vertical inset' },
  { path: '/docs/components/hover', title: 'Hover', group: 'Components',                     keywords: 'hover activator state surface' },
  { path: '/docs/components/infinite-scroller', title: 'Infinite Scroller', group: 'Components', keywords: 'infinite scroll scroller load more intersection' },
  { path: '/docs/components/item-groups', title: 'Item Groups', group: 'Components',         keywords: 'item group selection mandatory multiple active' },
  { path: '/docs/components/lazy', title: 'Lazy', group: 'Components',                       keywords: 'lazy render mount defer intersection' },
  { path: '/docs/components/locale-providers', title: 'Locale Providers', group: 'Components', keywords: 'locale provider localization language rtl direction fallback' },
  { path: '/docs/components/theme-providers', title: 'Theme Providers', group: 'Components', keywords: 'theme provider dark light auto high contrast scope tokens with-background' },
  { path: '/docs/components/no-ssr', title: 'No SSR', group: 'Components',                   keywords: 'no ssr client only render' },
  { path: '/docs/components/pull-to-refresh', title: 'Pull To Refresh', group: 'Components', keywords: 'pull refresh mobile gesture reload' },
  { path: '/docs/components/slide-groups', title: 'Slide Groups', group: 'Components',       keywords: 'slide group horizontal selection carousel chips' },
  { path: '/docs/components/snackbar-queue', title: 'Snackbar Queue', group: 'Components',   keywords: 'snackbar queue toast notifications stack' },
  { path: '/docs/components/sparklines', title: 'Sparklines', group: 'Components',           keywords: 'sparkline chart trend mini graph' },
  { path: '/docs/components/treeview', title: 'Treeview', group: 'Components',               keywords: 'treeview hierarchy tree nodes collapse expand' },
  { path: '/docs/components/virtual-scroller', title: 'Virtual Scroller', group: 'Components', keywords: 'virtual scroller virtual scroll long list performance' },
  { path: '/docs/buttons',    title: 'Buttons',           group: 'Components',      keywords: 'button btn filled outlined text ghost icon fab variant size loading' },
  { path: '/docs/button-toggles', title: 'Button toggles', group: 'Components',    keywords: 'button toggle btn-toggle btn group segmented selection single multiple mandatory divided' },
  { path: '/docs/inputs',     title: 'Custom inputs',     group: 'Components',      keywords: 'input field input group addon label hint error messages density prefix suffix custom base wrapper' },
  { path: '/docs/autocompletes', title: 'Autocompletes',  group: 'Components',      keywords: 'autocomplete search dropdown filter items multiple chips clearable combobox select' },
  { path: '/docs/checkboxes', title: 'Checkboxes',        group: 'Components',      keywords: 'checkbox checked indeterminate mixed disabled color size validation hint true value false value' },
  { path: '/docs/color-inputs', title: 'Color inputs',    group: 'Components',      keywords: 'color input picker hex rgb hsl swatches mode field' },
  { path: '/docs/combobox',   title: 'Combobox',          group: 'Components',      keywords: 'combobox free text custom value tags delimiters chips multiple autocomplete' },
  { path: '/docs/date-inputs', title: 'Date inputs',      group: 'Components',      keywords: 'date input field native calendar picker value' },
  { path: '/docs/file-inputs', title: 'File inputs',      group: 'Components',      keywords: 'file input upload accept multiple browse attachment' },
  { path: '/docs/file-upload', title: 'File upload',      group: 'Components',      keywords: 'file upload dropzone drag drop accept multiple' },
  { path: '/docs/forms',      title: 'Forms',             group: 'Components',      keywords: 'form submit validation required native constraint validity' },
  { path: '/docs/number-inputs', title: 'Number inputs',  group: 'Components',      keywords: 'number input stepper increment decrement min max step numeric' },
  { path: '/docs/otp-input',  title: 'OTP Input',         group: 'Components',      keywords: 'otp one time passcode code verification pin length input' },
  { path: '/docs/radio-buttons', title: 'Radio buttons',  group: 'Components',      keywords: 'radio group single choice option name value' },
  { path: '/docs/range-sliders', title: 'Range sliders',  group: 'Components',      keywords: 'range slider dual thumb start end min max step value' },
  { path: '/docs/selects',    title: 'Selects',           group: 'Components',      keywords: 'select native select option dropdown choice value' },
  { path: '/docs/switches',   title: 'Switches',          group: 'Components',      keywords: 'switch toggle boolean on off setting' },
  { path: '/docs/text-fields', title: 'Text fields',      group: 'Components',      keywords: 'text field input type email password url tel size state label hint error' },
  { path: '/docs/textareas',  title: 'Textareas',         group: 'Components',      keywords: 'textarea multiline text rows field label hint' },
  { path: '/docs/command',    title: 'Command',           group: 'Components',      keywords: 'command palette cmdk item action search shortcut collapsible shadcn' },
  { path: '/docs/menus',      title: 'Menus',             group: 'Components',      keywords: 'dropdown menu context menu menubar navigation menu actions shadcn' },
  { path: '/docs/overlays',   title: 'Overlay Primitives', group: 'Components',     keywords: 'alert dialog popover hover card sonner toast overlay shadcn' },
  { path: '/docs/layout-primitives', title: 'Layout Primitives', group: 'Components', keywords: 'aspect ratio scroll area resizable sidebar direction chart layout shadcn' },
  { path: '/docs/slider',     title: 'Slider',            group: 'Components',      keywords: 'slider range input track thumb value min max step' },
  { path: '/docs/chips',      title: 'Chips',             group: 'Components',      keywords: 'chip filter pill tag selectable size' },
  { path: '/docs/lists',      title: 'Lists',             group: 'Components',      keywords: 'list item nav density lines active selectable avatar icon action tree treeview hierarchy expand collapse' },
  { path: '/docs/tables',     title: 'Tables',            group: 'Components',      keywords: 'table data rows columns dense striped hover fixed header' },
  { path: '/docs/surfaces',   title: 'Surfaces',          group: 'Components',      keywords: 'surface toolbar app bar system bar banner divider fab sheet footer' },
  { path: '/docs/system-bars', title: 'System Bars',      group: 'Components',      keywords: 'system bar status bar window elevation color height absolute rounded' },
  { path: '/docs/footers',    title: 'Footers',           group: 'Components',      keywords: 'footer app border elevation color height rounded' },
  { path: '/docs/app-bars',   title: 'App bars',          group: 'Components',      keywords: 'app bar toolbar header density prominent extended flat elevation scroll behavior collapse image location sticky' },
  { path: '/docs/bottom-navigation', title: 'Bottom navigation', group: 'Components', keywords: 'bottom navigation mobile bar tabs active grow shift mode color elevation' },
  { path: '/docs/navigation-drawers', title: 'Navigation drawers', group: 'Components', keywords: 'navigation drawer sidebar rail permanent temporary expand on hover floating scrim width' },
  { path: '/docs/floating-action-buttons', title: 'Floating Action Buttons', group: 'Components', keywords: 'fab floating action button extended location absolute variant rounded size color icon' },
  { path: '/docs/speed-dials', title: 'Speed Dials',     group: 'Components',      keywords: 'speed dial fab menu actions location open on hover transition fan' },
  { path: '/docs/paginations', title: 'Pagination',       group: 'Components',      keywords: 'pagination pages total visible ellipsis first last prev next variant size rounded color' },
  { path: '/docs/workflows',  title: 'Workflows',         group: 'Components',      keywords: 'stepper timeline process workflow steps history activity' },
  { path: '/docs/color-pickers', title: 'Color Pickers',  group: 'Components',      keywords: 'color picker hex rgb hsl swatch palette preview canvas' },
  { path: '/docs/date-pickers',  title: 'Date Pickers',   group: 'Components',      keywords: 'date picker calendar month year day week range min max grid' },
  { path: '/docs/time-pickers',  title: 'Time Pickers',   group: 'Components',      keywords: 'time picker hour minute clock 24 hour field' },
  { path: '/docs/ratings',    title: 'Ratings',           group: 'Components',      keywords: 'rating stars score review length readonly' },
  { path: '/docs/cards',      title: 'Cards',             group: 'Components',      keywords: 'card header body footer panel surface' },
  { path: '/docs/badges',     title: 'Badges',            group: 'Components',      keywords: 'badge status pill label count notification' },
  { path: '/docs/avatars',    title: 'Avatars',           group: 'Components',      keywords: 'avatar initials image user presence status' },
  { path: '/docs/aspect-ratios', title: 'Aspect ratios',  group: 'Components',      keywords: 'aspect ratio responsive media 16 9 4 3 square video embed' },
  { path: '/docs/icons',      title: 'Icons',             group: 'Components',      keywords: 'icon glyph size color disabled start end opacity svg font ligature' },
  { path: '/docs/images',     title: 'Images',            group: 'Components',      keywords: 'image img picture cover gradient lazy placeholder srcset aspect ratio' },
  { path: '/docs/parallax',   title: 'Parallax',          group: 'Components',      keywords: 'parallax scroll banner hero background scale image' },
  { path: '/docs/alerts',     title: 'Alerts',            group: 'Components',      keywords: 'alert info success warning error banner dismiss' },
  { path: '/docs/tooltips',   title: 'Tooltips',          group: 'Components',      keywords: 'tooltip hover hint popover' },
  { path: '/docs/tabs',       title: 'Tabs',              group: 'Components',      keywords: 'tabs tab tablist segmented' },
  { path: '/docs/expand',     title: 'Expansion Panels',  group: 'Components',      keywords: 'expand accordion collapse panel disclosure' },
  { path: '/docs/feedback',   title: 'Feedback',          group: 'Components',      keywords: 'skeleton progress empty toast loading' },
  { path: '/docs/banners',    title: 'Banners',           group: 'Components',      keywords: 'banner message surface icon avatar lines sticky actions prominent' },
  { path: '/docs/empty-states', title: 'Empty states',    group: 'Components',      keywords: 'empty state placeholder headline icon image action no data nothing 404' },
  { path: '/docs/progress-linear', title: 'Progress linear', group: 'Components',   keywords: 'progress linear bar buffer indeterminate stream striped reverse loading' },
  { path: '/docs/progress-circular', title: 'Progress circular', group: 'Components', keywords: 'progress circular ring spinner indeterminate size width loading' },
  { path: '/docs/skeleton-loaders', title: 'Skeleton loaders', group: 'Components', keywords: 'skeleton loader placeholder shimmer bone type card list-item article loading' },
  { path: '/docs/timelines',  title: 'Timelines',         group: 'Components',      keywords: 'timeline item dot line history activity events alternating' },
  { path: '/docs/snackbar',   title: 'Snackbar',          group: 'Components',      keywords: 'snackbar toast notification action undo' },
  { path: '/docs/dialog',     title: 'Dialog & Overlay',  group: 'Components',      keywords: 'dialog modal overlay sheet bottom drawer' },
  { path: '/docs/directives/click-outside', title: 'Click Outside', group: 'Directives', keywords: 'click outside dismiss close dropdown menu dialog pointerdown' },
  { path: '/docs/directives/intersect', title: 'Intersect', group: 'Directives', keywords: 'intersect intersectionobserver lazy visible viewport' },
  { path: '/docs/directives/mutate', title: 'Mutate', group: 'Directives', keywords: 'mutate mutationobserver dom changes children' },
  { path: '/docs/directives/resize', title: 'Resize', group: 'Directives', keywords: 'resize resizeobserver size element' },
  { path: '/docs/directives/ripple', title: 'Ripple', group: 'Directives', keywords: 'ripple press feedback active focus css' },
  { path: '/docs/directives/scroll', title: 'Scroll', group: 'Directives', keywords: 'scroll sticky app bar pull to refresh scroll area' },
  { path: '/docs/directives/tooltip', title: 'Tooltip (directive)', group: 'Directives', keywords: 'tooltip w-tooltip hint hover' },
  { path: '/docs/directives/touch', title: 'Touch', group: 'Directives', keywords: 'touch pointer events swipe gesture' },
  { path: '/docs/frequently-asked-questions', title: 'Frequently asked questions', group: 'Getting started', keywords: 'faq questions zero dependency theme web component framework agnostic' },
  { path: '/docs/browser-support', title: 'Browser support', group: 'Getting started', keywords: 'browser support compatibility custom elements evergreen chrome firefox safari' },
  { path: '/docs/contributing', title: 'Contributing', group: 'Getting started', keywords: 'contributing build test conventions tokens pull request repo' },
  { path: '/docs/density-and-sizing', title: 'Density and sizing', group: 'Common concepts', keywords: 'density comfortable compact prominent size scale x-small x-large' },
  { path: '/docs/items', title: 'Items', group: 'Common concepts', keywords: 'items item group selection mandatory multiple' },
  { path: '/docs/variants', title: 'Variants', group: 'Common concepts', keywords: 'variant elevated flat tonal outlined text plain emphasis' },
  { path: '/docs/routing', title: 'Routing', group: 'Common concepts', keywords: 'routing router href link navigation breadcrumb tab list item button card chip' },
  { path: '/docs/v-model', title: 'v-model', group: 'Common concepts', keywords: 'v-model model-value value binding controlled uncontrolled two-way update event' },
  { path: '/docs/styles/entry-points', title: 'Entry points', group: 'Styles', keywords: 'styles entry points imports bundle css' },
  { path: '/docs/styles/css-reset', title: 'CSS Reset', group: 'Styles', keywords: 'css reset normalize base preflight' },
  { path: '/docs/styles/layers', title: 'Layers', group: 'Styles', keywords: 'css layers cascade order' },
  { path: '/docs/styles/transitions', title: 'Transitions', group: 'Styles', keywords: 'transitions motion duration ease tokens reduced motion' },
  { path: '/docs/styles/colors', title: 'Colors', group: 'Styles', keywords: 'colors palette tokens primary surface theme' },
  { path: '/docs/styles/borders', title: 'Borders', group: 'Styles', keywords: 'border divider utility classes' },
  { path: '/docs/styles/border-radius', title: 'Border radius', group: 'Styles', keywords: 'border radius rounded pill circle tile' },
  { path: '/docs/styles/content', title: 'Content', group: 'Styles', keywords: 'content truncate line clamp text' },
  { path: '/docs/styles/cursor', title: 'Cursor', group: 'Styles', keywords: 'cursor pointer default select none' },
  { path: '/docs/styles/display', title: 'Display', group: 'Styles', keywords: 'display block inline flex grid hidden responsive' },
  { path: '/docs/styles/elevation', title: 'Elevation', group: 'Styles', keywords: 'elevation shadow depth' },
  { path: '/docs/styles/flex', title: 'Flex', group: 'Styles', keywords: 'flex flexbox row column wrap gap align justify' },
  { path: '/docs/styles/float', title: 'Float', group: 'Styles', keywords: 'float clear alternatives flex' },
  { path: '/docs/styles/opacity', title: 'Opacity', group: 'Styles', keywords: 'opacity transparency' },
  { path: '/docs/styles/overflow', title: 'Overflow', group: 'Styles', keywords: 'overflow auto hidden scroll scrollbar' },
  { path: '/docs/styles/position', title: 'Position', group: 'Styles', keywords: 'position static relative absolute fixed sticky inset' },
  { path: '/docs/styles/sizing', title: 'Sizing', group: 'Styles', keywords: 'sizing width height min max full' },
  { path: '/docs/styles/spacing', title: 'Spacing', group: 'Styles', keywords: 'spacing margin padding gap scale' },
  { path: '/docs/styles/text-and-typography', title: 'Text and typography', group: 'Styles', keywords: 'text typography font weight size wrap truncate color' },
  { path: '/docs/about',      title: 'About',             group: 'About',           keywords: 'about project principles vuetify relationship zero dependency html first light dom' },
];

const REPO = 'https://github.com/d31ma/duvay';
const BRANCH = 'main';

/* ── Docs sidebar ─────────────────────────────────────────────────────────
 * The Components group mirrors Vuetify's live sidebar taxonomy. Items without
 * a dedicated DuVay page link to the closest existing component section. */
const HE_DOC_SECTIONS = [
  {
    type: 'group',
    title: 'Introduction',
    items: [
      { type: 'item', title: 'Introduction', path: '/docs/introduction' },
      { type: 'item', title: 'Roadmap', path: '/docs/roadmap' },
    ]
  },
  {
    type: 'group',
    title: 'Getting started',
    items: [
      { type: 'item', title: 'Installation', path: '/docs/install' },
      { type: 'item', title: 'Getting started', path: '/docs/getting-started' },
      { type: 'item', title: 'Download', path: '/docs/download' },
      { type: 'item', title: 'Frequently asked questions', path: '/docs/frequently-asked-questions' },
      { type: 'item', title: 'Browser support', path: '/docs/browser-support' },
      { type: 'item', title: 'Contributing', path: '/docs/contributing' },
    ]
  },
  {
    type: 'group',
    title: 'Features',
    items: [
      { type: 'item', title: 'Accessibility', path: '/docs/features/accessibility' },
      { type: 'item', title: 'Application layout', path: '/docs/features/application-layout' },
      { type: 'item', title: 'CSS utilities', path: '/docs/features/css-utilities' },
      { type: 'item', title: 'Display and platform', path: '/docs/features/display-and-platform' },
      { type: 'item', title: 'Hotkey', path: '/docs/features/hotkey' },
      { type: 'item', title: 'Icon Fonts', path: '/docs/features/icon-fonts' },
      { type: 'item', title: 'Theme', path: '/docs/themes' },
    ]
  },
  {
    type: 'group',
    title: 'Styles',
    items: [
      { type: 'item', title: 'Entry points', path: '/docs/styles/entry-points' },
      { type: 'item', title: 'CSS Reset', path: '/docs/styles/css-reset' },
      { type: 'item', title: 'Layers', path: '/docs/styles/layers' },
      { type: 'item', title: 'Transitions', path: '/docs/styles/transitions' },
      { type: 'item', title: 'Colors', path: '/docs/styles/colors' },
      { type: 'subhead', title: 'Utility classes' },
      { type: 'item', title: 'Borders', path: '/docs/styles/borders' },
      { type: 'item', title: 'Border radius', path: '/docs/styles/border-radius' },
      { type: 'item', title: 'Content', path: '/docs/styles/content' },
      { type: 'item', title: 'Cursor', path: '/docs/styles/cursor' },
      { type: 'item', title: 'Display', path: '/docs/styles/display' },
      { type: 'item', title: 'Elevation', path: '/docs/styles/elevation' },
      { type: 'item', title: 'Flex', path: '/docs/styles/flex' },
      { type: 'item', title: 'Float', path: '/docs/styles/float' },
      { type: 'item', title: 'Opacity', path: '/docs/styles/opacity' },
      { type: 'item', title: 'Overflow', path: '/docs/styles/overflow' },
      { type: 'item', title: 'Position', path: '/docs/styles/position' },
      { type: 'item', title: 'Sizing', path: '/docs/styles/sizing' },
      { type: 'item', title: 'Spacing', path: '/docs/styles/spacing' },
      { type: 'item', title: 'Text and typography', path: '/docs/styles/text-and-typography' },
    ]
  },
  {
    type: 'group',
    title: 'Common concepts',
    items: [
      { type: 'item', title: 'Density and sizing', path: '/docs/density-and-sizing' },
      { type: 'item', title: 'Items', path: '/docs/items' },
      { type: 'item', title: 'Routing', path: '/docs/routing' },
      { type: 'item', title: 'v-model', path: '/docs/v-model' },
      { type: 'item', title: 'Variants', path: '/docs/variants' },
      { type: 'item', title: 'Grid', path: '/docs/grid' },
      { type: 'item', title: 'Navigation', path: '/docs/navigation' },
    ]
  },
  {
    type: 'group',
    title: 'Components',
    items: [
      { type: 'item', title: 'All Components', path: '/docs/components' },
      { type: 'item', title: 'API Explorer', subtitle: 'Browse Components', path: '/docs/components/explorer' },
      { type: 'item', title: 'Application', path: '/docs/components/application' },
      { type: 'separator' },
      { type: 'subhead', title: 'Containment' },
      { type: 'item', title: 'Bottom sheets', path: '/docs/dialog#sheet' },
      { type: 'item', title: 'Buttons', path: '/docs/buttons' },
      { type: 'item', title: 'Icon buttons', path: '/docs/features/icon-fonts#icon-buttons' },
      { type: 'item', title: 'Cards', path: '/docs/cards' },
      { type: 'item', title: 'Chips', path: '/docs/chips' },
      { type: 'item', title: 'Dialogs', path: '/docs/dialog' },
      { type: 'item', title: 'Dividers', path: '/docs/components/dividers' },
      { type: 'item', title: 'Expansion panels', path: '/docs/expand' },
      { type: 'item', title: 'Lists', path: '/docs/lists' },
      { type: 'item', title: 'Menus', path: '/docs/menus' },
      { type: 'item', title: 'Overlays', path: '/docs/overlays' },
      { type: 'item', title: 'Sheets', path: '/docs/dialog#sheet' },
      { type: 'item', title: 'Toolbars', path: '/docs/surfaces#toolbar-and-system-bar' },
      { type: 'item', title: 'Tooltips', path: '/docs/tooltips' },
      { type: 'separator' },
      { type: 'subhead', title: 'Navigation' },
      { type: 'item', title: 'App bars', path: '/docs/app-bars' },
      { type: 'item', title: 'Bottom navigation', path: '/docs/bottom-navigation' },
      { type: 'item', title: 'Breadcrumbs', path: '/docs/breadcrumbs' },
      { type: 'item', title: 'Floating Action Buttons', path: '/docs/floating-action-buttons' },
      { type: 'item', title: 'Footers', path: '/docs/footers' },
      { type: 'item', title: 'Navigation drawers', path: '/docs/navigation-drawers' },
      { type: 'item', title: 'Pagination', path: '/docs/paginations' },
      { type: 'item', title: 'Speed Dials', path: '/docs/speed-dials' },
      { type: 'item', title: 'System bars', path: '/docs/system-bars' },
      { type: 'item', title: 'Tabs', path: '/docs/tabs' },
      { type: 'separator' },
      { type: 'subhead', title: 'Form inputs & controls' },
      { type: 'item', title: 'Autocompletes', path: '/docs/autocompletes' },
      { type: 'item', title: 'Checkboxes', path: '/docs/checkboxes' },
      { type: 'item', title: 'Color inputs', path: '/docs/color-inputs' },
      { type: 'item', title: 'Combobox', path: '/docs/combobox' },
      { type: 'item', title: 'Date inputs', path: '/docs/date-inputs' },
      { type: 'item', title: 'File inputs', path: '/docs/file-inputs' },
      { type: 'item', title: 'File upload', path: '/docs/file-upload' },
      { type: 'item', title: 'Forms', path: '/docs/forms' },
      { type: 'item', title: 'Custom inputs', path: '/docs/inputs' },
      { type: 'item', title: 'Number inputs', path: '/docs/number-inputs' },
      { type: 'item', title: 'OTP Input', path: '/docs/otp-input' },
      { type: 'item', title: 'Radio buttons', path: '/docs/radio-buttons' },
      { type: 'item', title: 'Range sliders', path: '/docs/range-sliders' },
      { type: 'item', title: 'Selects', path: '/docs/selects' },
      { type: 'item', title: 'Sliders', path: '/docs/slider' },
      { type: 'item', title: 'Switches', path: '/docs/switches' },
      { type: 'item', title: 'Text fields', path: '/docs/text-fields' },
      { type: 'item', title: 'Textareas', path: '/docs/textareas' },
      { type: 'separator' },
      { type: 'subhead', title: 'Data & display' },
      { type: 'item', title: 'Calendars', path: '/docs/components/calendars' },
      { type: 'item', title: 'Confirm Edit', path: '/docs/components/confirm-edit' },
      { type: 'item', title: 'Data iterators', path: '/docs/components/data-iterators' },
      {
        type: 'group',
        title: 'Data tables',
        items: [
          { type: 'item', title: 'Introduction', path: '/docs/components/data-tables/introduction' },
          { type: 'subhead', title: 'Guide' },
          { type: 'item', title: 'Basics', path: '/docs/components/data-tables/basics' },
          { type: 'item', title: 'Data and Display', path: '/docs/components/data-tables/data-and-display' },
          { type: 'subhead', title: 'Types' },
          { type: 'item', title: 'Server side tables', path: '/docs/components/data-tables/server-side-tables' },
          { type: 'item', title: 'Virtual tables', path: '/docs/components/data-tables/virtual-tables' },
        ]
      },
      { type: 'item', title: 'Hotkeys', path: '/docs/features/hotkey' },
      { type: 'item', title: 'Sparklines', path: '/docs/components/sparklines' },
      { type: 'item', title: 'Infinite scrollers', path: '/docs/components/infinite-scroller' },
      { type: 'item', title: 'Tables', path: '/docs/tables' },
      { type: 'item', title: 'Treeview', path: '/docs/components/treeview' },
      { type: 'item', title: 'Virtual scrollers', path: '/docs/components/virtual-scroller' },
      { type: 'separator' },
      { type: 'subhead', title: 'Grids' },
      { type: 'item', title: 'Grids', path: '/docs/grid' },
      { type: 'separator' },
      { type: 'subhead', title: 'Selection' },
      { type: 'item', title: 'Button toggles', path: '/docs/button-toggles' },
      { type: 'item', title: 'Carousels', path: '/docs/components/carousels' },
      { type: 'item', title: 'Chip groups', path: '/docs/chip-groups' },
      { type: 'item', title: 'Item groups', path: '/docs/components/item-groups' },
      { type: 'item', title: 'Slide groups', path: '/docs/components/slide-groups' },
      { type: 'item', title: 'Steppers', path: '/docs/steppers' },
      { type: 'item', title: 'Steppers Vertical', path: '/docs/vertical-steppers' },
      { type: 'item', title: 'Windows', path: '/docs/windows' },
      { type: 'separator' },
      { type: 'subhead', title: 'Feedback' },
      { type: 'item', title: 'Alerts', path: '/docs/alerts' },
      { type: 'item', title: 'Badges', path: '/docs/badges' },
      { type: 'item', title: 'Banners', path: '/docs/banners' },
      { type: 'item', title: 'Empty states', path: '/docs/empty-states' },
      { type: 'item', title: 'Hover', path: '/docs/components/hover' },
      { type: 'item', title: 'Progress circular', path: '/docs/progress-circular' },
      { type: 'item', title: 'Progress linear', path: '/docs/progress-linear' },
      { type: 'item', title: 'Ratings', path: '/docs/ratings' },
      { type: 'item', title: 'Skeleton loaders', path: '/docs/skeleton-loaders' },
      { type: 'item', title: 'Snackbars', path: '/docs/snackbar' },
      { type: 'item', title: 'Snackbar Queue', path: '/docs/components/snackbar-queue' },
      { type: 'item', title: 'Timelines', path: '/docs/timelines' },
      { type: 'separator' },
      { type: 'subhead', title: 'Images & icons' },
      { type: 'item', title: 'Aspect ratios', path: '/docs/aspect-ratios' },
      { type: 'item', title: 'Avatars', path: '/docs/avatars' },
      { type: 'item', title: 'Icons', path: '/docs/icons' },
      { type: 'item', title: 'Images', path: '/docs/images' },
      { type: 'item', title: 'Parallax', path: '/docs/parallax' },
      { type: 'separator' },
      { type: 'subhead', title: 'Pickers' },
      { type: 'item', title: 'Color pickers', path: '/docs/color-pickers' },
      { type: 'item', title: 'Date pickers', path: '/docs/date-pickers' },
      { type: 'item', title: 'Time pickers', path: '/docs/time-pickers' },
      { type: 'separator' },
      { type: 'subhead', title: 'Providers' },
      { type: 'item', title: 'Defaults providers', path: '/docs/components/defaults-providers' },
      { type: 'item', title: 'Locale providers', path: '/docs/components/locale-providers' },
      { type: 'item', title: 'Theme providers', path: '/docs/components/theme-providers' },
      { type: 'separator' },
      { type: 'subhead', title: 'Miscellaneous' },
      { type: 'item', title: 'Lazy', path: '/docs/components/lazy' },
      { type: 'item', title: 'No SSR', path: '/docs/components/no-ssr' },
      { type: 'item', title: 'Pull To Refresh', path: '/docs/components/pull-to-refresh' },
    ]
  },
  {
    type: 'group',
    title: 'Directives',
    items: [
      { type: 'item', title: 'Click Outside', path: '/docs/directives/click-outside' },
      { type: 'item', title: 'Intersect', path: '/docs/directives/intersect' },
      { type: 'item', title: 'Mutate', path: '/docs/directives/mutate' },
      { type: 'item', title: 'Resize', path: '/docs/directives/resize' },
      { type: 'item', title: 'Ripple', path: '/docs/directives/ripple' },
      { type: 'item', title: 'Scroll', path: '/docs/directives/scroll' },
      { type: 'item', title: 'Tooltip', path: '/docs/directives/tooltip' },
      { type: 'item', title: 'Touch', path: '/docs/directives/touch' },
    ]
  },
  {
    type: 'group',
    title: 'About',
    items: [
      { type: 'item', title: 'About DuVay', path: '/docs/about' },
    ]
  },
];

/* ── Small helpers ──────────────────────────────────────────────────────── */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function slugify(text) {
  return String(text).toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function currentPath() {
  return (location.pathname.replace(/\/+$/, '') || '/');
}

function navigate(path) {
  if (window.Tac && typeof window.Tac.navigate === 'function') window.Tac.navigate(path);
  else location.href = path;
}

function syncDocumentTitle() {
  const path = currentPath();
  const page = PAGES.find(p => p.path === path);
  if (page) {
    document.title = `${page.title} — DuVay Documentation`;
  } else if (path === '/docs' || path.indexOf('/docs/') === 0) {
    document.title = 'DuVay Documentation';
  }
}

/* ── Sidebar taxonomy ───────────────────────────────────────────────────── */
function sidebarItemHtml(item, depth) {
  if (item.type === 'separator') return '<li class="docs-sidebar-separator" aria-hidden="true"></li>';
  if (item.type === 'subhead') {
    return `<li class="docs-sidebar-subhead">${escapeHtml(item.title)}</li>`;
  }
  if (item.type === 'group') {
    const key = slugify(item.title);
    const children = (item.items || []).map(child => sidebarItemHtml(child, depth + 1)).join('');
    return `<li class="docs-sidebar-subgroup docs-sidebar-collapsible" data-docs-sidebar-key="${key}">
      <button class="docs-sidebar-subgroup-title" type="button">
        <span>${escapeHtml(item.title)}</span>
      </button>
      <ul class="docs-sidebar-sublist">${children}</ul>
    </li>`;
  }

  const subtitle = item.subtitle ? `<span class="docs-sidebar-note">${escapeHtml(item.subtitle)}</span>` : '';
  const source = item.sourceTitle && item.sourceTitle !== item.title
    ? ` data-vuetify-label="${escapeHtml(item.sourceTitle)}"`
    : '';
  return `<li><a href="${item.path}"${source}>${escapeHtml(item.title)}${subtitle}</a></li>`;
}

function renderDocsSidebar() {
  const sidebar = $('[data-docs-sidebar]');
  if (!sidebar || sidebar.dataset.wTaxonomyRendered) return;

  sidebar.innerHTML = `<div class="docs-sidebar-mobile-header">
      <strong>Documentation</strong>
      <button type="button" data-w-docs-menu-close aria-label="Close documentation navigation">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
      </button>
    </div>` + HE_DOC_SECTIONS.map(section => {
    const key = slugify(section.title);
    const items = (section.items || []).map(item => sidebarItemHtml(item, 0)).join('');
    return `<div class="docs-sidebar-section docs-sidebar-collapsible" data-docs-sidebar-key="${key}">
      <button class="docs-sidebar-title" type="button">${escapeHtml(section.title)}</button>
      <ul class="docs-sidebar-list">${items}</ul>
    </div>`;
  }).join('');
  sidebar.dataset.wTaxonomyRendered = '1';
}

/* ── Theme ──────────────────────────────────────────────────────────────── */
const THEMES = ['light', 'dark', 'auto', 'high-contrast'];
const THEME_LABEL = { light: 'Light', dark: 'Dark', auto: 'Auto', 'high-contrast': 'Contrast' };
const THEME_KEY = 'w-theme';
const SIDEBAR_KEY = 'w-docs-sidebar-open-vuetify-1';
const DOCS_COMPACT_QUERY = '(max-width: 1024px)';
const THEME_ICON = {
  light: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  dark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  auto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="9"/><path d="M12 3v18" fill="currentColor"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none"/></svg>',
  'high-contrast': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none"/></svg>',
};

function getTheme() {
  try { return localStorage.getItem(THEME_KEY) || 'light'; } catch (_) { return 'light'; }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-w-theme', theme);
  try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
  syncThemeControls(theme);
}

function cycleTheme() {
  const i = THEMES.indexOf(getTheme());
  applyTheme(THEMES[(i + 1) % THEMES.length]);
}

function syncThemeControls(theme) {
  $$('[data-w-theme-icon]').forEach(el => { el.innerHTML = THEME_ICON[theme] || THEME_ICON.light; });
  $$('[data-w-theme-label]').forEach(el => { el.textContent = THEME_LABEL[theme] || 'Light'; });
}

/* ── Active navigation ──────────────────────────────────────────────────── */
function markActiveNav() {
  const path = currentPath();
  const links = $$('.docs-sidebar-list a, .docs-sidebar-sublist a, [data-site-nav] a');

  // Clear existing markers first so only the current page is highlighted.
  links.forEach(a => a.removeAttribute('aria-current'));

  // Prefer an exact path match; fall back to the longest prefix match so
  // /docs/buttons wins over /docs.
  const candidates = links
    .map(a => {
      const href = a.getAttribute('href');
      if (!href || /^https?:/.test(href)) return null;
      const norm = href.replace(/\/+$/, '') || '/';
      if (norm === path) return { a, score: Infinity };
      if (path !== '/' && norm !== '/' && path.startsWith(norm + '/')) {
        return { a, score: norm.length };
      }
      return null;
    })
    .filter(Boolean);

  if (candidates.length) {
    candidates.sort((x, y) => y.score - x.score);
    candidates[0].a.setAttribute('aria-current', 'page');
  }
}

function readOpenSidebarSections() {
  try {
    const value = JSON.parse(localStorage.getItem(SIDEBAR_KEY) || '[]');
    return new Set(Array.isArray(value) ? value : []);
  } catch (_) {
    return new Set();
  }
}

function writeOpenSidebarSections(set) {
  try {
    localStorage.setItem(SIDEBAR_KEY, JSON.stringify([...set]));
  } catch (_) {}
}

function sidebarSectionKey(section, title) {
  if (!section.dataset.docsSidebarKey) {
    section.dataset.docsSidebarKey = slugify(title.textContent || '');
  }
  return section.dataset.docsSidebarKey;
}

function sidebarToggle(section) {
  return [...section.children].find(el =>
    el.matches('.docs-sidebar-title, .docs-sidebar-subgroup-title')
  );
}

function sidebarPanel(section) {
  return [...section.children].find(el =>
    el.matches('.docs-sidebar-list, .docs-sidebar-sublist')
  );
}

function setSidebarSectionCollapsed(section, collapsed, persist) {
  const title = sidebarToggle(section);
  const list = sidebarPanel(section);
  if (!title || !list) return;

  const key = sidebarSectionKey(section, title);
  section.classList.toggle('is-collapsed', collapsed);
  list.hidden = collapsed;
  title.setAttribute('aria-expanded', String(!collapsed));

  if (!persist) return;
  const openSections = readOpenSidebarSections();
  if (collapsed) openSections.delete(key);
  else openSections.add(key);
  writeOpenSidebarSections(openSections);
}

function enhanceSidebarSections() {
  const openSections = readOpenSidebarSections();
  $$('.docs-sidebar-collapsible').forEach(section => {
    const title = sidebarToggle(section);
    const list = sidebarPanel(section);
    if (!title || !list) return;

    const key = sidebarSectionKey(section, title);
    if (!list.id) list.id = `docs-sidebar-${key}`;
    title.setAttribute('aria-controls', list.id);

    if (!title.dataset.wSidebarBound) {
      title.dataset.wSidebarBound = '1';
      title.addEventListener('click', () => {
        setSidebarSectionCollapsed(section, !section.classList.contains('is-collapsed'), true);
      });
    }

    const hasActivePage = !!list.querySelector('a[aria-current="page"]');
    setSidebarSectionCollapsed(section, !hasActivePage && !openSections.has(key), false);
  });
}

/* ── Responsive docs navigation ────────────────────────────────────────── */
function docsCompactMedia() {
  return window.matchMedia(DOCS_COMPACT_QUERY);
}

function setDocsNavigationOpen(open, returnFocus = false) {
  const sidebar = $('[data-docs-sidebar]');
  const toggle = $('[data-w-docs-menu-toggle]');
  const scrim = $('.docs-sidebar-scrim');
  if (!sidebar || !toggle || !scrim) return;

  const compact = docsCompactMedia().matches;
  const nextOpen = compact && open;
  sidebar.classList.toggle('is-open', nextOpen);
  sidebar.setAttribute('aria-hidden', String(compact && !nextOpen));
  if ('inert' in sidebar) sidebar.inert = compact && !nextOpen;

  toggle.hidden = !compact;
  toggle.setAttribute('aria-expanded', String(nextOpen));
  toggle.setAttribute('aria-label', nextOpen ? 'Close documentation navigation' : 'Open documentation navigation');
  scrim.hidden = !nextOpen;
  document.documentElement.classList.toggle('docs-nav-open', nextOpen);

  if (nextOpen) {
    requestAnimationFrame(() => $('[data-w-docs-menu-close]', sidebar)?.focus());
  } else if (returnFocus) {
    toggle.focus();
  }
}

function enhanceResponsiveNavigation() {
  setDocsNavigationOpen(false);
}

/* ── Code copy buttons ──────────────────────────────────────────────────── */
const COPY_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

function enhanceCopyButtons() {
  $$('.code-block').forEach(block => {
    if (block.querySelector('.code-copy')) return;
    if (getComputedStyle(block).position === 'static') block.style.position = 'relative';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'code-copy';
    btn.setAttribute('aria-label', 'Copy code');
    btn.innerHTML = COPY_ICON;
    block.appendChild(btn);
  });
}

async function copyFrom(block) {
  const code = block.querySelector('code') || block;
  const text = code.innerText.replace(/\s+$/, '');
  try {
    await navigator.clipboard.writeText(text);
  } catch (_) {
    const r = document.createRange(); r.selectNodeContents(code);
    const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
    try { document.execCommand('copy'); } catch (_) {}
    sel.removeAllRanges();
  }
  const btn = block.querySelector('.code-copy');
  if (btn) {
    btn.classList.add('copied');
    setTimeout(() => btn.classList.remove('copied'), 1400);
  }
}

/* ── On-this-page table of contents + scrollspy ─────────────────────────── */
let spy = null;

function buildTOC() {
  const toc = $('[data-w-toc]');
  const page = $('[data-w-page]') || $('.docs-main');
  if (!toc || !page) return;

  const heads = $$('h2, h3', page);
  if (heads.length < 2) { toc.innerHTML = ''; toc.hidden = true; return; }
  toc.hidden = false;

  const items = heads.map(h => {
    if (!h.id) h.id = slugify(h.textContent);
    const lvl = h.tagName.toLowerCase();
    return `<li class="docs-toc-item docs-toc-${lvl}"><a href="#${h.id}" data-w-toc-link>${escapeHtml(h.textContent)}</a></li>`;
  }).join('');
  toc.innerHTML = `<p class="docs-toc-title">On this page</p><ul class="docs-toc-list">${items}</ul>`;

  if (spy) spy.disconnect();
  const links = new Map(heads.map(h => [h.id, toc.querySelector(`a[href="#${CSS.escape(h.id)}"]`)]));
  spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a && a.classList.remove('active'));
      const a = links.get(e.target.id);
      if (a) a.classList.add('active');
    });
  }, { rootMargin: '0px 0px -75% 0px', threshold: 0 });
  heads.forEach(h => spy.observe(h));
}

/* ── Prev / next pager ──────────────────────────────────────────────────── */
function pagerLink(rel, page) {
  const label = rel === 'prev' ? 'Previous' : 'Next';
  return `<a class="docs-pager-link docs-pager-${rel}" href="${page.path}">
    <span class="docs-pager-rel">${label}</span>
    <span class="docs-pager-title">${escapeHtml(page.title)}</span>
  </a>`;
}

/* Prev/next order follows the sidebar (HE_DOC_SECTIONS) so the pager always
 * matches the visible nav. Flattened in document order, hash anchors stripped,
 * duplicates dropped (first wins). Titles come from PAGES when available, else
 * the sidebar item's own label. Computed once — the taxonomy is static. */
let PAGER_PAGES;
function pagerPages() {
  if (PAGER_PAGES) return PAGER_PAGES;
  const out = [], seen = new Set();
  const walk = items => items.forEach(it => {
    if (it.items) walk(it.items);
    if (it.type !== 'item' || !it.path) return;
    const path = it.path.replace(/#.*$/, '');
    if (path.indexOf('/docs') !== 0 || seen.has(path)) return;
    seen.add(path);
    out.push(PAGES.find(p => p.path === path) || { path, title: it.title });
  });
  walk(HE_DOC_SECTIONS);
  return (PAGER_PAGES = out);
}

function buildPager() {
  const el = $('[data-w-pager]');
  if (!el) return;
  const pages = pagerPages();
  const i = pages.findIndex(p => p.path === currentPath());
  if (i === -1) { el.innerHTML = ''; el.hidden = true; return; }
  el.hidden = false;
  const prev = pages[i - 1], next = pages[i + 1];
  el.innerHTML = (prev ? pagerLink('prev', prev) : '<span></span>') +
                 (next ? pagerLink('next', next) : '<span></span>');
}

/* ── Per-page action links (edit on GitHub, report a bug) ────────────────── */
function buildPageActions() {
  const el = $('[data-w-page-actions]');
  if (!el) return;
  const name = currentPath().replace(/^\/docs\/?/, '');
  const file = name
    ? `website/browser/pages/docs/${name}/tac.html`
    : 'website/browser/pages/docs/tac.html';
  el.innerHTML = `
    <a class="docs-action" href="${REPO}/edit/${BRANCH}/${file}" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      Edit this page
    </a>
    <a class="docs-action" href="${REPO}/issues/new" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      Report a bug
    </a>`;
}

/* ── Demo block: single preview + dual source ───────────────────────────── */
/* Tachyon does not render the <demo-compare> component's template for
 * page-body components, so we build the demo block here: one live preview
 * (CSS classes and web components render identically) plus the source for
 * both flavours shown side-by-side. Progressive enhancement, idempotent. */
const SLOT_LABEL = { css: 'CSS Classes', wc: 'Web Components' };
const CODE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>';

function cleanSource(html) {
  // Strip Tachyon's compiler-injected ids so examples are copy-paste clean.
  let lines = html
    .replace(/\s+id="ty-[^"]*"/g, '')
    .replace(/\t/g, '  ')
    .replace(/\r/g, '')
    .split('\n');
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  const widths = lines.filter(l => l.trim()).map(l => l.match(/^ */)[0].length);
  const indent = widths.length ? Math.min(...widths) : 0;
  return lines.map(l => l.slice(indent)).join('\n').trim();
}

/* Reconstruct the *authored* markup for a Web Component example, pretty-printed
 * with indentation. DuVay elements are Light-DOM and have already rendered their
 * internal structure into a <slot>; we rebuild the original tag + attributes +
 * slotted content so the shown code matches what a user would write. */
function meaningfulNodes(nodes) {
  return nodes.filter(n =>
    n.nodeType === Node.ELEMENT_NODE ||
    (n.nodeType === Node.TEXT_NODE && n.textContent.trim()));
}

function authoredAttribute(attribute) {
  if (attribute.value === '') return ` ${attribute.name}`;
  const quote = attribute.value.includes('"') && !attribute.value.includes("'") ? "'" : '"';
  const encoded = attribute.value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(quote === '"' ? /"/g : /'/g, quote === '"' ? '&quot;' : '&#39;');
  return ` ${attribute.name}=${quote}${encoded}${quote}`;
}

function authored(node, indent = '') {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent.replace(/\s+/g, ' ').trim();
  if (node.nodeType !== Node.ELEMENT_NODE) return '';
  const tag = node.tagName.toLowerCase();
  if (tag === 'slot') return meaningfulNodes([...node.childNodes]).map(n => authored(n, indent)).join('\n');

  const isCustom = tag.includes('-');
  const attrs = [...node.attributes]
    .filter(a => !(a.name === 'id' && String(a.value).indexOf('ty-') === 0) && !(isCustom && a.name === 'class'))
    .map(authoredAttribute)
    .join('');
  const open = `<${tag}${attrs}>`;
  const close = `</${tag}>`;

  // Authored children: for DuVay custom elements they live in the rendered
  // <slot>s; for plain elements use the actual children.
  let kids;
  if (isCustom) {
    const ownSlots = [...node.querySelectorAll('slot')].filter(s => {
      let p = s.parentElement;
      while (p && p !== node) { if (p.tagName.includes('-')) return false; p = p.parentElement; }
      return true;
    });
    kids = ownSlots.flatMap(s => [...s.childNodes]);
    if (!meaningfulNodes(kids).length) kids = [...node.childNodes].filter(n => n.tagName?.toLowerCase() !== 'slot');
  } else {
    kids = [...node.childNodes];
  }

  const kept = meaningfulNodes(kids);
  if (!kept.length) return open + close;
  if (kept.length === 1 && kept[0].nodeType === Node.TEXT_NODE) {
    return open + kept[0].textContent.replace(/\s+/g, ' ').trim() + close;
  }
  const inner = kept.map(n => indent + '  ' + authored(n, indent + '  ')).join('\n');
  return `${open}\n${inner}\n${indent}${close}`;
}

function serializeAuthored(slot) {
  return meaningfulNodes([...slot.childNodes]).map(n => authored(n, '')).join('\n');
}

function enhanceDemos() {
  $$('demo-compare').forEach(demo => {
    if (demo.dataset.wEnhanced) return;
    if (demo.querySelector('.demo')) { demo.dataset.wEnhanced = '1'; return; }

    const slotEls = $$(':scope > [slot]', demo);
    if (!slotEls.length) return;
    demo.dataset.wEnhanced = '1';

    const slots = {};
    slotEls.forEach(s => { slots[s.getAttribute('slot')] = s; });

    // Capture both sources before any DOM surgery.
    const sources = [];
    if (slots.css) sources.push({ label: SLOT_LABEL.css, code: cleanSource(slots.css.innerHTML) });
    if (slots.wc)  sources.push({ label: SLOT_LABEL.wc,  code: serializeAuthored(slots.wc) });

    // One live preview — prefer the self-contained web-component flavour.
    const previewSlot = slots.wc || slots.css || slotEls[0];

    const block = document.createElement('div');
    block.className = 'demo';

    const preview = document.createElement('div');
    preview.className = 'demo-preview';
    if (previewSlot === slots.wc) {
      // Re-parse the authored source so components hydrate once and fresh.
      // Moving already-hydrated nodes re-fires connectedCallback and nests
      // the previous render inside the new <slot> (double borders, etc.).
      preview.innerHTML = serializeAuthored(slots.wc);
    } else {
      while (previewSlot.firstChild) preview.appendChild(previewSlot.firstChild);
    }
    block.appendChild(preview);

    if (sources.length) {
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'demo-code-toggle';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = CODE_ICON + '<span>Show code</span>';

      const code = document.createElement('div');
      code.className = 'demo-code';
      code.hidden = true;
      code.innerHTML = sources.map(s =>
        `<div class="demo-code-col"><p class="demo-code-label">${escapeHtml(s.label)}</p><pre class="code-block"><code>${escapeHtml(s.code)}</code></pre></div>`
      ).join('');

      toggle.addEventListener('click', () => {
        const open = code.hidden;
        code.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
        toggle.querySelector('span').textContent = open ? 'Hide code' : 'Show code';
        if (open) enhanceCopyButtons();
      });

      block.append(toggle, code);
    }

    demo.innerHTML = '';
    demo.appendChild(block);
  });
}

function enhanceMixedCheckboxes() {
  $$('input[type="checkbox"][data-demo-mixed]').forEach(input => {
    input.indeterminate = true;
    input.setAttribute('aria-checked', 'mixed');
  });
}

function enhanceCalendarDemos() {
  $$('[data-calendar-custom-content]').forEach(calendar => {
    if (calendar.dataset.wCalendarContentReady) return;
    calendar.dataset.wCalendarContentReady = '1';
    calendar.dayHeaderContent = ({ present }) => present
      ? '<strong>Today</strong>'
      : '<strong>Focus day</strong>';
    calendar.intervalHeaderContent = () => '<span>Time</span>';
    calendar.intervalContent = ({ hour }) => `<span>${hour} o'clock</span>`;
    calendar.dayBodyContent = (_, component) =>
      `<span class="w-calendar-current-time" style="top:${component.timeToY('09:30', true)}px"></span>`;
    calendar.eventContent = ({ event, time }) => `<strong>${time} ${event.name}</strong>`;
  });
}

/* ── Command-palette search (Cmd/Ctrl + K) ──────────────────────────────── */
let searchEls = null;
let searchActive = -1;

function buildSearchModal() {
  if (document.getElementById('w-search-modal')) {
    searchEls = {
      overlay: document.getElementById('w-search-modal'),
      input: $('#w-search-modal .cmdk-input'),
      results: $('#w-search-modal .cmdk-results'),
    };
    return;
  }
  const overlay = document.createElement('div');
  overlay.id = 'w-search-modal';
  overlay.className = 'cmdk-overlay';
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="cmdk-panel" role="dialog" aria-modal="true" aria-label="Search documentation">
      <div class="cmdk-input-row">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input class="cmdk-input" type="text" placeholder="Search documentation…" aria-label="Search documentation" autocomplete="off" spellcheck="false">
        <kbd class="w-kbd">Esc</kbd>
      </div>
      <ul class="cmdk-results" role="listbox"></ul>
      <p class="cmdk-empty" hidden>No matches.</p>
    </div>`;
  document.body.appendChild(overlay);
  searchEls = { overlay, input: $('.cmdk-input', overlay), results: $('.cmdk-results', overlay) };

  overlay.addEventListener('click', e => { if (e.target === overlay) closeSearch(); });
  searchEls.input.addEventListener('input', renderSearch);
  searchEls.input.addEventListener('keydown', onSearchKey);
}

function openSearch() {
  buildSearchModal();
  searchEls.overlay.hidden = false;
  document.body.classList.add('cmdk-open');
  searchEls.input.value = '';
  renderSearch();
  requestAnimationFrame(() => searchEls.input.focus());
}

function closeSearch() {
  if (!searchEls) return;
  searchEls.overlay.hidden = true;
  document.body.classList.remove('cmdk-open');
}

function targetFromAttr(trigger, attr) {
  const name = trigger.getAttribute(attr);
  if (!name) return null;
  return document.getElementById(name) ||
    document.querySelector('[data-w-dialog="' + name + '"]') ||
    document.querySelector('[data-w-sheet="' + name + '"]');
}

function openLayer(target) {
  const overlayId = target && target.getAttribute('data-w-overlay');
  const overlay = overlayId ? document.getElementById(overlayId) : null;
  if (overlay) overlay.classList.add('open');
  target.classList.add('open');
  target.setAttribute('aria-hidden', 'false');
}

function closeLayer(target) {
  if (!target) return;
  target.classList.remove('open');
  target.setAttribute('aria-hidden', 'true');
  const overlayId = target.getAttribute('data-w-overlay');
  const overlay = overlayId ? document.getElementById(overlayId) : null;
  if (overlay && !document.querySelector('[data-w-overlay="' + overlayId + '"].open')) overlay.classList.remove('open');
}

function closeLayersForOverlay(overlay) {
  const selector = overlay.id ? '[data-w-overlay="' + overlay.id + '"].open' : '.w-dialog-wrapper.open, .w-sheet-bottom.open';
  $$(selector).forEach(closeLayer);
  overlay.classList.remove('open');
}

function searchResults(q) {
  q = q.trim().toLowerCase();
  if (!q) return PAGES;
  return PAGES.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.group.toLowerCase().includes(q) ||
    p.keywords.includes(q) ||
    q.split(/\s+/).every(w => (p.title + ' ' + p.keywords).toLowerCase().includes(w))
  );
}

function renderSearch() {
  const results = searchResults(searchEls.input.value);
  searchActive = results.length ? 0 : -1;
  searchEls.results.innerHTML = results.map((p, i) => `
    <li role="option" class="cmdk-result${i === 0 ? ' active' : ''}" data-path="${p.path}" aria-selected="${i === 0}">
      <span class="cmdk-result-title">${escapeHtml(p.title)}</span>
      <span class="cmdk-result-group">${escapeHtml(p.group)}</span>
    </li>`).join('');
  $('.cmdk-empty', searchEls.overlay).hidden = results.length > 0;

  $$('.cmdk-result', searchEls.results).forEach(li => {
    li.addEventListener('click', () => { navigate(li.dataset.path); closeSearch(); });
    li.addEventListener('mousemove', () => setActive([...searchEls.results.children].indexOf(li)));
  });
}

function setActive(i) {
  const items = $$('.cmdk-result', searchEls.results);
  if (!items.length) return;
  searchActive = (i + items.length) % items.length;
  items.forEach((li, idx) => {
    const on = idx === searchActive;
    li.classList.toggle('active', on);
    li.setAttribute('aria-selected', String(on));
    if (on) li.scrollIntoView({ block: 'nearest' });
  });
}

function onSearchKey(e) {
  if (e.key === 'ArrowDown') { e.preventDefault(); setActive(searchActive + 1); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(searchActive - 1); }
  else if (e.key === 'Enter') {
    e.preventDefault();
    const li = $$('.cmdk-result', searchEls.results)[searchActive];
    if (li) { navigate(li.dataset.path); closeSearch(); }
  } else if (e.key === 'Escape') {
    e.preventDefault(); closeSearch();
  }
}

/* ── Global, once-only listeners ────────────────────────────────────────── */
function bindGlobalOnce() {
  if (window.__wDocsBound) return;
  window.__wDocsBound = true;

  document.addEventListener('click', e => {
    const docsMenuToggle = e.target.closest('[data-w-docs-menu-toggle]');
    if (docsMenuToggle) {
      const sidebar = $('[data-docs-sidebar]');
      setDocsNavigationOpen(!sidebar?.classList.contains('is-open'), true);
      return;
    }

    if (e.target.closest('[data-w-docs-menu-close]')) {
      setDocsNavigationOpen(false, true);
      return;
    }

    if (e.target.closest('[data-docs-sidebar] a[href]') && docsCompactMedia().matches) {
      setDocsNavigationOpen(false);
    }

    const copy = e.target.closest('.code-copy');
    if (copy) { copyFrom(copy.closest('.code-block')); return; }
    if (e.target.closest('[data-w-theme-toggle]')) { cycleTheme(); return; }
    if (e.target.closest('[data-w-search-open]')) { openSearch(); return; }

    const expandToggle = e.target.closest('[data-w-expand-toggle]');
    if (expandToggle) {
      const key = expandToggle.getAttribute('data-w-expand-toggle');
      const panel = key
        ? document.getElementById(key) || document.querySelector('[data-w-expand="' + key + '"]')
        : expandToggle.closest('.w-expand');
      if (panel) {
        const open = !panel.classList.contains('open');
        if (window.WMotion && typeof window.WMotion.setExpand === 'function') {
          window.WMotion.setExpand(panel, open);
        } else {
          panel.classList.toggle('open', open);
          expandToggle.setAttribute('aria-expanded', String(open));
        }
      }
      return;
    }

    const wDialogOpen = e.target.closest('[data-w-dialog-open]');
    if (wDialogOpen) {
      const target = targetFromAttr(wDialogOpen, 'data-w-dialog-open');
      if (target) openLayer(target);
      return;
    }

    const wSheetOpen = e.target.closest('[data-w-sheet-open]');
    if (wSheetOpen) {
      const target = targetFromAttr(wSheetOpen, 'data-w-sheet-open');
      if (target) openLayer(target);
      return;
    }

    const wClose = e.target.closest('[data-w-dialog-close], [data-w-sheet-close]');
    if (wClose) {
      const attr = wClose.hasAttribute('data-w-dialog-close') ? 'data-w-dialog-close' : 'data-w-sheet-close';
      const target = targetFromAttr(wClose, attr) || wClose.closest('.w-dialog-wrapper.open, .w-sheet-bottom.open');
      closeLayer(target);
      return;
    }

    const wOverlay = e.target.closest('.w-overlay.open');
    if (wOverlay && e.target === wOverlay) {
      closeLayersForOverlay(wOverlay);
      return;
    }

    const demoDialogOpen = e.target.closest('[data-demo-dialog-open]');
    if (demoDialogOpen) {
      const name = demoDialogOpen.getAttribute('data-demo-dialog-open');
      const dialog = document.querySelector('[data-demo-dialog="' + name + '"]');
      if (dialog && typeof dialog.show === 'function') dialog.show();
      return;
    }

    const demoDialogClose = e.target.closest('[data-demo-dialog-close]');
    if (demoDialogClose) {
      const name = demoDialogClose.getAttribute('data-demo-dialog-close');
      const dialog = document.querySelector('[data-demo-dialog="' + name + '"]');
      if (dialog && typeof dialog.close === 'function') dialog.close();
      return;
    }

    const demoSheetOpen = e.target.closest('[data-demo-sheet-open]');
    if (demoSheetOpen) {
      const name = demoSheetOpen.getAttribute('data-demo-sheet-open');
      const sheet = document.querySelector('[data-demo-sheet="' + name + '"]');
      const overlay = document.querySelector('[data-demo-sheet-overlay="' + name + '"]');
      if (sheet) {
        sheet.classList.add('open');
        sheet.setAttribute('aria-hidden', 'false');
      }
      if (overlay) overlay.classList.add('open');
      return;
    }

    const demoSheetClose = e.target.closest('[data-demo-sheet-close], [data-demo-sheet-overlay]');
    if (demoSheetClose) {
      const name = demoSheetClose.getAttribute('data-demo-sheet-close') || demoSheetClose.getAttribute('data-demo-sheet-overlay');
      const sheet = document.querySelector('[data-demo-sheet="' + name + '"]');
      const overlay = document.querySelector('[data-demo-sheet-overlay="' + name + '"]');
      if (sheet) {
        sheet.classList.remove('open');
        sheet.setAttribute('aria-hidden', 'true');
      }
      if (overlay) overlay.classList.remove('open');
      return;
    }

    const tocLink = e.target.closest('[data-w-toc-link]');
    if (tocLink) {
      e.preventDefault();
      const id = tocLink.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', '#' + id);
      }
    }
  });

  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const open = searchEls && !searchEls.overlay.hidden;
      open ? closeSearch() : openSearch();
    } else if (e.key === 'Escape' && searchEls && !searchEls.overlay.hidden) {
      closeSearch();
    } else if (e.key === 'Escape') {
      if ($('[data-docs-sidebar]')?.classList.contains('is-open')) {
        setDocsNavigationOpen(false, true);
        return;
      }
      const openLayerEl = [...document.querySelectorAll('.w-dialog-wrapper.open, .w-sheet-bottom.open')].pop();
      if (openLayerEl) closeLayer(openLayerEl);
    }
  });

  docsCompactMedia().addEventListener('change', () => setDocsNavigationOpen(false));
}

/* ── API reference tables ───────────────────────────────────────────────── */
function apiTable(title, head, rows) {
  if (!rows || !rows.length) return '';
  const kind = slugify(title);
  return `<div class="api-group">
    <h4 class="api-group-title">${title}</h4>
    <div class="api-table-wrap"><table class="api-table" data-api-kind="${kind}" aria-label="${escapeHtml(title)}">
      <thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${rows.map(r => `<tr>${r.map((c, i) =>
        `<td data-label="${escapeHtml(head[i] || '')}">${i === 0 ? `<code>${escapeHtml(c)}</code>` : escapeHtml(c)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></div>
  </div>`;
}

function enhanceApiReference() {
  const page = $('[data-w-page]');
  const path = currentPath();
  const blocks = API_DATA[path];
  const existing = page && page.querySelector('[data-w-api]');
  // Same page already rendered → nothing to do (avoids mutation loops).
  if (existing && existing.dataset.path === path) return;
  if (existing) existing.remove();
  if (!page || !blocks) return;

  const sections = blocks.map(b => `
    <section class="api-component">
      <h3 id="api-${b.tag}"><code>&lt;${b.tag}&gt;</code></h3>
      ${apiTable('Attributes', ['Attribute', 'Type', 'Default', 'Description'], b.attributes)}
      ${apiTable('Events', ['Event', 'Detail', 'Description'], b.events)}
      ${apiTable('Slots', ['Slot', 'Description'], b.slots)}
      ${apiTable('Methods', ['Method', 'Description'], b.methods)}
    </section>`).join('');

  const wrap = document.createElement('div');
  wrap.setAttribute('data-w-api', '');
  wrap.dataset.path = path;
  wrap.innerHTML = `<h2 id="api-reference">API reference</h2>${sections}`;
  page.appendChild(wrap);
}

/* ── All Components catalog (/docs/components) ───────────────────────────── */
/* Built from the sidebar's Components group so the catalog is always complete
   and ordered the same way as the navigation. */
function enhanceComponentsCatalog() {
  const mount = $('[data-w-components-catalog]');
  if (!mount || mount.dataset.wBuilt) return;
  const section = HE_DOC_SECTIONS.find(s => s.title === 'Components');
  if (!section) return;

  const groups = [];
  let current = null;
  const ensure = (title) => { current = { title, items: [] }; groups.push(current); return current; };
  section.items.forEach(item => {
    if (item.type === 'subhead') { ensure(item.title); return; }
    if (item.type === 'separator') return;
    if (item.type === 'group') {
      const first = (item.items || []).find(i => i.path);
      if (first) (current || ensure('Application')).items.push({ title: item.title, path: first.path });
      return;
    }
    if (item.type === 'item') {
      if (item.path === '/docs/components' || item.path === '/docs/components/explorer') return; // skip self/meta
      (current || ensure('Application')).items.push(item);
    }
  });

  mount.innerHTML = groups.filter(g => g.items.length).map(g => `
    <h2>${escapeHtml(g.title)}</h2>
    <div class="components-catalog-grid">
      ${g.items.map(i => `<a class="components-catalog-card" href="${i.path}">${escapeHtml(i.title)}</a>`).join('')}
    </div>`).join('');
  mount.dataset.wBuilt = '1';
}

/* ── API Explorer (/docs/components/explorer) ────────────────────────────── */
/* Filterable browser over every component that has an API_DATA entry. */
function enhanceApiExplorer() {
  const mount = $('[data-w-api-explorer]');
  if (!mount || mount.dataset.wBuilt) return;

  const titleByPath = {};
  PAGES.forEach(p => { titleByPath[p.path] = p.title; });
  const entries = Object.keys(API_DATA)
    .map(path => ({ path, title: titleByPath[path] || path.replace(/^\/docs\/(components\/)?/, ''), blocks: API_DATA[path] }))
    .filter(e => Array.isArray(e.blocks) && e.blocks.length)
    .sort((a, b) => a.title.localeCompare(b.title));
  if (!entries.length) return;

  mount.innerHTML = `
    <div class="api-explorer">
      <div class="api-explorer-nav">
        <input type="search" class="w-input api-explorer-filter" placeholder="Filter ${entries.length} components…" data-api-explorer-filter aria-label="Filter components">
        <ul class="api-explorer-list" role="list">
          ${entries.map((e, i) => `<li><button type="button" class="api-explorer-item${i === 0 ? ' active' : ''}" data-path="${e.path}">${escapeHtml(e.title)}</button></li>`).join('')}
        </ul>
      </div>
      <div class="api-explorer-detail" data-api-explorer-detail></div>
    </div>`;

  const detail = $('[data-api-explorer-detail]', mount);
  const render = (path) => {
    const e = entries.find(x => x.path === path);
    if (!e) return;
    detail.innerHTML = e.blocks.map(b => `
      <section class="api-component">
        <h3 id="api-${b.tag}"><code>&lt;${b.tag}&gt;</code></h3>
        ${apiTable('Attributes', ['Attribute', 'Type', 'Default', 'Description'], b.attributes)}
        ${apiTable('Events', ['Event', 'Detail', 'Description'], b.events)}
        ${apiTable('Slots', ['Slot', 'Description'], b.slots)}
        ${apiTable('Methods', ['Method', 'Description'], b.methods)}
      </section>`).join('') + `<a class="api-explorer-doclink" href="${e.path}">Open ${escapeHtml(e.title)} documentation →</a>`;
  };

  mount.querySelectorAll('.api-explorer-item').forEach(btn => {
    btn.addEventListener('click', () => {
      mount.querySelectorAll('.api-explorer-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render(btn.dataset.path);
    });
  });

  const filter = $('[data-api-explorer-filter]', mount);
  filter.addEventListener('input', () => {
    const q = filter.value.trim().toLowerCase();
    mount.querySelectorAll('.api-explorer-item').forEach(b => {
      b.closest('li').hidden = !!q && !b.textContent.toLowerCase().includes(q);
    });
  });

  render(entries[0].path);
  mount.dataset.wBuilt = '1';
}

/* ── Late-hydration safety net ──────────────────────────────────────────── */
/* Tachyon hydrates page-body components (e.g. <demo-compare>) after the
 * initial render and does not re-fire `tachyon:navigate` for them. Watch the
 * content region and re-run the content-dependent enhancers when it changes.
 * Every enhancer is idempotent, so repeated passes quiesce immediately. */
let contentObserver = null;
let contentRaf = 0;

function runContentEnhancers() {
  enhanceDemos();
  enhanceMixedCheckboxes();
  enhanceCalendarDemos();
  enhanceApiReference();
  enhanceCopyButtons();
  buildTOC();
  if (window.WMotion && typeof window.WMotion.init === 'function') {
    window.WMotion.init(document);
  }
}

function observeContent() {
  const target = document.querySelector('.docs-main');
  if (contentObserver) contentObserver.disconnect();
  if (!target) return;
  contentObserver = new MutationObserver(() => {
    cancelAnimationFrame(contentRaf);
    contentRaf = requestAnimationFrame(() => {
      contentObserver.disconnect();
      runContentEnhancers();
      contentObserver.observe(target, { childList: true, subtree: true });
    });
  });
  contentObserver.observe(target, { childList: true, subtree: true });
}

/* ── Per-navigation enhancement ─────────────────────────────────────────── */
/* ── Self-documenting download sizes ────────────────────────────────────── */
/* The build emits dist/sizes.json; we fill the Download page link labels from
 * it so the published byte counts can never drift from the actual artifacts. */
let _wSizes = null;
function loadSizes() {
  if (!_wSizes) {
    _wSizes = fetch('/shared/assets/duvay/dist/sizes.json')
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => ({}));
  }
  return _wSizes;
}

async function fillDownloadSizes() {
  const links = document.querySelectorAll('a[download][href*="/dist/"]');
  const markers = document.querySelectorAll('[data-w-size]');
  if (!links.length && !markers.length) return;
  const sizes = await loadSizes();
  const kb = (bytes) => '~' + Math.round(bytes / 1024) + ' KB';
  // Download-table links: rewrite the "~NNN KB" inside the existing text.
  links.forEach((a) => {
    const bytes = sizes[(a.getAttribute('href') || '').split('/').pop()];
    if (!bytes) return;
    a.textContent = /~?\s*[\d.]+\s*KB/i.test(a.textContent)
      ? a.textContent.replace(/~?\s*[\d.]+\s*KB/i, kb(bytes))
      : a.textContent.trim() + ' · ' + kb(bytes);
  });
  // Inline markers (e.g. the home "Lightweight" card): set the label outright.
  markers.forEach((el) => {
    const bytes = sizes[el.getAttribute('data-w-size')];
    if (bytes) el.textContent = kb(bytes);
  });
}

function enhance() {
  syncDocumentTitle();
  syncThemeControls(getTheme());
  renderDocsSidebar();
  markActiveNav();
  enhanceSidebarSections();
  enhanceResponsiveNavigation();
  runContentEnhancers();
  enhanceComponentsCatalog();
  enhanceApiExplorer();
  buildPager();
  buildPageActions();
  buildSearchModal();
  fillDownloadSizes();
  observeContent();
}

/* ── Boot ───────────────────────────────────────────────────────────────── */
applyTheme(getTheme());
bindGlobalOnce();
window.addEventListener('tachyon:navigate', enhance);
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', enhance);
} else {
  enhance();
}
