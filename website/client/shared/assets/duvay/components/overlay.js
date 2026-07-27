/* <w-overlay> — overlay primitive
 *
 * Attributes:
 *   open, label, disabled            - visibility and the built-in activator
 *   scrim, opacity, z-index          - backdrop
 *   persistent, no-click-animation   - outside/Escape bounce instead of close
 *   contained, absolute, location    - placement inside the viewport
 *   content-class, width, height     - the content surface
 *   transition                       - named enter animation, or false/none
 *   target, origin, offset,
 *   viewport-margin, stick-to-target - connected placement against an element
 *   open-on-click / -hover / -focus  - activator triggers (click defaults on)
 *   open-delay, close-delay          - hover/focus delays in ms
 *   close-on-content-click           - a click inside the content closes it
 *   close-on-back                    - the browser back button dismisses it
 *   retain-focus, capture-focus      - Tab focus trap (both default on)
 *
 * Events: toggle, close
 *
 * The helpers below are the shared overlay surface: <w-bottom-sheet> extends
 * this class outright, and <w-snackbar> / <w-snackbar-queue> import the pieces
 * they need so a prop means the same thing on every surface.
 */

const W_OVERLAY_OFF = ['false', '0', 'off', 'none'];

/* Vuetify-style boolean prop: a bare attribute is true, an explicit falsy
   string is false, and an absent attribute keeps the documented default. */
export function wOverlayFlag(host, name, fallback = false) {
  const value = host.getAttribute(name);
  if (value == null) return fallback;
  return !W_OVERLAY_OFF.includes(String(value).trim().toLowerCase());
}

/* Numeric attribute (milliseconds or pixels) with a fallback. */
export function wOverlayNumber(host, name, fallback = 0) {
  const value = Number.parseFloat(host.getAttribute(name));
  return Number.isFinite(value) ? value : fallback;
}

/* A bare number is pixels; anything else is already a CSS length. */
export function wOverlayLength(value) {
  const raw = String(value ?? '').trim();
  return /^-?\d+(\.\d+)?$/.test(raw) ? raw + 'px' : raw;
}

function wQuerySafe(selector) {
  try {
    return document.querySelector(selector);
  } catch {
    return null;
  }
}

/* `target` accepts "parent", a pair of viewport coordinates, or a selector.
   "cursor" needs a live pointer position, so it resolves to no box. */
export function wTargetBox(host) {
  const raw = String(host.getAttribute('target') || '').trim();
  if (!raw || raw === 'cursor') return null;
  const pair = raw.split(',').map((part) => Number.parseFloat(part));
  if (pair.length === 2 && pair.every((value) => Number.isFinite(value))) {
    return { left: pair[0], top: pair[1], width: 0, height: 0 };
  }
  const element = raw === 'parent' ? host.parentElement : wQuerySafe(raw);
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
}

/* `origin` names the anchor on the target that the content grows from. */
const W_ORIGINS = {
  top: [0.5, 0],
  bottom: [0.5, 1],
  start: [0, 0.5],
  left: [0, 0.5],
  end: [1, 0.5],
  right: [1, 0.5],
  center: [0.5, 0.5],
  overlap: [0.5, 0.5],
  auto: [0.5, 1],
};

export function wOriginAnchor(value) {
  return W_ORIGINS[String(value || 'auto').trim().toLowerCase()] || W_ORIGINS.auto;
}

/* The same anchor expressed as a CSS `transform-origin`. */
export function wOriginPercent(value) {
  const [x, y] = wOriginAnchor(value);
  return `${x * 100}% ${y * 100}%`;
}

/* `offset` is "distance" or "distance, skid". */
export function wOffsetPair(value) {
  const parts = String(value ?? '').split(',').map((part) => Number.parseFloat(part));
  return [
    Number.isFinite(parts[0]) ? parts[0] : 0,
    Number.isFinite(parts[1]) ? parts[1] : 0,
  ];
}

/* Connected placement: pin the content to `target`, honouring origin, offset
   and viewport-margin. `stick-to-target` skips the viewport clamp so the
   content is allowed to travel off-screen with its target. */
export function wConnectedStyles(host) {
  const box = wTargetBox(host);
  if (!box) return [];
  const [fractionX, fractionY] = wOriginAnchor(host.getAttribute('origin'));
  const [distance, skid] = wOffsetPair(host.getAttribute('offset'));
  const margin = wOverlayNumber(host, 'viewport-margin', 0);
  let x = box.left + box.width * fractionX + skid;
  let y = box.top + box.height * fractionY + distance;
  if (!host.hasAttribute('stick-to-target')) {
    x = Math.min(Math.max(x, margin), Math.max(margin, window.innerWidth - margin));
    y = Math.min(Math.max(y, margin), Math.max(margin, window.innerHeight - margin));
  }
  return [`left: ${x}px`, `top: ${y}px`, `transform-origin: ${wOriginPercent(host.getAttribute('origin'))}`];
}

/* `transition` — a named enter animation, or false/none to opt out. */
export function wTransitionClass(value, prefix) {
  const raw = String(value ?? '').trim().toLowerCase();
  if (!raw) return '';
  if (W_OVERLAY_OFF.includes(raw)) return prefix + '--no-transition';
  return prefix + '--transition-' + raw.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function wActivationKey(event) {
  if (event.key !== 'Enter' && event.key !== ' ') return false;
  event.preventDefault();
  return true;
}

/* Activator wiring shared by every overlay surface. `host` must expose
   show() and close(). Click activation is on by default, hover and focus
   are opt-in, and both honour open-delay / close-delay. */
export function wBindActivation(host, activator) {
  if (!activator) return;
  const openDelay = wOverlayNumber(host, 'open-delay', 0);
  const closeDelay = wOverlayNumber(host, 'close-delay', 0);
  const run = (show, delay) => {
    clearTimeout(host.__wActivationTimer);
    if (show === host.open || host.__wSuppressActivation) return;
    const act = () => (show ? host.show() : host.close('activator'));
    if (delay > 0) host.__wActivationTimer = setTimeout(act, delay);
    else act();
  };
  // Opening re-renders the activator, so the detached node must not close what
  // its replacement just opened, and moving into the surface is not leaving.
  const leave = (event) => {
    if (!activator.isConnected) return;
    if (event.relatedTarget instanceof Node && host.contains(event.relatedTarget)) return;
    run(false, closeDelay);
  };

  if (wOverlayFlag(host, 'open-on-click', true)) {
    activator.addEventListener('click', (event) => { event.stopPropagation(); run(true, 0); });
    activator.addEventListener('keydown', (event) => { if (wActivationKey(event)) run(true, 0); });
  }
  if (wOverlayFlag(host, 'open-on-hover', false)) {
    activator.addEventListener('mouseenter', () => run(true, openDelay));
    activator.addEventListener('mouseleave', leave);
  }
  if (wOverlayFlag(host, 'open-on-focus', false)) {
    activator.addEventListener('focusin', () => run(true, openDelay));
    activator.addEventListener('focusout', leave);
  }
}

/* `close-on-back` — the browser back button dismisses the surface instead of
   navigating away. Opening pushes the history entry that back then pops. */
export function wBindCloseOnBack(host) {
  if (host.__wPopstate || !host.hasAttribute('close-on-back')) return;
  host.__wPopstate = () => {
    if (host.open && host.hasAttribute('close-on-back')) host.close('back');
  };
  window.addEventListener('popstate', host.__wPopstate);
}

export function wPushBackState(host) {
  if (!host.hasAttribute('close-on-back') || host.__wBackPushed) return;
  host.__wBackPushed = true;
  history.pushState({ wOverlay: true }, '');
}

export function wUnbindCloseOnBack(host) {
  if (!host.__wPopstate) return;
  window.removeEventListener('popstate', host.__wPopstate);
  host.__wPopstate = null;
}

export function wFocusable(root) {
  if (!root) return [];
  const selector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  return Array.from(root.querySelectorAll(selector)).filter((element) => !element.hidden);
}

/* Keep Tab and Shift+Tab inside `root`. */
export function wTrapFocus(event, root) {
  if (event.key !== 'Tab') return;
  const items = wFocusable(root);
  if (items.length < 2) return;
  const first = items[0];
  const last = items[items.length - 1];
  const backward = event.shiftKey && document.activeElement === first;
  const forward = !event.shiftKey && document.activeElement === last;
  if (!backward && !forward) return;
  event.preventDefault();
  (backward ? last : first).focus();
}

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
    'transition',
    'close-on-back',
    'target',
    'origin',
    'offset',
    'stick-to-target',
    'viewport-margin',
    'open-on-click',
    'open-on-hover',
    'open-on-focus',
    'close-on-content-click',
    'open-delay',
    'close-delay',
    'retain-focus',
    'capture-focus',
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
  get connected() { return !!wTargetBox(this); }
  // Vuetify spells the Tab trap two ways; both default on, either can opt out.
  get retainFocus() {
    return wOverlayFlag(this, 'retain-focus', true) && wOverlayFlag(this, 'capture-focus', true);
  }
  get hasScrim() {
    const scrim = this.getAttribute('scrim');
    return scrim == null || !['false', '0', 'off', 'none'].includes(String(scrim).toLowerCase());
  }

  /* Selector hooks — subclasses keep the shared behaviour with their own
     class names (see <w-bottom-sheet>). */
  _rootSel() { return '.w-overlay'; }
  _contentSel() { return '.w-overlay-content'; }
  _activatorSel() { return '.w-overlay-activator'; }

  _activatorMarkup() {
    const shared = `aria-haspopup="dialog" aria-expanded="${this.open ? 'true' : 'false'}" aria-controls="${this.__wUid}-content"`;
    if (this.querySelector('[slot="activator"]')) {
      return `<span class="w-overlay-activator" role="button" tabindex="${this.disabled ? '-1' : '0'}" ${shared}><slot name="activator"></slot></span>`;
    }
    return `<button class="w-btn w-btn-outlined w-overlay-activator" type="button" ${shared}${this.disabled ? ' disabled' : ''}>${this._esc(this.label)}</button>`;
  }

  _template() {
    const contentClass = ['w-overlay-content', this.contentClass].filter(Boolean).join(' ');

    return `${this._activatorMarkup()}
      <div class="${this._overlayClass()}"${this._overlayStyle()} ${this.open ? '' : 'hidden'} role="presentation">
        ${this.hasScrim ? '<div class="w-overlay-scrim" aria-hidden="true"></div>' : ''}
        <div id="${this.__wUid}-content" class="${this._esc(contentClass)}" role="dialog" aria-modal="${this.contained ? 'false' : 'true'}" tabindex="-1"${this._contentStyle()}>
          <slot></slot>
        </div>
      </div>`;
  }

  _events() {
    const activator = this._q(this._activatorSel());
    if (activator && !this.disabled) wBindActivation(this, activator);

    const overlay = this._q(this._rootSel());
    if (overlay) overlay.addEventListener('click', (event) => this._onRootClick(event, overlay));

    const content = this._q(this._contentSel());
    if (content) this._bindContent(content);

    if (!this.__wOverlayKeydown) {
      this.__wOverlayKeydown = (event) => this._onEscape(event);
      document.addEventListener('keydown', this.__wOverlayKeydown);
    }
    wBindCloseOnBack(this);
  }

  _bindContent(content) {
    content.addEventListener('keydown', (event) => {
      if (this.retainFocus) wTrapFocus(event, content);
    });
    if (wOverlayFlag(this, 'close-on-content-click', false)) {
      content.addEventListener('click', () => this.close('content'));
    }
  }

  _onRootClick(event, overlay) {
    const target = event.target;
    const outside = target === overlay || (target instanceof Element && target.classList.contains('w-overlay-scrim'));
    if (!outside || this.disabled) return;
    if (this.persistent) this._animateClick();
    else this.close('outside');
  }

  _onEscape(event) {
    if (event.key !== 'Escape' || !this.open || this.disabled) return;
    if (this.persistent) this._animateClick();
    else this.close('escape');
  }

  disconnectedCallback() {
    if (this.__wOverlayKeydown) document.removeEventListener('keydown', this.__wOverlayKeydown);
    wUnbindCloseOnBack(this);
    clearTimeout(this.__wActivationTimer);
  }

  show() { this._setOpen(true, 'show'); }
  close(reason = 'programmatic') { this._setOpen(false, reason); }

  // Re-rendering moves focus around (the activator is replaced, the content is
  // focused), so activation triggers are muted for the length of the switch —
  // otherwise open-on-focus would immediately undo itself.
  _setOpen(open, reason) {
    if (open && this.disabled) return;
    if (open === this.open) return;
    this.__wSuppressActivation = true;
    try {
      this._applyOpen(open);
    } finally {
      this.__wSuppressActivation = false;
    }
    this._dispatch('toggle', { open, reason });
    if (!open) this._dispatch('close', { open, reason });
  }

  _applyOpen(open) {
    if (open) this._beforeOpen();
    else this.__wBackPushed = false;
    this._silentSet('open', open || null);
    this._render();
    this._events();
    if (open) this._focusContent();
    else this._returnFocus();
  }

  _beforeOpen() {
    const active = document.activeElement;
    if (active instanceof HTMLElement && this.contains(active)) this.__wReturnFocus = active;
    wPushBackState(this);
  }

  _overlayClass() {
    return [
      'w-overlay',
      this.open ? 'open' : '',
      this.hasScrim ? 'w-overlay--scrim' : '',
      this.persistent ? 'w-overlay--persistent' : '',
      this.contained ? 'w-overlay--contained' : '',
      this.absolute ? 'w-overlay--absolute' : '',
      this.connected ? 'w-overlay--connected' : '',
      wTransitionClass(this.getAttribute('transition'), 'w-overlay'),
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
    styles.push(...this._placement());
    return styles.length ? ` style="${styles.join('; ')}"` : '';
  }

  // Connected placement wins; otherwise `origin` still sets transform-origin
  // so the enter animation grows from the right corner.
  _placement() {
    const connected = wConnectedStyles(this);
    if (connected.length) return connected;
    const origin = this.getAttribute('origin');
    return origin ? [`transform-origin: ${wOriginPercent(origin)}`] : [];
  }

  _focusContent() {
    const content = this._q(this._contentSel());
    if (!content) return;
    (wFocusable(content)[0] || content).focus?.({ preventScroll: true });
  }

  _returnFocus() {
    const target = this.__wReturnFocus;
    this.__wReturnFocus = null;
    if (target && target.isConnected) target.focus?.({ preventScroll: true });
  }

  _animateClick() {
    if (this.noClickAnimation) return;
    const content = this._q(this._contentSel());
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
