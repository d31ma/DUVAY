/* <w-hotkey> — DuVay component module */

export class WHotkey extends WElement {
  static attrs = ['keys'];
  get keys() { return this._attr('keys', ''); }
  _template() {
    const keys = (this.keys ? this.keys.split('+') : []).map((key) => `<kbd class="w-kbd">${this._esc(key.trim())}</kbd>`).join('');
    return `<span class="w-hotkey">${keys}<slot></slot></span>`;
  }
}

if (!customElements.get('w-hotkey')) customElements.define('w-hotkey', WHotkey);
