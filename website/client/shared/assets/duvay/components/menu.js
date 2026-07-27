/* <w-menu> — connected menu overlay
 *
 * Overlay parity attributes (shared with <w-dialog> and <w-tooltip>):
 *   scrim / opacity      - optional backdrop and its opacity
 *   contained            - constrain surface and scrim to the offset parent
 *   content-class        - extra class names for the menu surface
 *   no-click-animation   - suppress the persistent bounce
 *   z-index              - stacking order of the surface
 *   target               - `parent`, `cursor`, `x,y` or a CSS selector
 *   offset               - extra distance from the anchor (`8` or `8,4`)
 *   origin               - transform-origin for the transition
 *   stick-to-target      - anchor in page space so the surface scrolls away
 *   viewport-margin      - gap kept between the surface and the viewport edges
 *   transition           - none | fade | scale | slide-y
 *   open-on-click        - activator click toggles (default true)
 *   open-on-hover        - activator hover opens
 *   open-on-focus        - activator focus opens
 *   close-on-back        - browser Back closes instead of navigating
 *   retain-focus / capture-focus - keep Tab inside the menu
 *   disable-initial-focus - skip the automatic focus move on open
 */

export class WMenu extends WElement {
  static attrs = [
    'id',
    'content-id',
    'label',
    'open',
    'location',
    'side',
    'disabled',
    'persistent',
    'close-on-content-click',
    'open-delay',
    'close-delay',
    'submenu',
    'scrim',
    'opacity',
    'contained',
    'content-class',
    'no-click-animation',
    'z-index',
    'target',
    'offset',
    'origin',
    'stick-to-target',
    'viewport-margin',
    'transition',
    'open-on-click',
    'open-on-hover',
    'open-on-focus',
    'close-on-back',
    'retain-focus',
    'capture-focus',
    'disable-initial-focus',
  ];

  constructor() {
    super();
    this.__wUid = 'w-menu-' + Math.random().toString(36).slice(2, 9);
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.__wPopstate) {
      this.__wPopstate = () => this._onPopState();
      window.addEventListener('popstate', this.__wPopstate);
    }
  }

  disconnectedCallback() {
    this._removeGlobalListeners();
    if (this.__wPopstate) window.removeEventListener('popstate', this.__wPopstate);
    this.__wPopstate = null;
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

  get hasScrim() { return this._enabled('scrim', false); }
  get scrimColor() { return this._colorToken(this.getAttribute('scrim')); }
  get opacity() { return this._attr('opacity', ''); }
  get contained() { return this._bool('contained'); }
  get contentClass() { return this._attr('content-class', ''); }
  get noClickAnimation() { return this._bool('no-click-animation'); }
  get zIndex() { return this._attr('z-index', ''); }
  get target() { return this._attr('target', ''); }
  get offset() { return this._attr('offset', ''); }
  get origin() { return this._attr('origin', ''); }
  get stickToTarget() { return this._bool('stick-to-target'); }
  get viewportMargin() { return this._attr('viewport-margin', ''); }
  get transition() { return this._attr('transition', ''); }
  get openOnClick() { return this._enabled('open-on-click', true); }
  get openOnHover() { return this._enabled('open-on-hover', false); }
  get openOnFocus() { return this._enabled('open-on-focus', false); }
  get closeOnBack() { return this._bool('close-on-back'); }
  // Opt-in for <w-menu>: by default Tab moves out of the menu and closes it.
  get retainFocus() { return this._enabled('retain-focus', this._enabled('capture-focus', false)); }
  get disableInitialFocus() { return this._bool('disable-initial-focus'); }

  _template() {
    const hasActivator = !!this.querySelector('[slot="activator"]');
    const activator = hasActivator
      ? `<span class="w-menu-activator" role="button" tabindex="${this.disabled ? '-1' : '0'}" aria-haspopup="menu" aria-expanded="${this.open ? 'true' : 'false'}" aria-controls="${this._esc(this.menuId)}"><slot name="activator"></slot></span>`
      : `<button class="w-btn w-btn-outlined w-menu-activator" type="button" aria-haspopup="menu" aria-expanded="${this.open ? 'true' : 'false'}" aria-controls="${this._esc(this.menuId)}"${this.disabled ? ' disabled' : ''}>${this._esc(this.label)}</button>`;

    return `<div class="${this._rootClasses()}"${this._rootStyle()}>
      ${activator}
      ${this._scrimMarkup()}
      <div id="${this._esc(this.menuId)}" class="${this._esc(this._contentClasses())}" role="menu"${this._contentStyle()}><slot></slot></div>
    </div>`;
  }

  _rootClasses() {
    return [
      'w-menu',
      this.open ? 'open' : '',
      this.submenu ? 'w-menu--submenu' : '',
      'w-menu--' + this._classToken(this.location),
    ].filter(Boolean).join(' ') + this._cls({
      'w-menu--contained': this.contained,
      'w-menu--anchored': this.target,
      'w-menu--stick': this.stickToTarget,
      'w-menu--offset': this.offset,
    }) + this._transitionClass();
  }

  _transitionClass() {
    const value = this._classToken(this.transition, '');
    if (!value) return '';
    if (['none', 'false'].includes(value)) return ' w-menu--no-transition';
    return ' w-menu--transition-' + value;
  }

  _contentClasses() {
    return ('w-menu-content ' + this.contentClass).trim();
  }

  _scrimMarkup() {
    if (!this.hasScrim || !this.open) return '';
    return `<button type="button" class="w-menu-scrim" aria-label="Close menu"${this._scrimStyle()}></button>`;
  }

  _rootStyle() {
    const styles = this._offsetStyles();
    if (this.viewportMargin) styles.push('--w-menu-viewport-margin: ' + this._cssSize(this.viewportMargin));
    return this._styleAttr(styles);
  }

  // `offset="8"` is distance from the anchor; `offset="8,4"` also shifts the
  // surface along the anchored side.
  _offsetStyles() {
    if (!this.offset) return [];
    const parts = String(this.offset).replace(/[[\]]/g, '').split(',').map((part) => part.trim()).filter(Boolean);
    const styles = ['--w-menu-offset: ' + this._cssSize(parts[0])];
    if (parts.length > 1) styles.push('--w-menu-offset-align: ' + this._cssSize(parts[1]));
    return styles;
  }

  _contentStyle() {
    const styles = [];
    if (this.zIndex) styles.push('z-index: ' + this._esc(this.zIndex));
    if (this.origin) styles.push('transform-origin: ' + this._esc(this.origin.replace(/-/g, ' ')));
    return this._styleAttr(styles);
  }

  _scrimStyle() {
    const styles = [];
    if (this.zIndex) styles.push('z-index: ' + this._esc(this.zIndex));
    if (this.opacity) styles.push('--w-menu-scrim-opacity: ' + this._cssPercent(this.opacity));
    if (this.scrimColor) styles.push('--w-menu-scrim-color: ' + this.scrimColor);
    return this._styleAttr(styles);
  }

  _events() {
    const activator = this._q('.w-menu-activator');
    const content = this._q('.w-menu-content');
    if (!activator || !content || this.disabled) return;

    activator.addEventListener('click', (event) => this._onActivatorClick(event));
    activator.addEventListener('keydown', (event) => this._onActivatorKeydown(event));
    activator.addEventListener('focusin', () => {
      if (this.openOnFocus) this._scheduleOpen(true, this.openDelay);
    });
    activator.addEventListener('mouseenter', () => {
      if (this.openDelay > 0 || this.submenu || this.openOnHover) this._scheduleOpen(true, this.openDelay);
    });
    this.addEventListener('mouseleave', () => {
      if (this.closeDelay > 0 || this.submenu || this.openOnHover) this._scheduleOpen(false, this.closeDelay);
    });

    content.addEventListener('keydown', (event) => this._onContentKeydown(event));
    content.addEventListener('click', (event) => this._onContentClick(event));

    const scrim = this._q('.w-menu-scrim');
    if (scrim) scrim.addEventListener('click', () => this._dismiss());

    this._addGlobalListeners();
    if (this.open) this._applyAnchor();
  }

  _onActivatorClick(event) {
    event.stopPropagation();
    if (!this.openOnClick) return;
    this._scheduleOpen(!this.open, this.open ? this.closeDelay : this.openDelay);
  }

  _onContentClick(event) {
    const item = event.target instanceof Element ? event.target.closest('button, a, [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]') : null;
    if (item && this.closeOnContentClick) this._setOpen(false);
  }

  // Persistent menus refuse dismissal and bounce instead, unless the bounce is
  // switched off with `no-click-animation`.
  _dismiss() {
    if (!this.open) return;
    if (this.persistent) {
      this._animateClick();
      return;
    }
    this._setOpen(false);
  }

  _animateClick() {
    const content = this._q('.w-menu-content');
    if (this.noClickAnimation || !content) return;
    content.classList.remove('w-menu-content--bounce');
    void content.offsetWidth;
    content.classList.add('w-menu-content--bounce');
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
      this._onTab(event);
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

  // Without retain-focus, Tab leaves the menu and closes it (the DuVay default).
  // With it, Tab cycles inside the surface.
  _onTab(event) {
    if (!this.retainFocus) {
      this._setOpen(false);
      return;
    }
    const items = this._items();
    if (!items.length) return;
    const edge = event.shiftKey ? items[0] : items[items.length - 1];
    if (document.activeElement !== edge) return;
    event.preventDefault();
    this._focusItem(event.shiftKey ? 'last' : 'first');
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
      if (!this.open) return;
      if (this.contains(event.target)) return;
      this._dismiss();
    };
    this.__wDocumentKeydown = (event) => {
      if (event.key === 'Escape' && this.open) this._dismiss();
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
    this._render();
    this._events();
    if (open) this._pushBackGuard();
    this._initialFocus(open);
    this._emit('toggle', { open });
    if (!open) this._emit('close', { open });
  }

  // retain-focus pulls focus into the surface on open so the trap has an anchor;
  // disable-initial-focus opts out for always-open menus.
  _initialFocus(open) {
    if (!open || !this.retainFocus || this.disableInitialFocus) return;
    this._focusItem('first');
  }

  _pushBackGuard() {
    if (!this.closeOnBack || this.__wBackGuard) return;
    this.__wBackGuard = true;
    history.pushState({ wMenu: this.menuId }, '');
  }

  _onPopState() {
    if (!this.__wBackGuard) return;
    this.__wBackGuard = false;
    this._dismiss();
  }

  _applyAnchor() {
    const root = this._q('.w-menu');
    const content = this._q('.w-menu-content');
    const rect = this._targetRect();
    if (!root || !content || !rect) return;
    const base = this.stickToTarget ? root.getBoundingClientRect() : { left: 0, top: 0 };
    content.style.setProperty('--w-menu-x', Math.round(rect.left - base.left) + 'px');
    content.style.setProperty('--w-menu-y', Math.round(rect.bottom - base.top) + 'px');
  }

  _targetRect() {
    const target = this.target;
    if (!target) return null;
    const point = this._targetPoint(target);
    if (point) return { left: point.x, bottom: point.y };
    const element = this._targetElement(target);
    return element ? element.getBoundingClientRect() : null;
  }

  _targetPoint(target) {
    const parts = target.replace(/[[\]]/g, '').split(',').map((part) => Number(part.trim()));
    if (parts.length !== 2 || !parts.every(Number.isFinite)) return null;
    return { x: parts[0], y: parts[1] };
  }

  _targetElement(target) {
    if (target === 'parent') return this.parentElement;
    try {
      return document.querySelector(target);
    } catch {
      return null;
    }
  }

  _numberAttr(name, fallback) {
    const value = Number(this._attr(name, fallback));
    return Number.isFinite(value) ? Math.max(0, value) : fallback;
  }

  _enabled(name, fallback) {
    if (!this.hasAttribute(name)) return fallback;
    const value = String(this.getAttribute(name) || '').trim().toLowerCase();
    return !['false', '0', 'off', 'no'].includes(value);
  }

  _colorToken(value) {
    const raw = String(value || '').trim();
    if (!/^[a-z][a-z0-9-]*$/i.test(raw)) return '';
    if (['true', 'false', 'on', 'off', 'no'].includes(raw.toLowerCase())) return '';
    return 'var(--w-' + this._esc(raw.toLowerCase()) + ', ' + this._esc(raw) + ')';
  }

  _cssSize(value) {
    const raw = String(value || '').trim();
    if (/^-?\d+(\.\d+)?$/.test(raw)) return raw + 'px';
    return this._esc(raw);
  }

  _cssPercent(value) {
    const raw = String(value || '').trim();
    if (raw.endsWith('%')) return this._esc(raw);
    const number = Number(raw);
    if (!Number.isFinite(number)) return '32%';
    return (number <= 1 ? number * 100 : number) + '%';
  }

  _styleAttr(styles) {
    return styles.length ? ` style="${styles.join('; ')}"` : '';
  }

  _classToken(value, fallback = 'bottom-start') {
    return String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || fallback;
  }
}

if (!customElements.get('w-menu')) customElements.define('w-menu', WMenu);
