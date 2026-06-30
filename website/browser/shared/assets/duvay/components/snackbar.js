/* <w-snackbar> — Snackbar / toast notification (Vuetify v-snackbar parity)
 *
 * Attributes:
 *   text / message - message text (or use the default slot)
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
 *   inline         - render in normal flow instead of fixed to the viewport
 *
 * Slots:
 *   default - message content
 *   actions - custom action buttons (replaces the action label)
 *
 * Events:
 *   update:model-value, close
 *
 * Programmatic:
 *   const s = document.createElement('w-snackbar');
 *   s.message = 'Archived'; s.action = 'Undo';
 *   document.body.appendChild(s); s.show();
 */

class WSnackbar extends WElement {

  static attrs = ['message', 'text', 'action', 'duration', 'timeout', 'open', 'model-value', 'inline', 'color', 'variant', 'location', 'multi-line', 'vertical', 'rounded', 'timer'];
  static variants = ['flat', 'elevated', 'tonal', 'outlined', 'text'];
  static tokens = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info'];

  get message()   { return this._attr('text', '') || this._attr('message', ''); }
  set message(v)  { this.setAttribute('message', v); }
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

  connectedCallback() {
    super.connectedCallback();
    if (this.open) this._scheduleDismiss();
  }

  _template() {
    if (!this.open) return '';

    const loc = this._location();
    const classes = [
      'w-snackbar', 'open',
      this.inline ? 'w-snackbar--inline' : '',
      'w-snackbar--' + loc.y,
      'w-snackbar--' + loc.x,
      this.multiLine ? 'w-snackbar--multi-line' : '',
      this.vertical ? 'w-snackbar--vertical' : '',
      this.hasAttribute('rounded') ? 'w-snackbar--rounded' : '',
      this.variant ? 'w-snackbar--' + this.variant : '',
    ].filter(Boolean).join(' ');

    const closeIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

    const msg = this.message;
    const actions = this._hasSlot('actions')
      ? '<slot name="actions"></slot>'
      : this.action
        ? `<button class="w-snackbar-action" type="button" data-w-snackbar-action>${this._esc(this.action)}</button>`
        : '';

    let html = `<div class="${classes}" role="status" aria-live="polite"${this._surfaceStyle()}>`;
    html += `<div class="w-snackbar-content"><span class="w-snackbar-msg">${msg ? this._esc(msg) : '<slot></slot>'}</span></div>`;
    html += `<div class="w-snackbar-actions">${actions}<button class="w-snackbar-close" type="button" data-w-snackbar-close aria-label="Dismiss">${closeIcon}</button></div>`;
    if (this.hasAttribute('timer') && this.duration > 0) {
      html += `<div class="w-snackbar-timer" style="animation-duration:${this.duration}ms${this._timerColor()}"></div>`;
    }
    html += `</div>`;
    return html;
  }

  _events() {
    if (!this.open) return;
    const action = this._q('[data-w-snackbar-action]');
    if (action) action.addEventListener('click', () => this.close());
    const close = this._q('[data-w-snackbar-close]');
    if (close) close.addEventListener('click', () => this.close());
  }

  _location() {
    const parts = String(this._attr('location', 'bottom')).toLowerCase().split(/[\s-]+/);
    const y = parts.includes('top') ? 'top' : 'bottom';
    const x = parts.includes('start') || parts.includes('left') ? 'start'
      : parts.includes('end') || parts.includes('right') ? 'end' : 'center';
    return { y, x };
  }

  _surfaceStyle() {
    const t = String(this._attr('color', '')).trim().toLowerCase();
    if (!t) return '';
    if (this.constructor.tokens.includes(t)) {
      const n = t === 'info' ? 'primary' : t;
      return ` style="--w-snackbar-bg: var(--w-${n}-container); --w-snackbar-fg: var(--w-on-${n}-container); --w-snackbar-action: var(--w-${n})"`;
    }
    return ` style="--w-snackbar-bg: ${this._esc(this._attr('color', ''))}"`;
  }

  _timerColor() {
    const t = String(this._attr('timer', '')).trim().toLowerCase();
    if (!t || t === 'true' || t === '') return '';
    const c = this.constructor.tokens.includes(t) ? `var(--w-${t === 'info' ? 'primary' : t})` : this._attr('timer', '');
    return `;background:${this._esc(c)}`;
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

  show() { this.open = true; this._scheduleDismiss(); }

  close() {
    if (this._timer) clearTimeout(this._timer);
    this.open = false;
    if (this.hasAttribute('model-value')) this._silentSet('model-value', 'false');
    this._emit('update:model-value', false);
    this._emit('close');
  }
}

customElements.define('w-snackbar', WSnackbar);
