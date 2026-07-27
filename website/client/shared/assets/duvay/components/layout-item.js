/* <w-layout-item> — a sized slot inside <w-layout> (Vuetify VLayoutItem).
 *
 * Attributes:
 *   size     - width and height of the item; a bare number is px
 *   absolute - take the item out of flow with position: absolute
 *   order    - flex/grid order relative to its siblings
 *   name     - identifier for the item, mirrored as `data-layout-name` so
 *              stylesheets and tests can target a specific slot. DuVay has no
 *              runtime layout registry, so it is an addressing hook only.
 */

/* A bare number is px; anything else is already a CSS length. */
export function wLayoutLength(value) {
  const raw = String(value == null ? '' : value).trim();
  if (!raw) return '';
  return /^-?\d+(\.\d+)?$/.test(raw) ? raw + 'px' : raw;
}

/* `order` is a plain integer in CSS; a non-numeric value is dropped. */
export function wLayoutOrder(value) {
  const raw = String(value == null ? '' : value).trim();
  return raw && Number.isFinite(Number(raw)) ? String(Number(raw)) : '';
}

export class WLayoutItem extends WElement {
  static attrs = ['size', 'absolute', 'order', 'name'];

  _itemStyle() {
    const styles = [];
    const size = wLayoutLength(this._attr('size', ''));
    if (size) styles.push(`width:${size}`, `height:${size}`);
    if (this._bool('absolute')) styles.push('position:absolute');
    const order = wLayoutOrder(this._attr('order', ''));
    if (order) styles.push(`order:${order}`);
    return styles.length ? ` style="${this._esc(styles.join(';'))}"` : '';
  }

  _template() {
    const name = this._attr('name', '');
    const nameAttr = name ? ` data-layout-name="${this._esc(name)}"` : '';
    return `<div class="w-layout-item"${nameAttr}${this._itemStyle()}><slot></slot></div>`;
  }
}

if (!customElements.get('w-layout-item')) {
  customElements.define('w-layout-item', WLayoutItem);
}
