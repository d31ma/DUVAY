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
 *
 * Events:
 *   input     - search query changed (detail: { value, name })
 *   change    - value changed (detail: { value, title, name })
 */

import { wValueList, wParseRecords } from './utils.js';

export class WAutocomplete extends WElement {
  static attrs = [
    'label', 'items', 'item-title', 'item-value', 'value',
    'placeholder', 'disabled', 'readonly', 'name', 'hint', 'error', 'size',
    'multiple', 'chips', 'closable-chips', 'clearable', 'loading',
    'no-filter', 'auto-select-first', 'no-data-text', 'hide-no-data',
    'hide-selected', 'open',
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

  _template() {
    const hasField = this.label || this.hint || this.error;
    const inputId = this._uid() + '-input';
    const listId = this._uid() + '-list';
    const sizeClass = this.size ? ' w-input--' + this.size : '';
    const dis = this.disabled ? ' disabled' : '';
    const ro = this.readonly ? ' readonly' : '';
    const loadingClass = this.loading ? ' w-autocomplete-loading' : '';

    const wrap = `<div class="w-autocomplete-wrap${loadingClass}">
      <div class="w-autocomplete-chips">${this._renderChips()}</div>
      <input id="${inputId}" class="w-input w-autocomplete-input${sizeClass}" type="text"
        role="combobox" aria-expanded="false" aria-controls="${listId}" aria-autocomplete="list"
        autocomplete="off" placeholder="${this._esc(this.placeholder)}"${dis}${ro}>
      ${this.clearable ? `<button class="w-autocomplete-clear" type="button" aria-label="Clear" hidden>&#x2715;</button>` : ''}
    </div>`;

    const list = `<div class="w-autocomplete-list" id="${listId}" role="listbox" hidden>
      <div class="w-autocomplete-empty" hidden>${this._esc(this.noDataText)}</div>
      ${this._renderItems()}
    </div>`;

    const hidden = this.name ? `<input type="hidden" name="${this._esc(this.name)}" value="${this._esc(this.value)}">` : '';
    const root = `<div class="w-autocomplete">${wrap}${list}${hidden}</div>`;

    if (hasField) {
      return `<div class="w-field${this.error ? ' w-field-error' : ''}">
        ${this.label ? `<label class="w-field-label" for="${inputId}">${this._esc(this.label)}</label>` : ''}
        ${root}
        ${this.hint || this.error ? `<span class="w-field-hint">${this._esc(this.error || this.hint)}</span>` : ''}
      </div>`;
    }
    return root;
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
    if (this.hasAttribute('open')) this._applyOpen();
    this._syncValue();
    this._syncClear();
  }

  /* Items */

  _parseItems() {
    const raw = this.getAttribute('items');
    const parsed = wParseRecords(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => this._normalizeItem(item));
  }

  _normalizeItem(item) {
    if (item && typeof item === 'object') {
      const title = String(item[this.itemTitle] ?? item.title ?? Object.values(item)[0] ?? '');
      const value = String(item[this.itemValue] ?? item.value ?? Object.values(item)[0] ?? '');
      return {
        title,
        value,
        subtitle: item.subtitle ? String(item.subtitle) : '',
        disabled: !!item.disabled,
      };
    }
    const text = String(item ?? '');
    return { title: text, value: text, subtitle: '', disabled: false };
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
      return `<button type="button" class="w-autocomplete-item" id="${id}" value="${this._esc(item.value)}" title="${this._esc(item.title)}" role="option" aria-selected="${selected ? 'true' : 'false'}"${disabled}>${content}</button>`;
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

  _syncValue() {
    const hidden = this._q('input[type="hidden"]');
    if (hidden) hidden.value = this.value;

    const chipsEl = this._q('.w-autocomplete-chips');
    if (chipsEl) chipsEl.innerHTML = this._renderChips();

    const input = this._q('.w-autocomplete-input');
    if (input && !this.multiple && document.activeElement !== input) {
      const item = this._findItem(this.value);
      input.value = item ? item.title : (this.value || '');
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
    this._closeList();
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
      const matchesQuery = this.noFilter || !query || this._matchItem(item, query);
      const selectedAndHidden = this.hideSelected && this._hasValue(item.getAttribute('value') || '');
      const match = matchesQuery && !selectedAndHidden;
      item.hidden = !match;
      if (match) visible += 1;
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

  _matchItem(item, query) {
    const title = item.getAttribute('title') || '';
    const value = item.getAttribute('value') || '';
    const subtitle = item.querySelector('.w-autocomplete-item-subtitle')?.textContent || '';
    return (title + ' ' + subtitle + ' ' + value).toLowerCase().includes(query);
  }

  /* Keyboard navigation */

  _onKeydown(event) {
    const input = this._q('.w-autocomplete-input');
    if (!input) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this._setOpen(true);
      this._move(1);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this._move(-1);
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      const items = this._visibleItems();
      if (items.length) this._activate(items[0]);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      const items = this._visibleItems();
      if (items.length) this._activate(items[items.length - 1]);
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      if (this._activeEl && !this._activeEl.hidden) {
        this._selectItem(this._activeEl);
      } else if (this._isCombobox && input.value.trim()) {
        this._commitFreeText(input.value.trim());
      }
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      this._closeList();
      return;
    }
    if (event.key === 'Tab') {
      this._closeList();
    }
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

    if (item) item.scrollIntoView({ block: 'nearest' });
  }

  _selectItem(item) {
    const value = item.getAttribute('value') || '';
    const title = item.getAttribute('title') || value;
    const input = this._q('.w-autocomplete-input');

    if (this.multiple) {
      const values = this._valueArray();
      if (!values.includes(value)) values.push(value);
      this._commit(values);
      if (input) {
        input.value = '';
        input.focus();
      }
      this._filter();
    } else {
      this._commit([value]);
      this._closeList();
      if (input) input.value = title;
    }

    this._emit('change', { value: this.value, title, name: this.name });
  }

  _commitFreeText(text) {
    const input = this._q('.w-autocomplete-input');

    if (this.multiple) {
      const values = this._valueArray();
      if (!values.includes(text)) values.push(text);
      this._commit(values);
      if (input) {
        input.value = '';
        input.focus();
      }
      this._filter();
    } else {
      this._commit([text]);
      this._closeList();
    }

    this._emit('change', { value: this.value, title: text, name: this.name });
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

    if (open) {
      this._addOutsideListener();
      this._filter();
    } else {
      this._removeOutsideListener();
      this._activate(null);
    }
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
