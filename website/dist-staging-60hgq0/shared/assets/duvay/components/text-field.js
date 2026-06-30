/* <w-text-field> — alias for <w-input>
 *
 * Attributes, events, and slots are identical to <w-input>.
 */

import './input.js';

class WTextField extends customElements.get('w-input') {}

if (!customElements.get('w-text-field')) {
  customElements.define('w-text-field', WTextField);
}
