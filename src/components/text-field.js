/* <w-text-field> — full single-line text field, mirroring Vuetify's
 * <v-text-field>.
 *
 * A standalone control (not the thin <w-input>): floating label, the outlined /
 * filled / underlined / plain / solo variants, density, prefix/suffix,
 * prepend-inner / append-inner slots, clearable, character counter, loading
 * bar, hint / error messages, and the native HTML5 validation attributes.
 *
 * <w-textarea> extends this class and swaps the <input> for a <textarea>, so
 * every attribute below is available there too.
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
 *   counter         - show a character counter; bare it pairs with maxlength,
 *                     or pass an explicit maximum (counter="50")
 *   loading         - show an indeterminate bar along the bottom edge
 *   hint            - helper text below the control
 *   persistent-hint - keep the hint visible even when not focused
 *   error           - error text; tints the control and replaces the hint
 *   rounded         - pill-rounded control
 *   single-line     - no floating label; label is used as the placeholder
 *   hide-details    - suppress the details row (`auto` keeps it when non-empty)
 *   disabled, readonly, autofocus
 *   required, pattern, minlength, maxlength, min, max, step
 *
 * Field surface (mirrors <v-text-field> / <v-field> / <v-input>):
 *   flat            - drop the elevation of the solo variant
 *   reverse         - reverse the text direction inside the control
 *   active          - keep the control highlighted regardless of focus
 *   dirty           - manually apply the dirty (has-value) styling
 *   glow            - prepend/append icons go full opacity + accent on focus
 *   icon-color      - color for the prepend / append icons
 *   center-affix    - vertically centre the affixes, icons and clear button
 *   indent-details  - add inline padding to the details row
 *   hide-spin-buttons - hide the native spinners when type="number"
 *   persistent-placeholder - keep the placeholder visible when not focused
 *   persistent-counter     - keep the counter visible when not focused
 *   persistent-clear       - keep the clear button visible while dirty
 *   prepend-icon / append-icon  - icons outside the control
 *   clear-icon      - icon used by the clear button
 *   autocomplete    - native autocomplete hint; `suppress` also randomises the
 *                     input name to defeat browser heuristics
 *   messages        - helper messages below the control (comma / JSON list)
 *   error-messages  - error messages; also puts the field in the error state
 *   max-errors      - how many messages are shown at once (default 1)
 *   validate-on     - input (default) | blur | submit | invalid-input | eager;
 *                     when the built-in required / pattern checks start running
 *   validation-value - value the built-in checks read instead of the input's
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
import { wValueList } from './utils.js';

/* DOM events that can flip the field into its "validated" state. `eager`
   validates straight away; the rest wait for the matching interaction. */
const TF_TRIGGERS = ['input', 'invalid-input', 'blur', 'submit'];

let textFieldUid = 0;

export class WTextField extends WElement {
  static attrs = [
    'type', 'label', 'placeholder', 'value', 'name', 'variant', 'density', 'size',
    'color', 'prefix', 'suffix', 'clearable', 'counter', 'loading', 'hint',
    'persistent-hint', 'error', 'rounded', 'single-line', 'hide-details',
    'prepend-inner-icon', 'append-inner-icon', 'icon-set',
    'disabled', 'readonly', 'autofocus',
    'required', 'pattern', 'minlength', 'maxlength', 'min', 'max', 'step',
    'flat', 'reverse', 'active', 'dirty', 'glow', 'center-affix', 'indent-details',
    'hide-spin-buttons', 'persistent-placeholder', 'persistent-counter',
    'persistent-clear', 'prepend-icon', 'append-icon', 'clear-icon', 'icon-color',
    'autocomplete', 'messages', 'error-messages', 'max-errors', 'validate-on',
    'validation-value',
  ];

  get type()        { return this._attr('type', 'text'); }
  get label()       { return this._attr('label', ''); }
  get placeholder() { return this._attr('placeholder', ''); }
  get value()       { return this._value !== undefined ? this._value : this._attr('value', ''); }
  set value(v)      {
    this._value = v == null ? '' : String(v);
    const control = this._control();
    if (control) control.value = this._value;
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
  get disabled()    { return this._bool('disabled'); }
  set disabled(value) { this.toggleAttribute('disabled', !!value); }
  get readonly()    { return this._bool('readonly'); }
  set readonly(value) { this.toggleAttribute('readonly', !!value); }
  get maxlength()   { return this._attr('maxlength', ''); }
  get prependInnerIcon() { return this._attr('prepend-inner-icon', ''); }
  get appendInnerIcon()  { return this._attr('append-inner-icon', ''); }
  get iconSet()     { return this._attr('icon-set', ''); }

  /* Vuetify field surface */
  get flat()        { return this._bool('flat'); }
  get reverse()     { return this._bool('reverse'); }
  get active()      { return this._bool('active'); }
  get dirty()       { return this._bool('dirty'); }
  get glow()        { return this._bool('glow'); }
  get centerAffix() { return this._bool('center-affix'); }
  get indentDetails()   { return this._bool('indent-details'); }
  get hideSpinButtons() { return this._bool('hide-spin-buttons'); }
  get persistentPlaceholder() { return this._bool('persistent-placeholder'); }
  get persistentCounter()     { return this._bool('persistent-counter'); }
  get persistentClear()       { return this._bool('persistent-clear'); }
  get prependIcon() { return this._attr('prepend-icon', ''); }
  get appendIcon()  { return this._attr('append-icon', ''); }
  get clearIcon()   { return this._attr('clear-icon', ''); }
  get iconColor()   { return this._attr('icon-color', ''); }
  get autocompleteHint() { return this._attr('autocomplete', ''); }
  get messages()      { return wValueList(this._attr('messages', '')); }
  get errorMessages() { return wValueList(this._attr('error-messages', '')); }
  get maxErrors()     { return Number(this._attr('max-errors', '1')) || 1; }
  get validateOn()    { return this._attr('validate-on', 'input'); }

  // `validation-value` swaps in a different string for the built-in checks —
  // useful when the visible text is formatted and the raw value is not.
  get validationValue() {
    const raw = this.getAttribute('validation-value');
    return raw === null ? this._controlValue() : raw;
  }

  // Bare `counter` counts against maxlength; `counter="50"` sets its own cap.
  get counterMax() {
    if (!this.counter) return '';
    const raw = this.getAttribute('counter');
    return raw && raw !== 'true' ? raw : this.maxlength;
  }

  _uid() {
    if (!this.__uid) this.__uid = 'w-tf-' + (++textFieldUid);
    return this.__uid;
  }

  /* ── Control (overridden by <w-textarea>) ─────────────────────────────── */

  _controlSelector() { return 'input'; }
  _controlClass() { return 'w-text-field-input'; }
  _control() { return this._q(this._controlSelector()); }

  _controlValue() {
    const control = this._control();
    return String(control ? control.value : this.value);
  }

  _controlHtml() {
    const map = Object.assign({ type: this.type, value: this.value }, this._controlAttrs());
    return `<input${this._attrs(map)}${this._validationAttrs()} w-tf-input>`;
  }

  _controlAttrs() {
    return {
      id: this._uid(),
      class: this._controlClass(),
      placeholder: this._placeholderText(),
      name: this._controlName(),
      autocomplete: this._autocompleteValue(),
      disabled: this.disabled,
      readonly: this.readonly,
      autofocus: this._bool('autofocus'),
      'aria-label': this._ariaLabel(),
      'aria-invalid': this._hasError() && 'true',
      'aria-describedby': this._describedBy(),
    };
  }

  // Vuetify's `suppress` turns the native hint off *and* randomises the field
  // name, which is what actually stops most password managers.
  _autocompleteValue() {
    return this.autocompleteHint === 'suppress' ? 'off' : this.autocompleteHint;
  }

  _controlName() {
    if (this.autocompleteHint !== 'suppress') return this.name;
    return `${this.name || 'field'}-${this._uid()}`;
  }

  _describedBy() {
    return this._detailsHtml() ? this._detailsId() : '';
  }

  /* ── Icons and affixes ────────────────────────────────────────────────── */

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

  _sideIconHtml(side, name) {
    if (!name) return '';
    return `<span class="w-text-field-${side}">${this._icon(name)}</span>`;
  }

  _affixHtml(kind) {
    const text = kind === 'prefix' ? this.prefix : this.suffix;
    if (!text) return '';
    return `<span class="w-text-field-affix w-text-field-${kind}">${this._esc(text)}</span>`;
  }

  _clearHtml() {
    if (!this.clearable) return '';
    const glyph = this.clearIcon ? this._icon(this.clearIcon) : '&times;';
    return `<button type="button" class="w-text-field-clear" tabindex="-1" aria-label="Clear">${glyph}</button>`;
  }

  _loaderHtml() {
    return this.loading ? `<span class="w-text-field-loader" aria-hidden="true"></span>` : '';
  }

  /* ── Classes and inline custom properties ─────────────────────────────── */

  // No floating label when single-line, solo, or simply unlabelled.
  get _floating()   { return !!this.label && !this.singleLine && this.variant !== 'solo'; }

  _isDirty() { return this.dirty || this._controlValue() !== ''; }

  _classes() {
    return 'w-text-field' + this._cls(this._baseClasses())
      + this._cls(this._surfaceClasses()) + this._cls(this._extraClasses());
  }

  _baseClasses() {
    return {
      ['w-text-field--' + this._esc(this.variant)]: true,
      ['w-text-field--density-' + this._esc(this.density)]: true,
      ['w-text-field--' + this._esc(this.size)]: this.size,
      'w-text-field--rounded': this.rounded,
      'w-text-field--disabled': this.disabled,
      'w-text-field--readonly': this.readonly,
      'w-text-field--loading': this.loading,
      'w-text-field--error': this._hasError(),
      'w-text-field--floating': this._floating,
      'w-text-field--persistent-hint': this.persistentHint,
      'w-text-field--has-value': this._isDirty(),
    };
  }

  // Modifier classes shared with the outer icon row, so the icons outside the
  // control see the same state as the control itself.
  _surfaceClasses() {
    return {
      'w-text-field--flat': this.flat,
      'w-text-field--reverse': this.reverse,
      'w-text-field--active': this.active,
      'w-text-field--dirty': this.dirty,
      'w-text-field--glow': this.glow,
      'w-text-field--center-affix': this.centerAffix,
      'w-text-field--single-line': this.singleLine,
      'w-text-field--indent-details': this.indentDetails,
      'w-text-field--hide-spin-buttons': this.hideSpinButtons,
      'w-text-field--persistent-placeholder': this.persistentPlaceholder,
      'w-text-field--persistent-counter': this.persistentCounter,
      'w-text-field--persistent-clear': this.persistentClear,
    };
  }

  // Subclass hook — <w-textarea> adds its own modifiers here.
  _extraClasses() { return {}; }

  _rootStyle() {
    const style = [
      this.color ? `--w-tf-accent:var(--w-${this._esc(this.color)})` : '',
      this.iconColor ? `--w-tf-icon-color:${this._colorValue(this.iconColor)}` : '',
    ].filter(Boolean).join(';');
    return style ? ` style="${style}"` : '';
  }

  // A bare word is read as a design token, anything else as a literal color.
  _colorValue(value) {
    const text = String(value);
    if (/^[a-z][a-z0-9-]*$/i.test(text)) return `var(--w-${text}, ${text})`;
    return text.replace(/[^\w#(),.%\s-]/g, '');
  }

  /* ── Placeholder / label ──────────────────────────────────────────────── */

  // When floating, the input always carries a placeholder (a space if none
  // was given) so :placeholder-shown tracks emptiness; the placeholder text
  // is hidden by CSS until focus. When NOT floating, the label collapses into
  // the placeholder so solo / single-line / unlabelled fields read naturally.
  _placeholderText() {
    if (this._floating) return this.placeholder || ' ';
    if (this.placeholder) return this.placeholder;
    return this.label && (this.singleLine || this.variant === 'solo') ? this.label : ' ';
  }

  // A floating label already names the control, so it only needs an aria-label
  // when the label collapsed into the placeholder — or when there is no label.
  _ariaLabel() {
    if (!this._floating && this.label) return this.label;
    return this.label ? '' : this.placeholder;
  }

  _labelHtml() {
    if (!this._floating) return '';
    return `<label class="w-text-field-label" for="${this._uid()}">${this._esc(this.label)}</label>`;
  }

  /* ── Template ─────────────────────────────────────────────────────────── */

  _template() {
    return this._outerHtml(this._fieldHtml());
  }

  // Outside icons sit beside the control, so they only get a flex row when one
  // of them is actually present.
  _outerHtml(root) {
    const before = this._sideIconHtml('prepend', this.prependIcon);
    const after = this._sideIconHtml('append', this.appendIcon);
    if (!before && !after) return root;
    return `<div class="w-text-field-outer${this._cls(this._surfaceClasses())}"${this._rootStyle()}>`
      + `${before}${root}${after}</div>`;
  }

  _fieldHtml() {
    return `<div class="${this._classes()}"${this._rootStyle()}>
      <div class="w-text-field-control">
        ${this._innerHtml('prepend')}
        ${this._affixHtml('prefix')}
        <span class="w-text-field-field">
          ${this._controlHtml()}
          ${this._labelHtml()}
        </span>
        ${this._affixHtml('suffix')}
        ${this._clearHtml()}
        ${this._innerHtml('append')}
        ${this._loaderHtml()}
      </div>
      ${this._detailsHtml()}
    </div>`;
  }

  /* ── Details row (messages + counter) ─────────────────────────────────── */

  _detailsId() { return this._uid() + '-details'; }

  // The row survives an empty body whenever a rule could still fail, so
  // `_syncDetails` always has somewhere to write without a destructive
  // re-render (which would interrupt typing).
  _detailsHtml() {
    if (this._detailsHidden()) return '';
    const body = this._detailsBody();
    if (!body && !this._validatable()) return '';
    return `<div class="w-text-field-details" id="${this._detailsId()}">${body}</div>`;
  }

  _detailsHidden() {
    const raw = this.getAttribute('hide-details');
    if (raw == null || raw === 'false') return false;
    if (raw !== 'auto') return true;
    return !this._detailsBody();
  }

  _validatable() {
    return this.hasAttribute('required') || this.hasAttribute('pattern');
  }

  _detailsBody() {
    return this._messagesHtml() + this._counterHtml();
  }

  _messagesHtml() {
    const errors = this._activeErrors();
    if (errors.length) return this._messageSpan(errors, true);
    const list = this._hintList();
    return list.length ? this._messageSpan(list, false) : '';
  }

  // The hint leads, then any `messages`; both are advisory copy.
  _hintList() {
    return this.hint ? [this.hint].concat(this.messages) : this.messages;
  }

  _messageSpan(list, isError) {
    const cls = this._cls({ 'w-text-field-messages--error': isError });
    const role = isError ? ' role="alert"' : '';
    const text = list.map((item) => this._esc(item)).join('<br>');
    return `<span class="w-text-field-messages${cls}"${role}>${text}</span>`;
  }

  _counterHtml() {
    if (!this.counter) return '';
    return `<span class="w-text-field-counter">${this._counterText()}</span>`;
  }

  _counterText() {
    const len = this._controlValue().length;
    return this.counterMax ? `${len} / ${this.counterMax}` : String(len);
  }

  /* ── Validation ───────────────────────────────────────────────────────── */

  _hasError() {
    return !!this.error || this._activeErrors().length > 0;
  }

  _activeErrors() {
    const listed = this.error ? [this.error] : [];
    return listed.concat(this.errorMessages, this._ruleErrors()).slice(0, this.maxErrors);
  }

  // The built-in checks stay quiet until the configured `validate-on` trigger
  // has fired, so a pristine field is never shown as invalid.
  _ruleErrors() {
    if (!this._validated) return [];
    const value = this.validationValue;
    const errors = [];
    if (this.hasAttribute('required') && !value) errors.push('This field is required.');
    const pattern = this._attr('pattern', '');
    if (pattern && value && !new RegExp(`^(?:${pattern})$`).test(value)) errors.push('Invalid format.');
    return errors;
  }

  _bindValidation(control) {
    const triggers = this.validateOn.split(/\s+/).filter(Boolean);
    const targets = { input: control, 'invalid-input': control, blur: control, submit: this.closest('form') };
    TF_TRIGGERS.forEach((name) => this._bindTrigger(name, targets[name], triggers));
    if (triggers.includes('eager')) this._markValidated();
  }

  _bindTrigger(name, target, triggers) {
    if (!target || !triggers.includes(name)) return;
    const domEvent = name === 'invalid-input' ? 'input' : name;
    target.addEventListener(domEvent, () => this._markValidated());
  }

  _markValidated() {
    this._validated = true;
    this._syncDetails();
  }

  /* ── Events ───────────────────────────────────────────────────────────── */

  _events() {
    const control = this._control();
    if (!control) return;

    control.addEventListener('input', (event) => {
      event.stopPropagation();
      this._value = control.value;
      this._silentSet('value', control.value);
      this._sync();
      this._emit('input', { value: control.value, name: this.name });
    });
    control.addEventListener('change', (event) => {
      event.stopPropagation();
      this._emit('change', { value: control.value, name: this.name });
    });

    this._bindClear(control);
    this._bindValidation(control);
    this._sync();
  }

  _bindClear(control) {
    const clearBtn = this._q('.w-text-field-clear');
    if (!clearBtn) return;
    clearBtn.addEventListener('click', () => {
      control.value = '';
      this._value = '';
      this._silentSet('value', '');
      this._sync();
      control.focus();
      this._emit('input', { value: '', name: this.name });
      this._emit('clear', { name: this.name });
    });
  }

  // Update value-derived UI without re-rendering (which would break typing).
  _sync() {
    const root = this._q('.w-text-field');
    if (root) root.classList.toggle('w-text-field--has-value', this._isDirty());
    this._syncDetails();
  }

  _syncDetails() {
    const details = this._q('.w-text-field-details');
    if (details) details.innerHTML = this._detailsBody();
    const root = this._q('.w-text-field');
    if (root) root.classList.toggle('w-text-field--error', this._hasError());
    const control = this._control();
    if (control) this._syncInvalid(control);
  }

  _syncInvalid(control) {
    if (this._hasError()) control.setAttribute('aria-invalid', 'true');
    else control.removeAttribute('aria-invalid');
  }

  focus() {
    const control = this._control();
    if (control) control.focus();
  }
}

if (!customElements.get('w-text-field')) customElements.define('w-text-field', WTextField);
