/* <w-expand-x-transition> — Expand horizontal transition wrapper */

import { WTransition } from './base-transition.js';

export class WExpandXTransition extends WTransition {
  static transition = 'w-expand-x-transition';
}

if (!customElements.get('w-expand-x-transition')) {
  customElements.define('w-expand-x-transition', WExpandXTransition);
}
