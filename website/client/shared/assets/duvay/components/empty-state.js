/* <w-empty-state> — alias for <w-empty>
 *
 * Attributes, events, and slots are identical to <w-empty>.
 */

import './empty.js';

class WEmptyState extends customElements.get('w-empty') {}

if (!customElements.get('w-empty-state')) {
  customElements.define('w-empty-state', WEmptyState);
}
