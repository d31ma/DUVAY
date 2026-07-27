/* <w-scroll-x-transition> — Horizontal scroll transition wrapper */

import { WTransition } from './base-transition.js';

export class WScrollXTransition extends WTransition {
  static transition = 'w-scroll-x-transition';
}

if (!customElements.get('w-scroll-x-transition')) {
  customElements.define('w-scroll-x-transition', WScrollXTransition);
}
