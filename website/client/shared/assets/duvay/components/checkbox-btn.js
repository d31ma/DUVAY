/* <w-checkbox-btn> — the bare selection control behind <w-checkbox>.
 *
 * Vuetify's v-checkbox-btn is v-checkbox without the VInput wrapper: same
 * control, no hint / messages / error-messages row. Everything else (type,
 * name, value, true-value / false-value, indeterminate, multiple, ripple,
 * inline, label, true-icon / false-icon / indeterminate-icon, error) is
 * inherited from <w-checkbox>.
 */

import './checkbox.js';

const WCheckboxBase = customElements.get('w-checkbox');

export class WCheckboxBtn extends WCheckboxBase {
  // No VInput wrapper, so the details row never renders.
  _detailsHidden() { return true; }

  _rootClass() { return super._rootClass() + ' w-checkbox-btn'; }
}

if (!customElements.get('w-checkbox-btn')) {
  customElements.define('w-checkbox-btn', WCheckboxBtn);
}
