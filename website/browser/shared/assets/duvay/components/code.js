/* <w-code> — DuVay component module */

export class WCode extends WElement {
  _template() {
    return `<code class="w-code"><slot></slot></code>`;
  }
}

if (!customElements.get('w-code')) customElements.define('w-code', WCode);
