/* <w-scroll-y-transition> — Vertical scroll transition wrapper */

import { WTransition } from './base-transition.js';

export class WScrollYTransition extends WTransition {
  static transition = 'w-scroll-y-transition';
}

if (!customElements.get('w-scroll-y-transition')) {
  customElements.define('w-scroll-y-transition', WScrollYTransition);
}
