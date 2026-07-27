/* <w-ligature-icon> — Ligature text icon renderer
 *
 * Attributes:
 *   name  - ligature text rendered by the icon font
 *   icon  - Vuetify alias for `name` (`name` wins when both are set)
 *   size  - font-size for the glyph
 *   label - accessible label; omit for a decorative icon
 */

export class WLigatureIcon extends WElement {
  static attrs = ['name', 'icon', 'size', 'label'];

  get name() { return this._attr('name', '') || this._attr('icon', ''); }
  get size() { return this._attr('size', ''); }
  get label() { return this._attr('label', ''); }

  _template() {
    const style = this.size ? ` style="font-size:${this._esc(this.size)}"` : '';
    const aria = this.label ? ` role="img" aria-label="${this._esc(this.label)}"` : ' aria-hidden="true"';
    return `<span class="w-icon w-ligature-icon"${style}${aria}>${this._esc(this.name)}<slot></slot></span>`;
  }
}

if (!customElements.get('w-ligature-icon')) {
  customElements.define('w-ligature-icon', WLigatureIcon);
}
