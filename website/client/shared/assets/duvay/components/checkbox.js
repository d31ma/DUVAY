/* <w-checkbox> — Checkbox web component
 *
 * Attributes:
 *   checked        - whether checked
 *   indeterminate  - shows a mixed state
 *   disabled       - disables the checkbox
 *   readonly       - prevents toggling while keeping focus
 *   name           - form field name
 *   value          - native form value when checked
 *   label          - label text (alternative to default slot)
 *   color          - 'primary' | 'error' | 'success' | 'warning'
 *   size           - 'xs' | 'sm' | 'md' | 'lg'
 *   hint           - helper text rendered below the label
 *   error          - error text; a bare attribute just flags the error state
 *   hide-details   - suppresses hint/error text ('auto' keeps it when non-empty)
 *
 * Vuetify parity surface (shared with <w-radio>, <w-checkbox-btn>, <w-radio-group>):
 *   type              - 'checkbox' | 'radio' native control type
 *   multiple          - the change detail's `value` becomes an array model
 *   true-value        - value reported (and submitted) while checked
 *   false-value       - value reported while unchecked
 *   true-icon / false-icon / indeterminate-icon
 *                     - custom marks drawn inside the box per state
 *   prepend-icon / append-icon - icons flanking the control
 *   icon-color        - color token (or literal) for those icons
 *   center-affix      - vertically centre the affixes against the label block
 *   inline            - label and details share a row instead of stacking
 *   ripple            - press-ripple visual on the box
 *   messages          - helper messages below the label
 *   error-messages    - error messages; also sets the error state
 *   max-errors        - how many error messages are shown (default 1)
 *   validate-on       - eager (default) | lazy | blur | input | submit
 *   validation-value  - value the `required` rule checks instead of the model
 *   persistent-hint   - keep the hint visible alongside an error
 *   indent-details    - inline padding on the details row
 *   hide-spin-buttons - hide native number spin buttons inside the control
 *
 * Slot:
 *   default  - label text (alternative to label attribute)
 *
 * Events:
 *   change         - fires on toggle (detail: { checked, value, name })
 */

import WIcons from '../icons.js';
import { wSetValue, wValueList } from './utils.js';
/* Shared VInput-style surface for selection controls: affix icons, the
 * hint / messages / error-messages details row, and the `validate-on` gate.
 * <w-checkbox> (plus <w-radio> and <w-checkbox-btn>, which extend it) and
 * <w-radio-group> expose the same Vuetify prop set from different DOM shapes,
 * so the behaviour lives here once. */
export function wSelectionSurface(Base) {
  return class WSelectionSurface extends Base {
    static attrs = [
      'type', 'label', 'name', 'value', 'inline', 'ripple', 'required',
      'hint', 'error', 'hide-details', 'messages', 'error-messages', 'max-errors',
      'validate-on', 'validation-value', 'persistent-hint', 'indent-details',
      'center-affix', 'icon-color', 'prepend-icon', 'append-icon',
      'hide-spin-buttons', 'true-icon', 'false-icon', 'indeterminate-icon',
    ];

    get type() { return this._attr('type', this._defaultType()); }
    get label() { return this._attr('label', ''); }
    get inline() { return this._bool('inline'); }
    get ripple() { return this._bool('ripple'); }
    get hint() { return this._attr('hint', ''); }
    get error() { return this._attr('error', ''); }
    get messages() { return wValueList(this._attr('messages', '')); }
    get errorMessages() { return wValueList(this._attr('error-messages', '')); }
    get maxErrors() { return Number(this._attr('max-errors', '1')) || 1; }
    get validateOn() { return this._attr('validate-on', 'eager'); }
    get persistentHint() { return this._bool('persistent-hint'); }
    get indentDetails() { return this._bool('indent-details'); }
    get centerAffix() { return this._bool('center-affix'); }
    get hideSpinButtons() { return this._bool('hide-spin-buttons'); }
    get iconColor() { return this._attr('icon-color', ''); }
    get prependIcon() { return this._attr('prepend-icon', ''); }
    get appendIcon() { return this._attr('append-icon', ''); }
    get trueIcon() { return this._attr('true-icon', ''); }
    get falseIcon() { return this._attr('false-icon', ''); }
    get indeterminateIcon() { return this._attr('indeterminate-icon', ''); }
    get hideDetails() { return this._detailsHidden(); }
    get hasError() { return this.hasAttribute('error') || this._shownErrors().length > 0; }

    /* Hooks subclasses override. */
    _defaultType() { return 'checkbox'; }
    _controlType() { return this.type === 'radio' ? 'radio' : 'checkbox'; }
    _currentValue() { return ''; }
    _rootSelector() { return '.w-checkbox'; }
    _errorClass() { return 'w-checkbox--error'; }
    _detailsSelector() { return '.w-checkbox-details'; }

    /* ── Details row ────────────────────────────────────────────────────── */

    // `validate-on` decides *when* messages surface; the only rule here is
    // `required`, so the trigger simply gates their display.
    _errorsVisible() {
      const tokens = this.validateOn.split(/\s+/);
      if (tokens.includes('eager')) return true;
      if (tokens.includes('blur')) return !!this._blurred;
      if (tokens.includes('input')) return !!this._touched;
      if (tokens.includes('submit')) return !!this._submitted;
      if (tokens.includes('lazy')) return !!(this._blurred || this._touched);
      return true;
    }

    _validationValue() {
      const raw = this.getAttribute('validation-value');
      return raw === null ? this._currentValue() : raw;
    }

    _requiredErrors() {
      if (!this.hasAttribute('required')) return [];
      return this._validationValue() ? [] : ['This field is required.'];
    }

    _shownErrors() {
      if (!this._errorsVisible()) return [];
      return this.errorMessages.concat(this._requiredErrors()).slice(0, this.maxErrors);
    }

    _errorLines() {
      return (this.error ? [this.error] : []).concat(this._shownErrors());
    }

    // The error text replaces the hint; `persistent-hint` keeps both.
    _hintLines() {
      if (!this.hint) return [];
      return this._errorLines().length && !this.persistentHint ? [] : [this.hint];
    }

    _detailsHidden() {
      const raw = this.getAttribute('hide-details');
      if (raw == null || raw === 'false') return false;
      if (raw !== 'auto') return true;
      return !this._detailsContent();
    }

    _detailsContent() {
      return this._lineMarkup('error', this._errorLines())
        + this._lineMarkup('hint', this._hintLines())
        + this._lineMarkup('message', this.messages);
    }

    _lineMarkup(kind, lines) {
      const role = kind === 'error' ? ' role="alert"' : '';
      return lines.map((text) => `<span class="w-checkbox-${kind}"${role}>${this._esc(text)}</span>`).join('');
    }

    _detailsMarkup() {
      return this._detailsHidden() ? '' : this._detailsContent();
    }

    // Messages gated by `validate-on` surface without a re-render, which would
    // recreate the control and drop focus mid-interaction.
    _refreshDetails() {
      const details = this._q(this._detailsSelector());
      if (details) details.innerHTML = this._detailsMarkup();
      const root = this._q(this._rootSelector());
      if (root) root.classList.toggle(this._errorClass(), this.hasError);
    }

    _bindSubmit() {
      const form = this.closest('form');
      if (!form || this.__wSubmitBound) return;
      this.__wSubmitBound = true;
      form.addEventListener('submit', () => { this._submitted = true; this._refreshDetails(); });
    }

    /* ── Affixes ────────────────────────────────────────────────────────── */

    _affix(side, name) {
      if (!name) return '';
      const icon = WIcons.resolve(name, { iconClass: 'w-icon' });
      return `<span class="w-selection-affix w-selection-affix--${side}">${icon}</span>`;
    }

    _surfaceClasses() {
      return this._cls({
        'w-selection--center-affix': this.centerAffix,
        'w-selection--indent-details': this.indentDetails,
        'w-selection--hide-spin-buttons': this.hideSpinButtons,
      });
    }

    // The affix wrapper only appears when something needs it, so a plain
    // control keeps exactly the DOM — and the layout — it had without it.
    _wrapAffixes(inner) {
      const before = this._affix('prepend', this.prependIcon);
      const after = this._affix('append', this.appendIcon);
      const surface = this._surfaceClasses();
      if (!before && !after && !surface) return inner;
      return `<span class="w-selection-outer${surface}"${this._iconColorStyle()}>`
        + `${before}${inner}${after}</span>`;
    }

    _iconColorStyle() {
      if (!this.iconColor) return '';
      return ` style="--w-selection-icon-color:${this._esc(this._colorToken(this.iconColor))}"`;
    }

    // A bare word is read as a design token, anything else as a literal color.
    _colorToken(value) {
      const text = String(value);
      if (/^[a-z][a-z0-9-]*$/i.test(text)) return `var(--w-${text}, ${text})`;
      return text.replace(/[^\w#(),.%\s-]/g, '');
    }
  };
}

export class WCheckbox extends wSelectionSurface(WElement) {

  static attrs = ['checked', 'indeterminate', 'disabled', 'readonly', 'name', 'value',
    'color', 'size', 'multiple', 'true-value', 'false-value'];

  get checked()       { return this._deriveChecked(); }
  set checked(v)      { v ? this.setAttribute('checked', '') : this.removeAttribute('checked'); }
  get indeterminate() { return this._bool('indeterminate'); }
  set indeterminate(value) { this.toggleAttribute('indeterminate', !!value); }
  get disabled()      { return this._bool('disabled'); }
  set disabled(value) { this.toggleAttribute('disabled', !!value); }
  get readonly()      { return this._bool('readonly'); }
  set readonly(value) { this.toggleAttribute('readonly', !!value); }
  get name()          { return this._attr('name', ''); }
  set value(v) { wSetValue(this, v); }
  get value()         { return this._attr('value', 'on'); }
  get color()         { return this._attr('color', ''); }
  get size()          { return this._attr('size', 'md'); }
  get multiple()      { return this._bool('multiple'); }
  get trueValue()     { return this._attr('true-value', this.value); }
  get falseValue()    { return this._attr('false-value', this.value); }

  _deriveChecked() { return this.hasAttribute('checked'); }
  _currentValue() { return this.checked ? this.trueValue : ''; }
  _groupSelector() { return 'w-checkbox, w-checkbox-btn'; }

  _inputAttrs() {
    return this._attrs({
      checked: this.checked,
      disabled: this.disabled,
      readonly: this.readonly,
      name: this.name,
      value: this.trueValue,
      'aria-checked': this.indeterminate ? 'mixed' : '',
      'aria-invalid': this.hasError ? 'true' : '',
    }) + this._validationAttrs(['required']);
  }

  _hasMarks() { return !!(this.trueIcon || this.falseIcon || this.indeterminateIcon); }

  _rootClass() {
    return this._cls({
      [this._commonClass('w-checkbox--', this.color)]: this.color,
      [this._commonClass('w-checkbox--', this.size || 'md')]: true,
      'w-checkbox--error': this.hasError,
      'w-checkbox--inline': this.inline,
      'w-checkbox--custom-mark': this._hasMarks(),
      'w-radio': this._controlType() === 'radio',
    });
  }

  // Per-state marks live in the box together; CSS reveals the one that matches
  // the input's checked / indeterminate state.
  _mark(state, name) {
    if (!name) return '';
    return `<span class="w-checkbox-mark w-checkbox-mark--${state}">`
      + `${WIcons.resolve(name, { iconClass: 'w-icon' })}</span>`;
  }

  _markMarkup() {
    return this._mark('true', this.trueIcon)
      + this._mark('false', this.falseIcon)
      + this._mark('indeterminate', this.indeterminateIcon);
  }

  _labelMarkup() {
    const inner = this.label ? this._esc(this.label) : `<slot></slot>`;
    return `<span class="w-checkbox-label">${inner}</span>`;
  }

  _textMarkup() {
    return `<span class="w-checkbox-text">${this._labelMarkup()}`
      + `<span class="w-checkbox-details">${this._detailsMarkup()}</span></span>`;
  }

  _controlMarkup() {
    const input = `<input class="w-checkbox-input" type="${this._controlType()}"${this._inputAttrs()}>`;
    const box = `<span class="w-checkbox-box" aria-hidden="true">${this._markMarkup()}</span>`;
    return `<label class="w-checkbox${this._rootClass()}">${input}${box}${this._textMarkup()}</label>`;
  }

  _template() {
    return this._wrapAffixes(this._controlMarkup());
  }

  _events() {
    const input = this._q('input');
    if (!input) return;

    input.indeterminate = this.indeterminate;
    if (this.ripple) this._attachRipple(this._q('.w-checkbox-box'));

    input.addEventListener('click', (event) => this._onClick(event));
    input.addEventListener('blur', () => { this._blurred = true; this._refreshDetails(); });
    input.addEventListener('change', (event) => this._onChange(event, input));
    this._bindSubmit();
  }

  _onClick(event) {
    if (this.readonly || this.disabled) event.preventDefault();
  }

  _onChange(event, input) {
    event.stopPropagation();
    if (this.readonly || this.disabled) return;

    this._touched = true;
    const checked = input.checked;
    this._silentSet('checked', checked);
    this._silentSet('indeterminate', false);
    this._refreshDetails();
    this._emit('change', this._changeDetail(checked));
  }

  _changeDetail(checked) {
    return { checked, indeterminate: false, name: this.name, value: this._modelValue(checked) };
  }

  _modelValue(checked) {
    if (this.multiple) return this._groupValues();
    return checked ? this.trueValue : this.falseValue;
  }

  // `multiple` makes the model an array: the values of every same-named control
  // that is currently checked, in document order.
  _groupValues() {
    const root = this.getRootNode();
    const scope = root.querySelectorAll ? root : document;
    return Array.from(scope.querySelectorAll(this._groupSelector()))
      .filter((peer) => this._isPeerChecked(peer))
      .map((peer) => this._peerValue(peer));
  }

  _isPeerChecked(peer) {
    if (peer.getAttribute('name') !== this.name) return false;
    return !!peer.querySelector('input')?.checked;
  }

  _peerValue(peer) {
    return peer.getAttribute('true-value') ?? peer.getAttribute('value') ?? 'on';
  }
}

if (!customElements.get('w-checkbox')) customElements.define('w-checkbox', WCheckbox);
