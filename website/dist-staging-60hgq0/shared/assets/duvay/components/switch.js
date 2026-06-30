/* <w-switch> — DuVay component module */
import { WSelectionControl } from './selection-control.js';

export class WSwitch extends WSelectionControl {
  get type() { return 'checkbox'; }
  _template() {
    const nm = this.name ? ` name="${this._esc(this.name)}"` : '';
    const val = this.value ? ` value="${this._esc(this.value)}"` : '';
    return `<label class="w-switch">
      <input type="checkbox"${nm}${val}${this.checked ? ' checked' : ''}${this.disabled ? ' disabled' : ''}>
      <span class="w-switch-track"></span>
      <span>${this._esc(this.label)}<slot></slot></span>
    </label>`;
  }
}

if (!customElements.get('w-switch')) customElements.define('w-switch', WSwitch);
