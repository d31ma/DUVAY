/* <w-sidebar> - sidebar navigation shell */

export class WSidebar extends WElement {
  static attrs = ['side', 'rail', 'sticky', 'label'];

  get side() { return this._attr('side', 'left'); }
  get rail() { return this._bool('rail'); }
  get sticky() { return this._bool('sticky'); }
  get label() { return this._attr('label', 'Sidebar'); }

  _template() {
    const classes = [
      'w-sidebar-component',
      this.rail ? 'w-sidebar--rail' : '',
      this.sticky ? 'w-sidebar--sticky' : '',
      this.side === 'right' ? 'w-sidebar--right' : '',
    ].filter(Boolean).join(' ');
    return `<aside class="${classes}" aria-label="${this._esc(this.label)}"><slot></slot></aside>`;
  }
}

if (!customElements.get('w-sidebar')) {
  customElements.define('w-sidebar', WSidebar);
}
