/* <w-radio-group> — groups <w-radio> children behind a single value.
 *
 * Attributes:
 *   name              - form field name pushed onto children that lack one
 *   value             - the selected child's value
 *   label             - group label, also the radiogroup's accessible name
 *   disabled          - disables every child
 *   inline            - lay the options out in a row
 *   error             - manual error state (bare attribute) or error text
 *   required          - marks the group required; validated against `value`
 *
 * Passed down to every child radio that does not set it itself:
 *   type, ripple, true-icon, false-icon, indeterminate-icon, error
 *
 * Input surface (shared with <w-checkbox>, see that file):
 *   hint, messages, error-messages, max-errors, validate-on, validation-value,
 *   persistent-hint, hide-details, indent-details, center-affix,
 *   prepend-icon, append-icon, icon-color, hide-spin-buttons
 *
 * Events:
 *   change - the selected value changed (detail: { value, name })
 */

import { wSelectionSurface } from './checkbox.js';
import { wSetValue } from './utils.js';

export class WRadioGroup extends wSelectionSurface(WElement) {
  static attrs = ['name', 'value', 'label', 'disabled', 'inline'];

  // Defaults the group hands to children that do not declare their own.
  static childProps = ['type', 'ripple', 'true-icon', 'false-icon', 'indeterminate-icon', 'error'];

  get name() { return this._attr('name', 'w-radio-group'); }
  set value(v) { wSetValue(this, v); }
  get value() { return this._attr('value', ''); }
  get disabled() { return this._bool('disabled'); }

  set disabled(value) { this.toggleAttribute('disabled', !!value); }
  _currentValue() { return this.value; }
  _rootSelector() { return '.w-radio-group'; }
  _errorClass() { return 'w-radio-group--error'; }
  // Child radios render a details span of their own, so the group's needs a
  // name that cannot match theirs.
  _detailsSelector() { return '.w-radio-group-details'; }

  _groupAttrs() {
    return this._attrs({
      'aria-label': this.label,
      'aria-invalid': this.hasError ? 'true' : '',
      'aria-required': this.hasAttribute('required') ? 'true' : '',
    });
  }

  _groupClass() {
    return 'w-selection-control-group w-radio-group' + this._cls({
      'w-radio-group--inline': this.inline,
      'w-radio-group--error': this.hasError,
    });
  }

  _labelMarkup() {
    return this.label ? `<span class="w-label">${this._esc(this.label)}</span>` : '';
  }

  _groupMarkup() {
    return `<div class="${this._groupClass()}" role="radiogroup"${this._groupAttrs()}>`
      + this._labelMarkup()
      + `<slot></slot>`
      + `<span class="w-checkbox-details w-radio-group-details">${this._detailsMarkup()}</span>`
      + `</div>`;
  }

  _template() {
    return this._wrapAffixes(this._groupMarkup());
  }

  _events() {
    this.querySelectorAll('w-radio').forEach((radio) => this._syncRadio(radio));
    this._bindSubmit();
    if (this.__wGroupBound) return;
    this.__wGroupBound = true;
    this.addEventListener('focusout', () => { this._blurred = true; this._refreshDetails(); });
  }

  _syncRadio(radio) {
    if (!radio.getAttribute('name')) radio.setAttribute('name', this.name);
    this._applyDisabled(radio);
    this._applyChildProps(radio);
    radio.toggleAttribute('checked', this._radioValue(radio) === this.value);
    if (radio.__wRadioGroup === this) return;
    radio.__wRadioGroup = this;
    radio.addEventListener('change', (event) => this._onRadioChange(event));
  }

  _applyDisabled(radio) {
    if (this.disabled) {
      radio.setAttribute('disabled', '');
      radio.__wRadioGroupDisabled = true;
    } else if (radio.__wRadioGroupDisabled) {
      radio.removeAttribute('disabled');
      radio.__wRadioGroupDisabled = false;
    }
  }

  _applyChildProps(radio) {
    const applied = radio.__wGroupProps || (radio.__wGroupProps = {});
    WRadioGroup.childProps.forEach((name) => this._applyChildProp(radio, applied, name));
  }

  // An attribute the author put on the child always wins; anything the group
  // owns is kept in step, including removal.
  _applyChildProp(radio, applied, name) {
    const value = this.getAttribute(name);
    if (radio.hasAttribute(name) && applied[name] === undefined) return;
    if (value === applied[name]) return;
    applied[name] = value;
    if (value == null) radio.removeAttribute(name);
    else radio.setAttribute(name, value);
  }

  _radioValue(radio) {
    return radio.getAttribute('value') || radio.textContent.trim();
  }

  _onRadioChange(event) {
    event.stopPropagation();
    if (!event.detail?.checked) return;
    const next = event.detail.value;
    this._touched = true;
    this._silentSet('value', next);
    this.querySelectorAll('w-radio').forEach((item) => {
      item.toggleAttribute('checked', this._radioValue(item) === next);
    });
    this._refreshDetails();
    this._emit('change', { value: next, name: this.name });
  }
}

if (!customElements.get('w-radio-group')) customElements.define('w-radio-group', WRadioGroup);
