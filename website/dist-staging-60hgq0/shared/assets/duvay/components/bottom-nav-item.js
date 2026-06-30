/* <w-bottom-nav-item> — DuVay component module */

export class WBottomNavItem extends WElement {
  static attrs = ['href', 'icon', 'label', 'active'];
  get href() { return this._attr('href', ''); }
  get icon() { return this._attr('icon', ''); }
  get label() { return this._attr('label', ''); }
  get active() { return this._bool('active'); }
  _template() {
    const tag = this.href ? 'a' : 'button';
    const href = this.href ? ` href="${this._esc(this.href)}"` : ' type="button"';
    return `<${tag} class="w-bottom-nav-item${this.active ? ' active' : ''}"${href}>
      ${this.icon ? `<span aria-hidden="true">${this._esc(this.icon)}</span>` : ''}
      <span>${this._esc(this.label)}<slot></slot></span>
    </${tag}>`;
  }
}

if (!customElements.get('w-bottom-nav-item')) customElements.define('w-bottom-nav-item', WBottomNavItem);
