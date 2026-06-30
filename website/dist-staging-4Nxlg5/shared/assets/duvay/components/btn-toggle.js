/* <w-btn-toggle> — DuVay component module */
import { wValueList } from './utils.js';

export class WBtnToggle extends WElement {
  static attrs = ['value', 'multiple'];
  get value() { return this._attr('value', ''); }
  get multiple() { return this._bool('multiple'); }
  _template() { return `<div class="w-btn-toggle" role="group"><slot></slot></div>`; }
  _events() {
    this.querySelectorAll('w-btn').forEach((btn) => {
      const val = btn.getAttribute('value') || btn.textContent.trim();
      btn.toggleAttribute('active', wValueList(this.value).includes(val));
      btn.addEventListener('click', () => {
        let values = wValueList(this.value);
        if (this.multiple) values = values.includes(val) ? values.filter((v) => v !== val) : values.concat(val);
        else values = [val];
        const value = this.multiple ? JSON.stringify(values) : val;
        this._silentSet('value', value);
        const selected = wValueList(value);
        this.querySelectorAll('w-btn').forEach((b) => b.toggleAttribute('active', selected.includes(b.getAttribute('value') || b.textContent.trim())));
        this._emit('change', { value: this.multiple ? values : val });
      });
    });
  }
}

if (!customElements.get('w-btn-toggle')) customElements.define('w-btn-toggle', WBtnToggle);
