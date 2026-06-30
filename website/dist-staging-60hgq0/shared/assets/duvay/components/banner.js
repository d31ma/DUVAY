/* <w-banner> — DuVay component module */

export class WBanner extends WElement {
  static attrs = ['icon', 'action'];

  get icon() { return this._attr('icon', ''); }
  get action() { return this._attr('action', ''); }

  _template() {
    const icon = this.icon ? `<span aria-hidden="true">${this._esc(this.icon)}</span>` : '';
    const action = this.action ? `<strong>${this._esc(this.action)}</strong>` : '';
    return `<button class="w-banner" type="button">${icon}<slot></slot>${action}</button>`;
  }
}

if (!customElements.get('w-banner')) customElements.define('w-banner', WBanner);
