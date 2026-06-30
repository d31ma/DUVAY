/* <w-progress-linear> — Vuetify VProgressLinear equivalent
 *
 * Attributes, events, and slots are identical to the internal progress base.
 */

import { WProgress } from './progress.js';

class WProgressLinear extends WProgress {
  get variant() { return 'linear'; }
}

if (!customElements.get('w-progress-linear')) {
  customElements.define('w-progress-linear', WProgressLinear);
}
