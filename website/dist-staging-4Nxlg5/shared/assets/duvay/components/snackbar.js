/* <w-snackbar> — Snackbar / toast notification web component
 *
 * Attributes:
 *   message   - main message text
 *   action    - action button label (omit for no action)
 *   duration  - auto-dismiss time in ms (default: 5000)
 *   open      - if present, the snackbar is visible
 *   inline    - render in normal document flow instead of fixed to viewport
 *
 * Events:
 *   click - native action button click bubbles through the host
 *   close - fires when snackbar is dismissed
 *
 * Usage:
 *   <w-snackbar message="Saved" action="Undo" open></w-snackbar>
 *
 *   Or programmatically:
 *   var s = document.createElement('w-snackbar');
 *   s.message = 'Archived'; s.action = 'Undo';
 *   document.body.appendChild(s); s.show();
 */

class WSnackbar extends WElement {

  static attrs = ['message', 'action', 'duration', 'open', 'inline'];

  get message()  { return this._attr('message', ''); }
  set message(v) { this.setAttribute('message', v); }
  get action()   { return this._attr('action', ''); }
  get duration() { return parseInt(this._attr('duration', '5000'), 10) || 5000; }
  get open()     { return this._bool('open'); }
  set open(v)    { v ? this.setAttribute('open', '') : this.removeAttribute('open'); }
  get inline()   { return this._bool('inline'); }

  connectedCallback() {
    super.connectedCallback();
    if (this.open) {
      this._scheduleDismiss();
    }
  }

  _template() {
    if (!this.open) return '';

    const msg = this.message;
    const act = this.action;
    const closeIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

    const classes = `w-snackbar open${this.inline ? ' w-snackbar--inline' : ''}`;
    let html = `<div class="${classes}" role="status" aria-live="polite">`;
    html += `<span class="w-snackbar-msg">${msg ? this._esc(msg) : '<slot></slot>'}</span>`;

    if (act) {
      html += `<button class="w-snackbar-action" type="button" data-w-snackbar-action>${this._esc(act)}</button>`;
    }

    html += `<button class="w-snackbar-close" type="button" data-w-snackbar-close aria-label="Dismiss">${closeIcon}</button>`;
    html += `</div>`;
    return html;
  }

  _events() {
    if (!this.open) return;

    const actionBtn = this._q('[data-w-snackbar-action]');
    if (actionBtn) {
      actionBtn.addEventListener('click', () => {
        this.close();
      });
    }

    const closeBtn = this._q('[data-w-snackbar-close]');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }
  }

  _scheduleDismiss() {
    if (this._timer) clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      this.close();
    }, this.duration);
  }

  show() {
    this.open = true;
    this._scheduleDismiss();
  }

  close() {
    if (this._timer) clearTimeout(this._timer);
    this.open = false;
    this._emit('close');
  }
}

customElements.define('w-snackbar', WSnackbar);
