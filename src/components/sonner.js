/* <w-sonner> - toast region */

export class WSonner extends WElement {
  static attrs = ['position'];

  get position() { return this._attr('position', 'bottom-center'); }

  _template() {
    return `<div class="w-sonner w-sonner--${this._esc(this.position)}" role="status" aria-live="polite"><slot></slot></div>`;
  }
}

if (!customElements.get('w-sonner')) {
  customElements.define('w-sonner', WSonner);
}
