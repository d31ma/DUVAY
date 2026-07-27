/* <w-radio> — Radio button web component
 *
 * A <w-checkbox> whose native control defaults to `type="radio"`, so it shares
 * the whole selection-control surface (icons, hint / messages, validation) and
 * adds exclusive selection across same-named peers.
 *
 * Attributes:
 *   checked  - whether selected
 *   disabled - disables the radio
 *   name     - form field name (required for grouping)
 *   value    - form value when selected
 *   label    - if set, wraps in a label
 *   color    - 'primary' | 'error' | 'success' | 'warning'
 *   size     - 'xs' | 'sm' | 'md' | 'lg'
 *   type     - override the native control type ('checkbox' renders a box)
 *   error, inline, ripple, multiple, true-value, false-value,
 *   true-icon, false-icon  - see <w-checkbox>
 *
 * Slot:
 *   default  - label text (alternative to label attribute)
 *
 * Events:
 *   change - fires on selection change (detail: { checked, name, value })
 */

import './checkbox.js';

const WCheckboxBase = customElements.get('w-checkbox');

class WRadio extends WCheckboxBase {

  _defaultType() { return 'radio'; }
  _groupSelector() { return 'w-radio'; }

  _changeDetail(checked) {
    return { checked, name: this.name, value: this._modelValue(checked) };
  }

  _events() {
    // Registered before the base handler so peers are already cleared by the
    // time the `change` detail (and any array model) is computed.
    const input = this._q('input');
    if (input) input.addEventListener('change', () => this._clearPeers(input));
    super._events();
  }

  // A radio group is exclusive: checking one clears every same-named peer.
  _clearPeers(input) {
    if (!input.checked || !this.name) return;
    this.getRootNode().querySelectorAll('w-radio').forEach((radio) => this._clearPeer(radio));
  }

  _clearPeer(radio) {
    if (radio === this || radio.getAttribute('name') !== this.name) return;
    radio._silentSet?.('checked', false);
    const input = radio.querySelector('input');
    if (input) input.checked = false;
  }
}

if (!customElements.get('w-radio')) customElements.define('w-radio', WRadio);
