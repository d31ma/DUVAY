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
 *   placeholder         - text shown when nothing is selected
 *   label, hint, error  - field label / helper / error text
 *   name                - form field name (renders a hidden input)
 *   size                - xs | sm | lg | xl
 *   disabled, readonly  - non-interactive states
 *
 * Children:
 *   <w-option value="x" [disabled]>Label</w-option>
 *
 * Events:
 *   change              - { value, name } on selection change
 */

import { wValueList } from './utils.js';

const CHEVRON = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>';
const CHECK = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';

let selectUid = 0;

class WSelect extends WElement {
  static attrs = ['value', 'disabled', 'readonly', 'name', 'label', 'hint',
    'error', 'placeholder', 'size', 'multiple', 'chips', 'closable-chips', 'clearable', 'open'];

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

  get values() { return wValueList(this._attr('value', '')); }

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
      this._wOptions = authored.map((opt) => ({
        value: opt.getAttribute('value') ?? opt.textContent.trim(),
        label: opt.textContent.trim(),
        disabled: opt.hasAttribute('disabled'),
      }));
    }
    return this._wOptions || [];
  }

  _labelFor(value) {
    const opt = (this._wOptions || []).find((o) => o.value === value);
    return opt ? opt.label : value;
  }

  _selectionHtml(values) {
    if (values.length && this.chips) {
      const closable = this.closableChips || this.clearable ? ' closable' : '';
      return values.map((v) =>
        `<w-chip class="w-select-chip" size="small" value="${this._esc(v)}"${closable}>${this._esc(this._labelFor(v))}</w-chip>`).join('');
    }
    if (values.length) {
      return `<span class="w-select-value">${this._esc(values.map((v) => this._labelFor(v)).join(', '))}</span>`;
    }
    return `<span class="w-select-placeholder">${this._esc(this.placeholder)}</span>`;
  }

  _template() {
    const options = this._readOptions();
    const values = this.values;
    const listId = this._listId || (this._listId = `w-select-list-${++selectUid}`);
    const sizeClass = this.size ? ` w-select--${this.size}` : '';
    const open = this.hasAttribute('open');

    const clearBtn = this.clearable && !this.disabled && !this.readonly
      ? `<button class="w-select-clear" type="button" aria-label="Clear" tabindex="-1"${values.length ? '' : ' hidden'}>&#x2715;</button>` : '';

    const trigger = `<div class="w-select w-select-field${sizeClass}" role="combobox" tabindex="${this.disabled ? -1 : 0}"`
      + ` aria-haspopup="listbox" aria-expanded="${open ? 'true' : 'false'}" aria-controls="${listId}"`
      + `${this.disabled ? ' aria-disabled="true"' : ''}>`
      + `<span class="w-select-selection">${this._selectionHtml(values)}</span>`
      + clearBtn
      + `<span class="w-select-chevron" aria-hidden="true">${CHEVRON}</span>`
      + `</div>`;

    const items = options.map((opt) => {
      const selected = values.includes(opt.value);
      return `<button class="w-select-item" type="button" role="option" value="${this._esc(opt.value)}"`
        + ` aria-selected="${selected ? 'true' : 'false'}"${opt.disabled ? ' disabled' : ''}>`
        + `<span class="w-select-item-label">${this._esc(opt.label)}</span>`
        + `<span class="w-select-item-check" aria-hidden="true">${CHECK}</span>`
        + `</button>`;
    }).join('');

    const list = `<div class="w-select-list" id="${listId}" role="listbox"${this.multiple ? ' aria-multiselectable="true"' : ''} hidden>${items}</div>`;
    const hidden = this.name ? `<input type="hidden" name="${this._esc(this.name)}" value="${this._esc(this.value)}">` : '';

    const control = `<div class="w-select-wrap">${trigger}${list}${hidden}</div>`;

    if (this.label || this.hint || this.error) {
      return `<div class="w-field${this.error ? ' w-field-error' : ''}">
        ${this.label ? `<label class="w-field-label">${this._esc(this.label)}</label>` : ''}
        ${control}
        ${this.hint || this.error ? `<span class="w-field-hint">${this._esc(this.error || this.hint)}</span>` : ''}
      </div>`;
    }
    return control;
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

    const clear = this._q('.w-select-clear');
    if (clear) clear.addEventListener('click', (event) => {
      event.stopPropagation();
      this._commit([]);
    });

    list.addEventListener('mousedown', (event) => event.preventDefault()); // keep focus on the trigger
    list.addEventListener('click', (event) => {
      const item = event.target.closest('.w-select-item');
      if (item && !item.disabled) this._selectItem(item);
    });
    list.addEventListener('pointermove', (event) => {
      const item = event.target.closest('.w-select-item');
      if (item && !item.disabled) this._activate(item);
    });

    // Chip removal (multiple). Bound once on the host — survives re-renders.
    if (!this.__chipListeners) {
      this.__chipListeners = true;
      const onRemove = (event) => {
        const chip = event.target.closest?.('w-chip');
        if (!chip || !this.contains(chip)) return;
        event.stopPropagation();
        this._removeValue(chip.getAttribute('value') || '');
      };
      this.addEventListener('close', onRemove);
    }

    this._applyOpen();
  }

  _onKeydown(event) {
    const open = this.hasAttribute('open');
    if (this.disabled || this.readonly) return;

    if (!open && (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown')) {
      event.preventDefault();
      this._setOpen(true); // _applyOpen highlights the selected (or first) item
      return;
    }
    if (!open) return;

    if (event.key === 'ArrowDown') { event.preventDefault(); this._move(1); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); this._move(-1); }
    else if (event.key === 'Home') { event.preventDefault(); const i = this._items()[0]; if (i) this._activate(i); }
    else if (event.key === 'End') { event.preventDefault(); const it = this._items(); if (it.length) this._activate(it[it.length - 1]); }
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (this._activeEl) this._selectItem(this._activeEl);
    } else if (event.key === 'Escape') { event.preventDefault(); this._setOpen(false); }
    else if (event.key === 'Tab') { this._setOpen(false); }
  }

  _items() { return Array.from(this._qAll('.w-select-item')).filter((el) => !el.disabled); }

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
    if (item) item.scrollIntoView({ block: 'nearest' });
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
    this._syncSelection();
    if (!keepOpen) this._setOpen(false);
    this._emit('change', { value: next, name: this.name });
  }

  // Update the trigger display, item selected-states, clear button, and hidden
  // input in place — no destructive re-render that would interrupt a click.
  _syncSelection() {
    const values = this.values;
    this._qAll('.w-select-item').forEach((el) => {
      el.setAttribute('aria-selected', values.includes(el.getAttribute('value')) ? 'true' : 'false');
    });
    const selection = this._q('.w-select-selection');
    if (selection) selection.innerHTML = this._selectionHtml(values);
    const clear = this._q('.w-select-clear');
    if (clear) clear.hidden = !values.length;
    this._syncValue();
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
