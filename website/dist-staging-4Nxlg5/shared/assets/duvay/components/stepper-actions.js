/* <w-stepper-actions> — Vuetify structural subcomponent */

export class WStepperActions extends WElement {
  _template() {
    return `<div class="w-stepper-actions"><slot></slot></div>`;
  }
}

if (!customElements.get('w-stepper-actions')) {
  customElements.define('w-stepper-actions', WStepperActions);
}
