/* <w-item-group> — DuVay component module */
import { wBoolAttr, wNumberAttr, wValue, wValueList } from './utils.js';

export class WItemGroup extends WElement {
  static attrs = ['value', 'multiple', 'mandatory', 'max', 'selected-class', 'active-class', 'disabled'];

  get value() { return wValue(this, ''); }
  get multiple() { return wBoolAttr(this, 'multiple'); }
  get mandatory() { return wBoolAttr(this, 'mandatory'); }
  get disabled() { return wBoolAttr(this, 'disabled'); }
  get max() { return this.hasAttribute('max') ? wNumberAttr(this, 'max', Infinity) : Infinity; }
  get selectedClass() { return this._attr('active-class', this._attr('selected-class', 'active')); }

  _template() {
    const multi = this.multiple ? ' aria-multiselectable="true"' : '';
    const disabled = this.disabled ? ' aria-disabled="true"' : '';
    return `<div class="w-item-group" role="group"${multi}${disabled}><slot></slot></div>`;
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this._observer) {
      this._observer = new MutationObserver(() => {
        if (!this.isConnected) return;
        const group = this._q('.w-item-group, .w-slide-group');
        const slot = group?.querySelector(':scope > slot');
        if (slot) {
          Array.from(this.children).forEach((child) => {
            if (child !== group && !group.contains(child)) {
              slot.appendChild(child);
            }
          });
        }
        const validValues = this._items().map((item, index) => this._itemValue(item, index));
        let selected = this._selectedValues().filter((value) => validValues.includes(value));
        if (this.mandatory && !selected.length && validValues.length) {
          selected = [validValues[0]];
        }
        const value = this.multiple ? JSON.stringify(selected) : (selected[0] || '');
        this._silentSet('value', value || null);
        this._syncGroupItems();
        this._bindItemListeners();
        this._bindKeyboardNavigation();
      });
      this._observer.observe(this, { childList: true, subtree: true });
    }
  }

  disconnectedCallback() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }

  _events() {
    this._syncGroupItems();
    this._bindItemListeners();
    this._bindKeyboardNavigation();
  }

  _items() {
    const group = this._q('.w-item-group, .w-slide-group') || this;
    const slot = group.querySelector(':scope > slot');
    const children = slot ? Array.from(slot.children) : Array.from(group.children);
    return children.filter((item) => item.nodeType === Node.ELEMENT_NODE);
  }

  _enabledItems() {
    return this._items().filter((item) => !this._isItemDisabled(item));
  }

  _isItemDisabled(item) {
    if (this.disabled) return true;
    return item.hasAttribute('disabled')
      || item.getAttribute('aria-disabled') === 'true'
      || item.disabled === true;
  }

  _itemValue(item, index) {
    return item.getAttribute('value') || item.getAttribute('data-value') || String(index);
  }

  _selectedValues() {
    return wValueList(this.value);
  }

  _toggleItem(item) {
    if (this._isItemDisabled(item)) return;

    const items = this._items();
    const value = this._itemValue(item, items.indexOf(item));
    let selected = this._selectedValues();
    const currentlySelected = selected.includes(value);

    if (this.multiple) {
      if (currentlySelected) {
        if (!this.mandatory || selected.length > 1) {
          selected = selected.filter((itemValue) => itemValue !== value);
        }
      } else if (selected.length < this.max) {
        selected = selected.concat(value);
      }
      if (this.mandatory && !selected.length) selected = [value];
    } else {
      selected = currentlySelected && !this.mandatory ? [] : [value];
    }

    this._setSelected(selected);
  }

  _setSelected(selected) {
    const value = this.multiple ? JSON.stringify(selected) : (selected[0] || '');
    if (value === this.value) return;
    this._silentSet('value', value || null);
    this._syncGroupItems();
    this._emit('change', { value: this.multiple ? selected : value });
  }

  _syncGroupItems() {
    const selected = this._selectedValues();
    const items = this._items();
    const enabledItems = this._enabledItems();
    const group = this._q('.w-item-group, .w-slide-group');

    items.forEach((item, index) => {
      const active = selected.includes(this._itemValue(item, index));
      item.classList.toggle(this.selectedClass, active);
      item.classList.toggle('selected', active);
      item.setAttribute('aria-pressed', String(active));
      item.toggleAttribute('selected', active);
    });

    this._updateTabIndexes(enabledItems);

    if (group) {
      if (this.multiple) group.setAttribute('aria-multiselectable', 'true');
      else group.removeAttribute('aria-multiselectable');
      if (this.disabled) group.setAttribute('aria-disabled', 'true');
      else group.removeAttribute('aria-disabled');
    }
  }

  _updateTabIndexes(enabledItems = this._enabledItems()) {
    const items = this._items();
    const activeElement = document.activeElement;
    const focusedItem = items.find((item) => item === activeElement || item.contains(activeElement));
    const tabbable = focusedItem && enabledItems.includes(focusedItem)
      ? focusedItem
      : enabledItems[0];

    items.forEach((item) => {
      if (this._isItemDisabled(item)) {
        item.setAttribute('tabindex', '-1');
        return;
      }
      item.setAttribute('tabindex', item === tabbable ? '0' : '-1');
    });
  }

  _bindItemListeners() {
    const items = this._items();
    items.forEach((item) => {
      if (item.__wItemGroup === this) return;
      item.__wItemGroup = this;
      item.addEventListener('click', (event) => {
        if (this._isItemDisabled(item)) return;
        event.preventDefault();
        this._toggleItem(item);
      });
      item.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        if (this._isItemDisabled(item)) return;
        event.preventDefault();
        this._toggleItem(item);
      });
      item.addEventListener('focusin', (event) => {
        if (event.currentTarget !== item) return;
        this._updateTabIndexes();
      });
    });
  }

  _bindKeyboardNavigation() {
    const group = this._q('.w-item-group, .w-slide-group') || this;
    if (group.__wKeyboardBound === this) return;
    group.__wKeyboardBound = this;
    group.addEventListener('keydown', (event) => this._onGroupKeydown(event));
  }

  _onGroupKeydown(event) {
    const group = this._q('.w-item-group, .w-slide-group') || this;
    if (group.classList.contains('w-slide-group')) return;

    let move = 0;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') move = 1;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') move = -1;
    else if (event.key === 'Home') move = 'home';
    else if (event.key === 'End') move = 'end';
    else return;

    event.preventDefault();
    const items = this._enabledItems();
    if (!items.length) return;

    let next;
    if (move === 'home') next = items[0];
    else if (move === 'end') next = items[items.length - 1];
    else {
      const current = document.activeElement;
      const currentIndex = items.findIndex((item) => item === current || item.contains(current));
      const index = currentIndex < 0 ? 0 : Math.max(0, Math.min(items.length - 1, currentIndex + move));
      next = items[index];
    }

    this._focusItem(next);
  }

  _focusItem(item) {
    if (!item) return;
    const focusTarget = item.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') || item;
    focusTarget.focus({ preventScroll: true });
  }

}

if (!customElements.get('w-item-group')) customElements.define('w-item-group', WItemGroup);
