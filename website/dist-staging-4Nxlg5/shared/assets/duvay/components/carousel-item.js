/* <w-carousel-item> — DuVay component module */
import { wBoolAttr } from './utils.js';

export class WCarouselItem extends WElement {
  static attrs = ['src', 'alt', 'cover'];

  get src() { return this._attr('src', ''); }
  get alt() { return this._attr('alt', ''); }
  get cover() { return wBoolAttr(this, 'cover', true); }

  _template() {
    const image = this.src ? `<img class="w-carousel-img${this.cover ? ' w-carousel-img--cover' : ''}" src="${this._esc(this.src)}" alt="${this._esc(this.alt)}">` : '';
    return `<div class="w-carousel-item">${image}<slot></slot></div>`;
  }
}

if (!customElements.get('w-carousel-item')) customElements.define('w-carousel-item', WCarouselItem);
