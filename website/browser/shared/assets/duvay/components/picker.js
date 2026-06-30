/* <w-picker> — DuVay component module */

export class WPicker extends WElement {
  static attrs = ['title'];
  get title() { return this._attr('title', ''); }
  _template() {
    return `<div class="w-picker w-card">
      ${this.title ? `<div class="w-card-header">${this._esc(this.title)}</div>` : ''}
      <div class="w-card-body"><slot></slot></div>
    </div>`;
  }
}

if (!customElements.get('w-picker')) customElements.define('w-picker', WPicker);
