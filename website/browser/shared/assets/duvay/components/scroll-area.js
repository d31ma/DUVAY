/* <w-scroll-area> - bounded scroll container */

export class WScrollArea extends WElement {
  static attrs = ['height', 'orientation'];

  get height() { return this._attr('height', '16rem'); }
  get orientation() { return this._attr('orientation', 'vertical'); }

  _template() {
    const horizontal = this.orientation === 'horizontal';
    return `<div class="w-scroll-area${horizontal ? ' w-scroll-area--horizontal' : ''}" style="--w-scroll-area-height: ${this._esc(this.height)};"><slot></slot></div>`;
  }
}

if (!customElements.get('w-scroll-area')) {
  customElements.define('w-scroll-area', WScrollArea);
}
