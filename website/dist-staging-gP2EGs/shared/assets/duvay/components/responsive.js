/* <w-responsive> — DuVay component module */

export class WResponsive extends WElement {
  static attrs = ['aspect-ratio'];
  get aspectRatio() { return this._attr('aspect-ratio', '16 / 9'); }
  _template() { return `<div class="w-responsive" style="aspect-ratio:${this._esc(this.aspectRatio)}"><slot></slot></div>`; }
}

if (!customElements.get('w-responsive')) customElements.define('w-responsive', WResponsive);
