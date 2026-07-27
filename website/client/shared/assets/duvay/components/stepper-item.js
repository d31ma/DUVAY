/* <w-stepper-item> — alias for <w-step>
 *
 * Attributes, events, and slots are identical to <w-step>, including the
 * Vuetify names title / subtitle / icon / ripple / selected-class and the
 * complete-icon / edit-icon / error-icon indicator glyphs.
 */

import './step.js';

class WStepperItem extends customElements.get('w-step') {}

if (!customElements.get('w-stepper-item')) {
  customElements.define('w-stepper-item', WStepperItem);
}
