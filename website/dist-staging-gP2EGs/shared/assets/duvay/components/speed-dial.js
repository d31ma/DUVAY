/* <w-speed-dial> — DuVay component module */

export class WSpeedDial extends WElement {
  static attrs = ['icon', 'open'];
  get icon() { return this._attr('icon', '+'); }
  get open() { return this._bool('open'); }
  _template() {
    return `<div class="w-speed-dial${this.open ? ' open' : ''}">
      <button class="w-fab" type="button" aria-expanded="${this.open ? 'true' : 'false'}">${this._esc(this.icon)}</button>
      <div class="w-speed-dial-actions"><slot></slot></div>
    </div>`;
  }
  _events() {
    this.querySelector('button')?.addEventListener('click', () => this.toggleAttribute('open'));
  }
}

if (!customElements.get('w-speed-dial')) customElements.define('w-speed-dial', WSpeedDial);
