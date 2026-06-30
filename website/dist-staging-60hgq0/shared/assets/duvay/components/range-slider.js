/* <w-range-slider> — dual-thumb range slider, mirroring Vuetify's
 * <v-range-slider>.
 *
 * Two range inputs share a single track; the selected segment between the
 * thumbs is highlighted. Thumbs cannot cross, and the one near the upper end
 * is raised so overlapping thumbs stay grabbable.
 *
 * Attributes:
 *   min, max     - bounds (default 0 / 100)
 *   start, end   - current range ends (default min / max)
 *   step         - increment (default 1)
 *   label        - field label
 *   disabled     - disable both thumbs
 *   direction    - "horizontal" (default) | "vertical"
 *   thumb-label  - show a value bubble over each thumb on interaction;
 *                  set to "always" to keep it visible
 *   ticks        - draw a tick at every step; set to "always" to keep labels
 *
 * Events:
 *   w-input  - { start, end } while dragging
 *   w-change - { start, end } on commit
 */

export class WRangeSlider extends WElement {
  static attrs = ['min', 'max', 'start', 'end', 'step', 'label', 'disabled', 'direction', 'thumb-label', 'ticks'];
  get min() { return Number(this._attr('min', '0')); }
  get max() { return Number(this._attr('max', '100')); }
  get start() { return Number(this._attr('start', String(this.min))); }
  get end() { return Number(this._attr('end', String(this.max))); }
  get step() { return this._attr('step', '1'); }
  get stepNum() { const s = Number(this.step); return s > 0 ? s : 1; }
  get label() { return this._attr('label', ''); }
  get disabled() { return this._bool('disabled'); }
  get vertical() { return this._attr('direction', '') === 'vertical' || this._bool('vertical'); }
  get thumbLabel() {
    const v = this.getAttribute('thumb-label');
    if (v === null) return false;
    return v === 'always' ? 'always' : true;
  }
  get ticks() {
    const v = this.getAttribute('ticks');
    if (v === null) return false;
    return v === 'always' ? 'always' : true;
  }

  _pct(v) {
    const span = this.max - this.min;
    return span === 0 ? 0 : ((v - this.min) / span) * 100;
  }

  _ticksHtml() {
    if (!this.ticks) return '';
    const span = this.max - this.min;
    const count = Math.floor(span / this.stepNum);
    // Skip when the step would produce no ticks or an unreasonable number.
    if (count < 1 || count > 100) return '';
    let marks = '';
    for (let i = 0; i <= count; i++) {
      marks += `<span class="w-range-slider-tick" style="--pos:${(i * this.stepNum / span) * 100}%"></span>`;
    }
    return `<span class="w-range-slider-ticks" aria-hidden="true">${marks}</span>`;
  }

  _thumbLabelsHtml() {
    if (!this.thumbLabel) return '';
    return `<span class="w-range-slider-thumb-label" data-thumb="start" style="--pos:${this._pct(this.start)}%">${this.start}</span>`
      + `<span class="w-range-slider-thumb-label" data-thumb="end" style="--pos:${this._pct(this.end)}%">${this.end}</span>`;
  }

  _template() {
    const dis = this.disabled ? ' disabled' : '';
    const sPct = this._pct(this.start);
    const ePct = this._pct(this.end);
    const range = `min="${this.min}" max="${this.max}" step="${this._esc(this.step)}"`;

    const cls = [
      'w-field', 'w-range-slider',
      this.vertical ? 'w-range-slider--vertical' : '',
      this.disabled ? 'w-range-slider--disabled' : '',
      this.thumbLabel ? 'w-range-slider--thumb-label' : '',
      this.thumbLabel === 'always' ? 'w-range-slider--thumb-label-always' : '',
    ].filter(Boolean).join(' ');

    return `<label class="${cls}">
      ${this.label ? `<span class="w-label">${this._esc(this.label)}</span>` : ''}
      <span class="w-range-slider-control" style="--start:${sPct}%;--end:${ePct}%">
        <span class="w-range-slider-track" aria-hidden="true">
          <span class="w-range-slider-fill"></span>
        </span>
        ${this._ticksHtml()}
        <input class="w-range-slider-input" type="range" ${range} value="${this.start}" aria-label="Start"${dis}>
        <input class="w-range-slider-input" type="range" ${range} value="${this.end}" aria-label="End"${dis}>
        ${this._thumbLabelsHtml()}
      </span>
      <span class="w-messages">${this.start} – ${this.end}</span>
    </label>`;
  }

  _events() {
    const inputs = Array.from(this.querySelectorAll('.w-range-slider-input'));
    if (inputs.length < 2) return;
    const [startInput, endInput] = inputs;

    const commit = (type) => this._emit(type, { start: Number(startInput.value), end: Number(endInput.value) });

    startInput.addEventListener('input', () => {
      if (Number(startInput.value) > Number(endInput.value)) startInput.value = endInput.value;
      this._update(inputs);
      commit('w-input');
    });
    endInput.addEventListener('input', () => {
      if (Number(endInput.value) < Number(startInput.value)) endInput.value = startInput.value;
      this._update(inputs);
      commit('w-input');
    });
    inputs.forEach((input) => input.addEventListener('change', () => commit('w-change')));

    this._update(inputs);
  }

  _update(inputs) {
    const start = Number(inputs[0].value);
    const end = Number(inputs[1].value);
    const sPct = this._pct(start);
    const ePct = this._pct(end);

    // The fill reads --start / --end off the control; per-orientation geometry
    // lives in CSS, so a single pair of variables drives both directions.
    const control = this._q('.w-range-slider-control');
    if (control) {
      control.style.setProperty('--start', `${sPct}%`);
      control.style.setProperty('--end', `${ePct}%`);
    }

    const startLabel = this._q('.w-range-slider-thumb-label[data-thumb="start"]');
    const endLabel = this._q('.w-range-slider-thumb-label[data-thumb="end"]');
    if (startLabel) { startLabel.textContent = String(start); startLabel.style.setProperty('--pos', `${sPct}%`); }
    if (endLabel) { endLabel.textContent = String(end); endLabel.style.setProperty('--pos', `${ePct}%`); }

    // Raise whichever thumb sits in the upper half so overlapping thumbs at the
    // far end stay independently grabbable.
    const mid = (this.min + this.max) / 2;
    inputs[0].style.zIndex = start > mid ? '5' : '3';
    inputs[1].style.zIndex = '4';

    this._silentSet('start', start);
    this._silentSet('end', end);
    const msg = this._q('.w-messages');
    if (msg) msg.textContent = `${start} – ${end}`;
  }
}

if (!customElements.get('w-range-slider')) customElements.define('w-range-slider', WRangeSlider);
