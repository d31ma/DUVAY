/* <w-bottom-navigation> — DuVay component module
 *
 * Vuetify parity: active-item management (clicking a w-bottom-nav-item sets
 * active and fires change with {value}), color, bg-color, grow, mode (shift),
 * density, elevation, height, plus multiple/max/mandatory selection, an
 * `active` visibility switch and layout registration (name/order/absolute).
 *
 * Attributes:
 *   value          - the currently active item value (comma list when `multiple`)
 *   multiple       - allow more than one selected item
 *   max            - maximum number of selections (multiple mode)
 *   mandatory      - true: keep at least one selected; "force": also select the first initially
 *   selected-class - extra class added to selected item hosts
 *   active         - visibility switch; `active="false"` slides the bar away
 *   color          - palette token for active item color (e.g. primary)
 *   bg-color       - palette token for background color
 *   grow           - boolean; items fill equal width
 *   mode           - shift (active item label shifts up, inactive labels hide)
 *   density        - comfortable | compact
 *   elevation      - 0..N shadow level
 *   height         - explicit height (number or CSS value)
 *   absolute       - boolean; pin to the bottom of the offset parent
 *   name           - layout registration name (mirrored to data-name)
 *   order          - layout order within its flex/grid parent
 *
 * Events:
 *   change - fires when the selection changes (detail: { value })
 */
import { wValueList, wNumberAttr } from './utils.js';

export class WBottomNavigation extends WElement {
  static attrs = [
    'value', 'color', 'bg-color', 'grow', 'mode', 'density', 'elevation', 'height',
    'multiple', 'max', 'mandatory', 'selected-class', 'active', 'absolute', 'name', 'order',
  ];

  get value() { return this._attr('value', ''); }
  set value(v) { this.setAttribute('value', v); }
  get color() { return this._attr('color', ''); }
  get bgColor() { return this._attr('bg-color', ''); }
  get grow() { return this._bool('grow'); }
  get mode() { return this._attr('mode', ''); }
  get density() { return this._attr('density', ''); }
  get elevation() { return this._attr('elevation', ''); }
  get height() { return this._attr('height', ''); }
  get multiple() { return this._bool('multiple'); }
  get max() { return Math.max(0, wNumberAttr(this, 'max', 0)); }
  get mandatory() {
    const value = this._attr('mandatory', null);
    if (value === null) return false;
    return value === 'force' ? 'force' : true;
  }
  get selectedClass() { return this._attr('selected-class', ''); }
  // Visibility switch: present-and-not-"false" keeps the bar on screen.
  get active() {
    if (!this.hasAttribute('active')) return true;
    return this.getAttribute('active') !== 'false';
  }
  get absolute() { return this._bool('absolute'); }
  get name() { return this._attr('name', ''); }
  get order() { return this._attr('order', ''); }

  connectedCallback() {
    super.connectedCallback();
    // Observe child additions/removals to sync active state
    if (!this._observer) {
      this._observer = new MutationObserver(() => this._syncItems());
      this._observer.observe(this, { childList: true, subtree: false });
    }
  }

  disconnectedCallback() {
    if (this._observer) { this._observer.disconnect(); this._observer = null; }
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (!this._rendered) return;
    if (oldVal === newVal) return;
    if (name === 'value') {
      this._syncItems();
      return;
    }
    super.attributeChangedCallback(name, oldVal, newVal);
  }

  _template() {
    const classes = ['w-bottom-navigation'];
    if (this.grow) classes.push('w-bottom-navigation--grow');
    if (this.mode === 'shift') classes.push('w-bottom-navigation--shift');
    if (this.density) classes.push('w-bottom-navigation--' + this.density);
    if (this.elevation) classes.push('elevation-' + this.elevation);
    if (this.absolute) classes.push('w-bottom-navigation--absolute');
    if (!this.active) classes.push('w-bottom-navigation--inactive');

    return `<nav class="${classes.join(' ')}" role="navigation" aria-label="Bottom navigation" aria-hidden="${this.active ? 'false' : 'true'}"${this._attrs({ 'data-name': this.name })}${this._styleAttr()}><slot></slot></nav>`;
  }

  _styleAttr() {
    const styles = [];
    if (this.color) styles.push('--w-bottom-nav-color: var(--w-' + this.color + ');');
    if (this.bgColor) styles.push('--w-bottom-nav-bg: var(--w-' + this.bgColor + ');');
    if (this.height) styles.push('--w-bottom-nav-height: ' + (isNaN(this.height) ? this.height : this.height + 'px') + ';');
    if (this.order) styles.push('order: ' + this._esc(this.order) + ';');
    return styles.length ? ' style="' + styles.join(' ') + '"' : '';
  }

  _events() {
    const nav = this._q('.w-bottom-navigation');
    if (!nav) return;

    // Delegate clicks from child items
    nav.addEventListener('click', (e) => {
      const item = e.target.closest('w-bottom-nav-item');
      if (!item || item.disabled) return;
      this._activateItem(item);
    });

    this._forceMandatory();
    this._syncItems();
  }

  // mandatory="force" selects the first enabled item when nothing is chosen.
  _forceMandatory() {
    if (this.mandatory !== 'force' || this._values().length) return;
    const first = this._getItemElements().find((item) => !item.disabled);
    if (first) this._silentSet('value', first.value);
  }

  _getItemElements() {
    return Array.from(this.querySelectorAll('w-bottom-nav-item'));
  }

  _values() {
    const raw = this.value;
    if (this.multiple) return wValueList(raw);
    return raw ? [raw] : [];
  }

  _syncItems(values) {
    const selected = new Set(values || this._values());
    this._getItemElements().forEach((item) => {
      const on = selected.has(item.value);
      if (item.active !== on) item.active = on;
      if (this.selectedClass) item.classList.toggle(this.selectedClass, on);
    });
  }

  _activateItem(itemEl) {
    if (!itemEl || itemEl.disabled) return;
    const next = this._nextValues(itemEl.value);
    if (!next) return;
    this._commit(next);
  }

  // Returns the next selection, or null when the click is refused (max reached
  // or the last mandatory item).
  _nextValues(value) {
    const values = this._values();
    const selected = values.includes(value);
    if (this.multiple) return selected ? this._deselect(values, value) : this._select(values, value);
    if (selected) return this.mandatory ? null : [];
    return [value];
  }

  _select(values, value) {
    if (this.max && values.length >= this.max) return null;
    return values.concat(value);
  }

  _deselect(values, value) {
    if (this.mandatory && values.length <= 1) return null;
    return values.filter((item) => item !== value);
  }

  _commit(values) {
    const next = this.multiple ? values.join(',') : (values[0] || '');
    this._silentSet('value', next || null);
    this._syncItems(values);
    this._emit('change', { value: this.multiple ? values : next });
  }
}

if (!customElements.get('w-bottom-navigation')) customElements.define('w-bottom-navigation', WBottomNavigation);
