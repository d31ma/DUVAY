/* <w-textarea> — multiline text field, mirroring Vuetify's <v-textarea>.
 *
 * Shares the <w-text-field> control chrome (variants, density, prefix/suffix,
 * inner icons/slots, clearable, counter, loading, hint/error) but wraps a
 * <textarea>, and adds `rows`, `auto-grow`, `max-rows`, and `no-resize`.
 *
 * Attributes:
 *   label, placeholder, value, name
 *   variant         - outlined (default) | filled | underlined | plain | solo
 *   density         - default | comfortable | compact
 *   size            - xs | sm | lg | xl
 *   color           - token color for the focus accent
 *   rows            - initial visible rows (default 4)
 *   auto-grow       - grow to fit content instead of scrolling
 *   max-rows        - cap auto-grow at this many rows
 *   no-resize       - disable the manual resize handle
 *   prefix, suffix  - static text inside the control
 *   prepend-inner-icon / append-inner-icon / icon-set
 *   clearable, counter, loading
 *   hint, persistent-hint, error, hide-details
 *   disabled, readonly, autofocus
 *   required, minlength, maxlength
 *
 * Slots: prepend-inner, append-inner
 * Events: input | change ({ value, name }), clear ({ name })
 */

import WIcons from '../icons.js';

class WTextarea extends WElement {
  static attrs = [
    'label', 'placeholder', 'value', 'name', 'variant', 'density', 'size', 'color',
    'rows', 'auto-grow', 'max-rows', 'no-resize', 'prefix', 'suffix',
    'prepend-inner-icon', 'append-inner-icon', 'icon-set',
    'clearable', 'counter', 'loading', 'hint', 'persistent-hint', 'error',
    'hide-details', 'disabled', 'readonly', 'autofocus',
    'required', 'minlength', 'maxlength',
  ];

  get label()       { return this._attr('label', ''); }
  get placeholder() { return this._attr('placeholder', ''); }
  get value()       { return this._value !== undefined ? this._value : this._attr('value', ''); }
  set value(v)      {
    this._value = v == null ? '' : String(v);
    const ta = this._q('textarea');
    if (ta) ta.value = this._value;
    this._silentSet('value', this._value);
    this._sync();
  }
  get name()        { return this._attr('name', ''); }
  get variant()     { return this._attr('variant', 'outlined'); }
  get density()     { return this._attr('density', 'default'); }
  get size()        { return this._attr('size', ''); }
  get color()       { return this._attr('color', ''); }
  get rows()        { return this._attr('rows', '4'); }
  get autoGrow()    { return this._bool('auto-grow'); }
  get maxRows()     { return this._attr('max-rows', ''); }
  get noResize()    { return this._bool('no-resize'); }
  get prefix()      { return this._attr('prefix', ''); }
  get suffix()      { return this._attr('suffix', ''); }
  get clearable()   { return this._bool('clearable'); }
  get counter()     { return this.hasAttribute('counter'); }
  get loading()     { return this._bool('loading'); }
  get hint()        { return this._attr('hint', ''); }
  get persistentHint() { return this._bool('persistent-hint'); }
  get error()       { return this._attr('error', ''); }
  get hideDetails() { return this._bool('hide-details'); }
  get disabled()    { return this._bool('disabled'); }
  get readonly()    { return this._bool('readonly'); }
  get maxlength()   { return this._attr('maxlength', ''); }
  get prependInnerIcon() { return this._attr('prepend-inner-icon', ''); }
  get appendInnerIcon()  { return this._attr('append-inner-icon', ''); }
  get iconSet()     { return this._attr('icon-set', ''); }

  _icon(name) {
    if (!name) return '';
    const value = this.iconSet ? `${this.iconSet}:${name}` : name;
    return WIcons.resolve(value, { iconClass: 'w-icon w-text-field-icon' });
  }

  _innerHtml(side) {
    const icon = this._icon(side === 'prepend' ? this.prependInnerIcon : this.appendInnerIcon);
    const slotName = side + '-inner';
    if (!icon && !this.querySelector('[slot="' + slotName + '"]')) return '';
    return `<span class="w-text-field-${slotName}">${icon}<slot name="${slotName}"></slot></span>`;
  }

  _template() {
    const cls = [
      'w-text-field', 'w-text-field--textarea',
      'w-text-field--' + this._esc(this.variant),
      'w-text-field--density-' + this._esc(this.density),
      this.size ? 'w-text-field--' + this._esc(this.size) : '',
      this.noResize || this.autoGrow ? 'w-text-field--no-resize' : '',
      this.disabled ? 'w-text-field--disabled' : '',
      this.readonly ? 'w-text-field--readonly' : '',
      this.loading ? 'w-text-field--loading' : '',
      this.error ? 'w-text-field--error' : '',
      this.label ? 'w-text-field--floating' : '',
      this.value !== '' ? 'w-text-field--has-value' : '',
    ].filter(Boolean).join(' ');

    const style = this.color ? ` style="--w-tf-accent:var(--w-${this._esc(this.color)})"` : '';

    const ph = this.placeholder ? ` placeholder="${this._esc(this.placeholder)}"` : (this.label ? ' placeholder=" "' : '');
    const dis = this.disabled ? ' disabled' : '';
    const ro = this.readonly ? ' readonly' : '';
    const af = this._bool('autofocus') ? ' autofocus' : '';
    const nm = this.name ? ` name="${this._esc(this.name)}"` : '';
    const rows = ` rows="${this._esc(this.rows)}"`;
    const aria = !this.label && this.placeholder ? ` aria-label="${this._esc(this.placeholder)}"` : '';
    const invalid = this.error ? ' aria-invalid="true"' : '';

    const textarea = `<textarea class="w-text-field-input w-text-field-textarea"${ph}${dis}${ro}${af}${nm}${rows}${aria}${invalid}${this._validationAttrs(['required', 'minlength', 'maxlength'])} data-w-tf-input>${this._esc(this.value)}</textarea>`;
    const labelEl = this.label ? `<label class="w-text-field-label">${this._esc(this.label)}</label>` : '';

    const prefix = this.prefix ? `<span class="w-text-field-affix w-text-field-prefix">${this._esc(this.prefix)}</span>` : '';
    const suffix = this.suffix ? `<span class="w-text-field-affix w-text-field-suffix">${this._esc(this.suffix)}</span>` : '';
    const clear = this.clearable ? `<button type="button" class="w-text-field-clear" tabindex="-1" aria-label="Clear">&times;</button>` : '';
    const loader = this.loading ? `<span class="w-text-field-loader" aria-hidden="true"></span>` : '';

    return `<div class="${cls}"${style}>
      <div class="w-text-field-control">
        ${this._innerHtml('prepend')}
        ${prefix}
        <span class="w-text-field-field">
          ${textarea}
          ${labelEl}
        </span>
        ${suffix}
        ${clear}
        ${this._innerHtml('append')}
        ${loader}
      </div>
      ${this._detailsHtml()}
    </div>`;
  }

  _detailsHtml() {
    if (this.hideDetails) return '';
    const msg = this.error || this.hint;
    const counterEl = this.counter ? `<span class="w-text-field-counter">${this._counterText()}</span>` : '';
    if (!msg && !counterEl) return '';
    const msgEl = `<span class="w-text-field-messages">${this._esc(msg)}</span>`;
    return `<div class="w-text-field-details">${msgEl}${counterEl}</div>`;
  }

  _counterText() {
    const len = (this.value || '').length;
    return this.maxlength ? `${len} / ${this.maxlength}` : String(len);
  }

  _events() {
    const ta = this._q('textarea');
    if (!ta) return;

    ta.addEventListener('input', (event) => {
      event.stopPropagation();
      this._value = ta.value;
      this._silentSet('value', ta.value);
      this._sync();
      this._emit('input', { value: ta.value, name: this.name });
    });
    ta.addEventListener('change', (event) => {
      event.stopPropagation();
      this._emit('change', { value: ta.value, name: this.name });
    });

    const clearBtn = this._q('.w-text-field-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        ta.value = '';
        this._value = '';
        this._silentSet('value', '');
        this._sync();
        ta.focus();
        this._emit('input', { value: '', name: this.name });
        this._emit('clear', { name: this.name });
      });
    }

    this._sync();
  }

  _sync() {
    const root = this._q('.w-text-field');
    if (root) root.classList.toggle('w-text-field--has-value', (this.value || '') !== '');
    const counter = this._q('.w-text-field-counter');
    if (counter) counter.textContent = this._counterText();
    this._autoGrow();
  }

  // Grow the textarea to fit its content, capped at max-rows.
  _autoGrow() {
    if (!this.autoGrow) return;
    const ta = this._q('textarea');
    if (!ta) return;
    ta.style.height = 'auto';
    let height = ta.scrollHeight;
    if (this.maxRows) {
      const cs = getComputedStyle(ta);
      const line = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5;
      const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      const max = line * Number(this.maxRows) + pad;
      if (height > max) { height = max; ta.style.overflowY = 'auto'; }
      else ta.style.overflowY = 'hidden';
    } else {
      ta.style.overflowY = 'hidden';
    }
    ta.style.height = height + 'px';
  }

  focus() {
    const ta = this._q('textarea');
    if (ta) ta.focus();
  }
}

customElements.define('w-textarea', WTextarea);
