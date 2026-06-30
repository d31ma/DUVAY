/* <w-list> — List container web component
 *
 * Attributes:
 *   items         - JSON array of list items or a semicolon-delimited list
 *   item-title    - item object key for title (default: title)
 *   item-value    - item object key for value (default: value)
 *   item-children - item object key for nested children (default: children)
 *   density       - compact | comfortable (omit for default)
 *   lines         - one | two | three (omit for one-line default)
 *   variant       - text | plain | tonal | outlined
 *   nav           - applies navigation list styling
 *   selectable    - manages selected state for child w-list-item elements
 *   activatable   - manages active state without implying form selection
 *   selected      - selected value or JSON array
 *   activated     - activated value or JSON array
 *   opened        - JSON array of open group values
 *   disabled      - disables selection management
 *
 * Slots:
 *   default - w-list-item elements, dividers, and subheaders
 *
 * Events:
 *   w-change - fires when a selectable/activatable item is chosen (detail: { value })
 *   click:select - fires with Vuetify-like select detail (detail: { id, value, selected })
 *   update:selected - fires when selected changes (detail: { value })
 *   update:activated - fires when activated changes (detail: { value })
 *   update:opened - fires when a nested group toggles (detail: { value })
 */

class WList extends WElement {

  static attrs = [
    'items',
    'item-title',
    'item-value',
    'item-children',
    'item-type',
    'density',
    'lines',
    'variant',
    'nav',
    'selectable',
    'activatable',
    'multiple',
    'selected',
    'activated',
    'opened',
    'model-value',
    'disabled',
    'slim',
    'prepend-gap',
    'indent',
    'expand-icon',
    'collapse-icon',
  ];

  get itemsAttr() { return this._attr('items', ''); }
  get itemTitleKey() { return this._attr('item-title', 'title'); }
  get itemValueKey() { return this._attr('item-value', 'value'); }
  get itemChildrenKey() { return this._attr('item-children', 'children'); }
  get itemTypeKey() { return this._attr('item-type', 'type'); }
  get density() { return this._attr('density', ''); }
  get lines() { return this._attr('lines', ''); }
  get variant() { return this._attr('variant', ''); }
  get nav() { return this._bool('nav'); }
  get selectable() { return this._bool('selectable'); }
  get activatable() { return this._bool('activatable'); }
  get multiple() { return this._bool('multiple'); }
  get disabled() { return this._bool('disabled'); }
  get slim() { return this._bool('slim'); }
  get opened() { return this._readValues(this._attr('opened', '')); }
  get selectedValue() { return this._readValue(this._attr('selected', this._attr('model-value', ''))); }
  get activatedValue() { return this._readValue(this._attr('activated', this._attr('model-value', ''))); }

  _template() {
    const densityClass = this.density ? ' w-list--' + this.density : '';
    const linesClass = this.lines && this.lines !== 'one' ? ' w-list--' + this.lines + '-line' : '';
    const navClass = this.nav ? ' w-list--nav' : '';
    const variantClass = this.variant ? ' w-list--variant-' + this._classToken(this.variant) : '';
    const slimClass = this.slim ? ' w-list--slim' : '';
    const style = this._style();
    const generated = this.itemsAttr ? this._renderItems(this._parseItems(this.itemsAttr), 0) : '<slot></slot>';
    const multiselect = this.selectable && this.multiple ? ' aria-multiselectable="true"' : '';

    return `<div class="w-list${densityClass}${linesClass}${navClass}${variantClass}${slimClass}" role="${this.selectable || this.activatable ? 'listbox' : 'list'}"${multiselect}${style}>${generated}</div>`;
  }

  _events() {
    const list = this._q('.w-list');
    if (!list) return;

    this._syncItemState();
    this._syncOpenedGroups();

    list.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const item = target ? target.closest('w-list-item') : null;
      if (!item || item.disabled) return;
      if (!this.selectable && !this.activatable) return;
      if (this.disabled) return;

      this._chooseItem(item);
    });

    list.addEventListener('keydown', (event) => {
      const direction = this._navigationDirection(event.key);
      if (!direction) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      const focusables = this._focusableItems();
      if (!focusables.length) return;
      event.preventDefault();
      const active = document.activeElement;
      let index = focusables.indexOf(active);
      if (direction === 'first') index = 0;
      else if (direction === 'last') index = focusables.length - 1;
      else index = index < 0 ? 0 : (index + (direction === 'next' ? 1 : -1) + focusables.length) % focusables.length;
      focusables[index].focus();
    });

    this.addEventListener('w-toggle', (event) => {
      const group = event.target instanceof Element ? event.target.closest('w-list-group') : null;
      if (!group || group === this || !this.contains(group)) return;
      const value = group.getAttribute('value') || group.getAttribute('title') || '';
      if (!value) return;
      const next = new Set(this.opened);
      if (group.open) next.add(value);
      else next.delete(value);
      const opened = Array.from(next);
      this._silentSet('opened', JSON.stringify(opened));
      this.dispatchEvent(new CustomEvent('update:opened', {
        detail: { value: opened },
        bubbles: true,
        composed: true,
      }));
    });
  }

  _chooseItem(item) {
    const rawValue = item.value;
    const value = rawValue == null ? '' : String(rawValue);
    if (this.selectable) {
      const selected = this.multiple ? this._toggleArray(this._readValues(this._attr('selected', this._attr('model-value', ''))), value) : value;
      this._silentSet('selected', Array.isArray(selected) ? JSON.stringify(selected) : selected);
      this._silentSet('model-value', Array.isArray(selected) ? JSON.stringify(selected) : selected);
      this._syncItemState();
      this._emit('w-change', { value: selected });
      this.dispatchEvent(new CustomEvent('update:selected', { detail: { value: selected }, bubbles: true, composed: true }));
      this.dispatchEvent(new CustomEvent('click:select', {
        detail: { id: value, value: true, selected },
        bubbles: true,
        composed: true,
      }));
      return;
    }

    const activated = this.multiple ? this._toggleArray(this._readValues(this._attr('activated', this._attr('model-value', ''))), value) : value;
    this._silentSet('activated', Array.isArray(activated) ? JSON.stringify(activated) : activated);
    this._silentSet('model-value', Array.isArray(activated) ? JSON.stringify(activated) : activated);
    this._syncItemState();
    this._emit('w-change', { value: activated });
    this.dispatchEvent(new CustomEvent('update:activated', { detail: { value: activated }, bubbles: true, composed: true }));
  }

  _syncItemState() {
    const selected = this._readValues(this._attr('selected', this._attr('model-value', '')));
    const activated = this._readValues(this._attr('activated', this._attr('model-value', '')));
    this.querySelectorAll('w-list-item').forEach((el) => {
      const value = String(el.value);
      const active = this.selectable ? selected.includes(value) : this.activatable ? activated.includes(value) : el.hasAttribute('active');
      el.active = active;
      const control = el.querySelector('.w-list-item');
      if (control && (this.selectable || this.activatable)) {
        control.setAttribute('role', 'option');
        control.setAttribute('aria-selected', active ? 'true' : 'false');
      }
    });
  }

  _syncOpenedGroups() {
    if (!this.hasAttribute('opened')) return;
    const opened = new Set(this.opened);
    this.querySelectorAll('w-list-group').forEach((group) => {
      const value = group.getAttribute('value') || group.getAttribute('title') || '';
      if (!value) return;
      const shouldOpen = opened.has(value);
      if (group.open === shouldOpen) return;
      group._silentSet('open', shouldOpen ? 'true' : null);
      if (typeof group._render === 'function') {
        group._render();
        if (typeof group._events === 'function') group._events();
      }
    });
  }

  _renderItems(items, depth) {
    return items.map((item) => {
      if (typeof item === 'string') return `<w-list-item title="${this._esc(item)}" value="${this._esc(item)}"></w-list-item>`;
      if (!item || typeof item !== 'object') return '';

      const type = item[this.itemTypeKey] || item.type || 'item';
      if (type === 'divider') return '<div class="w-list-divider" role="separator"></div>';
      if (type === 'subheader') return `<div class="w-list-subheader">${this._esc(item[this.itemTitleKey] || item.title || '')}</div>`;

      const title = item[this.itemTitleKey] ?? item.title ?? '';
      const value = item[this.itemValueKey] ?? item.value ?? title;
      const children = item[this.itemChildrenKey] || item.children;
      if (Array.isArray(children) && children.length) {
        const open = this.opened.includes(String(value)) || item.open ? ' open' : '';
        const prepend = item.prependIcon || item['prepend-icon'] || '';
        return `<w-list-group title="${this._esc(title)}" value="${this._esc(value)}"${prepend ? ` prepend-icon="${this._esc(prepend)}"` : ''}${open}>${this._renderItems(children, depth + 1)}</w-list-group>`;
      }

      return this._renderGeneratedItem(item, title, value);
    }).join('');
  }

  _renderGeneratedItem(item, title, value) {
    const attrs = [
      ['title', title],
      ['value', value],
      ['subtitle', item.subtitle],
      ['href', item.href || item.to],
      ['prepend-icon', item.prependIcon || item['prepend-icon']],
      ['append-icon', item.appendIcon || item['append-icon']],
      ['prepend-avatar', item.prependAvatar || item['prepend-avatar']],
      ['append-avatar', item.appendAvatar || item['append-avatar']],
      ['lines', item.lines],
      ['density', item.density],
      ['variant', item.variant],
    ].filter((entry) => entry[1] != null && entry[1] !== '').map(([name, value]) => ` ${name}="${this._esc(value)}"`).join('');
    return `<w-list-item${attrs}${item.disabled ? ' disabled' : ''}${item.active ? ' active' : ''}></w-list-item>`;
  }

  _parseItems(value) {
    if (!value) return [];
    const text = String(value).trim();
    const parsed = this._parseStructuredValue(text);
    if (Array.isArray(parsed)) return parsed;
    return text.replace(/^\[|\]$/g, '').split(';').map((part) => part.trim()).filter(Boolean);
  }

  _readValue(value) {
    const values = this._readValues(value);
    return this.multiple ? values : values[0] || '';
  }

  _readValues(value) {
    if (!value) return [];
    const text = String(value).trim();
    if (!text) return [];
    const parsed = this._parseStructuredValue(text);
    if (Array.isArray(parsed)) return parsed.map(String);
    if (parsed != null) return [String(parsed)];
    return text.split(',').map((part) => part.trim()).filter(Boolean);
  }

  _toggleArray(values, value) {
    return values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value];
  }

  _navigationDirection(key) {
    if (key === 'ArrowDown') return 'next';
    if (key === 'ArrowUp') return 'prev';
    if (key === 'Home') return 'first';
    if (key === 'End') return 'last';
    return '';
  }

  _focusableItems() {
    return Array.from(this.querySelectorAll('.w-list-item')).filter((el) => {
      if (!(el instanceof HTMLElement)) return false;
      if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') return false;
      return el.offsetParent !== null || el.getClientRects().length > 0;
    });
  }

  _style() {
    const pairs = [];
    if (this.hasAttribute('indent')) pairs.push(['--w-list-indent', this._attr('indent', '')]);
    if (this.hasAttribute('prepend-gap')) pairs.push(['--w-list-prepend-gap', this._attr('prepend-gap', '')]);
    return pairs.length ? ` style="${pairs.map(([name, value]) => `${name}: ${this._esc(value)}`).join('; ')}"` : '';
  }

  _classToken(value) {
    return String(value).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
  }

  _parseStructuredValue(text) {
    try {
      return JSON.parse(text);
    } catch (_) {
      if (!text.includes("'")) return null;
      try {
        const normalized = text.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_, value) => JSON.stringify(value.replace(/\\'/g, "'")));
        return JSON.parse(normalized);
      } catch (_) {
        return null;
      }
    }
  }
}

customElements.define('w-list', WList);
