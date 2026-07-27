/* <w-time-picker-clock> — the dial of a time picker
 * (DuVay equivalent of Vuetify v-time-picker-clock).
 *
 * Renders every value between `min` and `max` around a circle, with a hand
 * pointing at the selection. Fully keyboard operable: arrows step through the
 * allowed values, Home/End jump to the ends.
 *
 * Attributes:
 *   value           - selected number
 *   min / max       - range of numbers on the dial (default 0…59, or 1…12 with `ampm`)
 *   step            - increment between numbers (default 5, or 1 with `ampm`)
 *   ampm            - 12-hour dial: 1…12, unpadded labels
 *   format          - 24hr (default) pads labels to two digits; ampm leaves them bare
 *   double          - split the numbers over two rings (24-hour dials)
 *   rotate          - degrees to rotate the whole dial by
 *   displayed-value - text shown in the middle of the dial
 *   allowed-values  - comma list or JSON array of selectable numbers
 *   scrollable      - the wheel moves through the values
 *   disabled / readonly - no selection
 *
 * Events:
 *   change - { value } a new number was selected
 *   input  - { value } same, fired first
 */
import { wBoolAttr, wNumberAttr, wNumberList } from './utils.js';
import { wPad } from './time-picker.js';

export class WTimePickerClock extends WElement {
  static attrs = ['value', 'min', 'max', 'step', 'ampm', 'format', 'double',
    'rotate', 'displayed-value', 'allowed-values', 'scrollable'];

  get ampm() { return wBoolAttr(this, 'ampm'); }
  get min() { return wNumberAttr(this, 'min', this.ampm ? 1 : 0); }
  get max() { return wNumberAttr(this, 'max', this.ampm ? 12 : 59); }
  get step() { return Math.max(1, wNumberAttr(this, 'step', this.ampm ? 1 : 5)); }
  get double() { return wBoolAttr(this, 'double'); }
  get rotate() { return wNumberAttr(this, 'rotate', 0); }
  get scrollable() { return wBoolAttr(this, 'scrollable'); }
  get displayedValue() { return this._attr('displayed-value', ''); }
  get format() { return this._attr('format', this.ampm ? 'ampm' : '24hr') === 'ampm' ? 'ampm' : '24hr'; }
  get value() { return wNumberAttr(this, 'value', this.min); }
  get locked() { return this.hasAttribute('disabled') || this.hasAttribute('readonly'); }

  get allowedValues() { return wNumberList(this.getAttribute('allowed-values'), []); }

  _allowed(value) {
    const list = this.allowedValues;
    return !list.length || list.includes(value);
  }

  _values() {
    const values = [];
    for (let value = this.min; value <= this.max; value += this.step) values.push(value);
    return values;
  }

  // Numbers per ring — `double` wraps the second half onto an inner ring.
  _perRing(count) {
    return this.double ? Math.ceil(count / 2) : Math.max(1, count);
  }

  _angle(index, perRing) {
    return this.rotate + (index % perRing) * (360 / perRing);
  }

  _label(value) {
    return this.format === '24hr' ? wPad(value) : String(value);
  }

  /* ── template ────────────────────────────────────────────────────────── */

  _itemHtml(value, index, perRing) {
    const angle = this._angle(index, perRing);
    const radians = (angle * Math.PI) / 180;
    const radius = index < perRing ? 42 : 30;
    const selected = value === this.value;
    const allowed = this._allowed(value);
    return `<button type="button" role="option"`
      + ` class="w-time-picker-clock-item${selected ? ' selected' : ''}${allowed ? '' : ' disabled'}"`
      + ` style="left:${(50 + Math.sin(radians) * radius).toFixed(3)}%;top:${(50 - Math.cos(radians) * radius).toFixed(3)}%"`
      + this._attrs({
        'data-clock-value': String(value),
        'aria-selected': String(selected),
        tabindex: selected ? '0' : '-1',
        disabled: this.locked || !allowed,
      })
      + `>${this._esc(this._label(value))}</button>`;
  }

  _handHtml(values, perRing) {
    const index = values.indexOf(this.value);
    if (index < 0) return '';
    const inner = index >= perRing ? ' w-time-picker-hand--inner' : '';
    return `<span class="w-time-picker-hand${inner}" style="--w-time-picker-angle:${this._angle(index, perRing)}deg"></span>`;
  }

  _centerHtml() {
    if (!this.displayedValue) return '';
    return `<span class="w-time-picker-clock-display">${this._esc(this.displayedValue)}</span>`;
  }

  _template() {
    const values = this._values();
    const perRing = this._perRing(values.length);
    const items = values.map((value, index) => this._itemHtml(value, index, perRing)).join('');
    return `<div class="w-time-picker-clock" role="listbox" aria-label="Clock"`
      + `${this.scrollable ? ' data-clock-scrollable' : ''}>`
      + `${items}${this._handHtml(values, perRing)}${this._centerHtml()}<slot></slot></div>`;
  }

  /* ── events ──────────────────────────────────────────────────────────── */

  _events() {
    const dial = this._q('.w-time-picker-clock');
    if (!dial) return;
    this._qAll('[data-clock-value]').forEach((button) => {
      button.addEventListener('click', () => this._select(Number(button.getAttribute('data-clock-value'))));
    });
    dial.addEventListener('keydown', (event) => this._onKeydown(event));
    if (this.scrollable) dial.addEventListener('wheel', (event) => this._onWheel(event));
  }

  _onKeydown(event) {
    const next = this._keyTarget(event.key);
    if (next === null) return;
    event.preventDefault();
    this._select(next);
    this._q('.w-time-picker-clock-item.selected')?.focus();
  }

  // The value a navigation key moves to, or null for keys the dial ignores.
  _keyTarget(key) {
    const forward = key === 'ArrowRight' || key === 'ArrowUp';
    const back = key === 'ArrowLeft' || key === 'ArrowDown';
    if (forward || back) return this._step(forward);
    if (key === 'Home') return this._edge(false);
    if (key === 'End') return this._edge(true);
    return null;
  }

  _edge(last) {
    const allowed = this._values().filter((value) => this._allowed(value));
    if (!allowed.length) return null;
    return last ? allowed[allowed.length - 1] : allowed[0];
  }

  // Next allowed value in `forward` direction, wrapping around the dial.
  _step(forward) {
    const values = this._values();
    const size = values.length;
    const start = values.indexOf(this.value);
    for (let offset = 1; offset <= size; offset += 1) {
      const index = ((start + (forward ? offset : -offset)) % size + size) % size;
      if (this._allowed(values[index])) return values[index];
    }
    return this.value;
  }

  _onWheel(event) {
    if (this.locked) return;
    event.preventDefault();
    this._select(this._step(event.deltaY < 0));
  }

  _select(value) {
    if (this.locked || value === null || !this._allowed(value)) return;
    if (value === this.value) return;
    this._silentSet('value', value);
    this._render();
    this._events();
    this._emit('input', { value });
    this._emit('change', { value });
  }
}

if (!customElements.get('w-time-picker-clock')) {
  customElements.define('w-time-picker-clock', WTimePickerClock);
}
