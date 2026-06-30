/* <w-confirm-edit> — DuVay component module */

export class WConfirmEdit extends WElement {
  static attrs = ['value', 'label', 'cancel-text', 'save-text'];
  get value() { return this._attr('value', ''); }
  get label() { return this._attr('label', 'Editable value'); }
  get cancelText() { return this._attr('cancel-text', 'Cancel'); }
  get saveText() { return this._attr('save-text', 'Save'); }
  _template() {
    return `<div class="w-confirm-edit">
      <label class="w-field"><span class="w-label">${this._esc(this.label)}</span><input class="w-input" value="${this._esc(this.value)}"></label>
      <button class="w-btn w-btn-text" type="button" data-cancel>${this._esc(this.cancelText)}</button>
      <button class="w-btn w-btn-filled" type="button" data-save disabled>${this._esc(this.saveText)}</button>
    </div>`;
  }
  _events() {
    const input = this.querySelector('input');
    const save = this.querySelector('[data-save]');
    const syncDirty = () => {
      const dirty = input.value !== this.value;
      save.disabled = !dirty;
      this.classList.toggle('dirty', dirty);
    };
    input?.addEventListener('input', syncDirty);
    this.querySelector('[data-cancel]')?.addEventListener('click', () => {
      input.value = this.value;
      syncDirty();
      this._emit('w-cancel', { value: this.value });
    });
    this.querySelector('[data-save]')?.addEventListener('click', () => {
      this._silentSet('value', input.value);
      syncDirty();
      this._emit('w-save', { value: input.value });
    });
  }
}

if (!customElements.get('w-confirm-edit')) customElements.define('w-confirm-edit', WConfirmEdit);
