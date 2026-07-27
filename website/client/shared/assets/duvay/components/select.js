/* <w-select> — custom-dropdown select, mirroring Vuetify's <v-select>.
 *
 * A styled trigger that opens an overlay listbox of options. Supports single
 * and multiple selection (multiple shown as removable chips), a clear button,
 * a checkmark on selected items, keyboard navigation, and outside-click close.
 * A hidden input mirrors the value for native <form> submission.
 *
 * For a plain, zero-JS native <select>, use <w-native-select>.
 *
 * Attributes:
 *   value               - selected value (comma-joined when multiple)
 *   multiple            - allow multiple selections
 *   chips               - render selections as chips (implied by multiple)
 *   closable-chips      - chips show a remove button
 *   clearable           - show a clear (×) button
 *   persistent-clear    - keep the clear button visible while empty
 *   clear-icon          - icon name/glyph for the clear button
 *   open-on-clear       - keep/open the menu after clearing
 *   placeholder         - text shown when nothing is selected
 *   persistent-placeholder - show the placeholder even when a value is selected
 *   label, hint, error  - field label / helper / error text
 *   persistent-hint     - keep the hint visible alongside an error
 *   messages            - extra messages (string, or JSON array of strings)
 *   error-messages      - error messages (string, or JSON array); sets the error state
 *   max-errors          - how many error messages to show (default 1)
 *   validate-on         - `lazy` withholds errors until the user interacts;
 *                         a `blur` token makes blur (not selection) the trigger
 *   hide-details        - suppress the details row (`auto` == the default)
 *   indent-details      - inset the details row
 *   counter             - selection counter; a number sets the maximum shown
 *   persistent-counter  - keep the counter visible while empty and unfocused
 *   name                - form field name (renders a hidden input)
 *   autocomplete        - `autocomplete` for the hidden input (`suppress` == off)
 *   size                - xs | sm | lg | xl
 *   variant             - outlined | filled | underlined | plain | solo |
 *                         solo-filled | solo-inverted
 *   flat                - drop the elevation of the solo variants
 *   reverse             - reverse the control's horizontal order
 *   active              - render the highlighted/active state
 *   single-line         - no label above the control; it becomes the placeholder
 *   center-affix        - vertically center the affixes/icons
 *   glow                - light up the icons while the field is focused
 *   icon-color          - color for the affix icons and the menu icon
 *   prefix, suffix      - static text inside the control
 *   prepend-icon, append-icon             - icons outside the control
 *   prepend-inner-icon, append-inner-icon - icons inside the control
 *   icon-set            - icon set prefix for every *-icon attribute
 *   menu-icon           - menu (chevron) icon; `false` hides it
 *   menu                - render with the menu already open
 *   menu-elevation      - elevation step for the menu
 *   item-color          - color of the selected items
 *   transition          - fade | scale | slide-y | slide-x menu transition
 *   no-auto-scroll      - do not scroll the active item into view
 *   open-text/close-text - aria-label + title while the menu is open / closed
 *   items               - options as CSV or a JSON array (alternative to <w-option>)
 *   item-title/item-value - keys read from object items
 *   return-object       - `change` reports the item object instead of its value
 *   search              - filter the options by this text
 *   no-filter           - disable `search` filtering
 *   filter-keys         - item keys the search runs against
 *   filter-mode         - some | union (any key) | every | intersection (all keys)
 *   hide-selected       - hide already-selected options
 *   no-data-text        - message shown when no option is visible
 *   hide-no-data        - suppress that message
 *   autofocus           - focus the trigger on first render
 *   disabled, readonly  - non-interactive states
 *
 * Children:
 *   <w-option value="x" [disabled]>Label</w-option>
 *
 * Events:
 *   change              - { value, name } on selection change
 */

import WIcons from '../icons.js';
import { wValueList, wParseRecords, wRecordValue } from './utils.js';

const CHEVRON = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>';
const CHECK = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';

let selectUid = 0;

/* ── Shared Vuetify field surface ───────────────────────────────────────────
 * <w-select> and <w-combobox> expose the same VField prop surface but sit on
 * different bases (WElement vs WAutocomplete), so the shared parts live here
 * as host-agnostic helpers that <w-combobox> imports. Every modifier class is
 * written against the control root, whichever element that is.
 */

const FIELD_FLAGS = [
  'flat', 'reverse', 'center-affix', 'glow', 'single-line', 'active',
  'indent-details', 'hide-spin-buttons', 'persistent-clear',
  'persistent-placeholder', 'persistent-counter',
];

const FIELD_VARIANTS = [
  'outlined', 'filled', 'underlined', 'plain', 'solo', 'solo-filled', 'solo-inverted',
];

const MENU_TRANSITIONS = {
  fade: 'w-animate-fade-in',
  scale: 'w-animate-scale-in',
  'slide-y': 'w-animate-slide-y-in',
  'slide-x': 'w-animate-slide-x-in',
};

// Modifier classes for the surface flags plus `variant`, as an array so both
// a template string and classList.add(...) can consume it.
function wFieldClasses(host) {
  const names = FIELD_FLAGS
    .filter((flag) => host.hasAttribute(flag))
    .map((flag) => 'w-field--' + flag);
  const variant = host.getAttribute('variant');
  if (variant && FIELD_VARIANTS.includes(variant)) names.push('w-field--variant-' + variant);
  return names;
}

// A token name resolves to its custom property (falling back to the literal),
// so `icon-color="primary"` and `icon-color="#c00"` both work. Characters that
// could break out of a style attribute are dropped.
function wSafeColor(value) {
  const text = String(value == null ? '' : value).trim().replace(/[^\w#(),.%\s-]/g, '');
  if (!text) return '';
  return /^[a-z][\w-]*$/i.test(text) ? `var(--w-${text}, ${text})` : text;
}

// Resolve an icon attribute through the registry, honouring `icon-set`.
// A literal glyph works too — the default `text` set renders it as-is.
function wIconHtml(host, attr, cls) {
  const name = host.getAttribute(attr);
  if (!name || name === 'false') return '';
  const set = host.getAttribute('icon-set');
  return WIcons.resolve(set ? `${set}:${name}` : name, { iconClass: 'w-icon ' + cls });
}

// `messages` / `error-messages` accept a single string or a JSON array.
function wMessageList(value) {
  const text = String(value == null ? '' : value).trim();
  if (!text) return [];
  return text.startsWith('[') ? wValueList(text) : [text];
}

// The `error` attribute and `error-messages`, capped by `max-errors` (1).
function wErrorTexts(host, error = '') {
  const all = (error ? [error] : []).concat(wMessageList(host.getAttribute('error-messages')));
  const max = Number(host.getAttribute('max-errors'));
  return all.slice(0, Number.isFinite(max) && max > 0 ? max : 1);
}

function wHideDetails(host) {
  return host.hasAttribute('hide-details') && host.getAttribute('hide-details') !== 'auto';
}

// `validate-on` only carries a lazy/eager distinction here: `lazy` withholds
// the error state until the user has interacted with the field.
function wSuppressErrors(host, touched) {
  const mode = host.getAttribute('validate-on') || '';
  return mode.includes('lazy') && !touched;
}

// Everything in the details row after the primary message: the remaining
// error messages, `messages`, a persistent hint, and the counter.
function wFieldExtrasHtml(host, { error = '', hint = '', counter = '', suppress = false, skipFirst = false } = {}) {
  const errors = suppress ? [] : wErrorTexts(host, error);
  const rows = errors.slice(skipFirst ? 1 : 0).map((text) => ({ text, error: true }))
    .concat(wMessageList(host.getAttribute('messages')).map((text) => ({ text, error: false })));
  if (errors.length && hint && host.hasAttribute('persistent-hint')) rows.push({ text: hint, error: false });
  const messages = rows
    .map((row) => `<span class="w-field-message${row.error ? ' w-field-message--error' : ''}">${host._esc(row.text)}</span>`)
    .join('');
  return messages + (counter ? `<span class="w-field-counter">${host._esc(counter)}</span>` : '');
}

// The full details row content: primary message (error first, else the hint)
// followed by the extras above.
function wDetailsHtml(host, options = {}) {
  const { error = '', hint = '', counter = '', suppress = false } = options;
  const errors = suppress ? [] : wErrorTexts(host, error);
  const primary = errors[0] || hint;
  const primaryHtml = primary ? `<span class="w-field-hint">${host._esc(primary)}</span>` : '';
  return primaryHtml + wFieldExtrasHtml(host, { error, hint, counter, suppress, skipFirst: !!errors[0] });
}

function wFilterKeys(host) {
  return wValueList(host.getAttribute('filter-keys') || '');
}

// Match a record against a lower-cased query. `filter-keys` narrows the search
// to specific item keys; `filter-mode` decides whether one key matching is
// enough (some / union) or all of them must match (every / intersection).
function wQueryMatches(host, record, haystack, query) {
  if (!query) return true;
  const keys = wFilterKeys(host);
  const fields = keys.length ? keys.map((key) => String(wRecordValue(record, key) ?? '')) : haystack;
  const mode = host.getAttribute('filter-mode') || 'some';
  const hit = (text) => String(text == null ? '' : text).toLowerCase().includes(query);
  return mode === 'every' || mode === 'intersection' ? fields.every(hit) : fields.some(hit);
}

// Elevation step for a dropdown menu, as an `elevation-N` utility class.
function wMenuElevationClass(host) {
  const step = host.getAttribute('menu-elevation') || '';
  return /^\d+$/.test(step) ? 'elevation-' + step : '';
}

function wMenuTransitionClass(host) {
  return MENU_TRANSITIONS[host.getAttribute('transition')] || '';
}

class WSelect extends WElement {
  static attrs = ['value', 'disabled', 'readonly', 'name', 'label', 'hint',
    'error', 'placeholder', 'size', 'multiple', 'chips', 'closable-chips', 'clearable', 'open',
    // Vuetify field surface
    'variant', 'flat', 'reverse', 'active', 'single-line', 'center-affix', 'glow',
    'icon-color', 'indent-details', 'prefix', 'suffix', 'autocomplete', 'autofocus',
    'prepend-icon', 'append-icon', 'prepend-inner-icon', 'append-inner-icon',
    'clear-icon', 'persistent-clear', 'open-on-clear', 'icon-set',
    'persistent-placeholder', 'persistent-hint', 'persistent-counter', 'counter',
    'messages', 'error-messages', 'max-errors', 'validate-on', 'hide-details',
    // Menu + items
    'menu', 'menu-icon', 'menu-elevation', 'item-color', 'transition', 'no-auto-scroll',
    'open-text', 'close-text', 'items', 'item-title', 'item-value', 'return-object',
    'search', 'no-filter', 'filter-keys', 'filter-mode', 'hide-selected',
    'no-data-text', 'hide-no-data'];

  // Keys that open a closed listbox.
  static openKeys = ['Enter', ' ', 'ArrowDown'];

  get value() { return this._attr('value', ''); }
  set value(v) { this._silentSet('value', v == null ? '' : String(v)); this._syncValue(); }
  get disabled() { return this._bool('disabled'); }
  get readonly() { return this._bool('readonly'); }
  get name() { return this._attr('name', ''); }
  get label() { return this._attr('label', ''); }
  get hint() { return this._attr('hint', ''); }
  get error() { return this._attr('error', ''); }
  get placeholder() { return this._attr('placeholder', ''); }
  get size() { return this._attr('size', ''); }
  get multiple() { return this._bool('multiple'); }
  get chips() { return this._bool('chips') || this.multiple; }
  get closableChips() { return this._bool('closable-chips'); }
  get clearable() { return this._bool('clearable'); }
  get itemTitle() { return this._attr('item-title', 'title'); }
  get itemValue() { return this._attr('item-value', 'value'); }
  get noDataText() { return this._attr('no-data-text', 'No data available'); }
  get hideSelected() { return this._bool('hide-selected'); }
  get noFilter() { return this._bool('no-filter'); }
  get search() { return this._attr('search', ''); }

  get values() { return wValueList(this._attr('value', '')); }

  // With `single-line` the label collapses into the placeholder.
  get placeholderText() {
    if (this.placeholder) return this.placeholder;
    return this._bool('single-line') ? this.label : '';
  }

  connectedCallback() {
    super.connectedCallback();
    this._observeOptions();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
    this._removeOutsideListener();
  }

  _observeOptions() {
    if (!this._observer) {
      this._observer = new MutationObserver((mutations) => {
        if (!this._rendered) return;
        // Only react to authored <w-option> changes — ignore our own internal
        // DOM updates (chips, item states) so selection doesn't trigger a storm.
        const touchesOptions = mutations.some((m) =>
          [...m.addedNodes, ...m.removedNodes].some((n) => n.nodeType === 1 && n.tagName === 'W-OPTION'));
        if (!touchesOptions) return;
        this._render();
        this._events();
        this._applyCommonProps?.();
      });
    }
    this._observer.observe(this, { childList: true, subtree: true });
  }

  _render() {
    if (this._observer) this._observer.disconnect();
    super._render();
    if (this.isConnected && this._observer) this._observeOptions();
  }

  _readOptions() {
    const authored = Array.from(this.querySelectorAll('w-option'));
    if (authored.length) {
      this._wOptions = authored.map((opt) => this._authoredOption(opt));
    } else if (this.hasAttribute('items')) {
      this._wOptions = wParseRecords(this.getAttribute('items')).map((record) => this._recordOption(record));
    }
    return this._wOptions || [];
  }

  _authoredOption(opt) {
    const label = opt.textContent.trim();
    const value = opt.getAttribute('value') ?? label;
    const disabled = opt.hasAttribute('disabled');
    return { value, label, disabled, raw: { [this.itemValue]: value, [this.itemTitle]: label, disabled } };
  }

  // Object items read their text/value through item-title / item-value (string
  // keys only — Vuetify's function form has no attribute equivalent).
  _recordOption(record) {
    if (record && typeof record === 'object') {
      const first = Object.values(record)[0];
      const label = String(record[this.itemTitle] ?? record.title ?? first ?? '');
      const value = String(record[this.itemValue] ?? record.value ?? first ?? '');
      return { value, label, disabled: !!record.disabled, raw: record };
    }
    const text = String(record ?? '');
    return { value: text, label: text, disabled: false, raw: text };
  }

  _labelFor(value) {
    const opt = (this._wOptions || []).find((o) => o.value === value);
    return opt ? opt.label : value;
  }

  _rawFor(value) {
    const opt = (this._wOptions || []).find((o) => o.value === value);
    return opt ? opt.raw : value;
  }

  _selectionHtml(values) {
    const placeholder = this._placeholderHtml(values);
    if (values.length && this.chips) {
      const closable = this.closableChips || this.clearable ? ' closable' : '';
      return placeholder + values.map((v) =>
        `<w-chip class="w-select-chip" size="small" value="${this._esc(v)}"${closable}>${this._esc(this._labelFor(v))}</w-chip>`).join('');
    }
    if (values.length) {
      return placeholder + `<span class="w-select-value">${this._esc(values.map((v) => this._labelFor(v)).join(', '))}</span>`;
    }
    return placeholder;
  }

  _placeholderHtml(values) {
    const text = this.placeholderText;
    if (!text) return '';
    if (values.length && !this._bool('persistent-placeholder')) return '';
    return `<span class="w-select-placeholder">${this._esc(text)}</span>`;
  }

  _template() {
    const options = this._readOptions();
    const values = this.values;
    const listId = this._listId || (this._listId = `w-select-list-${++selectUid}`);

    const trigger = this._triggerMarkup(values, listId);
    const list = this._listMarkup(options, values, listId);
    const hidden = this._hiddenMarkup();

    const control = `<div class="w-select-wrap">${trigger}${list}${hidden}</div>`;

    return this._fieldMarkup(this._outerMarkup(control));
  }

  // `prepend-icon` / `append-icon` sit outside the control, so they only add a
  // wrapper row when one of them is set.
  _outerMarkup(control) {
    const before = wIconHtml(this, 'prepend-icon', 'w-field-prepend');
    const after = wIconHtml(this, 'append-icon', 'w-field-append');
    if (!before && !after) return control;
    return `<div class="w-select-outer">${before}${control}${after}</div>`;
  }

  _triggerMarkup(values, listId) {
    const classes = this._cls({ [`w-select--${this.size}`]: this.size })
      + wFieldClasses(this).map((name) => ' ' + name).join('');
    const open = this.hasAttribute('open');
    const menuText = this._menuText(open);
    const state = this._attrs({
      'aria-disabled': this.disabled ? 'true' : '',
      'aria-label': menuText || this.label || this.placeholderText || 'Select option',
      title: menuText,
    });

    return `<div class="w-select w-select-field${classes}" role="combobox" tabindex="${this.disabled ? -1 : 0}"`
      + ` aria-haspopup="listbox" aria-expanded="${open ? 'true' : 'false'}" aria-controls="${listId}"`
      + `${state}${this._triggerStyle()}>`
      + wIconHtml(this, 'prepend-inner-icon', 'w-field-prepend-inner')
      + this._affixHtml('prefix')
      + `<span class="w-select-selection">${this._selectionHtml(values)}</span>`
      + this._affixHtml('suffix')
      + this._clearMarkup(values)
      + this._menuIconHtml()
      + wIconHtml(this, 'append-inner-icon', 'w-field-append-inner')
      + `</div>`;
  }

  _menuText(open) {
    return this._attr(open ? 'open-text' : 'close-text', '');
  }

  _triggerStyle() {
    const color = wSafeColor(this._attr('icon-color', ''));
    return color ? ` style="--w-field-icon-color:${color}"` : '';
  }

  _affixHtml(kind) {
    const text = this._attr(kind, '');
    return text ? `<span class="w-field-affix w-field-${kind}">${this._esc(text)}</span>` : '';
  }

  _menuIconHtml() {
    const icon = this._attr('menu-icon', null);
    if (icon === null) return `<span class="w-select-chevron" aria-hidden="true">${CHEVRON}</span>`;
    const html = wIconHtml(this, 'menu-icon', 'w-select-menu-icon');
    return html ? `<span class="w-select-chevron" aria-hidden="true">${html}</span>` : '';
  }

  _clearMarkup(values) {
    if (!this.clearable || this.disabled || this.readonly) return '';
    const glyph = wIconHtml(this, 'clear-icon', 'w-select-clear-icon') || '&#x2715;';
    const shown = values.length || this._bool('persistent-clear');
    return `<button class="w-select-clear" type="button" aria-label="Clear" tabindex="-1"${shown ? '' : ' hidden'}>${glyph}</button>`;
  }

  _listMarkup(options, values, listId) {
    const items = options.map((opt) => this._itemMarkup(opt, values)).join('');
    const visible = options.filter((opt) => !this._itemHidden(opt, values)).length;
    const classes = this._cls({ [wMenuElevationClass(this)]: true });
    const color = wSafeColor(this._attr('item-color', ''));
    const style = color ? ` style="--w-select-item-color:${color}"` : '';
    return `<div class="w-select-list${classes}" id="${listId}" role="listbox"`
      + `${this.multiple ? ' aria-multiselectable="true"' : ''}${style} hidden>`
      + this._emptyMarkup(visible) + items + `</div>`;
  }

  _emptyMarkup(visible) {
    if (this._bool('hide-no-data')) return '';
    return `<div class="w-select-empty"${visible ? ' hidden' : ''}>${this._esc(this.noDataText)}</div>`;
  }

  // An option drops out of the menu when it is filtered away by `search` or
  // already selected under `hide-selected`.
  _itemHidden(opt, values) {
    if (this.hideSelected && values.includes(opt.value)) return true;
    const query = this.noFilter ? '' : this.search.trim().toLowerCase();
    return !wQueryMatches(this, opt.raw, [opt.label, opt.value], query);
  }

  _itemMarkup(opt, values) {
    const selected = values.includes(opt.value);
    return `<button class="w-select-item" type="button" role="option" value="${this._esc(opt.value)}"`
      + ` aria-selected="${selected ? 'true' : 'false'}"${opt.disabled ? ' disabled' : ''}`
      + `${this._itemHidden(opt, values) ? ' hidden' : ''}>`
      + `<span class="w-select-item-label">${this._esc(opt.label)}</span>`
      + `<span class="w-select-item-check" aria-hidden="true">${CHECK}</span>`
      + `</button>`;
  }

  _hiddenMarkup() {
    if (!this.name) return '';
    const auto = this._attr('autocomplete', '');
    const value = auto === 'suppress' ? 'off' : auto;
    return `<input type="hidden" name="${this._esc(this.name)}" value="${this._esc(this.value)}"`
      + `${value ? ` autocomplete="${this._esc(value)}"` : ''}>`;
  }

  // Wraps the control in a <w-field> shell only when there is a label or a
  // details row to show; a bare select renders the control alone.
  _fieldMarkup(control) {
    const label = this._labelMarkup();
    const details = this._detailsMarkup();
    if (!label && !details) return control;
    const errorClass = this._cls({ 'w-field-error': this._hasError() });
    return `<div class="w-field${errorClass}">
        ${label}
        ${control}
        ${details}
      </div>`;
  }

  _labelMarkup() {
    if (!this.label || this._bool('single-line')) return '';
    return `<label class="w-field-label">${this._esc(this.label)}</label>`;
  }

  _hasError() {
    return !!this.error || (!this._suppressErrors() && wErrorTexts(this).length > 0);
  }

  _suppressErrors() {
    return wSuppressErrors(this, this.__touched);
  }

  _detailsMarkup() {
    if (wHideDetails(this)) return '';
    const inner = this._detailsHtml();
    // The row is also rendered empty when it can gain content later (a counter
    // that only shows on focus, or errors withheld by `validate-on`).
    if (!inner && !this.hasAttribute('counter') && !this.hasAttribute('error-messages')) return '';
    const indent = this._cls({ 'w-field--indent-details': this._bool('indent-details') });
    return `<div class="w-field-details${indent}">${inner}</div>`;
  }

  _detailsHtml() {
    return wDetailsHtml(this, {
      error: this.error,
      hint: this.hint,
      counter: this._counterText(),
      suppress: this._suppressErrors(),
    });
  }

  // The counter reports how many options are selected; a numeric value gives
  // the maximum. It stays out of the way until the field is used, unless
  // `persistent-counter` is set.
  _counterText() {
    if (!this.hasAttribute('counter')) return '';
    const count = this.values.length;
    if (!count && !this.__focused && !this._bool('persistent-counter')) return '';
    const max = this._attr('counter', '');
    return /^\d+$/.test(max) ? `${count} / ${max}` : String(count);
  }

  _events() {
    const trigger = this._q('.w-select-field');
    const list = this._q('.w-select-list');
    if (!trigger || !list) return;

    trigger.addEventListener('click', (event) => {
      if (event.target.closest('.w-select-clear')) return;
      if (this.disabled || this.readonly) return;
      this._setOpen(!this.hasAttribute('open'));
    });
    trigger.addEventListener('keydown', (event) => this._onKeydown(event));
    trigger.addEventListener('focus', () => { this.__focused = true; this._syncDetails(); });
    trigger.addEventListener('blur', () => { this.__focused = false; this._markTouched('blur'); });

    this._clearEvents();
    this._listEvents(list);
    this._chipEvents();
    this._applyStartState(trigger);
    this._applyOpen();
  }

  _clearEvents() {
    const clear = this._q('.w-select-clear');
    if (!clear) return;
    clear.addEventListener('click', (event) => {
      event.stopPropagation();
      const keepOpen = this._bool('open-on-clear');
      this._commit([], { keepOpen });
      if (keepOpen) this._setOpen(true);
    });
  }

  _listEvents(list) {
    list.addEventListener('mousedown', (event) => event.preventDefault()); // keep focus on the trigger
    list.addEventListener('click', (event) => {
      const item = event.target.closest('.w-select-item');
      if (item && !item.disabled) this._selectItem(item);
    });
    list.addEventListener('pointermove', (event) => {
      const item = event.target.closest('.w-select-item');
      if (item && !item.disabled) this._activate(item);
    });
  }

  // Chip removal (multiple). Bound once on the host — survives re-renders.
  _chipEvents() {
    if (this.__chipListeners) return;
    this.__chipListeners = true;
    this.addEventListener('close', (event) => {
      const chip = event.target.closest?.('w-chip');
      if (!chip || !this.contains(chip)) return;
      event.stopPropagation();
      this._removeValue(chip.getAttribute('value') || '');
    });
  }

  // `autofocus` and `menu` are one-shot: they set the initial state without
  // re-asserting it on every re-render.
  _applyStartState(trigger) {
    if (this._bool('autofocus') && !this.__autofocused) {
      this.__autofocused = true;
      trigger.focus();
    }
    if (this.hasAttribute('menu') && !this.__menuOpened) {
      this.__menuOpened = true;
      this._setOpen(true);
    }
  }

  _onKeydown(event) {
    if (this.disabled || this.readonly) return;

    if (!this.hasAttribute('open')) {
      if (WSelect.openKeys.includes(event.key)) {
        event.preventDefault();
        this._setOpen(true); // _applyOpen highlights the selected (or first) item
      }
      return;
    }

    const handler = this._keyHandlers()[event.key];
    if (!handler) return;
    if (event.key !== 'Tab') event.preventDefault();
    handler();
  }

  // key → handler for the open listbox, replacing an if/else-if chain.
  _keyHandlers() {
    const choose = () => { if (this._activeEl) this._selectItem(this._activeEl); };
    const close = () => this._setOpen(false);
    return {
      ArrowDown: () => this._move(1),
      ArrowUp: () => this._move(-1),
      Home: () => { const first = this._items()[0]; if (first) this._activate(first); },
      End: () => { const items = this._items(); if (items.length) this._activate(items[items.length - 1]); },
      Enter: choose,
      ' ': choose,
      Escape: close,
      Tab: close,
    };
  }

  _items() {
    return Array.from(this._qAll('.w-select-item')).filter((el) => !el.disabled && !el.hidden);
  }

  _move(dir) {
    const items = this._items();
    if (!items.length) return;
    const idx = items.indexOf(this._activeEl);
    const next = idx === -1 ? (dir > 0 ? 0 : items.length - 1) : (idx + dir + items.length) % items.length;
    this._activate(items[next]);
  }

  _activate(item) {
    this._activeEl = item || null;
    this._qAll('.w-select-item').forEach((el) => el.classList.toggle('active', el === item));
    if (item && !this._bool('no-auto-scroll')) item.scrollIntoView({ block: 'nearest' });
  }

  _selectItem(item) {
    const value = item.getAttribute('value') || '';
    if (this.multiple) {
      const values = this.values;
      const idx = values.indexOf(value);
      if (idx === -1) values.push(value); else values.splice(idx, 1);
      this._commit(values, { keepOpen: true });
    } else {
      this._commit([value]);
    }
  }

  _removeValue(value) {
    this._commit(this.values.filter((v) => v !== value), { keepOpen: this.hasAttribute('open') });
  }

  _commit(values, { keepOpen = false } = {}) {
    const next = this.multiple ? values.join(',') : (values[0] || '');
    this._silentSet('value', next);
    this._markTouched('change');
    this._syncSelection();
    if (!keepOpen) this._setOpen(false);
    this._emit('change', { value: next, name: this.name });
  }

  // `validate-on="blur …"` waits for the field to be left; every other mode
  // counts a selection as the interaction that reveals validation.
  _markTouched(source) {
    const mode = this._attr('validate-on', '');
    if (mode.includes('blur') && source !== 'blur') return;
    this.__touched = true;
    this._syncDetails();
  }

  // `return-object` reports the whole item on `change` instead of its value.
  _emit(name, detail) {
    if (name !== 'change' || !this._bool('return-object') || !detail) {
      super._emit(name, detail);
      return;
    }
    super._emit(name, { ...detail, value: this._objectValue(detail.value) });
  }

  _objectValue(value) {
    const objects = wValueList(value).map((v) => this._rawFor(v));
    if (this.multiple) return objects;
    return objects.length ? objects[0] : '';
  }

  // Update the trigger display, item states, clear button, details, and hidden
  // input in place — no destructive re-render that would interrupt a click.
  _syncSelection() {
    const values = this.values;
    this._syncItems(values);
    const selection = this._q('.w-select-selection');
    if (selection) selection.innerHTML = this._selectionHtml(values);
    const clear = this._q('.w-select-clear');
    if (clear) clear.hidden = !values.length && !this._bool('persistent-clear');
    this._syncValue();
    this._syncDetails();
  }

  _syncItems(values) {
    const options = this._wOptions || [];
    let visible = 0;
    this._qAll('.w-select-item').forEach((el, index) => {
      const opt = options[index] || { value: el.getAttribute('value') || '', label: el.textContent.trim() };
      el.setAttribute('aria-selected', values.includes(opt.value) ? 'true' : 'false');
      el.hidden = this._itemHidden(opt, values);
      if (!el.hidden) visible += 1;
    });
    const empty = this._q('.w-select-empty');
    if (empty) empty.hidden = visible > 0;
  }

  _syncDetails() {
    const details = this._q('.w-field-details');
    if (details) details.innerHTML = this._detailsHtml();
    const field = this._q('.w-field');
    if (field) field.classList.toggle('w-field-error', this._hasError());
  }

  _syncValue() {
    const hidden = this._q('input[type="hidden"]');
    if (hidden) hidden.value = this.value;
  }

  _setOpen(open) {
    if (this.disabled || this.readonly) return;
    if (open) this._silentSet('open', '');
    else this._silentSet('open', null);
    this._applyOpen();
  }

  _applyOpen() {
    const list = this._q('.w-select-list');
    const trigger = this._q('.w-select-field');
    if (!list || !trigger) return;
    const open = this.hasAttribute('open');
    list.hidden = !open;
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    this._applyMenuText(trigger, open);
    const transition = wMenuTransitionClass(this);
    if (transition) list.classList.toggle(transition, open);
    if (open) {
      this._addOutsideListener();
      // Pre-activate the first selected (or first) item.
      const selected = this._items().find((el) => el.getAttribute('aria-selected') === 'true');
      this._activate(selected || this._items()[0] || null);
    } else {
      this._removeOutsideListener();
      this._activate(null);
    }
  }

  _applyMenuText(trigger, open) {
    const text = this._menuText(open);
    if (!text) return;
    trigger.setAttribute('aria-label', text);
    trigger.setAttribute('title', text);
  }

  _addOutsideListener() {
    if (this.__outside) return;
    this.__outside = (event) => { if (!this.contains(event.target)) this._setOpen(false); };
    document.addEventListener('pointerdown', this.__outside);
  }

  _removeOutsideListener() {
    if (!this.__outside) return;
    document.removeEventListener('pointerdown', this.__outside);
    this.__outside = null;
  }
}

customElements.define('w-select', WSelect);
