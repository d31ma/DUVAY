/* <w-hover-card> - hover and focus preview */

export class WHoverCard extends WElement {
  static attrs = ['open', 'side', 'inline'];

  get open() { return this._bool('open'); }
  get side() { return this._attr('side', 'top'); }
  get inline() { return this._bool('inline'); }

  _template() {
    const classes = [
      'w-hover-card',
      `w-hover-card--${this.side}`,
      this.open ? 'open' : '',
      this.inline ? 'w-hover-card--inline' : '',
    ].filter(Boolean).map((name) => this._esc(name)).join(' ');

    return `<span class="${classes}">
      <span class="w-hover-card-trigger" tabindex="0"><slot></slot></span>
      <span class="w-hover-card-content" role="tooltip"><slot name="content"></slot></span>
    </span>`;
  }

  _events() {
    const trigger = this._q('.w-hover-card-trigger');
    if (!trigger) return;
    trigger.addEventListener('mouseenter', () => this._setOpen(true));
    trigger.addEventListener('mouseleave', () => this._setOpen(false));
    trigger.addEventListener('focusin', () => this._setOpen(true));
    trigger.addEventListener('focusout', () => this._setOpen(false));
    if (!this.__wHoverCardFocusEvents) {
      this.__wHoverCardFocusEvents = true;
      this.addEventListener('focusin', () => this._setOpen(true));
      this.addEventListener('focusout', () => this._setOpen(false));
    }
  }

  _setOpen(open) {
    if (open === this.open) return;
    this._silentSet('open', open ? '' : null);
    this._render();
    this._events();
  }
}

if (!customElements.get('w-hover-card')) {
  customElements.define('w-hover-card', WHoverCard);
}
