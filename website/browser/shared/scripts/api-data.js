/* DuVay docs — Web Component API reference data.
 *
 * Centralised so every component page renders a consistent attributes /
 * events / slots / methods reference without per-page authoring. Keyed by
 * docs route; each route lists one or more component blocks.
 *
 * Columns:
 *   attributes: [name, type, default, description]
 *   events:     [name, detail, description]
 *   slots:      [name, description]
 *   methods:    [signature, description]
 */
export const API_DATA = {
  '/docs/animations': [{
    tag: 'WMotion',
    methods: [
      ['enter(el, name)', 'Shows an element with a named transition.'],
      ['leave(el, name)', 'Hides an element with a named transition.'],
      ['toggle(el, open, name)', 'Switches between enter and leave.'],
      ['setExpand(panel, open)', 'Measures and animates expansion-panel height.'],
      ['flip(container, mutate)', 'Runs FLIP animation around a DOM mutation.'],
      ['crossfade(from, to)', 'Animates a cloned shared element between two targets.'],
      ['tween(el, options)', 'Interpolates text, dimensions, transforms, attributes, or CSS variables.'],
      ['spring(el, options)', 'Applies a damped spring-style value animation.'],
    ],
  }],

  '/docs/components/application': [{
    tag: 'w-app',
    attributes: [
      ['theme', 'light | dark | auto | high-contrast', '—', 'Scopes the application theme via data-w-theme.'],
      ['full-height', 'boolean', 'true', 'Fill the viewport height (set "false" to opt out).'],
    ],
    slots: [['default', 'The application shell: app bars, navigation drawers, w-main…']],
  }, {
    tag: 'w-main',
    attributes: [
      ['scrollable', 'boolean', 'false', 'Give the main region its own scroll container.'],
    ],
    slots: [['default', 'Page content.']],
  }, {
    tag: 'w-navigation-drawer',
    attributes: [
      ['open', 'boolean', 'false', 'Controls drawer visibility.'],
      ['permanent', 'boolean', 'false', 'Keeps the drawer visible and prevents dismissal.'],
      ['temporary', 'boolean', 'false', 'Uses off-canvas overlay behavior at every viewport size.'],
      ['rail', 'boolean', 'false', 'Uses the compact rail width.'],
      ['location', 'left | right', 'left', 'Edge from which the drawer opens.'],
      ['label', 'string', 'Navigation', 'Accessible label for the navigation landmark.'],
      ['close-on-navigation', 'boolean', 'true', 'Closes a compact drawer when a link or drawer-close control is activated.'],
    ],
    events: [
      ['toggle', '{ open, reason }', 'Fired whenever drawer visibility changes.'],
      ['close', '{ open, reason }', 'Fired after the drawer closes.'],
    ],
    slots: [['default', 'Drawer navigation content.']],
    methods: [
      ['show()', 'Opens the drawer.'],
      ['close()', 'Closes a non-permanent drawer.'],
      ['toggle()', 'Toggles drawer visibility.'],
    ],
  }, {
    tag: 'w-app-bar-nav-icon',
    attributes: [
      ['for', 'element id', '—', 'Id of the navigation drawer to toggle.'],
      ['aria-label', 'string', 'Open navigation', 'Accessible label while the drawer is closed.'],
    ],
  }],

  '/docs/breadcrumbs': [
    {
      tag: 'w-breadcrumbs',
      attributes: [
        ['items', 'JSON array | semicolon list', '—', 'Data-driven crumbs as { title, text, href, disabled, icon }.'],
        ['divider', 'string', '—', 'Custom separator glyph.'],
        ['icon', 'string', '—', 'Leading icon for every crumb.'],
        ['color', 'string', '—', 'Link color token.'],
        ['active-color', 'string', '—', 'Current-page color token.'],
        ['bg-color', 'string', '—', 'Background color token.'],
        ['density', 'comfortable | compact', '—', 'Vertical padding density.'],
        ['rounded', 'boolean', 'false', 'Rounded container background.'],
        ['disabled', 'boolean', 'false', 'Disables the whole strip.'],
      ],
      slots: [['default', 'w-breadcrumb or w-breadcrumbs-item children, plus optional w-breadcrumbs-divider elements.']],
    },
    {
      tag: 'w-breadcrumb',
      attributes: [
        ['href', 'string', '—', 'Link target.'],
        ['active', 'boolean', 'false', 'Marks the current page crumb.'],
        ['disabled', 'boolean', 'false', 'Makes the crumb non-interactive.'],
        ['icon', 'string', '—', 'Leading icon for this crumb.'],
      ],
      slots: [['default', 'Crumb label.']],
    },
    {
      tag: 'w-breadcrumbs-item',
      attributes: [
        ['href', 'string', '—', 'Link target.'],
        ['active', 'boolean', 'false', 'Marks the current page crumb.'],
        ['disabled', 'boolean', 'false', 'Makes the crumb non-interactive.'],
        ['icon', 'string', '—', 'Leading icon for this crumb.'],
      ],
      slots: [['default', 'Crumb label.']],
    },
    {
      tag: 'w-breadcrumbs-divider',
      slots: [['default', 'Custom separator content for the preceding gap.']],
    },
  ],

  '/docs/buttons': [
    {
      tag: 'w-btn',
      attributes: [
        ['variant', 'filled | tonal | outlined | text | icon | danger | primary-text', 'text', 'Visual style of the button.'],
        ['color', 'string', '—', 'Optional colour modifier combined with the variant (e.g. danger).'],
        ['size', 'xs | sm | lg | xl', '—', 'Button size; omit for the 40px default.'],
        ['href', 'string', '—', 'Renders an anchor instead of a button when set.'],
        ['disabled', 'boolean', 'false', 'Disables interaction.'],
        ['loading', 'boolean', 'false', 'Shows a spinner and blocks pointer interaction.'],
        ['icon', 'string', '—', 'Optional leading icon text or glyph.'],
        ['icon-set', 'string', '—', 'Optional icon-set adapter registered via WIcons.set().'],
        ['active', 'boolean', 'false', 'Marks the button as selected in grouped controls.'],
        ['aria-label', 'string', '—', 'Accessible label, required for icon-only buttons.'],
      ],
      events: [
        ['focus', '—', 'Fired when the control gains focus.'],
        ['blur', '—', 'Fired when the control loses focus.'],
      ],
      slots: [['default', 'Button label and/or icon content.']],
    },
  ],

  '/docs/button-toggles': [
    {
      tag: 'w-btn-toggle',
      attributes: [
        ['value', 'string', '—', 'Selected value, or a comma-separated list when multiple.'],
        ['multiple', 'boolean', 'false', 'Allow more than one button to be selected.'],
        ['mandatory', 'boolean | "force"', 'false', 'Keep at least one selected; "force" also selects the first initially.'],
        ['max', 'number', '—', 'Maximum number of selections in multiple mode.'],
        ['divided', 'boolean', 'false', 'Show separators between buttons.'],
        ['selected-class', 'string', '—', 'Extra class added to selected child buttons.'],
        ['variant', 'string', '—', 'Variant applied to child buttons that do not set their own.'],
        ['color', 'string', '—', 'Colour applied to child buttons that do not set their own.'],
        ['density', 'string', '—', 'Density applied to child buttons that do not set their own.'],
        ['disabled', 'boolean', 'false', 'Disable the whole group.'],
      ],
      events: [
        ['change', '{ value }', 'Fired on selection change (string when single, array when multiple).'],
      ],
      slots: [['default', 'w-btn elements, each optionally carrying a value.']],
    },
    {
      tag: 'w-btn-group',
      attributes: [],
      slots: [['default', 'w-btn elements joined into a single segmented control. Add .w-btn-group--vertical to stack or .w-btn-group--divided for separators.']],
    },
  ],

  '/docs/features/hotkey': [{
    tag: 'w-hotkey',
    attributes: [
      ['keys', 'string', '—', 'Combination; join keys with "+", separate sequential steps with "-".'],
      ['platform', 'mac | pc', 'auto', 'Forces the label style; auto-detected from the browser when omitted.'],
      ['display-mode', 'icon | symbol | text', 'icon', 'Modifier rendering: platform-aware, always glyphs, or always words.'],
      ['variant', 'contained | plain', 'contained', 'Boxed chips or unboxed labels.'],
      ['disabled', 'boolean', 'false', 'Dim and mark the shortcut unavailable.'],
    ],
  }],

  '/docs/features/icon-fonts': [{
    tag: 'w-icon',
    attributes: [
      ['name', 'string', '—', 'Icon name, glyph, or alias reference.'],
      ['size', 'CSS length', '—', 'Inline font-size for the icon.'],
      ['icon-set', 'string', '—', 'Icon-set adapter registered via WIcons.set().'],
      ['icon-class', 'string', 'w-icon', 'CSS class applied to the rendered icon element.'],
    ],
    slots: [['default', 'Fallback content rendered when no name is provided.']],
  }, {
    tag: 'w-svg-icon',
    attributes: [
      ['path', 'SVG path data', '—', 'Path data rendered inside a 24px viewBox by default.'],
      ['view-box', 'string', '0 0 24 24', 'SVG viewBox.'],
      ['size', 'CSS length', '1em', 'Icon font-size.'],
      ['label', 'string', '—', 'Accessible label; omit for decorative icons.'],
    ],
    slots: [['default', 'Custom SVG children when path is omitted.']],
  }, {
    tag: 'w-ligature-icon',
    attributes: [['name', 'string', '—', 'Ligature text.'], ['size', 'CSS length', '—', 'Icon font-size.']],
  }, {
    tag: 'w-class-icon',
    attributes: [['name', 'string', '—', 'CSS class name to apply.'], ['size', 'CSS length', '—', 'Icon font-size.']],
  }, {
    tag: 'w-component-icon',
    attributes: [['label', 'string', '—', 'Accessible label for slotted icon content.']],
    slots: [['default', 'Custom icon component or markup.']],
  }],

  '/docs/inputs': [
    {
      tag: 'w-input',
      attributes: [
        ['type', 'text | search | email | password | number | url | tel | date | time | datetime-local | month | week | color', 'text', 'Native input type.'],
        ['value', 'string', '—', 'Current value.'],
        ['placeholder', 'string', '—', 'Placeholder text.'],
        ['name', 'string', '—', 'Form field name.'],
        ['label', 'string', '—', 'Wraps the input in a labelled field.'],
        ['hint', 'string', '—', 'Helper text shown below the input.'],
        ['error', 'string', '—', 'Error message; also applies the error state.'],
        ['disabled', 'boolean', 'false', 'Disables the input.'],
        ['readonly', 'boolean', 'false', 'Makes the input read-only.'],
        ['size', 'xs | sm | lg | xl', '—', 'Field size; omit for the 40px default.'],
      ],
      events: [
        ['input', '{ value, name }', 'Fired on every keystroke.'],
        ['change', '{ value, name }', 'Fired when the value is committed.'],
      ],
      methods: [['focus()', 'Focuses the underlying input.']],
    },
    {
      tag: 'w-text-field',
      attributes: [
        ['type', 'text | search | email | password | number | url | tel | date | …', 'text', 'Native input type.'],
        ['value', 'string', '—', 'Current value (reflected; also a property).'],
        ['label', 'string', '—', 'Floating label.'],
        ['placeholder', 'string', '—', 'Placeholder text.'],
        ['variant', 'outlined | filled | underlined | plain | solo', 'outlined', 'Visual style.'],
        ['density', 'default | comfortable | compact', 'default', 'Vertical density.'],
        ['size', 'xs | sm | lg | xl', '—', 'Field size; omit for the 40px default.'],
        ['color', 'string', 'primary', 'Token color for the focus accent.'],
        ['prefix / suffix', 'string', '—', 'Static text inside the control.'],
        ['prepend-inner-icon / append-inner-icon', 'string', '—', 'Icon names resolved through the icon registry, rendered inside the control.'],
        ['icon-set', 'string', '—', 'Icon set prefix for the icon attributes.'],
        ['clearable', 'boolean', 'false', 'Show a clear (×) button when non-empty.'],
        ['counter', 'boolean', 'false', 'Show a character counter; pairs with maxlength.'],
        ['loading', 'boolean', 'false', 'Show an indeterminate bar along the bottom edge.'],
        ['hint', 'string', '—', 'Helper text below the control.'],
        ['persistent-hint', 'boolean', 'false', 'Keep the hint visible when not focused.'],
        ['error', 'string', '—', 'Error message; also applies the error state.'],
        ['rounded', 'boolean', 'false', 'Pill-rounded control.'],
        ['single-line', 'boolean', 'false', 'No floating label; label becomes the placeholder.'],
        ['hide-details', 'boolean', 'false', 'Suppress the details row (hint / error / counter).'],
        ['disabled / readonly', 'boolean', 'false', 'State flags.'],
        ['name', 'string', '—', 'Form field name.'],
        ['required / pattern / minlength / maxlength / min / max / step', '—', '—', 'Native HTML5 validation attributes, forwarded to the input.'],
      ],
      slots: [
        ['prepend-inner', 'Content (e.g. an icon) inside the control, leading.'],
        ['append-inner', 'Content inside the control, trailing.'],
      ],
      events: [
        ['input', '{ value, name }', 'Fired on every keystroke.'],
        ['change', '{ value, name }', 'Fired when the value is committed.'],
        ['clear', '{ name }', 'Fired when cleared via the clear button.'],
      ],
      methods: [['focus()', 'Focuses the underlying input.']],
    },
    {
      tag: 'w-input-group',
      attributes: [
        ['label', 'string', '—', 'Optional field label.'],
        ['hint', 'string', '—', 'Helper text below the group.'],
        ['error', 'string', '—', 'Error text and error state.'],
      ],
      slots: [['default', 'Inputs, buttons, and .w-input-group-addon elements.']],
    },
    {
      tag: 'w-textarea',
      attributes: [
        ['value', 'string', '—', 'Current value (reflected; also a property).'],
        ['label', 'string', '—', 'Floating label.'],
        ['placeholder', 'string', '—', 'Placeholder text.'],
        ['rows', 'number', '4', 'Initial visible rows.'],
        ['auto-grow', 'boolean', 'false', 'Grow to fit content instead of scrolling.'],
        ['max-rows', 'number', '—', 'Cap auto-grow at this many rows.'],
        ['no-resize', 'boolean', 'false', 'Disable the manual resize handle.'],
        ['variant', 'outlined | filled | underlined | plain | solo', 'outlined', 'Visual style.'],
        ['density', 'default | comfortable | compact', 'default', 'Vertical density.'],
        ['size', 'xs | sm | lg | xl', '—', 'Field size.'],
        ['color', 'string', 'primary', 'Token color for the focus accent.'],
        ['prefix / suffix', 'string', '—', 'Static text inside the control.'],
        ['prepend-inner-icon / append-inner-icon', 'string', '—', 'Icon names resolved through the icon registry.'],
        ['clearable', 'boolean', 'false', 'Show a clear (×) button when non-empty.'],
        ['counter', 'boolean', 'false', 'Show a character counter; pairs with maxlength.'],
        ['loading', 'boolean', 'false', 'Show an indeterminate bar along the bottom edge.'],
        ['hint / persistent-hint', 'string / boolean', '—', 'Helper text below the control.'],
        ['error', 'string', '—', 'Error message; also applies the error state.'],
        ['hide-details', 'boolean', 'false', 'Suppress the details row.'],
        ['disabled / readonly', 'boolean', 'false', 'State flags.'],
        ['name', 'string', '—', 'Form field name.'],
      ],
      slots: [
        ['prepend-inner', 'Content (e.g. an icon) inside the control, leading.'],
        ['append-inner', 'Content inside the control, trailing.'],
      ],
      events: [
        ['input', '{ value, name }', 'Fired on every keystroke.'],
        ['change', '{ value, name }', 'Fired when the value is committed.'],
        ['clear', '{ name }', 'Fired when cleared via the clear button.'],
      ],
      methods: [['focus()', 'Focuses the underlying textarea.']],
    },
    {
      tag: 'w-select',
      attributes: [
        ['value', 'string', '—', 'Selected option value.'],
        ['name', 'string', '—', 'Form field name.'],
        ['label / hint / error', 'string', '—', 'Field label, helper text, and error state.'],
        ['placeholder', 'string', '—', 'Optional empty first option.'],
        ['size', 'xs | sm | lg | xl', '—', 'Select size; omit for the 40px default.'],
        ['disabled', 'boolean', 'false', 'Disables the select.'],
      ],
      events: [['change', '{ value, name }', 'Fired when selection changes.']],
      slots: [['default', 'w-option children with value attributes.']],
    },
    {
      tag: 'w-native-select',
      attributes: [
        ['value', 'string', '—', 'Selected option value.'],
        ['name', 'string', '—', 'Form field name.'],
        ['label / hint / error', 'string', '—', 'Field label, helper text, and error state.'],
        ['size', 'xs | sm | lg | xl', '—', 'Select size; omit for the default.'],
        ['disabled', 'boolean', 'false', 'Disables the select.'],
      ],
      events: [['change', '{ value, name }', 'Fired when selection changes.']],
      slots: [['default', 'Native option children.']],
    },
    {
      tag: 'w-checkbox',
      attributes: [
        ['checked', 'boolean', 'false', 'Whether the checkbox is checked.'],
        ['indeterminate', 'boolean', 'false', 'Shows the mixed checkbox state until the user changes it.'],
        ['name', 'string', '—', 'Form field name.'],
        ['value', 'string', 'on', 'Submitted value when checked.'],
        ['label', 'string', '—', 'Visible label; omit to use slot content.'],
        ['disabled', 'boolean', 'false', 'Disables the checkbox.'],
      ],
      events: [['change', '{ checked, indeterminate, name, value }', 'Fired when the checkbox toggles.']],
      slots: [['default', 'Label content when label is omitted.']],
    },
    {
      tag: 'w-radio-group',
      attributes: [
        ['name', 'string', 'w-radio-group', 'Native radio name applied to child radios that do not provide one.'],
        ['value', 'string', '—', 'Selected child radio value.'],
        ['label', 'string', '—', 'Visible group label and radiogroup aria-label.'],
        ['disabled', 'boolean', 'false', 'Disables child radio controls.'],
      ],
      events: [['change', '{ value, name }', 'Fired when a child radio is selected.']],
      slots: [['default', 'w-radio children.']],
    },
    {
      tag: 'w-radio',
      attributes: [
        ['checked', 'boolean', 'false', 'Whether the radio is selected.'],
        ['name', 'string', '—', 'Native group name.'],
        ['value', 'string', 'on', 'Radio option value.'],
        ['label', 'string', '—', 'Visible label; omit to use slot content.'],
        ['disabled', 'boolean', 'false', 'Disables the radio.'],
      ],
      events: [['change', '{ checked, name, value }', 'Fired when the radio changes.']],
      slots: [['default', 'Label content when label is omitted.']],
    },
    {
      tag: 'w-switch',
      attributes: [
        ['checked', 'boolean', 'false', 'Whether the switch is on.'],
        ['label', 'string', '—', 'Visible switch label.'],
        ['disabled', 'boolean', 'false', 'Disables the switch.'],
      ],
      slots: [['default', 'Additional label content.']],
    },
    {
      tag: 'w-autocomplete',
      attributes: [
        ['label', 'string', '—', 'Field label.'],
        ['items', 'array<string>', '[]', 'Datalist option values. Legacy comma strings still parse.'],
        ['placeholder', 'string', '—', 'Input placeholder.'],
      ],
    },
    {
      tag: 'w-combobox',
      attributes: [
        ['label / items / placeholder', 'string', '—', 'Same API as w-autocomplete; accepts free text.'],
      ],
    },
    {
      tag: 'w-number-input',
      attributes: [
        ['value', 'number', '0', 'Current value.'],
        ['min / max / step', 'number', '— / — / 1', 'Native numeric constraints.'],
        ['label', 'string', '—', 'Field label.'],
        ['disabled', 'boolean', 'false', 'Disables the input and stepper buttons.'],
      ],
      events: [['change', '{ value }', 'Fired when the number changes.']],
    },
    {
      tag: 'w-file-input',
      attributes: [
        ['label', 'string', 'Choose file', 'Visible upload label.'],
        ['accept', 'array<string>', '[]', 'Native accept filters. Legacy comma strings still parse.'],
        ['multiple', 'boolean', 'false', 'Allows multiple files.'],
        ['disabled', 'boolean', 'false', 'Disables file selection.'],
      ],
      events: [['change', '{ files }', 'Fired when files are selected.']],
    },
    {
      tag: 'w-date-input',
      attributes: [
        ['value', 'YYYY-MM-DD', '—', 'Current date.'],
        ['label', 'string', 'Date', 'Field label.'],
      ],
    },
    {
      tag: 'w-time-picker',
      attributes: [
        ['value', 'HH:mm', '12:00', 'Current time.'],
        ['label', 'string', 'Time', 'Field label.'],
      ],
    },
    {
      tag: 'w-color-input',
      attributes: [
        ['value', 'hex color', '#6750a4', 'Current color.'],
        ['label', 'string', 'Color', 'Field label.'],
      ],
      events: [['change', '{ value }', 'Fired when the color changes.']],
    },
    {
      tag: 'w-range-slider',
      attributes: [
        ['min / max / step', 'number', '0 / 100 / 1', 'Range constraints.'],
        ['start / end', 'number', 'min / max', 'Selected range bounds.'],
        ['label', 'string', '—', 'Field label.'],
      ],
      events: [['input', '{ start, end }', 'Fired while either thumb changes.']],
    },
    {
      tag: 'w-slider',
      attributes: [
        ['min', 'number', '0', 'Minimum value.'],
        ['max', 'number', '100', 'Maximum value.'],
        ['value', 'number', '—', 'Current value.'],
        ['step', 'number', '1', 'Step increment.'],
        ['size', 'xs | sm | lg | xl', '—', 'Slider size; omit for the default.'],
        ['disabled', 'boolean', 'false', 'Disables the slider.'],
      ],
      events: [
        ['input', '{ value, name }', 'Fired while dragging.'],
        ['change', '{ value, name }', 'Fired when the value is committed.'],
      ],
    },
    {
      tag: 'w-otp',
      attributes: [
        ['length', 'number', '6', 'Number of input cells.'],
        ['value', 'string', '—', 'Current code value.'],
        ['disabled', 'boolean', 'false', 'Disables the inputs.'],
      ],
      events: [['input', '{ value }', 'Fired when the code changes.'], ['change', '{ value }', 'Fired when the code is complete.']],
    },
    {
      tag: 'w-otp-input',
      attributes: [
        ['length', 'number', '6', 'Number of input cells.'],
        ['value', 'string', '—', 'Current code value.'],
        ['disabled', 'boolean', 'false', 'Disables the inputs.'],
      ],
      events: [['input', '{ value }', 'Fired when the code changes.'], ['change', '{ value }', 'Fired when the code is complete.']],
    },
  ],

  '/docs/command': [
    {
      tag: 'w-command',
      attributes: [
        ['placeholder', 'string', 'Type a command or search...', 'Search input placeholder.'],
        ['label', 'string', 'Command menu', 'Accessible combobox label.'],
        ['empty', 'string', 'No results found.', 'Empty-state text.'],
      ],
      events: [
        ['input', '{ value }', 'Fired as the command query changes.'],
        ['change', '{ value }', 'Fired when a command item is selected.'],
      ],
      slots: [['default', 'w-command-item children.']],
    },
    {
      tag: 'w-command-item',
      attributes: [
        ['value', 'string', '—', 'Searchable item value.'],
        ['shortcut', 'string', '—', 'Optional shortcut shown at the end.'],
        ['disabled', 'boolean', 'false', 'Disables the item.'],
      ],
      slots: [['default', 'Command item label.']],
    },
    {
      tag: 'w-item',
      attributes: [
        ['title', 'string', '—', 'Primary item text.'],
        ['description', 'string', '—', 'Secondary item text.'],
        ['icon', 'string', '—', 'Leading icon text or glyph.'],
        ['shortcut', 'string', '—', 'Trailing shortcut.'],
        ['disabled', 'boolean', 'false', 'Disables the item.'],
      ],
      slots: [['default', 'Item content when title is omitted.'], ['append', 'Trailing custom content.']],
    },
    {
      tag: 'w-collapsible',
      attributes: [
        ['open', 'boolean', 'false', 'Shows the collapsible content.'],
        ['header', 'string', 'Details', 'Trigger label.'],
        ['disabled', 'boolean', 'false', 'Disables the trigger.'],
      ],
      events: [['toggle', '{ open }', 'Fired when the content opens or closes.']],
      slots: [['default', 'Collapsible body content.']],
    },
  ],

  '/docs/menus': [
    {
      tag: 'w-dropdown-menu',
      attributes: [
        ['open', 'boolean', 'false', 'Shows the menu content.'],
        ['label', 'string', 'Menu', 'Default trigger label.'],
        ['side', 'bottom-start | bottom-end | top-start | top-end', 'bottom-start', 'Menu placement.'],
        ['inline', 'boolean', 'false', 'Renders open content in document flow for contained previews.'],
      ],
      events: [['toggle', '—', 'Fired when opened.'], ['close', '—', 'Fired when closed.']],
      slots: [['trigger', 'Custom trigger content.'], ['default', 'Menu items and separators.']],
    },
    {
      tag: 'w-context-menu',
      attributes: [
        ['open', 'boolean', 'false', 'Shows the context menu.'],
        ['label', 'string', 'Context menu', 'Accessible menu label.'],
      ],
      events: [['toggle', '—', 'Fired on contextmenu open.'], ['close', '—', 'Fired when closed.']],
      slots: [['default', 'Right-click target.'], ['content', 'Menu content.']],
    },
    { tag: 'w-menubar', slots: [['default', 'w-menubar-item children.']] },
    {
      tag: 'w-menubar-item',
      attributes: [['label', 'string', 'Menu', 'Top-level menu label.'], ['open', 'boolean', 'false', 'Shows the submenu.'], ['inline', 'boolean', 'false', 'Renders open content in document flow.']],
      slots: [['default', 'Submenu content.']],
    },
    { tag: 'w-navigation-menu', slots: [['default', 'w-navigation-menu-item children.']] },
    {
      tag: 'w-navigation-menu-item',
      attributes: [['href', 'string', '—', 'Optional link target.'], ['label', 'string', '—', 'Visible label.'], ['active', 'boolean', 'false', 'Marks the active item.']],
      slots: [['default', 'Additional label content.']],
    },
  ],

  '/docs/overlays': [
    {
      tag: 'w-alert-dialog',
      attributes: [
        ['open', 'boolean', 'false', 'Whether the alert dialog is visible.'],
        ['title', 'string', 'Confirm action', 'Dialog title.'],
        ['description', 'string', '—', 'Supporting description.'],
        ['action', 'string', 'Continue', 'Default action label.'],
        ['cancel', 'string', 'Cancel', 'Default cancel label.'],
        ['destructive', 'boolean', 'false', 'Uses danger styling for the action.'],
      ],
      events: [['click', '—', 'Fired when the action is clicked.'], ['cancel', '—', 'Fired when cancel is clicked.'], ['close', '{ reason }', 'Fired when the dialog closes.']],
      slots: [['trigger', 'Activator content that opens the alert dialog.'], ['default', 'Additional body content.'], ['footer', 'Custom footer actions.']],
      methods: [['show()', 'Opens the alert dialog.'], ['close(reason)', 'Closes the alert dialog.']],
    },
    {
      tag: 'w-popover',
      attributes: [['open', 'boolean', 'false', 'Shows the popover.'], ['label', 'string', 'Open', 'Default trigger label.'], ['side', 'string', 'bottom-start', 'Popover placement.'], ['inline', 'boolean', 'false', 'Renders open content in document flow.']],
      events: [['toggle', '—', 'Fired when opened.'], ['close', '—', 'Fired when closed.']],
      slots: [['trigger', 'Custom trigger content.'], ['default', 'Popover panel content.']],
    },
    {
      tag: 'w-hover-card',
      attributes: [['open', 'boolean', 'false', 'Shows the hover card.'], ['side', 'top | bottom-start', 'top', 'Card placement.'], ['inline', 'boolean', 'false', 'Renders open content in document flow.']],
      slots: [['default', 'Hover/focus trigger.'], ['content', 'Hover card content.']],
    },
    {
      tag: 'w-sonner',
      attributes: [['position', 'bottom-center | bottom-right | top-right | inline', 'bottom-center', 'Toast region placement.']],
      slots: [['default', 'Toast/snackbar content.']],
    },
  ],

  '/docs/layout-primitives': [
    {
      tag: 'w-aspect-ratio',
      attributes: [['ratio', 'CSS ratio', '16 / 9', 'Aspect ratio applied to the wrapper.']],
      slots: [['default', 'Media or custom content.']],
    },
    {
      tag: 'w-scroll-area',
      attributes: [['height', 'CSS length', '16rem', 'Maximum scroll height.'], ['orientation', 'vertical | horizontal', 'vertical', 'Scroll orientation.']],
      slots: [['default', 'Scrollable content.']],
    },
    {
      tag: 'w-resizable',
      attributes: [['direction', 'horizontal | vertical', 'horizontal', 'Pane flow direction.']],
      slots: [['default', 'w-resizable-panel children.']],
    },
    {
      tag: 'w-resizable-panel',
      attributes: [['size', 'CSS track size', '1fr', 'Preferred track size.'], ['min', 'CSS length', '10rem', 'Minimum pane size.']],
      slots: [['default', 'Pane content.']],
    },
    {
      tag: 'w-sidebar',
      attributes: [['side', 'left | right', 'left', 'Sidebar edge.'], ['rail', 'boolean', 'false', 'Uses compact rail width.'], ['sticky', 'boolean', 'false', 'Pins in scroll containers.'], ['label', 'string', 'Sidebar', 'Accessible label.']],
      slots: [['default', 'Sidebar navigation content.']],
    },
    {
      tag: 'w-direction',
      attributes: [['dir', 'ltr | rtl | auto', 'ltr', 'Text direction for the wrapper.']],
      slots: [['default', 'Directional content.']],
    },
    {
      tag: 'w-chart',
      attributes: [['title', 'string', 'Chart', 'Chart caption.'], ['values', 'array<number>', '[24,42,36,58,50,72]', 'Bar values. Legacy comma strings still parse.'], ['label', 'string', '—', 'Accessible chart label override.']],
      slots: [['default', 'Optional chart details.']],
    },
  ],

  '/docs/slider': [{
    tag: 'w-slider',
    attributes: [
      ['min', 'number', '0', 'Minimum value.'],
      ['max', 'number', '100', 'Maximum value.'],
      ['value', 'number', 'min', 'Current value (reflected; also a property).'],
      ['step', 'number', '1', 'Increment between values.'],
      ['label', 'string', '—', 'Field label.'],
      ['hint', 'string', 'value', 'Helper text below the track; defaults to the current value.'],
      ['hide-details', 'boolean', 'false', 'Hide the message/value row.'],
      ['thumb-label', 'boolean | always', 'false', 'Show a value bubble over the thumb.'],
      ['ticks', 'boolean', 'false', 'Draw a tick at every step.'],
      ['tick-labels', 'string', '—', 'Pipe-separated labels placed at each step (implies ticks).'],
      ['color', 'string', 'primary', 'Token color for the fill and thumb.'],
      ['track-color', 'string', '—', 'Token color for the unfilled rail.'],
      ['direction', 'horizontal | vertical', 'horizontal', 'Track orientation.'],
      ['reverse', 'boolean', 'false', 'Flip the track so the max is at the start.'],
      ['size', 'xs | sm | lg | xl', '—', 'Slider size; omit for the default.'],
      ['disabled', 'boolean', 'false', 'Non-interactive and dimmed.'],
      ['readonly', 'boolean', 'false', 'Non-interactive without dimming.'],
      ['name', 'string', '—', 'Form field name.'],
    ],
    events: [
      ['input', '{ value, name }', 'Fired while dragging.'],
      ['change', '{ value, name }', 'Fired when the value is committed.'],
    ],
  }],

  '/docs/chips': [{
    tag: 'w-chip',
    attributes: [
      ['selected', 'boolean', 'false', 'Whether the chip is selected.'],
      ['value', 'string', '—', 'Value reported in change events.'],
      ['disabled', 'boolean', 'false', 'Disables the chip.'],
      ['size', 'xs | sm | lg | xl', '—', 'Chip size; omit for the default.'],
      ['variant', 'filled | outlined', '—', 'Visual chip style.'],
      ['color', 'primary | success | danger | warning', '—', 'Semantic colour modifier.'],
      ['removable', 'boolean', 'false', 'Shows a trailing remove affordance.'],
    ],
    events: [
      ['change', '{ selected, value }', 'Fired when the chip is toggled.'],
      ['close', '{ value }', 'Fired when a removable chip is removed.'],
    ],
    slots: [['default', 'Chip label and/or leading icon.']],
  }],

  '/docs/navigation': [
    {
      tag: 'w-breadcrumbs',
      slots: [['default', 'A set of w-breadcrumb or w-breadcrumbs-item elements.']],
    },
    {
      tag: 'w-breadcrumb',
      attributes: [
        ['href', 'string', '—', 'Link target.'],
        ['active', 'boolean', 'false', 'Marks the current page crumb.'],
      ],
      slots: [['default', 'Crumb label.']],
    },
    {
      tag: 'w-breadcrumbs-item',
      attributes: [
        ['href', 'string', '—', 'Link target.'],
        ['active', 'boolean', 'false', 'Marks the current page crumb.'],
      ],
      slots: [['default', 'Crumb label.']],
    },
    {
      tag: 'w-pagination',
      attributes: [
        ['page', 'number', '1', 'Current page.'],
        ['length', 'number', '1', 'Total page count.'],
        ['disabled', 'boolean', 'false', 'Disables pagination controls.'],
      ],
      events: [['change', '{ page }', 'Fired when the active page changes.']],
    },
  ],

  '/docs/grid': [
    {
      tag: 'w-container',
      attributes: [
        ['fluid', 'boolean', 'false', 'Removes the max width so the container spans the available width.'],
        ['fill-height', 'boolean', 'false', 'Stretches the container to the parent height and vertically centers its rows.'],
        ['size', 'sm | md | lg | xl', '—', 'Applies a fixed maximum container width.'],
      ],
      slots: [['default', 'Rows and layout content.']],
    },
    {
      tag: 'w-row',
      attributes: [
        ['no-gutters', 'boolean', 'false', 'Removes horizontal gutters between columns.'],
        ['dense', 'boolean', 'false', 'Uses tighter row gutters.'],
        ['gutter', 'none | xs | sm | md | lg | xl | CSS length', '—', 'Sets row gutter spacing (DuVay extra).'],
        ['align, align-sm … align-xxl', 'start | center | end | baseline | stretch', '—', 'align-items for columns, optionally from a breakpoint up.'],
        ['justify, justify-sm … justify-xxl', 'start | center | end | space-between | space-around | space-evenly', '—', 'justify-content for columns, optionally from a breakpoint up.'],
        ['align-content', 'start | center | end | space-between | space-around | stretch', '—', 'align-content for wrapped rows.'],
      ],
      slots: [['default', 'One or more w-col elements.']],
    },
    {
      tag: 'w-col',
      attributes: [
        ['cols, sm, md, lg, xl, xxl', '1-12 | auto', '—', 'Column span from each breakpoint up (600 / 960 / 1280 / 1920 / 2560px).'],
        ['offset, offset-sm … offset-xxl', '0-11', '—', 'Left offset from each breakpoint up.'],
        ['order, order-sm … order-xxl', '0-12 | first | last', '—', 'Flex order from each breakpoint up.'],
        ['align-self', 'auto | start | center | end | baseline | stretch', '—', 'Per-column cross-axis alignment.'],
      ],
      slots: [['default', 'Column content.']],
    },
    {
      tag: 'w-spacer',
      attributes: [],
      slots: [['default', 'Optional content; the spacer simply grows to fill free space.']],
    },
  ],

  '/docs/lists': [
    {
      tag: 'w-list',
      attributes: [
        ['density', 'compact | comfortable', '—', 'Adjusts list item vertical density.'],
        ['lines', 'one | two | three', 'one', 'Sets the default line height treatment for child items.'],
        ['nav', 'boolean', 'false', 'Applies navigation list spacing and rounded items.'],
        ['selectable', 'boolean', 'false', 'Manages active state among child list items.'],
        ['disabled', 'boolean', 'false', 'Disables selection management.'],
      ],
      events: [['change', '{ value }', 'Fired when a selectable child item is chosen.']],
      slots: [['default', 'List items, subheaders, and dividers.']],
    },
    {
      tag: 'w-list-item',
      attributes: [
        ['title', 'string', '—', 'Primary item text.'],
        ['subtitle', 'string', '—', 'Secondary item text.'],
        ['value', 'string', 'title', 'Value emitted in selection events.'],
        ['href', 'string', '—', 'Renders the item as a link.'],
        ['prepend-icon / append-icon', 'string', '—', 'Leading or trailing icon text / glyph.'],
        ['lines', 'one | two | three', '—', 'Per-item line treatment.'],
        ['density', 'compact | comfortable', '—', 'Per-item density.'],
        ['active / disabled', 'boolean', 'false', 'State flags.'],
      ],
      events: [['change', '{ value, title }', 'Fired when the item is activated.']],
      slots: [
        ['default', 'Custom item content when title is omitted.'],
        ['prepend', 'Custom leading content such as an avatar.'],
        ['append', 'Custom trailing content or action.'],
      ],
    },
    {
      tag: 'w-list-item-title',
      slots: [['default', 'Primary list item text.']],
    },
    {
      tag: 'w-list-item-subtitle',
      slots: [['default', 'Secondary list item text.']],
    },
    {
      tag: 'w-list-subheader',
      slots: [['default', 'Section header text.']],
    },
    {
      tag: 'w-list-group',
      attributes: [
        ['open', 'boolean', 'false', 'Whether the group is expanded.'],
        ['title', 'string', '—', 'Generated activator title.'],
        ['prepend-icon / append-icon', 'string', '—', 'Generated activator icons.'],
        ['subgroup / fluid / disabled', 'boolean', 'false', 'Layout and state flags.'],
      ],
      events: [['toggle', '{ open }', 'Fired when the group opens or closes.']],
      slots: [['activator', 'Custom group activator.'], ['default', 'Nested list content.']],
    },
    {
      tag: 'w-list-group-activator',
      attributes: [
        ['title', 'string', '—', 'Generated activator title.'],
        ['prepend-icon / append-icon', 'string', '—', 'Generated activator icons.'],
        ['expanded / disabled', 'boolean', 'false', 'ARIA expanded state and disabled state.'],
      ],
      slots: [['default', 'Activator content for w-list-group.']],
    },
  ],

  '/docs/tables': [
    {
      tag: 'w-table',
      attributes: [
        ['density', 'compact | comfortable', '—', 'Adjusts table cell padding.'],
        ['striped', 'boolean', 'false', 'Applies alternating row backgrounds.'],
        ['hover', 'boolean', 'false', 'Enables row hover highlighting.'],
        ['grid', 'boolean', 'false', 'Uses the DuVay row / column table structure.'],
        ['responsive', 'auto | stack | scroll', 'auto', 'Stacks labeled cells when its container is narrow, always stacks, or preserves horizontal scrolling.'],
        ['fixed-header', 'boolean', 'false', 'Keeps table headers visible inside the scroll area.'],
        ['height', 'string', '320px', 'Maximum scroll height for fixed-header tables.'],
      ],
      slots: [['default', 'w-row children containing w-col cells; mark the header row with header or .w-table-header.']],
    },
    {
      tag: 'w-data-table-footer',
      slots: [['default', 'Pagination or summary content.']],
    },
    {
      tag: 'w-data-table-headers',
      attributes: [
        ['headers', 'array<string>', '[]', 'Column labels. Legacy comma strings still parse.'],
        ['sort-by', 'string', '—', 'Currently sorted column.'],
        ['sort-desc', 'boolean', 'false', 'Sort direction.'],
      ],
      events: [['change', '{ sortBy, sortDesc }', 'Fired when a sortable header is clicked.']],
    },
    {
      tag: 'w-data-table-row',
      attributes: [['headers', 'array<string>', '[]', 'Column labels.'], ['item', 'JSON object | array | pipe list', '—', 'Row data.']],
      slots: [['default', 'Custom w-col cells when item data is omitted.']],
    },
    {
      tag: 'w-data-table-rows',
      attributes: [['headers', 'array<string>', '[]', 'Column labels.'], ['items', 'JSON array | delimited rows', '[]', 'Rows rendered as w-data-table-row children.']],
    },
  ],

  '/docs/surfaces': [
    {
      tag: 'w-toolbar',
      slots: [['default', 'Toolbar title, actions, and controls.']],
    },
    {
      tag: 'w-toolbar-title',
      slots: [['default', 'Toolbar title text.']],
    },
    {
      tag: 'w-toolbar-items',
      slots: [['default', 'Action buttons or controls aligned to the end.']],
    },
    {
      tag: 'w-app-bar-title',
      slots: [['default', 'App bar title text.']],
    },
    {
      tag: 'w-app-bar-nav-icon',
      attributes: [['aria-label', 'string', 'Open navigation', 'Accessible label for the nav button.']],
    },
    {
      tag: 'w-system-bar',
      attributes: [
        ['color', 'string', '—', 'Semantic token (primary, secondary, success, warning, error, surface) or any CSS color.'],
        ['height', 'number | string', '24 | 32', 'Bar height in px (number) or CSS length. Defaults to 24px (32px when window).'],
        ['window', 'boolean', 'false', 'Taller 32px window-style variant.'],
        ['rounded', 'boolean | string', 'false', 'Border radius: true uses default, or pass sm | md | lg | xl | pill.'],
        ['elevation', 'number', '—', 'Shadow depth 1–5.'],
        ['absolute', 'boolean', 'false', 'Position absolute at the top of its container.'],
      ],
      slots: [['default', 'Status icons, text, or other content.']],
    },
    {
      tag: 'w-divider',
      attributes: [
        ['vertical', 'boolean', 'false', 'Renders a vertical divider.'],
        ['inset', 'boolean', 'false', 'Indents the divider from the start edge.'],
      ],
    },
    {
      tag: 'w-fab',
      attributes: [
        ['icon', 'string', '+', 'Icon text / glyph.'],
        ['icon-set', 'string', '—', 'Optional icon-set adapter registered via WIcons.set().'],
        ['label', 'string', '—', 'Extended FAB label.'],
        ['size', 'sm | lg', '—', 'Optional size.'],
        ['fixed', 'boolean', 'false', 'Uses fixed positioning.'],
        ['position', 'bottom-right | bottom-left', 'bottom-right', 'Fixed placement.'],
      ],
    },
  ],

  '/docs/system-bars': [
    {
      tag: 'w-system-bar',
      attributes: [
        ['color', 'string', '—', 'Semantic token (primary, secondary, success, warning, error, surface) or any CSS color.'],
        ['height', 'number | string', '24 | 32', 'Bar height in px (number) or CSS length. Defaults to 24px (32px when window).'],
        ['window', 'boolean', 'false', 'Taller 32px window-style variant.'],
        ['rounded', 'boolean | string', 'false', 'Border radius: true uses default, or pass sm | md | lg | xl | pill.'],
        ['elevation', 'number', '—', 'Shadow depth 1–5.'],
        ['absolute', 'boolean', 'false', 'Position absolute at the top of its container.'],
      ],
      slots: [['default', 'Status icons, text, or other content.']],
    },
  ],

  '/docs/footers': [
    {
      tag: 'w-footer',
      attributes: [
        ['color', 'string', '—', 'Semantic token (primary, secondary, success, warning, error, surface) or any CSS color.'],
        ['height', 'number | string', '48', 'Footer height in px (number) or CSS length.'],
        ['border', 'boolean', 'false', 'Adds a border on all sides.'],
        ['elevation', 'number', '—', 'Shadow depth 1–5.'],
        ['rounded', 'boolean | string', 'false', 'Border radius: true uses default, or pass sm | md | lg | xl | pill.'],
        ['app', 'boolean', 'false', 'Fixes the footer to the bottom of the viewport.'],
      ],
      slots: [['default', 'Footer content such as links, text, and buttons.']],
    },
  ],

  '/docs/app-bars': [
    {
      tag: 'w-app-bar',
      attributes: [
        ['title', 'string', '—', 'Convenience title rendered as the bar heading.'],
        ['color', 'string', '—', 'Text/foreground color token or CSS color.'],
        ['bg-color', 'string', '—', 'Background color token or CSS color.'],
        ['density', 'prominent | comfortable | compact', '—', 'Bar height preset.'],
        ['flat', 'boolean', 'false', 'Removes the shadow/elevation.'],
        ['elevation', 'number', '—', 'Shadow depth 1–5.'],
        ['extended', 'boolean', 'false', 'Renders the extension slot below the bar.'],
        ['extension-height', 'number | string', '48', 'Height of the extension area.'],
        ['image', 'string', '—', 'Background image URL.'],
        ['sticky', 'boolean', 'false', 'Pins the bar to the top while scrolling.'],
        ['scroll-behavior', 'hide | elevate | collapse | fade-image', '—', 'Effect applied as the page scrolls.'],
        ['scroll-threshold', 'number', '4', 'Pixels scrolled before scroll-behavior activates.'],
        ['collapse', 'boolean', 'false', 'Collapses the bar to an icon-only width.'],
        ['location', 'top | bottom', 'top', 'Edge the bar is anchored to.'],
        ['height', 'number | string', '56', 'Custom bar height.'],
        ['rounded', 'boolean | string', 'false', 'Border radius: true or sm | md | lg | xl | pill.'],
        ['border', 'boolean', 'false', 'Adds a border.'],
      ],
      events: [['scroll', '{ scrolled, behavior, scrollY }', 'Fires when the scrolled state changes (sticky bars).']],
      slots: [['default', 'Bar content (nav icon, title, actions).'], ['extension', 'Content shown in the extension area when extended.']],
    },
    {
      tag: 'w-app-bar-nav-icon',
      attributes: [
        ['for', 'string', '—', 'Id of a w-navigation-drawer to toggle.'],
        ['aria-label', 'string', 'Open navigation', 'Accessible label for the toggle button.'],
      ],
    },
  ],

  '/docs/bottom-navigation': [
    {
      tag: 'w-bottom-navigation',
      attributes: [
        ['value', 'string', '—', 'Value of the active item.'],
        ['color', 'string', '—', 'Active item color token or CSS color.'],
        ['bg-color', 'string', '—', 'Background color token or CSS color.'],
        ['grow', 'boolean', 'false', 'Items fill the bar in equal widths.'],
        ['mode', 'shift', '—', 'Material shift animation: inactive labels hide and the active icon lifts.'],
        ['density', 'comfortable | compact', '—', 'Bar height preset.'],
        ['elevation', 'number', '—', 'Shadow depth 1–5.'],
        ['height', 'number | string', '—', 'Custom bar height.'],
      ],
      events: [['change', '{ value }', 'Fires when the active item changes.']],
      slots: [['default', 'w-bottom-nav-item children.']],
    },
    {
      tag: 'w-bottom-nav-item',
      attributes: [
        ['value', 'string', '—', 'Identifier used for active management.'],
        ['icon', 'string', '—', 'Icon glyph shown above the label.'],
        ['label', 'string', '—', 'Item label text.'],
        ['href', 'string', '—', 'Renders the item as a link.'],
        ['active', 'boolean', 'false', 'Marks the item active.'],
        ['disabled', 'boolean', 'false', 'Disables the item.'],
        ['color', 'string', '—', 'Per-item active color override.'],
      ],
      slots: [['default', 'Additional label content.']],
    },
  ],

  '/docs/navigation-drawers': [
    {
      tag: 'w-navigation-drawer',
      attributes: [
        ['open', 'boolean', 'false', 'Controls drawer visibility.'],
        ['permanent', 'boolean', 'false', 'Always visible; cannot be dismissed.'],
        ['temporary', 'boolean', 'false', 'Off-canvas modal overlay with a scrim.'],
        ['rail', 'boolean', 'false', 'Collapsed icon-only rail width.'],
        ['expand-on-hover', 'boolean', 'false', 'Rail temporarily expands on hover/focus.'],
        ['location', 'left | right', 'left', 'Edge from which the drawer opens.'],
        ['width', 'number | string', '256', 'Drawer width in px (number) or CSS length.'],
        ['floating', 'boolean', 'false', 'Removes borders for an elevated floating look.'],
        ['scrim', 'boolean', 'true', 'Shows the backdrop scrim when open (non-permanent).'],
        ['border', 'boolean', 'false', 'Adds a border.'],
        ['elevation', 'number', '—', 'Shadow depth 1–5.'],
        ['color', 'string', '—', 'Background color token or CSS color.'],
        ['label', 'string', 'Navigation', 'Accessible label for the navigation landmark.'],
        ['close-on-navigation', 'boolean', 'true', 'Closes a compact drawer when a link is activated.'],
      ],
      events: [
        ['toggle', '{ open, reason }', 'Fires whenever drawer visibility changes.'],
        ['close', '{ open, reason }', 'Fires when the drawer closes.'],
      ],
      methods: [
        ['show(reason?)', 'Opens the drawer.'],
        ['close(reason?)', 'Closes the drawer (no-op when permanent).'],
        ['toggle()', 'Toggles the drawer open/closed.'],
      ],
      slots: [['default', 'Drawer navigation content.']],
    },
  ],

  '/docs/floating-action-buttons': [
    {
      tag: 'w-fab',
      attributes: [
        ['icon', 'string', '+', 'Icon glyph resolved through the icon registry.'],
        ['icon-set', 'string', '—', 'Registry icon set for the icon.'],
        ['label', 'string', '—', 'Extended label rendered beside the icon.'],
        ['size', 'x-small | small | default | large | x-large', 'default', 'Button size.'],
        ['variant', 'elevated | flat | tonal | outlined | text | plain', 'elevated', 'Visual style.'],
        ['color', 'string', '—', 'Color token (primary, success, …) or CSS color.'],
        ['rounded', 'boolean | string', '—', 'Border radius: pill | circle | sm | md | lg | xl | 0.'],
        ['location', 'top-start | top-end | bottom-start | bottom-end', '—', 'Corner placement when fixed/absolute.'],
        ['fixed', 'boolean', 'false', 'Pins the FAB to the viewport corner.'],
        ['absolute', 'boolean', 'false', 'Positions the FAB in the nearest positioned ancestor.'],
        ['active', 'boolean', 'false', 'Selected-state styling.'],
        ['aria-label', 'string', 'icon/label', 'Accessible label for the button.'],
      ],
      events: [['click', '{ originalEvent }', 'Fires when the FAB is activated.']],
      slots: [['default', 'Custom button content.']],
    },
  ],

  '/docs/speed-dials': [
    {
      tag: 'w-speed-dial',
      attributes: [
        ['icon', 'string', '+', 'Trigger icon glyph.'],
        ['icon-set', 'string', '—', 'Registry icon set for the trigger icon.'],
        ['open', 'boolean', 'false', 'Whether the actions are revealed.'],
        ['open-on-hover', 'boolean', 'false', 'Opens on mouseenter, closes on mouseleave.'],
        ['location', 'top | bottom | left | right (+ start | end | center)', 'top center', 'Direction the actions fan out.'],
        ['transition', 'scale | slide | fade', 'scale', 'Reveal transition.'],
        ['aria-label', 'string', '—', 'Accessible label for the trigger.'],
      ],
      events: [
        ['toggle', '{ open }', 'Fires when the open state changes.'],
        ['update:open', '{ open }', 'Vuetify-style alias of toggle.'],
      ],
      slots: [['default', 'Action buttons (w-fab) revealed by the speed dial.']],
    },
  ],

  '/docs/paginations': [
    {
      tag: 'w-pagination',
      attributes: [
        ['length', 'number', '1', 'Total number of pages.'],
        ['page', 'number', '1', 'The current page (model value).'],
        ['total-visible', 'number', '0', 'Max page buttons before the middle collapses with an ellipsis.'],
        ['start', 'number', '1', 'Starting page number.'],
        ['show-first-last-page', 'boolean', 'false', 'Renders first («) and last (») buttons.'],
        ['first-icon | last-icon | prev-icon | next-icon', 'string', '« » ‹ ›', 'Custom navigation glyphs.'],
        ['ellipsis', 'string', '…', 'Truncation indicator string.'],
        ['variant', 'text | flat | tonal | outlined | elevated', 'text', 'Page button style.'],
        ['size', 'x-small | small | default | large | x-large', 'default', 'Control size.'],
        ['rounded', 'string', '—', 'circle | pill for fully rounded buttons.'],
        ['color', 'string', '—', 'Hover/non-active color token.'],
        ['active-color', 'string', '—', 'Active page color token.'],
        ['density', 'comfortable | compact', '—', 'Control density.'],
        ['border', 'boolean', 'false', 'Adds a border to page items.'],
        ['disabled', 'boolean', 'false', 'Disables all controls.'],
      ],
      events: [
        ['change', '{ page }', 'Fires when the page changes.'],
        ['update:modelValue', '{ page }', 'Vuetify-style alias of change.'],
        ['first | prev | next | last', '{ page }', 'Directional navigation events.'],
      ],
    },
  ],

  '/docs/steppers': [
    {
      tag: 'w-stepper',
      attributes: [
        ['value', 'string', 'first step', 'The active step’s value.'],
        ['editable', 'boolean', 'false', 'Every step header is clickable.'],
        ['non-linear', 'boolean', 'false', 'Steps may be visited in any order.'],
        ['alt-labels', 'boolean', 'false', 'Space labels beneath the indicators.'],
        ['vertical', 'boolean', 'false', 'Stack steps vertically.'],
      ],
      events: [['change', '{ value }', 'Fires when the active step changes.']],
      slots: [['default', 'w-stepper-header (w-step headers), an optional w-stepper-window, and an optional w-stepper-actions.']],
    },
    {
      tag: 'w-step',
      attributes: [
        ['value', 'string', '—', 'Step indicator label / value.'],
        ['label', 'string', '—', 'Step title.'],
        ['caption', 'string', '—', 'Secondary helper text.'],
        ['state', 'active | done | error', '—', 'Visual state (usually driven by w-stepper).'],
        ['complete', 'boolean', 'false', 'Mark the step complete (✓).'],
        ['error', 'boolean', 'false', 'Mark the step in error (!).'],
      ],
    },
    { tag: 'w-stepper-item', slots: [['default', 'Alias of w-step.']] },
    { tag: 'w-stepper-header', slots: [['default', 'The row of w-step headers.']] },
    { tag: 'w-stepper-window', slots: [['default', 'A set of w-stepper-window-item panels (driven by the active step).']] },
    {
      tag: 'w-stepper-window-item',
      attributes: [['value', 'string', '—', 'Window item value.']],
      slots: [['default', 'Panel content.']],
    },
    {
      tag: 'w-stepper-actions',
      attributes: [
        ['prev-text', 'string', 'Back', 'Label for the back button.'],
        ['next-text', 'string', 'Next', 'Label for the next button.'],
      ],
      slots: [['default', 'Optional [data-stepper-action="prev|next"] buttons (auto-rendered if omitted).']],
    },
  ],

  '/docs/vertical-steppers': [
    {
      tag: 'w-stepper-vertical',
      attributes: [
        ['value', 'string', 'first step', 'The active step’s value.'],
        ['editable', 'boolean', 'false', 'Every step header is clickable.'],
        ['non-linear', 'boolean', 'false', 'Steps may be visited in any order.'],
      ],
      events: [['change', '{ value }', 'Fires when the active step changes.']],
      slots: [['default', 'A set of w-stepper-vertical-item elements.']],
    },
    {
      tag: 'w-stepper-vertical-item',
      attributes: [
        ['value', 'string', '—', 'Step value (defaults to its position).'],
        ['title', 'string', '—', 'Step title (alias: label).'],
        ['caption', 'string', '—', 'Secondary helper text.'],
        ['complete', 'boolean', 'false', 'Mark complete (✓).'],
        ['error', 'boolean', 'false', 'Mark in error (!).'],
      ],
      slots: [['default', 'The step’s panel content, shown while the step is active.']],
    },
  ],

  '/docs/windows': [
    {
      tag: 'w-window',
      attributes: [
        ['value', 'number', '0', 'Index of the visible panel.'],
        ['show-arrows', 'boolean', 'false', 'Render prev/next arrows.'],
        ['continuous', 'boolean', 'false', 'Loop from the last panel to the first.'],
        ['direction', 'horizontal | vertical', 'horizontal', 'Slide axis.'],
        ['crossfade', 'boolean', 'false', 'Fade panels instead of sliding.'],
        ['reverse', 'boolean', 'false', 'Flip the slide direction.'],
        ['touch', 'boolean', 'true', 'Allow swipe navigation.'],
        ['disabled', 'boolean', 'false', 'Block navigation and dim the window.'],
        ['prev-icon / next-icon', 'string', '—', 'Custom arrow glyphs.'],
        ['selected-class', 'string', '—', 'Extra class added to the active item.'],
        ['height', 'string', '—', 'Fixed window height.'],
      ],
      events: [['change', '{ value }', 'Fires when the visible panel changes.']],
      slots: [['default', 'A set of w-window-item panels.']],
    },
    { tag: 'w-window-item', slots: [['default', 'Panel content.']] },
  ],

  '/docs/chip-groups': [
    {
      tag: 'w-chip-group',
      attributes: [
        ['value', 'string', '—', 'Selected value, or a comma list when multiple.'],
        ['multiple', 'boolean', 'false', 'Allow several chips selected.'],
        ['mandatory', 'boolean', 'false', 'Keep at least one chip selected.'],
        ['max', 'number', '—', 'Maximum number of selections in multiple mode.'],
        ['column', 'boolean', 'false', 'Stack chips vertically.'],
        ['filter', 'boolean', 'false', 'Prefix selected chips with a check mark.'],
        ['selected-class', 'string', 'selected', 'Class added to selected chips.'],
        ['variant', 'string', '—', 'Variant applied to chips that don’t set their own.'],
        ['color', 'string', '—', 'Colour applied to chips that don’t set their own.'],
        ['disabled', 'boolean', 'false', 'Disable the whole group.'],
      ],
      events: [['change', '{ value }', 'Fires on selection change (string single / array multiple).']],
      slots: [['default', 'w-chip elements, each optionally carrying a value.']],
    },
  ],

  '/docs/components/item-groups': [
    {
      tag: 'w-item-group',
      attributes: [
        ['value', 'string', '—', 'Selected value(s); a JSON array in multiple mode.'],
        ['multiple', 'boolean', 'false', 'Allow several items selected.'],
        ['mandatory', 'boolean', 'false', 'Keep at least one item selected.'],
        ['max', 'number', '—', 'Maximum selections in multiple mode.'],
        ['selected-class / active-class', 'string', 'active', 'Class added to selected items.'],
        ['disabled', 'boolean', 'false', 'Disable the whole group.'],
      ],
      events: [['change', '{ value }', 'Fires on selection change (string single / array multiple).']],
      slots: [['default', 'Selectable children carrying a value/data-value (or addressed by index).']],
    },
  ],

  '/docs/components/slide-groups': [
    {
      tag: 'w-slide-group',
      attributes: [
        ['value', 'string', '—', 'Selected value(s).'],
        ['multiple', 'boolean', 'false', 'Allow several items selected.'],
        ['mandatory', 'boolean', 'false', 'Keep at least one item selected.'],
        ['max', 'number', '—', 'Maximum selections in multiple mode.'],
        ['center-active', 'boolean', 'false', 'Scroll the active item to centre.'],
        ['show-arrows', 'boolean | always', 'false', 'Show scroll arrows.'],
        ['direction', 'horizontal | vertical', 'horizontal', 'Scroll axis.'],
        ['prev-icon / next-icon', 'string', '—', 'Custom arrow glyphs.'],
        ['selected-class', 'string', '—', 'Class added to selected items.'],
        ['disabled', 'boolean', 'false', 'Disable the whole group.'],
      ],
      events: [['change', '{ value }', 'Fires on selection change.']],
      slots: [['default', 'A set of w-slide-group-item elements.']],
    },
    {
      tag: 'w-slide-group-item',
      attributes: [['value', 'string', '—', 'Item value.'], ['disabled', 'boolean', 'false', 'Disable this item.']],
      slots: [['default', 'Item content (e.g. a w-btn or w-chip).']],
    },
  ],

  '/docs/components/treeview': [
    {
      tag: 'w-treeview',
      attributes: [
        ['items', 'string', '—', 'JSON array of { title, value, children } nodes, or a semicolon list of A>B>C paths.'],
        ['item-title', 'string', 'title', 'Node object key used for the row label.'],
        ['item-value', 'string', 'value', 'Node object key used for the value.'],
        ['item-children', 'string', 'children', 'Node object key used for nested children.'],
        ['activatable', 'boolean', 'false', 'Rows highlight and report an activated value.'],
        ['activated', 'string', '—', 'Activated value, or a JSON array with multiple-active. Reflected.'],
        ['multiple-active', 'boolean', 'false', 'Allow more than one active row at once.'],
        ['selectable', 'boolean', 'false', 'Render checkboxes and report a selected array.'],
        ['selected', 'string', '—', 'JSON array of selected values. Reflected.'],
        ['select-strategy', 'leaf | independent | classic', 'leaf', 'Cascade behaviour for selection.'],
        ['opened', 'string', '—', 'JSON array of open node values. Reflected.'],
        ['open-all', 'boolean', 'false', 'Expand every branch.'],
        ['open-on-click', 'boolean', 'false', 'Expand/collapse a branch by clicking its row.'],
        ['density', 'compact | comfortable', '—', 'Row density.'],
        ['hoverable', 'boolean', 'false', 'Rows highlight on hover.'],
        ['rounded', 'boolean', 'false', 'Pill-rounded rows.'],
        ['color', 'string', 'primary', 'Accent color for active and selected rows.'],
        ['disabled', 'boolean', 'false', 'Non-interactive and dimmed.'],
        ['expand-icon', 'string', '›', 'Glyph for the branch toggle.'],
      ],
      events: [['change', '{ value, name, id }', 'Fires when state changes; name is opened, activated, or selected.']],
      slots: [['default', 'Used only when no items attribute is supplied.']],
    },
  ],

  '/docs/components/virtual-scroller': [
    {
      tag: 'w-virtual-scroll',
      attributes: [
        ['items', 'string', '—', 'JSON/comma array of strings or objects to virtualise.'],
        ['item-height', 'number', '—', 'Fixed row height in px (fast path). Omit for dynamically measured rows.'],
        ['height', 'number | string', '240px', 'Scroll-area height — a px number or any CSS length.'],
        ['item-title', 'string', 'title', 'Object key used for each row’s text when items are objects.'],
        ['overscan', 'number', '3', 'Extra rows rendered above and below the viewport.'],
      ],
      methods: [
        ['scrollToIndex(index)', 'Scroll so the item at index sits at the top of the viewport.'],
        ['calculateVisibleItems()', 'Recompute and re-render the visible window.'],
      ],
      events: [['scroll', '{ start, end }', 'Fired while scrolling with the rendered index range.']],
      slots: [['default', 'Used only when no items attribute is supplied.']],
    },
  ],

  '/docs/components/carousels': [
    {
      tag: 'w-carousel',
      attributes: [
        ['value', 'number', '0', 'Active slide index.'],
        ['cycle', 'boolean', 'false', 'Auto-advance slides.'],
        ['interval', 'number', '6000', 'Auto-advance delay (ms).'],
        ['height', 'string', '—', 'Carousel height.'],
        ['show-arrows', 'boolean | hover', 'true', 'Show prev/next arrows (or only on hover).'],
        ['continuous', 'boolean', 'true', 'Loop past the ends.'],
        ['progress', 'boolean | color', 'false', 'Show a progress bar.'],
        ['hide-delimiters', 'boolean', 'false', 'Hide the dot delimiters.'],
        ['hide-delimiter-background', 'boolean', 'false', 'Remove the delimiter backdrop.'],
        ['vertical-delimiters', 'left | right', '—', 'Stack delimiters on a side rail.'],
        ['delimiter-icon', 'string', '—', 'Custom delimiter glyph.'],
        ['transition', 'slide | fade', 'slide', 'Slide change animation.'],
        ['color', 'string', '—', 'Accent colour for controls.'],
        ['touch', 'boolean', 'true', 'Allow swipe navigation.'],
      ],
      events: [['change', '{ value }', 'Fires when the active slide changes.']],
      slots: [['default', 'A set of w-carousel-item slides.']],
    },
    {
      tag: 'w-carousel-item',
      attributes: [
        ['src', 'string', '—', 'Image source.'],
        ['alt', 'string', '—', 'Image alt text.'],
        ['cover', 'boolean', 'false', 'Cover-fit the image.'],
      ],
      slots: [['default', 'Slide content overlaid on the image.']],
    },
  ],

  '/docs/timelines': [
    {
      tag: 'w-timeline',
      attributes: [
        ['align', 'start | center', 'start', 'Left rail (start) or alternating (center).'],
        ['side', 'start | end', '—', 'Force every item to one side.'],
        ['density', 'default | compact', 'default', 'Compact hides the opposite column.'],
        ['direction', 'vertical | horizontal', 'vertical', 'Timeline orientation.'],
        ['dot-color', 'token | CSS color', '—', 'Default dot color for items.'],
        ['line-color', 'token | CSS color', '—', 'Connecting line color.'],
        ['line-thickness', 'number', '2', 'Line width in px.'],
        ['line-inset', 'number', '0', 'Gap between the dot and the line.'],
        ['truncate-line', 'start | end | both', '—', 'Trim the line past the end dots.'],
        ['size', 'x-small … x-large | number', '—', 'Default dot size.'],
        ['fill-dot', 'boolean', 'false', 'Solid dots by default.'],
      ],
      slots: [['default', 'A set of w-timeline-item elements.']],
    },
    {
      tag: 'w-timeline-item',
      attributes: [
        ['title', 'string', '—', 'Item title.'],
        ['time', 'string', '—', 'Opposite-side label (or use the opposite slot).'],
        ['dot', 'filled | outlined', 'filled', 'Legacy dot fill.'],
        ['fill-dot', 'boolean', 'false', 'Solid dot.'],
        ['hide-dot', 'boolean', 'false', 'Render without a dot.'],
        ['icon', 'string', '—', 'Glyph rendered inside the dot.'],
        ['dot-color', 'token | CSS color', '—', 'Dot color.'],
        ['size', 'x-small … x-large | number', '—', 'Dot size.'],
        ['side', 'start | end', '—', 'Force this item to one side (align="center").'],
      ],
      slots: [['default', 'Timeline body.'], ['opposite', 'Content on the opposite side of the line.']],
    },
  ],

  '/docs/components/data-tables/introduction': [
    {
      tag: 'w-data-table',
      attributes: [
        ['headers', 'JSON [{title,key,align,sortable,width}] | "A,B" list', '—', 'Column definitions.'],
        ['items', 'JSON array | "a|b; c|d" rows', '—', 'Row data.'],
        ['item-value', 'string', '—', 'Key used as a row identity for selection.'],
        ['sort-by / sort-desc', 'string / boolean', '—', 'Initial sort column and direction.'],
        ['multi-sort', 'boolean', 'false', 'Allow sorting by several columns.'],
        ['search', 'string', '—', 'Case-insensitive filter across all cells.'],
        ['page', 'number', '1', 'Current page (1-based).'],
        ['items-per-page', 'number', '10', 'Page size (-1 shows all).'],
        ['items-per-page-options', 'comma list', '10,25,50,-1', 'Per-page select options.'],
        ['show-select', 'boolean', 'false', 'Render a selection checkbox column.'],
        ['select-strategy', 'page | all | single', 'page', 'Selection behavior.'],
        ['selected', 'comma list', '—', 'Selected row identities (reflected).'],
        ['show-expand', 'boolean', 'false', 'Render an expand toggle column.'],
        ['loading', 'boolean', 'false', 'Show the loading bar.'],
        ['no-data-text / loading-text', 'string', '—', 'Empty and loading messages.'],
        ['density', 'default | comfortable | compact', 'default', 'Row density.'],
        ['striped / hover', 'boolean', 'false', 'Row styling.'],
        ['fixed-header', 'boolean', 'false', 'Sticky header (pair with height).'],
        ['height', 'CSS length', '—', 'Scroll-area height.'],
      ],
      events: [
        ['update:options', '{ page, itemsPerPage, sortBy, sortDesc }', 'Page, size, or sort changed.'],
        ['update:selected', '{ selected }', 'Selection changed.'],
        ['update:expanded', '{ expanded }', 'Expansion changed.'],
      ],
    },
  ],

  '/docs/components/data-tables/server-side-tables': [
    {
      tag: 'w-data-table-server',
      attributes: [
        ['items', 'JSON array | rows', '—', 'The current page, prepared by the server.'],
        ['items-length', 'number', '—', 'Total server row count (drives the footer).'],
        ['loading', 'boolean', 'false', 'Show the loading bar during fetches.'],
        ['…', '—', '—', 'Plus all w-data-table attributes (headers, page, items-per-page, show-select, …).'],
      ],
      events: [
        ['update:options', '{ page, itemsPerPage, sortBy, sortDesc }', 'Fetch the matching slice in response.'],
        ['update:selected', '{ selected }', 'Selection changed.'],
      ],
    },
  ],

  '/docs/components/data-tables/virtual-tables': [
    {
      tag: 'w-data-table-virtual',
      attributes: [
        ['height', 'CSS length', '400px', 'Scroll-area height.'],
        ['item-height', 'number', '48', 'Uniform row height in px.'],
        ['…', '—', '—', 'Plus headers, items, search, sort-by/sort-desc from w-data-table.'],
      ],
      events: [['update:options', '{ sortBy, sortDesc }', 'Sort changed.']],
    },
  ],

  '/docs/components/infinite-scroller': [
    {
      tag: 'w-infinite-scroll',
      attributes: [
        ['mode', 'intersect | manual', 'intersect', 'Auto-load on scroll, or via a Load-more button.'],
        ['side', 'end | start | both', 'end', 'Which edge triggers loading.'],
        ['direction', 'vertical | horizontal', 'vertical', 'Scroll axis.'],
        ['color', 'string', 'primary', 'Token / CSS color for the spinner.'],
        ['height', 'CSS length', '260px', 'Scroll-area size (max-height / max-width).'],
        ['margin', 'number', '96', 'Intersection margin in px before the edge.'],
        ['disabled', 'boolean', 'false', 'Stop emitting load events.'],
        ['status', 'idle | loading | empty | error', 'idle', 'Current state (reflected).'],
        ['load-more-text / loading-text / empty-text / error-text', 'string', '—', 'Override the built-in labels.'],
      ],
      events: [
        ['load', '{ side, done }', 'Call done("ok" | "empty" | "error") when the fetch settles.'],
      ],
      methods: [
        ['complete(status)', 'Programmatically settle the current load.'],
        ['reset()', 'Return to idle and re-arm the observers.'],
      ],
      slots: [['default', 'The scrollable content.']],
    },
    {
      tag: 'w-infinite-scroll-intersect',
      attributes: [['side', 'start | end', 'end', 'Reported side when the sentinel scrolls into view.']],
      events: [['load', '{ side }', 'Fired when the sentinel intersects the viewport.']],
    },
  ],

  '/docs/components/sparklines': [
    {
      tag: 'w-sparkline',
      attributes: [
        ['values', 'comma list | JSON array', '—', 'Numbers to plot.'],
        ['type', 'trend | bar', 'trend', 'Line chart or bar chart.'],
        ['fill', 'boolean', 'false', 'Shade the area under a trend line.'],
        ['smooth', 'boolean | number', 'false', 'Round trend corners (number sets tension).'],
        ['color', 'string', 'primary', 'Token name or CSS color for the stroke / bars.'],
        ['gradient', 'comma list of colors', '—', 'Gradient stroke / bars (overrides color).'],
        ['gradient-direction', 'left | right | top | bottom', 'left', 'Gradient axis.'],
        ['line-width', 'number', '4', 'Trend stroke width.'],
        ['padding', 'number', '4', 'Inset around the plot (viewBox units).'],
        ['min / max', 'number', '—', 'Clamp the value range (defaults to data extent).'],
        ['labels', 'comma list', '—', 'Captions drawn under each point / bar.'],
        ['show-labels', 'boolean', 'false', 'Draw the values themselves as labels.'],
        ['label-size', 'number', '6', 'Label font size (viewBox units).'],
        ['auto-draw', 'boolean', 'false', 'Animate the trend drawing on load.'],
        ['auto-draw-duration', 'number (ms)', '1000', 'Auto-draw duration.'],
        ['label', 'string', 'Sparkline', 'Accessible label.'],
      ],
    },
  ],

  '/docs/components/data-iterators': [
    {
      tag: 'w-data-iterator',
      attributes: [
        ['items', 'JSON array | "a|b|c; …" rows', '—', 'Records to render.'],
        ['page', 'number', '1', 'Current page (1-based).'],
        ['items-per-page', 'number', '6', 'Page size.'],
        ['items-per-page-options', 'comma list', '—', 'Renders a per-page select, e.g. "3,6,12".'],
        ['search', 'string', '—', 'Case-insensitive filter across all fields.'],
        ['sort-by', 'string', '—', 'Field to sort by (title | subtitle | meta | key).'],
        ['sort-desc', 'boolean', 'false', 'Sort descending.'],
        ['loading', 'boolean', 'false', 'Show skeleton placeholders.'],
        ['no-data-text', 'string', 'No data available', 'Message when nothing matches.'],
        ['title-field / subtitle-field / meta-field', 'string', 'title / subtitle / meta', 'Record keys for each card line.'],
      ],
      slots: [['default', 'Custom content shown when items is empty.']],
      events: [
        ['change', '{ value: page }', 'Fired when the page changes.'],
        ['update', '{ page, itemsPerPage }', 'Fired when the page size changes.'],
      ],
    },
  ],

  '/docs/components/confirm-edit': [
    {
      tag: 'w-confirm-edit',
      attributes: [
        ['value', 'string', '—', 'Committed value (reflected; also a property).'],
        ['label', 'string', 'Editable value', 'Label for the built-in editor.'],
        ['placeholder', 'string', '—', 'Placeholder for the built-in editor.'],
        ['cancel-text', 'string', 'Cancel', 'Cancel button label.'],
        ['ok-text', 'string', 'Save', 'OK button label (save-text is an alias).'],
        ['disabled', 'boolean', 'false', 'Disable the actions and the built-in editor.'],
        ['hide-actions', 'boolean', 'false', 'Do not render the built-in action buttons.'],
      ],
      slots: [
        ['default', 'A custom editor control bound to value (omit for a built-in input).'],
        ['actions', 'Custom action buttons; mark them data-save / data-cancel.'],
      ],
      events: [
        ['save', '{ value }', 'Fired when the edit is committed (also fires change).'],
        ['cancel', '{ value }', 'Fired when the edit is reverted.'],
      ],
      methods: [
        ['save()', 'Commit the current edit.'],
        ['cancel()', 'Revert to the original value.'],
      ],
    },
  ],


  '/docs/color-pickers': [
    {
      tag: 'w-color-picker',
      attributes: [
        ['value', 'string (hex)', '#6750a4', 'Current colour; reflected as you pick.'],
        ['swatches', 'string', '—', 'Comma-separated hex preset palette.'],
        ['show-alpha', 'boolean', 'false', 'Show alpha slider and emit 8-digit hex values when transparent.'],
        ['alpha', 'number', '1', 'Current alpha channel, from 0 to 1.'],
        ['hide-canvas', 'boolean', 'false', 'Show only the swatches.'],
        ['disabled', 'boolean', 'false', 'Lock the picker.'],
      ],
      events: [
        ['change', '{ value }', 'Fired when the colour changes.'],
      ],
    },
  ],

  '/docs/date-pickers': [
    {
      tag: 'w-date-picker',
      attributes: [
        ['value', 'YYYY-MM-DD', '—', 'Selected date.'],
        ['month', 'number', 'current', 'Displayed month.'],
        ['year', 'number', 'current', 'Displayed year.'],
        ['min', 'string (ISO date)', '—', 'Earliest selectable date.'],
        ['max', 'string (ISO date)', '—', 'Latest selectable date.'],
        ['view', 'date | months | years', 'date', 'Controls which picker panel is visible.'],
        ['hide-header', 'boolean', 'false', 'Hides the large title header for compact popups.'],
        ['mode', 'single | multiple | range', 'single', 'Selection mode.'],
      ],
      events: [['change', '{ value }', 'Fired when a date is selected.']],
    },
    {
      tag: 'w-date-picker-header',
      attributes: [['header', 'string', '—', 'Header text.'], ['append-icon', 'string', '—', 'Optional append button glyph.']],
      events: [['click', 'MouseEvent', 'Native click events bubble from header controls.']],
      slots: [['prepend', 'Leading header content.'], ['default', 'Header content.'], ['append', 'Trailing header content.']],
    },
  ],

  '/docs/time-pickers': [
    {
      tag: 'w-time-picker',
      attributes: [
        ['value', 'string (HH:MM)', '12:00', 'Selected time, always emitted in 24-hour format.'],
        ['label', 'string', 'Time', 'Field label.'],
        ['title', 'string', 'Select time', 'Header title.'],
        ['format', 'ampm | 24hr', 'ampm', 'Clock-hour presentation.'],
        ['view / view-mode', 'hours | minutes | seconds', 'hours', 'Active clock face. Vuetify aliases hour/minute/second are accepted.'],
        ['period', 'am | pm', 'derived', 'Controls the active period in AM/PM mode.'],
        ['use-seconds', 'boolean', 'false', 'Adds a seconds column and emits HH:MM:SS.'],
        ['scrollable', 'boolean', 'false', 'Allows wheel changes on the active clock face.'],
        ['allowed-hours', 'array<number>', '[]', 'Allowed hour values, supplied as a JSON array.'],
        ['allowed-minutes', 'array<number>', '[]', 'Allowed minute values, supplied as a JSON array.'],
        ['allowed-seconds', 'array<number>', '[]', 'Allowed second values, supplied as a JSON array.'],
        ['min', 'string (HH:MM)', '00:00', 'Minimum allowed time.'],
        ['max', 'string (HH:MM)', '23:59', 'Maximum allowed time.'],
        ['color', 'string', 'primary', 'Active clock, hand, field, and period color.'],
        ['elevation', '0-6', '1', 'Shadow elevation.'],
        ['width', 'CSS length', '20.5rem', 'Picker width.'],
        ['density', 'compact | comfortable', 'default', 'Adjusts picker spacing.'],
        ['hide-header', 'boolean', 'false', 'Hides the title header.'],
        ['ampm-in-title', 'boolean', 'false', 'Appends AM or PM to the title.'],
        ['variant', 'dial | input', 'dial', 'Uses clock display buttons or editable numeric fields.'],
        ['readonly', 'boolean', 'false', 'Prevents interaction without disabled styling.'],
        ['disabled', 'boolean', 'false', 'Prevents interaction and dims the picker.'],
      ],
      events: [
        ['change', '{ value }', 'Fired when the selected time changes.'],
        ['input', '{ field, value }', 'Fired when the active field changes.'],
      ],
    },
  ],

  '/docs/ratings': [
    {
      tag: 'w-rating',
      attributes: [
        ['value', 'number', '0', 'Selected rating. Reflected after interaction (alias: model-value).'],
        ['length', 'number', '5', 'Number of rating items.'],
        ['name', 'string', '—', 'Name of the synchronized hidden form input.'],
        ['label', 'string', 'Rating', 'Accessible radiogroup label.'],
        ['item-aria-label', 'string template', '{value} of {length}', 'Accessible label for each selectable value.'],
        ['item-labels', 'array<string>', '[]', 'Visible labels supplied as a JSON array.'],
        ['item-label-position', 'top | bottom', 'top', 'Places item labels above or below their icons.'],
        ['half-increments', 'boolean', 'false', 'Allows selection in half-step increments.'],
        ['clearable', 'boolean', 'false', 'Selecting the active value resets the rating to zero.'],
        ['hover', 'boolean', 'false', 'Previews the pointed value without committing it.'],
        ['readonly', 'boolean', 'false', 'Prevents changes while keeping the rating readable.'],
        ['disabled', 'boolean', 'false', 'Disables controls and applies disabled emphasis.'],
        ['empty-icon', 'icon name | glyph', 'outlined star', 'Icon registry value or text glyph for empty items.'],
        ['full-icon', 'icon name | glyph', 'filled star', 'Icon registry value or text glyph for filled items.'],
        ['color', 'token | CSS color', 'divider', 'Color used by empty items.'],
        ['active-color', 'token | CSS color', 'warning', 'Color used by filled items.'],
        ['size', 'x-small | small | default | large | x-large | CSS length', 'default', 'Visual icon size. DuVay xs/sm/md/lg/xl aliases are accepted.'],
        ['density', 'default | comfortable | compact', 'default', 'Spacing between rating items.'],
        ['ripple', 'boolean', 'false', 'Adds press feedback to each item.'],
        ['tag', 'div | span | section', 'div', 'HTML element used for the radiogroup root.'],
        ['theme', 'light | dark | auto | high-contrast', 'inherited', 'Theme scope applied to the rating root.'],
      ],
      events: [
        ['change', '{ value }', 'Fired when the selected rating changes.'],
      ],
      slots: [
        ['item', 'Custom icon markup cloned into empty and filled layers. Supports {{index}}, {{value}}, {{state}}, and {{layer}}.'],
        ['item-label', 'Custom item-label markup. Supports {{label}}, {{index}}, {{value}}, and {{state}}.'],
      ],
    },
  ],


  '/docs/cards': [
    {
      tag: 'w-card',
      attributes: [['header', 'string', '—', 'Renders a header with this title.']],
      slots: [
        ['default', 'Card body content.'],
        ['header', 'Custom header content (overrides the header attribute).'],
        ['footer', 'Footer content; presence renders the footer region.'],
      ],
    },
    {
      tag: 'w-card-title',
      slots: [['default', 'Card title text.']],
    },
    {
      tag: 'w-card-subtitle',
      slots: [['default', 'Card subtitle text.']],
    },
    {
      tag: 'w-card-text',
      slots: [['default', 'Card body text.']],
    },
    {
      tag: 'w-card-actions',
      slots: [['default', 'Action buttons or controls.']],
    },
  ],

  '/docs/badges': [{
    tag: 'w-badge',
    attributes: [
      ['content', 'string | number', '—', 'Text or number rendered in the overlay badge.'],
      ['icon', 'string', '—', 'Icon text / glyph rendered in the overlay badge.'],
      ['dot', 'boolean', 'false', 'Renders a small dot instead of text content.'],
      ['inline', 'boolean', 'false', 'Renders the badge as an inline label instead of wrapping slotted content.'],
      ['floating', 'boolean', 'false', 'Offsets the overlay further outside the wrapped content.'],
      ['location', 'top-end | top-start | bottom-end | bottom-start', 'top-end', 'Overlay placement around the wrapped content.'],
      ['variant', 'filled | outlined | dot', '—', 'Visual badge style, mostly for inline labels.'],
      ['color', 'primary | success | danger | warning | info', '—', 'Semantic colour modifier.'],
      ['label', 'boolean', 'false', 'Uppercase status-label styling.'],
    ],
    slots: [['default', 'Wrapped target content, or inline label text when inline/content is omitted.']],
  }],

  '/docs/avatars': [{
    tag: 'w-avatar',
    attributes: [
      ['src', 'string', '—', 'Image URL; renders an image when set.'],
      ['alt', 'string', '—', 'Alt text / accessible label.'],
      ['size', 'sm | lg', '—', 'Avatar size; omit for the default.'],
      ['initials', 'string', '—', 'Initials shown when no image source is provided.'],
      ['status', 'online | away | busy', '—', 'Optional status indicator.'],
    ],
    slots: [['default', 'Initials shown when no src is provided.']],
  }],

  '/docs/alerts': [
    {
      tag: 'w-alert',
      attributes: [
        ['variant', 'info | success | warning | error', 'info', 'Semantic style and icon.'],
        ['title', 'string', '—', 'Bold title above the body.'],
        ['dismissible', 'boolean', 'false', 'Shows a dismiss button.'],
      ],
      events: [['close', '—', 'Fired when the alert is dismissed.']],
      slots: [['default', 'Alert body text.']],
    },
    {
      tag: 'w-alert-title',
      slots: [['default', 'Bold alert title text.']],
    },
  ],

  '/docs/tooltips': [{
    tag: 'w-tooltip',
    attributes: [
      ['text', 'string', '—', 'Tooltip text (required).'],
      ['position', 'top | bottom | left | right', 'top', 'Placement relative to the trigger.'],
    ],
    slots: [['default', 'The element that triggers the tooltip.']],
  }],

  '/docs/tabs': [
    {
      tag: 'w-tabs',
      attributes: [
        ['value', 'string', '—', 'Value of the active tab.'],
        ['variant', 'pills', '—', 'Optional visual style.'],
        ['align-tabs', 'start | center | end | title', 'start', 'Horizontal alignment of the tabs.'],
        ['fixed-tabs', 'boolean', 'false', 'Tabs share equal width up to a max.'],
        ['grow', 'boolean', 'false', 'Tabs grow to fill the available width.'],
        ['direction', 'horizontal | vertical', 'horizontal', 'Lay tabs out in a row or column.'],
        ['stacked', 'boolean', 'false', 'Stack each tab’s icon above its label.'],
        ['center-active', 'boolean', 'false', 'Scroll the active tab into the centre.'],
        ['hide-slider', 'boolean', 'false', 'Hide the active-tab slider.'],
        ['slider-color', 'string', '—', 'Color of the active-tab slider.'],
        ['color', 'string', '—', 'Active tab text/slider color.'],
        ['bg-color', 'string', '—', 'Tab bar background color.'],
        ['density', 'compact | comfortable', '—', 'Tab height density.'],
        ['disabled', 'boolean', 'false', 'Disable the whole tab bar.'],
        ['show-arrows', 'boolean', 'false', 'Show scroll arrows when tabs overflow.'],
        ['prev-icon / next-icon', 'string', '—', 'Custom overflow arrow glyphs.'],
      ],
      events: [['change', '{ value }', 'Fired when the active tab changes.']],
      slots: [['default', 'A set of w-tab elements.']],
    },
    {
      tag: 'w-tab',
      attributes: [
        ['value', 'string', '—', 'Identifier for this tab.'],
        ['active', 'boolean', 'false', 'Whether this tab is selected.'],
        ['disabled', 'boolean', 'false', 'Disables the tab.'],
        ['stacked', 'boolean', 'false', 'Stack the icon above the label.'],
        ['href', 'string', '—', 'Render the tab as a link.'],
      ],
      slots: [['default', 'Tab label content.']],
    },
    {
      tag: 'w-tabs-window',
      attributes: [['value', 'string', '—', 'Value of the active panel.']],
      slots: [['default', 'A set of w-tabs-window-item elements.']],
    },
    {
      tag: 'w-tabs-window-item',
      attributes: [['value', 'string', '—', 'Panel identifier.']],
      slots: [['default', 'Panel content.']],
    },
  ],

  '/docs/expand': [
    {
      tag: 'w-expansion-panels',
      attributes: [['single', 'boolean', 'false', 'Allow only one open panel at a time.']],
      events: [['change', '{ value, open }', 'Fired when a panel toggles.']],
      slots: [['default', 'A set of w-expansion-panel elements.']],
    },
    {
      tag: 'w-expansion-panel',
      attributes: [
        ['header', 'string', '—', 'Header text for the toggle.'],
        ['open', 'boolean', 'false', 'Whether the panel is expanded.'],
        ['disabled', 'boolean', 'false', 'Disables the toggle.'],
      ],
      events: [['toggle', '{ open }', 'Fired when this panel expands or collapses.']],
      slots: [['default', 'Body content.'], ['header', 'Custom header content.']],
    },
  ],

  '/docs/banners': [
    {
      tag: 'w-banner',
      attributes: [
        ['text', 'string', '—', 'Banner message (or use the default / text slot).'],
        ['icon', 'string', '—', 'Leading icon text / glyph.'],
        ['avatar', 'string', '—', 'Leading avatar image URL (overrides icon).'],
        ['lines', 'one | two | three', '—', 'Clamps the message text to N lines.'],
        ['sticky', 'boolean', 'false', 'Pins the banner to the top of its scroll container.'],
        ['mobile', 'boolean', 'false', 'Stacks the actions below the text (alias of stacked).'],
        ['stacked', 'boolean', 'false', 'Stacks the actions below the text.'],
        ['color', 'string', '—', 'Token color for the leading icon accent.'],
        ['bg-color', 'string', '—', 'Token color for the banner surface.'],
      ],
      slots: [
        ['default', 'Banner message.'],
        ['text', 'Banner message (alternative to the text attribute).'],
        ['prepend', 'Custom leading media (overrides icon/avatar).'],
        ['actions', 'Trailing action buttons or links.'],
      ],
    },
    {
      tag: 'w-banner-text',
      slots: [['default', 'Banner message text.']],
    },
    {
      tag: 'w-banner-actions',
      slots: [['default', 'Action buttons or links.']],
    },
  ],

  '/docs/skeleton-loaders': [
    {
      tag: 'w-skeleton',
      attributes: [
        ['type', 'string', '—', 'Comma list of bone presets (e.g. "card", "list-item-avatar-two-line", "article, actions"). Supports @n repeats.'],
        ['boilerplate', 'boolean', 'false', 'Render shapes without the shimmer animation.'],
        ['loading', 'boolean', 'false', 'With a default slot, show the skeleton while true.'],
        ['color', 'token | CSS color', '—', 'Base bone color.'],
        ['width', 'string | number', '—', 'CSS width of the loader root.'],
        ['height', 'string | number', '—', 'CSS height of the loader root.'],
        ['variant', 'text | avatar | block', 'text', 'Legacy placeholder shape.'],
        ['lines', 'number', '1', 'Legacy text line count.'],
      ],
      slots: [['default', 'Real content; shown instead of the skeleton when not loading.']],
    },
    {
      tag: 'w-skeleton-loader',
      attributes: [['…', '', '', 'Alias of w-skeleton — identical attributes and slots.']],
    },
  ],

  '/docs/progress-linear': [
    {
      tag: 'w-progress-linear',
      attributes: [
        ['value', 'number', '0', 'Current value (alias: model-value).'],
        ['max', 'number', '100', 'Maximum value.'],
        ['indeterminate', 'boolean', 'false', 'Animated indeterminate state.'],
        ['color', 'string', '—', 'Token / CSS color for the bar.'],
        ['bg-color', 'string', '—', 'Token / CSS color for the track.'],
        ['height', 'string | number', '4px', 'Bar thickness.'],
        ['buffer-value', 'number', '100', 'Secondary buffer value.'],
        ['buffer-color', 'string', '—', 'Color for the buffer region.'],
        ['rounded', 'boolean', 'false', 'Pill-rounded track and bar.'],
        ['striped', 'boolean', 'false', 'Diagonal stripes on the bar.'],
        ['stream', 'boolean', 'false', 'Animated buffer stream.'],
        ['reverse', 'boolean', 'false', 'Fills from the opposite side.'],
        ['absolute', 'boolean', 'false', 'Position absolute (pair with location).'],
        ['location', 'top | bottom', '—', 'Edge to pin to when absolute.'],
        ['tween', 'boolean', 'false', 'Animates determinate progress from 0 on render.'],
      ],
      slots: [['default', 'Centered content (e.g. a percentage label).']],
    },
  ],

  '/docs/progress-circular': [
    {
      tag: 'w-progress-circular',
      attributes: [
        ['value', 'number', '0', 'Current value (alias: model-value).'],
        ['max', 'number', '100', 'Maximum value.'],
        ['indeterminate', 'boolean', 'false', 'Animated indeterminate state.'],
        ['size', 'x-small … x-large | number', '48', 'Diameter.'],
        ['width', 'number', '4', 'Stroke width.'],
        ['color', 'string', '—', 'Token / CSS color for the fill.'],
        ['bg-color', 'string', '—', 'Token / CSS color for the track.'],
        ['rotate', 'number', '0', 'Start-angle offset in degrees.'],
        ['tween', 'boolean', 'false', 'Animates determinate progress from 0 on render.'],
      ],
      slots: [['default', 'Centered content (e.g. a percentage label).']],
    },
  ],

  '/docs/empty-states': [
    {
      tag: 'w-empty',
      attributes: [
        ['headline', 'string', '—', 'Large display text shown above the media.'],
        ['title', 'string', '—', 'Bold title.'],
        ['text', 'string', '—', 'Body description (alias: subtitle).'],
        ['icon', 'string', '—', 'Leading icon glyph/text.'],
        ['image', 'string', '—', 'Leading image URL (overrides icon).'],
        ['size', 'string | number', '—', 'CSS length for the icon / image.'],
        ['color', 'string', '—', 'Token color for the icon / headline accent.'],
        ['bg-color', 'string', '—', 'Token color for the surface.'],
        ['justify', 'start | center | end', 'center', 'Content alignment.'],
        ['action-text', 'string', '—', 'Label for a built-in action button.'],
        ['href', 'string', '—', 'Turns the action button into a link.'],
        ['text-width', 'string | number', '500px', 'Max width of the title + text block.'],
      ],
      slots: [
        ['media', 'Custom icon / illustration (also the default slot).'],
        ['headline', 'Override the headline.'],
        ['title', 'Override the title.'],
        ['text', 'Override the body text.'],
        ['actions', 'Action buttons (alias: action).'],
      ],
      events: [['click:action', 'Fired when the built-in action button is activated.']],
    },
    {
      tag: 'w-empty-state',
      attributes: [['…', '', '', 'Alias of w-empty — identical attributes, slots, and events.']],
      slots: [['default', 'See w-empty.']],
    },
  ],

  '/docs/snackbar': [{
    tag: 'w-snackbar',
    attributes: [
      ['text', 'string', '—', 'Message text (alias: message; or use the default slot).'],
      ['action', 'string', '—', 'Single action button label; omit for none.'],
      ['open', 'boolean', 'false', 'Whether the snackbar is visible (alias: model-value).'],
      ['timeout', 'number', '5000', 'Auto-dismiss delay in ms; -1 keeps it open (alias: duration).'],
      ['color', 'string', '—', 'Token color for the surface.'],
      ['variant', 'flat | elevated | tonal | outlined | text', 'flat', 'Visual treatment.'],
      ['location', 'string', 'bottom center', '"top"/"bottom" + "start"/"center"/"end".'],
      ['multi-line', 'boolean', 'false', 'Taller layout for longer messages.'],
      ['vertical', 'boolean', 'false', 'Stacks the actions below the text.'],
      ['rounded', 'boolean', 'false', 'Larger corner rounding.'],
      ['timer', 'boolean | color', 'false', 'Shows a countdown bar.'],
      ['inline', 'boolean', 'false', 'Renders in document flow instead of fixed to the viewport.'],
    ],
    slots: [['default', 'Message content.'], ['actions', 'Custom action buttons (replaces the action label).']],
    events: [
      ['update:model-value', 'boolean', 'Fired when visibility changes.'],
      ['close', '—', 'Fired when the snackbar is dismissed.'],
    ],
    methods: [['show()', 'Shows the snackbar and starts the timer.'], ['close()', 'Hides the snackbar.']],
  }],

  '/docs/dialog': [{
    tag: 'w-dialog',
    attributes: [
      ['open', 'boolean', 'false', 'Whether the dialog is visible.'],
      ['title', 'string', '—', 'Header title.'],
    ],
    events: [['close', '—', 'Fired when the dialog is dismissed.']],
    slots: [['default', 'Dialog body content.'], ['footer', 'Footer actions, usually buttons.']],
    methods: [['show()', 'Opens the dialog and focuses it.'], ['close()', 'Closes the dialog.']],
  }, {
    tag: 'w-dialog-transition',
    slots: [['default', 'Dialog content to wrap in a transition surface.']],
  }],

  '/docs/components/defaults-providers': [{
    tag: 'w-defaults-provider',
    attributes: [
      ['defaults', 'JSON object', '—', 'Maps a tag selector to default attributes, e.g. {"w-btn":{"variant":"outlined"}}. Only fills attributes that are not already set.'],
      ['disabled', 'boolean', 'false', 'Skip applying defaults entirely.'],
    ],
    slots: [['default', 'Content whose descendants inherit the scoped defaults. The nearest provider wins for nested scopes.']],
  }],

  '/docs/components/theme-providers': [{
    tag: 'w-theme-provider',
    attributes: [
      ['theme', 'light | dark | auto | high-contrast', '—', 'Scopes a theme via data-w-theme so descendant tokens resolve to that palette.'],
      ['with-background', 'boolean', 'false', 'Paints the themed surface and text on the wrapper (otherwise renderless).'],
    ],
    slots: [['default', 'Content rendered within the theme scope.']],
  }],

  '/docs/components/dividers': [{
    tag: 'w-divider',
    attributes: [
      ['vertical', 'boolean', 'false', 'Renders a vertical separator.'],
      ['inset', 'boolean', 'false', 'Indents the divider from the start edge.'],
    ],
  }],

  '/docs/components/hover': [{
    tag: 'w-hover',
    attributes: [
      ['active', 'boolean', 'false', 'Whether the hover state is currently active.'],
      ['model-value', 'boolean', 'false', 'Controlled hover state (alias of active).'],
      ['disabled', 'boolean', 'false', 'Disables hover state changes.'],
      ['open-delay', 'number', '0', 'Delay in milliseconds before activating.'],
      ['close-delay', 'number', '0', 'Delay in milliseconds before deactivating.'],
    ],
    events: [
      ['update:model-value', 'boolean', 'Fired when the hover state changes.'],
      ['change', '{ value }', 'Fired when the hover state changes.'],
    ],
    slots: [['default', 'Hover target content. While hovered the inner root gets is-hovering / data-hovering="true".']],
  }],

  '/docs/components/lazy': [{
    tag: 'w-lazy',
    attributes: [
      ['active', 'boolean', 'false', 'Renders slotted content immediately when true.'],
      ['model-value', 'boolean', 'false', 'Alias of active.'],
      ['transition', 'string', 'fade', 'Reveal transition when activating ("none" disables).'],
      ['height', 'CSS length', '—', 'Fixed wrapper height.'],
      ['min-height', 'CSS length', '160px', 'Minimum wrapper height while inactive.'],
      ['root-margin', 'string', '0px', 'IntersectionObserver root margin.'],
      ['threshold', 'number', '0', 'Intersection ratio that triggers activation.'],
    ],
    events: [
      ['load', '{ value }', 'Fired when the element enters the viewport and activates.'],
      ['update:modelValue', '{ value }', 'Fired with the new active boolean.'],
    ],
    slots: [['default', 'Lazy-loaded content.']],
  }],

  '/docs/components/locale-providers': [{
    tag: 'w-locale-provider',
    attributes: [
      ['locale', 'string', '—', 'BCP-47 language tag applied to the scope via lang.'],
      ['fallback-locale', 'string', '—', 'Fallback language tag (reflected as data-fallback-locale).'],
      ['rtl', 'boolean', 'false', 'Force right-to-left layout (sets dir="rtl"; otherwise ltr).'],
    ],
    slots: [['default', 'Localized content; descendants inherit lang and dir.']],
  }],

  '/docs/components/no-ssr': [{
    tag: 'w-no-ssr',
    slots: [
      ['default', 'Client-only content, revealed once the component mounts.'],
      ['placeholder', 'Shown until the client mounts.'],
    ],
  }],

  '/docs/components/pull-to-refresh': [{
    tag: 'w-pull-to-refresh',
    attributes: [
      ['pull-down-threshold', 'number', '64', 'Pull distance in pixels that triggers a refresh (alias: threshold).'],
      ['refreshing', 'boolean', 'false', 'Externally control the refreshing state (alias: model-value).'],
      ['disabled', 'boolean', 'false', 'Disables pull gestures.'],
    ],
    events: [
      ['load', '{ done }', 'Fired when the threshold is reached; call done() to end refreshing.'],
      ['change', '{ done }', 'Back-compatible alias of load.'],
    ],
    methods: [['complete()', 'Resets the refreshing state.']],
    slots: [['default', 'Scrollable content.']],
  }],

  '/docs/components/snackbar-queue': [{
    tag: 'w-snackbar-queue',
    attributes: [
      ['messages', 'comma list', '—', 'Initial queued messages.'],
      ['timeout', 'number', '5000', 'Auto-dismiss delay for each message (alias: duration).'],
      ['color', 'string', '—', 'Token color forwarded to each snackbar.'],
      ['location', 'string', '—', 'Location forwarded to each snackbar.'],
      ['variant', 'string', '—', 'Variant forwarded to each snackbar.'],
    ],
    methods: [
      ['push(message, options)', 'Adds a message to the queue and renders it.'],
    ],
    slots: [['default', 'Additional w-snackbar children or related content.']],
  }],

  '/docs/components/calendars': [{
    tag: 'w-calendar',
    attributes: [
      ['value', 'YYYY-MM-DD', 'today', 'Active date and navigation anchor.'],
      ['type', 'month | week | day | 4day | custom-weekly | custom-daily | category', 'month', 'Calendar view.'],
      ['start / end', 'YYYY-MM-DD', '—', 'Inclusive range for custom views.'],
      ['month / year', 'number', 'from value', 'Legacy displayed-month overrides.'],
      ['min / max', 'YYYY-MM-DD', '—', 'Selectable date bounds.'],
      ['weekdays', 'JSON array<0–6>', '[0,1,2,3,4,5,6]', 'Visible weekdays; Sunday is 0.'],
      ['first-day-of-week', '0–6', '0', 'First weekday column.'],
      ['first-day-of-year', '1–7', '4', 'Week-number rule.'],
      ['locale', 'BCP 47 locale', 'document language', 'Labels and times.'],
      ['now', 'date or datetime', 'system now', 'Overrides today/current-time styling.'],
      ['format', 'ampm | 24hr', 'locale', 'Clock convention.'],
      ['short-weekdays / short-months', 'boolean', 'true', 'Use abbreviated labels.'],
      ['show-month-on-first', 'boolean', 'true', 'Prefix the first day with its month.'],
      ['show-week', 'boolean', 'false', 'Show week numbers in month/custom-weekly views.'],
      ['hide-header', 'boolean', 'false', 'Hide title and navigation controls.'],
      ['min-weeks / max-days', 'number', '1 / 7', 'Minimum month rows and custom-daily cap.'],
      ['events', 'JSON array', '[]', 'Event records; JavaScript arrays can also be assigned to the property.'],
      ['event-start / event-end / event-name', 'string', 'start / end / name', 'Event field mappings.'],
      ['event-timed / event-category', 'string', 'timed / category', 'Timed and category field mappings.'],
      ['event-color / event-text-color', 'token, CSS color, or field name', 'primary / on-primary', 'Event colors.'],
      ['event-height / event-margin-bottom', 'number', '20 / 1', 'Event geometry in pixels.'],
      ['event-overlap-mode', 'stack | column', 'stack', 'Timed event overlap layout; assign a function through the matching property for custom geometry.'],
      ['event-overlap-threshold', 'minutes', '60', 'Overlap grouping threshold.'],
      ['event-more', 'boolean', 'true', 'Collapse crowded month cells.'],
      ['event-more-text', 'string', '{count} more', 'Overflow label template.'],
      ['event-ripple', 'boolean', 'false', 'Add ripple styling to event controls.'],
      ['event-draggable', 'boolean', 'false', 'Enable native drag-and-drop rescheduling for timed events.'],
      ['first-interval / first-time', 'number / HH:mm', '0 / —', 'Schedule start; first-time takes precedence.'],
      ['interval-count / interval-minutes', 'number', '24 / 60', 'Visible interval count and duration.'],
      ['interval-height / interval-width', 'number', '48 / 60', 'Interval row and gutter geometry in pixels.'],
      ['short-intervals', 'boolean', 'true', 'Omit zero minutes from concise interval labels.'],
      ['interval-highlight', 'boolean | color', 'false', 'Highlight interval rows on hover, optionally with a theme token or CSS color.'],
      ['categories', 'JSON array', '[]', 'Category strings or objects.'],
      ['category-days', 'number', '1', 'Days shown in category view.'],
      ['category-text', 'field name', 'name', 'Category object label field.'],
      ['category-hide-dynamic', 'boolean', 'false', 'Exclude event-defined categories.'],
      ['category-show-all', 'boolean', 'false', 'Show categories with no events.'],
      ['category-for-invalid', 'string', '—', 'Fallback category for invalid records.'],
    ],
    events: [
      ['input', '{ value, date, kind }', 'Fired when a date is selected.'],
      ['change', '{ reason, value, start, end, type }', 'Fired when selection or visible range changes.'],
      ['moved', '{ reason, value, start, end, type }', 'Fired after next(), prev(), move(), or today().'],
      ['click', '{ kind, date, time?, category?, event? }', 'Fired for date, event, overflow, and interval interactions.'],
    ],
    methods: [
      ['next(amount = 1)', 'Move forward by the current view span.'],
      ['prev(amount = 1)', 'Move backward by the current view span.'],
      ['move(amount)', 'Move in either direction.'],
      ['today()', 'Move to the current or overridden now date.'],
      ['scrollToTime(value)', 'Scroll interval views to minutes since midnight or HH:mm.'],
      ['minutesToPixels(minutes)', 'Convert a duration to pixels using the active interval scale.'],
      ['timeDelta(value)', 'Return a time\'s fractional position in the visible interval range.'],
      ['timeToY(value, clamp = false)', 'Return a time\'s vertical pixel position for custom day-body treatments.'],
      ['checkChange()', 'Emit and return the current visible range metadata.'],
      ['updateTimes()', 'Refresh relative date state and return the current time metadata.'],
      ['getVisibleRange()', 'Return { start, end, type }.'],
      ['events / categories / weekdays', 'Assign arrays directly without serializing them.'],
      ['dayFormat / weekdayFormat / monthFormat / intervalFormat', 'Custom label formatters.'],
      ['showIntervalLabel()', 'Returns whether an interval label is visible.'],
      ['intervalStyle()', 'Returns inline styles for an interval cell.'],
      ['eventName / eventColor / eventTextColor / eventTimed / eventCategory', 'Event accessors; functions receive the source record.'],
      ['eventOverlapMode', 'Accepts stack, column, or a Vuetify-compatible visual layout factory.'],
      ['eventRipple', 'Enables ripple styling; object values can carry application-specific ripple configuration.'],
      ['categoryText', 'Category label accessor.'],
      ['dayContent / dayHeaderContent / dayBodyContent', 'Framework-neutral counterparts to Vuetify day slots.'],
      ['intervalContent / intervalHeaderContent', 'Render custom interval and gutter content.'],
      ['eventContent / categoryContent', 'Render custom event and category markup.'],
    ],
  }],

  '/docs/forms': [{
    tag: 'w-form',
    attributes: [
      ['disabled', 'boolean', 'false', 'Disables every contained control.'],
      ['readonly', 'boolean', 'false', 'Makes every contained control read-only where supported.'],
      ['fast-fail', 'boolean', 'false', 'Stop validating at the first failing field.'],
      ['validate-on', 'string', 'input', 'When fields validate: input, blur, submit, or a space-separated combination.'],
      ['value', 'boolean', '—', 'Reflects validity: true valid, false invalid, absent until validated.'],
    ],
    events: [
      ['submit', '{ valid, errors }', 'Fired on submit after validation; the native submit is prevented.'],
      ['change', '{ value }', 'Fired when validity changes to true, false, or null.'],
    ],
    methods: [
      ['validate()', '{ valid, errors }', 'Validate every field and mark invalid controls.'],
      ['reset()', 'void', 'Reset field values and clear validation.'],
      ['resetValidation()', 'void', 'Clear validation state, keep values.'],
    ],
  }],

  '/docs/number-inputs': [{
    tag: 'w-number-input',
    attributes: [
      ['value', 'number', '—', 'Current value, clamped to min/max.'],
      ['min / max', 'number', 'safe-int range', 'Value bounds.'],
      ['step', 'number', '1', 'Increment / decrement amount.'],
      ['control-variant', 'string', 'default', 'default, stacked, split, or hidden.'],
      ['inset', 'boolean', 'false', 'Tuck the controls inside the field with no divider.'],
      ['hide-input', 'boolean', 'false', 'Show only the stepper (implies stacked).'],
      ['reverse', 'boolean', 'false', 'Place the controls before the input.'],
      ['precision', 'number', '0', 'Decimal places to display; null disables rounding.'],
      ['min-fraction-digits', 'number', '—', 'Minimum decimals to keep.'],
      ['grouping', 'boolean | string', 'false', 'Thousands separators: true, always, auto, min2.'],
      ['decimal-separator / group-separator', 'string', '. / ,', 'Single-character separator overrides.'],
      ['label / placeholder / hint / error / name / size', 'string', '—', 'Text-field props forwarded to the input.'],
      ['disabled / readonly', 'boolean', 'false', 'Disable the field and its controls.'],
    ],
    events: [
      ['input', '{ value }', 'Fired on each keystroke with the parsed number.'],
      ['change', '{ value }', 'Fired on commit or step with the clamped number (or null).'],
    ],
  }],

  '/docs/otp-input': [
    {
      tag: 'w-otp',
      attributes: [
        ['length', 'number', '6', 'Number of character boxes.'],
        ['value', 'string', '—', 'Current code.'],
        ['type', 'string', 'text', 'text, number (digits only), or password (masked).'],
        ['divider', 'string', '—', 'Character drawn between boxes.'],
        ['placeholder', 'string', '—', 'Placeholder shown in empty boxes.'],
        ['disabled', 'boolean', 'false', 'Disable every box.'],
      ],
      events: [
        ['input', '{ value }', 'Fired on each change with the current code.'],
        ['change', '{ value }', 'Fired once every box is filled.'],
      ],
    },
    {
      tag: 'w-otp-input',
      attributes: [
        ['length', 'number', '6', 'Number of character boxes.'],
        ['value', 'string', '—', 'Current code.'],
        ['disabled', 'boolean', 'false', 'Disable every box.'],
      ],
      events: [
        ['input', '{ value }', 'Fired when the code changes.'],
        ['change', '{ value }', 'Fired when the code is complete.'],
      ],
    },
  ],

  '/docs/radio-buttons': [
    {
      tag: 'w-radio-group',
      attributes: [
        ['value', 'string', '—', 'Selected option value.'],
        ['name', 'string', 'w-radio-group', 'Shared form field name for the options.'],
        ['label', 'string', '—', 'Group label.'],
        ['inline', 'boolean', 'false', 'Lay the options out in a row.'],
        ['disabled', 'boolean', 'false', 'Disable every option.'],
      ],
      events: [['change', '{ value, name }', 'Fired by the group when the selection changes.']],
      slots: [['default', 'w-radio children.']],
    },
    {
      tag: 'w-radio',
      attributes: [
        ['value', 'string', 'on', 'Value reported when selected.'],
        ['label', 'string', '—', 'Label text (or use the default slot).'],
        ['color', 'string', 'primary', 'primary, error, success, or warning.'],
        ['size', 'string', 'md', 'xs, sm, md, or lg.'],
        ['checked / disabled', 'boolean', 'false', 'Selected / disabled state.'],
      ],
      slots: [['default', 'Label content when label is omitted.']],
    },
  ],

  '/docs/range-sliders': [{
    tag: 'w-range-slider',
    attributes: [
      ['min / max', 'number', '0 / 100', 'Range bounds.'],
      ['start / end', 'number', 'min / max', 'Current range ends.'],
      ['step', 'number', '1', 'Increment between values.'],
      ['label', 'string', '—', 'Field label.'],
      ['direction', 'string', 'horizontal', 'horizontal or vertical.'],
      ['thumb-label', 'boolean | always', 'false', 'Show a value bubble over each thumb (always keeps it visible).'],
      ['ticks', 'boolean', 'false', 'Draw a tick at every step.'],
      ['disabled', 'boolean', 'false', 'Disable both thumbs.'],
    ],
    events: [
      ['input', '{ start, end }', 'Fired while dragging either thumb.'],
      ['change', '{ start, end }', 'Fired when a thumb is released.'],
    ],
  }],

  '/docs/selects': [
    {
      tag: 'w-select',
      attributes: [
        ['value', 'string', '—', 'Selected value (comma-joined when multiple).'],
        ['multiple', 'boolean', 'false', 'Allow multiple selections, shown as chips.'],
        ['chips', 'boolean', 'false', 'Render selections as chips (implied by multiple).'],
        ['closable-chips', 'boolean', 'false', 'Chips show a remove button.'],
        ['clearable', 'boolean', 'false', 'Show a clear (×) button.'],
        ['placeholder', 'string', '—', 'Text shown when nothing is selected.'],
        ['label / hint / error', 'string', '—', 'Field label / helper / error text.'],
        ['name', 'string', '—', 'Form field name (renders a hidden input).'],
        ['size', 'string', '—', 'xs, sm, lg, or xl.'],
        ['disabled / readonly', 'boolean', 'false', 'Non-interactive states.'],
      ],
      events: [
        ['change', '{ value, name }', 'Fired when the selection changes.'],
      ],
      slots: [['default', 'w-option children with value attributes.']],
    },
    {
      tag: 'w-native-select',
      attributes: [
        ['value', 'string', '—', 'Selected option value.'],
        ['name', 'string', '—', 'Form field name.'],
        ['label / hint / error', 'string', '—', 'Field label, helper text, and error state.'],
        ['size', 'string', '—', 'Select size; omit for the default.'],
        ['disabled', 'boolean', 'false', 'Disables the select.'],
      ],
      events: [['change', '{ value, name }', 'Fired when selection changes.']],
      slots: [['default', 'Native option children.']],
    },
  ],

  '/docs/switches': [{
    tag: 'w-switch',
    attributes: [
      ['checked', 'boolean', 'false', 'On/off state (reflected; also a property).'],
      ['label', 'string', '—', 'Label text (or use the default slot).'],
      ['color', 'string', 'primary', 'primary, success, warning, or error.'],
      ['size', 'string', 'md', 'xs, sm, md, or lg.'],
      ['inset', 'boolean', 'false', 'Track fully encloses the thumb.'],
      ['flat', 'boolean', 'false', 'Thumb without elevation.'],
      ['loading', 'boolean', 'false', 'Show a spinner in the thumb and block toggling.'],
      ['disabled', 'boolean', 'false', 'Non-interactive and dimmed.'],
      ['readonly', 'boolean', 'false', 'Non-interactive without dimming.'],
      ['hint', 'string', '—', 'Helper text below the label.'],
      ['error', 'string', '—', 'Error text; tints the control red.'],
      ['hide-details', 'boolean', 'false', 'Suppress hint/error text.'],
      ['name / value', 'string', '— / on', 'Form field name and value when checked.'],
    ],
    events: [
      ['change', '{ checked, value, name }', 'Fired when the switch is toggled.'],
    ],
  }],

  '/docs/text-fields': [{
    tag: 'w-text-field',
    attributes: [
      ['type', 'string', 'text', 'Any native input type.'],
      ['value', 'string', '—', 'Current value (reflected; also a property).'],
      ['label', 'string', '—', 'Floating label.'],
      ['placeholder', 'string', '—', 'Placeholder text.'],
      ['variant', 'string', 'outlined', 'outlined, filled, underlined, plain, or solo.'],
      ['density', 'string', 'default', 'default, comfortable, or compact.'],
      ['size', 'string', '—', 'xs, sm, lg, or xl.'],
      ['color', 'string', 'primary', 'Token color for the focus accent.'],
      ['prefix / suffix', 'string', '—', 'Static text inside the control.'],
      ['prepend-inner-icon / append-inner-icon', 'string', '—', 'Icon names resolved through the icon registry, rendered inside the control.'],
      ['icon-set', 'string', '—', 'Icon set prefix for the icon attributes.'],
      ['clearable', 'boolean', 'false', 'Show a clear (×) button when non-empty.'],
      ['counter', 'boolean', 'false', 'Show a character counter; pairs with maxlength.'],
      ['loading', 'boolean', 'false', 'Show an indeterminate bar along the bottom edge.'],
      ['hint', 'string', '—', 'Helper text below the control.'],
      ['persistent-hint', 'boolean', 'false', 'Keep the hint visible when not focused.'],
      ['error', 'string', '—', 'Error text; tints the control and replaces the hint.'],
      ['rounded', 'boolean', 'false', 'Pill-rounded control.'],
      ['single-line', 'boolean', 'false', 'No floating label; label becomes the placeholder.'],
      ['hide-details', 'boolean', 'false', 'Suppress the details row (hint / error / counter).'],
      ['disabled / readonly', 'boolean', 'false', 'State flags.'],
      ['name', 'string', '—', 'Form field name.'],
      ['required / pattern / minlength / maxlength / min / max / step', '—', '—', 'Native HTML5 validation attributes, forwarded to the input.'],
    ],
    slots: [
      ['prepend-inner', 'Content (e.g. an icon) inside the control, leading.'],
      ['append-inner', 'Content inside the control, trailing.'],
    ],
    events: [
      ['input', '{ value, name }', 'Fired on every keystroke.'],
      ['change', '{ value, name }', 'Fired when the value is committed.'],
      ['clear', '{ name }', 'Fired when cleared via the clear button.'],
    ],
  }],

  '/docs/textareas': [{
    tag: 'w-textarea',
    attributes: [
      ['value', 'string', '—', 'Current value (reflected; also a property).'],
      ['label', 'string', '—', 'Floating label.'],
      ['placeholder', 'string', '—', 'Placeholder text.'],
      ['rows', 'number', '4', 'Initial visible rows.'],
      ['auto-grow', 'boolean', 'false', 'Grow to fit content instead of scrolling.'],
      ['max-rows', 'number', '—', 'Cap auto-grow at this many rows.'],
      ['no-resize', 'boolean', 'false', 'Disable the manual resize handle.'],
      ['variant', 'string', 'outlined', 'outlined, filled, underlined, plain, or solo.'],
      ['density', 'string', 'default', 'default, comfortable, or compact.'],
      ['size', 'string', '—', 'xs, sm, lg, or xl.'],
      ['color', 'string', 'primary', 'Token color for the focus accent.'],
      ['prefix / suffix', 'string', '—', 'Static text inside the control.'],
      ['prepend-inner-icon / append-inner-icon', 'string', '—', 'Icon names resolved through the icon registry.'],
      ['clearable', 'boolean', 'false', 'Show a clear (×) button when non-empty.'],
      ['counter', 'boolean', 'false', 'Show a character counter; pairs with maxlength.'],
      ['loading', 'boolean', 'false', 'Show an indeterminate bar along the bottom edge.'],
      ['hint / persistent-hint', 'string / boolean', '—', 'Helper text below the control.'],
      ['error', 'string', '—', 'Error text; tints the control and replaces the hint.'],
      ['hide-details', 'boolean', 'false', 'Suppress the details row.'],
      ['disabled / readonly', 'boolean', 'false', 'State flags.'],
      ['name', 'string', '—', 'Form field name.'],
    ],
    slots: [
      ['prepend-inner', 'Content (e.g. an icon) inside the control, leading.'],
      ['append-inner', 'Content inside the control, trailing.'],
    ],
    events: [
      ['input', '{ value, name }', 'Fired on every keystroke.'],
      ['change', '{ value, name }', 'Fired when the value is committed.'],
      ['clear', '{ name }', 'Fired when cleared via the clear button.'],
    ],
  }],
};
