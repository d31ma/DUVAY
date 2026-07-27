/* <w-navigation-drawer> — DuVay component module
 *
 * Vuetify parity: open/rail/permanent/temporary/location/label/close-on-navigation
 * plus width (token/px → CSS var), floating (no border), expand-on-hover
 * (rail expands on hover/focus), scrim (boolean, toggle backdrop), border,
 * elevation, color.
 *
 * Attributes:
 *   open               - boolean; drawer visibility
 *   rail               - boolean; collapsed rail mode
 *   rail-width         - width used while `rail` is active
 *   permanent          - boolean; always visible, cannot be closed
 *   temporary          - boolean; modal overlay drawer
 *   persistent         - boolean; scrim/Escape/swipe do not dismiss
 *   location           - left (default) | right
 *   label              - accessible label for the drawer
 *   name               - layout registration name (mirrored to data-name)
 *   order              - layout order within its flex/grid parent
 *   close-on-navigation - boolean; close on link click (default true)
 *   disable-route-watcher - boolean; opts out of close-on-navigation
 *   width              - drawer width (number px or CSS value, default 256)
 *   floating           - boolean; removes border for floating style
 *   absolute           - boolean; position against the offset parent
 *   sticky             - boolean; stays visible when scrolling past the top
 *   image              - background image URL
 *   expand-on-hover    - boolean; rail expands on hover/focus
 *   open-delay         - ms before a hover expand
 *   close-delay        - ms before a hover collapse
 *   mobile             - boolean; force mobile (compact) behaviour
 *   mobile-breakpoint  - number or xs|sm|md|lg|xl|xxl
 *   disable-resize-watcher - boolean; never auto open/close on resize
 *   touchless          - boolean; disable swipe-to-close
 *   retain-focus / capture-focus - keep Tab inside an open drawer
 *   scrim              - boolean; show backdrop scrim (default true for temporary)
 *   border             - boolean; adds border
 *   elevation          - 0..N shadow level
 *   color              - palette token for background color
 *
 * Events:
 *   toggle - fires on open/close state change (detail: { open, reason })
 *   close  - fires when drawer closes (detail: { open, reason })
 */

const W_DRAWER_BREAKPOINTS = { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920, xxl: 2560 };

export class WNavigationDrawer extends WElement {
  static attrs = [
    'open',
    'rail',
    'rail-width',
    'permanent',
    'temporary',
    'persistent',
    'location',
    'label',
    'name',
    'order',
    'close-on-navigation',
    'disable-route-watcher',
    'width',
    'floating',
    'absolute',
    'sticky',
    'image',
    'expand-on-hover',
    'open-delay',
    'close-delay',
    'mobile',
    'mobile-breakpoint',
    'disable-resize-watcher',
    'touchless',
    'retain-focus',
    'capture-focus',
    'scrim',
    'border',
    'elevation',
    'color',
  ];

  connectedCallback() {
    if (this.permanent) {
      this._silentSet('open', true);
    }
    super.connectedCallback();
    if (!this.__wDrawerResize) {
      this.__wCompact = this._isCompact();
      this.__wDrawerResize = () => this._onResize();
      window.addEventListener('resize', this.__wDrawerResize);
    }
  }

  get open() { return this.permanent || this._bool('open'); }
  get rail() { return this._bool('rail'); }
  get railWidth() { return this._attr('rail-width', ''); }
  get permanent() { return this._bool('permanent'); }
  get temporary() { return this._bool('temporary'); }
  get persistent() { return this._bool('persistent'); }
  get location() { return this._attr('location', 'left'); }
  get label() { return this._attr('label', 'Navigation'); }
  get name() { return this._attr('name', ''); }
  get order() { return this._attr('order', ''); }
  get closeOnNavigation() {
    if (this._bool('disable-route-watcher')) return false;
    const value = this.getAttribute('close-on-navigation');
    return value == null || !['false', '0', 'off'].includes(value.toLowerCase());
  }
  get width() { return this._attr('width', ''); }
  get floating() { return this._bool('floating'); }
  get absolute() { return this._bool('absolute'); }
  get sticky() { return this._bool('sticky'); }
  get image() { return this._attr('image', ''); }
  get expandOnHover() { return this._bool('expand-on-hover'); }
  get openDelay() { return this._delay('open-delay'); }
  get closeDelay() { return this._delay('close-delay'); }
  get mobile() { return this._bool('mobile'); }
  get mobileBreakpoint() { return this._breakpoint(); }
  get disableResizeWatcher() { return this._bool('disable-resize-watcher'); }
  get touchless() { return this._bool('touchless'); }
  // `capture-focus` is Vuetify's newer spelling of the same behaviour.
  get retainFocus() { return this._bool('retain-focus') || this._bool('capture-focus'); }
  get scrim() {
    const v = this.getAttribute('scrim');
    return v == null || !['false', '0', 'off'].includes(v.toLowerCase());
  }
  get border() { return this._bool('border'); }
  get elevation() { return this._attr('elevation', ''); }
  get color() { return this._attr('color', ''); }

  _template() {
    const classes = this._drawerClasses();
    const styleAttr = this._drawerStyle();
    const elevationClass = this._elevationClass();
    const showScrim = this._showScrim();
    const nameAttr = this._attrs({ 'data-name': this.name });

    return `<aside class="${classes}${elevationClass}" aria-label="${this._esc(this.label)}" aria-hidden="${this.open ? 'false' : 'true'}"${this.open ? '' : ' inert'}${nameAttr}${styleAttr}>
        <slot></slot>
      </aside>
      <button class="w-navigation-drawer-scrim${showScrim ? ' open' : ''}" type="button" aria-label="Close navigation"${showScrim ? '' : ' hidden'}></button>`;
  }

  _drawerClasses() {
    return 'w-navigation-drawer' + this._cls({
      open: this.open,
      'w-navigation-drawer--rail': this.rail,
      'w-navigation-drawer--permanent': this.permanent,
      'w-navigation-drawer--temporary': this.temporary,
      'w-navigation-drawer--right': this.location === 'right',
      'w-navigation-drawer--floating': this.floating,
      'w-navigation-drawer--expand-on-hover': this.expandOnHover,
      'w-navigation-drawer--border': this.border,
      'w-navigation-drawer--absolute': this.absolute,
      'w-navigation-drawer--sticky': this.sticky,
      'w-navigation-drawer--image': this.image,
      'w-navigation-drawer--mobile': this.mobile,
    });
  }

  // Width takes a bare number as px; color maps to a palette token.
  _drawerStyle() {
    const styles = [];
    if (this.width) styles.push('--w-drawer-width: ' + this._length(this.width) + ';');
    if (this.railWidth) styles.push('--w-drawer-rail-width: ' + this._length(this.railWidth) + ';');
    if (this.color) styles.push('--w-drawer-bg: var(--w-' + this.color + ');');
    if (this.image) styles.push('--w-drawer-image: url(' + this._esc(this.image) + ');');
    if (this.order) styles.push('order: ' + this._esc(this.order) + ';');
    return styles.length ? ' style="' + styles.join(' ') + '"' : '';
  }

  _length(value) {
    return isNaN(value) ? value : value + 'px';
  }

  _elevationClass() {
    return this.elevation && !this.floating ? ' elevation-' + this.elevation : '';
  }

  _events() {
    const scrim = this._q('.w-navigation-drawer-scrim');
    if (scrim) scrim.addEventListener('click', () => this._dismiss('scrim'));

    const drawer = this._q('.w-navigation-drawer');
    if (drawer) {
      drawer.addEventListener('click', (event) => this._onDrawerClick(event));
      drawer.addEventListener('keydown', (event) => this._onDrawerKeydown(event));
      this._bindHover(drawer);
      this._bindTouch(drawer);
    }

    if (!this.__wDrawerKeydown) {
      this.__wDrawerKeydown = (event) => {
        if (event.key === 'Escape' && this.open) this._dismiss('escape');
      };
      document.addEventListener('keydown', this.__wDrawerKeydown);
    }
  }

  _onDrawerClick(event) {
    if (!this.closeOnNavigation || !this._isCompact()) return;
    if (event.target.closest('a[href], [w-drawer-close]')) this.close('navigation');
  }

  // Rail expansion honours open-delay / close-delay, matching the overlay
  // components' hover timing contract.
  _bindHover(drawer) {
    if (!this.expandOnHover || !this.rail) return;
    drawer.addEventListener('mouseenter', () => this._scheduleExpand(true, this.openDelay));
    drawer.addEventListener('mouseleave', () => this._scheduleExpand(false, this.closeDelay));
    drawer.addEventListener('focusin', () => this._scheduleExpand(true, this.openDelay));
    drawer.addEventListener('focusout', () => this._scheduleExpand(false, this.closeDelay));
  }

  _bindTouch(drawer) {
    if (this.touchless) return;
    drawer.addEventListener('touchstart', (event) => this._onTouchStart(event), { passive: true });
    drawer.addEventListener('touchend', (event) => this._onTouchEnd(event), { passive: true });
  }

  _onTouchStart(event) {
    const touch = event.changedTouches?.[0];
    this.__wTouchX = touch ? touch.clientX : null;
  }

  // A swipe away from the drawer's own edge dismisses it.
  _onTouchEnd(event) {
    const touch = event.changedTouches?.[0];
    const start = this.__wTouchX;
    this.__wTouchX = null;
    if (start == null || !touch) return;
    const delta = touch.clientX - start;
    const away = this.location === 'right' ? delta > 48 : delta < -48;
    if (away) this._dismiss('swipe');
  }

  _onDrawerKeydown(event) {
    if (event.key !== 'Tab' || !this.retainFocus) return;
    const items = this._focusable();
    if (!items.length) return;
    const edge = event.shiftKey ? items[0] : items[items.length - 1];
    if (document.activeElement !== edge) return;
    event.preventDefault();
    (event.shiftKey ? items[items.length - 1] : items[0]).focus();
  }

  _focusable() {
    const drawer = this._q('.w-navigation-drawer');
    if (!drawer) return [];
    return Array.from(drawer.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
      .filter((item) => item instanceof HTMLElement);
  }

  _scheduleExpand(expand, delay) {
    clearTimeout(this.__wExpandTimer);
    if (!delay) {
      this._expandRail(expand);
      return;
    }
    this.__wExpandTimer = setTimeout(() => this._expandRail(expand), delay);
  }

  // Vuetify reopens/closes the drawer as the viewport *crosses* the mobile
  // breakpoint. Resizes that leave the compact state alone are ignored, so a
  // drawer never fights the author's own open state.
  _onResize() {
    const compact = this._isCompact();
    if (compact === this.__wCompact) return;
    this.__wCompact = compact;
    if (this._resizeLocked()) return;
    this._setOpen(!compact, 'resize');
  }

  _resizeLocked() {
    return this.permanent || this.temporary || this.disableResizeWatcher;
  }

  disconnectedCallback() {
    if (this.__wDrawerKeydown) {
      document.removeEventListener('keydown', this.__wDrawerKeydown);
      this.__wDrawerKeydown = null;
    }
    if (this.__wDrawerResize) {
      window.removeEventListener('resize', this.__wDrawerResize);
      this.__wDrawerResize = null;
    }
    clearTimeout(this.__wExpandTimer);
  }

  show(reason = 'programmatic') {
    this._setOpen(true, reason);
  }

  close(reason = 'programmatic') {
    if (this.permanent) return;
    this._setOpen(false, reason);
  }

  toggle() {
    this._setOpen(!this.open, 'toggle');
  }

  // Dismissal gestures (scrim, Escape, swipe) are refused by persistent and
  // permanent drawers.
  _dismiss(reason) {
    if (this.persistent) return;
    this.close(reason);
  }

  _setOpen(open, reason) {
    if (open === this.open) return;
    this._silentSet('open', open);
    this._render();
    this._events();
    this._applyCommonProps();
    this._emit('toggle', { open, reason });
    if (!open) this._emit('close', { open, reason });
  }

  _isCompact() {
    if (this.mobile || this.temporary) return true;
    return window.matchMedia('(max-width: ' + this.mobileBreakpoint + 'px)').matches;
  }

  _breakpoint() {
    const raw = String(this._attr('mobile-breakpoint', '')).trim().toLowerCase();
    if (!raw) return 1024;
    if (raw in W_DRAWER_BREAKPOINTS) return W_DRAWER_BREAKPOINTS[raw];
    const value = Number(raw);
    return Number.isFinite(value) ? value : 1024;
  }

  _delay(name) {
    const value = Number(this.getAttribute(name));
    return Number.isFinite(value) && value > 0 ? value : 0;
  }

  _showScrim() {
    // Show scrim if: temporary and open, or scrim attr is explicitly set and open and not permanent
    if (!this.open || this.permanent) return false;
    if (this.temporary) return true;
    return this.scrim;
  }

  _expandRail(expand) {
    const drawer = this._q('.w-navigation-drawer');
    if (!drawer) return;
    drawer.classList.toggle('w-navigation-drawer--rail-expanded', expand);
  }
}

if (!customElements.get('w-navigation-drawer')) customElements.define('w-navigation-drawer', WNavigationDrawer);
