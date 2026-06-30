/* <w-selection-control> — DuVay component module */

export class WSelectionControl extends WElement {
  static attrs = ['type', 'label', 'name', 'value', 'checked', 'disabled'];
  get type() { return this._attr('type', 'checkbox'); }
  get label() { return this._attr('label', ''); }
  get name() { return this._attr('name', ''); }
  get value() { return this._attr('value', 'on'); }
  get checked() { return this._bool('checked'); }
  get disabled() { return this._bool('disabled'); }
  _template() {
    const type = this.type === 'radio' ? 'radio' : 'checkbox';
    const nm = this.name ? ` name="${this._esc(this.name)}"` : '';
    const val = this.value ? ` value="${this._esc(this.value)}"` : '';
    return `<label class="w-selection-control">
      <input type="${type}"${nm}${val}${this.checked ? ' checked' : ''}${this.disabled ? ' disabled' : ''}>
      <span>${this._esc(this.label)}<slot></slot></span>
    </label>`;
  }
  _events() {
    const input = this._q('input');
    if (!input) return;
    input.addEventListener('change', () => {
      this._silentSet('checked', input.checked);
      this._emit('w-change', { checked: input.checked, name: this.name, value: this.value });
    });
  }
}

if (!customElements.get('w-selection-control')) customElements.define('w-selection-control', WSelectionControl);
