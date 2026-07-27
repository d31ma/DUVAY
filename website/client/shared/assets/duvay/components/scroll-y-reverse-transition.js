/* <w-scroll-y-reverse-transition> — Reverse vertical scroll transition wrapper */

import { WTransition } from './base-transition.js';

export class WScrollYReverseTransition extends WTransition {
  static transition = 'w-scroll-y-reverse-transition';
}

if (!customElements.get('w-scroll-y-reverse-transition')) {
  customElements.define('w-scroll-y-reverse-transition', WScrollYReverseTransition);
}
