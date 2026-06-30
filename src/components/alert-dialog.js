/* <w-alert-dialog> - confirmation dialog */

export class WAlertDialog extends WElement {
  static attrs = ['open', 'title', 'description', 'action', 'cancel', 'destructive'];

  get open() { return this._bool('open'); }
  get title() { return this._attr('title', 'Confirm action'); }
  get description() { return this._attr('description', ''); }
  get action() { return this._attr('action', 'Continue'); }
  get cancel() { return this._attr('cancel', 'Cancel'); }
  get destructive() { return this._bool('destructive'); }

  show() { this._setOpen(true, 'show'); }
  close(reason = 'programmatic') { this._setOpen(false, reason); }

  _template() {
    const hasTrigger = !!this.querySelector('[slot="trigger"]');
    const trigger = hasTrigger
      ? `<span class="w-alert-dialog-trigger"><slot name="trigger"></slot></span>`
      : `<button class="w-btn w-btn-filled w-alert-dialog-trigger" type="button">${this._esc(this.action)}</button>`;
    const dialog = this.open
      ? `<div class="w-overlay open"></div>
        <div class="w-dialog-wrapper open" role="alertdialog" aria-modal="true">
          <div class="w-dialog w-alert-dialog">
            <div class="w-dialog-header"><h3 class="w-dialog-title">${this._esc(this.title)}</h3></div>
            <div class="w-dialog-body">
              ${this.description ? `<p class="w-alert-dialog-description">${this._esc(this.description)}</p>` : ''}
              <slot></slot>
            </div>
            <div class="w-dialog-footer">
              <slot name="footer">
                <button class="w-btn w-btn-text" type="button" data-w-alert-cancel>${this._esc(this.cancel)}</button>
                <button class="w-btn w-btn-filled${this.destructive ? ' w-btn-danger' : ''}" type="button" data-w-alert-action>${this._esc(this.action)}</button>
              </slot>
            </div>
          </div>
        </div>`
      : '';
    return `${trigger}${dialog}`;
  }

  _events() {
    const trigger = this._q('.w-alert-dialog-trigger');
    if (trigger) trigger.addEventListener('click', () => this.show());
    const cancel = this._q('[data-w-alert-cancel]');
    const action = this._q('[data-w-alert-action]');
    if (cancel) cancel.addEventListener('click', () => {
      this._emit('cancel', {});
      this.close('cancel');
    });
    if (action) action.addEventListener('click', () => {
      this.close('action');
    });
  }

  _setOpen(open, reason) {
    this._silentSet('open', open ? '' : null);
    this._render();
    this._events();
    if (!open) this._emit('close', { reason });
  }
}

if (!customElements.get('w-alert-dialog')) {
  customElements.define('w-alert-dialog', WAlertDialog);
}
