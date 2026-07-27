/* <w-input-group> - field wrapper for grouped controls */

export class WInputGroup extends WElement {
  static attrs = ['label', 'hint', 'error'];

  get label() { return this._attr('label', ''); }
  get hint() { return this._attr('hint', ''); }
  get error() { return this._attr('error', ''); }

  _template() {
    return `<div class="w-field${this.error ? ' w-field-error' : ''}">
      ${this.label ? `<span class="w-field-label">${this._esc(this.label)}</span>` : ''}
      <span class="w-input-group${this.error ? ' error' : ''}"><slot></slot></span>
      ${this.hint || this.error ? `<span class="w-field-hint">${this._esc(this.error || this.hint)}</span>` : ''}
    </div>`;
  }
}

if (!customElements.get('w-input-group')) {
  customElements.define('w-input-group', WInputGroup);
}
