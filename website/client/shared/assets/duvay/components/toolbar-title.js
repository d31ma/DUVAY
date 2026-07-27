/* <w-toolbar-title> — Toolbar title subcomponent
 *
 * Attributes:
 *   text - title content (alternative to the default slot)
 */

class WToolbarTitle extends WElement {
  static attrs = ['text'];

  get text() { return this._attr('text', ''); }

  _template() {
    const inner = this.text ? this._esc(this.text) + '<slot hidden></slot>' : '<slot></slot>';
    return `<div class="w-toolbar-title">${inner}</div>`;
  }
}

if (!customElements.get('w-toolbar-title')) {
  customElements.define('w-toolbar-title', WToolbarTitle);
}
