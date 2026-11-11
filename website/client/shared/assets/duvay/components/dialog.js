/* <w-dialog> — Modal dialog web component
 *
 * Attributes:
 *   open             - visible state
 *   heading          - generated header title (preferred name)
 *   title            - same as `heading`. The value moves to `heading` and the
 *                      host `title` attribute is removed, so the browser shows
 *                      no tooltip over the whole dialog. `el.title` still reads
 *                      and writes the heading.
 *   heading-level    - 1-6, the title's heading level (default 3)
 *   aria-describedby - ids that describe the dialog; an empty value turns the
 *                      description off. Without it the dialog is described by
 *                      its body when the body has content.
 *   sheet            - `mobile`: below the small breakpoint (600px) the dialog
 *                      becomes a bottom sheet; it stays a modal dialog
 *   fullscreen       - fills the viewport
 *   scrollable       - keeps header/footer fixed while body scrolls
 *   persistent       - outside/Escape animate instead of closing
 *   scrim            - true | false | color token
 *   width/max-width  - content dimensions
 *
 * Overlay parity attributes (shared with <w-menu> and <w-tooltip>):
 *   absolute            - position the surface against the nearest positioned ancestor
 *   contained           - limit the surface and scrim to the offset parent
 *   content-class       - extra class names for the dialog surface
 *   opacity             - scrim opacity (0-1 or a percentage)
 *   no-click-animation  - suppress the persistent bounce
 *   z-index             - stacking order for wrapper and scrim
 *   target              - `parent`, `cursor`, `x,y` or a CSS selector to anchor to
 *   offset              - extra distance from the anchor
 *   origin              - transform-origin for the open/close transition
 *   stick-to-target     - anchor in page space so the surface scrolls with the target
 *   viewport-margin     - gap kept between the surface and the viewport edges
 *   transition          - none | fade | scale | slide-y
 *   open-on-click       - activator click opens (default true)
 *   open-on-hover       - activator hover opens
 *   open-on-focus       - activator focus opens
 *   open-delay          - ms before a hover/focus open
 *   close-delay         - ms before a hover close
 *   close-on-content-click - clicking the body closes
 *   close-on-back       - browser Back closes instead of navigating
 *   retain-focus / capture-focus - keep Tab inside the dialog (default true)
 *   return-focus        - id of the element that gets focus when the dialog
 *                         closes; without it (or when no element has that id)
 *                         focus returns to the control that held it on open
 *
 * Focus: on open, focus moves to an `autofocus` element in the dialog (or the
 * first control inside an `autofocus` component), else the first control in
 * the body, else the close button or footer, else the panel. However the
 * dialog opens (activator, show(), the `open` attribute, or inserted open), the
 * control that held focus is remembered. Closing through close(), Escape, the
 * X, a `w-dialog-close` control, removing `open`, or removing the dialog gives
 * focus back, unless the app has already moved focus somewhere else.
 *
 * Slots:
 *   activator, title, default, footer
 *
 * Events:
 *   toggle, close
 */

class WDialog extends WElement {

  static attrs = [
    'open',
    'title',
    'heading',
    'heading-level',
    'sheet',
    'aria-describedby',
    'fullscreen',
    'scrollable',
    'persistent',
    'scrim',
    'width',
    'max-width',
    'close-label',
    'hide-close',
    'disabled',
    'absolute',
    'contained',
    'content-class',
    'opacity',
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
    'open-delay',
    'close-delay',
    'close-on-content-click',
    'close-on-back',
    'retain-focus',
    'capture-focus',
    'return-focus',
  ];

  static FOCUSABLE = [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];

  get open()  { return this._bool('open'); }
  set open(v) { v ? this.show() : this.close('programmatic'); }
  // The heading lives in `heading`, never in the host `title` attribute, which
  // the browser would show as a tooltip over the whole dialog.
  get dialogTitle() { return this._attr('heading', ''); }
  get title() { return this.dialogTitle; }
  set title(value) { this.setAttribute('heading', value == null ? '' : String(value)); }
  get headingLevel() {
    const level = Number(this.getAttribute('heading-level'));
    return Number.isInteger(level) && level >= 1 && level <= 6 ? level : 3;
  }
  get sheet() { return this._enabled('sheet', false); }
  get fullscreen() { return this._bool('fullscreen'); }
  get scrollable() { return this._bool('scrollable'); }
  get persistent() { return this._bool('persistent'); }
  get closeLabel() { return this._attr('close-label', 'Close'); }
  get disabled() { return this._bool('disabled'); }
  set disabled(value) { this.toggleAttribute('disabled', !!value); }
  get hasScrim() {
    const scrim = this.getAttribute('scrim');
    return scrim == null || !['false', '0', 'none', 'off'].includes(String(scrim).toLowerCase());
  }

  get absolute() { return this._bool('absolute'); }
  get contained() { return this._bool('contained'); }
  get contentClass() { return this._attr('content-class', ''); }
  get opacity() { return this._attr('opacity', ''); }
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
  get openDelay() { return this._delay('open-delay'); }
  get closeDelay() { return this._delay('close-delay'); }
  get closeOnContentClick() { return this._enabled('close-on-content-click', false); }
  get closeOnBack() { return this._bool('close-on-back'); }
  // `capture-focus` is Vuetify's newer spelling of the same behaviour.
  get retainFocus() { return this._enabled('retain-focus', this._enabled('capture-focus', true)); }

  _template() {
    if (!this._id) this._id = 'w-dialog-' + Math.random().toString(36).slice(2, 8);
    const titleId = this._id + '-title';
    const bodyId = this._id + '-body';
    const level = this.headingLevel;
    const style = this._dialogStyle();

    return `${this._activatorMarkup()}
      ${this._overlayMarkup()}
      <div class="${this._wrapperClasses()}" id="${this._id}" w-dialog role="dialog" aria-modal="true" aria-hidden="${!this.open}"${this._labelledBy(titleId)}${this._describedBy(bodyId)}${this._wrapperStyle()}>
        <div class="${this._dialogClasses()}" tabindex="-1"${style}>
          <div class="w-dialog-header">
            <h${level} class="w-dialog-title" id="${titleId}">${this._titleContent()}</h${level}>
            ${this._closeMarkup()}
          </div>
          <div class="w-dialog-body" id="${bodyId}" role="document"><slot></slot></div>
          <div class="w-dialog-footer"><slot name="footer"></slot></div>
        </div>
      </div>`;
  }

  _activatorMarkup() {
    return this._hasSlot('activator')
      ? '<span class="w-dialog-activator"><slot name="activator"></slot></span>'
      : '<slot name="activator" hidden></slot>';
  }

  _overlayMarkup() {
    const isOpen = this._cls({ open: this.open });
    const scrim = this._cls({ 'w-overlay--scrim': this.hasScrim });
    const hidden = this.open ? '' : ' hidden';
    return `<div class="w-overlay${isOpen}${scrim}" id="${this._id}-overlay" aria-hidden="true"${hidden}${this._overlayStyle()}></div>`;
  }

  _wrapperClasses() {
    return 'w-dialog-wrapper' + this._cls({
      open: this.open,
      'w-dialog-wrapper--fullscreen': this.fullscreen,
      'w-dialog-wrapper--scrollable': this.scrollable,
      'w-dialog-wrapper--persistent': this.persistent,
      'w-dialog-wrapper--absolute': this.absolute,
      'w-dialog-wrapper--contained': this.contained,
      'w-dialog-wrapper--anchored': this.target,
      'w-dialog-wrapper--stick': this.stickToTarget,
      'w-dialog-wrapper--sheet-mobile': this.sheet,
    }) + this._transitionClass();
  }

  // `transition="none"`/`"false"` drops the animation; any other value selects a
  // named transition defined in dialogs.css.
  _transitionClass() {
    const value = this._token(this.transition);
    if (!value) return '';
    if (['none', 'false'].includes(value)) return ' w-dialog-wrapper--no-transition';
    return ' w-dialog-wrapper--transition-' + value;
  }

  _dialogClasses() {
    return 'w-dialog' + this._cls({
      'w-dialog--fullscreen': this.fullscreen,
      'w-dialog--scrollable': this.scrollable,
      [this.contentClass]: this.contentClass,
    });
  }

  _labelledBy(titleId) {
    const hasTitle = this.dialogTitle || this._hasSlot('title');
    return hasTitle ? ` aria-labelledby="${titleId}"` : '';
  }

  // A host `aria-describedby` wins (empty turns the description off);
  // otherwise the body describes the dialog when it has content.
  _describedBy(bodyId) {
    const own = this.getAttribute('aria-describedby');
    if (own !== null) return own.trim() ? ` aria-describedby="${this._esc(own.trim())}"` : '';
    return this._hasBodyContent() ? ` aria-describedby="${bodyId}"` : '';
  }

  _hasBodyContent() {
    return this._bodyNodes().some((node) => this._isMeaningful(node));
  }

  _bodyNodes() {
    const slot = this._q('.w-dialog-body > slot');
    if (slot) return Array.from(slot.childNodes);
    return Array.from(this.childNodes).filter((node) => !node.getAttribute?.('slot'));
  }

  _isMeaningful(node) {
    if (node.nodeType === Node.ELEMENT_NODE) return true;
    return node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '';
  }

  _titleContent() {
    const titleAttr = this.dialogTitle;
    return titleAttr ? this._esc(titleAttr) + '<slot name="title" hidden></slot>' : '<slot name="title"></slot>';
  }

  _closeMarkup() {
    if (this._bool('hide-close')) return '';
    return `<button class="w-btn w-btn-icon w-btn--sm w-dialog-close" w-dialog-close aria-label="${this._esc(this.closeLabel)}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>`;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'title' && newValue !== null) {
      this._adoptTitle();
      return;
    }
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'open') this._afterOpenAttribute(oldValue);
  }

  // The app removed `open`: undo what opening did, as close() would. close()
  // itself changes the attribute silently and does this on its own.
  _afterOpenAttribute(oldValue) {
    if (!this._closedByAttribute(oldValue)) return;
    this._releaseScrollBlock();
    this._restoreLostFocus();
  }

  _closedByAttribute(oldValue) {
    const wasOpen = oldValue !== null && this._rendered;
    return wasOpen && !this.open && !this._skipRender;
  }

  // Move a host `title` into `heading` so no native tooltip covers the dialog.
  _adoptTitle() {
    const title = this.getAttribute('title');
    if (title === null) return;
    this._silentSet('title', null);
    this.setAttribute('heading', title);
  }

  connectedCallback() {
    this._adoptTitle();
    super.connectedCallback();
    if (!this._keyHandler) {
      this._keyHandler = (event) => this._onDocumentKeydown(event);
      document.addEventListener('keydown', this._keyHandler);
    }
    if (!this.__wPopstate) {
      this.__wPopstate = () => this._onPopState();
      window.addEventListener('popstate', this.__wPopstate);
    }
  }

  _events() {
    this._qAll('[w-dialog-close]').forEach((close) => {
      close.addEventListener('click', () => this.close('action'));
      close.querySelectorAll?.('button, a').forEach((control) => {
        control.addEventListener('click', () => this.close('action'));
      });
    });

    const overlay = this._q('.w-overlay');
    if (overlay) overlay.addEventListener('click', (event) => this._onOutside(event));

    const activator = this._q('.w-dialog-activator');
    if (activator) this._bindActivator(activator);

    const body = this._q('.w-dialog-body');
    if (body && this.closeOnContentClick) body.addEventListener('click', () => this.close('content'));

    const wrapper = this._q('.w-dialog-wrapper');
    if (wrapper) {
      wrapper.addEventListener('click', (event) => {
        if (event.target === wrapper) this._onOutside(event);
      });
      wrapper.addEventListener('keydown', (event) => this._trapFocus(event));
    }

    if (this.open) this._afterOpenRender();
  }

  // Click always activates unless `open-on-click="false"`; hover and focus are
  // opt-in and honour open-delay/close-delay.
  _bindActivator(activator) {
    const controls = [activator, ...activator.querySelectorAll('button, a, w-btn')];
    controls.forEach((control) => {
      control.addEventListener('click', (event) => this._onActivatorClick(event));
    });
    if (this.openOnHover) {
      activator.addEventListener('mouseenter', (event) => this._delayedOpen(event));
      activator.addEventListener('mouseleave', () => this._delayedClose());
    }
    if (this.openOnFocus) {
      activator.addEventListener('focusin', (event) => this._delayedOpen(event));
    }
  }

  _onActivatorClick(event) {
    if (!this.openOnClick) return;
    this._activate(event);
  }

  _delayedOpen(event) {
    this._clearTimer();
    this.__wTimer = setTimeout(() => this._activate(event), this.openDelay);
  }

  _delayedClose() {
    this._clearTimer();
    this.__wTimer = setTimeout(() => this.close('hover'), this.closeDelay);
  }

  _clearTimer() {
    clearTimeout(this.__wTimer);
    this.__wTimer = null;
  }

  _activate(event) {
    if (this.disabled) return;
    this._rememberCursor(event);
    this._opener = event?.target instanceof HTMLElement ? event.target : document.activeElement;
    this.show();
  }

  _rememberCursor(event) {
    if (!event || typeof event.clientX !== 'number') return;
    this.__wCursor = { x: event.clientX, y: event.clientY };
  }

  disconnectedCallback() {
    if (this.open) this._restoreLostFocus();
    if (this._keyHandler) document.removeEventListener('keydown', this._keyHandler);
    if (this.__wPopstate) window.removeEventListener('popstate', this.__wPopstate);
    this.__wPopstate = null;
    this._clearTimer();
    this._releaseScrollBlock();
  }

  close(reason = 'programmatic') {
    if (!this.open) return;
    this._clearTimer();
    this.__wBackGuard = false;
    this._silentSet('open', null);
    this._render();
    this._events();
    this._releaseScrollBlock();
    this._dispatch('toggle', { open: false, reason });
    this._dispatch('close', { open: false, reason });
    this._restoreFocus();
  }

  show() {
    if (this.disabled || this.open) return;
    this._opener = this._opener || document.activeElement;
    this._silentSet('open', '');
    this._render();
    this._events();
    this._blockScroll();
    this._pushBackGuard();
    this._dispatch('toggle', { open: true });
  }

  // close-on-back parks a history entry so the next Back press is consumed by
  // the dialog instead of navigating away.
  _pushBackGuard() {
    if (!this.closeOnBack || this.__wBackGuard) return;
    this.__wBackGuard = true;
    history.pushState({ wDialog: this._id || '' }, '');
  }

  _onPopState() {
    if (!this.__wBackGuard) return;
    this.__wBackGuard = false;
    if (this.persistent) this._animateClick();
    else this.close('back');
  }

  _onOutside(event) {
    if (!this.open) return;
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
    if (!this.retainFocus) return;
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
    this._rememberOpener();
    this._blockScroll();
    this._applyAnchor();
    requestAnimationFrame(() => this._initialFocus()?.focus?.({ preventScroll: true }));
  }

  // A dialog opened through its `open` attribute has no activator event, so
  // the control that holds focus outside the dialog is the one to return to.
  _rememberOpener() {
    if (this._opener) return;
    if (this._outsideSurface(document.activeElement)) this._opener = document.activeElement;
  }

  _outsideSurface(element) {
    if (!(element instanceof HTMLElement) || element === document.body) return false;
    return !this._q('.w-dialog-wrapper')?.contains(element);
  }

  _initialFocus() {
    return this._autofocusTarget()
      || this._focusable('.w-dialog-body')[0]
      || this._focusable()[0]
      || this._q('.w-dialog');
  }

  // `autofocus` may sit on a component host (w-text-field), so the target is
  // the first control inside the marked element.
  _autofocusTarget() {
    const marked = this._q('.w-dialog [autofocus]');
    if (!marked) return null;
    return this._focusable().find((element) => marked.contains(element)) || null;
  }

  // `target` pins the surface to an element, the activating pointer, or a raw
  // x,y pair. `stick-to-target` records page coordinates so the dialog travels
  // with the document instead of the viewport.
  _applyAnchor() {
    const wrapper = this._q('.w-dialog-wrapper');
    const rect = this._targetRect();
    if (!wrapper || !rect) return;
    const scrollX = this.stickToTarget ? window.scrollX : 0;
    const scrollY = this.stickToTarget ? window.scrollY : 0;
    wrapper.style.setProperty('--w-dialog-x', Math.round(rect.left + scrollX) + 'px');
    wrapper.style.setProperty('--w-dialog-y', Math.round(rect.bottom + scrollY) + 'px');
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
    if (target === 'cursor') return this.__wCursor || null;
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

  _focusable(scope = '.w-dialog') {
    const selector = WDialog.FOCUSABLE.map((item) => scope + ' ' + item).join(', ');
    return Array.from(this.querySelectorAll(selector))
      .filter((el) => el instanceof HTMLElement && !el.hidden && el.offsetParent !== null);
  }

  _restoreFocus() {
    const target = this._returnTarget();
    this._opener = null;
    target?.focus({ preventScroll: true });
  }

  // Focus the closed dialog took with it (now on <body>, or still inside the
  // old surface) goes back; focus the app moved somewhere else stays there.
  _restoreLostFocus() {
    if (this._outsideSurface(document.activeElement)) this._opener = null;
    else this._restoreFocus();
  }

  _returnTarget() {
    const id = this.getAttribute('return-focus');
    const named = id ? document.getElementById(id) : null;
    return [named, this._opener].find((element) => element instanceof HTMLElement && element.isConnected) || null;
  }

  _animateClick() {
    if (this.noClickAnimation) return;
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
    if (this.origin) styles.push('transform-origin: ' + this._esc(this.origin.replace(/-/g, ' ')));
    return this._styleAttr(styles);
  }

  _wrapperStyle() {
    const styles = [];
    if (this.zIndex) styles.push('z-index: ' + this._esc(this.zIndex));
    if (this.offset) styles.push('--w-dialog-offset: ' + this._cssSize(this.offset));
    if (this.viewportMargin) styles.push('--w-dialog-viewport-margin: ' + this._cssSize(this.viewportMargin));
    return this._styleAttr(styles);
  }

  _overlayStyle() {
    const styles = [];
    if (this.zIndex) styles.push('z-index: ' + this._esc(this.zIndex));
    if (this.opacity) styles.push('--w-dialog-scrim-opacity: ' + this._cssPercent(this.opacity));
    return this._styleAttr(styles);
  }

  _styleAttr(styles) {
    return styles.length ? ` style="${styles.join('; ')}"` : '';
  }

  _cssLength(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (/^\d+(\.\d+)?$/.test(raw)) return raw + 'px';
    if (/^\d+(\.\d+)?(px|rem|em|vh|vw|dvh|dvw|%)$/.test(raw)) return raw;
    return '';
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
    if (!Number.isFinite(number)) return '56%';
    return (number <= 1 ? number * 100 : number) + '%';
  }

  _enabled(name, fallback) {
    if (!this.hasAttribute(name)) return fallback;
    const value = String(this.getAttribute(name) || '').trim().toLowerCase();
    return !['false', '0', 'off', 'no'].includes(value);
  }

  _delay(name) {
    const value = Number(this.getAttribute(name));
    return Number.isFinite(value) && value > 0 ? value : 0;
  }

  _token(value) {
    return String(value || '').trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
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
