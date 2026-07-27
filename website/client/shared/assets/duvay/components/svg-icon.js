/* <w-svg-icon> — SVG icon renderer
 *
 * Attributes:
 *   path     - SVG path data drawn inside the icon
 *   icon     - Vuetify alias for `path` (`path` wins when both are set)
 *   view-box - SVG viewBox (default "0 0 24 24")
 *   size     - font-size for the glyph
 *   label    - accessible label; omit for a decorative icon
 */

export class WSvgIcon extends WElement {
  static attrs = ['path', 'icon', 'view-box', 'size', 'label'];

  get path() { return this._attr('path', '') || this._attr('icon', ''); }
  get viewBox() { return this._attr('view-box', '0 0 24 24'); }
  get size() { return this._attr('size', '1em'); }
  get label() { return this._attr('label', ''); }

  _template() {
    const aria = this.label ? ` role="img" aria-label="${this._esc(this.label)}"` : ' aria-hidden="true"';
    const style = this.size ? ` style="font-size:${this._esc(this.size)}"` : '';
    const body = this.path ? `<path d="${this._esc(this.path)}"></path>` : '<slot></slot>';
    return `<svg class="w-icon w-svg-icon"${style} viewBox="${this._esc(this.viewBox)}"${aria}>${body}</svg>`;
  }
}

if (!customElements.get('w-svg-icon')) {
  customElements.define('w-svg-icon', WSvgIcon);
}
