/* <w-aspect-ratio> - fixed-ratio content wrapper */

export class WAspectRatio extends WElement {
  static attrs = ['ratio'];

  get ratio() { return this._attr('ratio', '16 / 9'); }

  _template() {
    return `<div class="w-aspect-ratio" style="--w-aspect-ratio: ${this._esc(this.ratio)};"><slot></slot></div>`;
  }
}

if (!customElements.get('w-aspect-ratio')) {
  customElements.define('w-aspect-ratio', WAspectRatio);
}
