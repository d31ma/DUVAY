/* <w-slide-x-reverse-transition> — Reverse horizontal slide transition wrapper */

import { WTransition } from './base-transition.js';

export class WSlideXReverseTransition extends WTransition {
  static transition = 'w-slide-x-reverse-transition';
}

if (!customElements.get('w-slide-x-reverse-transition')) {
  customElements.define('w-slide-x-reverse-transition', WSlideXReverseTransition);
}
