/* <w-navigation-drawer> — DuVay component module */

export class WNavigationDrawer extends WElement {
  static attrs = [
    'open',
    'rail',
    'permanent',
    'temporary',
    'location',
    'label',
    'close-on-navigation',
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

  _template() {
    const classes = [
      'w-navigation-drawer',
      this.open ? 'open' : '',
      this.rail ? 'w-navigation-drawer--rail' : '',
      this.permanent ? 'w-navigation-drawer--permanent' : '',
      this.temporary ? 'w-navigation-drawer--temporary' : '',
      this.location === 'right' ? 'w-navigation-drawer--right' : '',
    ].filter(Boolean).join(' ');

    return `<aside class="${classes}" aria-label="${this._esc(this.label)}" aria-hidden="${this.open ? 'false' : 'true'}"${this.open ? '' : ' inert'}>
        <slot></slot>
      </aside>
      <button class="w-navigation-drawer-scrim${this.open && !this.permanent ? ' open' : ''}" type="button" aria-label="Close navigation"${this.open && !this.permanent ? '' : ' hidden'}></button>`;
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
}

if (!customElements.get('w-navigation-drawer')) customElements.define('w-navigation-drawer', WNavigationDrawer);
