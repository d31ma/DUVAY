/* <w-direction> - directional content wrapper */

export class WDirection extends WElement {
  static attrs = ['dir'];

  get dirValue() { return this._attr('dir', 'ltr'); }

  _template() {
    return `<div class="w-direction" dir="${this._esc(this.dirValue)}"><slot></slot></div>`;
  }
}

if (!customElements.get('w-direction')) {
  customElements.define('w-direction', WDirection);
}
