/* <w-main> — DuVay component module */

export class WMain extends WElement {
  _template() { return `<main class="w-main"><slot></slot></main>`; }
}

if (!customElements.get('w-main')) customElements.define('w-main', WMain);
