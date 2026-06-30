/* <w-messages> — DuVay component module */

export class WMessages extends WElement {
  static attrs = ['error'];
  get error() { return this._bool('error'); }
  _template() { return `<p class="w-messages${this.error ? ' error' : ''}"><slot></slot></p>`; }
}

if (!customElements.get('w-messages')) customElements.define('w-messages', WMessages);
