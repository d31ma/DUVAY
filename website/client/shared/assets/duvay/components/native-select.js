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
    const select = this._selectTemplate(this._readOptions());

    if (this.label || this.hint || this.error) return this._fieldTemplate(select);

    return select;
  }

  _selectedValue(options) {
    const preselected = options.find((option) => option.selected);
    return this.value || (preselected ? preselected.value : '');
  }

  _selectTemplate(options) {
    const selectedValue = this._selectedValue(options);
    const sizeClass = this._cls({ ['w-select--' + this.size]: this.size });
    const attrs = this._attrs({
      name: this.name,
      'aria-label': this.label || 'Select option',
      disabled: this.disabled,
    });
    return `<select class="w-select${sizeClass}"${attrs}${this._validationAttrs(['required'])}>
      ${options.map((option) => this._optionTemplate(option, selectedValue)).join('')}
    </select>`;
  }

  _optionTemplate(option, selectedValue) {
    const attrs = this._attrs({ selected: option.value === selectedValue, disabled: option.disabled });
    return `<option value="${this._esc(option.value)}"${attrs}>${this._esc(option.label)}</option>`;
  }

  _fieldTemplate(select) {
    return `<div class="w-field${this.error ? ' w-field-error' : ''}">
        ${this.label ? `<span class="w-field-label">${this._esc(this.label)}</span>` : ''}
        ${select}
        ${this.hint || this.error ? `<span class="w-field-hint">${this._esc(this.error || this.hint)}</span>` : ''}
      </div>`;
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
