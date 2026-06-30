/* <w-native-select> - native option based select */

export class WNativeSelect extends WElement {
  static attrs = ['value', 'name', 'label', 'hint', 'error', 'size', 'disabled', 'required'];

  get value() { return this._attr('value', ''); }
  get name() { return this._attr('name', ''); }
  get label() { return this._attr('label', ''); }
  get hint() { return this._attr('hint', ''); }
  get error() { return this._attr('error', ''); }
  get size() { return this._attr('size', ''); }
  get disabled() { return this._bool('disabled'); }

  _readOptions() {
    const options = Array.from(this.querySelectorAll('option')).map((option) => ({
      value: option.getAttribute('value') ?? option.textContent.trim(),
      label: option.textContent.trim(),
      selected: option.hasAttribute('selected'),
      disabled: option.disabled,
    }));
    if (options.length) this._wNativeOptions = options;
    return this._wNativeOptions || [];
  }

  _template() {
    const options = this._readOptions();
    const selectedValue = this.value || options.find((option) => option.selected)?.value || '';
    const sizeClass = this.size ? ' w-select--' + this.size : '';
    const select = `<select class="w-select${sizeClass}"${this.name ? ` name="${this._esc(this.name)}"` : ''}${this.disabled ? ' disabled' : ''}${this._validationAttrs(['required'])}>
      ${options.map((option) => `<option value="${this._esc(option.value)}"${option.value === selectedValue ? ' selected' : ''}${option.disabled ? ' disabled' : ''}>${this._esc(option.label)}</option>`).join('')}
    </select>`;

    if (this.label || this.hint || this.error) {
      return `<div class="w-field${this.error ? ' w-field-error' : ''}">
        ${this.label ? `<span class="w-field-label">${this._esc(this.label)}</span>` : ''}
        ${select}
        ${this.hint || this.error ? `<span class="w-field-hint">${this._esc(this.error || this.hint)}</span>` : ''}
      </div>`;
    }

    return select;
  }

  _events() {
    const select = this._q('select');
    if (!select) return;
    select.addEventListener('change', (event) => {
      event.stopPropagation();
      this._silentSet('value', select.value);
      this._emit('change', { value: select.value, name: this.name });
    });
  }
}

if (!customElements.get('w-native-select')) {
  customElements.define('w-native-select', WNativeSelect);
}
