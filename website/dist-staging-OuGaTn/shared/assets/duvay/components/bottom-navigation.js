/* <w-bottom-navigation> — DuVay component module
 *
 * Vuetify parity: active-item management (clicking a w-bottom-nav-item sets
 * active and fires change with {value}), color, bg-color, grow, mode (shift),
 * density, elevation, height.
 *
 * Attributes:
 *   value     - the currently active item value
 *   color     - palette token for active item color (e.g. primary)
 *   bg-color  - palette token for background color
 *   grow      - boolean; items fill equal width
 *   mode      - shift (active item label shifts up, inactive labels hide)
 *   density   - comfortable | compact
 *   elevation - 0..N shadow level
 *   height    - explicit height (number or CSS value)
 *
 * Events:
 *   change - fires when active item changes (detail: { value })
 */

export class WBottomNavigation extends WElement {
  static attrs = [
    'value', 'color', 'bg-color', 'grow', 'mode', 'density', 'elevation', 'height',
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
    if (this.elevation) classes.push('w-elevation-' + this.elevation);

    const styles = [];
    if (this.color) styles.push('--w-bottom-nav-color: var(--w-' + this.color + ');');
    if (this.bgColor) styles.push('--w-bottom-nav-bg: var(--w-' + this.bgColor + ');');
    if (this.height) styles.push('--w-bottom-nav-height: ' + (isNaN(this.height) ? this.height : this.height + 'px') + ';');

    const styleAttr = styles.length ? ' style="' + styles.join(' ') + '"' : '';

    return `<nav class="${classes.join(' ')}" role="navigation" aria-label="Bottom navigation"${styleAttr}><slot></slot></nav>`;
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

    this._syncItems();
  }

  _getItemElements() {
    return Array.from(this.querySelectorAll('w-bottom-nav-item'));
  }

  _syncItems() {
    const currentValue = this.value;
    this._getItemElements().forEach((item) => {
      const shouldBeActive = item.value === currentValue;
      if (item.active !== shouldBeActive) {
        item.active = shouldBeActive;
      }
    });
  }

  _activateItem(itemEl) {
    if (!itemEl || itemEl.disabled) return;
    const newValue = itemEl.value;
    if (this.value === newValue) return;
    this.value = newValue;
    this._syncItems();
    this._emit('change', { value: newValue });
  }
}

if (!customElements.get('w-bottom-navigation')) customElements.define('w-bottom-navigation', WBottomNavigation);
