/* <w-text-field> — full single-line text field, mirroring Vuetify's
 * <v-text-field>.
 *
 * A standalone control (not the thin <w-input>): floating label, the outlined /
 * filled / underlined / plain / solo variants, density, prefix/suffix,
 * prepend-inner / append-inner slots, clearable, character counter, loading
 * bar, hint / error messages, and the native HTML5 validation attributes.
 *
 * Attributes:
 *   type            - native input type (text, email, password, search, …)
 *   label           - floating label
 *   placeholder     - placeholder text
 *   value           - input value (reflected; also a property)
 *   name            - form field name
 *   variant         - outlined (default) | filled | underlined | plain | solo
 *   density         - default | comfortable | compact
 *   size            - xs | sm | lg | xl (omit for the default)
 *   color           - token color for the focus accent (e.g. "success")
 *   prefix, suffix  - static text inside the control, before / after the input
 *   clearable       - show a clear (×) button when non-empty
 *   counter         - show a character counter; pairs with maxlength
 *   loading         - show an indeterminate bar along the bottom edge
 *   hint            - helper text below the control
 *   persistent-hint - keep the hint visible even when not focused
 *   error           - error text; tints the control and replaces the hint
 *   rounded         - pill-rounded control
 *   single-line     - no floating label; label is used as the placeholder
 *   hide-details    - suppress the details row (hint / error / counter)
 *   disabled, readonly, autofocus
 *   required, pattern, minlength, maxlength, min, max, step
 *
 * Slots:
 *   prepend-inner   - content (e.g. an icon) inside the control, leading
 *   append-inner    - content inside the control, trailing
 *
 * Events:
 *   input   - on each keystroke (detail: { value, name })
 *   change  - on commit (detail: { value, name })
 *   clear   - when cleared via the clear button (detail: { name })
 *   prepend-inner-icon / append-inner-icon
 *                   - icon names resolved through the icon registry, rendered
 *                     inside the control (alternative to the inner slots)
 *   icon-set        - icon set prefix for the *-icon attributes
 */

import WIcons from '../icons.js';

class WTextField extends WElement {
  static attrs = [
    'type', 'label', 'placeholder', 'value', 'name', 'variant', 'density', 'size',
    'color', 'prefix', 'suffix', 'clearable', 'counter', 'loading', 'hint',
    'persistent-hint', 'error', 'rounded', 'single-line', 'hide-details',
    'prepend-inner-icon', 'append-inner-icon', 'icon-set',
    'disabled', 'readonly', 'autofocus',
    'required', 'pattern', 'minlength', 'maxlength', 'min', 'max', 'step',
  ];

  get type()        { return this._attr('type', 'text'); }
  get label()       { return this._attr('label', ''); }
  get placeholder() { return this._attr('placeholder', ''); }
  get value()       { return this._value !== undefined ? this._value : this._attr('value', ''); }
  set value(v)      {
    this._value = v == null ? '' : String(v);
    const input = this._q('input');
    if (input) input.value = this._value;
    this._silentSet('value', this._value);
    this._sync();
  }
  get name()        { return this._attr('name', ''); }
  get variant()     { return this._attr('variant', 'outlined'); }
  get density()     { return this._attr('density', 'default'); }
  get size()        { return this._attr('size', ''); }
  get color()       { return this._attr('color', ''); }
  get prefix()      { return this._attr('prefix', ''); }
  get suffix()      { return this._attr('suffix', ''); }
  get clearable()   { return this._bool('clearable'); }
  get counter()     { return this.hasAttribute('counter'); }
  get loading()     { return this._bool('loading'); }
  get hint()        { return this._attr('hint', ''); }
  get persistentHint() { return this._bool('persistent-hint'); }
  get error()       { return this._attr('error', ''); }
  get rounded()     { return this._bool('rounded'); }
  get singleLine()  { return this._bool('single-line'); }
  get hideDetails() { return this._bool('hide-details'); }
  get disabled()    { return this._bool('disabled'); }
  get readonly()    { return this._bool('readonly'); }
  get maxlength()   { return this._attr('maxlength', ''); }
  get prependInnerIcon() { return this._attr('prepend-inner-icon', ''); }
  get appendInnerIcon()  { return this._attr('append-inner-icon', ''); }
  get iconSet()     { return this._attr('icon-set', ''); }

  // Resolve an icon name through the registry, honouring an optional icon-set.
  _icon(name) {
    if (!name) return '';
    const value = this.iconSet ? `${this.iconSet}:${name}` : name;
    return WIcons.resolve(value, { iconClass: 'w-icon w-text-field-icon' });
  }

  // Render an inner adornment only when there's an icon or slotted content, so
  // an unused slot doesn't add a stray flex gap beside the input.
  _innerHtml(side) {
    const icon = this._icon(side === 'prepend' ? this.prependInnerIcon : this.appendInnerIcon);
    const slotName = side + '-inner';
    const hasSlotted = !!this.querySelector('[slot="' + slotName + '"]');
    if (!icon && !hasSlotted) return '';
    return `<span class="w-text-field-${slotName}">${icon}<slot name="${slotName}"></slot></span>`;
  }

  // No floating label when single-line, solo, or simply unlabelled.
  get _floating()   { return !!this.label && !this.singleLine && this.variant !== 'solo'; }

  _template() {
    const cls = [
      'w-text-field',
      'w-text-field--' + this._esc(this.variant),
      'w-text-field--density-' + this._esc(this.density),
      this.size ? 'w-text-field--' + this._esc(this.size) : '',
      this.rounded ? 'w-text-field--rounded' : '',
      this.disabled ? 'w-text-field--disabled' : '',
      this.readonly ? 'w-text-field--readonly' : '',
      this.loading ? 'w-text-field--loading' : '',
      this.error ? 'w-text-field--error' : '',
      this._floating ? 'w-text-field--floating' : '',
      this.persistentHint ? 'w-text-field--persistent-hint' : '',
      this.value !== '' ? 'w-text-field--has-value' : '',
    ].filter(Boolean).join(' ');

    const style = this.color ? ` style="--w-tf-accent:var(--w-${this._esc(this.color)})"` : '';

    // When floating, the input always carries a placeholder (a space if none
    // was given) so :placeholder-shown tracks emptiness; the placeholder text
    // is hidden by CSS until focus. When NOT floating, the label collapses into
    // the placeholder so solo / single-line / unlabelled fields read naturally.
    const floating = this._floating;
    const phText = floating
      ? (this.placeholder || ' ')
      : (this.placeholder || (this.label && (this.singleLine || this.variant === 'solo') ? this.label : ' '));
    const ph = ` placeholder="${this._esc(phText)}"`;

    const val = this.value !== '' ? ` value="${this._esc(this.value)}"` : '';
    const dis = this.disabled ? ' disabled' : '';
    const ro = this.readonly ? ' readonly' : '';
    const af = this._bool('autofocus') ? ' autofocus' : '';
    const nm = this.name ? ` name="${this._esc(this.name)}"` : '';
    const ariaText = !floating && this.label ? this.label : (!this.label ? this.placeholder : '');
    const aria = ariaText ? ` aria-label="${this._esc(ariaText)}"` : '';
    const invalid = this.error ? ' aria-invalid="true"' : '';

    const input = `<input class="w-text-field-input" type="${this._esc(this.type)}"${ph}${val}${dis}${ro}${af}${nm}${aria}${invalid}${this._validationAttrs()} data-w-tf-input>`;
    const labelEl = floating ? `<label class="w-text-field-label">${this._esc(this.label)}</label>` : '';

    const prefix = this.prefix ? `<span class="w-text-field-affix w-text-field-prefix">${this._esc(this.prefix)}</span>` : '';
    const suffix = this.suffix ? `<span class="w-text-field-affix w-text-field-suffix">${this._esc(this.suffix)}</span>` : '';
    const clear = this.clearable ? `<button type="button" class="w-text-field-clear" tabindex="-1" aria-label="Clear">&times;</button>` : '';
    const loader = this.loading ? `<span class="w-text-field-loader" aria-hidden="true"></span>` : '';

    const details = this._detailsHtml();

    return `<div class="${cls}"${style}>
      <div class="w-text-field-control">
        ${this._innerHtml('prepend')}
        ${prefix}
        <span class="w-text-field-field">
          ${input}
          ${labelEl}
        </span>
        ${suffix}
        ${clear}
        ${this._innerHtml('append')}
        ${loader}
      </div>
      ${details}
    </div>`;
  }

  _detailsHtml() {
    if (this.hideDetails) return '';
    const msg = this.error || this.hint;
    const msgEl = msg ? `<span class="w-text-field-messages">${this._esc(msg)}</span>` : '<span class="w-text-field-messages"></span>';
    const counterEl = this.counter
      ? `<span class="w-text-field-counter">${this._counterText()}</span>` : '';
    if (!msg && !counterEl) return '';
    return `<div class="w-text-field-details">${msgEl}${counterEl}</div>`;
  }

  _counterText() {
    const len = (this.value || '').length;
    return this.maxlength ? `${len} / ${this.maxlength}` : String(len);
  }

  _events() {
    const inp = this._q('input');
    if (!inp) return;

    inp.addEventListener('input', (event) => {
      event.stopPropagation();
      this._value = inp.value;
      this._silentSet('value', inp.value);
      this._sync();
      this._emit('input', { value: inp.value, name: this.name });
    });
    inp.addEventListener('change', (event) => {
      event.stopPropagation();
      this._emit('change', { value: inp.value, name: this.name });
    });

    const clearBtn = this._q('.w-text-field-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        inp.value = '';
        this._value = '';
        this._silentSet('value', '');
        this._sync();
        inp.focus();
        this._emit('input', { value: '', name: this.name });
        this._emit('clear', { name: this.name });
      });
    }

    this._sync();
  }

  // Update value-derived UI without re-rendering (which would break typing).
  _sync() {
    const root = this._q('.w-text-field');
    if (root) root.classList.toggle('w-text-field--has-value', (this.value || '') !== '');
    const counter = this._q('.w-text-field-counter');
    if (counter) counter.textContent = this._counterText();
  }

  focus() {
    const inp = this._q('input');
    if (inp) inp.focus();
  }
}

customElements.define('w-text-field', WTextField);
