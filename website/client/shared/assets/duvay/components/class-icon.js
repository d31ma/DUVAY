/* <w-class-icon> — CSS class icon renderer
 *
 * Attributes:
 *   name  - icon class(es) applied to the <i> element
 *   icon  - Vuetify alias for `name` (`name` wins when both are set)
 *   size  - font-size for the glyph
 *   label - accessible label; omit for a decorative icon
 */

export class WClassIcon extends WElement {
  static attrs = ['name', 'icon', 'size', 'label'];

  get name() { return this._attr('name', '') || this._attr('icon', ''); }
  get size() { return this._attr('size', ''); }
  get label() { return this._attr('label', ''); }

  _template() {
    const style = this.size ? ` style="font-size:${this._esc(this.size)}"` : '';
    const aria = this.label ? ` role="img" aria-label="${this._esc(this.label)}"` : ' aria-hidden="true"';
    return `<i class="w-icon w-class-icon ${this._esc(this.name)}"${style}${aria}><slot></slot></i>`;
  }
}

if (!customElements.get('w-class-icon')) {
  customElements.define('w-class-icon', WClassIcon);
}
