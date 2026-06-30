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
 *   permanent          - boolean; always visible, cannot be closed
 *   temporary          - boolean; modal overlay drawer
 *   location           - left (default) | right
 *   label              - accessible label for the drawer
 *   close-on-navigation - boolean; close on link click (default true)
 *   width              - drawer width (number px or CSS value, default 256)
 *   floating           - boolean; removes border for floating style
 *   expand-on-hover    - boolean; rail expands on hover/focus
 *   scrim              - boolean; show backdrop scrim (default true for temporary)
 *   border             - boolean; adds border
 *   elevation          - 0..N shadow level
 *   color              - palette token for background color
 *
 * Events:
 *   toggle - fires on open/close state change (detail: { open, reason })
 *   close  - fires when drawer closes (detail: { open, reason })
 */

export class WNavigationDrawer extends WElement {
  static attrs = [
    'open',
    'rail',
    'permanent',
    'temporary',
    'location',
    'label',
    'close-on-navigation',
    'width',
    'floating',
    'expand-on-hover',
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
  }

  get open() { return this.permanent || this._bool('open'); }
  get rail() { return this._bool('rail'); }
  get permanent() { return this._bool('permanent'); }
  get temporary() { return this._bool('temporary'); }
  get location() { return this._attr('location', 'left'); }
  get label() { return this._attr('label', 'Navigation'); }
  get closeOnNavigation() {
    const value = this.getAttribute('close-on-navigation');
    return value == null || !['false', '0', 'off'].includes(value.toLowerCase());
  }
  get width() { return this._attr('width', ''); }
  get floating() { return this._bool('floating'); }
  get expandOnHover() { return this._bool('expand-on-hover'); }
  get scrim() {
    const v = this.getAttribute('scrim');
    return v == null || !['false', '0', 'off'].includes(v.toLowerCase());
  }
  get border() { return this._bool('border'); }
  get elevation() { return this._attr('elevation', ''); }
  get color() { return this._attr('color', ''); }

  _template() {
    const classes = [
      'w-navigation-drawer',
      this.open ? 'open' : '',
      this.rail ? 'w-navigation-drawer--rail' : '',
      this.permanent ? 'w-navigation-drawer--permanent' : '',
      this.temporary ? 'w-navigation-drawer--temporary' : '',
      this.location === 'right' ? 'w-navigation-drawer--right' : '',
      this.floating ? 'w-navigation-drawer--floating' : '',
      this.expandOnHover ? 'w-navigation-drawer--expand-on-hover' : '',
      this.border ? 'w-navigation-drawer--border' : '',
    ].filter(Boolean).join(' ');

    const styles = [];
    if (this.width) {
      styles.push('--w-drawer-width: ' + (isNaN(this.width) ? this.width : this.width + 'px') + ';');
    }
    if (this.color) {
      styles.push('--w-drawer-bg: var(--w-' + this.color + ');');
    }

    const styleAttr = styles.length ? ' style="' + styles.join(' ') + '"' : '';

    // Elevation class
    const elevationClass = this.elevation && !this.floating ? ' elevation-' + this.elevation : '';

    const showScrim = this._showScrim();

    return `<aside class="${classes}${elevationClass}" aria-label="${this._esc(this.label)}" aria-hidden="${this.open ? 'false' : 'true'}"${this.open ? '' : ' inert'}${styleAttr}>
        <slot></slot>
      </aside>
      <button class="w-navigation-drawer-scrim${showScrim ? ' open' : ''}" type="button" aria-label="Close navigation"${showScrim ? '' : ' hidden'}></button>`;
  }

  _events() {
    const scrim = this._q('.w-navigation-drawer-scrim');
    if (scrim) scrim.addEventListener('click', () => this.close('scrim'));

    const drawer = this._q('.w-navigation-drawer');
    if (drawer) {
      drawer.addEventListener('click', (event) => {
        if (!this.closeOnNavigation || !this._isCompact()) return;
        if (event.target.closest('a[href], [data-w-drawer-close]')) this.close('navigation');
      });

      // Expand on hover/focus for rail mode
      if (this.expandOnHover && this.rail) {
        drawer.addEventListener('mouseenter', () => this._expandRail(true));
        drawer.addEventListener('mouseleave', () => this._expandRail(false));
        drawer.addEventListener('focusin', () => this._expandRail(true));
        drawer.addEventListener('focusout', () => this._expandRail(false));
      }
    }

    if (!this.__wDrawerKeydown) {
      this.__wDrawerKeydown = (event) => {
        if (event.key === 'Escape' && this.open && !this.permanent) this.close('escape');
      };
      document.addEventListener('keydown', this.__wDrawerKeydown);
    }
  }

  disconnectedCallback() {
    if (this.__wDrawerKeydown) {
      document.removeEventListener('keydown', this.__wDrawerKeydown);
      this.__wDrawerKeydown = null;
    }
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
    return this.temporary || window.matchMedia('(max-width: 1024px)').matches;
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
