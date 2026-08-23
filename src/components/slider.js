/* <w-slider> — single-thumb slider web component, mirroring Vuetify's
 * <v-slider>.
 *
 * A native <input type="range"> rides on a styled rail; the segment up to the
 * thumb is filled. Optional label, value bubble, tick marks, tick labels,
 * vertical orientation, and theming via the design tokens.
 *
 * `WSliderBase` below carries the surface that <w-slider> and <w-range-slider>
 * share — geometry, ticks, colours, icons, messages and validation — so the two
 * elements stay attribute-compatible without duplicating the implementation.
 *
 * Attributes:
 *   min, max      - bounds (default 0 / 100)
 *   value         - current value (default min)
 *   step          - increment (default 1)
 *   label         - field label
 *   hint          - helper text shown below; defaults to the current value
 *   persistent-hint - keep the hint visible while an error is shown
 *   hide-details  - hide the message/value row ("auto" keeps it when non-empty)
 *   indent-details - inset the details row to line up with the control
 *   disabled      - non-interactive and dimmed
 *   readonly      - non-interactive but not dimmed
 *   direction     - "horizontal" (default) | "vertical"
 *   reverse       - flip the track so the max is at the start
 *   thumb-label   - show a value bubble on interaction; "always" keeps it shown
 *   thumb-color   - token colour (or CSS colour) for the thumb
 *   thumb-size    - thumb diameter (bare number = px)
 *   ticks         - draw a tick at every step; also accepts a JSON array of
 *                   values (`[0,25,50]`) or a JSON label map (`{"0":"Low"}`)
 *   show-ticks    - show ticks on interaction; "always" keeps them visible
 *   tick-labels   - pipe-separated labels placed at each step (implies ticks)
 *   tick-size     - tick diameter (bare number = px)
 *   color         - token color name for the fill + thumb (e.g. "success")
 *   track-color   - token color name for the unfilled rail
 *   track-fill-color - token color name for the filled run (wins over color)
 *   track-size    - rail thickness (bare number = px)
 *   size          - xs | sm | lg | xl (omit for the default)
 *   name          - form field name
 *   prepend-icon / append-icon - icons rendered outside the control
 *   icon-color    - colour for those icons
 *   glow / center-affix / hide-spin-buttons - field surface modifiers
 *   ripple        - press feedback on the control
 *   no-keyboard   - swallow keyboard interaction
 *   error         - manual error state
 *   messages      - helper messages below the control (comma or JSON list)
 *   error-messages - error messages; also sets the error state
 *   max-errors    - how many error messages are shown (default 1)
 *   validate-on   - eager (default) | lazy | blur | input | submit
 *   validation-value - value the range rule checks instead of the live value
 *
 * Events:
 *   input  - { value, name } while dragging
 *   change - { value, name } on commit
 */

import WIcons from '../icons.js';
import { wNumberList, wValueList } from './utils.js';

/* Shared surface for the single- and dual-thumb sliders. Never registered as a
   custom element on its own. */
export class WSliderBase extends WElement {
  static attrs = [
    'min', 'max', 'step', 'label', 'name', 'direction', 'reverse', 'size',
    'color', 'track-color', 'track-fill-color', 'track-size',
    'thumb-label', 'thumb-color', 'thumb-size',
    'ticks', 'show-ticks', 'tick-labels', 'tick-size',
    'hint', 'persistent-hint', 'hide-details', 'indent-details',
    'messages', 'error', 'error-messages', 'max-errors', 'validate-on',
    'validation-value', 'center-affix', 'glow', 'icon-color',
    'prepend-icon', 'append-icon', 'hide-spin-buttons', 'ripple', 'no-keyboard',
  ];

  /* ── Geometry ───────────────────────────────────────────────────────────── */

  get min()      { return Number(this._attr('min', '0')); }
  get max()      { return Number(this._attr('max', '100')); }
  get step()     { return this._attr('step', '1'); }
  get stepNum()  { const s = Number(this.step); return s > 0 ? s : 1; }
  get label()    { return this._attr('label', ''); }
  get name()     { return this._attr('name', ''); }
  get size()     { return this._attr('size', ''); }
  get disabled() { return this._bool('disabled'); }
  set disabled(value) { this.toggleAttribute('disabled', !!value); }
  get readonly() { return this._bool('readonly'); }
  set readonly(value) { this.toggleAttribute('readonly', !!value); }
  get vertical() { return this._attr('direction', '') === 'vertical' || this._bool('vertical'); }
  get reverse()  { return this._bool('reverse'); }

  _pct(v) {
    const span = this.max - this.min;
    const raw = span === 0 ? 0 : ((v - this.min) / span) * 100;
    return this.reverse ? 100 - raw : raw;
  }

  /* ── Presentation ───────────────────────────────────────────────────────── */

  get color()          { return this._attr('color', ''); }
  get trackColor()     { return this._attr('track-color', ''); }
  get trackFillColor() { return this._attr('track-fill-color', ''); }
  get thumbColor()     { return this._attr('thumb-color', ''); }
  get thumbSize()      { return this._attr('thumb-size', ''); }
  get trackSize()      { return this._attr('track-size', ''); }
  get tickSize()       { return this._attr('tick-size', ''); }
  get iconColor()      { return this._attr('icon-color', ''); }
  get prependIcon()    { return this._attr('prepend-icon', ''); }
  get appendIcon()     { return this._attr('append-icon', ''); }
  get glow()           { return this._bool('glow'); }
  get centerAffix()    { return this._bool('center-affix'); }
  get indentDetails()  { return this._bool('indent-details'); }
  get hideSpinButtons(){ return this._bool('hide-spin-buttons'); }
  get noKeyboard()     { return this._bool('no-keyboard'); }
  get ripple()         { return this.hasAttribute('ripple') && this.getAttribute('ripple') !== 'false'; }

  get thumbLabel() {
    const v = this.getAttribute('thumb-label');
    if (v === null) return false;
    return v === 'always' ? 'always' : true;
  }

  get showTicks() {
    const v = this.getAttribute('show-ticks');
    if (v === null) return false;
    return v === 'always' ? 'always' : true;
  }

  get tickLabels() {
    const v = this.getAttribute('tick-labels');
    return v === null ? null : v.split('|');
  }

  // A bare word reads as a design token; anything else as a literal CSS colour.
  _token(value) {
    if (!value) return '';
    const text = String(value);
    return /^[a-z][a-z0-9-]*$/i.test(text) ? `var(--w-${text})` : text.replace(/[^\w#(),.%\s-]/g, '');
  }

  // A bare number reads as px; anything else passes through as a CSS length.
  _len(value) {
    if (!value) return '';
    const text = String(value);
    return /^\d+(\.\d+)?$/.test(text) ? `${text}px` : text.replace(/[^\w.%\s()-]/g, '');
  }

  // Custom properties the sliders' CSS reads off the control element. Both
  // elements share the `--w-slider-*` names so one rule set serves both.
  _controlVars(extra = []) {
    const pairs = [
      ['--w-slider-color', this._token(this.trackFillColor || this.color)],
      ['--w-slider-track-color', this._token(this.trackColor)],
      ['--w-slider-thumb-color', this._token(this.thumbColor)],
      ['--w-slider-icon-color', this._token(this.iconColor)],
      ['--w-slider-thumb-size', this._len(this.thumbSize)],
      ['--w-slider-track-size', this._len(this.trackSize)],
      ['--w-slider-tick-size', this._len(this.tickSize)],
    ];
    return extra
      .concat(pairs.filter((pair) => pair[1]).map((pair) => `${pair[0]}:${pair[1]}`))
      .join(';');
  }

  /* ── Ticks ──────────────────────────────────────────────────────────────── */

  get ticksOn() {
    if (this.tickLabels) return true;
    if (this.getAttribute('ticks') !== null) return true;
    return this.showTicks !== false;
  }

  // `[{ value, label }]` for the marks to draw. `ticks` accepts a JSON array of
  // values or a JSON `{ value: label }` map; anything else falls back to one
  // tick per step.
  _tickEntries() {
    const raw = (this.getAttribute('ticks') || '').trim();
    if (raw.startsWith('{')) return this._tickMap(raw);
    if (raw.startsWith('[')) return wNumberList(raw).map((value) => ({ value, label: '' }));
    return this._stepTicks();
  }

  _tickMap(raw) {
    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return this._stepTicks();
    }
    return Object.keys(parsed || {})
      .map((key) => ({ value: Number(key), label: String(parsed[key]) }))
      .filter((tick) => Number.isFinite(tick.value));
  }

  _stepTicks() {
    const count = Math.round((this.max - this.min) / this.stepNum);
    // Skip when the step would produce no ticks or an unreasonable number.
    if (count < 1 || count > 100) return [];
    const labels = this.tickLabels;
    const marks = [];
    for (let i = 0; i <= count; i += 1) {
      marks.push({ value: this.min + i * this.stepNum, label: (labels && labels[i]) || '' });
    }
    return marks;
  }

  _visibleTicks() {
    return this.ticksOn ? this._tickEntries() : [];
  }

  /* ── Icons ──────────────────────────────────────────────────────────────── */

  _sideIconHtml(side, name) {
    if (!name) return '';
    const icon = WIcons.resolve(name, { iconClass: 'w-icon w-slider-icon' });
    return `<span class="w-slider-${side}">${icon}</span>`;
  }

  // Wraps the control in a flex row only when there is an outside icon to place.
  _withSideIcons(control) {
    const before = this._sideIconHtml('prepend', this.prependIcon);
    const after = this._sideIconHtml('append', this.appendIcon);
    if (!before && !after) return control;
    return `<span class="w-slider-outer">${before}${control}${after}</span>`;
  }

  /* ── Messages and validation ────────────────────────────────────────────── */

  get hint()           { return this._attr('hint', ''); }
  get persistentHint() { return this._bool('persistent-hint'); }
  get error()          { return this._bool('error'); }
  get messages()       { return wValueList(this._attr('messages', '')); }
  get errorMessages()  { return wValueList(this._attr('error-messages', '')); }
  get maxErrors()      { return Number(this._attr('max-errors', '1')) || 1; }
  get validateOn()     { return this._attr('validate-on', 'eager'); }

  get hideDetails() {
    const raw = this.getAttribute('hide-details');
    if (raw == null || raw === 'false') return false;
    if (raw !== 'auto') return true;
    return !this._messageItemsHtml();
  }

  // The text shown when there is no hint — the live value(s). Subclasses override.
  _currentText() { return ''; }

  // The same value(s) in a machine-readable, comma-separated form.
  _currentValue() { return ''; }

  _validationValue() {
    const raw = this.getAttribute('validation-value');
    return raw === null ? this._currentValue() : raw;
  }

  // The only built-in rule: every validated number must sit inside min/max.
  _ruleErrors() {
    const values = wNumberList(this._validationValue(), []);
    const bad = values.some((n) => n < this.min || n > this.max);
    return bad ? ['Value is out of range'] : [];
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

  _shownErrors() {
    if (!this._errorsVisible()) return [];
    return this.errorMessages.concat(this._ruleErrors()).slice(0, this.maxErrors);
  }

  _errorText() { return this._shownErrors()[0] || ''; }
  _hasError()  { return this.error || this._shownErrors().length > 0; }

  _messageItemsHtml() {
    const errors = this._shownErrors();
    const list = errors.length ? errors : this.messages;
    const cls = errors.length ? ' w-slider-message--error' : '';
    return list.map((text) => `<span class="w-slider-message${cls}">${this._esc(text)}</span>`).join('');
  }

  // The value/hint row stays in the DOM but hides behind an error unless
  // `persistent-hint` asks for both.
  _primaryMessageHtml() {
    const hidden = this._errorText() && !this.persistentHint;
    return `<span class="w-messages"${hidden ? ' hidden' : ''}>${this._esc(this.hint || this._currentText())}</span>`;
  }

  _detailsHtml() {
    if (this.hideDetails) return '';
    return `${this._primaryMessageHtml()}<span class="w-slider-details">${this._messageItemsHtml()}</span>`;
  }

  _syncDetails() {
    const details = this._q('.w-slider-details');
    if (details) details.innerHTML = this._messageItemsHtml();
    const primary = this._q('.w-messages');
    if (primary) primary.hidden = !!this._errorText() && !this.persistentHint;
    const root = this.firstElementChild;
    if (root) root.classList.toggle('w-slider-surface--error', this._hasError());
  }

  /* ── Shared modifiers and wiring ────────────────────────────────────────── */

  _surfaceCls() {
    return ' w-slider-surface' + this._cls({
      'w-slider-surface--error': this._hasError(),
      'w-slider-surface--glow': this.glow,
      'w-slider-surface--center-affix': this.centerAffix,
      'w-slider-surface--indent-details': this.indentDetails,
      'w-slider-surface--hide-spin-buttons': this.hideSpinButtons,
      'w-slider-surface--persistent-hint': this.persistentHint,
      'w-slider-surface--ticks-hover': this.showTicks === true,
      'w-slider-surface--ticks-always': this.showTicks === 'always',
      'w-slider-surface--ripple': this.ripple,
    });
  }

  // ARIA the native range already implies, restated so assistive tech reads the
  // same bounds the component renders.
  _rangeAria(now) {
    return this._attrs({
      role: 'slider',
      'aria-valuemin': String(this.min),
      'aria-valuemax': String(this.max),
      'aria-valuenow': String(now),
      'aria-invalid': this._hasError() ? 'true' : '',
    });
  }

  _bindSurface(inputs) {
    if (this.ripple) this._attachRipple(this._q('.w-slider-control, .w-range-slider-control'));
    inputs.forEach((input) => {
      input.addEventListener('keydown', (event) => this._guardKeyboard(event));
      input.addEventListener('input', () => { this._touched = true; this._syncDetails(); });
      input.addEventListener('blur', () => { this._blurred = true; this._syncDetails(); });
    });

    const form = this.closest('form');
    if (form && !this._submitBound) {
      this._submitBound = true;
      form.addEventListener('submit', () => { this._submitted = true; this._syncDetails(); });
    }
  }

  _guardKeyboard(event) {
    if (!this.noKeyboard) return;
    event.preventDefault();
    event.stopPropagation();
  }
}

class WSlider extends WSliderBase {
  static attrs = [
    'min', 'max', 'value', 'step', 'label', 'hint', 'hide-details',
    'disabled', 'readonly', 'direction', 'reverse', 'thumb-label',
    'ticks', 'tick-labels', 'color', 'track-color', 'size', 'name',
  ];

  get value()    { return this._value !== undefined ? this._value : this._attr('value', String(this.min)); }
  set value(v)   {
    this._value = String(v);
    const input = this._q('input');
    if (input) input.value = this._value;
    this._silentSet('value', this._value);
    this._update();
  }
  get valueNum() { const n = Number(this.value); return Number.isFinite(n) ? n : this.min; }

  _currentText()  { return this.value; }
  _currentValue() { return this.value; }

  _ticksHtml() {
    const ticks = this._visibleTicks();
    if (!ticks.length) return '';
    const labelled = ticks.some((tick) => tick.label);
    const marks = ticks.map((tick) => this._tickHtml(tick)).join('');
    return `<span class="w-slider-ticks${labelled ? ' w-slider-ticks--labelled' : ''}" aria-hidden="true">${marks}</span>`;
  }

  _tickHtml(tick) {
    const label = tick.label ? `<span class="w-slider-tick-label">${this._esc(tick.label)}</span>` : '';
    return `<span class="w-slider-tick" style="--pos:${this._pct(tick.value)}%">${label}</span>`;
  }

  _thumbLabelHtml() {
    if (!this.thumbLabel) return '';
    return `<span class="w-slider-thumb-label" style="--pos:${this._pct(this.valueNum)}%">${this._esc(this.value)}</span>`;
  }

  _colorVars() {
    return this._controlVars([`--value:${this._pct(this.valueNum)}%`]);
  }

  _fieldClass() {
    return 'w-field w-slider-field' + this._cls({
      ['w-slider-field--' + this.size]: this.size,
      'w-slider-field--vertical': this.vertical,
      'w-slider-field--reverse': this.reverse,
      'w-slider-field--disabled': this.disabled,
      'w-slider-field--readonly': this.readonly,
      'w-slider-field--thumb-label': this.thumbLabel,
      'w-slider-field--thumb-label-always': this.thumbLabel === 'always',
    }) + this._surfaceCls();
  }

  _inputAttrs() {
    return this._attrs({
      'aria-label': this.label,
      disabled: this.disabled || this.readonly,
      name: this.name,
    }) + this._rangeAria(this.value);
  }

  _labelHtml() {
    return this.label ? `<span class="w-label">${this._esc(this.label)}</span>` : '';
  }

  _controlHtml() {
    const range = `min="${this.min}" max="${this.max}" step="${this._esc(this.step)}"`;
    return `<span class="w-slider-control" style="${this._colorVars()}">
        <span class="w-slider-rail" aria-hidden="true"><span class="w-slider-fill"></span></span>
        ${this._ticksHtml()}
        <input class="w-slider-input" type="range" ${range} value="${this._esc(this.value)}"${this._inputAttrs()}>
        ${this._thumbLabelHtml()}
      </span>`;
  }

  _template() {
    return `<label class="${this._fieldClass()}">
      ${this._labelHtml()}
      ${this._withSideIcons(this._controlHtml())}
      ${this._detailsHtml()}
    </label>`;
  }

  _events() {
    const input = this._q('input');
    if (!input) return;

    input.addEventListener('input', (event) => {
      event.stopPropagation();
      this._value = input.value;
      this._silentSet('value', input.value);
      this._update();
      this._emit('input', { value: input.value, name: this.name });
    });
    input.addEventListener('change', (event) => {
      event.stopPropagation();
      this._emit('change', { value: input.value, name: this.name });
    });

    this._bindSurface([input]);
    this._update();
  }

  _update() {
    const control = this._q('.w-slider-control');
    if (control) control.style.setProperty('--value', `${this._pct(this.valueNum)}%`);

    const input = this._q('.w-slider-input');
    if (input) input.setAttribute('aria-valuenow', this.value);

    const bubble = this._q('.w-slider-thumb-label');
    if (bubble) {
      bubble.textContent = this.value;
      bubble.style.setProperty('--pos', `${this._pct(this.valueNum)}%`);
    }

    if (!this.hideDetails && !this.hint) {
      const msg = this._q('.w-messages');
      if (msg) msg.textContent = this.value;
    }
  }
}

customElements.define('w-slider', WSlider);
