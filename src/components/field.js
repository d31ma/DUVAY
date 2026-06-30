/* <w-field> — DuVay component module */

export class WField extends WElement {
  static attrs = ['label', 'hint', 'error'];
  get label() { return this._attr('label', ''); }
  get hint() { return this._attr('hint', ''); }
  get error() { return this._attr('error', ''); }
  _template() {
    return `<label class="w-field${this.error ? ' error' : ''}">
      ${this.label ? `<span class="w-label">${this._esc(this.label)}</span>` : ''}
      <slot></slot>
      ${this.error || this.hint ? `<span class="w-messages">${this._esc(this.error || this.hint)}</span>` : ''}
    </label>`;
  }
}

if (!customElements.get('w-field')) customElements.define('w-field', WField);
