/* <w-expand-transition> — Expand transition wrapper */

import { WTransition } from './base-transition.js';

export class WExpandTransition extends WTransition {
  static transition = 'w-expand-transition';
}

if (!customElements.get('w-expand-transition')) {
  customElements.define('w-expand-transition', WExpandTransition);
}
