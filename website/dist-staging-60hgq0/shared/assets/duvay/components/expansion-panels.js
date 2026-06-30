/* <w-expansion-panels> — Vuetify VExpansionPanels equivalent
 *
 * Manages child <w-expansion-panel> elements.
 * Manages child <w-expansion-panel> elements.
 *
 * Attributes:
 *   model-value/value - selected panel value(s)
 *   multiple          - allows more than one open panel
 *   single            - legacy alias for single-selection behavior
 *   mandatory         - keeps at least one panel open
 *   variant           - default | accordion | inset | popout
 *   flat/tile/no-divider/rounded/gap - visual variants
 *
 * Events:
 *   w-change/update:model-value - fires when selection changes
 *
 * Usage:
 *   <w-expansion-panels single>
 *     <w-expansion-panel header="First" open>
 *       <p>Content for the first panel.</p>
 *     </w-expansion-panel>
 *     <w-expansion-panel header="Second">
 *       <p>Content for the second panel.</p>
 *     </w-expansion-panel>
 *   </w-expansion-panels>
 */

export class WExpansionPanels extends WElement {

  static attrs = [
    'model-value',
    'value',
    'multiple',
    'single',
    'mandatory',
    'variant',
    'accordion',
    'flat',
    'tile',
    'rounded',
    'no-divider',
    'gap',
    'disabled',
    'readonly',
  ];

  get multiple() { return this._bool('multiple'); }
  get single() { return this._bool('single') || !this.multiple; }
  get mandatory() { return this._bool('mandatory'); }
  get variant() {
    const value = this._attr('variant', this._bool('accordion') ? 'accordion' : 'default');
    return ['default', 'accordion', 'inset', 'popout'].includes(value) ? value : 'default';
  }

  connectedCallback() {
    super.connectedCallback();
    this._observer = new MutationObserver(() => this._syncItems());
    this._observer.observe(this, { childList: true, subtree: false });
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }

  _template() {
    const classes = [
      'w-accordion',
      'w-expansion-panels',
      'w-accordion--variant-' + this.variant,
      this._bool('flat') ? 'w-accordion--flat' : '',
      this._bool('tile') ? 'w-accordion--tile' : '',
      this._bool('rounded') ? 'w-accordion--rounded' : '',
      this._bool('no-divider') ? 'w-accordion--no-divider' : '',
    ].filter(Boolean).join(' ');
    const gap = this._cssLength(this.getAttribute('gap'));
    return `<div class="${classes}"${gap ? ` style="--w-expansion-gap:${gap}"` : ''}><slot></slot></div>`;
  }

  _events() {
    this._syncFromModel();
    this._syncItems();
    if (!this._keyHandler) {
      this._keyHandler = (event) => this._onKeydown(event);
      this.addEventListener('keydown', this._keyHandler);
    }
  }

  _syncItems() {
    if (this.mandatory) {
      const firstEnabled = this._getItems().find(item => !item.disabled);
      if (firstEnabled && !this._getItems().some(item => item.open)) firstEnabled.setOpen(true, true);
    }
    if (!this.single) return;
    const items = this._getItems();
    const openItems = items.filter(i => i.open);
    if (openItems.length > 1) {
      openItems.slice(1).forEach(item => {
        if (typeof item.setOpen === 'function') item.setOpen(false, true);
        else item.open = false;
      });
    }
  }

  _getItems() {
    return Array.from(this.querySelectorAll('w-expansion-panel'));
  }

  _onItemToggle(toggledItem) {
    if (this.mandatory && !toggledItem.open && !this._getItems().some(item => item.open)) {
      toggledItem.setOpen(true, true);
      return;
    }
    if (this.single && toggledItem.open) {
      const items = this._getItems();
      items.forEach(item => {
        if (item !== toggledItem && item.open) {
          if (typeof item.setOpen === 'function') item.setOpen(false, true);
          else item.open = false;
        }
      });
    }
    this._emitSelection();
  }

  _syncFromModel() {
    const raw = this.getAttribute('model-value') ?? this.getAttribute('value');
    if (raw == null) return;
    const selected = this._parseModel(raw).map(String);
    const items = this._getItems();
    items.forEach((item, index) => {
      const value = this._itemValue(item, index);
      const shouldOpen = selected.includes(value);
      if (item.open !== shouldOpen && typeof item.setOpen === 'function') item.setOpen(shouldOpen, true);
    });
  }

  _emitSelection() {
    const value = this._selectedValue();
    this._silentSet('model-value', Array.isArray(value) ? value.join(',') : value);
    this._dispatch('w-change', { value });
    this._dispatch('update:model-value', { value });
  }

  _dispatch(name, detail) {
    this.dispatchEvent(new CustomEvent(name, {
      detail,
      bubbles: true,
      composed: true,
    }));
  }

  _selectedValue() {
    const values = this._getItems()
      .map((item, index) => item.open ? this._itemValue(item, index) : null)
      .filter(value => value != null);
    return this.multiple ? values : (values[0] ?? null);
  }

  _itemValue(item, index) {
    return item.hasAttribute('value') ? item.getAttribute('value') : String(index);
  }

  _parseModel(raw) {
    const value = String(raw).trim();
    if (!value) return [];
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
      } catch (_) {
        return value.slice(1, -1).split(',').map(item => item.trim()).filter(Boolean);
      }
    }
    return this.multiple ? value.split(',').map(item => item.trim()).filter(Boolean) : [value];
  }

  _onKeydown(event) {
    const header = event.target.closest?.('.w-expand-header');
    if (!header || !this.contains(header)) return;
    const headers = this._getItems()
      .map(item => item.querySelector('.w-expand-header'))
      .filter(btn => btn && !btn.disabled);
    const current = headers.indexOf(header);
    if (current < 0) return;
    let next = current;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (current + 1) % headers.length;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (current - 1 + headers.length) % headers.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = headers.length - 1;
    else return;
    event.preventDefault();
    headers[next]?.focus();
  }

  _cssLength(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (/^\d+(\.\d+)?$/.test(raw)) return raw + 'px';
    if (/^\d+(\.\d+)?(px|rem|em|vh|vw|dvh|dvw|%)$/.test(raw)) return raw;
    return '';
  }
}

if (!customElements.get('w-expansion-panels')) {
  customElements.define('w-expansion-panels', WExpansionPanels);
}
