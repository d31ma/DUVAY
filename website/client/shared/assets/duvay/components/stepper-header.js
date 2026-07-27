/* <w-stepper-header> — Vuetify structural subcomponent */

export class WStepperHeader extends WElement {
  _template() {
    return `<div class="w-stepper-header"><slot></slot></div>`;
  }
}

if (!customElements.get('w-stepper-header')) {
  customElements.define('w-stepper-header', WStepperHeader);
}
