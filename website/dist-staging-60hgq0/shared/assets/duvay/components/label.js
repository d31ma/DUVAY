/* <w-label> — DuVay component module */

export class WLabel extends WElement {
  _template() { return `<span class="w-label"><slot></slot></span>`; }
}

if (!customElements.get('w-label')) customElements.define('w-label', WLabel);
