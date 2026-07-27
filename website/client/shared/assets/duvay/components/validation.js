/* <w-validation> — validation shell around a slotted control, mirroring
 * Vuetify's <v-validation>.
 *
 * It owns no chrome of its own: it labels the slotted control, names it for
 * form submission, and surfaces error messages — either the ones handed to it
 * or the control's own constraint-validation message.
 *
 * Attributes:
 *   label            - label text for the slotted control
 *   name             - forwarded to the slotted control's `name` attribute
 *   error            - put the control in a manual error state
 *   error-messages   - error text (comma-separated or a JSON array)
 *   max-errors       - how many messages are shown at once (default 1)
 *   validate-on      - input (default) | blur | submit | invalid-input | eager;
 *                      when the built-in checks start running
 *   validation-value - value the built-in checks read instead of the control's
 *
 * Events:
 *   invalid - the error state turned on (detail: { errors })
 */

import { wValueList } from './utils.js';

const VALIDATION_TRIGGERS = ['input', 'invalid-input', 'blur', 'submit'];

let validationUid = 0;

export class WValidation extends WElement {
  static attrs = [
    'label', 'name', 'error', 'error-messages', 'max-errors', 'validate-on',
    'validation-value',
  ];

  get label() { return this._attr('label', ''); }
  get name() { return this._attr('name', ''); }
  get errorMessages() { return wValueList(this._attr('error-messages', '')); }
  get maxErrors() { return Number(this._attr('max-errors', '1')) || 1; }
  get validateOn() { return this._attr('validate-on', 'input'); }

  get validationValue() {
    const raw = this.getAttribute('validation-value');
    if (raw !== null) return raw;
    const control = this._control();
    return control ? String(control.value) : '';
  }

  _uid() {
    if (!this.__uid) this.__uid = 'w-validation-' + (++validationUid);
    return this.__uid;
  }

  _labelId() { return this._uid() + '-label'; }
  _messagesId() { return this._uid() + '-messages'; }

  _control() { return this._q('input, textarea, select'); }

  /* ── Template ─────────────────────────────────────────────────────────── */

  _template() {
    return `<div class="w-validation${this._cls({ 'w-validation--error': this._hasError() })}">`
      + this._labelHtml()
      + `<slot></slot>`
      + this._messagesHtml()
      + `</div>`;
  }

  _labelHtml() {
    if (!this.label) return '';
    return `<span class="w-label" id="${this._labelId()}">${this._esc(this.label)}</span>`;
  }

  _messagesHtml() {
    const errors = this._activeErrors();
    const text = errors.map((item) => this._esc(item)).join('<br>');
    return `<span class="w-validation-messages" id="${this._messagesId()}" role="alert">${text}</span>`;
  }

  /* ── Validation ───────────────────────────────────────────────────────── */

  _hasError() {
    return this._bool('error') || this._activeErrors().length > 0;
  }

  _activeErrors() {
    return this.errorMessages.concat(this._ruleErrors()).slice(0, this.maxErrors);
  }

  // The control's own constraints only surface once the configured
  // `validate-on` trigger has fired, so a pristine field stays quiet.
  _ruleErrors() {
    if (!this._validated) return [];
    const control = this._control();
    if (!control) return [];
    const value = this.validationValue;
    if (control.hasAttribute('required') && !value) return ['This field is required.'];
    return this._nativeErrors(control);
  }

  // An explicit `validation-value` replaces the control's own value, so the
  // native constraint check (which can only see the control) is stood down.
  _nativeErrors(control) {
    if (this.hasAttribute('validation-value')) return [];
    return control.checkValidity() ? [] : [control.validationMessage];
  }

  _bindValidation(control) {
    const triggers = this.validateOn.split(/\s+/).filter(Boolean);
    const targets = { input: control, 'invalid-input': control, blur: control, submit: this.closest('form') };
    VALIDATION_TRIGGERS.forEach((name) => this._bindTrigger(name, targets[name], triggers));
    if (triggers.includes('eager')) this._markValidated();
  }

  _bindTrigger(name, target, triggers) {
    if (!target || !triggers.includes(name)) return;
    const domEvent = name === 'invalid-input' ? 'input' : name;
    target.addEventListener(domEvent, () => this._markValidated());
  }

  _markValidated() {
    this._validated = true;
    this._sync();
  }

  // Refresh in place — a re-render would discard the control being typed into.
  _sync() {
    const errors = this._activeErrors();
    const messages = this._q('.w-validation-messages');
    if (messages) messages.innerHTML = errors.map((item) => this._esc(item)).join('<br>');
    const root = this._q('.w-validation');
    if (root) root.classList.toggle('w-validation--error', this._hasError());
    const control = this._control();
    if (control) this._syncControl(control, errors);
  }

  _syncControl(control, errors) {
    if (this._hasError()) control.setAttribute('aria-invalid', 'true');
    else control.removeAttribute('aria-invalid');
    const key = errors.join('|');
    if (key === this.__errorKey) return;
    this.__errorKey = key;
    if (errors.length) this._emit('invalid', { errors });
  }

  _events() {
    const control = this._control();
    if (!control) return;
    if (this.name) control.setAttribute('name', this.name);
    if (this.label) control.setAttribute('aria-labelledby', this._labelId());
    control.setAttribute('aria-describedby', this._messagesId());
    // The control is slotted, so it survives re-renders — bind its triggers once.
    if (this.__boundControl !== control) {
      this.__boundControl = control;
      this._bindValidation(control);
    }
    this._sync();
  }
}

if (!customElements.get('w-validation')) customElements.define('w-validation', WValidation);
