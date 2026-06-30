/* <w-menu> — connected menu overlay */

export class WMenu extends WElement {
  static attrs = [
    'id',
    'content-id',
    'label',
    'open',
    'model-value',
    'location',
    'side',
    'disabled',
    'persistent',
    'close-on-content-click',
    'open-delay',
    'close-delay',
    'submenu',
  ];

  constructor() {
    super();
    this.__wUid = 'w-menu-' + Math.random().toString(36).slice(2, 9);
  }

  disconnectedCallback() {
    this._removeGlobalListeners();
    this._clearTimers();
  }

  get menuId() {
    return this._attr('content-id', this.getAttribute('id') ? this.getAttribute('id') + '-content' : this.__wUid);
  }
  get label() { return this._attr('label', 'Menu'); }
  get open() { return this._bool('open'); }
  get location() { return this._attr('location', this._attr('side', this.submenu ? 'end' : 'bottom-start')); }
  get disabled() { return this._bool('disabled'); }
  get persistent() { return this._bool('persistent'); }
  get closeOnContentClick() { return this._attr('close-on-content-click', 'true') !== 'false'; }
  get openDelay() { return this._numberAttr('open-delay', 0); }
  get closeDelay() { return this._numberAttr('close-delay', 0); }
  get submenu() { return this._bool('submenu'); }

  _template() {
    const hasActivator = !!this.querySelector('[slot="activator"]');
    const classes = [
      'w-menu',
      this.open ? 'open' : '',
      this.submenu ? 'w-menu--submenu' : '',
      'w-menu--' + this._classToken(this.location),
    ].filter(Boolean).join(' ');
    const activator = hasActivator
      ? `<span class="w-menu-activator" role="button" tabindex="${this.disabled ? '-1' : '0'}" aria-haspopup="menu" aria-expanded="${this.open ? 'true' : 'false'}" aria-controls="${this._esc(this.menuId)}"><slot name="activator"></slot></span>`
      : `<button class="w-btn w-btn-outlined w-menu-activator" type="button" aria-haspopup="menu" aria-expanded="${this.open ? 'true' : 'false'}" aria-controls="${this._esc(this.menuId)}"${this.disabled ? ' disabled' : ''}>${this._esc(this.label)}</button>`;

    return `<div class="${classes}">
      ${activator}
      <div id="${this._esc(this.menuId)}" class="w-menu-content" role="menu"><slot></slot></div>
    </div>`;
  }

  _events() {
    const activator = this._q('.w-menu-activator');
    const content = this._q('.w-menu-content');
    if (!activator || !content || this.disabled) return;

    activator.addEventListener('click', (event) => {
      event.stopPropagation();
      this._scheduleOpen(!this.open, this.open ? this.closeDelay : this.openDelay);
    });
    activator.addEventListener('keydown', (event) => this._onActivatorKeydown(event));
    activator.addEventListener('mouseenter', () => {
      if (this.openDelay > 0 || this.submenu) this._scheduleOpen(true, this.openDelay);
    });
    this.addEventListener('mouseleave', () => {
      if (this.closeDelay > 0 || this.submenu) this._scheduleOpen(false, this.closeDelay);
    });

    content.addEventListener('keydown', (event) => this._onContentKeydown(event));
    content.addEventListener('click', (event) => {
      const item = event.target instanceof Element ? event.target.closest('button, a, [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]') : null;
      if (item && this.closeOnContentClick) this._setOpen(false);
    });

    this._addGlobalListeners();
  }

  _onActivatorKeydown(event) {
    if (event.isComposing) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._setOpen(true);
      this._focusItem(event.key === 'ArrowUp' ? 'last' : 'first');
      return;
    }
    if (this.submenu && event.key === 'ArrowRight') {
      event.preventDefault();
      this._setOpen(true);
      this._focusItem('first');
    }
  }

  _onContentKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this._setOpen(false);
      this._q('.w-menu-activator')?.focus();
      return;
    }
    if (event.key === 'Tab') {
      this._setOpen(false);
      return;
    }
    if (this.submenu && event.key === 'ArrowLeft') {
      event.preventDefault();
      this._setOpen(false);
      this._q('.w-menu-activator')?.focus();
      return;
    }
    const direction = event.key === 'ArrowDown' ? 'next' : event.key === 'ArrowUp' ? 'prev' : event.key === 'Home' ? 'first' : event.key === 'End' ? 'last' : '';
    if (!direction) return;
    event.preventDefault();
    this._focusItem(direction);
  }

  _focusItem(direction) {
    const items = this._items();
    if (!items.length) return;
    const active = document.activeElement;
    let index = items.indexOf(active);
    if (direction === 'first') index = 0;
    else if (direction === 'last') index = items.length - 1;
    else index = index < 0 ? 0 : (index + (direction === 'next' ? 1 : -1) + items.length) % items.length;
    items[index]?.focus();
  }

  _items() {
    const content = this._q('.w-menu-content');
    if (!content) return [];
    return Array.from(content.querySelectorAll('button, a, [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]')).filter((item) => {
      if (!(item instanceof HTMLElement)) return false;
      if (item.hasAttribute('disabled') || item.getAttribute('aria-disabled') === 'true') return false;
      return item.offsetParent !== null || item.getClientRects().length > 0;
    });
  }

  _addGlobalListeners() {
    this._removeGlobalListeners();
    this.__wDocumentPointerdown = (event) => {
      if (!this.open || this.persistent) return;
      if (this.contains(event.target)) return;
      this._setOpen(false);
    };
    this.__wDocumentKeydown = (event) => {
      if (event.key === 'Escape' && this.open && !this.persistent) this._setOpen(false);
    };
    document.addEventListener('pointerdown', this.__wDocumentPointerdown);
    document.addEventListener('keydown', this.__wDocumentKeydown);
  }

  _removeGlobalListeners() {
    if (this.__wDocumentPointerdown) document.removeEventListener('pointerdown', this.__wDocumentPointerdown);
    if (this.__wDocumentKeydown) document.removeEventListener('keydown', this.__wDocumentKeydown);
    this.__wDocumentPointerdown = null;
    this.__wDocumentKeydown = null;
  }

  _scheduleOpen(open, delay) {
    this._clearTimers();
    if (!delay) {
      this._setOpen(open);
      return;
    }
    this.__wTimer = setTimeout(() => this._setOpen(open), delay);
  }

  _clearTimers() {
    if (this.__wTimer) clearTimeout(this.__wTimer);
    this.__wTimer = null;
  }

  _setOpen(open) {
    if (this.disabled || open === this.open) return;
    this._silentSet('open', open ? '' : null);
    this._silentSet('model-value', open ? 'true' : 'false');
    this._render();
    this._events();
    this._emit(open ? 'w-open' : 'w-close', { open });
    this._emit('w-toggle', { open });
  }

  _numberAttr(name, fallback) {
    const value = Number(this._attr(name, fallback));
    return Number.isFinite(value) ? Math.max(0, value) : fallback;
  }

  _classToken(value) {
    return String(value).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'bottom-start';
  }
}

if (!customElements.get('w-menu')) customElements.define('w-menu', WMenu);
