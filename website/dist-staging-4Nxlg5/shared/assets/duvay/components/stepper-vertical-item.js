/* <w-stepper-vertical-item> — Vuetify structural subcomponent */

export class WStepperVerticalItem extends WElement {
  _template() {
    return `<div class="w-stepper-vertical-item"><slot></slot></div>`;
  }
}

if (!customElements.get('w-stepper-vertical-item')) {
  customElements.define('w-stepper-vertical-item', WStepperVerticalItem);
}
