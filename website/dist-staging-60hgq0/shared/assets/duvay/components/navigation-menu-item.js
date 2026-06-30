/* <w-navigation-menu-item> - horizontal navigation item */

export class WNavigationMenuItem extends WElement {
  static attrs = ['href', 'label', 'value', 'active', 'disabled'];

  get href() { return this._attr('href', ''); }
  get label() { return this._attr('label', ''); }
  get value() { return this._attr('value', this.href || this.label); }
  get active() { return this._bool('active'); }
  get disabled() { return this._bool('disabled'); }

  _template() {
    const disabled = this.disabled ? ' aria-disabled="true"' : '';
    const current = this.active ? ' aria-current="page"' : '';
    const value = this.value ? ` data-value="${this._esc(this.value)}"` : '';
    const attrs = `class="w-navigation-menu-item${this.active ? ' active' : ''}"${current}${disabled}${value}`;
    const content = this.label ? this._esc(this.label) : '<slot></slot>';
    return this.href && !this.disabled
      ? `<a ${attrs} href="${this._esc(this.href)}">${content}</a>`
      : `<button ${attrs} type="button"${this.disabled ? ' disabled' : ''}>${content}</button>`;
  }
}

if (!customElements.get('w-navigation-menu-item')) {
  customElements.define('w-navigation-menu-item', WNavigationMenuItem);
}
