/* <w-card-text> — Card body text subcomponent
 *
 * Attributes:
 *   opacity - body text opacity (0–1)
 */

import { wCardOpacityStyle } from './card-subtitle.js';

class WCardText extends WElement {
  static attrs = ['opacity'];

  _template() {
    return `<div class="w-card-text"${wCardOpacityStyle(this)}><slot></slot></div>`;
  }
}

if (!customElements.get('w-card-text')) {
  customElements.define('w-card-text', WCardText);
}
