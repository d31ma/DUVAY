/* <w-slide-y-reverse-transition> — Reverse vertical slide transition wrapper */

import { WTransition } from './base-transition.js';

export class WSlideYReverseTransition extends WTransition {
  static transition = 'w-slide-y-reverse-transition';
}

if (!customElements.get('w-slide-y-reverse-transition')) {
  customElements.define('w-slide-y-reverse-transition', WSlideYReverseTransition);
}
