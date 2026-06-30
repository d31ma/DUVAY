/* <w-stepper-vertical> — alias for <w-stepper vertical>
 *
 * Attributes, events, and slots are identical to <w-stepper> except
 * vertical layout is always enabled.
 */

import './stepper.js';

class WStepperVertical extends customElements.get('w-stepper') {
  get vertical() { return true; }
}

if (!customElements.get('w-stepper-vertical')) {
  customElements.define('w-stepper-vertical', WStepperVertical);
}
