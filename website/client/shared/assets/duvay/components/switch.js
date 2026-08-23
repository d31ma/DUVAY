/* <w-switch> — Toggle switch web component, mirroring Vuetify's <v-switch>.
 *
 * An accessible checkbox styled as an on/off control. Use it for settings that
 * take effect immediately. The selection-control surface (type, indeterminate,
 * true/false values, state icons, ripple, inline, multiple) comes from
 * `WSelectionControlBase` in selection-control.js.
 *
 * Attributes:
 *   checked        - whether the switch is on (reflected)
 *   indeterminate  - "partially on" state; the thumb parks in the middle
 *   type           - "checkbox" (default) | "radio" for the backing input
 *   multiple       - array model: the native name gains a `[]` suffix
 *   disabled       - non-interactive and dimmed
 *   readonly       - prevents toggling while keeping focus
 *   loading        - shows a spinner in the thumb and blocks toggling
 *   name           - form field name
 *   value          - native form value when checked (default "on")
 *   true-value / false-value - values for the on / off states
 *   true-icon / false-icon / indeterminate-icon - icon shown inside the thumb
 *   label          - label text (alternative to default slot)
 *   color          - 'primary' | 'error' | 'success' | 'warning'
 *   thumb-color    - token colour (or CSS colour) for the thumb
 *   size           - 'xs' | 'sm' | 'md' | 'lg'
 *   direction      - 'horizontal' (default) | 'vertical'
 *   inline         - lay the control and its label out in a row
 *   inset          - track fully encloses the thumb
 *   flat           - thumb without elevation
 *   ripple         - press feedback on the control
 *   prepend-icon / append-icon - icons rendered outside the control
 *   icon-color     - colour for those icons
 *   center-affix / indent-details / hide-spin-buttons - field surface modifiers
 *   hint           - helper text rendered below the label
 *   persistent-hint - keep the hint visible while an error is shown
 *   error          - error text; also tints the track red
 *   messages       - helper messages below the control (comma or JSON list)
 *   error-messages - error messages; also sets the error state
 *   max-errors     - how many error messages are shown (default 1)
 *   validate-on    - eager (default) | lazy | blur | input | submit
 *   validation-value - value the `required` rule checks instead of the state
 *   hide-details   - suppresses hint/error text
 *
 * Slot:
 *   default  - label text (alternative to the label attribute)
 *
 * Events:
 *   change   - fires on toggle (detail: { checked, value, name })
 */

import WIcons from '../icons.js';
import { wValueList } from './utils.js';
import { WSelectionControlBase } from './selection-control.js';

class WSwitch extends WSelectionControlBase {

  static attrs = [
    'checked', 'disabled', 'readonly', 'loading', 'name', 'value', 'label',
    'color', 'size', 'inset', 'flat', 'hint', 'error', 'hide-details',
    'type', 'indeterminate', 'multiple', 'ripple', 'inline', 'direction',
    'true-icon', 'false-icon', 'indeterminate-icon', 'true-value', 'false-value',
    'prepend-icon', 'append-icon', 'icon-color', 'center-affix',
    'indent-details', 'hide-spin-buttons', 'persistent-hint', 'messages',
    'error-messages', 'max-errors', 'validate-on', 'validation-value', 'thumb-color',
  ];

  get checked()     { return this.hasAttribute('checked'); }
  set checked(v)    { v ? this.setAttribute('checked', '') : this.removeAttribute('checked'); }
  get readonly()    { return this._bool('readonly'); }
  set readonly(value) { this.toggleAttribute('readonly', !!value); }
  get loading()     { return this._bool('loading'); }
  get color()       { return this._attr('color', ''); }
  get thumbColor()  { return this._attr('thumb-color', ''); }
  get iconColor()   { return this._attr('icon-color', ''); }
  get size()        { return this._attr('size', 'md'); }
  get vertical()    { return this._attr('direction', '') === 'vertical'; }
  get inset()       { return this._bool('inset'); }
  get flat()        { return this._bool('flat'); }
  get hint()        { return this._attr('hint', ''); }
  get persistentHint() { return this._bool('persistent-hint'); }
  get error()       { return this._attr('error', ''); }
  get centerAffix()     { return this._bool('center-affix'); }
  get indentDetails()   { return this._bool('indent-details'); }
  get hideSpinButtons() { return this._bool('hide-spin-buttons'); }
  get prependIcon() { return this._attr('prepend-icon', ''); }
  get appendIcon()  { return this._attr('append-icon', ''); }
  get messages()    { return wValueList(this._attr('messages', '')); }
  get errorMessages() { return wValueList(this._attr('error-messages', '')); }
  get maxErrors()   { return Number(this._attr('max-errors', '1')) || 1; }
  get validateOn()  { return this._attr('validate-on', 'eager'); }
  get blocked()     { return this.readonly || this.disabled || this.loading; }

  get hideDetails() {
    const raw = this.getAttribute('hide-details');
    if (raw == null || raw === 'false') return false;
    if (raw !== 'auto') return true;
    return !(this._allErrors().length || this.messages.length || this.hint);
  }

  /* ── Validation ─────────────────────────────────────────────────────────── */

  _validationValue() {
    const raw = this.getAttribute('validation-value');
    if (raw !== null) return raw;
    return this.checked ? this.checkedValue : '';
  }

  _ruleErrors() {
    if (!this.hasAttribute('required')) return [];
    return this._validationValue() ? [] : ['This field is required.'];
  }

  // `validate-on` decides *when* errors surface; there is no rules engine here,
  // so the trigger simply gates their display.
  _errorsVisible() {
    const tokens = this.validateOn.split(/\s+/);
    const gates = {
      eager: true,
      blur: !!this._blurred,
      input: !!this._touched,
      submit: !!this._submitted,
      lazy: !!(this._blurred || this._touched),
    };
    const hit = Object.keys(gates).find((name) => tokens.includes(name));
    return hit === undefined ? true : gates[hit];
  }

  _allErrors() {
    const gated = this._errorsVisible() ? this.errorMessages.concat(this._ruleErrors()) : [];
    return [this.error].concat(gated).filter(Boolean).slice(0, this.maxErrors);
  }

  /* ── Markup ─────────────────────────────────────────────────────────────── */

  _template() {
    const input = this._inputMarkup();
    const track = `<span class="w-switch-track" aria-hidden="true"><span class="w-switch-thumb">${this._thumbContent()}</span></span>`;
    const control = `<label class="${this._classes()}"${this._rootStyle()}>${input}${track}${this._textMarkup()}</label>`;
    return this._withSideIcons(control);
  }

  // The details row is always in the DOM (unless suppressed) so `validate-on`
  // can reveal messages later without a destructive re-render.
  _textMarkup() {
    const label = this.label
      ? `<span class="w-switch-label">${this._esc(this.label)}</span>`
      : `<span class="w-switch-label"><slot></slot></span>`;
    if (this.hideDetails) return label;
    return `<span class="w-switch-text">${label}<span class="w-switch-details">${this._detailsMarkup()}</span></span>`;
  }

  _thumbContent() {
    if (this.loading) return '<span class="w-switch-spinner"></span>';
    return this._stateIconHtml('w-switch-icon');
  }

  _sideIconMarkup(side, name) {
    if (!name) return '';
    return `<span class="w-switch-${side}">${WIcons.resolve(name, { iconClass: 'w-icon w-switch-side-icon' })}</span>`;
  }

  _withSideIcons(control) {
    const before = this._sideIconMarkup('prepend', this.prependIcon);
    const after = this._sideIconMarkup('append', this.appendIcon);
    if (!before && !after) return control;
    return `<span class="w-switch-outer">${before}${control}${after}</span>`;
  }

  _rootStyle() {
    const vars = [
      ['--w-switch-thumb-color', this._colorValue(this.thumbColor)],
      ['--w-switch-icon-color', this._colorValue(this.iconColor)],
    ].filter((pair) => pair[1]).map((pair) => `${pair[0]}:${pair[1]}`);
    return vars.length ? ` style="${this._esc(vars.join(';'))}"` : '';
  }

  // A bare word reads as a design token; anything else as a literal CSS colour.
  _colorValue(value) {
    if (!value) return '';
    const text = String(value);
    return /^[a-z][a-z0-9-]*$/i.test(text) ? `var(--w-${text})` : text.replace(/[^\w#(),.%\s-]/g, '');
  }

  _classes() {
    return 'w-switch w-switch--' + this._esc(this.size || 'md') + this._cls({
      ['w-switch--' + this._esc(this.color)]: this.color,
      'w-switch--inset': this.inset,
      'w-switch--flat': this.flat,
      'w-switch--loading': this.loading,
      'w-switch--error': this._allErrors().length > 0,
      'w-switch--indeterminate': this.indeterminate,
      'w-switch--vertical': this.vertical,
      'w-switch--inline': this.inline,
      'w-switch--center-affix': this.centerAffix,
      'w-switch--indent-details': this.indentDetails,
      'w-switch--hide-spin-buttons': this.hideSpinButtons,
      'w-switch--multiple': this.multiple,
    });
  }

  _inputMarkup() {
    const attrs = this._attrs({
      type: this.inputType,
      checked: this.checked,
      disabled: this.disabled,
      readonly: this.readonly,
      required: this._bool('required'),
      name: this.fieldName,
      value: this.checkedValue,
      'aria-checked': this.indeterminate ? 'mixed' : '',
      'aria-invalid': this._allErrors().length ? 'true' : '',
      'aria-busy': this.loading ? 'true' : '',
    });
    return `${this._falseValueHtml()}<input class="w-switch-input"${attrs}>`;
  }

  _detailsMarkup() {
    return this._errorMarkup() + this._hintMarkup() + this._messagesMarkup();
  }

  _errorMarkup() {
    const errors = this._allErrors();
    if (!errors.length) return '';
    const items = errors.map((text) => `<span class="w-switch-message">${this._esc(text)}</span>`).join('');
    return `<span class="w-switch-error" role="alert">${items}</span>`;
  }

  // The error text normally replaces the hint; `persistent-hint` keeps both.
  _hintMarkup() {
    if (!this.hint) return '';
    if (this._allErrors().length && !this.persistentHint) return '';
    return `<span class="w-switch-hint">${this._esc(this.hint)}</span>`;
  }

  _messagesMarkup() {
    if (!this.messages.length) return '';
    const items = this.messages.map((text) => `<span class="w-switch-message">${this._esc(text)}</span>`).join('');
    return `<span class="w-switch-messages">${items}</span>`;
  }

  /* ── Behaviour ──────────────────────────────────────────────────────────── */

  _events() {
    const inp = this._controlInput();
    if (!inp) return;

    this._syncIndeterminate();
    if (this.ripple) this._attachRipple(this._q('.w-switch-track'));

    inp.addEventListener('click', (e) => {
      if (this.blocked) e.preventDefault();
    });
    inp.addEventListener('blur', () => { this._blurred = true; this._syncDetails(); });

    inp.addEventListener('change', (event) => {
      event.stopPropagation();
      if (this.blocked) return;
      this._touched = true;
      const detail = this._stateDetail(inp);
      this._silentSet('checked', inp.checked);
      this._silentSet('indeterminate', false);
      this._syncThumb();
      this._syncDetails();
      this._emit('change', detail);
    });

    this._bindSubmit();
  }

  _bindSubmit() {
    const form = this.closest('form');
    if (!form || this._submitBound) return;
    this._submitBound = true;
    form.addEventListener('submit', () => { this._submitted = true; this._syncDetails(); });
  }

  // `checked` is mirrored silently, so the thumb's state icon is swapped in
  // place rather than waiting for a re-render.
  _syncThumb() {
    const thumb = this._q('.w-switch-thumb');
    if (thumb) thumb.innerHTML = this._thumbContent();
  }

  // Refresh the details row and error state without a destructive re-render.
  _syncDetails() {
    const details = this._q('.w-switch-details');
    if (details) details.innerHTML = this._detailsMarkup();
    const root = this._q('.w-switch');
    if (root) root.classList.toggle('w-switch--error', this._allErrors().length > 0);
  }
}

customElements.define('w-switch', WSwitch);
