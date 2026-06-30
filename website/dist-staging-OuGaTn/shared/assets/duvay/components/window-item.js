/* <w-window-item> — DuVay component module */

export class WWindowItem extends WElement {
  _template() {
    return `<div class="w-window-item"><slot></slot></div>`;
  }
}

if (!customElements.get('w-window-item')) customElements.define('w-window-item', WWindowItem);
