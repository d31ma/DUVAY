/* <w-stepper-window> — alias for <w-window>
 *
 * Attributes, events, and slots are identical to <w-window>.
 */

import './window.js';

class WStepperWindow extends customElements.get('w-window') {}

if (!customElements.get('w-stepper-window')) {
  customElements.define('w-stepper-window', WStepperWindow);
}
