/* <w-confirm-edit> — keep edits local until committed, mirroring Vuetify's
 * <v-confirm-edit>.
 *
 * Wraps an editor and a Cancel / OK action pair. Edits stay on a temporary copy
 * of `value`; OK commits and emits `save`, Cancel reverts and emits `cancel`.
 * OK is disabled while the edit is pristine (unchanged).
 *
 * The editor can be:
 *   - slotted content (any control exposing `.value`, e.g. <w-text-field>,
 *     <w-textarea>, <w-select>, or a native input), or
 *   - omitted, in which case a built-in <input> is rendered from `label` /
 *     `placeholder` (the zero-config case).
 *
 * Attributes:
 *   value         - the committed value (reflected; also a property)
 *   label         - label for the built-in editor
 *   placeholder   - placeholder for the built-in editor
 *   cancel-text   - Cancel button label (default "Cancel")
 *   ok-text       - OK button label (default "Save"); `save-text` is an alias
 *   disabled      - disable the actions (and the built-in editor)
 *   hide-actions  - don't render the built-in action buttons
 *
 * Slots:
 *   default       - a custom editor control bound to `value`
 *   actions       - custom action buttons; mark them data-save / data-cancel
 *
 * Events:
 *   save    - { value }  committed value (also fires `change` for compatibility)
 *   cancel  - { value }  reverted value
 *
 * Methods: save(), cancel()
 */

export class WConfirmEdit extends WElement {
  static attrs = ['value', 'label', 'placeholder', 'cancel-text', 'ok-text', 'save-text', 'disabled', 'hide-actions'];

  get value()      { return this._attr('value', ''); }
  set value(v)     { this.setAttribute('value', v == null ? '' : String(v)); }
  get label()      { return this._attr('label', 'Editable value'); }
  get placeholder(){ return this._attr('placeholder', ''); }
  get cancelText() { return this._attr('cancel-text', 'Cancel'); }
  get okText()     { return this._attr('save-text', '') || this._attr('ok-text', 'Save'); }
  get disabled()   { return this._bool('disabled'); }
  get hideActions(){ return this._bool('hide-actions'); }

  // Whether the author supplied their own editor / action buttons. Resolved on
  // the first _template() call, while the authored children are still in place.
  get _useBuiltIn() {
    if (this._builtInCached === undefined) {
      this._builtInCached = !Array.from(this.children)
        .some((el) => !el.hasAttribute('slot') && el.tagName.toLowerCase() !== 'slot');
    }
    return this._builtInCached;
  }
  get _customActions() {
    if (this._actionsCached === undefined) {
      this._actionsCached = !!this.querySelector('[slot="actions"]');
    }
    return this._actionsCached;
  }

  _template() {
    const dis = this.disabled ? ' disabled' : '';
    const body = this._useBuiltIn
      ? `<label class="w-field"><span class="w-label">${this._esc(this.label)}</span>`
        + `<input class="w-input" data-confirm-field value="${this._esc(this.value)}"`
        + `${this.placeholder ? ` placeholder="${this._esc(this.placeholder)}"` : ''}${dis}></label>`
      : `<slot></slot>`;

    let actions = '';
    if (this._customActions) {
      actions = `<div class="w-confirm-edit-actions"><slot name="actions"></slot></div>`;
    } else if (!this.hideActions) {
      actions = `<div class="w-confirm-edit-actions">`
        + `<button class="w-btn w-btn-text" type="button" data-cancel${dis}>${this._esc(this.cancelText)}</button>`
        + `<button class="w-btn w-btn-filled" type="button" data-save disabled>${this._esc(this.okText)}</button>`
        + `</div>`;
    }

    return `<div class="w-confirm-edit">
      <div class="w-confirm-edit-body">${body}</div>
      ${actions}
    </div>`;
  }

  _events() {
    // Seed the temporary copy from `value` and mirror it into the editor.
    this._original = this.value;
    if (this.hasAttribute('value')) this._setVal(this.value);
    this._syncDirty();

    // Delegated so it works for built-in and slotted editors/buttons alike.
    this.addEventListener('input', () => this._syncDirty());
    this.addEventListener('click', (event) => {
      if (event.target.closest('[data-save]')) { event.preventDefault(); this.save(); }
      else if (event.target.closest('[data-cancel]')) { event.preventDefault(); this.cancel(); }
    });
    // Don't leak the editor's own change event past the wrapper.
    this.addEventListener('change', (event) => {
      if (event.target.closest('[data-save],[data-cancel]')) return;
      event.stopPropagation();
    });
  }

  _editor() {
    return this.querySelector('[data-confirm-field]')
      || this.querySelector('w-text-field, w-input, w-textarea, w-select, w-number-input, w-autocomplete, w-combobox')
      || this.querySelector('input, textarea, select');
  }

  _getVal() { const el = this._editor(); return el ? (el.value ?? '') : ''; }
  _setVal(v) { const el = this._editor(); if (el) el.value = v; }

  get pristine() { return this._getVal() === this._original; }

  _syncDirty() {
    const dirty = !this.pristine;
    const save = this.querySelector('[data-save]');
    if (save) save.disabled = this.disabled || !dirty;
    this.classList.toggle('dirty', dirty);
  }

  save() {
    if (this.disabled) return;
    this._original = this._getVal();
    this._silentSet('value', this._original);
    this._syncDirty();
    this._emit('save', { value: this._original });
    this._emit('change', { value: this._original });
  }

  cancel() {
    this._setVal(this._original);
    this._syncDirty();
    this._emit('cancel', { value: this._original });
  }
}

if (!customElements.get('w-confirm-edit')) customElements.define('w-confirm-edit', WConfirmEdit);
