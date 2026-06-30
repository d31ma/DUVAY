/* <w-slide-group-item> — DuVay component module */
import { wBoolAttr } from './utils.js';

export class WSlideGroupItem extends WElement {
  static attrs = ['value', 'disabled'];

  get disabled() { return wBoolAttr(this, 'disabled'); }

  _template() {
    return `<div class="w-slide-group-item"${this.disabled ? ' aria-disabled="true"' : ''}><slot></slot></div>`;
  }
}

if (!customElements.get('w-slide-group-item')) customElements.define('w-slide-group-item', WSlideGroupItem);
