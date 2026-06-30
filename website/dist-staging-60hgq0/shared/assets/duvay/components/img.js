/* <w-img> — DuVay component module */

export class WImg extends WElement {
  static attrs = ['src', 'alt', 'fit', 'rounded'];

  get src() { return this._attr('src', ''); }
  get alt() { return this._attr('alt', ''); }
  get fit() { return this._attr('fit', ''); }
  get rounded() { return this._bool('rounded'); }

  _template() {
    const fitClass = this.fit ? ' w-img--' + this.fit : '';
    const roundedClass = this.rounded ? ' w-img--rounded' : '';
    return `<img class="w-img${fitClass}${roundedClass}" src="${this._esc(this.src)}" alt="${this._esc(this.alt)}">`;
  }
}

if (!customElements.get('w-img')) customElements.define('w-img', WImg);
