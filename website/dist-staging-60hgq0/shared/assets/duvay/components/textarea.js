/* <w-textarea> — Multiline text input web component
 *
 * Attributes:
 *   placeholder  - placeholder text
 *   value        - input value
 *   disabled     - disables the textarea
 *   readonly     - makes the textarea read-only
 *   name         - form field name
 *   label        - if set, wraps in a .w-field with label
 *   hint         - if set, adds .w-field-hint below
 *   error        - if set, adds .w-field-error and shows this as error message
 *   rows         - number of visible rows (default: 4)
 *   required, minlength, maxlength
 *                - native HTML5 constraint attributes, forwarded so the field
 *                  validates inside <w-form>
 *
 * Events:
 *   w-change    - fires on change (detail: { value, name })
 *   w-input     - fires on each keystroke (detail: { value, name })
 */

class WTextarea extends WElement {

  static attrs = ['placeholder', 'value', 'disabled', 'readonly', 'name', 'label', 'hint', 'error', 'rows',
    'required', 'minlength', 'maxlength'];

  get placeholder() { return this._attr('placeholder', ''); }
  get value()       { return this._value !== undefined ? this._value : this._attr('value', ''); }
  set value(v)      {
    this._value = v;
    const ta = this._q('textarea');
    if (ta) ta.value = v;
    this._silentSet('value', v);
  }
  get disabled()    { return this._bool('disabled'); }
  get readonly()    { return this._bool('readonly'); }
  get name()        { return this._attr('name', ''); }
  get label()       { return this._attr('label', ''); }
  get hint()        { return this._attr('hint', ''); }
  get error()       { return this._attr('error', ''); }
  get rows()        { return this._attr('rows', '4'); }

  _template() {
    const ph = this.placeholder ? ` placeholder="${this._esc(this.placeholder)}"` : '';
    const val = this.value ? this._esc(this.value) : '';
    const isDisabled = this.disabled ? ' disabled' : '';
    const isReadonly = this.readonly ? ' readonly' : '';
    const nameAttr = this.name ? ` name="${this._esc(this.name)}"` : '';
    const rowsAttr = ` rows="${this.rows}"`;

    const textarea = `<textarea class="w-textarea"${ph}${isDisabled}${isReadonly}${nameAttr}${rowsAttr}${this._validationAttrs(['required', 'minlength', 'maxlength'])}>${val}</textarea>`;

    const lbl = this.label;
    const hint = this.hint;
    const error = this.error;

    if (lbl || hint || error) {
      const fieldClass = error ? 'w-field w-field-error' : 'w-field';
      let html = `<div class="${fieldClass}">`;
      if (lbl) html += `<label class="w-field-label">${this._esc(lbl)}</label>`;
      html += textarea;
      if (error) html += `<span class="w-field-hint">${this._esc(error)}</span>`;
      else if (hint) html += `<span class="w-field-hint">${this._esc(hint)}</span>`;
      html += `</div>`;
      return html;
    }

    return textarea;
  }

  _events() {
    const ta = this._q('textarea');
    if (!ta) return;

    ta.addEventListener('input', () => {
      this._emit('w-input', { value: ta.value, name: this.name });
    });
    ta.addEventListener('change', () => {
      this._emit('w-change', { value: ta.value, name: this.name });
    });
  }

  focus() {
    const ta = this._q('textarea');
    if (ta) ta.focus();
  }

}

customElements.define('w-textarea', WTextarea);
