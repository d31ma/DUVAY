/* <w-dropdown-menu> - dropdown action menu */

export class WDropdownMenu extends WElement {
  static attrs = [
    'open',
    'model-value',
    'label',
    'side',
    'location',
    'disabled',
    'inline',
    'persistent',
    'close-on-content-click',
    'open-delay',
    'close-delay',
    'submenu',
  ];

  get open() { return this._bool('open'); }
  get label() { return this._attr('label', 'Menu'); }
  get side() { return this._attr('side', this._attr('location', this.submenu ? 'end' : 'bottom-start')); }
  get disabled() { return this._bool('disabled'); }
  get inline() { return this._bool('inline'); }
  get persistent() { return this._bool('persistent'); }
  get closeOnContentClick() { return this._attr('close-on-content-click', 'true') !== 'false'; }
  get openDelay() { return this._numberAttr('open-delay', 0); }
  get closeDelay() { return this._numberAttr('close-delay', 0); }
  get submenu() { return this._bool('submenu'); }

  disconnectedCallback() {
    this._removeGlobalListeners();
    this._clearTimers();
  }

  _template() {
    const hasTrigger = !!this.querySelector('[slot="trigger"]');
    const trigger = hasTrigger
      ? `<span class="w-dropdown-menu-trigger" role="button" tabindex="${this.disabled ? '-1' : '0'}" aria-haspopup="menu" aria-expanded="${this.open}"><slot name="trigger"></slot></span>`
      : `<button class="w-btn w-btn-outlined w-dropdown-menu-trigger" type="button" aria-haspopup="menu" aria-expanded="${this.open}"${this.disabled ? ' disabled' : ''}>${this._esc(this.label)}</button>`;
    const classes = [
      'w-dropdown-menu',
      `w-dropdown-menu--${this.side}`,
      this.open ? 'open' : '',
      this.inline ? 'w-dropdown-menu--inline' : '',
      this.submenu ? 'w-dropdown-menu--submenu' : '',
    ].filter(Boolean).map((name) => this._esc(name)).join(' ');

    return `<span class="${classes}">
      ${trigger}
      <span class="w-menu-content w-dropdown-menu-content" role="menu"><slot></slot></span>
    </span>`;
  }

  _events() {
    const trigger = this._q('.w-dropdown-menu-trigger');
    const content = this._q('.w-dropdown-menu-content');
    if (!trigger || !content || this.disabled) return;
    const toggle = () => this._scheduleOpen(!this.open, this.open ? this.closeDelay : this.openDelay);
    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      toggle();
    });
    trigger.addEventListener('mouseenter', () => {
      if (this.openDelay > 0 || this.submenu) this._scheduleOpen(true, this.openDelay);
    });
    this.addEventListener('mouseleave', () => {
      if (this.closeDelay > 0 || this.submenu) this._scheduleOpen(false, this.closeDelay);
    });
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        this._setOpen(true);
        this._focusItem(event.key === 'ArrowUp' ? 'last' : 'first');
        return;
      }
      if (this.submenu && event.key === 'ArrowRight') {
        event.preventDefault();
        this._setOpen(true);
        this._focusItem('first');
        return;
      }
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      toggle();
    });
    content.addEventListener('keydown', (event) => this._onContentKeydown(event));
    content.addEventListener('click', (event) => {
      const item = event.target instanceof Element ? event.target.closest('button, a, [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]') : null;
      if (item && this.closeOnContentClick) this._setOpen(false);
    });
    this._addGlobalListeners();
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

  _onContentKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this._setOpen(false);
      this._q('.w-dropdown-menu-trigger')?.focus();
      return;
    }
    if (event.key === 'Tab') {
      this._setOpen(false);
      return;
    }
    if (this.submenu && event.key === 'ArrowLeft') {
      event.preventDefault();
      this._setOpen(false);
      this._q('.w-dropdown-menu-trigger')?.focus();
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
    const content = this._q('.w-dropdown-menu-content');
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

  _numberAttr(name, fallback) {
    const value = Number(this._attr(name, fallback));
    return Number.isFinite(value) ? Math.max(0, value) : fallback;
  }
}

if (!customElements.get('w-dropdown-menu')) {
  customElements.define('w-dropdown-menu', WDropdownMenu);
}
