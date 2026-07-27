/* <w-range-slider> — dual-thumb range slider, mirroring Vuetify's
 * <v-range-slider>.
 *
 * Two range inputs share a single track; the selected segment between the
 * thumbs is highlighted. Thumbs cannot cross, and the one near the upper end
 * is raised so overlapping thumbs stay grabbable.
 *
 * Everything <w-slider> and <w-range-slider> have in common — colours, sizes,
 * ticks, icons, messages, validation — lives on `WSliderBase` in slider.js.
 *
 * Attributes (beyond the shared slider surface):
 *   start, end   - current range ends (default min / max)
 *   strict       - thumbs may not cross; DuVay always clamps, so this reflects
 *                  the default rather than switching it on
 *
 * Events:
 *   input  - { start, end } while dragging
 *   change - { start, end } on commit
 */

import { WSliderBase } from './slider.js';

export class WRangeSlider extends WSliderBase {
  static attrs = ['min', 'max', 'start', 'end', 'step', 'label', 'disabled', 'direction', 'thumb-label', 'ticks', 'strict'];

  get start() { return Number(this._attr('start', String(this.min))); }
  get end() { return Number(this._attr('end', String(this.max))); }
  get strict() { return this._bool('strict'); }

  _currentText()  { return `${this.start} – ${this.end}`; }
  _currentValue() { return `${this.start},${this.end}`; }

  _ticksHtml() {
    const ticks = this._visibleTicks();
    if (!ticks.length) return '';
    const marks = ticks
      .map((tick) => `<span class="w-range-slider-tick" style="--pos:${this._pct(tick.value)}%"></span>`)
      .join('');
    return `<span class="w-range-slider-ticks" aria-hidden="true">${marks}</span>`;
  }

  _thumbLabelsHtml() {
    if (!this.thumbLabel) return '';
    return `<span class="w-range-slider-thumb-label" data-thumb="start" style="--pos:${this._pct(this.start)}%">${this.start}</span>`
      + `<span class="w-range-slider-thumb-label" data-thumb="end" style="--pos:${this._pct(this.end)}%">${this.end}</span>`;
  }

  _rootClass() {
    return 'w-field w-range-slider' + this._cls({
      ['w-range-slider--' + this.size]: this.size,
      'w-range-slider--vertical': this.vertical,
      'w-range-slider--reverse': this.reverse,
      'w-range-slider--disabled': this.disabled,
      'w-range-slider--readonly': this.readonly,
      'w-range-slider--strict': this.strict,
      'w-range-slider--thumb-label': this.thumbLabel,
      'w-range-slider--thumb-label-always': this.thumbLabel === 'always',
    }) + this._surfaceCls();
  }

  _thumbAttrs(label, value) {
    return this._attrs({
      'aria-label': label,
      disabled: this.disabled || this.readonly,
      name: this.name ? `${this.name}-${label.toLowerCase()}` : '',
    }) + this._rangeAria(value);
  }

  _controlHtml() {
    const range = `min="${this.min}" max="${this.max}" step="${this._esc(this.step)}"`;
    const vars = this._controlVars([
      `--start:${Math.min(this._pct(this.start), this._pct(this.end))}%`,
      `--end:${Math.max(this._pct(this.start), this._pct(this.end))}%`,
    ]);
    return `<span class="w-range-slider-control" style="${vars}">
        <span class="w-range-slider-track" aria-hidden="true">
          <span class="w-range-slider-fill"></span>
        </span>
        ${this._ticksHtml()}
        <input class="w-range-slider-input" type="range" ${range} value="${this.start}"${this._thumbAttrs('Start', this.start)}>
        <input class="w-range-slider-input" type="range" ${range} value="${this.end}"${this._thumbAttrs('End', this.end)}>
        ${this._thumbLabelsHtml()}
      </span>`;
  }

  _template() {
    return `<label class="${this._rootClass()}">
      ${this.label ? `<span class="w-label">${this._esc(this.label)}</span>` : ''}
      ${this._withSideIcons(this._controlHtml())}
      ${this._detailsHtml()}
    </label>`;
  }

  _events() {
    const inputs = Array.from(this.querySelectorAll('.w-range-slider-input'));
    if (inputs.length < 2) return;
    const [startInput, endInput] = inputs;

    const commit = (type) => this._emit(type, { start: Number(startInput.value), end: Number(endInput.value) });

    startInput.addEventListener('input', (event) => {
      event.stopPropagation();
      if (Number(startInput.value) > Number(endInput.value)) startInput.value = endInput.value;
      this._update(inputs);
      commit('input');
    });
    endInput.addEventListener('input', (event) => {
      event.stopPropagation();
      if (Number(endInput.value) < Number(startInput.value)) endInput.value = startInput.value;
      this._update(inputs);
      commit('input');
    });
    inputs.forEach((input) => input.addEventListener('change', (event) => {
      event.stopPropagation();
      commit('change');
    }));

    this._bindSurface(inputs);
    this._update(inputs);
  }

  _update(inputs) {
    const start = Number(inputs[0].value);
    const end = Number(inputs[1].value);
    const sPct = this._pct(start);
    const ePct = this._pct(end);

    // The fill reads --start / --end off the control; per-orientation geometry
    // lives in CSS, so a single pair of variables drives both directions. The
    // pair is ordered so `reverse` (which mirrors _pct) still spans correctly.
    const control = this._q('.w-range-slider-control');
    if (control) {
      control.style.setProperty('--start', `${Math.min(sPct, ePct)}%`);
      control.style.setProperty('--end', `${Math.max(sPct, ePct)}%`);
    }

    this._updateThumbs(inputs, start, end);
    this._silentSet('start', start);
    this._silentSet('end', end);
    // A hint owns the message row; only the bare value readout tracks the thumbs.
    const msg = this.hint ? null : this._q('.w-messages');
    if (msg) msg.textContent = this._currentText();
    this._syncDetails();
  }

  _updateThumbs(inputs, start, end) {
    const startLabel = this._q('.w-range-slider-thumb-label[data-thumb="start"]');
    const endLabel = this._q('.w-range-slider-thumb-label[data-thumb="end"]');
    if (startLabel) { startLabel.textContent = String(start); startLabel.style.setProperty('--pos', `${this._pct(start)}%`); }
    if (endLabel) { endLabel.textContent = String(end); endLabel.style.setProperty('--pos', `${this._pct(end)}%`); }

    inputs[0].setAttribute('aria-valuenow', String(start));
    inputs[1].setAttribute('aria-valuenow', String(end));

    // Raise whichever thumb sits in the upper half so overlapping thumbs at the
    // far end stay independently grabbable.
    const mid = (this.min + this.max) / 2;
    inputs[0].style.zIndex = start > mid ? '5' : '3';
    inputs[1].style.zIndex = '4';
  }
}

if (!customElements.get('w-range-slider')) customElements.define('w-range-slider', WRangeSlider);
