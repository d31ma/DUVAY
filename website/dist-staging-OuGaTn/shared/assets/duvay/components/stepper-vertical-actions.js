/* <w-stepper-vertical-actions> — Vuetify structural subcomponent */

export class WStepperVerticalActions extends WElement {
  _template() {
    return `<div class="w-stepper-vertical-actions"><slot></slot></div>`;
  }
}

if (!customElements.get('w-stepper-vertical-actions')) {
  customElements.define('w-stepper-vertical-actions', WStepperVerticalActions);
}
