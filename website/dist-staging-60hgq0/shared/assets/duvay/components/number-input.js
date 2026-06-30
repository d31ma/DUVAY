/* <w-number-input> — numeric input with stepper controls.
 *
 * Mirrors Vuetify's <v-number-input> (https://vuetifyjs.com/en/components/number-inputs).
 *
 * Attributes:
 *   value / model-value  - current number (clamped to min/max)
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
 * Events:
 *   w-input             - { value } on each keystroke (parsed number or NaN)
 *   w-change            - { value } on commit/step (number or null)
 *   update:model-value  - { value } mirror of w-change
 *
 * The +/- buttons step once on press, then auto-repeat (accelerating) while
 * held; releasing or hitting a bound stops the run. See _holdStart.
 */

export class WNumberInput extends WElement {
  static attrs = ['value', 'min', 'max', 'step', 'label', 'placeholder', 'hint', 'error', 'name',
    'disabled', 'readonly', 'size', 'precision', 'min-fraction-digits', 'decimal-separator',
    'grouping', 'group-separator', 'control-variant', 'inset', 'hide-input', 'reverse'];

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
  get readonly() { return this._bool('readonly'); }
  get controlsDisabled() { return this.disabled || this.readonly; }

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
    const sizeClass = this.size ? ' w-input--' + this.size : '';
    const minAttr = this.hasAttribute('min') ? ` min="${this._esc(this.getAttribute('min'))}"` : '';
    const maxAttr = this.hasAttribute('max') ? ` max="${this._esc(this.getAttribute('max'))}"` : '';
    const ph = this.placeholder ? ` placeholder="${this._esc(this.placeholder)}"` : '';
    const nm = this.name ? ` name="${this._esc(this.name)}"` : '';

    const input = `<input class="w-input${sizeClass}" type="text" inputmode="decimal"`
      + ` value="${this._esc(this._format(this.model))}"${minAttr}${maxAttr} step="${this.step}"${ph}${nm}`
      + `${this.disabled ? ' disabled' : ''}${this.readonly ? ' readonly' : ''} data-w-number-input>`;

    const dec = this._btn('-1', variant === 'split' ? 'minus' : 'chevron-down');
    const inc = this._btn('1', variant === 'split' ? 'plus' : 'chevron-up');

    let inner;
    if (variant === 'hidden') {
      inner = input;
    } else if (variant === 'split') {
      inner = this.reverse ? `${inc}${input}${dec}` : `${dec}${input}${inc}`;
    } else {
      const group = `<span class="w-number-input-control">${variant === 'stacked' ? inc + dec : dec + inc}</span>`;
      inner = this.reverse ? `${group}${input}` : `${input}${group}`;
    }

    const classes = [
      'w-field', 'w-number-input', 'w-number-input--' + variant,
      this.inset ? 'w-number-input--inset' : '',
      this.hideInput ? 'w-number-input--hide-input' : '',
      this.reverse ? 'w-number-input--reverse' : '',
      this.error ? 'w-field-error' : '',
    ].filter(Boolean).join(' ');

    const message = this.error || this.hint;
    return `<label class="${classes}">`
      + (this.label ? `<span class="w-label">${this._esc(this.label)}</span>` : '')
      + `<span class="w-number-input-field">${inner}</span>`
      + (message ? `<span class="w-field-hint">${this._esc(message)}</span>` : '')
      + `</label>`;
  }

  _btn(step, icon) {
    const blocked = (step === '1' ? !this.canIncrease : !this.canDecrease);
    const label = step === '1' ? 'Increase' : 'Decrease';
    return `<button type="button" class="w-number-input-btn" data-step="${step}" tabindex="-1"`
      + ` aria-label="${label}" aria-hidden="true"${blocked ? ' disabled' : ''}>${this._icon(icon)}</button>`;
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
      input.addEventListener('input', () => this._emit('w-input', { value: this._parse(input.value) }));
      input.addEventListener('change', () => {
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
    this._emit('w-change', { value: rounded });
  }

  _syncButtons() {
    const up = this._q('[data-step="1"]');
    const down = this._q('[data-step="-1"]');
    if (up) up.disabled = !this.canIncrease;
    if (down) down.disabled = !this.canDecrease;
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
      s = s.replace(/,/g, ' ').replace(/\./g, dec || '.').replace(/ /g, grp || ',');
    }
    return s;
  }
}

if (!customElements.get('w-number-input')) customElements.define('w-number-input', WNumberInput);
