/* <w-progress-circular> — Vuetify VProgressCircular equivalent
 *
 * Attributes, events, and slots are identical to the internal progress base.
 */

import { WProgress } from './progress.js';

class WProgressCircular extends WProgress {
  get variant() { return 'circular'; }
}

if (!customElements.get('w-progress-circular')) {
  customElements.define('w-progress-circular', WProgressCircular);
}
