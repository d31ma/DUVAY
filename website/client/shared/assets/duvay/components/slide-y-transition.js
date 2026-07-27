/* <w-slide-y-transition> — Vertical slide transition wrapper */

import { WTransition } from './base-transition.js';

export class WSlideYTransition extends WTransition {
  static transition = 'w-slide-y-transition';
}

if (!customElements.get('w-slide-y-transition')) {
  customElements.define('w-slide-y-transition', WSlideYTransition);
}
