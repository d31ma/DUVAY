/* <w-validation> — DuVay component module */

export class WValidation extends WElement {
  _template() { return `<div class="w-validation"><slot></slot></div>`; }
}

if (!customElements.get('w-validation')) customElements.define('w-validation', WValidation);
