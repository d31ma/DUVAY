/* <w-parallax> — DuVay component module */

export class WParallax extends WElement {
  static attrs = ['src', 'height', 'alt'];

  get src() { return this._attr('src', ''); }
  get height() { return this._attr('height', ''); }
  get alt() { return this._attr('alt', ''); }

  _template() {
    const style = this.height ? ` style="height: ${this._esc(this.height)};"` : '';
    return `<div class="w-parallax"${style}>
      <img class="w-parallax-img" src="${this._esc(this.src)}" alt="${this._esc(this.alt)}">
      <div class="w-parallax-content"><slot></slot></div>
    </div>`;
  }
}

if (!customElements.get('w-parallax')) customElements.define('w-parallax', WParallax);
