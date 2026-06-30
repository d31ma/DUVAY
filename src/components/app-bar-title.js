/* <w-app-bar-title> — App bar title subcomponent
 *
 * Renders a title element that can be used inside <w-app-bar> or standalone.
 * Supports the same color/density props as the parent bar.
 */

class WAppBarTitle extends WElement {
  static attrs = ['color'];

  get color() { return this._attr('color', ''); }

  _template() {
    const classes = ['w-app-bar-title'];
    if (this.color) classes.push('w-app-bar-title--' + this.color);

    const style = this.color ? ' style="--w-app-bar-title-color: var(--w-' + this._esc(this.color) + ');"' : '';

    return `<div class="${classes.join(' ')}"${style}><slot></slot></div>`;
  }
}

if (!customElements.get('w-app-bar-title')) {
  customElements.define('w-app-bar-title', WAppBarTitle);
}
