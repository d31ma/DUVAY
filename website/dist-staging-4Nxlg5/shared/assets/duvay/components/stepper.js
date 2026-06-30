/* <w-stepper> — DuVay component module */

export class WStepper extends WElement {
  static attrs = ['vertical'];

  get vertical() { return this._bool('vertical'); }

  _template() {
    return `<div class="w-stepper${this.vertical ? ' w-stepper--vertical' : ''}"><slot></slot></div>`;
  }
}

if (!customElements.get('w-stepper')) customElements.define('w-stepper', WStepper);
