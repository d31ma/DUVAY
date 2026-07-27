/* <w-kbd> — DuVay component module */

export class WKbd extends WElement {
  _template() {
    return `<kbd class="w-kbd"><slot></slot></kbd>`;
  }
}

if (!customElements.get('w-kbd')) customElements.define('w-kbd', WKbd);
