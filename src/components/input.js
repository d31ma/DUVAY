/* <w-input> — Text input web component
 *
 * Attributes:
 *   type         - any native input type; common values include text, email,
 *                  password, search, number, url, tel, date, time, and color
 *   placeholder  - placeholder text
 *   value        - input value
 *   disabled     - disables the input
 *   readonly     - makes the input read-only
 *   name         - form field name
 *   label        - if set, wraps in a .w-field with label
 *   hint         - if set, adds .w-field-hint below
 *   error        - if set, adds .w-field-error and shows this as error message
 *   size         - xs | sm | lg | xl (omit for the default)
 *   required, pattern, minlength, maxlength, min, max, step
 *                - native HTML5 constraint attributes, forwarded to the input
 *                  so the field validates inside <w-form>
 *
 * Field surface (mirrors <v-input>):
 *   prepend-icon / append-icon - icons outside the input
 *   icon-color       - color for those icons
 *   glow             - icons go full opacity + accent while the field is focused
 *   center-affix     - vertically centre the icons against the input
 *   direction        - horizontal | vertical (default) label/control layout
 *   hide-spin-buttons - hide the native spinners when type="number"
 *   indent-details   - add inline padding to the details row
 *   persistent-hint  - keep the hint beside the error text instead of replacing it
 *   messages         - helper messages below the input (comma / JSON list)
 *   error-messages   - error messages; also puts the input in the error state
 *   max-errors       - how many messages are shown at once (default 1)
 *   validate-on      - input (default) | blur | submit | invalid-input | eager;
 *                      when the built-in required / pattern checks start running
 *   validation-value - value the built-in checks read instead of the input's
 *   hide-details     - suppress the details row (`auto` keeps it when non-empty)
 *
 * Events:
 *   change      - fires on input change (detail: { value, name })
 *   input       - fires on each keystroke (detail: { value, name })
 */

import WIcons from '../icons.js';
import { wValueList } from './utils.js';

const INPUT_TRIGGERS = ['input', 'invalid-input', 'blur', 'submit'];

let inputUid = 0;

class WInput extends WElement {

  static attrs = ['type', 'placeholder', 'value', 'disabled', 'readonly', 'name', 'label', 'hint', 'error', 'size',
    'required', 'pattern', 'minlength', 'maxlength', 'min', 'max', 'step',
    'prepend-icon', 'append-icon', 'icon-color', 'glow', 'center-affix', 'direction',
    'hide-spin-buttons', 'indent-details', 'persistent-hint', 'messages',
    'error-messages', 'max-errors', 'validate-on', 'validation-value', 'hide-details'];

  get type()        { return this._attr('type', 'text'); }
  get placeholder() { return this._attr('placeholder', ''); }
  get value()       { return this._value !== undefined ? this._value : this._attr('value', ''); }
  set value(v)      {
    this._value = v;
    const input = this._q('input');
    if (input) input.value = v;
    this._silentSet('value', v);
    this._syncDetails();
  }
  get disabled()    { return this._bool('disabled'); }
  set disabled(value) { this.toggleAttribute('disabled', !!value); }
  get readonly()    { return this._bool('readonly'); }
  set readonly(value) { this.toggleAttribute('readonly', !!value); }
  get name()        { return this._attr('name', ''); }
  get label()       { return this._attr('label', ''); }
  get hint()        { return this._attr('hint', ''); }
  get error()       { return this._attr('error', ''); }
  get size()        { return this._attr('size', ''); }

  /* Field surface */
  get prependIcon() { return this._attr('prepend-icon', ''); }
  get appendIcon()  { return this._attr('append-icon', ''); }
  get iconColor()   { return this._attr('icon-color', ''); }
  get glow()        { return this._bool('glow'); }
  get centerAffix() { return this._bool('center-affix'); }
  get direction()   { return this._attr('direction', ''); }
  get hideSpinButtons() { return this._bool('hide-spin-buttons'); }
  get indentDetails()   { return this._bool('indent-details'); }
  get persistentHint()  { return this._bool('persistent-hint'); }
  get messages()      { return wValueList(this._attr('messages', '')); }
  get errorMessages() { return wValueList(this._attr('error-messages', '')); }
  get maxErrors()     { return Number(this._attr('max-errors', '1')) || 1; }
  get validateOn()    { return this._attr('validate-on', 'input'); }

  get validationValue() {
    const raw = this.getAttribute('validation-value');
    return raw === null ? this._controlValue() : raw;
  }

  _uid() {
    if (!this.__uid) this.__uid = 'w-input-' + (++inputUid);
    return this.__uid;
  }

  _controlValue() {
    const input = this._q('input');
    return String(input ? input.value : this.value);
  }

  /* ── Template ─────────────────────────────────────────────────────────── */

  _template() {
    const control = this._outerHtml(this._inputHtml());
    return this._needsField() ? this._fieldTemplate(control) : control;
  }

  _inputHtml() {
    const attrs = this._attrs({
      id: this._uid(),
      class: 'w-input' + this._inputModifiers(),
      type: this.type,
      placeholder: this.placeholder,
      value: this.value,
      disabled: this.disabled,
      readonly: this.readonly,
      name: this.name,
      'aria-invalid': this._hasError() && 'true',
      'aria-describedby': this._describedBy(),
    });
    return `<input${attrs}${this._validationAttrs()} w-input>`;
  }

  _inputModifiers() {
    return this._cls({
      ['w-input--' + this.size]: this.size,
      'w-input--hide-spin-buttons': this.hideSpinButtons,
    });
  }

  // The outside icons only earn a flex row when one of them is present.
  _outerHtml(input) {
    const before = this._sideIconHtml('prepend', this.prependIcon);
    const after = this._sideIconHtml('append', this.appendIcon);
    if (!before && !after) return input;
    const cls = this._cls({
      'w-input-control--glow': this.glow,
      'w-input-control--center-affix': this.centerAffix,
    });
    return `<span class="w-input-control${cls}"${this._rootStyle()}>${before}${input}${after}</span>`;
  }

  _sideIconHtml(side, name) {
    if (!name) return '';
    const icon = WIcons.resolve(name, { iconClass: 'w-icon w-input-icon' });
    return `<span class="w-input-${side}">${icon}</span>`;
  }

  _rootStyle() {
    if (!this.iconColor) return '';
    return ` style="--w-input-icon-color:${this._colorValue(this.iconColor)}"`;
  }

  // A bare word is read as a design token, anything else as a literal color.
  _colorValue(value) {
    const text = String(value);
    if (/^[a-z][a-z0-9-]*$/i.test(text)) return `var(--w-${text}, ${text})`;
    return text.replace(/[^\w#(),.%\s-]/g, '');
  }

  _needsField() {
    return !!(this.label || this.hint || this.error || this.direction || this._detailsHtml());
  }

  _fieldTemplate(control) {
    return `<div class="w-field${this._fieldClasses()}">`
      + this._labelHtml()
      + control
      + this._hintHtml()
      + this._detailsHtml()
      + `</div>`;
  }

  // `direction` is the only modifier the outer container owns; the shared
  // `w-field--*` vocabulary describes a *control* root, so the icon row and the
  // details row carry their own modifiers instead.
  _fieldClasses() {
    return this._cls({
      'w-field-error': this._hasError(),
      ['w-field--' + this._esc(this.direction)]: this.direction,
    });
  }

  _labelHtml() {
    if (!this.label) return '';
    return `<label class="w-field-label" for="${this._uid()}">${this._esc(this.label)}</label>`;
  }

  // The error text normally replaces the hint; `persistent-hint` keeps the hint
  // alongside it.
  _hintHtml() {
    const message = this.error || this.hint;
    if (!message) return '';
    const keep = this.persistentHint && this.error && this.hint;
    const extra = keep ? `<span class="w-field-hint w-field-hint--persistent">${this._esc(this.hint)}</span>` : '';
    return `<span class="w-field-hint">${this._esc(message)}</span>${extra}`;
  }

  /* ── Details row ──────────────────────────────────────────────────────── */

  _detailsId() { return this._uid() + '-details'; }

  _describedBy() {
    return this._detailsHtml() ? this._detailsId() : '';
  }

  // The row survives an empty body while a rule could still fail, so
  // `_syncDetails` always has somewhere to write without a re-render.
  _detailsHtml() {
    if (this._detailsHidden()) return '';
    const body = this._detailsBody();
    if (!body && !this._validatable()) return '';
    const cls = this._cls({ 'w-input-details--indent': this.indentDetails });
    return `<div class="w-input-details${cls}" id="${this._detailsId()}">${body}</div>`;
  }

  _detailsHidden() {
    const raw = this.getAttribute('hide-details');
    if (raw == null || raw === 'false') return false;
    if (raw !== 'auto') return true;
    return !this._detailsBody();
  }

  _validatable() {
    return this.hasAttribute('required') || this.hasAttribute('pattern');
  }

  _detailsBody() {
    const errors = this._activeErrors();
    const list = errors.length ? errors : this.messages;
    if (!list.length) return '';
    const cls = this._cls({ 'w-input-messages--error': errors.length });
    const role = errors.length ? ' role="alert"' : '';
    const text = list.map((item) => this._esc(item)).join('<br>');
    return `<span class="w-input-messages${cls}"${role}>${text}</span>`;
  }

  /* ── Validation ───────────────────────────────────────────────────────── */

  _hasError() {
    return !!this.error || this._activeErrors().length > 0;
  }

  _activeErrors() {
    return this.errorMessages.concat(this._ruleErrors()).slice(0, this.maxErrors);
  }

  // The built-in checks stay quiet until the configured `validate-on` trigger
  // has fired, so a pristine input is never shown as invalid.
  _ruleErrors() {
    if (!this._validated) return [];
    const value = this.validationValue;
    const errors = [];
    if (this.hasAttribute('required') && !value) errors.push('This field is required.');
    const pattern = this._attr('pattern', '');
    if (pattern && value && !new RegExp(`^(?:${pattern})$`).test(value)) errors.push('Invalid format.');
    return errors;
  }

  _bindValidation(input) {
    const triggers = this.validateOn.split(/\s+/).filter(Boolean);
    const targets = { input, 'invalid-input': input, blur: input, submit: this.closest('form') };
    INPUT_TRIGGERS.forEach((name) => this._bindTrigger(name, targets[name], triggers));
    if (triggers.includes('eager')) this._markValidated();
  }

  _bindTrigger(name, target, triggers) {
    if (!target || !triggers.includes(name)) return;
    const domEvent = name === 'invalid-input' ? 'input' : name;
    target.addEventListener(domEvent, () => this._markValidated());
  }

  _markValidated() {
    this._validated = true;
    this._syncDetails();
  }

  // Refresh the value-derived details in place; a re-render here would blow
  // away the input the user is typing into.
  _syncDetails() {
    const details = this._q('.w-input-details');
    if (details) details.innerHTML = this._detailsBody();
    const field = this._q('.w-field');
    if (field) field.classList.toggle('w-field-error', this._hasError());
    const input = this._q('input');
    if (input) this._syncInvalid(input);
  }

  _syncInvalid(input) {
    if (this._hasError()) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }

  _events() {
    const inp = this._q('input');
    if (!inp) return;

    inp.addEventListener('input', (event) => {
      event.stopPropagation();
      this._emit('input', { value: inp.value, name: this.name });
    });
    inp.addEventListener('change', (event) => {
      event.stopPropagation();
      this._emit('change', { value: inp.value, name: this.name });
    });

    this._bindValidation(inp);
  }

  focus() {
    const inp = this._q('input');
    if (inp) inp.focus();
  }

}

customElements.define('w-input', WInput);
