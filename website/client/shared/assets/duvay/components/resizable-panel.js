/* <w-resizable-panel> - resizable pane */

export class WResizablePanel extends WElement {
  static attrs = ['size', 'min'];

  get size() { return this._attr('size', '1fr'); }
  get min() { return this._attr('min', '10rem'); }

  _template() {
    return `<div class="w-resizable-panel" style="--w-resizable-size: ${this._esc(this.size)}; --w-resizable-min: ${this._esc(this.min)};"><slot></slot></div>`;
  }
}

if (!customElements.get('w-resizable-panel')) {
  customElements.define('w-resizable-panel', WResizablePanel);
}
