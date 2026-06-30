/* <w-app-bar> — DuVay component module */

export class WAppBar extends WElement {
  static attrs = ['title', 'sticky'];
  get title() { return this._attr('title', ''); }
  get sticky() { return this._bool('sticky'); }
  _template() {
    return `<header class="w-app-bar${this.sticky ? ' w-app-bar--sticky' : ''}">
      ${this.title ? `<strong class="w-app-bar-title">${this._esc(this.title)}</strong>` : ''}
      <slot></slot>
    </header>`;
  }
}

if (!customElements.get('w-app-bar')) customElements.define('w-app-bar', WAppBar);
