/* <w-overlay> — overlay primitive */

export class WOverlay extends WElement {
  static attrs = [
    'open',
    'label',
    'scrim',
    'persistent',
    'opacity',
    'z-index',
    'contained',
    'absolute',
    'disabled',
    'content-class',
    'location',
    'width',
    'height',
    'min-width',
    'max-width',
    'no-click-animation',
  ];

  constructor() {
    super();
    this.__wUid = 'w-overlay-' + Math.random().toString(36).slice(2, 9);
  }

  get open() { return this._bool('open'); }
  get label() { return this._attr('label', 'Open overlay'); }
  get persistent() { return this._bool('persistent'); }
  get disabled() { return this._bool('disabled'); }
  get contained() { return this._bool('contained'); }
  get absolute() { return this._bool('absolute'); }
  get location() { return this._attr('location', 'center'); }
  get contentClass() { return this._attr('content-class', ''); }
  get noClickAnimation() { return this._bool('no-click-animation'); }
  get hasScrim() {
    const scrim = this.getAttribute('scrim');
    return scrim == null || !['false', '0', 'off', 'none'].includes(String(scrim).toLowerCase());
  }

  _template() {
    const hasActivator = !!this.querySelector('[slot="activator"]');
    const activator = hasActivator
      ? `<span class="w-overlay-activator" role="button" tabindex="${this.disabled ? '-1' : '0'}" aria-haspopup="dialog" aria-expanded="${this.open ? 'true' : 'false'}" aria-controls="${this.__wUid}-content"><slot name="activator"></slot></span>`
      : `<button class="w-btn w-btn-outlined w-overlay-activator" type="button" aria-haspopup="dialog" aria-expanded="${this.open ? 'true' : 'false'}" aria-controls="${this.__wUid}-content"${this.disabled ? ' disabled' : ''}>${this._esc(this.label)}</button>`;
    const contentClass = ['w-overlay-content', this.contentClass].filter(Boolean).join(' ');

    return `${activator}
      <div class="${this._overlayClass()}"${this._overlayStyle()} ${this.open ? '' : 'hidden'} role="presentation">
        ${this.hasScrim ? '<div class="w-overlay-scrim" aria-hidden="true"></div>' : ''}
        <div id="${this.__wUid}-content" class="${this._esc(contentClass)}" role="dialog" aria-modal="${this.contained ? 'false' : 'true'}" tabindex="-1"${this._contentStyle()}>
          <slot></slot>
        </div>
      </div>`;
  }

  _events() {
    const activator = this._q('.w-overlay-activator');
    if (activator && !this.disabled) {
      activator.addEventListener('click', (event) => {
        event.stopPropagation();
        this.show();
      });
      activator.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        this.show();
      });
    }

    const overlay = this._q('.w-overlay');
    if (overlay) {
      overlay.addEventListener('click', (event) => {
        const target = event.target;
        const outside = target === overlay || (target instanceof Element && target.classList.contains('w-overlay-scrim'));
        if (!outside || this.disabled) return;
        if (!this.persistent) this.close('outside');
        else this._animateClick();
      });
    }

    if (!this.__wOverlayKeydown) {
      this.__wOverlayKeydown = (event) => {
        if (event.key !== 'Escape' || !this.open || this.disabled) return;
        if (!this.persistent) this.close('escape');
        else this._animateClick();
      };
      document.addEventListener('keydown', this.__wOverlayKeydown);
    }
  }

  disconnectedCallback() {
    if (this.__wOverlayKeydown) document.removeEventListener('keydown', this.__wOverlayKeydown);
  }

  show() { this._setOpen(true, 'show'); }
  close(reason = 'programmatic') { this._setOpen(false, reason); }

  _setOpen(open, reason) {
    if (open && this.disabled) return;
    if (open === this.open) return;
    const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (open && active && this.contains(active)) this.__wReturnFocus = active;
    this._silentSet('open', open ? '' : null);
    this._render();
    this._events();
    if (open) this._focusContent();
    else this._returnFocus();
    this._dispatch('toggle', { open, reason });
    if (!open) this._dispatch('close', { open, reason });
  }

  _overlayClass() {
    return [
      'w-overlay',
      this.open ? 'open' : '',
      this.hasScrim ? 'w-overlay--scrim' : '',
      this.persistent ? 'w-overlay--persistent' : '',
      this.contained ? 'w-overlay--contained' : '',
      this.absolute ? 'w-overlay--absolute' : '',
      'w-overlay--location-' + this._classToken(this.location),
    ].filter(Boolean).join(' ');
  }

  _overlayStyle() {
    const styles = [];
    const scrim = this.getAttribute('scrim');
    const opacity = this.getAttribute('opacity');
    const zIndex = this.getAttribute('z-index');
    if (scrim && !['true', 'false', '0', 'off', 'none'].includes(String(scrim).toLowerCase())) {
      styles.push('--w-overlay-scrim: ' + this._scrimValue(scrim));
    }
    if (opacity) styles.push('--w-overlay-opacity: ' + this._cssPercent(opacity));
    if (zIndex) styles.push('z-index: ' + this._esc(zIndex));
    return styles.length ? ` style="${styles.join('; ')}"` : '';
  }

  _contentStyle() {
    const styles = [];
    ['width', 'height', 'min-width', 'max-width'].forEach((name) => {
      const value = this.getAttribute(name);
      if (value) styles.push(`${name}: ${this._esc(value)}`);
    });
    return styles.length ? ` style="${styles.join('; ')}"` : '';
  }

  _focusContent() {
    const content = this._q('.w-overlay-content');
    if (!content) return;
    const focusable = content.querySelector('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    (focusable || content).focus?.({ preventScroll: true });
  }

  _returnFocus() {
    const target = this.__wReturnFocus;
    this.__wReturnFocus = null;
    if (target && target.isConnected) target.focus?.({ preventScroll: true });
  }

  _animateClick() {
    if (this.noClickAnimation) return;
    const content = this._q('.w-overlay-content');
    if (!content) return;
    content.classList.remove('w-overlay-content--bounce');
    content.getBoundingClientRect();
    content.classList.add('w-overlay-content--bounce');
    setTimeout(() => content.classList.remove('w-overlay-content--bounce'), 180);
  }

  _dispatch(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  _cssPercent(value) {
    const raw = String(value || '').trim();
    if (/^\d+(\.\d+)?%$/.test(raw)) return raw;
    const number = Number(raw);
    if (Number.isFinite(number)) return (number <= 1 ? number * 100 : number) + '%';
    return '48%';
  }

  _scrimValue(value) {
    const raw = String(value || '').trim();
    if (/^[a-z][a-z0-9-]*$/i.test(raw)) return 'var(--w-' + this._esc(raw.toLowerCase()) + ', ' + this._esc(raw) + ')';
    return this._esc(raw);
  }

  _classToken(value) {
    return String(value).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'center';
  }
}

if (!customElements.get('w-overlay')) customElements.define('w-overlay', WOverlay);
