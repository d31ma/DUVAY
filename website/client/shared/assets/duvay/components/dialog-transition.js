/* <w-dialog-transition> — Dialog transition wrapper */

import { WTransition } from './base-transition.js';

export class WDialogTransition extends WTransition {
  static transition = 'w-dialog-transition';
  static wrapperClass = '';
}

if (!customElements.get('w-dialog-transition')) {
  customElements.define('w-dialog-transition', WDialogTransition);
}
