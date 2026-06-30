/* <w-layout> — DuVay component module */

export class WLayout extends WElement {
  _template() { return `<div class="w-layout"><slot></slot></div>`; }
}

if (!customElements.get('w-layout')) customElements.define('w-layout', WLayout);
