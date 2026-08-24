/* DuVay docs — progressive enhancement layer.
 *
 * Loaded globally via shared/scripts/imports.js. Re-runs on every SPA
 * navigation (the renderer fires `tachyon:navigate` on window after each
 * route change, including first paint). Every DOM mutation here is
 * idempotent so it survives Tachyon's HTML diffing.
 */

import { API_DATA } from './api-data.js';
import { GENERATED_PAGE_INDEX } from './generated-api-data.js';

/* ── Docs index ─────────────────────────────────────────────────────────────
 *
 * Derived from HE_DOC_SECTIONS below rather than maintained beside it. The two
 * used to be separate lists and had drifted: eleven authored pages were absent
 * from the navigation, six sidebar entries were unreachable by search, and two
 * paths were listed twice. One list cannot disagree with itself.
 *
 * The taxonomy is the source because it carries what a flat list cannot — group
 * order, subheads, separators — and because prev/next already walked it.
 *
 * GENERATED_PAGE_INDEX is merged in afterwards for search only. Those are
 * per-element API pages for sub-components (`w-slider-thumb`, the transition
 * helpers); they are reachable from their parent component's page and would
 * bury the sidebar if listed in it. */
function flattenSections(sections) {
  const pages = [];
  const walk = (items, group) => {
    for (const item of items) {
      if (item.type === 'group') walk(item.items || [], item.title);
      else if (item.type === 'item' && item.path) {
        pages.push({ path: item.path, title: item.title, group, keywords: item.keywords || '' });
      }
    }
  };
  walk(sections, '');
  return pages;
}

const REPO = 'https://github.com/d31ma/DUVAY';
const BRANCH = 'main';

/* ── Docs sidebar ─────────────────────────────────────────────────────────
 * The Components group mirrors Vuetify's live sidebar taxonomy. Items without
 * a dedicated DuVay page link to the closest existing component section. */
const HE_DOC_SECTIONS = [
  {
    type: 'group',
    title: 'Introduction',
    items: [
      { type: 'item', title: 'Introduction', path: '/docs/introduction', keywords: 'intro overview he zero dependency design system css web components vuetify material' },
      { type: 'item', title: 'Roadmap', path: '/docs/roadmap', keywords: 'roadmap future coverage polish stable labs' },
    ]
  },
  {
    type: 'group',
    title: 'Getting started',
    items: [
      { type: 'item', title: 'Installation', path: '/docs/install', keywords: 'install npm cdn download setup import bun' },
      { type: 'item', title: 'Getting started', path: '/docs/getting-started', keywords: 'getting started start setup install download cdn npm entry point' },
      { type: 'item', title: 'Download', path: '/docs/download', keywords: 'download cdn jsdelivr unpkg minified full version head link script npm bundle' },
      { type: 'item', title: 'Using with Tailwind', path: '/docs/tailwind', keywords: 'tailwind utility cascade layer interop override preflight coexist' },
      { type: 'item', title: 'Frequently asked questions', path: '/docs/frequently-asked-questions', keywords: 'faq questions zero dependency theme web component framework agnostic' },
      { type: 'item', title: 'Wireframes', path: '/docs/wireframes', keywords: 'wireframes layout scaffold starter app bar navigation drawer footer shell' },
      { type: 'item', title: 'Unit testing', path: '/docs/unit-testing', keywords: 'unit testing test bun vitest happy-dom light dom render microtask events' },
      { type: 'item', title: 'Browser support', path: '/docs/browser-support', keywords: 'browser support compatibility custom elements evergreen chrome firefox safari' },
      { type: 'item', title: 'Upgrade guide', path: '/docs/upgrade-guide', keywords: 'upgrade guide calver version pin migrate breaking changes' },
      { type: 'item', title: 'Release notes', path: '/docs/release-notes', keywords: 'release notes changelog versions calver github releases history' },
      { type: 'item', title: 'Contributing', path: '/docs/contributing', keywords: 'contributing build test conventions tokens pull request repo' },
    ]
  },
  {
    type: 'group',
    title: 'Features',
    items: [
      { type: 'item', title: 'Accessibility', path: '/docs/features/accessibility' },
      { type: 'item', title: 'Application layout', path: '/docs/features/application-layout' },
      {
        type: 'group',
        title: 'CSS utilities',
        items: [
          { type: 'item', title: 'CSS utilities', path: '/docs/features/css-utilities', keywords: 'css utilities atomic helper classes' },
          { type: 'item', title: 'Overview', path: '/docs/features/css-utilities/overview', keywords: 'css utilities overview atomic helper classes' },
          { type: 'item', title: 'Tailwind CSS', path: '/docs/features/css-utilities/tailwindcss', keywords: 'tailwind css utility interop preflight layer' },
          { type: 'item', title: 'UnoCSS Tailwind preset', path: '/docs/features/css-utilities/unocss-tailwind-preset', keywords: 'unocss tailwind preset utility' },
          { type: 'item', title: 'UnoCSS Vuetify preset', path: '/docs/features/css-utilities/unocss-vuetify-preset', keywords: 'unocss vuetify preset utility' },
        ]
      },
      { type: 'item', title: 'Display and platform', path: '/docs/features/display-and-platform' },
      { type: 'item', title: 'Hotkey', path: '/docs/features/hotkey' },
      { type: 'item', title: 'Icon Fonts', path: '/docs/features/icon-fonts' },
      { type: 'item', title: 'Theme', path: '/docs/themes', keywords: 'theme dark light auto high contrast tokens colors w-theme' },
    ]
  },
  {
    type: 'group',
    title: 'Styles',
    items: [
      { type: 'item', title: 'Entry points', path: '/docs/styles/entry-points', keywords: 'styles entry points imports bundle css' },
      { type: 'item', title: 'Styles and animations', path: '/docs/styles-and-animations', keywords: 'styles animations motion transition elevation radius typography utility theme css reset' },
      { type: 'item', title: 'Animations', path: '/docs/animations', keywords: 'animations motion transition expand flip crossfade tween spring vuetify svelte reduced motion' },
      { type: 'item', title: 'Utilities', path: '/docs/utilities', keywords: 'utility spacing margin padding flex display sizing text elevation shadow radius helpers' },
      { type: 'item', title: 'CSS Reset', path: '/docs/styles/css-reset', keywords: 'css reset normalize base preflight' },
      { type: 'item', title: 'Layers', path: '/docs/styles/layers', keywords: 'css layers cascade order' },
      { type: 'item', title: 'Transitions', path: '/docs/styles/transitions', keywords: 'transitions motion duration ease tokens reduced motion' },
      { type: 'item', title: 'Colors', path: '/docs/styles/colors', keywords: 'colors palette tokens primary surface theme' },
      { type: 'subhead', title: 'Utility classes' },
      { type: 'item', title: 'Borders', path: '/docs/styles/borders', keywords: 'border divider utility classes' },
      { type: 'item', title: 'Border radius', path: '/docs/styles/border-radius', keywords: 'border radius rounded pill circle tile' },
      { type: 'item', title: 'Content', path: '/docs/styles/content', keywords: 'content truncate line clamp text' },
      { type: 'item', title: 'Cursor', path: '/docs/styles/cursor', keywords: 'cursor pointer default select none' },
      { type: 'item', title: 'Display', path: '/docs/styles/display', keywords: 'display block inline flex grid hidden responsive' },
      { type: 'item', title: 'Elevation', path: '/docs/styles/elevation', keywords: 'elevation shadow depth' },
      { type: 'item', title: 'Flex', path: '/docs/styles/flex', keywords: 'flex flexbox row column wrap gap align justify' },
      { type: 'item', title: 'Float', path: '/docs/styles/float', keywords: 'float clear alternatives flex' },
      { type: 'item', title: 'Opacity', path: '/docs/styles/opacity', keywords: 'opacity transparency' },
      { type: 'item', title: 'Overflow', path: '/docs/styles/overflow', keywords: 'overflow auto hidden scroll scrollbar' },
      { type: 'item', title: 'Position', path: '/docs/styles/position', keywords: 'position static relative absolute fixed sticky inset' },
      { type: 'item', title: 'Sizing', path: '/docs/styles/sizing', keywords: 'sizing width height min max full' },
      { type: 'item', title: 'Spacing', path: '/docs/styles/spacing', keywords: 'spacing margin padding gap scale' },
      { type: 'item', title: 'Text and typography', path: '/docs/styles/text-and-typography', keywords: 'text typography font weight size wrap truncate color' },
    ]
  },
  {
    type: 'group',
    title: 'Common concepts',
    items: [
      { type: 'item', title: 'Density and sizing', path: '/docs/density-and-sizing', keywords: 'density comfortable compact prominent size scale x-small x-large' },
      { type: 'item', title: 'Items', path: '/docs/items', keywords: 'items item group selection mandatory multiple' },
      { type: 'item', title: 'Routing', path: '/docs/routing', keywords: 'routing router href link navigation breadcrumb tab list item button card chip' },
      { type: 'item', title: 'w-model', path: '/docs/w-model', keywords: 'w-model v-model model-value value binding controlled uncontrolled two-way update event vue vuetify' },
      { type: 'item', title: 'Variants', path: '/docs/variants', keywords: 'variant elevated flat tonal outlined text plain emphasis' },
      { type: 'item', title: 'Grid', path: '/docs/grid', keywords: 'grid container row column col responsive 12 columns offset gutter flex layout' },
      { type: 'item', title: 'Navigation', path: '/docs/navigation', keywords: 'topbar sidebar tabs breadcrumbs pagination drawer mobile shell' },
      { type: 'item', title: 'Platform parity', path: '/docs/platform-parity', keywords: 'platform parity native apple ios macos android windows linux tier core contract coverage matrix support' },
      { type: 'item', title: 'Platform skins', path: '/docs/platform-skins', keywords: 'platform skin w-os ios android material macos windows fluent linux adwaita design language native look' },
      { type: 'item', title: 'Vuetify parity', path: '/docs/vuetify-parity', keywords: 'vuetify parity compatible props attributes audit version 4.1.7' },
    ]
  },
  {
    type: 'group',
    title: 'Components',
    items: [
      { type: 'item', title: 'All Components', path: '/docs/components', keywords: 'components catalog buttons inputs lists tables cards badges avatars dialogs overlays feedback' },
      { type: 'item', title: 'API Explorer', subtitle: 'Browse Components', path: '/docs/components/explorer' },
      { type: 'item', title: 'Layout primitives', path: '/docs/layout-primitives', keywords: 'layout primitive container row col spacer responsive' },
      { type: 'item', title: 'Surfaces', path: '/docs/surfaces', keywords: 'surface sheet card paper elevation background' },
      { type: 'item', title: 'Feedback', path: '/docs/feedback', keywords: 'feedback alert snackbar toast progress skeleton empty state' },
      { type: 'item', title: 'Command', path: '/docs/command', keywords: 'command palette cmdk search actions shortcut' },
      { type: 'item', title: 'Workflows', path: '/docs/workflows', keywords: 'workflow stepper wizard steps multi step form' },
      { type: 'item', title: 'Application', path: '/docs/components/application', keywords: 'application app shell app bar layout drawer main' },
      { type: 'separator' },
      { type: 'subhead', title: 'Containment' },
      { type: 'item', title: 'Bottom sheets', path: '/docs/bottom-sheets', keywords: 'bottom sheet modal mobile actions overlay dialog' },
      { type: 'item', title: 'Buttons', path: '/docs/buttons', keywords: 'button btn filled outlined text ghost icon fab variant size loading' },
      { type: 'item', title: 'Icon buttons', path: '/docs/icon-buttons', keywords: 'icon button btn accessible label size loading disabled' },
      { type: 'item', title: 'Cards', path: '/docs/cards', keywords: 'card header body footer panel surface' },
      { type: 'item', title: 'Chips', path: '/docs/chips', keywords: 'chip filter pill tag selectable size' },
      { type: 'item', title: 'Command palettes', path: '/docs/components/command-palette' },
      { type: 'item', title: 'Dialogs', path: '/docs/dialog', keywords: 'dialog modal overlay sheet bottom drawer' },
      { type: 'item', title: 'Dividers', path: '/docs/components/dividers', keywords: 'divider separator line vertical inset' },
      { type: 'item', title: 'Expansion panels', path: '/docs/expand', keywords: 'expand accordion collapse panel disclosure' },
      { type: 'item', title: 'Lists', path: '/docs/lists', keywords: 'list item nav density lines active selectable avatar icon action tree treeview hierarchy expand collapse' },
      { type: 'item', title: 'Menus', path: '/docs/menus', keywords: 'dropdown menu context menu menubar navigation menu actions shadcn' },
      { type: 'item', title: 'Overlays', path: '/docs/overlays', keywords: 'alert dialog popover hover card sonner toast overlay shadcn' },
      { type: 'item', title: 'Sheets', path: '/docs/sheets', keywords: 'sheet surface card bottom sheet container' },
      { type: 'item', title: 'Toolbars', path: '/docs/toolbars', keywords: 'toolbar title items actions app header navigation' },
      { type: 'item', title: 'Tooltips', path: '/docs/tooltips', keywords: 'tooltip hover hint popover' },
      { type: 'separator' },
      { type: 'subhead', title: 'Navigation' },
      { type: 'item', title: 'App bars', path: '/docs/app-bars', keywords: 'app bar toolbar header density prominent extended flat elevation scroll behavior collapse image location sticky' },
      { type: 'item', title: 'Bottom navigation', path: '/docs/bottom-navigation', keywords: 'bottom navigation mobile bar tabs active grow shift mode color elevation' },
      { type: 'item', title: 'Breadcrumbs', path: '/docs/breadcrumbs', keywords: 'breadcrumb navigation path hierarchy' },
      { type: 'item', title: 'Floating Action Buttons', path: '/docs/floating-action-buttons', keywords: 'fab floating action button extended location absolute variant rounded size color icon' },
      { type: 'item', title: 'Footers', path: '/docs/footers', keywords: 'footer app border elevation color height rounded' },
      { type: 'item', title: 'Navigation drawers', path: '/docs/navigation-drawers', keywords: 'navigation drawer sidebar rail permanent temporary expand on hover floating scrim width' },
      { type: 'item', title: 'Pagination', path: '/docs/paginations', keywords: 'pagination pages total visible ellipsis first last prev next variant size rounded color' },
      { type: 'item', title: 'Speed Dials', path: '/docs/speed-dials', keywords: 'speed dial fab menu actions location open on hover transition fan' },
      { type: 'item', title: 'System bars', path: '/docs/system-bars', keywords: 'system bar status bar window elevation color height absolute rounded' },
      { type: 'item', title: 'Tabs', path: '/docs/tabs', keywords: 'tabs tab tablist segmented' },
      { type: 'separator' },
      { type: 'subhead', title: 'Form inputs & controls' },
      { type: 'item', title: 'Autocompletes', path: '/docs/autocompletes', keywords: 'autocomplete search dropdown filter items multiple chips clearable combobox select' },
      { type: 'item', title: 'Checkboxes', path: '/docs/checkboxes', keywords: 'checkbox checked indeterminate mixed disabled color size validation hint true value false value' },
      { type: 'item', title: 'Color inputs', path: '/docs/color-inputs', keywords: 'color input picker hex rgb hsl swatches mode field' },
      { type: 'item', title: 'Combobox', path: '/docs/combobox', keywords: 'combobox free text custom value tags delimiters chips multiple autocomplete' },
      { type: 'item', title: 'Date inputs', path: '/docs/date-inputs', keywords: 'date input field native calendar picker value' },
      { type: 'item', title: 'File inputs', path: '/docs/file-inputs', keywords: 'file input upload accept multiple browse attachment' },
      { type: 'item', title: 'File upload', path: '/docs/file-upload', keywords: 'file upload dropzone drag drop accept multiple' },
      { type: 'item', title: 'Forms', path: '/docs/forms', keywords: 'form submit validation required native constraint validity' },
      { type: 'item', title: 'Mask inputs', path: '/docs/components/mask-input' },
      { type: 'item', title: 'Custom inputs', path: '/docs/inputs', keywords: 'input field input group addon label hint error messages density prefix suffix custom base wrapper' },
      { type: 'item', title: 'Number inputs', path: '/docs/number-inputs', keywords: 'number input stepper increment decrement min max step numeric' },
      { type: 'item', title: 'OTP Input', path: '/docs/otp-input', keywords: 'otp one time passcode code verification pin length input' },
      { type: 'item', title: 'Radio buttons', path: '/docs/radio-buttons', keywords: 'radio group single choice option name value' },
      { type: 'item', title: 'Range sliders', path: '/docs/range-sliders', keywords: 'range slider dual thumb start end min max step value' },
      { type: 'item', title: 'Selects', path: '/docs/selects', keywords: 'select native select option dropdown choice value' },
      { type: 'item', title: 'Sliders', path: '/docs/slider', keywords: 'slider range input track thumb value min max step' },
      { type: 'item', title: 'Switches', path: '/docs/switches', keywords: 'switch toggle boolean on off setting' },
      { type: 'item', title: 'Text fields', path: '/docs/text-fields', keywords: 'text field input type email password url tel size state label hint error' },
      { type: 'item', title: 'Textareas', path: '/docs/textareas', keywords: 'textarea multiline text rows field label hint' },
      { type: 'separator' },
      { type: 'subhead', title: 'Data & display' },
      { type: 'item', title: 'Calendars', path: '/docs/components/calendars', keywords: 'calendar date month week day schedule' },
      { type: 'item', title: 'Confirm Edit', path: '/docs/components/confirm-edit', keywords: 'confirm edit inline save cancel field' },
      { type: 'item', title: 'Data iterators', path: '/docs/components/data-iterators', keywords: 'data iterator cards records pagination' },
      {
        type: 'group',
        title: 'Data tables',
        items: [
          { type: 'item', title: 'Introduction', path: '/docs/components/data-tables/introduction', keywords: 'data tables sorting pagination rows columns select expand search filter density' },
          { type: 'subhead', title: 'Guide' },
          { type: 'item', title: 'Basics', path: '/docs/components/data-tables/basics', keywords: 'data table basics sorting search pagination page size' },
          { type: 'item', title: 'Data and Display', path: '/docs/components/data-tables/data-and-display', keywords: 'data table rich headers selection expand density loading no data' },
          { type: 'subhead', title: 'Types' },
          { type: 'item', title: 'Server side tables', path: '/docs/components/data-tables/server-side-tables', keywords: 'server side data table pagination remote fetch items-length update options' },
          { type: 'item', title: 'Virtual tables', path: '/docs/components/data-tables/virtual-tables', keywords: 'virtual tables virtual scroll rows data table' },
        ]
      },
      { type: 'item', title: 'Heatmaps', path: '/docs/components/heatmap' },
      { type: 'item', title: 'Highlights', path: '/docs/components/highlight' },
      { type: 'item', title: 'Pie charts', path: '/docs/components/pie' },
      { type: 'item', title: 'Sparklines', path: '/docs/components/sparklines', keywords: 'sparkline chart trend mini graph' },
      { type: 'item', title: 'Infinite scrollers', path: '/docs/components/infinite-scroller', keywords: 'infinite scroll scroller load more intersection' },
      { type: 'item', title: 'Tables', path: '/docs/tables', keywords: 'table data rows columns dense striped hover fixed header' },
      { type: 'item', title: 'Treeview', path: '/docs/components/treeview', keywords: 'treeview hierarchy tree nodes collapse expand' },
      { type: 'item', title: 'Virtual scrollers', path: '/docs/components/virtual-scroller', keywords: 'virtual scroller virtual scroll long list performance' },
      { type: 'separator' },
      { type: 'subhead', title: 'Grids' },
      { type: 'separator' },
      { type: 'subhead', title: 'Selection' },
      { type: 'item', title: 'Button toggles', path: '/docs/button-toggles', keywords: 'button toggle btn-toggle btn group segmented selection single multiple mandatory divided' },
      { type: 'item', title: 'Carousels', path: '/docs/components/carousels', keywords: 'carousel slides image gallery selection' },
      { type: 'item', title: 'Chip groups', path: '/docs/chip-groups', keywords: 'chip group selection single multiple mandatory filter column max' },
      { type: 'item', title: 'Item groups', path: '/docs/components/item-groups', keywords: 'item group selection mandatory multiple active' },
      { type: 'item', title: 'Slide groups', path: '/docs/components/slide-groups', keywords: 'slide group horizontal selection carousel chips' },
      { type: 'item', title: 'Steppers', path: '/docs/steppers', keywords: 'stepper steps wizard editable non-linear actions window progress' },
      { type: 'item', title: 'Steppers Vertical', path: '/docs/vertical-steppers', keywords: 'stepper vertical steps wizard accordion inline content' },
      { type: 'item', title: 'Windows', path: '/docs/windows', keywords: 'window panel slide transition crossfade carousel tabs stepper' },
      { type: 'separator' },
      { type: 'subhead', title: 'Feedback' },
      { type: 'item', title: 'Alerts', path: '/docs/alerts', keywords: 'alert info success warning error banner dismiss' },
      { type: 'item', title: 'Badges', path: '/docs/badges', keywords: 'badge status pill label count notification' },
      { type: 'item', title: 'Banners', path: '/docs/banners', keywords: 'banner message surface icon avatar lines sticky actions prominent' },
      { type: 'item', title: 'Empty states', path: '/docs/empty-states', keywords: 'empty state placeholder headline icon image action no data nothing 404' },
      { type: 'item', title: 'Hover', path: '/docs/components/hover', keywords: 'hover activator state surface' },
      { type: 'item', title: 'Progress circular', path: '/docs/progress-circular', keywords: 'progress circular ring spinner indeterminate size width loading' },
      { type: 'item', title: 'Progress linear', path: '/docs/progress-linear', keywords: 'progress linear bar buffer indeterminate stream striped reverse loading' },
      { type: 'item', title: 'Progress', path: '/docs/components/progress' },
      { type: 'item', title: 'Ratings', path: '/docs/ratings', keywords: 'rating stars score review length readonly' },
      { type: 'item', title: 'Skeleton loaders', path: '/docs/skeleton-loaders', keywords: 'skeleton loader placeholder shimmer bone type card list-item article loading' },
      { type: 'item', title: 'Snackbars', path: '/docs/snackbar', keywords: 'snackbar toast notification action undo' },
      { type: 'item', title: 'Snackbar Queue', path: '/docs/components/snackbar-queue', keywords: 'snackbar queue toast notifications stack' },
      { type: 'item', title: 'Timelines', path: '/docs/timelines', keywords: 'timeline item dot line history activity events alternating' },
      { type: 'separator' },
      { type: 'subhead', title: 'Images & icons' },
      { type: 'item', title: 'Aspect ratios', path: '/docs/aspect-ratios', keywords: 'aspect ratio responsive media 16 9 4 3 square video embed' },
      { type: 'item', title: 'Avatars', path: '/docs/avatars', keywords: 'avatar initials image user presence status' },
      { type: 'item', title: 'Avatar groups', path: '/docs/components/avatar-group' },
      { type: 'item', title: 'Icons', path: '/docs/icons', keywords: 'icon glyph size color disabled start end opacity svg font ligature' },
      { type: 'item', title: 'Images', path: '/docs/images', keywords: 'image img picture cover gradient lazy placeholder srcset aspect ratio' },
      { type: 'item', title: 'Parallax', path: '/docs/parallax', keywords: 'parallax scroll banner hero background scale image' },
      { type: 'item', title: 'Videos', path: '/docs/components/video' },
      { type: 'separator' },
      { type: 'subhead', title: 'Pickers' },
      { type: 'item', title: 'Color pickers', path: '/docs/color-pickers', keywords: 'color picker hex rgb hsl swatch palette preview canvas' },
      { type: 'item', title: 'Date pickers', path: '/docs/date-pickers', keywords: 'date picker calendar month year day week range min max grid' },
      { type: 'item', title: 'Date range pickers', path: '/docs/components/date-range-picker' },
      { type: 'item', title: 'Month pickers', path: '/docs/components/month-picker' },
      { type: 'item', title: 'Time pickers', path: '/docs/time-pickers', keywords: 'time picker hour minute clock 24 hour field' },
      { type: 'separator' },
      { type: 'subhead', title: 'Providers' },
      { type: 'item', title: 'Defaults providers', path: '/docs/components/defaults-providers', keywords: 'defaults provider default props configuration' },
      { type: 'item', title: 'Locale providers', path: '/docs/components/locale-providers', keywords: 'locale provider localization language rtl direction fallback' },
      { type: 'item', title: 'Theme providers', path: '/docs/components/theme-providers', keywords: 'theme provider dark light auto high contrast scope tokens with-background' },
      { type: 'separator' },
      { type: 'subhead', title: 'Miscellaneous' },
      { type: 'item', title: 'Lazy', path: '/docs/components/lazy', keywords: 'lazy render mount defer intersection' },
      { type: 'item', title: 'No SSR', path: '/docs/components/no-ssr', keywords: 'no ssr client only render' },
      { type: 'item', title: 'Pull To Refresh', path: '/docs/components/pull-to-refresh', keywords: 'pull refresh mobile gesture reload' },
    ]
  },
  {
    type: 'group',
    title: 'Directives',
    items: [
      { type: 'item', title: 'Click Outside', path: '/docs/directives/click-outside', keywords: 'click outside dismiss close dropdown menu dialog pointerdown' },
      { type: 'item', title: 'Intersect', path: '/docs/directives/intersect', keywords: 'intersect intersectionobserver lazy visible viewport' },
      { type: 'item', title: 'Mutate', path: '/docs/directives/mutate', keywords: 'mutate mutationobserver dom changes children' },
      { type: 'item', title: 'Resize', path: '/docs/directives/resize', keywords: 'resize resizeobserver size element' },
      { type: 'item', title: 'Ripple', path: '/docs/directives/ripple', keywords: 'ripple press feedback active focus css' },
      { type: 'item', title: 'Scroll', path: '/docs/directives/scroll', keywords: 'scroll sticky app bar pull to refresh scroll area' },
      { type: 'item', title: 'Tooltip', path: '/docs/directives/tooltip', keywords: 'tooltip w-tooltip hint hover' },
      { type: 'item', title: 'Touch', path: '/docs/directives/touch', keywords: 'touch pointer events swipe gesture' },
    ]
  },
  {
    type: 'group',
    title: 'About',
    items: [
      { type: 'item', title: 'About DuVay', path: '/docs/about', keywords: 'about project principles vuetify relationship zero dependency html first light dom' },
      { type: 'item', title: 'Licensing', path: '/docs/about/licensing', keywords: 'license mit licensing commercial use attribution' },
      { type: 'item', title: 'Code of conduct', path: '/docs/about/code-of-conduct', keywords: 'code of conduct community behaviour contributor covenant' },
      { type: 'item', title: 'Security disclosure', path: '/docs/about/security-disclosure', keywords: 'security disclosure vulnerability report responsible' },
      { type: 'item', title: 'Meet the team', path: '/docs/about/meet-tw-team', keywords: 'team maintainers contributors people' },
    ]
  },
];

const PAGES = flattenSections(HE_DOC_SECTIONS);

const indexedPaths = new Set(PAGES.map((page) => page.path));
PAGES.push(...GENERATED_PAGE_INDEX.filter((page) => !indexedPaths.has(page.path)));

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

// w-btn hosts render an inner native <button>/<a>; aria state and focus()
// must target that element, not the custom-element host.
function controlOf(el) {
  return el && el.matches('w-btn') ? (el.querySelector('button, a') || el) : el;
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
  if (!sidebar || sidebar.hasAttribute('w-taxonomy-rendered')) return;

  sidebar.innerHTML = `<div class="docs-sidebar-mobile-header">
      <strong>Documentation</strong>
      <w-btn variant="icon" w-docs-menu-close aria-label="Close documentation navigation">
        <w-svg-icon path="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12Z" size="1.25rem"></w-svg-icon>
      </w-btn>
    </div>` + HE_DOC_SECTIONS.map(section => {
    const key = slugify(section.title);
    const items = (section.items || []).map(item => sidebarItemHtml(item, 0)).join('');
    return `<div class="docs-sidebar-section docs-sidebar-collapsible" data-docs-sidebar-key="${key}">
      <button class="docs-sidebar-title" type="button">${escapeHtml(section.title)}</button>
      <ul class="docs-sidebar-list">${items}</ul>
    </div>`;
  }).join('');
  sidebar.setAttribute('w-taxonomy-rendered', '1');
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
  document.documentElement.setAttribute('w-theme', theme);
  try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
  syncThemeControls(theme);
}

function cycleTheme() {
  const i = THEMES.indexOf(getTheme());
  applyTheme(THEMES[(i + 1) % THEMES.length]);
}

function syncThemeControls(theme) {
  $$('[w-theme-icon]').forEach(el => { el.innerHTML = THEME_ICON[theme] || THEME_ICON.light; });
  $$('[w-theme-label]').forEach(el => { el.textContent = THEME_LABEL[theme] || 'Light'; });
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
    // Mark every link tied for best (e.g. the header "Install" button and the
    // sidebar "Installation" item both point at /docs/install).
    const best = candidates[0].score;
    candidates.filter(c => c.score === best)
      .forEach(c => c.a.setAttribute('aria-current', 'page'));
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

    if (!title.hasAttribute('w-sidebar-bound')) {
      title.setAttribute('w-sidebar-bound', '1');
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
  // Deferred one microtask: w-btn renders its inner <button> in a microtask
  // queued at connect time, and this can run in that same task on navigation.
  queueMicrotask(() => setDocsNavigationOpenNow(open, returnFocus));
}

function setDocsNavigationOpenNow(open, returnFocus) {
  const sidebar = $('[data-docs-sidebar]');
  const toggle = $('[w-docs-menu-toggle]');
  const scrim = $('.docs-sidebar-scrim');
  if (!sidebar || !toggle || !scrim) return;

  const compact = docsCompactMedia().matches;
  const nextOpen = compact && open;
  sidebar.classList.toggle('is-open', nextOpen);
  sidebar.setAttribute('aria-hidden', String(compact && !nextOpen));
  if ('inert' in sidebar) sidebar.inert = compact && !nextOpen;

  toggle.hidden = !compact;
  const toggleBtn = controlOf(toggle);
  toggleBtn.setAttribute('aria-controls', 'docs-sidebar');
  toggleBtn.setAttribute('aria-expanded', String(nextOpen));
  toggleBtn.setAttribute('aria-label', nextOpen ? 'Close documentation navigation' : 'Open documentation navigation');
  scrim.hidden = !nextOpen;
  document.documentElement.classList.toggle('docs-nav-open', nextOpen);

  if (nextOpen) {
    requestAnimationFrame(() => controlOf($('[w-docs-menu-close]', sidebar))?.focus());
  } else if (returnFocus) {
    toggleBtn.focus();
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
  const toc = $('[w-toc]');
  const page = $('[w-page]') || $('.docs-main');
  if (!toc || !page) return;

  const heads = $$('h2, h3', page).filter(heading => {
    if (!heading.textContent.trim()) return false;

    // Light-DOM components can render their own headings inside a docs page.
    // Those headings describe a demo's UI, not sections of the documentation.
    let parent = heading.parentElement;
    while (parent && parent !== page) {
      if (parent.tagName.includes('-')) return false;
      parent = parent.parentElement;
    }

    return true;
  });
  if (heads.length < 2) { toc.innerHTML = ''; toc.hidden = true; return; }
  toc.hidden = false;

  const items = heads.map(h => {
    if (!h.id) h.id = slugify(h.textContent);
    const lvl = h.tagName.toLowerCase();
    return `<li class="docs-toc-item docs-toc-${lvl}"><a href="#${h.id}" w-toc-link>${escapeHtml(h.textContent)}</a></li>`;
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
  const el = $('[w-pager]');
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
  const el = $('[w-page-actions]');
  if (!el) return;
  const name = currentPath().replace(/^\/docs\/?/, '');
  const file = name
    ? `website/client/pages/docs/${name}/tac.html`
    : 'website/client/pages/docs/tac.html';
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
  // Re-emit a valueless attribute in its canonical form (`checked="checked"`).
  // Tachyon 26.33 builds elements through DOM APIs, and a bare or empty
  // boolean attribute does not take effect there — the canonical form does.
  if (attribute.value === '') return ` ${attribute.name}="${attribute.name}"`;
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


/* ── Demo OS skin tabs ──────────────────────────────────────────────────── */
/* Each demo can be shown under any of the five platform skins. The skins are
 * written as descendant selectors from `[w-os="…"]`, so setting the attribute
 * on the preview element scopes a whole skin — tokens and component deltas —
 * to that subtree, leaving the surrounding page chrome alone.
 *
 * Selection is page-wide: picking iOS on one example switches every example on
 * the page and persists, so you can read a whole component doc in one skin
 * rather than re-picking per demo. */

/* Labelled by operating system, not by design language. `material`, `fluent`
 * and `adwaita` are the attribute values — and the names Google, Microsoft and
 * GNOME use — but most developers read "Android", "Windows" and "Linux" far
 * faster. The attribute values are unchanged and documented on
 * /docs/platform-skins, which maps each label to what you actually type. */
const OS_TABS = [
  { id: '', label: 'Web' },
  { id: 'ios', label: 'iOS' },
  { id: 'android', label: 'Android' },
  { id: 'macos', label: 'macOS' },
  { id: 'windows', label: 'Windows' },
  { id: 'linux', label: 'Linux' },
];
const DEMO_OS_KEY = 'w-demo-os';
let demoOsUid = 0;

/* Default the examples to whatever skin the page is wearing — which duvay.js
 * detected from the visitor's own OS. Landing on the docs and seeing your own
 * platform is the most direct demonstration the site can give; the tabs are
 * there to compare against the others. An explicit choice still wins. */
function storedDemoOs() {
  try {
    const chosen = localStorage.getItem(DEMO_OS_KEY);
    if (chosen !== null) return chosen;
  } catch (_) { /* storage unavailable */ }
  return document.documentElement.getAttribute('w-os') || '';
}

/** Apply a skin to every demo on the page and sync all the tab strips. */
function applyDemoOs(os) {
  try { localStorage.setItem(DEMO_OS_KEY, os); } catch (_) { /* storage unavailable */ }

  $$('.demo-preview').forEach(preview => {
    // macOS is a pointer-dense platform; the density attribute is what carries
    // that, exactly as duvay.js pairs them when it detects a real Mac.
    // Always set the attribute, including the empty value: the page itself may
    // be wearing a skin, and a skin's custom properties inherit — so dropping
    // the attribute would leave the preview skinned. platforms/web.css gives
    // `w-os=""` a real reset.
    preview.setAttribute('w-os', os);
    preview.setAttribute('w-density', os === 'macos' ? 'compact' : 'comfortable');
  });

  $$('.demo-os-tab').forEach(tab => {
    const selected = tab.dataset.os === os;
    tab.setAttribute('aria-selected', String(selected));
    // Roving tabindex: only the selected tab is in the tab order.
    tab.tabIndex = selected ? 0 : -1;
  });
}

function buildOsTabs(preview) {
  const list = document.createElement('div');
  list.className = 'demo-os-tabs';
  list.setAttribute('role', 'tablist');
  list.setAttribute('aria-label', 'Preview platform skin');

  const panelId = 'demo-preview-' + (++demoOsUid);
  preview.id = panelId;
  preview.setAttribute('role', 'tabpanel');

  OS_TABS.forEach(({ id, label }) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'demo-os-tab';
    tab.dataset.os = id;
    tab.textContent = label;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panelId);
    tab.setAttribute('aria-selected', 'false');
    tab.tabIndex = -1;
    tab.addEventListener('click', () => applyDemoOs(id));
    list.appendChild(tab);
  });

  // Arrow-key navigation, per the ARIA tabs pattern.
  list.addEventListener('keydown', (e) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const tabs = $$('.demo-os-tab', list);
    const current = tabs.indexOf(document.activeElement);
    const last = tabs.length - 1;
    const next = e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : e.key === 'ArrowLeft' ? (current <= 0 ? last : current - 1)
      : (current >= last ? 0 : current + 1);
    applyDemoOs(tabs[next].dataset.os);
    tabs[next].focus();
    // The strip scrolls horizontally, so the tab just selected may be outside
    // it. Focus alone only scrolls far enough to satisfy the browser, which
    // left the last tab clipped.
    tabs[next].scrollIntoView({ inline: 'nearest', block: 'nearest' });
  });

  return list;
}

/* Tachyon 26.33 renders a component inside a <tachyon-component> boundary
 * rather than leaving the authored tag in the DOM, and moves slotted children
 * into the template's <slot>. Match both shapes so the enhancement works
 * whichever way the page was compiled, and look for [slot] anywhere inside the
 * boundary rather than only as a direct child. */
const DEMO_SELECTOR = 'demo-compare, [data-tachyon-component="demo-compare"]';

/* ── Inline SVG namespace repair ────────────────────────────────────────── */
/* Tachyon 26.33 builds authored elements with createElement, which puts them in
 * the XHTML namespace. An <svg> and its children created that way are unknown
 * HTML elements: they occupy layout but never paint.
 *
 * This only affects SVG that a *component* renders. SVG authored in page HTML
 * is parsed by the browser, which switches into foreign-content mode at <svg>
 * and namespaces it correctly — those were never broken and are skipped here.
 *
 * Re-cloning the subtree through createElementNS fixes the namespace with one
 * mechanism instead of hand-building each icon, and does not depend on the
 * authored markup carrying an xmlns attribute (none of it does).
 */
const SVG_NS = 'http://www.w3.org/2000/svg';

/* Components mount on their own schedule, so an SVG can appear after enhance()
 * has run — the site header's logo does exactly that. This observer repairs
 * whatever arrives late. It cannot loop: a repaired element is in the SVG
 * namespace, so the next pass finds nothing and does no work. */
let svgRepairScheduled = false;

function watchForLateSvg() {
  if (typeof MutationObserver !== 'function') return;
  new MutationObserver((records) => {
    if (svgRepairScheduled) return;
    const addedElements = records.some((r) => [...r.addedNodes].some((n) => n.nodeType === 1));
    if (!addedElements) return;
    svgRepairScheduled = true;
    requestAnimationFrame(() => {
      svgRepairScheduled = false;
      repairInlineSvg();
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
}

/* setAttribute() on an HTML-namespace element lowercases the name, so a
 * misplaced <svg> loses the case of every camelCase SVG attribute on the way
 * in. XML is case-sensitive, so `viewbox` is simply ignored by the SVG layout
 * algorithm — the element would still not paint even once its namespace was
 * right. Only attributes that are actually camelCase need restoring; the
 * hyphenated ones (stroke-width, clip-rule) are already lowercase by spec. */
const SVG_ATTR_CASE = Object.fromEntries(
  [
    'viewBox', 'preserveAspectRatio', 'pathLength', 'gradientUnits', 'gradientTransform',
    'spreadMethod', 'patternUnits', 'patternContentUnits', 'patternTransform',
    'clipPathUnits', 'maskUnits', 'maskContentUnits', 'markerWidth', 'markerHeight',
    'markerUnits', 'refX', 'refY', 'stdDeviation', 'textLength', 'lengthAdjust',
    'startOffset', 'baseFrequency', 'numOctaves', 'diffuseConstant', 'surfaceScale',
  ].map((name) => [name.toLowerCase(), name]),
);

/** Deep-clone `el` into the SVG namespace, restoring camelCase attribute names. */
function toSvgNamespace(el) {
  const out = document.createElementNS(SVG_NS, el.localName);
  for (const { name, value } of el.attributes) {
    // xmlns is implied by createElementNS; re-setting it throws in some engines.
    if (name === 'xmlns') continue;
    out.setAttribute(SVG_ATTR_CASE[name] ?? name, value);
  }
  for (const child of el.childNodes) {
    out.appendChild(child.nodeType === 1 ? toSvgNamespace(child) : child.cloneNode(true));
  }
  return out;
}

function repairInlineSvg(root = document) {
  const broken = [...root.querySelectorAll('svg')].filter((el) => el.namespaceURI !== SVG_NS);
  let repaired = 0;
  for (const el of broken) {
    el.replaceWith(toSvgNamespace(el));
    repaired += 1;
  }
  return repaired;
}

/* ── HTML entities in authored text ─────────────────────────────────────── */
/* Tachyon 26.33 treats a page's text as literal: `&lt;` reaches the DOM as the
 * four characters, not as `<`. These pages carry ~3k entities, almost all of
 * them markup inside code samples, where an entity is the only way to show a
 * tag without the compiler parsing it as a component.
 *
 * Decoding here — after render, into textContent — keeps the authored source
 * valid for the compiler and shows the reader the character they expect.
 * Writing through nodeValue means a decoded `<div>` stays text and is never
 * reparsed as markup. */
const ENTITY_PATTERN = /&(?:#\d+|#x[\da-f]+|[a-z][a-z\d]*);/i;
let entityDecoder = null;

function decodeEntities(text) {
  if (!entityDecoder) entityDecoder = document.createElement('textarea');
  entityDecoder.innerHTML = text;
  return entityDecoder.value;
}

function decodeAuthoredEntities(root = document.querySelector('.docs-page')) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      // Never touch executable or style content.
      const tag = node.parentElement?.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE') return NodeFilter.FILTER_REJECT;
      return ENTITY_PATTERN.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });
  const pending = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) pending.push(node);
  for (const node of pending) node.nodeValue = decodeEntities(node.nodeValue);
}

function enhanceDemos() {
  $$(DEMO_SELECTOR).forEach(demo => {
    if (demo.hasAttribute('w-enhanced')) return;
    if (demo.querySelector('.demo')) { demo.setAttribute('w-enhanced', '1'); return; }

    // Stop at a nested component so one demo never claims another's slots.
    const slotEls = $$('[slot]', demo).filter(el =>
      el.closest('[data-tachyon-component], demo-compare') === demo);
    if (!slotEls.length) return;
    demo.setAttribute('w-enhanced', '1');

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
    block.appendChild(buildOsTabs(preview));
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

  applyDemoOs(storedDemoOs());
}

function enhanceMixedCheckboxes() {
  $$('input[type="checkbox"][data-demo-mixed]').forEach(input => {
    input.indeterminate = true;
    input.setAttribute('aria-checked', 'mixed');
  });
}

function enhanceCalendarDemos() {
  $$('[data-calendar-custom-content]').forEach(calendar => {
    if (calendar.hasAttribute('w-calendar-content-ready')) return;
    calendar.setAttribute('w-calendar-content-ready', '1');
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
  queueMicrotask(() => controlOf($('[w-search-open]'))?.setAttribute('aria-keyshortcuts', 'Meta+K Control+K'));
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
    document.querySelector('[w-dialog="' + name + '"]') ||
    document.querySelector('[w-sheet="' + name + '"]');
}

function openLayer(target) {
  const overlayId = target && target.getAttribute('w-overlay');
  const overlay = overlayId ? document.getElementById(overlayId) : null;
  if (overlay) overlay.classList.add('open');
  target.classList.add('open');
  target.setAttribute('aria-hidden', 'false');
}

function closeLayer(target) {
  if (!target) return;
  target.classList.remove('open');
  target.setAttribute('aria-hidden', 'true');
  const overlayId = target.getAttribute('w-overlay');
  const overlay = overlayId ? document.getElementById(overlayId) : null;
  if (overlay && !document.querySelector('[w-overlay="' + overlayId + '"].open')) overlay.classList.remove('open');
}

function closeLayersForOverlay(overlay) {
  const selector = overlay.id ? '[w-overlay="' + overlay.id + '"].open' : '.w-dialog-wrapper.open, .w-sheet-bottom.open';
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
    const docsMenuToggle = e.target.closest('[w-docs-menu-toggle]');
    if (docsMenuToggle) {
      const sidebar = $('[data-docs-sidebar]');
      setDocsNavigationOpen(!sidebar?.classList.contains('is-open'), true);
      return;
    }

    if (e.target.closest('[w-docs-menu-close]')) {
      setDocsNavigationOpen(false, true);
      return;
    }

    if (e.target.closest('[data-docs-sidebar] a[href]') && docsCompactMedia().matches) {
      setDocsNavigationOpen(false);
    }

    const copy = e.target.closest('.code-copy');
    if (copy) { copyFrom(copy.closest('.code-block')); return; }
    if (e.target.closest('[w-theme-toggle]')) { cycleTheme(); return; }
    if (e.target.closest('[w-search-open]')) { openSearch(); return; }

    const expandToggle = e.target.closest('[w-expand-toggle]');
    if (expandToggle) {
      const key = expandToggle.getAttribute('w-expand-toggle');
      const panel = key
        ? document.getElementById(key) || document.querySelector('[w-expand="' + key + '"]')
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

    const wDialogOpen = e.target.closest('[w-dialog-open]');
    if (wDialogOpen) {
      const target = targetFromAttr(wDialogOpen, 'w-dialog-open');
      if (target) openLayer(target);
      return;
    }

    const wSheetOpen = e.target.closest('[w-sheet-open]');
    if (wSheetOpen) {
      const target = targetFromAttr(wSheetOpen, 'w-sheet-open');
      if (target) openLayer(target);
      return;
    }

    const wClose = e.target.closest('[w-dialog-close], [w-sheet-close]');
    if (wClose) {
      const attr = wClose.hasAttribute('w-dialog-close') ? 'w-dialog-close' : 'w-sheet-close';
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

    const tocLink = e.target.closest('[w-toc-link]');
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
    <div class="api-table-wrap"><table class="w-table api-table" data-api-kind="${kind}" aria-label="${escapeHtml(title)}">
      <thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${rows.map(r => `<tr>${r.map((c, i) =>
        `<td data-label="${escapeHtml(head[i] || '')}">${i === 0 ? `<code>${escapeHtml(c)}</code>` : escapeHtml(c)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></div>
  </div>`;
}

function enhanceApiReference() {
  const page = $('[w-page]');
  const path = currentPath();
  const blocks = API_DATA[path];
  const existing = page && page.querySelector('[w-api]');
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
  wrap.setAttribute('w-api', '');
  wrap.dataset.path = path;
  wrap.innerHTML = `<h2 id="api-reference">API reference</h2>${sections}`;
  page.appendChild(wrap);
}

function enhanceApiTables() {
  $$('table.api-table').forEach((table) => {
    table.classList.add('w-table');
    const labels = $$('thead th', table).map((header) => header.textContent.trim());
    $$('tbody tr', table).forEach((row) => {
      $$('td', row).forEach((cell, index) => {
        if (!cell.hasAttribute('data-label')) {
          cell.setAttribute('data-label', labels[index] || '');
        }
      });
    });

    if (!table.parentElement?.classList.contains('api-table-wrap')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'api-table-wrap';
      table.before(wrapper);
      wrapper.appendChild(table);
    }
  });
}

/* ── All Components catalog (/docs/components) ───────────────────────────── */
/* Built from the sidebar's Components group so the catalog is always complete
   and ordered the same way as the navigation. */
function enhanceComponentsCatalog() {
  const mount = $('[w-components-catalog]');
  if (!mount || mount.hasAttribute('w-built')) return;
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
  mount.setAttribute('w-built', '1');
}

/* ── API Explorer (/docs/components/explorer) ────────────────────────────── */
/* Filterable browser over every component that has an API_DATA entry. */
function enhanceApiExplorer() {
  const mount = $('[w-api-explorer]');
  if (!mount || mount.hasAttribute('w-built')) return;

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
  mount.setAttribute('w-built', '1');
}

/* ── Late-hydration safety net ──────────────────────────────────────────── */
/* Tachyon hydrates page-body components (e.g. <demo-compare>) after the
 * initial render and does not re-fire `tachyon:navigate` for them. Watch the
 * content region and re-run the content-dependent enhancers when it changes.
 * Every enhancer is idempotent, so repeated passes quiesce immediately. */
let contentObserver = null;
let contentRaf = 0;

function runContentEnhancers() {
  repairInlineSvg();
  decodeAuthoredEntities();
  enhanceDemos();
  enhanceMixedCheckboxes();
  enhanceCalendarDemos();
  enhanceApiReference();
  enhanceApiTables();
  enhanceCopyButtons();
  buildTOC();
  if (window.WMotion && typeof window.WMotion.init === 'function') {
    window.WMotion.init(document);
  }
}

function observeContent() {
  // Tac renders in the client, so .docs-main does not exist when this first
  // runs. Fall back to <body> until the shell appears, then re-enhance against
  // the real target — otherwise the observer never attaches and nothing on the
  // page (demos, TOC, pager) is ever enhanced.
  const target = document.querySelector('.docs-main') || document.body;
  if (contentObserver) contentObserver.disconnect();
  if (!target) return;
  if (target === document.body) {
    const shellObserver = new MutationObserver(() => {
      if (!document.querySelector('.docs-main')) return;
      shellObserver.disconnect();
      enhance();
    });
    shellObserver.observe(document.body, { childList: true, subtree: true });
    return;
  }
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
  const markers = document.querySelectorAll('[w-size]');
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
    const bytes = sizes[el.getAttribute('w-size')];
    if (bytes) el.textContent = kb(bytes);
  });
}

function enhance() {
  repairInlineSvg();
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
watchForLateSvg();
window.addEventListener('tachyon:navigate', enhance);
// Tac re-renders a route in place; the previous enhancement is discarded with
// the old DOM, so run again once the new subtree is live.
window.addEventListener('tachyon:rerender', () => requestAnimationFrame(enhance));
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', enhance);
} else {
  enhance();
}
