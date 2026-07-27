/* <w-fab-transition> — FAB transition wrapper */

import { WTransition } from './base-transition.js';

export class WFabTransition extends WTransition {
  static transition = 'w-fab-transition';
}

if (!customElements.get('w-fab-transition')) {
  customElements.define('w-fab-transition', WFabTransition);
}
