/* <w-slider> — single-thumb slider web component, mirroring Vuetify's
 * <v-slider>.
 *
 * A native <input type="range"> rides on a styled rail; the segment up to the
 * thumb is filled. Optional label, value bubble, tick marks, tick labels,
 * vertical orientation, and theming via the design tokens.
 *
 * Attributes:
 *   min, max      - bounds (default 0 / 100)
 *   value         - current value (default min)
 *   step          - increment (default 1)
 *   label         - field label
 *   hint          - helper text shown below; defaults to the current value
 *   hide-details  - hide the message/value row
 *   disabled      - non-interactive and dimmed
 *   readonly      - non-interactive but not dimmed
 *   direction     - "horizontal" (default) | "vertical"
 *   reverse       - flip the track so the max is at the start
 *   thumb-label   - show a value bubble on interaction; "always" keeps it shown
 *   ticks         - draw a tick at every step; "always" is treated as on
 *   tick-labels   - pipe-separated labels placed at each step (implies ticks)
 *   color         - token color name for the fill + thumb (e.g. "success")
 *   track-color   - token color name for the unfilled rail
 *   size          - xs | sm | lg | xl (omit for the default)
 *   name          - form field name
 *
 * Events:
 *   input  - { value, name } while dragging
 *   change - { value, name } on commit
 */

class WSlider extends WElement {
  static attrs = [
    'min', 'max', 'value', 'step', 'label', 'hint', 'hide-details',
    'disabled', 'readonly', 'direction', 'reverse', 'thumb-label',
    'ticks', 'tick-labels', 'color', 'track-color', 'size', 'name',
  ];

  get min()      { return Number(this._attr('min', '0')); }
  get max()      { return Number(this._attr('max', '100')); }
  get step()     { return this._attr('step', '1'); }
  get stepNum()  { const s = Number(this.step); return s > 0 ? s : 1; }
  get value()    { return this._value !== undefined ? this._value : this._attr('value', String(this.min)); }
  set value(v)   {
    this._value = String(v);
    const input = this._q('input');
    if (input) input.value = this._value;
    this._silentSet('value', this._value);
    this._update();
  }
  get valueNum() { const n = Number(this.value); return Number.isFinite(n) ? n : this.min; }
  get label()    { return this._attr('label', ''); }
  get hint()     { return this._attr('hint', ''); }
  get hideDetails() { return this._bool('hide-details'); }
  get disabled() { return this._bool('disabled'); }
  get readonly() { return this._bool('readonly'); }
  get vertical() { return this._attr('direction', '') === 'vertical' || this._bool('vertical'); }
  get reverse()  { return this._bool('reverse'); }
  get size()     { return this._attr('size', ''); }
  get name()     { return this._attr('name', ''); }
  get color()       { return this._attr('color', ''); }
  get trackColor()  { return this._attr('track-color', ''); }
  get thumbLabel() {
    const v = this.getAttribute('thumb-label');
    if (v === null) return false;
    return v === 'always' ? 'always' : true;
  }
  get tickLabels() {
    const v = this.getAttribute('tick-labels');
    return v === null ? null : v.split('|');
  }
  get ticks() {
    if (this.tickLabels) return true;
    const v = this.getAttribute('ticks');
    if (v === null) return false;
    return true;
  }

  _pct(v) {
    const span = this.max - this.min;
    const raw = span === 0 ? 0 : ((v - this.min) / span) * 100;
    return this.reverse ? 100 - raw : raw;
  }

  _ticksHtml() {
    if (!this.ticks) return '';
    const span = this.max - this.min;
    const count = Math.round(span / this.stepNum);
    // Skip when the step would produce no ticks or an unreasonable number.
    if (count < 1 || count > 100) return '';
    const labels = this.tickLabels;
    let marks = '';
    for (let i = 0; i <= count; i++) {
      const value = this.min + i * this.stepNum;
      const label = labels && labels[i] !== undefined
        ? `<span class="w-slider-tick-label">${this._esc(labels[i])}</span>` : '';
      marks += `<span class="w-slider-tick" style="--pos:${this._pct(value)}%">${label}</span>`;
    }
    return `<span class="w-slider-ticks${labels ? ' w-slider-ticks--labelled' : ''}" aria-hidden="true">${marks}</span>`;
  }

  _thumbLabelHtml() {
    if (!this.thumbLabel) return '';
    return `<span class="w-slider-thumb-label" style="--pos:${this._pct(this.valueNum)}%">${this._esc(this.value)}</span>`;
  }

  _colorVars() {
    const vars = [`--value:${this._pct(this.valueNum)}%`];
    if (this.color) vars.push(`--w-slider-color:var(--w-${this._esc(this.color)})`);
    if (this.trackColor) vars.push(`--w-slider-track-color:var(--w-${this._esc(this.trackColor)})`);
    return vars.join(';');
  }

  _template() {
    const cls = [
      'w-field', 'w-slider-field',
      this.size ? 'w-slider-field--' + this.size : '',
      this.vertical ? 'w-slider-field--vertical' : '',
      this.reverse ? 'w-slider-field--reverse' : '',
      this.disabled ? 'w-slider-field--disabled' : '',
      this.readonly ? 'w-slider-field--readonly' : '',
      this.thumbLabel ? 'w-slider-field--thumb-label' : '',
      this.thumbLabel === 'always' ? 'w-slider-field--thumb-label-always' : '',
    ].filter(Boolean).join(' ');

    const range = `min="${this.min}" max="${this.max}" step="${this._esc(this.step)}"`;
    const dis = this.disabled || this.readonly ? ' disabled' : '';
    const nm = this.name ? ` name="${this._esc(this.name)}"` : '';
    const aria = this.label ? ` aria-label="${this._esc(this.label)}"` : '';
    const details = this.hideDetails ? '' :
      `<span class="w-messages">${this._esc(this.hint || this.value)}</span>`;

    return `<label class="${cls}">
      ${this.label ? `<span class="w-label">${this._esc(this.label)}</span>` : ''}
      <span class="w-slider-control" style="${this._colorVars()}">
        <span class="w-slider-rail" aria-hidden="true"><span class="w-slider-fill"></span></span>
        ${this._ticksHtml()}
        <input class="w-slider-input" type="range" ${range} value="${this._esc(this.value)}"${aria}${dis}${nm}>
        ${this._thumbLabelHtml()}
      </span>
      ${details}
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

    this._update();
  }

  _update() {
    const control = this._q('.w-slider-control');
    if (control) control.style.setProperty('--value', `${this._pct(this.valueNum)}%`);

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
