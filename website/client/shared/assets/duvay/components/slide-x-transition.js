/* <w-slide-x-transition> — Horizontal slide transition wrapper */

import { WTransition } from './base-transition.js';

export class WSlideXTransition extends WTransition {
  static transition = 'w-slide-x-transition';
}

if (!customElements.get('w-slide-x-transition')) {
  customElements.define('w-slide-x-transition', WSlideXTransition);
}
