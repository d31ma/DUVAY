/* <w-component-icon> — Icon component slot wrapper
 *
 * Attributes:
 *   icon  - tag name of the custom element rendered as the glyph. Mirrors the
 *           `component` icon adapter in icons.js, where an icon *is* a
 *           component. A value that is not a valid custom-element tag name is
 *           ignored, so the default slot stays the escape hatch.
 *   label - accessible label; omit for a decorative icon
 */

const ICON_TAG = /^[a-z][a-z0-9]*(-[a-z0-9]+)+$/;

export class WComponentIcon extends WElement {
  static attrs = ['icon', 'label'];

  get label() { return this._attr('label', ''); }
  get icon() {
    const value = this._attr('icon', '').trim().toLowerCase();
    return ICON_TAG.test(value) ? value : '';
  }

  _template() {
    const aria = this.label ? ` role="img" aria-label="${this._esc(this.label)}"` : ' aria-hidden="true"';
    const glyph = this.icon ? `<${this.icon} class="w-icon"></${this.icon}>` : '';
    return `<span class="w-icon w-component-icon"${aria}>${glyph}<slot></slot></span>`;
  }
}

if (!customElements.get('w-component-icon')) {
  customElements.define('w-component-icon', WComponentIcon);
}
