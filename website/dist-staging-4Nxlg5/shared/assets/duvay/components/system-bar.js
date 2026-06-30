/* <w-system-bar> — DuVay component module */

export class WSystemBar extends WElement {
  _template() {
    return `<div class="w-system-bar"><slot></slot></div>`;
  }
}

if (!customElements.get('w-system-bar')) customElements.define('w-system-bar', WSystemBar);
