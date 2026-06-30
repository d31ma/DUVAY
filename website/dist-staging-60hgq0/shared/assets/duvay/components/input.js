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
 * Events:
 *   w-change    - fires on input change (detail: { value, name })
 *   w-input     - fires on each keystroke (detail: { value, name })
 */

class WInput extends WElement {

  static attrs = ['type', 'placeholder', 'value', 'disabled', 'readonly', 'name', 'label', 'hint', 'error', 'size',
    'required', 'pattern', 'minlength', 'maxlength', 'min', 'max', 'step'];

  get type()        { return this._attr('type', 'text'); }
  get placeholder() { return this._attr('placeholder', ''); }
  get value()       { return this._value !== undefined ? this._value : this._attr('value', ''); }
  set value(v)      {
    this._value = v;
    const input = this._q('input');
    if (input) input.value = v;
    this._silentSet('value', v);
  }
  get disabled()    { return this._bool('disabled'); }
  get readonly()    { return this._bool('readonly'); }
  get name()        { return this._attr('name', ''); }
  get label()       { return this._attr('label', ''); }
  get hint()        { return this._attr('hint', ''); }
  get error()       { return this._attr('error', ''); }
  get size()        { return this._attr('size', ''); }

  _template() {
    const t = this.type;
    const ph = this.placeholder ? ` placeholder="${this._esc(this.placeholder)}"` : '';
    const val = this.value ? ` value="${this._esc(this.value)}"` : '';
    const isDisabled = this.disabled ? ' disabled' : '';
    const isReadonly = this.readonly ? ' readonly' : '';
    const nameAttr = this.name ? ` name="${this._esc(this.name)}"` : '';
    const sizeClass = this.size ? ' w-input--' + this.size : '';

    const input = `<input type="${t}"
      class="w-input${sizeClass}"
      ${ph}${val}${isDisabled}${isReadonly}${nameAttr}${this._validationAttrs()}
      data-w-input>`;

    const lbl = this.label;
    const hint = this.hint;
    const error = this.error;

    if (lbl || hint || error) {
      const fieldClass = error ? 'w-field w-field-error' : 'w-field';
      let html = `<div class="${fieldClass}">`;
      if (lbl) html += `<label class="w-field-label">${this._esc(lbl)}</label>`;
      html += input;
      if (error) html += `<span class="w-field-hint">${this._esc(error)}</span>`;
      else if (hint) html += `<span class="w-field-hint">${this._esc(hint)}</span>`;
      html += `</div>`;
      return html;
    }

    return input;
  }

  _events() {
    const inp = this._q('input');
    if (!inp) return;

    inp.addEventListener('input', () => {
      this._emit('w-input', { value: inp.value, name: this.name });
    });
    inp.addEventListener('change', () => {
      this._emit('w-change', { value: inp.value, name: this.name });
    });
  }

  focus() {
    const inp = this._q('input');
    if (inp) inp.focus();
  }

}

customElements.define('w-input', WInput);
