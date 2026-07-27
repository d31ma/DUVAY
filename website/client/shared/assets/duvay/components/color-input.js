/* <w-color-input> — DuVay component module
 *
 * A colour field: a pip (the native <input type="color">) beside a text input
 * that shows the value in the chosen `mode`, plus optional swatches, message /
 * counter details, and an inline <w-color-picker> panel.
 *
 * Value:
 *   value            - the colour (hex; the canonical/native value)
 *   mode             - hex (default) | rgb | hsl (text field display + change)
 *   swatches         - comma or JSON list of preset hex colours
 *   show-swatches    - show the swatch row (implied when swatches given)
 *
 * Field surface:
 *   label, title, placeholder, prefix, suffix, type, name, autocomplete
 *   variant          - outlined | filled | underlined | plain | solo |
 *                      solo-inverted | solo-filled
 *   flat             - drop the variant's elevation
 *   reverse          - reverse the control orientation
 *   single-line      - no separate label; the label becomes the placeholder
 *   persistent-placeholder - keep the placeholder visible when not focused
 *   center-affix     - vertically centre the affixes and icons
 *   active, dirty    - manual state styling
 *   glow             - full-opacity, coloured icons while focused
 *   icon-color       - colour token for the prepend/append icons
 *   hide-spin-buttons - hide the native spinners when type="number"
 *   autofocus, disabled, readonly
 *
 * Icons and pip:
 *   prepend-icon, append-icon, prepend-inner-icon, append-inner-icon
 *   hide-pip, color-pip, pip-icon, pip-location, pip-variant
 *   clearable, clear-icon, persistent-clear
 *
 * Details:
 *   hint, persistent-hint, messages, error, error-messages, max-errors,
 *   validate-on, validation-value, counter, persistent-counter,
 *   hide-details (true | auto), indent-details
 *
 * Picker panel (rendered when `picker` is set):
 *   picker, picker-props, hide-actions, ok-text, cancel-text, canvas-height,
 *   dot-size, divided, hide-header, hide-title, hide-canvas, hide-sliders,
 *   hide-inputs, hide-input-labels, modes, swatches-max-height, landscape,
 *   hide-eye-dropper, eye-dropper-icon
 *
 * Events:
 *   change - the colour changed (detail: { value } in the mode format)
 *   clear  - the clear button was pressed (detail: { value: '' })
 */
import WIcons from '../icons.js';
import { wValueList } from './utils.js';

const PIP_LOCATIONS = ['prepend', 'append', 'prepend-inner', 'append-inner'];

/* Attributes handed straight through to the nested <w-color-picker>. */
const PICKER_ATTRS = [
  'canvas-height', 'dot-size', 'divided', 'hide-header', 'hide-title', 'hide-canvas',
  'hide-sliders', 'hide-inputs', 'hide-input-labels', 'modes', 'swatches-max-height',
  'landscape', 'hide-eye-dropper', 'eye-dropper-icon',
];

const VALIDATION_TRIGGERS = ['input', 'invalid-input', 'blur', 'submit'];

let colorInputUid = 0;

export class WColorInput extends WElement {
  static attrs = [
    'value', 'label', 'swatches', 'show-swatches', 'mode', 'disabled',
    'title', 'type', 'name', 'placeholder', 'prefix', 'suffix', 'variant', 'flat',
    'reverse', 'active', 'dirty', 'glow', 'icon-color', 'autocomplete', 'autofocus',
    'single-line', 'persistent-placeholder', 'center-affix', 'hide-spin-buttons',
    'prepend-icon', 'append-icon', 'prepend-inner-icon', 'append-inner-icon',
    'hide-pip', 'color-pip', 'pip-icon', 'pip-location', 'pip-variant',
    'clearable', 'clear-icon', 'persistent-clear',
    'hint', 'persistent-hint', 'messages', 'error', 'error-messages', 'max-errors',
    'validate-on', 'validation-value', 'counter', 'persistent-counter',
    'hide-details', 'indent-details',
    'picker', 'picker-props', 'hide-actions', 'ok-text', 'cancel-text',
    // Picker pass-through (kept literal so tooling can read the full surface;
    // PICKER_ATTRS above is what actually forwards them to <w-color-picker>).
    'canvas-height', 'dot-size', 'divided', 'hide-header', 'hide-title', 'hide-canvas',
    'hide-sliders', 'hide-inputs', 'hide-input-labels', 'modes', 'swatches-max-height',
    'landscape', 'hide-eye-dropper', 'eye-dropper-icon',
  ];

  get value() { return this._attr('value', '#6750a4'); }
  get label() { return this._attr('label', 'Color'); }
  get mode() { return this._attr('mode', 'hex'); }
  get disabled() { return this._bool('disabled'); }
  _swatches() { return wValueList(this.getAttribute('swatches')); }
  get _showSwatches() { return this.hasAttribute('show-swatches') || this._swatches().length > 0; }

  _dis() { return this.disabled ? ' disabled' : ''; }

  /* ── Template ─────────────────────────────────────────────────────────── */

  _template() {
    const hex = this.value;
    const id = this._inputId || (this._inputId = `w-color-input-${++colorInputUid}`);
    return `<div class="w-field w-color-input${this._rootClasses()}"${this._rootStyle()}>
      ${this._titleHtml()}
      ${this._labelHtml(id)}
      ${this._rowHtml(hex, id)}
      ${this._swatchesHtml(hex)}
      ${this._detailsHtml()}
      ${this._pickerHtml()}
    </div>`;
  }

  _rootClasses() {
    const variant = this._attr('variant', '');
    return this._cls({
      [`w-color-input--${variant}`]: variant,
      'w-color-input--flat': this._bool('flat'),
      'w-color-input--reverse': this._bool('reverse'),
      'w-color-input--active': this._bool('active'),
      'w-color-input--dirty': this._bool('dirty'),
      'w-color-input--glow': this._bool('glow'),
      'w-color-input--single-line': this._bool('single-line'),
      'w-color-input--center-affix': this._bool('center-affix'),
      'w-color-input--indent-details': this._bool('indent-details'),
      'w-color-input--persistent-placeholder': this._bool('persistent-placeholder'),
      'w-color-input--persistent-counter': this._bool('persistent-counter'),
      'w-color-input--persistent-hint': this._bool('persistent-hint'),
      'w-color-input--persistent-clear': this._bool('persistent-clear'),
      'w-color-input--hide-spin-buttons': this._bool('hide-spin-buttons'),
      'w-field-error': this._hasError(),
    });
  }

  /* `icon-color` accepts a token name (resolved through --w-<name>) or any raw
     CSS colour; a bare attribute means "use the primary accent". */
  _rootStyle() {
    const raw = this.getAttribute('icon-color');
    if (raw == null) return '';
    const color = this._esc(raw || 'primary');
    return ` style="--w-color-input-icon-color:var(--w-${color}, ${color})"`;
  }

  /* With a picker panel the title belongs to the picker's own header, so the
     field-level title is only drawn when there is no panel. */
  _titleHtml() {
    const title = this._attr('title', '');
    if (!title || this._bool('hide-title') || this._bool('picker')) return '';
    return `<div class="w-color-input-title">${this._esc(title)}</div>`;
  }

  _labelHtml(id) {
    if (!this.label || this._bool('single-line')) return '';
    return `<label class="w-label" for="${id}">${this._esc(this.label)}</label>`;
  }

  _rowHtml(hex, id) {
    return `<div class="w-color-input-row">
        ${this._slotHtml('prepend', hex)}
        <div class="w-color-input-control">
          ${this._slotHtml('prepend-inner', hex)}
          ${this._affixHtml('prefix')}
          ${this._textInputHtml(id)}
          ${this._affixHtml('suffix')}
          ${this._clearHtml()}
          ${this._slotHtml('append-inner', hex)}
        </div>
        ${this._slotHtml('append', hex)}
      </div>`;
  }

  /* One of the four adornment positions: its icon, plus the pip when the pip
     lives there. Rendered only when non-empty so no stray flex gap appears. */
  _slotHtml(side, hex) {
    const icon = this._iconHtml(`${side}-icon`);
    const pip = this._pipFor(side, hex);
    if (!icon && !pip) return '';
    const content = side.startsWith('prepend') ? icon + pip : pip + icon;
    return `<span class="w-color-input-${side}">${content}</span>`;
  }

  _iconHtml(attr) {
    const name = this._attr(attr, '');
    if (!name) return '';
    return WIcons.resolve(name, { iconClass: 'w-icon w-color-input-icon' });
  }

  _pipLocation() {
    const value = this._attr('pip-location', 'prepend-inner');
    return PIP_LOCATIONS.includes(value) ? value : 'prepend-inner';
  }

  _pipFor(location, hex) {
    return this._pipLocation() === location ? this._pipHtml(hex) : '';
  }

  _pipHtml(hex) {
    if (this._bool('hide-pip')) return '';
    const variant = this._attr('pip-variant', '');
    const cls = this._cls({
      [`w-color-input-pip--${variant}`]: variant,
      'w-color-input-pip--colored': this._bool('color-pip'),
    });
    return `<span class="w-color-input-pip${cls}" style="--w-color:${this._esc(hex)}">`
      + `${this._iconHtml('pip-icon')}`
      + `<input type="color" value="${this._esc(hex)}" aria-label="${this._esc(this.label || 'Color')}"${this._dis()}>`
      + `</span>`;
  }

  _affixHtml(kind) {
    const text = this._attr(kind, '');
    if (!text) return '';
    return `<span class="w-color-input-affix w-color-input-${kind}">${this._esc(text)}</span>`;
  }

  _textInputHtml(id) {
    return `<input${this._attrs({
      id,
      class: 'w-input',
      type: this._attr('type', 'text'),
      value: this._format(this.value),
      name: this._inputName(),
      placeholder: this._placeholder(),
      autocomplete: this._autocomplete(),
      disabled: this.disabled,
      readonly: this._bool('readonly'),
      autofocus: this._bool('autofocus'),
      'aria-invalid': this._hasError() && 'true',
    })}>`;
  }

  _placeholder() {
    const placeholder = this._attr('placeholder', '');
    if (placeholder) return placeholder;
    return this._bool('single-line') ? this.label : '';
  }

  /* `autocomplete="suppress"` turns the browser hint off *and* mangles the
     field name, which is what actually stops most password managers. */
  _autocomplete() {
    const value = this._attr('autocomplete', '');
    return value === 'suppress' ? 'off' : value;
  }

  _inputName() {
    const name = this._attr('name', '');
    if (this._attr('autocomplete', '') !== 'suppress') return name;
    return `${name || 'color'}-${this._inputId}`;
  }

  _clearHtml() {
    if (!this._bool('clearable') || this.disabled) return '';
    const icon = this._iconHtml('clear-icon') || '&times;';
    return `<button type="button" class="w-color-input-clear" aria-label="Clear" data-clear>${icon}</button>`;
  }

  _swatchesHtml(hex) {
    if (!this._showSwatches || !this._swatches().length) return '';
    return `<span class="w-color-input-swatches" role="group" aria-label="Color swatches">${this._swatchButtons(hex, this._dis())}</span>`;
  }

  _swatchButtons(hex, dis) {
    return this._swatches().map((c) => `<button type="button" class="w-color-swatch${c.toLowerCase() === hex.toLowerCase() ? ' selected' : ''}" style="--w-color:${this._esc(c)}" data-color="${this._esc(c)}" aria-label="${this._esc(c)}"${dis}></button>`).join('');
  }

  /* ── Details row (messages / counter) ─────────────────────────────────── */

  /* The container is kept alive whenever a message could still appear, so
     `_syncDetails` has somewhere to write without a destructive re-render. */
  _detailsHtml() {
    if (this._hideDetails()) return '';
    const body = this._detailsBody();
    if (!body && !this._validatable()) return '';
    return `<div class="w-color-input-details">${body}</div>`;
  }

  _validatable() {
    return ['required', 'pattern', 'error', 'error-messages'].some((name) => this.hasAttribute(name));
  }

  _hideDetails() {
    const raw = this.getAttribute('hide-details');
    if (raw == null) return false;
    if (raw === 'auto') return !this._messagesHtml() && !this._counterHtml();
    return raw !== 'false';
  }

  _detailsBody() {
    return this._messagesHtml() + this._counterHtml();
  }

  _messagesHtml() {
    const errors = this._activeErrors();
    if (errors.length) return this._messageSpan(errors, 'error');
    const hint = this._attr('hint', '');
    if (hint) return this._messageSpan([hint], 'hint');
    const messages = wValueList(this.getAttribute('messages'));
    return messages.length ? this._messageSpan(messages, 'info') : '';
  }

  _messageSpan(list, kind) {
    const text = list.map((item) => this._esc(item)).join('<br>');
    return `<span class="w-color-input-messages w-color-input-messages--${kind}">${text}</span>`;
  }

  _counterHtml() {
    const max = this._counterMax();
    if (max === null) return '';
    return `<span class="w-color-input-counter">${this._displayValue().length} / ${max}</span>`;
  }

  _counterMax() {
    if (!this.hasAttribute('counter')) return null;
    const raw = this.getAttribute('counter');
    if (raw && Number.isFinite(Number(raw))) return Number(raw);
    return Number(this.getAttribute('maxlength')) || 25;
  }

  /* ── Validation ───────────────────────────────────────────────────────── */

  _hasError() {
    return this._bool('error') || this._activeErrors().length > 0;
  }

  _activeErrors() {
    const listed = wValueList(this.getAttribute('error-messages'));
    return listed.concat(this._ruleErrors()).slice(0, this._maxErrors());
  }

  _maxErrors() {
    return Number(this._attr('max-errors', 1)) || 1;
  }

  _displayValue() {
    const input = this._q('.w-input');
    return input ? input.value : this._format(this.value);
  }

  _validationValue() {
    const raw = this.getAttribute('validation-value');
    return raw === null ? this._displayValue() : raw;
  }

  /* Constraint rules only run once the configured `validate-on` trigger has
     fired, so a pristine field is never shown as invalid. */
  _ruleErrors() {
    if (!this._validated) return [];
    const value = this._validationValue();
    const errors = [];
    if (this.hasAttribute('required') && !value) errors.push('This field is required.');
    const pattern = this._attr('pattern', '');
    if (pattern && value && !new RegExp(`^(?:${pattern})$`).test(value)) errors.push('Invalid format.');
    return errors;
  }

  _validateOn() {
    return this._attr('validate-on', 'input').split(' ').filter(Boolean);
  }

  _bindValidation(text) {
    const triggers = this._validateOn();
    if (triggers.includes('eager')) this._markValidated();
    const targets = { input: text, 'invalid-input': text, blur: text, submit: this.closest('form') };
    VALIDATION_TRIGGERS.forEach((name) => this._bindValidationTrigger(name, targets[name], triggers));
  }

  _bindValidationTrigger(name, target, triggers) {
    if (!target || !triggers.includes(name)) return;
    const domEvent = name === 'invalid-input' ? 'input' : name;
    target.addEventListener(domEvent, () => this._markValidated());
  }

  _markValidated() {
    this._validated = true;
    this._syncDetails();
  }

  /* ── Picker panel ─────────────────────────────────────────────────────── */

  _pickerHtml() {
    if (!this._bool('picker')) return '';
    return `<div class="w-color-input-picker">`
      + `<w-color-picker${this._attrs(this._pickerAttrMap())}></w-color-picker>`
      + `${this._actionsHtml()}</div>`;
  }

  _pickerAttrMap() {
    const map = {
      value: this.value,
      mode: this._attr('mode', ''),
      title: this._attr('title', ''),
      disabled: this.disabled,
    };
    PICKER_ATTRS.forEach((name) => {
      if (this.hasAttribute(name)) map[name] = this.getAttribute(name) || true;
    });
    return Object.assign(map, this._pickerProps());
  }

  _pickerProps() {
    const raw = this.getAttribute('picker-props');
    if (!raw) return {};
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (_) {
      return {};
    }
  }

  _actionsHtml() {
    if (this._bool('hide-actions')) return '';
    return `<div class="w-color-input-actions">`
      + `<button type="button" class="w-btn w-color-input-cancel" data-cancel>${this._esc(this._attr('cancel-text', 'Cancel'))}</button>`
      + `<button type="button" class="w-btn w-color-input-ok" data-ok>${this._esc(this._attr('ok-text', 'OK'))}</button>`
      + `</div>`;
  }

  /* ── Events ───────────────────────────────────────────────────────────── */

  _events() {
    const color = this._q('input[type="color"]');
    const text = this._q('.w-input');
    const sync = (hex) => this._commit(hex, color, text);

    color?.addEventListener('input', (event) => {
      event.stopPropagation();
      sync(color.value);
    });
    text?.addEventListener('change', (event) => {
      event.stopPropagation();
      sync(this._toHex(text.value));
    });
    text?.addEventListener('input', () => this._syncDetails());

    this._qAll('.w-color-swatch').forEach((btn) => {
      btn.addEventListener('click', () => { if (!this.disabled) sync(btn.getAttribute('data-color')); });
    });

    this._q('[data-clear]')?.addEventListener('click', () => this._clear(text));
    this._bindValidation(text);
    this._bindPicker(sync);
  }

  _commit(hex, color, text) {
    if (!hex) return;
    if (color) color.value = hex;
    if (text) text.value = this._format(hex);
    this._silentSet('value', hex);
    this._syncPip(hex);
    this._syncSwatches(hex);
    this._syncPicker(hex);
    this._syncDetails();
    this._emit('change', { value: this._format(hex) });
  }

  _clear(text) {
    if (this.disabled) return;
    if (text) text.value = '';
    this._silentSet('value', '');
    this._syncDetails();
    if (text) text.focus();
    this._emit('change', { value: '' });
    this._emit('clear', { value: '' });
  }

  _syncPip(hex) {
    const pip = this._q('.w-color-input-pip');
    if (pip) pip.style.setProperty('--w-color', hex);
  }

  _syncSwatches(hex) {
    this._qAll('.w-color-swatch').forEach((btn) => {
      btn.classList.toggle('selected', btn.getAttribute('data-color').toLowerCase() === hex.toLowerCase());
    });
  }

  _syncPicker(hex) {
    const picker = this._q('w-color-picker');
    if (picker && picker.getAttribute('value') !== hex) picker.setAttribute('value', hex);
  }

  /* Refresh the value-derived details in place — re-rendering here would blow
     away the input the user is typing into. */
  _syncDetails() {
    const details = this._q('.w-color-input-details');
    if (details) details.innerHTML = this._detailsBody();
    const root = this._q('.w-color-input');
    if (root) root.classList.toggle('w-field-error', this._hasError());
    const input = this._q('.w-input');
    if (input) input.setAttribute('aria-invalid', String(this._hasError()));
  }

  _bindPicker(sync) {
    const picker = this._q('w-color-picker');
    if (!picker) return;
    this._pickerBase = this.value;
    picker.addEventListener('change', (event) => {
      event.stopPropagation();
      sync(event.detail?.value);
    });
    this._q('[data-cancel]')?.addEventListener('click', () => sync(this._pickerBase));
    this._q('[data-ok]')?.addEventListener('click', () => this._emit('change', { value: this._format(this.value) }));
  }

  /* ── Value formatting ─────────────────────────────────────────────────── */

  /* hex → mode-formatted string (rgb/hsl); the native input always stays hex */
  _format(hex) {
    const mode = this.mode;
    if (mode !== 'rgb' && mode !== 'hsl') return hex;
    const h = String(hex).replace('#', '');
    if (h.length < 6) return hex;
    const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    if (mode === 'rgb') return `rgb(${r}, ${g}, ${b})`;
    const [hh, ss, ll] = this._rgbToHsl(r, g, b);
    return `hsl(${hh}, ${ss}%, ${ll}%)`;
  }

  _rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  }

  /* Normalise any CSS colour the user types into a hex string via the canvas. */
  _toHex(input) {
    if (!input) return '';
    try {
      const ctx = document.createElement('canvas').getContext('2d');
      ctx.fillStyle = '#000000';
      ctx.fillStyle = String(input).trim();
      return ctx.fillStyle.startsWith('#') ? ctx.fillStyle : this.value;
    } catch (_) {
      return this.value;
    }
  }
}

if (!customElements.get('w-color-input')) customElements.define('w-color-input', WColorInput);
