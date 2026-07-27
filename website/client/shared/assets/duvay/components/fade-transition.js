/* <w-fade-transition> — Fade transition wrapper */

import { WTransition } from './base-transition.js';

export class WFadeTransition extends WTransition {
  static transition = 'w-fade-transition';
}

if (!customElements.get('w-fade-transition')) {
  customElements.define('w-fade-transition', WFadeTransition);
}
