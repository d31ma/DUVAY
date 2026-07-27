/* <w-sheet> — DuVay component module */

export class WSheet extends WElement {
  static attrs = ['bottom', 'open'];

  get bottom() { return this._bool('bottom'); }
  get open() { return this._bool('open'); }

  _template() {
    if (this.bottom) {
      return `<div class="w-sheet-bottom${this.open ? ' open' : ''}"><slot></slot></div>`;
    }
    return `<div class="w-card"><slot></slot></div>`;
  }
}

if (!customElements.get('w-sheet')) customElements.define('w-sheet', WSheet);
