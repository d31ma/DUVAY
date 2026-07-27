/* <w-expand-both-transition> — Expand both axes transition wrapper */

import { WTransition } from './base-transition.js';

export class WExpandBothTransition extends WTransition {
  static transition = 'w-expand-both-transition';
}

if (!customElements.get('w-expand-both-transition')) {
  customElements.define('w-expand-both-transition', WExpandBothTransition);
}
