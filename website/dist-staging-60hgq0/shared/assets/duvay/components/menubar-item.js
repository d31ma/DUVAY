/* <w-menubar-item> - menubar item with submenu */

export class WMenubarItem extends WElement {
  static attrs = ['label', 'open', 'inline'];

  get label() { return this._attr('label', 'Menu'); }
  get open() { return this._bool('open'); }
  get inline() { return this._bool('inline'); }

  _template() {
    const classes = [
      'w-menubar-item',
      this.open ? 'open' : '',
      this.inline ? 'w-menubar-item--inline' : '',
    ].filter(Boolean).join(' ');

    return `<span class="${classes}">
      <button class="w-menubar-trigger" role="menuitem" type="button" aria-haspopup="menu" aria-expanded="${this.open}">${this._esc(this.label)}</button>
      <span class="w-menu-content w-menubar-content" role="menu"><slot></slot></span>
    </span>`;
  }

  _events() {
    if (!this.__wMenubarHostKeydown) {
      this.__wMenubarHostKeydown = (event) => {
        if (!event.target?.closest?.('.w-menubar-trigger')) return;
        if (!this.contains(event.target)) return;
        this._onKeydown(event);
      };
      this.addEventListener('keydown', this.__wMenubarHostKeydown);
    }

    const trigger = this._q('.w-menubar-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      this._setOpen(!this.open);
      this._q('.w-menubar-trigger')?.focus();
    });
    trigger.addEventListener('mouseenter', () => {
      const menubar = this.closest('w-menubar');
      if (menubar?.__wMenubarKeyboardNavUntil && Date.now() < menubar.__wMenubarKeyboardNavUntil) return;
      if (this.parentElement?.querySelector('w-menubar-item[open]')) this._setOpen(true);
    });
    trigger.addEventListener('keydown', (event) => this._onKeydown(event));

    this._qAll('[role="menuitem"]').forEach((item) => {
      if (item === trigger) return;
      item.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        event.preventDefault();
        this._setOpen(false);
        trigger.focus();
      });
    });

    if (!this.__wMenubarDocumentClick) {
      this.__wMenubarDocumentClick = (event) => {
        if (this.open && !this.contains(event.target)) this._setOpen(false);
      };
      document.addEventListener('click', this.__wMenubarDocumentClick);
    }
  }

  _onKeydown(event) {
    if (event.__wMenubarHandled) return;
    event.__wMenubarHandled = true;

    const trigger = this._q('.w-menubar-trigger');
    if (!trigger) return;

    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._setOpen(true);
      this._q('.w-menubar-content [role="menuitem"]')?.focus();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this._setOpen(false);
      trigger.focus();
      return;
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const items = this._items();
      const index = items.indexOf(this);
      const delta = event.key === 'ArrowRight' ? 1 : -1;
      const next = items[(index + delta + items.length) % items.length];
      if (!next) return;
      const menubar = this.closest('w-menubar');
      if (menubar) menubar.__wMenubarKeyboardNavUntil = Date.now() + 400;
      if (typeof next._setOpen === 'function') next._setOpen(true);
      else {
        this._setOpen(false, false);
        next.setAttribute('open', '');
      }
      next.querySelector('.w-menubar-trigger')?.focus();
    }
  }

  _setOpen(open, emit = true) {
    if (open === this.open) return;
    if (open) this._closeSiblings();
    this._silentSet('open', open ? '' : null);
    this._render();
    this._events();
    if (emit) this._emit(open ? 'w-open' : 'w-close', {});
  }

  _closeSiblings() {
    this._items().filter((item) => item.hasAttribute('open')).forEach((item) => {
      if (item === this) return;
      if (typeof item._setOpen === 'function') item._setOpen(false, false);
      else item.removeAttribute('open');
    });
  }

  _items() {
    const menubar = this.closest('w-menubar');
    return Array.from((menubar || this.parentElement)?.querySelectorAll('w-menubar-item') || []);
  }
}

if (!customElements.get('w-menubar-item')) {
  customElements.define('w-menubar-item', WMenubarItem);
}
