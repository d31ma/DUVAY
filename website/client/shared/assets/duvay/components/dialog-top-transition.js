/* <w-dialog-top-transition> — Dialog top transition wrapper */

import { WTransition } from './base-transition.js';

export class WDialogTopTransition extends WTransition {
  static transition = 'w-dialog-top-transition';
}

if (!customElements.get('w-dialog-top-transition')) {
  customElements.define('w-dialog-top-transition', WDialogTopTransition);
}
