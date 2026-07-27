/* <w-scale-transition> — Scale transition wrapper */

import { WTransition } from './base-transition.js';

export class WScaleTransition extends WTransition {
  static transition = 'w-scale-transition';
}

if (!customElements.get('w-scale-transition')) {
  customElements.define('w-scale-transition', WScaleTransition);
}
