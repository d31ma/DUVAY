/* <w-checkbox> — Checkbox web component
 *
 * Attributes:
 *   checked        - whether checked
 *   indeterminate  - shows a mixed state
 *   disabled       - disables the checkbox
 *   readonly       - prevents toggling while keeping focus
 *   name           - form field name
 *   value          - native form value when checked
 *   label          - label text (alternative to default slot)
 *   color          - 'primary' | 'error' | 'success' | 'warning'
 *   size           - 'xs' | 'sm' | 'md' | 'lg'
 *   hint           - helper text rendered below the label
 *   error          - error text; also tints the checkbox accent red
 *   hide-details   - suppresses hint/error text
 *
 * Slot:
 *   default  - label text (alternative to label attribute)
 *
 * Events:
 *   change         - fires on toggle (detail: { checked, value, name })
 */

class WCheckbox extends WElement {

  static attrs = ['checked', 'indeterminate', 'disabled', 'readonly', 'name', 'value', 'label', 'color', 'size', 'hint', 'error', 'hide-details'];

  get checked()       { return this._deriveChecked(); }
  set checked(v)      { v ? this.setAttribute('checked', '') : this.removeAttribute('checked'); }
  get indeterminate() { return this._bool('indeterminate'); }
  get disabled()      { return this._bool('disabled'); }
  get readonly()      { return this._bool('readonly'); }
  get name()          { return this._attr('name', ''); }
  get value()         { return this._attr('value', 'on'); }
  get label()         { return this._attr('label', ''); }
  get color()         { return this._attr('color', ''); }
  get size()          { return this._attr('size', 'md'); }
  get hint()          { return this._attr('hint', ''); }
  get error()         { return this._attr('error', ''); }
  get hideDetails()   { return this._bool('hide-details'); }

  _deriveChecked() { return this.hasAttribute('checked'); }

  _template() {
    const chk = this.checked ? ' checked' : '';
    const dis = this.disabled ? ' disabled' : '';
    const ro = this.readonly ? ' readonly' : '';
    const nm = this.name ? ` name="${this._esc(this.name)}"` : '';
    const val = this.value ? ` value="${this._esc(this.value)}"` : '';
    const mixed = this.indeterminate ? ' aria-checked="mixed"' : '';
    const invalid = this.error ? ' aria-invalid="true"' : '';

    const colorClass = this.color ? ` w-checkbox--${this._esc(this.color)}` : '';
    const sizeClass = ` w-checkbox--${this._esc(this.size || 'md')}`;
    const errorClass = this.error ? ' w-checkbox--error' : '';

    const input = `<input class="w-checkbox-input" type="checkbox"${chk}${dis}${ro}${nm}${val}${mixed}${invalid}>`;

    let text = '';
    if (this.label) {
      text = `<span class="w-checkbox-label">${this._esc(this.label)}</span>`;
    } else {
      text = `<span class="w-checkbox-label"><slot></slot></span>`;
    }

    let details = '';
    if (!this.hideDetails) {
      if (this.error) {
        details += `<span class="w-checkbox-error">${this._esc(this.error)}</span>`;
      } else if (this.hint) {
        details += `<span class="w-checkbox-hint">${this._esc(this.hint)}</span>`;
      }
    }

    if (details) {
      text = `<span class="w-checkbox-text">${text}${details}</span>`;
    }

    return `<label class="w-checkbox${colorClass}${sizeClass}${errorClass}">${input}<span class="w-checkbox-box" aria-hidden="true"></span>${text}</label>`;
  }

  _events() {
    const inp = this._q('input[type="checkbox"]');
    if (!inp) return;

    inp.indeterminate = this.indeterminate;

    inp.addEventListener('click', (e) => {
      if (this.readonly || this.disabled) {
        e.preventDefault();
        return;
      }
    });

    inp.addEventListener('change', (event) => {
      event.stopPropagation();
      if (this.readonly || this.disabled) return;

      const checked = inp.checked;
      const value = this.value;
      this._silentSet('checked', checked);
      this._silentSet('indeterminate', false);

      this._emit('change', { checked, indeterminate: false, name: this.name, value });
    });
  }
}

customElements.define('w-checkbox', WCheckbox);
