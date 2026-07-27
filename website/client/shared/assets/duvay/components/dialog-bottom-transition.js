/* <w-dialog-bottom-transition> — Dialog bottom transition wrapper */

import { WTransition } from './base-transition.js';

export class WDialogBottomTransition extends WTransition {
  static transition = 'w-dialog-bottom-transition';
}

if (!customElements.get('w-dialog-bottom-transition')) {
  customElements.define('w-dialog-bottom-transition', WDialogBottomTransition);
}
