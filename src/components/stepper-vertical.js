/* <w-stepper-vertical> — interactive vertical stepper (DuVay equivalent of
 * Vuetify v-stepper-vertical). Each w-stepper-vertical-item shows its content
 * inline only while it is the active step. Shares the active-step model with
 * <w-stepper>.
 *
 * Attributes / events: same as <w-stepper> (value, editable, non-linear).
 */

import './stepper.js';

const WStepper = customElements.get('w-stepper');

class WStepperVertical extends WStepper {
  get vertical() { return true; }
  _stepSelector() { return 'w-stepper-vertical-item'; }
}

if (!customElements.get('w-stepper-vertical')) {
  customElements.define('w-stepper-vertical', WStepperVertical);
}
