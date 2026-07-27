/* <w-tabs-window> — alias for <w-window>
 *
 * Attributes, events, and slots are identical to <w-window>.
 */

import './window.js';

class WTabsWindow extends customElements.get('w-window') {}

if (!customElements.get('w-tabs-window')) {
  customElements.define('w-tabs-window', WTabsWindow);
}
