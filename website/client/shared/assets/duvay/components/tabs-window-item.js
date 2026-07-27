/* <w-tabs-window-item> — alias for <w-window-item>
 *
 * Attributes, events, and slots are identical to <w-window-item>.
 */

import './window-item.js';

class WTabsWindowItem extends customElements.get('w-window-item') {}

if (!customElements.get('w-tabs-window-item')) {
  customElements.define('w-tabs-window-item', WTabsWindowItem);
}
