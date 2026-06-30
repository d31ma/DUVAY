/* <w-stepper-item> — alias for <w-step>
 *
 * Attributes, events, and slots are identical to <w-step>.
 */

import './step.js';

class WStepperItem extends customElements.get('w-step') {}

if (!customElements.get('w-stepper-item')) {
  customElements.define('w-stepper-item', WStepperItem);
}
