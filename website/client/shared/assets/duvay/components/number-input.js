/* <w-number-input> — numeric input with stepper controls.
 *
 * Mirrors Vuetify's <v-number-input> (https://vuetifyjs.com/en/components/number-inputs).
 *
 * Attributes:
 *   value                - current number (clamped to min/max)
 *   min, max             - bounds (default: safe-integer range)
 *   step                 - increment/decrement amount (default 1)
 *   control-variant      - default | stacked | split | hidden
 *   inset                - tuck the controls inside the field with no divider
 *   hide-input           - show only the stepper (implies the stacked variant)
 *   reverse              - place the controls before the input
 *   precision            - decimal places to display (default 0; "null" = no rounding)
 *   min-fraction-digits  - minimum decimals to keep
 *   grouping             - true | always | auto | min2 for thousands separators
 *   decimal-separator    - single character override (default ".")
 *   group-separator      - single character override (default ",")
 *   label, placeholder, hint, error, name, size, disabled, readonly
 *
 * Field surface (mirrors <v-number-input>):
 *   variant              - outlined | filled | underlined | plain | solo |
 *                          solo-inverted | solo-filled
 *   flat                 - drop the elevation of the solo variants
 *   active, dirty, glow, center-affix, single-line, indent-details
 *   prefix, suffix       - static text inside the control
 *   prepend-icon / append-icon             - icons outside the control
 *   prepend-inner-icon / append-inner-icon - icons inside the control
 *   clearable, clear-icon, persistent-clear - clear button
 *   icon-color           - color for the prepend / append icons
 *   hide-spin-buttons    - hide the stepper controls
 *   autocomplete         - native autocomplete hint; `suppress` also randomises
 *                          the input name to defeat browser heuristics
 *   autofocus            - focus the input on render
 *   type                 - accepted and ignored; the input is always text
 *   persistent-placeholder / persistent-counter / persistent-hint
 *   counter              - character counter (bare attribute defaults to 25)
 *   messages             - helper messages below the control
 *   error-messages       - error messages; also sets the error state
 *   max-errors           - how many error messages are shown (default 1)
 *   validate-on          - eager (default) | lazy | blur | input | submit
 *   hide-details         - suppress the details row (`auto` keeps it when full)
 *
 * Events:
 *   input               - { value } on each keystroke (parsed number or NaN)
 *   change              - { value } on commit/step (number or null)
 *
 * The +/- buttons step once on press, then auto-repeat (accelerating) while
 * held; releasing or hitting a bound stops the run. See _holdStart.
 */

import { wValueList } from './utils.js';
import WIcons from '../icons.js';

export class WNumberInput extends WElement {
  static attrs = ['value', 'min', 'max', 'step', 'label', 'placeholder', 'hint', 'error', 'name',
    'disabled', 'readonly', 'size', 'precision', 'min-fraction-digits', 'decimal-separator',
    'grouping', 'group-separator', 'control-variant', 'inset', 'hide-input', 'reverse',
    'variant', 'flat', 'active', 'dirty', 'glow', 'center-affix', 'single-line',
    'indent-details', 'prefix', 'suffix', 'prepend-icon', 'append-icon',
    'prepend-inner-icon', 'append-inner-icon', 'clearable', 'clear-icon',
    'persistent-clear', 'persistent-placeholder', 'persistent-counter', 'persistent-hint',
    'icon-color', 'hide-spin-buttons', 'autocomplete', 'autofocus', 'type',
    'counter', 'messages', 'error-messages', 'max-errors', 'validate-on', 'hide-details'];

  get min() { const v = this._attr('min', ''); return v === '' ? Number.MIN_SAFE_INTEGER : Number(v); }
  get max() { const v = this._attr('max', ''); return v === '' ? Number.MAX_SAFE_INTEGER : Number(v); }
  get step() { return Number(this._attr('step', '1')) || 1; }

  get precision() {
    const v = this.getAttribute('precision');
    if (v === null) return 0;
    if (v === 'null' || v === '') return null;
    return Number(v);
  }
  get minFractionDigits() { const v = this.getAttribute('min-fraction-digits'); return v == null ? null : Number(v); }
  get decimalSeparator() { return this._attr('decimal-separator', ''); }
  get groupSeparator() { return this._attr('group-separator', ''); }
  get grouping() {
    const v = this.getAttribute('grouping');
    if (v == null || v === 'false') return false;
    if (v === '' || v === 'true' || v === 'always') return true;
    return v; // 'auto' | 'min2'
  }

  get controlVariant() {
    if (this.hideInput) return 'stacked';
    if (this.hideSpinButtons) return 'hidden';
    const v = this._attr('control-variant', 'default');
    return ['default', 'stacked', 'split', 'hidden'].includes(v) ? v : 'default';
  }
  get inset() { return this._bool('inset'); }
  get hideInput() { return this._bool('hide-input'); }
  get reverse() { return this._bool('reverse'); }

  get label() { return this._attr('label', ''); }
  get placeholder() { return this._attr('placeholder', ''); }
  get hint() { return this._attr('hint', ''); }
  get error() { return this._attr('error', ''); }
  get name() { return this._attr('name', ''); }
  get size() { return this._attr('size', ''); }
  get disabled() { return this._bool('disabled'); }
  set disabled(value) { this.toggleAttribute('disabled', !!value); }
  get readonly() { return this._bool('readonly'); }
  set readonly(value) { this.toggleAttribute('readonly', !!value); }
  get controlsDisabled() { return this.disabled || this.readonly; }

  /* Field surface */
  get variant() { return this._attr('variant', ''); }
  get flat() { return this._bool('flat'); }
  get active() { return this._bool('active'); }
  get glow() { return this._bool('glow'); }
  get centerAffix() { return this._bool('center-affix'); }
  get singleLine() { return this._bool('single-line'); }
  get indentDetails() { return this._bool('indent-details'); }
  get hideSpinButtons() { return this._bool('hide-spin-buttons'); }
  get clearable() { return this._bool('clearable'); }
  get clearIcon() { return this._attr('clear-icon', ''); }
  get persistentClear() { return this._bool('persistent-clear'); }
  get persistentPlaceholder() { return this._bool('persistent-placeholder'); }
  get persistentCounter() { return this._bool('persistent-counter'); }
  get persistentHint() { return this._bool('persistent-hint'); }
  get prefix() { return this._attr('prefix', ''); }
  get suffix() { return this._attr('suffix', ''); }
  get prependIcon() { return this._attr('prepend-icon', ''); }
  get appendIcon() { return this._attr('append-icon', ''); }
  get prependInnerIcon() { return this._attr('prepend-inner-icon', ''); }
  get appendInnerIcon() { return this._attr('append-inner-icon', ''); }
  get iconColor() { return this._attr('icon-color', ''); }
  get autofocus() { return this._bool('autofocus'); }
  get autocompleteHint() { return this._attr('autocomplete', 'off'); }
  get messages() { return wValueList(this._attr('messages', '')); }
  get errorMessages() { return wValueList(this._attr('error-messages', '')); }
  get maxErrors() { return Number(this._attr('max-errors', '1')) || 1; }
  get validateOn() { return this._attr('validate-on', 'eager'); }
  get dirty() { return this._bool('dirty') || this.model != null; }

  get counterMax() {
    const raw = this.getAttribute('counter');
    if (raw == null || raw === 'false') return 0;
    const n = Number(raw);
    return n > 0 ? n : 25;
  }

  get model() {
    // The value attribute is canonical (plain number, "." decimal, no grouping).
    // Display formatting and separator overrides apply only to what's shown.
    const raw = this._attr('value', '');
    if (raw === '' || raw == null) return null;
    const n = Number(raw);
    return Number.isNaN(n) ? null : n;
  }

  get canIncrease() { return !this.controlsDisabled && (this.model ?? 0) + this.step <= this.max; }
  get canDecrease() { return !this.controlsDisabled && (this.model ?? 0) - this.step >= this.min; }

  _template() {
    const variant = this.controlVariant;
    return `<label class="${this._classes(variant)}"${this._rootStyle()}>`
      + this._labelMarkup()
      + this._fieldShell(variant)
      + this._hintMarkup()
      + this._detailsMarkup()
      + `</label>`;
  }

  // The error text normally replaces the hint; `persistent-hint` keeps the hint
  // alongside it.
  _hintMarkup() {
    const message = this.error || this.hint;
    if (!message) return '';
    const keep = this.persistentHint && this.error && this.hint;
    const extra = keep ? `<span class="w-field-hint w-field-hint--persistent">${this._esc(this.hint)}</span>` : '';
    return `<span class="w-field-hint">${this._esc(message)}</span>${extra}`;
  }

  _labelMarkup() {
    if (!this.label || this.singleLine) return '';
    return `<span class="w-label">${this._esc(this.label)}</span>`;
  }

  // Outside icons only get their own flex row when one of them is present.
  _fieldShell(variant) {
    const field = `<span class="w-number-input-field">${this._innerMarkup(variant)}</span>`;
    const before = this._sideIconMarkup('prepend', this.prependIcon);
    const after = this._sideIconMarkup('append', this.appendIcon);
    if (!before && !after) return field;
    return `<span class="w-number-input-outer">${before}${field}${after}</span>`;
  }

  _sideIconMarkup(side, name) {
    if (!name) return '';
    return `<span class="w-number-input-${side}">${this._iconHtml(name)}</span>`;
  }

  _iconHtml(name) {
    return WIcons.resolve(name, { iconClass: 'w-icon w-number-input-icon' });
  }

  _affixMarkup(side, text) {
    if (!text) return '';
    return `<span class="w-number-input-affix w-number-input-${side}">${this._esc(text)}</span>`;
  }

  _classes(variant) {
    return [
      'w-field', 'w-number-input', 'w-number-input--' + variant,
      this.inset ? 'w-number-input--inset' : '',
      this.hideInput ? 'w-number-input--hide-input' : '',
      this.reverse ? 'w-number-input--reverse' : '',
      this._errorText() ? 'w-field-error' : '',
    ].filter(Boolean).join(' ') + this._surfaceClasses();
  }

  _surfaceClasses() {
    return this._cls({
      ['w-number-input--' + this.variant]: this.variant,
      'w-number-input--flat': this.flat,
      'w-number-input--active': this.active,
      'w-number-input--dirty': this.dirty,
      'w-number-input--glow': this.glow,
      'w-number-input--center-affix': this.centerAffix,
      'w-number-input--single-line': this.singleLine,
      'w-number-input--indent-details': this.indentDetails,
      'w-number-input--hide-spin-buttons': this.hideSpinButtons,
      'w-number-input--persistent-placeholder': this.persistentPlaceholder,
      'w-number-input--persistent-counter': this.persistentCounter,
      'w-number-input--persistent-clear': this.persistentClear,
      'w-number-input--persistent-hint': this.persistentHint,
    });
  }

  _rootStyle() {
    if (!this.iconColor) return '';
    return ` style="${this._esc('--w-number-input-icon-color:' + this._colorValue(this.iconColor))}"`;
  }

  // A bare word is read as a design token, anything else as a literal color.
  _colorValue(value) {
    const text = String(value);
    if (/^[a-z][a-z0-9-]*$/i.test(text)) return `var(--w-${text}, ${text})`;
    return text.replace(/[^\w#(),.%\s-]/g, '');
  }

  // `type` is accepted for <v-number-input> parity and deliberately ignored —
  // the control is always a text input driven by _parse/_format.
  _inputMarkup() {
    const sizeClass = this.size ? ' w-input--' + this.size : '';
    return `<input${this._attrs({
      class: 'w-input' + sizeClass,
      type: 'text',
      inputmode: 'decimal',
      value: this._format(this.model),
      min: this.getAttribute('min'),
      max: this.getAttribute('max'),
      step: String(this.step),
      placeholder: this._placeholderText(),
      name: this.name || this._suppressName(),
      autocomplete: this._autocompleteValue(),
      'aria-label': this._inputAriaLabel(),
      disabled: this.disabled,
      readonly: this.readonly,
      autofocus: this.autofocus,
    })} w-number-input>`;
  }

  _autocompleteValue() {
    return this.autocompleteHint === 'suppress' ? 'off' : this.autocompleteHint;
  }

  _suppressName() {
    return this.autocompleteHint === 'suppress' ? 'w-ni-nosuggest' : '';
  }

  _placeholderText() {
    if (this.placeholder) return this.placeholder;
    return this.singleLine ? this.label : '';
  }

  _inputAriaLabel() {
    return this.label || this.placeholder || 'Number';
  }

  _clearMarkup() {
    if (!this.clearable) return '';
    const glyph = this.clearIcon ? this._iconHtml(this.clearIcon) : '&#x2715;';
    return `<button type="button" class="w-number-input-clear" tabindex="-1" aria-label="Clear"`
      + `${this.model == null ? ' hidden' : ''}>${glyph}</button>`;
  }

  // The input plus everything that shares its row inside the field shell.
  _inputGroup() {
    return this._sideIconMarkup('prepend-inner', this.prependInnerIcon)
      + this._affixMarkup('prefix', this.prefix)
      + this._inputMarkup()
      + this._affixMarkup('suffix', this.suffix)
      + this._sideIconMarkup('append-inner', this.appendInnerIcon)
      + this._clearMarkup();
  }

  _innerMarkup(variant) {
    const input = this._inputGroup();
    if (variant === 'hidden') return input;

    const dec = this._btn('-1', variant === 'split' ? 'minus' : 'chevron-down');
    const inc = this._btn('1', variant === 'split' ? 'plus' : 'chevron-up');
    if (variant === 'split') {
      return this.reverse ? `${inc}${input}${dec}` : `${dec}${input}${inc}`;
    }

    const group = `<span class="w-number-input-control">${variant === 'stacked' ? inc + dec : dec + inc}</span>`;
    return this.reverse ? `${group}${input}` : `${input}${group}`;
  }

  _btn(step, icon) {
    const blocked = (step === '1' ? !this.canIncrease : !this.canDecrease);
    const action = step === '1' ? 'Increase' : 'Decrease';
    const label = this.label ? `${action} ${this.label}` : action;
    return `<button type="button" class="w-number-input-btn" data-step="${step}"`
      + ` aria-label="${this._esc(label)}"${blocked ? ' disabled' : ''}>${this._icon(icon)}</button>`;
  }

  // Material-style glyphs: chevrons for the grouped (default/stacked) steppers,
  // plus/minus for the split layout — matching Vuetify's <v-number-input>.
  _icon(name) {
    const paths = {
      'chevron-up': 'M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z',
      'chevron-down': 'M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z',
      'plus': 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
      'minus': 'M19 13H5v-2h14v2z',
    };
    return `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="${paths[name]}"/></svg>`;
  }

  _events() {
    const input = this._q('input');
    if (input) {
      input.addEventListener('input', (event) => {
        event.stopPropagation();
        this._emit('input', { value: this._parse(input.value) });
      });
      input.addEventListener('change', (event) => {
        event.stopPropagation();
        const n = this._parse(input.value);
        this._commit(input.value === '' || Number.isNaN(n) ? null : this._clamp(n));
      });
      // Buttons are aria-hidden/-1, so the input itself drives keyboard stepping.
      input.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowUp') { event.preventDefault(); this._stepBy(1); }
        else if (event.key === 'ArrowDown') { event.preventDefault(); this._stepBy(-1); }
      });
    }

    this._qAll('[data-step]').forEach((btn) => {
      const dir = Number(btn.getAttribute('data-step'));
      btn.addEventListener('pointerdown', (event) => {
        if (btn.disabled || !event.isPrimary) return;
        event.preventDefault(); // keep focus on the input, suppress text selection
        this._holdStart(dir);
      });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach((name) => {
        btn.addEventListener(name, () => this._holdStop());
      });
    });

    this._bindFieldSurface();
  }

  // Counter / validation bookkeeping plus the clear button.
  _bindFieldSurface() {
    const input = this._q('input');
    if (input) {
      input.addEventListener('input', () => { this._typed = true; this._syncDetails(); });
      input.addEventListener('blur', () => { this._blurred = true; this._syncDetails(); });
    }

    const clear = this._q('.w-number-input-clear');
    if (clear) {
      clear.addEventListener('click', (event) => {
        event.preventDefault();
        this._commit(null);
        if (input) input.focus();
      });
    }

    const form = this.closest('form');
    if (form && !this.__submitBound) {
      this.__submitBound = true;
      form.addEventListener('submit', () => { this._submitted = true; this._syncDetails(); });
    }
  }

  /* Details row: messages, error messages, character counter */

  _errorText() {
    return this.error || this._shownErrors()[0] || '';
  }

  // `validate-on` decides *when* error-messages surface; there is no rules
  // engine here, so the trigger simply gates their display.
  _errorsVisible() {
    const tokens = this.validateOn.split(/\s+/);
    if (tokens.includes('eager')) return true;
    if (tokens.includes('blur')) return !!this._blurred;
    if (tokens.includes('input')) return !!this._typed;
    if (tokens.includes('submit')) return !!this._submitted;
    if (tokens.includes('lazy')) return !!(this._blurred || this._typed);
    return true;
  }

  _shownErrors() {
    if (!this._errorsVisible()) return [];
    return this.errorMessages.slice(0, this.maxErrors);
  }

  _hasDetailSources() {
    return !!(this.counterMax || this.messages.length || this.errorMessages.length);
  }

  _detailsHidden() {
    const raw = this.getAttribute('hide-details');
    if (raw == null || raw === 'false') return false;
    if (raw !== 'auto') return true;
    return !this._detailsContent();
  }

  _detailsMarkup() {
    if (!this._hasDetailSources()) return '';
    if (this._detailsHidden()) return '';
    return `<span class="w-number-input-details">${this._detailsContent()}</span>`;
  }

  _detailsContent() {
    return this._messagesMarkup() + this._counterMarkup();
  }

  _messagesMarkup() {
    const errors = this._shownErrors();
    const list = errors.length ? errors : this.messages;
    if (!list.length) return '';
    const cls = errors.length ? ' w-number-input-messages--error' : '';
    const role = errors.length ? ' role="alert"' : '';
    const items = list.map((text) => `<span class="w-number-input-message">${this._esc(text)}</span>`).join('');
    return `<span class="w-number-input-messages${cls}"${role}>${items}</span>`;
  }

  _counterMarkup() {
    if (!this.counterMax) return '';
    return `<span class="w-number-input-counter">${this._counterText()}</span>`;
  }

  _counterText() {
    const input = this._q('input');
    const text = input ? input.value : this._format(this.model);
    return `${text.length} / ${this.counterMax}`;
  }

  // Refresh the details row and the error state without a re-render.
  _syncDetails() {
    const details = this._q('.w-number-input-details');
    if (details) details.innerHTML = this._detailsContent();
    const root = this._q('.w-number-input');
    if (root) root.classList.toggle('w-field-error', !!this._errorText());
  }

  _stepBy(dir) {
    if (dir > 0 && !this.canIncrease) return;
    if (dir < 0 && !this.canDecrease) return;
    this._commit(this._clamp((this.model ?? 0) + dir * this.step));
  }

  // Press-and-hold: step once immediately, then auto-repeat (accelerating)
  // until release or the bound is reached.
  _holdStart(dir) {
    this._holdStop();
    this._stepBy(dir);
    let delay = 300;
    const tick = () => {
      if (dir > 0 ? !this.canIncrease : !this.canDecrease) return this._holdStop();
      this._stepBy(dir);
      delay = Math.max(40, delay - 40);
      this._holdTimer = setTimeout(tick, delay);
    };
    this._holdTimer = setTimeout(tick, delay);
  }

  _holdStop() {
    if (this._holdTimer) { clearTimeout(this._holdTimer); this._holdTimer = null; }
  }

  _commit(value) {
    const precision = this.precision;
    const rounded = value == null ? null : (precision == null ? value : Number(value.toFixed(precision)));
    const formatted = this._format(rounded);

    const input = this._q('input');
    if (input) input.value = formatted;
    this._silentSet('value', rounded == null ? null : String(rounded));
    this._syncButtons();
    this._emit('change', { value: rounded });
  }

  _syncButtons() {
    const up = this._q('[data-step="1"]');
    const down = this._q('[data-step="-1"]');
    if (up) up.disabled = !this.canIncrease;
    if (down) down.disabled = !this.canDecrease;
    this._syncClear();
    this._syncDetails();
  }

  _syncClear() {
    const clear = this._q('.w-number-input-clear');
    if (clear) clear.hidden = this.model == null;
    const root = this._q('.w-number-input');
    if (root) root.classList.toggle('w-number-input--dirty', this.dirty);
  }

  _clamp(n) { return Math.min(Math.max(n, this.min), this.max); }

  _parse(text) {
    const dec = this.decimalSeparator || '.';
    const grp = this.groupSeparator || (this.grouping ? ',' : '');
    let s = String(text);
    if (grp) s = s.split(grp).join('');
    if (dec !== '.') s = s.split(dec).join('.');
    s = s.replace(/[^0-9.\-]/g, '');
    return Number(s);
  }

  _format(n) {
    if (n == null || Number.isNaN(n)) return '';
    const precision = this.precision;
    const max = precision == null ? 20 : precision;
    const min = this.minFractionDigits != null ? this.minFractionDigits : (precision == null ? 0 : precision);
    let s;
    try {
      s = new Intl.NumberFormat('en-US', {
        useGrouping: !!this.grouping,
        minimumFractionDigits: Math.min(min, max),
        maximumFractionDigits: max,
      }).format(n);
    } catch {
      s = String(n);
    }
    // ponytail: separators applied by post-replace on the en-US output rather
    // than a per-locale Intl config — fine for single-char overrides.
    const dec = this.decimalSeparator;
    const grp = this.groupSeparator;
    if (dec || grp) {
      s = s
        .replace(/,/g, '\u0000')
        .replace(/\./g, dec || '.')
        .replace(/\u0000/g, grp || ',');
    }
    return s;
  }
}

if (!customElements.get('w-number-input')) customElements.define('w-number-input', WNumberInput);
