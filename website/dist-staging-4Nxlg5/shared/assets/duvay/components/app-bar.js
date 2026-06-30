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

  _events() {
    this._removeScrollListener();
    if (!this.sticky) return;

    this.__wAppBarScroll = () => this._syncScrolledState();
    window.addEventListener('scroll', this.__wAppBarScroll, { passive: true });
    this._syncScrolledState();
  }

  disconnectedCallback() {
    this._removeScrollListener();
  }

  _syncScrolledState() {
    const scrolled = window.scrollY > 4;
    this.toggleAttribute('data-scrolled', scrolled);
    this._q('.w-app-bar')?.classList.toggle('w-app-bar--scrolled', scrolled);
  }

  _removeScrollListener() {
    if (!this.__wAppBarScroll) return;
    window.removeEventListener('scroll', this.__wAppBarScroll);
    this.__wAppBarScroll = null;
  }
}

if (!customElements.get('w-app-bar')) customElements.define('w-app-bar', WAppBar);
