/* <w-snackbar> — Snackbar / toast notification (Vuetify v-snackbar parity)
 *
 * Attributes:
 *   text / message - message text (or use the default slot)
 *   title          - bold headline above the message
 *   action         - single action button label
 *   open           - visibility (alias: model-value)
 *   model-value    - Vuetify visibility alias
 *   timeout        - auto-dismiss ms; -1 keeps it open (alias: duration, default 5000)
 *   color          - token color for the surface
 *   variant        - flat | elevated | tonal | outlined | text
 *   location       - "top" | "bottom" + "start" | "center" | "end" (e.g. "top end")
 *   multi-line     - taller layout for longer messages
 *   vertical       - stack the actions below the text
 *   rounded        - pill / lg rounding
 *   timer          - show a countdown bar (boolean or a token color)
 *   timer-color    - explicit countdown bar color
 *   reverse-timer  - the countdown bar fills up instead of depleting
 *   inline         - render in normal flow instead of fixed to the viewport
 *   absolute       - position: absolute instead of fixed
 *   contained      - stay inside the nearest positioned ancestor
 *   content-class  - extra class names on the surface
 *   opacity        - surface opacity
 *   z-index        - stacking order
 *   closable       - show the dismiss button (default on)
 *   close-text     - dismiss button label
 *   prepend-icon   - leading icon glyph
 *   prepend-avatar - leading avatar image URL or initials
 *   queue-index    - position in a stack, offsets the snackbar by queue-gap
 *   queue-gap      - pixels between stacked snackbars
 *   collapsed      - JSON {"width","height"} for a snackbar sitting behind another
 *   transition     - named enter animation, or false/none
 *   target, origin - pin the snackbar to an element instead of a viewport edge
 *   close-on-back  - the browser back button dismisses it
 *   open-on-click / -hover / -focus, open-delay, close-delay
 *                  - activator triggers, used with the `activator` slot
 *   close-on-content-click - clicking the message dismisses it
 *
 * Slots:
 *   activator - opens the snackbar
 *   default   - message content
 *   actions   - custom action buttons (replaces the action label)
 *
 * Events:
 *   update:model-value, close
 *
 * Programmatic:
 *   const s = document.createElement('w-snackbar');
 *   s.message = 'Archived'; s.action = 'Undo';
 *   document.body.appendChild(s); s.show();
 */

import {
  wBindActivation,
  wBindCloseOnBack,
  wConnectedStyles,
  wOriginPercent,
  wOverlayFlag,
  wOverlayLength,
  wPushBackState,
  wTransitionClass,
  wUnbindCloseOnBack,
} from './overlay.js';

class WSnackbar extends WElement {

  static attrs = [
    'message', 'text', 'title', 'action', 'duration', 'timeout', 'open', 'model-value',
    'inline', 'color', 'variant', 'location', 'multi-line', 'vertical', 'rounded',
    'timer', 'timer-color', 'reverse-timer', 'closable', 'close-text',
    'absolute', 'contained', 'content-class', 'opacity', 'z-index',
    'prepend-icon', 'prepend-avatar', 'queue-index', 'queue-gap', 'collapsed',
    'transition', 'origin', 'target', 'close-on-back',
    'open-on-click', 'open-on-hover', 'open-on-focus', 'close-on-content-click',
    'open-delay', 'close-delay',
  ];
  static variants = ['flat', 'elevated', 'tonal', 'outlined', 'text'];
  static tokens = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info'];

  get message()   { return this._attr('text', '') || this._attr('message', ''); }
  set message(v)  { this.setAttribute('message', v); }
  get barTitle()  { return this._attr('title', ''); }
  get action()    { return this._attr('action', ''); }
  get duration()  {
    const raw = this.hasAttribute('timeout') ? this._attr('timeout', '5000') : this._attr('duration', '5000');
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : 5000;
  }
  get open()      { return this._bool('open') || this._truthy('model-value'); }
  set open(v)     { v ? this.setAttribute('open', '') : this.removeAttribute('open'); }
  get inline()    { return this._bool('inline'); }
  get variant()   { const v = this._attr('variant', ''); return this.constructor.variants.includes(v) ? v : ''; }
  get multiLine() { return this._bool('multi-line'); }
  get vertical()  { return this._bool('vertical'); }
  get closable()  { return wOverlayFlag(this, 'closable', true); }

  connectedCallback() {
    super.connectedCallback();
    if (!this.open) return;
    this._scheduleDismiss();
    wPushBackState(this);
  }

  disconnectedCallback() {
    if (this._timer) clearTimeout(this._timer);
    wUnbindCloseOnBack(this);
  }

  _template() {
    const activator = this._activatorMarkup();
    if (!this.open) return activator ? activator + '<span hidden><slot></slot><slot name="actions"></slot></span>' : '';

    let html = `${activator}<div class="${this._esc(this._barClass())}" role="status" aria-live="polite"${this._barStyle()}>`;
    html += `<div class="w-snackbar-content">${this._prependMarkup()}${this._titleMarkup()}<span class="w-snackbar-msg">${this._messageMarkup()}</span></div>`;
    html += `<div class="w-snackbar-actions">${this._actionsMarkup()}${this._closeMarkup()}</div>`;
    html += this._timerMarkup();
    return html + `</div>`;
  }

  _activatorMarkup() {
    if (!this._hasSlot('activator')) return '';
    return `<span class="w-snackbar-activator" role="button" tabindex="0" aria-haspopup="true" aria-expanded="${this.open ? 'true' : 'false'}"><slot name="activator"></slot></span>`;
  }

  _messageMarkup() {
    const msg = this.message;
    return msg ? this._esc(msg) : '<slot></slot>';
  }

  _titleMarkup() {
    const title = this.barTitle;
    return title ? `<div class="w-snackbar-title">${this._esc(title)}</div>` : '';
  }

  // An avatar wins over an icon in the prepend area, matching <w-list-item>.
  _prependMarkup() {
    const avatar = this._attr('prepend-avatar', '');
    if (avatar) {
      return `<span class="w-avatar w-avatar-sm w-snackbar-avatar" role="img" aria-label="Avatar"><img class="w-avatar-image" src="${this._esc(avatar)}" alt=""></span>`;
    }
    const icon = this._attr('prepend-icon', '');
    return icon ? `<span class="w-snackbar-icon" aria-hidden="true">${this._esc(icon)}</span>` : '';
  }

  _actionsMarkup() {
    if (this._hasSlot('actions')) return '<slot name="actions"></slot>';
    if (!this.action) return '';
    return `<button class="w-snackbar-action" type="button" w-snackbar-action>${this._esc(this.action)}</button>`;
  }

  _closeMarkup() {
    if (!this.closable) return '';
    const label = this._attr('close-text', 'Dismiss');
    const icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    return `<button class="w-snackbar-close" type="button" w-snackbar-close aria-label="${this._esc(label)}">${icon}</button>`;
  }

  _timerMarkup() {
    if (!this.hasAttribute('timer') || this.duration <= 0) return '';
    const reverse = this._cls({ 'w-snackbar-timer--reverse': this.hasAttribute('reverse-timer') });
    return `<div class="w-snackbar-timer${reverse}" style="animation-duration:${this.duration}ms${this._timerColor()}"></div>`;
  }

  _events() {
    wBindCloseOnBack(this);
    wBindActivation(this, this._q('.w-snackbar-activator'));
    if (!this.open) return;
    const action = this._q('[w-snackbar-action]');
    if (action) action.addEventListener('click', () => this.close());
    const close = this._q('[w-snackbar-close]');
    if (close) close.addEventListener('click', () => this.close());
    const content = this._q('.w-snackbar-content');
    if (content && wOverlayFlag(this, 'close-on-content-click', false)) {
      content.addEventListener('click', () => this.close());
    }
  }

  _location() {
    const parts = String(this._attr('location', 'bottom')).toLowerCase().split(/[\s-]+/);
    const y = parts.includes('top') ? 'top' : 'bottom';
    const x = parts.includes('start') || parts.includes('left') ? 'start'
      : parts.includes('end') || parts.includes('right') ? 'end' : 'center';
    return { y, x };
  }

  _barClass() {
    const loc = this._location();
    return `w-snackbar open w-snackbar--${loc.y} w-snackbar--${loc.x}` + this._cls({
      'w-snackbar--inline': this.inline,
      'w-snackbar--multi-line': this.multiLine,
      'w-snackbar--vertical': this.vertical,
      'w-snackbar--rounded': this.hasAttribute('rounded'),
      'w-snackbar--absolute': this._bool('absolute'),
      'w-snackbar--contained': this._bool('contained'),
      'w-snackbar--collapsed': this.hasAttribute('collapsed'),
      'w-snackbar--connected': this.hasAttribute('target'),
      ['w-snackbar--' + this.variant]: this.variant,
      [wTransitionClass(this.getAttribute('transition'), 'w-snackbar')]: true,
      [this._attr('content-class', '')]: true,
    });
  }

  _barStyle() {
    const styles = this._surfaceDecls()
      .concat(this._queueDecls(), this._collapsedDecls(), this._placementDecls());
    const opacity = this.getAttribute('opacity');
    const zIndex = this.getAttribute('z-index');
    if (opacity) styles.push('opacity: ' + this._esc(opacity));
    if (zIndex) styles.push('z-index: ' + this._esc(zIndex));
    return styles.length ? ` style="${styles.join('; ')}"` : '';
  }

  _surfaceDecls() {
    const raw = this._attr('color', '');
    const token = String(raw).trim().toLowerCase();
    if (!token) return [];
    if (!this.constructor.tokens.includes(token)) return [`--w-snackbar-bg: ${this._esc(raw)}`];
    const name = token === 'info' ? 'primary' : token;
    return [
      `--w-snackbar-bg: var(--w-${name}-container)`,
      `--w-snackbar-fg: var(--w-on-${name}-container)`,
      `--w-snackbar-action: var(--w-${name})`,
    ];
  }

  // A stacked snackbar sits `queue-index * queue-gap` away from the edge.
  _queueDecls() {
    const decls = [];
    const index = this.getAttribute('queue-index');
    const gap = this.getAttribute('queue-gap');
    if (index) decls.push('--w-snackbar-queue-index: ' + this._esc(index));
    if (gap) decls.push('--w-snackbar-queue-gap: ' + wOverlayLength(gap));
    return decls;
  }

  // `collapsed` carries the size a snackbar shrinks to behind the front one.
  _collapsedDecls() {
    const size = this._collapsedSize();
    const decls = [];
    if (size.width) decls.push('--w-snackbar-collapsed-width: ' + wOverlayLength(size.width));
    if (size.height) decls.push('--w-snackbar-collapsed-height: ' + wOverlayLength(size.height));
    return decls;
  }

  _collapsedSize() {
    const raw = String(this._attr('collapsed', '')).trim();
    if (!raw.startsWith('{')) return {};
    try {
      return JSON.parse(raw) || {};
    } catch {
      return {};
    }
  }

  _placementDecls() {
    const connected = wConnectedStyles(this);
    if (connected.length) return connected;
    const origin = this.getAttribute('origin');
    return origin ? [`transform-origin: ${wOriginPercent(origin)}`] : [];
  }

  _timerColor() {
    const raw = this._attr('timer-color', '') || this._attr('timer', '');
    const key = String(raw).trim().toLowerCase();
    if (!key || key === 'true') return '';
    const named = this.constructor.tokens.includes(key);
    const token = key === 'info' ? 'primary' : key;
    return `;background:${this._esc(named ? `var(--w-${token})` : raw)}`;
  }

  _scheduleDismiss() {
    if (this._timer) clearTimeout(this._timer);
    if (this.duration < 0) return; // -1 keeps it open until dismissed
    this._timer = setTimeout(() => this.close(), this.duration);
  }

  _truthy(name) {
    if (!this.hasAttribute(name)) return false;
    return !['false', '0', 'null'].includes(String(this.getAttribute(name)).toLowerCase());
  }

  _hasSlot(name) { return !!this.querySelector('[slot="' + name + '"]'); }

  show() {
    this.open = true;
    wPushBackState(this);
    this._scheduleDismiss();
  }

  close() {
    if (this._timer) clearTimeout(this._timer);
    this.__wBackPushed = false;
    this.open = false;
    if (this.hasAttribute('model-value')) this._silentSet('model-value', 'false');
    this._emit('update:model-value', false);
    this._emit('close');
  }
}

customElements.define('w-snackbar', WSnackbar);
