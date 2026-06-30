/* <w-dialog> — Modal dialog web component
 *
 * Attributes:
 *   open/model-value - visible state
 *   title            - generated header title
 *   fullscreen       - fills the viewport
 *   scrollable       - keeps header/footer fixed while body scrolls
 *   persistent       - outside/Escape animate instead of closing
 *   scrim            - true | false | color token
 *   width/max-width  - content dimensions
 *
 * Slots:
 *   activator, title, default, footer
 *
 * Events:
 *   w-open, w-close, click:outside, update:model-value, afterEnter, afterLeave
 */

class WDialog extends WElement {

  static attrs = [
    'open',
    'model-value',
    'title',
    'fullscreen',
    'scrollable',
    'persistent',
    'scrim',
    'width',
    'max-width',
    'close-label',
    'hide-close',
    'disabled',
  ];

  get open()  { return this._bool('open'); }
  set open(v) { v ? this.show() : this.close('programmatic'); }
  // Use `dialogTitle` to avoid shadowing HTMLElement.title, which the browser
  // surfaces as the native tooltip.
  get dialogTitle() { return this._attr('title', ''); }
  get fullscreen() { return this._bool('fullscreen'); }
  get scrollable() { return this._bool('scrollable'); }
  get persistent() { return this._bool('persistent'); }
  get closeLabel() { return this._attr('close-label', 'Close'); }
  get disabled() { return this._bool('disabled'); }
  get hasScrim() {
    const scrim = this.getAttribute('scrim');
    return scrim == null || !['false', '0', 'none', 'off'].includes(String(scrim).toLowerCase());
  }

  _template() {
    if (!this._id) this._id = 'w-dialog-' + Math.random().toString(36).slice(2, 8);
    const titleAttr = this.dialogTitle;
    const isOpen = this.open ? ' open' : '';
    const overlayId = this._id + '-overlay';
    const titleId = this._id + '-title';
    const hasTitle = titleAttr || this._hasSlot('title');
    const classes = [
      'w-dialog-wrapper',
      isOpen.trim(),
      this.fullscreen ? 'w-dialog-wrapper--fullscreen' : '',
      this.scrollable ? 'w-dialog-wrapper--scrollable' : '',
      this.persistent ? 'w-dialog-wrapper--persistent' : '',
    ].filter(Boolean).join(' ');
    const dialogClasses = [
      'w-dialog',
      this.fullscreen ? 'w-dialog--fullscreen' : '',
      this.scrollable ? 'w-dialog--scrollable' : '',
    ].filter(Boolean).join(' ');
    const style = this._dialogStyle();
    const activator = this._hasSlot('activator')
      ? '<span class="w-dialog-activator"><slot name="activator"></slot></span>'
      : '<slot name="activator" hidden></slot>';

    return `${activator}
      <div class="w-overlay${isOpen}${this.hasScrim ? ' w-overlay--scrim' : ''}" id="${overlayId}" aria-hidden="true"${this.open ? '' : ' hidden'}></div>
      <div class="${classes}" id="${this._id}" data-w-dialog role="dialog" aria-modal="true" aria-hidden="${!this.open}"${hasTitle ? ` aria-labelledby="${titleId}"` : ''}>
        <div class="${dialogClasses}" tabindex="-1"${style}>
          <div class="w-dialog-header">
            <h3 class="w-dialog-title" id="${titleId}">${titleAttr ? this._esc(titleAttr) + '<slot name="title" hidden></slot>' : '<slot name="title"></slot>'}</h3>
            ${this._bool('hide-close') ? '' : `<button class="w-btn w-btn-icon w-btn--sm w-dialog-close" data-w-dialog-close aria-label="${this._esc(this.closeLabel)}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>`}
          </div>
          <div class="w-dialog-body" role="document"><slot></slot></div>
          <div class="w-dialog-footer"><slot name="footer"></slot></div>
        </div>
      </div>`;
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this._keyHandler) {
      this._keyHandler = (event) => this._onDocumentKeydown(event);
      document.addEventListener('keydown', this._keyHandler);
    }
  }

  _events() {
    this._qAll('[data-w-dialog-close]').forEach((close) => {
      close.addEventListener('click', () => this.close('action'));
      close.querySelectorAll?.('button, a').forEach((control) => {
        control.addEventListener('click', () => this.close('action'));
      });
    });

    const overlay = this._q('.w-overlay');
    if (overlay) overlay.addEventListener('click', (event) => this._onOutside(event));

    const activator = this._q('.w-dialog-activator');
    if (activator) {
      activator.addEventListener('click', (event) => this._activate(event));
      activator.querySelectorAll('button, a, w-btn').forEach((control) => {
        control.addEventListener('click', (event) => this._activate(event));
      });
    }

    const wrapper = this._q('.w-dialog-wrapper');
    if (wrapper) {
      wrapper.addEventListener('click', (event) => {
        if (event.target === wrapper) this._onOutside(event);
      });
      wrapper.addEventListener('keydown', (event) => this._trapFocus(event));
    }

    if (this.open) this._afterOpenRender();
  }

  _activate(event) {
    if (this.disabled) return;
    this._opener = event?.target instanceof HTMLElement ? event.target : document.activeElement;
    this.show();
  }

  disconnectedCallback() {
    if (this._keyHandler) document.removeEventListener('keydown', this._keyHandler);
    this._releaseScrollBlock();
  }

  close(reason = 'programmatic') {
    if (!this.open) return;
    this._silentSet('open', null);
    this._silentSet('model-value', 'false');
    this._render();
    this._events();
    this._releaseScrollBlock();
    this._dispatch('update:model-value', { value: false });
    this._dispatch('w-close', { reason });
    this._dispatch('afterLeave', {});
    this._restoreFocus();
  }

  show() {
    if (this.disabled || this.open) return;
    this._opener = document.activeElement;
    this._silentSet('open', '');
    this._silentSet('model-value', 'true');
    this._render();
    this._events();
    this._blockScroll();
    this._dispatch('update:model-value', { value: true });
    this._dispatch('w-open', {});
    this._dispatch('afterEnter', {});
  }

  _onOutside(event) {
    if (!this.open) return;
    this._dispatch('click:outside', {});
    if (this.persistent) {
      this._animateClick();
      return;
    }
    this.close('outside');
  }

  _onDocumentKeydown(event) {
    if (!this.open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      if (this.persistent) this._animateClick();
      else this.close('escape');
    }
  }

  _trapFocus(event) {
    if (event.key !== 'Tab') return;
    const focusable = this._focusable();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  _afterOpenRender() {
    this._blockScroll();
    requestAnimationFrame(() => {
      const target = this._focusable()[0] || this._q('.w-dialog');
      target?.focus?.({ preventScroll: true });
    });
  }

  _focusable() {
    return Array.from(this.querySelectorAll('.w-dialog button:not([disabled]), .w-dialog [href], .w-dialog input:not([disabled]), .w-dialog select:not([disabled]), .w-dialog textarea:not([disabled]), .w-dialog [tabindex]:not([tabindex="-1"])'))
      .filter((el) => el instanceof HTMLElement && !el.hidden && el.offsetParent !== null);
  }

  _restoreFocus() {
    if (this._opener && typeof this._opener.focus === 'function' && this._opener.isConnected) {
      this._opener.focus({ preventScroll: true });
    }
    this._opener = null;
  }

  _animateClick() {
    const dialog = this._q('.w-dialog');
    if (!dialog) return;
    dialog.classList.remove('w-dialog--shake');
    void dialog.offsetWidth;
    dialog.classList.add('w-dialog--shake');
  }

  _blockScroll() {
    if (this._scrollBlocked) return;
    this._scrollBlocked = true;
    document.documentElement.classList.add('w-dialog-scroll-lock');
  }

  _releaseScrollBlock() {
    if (!this._scrollBlocked) return;
    this._scrollBlocked = false;
    document.documentElement.classList.remove('w-dialog-scroll-lock');
  }

  _dialogStyle() {
    const styles = [];
    const width = this._cssLength(this.getAttribute('width'));
    const maxWidth = this._cssLength(this.getAttribute('max-width'));
    if (width) styles.push('--w-dialog-width: ' + width);
    if (maxWidth) styles.push('--w-dialog-max-width: ' + maxWidth);
    return styles.length ? ` style="${styles.join('; ')}"` : '';
  }

  _cssLength(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (/^\d+(\.\d+)?$/.test(raw)) return raw + 'px';
    if (/^\d+(\.\d+)?(px|rem|em|vh|vw|dvh|dvw|%)$/.test(raw)) return raw;
    return '';
  }

  _hasSlot(name) {
    return !!this.querySelector('[slot="' + name + '"]');
  }

  _dispatch(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }
}

if (!customElements.get('w-dialog')) {
  customElements.define('w-dialog', WDialog);
}
