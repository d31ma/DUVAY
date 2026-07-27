/* <w-selection-control-group> — layout + shared configuration for a set of
 * <w-selection-control> children, mirroring Vuetify's <v-selection-control-group>.
 *
 * The group owns the defaults; each child keeps whatever it declares itself.
 *
 * Attributes:
 *   type            - default control type for children ("checkbox" | "radio")
 *   name            - form field name handed to every child
 *   label           - accessible name for the group
 *   error           - manual error state, propagated to children
 *   multiple        - array model, propagated to children
 *   ripple          - press feedback, propagated to children
 *   inline          - lay the children out in a row
 *   true-icon / false-icon / indeterminate-icon - state icons for children
 */

import { WSelectionControlBase } from './selection-control.js';

export class WSelectionControlGroup extends WSelectionControlBase {
  static attrs = [
    'type', 'name', 'label', 'error', 'multiple', 'ripple', 'inline',
    'true-icon', 'false-icon', 'indeterminate-icon',
  ];

  // Attributes a child inherits unless it declares its own.
  static inherited = [
    'type', 'name', 'multiple', 'ripple', 'error',
    'true-icon', 'false-icon', 'indeterminate-icon',
  ];

  _groupClass() {
    return 'w-selection-control-group' + this._cls({
      'w-selection-control-group--inline': this.inline,
      'w-selection-control-group--error': this.errorState,
    });
  }

  _template() {
    const role = this.inputType === 'radio' ? 'radiogroup' : 'group';
    const label = this.label ? ` aria-label="${this._esc(this.label)}"` : '';
    const invalid = this.errorState ? ' aria-invalid="true"' : '';
    return `<div class="${this._groupClass()}" role="${role}"${label}${invalid}><slot></slot></div>`;
  }

  _events() {
    this._qAll('w-selection-control').forEach((child) => this._applyDefaults(child));
  }

  _applyDefaults(child) {
    WSelectionControlGroup.inherited.forEach((name) => {
      const value = this.getAttribute(name);
      if (value === null || child.hasAttribute(name)) return;
      child.setAttribute(name, value);
    });
  }
}

if (!customElements.get('w-selection-control-group')) customElements.define('w-selection-control-group', WSelectionControlGroup);
