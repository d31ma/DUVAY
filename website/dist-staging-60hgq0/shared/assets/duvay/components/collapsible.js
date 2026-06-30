/* <w-collapsible> - disclosure panel */

export class WCollapsible extends WElement {
  static attrs = ['open', 'header', 'disabled'];

  get open() { return this._bool('open'); }
  get header() { return this._attr('header', 'Details'); }
  get disabled() { return this._bool('disabled'); }

  _template() {
    return `<div class="w-collapsible${this.open ? ' open' : ''}">
      <button class="w-collapsible-trigger" type="button" aria-expanded="${this.open}"${this.disabled ? ' disabled' : ''}>
        <span>${this._esc(this.header)}</span>
        <svg class="w-collapsible-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="w-collapsible-content"${this.open ? '' : ' hidden'}><slot></slot></div>
    </div>`;
  }

  _events() {
    const trigger = this._q('.w-collapsible-trigger');
    if (!trigger || this.disabled) return;
    trigger.addEventListener('click', () => {
      const open = !this.open;
      this._silentSet('open', open ? '' : null);
      this._render();
      this._events();
      this._emit('w-toggle', { open });
    });
  }
}

if (!customElements.get('w-collapsible')) {
  customElements.define('w-collapsible', WCollapsible);
}
