/* <w-popover> - clickable floating content */

export class WPopover extends WElement {
  static attrs = ['open', 'label', 'side', 'inline'];

  get open() { return this._bool('open'); }
  get label() { return this._attr('label', 'Open'); }
  get side() { return this._attr('side', 'bottom-start'); }
  get inline() { return this._bool('inline'); }

  _template() {
    const hasTrigger = !!this.querySelector('[slot="trigger"]');
    const trigger = hasTrigger
      ? `<span class="w-popover-trigger" role="button" tabindex="0" aria-expanded="${this.open}"><slot name="trigger"></slot></span>`
      : `<button class="w-btn w-btn-outlined w-popover-trigger" type="button" aria-expanded="${this.open}">${this._esc(this.label)}</button>`;

    const classes = [
      'w-popover',
      `w-popover--${this.side}`,
      this.open ? 'open' : '',
      this.inline ? 'w-popover--inline' : '',
    ].filter(Boolean).map((name) => this._esc(name)).join(' ');

    return `<span class="${classes}">
      ${trigger}
      <span class="w-popover-content" role="dialog"><slot></slot></span>
    </span>`;
  }

  _events() {
    const trigger = this._q('.w-popover-trigger');
    if (!trigger) return;
    const toggle = () => this._setOpen(!this.open);
    trigger.addEventListener('click', toggle);
    trigger.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      toggle();
    });
  }

  _setOpen(open) {
    this._silentSet('open', open ? '' : null);
    this._render();
    this._events();
    this._emit(open ? 'toggle' : 'close', {});
  }
}

if (!customElements.get('w-popover')) {
  customElements.define('w-popover', WPopover);
}
