/* <w-autocomplete> — Searchable dropdown with filtering, keyboard navigation,
 * multiple selection, and chip display.
 *
 * Attributes:
 *   label          - field label
 *   items          - comma-separated strings or JSON array of objects
 *   item-title     - property to display for object items (default: title)
 *   item-value     - property to use as the value for object items (default: value)
 *   value         - selected value(s); comma-separated when multiple
 *   placeholder    - input placeholder
 *   disabled       - disables the control
 *   readonly       - prevents editing and opening the list
 *   name           - form field name (renders a hidden input)
 *   hint           - helper text below the field
 *   error          - error text and error state
 *   size           - xs | sm | lg | xl
 *   multiple       - allow multiple selections
 *   chips          - display selected values as chips
 *   closable-chips - chips can be removed
 *   clearable      - show a clear button
 *   loading        - show a loading spinner
 *   no-filter      - disable local filtering (useful with server-side search)
 *   auto-select-first - highlight the first filtered result automatically
 *   no-data-text   - message shown when no items match (default: No data available)
 *   hide-no-data   - suppress the no-data message entirely
 *   hide-selected  - hide already-selected items from the list (useful with multiple)
 *   open           - opens the dropdown list
 *   menu           - alias of `open`
 *
 * Search / filtering:
 *   search         - text placed in (and read from) the search input
 *   filter-keys    - comma list / JSON array of item keys the query matches on
 *   filter-mode    - some (default) | every | union | intersection; how the
 *                    filter-keys result combines with the remaining keys
 *   clear-on-select - reset the search text after a `multiple` selection
 *                    (default true; set clear-on-select="false" to keep it)
 *   return-object  - `change` detail and the hidden input carry the whole record
 *
 * Menu:
 *   menu-icon      - icon name for a toggle button that opens/closes the list
 *   menu-elevation - elevation level applied to the dropdown
 *   item-color     - color of the selected list items
 *   no-auto-scroll - do not scroll the highlighted item into view
 *   open-on-clear  - open the list when the clear button is pressed
 *   open-text / close-text - aria-label + title for the open / closed states
 *
 * Field surface:
 *   variant        - outlined | filled | underlined | plain | solo |
 *                    solo-inverted | solo-filled
 *   flat           - drop the elevation of the solo variants
 *   active, glow, center-affix, reverse, single-line, indent-details
 *   prefix, suffix - static text inside the control
 *   prepend-icon / append-icon             - icons outside the control
 *   prepend-inner-icon / append-inner-icon - icons inside the control
 *   clear-icon     - icon used by the clear button
 *   icon-color     - color for the prepend / append icons
 *   type           - native input type (default text)
 *   autocomplete   - native autocomplete hint; `suppress` also randomises the
 *                    input name to defeat browser heuristics
 *   autofocus      - focus the search input on render
 *   persistent-placeholder / persistent-clear / persistent-counter / persistent-hint
 *   hide-spin-buttons - hide native spinners when type="number"
 *   counter        - character counter (bare attribute defaults to 25)
 *   messages       - helper messages below the control
 *   error-messages - error messages; also puts the field in the error state
 *   max-errors     - how many error messages are shown (default 1)
 *   validate-on    - eager (default) | lazy | blur | input | submit; when the
 *                    error messages become visible
 *   hide-details   - suppress the details row (`auto` keeps it when non-empty)
 *
 * Events:
 *   input     - search query changed (detail: { value, name })
 *   change    - value changed (detail: { value, title, name })
 */

import { wValueList, wParseRecords, wBoolAttr } from './utils.js';
import WIcons from '../icons.js';

const AUTOCOMPLETE_KEYS = {
  ArrowDown: '_keyNext',
  ArrowUp: '_keyPrevious',
  Home: '_keyFirst',
  End: '_keyLast',
  Enter: '_keyEnter',
  Escape: '_keyEscape',
  Tab: '_keyTab',
};

export class WAutocomplete extends WElement {
  static attrs = [
    'label', 'items', 'item-title', 'item-value', 'value',
    'placeholder', 'disabled', 'readonly', 'name', 'hint', 'error', 'size',
    'multiple', 'chips', 'closable-chips', 'clearable', 'loading',
    'no-filter', 'auto-select-first', 'no-data-text', 'hide-no-data',
    'hide-selected', 'open', 'menu',
    'search', 'type', 'autocomplete', 'autofocus', 'clear-on-select',
    'filter-mode', 'filter-keys', 'return-object', 'variant', 'flat', 'reverse',
    'menu-elevation', 'menu-icon', 'open-on-clear', 'item-color', 'no-auto-scroll',
    'close-text', 'open-text', 'counter', 'persistent-placeholder',
    'persistent-counter', 'persistent-clear', 'persistent-hint', 'prefix', 'suffix',
    'append-icon', 'prepend-icon', 'append-inner-icon', 'prepend-inner-icon',
    'clear-icon', 'icon-color', 'center-affix', 'glow', 'hide-spin-buttons',
    'indent-details', 'messages', 'error-messages', 'max-errors', 'validate-on',
    'hide-details', 'active', 'single-line',
  ];

  get label() { return this._attr('label', ''); }
  get itemTitle() { return this._attr('item-title', 'title'); }
  get itemValue() { return this._attr('item-value', 'value'); }
  get placeholder() { return this._attr('placeholder', ''); }
  get name() { return this._attr('name', ''); }
  get hint() { return this._attr('hint', ''); }
  get error() { return this._attr('error', ''); }
  get size() { return this._attr('size', ''); }
  get noDataText() { return this._attr('no-data-text', 'No data available'); }
  get disabled() { return this._bool('disabled'); }
  get readonly() { return this._bool('readonly'); }
  get multiple() { return this._bool('multiple'); }
  get chips() { return this._bool('chips'); }
  get closableChips() { return this._bool('closable-chips'); }
  get clearable() { return this._bool('clearable'); }
  get loading() { return this._bool('loading'); }
  get noFilter() { return this._bool('no-filter'); }
  get autoSelectFirst() { return this._bool('auto-select-first'); }
  get hideNoData() { return this._bool('hide-no-data'); }
  get hideSelected() { return this._bool('hide-selected'); }
  get open() { return this._bool('open'); }
  get _isCombobox() { return false; }

  /* Search / filtering */
  get search() { return this._attr('search', ''); }
  get filterKeys() { return wValueList(this._attr('filter-keys', '')); }
  get filterMode() { return this._attr('filter-mode', 'some'); }
  get clearOnSelect() { return wBoolAttr(this, 'clear-on-select', true); }
  get returnObject() { return this._bool('return-object'); }

  /* Menu */
  get menuIcon() { return this._attr('menu-icon', ''); }
  get menuElevation() { return this._attr('menu-elevation', ''); }
  get itemColor() { return this._attr('item-color', ''); }
  get noAutoScroll() { return this._bool('no-auto-scroll'); }
  get openOnClear() { return this._bool('open-on-clear'); }
  get openText() { return this._attr('open-text', ''); }
  get closeText() { return this._attr('close-text', ''); }

  /* Field surface */
  get type() { return this._attr('type', 'text'); }
  get variant() { return this._attr('variant', ''); }
  get flat() { return this._bool('flat'); }
  get reverse() { return this._bool('reverse'); }
  get active() { return this._bool('active'); }
  get glow() { return this._bool('glow'); }
  get centerAffix() { return this._bool('center-affix'); }
  get singleLine() { return this._bool('single-line'); }
  get indentDetails() { return this._bool('indent-details'); }
  get hideSpinButtons() { return this._bool('hide-spin-buttons'); }
  get persistentPlaceholder() { return this._bool('persistent-placeholder'); }
  get persistentCounter() { return this._bool('persistent-counter'); }
  get persistentClear() { return this._bool('persistent-clear'); }
  get persistentHint() { return this._bool('persistent-hint'); }
  get prefix() { return this._attr('prefix', ''); }
  get suffix() { return this._attr('suffix', ''); }
  get prependIcon() { return this._attr('prepend-icon', ''); }
  get appendIcon() { return this._attr('append-icon', ''); }
  get prependInnerIcon() { return this._attr('prepend-inner-icon', ''); }
  get appendInnerIcon() { return this._attr('append-inner-icon', ''); }
  get clearIcon() { return this._attr('clear-icon', ''); }
  get iconColor() { return this._attr('icon-color', ''); }
  get autofocus() { return this._bool('autofocus'); }
  get autocompleteHint() { return this._attr('autocomplete', 'off'); }
  get messages() { return wValueList(this._attr('messages', '')); }
  get errorMessages() { return wValueList(this._attr('error-messages', '')); }
  get maxErrors() { return Number(this._attr('max-errors', '1')) || 1; }
  get validateOn() { return this._attr('validate-on', 'eager'); }

  // `counter` is a bare attribute (25 chars) or an explicit maximum.
  get counterMax() {
    const raw = this.getAttribute('counter');
    if (raw == null || raw === 'false') return 0;
    const n = Number(raw);
    return n > 0 ? n : 25;
  }

  _uid() {
    if (!this.__uid) this.__uid = 'w-ac-' + Math.random().toString(36).slice(2, 8);
    return this.__uid;
  }

  get value() {
    return this._value !== undefined ? this._value : this._attr('value', '');
  }
  set value(v) {
    this._value = v;
    this._silentSet('value', v);
    if (this._rendered) this._syncValue();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (!this._rendered) return;
    if (oldVal === newVal) return;

    if (name === 'open') {
      this._applyOpen();
      return;
    }
    if (name === 'menu') {
      this._silentSet('open', newVal == null ? null : '');
      this._applyOpen();
      return;
    }
    if (name === 'search') {
      this._applySearch(newVal);
      return;
    }
    if (name === 'loading') {
      this._applyLoading();
      return;
    }
    if (name === 'value') {
      if (this._value !== newVal) this._value = newVal;
      this._syncValue();
      return;
    }

    super.attributeChangedCallback(name, oldVal, newVal);
  }

  _applySearch(text) {
    const input = this._q('.w-autocomplete-input');
    if (input) input.value = text || '';
    this._filter();
    this._syncClear();
    this._syncDetails();
  }

  _template() {
    const inputId = this._uid() + '-input';
    const listId = this._uid() + '-list';
    const root = `<div class="w-autocomplete${this._rootClasses()}"${this._rootStyle()}>`
      + `${this._wrapMarkup(inputId, listId)}${this._listMarkup(listId)}${this._hiddenMarkup()}</div>`;
    return this._fieldMarkup(this._outerMarkup(root), inputId);
  }

  // Modifier classes for the whole control; every one of them is consumed by
  // autocompletes.css.
  _rootClasses() {
    return this._cls({
      ['w-autocomplete--' + this.variant]: this.variant,
      'w-autocomplete--flat': this.flat,
      'w-autocomplete--reverse': this.reverse,
      'w-autocomplete--active': this.active,
      'w-autocomplete--glow': this.glow,
      'w-autocomplete--center-affix': this.centerAffix,
      'w-autocomplete--single-line': this.singleLine,
      'w-autocomplete--indent-details': this.indentDetails,
      'w-autocomplete--hide-spin-buttons': this.hideSpinButtons,
      'w-autocomplete--persistent-placeholder': this.persistentPlaceholder,
      'w-autocomplete--persistent-counter': this.persistentCounter,
      'w-autocomplete--persistent-clear': this.persistentClear,
      'w-autocomplete--persistent-hint': this.persistentHint,
    });
  }

  _rootStyle() {
    const style = [
      this.itemColor ? `--w-autocomplete-item-color:${this._colorValue(this.itemColor)}` : '',
      this.iconColor ? `--w-autocomplete-icon-color:${this._colorValue(this.iconColor)}` : '',
    ].filter(Boolean).join(';');
    return style ? ` style="${this._esc(style)}"` : '';
  }

  // A bare word is read as a design token, anything else as a literal color.
  _colorValue(value) {
    const text = String(value);
    if (/^[a-z][a-z0-9-]*$/i.test(text)) return `var(--w-${text}, ${text})`;
    return text.replace(/[^\w#(),.%\s-]/g, '');
  }

  // Outside icons sit beside the control, so they only get a flex row when one
  // of them is actually present.
  _outerMarkup(root) {
    const before = this._sideIconMarkup('prepend', this.prependIcon);
    const after = this._sideIconMarkup('append', this.appendIcon);
    if (!before && !after) return root;
    // The modifier classes and the color custom properties repeat on the outer
    // row so the outside icons see the same state as the control.
    return `<div class="w-autocomplete-outer${this._rootClasses()}"${this._rootStyle()}>${before}${root}${after}</div>`;
  }

  _sideIconMarkup(side, name) {
    if (!name) return '';
    return `<span class="w-autocomplete-${side}">${this._iconHtml(name)}</span>`;
  }

  _iconHtml(name) {
    return WIcons.resolve(name, { iconClass: 'w-icon w-autocomplete-icon' });
  }

  _affixMarkup(side, text) {
    if (!text) return '';
    return `<span class="w-autocomplete-affix w-autocomplete-${side}">${this._esc(text)}</span>`;
  }

  _wrapMarkup(inputId, listId) {
    const loadingClass = this._cls({ 'w-autocomplete-loading': this.loading });

    return `<div class="w-autocomplete-wrap${loadingClass}">
      ${this._sideIconMarkup('prepend-inner', this.prependInnerIcon)}
      ${this._affixMarkup('prefix', this.prefix)}
      <div class="w-autocomplete-chips">${this._renderChips()}</div>
      ${this._inputMarkup(inputId, listId)}
      ${this._affixMarkup('suffix', this.suffix)}
      ${this._sideIconMarkup('append-inner', this.appendInnerIcon)}
      ${this._clearMarkup()}
      ${this._menuIconMarkup()}
    </div>`;
  }

  _inputMarkup(inputId, listId) {
    const sizeClass = this._cls({ ['w-input--' + this.size]: this.size });
    return `<input${this._attrs({
      id: inputId,
      class: 'w-input w-autocomplete-input' + sizeClass,
      type: this.type,
      role: 'combobox',
      'aria-expanded': 'false',
      'aria-controls': listId,
      'aria-autocomplete': 'list',
      autocomplete: this._autocompleteValue(),
      name: this._suppressName(),
      value: this.search,
      placeholder: this._placeholderText(),
      'aria-label': this._inputAriaLabel(),
      title: this.closeText,
      disabled: this.disabled,
      readonly: this.readonly,
      autofocus: this.autofocus,
    })}>`;
  }

  // Vuetify's `suppress` turns the native hint off and randomises the field
  // name so password managers stop matching it.
  _autocompleteValue() {
    return this.autocompleteHint === 'suppress' ? 'off' : this.autocompleteHint;
  }

  _suppressName() {
    return this.autocompleteHint === 'suppress' ? this._uid() + '-nosuggest' : '';
  }

  _placeholderText() {
    if (this.placeholder) return this.placeholder;
    return this.singleLine ? this.label : '';
  }

  _inputAriaLabel() {
    if (this.closeText) return this.closeText;
    return this.label || this.placeholder || 'Select option';
  }

  _clearMarkup() {
    if (!this.clearable) return '';
    const glyph = this.clearIcon ? this._iconHtml(this.clearIcon) : '&#x2715;';
    return `<button class="w-autocomplete-clear" type="button" aria-label="Clear" hidden>${glyph}</button>`;
  }

  _menuIconMarkup() {
    if (!this.menuIcon) return '';
    return `<button class="w-autocomplete-menu-icon" type="button" tabindex="-1" aria-label="Toggle list">`
      + `${this._iconHtml(this.menuIcon)}</button>`;
  }

  _listMarkup(listId) {
    const elevation = this._cls({ [this._commonClass('elevation-', this.menuElevation)]: this.menuElevation });
    return `<div class="w-autocomplete-list${elevation}" id="${listId}" role="listbox" hidden>
      <div class="w-autocomplete-empty" hidden>${this._esc(this.noDataText)}</div>
      ${this._renderItems()}
    </div>`;
  }

  _hiddenMarkup() {
    return this.name ? `<input type="hidden" name="${this._esc(this.name)}" value="${this._esc(this._hiddenValue())}">` : '';
  }

  // Wraps the control in a <w-field> shell only when there is label/hint/error
  // text or a details row to show; a bare autocomplete renders the control alone.
  _fieldMarkup(root, inputId) {
    const details = this._detailsMarkup();
    if (!this.label && !this.hint && !this.error && !details) return root;
    return `<div class="w-field${this._cls({ 'w-field-error': this._errorText() })}">
        ${this._labelMarkup(inputId)}
        ${root}
        ${this._hintMarkup()}
        ${details}
      </div>`;
  }

  _labelMarkup(inputId) {
    if (!this.label || this.singleLine) return '';
    return `<label class="w-field-label" for="${inputId}">${this._esc(this.label)}</label>`;
  }

  // The error text normally replaces the hint; `persistent-hint` keeps the hint
  // alongside it.
  _hintMarkup() {
    const message = this.error || this.hint;
    if (!message) return '';
    const keep = this.persistentHint && this.error && this.hint;
    const extra = keep ? `<span class="w-field-hint w-field-hint--persistent">${this._esc(this.hint)}</span>` : '';
    return `<span class="w-field-hint">${this._esc(message)}</span>${extra}`;
  }

  /* Details row: messages, error messages, character counter */

  _errorText() {
    return this.error || this._shownErrors()[0] || '';
  }

  // `validate-on` decides *when* error-messages surface; there is no rules
  // engine here, so the trigger simply gates their display.
  _errorsVisible() {
    const tokens = this.validateOn.split(/\s+/);
    if (tokens.includes('eager')) return true;
    if (tokens.includes('blur')) return !!this._blurred;
    if (tokens.includes('input')) return !!this._typed;
    if (tokens.includes('submit')) return !!this._submitted;
    if (tokens.includes('lazy')) return !!(this._blurred || this._typed);
    return true;
  }

  _shownErrors() {
    if (!this._errorsVisible()) return [];
    return this.errorMessages.slice(0, this.maxErrors);
  }

  _hasDetailSources() {
    return !!(this.counterMax || this.messages.length || this.errorMessages.length);
  }

  _detailsHidden() {
    const raw = this.getAttribute('hide-details');
    if (raw == null || raw === 'false') return false;
    if (raw !== 'auto') return true;
    return !this._detailsContent();
  }

  _detailsMarkup() {
    if (!this._hasDetailSources()) return '';
    if (this._detailsHidden()) return '';
    return `<div class="w-autocomplete-details">${this._detailsContent()}</div>`;
  }

  _detailsContent() {
    return this._messagesMarkup() + this._counterMarkup();
  }

  _messagesMarkup() {
    const errors = this._shownErrors();
    const list = errors.length ? errors : this.messages;
    if (!list.length) return '';
    const cls = errors.length ? ' w-autocomplete-messages--error' : '';
    const role = errors.length ? ' role="alert"' : '';
    const items = list.map((text) => `<span class="w-autocomplete-message">${this._esc(text)}</span>`).join('');
    return `<div class="w-autocomplete-messages${cls}"${role}>${items}</div>`;
  }

  _counterMarkup() {
    if (!this.counterMax) return '';
    return `<span class="w-autocomplete-counter">${this._counterText()}</span>`;
  }

  _counterText() {
    const input = this._q('.w-autocomplete-input');
    const text = input ? input.value : this.search;
    return `${text.length} / ${this.counterMax}`;
  }

  // Refresh the details row (and the error state) without a re-render, which
  // would interrupt typing.
  _syncDetails() {
    const details = this._q('.w-autocomplete-details');
    if (details) details.innerHTML = this._detailsContent();
    const field = this._q('.w-field');
    if (field) field.classList.toggle('w-field-error', !!this._errorText());
  }

  _events() {
    const input = this._q('.w-autocomplete-input');
    const list = this._q('.w-autocomplete-list');
    if (!input || !list) return;

    input.addEventListener('input', (event) => {
      event.stopPropagation();
      this._setOpen(true);
      this._filter();
      this._syncClear();
      this._emit('input', { value: input.value, name: this.name });
    });

    input.addEventListener('keydown', (event) => this._onKeydown(event));

    input.addEventListener('click', () => {
      if (!this.disabled && !this.readonly) this._setOpen(true);
    });

    const clearBtn = this._q('.w-autocomplete-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        this._clear();
      });
    }

    list.addEventListener('click', (event) => {
      const item = event.target.closest('.w-autocomplete-item');
      if (!item || item.disabled) return;
      this._selectItem(item);
    });

    list.addEventListener('pointermove', (event) => {
      const item = event.target.closest('.w-autocomplete-item');
      if (item && !item.hidden && !item.disabled) this._activate(item);
    });

    // Keep focus in the input when interacting with the list.
    list.addEventListener('mousedown', (event) => event.preventDefault());

    // Remove a value when a chip is closed.
    this.addEventListener('close', (event) => {
      const chip = event.target.closest?.('w-chip');
      if (!chip || !this.contains(chip)) return;
      event.stopPropagation();
      this._removeValue(chip.getAttribute('value') || '');
    });
    this._bindFieldSurface();
    if (this.hasAttribute('open')) this._applyOpen();
    this._syncValue();
    this._syncClear();
  }

  // Wiring for the Vuetify field surface: counter/validation bookkeeping, the
  // menu toggle button, and the `menu` alias of `open`.
  _bindFieldSurface() {
    if (this.hasAttribute('menu')) this._silentSet('open', '');

    const input = this._q('.w-autocomplete-input');
    if (input) {
      input.addEventListener('input', () => { this._typed = true; this._syncDetails(); });
      input.addEventListener('blur', () => { this._blurred = true; this._syncDetails(); });
    }

    const menuBtn = this._q('.w-autocomplete-menu-icon');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => this._setOpen(!this.hasAttribute('open')));
    }

    const form = this.closest('form');
    if (form && !this.__submitBound) {
      this.__submitBound = true;
      form.addEventListener('submit', () => { this._submitted = true; this._syncDetails(); });
    }
  }

  /* Items */

  _parseItems() {
    const raw = this.getAttribute('items');
    const parsed = wParseRecords(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => this._normalizeItem(item));
  }

  _normalizeItem(item) {
    if (item && typeof item === 'object') return this._normalizeRecord(item);
    const text = String(item ?? '');
    return { title: text, value: text, subtitle: '', disabled: false, fields: { title: text, value: text } };
  }

  _normalizeRecord(item) {
    const title = String(item[this.itemTitle] ?? item.title ?? Object.values(item)[0] ?? '');
    const value = String(item[this.itemValue] ?? item.value ?? Object.values(item)[0] ?? '');
    return {
      title,
      value,
      subtitle: item.subtitle ? String(item.subtitle) : '',
      disabled: !!item.disabled,
      fields: this._recordFields(item, title, value),
    };
  }

  // Every own key of the source record stays available so `filter-keys` and
  // `return-object` can address fields the normalized item drops.
  _recordFields(item, title, value) {
    const fields = { title, value };
    Object.keys(item).forEach((key) => { fields[key] = String(item[key] ?? ''); });
    return fields;
  }

  _findItem(value) {
    return this._parseItems().find((item) => item.value === value);
  }

  _renderItems() {
    const items = this._parseItems();
    if (!items.length) return '<slot></slot>';
    return items.map((item, index) => {
      const id = `${this._uid()}-opt-${index}`;
      const selected = this._hasValue(item.value);
      const disabled = item.disabled ? ' disabled' : '';
      const subtitle = item.subtitle
        ? `<span class="w-autocomplete-item-subtitle">${this._esc(item.subtitle)}</span>`
        : '';
      const content = subtitle
        ? `<span class="w-autocomplete-item-content"><span class="w-autocomplete-item-title">${this._esc(item.title)}</span>${subtitle}</span>`
        : this._esc(item.title);
      return `<button type="button" class="w-autocomplete-item" id="${id}" data-index="${index}" value="${this._esc(item.value)}" title="${this._esc(item.title)}" role="option" aria-selected="${selected ? 'true' : 'false'}"${disabled}>${content}</button>`;
    }).join('');
  }

  /* Value / chips */

  _valueArray() {
    return wValueList(this.value);
  }

  _hasValue(value) {
    return this._valueArray().includes(value);
  }

  _renderChips() {
    if (!this.chips) return '';
    const values = this._valueArray();
    if (!values.length) return '';
    return values.map((value) => {
      const item = this._findItem(value);
      const text = item ? item.title : value;
      const closable = this.closableChips || this.clearable ? ' closable' : '';
      return `<w-chip class="w-autocomplete-chip" text="${this._esc(text)}" value="${this._esc(value)}" size="small"${closable}></w-chip>`;
    }).join('');
  }

  // `return-object` submits the whole record (JSON) instead of the item-value.
  _hiddenValue() {
    if (!this.returnObject) return this.value;
    const records = this._valueArray().map((value) => this._recordFor(value)).filter(Boolean);
    if (!records.length) return this.value;
    return JSON.stringify(this.multiple ? records : records[0]);
  }

  _recordFor(value) {
    const item = this._findItem(value);
    if (!item) return null;
    return item.fields || { title: item.title, value: item.value };
  }

  _syncValue() {
    const hidden = this._q('input[type="hidden"]');
    if (hidden) hidden.value = this._hiddenValue();

    const chipsEl = this._q('.w-autocomplete-chips');
    if (chipsEl) chipsEl.innerHTML = this._renderChips();

    const input = this._q('.w-autocomplete-input');
    if (input && !this.multiple && document.activeElement !== input) {
      const item = this._findItem(this.value);
      input.value = item ? item.title : (this.value || this.search || '');
    }

    this._qAll('.w-autocomplete-item').forEach((btn) => {
      const selected = this._hasValue(btn.getAttribute('value'));
      btn.setAttribute('aria-selected', selected ? 'true' : 'false');
    });

    this._syncClear();
  }

  _commit(values) {
    const next = this.multiple ? values.join(',') : (values[0] || '');
    this.value = next;
  }

  _removeValue(value) {
    const values = this._valueArray().filter((v) => v !== value);
    this._commit(values);
    if (this.hasAttribute('open')) this._filter();
  }

  _clear() {
    this.value = '';
    const input = this._q('.w-autocomplete-input');
    if (input) input.value = '';
    this._filter();
    if (this.openOnClear) this._setOpen(true);
    else this._closeList();
    this._syncDetails();
    this._emit('change', { value: '', name: this.name });
    this._emit('input', { name: this.name });
    if (input) input.focus();
  }

  /* Filtering */

  _filter() {
    const input = this._q('.w-autocomplete-input');
    const empty = this._q('.w-autocomplete-empty');
    const items = this._qAll('.w-autocomplete-item');
    if (!input) return;

    const query = input.value.trim().toLowerCase();
    let visible = 0;

    items.forEach((item) => {
      if (this._applyItemVisibility(item, query)) visible += 1;
    });

    if (empty) {
      const itemsExist = items.length > 0;
      empty.hidden = this.hideNoData || visible > 0 || (!query && itemsExist);
    }

    if (this.autoSelectFirst && visible > 0) {
      this._activate(Array.from(items).find((item) => !item.hidden));
    } else if (!this.autoSelectFirst) {
      this._activate(null);
    }
  }

  _applyItemVisibility(item, query) {
    const matchesQuery = this.noFilter || !query || this._matchItem(item, query);
    const selectedAndHidden = this.hideSelected && this._hasValue(item.getAttribute('value') || '');
    item.hidden = !(matchesQuery && !selectedAndHidden);
    return !item.hidden;
  }

  _matchItem(item, query) {
    if (this.filterKeys.length || this.hasAttribute('filter-mode')) return this._modeMatch(item, query);
    return this._domFields(item).join(' ').toLowerCase().includes(query);
  }

  _domFields(item) {
    const subtitle = item.querySelector('.w-autocomplete-item-subtitle')?.textContent || '';
    return [item.getAttribute('title') || '', subtitle, item.getAttribute('value') || ''];
  }

  // Field map for the rendered option: the source record when the option came
  // from `items`, otherwise whatever the DOM carries (slotted options).
  _itemFields(item) {
    const index = Number(item.getAttribute('data-index'));
    const record = Number.isInteger(index) ? this._parseItems()[index] : null;
    if (record && record.fields) return record.fields;
    const [title, subtitle, value] = this._domFields(item);
    return { title, subtitle, value };
  }

  // `filter-keys` splits the record into keyed columns and the rest;
  // `filter-mode` says how the two results combine (Vuetify semantics).
  _modeMatch(item, query) {
    const fields = this._itemFields(item);
    const keys = this.filterKeys;
    const hit = (text) => String(text).toLowerCase().includes(query);
    const keyed = Object.keys(fields).filter((key) => keys.includes(key)).map((key) => fields[key]);
    const rest = Object.keys(fields).filter((key) => !keys.includes(key)).map((key) => fields[key]);
    return this._combineMatch({
      hasKeys: keyed.length > 0,
      keyAll: keyed.every(hit),
      keySome: keyed.some(hit),
      restAll: rest.every(hit),
      restSome: rest.some(hit),
    });
  }

  _combineMatch(m) {
    const modes = {
      every: () => m.restAll && m.keyAll,
      union: () => m.restSome || m.keyAll,
      intersection: () => m.restSome && m.keyAll,
      some: () => m.restSome || m.keySome,
    };
    if (!m.hasKeys) return this.filterMode === 'every' ? m.restAll : m.restSome;
    return (modes[this.filterMode] || modes.some)();
  }

  /* Keyboard navigation */

  _onKeydown(event) {
    const action = AUTOCOMPLETE_KEYS[event.key];
    if (!action) return;
    const input = this._q('.w-autocomplete-input');
    if (!input) return;
    this[action](event, input);
  }

  _keyNext(event) {
    event.preventDefault();
    this._setOpen(true);
    this._move(1);
  }

  _keyPrevious(event) {
    event.preventDefault();
    this._move(-1);
  }

  _keyFirst(event) {
    event.preventDefault();
    const items = this._visibleItems();
    if (items.length) this._activate(items[0]);
  }

  _keyLast(event) {
    event.preventDefault();
    const items = this._visibleItems();
    if (items.length) this._activate(items[items.length - 1]);
  }

  _keyEnter(event, input) {
    event.preventDefault();
    if (this._activeEl && !this._activeEl.hidden) {
      this._selectItem(this._activeEl);
    } else if (this._isCombobox && input.value.trim()) {
      this._commitFreeText(input.value.trim());
    }
  }

  _keyEscape(event) {
    event.preventDefault();
    this._closeList();
  }

  _keyTab() {
    this._closeList();
  }

  _visibleItems() {
    return Array.from(this._qAll('.w-autocomplete-item')).filter((item) => !item.hidden && !item.disabled);
  }

  _move(delta) {
    const items = this._visibleItems();
    if (!items.length) return this._activate(null);
    let index = items.indexOf(this._activeEl);
    index = index < 0 ? (delta > 0 ? 0 : items.length - 1) : (index + delta + items.length) % items.length;
    this._activate(items[index]);
  }

  _activate(item) {
    this._activeEl = item || null;
    const input = this._q('.w-autocomplete-input');

    this._qAll('.w-autocomplete-item').forEach((btn) => {
      btn.classList.toggle('active', btn === item);
    });

    if (input) {
      if (item && item.id) input.setAttribute('aria-activedescendant', item.id);
      else input.removeAttribute('aria-activedescendant');
    }

    if (item && !this.noAutoScroll) item.scrollIntoView({ block: 'nearest' });
  }

  _selectItem(item) {
    const value = item.getAttribute('value') || '';
    const title = item.getAttribute('title') || value;
    const input = this._q('.w-autocomplete-input');

    if (this.multiple) {
      const values = this._valueArray();
      if (!values.includes(value)) values.push(value);
      this._commit(values);
      this._afterMultiSelect(input);
    } else {
      this._commit([value]);
      this._closeList();
      if (input) input.value = title;
    }

    this._syncDetails();
    this._emit('change', this._changeDetail(value, title));
  }

  // `clear-on-select` (default on) wipes the search text after each pick.
  _afterMultiSelect(input) {
    if (input && this.clearOnSelect) input.value = '';
    if (input) input.focus();
    this._filter();
  }

  _changeDetail(value, title) {
    const detail = { value: this.value, title, name: this.name };
    if (this.returnObject) detail.item = this._recordFor(value);
    return detail;
  }

  _commitFreeText(text) {
    const input = this._q('.w-autocomplete-input');

    if (this.multiple) {
      const values = this._valueArray();
      if (!values.includes(text)) values.push(text);
      this._commit(values);
      this._afterMultiSelect(input);
    } else {
      this._commit([text]);
      this._closeList();
    }

    this._syncDetails();
    this._emit('change', this._changeDetail(text, text));
  }

  /* Open / close */

  _setOpen(open) {
    if (this.disabled || this.readonly) return;
    if (open) this._silentSet('open', '');
    else this._silentSet('open', null);
  }

  _applyOpen() {
    const list = this._q('.w-autocomplete-list');
    const input = this._q('.w-autocomplete-input');
    if (!list || !input) return;

    const open = this.hasAttribute('open');
    list.hidden = !open;
    input.setAttribute('aria-expanded', open ? 'true' : 'false');
    this._applyMenuText(open, input);

    if (open) {
      this._addOutsideListener();
      this._filter();
    } else {
      this._removeOutsideListener();
      this._activate(null);
    }
  }

  // `open-text` / `close-text` name the control for screen readers depending on
  // whether the list is showing.
  _applyMenuText(open, input) {
    const text = open ? this.openText : this.closeText;
    if (!text) return;
    input.setAttribute('title', text);
    input.setAttribute('aria-label', text);
  }

  _closeList() {
    this._setOpen(false);
  }

  _addOutsideListener() {
    if (this.__outsideListener) return;
    this.__outsideListener = (event) => {
      if (!this.contains(event.target)) this._closeList();
    };
    document.addEventListener('pointerdown', this.__outsideListener);
  }

  _removeOutsideListener() {
    if (!this.__outsideListener) return;
    document.removeEventListener('pointerdown', this.__outsideListener);
    this.__outsideListener = null;
  }

  _applyLoading() {
    const wrap = this._q('.w-autocomplete-wrap');
    if (wrap) wrap.classList.toggle('w-autocomplete-loading', this.loading);
  }

  _syncClear() {
    const clear = this._q('.w-autocomplete-clear');
    const input = this._q('.w-autocomplete-input');
    if (!clear) return;
    const hasValue = !!this.value || !!(input && input.value);
    clear.hidden = !hasValue;
  }

  disconnectedCallback() {
    this._removeOutsideListener();
  }

  focus() {
    const input = this._q('.w-autocomplete-input');
    if (input) input.focus();
  }
}

if (!customElements.get('w-autocomplete')) {
  customElements.define('w-autocomplete', WAutocomplete);
}
