/* <w-scroll-x-reverse-transition> — Reverse horizontal scroll transition wrapper */

import { WTransition } from './base-transition.js';

export class WScrollXReverseTransition extends WTransition {
  static transition = 'w-scroll-x-reverse-transition';
}

if (!customElements.get('w-scroll-x-reverse-transition')) {
  customElements.define('w-scroll-x-reverse-transition', WScrollXReverseTransition);
}
