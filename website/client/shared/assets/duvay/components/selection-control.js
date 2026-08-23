/* <w-selection-control> — the primitive behind DuVay's checkbox / radio /
 * switch surface, mirroring Vuetify's <v-selection-control>.
 *
 * `WSelectionControlBase` below carries the surface every selection control
 * shares — control type, checked/indeterminate state, true/false values, state
 * icons, ripple and inline layout — so <w-switch> and
 * <w-selection-control-group> inherit it rather than re-implementing it.
 *
 * Attributes:
 *   type                - "checkbox" (default) | "radio"
 *   label               - label text (alternative to the default slot)
 *   name                - form field name
 *   value               - native form value when checked (default "on")
 *   true-value          - value submitted / emitted when checked (wins over value)
 *   false-value         - value submitted / emitted when unchecked; renders a
 *                         companion hidden input so a form always carries one
 *   checked             - checked state (reflected)
 *   indeterminate       - "partially selected" state
 *   multiple            - array model: the native name gains a `[]` suffix
 *   error               - manual error state
 *   disabled            - non-interactive
 *   inline              - lay children out in a row
 *   ripple              - press feedback on the control
 *   true-icon / false-icon / indeterminate-icon
 *                       - icon rendered for the matching state
 *
 * Events:
 *   change - { checked, indeterminate, name, value }
 */

import WIcons from '../icons.js';
import { wSetValue } from './utils.js';

export class WSelectionControlBase extends WElement {
  static attrs = [
    'type', 'label', 'name', 'value', 'checked', 'disabled', 'error',
    'indeterminate', 'multiple', 'ripple', 'inline',
    'true-icon', 'false-icon', 'indeterminate-icon', 'true-value', 'false-value',
  ];

  get type()          { return this._attr('type', 'checkbox'); }
  get inputType()     { return this.type === 'radio' ? 'radio' : 'checkbox'; }
  get label()         { return this._attr('label', ''); }
  get name()          { return this._attr('name', ''); }
  set value(v) { wSetValue(this, v); }
  get value()         { return this._attr('value', 'on'); }
  get trueValue()     { return this._attr('true-value', ''); }
  get falseValue()    { return this._attr('false-value', ''); }
  get checkedValue()  { return this.trueValue || this.value; }
  get checked()       { return this._bool('checked'); }
  set checked(value) { this.toggleAttribute('checked', !!value); }
  get disabled()      { return this._bool('disabled'); }
  set disabled(value) { this.toggleAttribute('disabled', !!value); }
  get indeterminate() { return this._bool('indeterminate'); }
  set indeterminate(value) { this.toggleAttribute('indeterminate', !!value); }
  get multiple()      { return this._bool('multiple'); }
  get inline()        { return this._bool('inline'); }
  get trueIcon()          { return this._attr('true-icon', ''); }
  get falseIcon()         { return this._attr('false-icon', ''); }
  get indeterminateIcon() { return this._attr('indeterminate-icon', ''); }

  get ripple() { return this.hasAttribute('ripple') && this.getAttribute('ripple') !== 'false'; }

  // `error` is a boolean state here; components that carry error *text* (the
  // switch) override `error` and this still reports the state correctly.
  get errorState() { return this.hasAttribute('error') && this.getAttribute('error') !== 'false'; }

  // An array model submits repeated entries, which HTML spells with a `[]`
  // suffix on the field name.
  get fieldName() {
    if (!this.name) return '';
    return this.multiple ? `${this.name}[]` : this.name;
  }

  _stateIconName() {
    if (this.indeterminate) return this.indeterminateIcon;
    return this.checked ? this.trueIcon : this.falseIcon;
  }

  _stateIconHtml(iconClass) {
    const name = this._stateIconName();
    if (!name) return '';
    return WIcons.resolve(name, { iconClass: `w-icon ${iconClass}` });
  }

  // A checkbox posts nothing when unchecked; the companion hidden input is the
  // standard way to make `false-value` reach the server.
  _falseValueHtml() {
    if (!this.falseValue || !this.fieldName) return '';
    return `<input type="hidden" name="${this._esc(this.fieldName)}" value="${this._esc(this.falseValue)}">`;
  }

  _controlInput() { return this._q('input:not([type="hidden"])'); }

  _syncIndeterminate() {
    const input = this._controlInput();
    if (input) input.indeterminate = this.indeterminate;
  }

  // `value` follows the true/false pair so a listener always sees the value the
  // form would submit for the current state.
  _stateDetail(input) {
    return {
      checked: input.checked,
      name: this.name,
      value: input.checked ? this.checkedValue : (this.falseValue || this.value),
    };
  }
}

export class WSelectionControl extends WSelectionControlBase {
  static attrs = ['type', 'label', 'name', 'value', 'checked', 'disabled'];

  _rootClass() {
    return 'w-selection-control' + this._cls({
      'w-selection-control--inline': this.inline,
      'w-selection-control--error': this.errorState,
      'w-selection-control--indeterminate': this.indeterminate,
      'w-selection-control--multiple': this.multiple,
    });
  }

  _inputAttrs() {
    return this._attrs({
      type: this.inputType,
      name: this.fieldName,
      value: this.checkedValue,
      checked: this.checked,
      disabled: this.disabled,
      'aria-checked': this.indeterminate ? 'mixed' : '',
      'aria-invalid': this.errorState ? 'true' : '',
    });
  }

  _template() {
    return `<label class="${this._rootClass()}">
      ${this._falseValueHtml()}<input${this._inputAttrs()}>
      <span class="w-selection-control-mark">${this._stateIconHtml('w-selection-control-icon')}</span>
      <span>${this._esc(this.label)}<slot></slot></span>
    </label>`;
  }

  // The state icon follows the live input; `checked` is mirrored silently, so
  // nothing re-renders and the icon has to be swapped in place.
  _syncStateIcon() {
    const mark = this._q('.w-selection-control-mark');
    if (mark) mark.innerHTML = this._stateIconHtml('w-selection-control-icon');
  }

  _events() {
    const input = this._controlInput();
    if (!input) return;
    this._syncIndeterminate();
    if (this.ripple) this._attachRipple(this._q('label'));

    input.addEventListener('change', (event) => {
      event.stopPropagation();
      const detail = this._stateDetail(input);
      this._silentSet('checked', input.checked);
      this._silentSet('indeterminate', false);
      this._syncStateIcon();
      this._emit('change', detail);
    });
  }
}

if (!customElements.get('w-selection-control')) customElements.define('w-selection-control', WSelectionControl);
