/* <w-textarea> — multiline text field, mirroring Vuetify's <v-textarea>.
 *
 * Extends <w-text-field>, so the whole control chrome (variants, density,
 * prefix/suffix, inner + outer icons, clearable, counter, loading, hint/error,
 * messages, validation, and every field-surface modifier documented in
 * text-field.js) is available here. This module only swaps the <input> for a
 * <textarea> and adds `rows`, `auto-grow`, `max-rows`, and `no-resize`.
 *
 * Extra attributes:
 *   rows            - initial visible rows (default 4)
 *   auto-grow       - grow to fit content instead of scrolling
 *   max-rows        - cap auto-grow at this many rows
 *   no-resize       - disable the manual resize handle
 *
 * Slots: prepend-inner, append-inner
 * Events: input | change ({ value, name }), clear ({ name })
 */

import { WTextField } from './text-field.js';

class WTextarea extends WTextField {
  static attrs = ['rows', 'auto-grow', 'max-rows', 'no-resize'];

  get rows()     { return this._attr('rows', '4'); }
  get autoGrow() { return this._bool('auto-grow'); }
  get maxRows()  { return this._attr('max-rows', ''); }
  get noResize() { return this._bool('no-resize'); }

  _controlSelector() { return 'textarea'; }
  _controlClass() { return 'w-text-field-input w-text-field-textarea'; }

  // The value lives in the element's text content rather than a `value`
  // attribute, so `_controlAttrs` is reused verbatim with `rows` added.
  _controlHtml() {
    const map = Object.assign({ rows: this.rows }, this._controlAttrs());
    const validation = this._validationAttrs(['required', 'minlength', 'maxlength']);
    return `<textarea${this._attrs(map)}${validation} w-tf-input>${this._esc(this.value)}</textarea>`;
  }

  _extraClasses() {
    return {
      'w-text-field--textarea': true,
      'w-text-field--no-resize': this.noResize || this.autoGrow,
    };
  }

  _sync() {
    super._sync();
    this._autoGrow();
  }

  // Grow the textarea to fit its content, capped at max-rows.
  _autoGrow() {
    if (!this.autoGrow) return;
    const ta = this._control();
    if (!ta) return;
    ta.style.height = 'auto';
    let height = ta.scrollHeight;
    if (this.maxRows) {
      const max = this._maxHeight(ta);
      if (height > max) { height = max; ta.style.overflowY = 'auto'; }
      else ta.style.overflowY = 'hidden';
    } else {
      ta.style.overflowY = 'hidden';
    }
    ta.style.height = height + 'px';
  }

  _maxHeight(ta) {
    const cs = getComputedStyle(ta);
    const line = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5;
    const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    return line * Number(this.maxRows) + pad;
  }
}

if (!customElements.get('w-textarea')) customElements.define('w-textarea', WTextarea);
