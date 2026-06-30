/* <w-stepper-window-item> — alias for <w-window-item>
 *
 * Attributes, events, and slots are identical to <w-window-item>.
 */

import './window-item.js';

class WStepperWindowItem extends customElements.get('w-window-item') {}

if (!customElements.get('w-stepper-window-item')) {
  customElements.define('w-stepper-window-item', WStepperWindowItem);
}
